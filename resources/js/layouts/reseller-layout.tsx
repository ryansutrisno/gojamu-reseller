import { Form, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { logout } from '@/routes';
import type { User } from '@/types';

type ResellerLayoutProps = {
    children: ReactNode;
    title: string;
};

type SharedProps = {
    auth: {
        user: User | null;
    };
};

const bottomItems = ['Home', 'Order', 'Histori', 'Point', 'Reward'];

export default function ResellerLayout({ children, title }: ResellerLayoutProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-gojamu-50 text-herbal-950">
            <header className="sticky top-0 z-20 border-b border-gojamu-100 bg-white/90 px-4 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-[0.24em] text-gojamu-700 uppercase">🌿 GoJamu Reseller</p>
                        <h1 className="text-xl font-black text-gojamu-950 md:text-2xl">{title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right text-sm md:block">
                            <p className="font-bold">{user?.name ?? 'Reseller'}</p>
                            <p className="text-gojamu-700">Portal reseller</p>
                        </div>
                        <Form {...logout.form()}>
                            <button className="rounded-2xl bg-gojamu-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-gojamu-950/15 transition hover:bg-gojamu-700">
                                Keluar
                            </button>
                        </Form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:py-8">{children}</main>

            <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gojamu-100 bg-white/95 px-2 py-2 shadow-2xl shadow-gojamu-950/10 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
                    {bottomItems.map((item) => (
                        <button
                            key={item}
                            className={[
                                'rounded-2xl px-2 py-2 text-xs font-bold',
                                item === 'Home' ? 'bg-gojamu-700 text-white' : 'text-gojamu-700',
                            ].join(' ')}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
