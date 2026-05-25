import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import type { User } from '@/types';
import {
    BarChart,
    ArrowRight, Filter
} from 'lucide-react';
import { getGreeting } from '@/lib/utils';

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
                </div>
            </header>

            {/* Scrollable body */}
            <div className="p-6 md:p-10 space-y-8">

                {/* ── Metric cards ─────────────────────────────────── */}
                <section aria-labelledby="metrics-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h2 id="metrics-heading" className="sr-only">Metrik utama</h2>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
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

                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border mt-2">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
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
                            <button
                                className="p-2 bg-background border border-border/50 shadow-sm hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                                aria-label="Filter tabel"
                            >
                                <Filter className="w-4.5 h-4.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Responsive table */}
                    <div className="relative h-[400px] overflow-hidden border-t border-sidebar-border/70 dark:border-sidebar-border bg-background/50">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </section>
            </div>
        </>
    );
}
