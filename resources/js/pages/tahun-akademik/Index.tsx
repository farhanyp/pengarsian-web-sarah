import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit2, Trash2, Download, Calendar } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

interface AcademicYear {
  id: string | number;
  year: string;
  is_active: boolean;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface AcademicYearsPaginated {
  data: AcademicYear[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}

interface Props {
  academicYears: AcademicYearsPaginated;
  filters: {
    search?: string;
  };
}

export default function TahunAkademikPage({ academicYears, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYear | null>(null);
  const [deletingItem, setDeletingItem] = useState<AcademicYear | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/tahun-akademik', { search }, { preserveState: true, replace: true });
    }
  };

  return (
    <>
      <Head title="Manajemen Tahun Akademik" />

      {/* Top header */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Manajemen Tahun Akademik
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Kelola data tahun ajaran dan atur status tahun ajaran aktif secara terpusat.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button className="w-full md:w-auto justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Unduh Laporan
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">
        {/* Data Table Section */}
        <section
          aria-labelledby="data-table-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">
            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari tahun akademik (cth: 2025/2026)..."
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
                <span className="text-sm">Tambah Tahun</span>
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-24">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Tahun Akademik</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {academicYears.data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{academicYears.from + index}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Aktif
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-muted text-muted-foreground border border-border/50 rounded-full text-xs font-bold">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                          title="Update"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {academicYears.data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      Tidak ada data tahun akademik ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {academicYears.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{academicYears.from}-{academicYears.to}</span> dari <span className="text-foreground font-bold">{academicYears.total}</span> data
              </p>
              <div className="flex items-center gap-1">
                {academicYears.links.map((link, i) => (
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
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        academicYear={editingItem}
      />
      <DeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        academicYear={deletingItem}
      />
    </>
  );
}
