<?php

namespace App\Services;

use App\Models\Student;
use App\Models\SchoolClass;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use Exception;

class ExcelStudentImportService
{
    /**
     * Parse and import students from an Excel file.
     *
     * @param string $filePath Path to the uploaded Excel file.
     * @throws Exception
     */
    public function import(string $filePath): void
    {
        try {
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
        } catch (Exception $e) {
            throw new Exception("Gagal membaca file Excel. Pastikan format file sesuai (.xlsx / .xls). Detail: " . $e->getMessage());
        }

        $highestRow = $sheet->getHighestRow();

        $expectedHeaders = [
            1 => 'NIS',
            2 => 'NISN',
            3 => 'Nama Lengkap',
            4 => 'Jenis Kelamin',
            5 => 'Nama Kelas',
            6 => 'Tahun Ajaran'
        ];

        foreach ($expectedHeaders as $colIndex => $expectedVal) {
            $actualVal = trim($sheet->getCell([$colIndex, 6])->getValue() ?? '');
            
            if (strcasecmp($actualVal, $expectedVal) !== 0) {
                $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                throw new Exception("Format header kolom {$colLetter} di Baris 6 salah. Diharapkan: '{$expectedVal}', aktual: '{$actualVal}'.");
            }
        }

        $classesMap = SchoolClass::all()->pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [strtolower(trim($name)) => $id];
        })->toArray();

        $existingNis = Student::pluck('nis')->toArray();
        $existingNisn = Student::pluck('nisn')->toArray();

        // Arrays to track uniqueness within the Excel file
        $fileNis = [];
        $fileNisn = [];

        for ($row = 7; $row <= $highestRow; $row++) {
            $nis = trim($sheet->getCell([1, $row])->getValue() ?? '');
            $nisn = trim($sheet->getCell([2, $row])->getValue() ?? '');
            $nama = trim($sheet->getCell([3, $row])->getValue() ?? '');
            $jenisKelaminText = strtoupper(trim($sheet->getCell([4, $row])->getValue() ?? ''));
            $namaKelasText = trim($sheet->getCell([5, $row])->getValue() ?? '');
            $tahunAjaran = trim($sheet->getCell([6, $row])->getValue() ?? '');

            // Skip empty rows
            if ($nis === '' && $nisn === '' && $nama === '' && $jenisKelaminText === '' && $namaKelasText === '' && $tahunAjaran === '') {
                continue;
            }

            // Incomplete data check
            if ($nis === '' || $nisn === '' || $nama === '' || $jenisKelaminText === '' || $namaKelasText === '' || $tahunAjaran === '') {
                throw new Exception("Data siswa tidak lengkap pada baris ke-{$row}. Pastikan NIS, NISN, Nama, Jenis Kelamin, Kelas, dan Tahun Ajaran terisi.");
            }

            if (!in_array($jenisKelaminText, ['PRIA', 'WANITA'])) {
                throw new Exception("Baris ke-{$row}: Jenis Kelamin '{$jenisKelaminText}' tidak valid. Harus PRIA atau WANITA.");
            }

            $kelasKey = strtolower($namaKelasText);
            if (!isset($classesMap[$kelasKey])) {
                throw new Exception("Baris ke-{$row}: Nama Kelas '{$namaKelasText}' tidak ditemukan di sistem.");
            }
            $classId = $classesMap[$kelasKey];

            if (in_array($nis, $existingNis)) {
                throw new Exception("Baris ke-{$row}: NIS '{$nis}' sudah terdaftar di sistem.");
            }
            if (in_array($nisn, $existingNisn)) {
                throw new Exception("Baris ke-{$row}: NISN '{$nisn}' sudah terdaftar di sistem.");
            }

            if (in_array($nis, $fileNis)) {
                throw new Exception("Baris ke-{$row}: NIS '{$nis}' duplikat dalam file Excel.");
            }
            if (in_array($nisn, $fileNisn)) {
                throw new Exception("Baris ke-{$row}: NISN '{$nisn}' duplikat dalam file Excel.");
            }

            $fileNis[] = $nis;
            $fileNisn[] = $nisn;

            $student = Student::create([
                'nis' => $nis,
                'nisn' => $nisn,
                'name' => $nama,
                'jenis_kelamin' => $jenisKelaminText,
            ]);

            $student->classes()->attach($classId, [
                'academic_year' => $tahunAjaran
            ]);
        }
    }
}
