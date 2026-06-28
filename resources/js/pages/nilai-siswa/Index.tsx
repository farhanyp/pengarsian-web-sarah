import { useState, useMemo, Fragment, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Filter, Plus, Edit2, Trash2, Download, TrendingUp, Trophy, AlertCircle, CheckCircle2, FileSpreadsheet, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ImportModal from './ImportModal';
import DownloadNilaiModal from './partials/DownloadNilaiModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Student, Subject, GradeCategory, Grade, GradesPaginated } from '@/types/nilai-siswa';

interface Props {
  grades: GradesPaginated;
  students: Student[];
  subjects: Subject[];
  classes: { id: number; name: string }[];
  gradeCategories: GradeCategory[];
  availableAcademicYears: { id: string; name: string }[];
  filters: {
    search?: string;
    filter_semester?: string;
    filter_ay?: string;
    filter_class?: string;
  };
}

export default function DataNilaiSiswaPage({ grades, students, subjects, classes, gradeCategories, availableAcademicYears, filters }: Props) {
  const { auth } = usePage<any>().props;
  const canEdit = ['SUPERADMIN', 'ADMIN', 'GURU'].includes(auth?.user?.role);

  const [search, setSearch] = useState(filters.search || '');
  const [filterSemester, setFilterSemester] = useState(filters.filter_semester || 'all');
  const [filterAy, setFilterAy] = useState(filters.filter_ay || 'all');
  const [filterClass, setFilterClass] = useState(filters.filter_class || 'all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
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
        '/data-nilai-siswa',
        { 
          search: search || undefined,
          filter_semester: filterSemester !== 'all' ? filterSemester : undefined,
          filter_ay: filterAy !== 'all' ? filterAy : undefined,
          filter_class: filterClass !== 'all' ? filterClass : undefined,
        },
        { preserveState: true, replace: true, preserveScroll: true }
      );
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filterSemester, filterAy, filterClass]);

  const groupedGrades = useMemo(() => {
    const groups: Record<string, { student: Student; grades: Grade[] }> = {};
    grades.data.forEach(grade => {
      const studentId = grade.student?.id;
      if (!studentId) return;
      if (!groups[studentId]) {
        groups[studentId] = { student: grade.student!, grades: [] };
      }
      groups[studentId].grades.push(grade);
    });
    return Object.values(groups);
  }, [grades.data]);

  const toggleExpand = (studentId: string) => {
    setExpandedStudentId(prev => prev === studentId ? null : studentId);
  };

  return (
    <>
      <Head title="Data Nilai Siswa" />

      {/* Top header matching Dashboard and Data Siswa */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Data Nilai Siswa
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Pantau dan kelola performa akademik serta rekapitulasi nilai.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button 
              onClick={() => setIsDownloadModalOpen(true)}
              className="w-full md:w-auto justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Unduh Laporan Nilai
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">

        {/* Data Table Section */}
        <section
          aria-labelledby="data-nilai-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">

            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari nama siswa atau mata pelajaran..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
                {/* Semester Filter */}
                <div className="flex bg-background rounded-xl p-1 border border-border/50 transition-all w-full sm:w-auto">
                  <button 
                    onClick={() => setFilterSemester('all')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterSemester === 'all' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setFilterSemester('Ganjil')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterSemester === 'Ganjil' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Ganjil
                  </button>
                  <button 
                    onClick={() => setFilterSemester('Genap')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterSemester === 'Genap' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Genap
                  </button>
                </div>

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
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={String(cls.id)}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Tambah Nilai</span>
                </button>
              )}
            </div>
          </div>

          {/* Actual Table */}
          <div className={`overflow-x-auto bg-background/50 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-16">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Jumlah Data Nilai</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {groupedGrades.map((group, index) => {
                  const student = group.student;
                  const studentGrades = group.grades;
                  const isExpanded = expandedStudentId === student.id;
                  const initials = student?.name?.substring(0, 2).toUpperCase() || 'NA';
                  
                  return (
                    <Fragment key={student.id}>
                      <tr 
                        className={`transition-colors group hover:bg-muted/30 cursor-pointer ${isExpanded ? 'bg-muted/30' : ''}`}
                        onClick={() => toggleExpand(student.id)}
                      >
                        <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              {initials}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-foreground">{student?.name}</span>
                              <p className="text-xs font-mono text-muted-foreground mt-0.5">NIS: {student?.nis}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full font-bold text-xs">
                            {studentGrades.length} Nilai
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-muted-foreground hover:text-indigo-600 rounded-lg transition-all">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={4} className="p-0 border-b-0">
                            <div className="bg-muted/10 border-t border-border/50 px-6 py-4 shadow-inner">
                              <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
                                <table className="w-full text-left border-collapse">
                                  <thead className="bg-muted/30 border-b border-border/50">
                                    <tr>
                                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Mata Pelajaran</th>
                                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Kategori</th>
                                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Judul Penilaian</th>
                                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase text-center">Nilai</th>
                                      {canEdit && <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase text-right">Aksi</th>}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border/50">
                                    {studentGrades.map(grade => {
                                      const score = grade.score ?? 0;
                                      const isRemedial = score < 70;
                                      
                                      return (
                                        <tr key={grade.id} className={`transition-colors group/row ${isRemedial ? 'hover:bg-red-500/5 bg-red-500/5' : 'hover:bg-muted/20'}`}>
                                          <td className="px-4 py-3 text-sm font-semibold text-foreground">
                                            {grade.subject?.name}
                                          </td>
                                          <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                                            {grade.category?.name}
                                          </td>
                                          <td className="px-4 py-3 text-sm font-semibold text-foreground">
                                            {grade.title}
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-md font-bold text-sm border ${isRemedial ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                                              {grade.score ?? '-'}
                                            </span>
                                          </td>
                                          {canEdit && (
                                            <td className="px-4 py-3 text-right">
                                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); setEditingGrade(grade); }}
                                                  className="p-1.5 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                                                  title="Update"
                                                >
                                                  <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); setDeletingGrade(grade); }}
                                                  className="p-1.5 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                                                  title="Delete"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </td>
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {groupedGrades.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Inbox className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Data Tidak Ditemukan</h3>
                        <p className="text-sm">Tidak ada nilai yang sesuai dengan kriteria pencarian dan filter Anda.</p>
                        {(search || filterSemester !== 'all' || filterAy !== 'all' || filterClass !== 'all') && (
                          <button 
                            onClick={() => {
                              setSearch('');
                              setFilterSemester('all');
                              setFilterAy('all');
                              setFilterClass('all');
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
          {grades.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{grades.from}-{grades.to}</span> dari <span className="text-foreground font-bold">{grades.total}</span> nilai
              </p>
              <div className="flex items-center gap-1">
                {grades.links.map((link, i) => (
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
        students={students}
        subjects={subjects}
        gradeCategories={gradeCategories}
      />

      <EditModal
        isOpen={!!editingGrade}
        onClose={() => setEditingGrade(null)}
        grade={editingGrade}
        students={students}
        subjects={subjects}
        gradeCategories={gradeCategories}
      />

      <DeleteModal
        isOpen={!!deletingGrade}
        onClose={() => setDeletingGrade(null)}
        grade={deletingGrade}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        subjects={subjects}
        classes={classes}
        availableAcademicYears={availableAcademicYears}
      />

      <DownloadNilaiModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        students={students}
        subjects={subjects}
        classes={classes}
        availableAcademicYears={availableAcademicYears}
      />
    </>
  );
}
