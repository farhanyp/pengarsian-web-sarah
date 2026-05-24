import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Menu } from 'lucide-react';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url } = usePage();

    /* Collapse sidebar on mobile by default */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsCollapsed(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-foreground min-h-screen font-sans relative overflow-hidden">
            {/* ── Ambient background ─────────────────────────────────── */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-purple-500/8 blur-3xl" />
            </div>

            {/* ── Mobile overlay ─────────────────────────────────────── */}
            {!isCollapsed && (
                <div
                    className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[50] transition-opacity duration-300"
                    onClick={() => setIsCollapsed(true)}
                    aria-hidden="true"
                />
            )}

            <AppSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                currentPath={url}
            />

            {/* ── Main content ───────────────────────────────────────── */}
            <main
                id="mainContent"
                className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen z-10 ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-64'
                    }`}
            >
                {/* Generic header for mobile toggle and breadcrumbs */}
                <header className="w-full px-6 py-4 md:hidden sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 flex items-center gap-4">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    {breadcrumbs.length > 0 && (
                        <div className="flex-1 overflow-hidden">
                            <span className="text-sm font-semibold truncate">{breadcrumbs[breadcrumbs.length - 1]?.title}</span>
                        </div>
                    )}
                </header>

                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
