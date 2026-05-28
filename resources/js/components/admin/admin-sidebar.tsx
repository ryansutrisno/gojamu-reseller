import { Link } from '@inertiajs/react';

import type { User } from '@/types';

import { AdminNavGroup } from './admin-nav-group';
import { AdminUserCard } from './admin-user-card';
import type { AdminNavGroup as AdminNavGroupData } from './navigation';

type AdminSidebarProps = {
    groups: AdminNavGroupData[];
    user: User | null;
};

export function AdminSidebar({ groups, user }: AdminSidebarProps) {
    const displayName = user?.name ?? 'Admin';
    const initial = displayName.trim().charAt(0).toUpperCase() || 'A';

    return (
        <aside className="hidden min-h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-gojamu-950 p-6 text-white lg:flex lg:h-[100dvh]">
            <Link
                href="/"
                aria-label="Beranda GoJamu Reseller"
                className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gojamu-950"
            >
                <div className="grid size-11 place-items-center rounded-2xl bg-kunyit-500 text-xl shadow-lg shadow-kunyit-900/30">
                    🌿
                </div>
                <div>
                    <p className="text-sm font-semibold tracking-[0.28em] text-gojamu-100 uppercase">GoJamu</p>
                    <p className="text-lg font-bold leading-tight">Reseller</p>
                </div>
            </Link>

            <nav aria-label="Navigasi admin" className="admin-sidebar-scrollbar mt-10 min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
                {groups.map((group) => (
                    <AdminNavGroup key={group.label} {...group} />
                ))}
            </nav>

            <div className="mt-6 shrink-0">
                <AdminUserCard initial={initial} name={displayName} />
            </div>
        </aside>
    );
}
