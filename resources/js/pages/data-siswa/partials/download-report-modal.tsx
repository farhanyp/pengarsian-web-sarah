import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Option } from '@/components/SearchableSelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tahunAjaran: Option[];
  kelas: Option[];
}

export default function DownloadReportModal({ isOpen, onClose, tahunAjaran, kelas }: Props) {
  const { data, setData, get, processing, errors, reset, clearErrors } = useForm({
    tahun_ajaran_id: tahunAjaran.length > 0 ? tahunAjaran[0].id : '',
    kelas_ids: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      clearErrors();
      // Set default selected academic year if available
      if (tahunAjaran.length > 0) {
        setData('tahun_ajaran_id', tahunAjaran[0].id as string);
      }
    }
  }, [isOpen]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setData('kelas_ids', kelas.map(k => k.id as string));
    } else {
      setData('kelas_ids', []);
    }
  };

  const handleClassChange = (classId: string, checked: boolean) => {
    if (checked) {
      setData('kelas_ids', [...data.kelas_ids, classId]);
    } else {
      setData('kelas_ids', data.kelas_ids.filter(id => id !== classId));
    }
  };

  const isAllSelected = kelas.length > 0 && data.kelas_ids.length === kelas.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Instead of using Inertia request for file download (which doesn't handle streams well),
    // we use a standard window.location.href approach, but Inertia's get works for simple
    // file downloads if we don't need to preserve state or if we just want a simple redirect.
    // However, with Inertia, `window.open` or `window.location.href` is better for file downloads.
    
    // Convert array to query string format
    const queryParams = new URLSearchParams();
    queryParams.append('tahun_ajaran_id', data.tahun_ajaran_id.toString());
    data.kelas_ids.forEach(id => queryParams.append('kelas_ids[]', id.toString()));
    
    // Create the download URL
    const downloadUrl = `/data-siswa/download-report?${queryParams.toString()}`;
    
    // Close modal before opening the download url to avoid freezing
    onClose();
    window.location.href = downloadUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unduh Laporan Data Siswa</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Tahun Ajaran */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tahun Ajaran Aktif <span className="text-red-500">*</span>
            </label>
            <select
              value={data.tahun_ajaran_id}
              onChange={e => setData('tahun_ajaran_id', e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
            >
              {tahunAjaran.map(ta => (
                <option key={ta.id} value={ta.id}>{ta.name}</option>
              ))}
            </select>
            {errors.tahun_ajaran_id && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {errors.tahun_ajaran_id}
              </p>
            )}
          </div>

          {/* Filter Kelas */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pilih Kelas <span className="text-red-500">*</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg w-fit transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 bg-white dark:bg-slate-900"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Pilih Semua Kelas
                </span>
              </label>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-h-[250px] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {kelas.map(k => (
                  <label 
                    key={k.id} 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={data.kelas_ids.includes(k.id as string)}
                      onChange={(e) => handleClassChange(k.id as string, e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 bg-white dark:bg-slate-900"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {k.name}
                    </span>
                  </label>
                ))}
              </div>
              {kelas.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Tidak ada kelas tersedia.
                </div>
              )}
            </div>
            {errors.kelas_ids && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {errors.kelas_ids}
              </p>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing || data.kelas_ids.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 border border-transparent rounded-xl shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Excel</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
