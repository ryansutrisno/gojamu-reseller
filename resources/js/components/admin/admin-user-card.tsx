import { Form } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { logout } from '@/routes';

type AdminUserCardProps = {
    initial: string;
    name: string;
    roleLabel?: string;
};

export function AdminUserCard({ initial, name, roleLabel = 'Akses admin' }: AdminUserCardProps) {
    return (
        <div className="rounded-3xl bg-white/10 p-4 text-white ring-1 ring-white/10">
            <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-kunyit-500 text-lg font-black text-gojamu-950 shadow-lg shadow-kunyit-900/30">
                    {initial}
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-gojamu-100">Masuk sebagai</p>
                    <p className="truncate font-bold">{name}</p>
                    <p className="truncate text-xs text-gojamu-100/80">{roleLabel}</p>
                </div>
            </div>

            <Form action={logout.url()} className="mt-4" method="post">
                <Button type="submit" variant="soft" className="w-full bg-white/15 text-white hover:bg-white/25">
                    Keluar
                </Button>
            </Form>
        </div>
    );
}
