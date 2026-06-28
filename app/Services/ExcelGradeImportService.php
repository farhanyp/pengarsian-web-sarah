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
    public function import(string $filePath, string $semester, string $academicYear, string $createdBy): void
    {
        // 1. Load Excel file
        try {
            $spreadsheet = IOFactory::load($filePath);
        } catch (Exception $e) {
            throw new Exception("Gagal membaca file Excel. Pastikan format file sesuai (.xlsx / .xls). Detail: " . $e->getMessage());
        }

        // Cache grade categories for faster lookup
        $categoriesMap = GradeCategory::all()->pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [strtolower(trim($name)) => $id];
        })->toArray();

        // 2. Iterate through each sheet
        foreach ($spreadsheet->getWorksheetIterator() as $sheet) {
            $sheetTitle = $sheet->getTitle();
            
            // Skip dummy sheet if exists
            if ($sheetTitle === 'No Data') continue;

            $highestRow = $sheet->getHighestRow();

            // Extract student ID from A3
            $studentIdCell = trim($sheet->getCell('A3')->getValue() ?? '');
            if (strpos($studentIdCell, 'ID Siswa:') === false) {
                throw new Exception("Format metadata ID Siswa pada baris 3 tidak valid di sheet '{$sheetTitle}'.");
            }
            $studentId = trim(str_replace('ID Siswa:', '', $studentIdCell));

            if ($studentId === '') {
                throw new Exception("ID Siswa kosong pada sheet '{$sheetTitle}'.");
            }

            // Validate Student existence in database
            $student = Student::find($studentId);
            if (!$student) {
                throw new Exception("Siswa dengan ID '{$studentId}' pada sheet '{$sheetTitle}' tidak terdaftar di database.");
            }

            // 3. Validate Row 6 (Sub-Headers)
            // Expected columns: A: ID Mapel, B: Mata Pelajaran, C: Kategori, D: Nama / Judul, E: Nilai
            $expectedHeaders = [
                1 => 'ID Mapel',
                2 => 'Mata Pelajaran',
                3 => 'Kategori',
                4 => 'Nama / Judul',
                5 => 'Nilai'
            ];

            foreach ($expectedHeaders as $colIndex => $expectedVal) {
                $actualVal = trim($sheet->getCell([$colIndex, 6])->getValue() ?? '');
                
                // Allow slight variations for "Nama / Judul"
                if ($colIndex === 4) {
                    $isValid = strcasecmp($actualVal, 'Nama / Judul') === 0 || 
                               strcasecmp($actualVal, 'Nama/Judul') === 0 || 
                               strcasecmp($actualVal, 'Judul Penilaian') === 0 ||
                               strcasecmp($actualVal, 'Judul') === 0;
                } else {
                    $isValid = strcasecmp($actualVal, $expectedVal) === 0;
                }

                if (!$isValid) {
                    $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                    throw new Exception("Format header kolom {$colLetter} di Baris 6 salah pada sheet '{$sheetTitle}'. Diharapkan: '{$expectedVal}', aktual: '{$actualVal}'.");
                }
            }

            // 4. Loop through subject rows (Row 7 to last row)
            for ($row = 7; $row <= $highestRow; $row++) {
                // Get cell values for the grade details on this row
                $subjectId = trim($sheet->getCell([1, $row])->getValue() ?? '');
                $kategoriText = trim($sheet->getCell([3, $row])->getValue() ?? '');
                $judulPenilaian = trim($sheet->getCell([4, $row])->getValue() ?? '');
                $nilaiRaw = $sheet->getCell([5, $row])->getValue();
                
                $hasSubject = ($subjectId !== '');
                $hasKategori = ($kategoriText !== '');
                $hasJudul = ($judulPenilaian !== '');
                $hasNilai = ($nilaiRaw !== null && trim($nilaiRaw) !== '');

                // Verify if the entire row (A to E) is empty. If yes, skip it.
                if (!$hasSubject && !$hasKategori && !$hasJudul && !$hasNilai) {
                    continue;
                }

                if (!$hasSubject) {
                    throw new Exception("ID Mapel kosong pada baris {$row} di sheet '{$sheetTitle}'.");
                }

                // Case: Partially filled -> Rollback and throw error
                if (!$hasKategori || !$hasJudul || !$hasNilai) {
                    throw new Exception("Data penilaian siswa [{$student->name}] tidak lengkap pada baris {$row} di sheet '{$sheetTitle}'.");
                }

                // Convert score to float
                $nilaiAngka = (float)$nilaiRaw;
                if ($nilaiAngka < 0 || $nilaiAngka > 100) {
                    throw new Exception("Nilai untuk siswa [{$student->name}] pada baris {$row} di sheet '{$sheetTitle}' harus berada di antara 0 dan 100. Input: {$nilaiRaw}.");
                }

                // Look up Grade Category ID
                $key = strtolower(trim($kategoriText));
                if (!isset($categoriesMap[$key])) {
                    throw new Exception("Kategori nilai '{$kategoriText}' pada baris {$row} di sheet '{$sheetTitle}' tidak terdaftar di database.");
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
}
