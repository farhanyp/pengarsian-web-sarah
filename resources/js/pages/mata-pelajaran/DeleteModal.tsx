import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Subject } from '@/types/mata-pelajaran';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export default function DeleteModal({ isOpen, onClose, subject }: Props) {
  const { delete: destroy, processing } = useForm();

  if (!isOpen || !subject) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    destroy(`/mata-pelajaran/${subject.id}`, {
      onSuccess: () => {
        toast.success("Data mata pelajaran berhasil dihapus!");
        onClose();
      },
      onError: () => {
        toast.error("Gagal menghapus data mata pelajaran.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-background w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Hapus Data Mata Pelajaran?
          </h3>
          
          <p className="text-muted-foreground text-sm">
            Anda yakin ingin menghapus mata pelajaran <span className="font-bold text-foreground">{subject.name}</span>? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-0 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-5 py-2.5 text-sm font-semibold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm disabled:opacity-70"
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {processing ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
