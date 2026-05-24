import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Filter, Network, UserPlus, Edit2, Trash2, Download } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import DownloadReportModal from './partials/download-report-modal';
import { Option } from '@/components/SearchableSelect';

import { Student, StudentsPaginated } from '@/types/data-siswa';

interface Props {
  students: StudentsPaginated;
  availableClasses: Option[];
  availableAcademicYears: Option[];
  filters: {
    search?: string;
  };
}

export default function DataSiswaPage({ students, availableClasses, availableAcademicYears, filters }: Props) {
  const { auth } = usePage<any>().props;
  const canEdit = auth?.user?.role === 'SUPERADMIN' || auth?.user?.role === 'ADMIN';

  const [search, setSearch] = useState(filters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/data-siswa', { search }, { preserveState: true, replace: true });
    }
  };

  return (
    <>
      <Head title="Manajemen Data Siswa" />

      {/* Top header matching Dashboard */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Manajemen Data Siswa
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Kelola dan pantau data institusional siswa secara terpusat.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button 
              onClick={() => setIsDownloadModalOpen(true)}
              className="w-full md:w-auto justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
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
          aria-labelledby="data-siswa-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">

            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari NISN, nama..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-between gap-2 bg-background hover:bg-muted/50 px-4 py-2.5 rounded-xl border border-border/50 hover:border-indigo-500/50 transition-all group">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600" />
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-indigo-600 whitespace-nowrap">Kelas: Semua</span>
                  </div>
                </button>
              </div>

              {/* Tambah Button */}
              {canEdit && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto shrink-0"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="text-sm">Tambah Siswa</span>
                </button>
              )}
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">NISN / NIS</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kelas & Tahun</th>
                  {canEdit && <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {students.data.map((student, index) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{students.from + index}</td>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{student.nisn} / {student.nis}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.classes && student.classes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {student.classes.map((cls, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold whitespace-nowrap">
                              {cls.name} ({cls.pivot.academic_year})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">-</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                            title="Update"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {students.data.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {students.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{students.from}-{students.to}</span> dari <span className="text-foreground font-bold">{students.total}</span> siswa
              </p>
              <div className="flex items-center gap-1">
                {students.links.map((link, i) => (
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
        availableClasses={availableClasses}
        availableAcademicYears={availableAcademicYears}
      />
      <EditModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        student={editingStudent}
      />
      <DeleteModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        student={deletingStudent}
      />
      <DownloadReportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        tahunAjaran={availableAcademicYears}
        kelas={availableClasses}
      />
    </>
  );
}
