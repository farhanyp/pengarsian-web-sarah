import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShieldAlert, Edit2, ShieldCheck, Mail, User as UserIcon } from 'lucide-react';
import EditRoleModal from './EditRoleModal';

import { UserData, UsersPaginated } from '@/types/users-management';

interface Props {
  users: UsersPaginated;
  filters: {
    search?: string;
  };
}

export default function UsersManagementPage({ users, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.get('/users', { search }, { preserveState: true, replace: true });
    }
  };

  const roleColors: Record<string, { bg: string; text: string; icon: any }> = {
    SUPERADMIN: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: ShieldAlert },
    ADMIN: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', icon: ShieldCheck },
    GURU: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: UserIcon },
    KEPALASEKOLAH: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', icon: UserIcon },
  };

  return (
    <>
      <Head title="Manajemen Pengguna" />

      {/* Top header */}
      <header className="w-full px-6 md:px-10 py-5 md:py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Manajemen Pengguna
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">
              Kelola role dan hak akses pengguna sistem ScholarSys.
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="p-6 md:p-10 space-y-8">

        {/* Data Table Section */}
        <section
          aria-labelledby="data-users-heading"
          className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.20)]"
        >
          {/* Table Action Bar */}
          <div className="px-6 py-5 border-b border-border/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/20">

            {/* Search */}
            <div className="w-full flex-1 xl:max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background hover:bg-muted/50 border border-border/50 rounded-xl text-foreground focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                placeholder="Cari nama, email..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto bg-background/50">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/30 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest w-16">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Pengguna</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kontak</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.data.map((user, index) => {
                  const RoleIcon = roleColors[user.role]?.icon || UserIcon;
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{users.from + index}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground block">{user.name}</span>
                            <span className="text-xs text-muted-foreground font-mono mt-0.5 block">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${roleColors[user.role]?.bg || 'bg-gray-100'} ${roleColors[user.role]?.text || 'text-gray-600'}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-all text-sm font-semibold"
                            title="Ubah Role"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Ubah Role</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <UserIcon className="w-8 h-8 opacity-20" />
                        <p className="text-sm font-medium">Tidak ada data pengguna ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.data.length > 0 && (
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Menampilkan <span className="text-foreground font-bold">{users.from}-{users.to}</span> dari <span className="text-foreground font-bold">{users.total}</span> pengguna
              </p>
              <div className="flex items-center gap-1">
                {users.links.map((link, i) => (
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

      <EditRoleModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />
    </>
  );
}
