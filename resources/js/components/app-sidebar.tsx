import { Link, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import {
    LayoutDashboard, Users, GraduationCap,
    Database, School, ChevronRight, ChevronLeft,
    ChevronsUpDown, User as UserIcon,
    UserRound,
    Calendar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavItem {
    name: string;
    icon: LucideIcon;
    path: string;
    roles?: string[]; // Array of roles that can access this item (e.g. ['ADMIN', 'GURU'])
}

export interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    currentPath?: string;
}

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

export const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['ADMIN', 'GURU', 'SISWA'] },
    { name: 'Tahun Akademik', icon: Calendar, path: '/tahun-akademik', roles: ['ADMIN', 'GURU'] },
    { name: 'Kelas', icon: UserRound, path: '/kelas', roles: ['ADMIN', 'GURU'] },
    { name: 'Data Siswa', icon: Users, path: '/data-siswa', roles: ['ADMIN', 'GURU'] },
    { name: 'Data Nilai Siswa', icon: GraduationCap, path: '/data-nilai-siswa', roles: ['ADMIN', 'GURU'] },
    { name: 'Repositori Dokumen', icon: Database, path: '/repository' }, // Kosong/tidak ada roles = bisa diakses semua
];

// ---------------------------------------------------------------------------
// Sidebar component
// ---------------------------------------------------------------------------

export function AppSidebar({
    isCollapsed,
    setIsCollapsed,
    currentPath = '/',
}: SidebarProps) {
    const { auth } = usePage().props as { auth: { user: User } };
    const user = auth.user;
    const getInitials = useInitials();

    // Pastikan role disamakan huruf kapitalnya (jika kosong anggap GUEST)
    const userRole = ((user as any).role || 'GUEST').toUpperCase();

    // Filter menu berdasarkan role
    const visibleNavItems = navItems.filter((item) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.includes(userRole);
    });

    return (
        <aside
            id="sidebar"
            aria-label="Sidebar navigasi utama"
            className={`
                fixed h-full left-0 top-0
                bg-background/80 backdrop-blur-xl
                border-r border-border
                flex flex-col z-[60]
                transition-all duration-300 ease-in-out
                shadow-sm
                ${isCollapsed ? '-translate-x-full md:translate-x-0 w-64 md:w-[72px]' : 'translate-x-0 w-64'}
            `}
        >
            {/* ── Brand / Logo ─────────────────────────────────────────── */}
            <div className="p-4 flex items-center gap-3 overflow-hidden whitespace-nowrap h-[72px]">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-105">
                    <School className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>

                <div
                    className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 -translate-x-4' : 'opacity-100 translate-x-0'
                        }`}
                >
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
                        ScholarSys
                    </h1>
                    <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                        Manajemen Institusi
                    </p>
                </div>
            </div>

            {/* ── Desktop toggle button ─────────────────────────────────── */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                className="hidden md:flex absolute -right-3.5 top-20 bg-background text-foreground w-7 h-7 rounded-full border border-border shadow-md items-center justify-center hover:scale-110 hover:border-indigo-500 hover:text-indigo-500 active:scale-95 transition-all z-[70]"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                )}
            </button>

            {/* ── Nav items ────────────────────────────────────────────── */}
            <nav className="mt-6 flex-grow px-3 space-y-1 overflow-hidden" aria-label="Menu navigasi">
                {visibleNavItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5
                                transition-all duration-200 group relative overflow-hidden
                                ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl'
                                }
                            `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {/* Active background highlight */}
                            {isActive && (
                                <div className="absolute inset-0 bg-indigo-500/10 rounded-xl" />
                            )}

                            {/* Icon */}
                            <item.icon
                                className={`
                                    shrink-0 transition-transform duration-200 w-5 h-5
                                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                                `}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            {/* Label */}
                            <span
                                className={`
                                    whitespace-nowrap transition-all duration-300
                                    ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}
                                `}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* ── User profile area ─────────────────────────────────────── */}
            <div className="p-3 mt-auto overflow-hidden border-t border-border/50 bg-muted/20">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                aria-label="Menu pengguna"
                            >
                                <div className="shrink-0">
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white font-semibold text-xs">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div
                                    className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                                        }`}
                                >
                                    <p className="text-xs font-bold truncate text-foreground">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate mt-0.5">
                                        {(user as any).role || user.email}
                                    </p>
                                </div>
                                {!isCollapsed && (
                                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2.5} />
                                )}
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-56 rounded-xl border-border/50 shadow-lg backdrop-blur-xl bg-background/95 z-[100]"
                            align="end"
                            side={isCollapsed ? 'right' : 'top'}
                            sideOffset={12}
                        >
                            <UserMenuContent user={user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    /* Fallback skeleton when user is not yet available */
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex items-center justify-center shrink-0">
                            <UserIcon className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                <div className="h-2.5 bg-muted rounded animate-pulse w-1/2" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
