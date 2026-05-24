import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SchoolClass {
  id: string | number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schoolClass: SchoolClass | null;
}

export default function EditModal({ isOpen, onClose, schoolClass }: Props) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: '',
  });

  useEffect(() => {
    if (schoolClass) {
      setData({
        name: schoolClass.name,
      });
    }
  }, [schoolClass]);

  if (!isOpen || !schoolClass) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/kelas/${schoolClass.id}`, {
      onSuccess: () => {
        toast.success("Data kelas berhasil diperbarui!");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Gagal memperbarui data kelas. Periksa kembali form isian.");
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
          <h3 className="text-xl font-bold tracking-tight text-foreground">Edit Data Kelas</h3>
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
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama Kelas</label>
              <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                }`}
                placeholder="Contoh: VII-A, VIII-B"
                disabled={processing}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
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
