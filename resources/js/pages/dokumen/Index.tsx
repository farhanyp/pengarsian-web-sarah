import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Edit2, Trash2, FileText, FileSpreadsheet, Image as ImageIcon, File, Download, Eye } from 'lucide-react';
import { CreateModal } from './CreateModal';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';

import { DocumentModel, PaginatedData } from '@/types/dokumen';
import { formatBytes } from '@/lib/utils';

interface Props {
  documents: PaginatedData<DocumentModel>;
  filters: {
    search?: string;
  };
}

export default function DokumenPage({ documents, filters }: Props) {
  const { auth } = usePage<any>().props;
  const canEdit = auth?.user?.role === 'SUPERADMIN' || auth?.user?.role === 'ADMIN';

  const [search, setSearch] = useState(filters.search || '');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'masuk' | 'keluar' | null>(null);

  const [editingDocument, setEditingDocument] = useState<DocumentModel | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<DocumentModel | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/dokumen', { search }, { preserveState: true, replace: true });
    }
  };

  const getIconForType = (url: string) => {
    if (!url) return <File className="w-5 h-5 text-indigo-500" />;
    const ext = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return <FileText className="w-5 h-5 text-red-500" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5 text-blue-600" />;
    return <File className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <>
      <Head title="Repositori Dokumen" />

      {/* Top header */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Repositori Dokumen
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Pusat penyimpanan aman untuk seluruh dokumen institusi.
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">
        {/* Data Table Section */}
        <section
          aria-labelledby="data-dokumen-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">
            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari dokumen institusi..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Actions */}
            {canEdit && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                <button
                  onClick={() => { setCreateModalType('masuk'); setIsCreateModalOpen(true); }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Surat Masuk</span>
                </button>
                <button
                  onClick={() => { setCreateModalType('keluar'); setIsCreateModalOpen(true); }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Surat Keluar</span>
                </button>
              </div>
            )}
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-24">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Dokumen</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Tipe Surat</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Tanggal Diunggah</th>
                  {canEdit && <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right w-32">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {documents.data.map((doc, index) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                      {documents.from + index}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                          {getIconForType(doc.current_url)}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${doc.incoming_mail ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        doc.outgoing_mail ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {doc.incoming_mail ? 'Surat Masuk' : doc.outgoing_mail ? 'Surat Keluar' : 'Dokumen'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${doc.status === 'ARCHIVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {doc.status || 'ARCHIVED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/storage/${doc.current_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-blue-500/10 text-blue-600 rounded-lg transition-all"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <a
                            href={`/storage/${doc.current_url}`}
                            download
                            className="p-2 hover:bg-emerald-500/10 text-emerald-600 rounded-lg transition-all"
                            title="Unduh"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setEditingDocument(doc)}
                            className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                            title="Ubah"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingDocument(doc)}
                            className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {documents.data.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 7 : 6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      Tidak ada dokumen ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {documents.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{documents.from}-{documents.to}</span> dari <span className="text-foreground font-bold">{documents.total}</span> dokumen
              </p>
              <div className="flex items-center gap-1">
                {documents.links.map((link, i) => (
                  link.url ? (
                    <Link
                      key={i}
                      href={link.url}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${link.active
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10'
                        }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-sm text-muted-foreground/50 cursor-not-allowed"
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  )
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateModalType(null);
        }}
        type={createModalType}
      />
      <EditModal
        isOpen={!!editingDocument}
        onClose={() => setEditingDocument(null)}
        doc={editingDocument}
      />
      <DeleteModal
        isOpen={!!deletingDocument}
        onClose={() => setDeletingDocument(null)}
        doc={deletingDocument}
      />
    </>
  );
}
