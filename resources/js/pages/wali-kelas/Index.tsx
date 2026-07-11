import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit2, Trash2, UserCheck } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

import { ClassTeacher, ClassTeachersPaginated } from '@/types/wali-kelas';
import { SchoolClass } from '@/types/kelas';
import { User } from '@/types/auth';

interface AcademicYear {
  id: number;
  year: string;
  is_active: boolean;
}

interface Props {
  classTeachers: ClassTeachersPaginated;
  teachers: User[];
  classes: SchoolClass[];
  academicYears: AcademicYear[];
  filters: {
    search?: string;
  };
}

export default function WaliKelasIndex({ classTeachers, teachers, classes, academicYears, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ClassTeacher | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<ClassTeacher | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/wali-kelas-management', { search }, { preserveState: true, replace: true });
    }
  };

  return (
    <>
      <Head title="Manajemen Penugasan Wali Kelas" />

      {/* Top header */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Penugasan Wali Kelas
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Tentukan dan kelola guru yang mengampu sebagai wali kelas di setiap kelas.
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">
        {/* Data Table Section */}
        <section
          aria-labelledby="data-wali-kelas-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">
            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari wali kelas, kelas, atau tahun akademik..."
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
                <span className="text-sm">Tambah Penugasan</span>
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-24">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Wali Kelas</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kelas</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Tahun Akademik</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {classTeachers.data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{classTeachers.from + index}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {item.teacher?.name.substring(0, 2).toUpperCase() || 'WK'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{item.teacher?.name || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">{item.teacher?.email || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg">
                        {item.class?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.academic_year}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingAssignment(item)}
                          className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                          title="Ubah"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingAssignment(item)}
                          className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {classTeachers.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      Tidak ada data penugasan wali kelas ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {classTeachers.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{classTeachers.from}-{classTeachers.to}</span> dari <span className="text-foreground font-bold">{classTeachers.total}</span> penugasan
              </p>
              <div className="flex items-center gap-1">
                {classTeachers.links.map((link, i) => (
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
        teachers={teachers}
        classes={classes}
        academicYears={academicYears}
      />
      
      <EditModal
        isOpen={!!editingAssignment}
        onClose={() => setEditingAssignment(null)}
        assignment={editingAssignment}
        teachers={teachers}
        classes={classes}
        academicYears={academicYears}
      />

      <DeleteModal
        isOpen={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        assignment={deletingAssignment}
      />
    </>
  );
}
