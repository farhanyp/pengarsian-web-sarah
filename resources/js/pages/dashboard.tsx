import { Head, usePage, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import type { User } from '@/types';
import {
    BarChart,
    ArrowRight, Filter, Users, FileText, Clock
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getGreeting } from '@/lib/utils';

export default function DashboardPage() {
    const { auth, studentStats, classPerformances, recentDocuments, topStudents } = usePage().props as {
        auth: { user: User },
        studentStats?: { total: number, pria: number, wanita: number, academic_year: string | null },
        classPerformances?: { name: string, average_score: number }[],
        recentDocuments?: { id: string, title: string, status: string, created_at: string, creator: { name: string } }[],
        topStudents?: { student_id: string, student_name: string, nisn: string, class_name: string, average_score: number, rnk: number }[]
    };
    const firstName = auth.user?.name?.split(' ')[0] ?? 'Admin';

    // Calculate dynamic summary stats
    const highestPerformance = classPerformances && classPerformances.length > 0
        ? classPerformances.reduce((prev, current) => (prev.average_score > current.average_score) ? prev : current)
        : null;

    const overallAverage = classPerformances && classPerformances.length > 0
        ? (classPerformances.reduce((acc, curr) => acc + curr.average_score, 0) / classPerformances.length).toFixed(1)
        : '0';

    const activeClassesCount = classPerformances ? classPerformances.length : 0;

    return (
        <>
            <Head title="Dashboard Utama" />

            {/* Top header */}
            <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {getGreeting()}, {firstName}!
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
                                Berikut ringkasan performa dan metrik akademik hari ini.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable body */}
            <div className="p-6 md:p-10 space-y-8">

                {/* ── Metric cards ─────────────────────────────────── */}
                <section aria-labelledby="metrics-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h2 id="metrics-heading" className="sr-only">Metrik utama</h2>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background/60 backdrop-blur-xl p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Siswa Aktif</p>
                                <p className="text-xs text-muted-foreground mt-0.5">T.A {studentStats?.academic_year || 'Belum diatur'}</p>
                            </div>
                            <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl">
                                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{studentStats?.total ?? 0}</h3>
                            <div className="mt-3 flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span>Pria: <span className="text-foreground">{studentStats?.pria ?? 0}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                    <span>Wanita: <span className="text-foreground">{studentStats?.wanita ?? 0}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </section>

                {/* ── Main grid ─────────────────────────────────────── */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Performance trend — uses PlaceholderPattern for chart area */}
                    <div className="lg:col-span-8 bg-background/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl min-h-[450px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)] transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    Tren Performa Siswa
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-bold tracking-wider">Live</span>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    Rata-rata nilai keseluruhan siswa berdasarkan kelas.
                                </p>
                            </div>
                        </div>

                        {/* Real Chart */}
                        <div className="w-full mt-6 h-[320px]">
                            {classPerformances && classPerformances.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={classPerformances} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#525252" strokeOpacity={0.4} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a3a3a3', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tick={{ fontSize: 12, fill: '#a3a3a3', fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                borderRadius: '12px',
                                                border: '1px solid #1e293b',
                                                boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.5)',
                                                color: '#f8fafc',
                                                padding: '12px 16px'
                                            }}
                                            itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="average_score" fill="url(#colorScore)" radius={[6, 6, 0, 0]} name="Rata-rata" barSize={40} minPointSize={5} />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <div className="p-4 bg-indigo-500/10 rounded-2xl">
                                            <BarChart className="w-8 h-8 text-indigo-500" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Data Tidak Tersedia</p>
                                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Belum ada data nilai untuk ditampilkan saat ini.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary stats strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
                            {[
                                {
                                    label: 'Kelas Terbaik',
                                    value: highestPerformance ? highestPerformance.name : '-',
                                    subtext: highestPerformance ? `Rata-rata ${highestPerformance.average_score}` : 'Belum ada data',
                                    trend: highestPerformance && highestPerformance.average_score > 0 ? 'up' : 'neutral'
                                },
                                {
                                    label: 'Rata-rata Global',
                                    value: overallAverage,
                                    subtext: 'Semua kelas aktif',
                                    trend: 'neutral'
                                },
                                {
                                    label: 'Kelas Terdata',
                                    value: activeClassesCount.toString(),
                                    subtext: 'Memiliki nilai',
                                    trend: 'neutral'
                                },
                            ].map(({ label, value, subtext, trend }) => (
                                <div key={label} className="flex flex-col p-4 rounded-2xl bg-gradient-to-br from-background/50 to-muted/20 border border-border/30 hover:border-indigo-500/30 transition-colors group">
                                    <p className="text-[10px] uppercase text-muted-foreground mb-2 tracking-widest font-semibold">{label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-extrabold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{value}</p>
                                        {trend === 'up' && <span className="text-emerald-500 text-xs font-bold">↑</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent documents */}
                    <div className="lg:col-span-4 bg-background/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold tracking-tight">Dokumen Terbaru</h3>
                        </div>

                        <div className="flex flex-col gap-3 flex-grow mt-2">
                            {recentDocuments && recentDocuments.length > 0 ? (
                                recentDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-muted/40 transition-colors group cursor-pointer">
                                        <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {doc.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    {doc.status}
                                                </span>
                                                <span className="flex items-center text-[10px] text-muted-foreground gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(doc.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/50 rounded-xl bg-background/30 h-full">
                                    <FileText className="w-8 h-8 text-muted-foreground/50 mb-3" />
                                    <p className="text-sm font-semibold text-foreground">Tidak ada dokumen</p>
                                    <p className="text-xs text-muted-foreground mt-1 text-center">Belum ada dokumen yang diunggah baru-baru ini.</p>
                                </div>
                            )}
                        </div>

                        <Link href="/dokumen" className="mt-6 flex items-center justify-center w-full py-2.5 border border-border/60 rounded-xl text-sm font-semibold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-200">
                            Lihat Semua Repositori
                        </Link>
                    </div>
                </section>

                {/* ── Top students table ───────────────────────────── */}
                <section
                    aria-labelledby="top-students-heading"
                    className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
                >
                    {/* Table header */}
                    <div className="px-8 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
                        <div>
                            <h3 id="top-students-heading" className="text-xl font-bold tracking-tight">
                                Siswa Berprestasi
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Daftar siswa dengan pencapaian nilai tertinggi minggu ini.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className="p-2 bg-background border border-border/50 shadow-sm hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                                aria-label="Filter tabel"
                            >
                                <Filter className="w-4.5 h-4.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Responsive table */}
                    <div className="relative h-[400px] overflow-auto border-t border-sidebar-border/70 dark:border-sidebar-border bg-background/50 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50 sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Peringkat</th>
                                    <th className="px-6 py-4 font-semibold">Nama Siswa</th>
                                    <th className="px-6 py-4 font-semibold">Kelas</th>
                                    <th className="px-6 py-4 font-semibold">NISN</th>
                                    <th className="px-6 py-4 font-semibold text-right">Rata-rata</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents && topStudents.length > 0 ? topStudents.map((student, idx) => (
                                    <tr key={`${student.student_id}-${idx}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {student.rnk === 1 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">1</span>}
                                            {student.rnk === 2 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-500 dark:text-slate-300 font-bold text-xs">2</span>}
                                            {student.rnk === 3 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-600/20 text-orange-700 dark:text-orange-500 font-bold text-xs">3</span>}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{student.student_name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                {student.class_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{student.nisn || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                                {parseFloat(student.average_score as any).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            Belum ada data siswa berprestasi bulan ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}
