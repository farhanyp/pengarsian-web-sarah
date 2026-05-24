import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, ShieldAlert, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { UserData } from '@/types/users-management';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const ROLES = [
  { value: 'SUPERADMIN', label: 'Super Administrator', icon: ShieldAlert, color: 'text-red-500' },
  { value: 'ADMIN', label: 'Administrator', icon: ShieldCheck, color: 'text-orange-500' },
  { value: 'GURU', label: 'Guru', icon: UserIcon, color: 'text-blue-500' },
  { value: 'KEPALA_SEKOLAH', label: 'Kepala Sekolah', icon: UserIcon, color: 'text-green-500' }
];

export default function EditRoleModal({ isOpen, onClose, user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, put, reset, errors, clearErrors } = useForm({
    role: '',
  });

  useEffect(() => {
    if (user && isOpen) {
      setData('role', user.role);
    } else {
      reset();
      clearErrors();
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    put(`/users/${user.id}/role`, {
      onSuccess: () => {
        setIsSubmitting(false);
        onClose();
      },
      onError: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden m-4 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            Ubah Role Pengguna
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">

            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Role Akses</label>
              <Select
                value={data.role}
                onValueChange={(value) => setData('role', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`w-full ${errors.role ? 'border-red-500 focus:ring-red-500/20' : ''}`}>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${role.color}`} />
                          <span className="font-medium">{role.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 font-medium mt-1">{errors.role}</p>
              )}
            </div>

            {/* Warning text */}
            <p className="text-xs text-muted-foreground bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 p-3 rounded-lg border border-yellow-500/20 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Mengubah role akan memberikan atau mencabut hak akses pengguna ke fitur tertentu. Pastikan Anda telah memverifikasi identitas pengguna ini.
              </span>
            </p>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-background hover:bg-muted text-foreground text-sm font-semibold rounded-xl border border-border/50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || data.role === user.role}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
