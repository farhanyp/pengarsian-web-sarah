<?php

namespace App\Services;

use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\GradeCategory;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use Illuminate\Support\Facades\DB;
use Exception;

class ExcelGradeImportService
{
    /**
     * Parse and import grades from a vertically structured Excel file.
     *
     * @param string $filePath Path to the uploaded Excel file.
     * @param int|string $subjectId Subject ID for the grades.
     * @param string $semester Semester (e.g., Ganjil / Genap).
     * @param string $academicYear Academic Year (e.g., 2025/2026).
     * @param string $createdBy UUID of the user who uploads.
     * @throws Exception
     */
    public function import(string $filePath, $subjectId, string $semester, string $academicYear, string $createdBy): void
    {
        // 1. Load Excel file
        try {
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
        } catch (Exception $e) {
            throw new Exception("Gagal membaca file Excel. Pastikan format file sesuai (.xlsx / .xls). Detail: " . $e->getMessage());
        }

        $highestRow = $sheet->getHighestRow();

        // 2. Validate Row 6 (Sub-Headers)
        // Expected columns: A: ID Siswa, B: NIS, C: Nama Siswa, D: Kategori, E: Nama / Judul, F: Nilai
        $expectedHeaders = [
            1 => 'ID Siswa',
            2 => 'NIS',
            3 => 'Nama Siswa',
            4 => 'Kategori',
            5 => 'Nama / Judul',
            6 => 'Nilai'
        ];

        foreach ($expectedHeaders as $colIndex => $expectedVal) {
            $actualVal = trim($sheet->getCell([$colIndex, 6])->getValue() ?? '');
            
            // Allow slight variations for "Nama / Judul"
            if ($colIndex === 5) {
                $isValid = strcasecmp($actualVal, 'Nama / Judul') === 0 || 
                           strcasecmp($actualVal, 'Nama/Judul') === 0 || 
                           strcasecmp($actualVal, 'Judul Penilaian') === 0 ||
                           strcasecmp($actualVal, 'Judul') === 0;
            } else {
                $isValid = strcasecmp($actualVal, $expectedVal) === 0;
            }

            if (!$isValid) {
                $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                throw new Exception("Format header kolom {$colLetter} di Baris 6 salah. Diharapkan: '{$expectedVal}', aktual: '{$actualVal}'.");
            }
        }

        // Cache grade categories for faster lookup
        $categoriesMap = GradeCategory::all()->pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [strtolower(trim($name)) => $id];
        })->toArray();

        // 3. Loop through student rows (Row 7 to last row)
        for ($row = 7; $row <= $highestRow; $row++) {
            $studentId = trim($sheet->getCell([1, $row])->getValue() ?? '');

            // Get cell values for the grade details on this row
            $kategoriText = trim($sheet->getCell([4, $row])->getValue() ?? '');
            $judulPenilaian = trim($sheet->getCell([5, $row])->getValue() ?? '');
            $nilaiRaw = $sheet->getCell([6, $row])->getValue();
            
            $hasKategori = ($kategoriText !== '');
            $hasJudul = ($judulPenilaian !== '');
            $hasNilai = ($nilaiRaw !== null && trim($nilaiRaw) !== '');

            // Check if student_id is empty
            if ($studentId === '') {
                // Verify if the entire row (A to F) is empty. If yes, skip it.
                $rowEmpty = true;
                for ($c = 1; $c <= 6; $c++) {
                    if (trim($sheet->getCell([$c, $row])->getValue() ?? '') !== '') {
                        $rowEmpty = false;
                        break;
                    }
                }
                if ($rowEmpty) {
                    continue;
                }
                throw new Exception("ID Siswa kosong pada baris {$row}.");
            }

            // Validate Student existence in database
            $student = Student::find($studentId);
            if (!$student) {
                throw new Exception("Siswa dengan ID '{$studentId}' pada baris {$row} tidak terdaftar di database.");
            }

            // Case: Kategori, Judul, and Nilai are all empty -> skip/ignore this row
            if (!$hasKategori && !$hasJudul && !$hasNilai) {
                continue;
            }

            // Case: Partially filled -> Rollback and throw error
            if (!$hasKategori || !$hasJudul || !$hasNilai) {
                throw new Exception("Data penilaian siswa [{$student->name}] tidak lengkap pada baris {$row}.");
            }

            // Convert score to float
            $nilaiAngka = (float)$nilaiRaw;
            if ($nilaiAngka < 0 || $nilaiAngka > 100) {
                throw new Exception("Nilai untuk siswa [{$student->name}] pada baris {$row} harus berada di antara 0 dan 100. Input: {$nilaiRaw}.");
            }

            // Look up Grade Category ID
            $key = strtolower(trim($kategoriText));
            if (!isset($categoriesMap[$key])) {
                throw new Exception("Kategori nilai '{$kategoriText}' pada baris {$row} tidak terdaftar di database.");
            }
            $categoryId = $categoriesMap[$key];

            // 5. Insert grade row into database
            StudentGrade::create([
                'student_id' => $student->id,
                'subject_id' => $subjectId,
                'grade_category_id' => $categoryId,
                'title' => $judulPenilaian,
                'score' => $nilaiAngka,
                'semester' => $semester,
                'academic_year' => $academicYear,
                'created_by' => $createdBy
            ]);
        }
    }
}
