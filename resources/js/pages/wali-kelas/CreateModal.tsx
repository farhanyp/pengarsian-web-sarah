import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SchoolClass } from '@/types/kelas';
import { User } from '@/types/auth';

interface AcademicYear {
  id: number;
  year: string;
  is_active: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teachers: User[];
  classes: SchoolClass[];
  academicYears: AcademicYear[];
}

export default function CreateModal({ isOpen, onClose, teachers, classes, academicYears }: Props) {
  const activeYearObj = academicYears.find(y => y.is_active);
  const defaultYear = activeYearObj ? activeYearObj.year : '';

  const { data, setData, post, processing, errors, reset } = useForm({
    class_id: '',
    teacher_id: '',
    academic_year: defaultYear,
  });

  // Reset default year if modal opens or academicYears list changes
  useEffect(() => {
    if (isOpen) {
      setData({
        class_id: '',
        teacher_id: '',
        academic_year: defaultYear,
      });
    }
  }, [isOpen, defaultYear]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/wali-kelas-management', {
      onSuccess: () => {
        toast.success("Penugasan wali kelas berhasil ditambahkan!");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Gagal menambahkan penugasan. Periksa kembali form isian.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-background w-full max-w-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Tambah Penugasan Wali Kelas</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5">
            {/* Wali Kelas Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Wali Kelas</label>
              <select
                value={data.teacher_id}
                onChange={e => setData('teacher_id', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                  errors.teacher_id 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                }`}
                disabled={processing}
                required
              >
                <option value="">Pilih Wali Kelas...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
              {errors.teacher_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.teacher_id}</p>}
            </div>

            {/* Kelas Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Kelas</label>
              <select
                value={data.class_id}
                onChange={e => setData('class_id', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                  errors.class_id 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                }`}
                disabled={processing}
                required
              >
                <option value="">Pilih Kelas...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {errors.class_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.class_id}</p>}
            </div>

            {/* Tahun Akademik Select */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Tahun Akademik</label>
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
                <option value="">Pilih Tahun Akademik...</option>
                {academicYears.map(year => (
                  <option key={year.id} value={year.year}>
                    {year.year} {year.is_active ? '(Aktif)' : ''}
                  </option>
                ))}
              </select>
              {errors.academic_year && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.academic_year}</p>}
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
