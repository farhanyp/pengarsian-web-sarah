import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { ClassTeacher } from '@/types/wali-kelas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assignment: ClassTeacher | null;
}

export default function DeleteModal({ isOpen, onClose, assignment }: Props) {
  const { delete: destroy, processing } = useForm();

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    destroy(`/wali-kelas-management/${assignment.id}`, {
      onSuccess: () => {
        toast.success("Penugasan wali kelas berhasil dihapus!");
        onClose();
      },
      onError: () => {
        toast.error("Gagal menghapus penugasan wali kelas.");
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
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Hapus Penugasan
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-3">
            <p className="text-sm text-foreground">
              Apakah Anda yakin ingin menghapus penugasan wali kelas untuk:
            </p>
            <div className="p-4 bg-muted/55 rounded-xl border border-border/50 text-sm space-y-1.5">
              <p><strong>Wali Kelas:</strong> {assignment.teacher?.name || 'N/A'}</p>
              <p><strong>Kelas:</strong> {assignment.class?.name || 'N/A'}</p>
              <p><strong>Tahun Akademik:</strong> {assignment.academic_year}</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Tindakan ini tidak dapat dibatalkan. Data penugasan wali kelas ini akan dihapus secara permanen.
            </p>
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
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm disabled:opacity-70"
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
