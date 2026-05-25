import { useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';
import { X, Loader2, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportSiswaModal({ isOpen, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    file: null as File | null,
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('file', e.target.files[0]);
      clearErrors('file');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!data.file) {
      toast.error('Pilih file Excel terlebih dahulu.');
      return;
    }

    post('/data-siswa/import', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Data siswa berhasil diimport!');
        reset();
        onClose();
      },
      onError: (err) => {
        toast.error(err.file || 'Gagal mengimport data. Periksa kembali file Anda.');
      }
    });
  };

  const handleDownloadTemplate = () => {
    window.location.href = '/data-siswa/template';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-background w-full max-w-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.30)] overflow-hidden flex flex-col border border-border/50 animate-in fade-in zoom-in duration-200 m-4">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">Import Data Siswa</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Download Template */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs">1</span>
              Unduh Template
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Gunakan template Excel yang disediakan untuk memastikan format data sesuai dengan sistem. Kolom Jenis Kelamin dan Nama Kelas sudah dilengkapi dengan dropdown.
            </p>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Download Template Excel
            </button>
          </div>

          {/* Step 2: Upload File */}
          <div className="bg-muted/30 border border-border/50 rounded-xl p-5">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-600 text-white text-xs">2</span>
              Unggah File
            </h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl transition-all ${
                    data.file 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : errors.file
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-border hover:border-indigo-500/50 hover:bg-muted/50'
                  }`}
                >
                  <Upload className={`w-8 h-8 mb-2 ${data.file ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  <p className="text-sm font-semibold text-foreground">
                    {data.file ? data.file.name : 'Klik untuk memilih file Excel'}
                  </p>
                  {!data.file && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Format didukung: .xlsx, .xls (Maks 5MB)
                    </p>
                  )}
                </button>
                {errors.file && <p className="text-red-500 text-sm mt-2 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errors.file}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
                  disabled={processing || !data.file}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all shadow-sm disabled:opacity-70"
                >
                  {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {processing ? 'Mengimport...' : 'Mulai Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
