import { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Filter, Network, UserPlus, Edit2, Trash2, Download, FileSpreadsheet, Inbox } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ImportSiswaModal from './partials/ImportSiswaModal';
import DownloadReportModal from './partials/download-report-modal';
import { Option } from '@/components/SearchableSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Student, StudentsPaginated } from '@/types/data-siswa';

interface Props {
  students: StudentsPaginated;
  availableClasses: Option[];
  availableAcademicYears: Option[];
  filters: {
    search?: string;
    filter_ay?: string;
    filter_class?: string;
    sort_name?: string;
  };
}

export default function DataSiswaPage({ students, availableClasses, availableAcademicYears, filters }: Props) {
  const { auth } = usePage<any>().props;
  const canEdit = auth?.user?.role === 'SUPERADMIN' || auth?.user?.role === 'ADMIN';

  const [search, setSearch] = useState(filters.search || '');
  const [filterAy, setFilterAy] = useState(filters.filter_ay || 'all');
  const [filterClass, setFilterClass] = useState(filters.filter_class || 'all');
  const [sortName, setSortName] = useState(filters.sort_name || 'none');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const removeStart = router.on('start', () => setIsLoading(true));
    const removeFinish = router.on('finish', () => setIsLoading(false));
    return () => {
      removeStart();
      removeFinish();
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      router.get(
        '/data-siswa',
        { 
          search: search || undefined,
          filter_ay: filterAy !== 'all' ? filterAy : undefined,
          filter_class: filterClass !== 'all' ? filterClass : undefined,
          sort_name: sortName !== 'none' ? sortName : undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filterAy, filterClass, sortName]);

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
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              
              {/* Dropdowns Group */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto p-1 bg-background/50 border border-border/50 rounded-xl">
                
                {/* Academic Year Filter */}
                <Select value={filterAy} onValueChange={setFilterAy}>
                  <SelectTrigger className="w-[140px] sm:w-[150px] bg-transparent border-0 shadow-none focus:ring-0">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Tahun Ajaran" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {availableAcademicYears.map(ay => (
                      <SelectItem key={ay.id} value={String(ay.id)}>
                        {ay.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-px h-6 bg-border/50 hidden sm:block"></div>

                {/* Filter Kelas */}
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-[130px] sm:w-[150px] bg-transparent border-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {availableClasses.map(cls => (
                      <SelectItem key={cls.id} value={String(cls.id)}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-px h-6 bg-border/50 hidden sm:block"></div>

                {/* Sort Nama */}
                <Select value={sortName} onValueChange={setSortName}>
                  <SelectTrigger className="w-[130px] sm:w-[150px] bg-transparent border-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Urutkan Nama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nama (Default)</SelectItem>
                    <SelectItem value="asc">Nama (A-Z)</SelectItem>
                    <SelectItem value="desc">Nama (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Import Button */}
              {canEdit && (
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto shrink-0"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  <span className="text-sm">Import Excel</span>
                </button>
              )}

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
          <div className={`overflow-x-auto bg-background/50 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">NISN / NIS</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Jenis Kelamin</th>
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
                      {student.jenis_kelamin === 'PRIA' ? (
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">Laki-laki</span>
                      ) : student.jenis_kelamin === 'WANITA' ? (
                        <span className="px-2.5 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-full text-xs font-bold">Perempuan</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">-</span>
                      )}
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
                        <div className="flex items-center justify-end gap-1">
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
                    <td colSpan={canEdit ? 6 : 5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Inbox className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Data Tidak Ditemukan</h3>
                        <p className="text-sm">Tidak ada siswa yang sesuai dengan kriteria pencarian dan filter Anda.</p>
                        {(search || filterAy !== 'all' || filterClass !== 'all' || sortName !== 'none') && (
                          <button 
                            onClick={() => {
                              setSearch('');
                              setFilterAy('all');
                              setFilterClass('all');
                              setSortName('none');
                            }}
                            className="mt-4 px-4 py-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-lg transition-colors font-medium"
                          >
                            Hapus Filter
                          </button>
                        )}
                      </div>
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
      <ImportSiswaModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
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
