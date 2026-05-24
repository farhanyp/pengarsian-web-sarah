import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import type { User } from '@/types';
import { 
    Users, Star, FileText, TrendingUp, 
    BarChart, Table, FileArchive, File, 
    MoreVertical, ArrowRight, Filter, ExternalLink 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetricCard {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    value: string;
    label: string;
    badge: string;
    badgeBg: string;
    badgeColor: string;
}

interface RecentDoc {
    icon: LucideIcon;
    name: string;
    meta: string;
}

interface TopStudent {
    name: string;
    nisn: string;
    major: string;
    score: number;
    status: 'Honor Roll' | 'Distinction' | 'Merit';
    avatarInitials: string;
    avatarGradient: string;
}

// ---------------------------------------------------------------------------
// Static data — replace with real API calls when backend is ready
// ---------------------------------------------------------------------------

const METRIC_CARDS: MetricCard[] = [
    {
        icon: Users,
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        value: '1.284',
        label: 'Total Siswa Terdaftar',
        badge: '+4.2%',
        badgeBg: 'bg-green-500/10',
        badgeColor: 'text-green-600 dark:text-green-400',
    },
    {
        icon: Star,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        value: '88.5',
        label: 'Rata-rata Nilai Institusi',
        badge: 'Aman',
        badgeBg: 'bg-blue-500/10',
        badgeColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: FileText,
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-600 dark:text-purple-400',
        value: '3.492',
        label: 'Total Arsip Dokumen',
        badge: 'Update Harian',
        badgeBg: 'bg-muted',
        badgeColor: 'text-muted-foreground',
    },
];

const RECENT_DOCS: RecentDoc[] = [
    { icon: FileText, name: 'Laporan_Semester_2024.pdf', meta: '2.4 MB • 2 jam lalu' },
    { icon: Table, name: 'Data_Nilai_CS_Final.xlsx', meta: '1.1 MB • 5 jam lalu' },
    { icon: File, name: 'Update_Kebijakan_Institusi.docx', meta: '450 KB • Kemarin' },
    { icon: FileArchive, name: 'Arsip_Foto_Fakultas.zip', meta: '142 MB • 2 hari lalu' },
];

const TOP_STUDENTS: TopStudent[] = [
    {
        name: 'Sarah Jenkins',
        nisn: '#202400122',
        major: 'MIPA',
        score: 96.5,
        status: 'Honor Roll',
        avatarInitials: 'SJ',
        avatarGradient: 'from-indigo-500 to-purple-600',
    },
    {
        name: 'Marco Verratti',
        nisn: '#202400451',
        major: 'IPS',
        score: 94.2,
        status: 'Honor Roll',
        avatarInitials: 'MV',
        avatarGradient: 'from-sky-500 to-cyan-500',
    },
    {
        name: 'Elena Rodriguez',
        nisn: '#202400982',
        major: 'MIPA',
        score: 92.8,
        status: 'Distinction',
        avatarInitials: 'ER',
        avatarGradient: 'from-emerald-500 to-teal-500',
    },
    {
        name: 'Budi Santoso',
        nisn: '#202401105',
        major: 'Bahasa',
        score: 91.0,
        status: 'Distinction',
        avatarInitials: 'BS',
        avatarGradient: 'from-amber-500 to-orange-500',
    },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Badge variant helper — maps status to colour tokens.
 */
function StatusBadge({ status }: { status: TopStudent['status'] }) {
    const styles: Record<TopStudent['status'], string> = {
        'Honor Roll': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        'Distinction': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        'Merit': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
        >
            {status}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
    const { auth } = usePage().props as { auth: { user: User } };
    const firstName = auth.user?.name?.split(' ')[0] ?? 'Admin';

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

                    {/* Live indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">Live</span>
                    </div>
                </div>
            </header>

            {/* Scrollable body */}
            <div className="p-6 md:p-10 space-y-8">

                {/* ── Metric cards ─────────────────────────────────── */}
                <section aria-labelledby="metrics-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h2 id="metrics-heading" className="sr-only">Metrik utama</h2>

                    {METRIC_CARDS.map((card) => (
                        <div
                            key={card.label}
                            className="group bg-background/60 backdrop-blur-xl border border-border/50 p-7 rounded-2xl flex flex-col justify-between h-[190px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                {/* Icon */}
                                <div
                                    className={`p-3 ${card.iconBg} ${card.iconColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <card.icon className="w-7 h-7" strokeWidth={2.5} />
                                </div>

                                {/* Badge */}
                                <div className={`flex items-center gap-1.5 ${card.badgeBg} ${card.badgeColor} px-2.5 py-1 rounded-full`}>
                                    {card.badge === '+4.2%' && (
                                        <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
                                    )}
                                    <span className="text-xs font-bold">{card.badge}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-4xl font-black text-foreground tracking-tight">{card.value}</p>
                                <p className="text-sm text-muted-foreground font-semibold mt-1">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ── Main grid ─────────────────────────────────────── */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Performance trend — uses PlaceholderPattern for chart area */}
                    <div className="lg:col-span-8 bg-background/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl min-h-[450px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)] transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Tren Performa Siswa</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Ringkasan distribusi nilai dari modul Data Nilai Siswa.
                                </p>
                            </div>

                            {/* Filter pills */}
                            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
                                <button className="text-sm font-semibold text-muted-foreground px-4 py-1.5 rounded-lg hover:text-foreground transition-colors">
                                    Jurusan
                                </button>
                                <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-background shadow-sm px-4 py-1.5 rounded-lg transition-all">
                                    Semua
                                </button>
                            </div>
                        </div>

                        {/* Chart placeholder */}
                        <div className="flex-grow relative overflow-hidden rounded-xl border border-border/50 bg-background/50 group hover:border-indigo-500/30 transition-colors">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-indigo-500/10 dark:stroke-indigo-400/10 group-hover:stroke-indigo-500/20 transition-colors" />

                            {/* Decorative axis labels */}
                            <div className="absolute bottom-3 left-4 right-4 flex justify-between pointer-events-none select-none">
                                {['JAN', 'MAR', 'MEI', 'JUL', 'SEP', 'NOV'].map((m) => (
                                    <span key={m} className="text-[10px] font-bold text-muted-foreground/50">{m}</span>
                                ))}
                            </div>

                            {/* Coming-soon badge */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="p-3 bg-background/80 backdrop-blur rounded-xl border border-border/50 shadow-sm">
                                        <BarChart className="w-8 h-8 text-indigo-500" strokeWidth={2} />
                                    </div>
                                    <p className="text-sm font-semibold text-muted-foreground">Grafik Segera Hadir</p>
                                    <p className="text-xs text-muted-foreground/70">Data visualisasi akan tampil di sini</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary stats strip */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                            {[
                                { label: 'Performa Tertinggi', value: 'MIPA' },
                                { label: 'Pertumbuhan Avg.', value: '+12.4%' },
                                { label: 'Target Tercapai', value: '94.2%' },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-[10px] uppercase text-muted-foreground mb-1 tracking-widest">{label}</p>
                                    <p className="text-sm font-bold text-foreground">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent documents */}
                    <div className="lg:col-span-4 bg-background/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold tracking-tight">Dokumen Terbaru</h3>
                            <button
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-500/10 p-2 rounded-full transition-all"
                                aria-label="Lihat semua dokumen"
                            >
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="space-y-1 flex-grow overflow-y-auto pr-1 -mr-1">
                            {RECENT_DOCS.map((doc) => (
                                <div
                                    key={doc.name}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-all cursor-pointer group"
                                >
                                    {/* File icon */}
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                                        <doc.icon className="w-5 h-5" strokeWidth={2.5} />
                                    </div>

                                    {/* File info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate text-foreground">{doc.name}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{doc.meta}</p>
                                    </div>

                                    <MoreVertical className="w-4.5 h-4.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 w-full py-2.5 border border-border/60 rounded-xl text-sm font-semibold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-200">
                            Lihat Semua Repositori
                        </button>
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
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-muted-foreground">Live Update</span>
                            </div>
                            <button
                                className="p-2 bg-background border border-border/50 shadow-sm hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                                aria-label="Filter tabel"
                            >
                                <Filter className="w-4.5 h-4.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Responsive table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase tracking-widest">
                                    <th className="px-8 py-4 font-semibold">Nama Siswa</th>
                                    <th className="px-6 py-4 font-semibold">NISN</th>
                                    <th className="px-6 py-4 font-semibold">Jurusan</th>
                                    <th className="px-6 py-4 font-semibold">Nilai</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {TOP_STUDENTS.map((student, idx) => (
                                    <tr
                                        key={student.nisn}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        {/* Name + avatar */}
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar initials */}
                                                <div
                                                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${student.avatarGradient} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                                                >
                                                    {student.avatarInitials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{student.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">Rank #{idx + 1}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                            {student.nisn}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                                            {student.major}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                {student.score.toFixed(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={student.status} />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-indigo-500/10"
                                                aria-label={`Lihat detail ${student.name}`}
                                            >
                                                <ExternalLink className="w-4.5 h-4.5" strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}
