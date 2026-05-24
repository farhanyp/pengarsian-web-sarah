import { useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState, useEffect } from 'react';
import { X, Loader2, FileSpreadsheet, Upload, AlertCircle, CheckCircle, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import SearchableSelect, { Option } from '@/components/SearchableSelect';

interface Student {
  id: string;
  nis: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface AcademicYearOption {
  id: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  students: Student[];
  availableAcademicYears: AcademicYearOption[];
}

export default function ImportModal({ isOpen, onClose, subjects, students, availableAcademicYears }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    subject_id: '',
    semester: 'Ganjil',
    academic_year: availableAcademicYears[0]?.id || '2025/2026',
    file: null as File | null,
  });

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedStudentIds(students.map(s => s.id));
      setSearchStudentQuery('');
    }
  }, [isOpen, students]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchStudentQuery.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allFilteredIds = filteredStudents.map(s => s.id);
    const areAllFilteredSelected = allFilteredIds.every(id => selectedStudentIds.includes(id));
    
    if (areAllFilteredSelected) {
      setSelectedStudentIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedStudentIds(prev => {
        const newSelection = [...prev];
        allFilteredIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleDownloadTemplate = () => {
    if (!data.subject_id) {
      toast.error("Harap pilih mata pelajaran terlebih dahulu untuk mengunduh template spesifik.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Harap pilih minimal 1 siswa untuk dimasukkan ke dalam template.");
      return;
    }
    const studentIdsParam = selectedStudentIds.join(',');
    const url = `/data-nilai-siswa/template?subject_id=${data.subject_id}&semester=${data.semester}&academic_year=${data.academic_year}&student_ids=${studentIdsParam}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!data.file) {
      toast.error("Harap pilih file Excel terlebih dahulu.");
      return;
    }

    post('/data-nilai-siswa/import', {
      onSuccess: () => {
        toast.success("Batch data nilai berhasil diimpor!");
        reset();
        onClose();
      },
      onError: (err) => {
        if (err.file) {
          toast.error("Gagal mengimpor file. Periksa log detail kesalahan.");
        } else {
          toast.error("Gagal mengimpor data. Periksa kembali form isian.");
        }
      }
    });
  };

  const subjectOptions: Option[] = subjects.map(s => ({
    id: s.id,
    name: s.name
  }));

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        setData('file', droppedFile);
      } else {
        toast.error("Format file tidak didukung. Gunakan .xlsx atau .xls");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('file', e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setData('file', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-background w-full max-w-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
              Import Nilai Dinamis
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Unggah berkas rekap nilai format matriks horizontal Excel.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Subject Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Mata Pelajaran</label>
              <SearchableSelect
                options={subjectOptions}
                value={data.subject_id}
                onChange={(val) => setData('subject_id', val as string)}
                placeholder="Pilih mata pelajaran untuk diimpor..."
                error={!!errors.subject_id}
              />
              {errors.subject_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.subject_id}</p>}
            </div>

            {/* Semester & Academic Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Semester</label>
                <select
                  value={data.semester}
                  onChange={e => setData('semester', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                    errors.semester 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  disabled={processing}
                  required
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
                {errors.semester && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.semester}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Tahun Ajaran</label>
                <select
                  value={data.academic_year}
                  onChange={e => setData('academic_year', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                    errors.academic_year 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  disabled={processing}
                  required
                >
                  {availableAcademicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>{ay.name}</option>
                  ))}
                </select>
                {errors.academic_year && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.academic_year}</p>}
              </div>
            </div>

            {/* Student Checkbox List */}
            <div className="space-y-2 border-t border-border/30 pt-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-foreground">Daftar Siswa untuk Template ({selectedStudentIds.length} terpilih)</label>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  {filteredStudents.every(s => selectedStudentIds.includes(s.id)) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Search Bar for Students */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={searchStudentQuery}
                  onChange={e => setSearchStudentQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground text-xs focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                />
              </div>

              {/* Scrollable Checkbox Container */}
              <div className="max-h-40 overflow-y-auto border border-border/50 rounded-xl p-3 bg-muted/10 space-y-1 divide-y divide-border/30">
                {filteredStudents.map(student => {
                  const isChecked = selectedStudentIds.includes(student.id);
                  return (
                    <label 
                      key={student.id} 
                      className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStudent(student.id)}
                        className="rounded border-border/70 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{student.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">NIS: {student.nis}</span>
                      </div>
                    </label>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Siswa tidak ditemukan.</p>
                )}
              </div>
            </div>

            {/* Dropzone File Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Berkas Excel (.xlsx / .xls)</label>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="hidden"
              />

              {!data.file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-500/5' 
                      : 'border-border hover:border-indigo-500/50 hover:bg-muted/30'
                  }`}
                >
                  <Upload className="w-10 h-10 text-muted-foreground mb-3 animate-pulse" />
                  <p className="text-sm font-bold text-foreground">Klik untuk unggah atau seret file ke sini</p>
                  <p className="text-xs text-muted-foreground mt-1">Hanya mendukung Excel (XLSX, XLS)</p>
                </div>
              ) : (
                <div className="border border-border/70 rounded-xl p-4 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div className="max-w-[320px]">
                      <p className="text-sm font-semibold text-foreground truncate">{data.file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{(data.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {errors.file && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight">{errors.file}</span>
                </div>
              )}
            </div>

            {/* Template format information */}
            <div className="p-4 bg-muted/40 border border-border/50 rounded-2xl text-xs space-y-2">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-indigo-500" />
                Ketentuan Format Excel Vertikal:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Baris 1-5 berisi deskripsi/metadata.</li>
                <li>Baris 6 wajib berupa <strong>Sub-Header</strong> kolom tepat 6 kolom:
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> ID Siswa (A)</span>, 
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> NIS (B)</span>, 
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Nama Siswa (C)</span>, 
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Kategori (D)</span>, 
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Nama / Judul (E)</span>, dan 
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> Nilai (F)</span>.
                </li>
                <li>Baris 7 dan seterusnya adalah data nilai siswa ke bawah (vertikal).</li>
                <li>Setiap baris mewakili 1 entri nilai siswa. Guru dapat menduplikasi baris siswa ke bawah untuk menambah kategori penilaian yang berbeda.</li>
              </ul>
            </div>

          </div>

          <div className="p-6 border-t border-border/50 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 border border-emerald-600/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98] text-sm font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Unduh Template
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm disabled:opacity-70"
              >
                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                {processing ? 'Memproses...' : 'Impor Data'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
