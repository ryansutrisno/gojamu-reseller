import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/admin/admin-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { adminNavigationGroups } from '@/components/admin/navigation';
import type { Auth } from '@/types';

type AdminLayoutProps = {
    children: ReactNode;
    title: string;
    eyebrow?: string;
};

type SharedProps = {
    auth: Auth;
};

export default function AdminLayout({ children, title, eyebrow = 'GoJamu Admin' }: AdminLayoutProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <AdminShell>
            <AdminSidebar groups={adminNavigationGroups} user={user} />

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <AdminTopbar eyebrow={eyebrow} title={title} user={user} />
                <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-8">{children}</div>
            </main>
        </AdminShell>
    );
}
