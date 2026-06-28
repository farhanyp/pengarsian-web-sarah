import { useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState, useEffect } from 'react';
import { X, Loader2, FileSpreadsheet, Upload, AlertCircle, CheckCircle, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Subject, AcademicYearOption } from '@/types/nilai-siswa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  classes: { id: number; name: string }[];
  availableAcademicYears: AcademicYearOption[];
}

export default function ImportModal({ isOpen, onClose, subjects, classes, availableAcademicYears }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    semester: 'Ganjil',
    academic_year: availableAcademicYears[0]?.id || '2025/2026',
    file: null as File | null,
  });

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [searchSubjectQuery, setSearchSubjectQuery] = useState('');

  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [searchClassQuery, setSearchClassQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedSubjectIds(subjects.map(s => s.id));
      setSelectedClassIds(classes.map(c => c.id));
      setSearchSubjectQuery('');
      setSearchClassQuery('');
    }
  }, [isOpen, subjects, classes]);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchSubjectQuery.toLowerCase())
  );

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchClassQuery.toLowerCase())
  );

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllSubjects = () => {
    const allFilteredIds = filteredSubjects.map(s => s.id);
    const areAllFilteredSelected = allFilteredIds.every(id => selectedSubjectIds.includes(id));
    
    if (areAllFilteredSelected) {
      setSelectedSubjectIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedSubjectIds(prev => {
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

  const toggleClass = (id: number) => {
    setSelectedClassIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllClasses = () => {
    const allFilteredIds = filteredClasses.map(c => c.id);
    const areAllFilteredSelected = allFilteredIds.every(id => selectedClassIds.includes(id));
    
    if (areAllFilteredSelected) {
      setSelectedClassIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedClassIds(prev => {
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
    if (selectedSubjectIds.length === 0) {
      toast.error("Harap pilih minimal 1 mata pelajaran untuk diunduh.");
      return;
    }
    if (selectedClassIds.length === 0) {
      toast.error("Harap pilih minimal 1 kelas untuk dimasukkan ke dalam template.");
      return;
    }
    const subjectIdsParam = selectedSubjectIds.join(',');
    const classIdsParam = selectedClassIds.join(',');
    const url = `/data-nilai-siswa/template?semester=${data.semester}&academic_year=${data.academic_year}&subject_ids=${subjectIdsParam}&class_ids=${classIdsParam}`;
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
      <div className="relative bg-background w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
              Import Nilai Dinamis (Multi Mata Pelajaran)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Satu file Excel untuk banyak siswa dan banyak mata pelajaran.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Classes Checkbox List */}
              <div className="space-y-2 border border-border/30 rounded-xl p-3 bg-muted/5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-foreground">Pilih Kelas ({selectedClassIds.length} terpilih)</label>
                  <button
                    type="button"
                    onClick={toggleSelectAllClasses}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    {filteredClasses.every(c => selectedClassIds.includes(c.id)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari kelas..."
                    value={searchClassQuery}
                    onChange={e => setSearchClassQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-background hover:bg-muted/50 border border-border/50 rounded-lg text-foreground text-xs focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>

                <div className="max-h-32 overflow-y-auto border border-border/50 rounded-lg p-2 bg-muted/10 space-y-1 divide-y divide-border/30">
                  {filteredClasses.map(cls => (
                    <label key={cls.id} className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedClassIds.includes(cls.id)}
                        onChange={() => toggleClass(cls.id)}
                        className="rounded border-border/70 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-foreground">{cls.name}</span>
                    </label>
                  ))}
                  {filteredClasses.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Kelas tidak ditemukan.</p>}
                </div>
              </div>

              {/* Subjects Checkbox List */}
              <div className="space-y-2 border border-border/30 rounded-xl p-3 bg-muted/5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-foreground">Mata Pelajaran ({selectedSubjectIds.length} terpilih)</label>
                  <button
                    type="button"
                    onClick={toggleSelectAllSubjects}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    {filteredSubjects.every(s => selectedSubjectIds.includes(s.id)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari mapel..."
                    value={searchSubjectQuery}
                    onChange={e => setSearchSubjectQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-background hover:bg-muted/50 border border-border/50 rounded-lg text-foreground text-xs focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>

                <div className="max-h-32 overflow-y-auto border border-border/50 rounded-lg p-2 bg-muted/10 space-y-1 divide-y divide-border/30">
                  {filteredSubjects.map(subject => (
                    <label key={subject.id} className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedSubjectIds.includes(subject.id)}
                        onChange={() => toggleSubject(subject.id)}
                        className="rounded border-border/70 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-foreground">{subject.name}</span>
                    </label>
                  ))}
                  {filteredSubjects.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Mapel tidak ditemukan.</p>}
                </div>
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
                Ketentuan Format Excel Baru (Multi Sheet):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Satu file berisi <strong>banyak sheet (worksheet)</strong>. 1 Sheet = 1 Siswa.</li>
                <li>Baris 1-5 berisi deskripsi/metadata (<strong>Jangan ubah ID Siswa di baris 3!</strong>).</li>
                <li>Baris 6 adalah Sub-Header: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">ID Mapel (A)</span>, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Mata Pelajaran (B)</span>, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Kategori (C)</span>, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Nama / Judul (D)</span>, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Nilai (E)</span>.</li>
                <li>Setiap baris di bawahnya (mulai baris 7) adalah data nilai siswa untuk mapel tersebut.</li>
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
