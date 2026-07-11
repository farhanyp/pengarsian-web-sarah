import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit2, Trash2, Download } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

import { Subject, SubjectsPaginated } from '@/types/mata-pelajaran';

interface Props {
  subjects: SubjectsPaginated;
  filters: {
    search?: string;
  };
}

export default function MataPelajaranPage({ subjects, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/mata-pelajaran', { search }, { preserveState: true, replace: true });
    }
  };

  return (
    <>
      <Head title="Manajemen Data Mata Pelajaran" />

      {/* Top header */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Manajemen Data Mata Pelajaran
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Kelola dan pantau data mata pelajaran secara terpusat.
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">
        {/* Data Table Section */}
        <section
          aria-labelledby="data-mata-pelajaran-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">
            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari nama mata pelajaran..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Tambah Mata Pelajaran</span>
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-24">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Mata Pelajaran</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {subjects.data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{subjects.from + index}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingSubject(item)}
                          className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                          title="Ubah"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingSubject(item)}
                          className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subjects.data.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      Tidak ada data mata pelajaran ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {subjects.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{subjects.from}-{subjects.to}</span> dari <span className="text-foreground font-bold">{subjects.total}</span> mata pelajaran
              </p>
              <div className="flex items-center gap-1">
                {subjects.links.map((link, i) => (
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
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditModal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        subject={editingSubject}
      />
      <DeleteModal
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        subject={deletingSubject}
      />
    </>
  );
}
