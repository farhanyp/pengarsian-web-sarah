import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AcademicYear {
  id: string | number;
  year: string;
  is_active: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  academicYear: AcademicYear | null;
}

export default function EditModal({ isOpen, onClose, academicYear }: Props) {
  const { data, setData, put, processing, errors, reset } = useForm({
    year: '',
    is_active: false,
  });

  useEffect(() => {
    if (academicYear) {
      setData({
        year: academicYear.year,
        is_active: academicYear.is_active,
      });
    }
  }, [academicYear]);

  if (!isOpen || !academicYear) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/tahun-akademik/${academicYear.id}`, {
      onSuccess: () => {
        toast.success("Data tahun akademik berhasil diperbarui!");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Gagal memperbarui data tahun akademik. Periksa kembali form isian.");
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
          <h3 className="text-xl font-bold tracking-tight text-foreground">Edit Tahun Akademik</h3>
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
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Tahun Akademik</label>
              <input
                type="text"
                value={data.year}
                onChange={e => setData('year', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                  errors.year 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                }`}
                placeholder="Contoh: 2025/2026"
                disabled={processing}
                required
              />
              {errors.year && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.year}</p>}
            </div>
            
            <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
              <input
                type="checkbox"
                id="is_active_edit"
                checked={data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                disabled={processing}
              />
              <label htmlFor="is_active_edit" className="text-sm font-medium text-foreground cursor-pointer select-none">
                Jadikan sebagai Tahun Ajaran Aktif
              </label>
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
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
