import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  subjects: Subject[];
}

export default function CreateModal({ isOpen, onClose, students, subjects }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    student_id: '',
    subject_id: '',
    assignment_score: '',
    exam_score: '',
    semester: 'Ganjil',
    academic_year: '2025/2026',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/data-nilai-siswa', {
      onSuccess: () => {
        toast.success("Data nilai berhasil ditambahkan!");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Gagal menambahkan data. Periksa kembali form isian.");
      }
    });
  };

  const studentOptions: Option[] = students.map(s => ({
    id: s.id,
    name: `${s.nis} - ${s.name}`
  }));

  const subjectOptions: Option[] = subjects.map(s => ({
    id: s.id,
    name: s.name
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-background w-full max-w-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Tambah Data Nilai</h3>
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
            
            {/* Student Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Siswa</label>
              <SearchableSelect
                options={studentOptions}
                value={data.student_id}
                onChange={(val) => setData('student_id', val as string)}
                placeholder="Pilih atau cari siswa..."
                error={!!errors.student_id}
              />
              {errors.student_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.student_id}</p>}
            </div>

            {/* Subject Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Mata Pelajaran</label>
              <SearchableSelect
                options={subjectOptions}
                value={data.subject_id}
                onChange={(val) => setData('subject_id', val as string)}
                placeholder="Pilih mata pelajaran..."
                error={!!errors.subject_id}
              />
              {errors.subject_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.subject_id}</p>}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Nilai Tugas</label>
                <input
                  type="number"
                  min="0" max="100" step="0.01"
                  value={data.assignment_score}
                  onChange={e => setData('assignment_score', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                    errors.assignment_score 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  placeholder="0 - 100"
                  disabled={processing}
                />
                {errors.assignment_score && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.assignment_score}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Nilai Ujian</label>
                <input
                  type="number"
                  min="0" max="100" step="0.01"
                  value={data.exam_score}
                  onChange={e => setData('exam_score', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                    errors.exam_score 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  placeholder="0 - 100"
                  disabled={processing}
                />
                {errors.exam_score && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.exam_score}</p>}
              </div>
            </div>

            {/* Period */}
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
                <input
                  type="text"
                  value={data.academic_year}
                  onChange={e => setData('academic_year', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                    errors.academic_year 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                  }`}
                  placeholder="Contoh: 2025/2026"
                  disabled={processing}
                  required
                />
                {errors.academic_year && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.academic_year}</p>}
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-border/50 flex items-center justify-end gap-3 bg-muted/20">
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
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
