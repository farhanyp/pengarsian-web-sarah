<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\Subject;
use App\Models\GradeCategory;
use App\Models\AcademicYear;
use App\Models\StudentGrade;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class ExcelGradeImportTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Student $student;
    protected Subject $subject;
    protected AcademicYear $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user and assign role (we can bypass role checking or mock it)
        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        // Seed basic academic year, subject, student, and grade categories
        $this->academicYear = AcademicYear::create([
            'year' => '2025/2026',
            'is_active' => true
        ]);

        $this->student = Student::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'nis' => '12345',
            'nisn' => '0012345678',
            'name' => 'John Doe'
        ]);

        $this->subject = Subject::create([
            'name' => 'Matematika'
        ]);

        GradeCategory::create(['name' => 'Tugas', 'default_weight' => 0.20]);
        GradeCategory::create(['name' => 'Kuis', 'default_weight' => 0.15]);
        GradeCategory::create(['name' => 'UTS', 'default_weight' => 0.30]);
    }

    /**
     * Create a temporary Excel file with given rows and return the path.
     */
    private function createExcelFile(array $rows): string
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        foreach ($rows as $rowIndex => $cols) {
            foreach ($cols as $colIndex => $value) {
                // 1-indexed for both columns and rows in PhpSpreadsheet cell method
                $sheet->setCellValue([$colIndex + 1, $rowIndex + 1], $value);
            }
        }

        $tempPath = tempnam(sys_get_temp_dir(), 'test_excel_') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempPath);

        return $tempPath;
    }

    public function test_successful_batch_import_with_valid_excel()
    {
        $excelData = [
            ['SIAKAD SD HARAPAN'], // Row 1 (Metadata)
            ['Mata Pelajaran: Matematika'], // Row 2
            ['Semester: Ganjil'], // Row 3
            ['Tahun Ajaran: 2025/2026'], // Row 4
            [''], // Row 5
            ['ID Siswa', 'NIS', 'Nama Siswa', 'Kategori', 'Nama / Judul', 'Nilai', 'Kategori', 'Nama / Judul', 'Nilai'], // Row 6 (Sub-Headers)
            [$this->student->id, '12345', 'John Doe', 'Tugas', 'Tugas Aljabar 1', 85.5, 'Kuis', 'Kuis Aljabar 1', 90.0] // Row 7 (Student Data)
        ];

        $filePath = $this->createExcelFile($excelData);

        $uploadedFile = new UploadedFile(
            $filePath,
            'import.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true
        );

        $response = $this->post(route('data-nilai-siswa.import'), [
            'file' => $uploadedFile,
            'subject_id' => $this->subject->id,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('success', 'Batch data nilai siswa berhasil diimpor!');

        // Assert data is inserted
        $this->assertDatabaseCount('student_grades', 2);

        $this->assertDatabaseHas('student_grades', [
            'student_id' => $this->student->id,
            'subject_id' => $this->subject->id,
            'title' => 'Tugas Aljabar 1',
            'score' => 85.5,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        $this->assertDatabaseHas('student_grades', [
            'student_id' => $this->student->id,
            'subject_id' => $this->subject->id,
            'title' => 'Kuis Aljabar 1',
            'score' => 90.0,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        @unlink($filePath);
    }

    public function test_fails_when_subheaders_pattern_is_broken()
    {
        $excelData = [
            ['Metadata 1'], ['Metadata 2'], ['Metadata 3'], ['Metadata 4'], [''],
            // Broken: Column F (index 5) is "Bobot" instead of "Nilai"
            ['ID Siswa', 'NIS', 'Nama Siswa', 'Kategori', 'Nama / Judul', 'Bobot', 'Kategori', 'Nama / Judul', 'Nilai'],
            [$this->student->id, '12345', 'John Doe', 'Tugas', 'Tugas 1', 85, 'Kuis', 'Kuis 1', 90]
        ];

        $filePath = $this->createExcelFile($excelData);
        $uploadedFile = new UploadedFile($filePath, 'import.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->post(route('data-nilai-siswa.import'), [
            'file' => $uploadedFile,
            'subject_id' => $this->subject->id,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        $response->assertSessionHasErrors('file');
        
        // Assert rollback occurred: no student_grades created
        $this->assertDatabaseCount('student_grades', 0);

        @unlink($filePath);
    }

    public function test_fails_and_rolls_back_when_data_is_partially_filled()
    {
        $excelData = [
            ['Metadata 1'], ['Metadata 2'], ['Metadata 3'], ['Metadata 4'], [''],
            ['ID Siswa', 'NIS', 'Nama Siswa', 'Kategori', 'Nama / Judul', 'Nilai', 'Kategori', 'Nama / Judul', 'Nilai'],
            // Column 6 (Nilai for second grade block) is empty, which makes it incomplete
            [$this->student->id, '12345', 'John Doe', 'Tugas', 'Tugas 1', 80, 'Kuis', 'Kuis 1', '']
        ];

        $filePath = $this->createExcelFile($excelData);
        $uploadedFile = new UploadedFile($filePath, 'import.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->post(route('data-nilai-siswa.import'), [
            'file' => $uploadedFile,
            'subject_id' => $this->subject->id,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        $response->assertSessionHasErrors('file');
        
        // Check that because of partial fill, the entire transaction rolled back and no grades were written at all
        $this->assertDatabaseCount('student_grades', 0);

        @unlink($filePath);
    }

    public function test_fails_when_grade_category_is_unregistered()
    {
        $excelData = [
            ['Metadata 1'], ['Metadata 2'], ['Metadata 3'], ['Metadata 4'], [''],
            ['ID Siswa', 'NIS', 'Nama Siswa', 'Kategori', 'Nama / Judul', 'Nilai'],
            // "Praktikum" is not in our grade_categories table
            [$this->student->id, '12345', 'John Doe', 'Praktikum', 'Tugas Praktikum', 90]
        ];

        $filePath = $this->createExcelFile($excelData);
        $uploadedFile = new UploadedFile($filePath, 'import.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->post(route('data-nilai-siswa.import'), [
            'file' => $uploadedFile,
            'subject_id' => $this->subject->id,
            'semester' => 'Ganjil',
            'academic_year' => '2025/2026',
        ]);

        $response->assertSessionHasErrors('file');
        $this->assertDatabaseCount('student_grades', 0);

        @unlink($filePath);
    }
}
