import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Plus, Edit2, Trash2, Download, TrendingUp, Trophy, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ImportModal from './ImportModal';

interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface GradeCategory {
  id: string;
  name: string;
  default_weight: number;
}

interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  grade_category_id: string;
  title: string;
  score: number | null;
  semester: string;
  academic_year: string;
  student: Student;
  subject: Subject;
  category: GradeCategory;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface GradesPaginated {
  data: Grade[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}

interface Props {
  grades: GradesPaginated;
  students: Student[];
  subjects: Subject[];
  gradeCategories: GradeCategory[];
  availableAcademicYears: { id: string; name: string }[];
  filters: {
    search?: string;
  };
}

export default function DataNilaiSiswaPage({ grades, students, subjects, gradeCategories, availableAcademicYears, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/data-nilai-siswa', { search }, { preserveState: true, replace: true });
    }
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
                onKeyDown={handleSearch}
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <div className="flex bg-background rounded-xl p-1 border border-border/50 transition-all w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold shadow-sm">Ganjil</button>
                <button className="flex-1 sm:flex-none px-3 py-1.5 text-muted-foreground hover:text-foreground text-sm font-bold transition-colors rounded-lg">Genap</button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-between gap-2 bg-background hover:bg-muted/50 px-4 py-2.5 rounded-xl border border-border/50 hover:border-indigo-500/50 transition-all group">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600" />
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-indigo-600 whitespace-nowrap">Kelas: Semua</span>
                  </div>
                </button>
              </div>

              {/* Import Button */}
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto shrink-0"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="text-sm">Import Excel</span>
              </button>

              {/* Tambah Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Tambah Nilai</span>
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Mata Pelajaran</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Judul Penilaian</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Nilai</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {grades.data.map((grade, index) => {
                  const score = grade.score ?? 0;
                  const isRemedial = score < 70;
                  const initials = grade.student?.name?.substring(0, 2).toUpperCase() || 'NA';
                  return (
                    <tr key={grade.id} className={`transition-colors group ${isRemedial ? 'hover:bg-red-500/5 bg-red-500/5' : 'hover:bg-muted/30'}`}>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{grades.from + index}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isRemedial ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
                            {initials}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground">{grade.student?.name}</span>
                            <p className="text-xs font-mono text-muted-foreground mt-0.5">NIS: {grade.student?.nis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {grade.subject?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                        {grade.category?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {grade.title}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md font-bold text-sm border ${isRemedial ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                          {grade.score ?? '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingGrade(grade)}
                            className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all"
                            title="Update"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingGrade(grade)}
                            className="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {grades.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground text-sm font-medium">
                      Tidak ada data nilai ditemukan.
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
        students={students}
        availableAcademicYears={availableAcademicYears}
      />
    </>
  );
}
