import { Form, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { logout } from '@/routes';
import { dashboard } from '@/routes/reseller';
import {
    create as resellerOrdersCreate,
    index as resellerOrdersIndex,
} from '@/routes/reseller/orders';
import { index as resellerRewardsIndex } from '@/routes/reseller/rewards';
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

type BottomNavItem = {
    excludedPaths?: string[];
    href: string;
    label: string;
    match: 'exact' | 'prefix';
};

const bottomItems: BottomNavItem[] = [
    { href: dashboard.url(), label: 'Home', match: 'exact' },
    { href: resellerOrdersCreate.url(), label: 'Buat Order', match: 'exact' },
    {
        href: resellerOrdersIndex.url(),
        label: 'Order Saya',
        excludedPaths: [resellerOrdersCreate.url()],
        match: 'prefix',
    },
    { href: resellerRewardsIndex.url(), label: 'Reward', match: 'prefix' },
];

const normalizeUrl = (url: string) =>
    url.split('?')[0]?.replace(/\/$/, '') || '/';

const isActiveBottomItem = (
    currentUrl: string,
    item: BottomNavItem,
): boolean => {
    const normalizedCurrentUrl = normalizeUrl(currentUrl);
    const normalizedHref = normalizeUrl(item.href);

    if (
        item.excludedPaths?.some(
            (path) => normalizedCurrentUrl === normalizeUrl(path),
        )
    ) {
        return false;
    }

    if (item.match === 'exact') {
        return normalizedCurrentUrl === normalizedHref;
    }

    return (
        normalizedCurrentUrl === normalizedHref ||
        normalizedCurrentUrl.startsWith(`${normalizedHref}/`)
    );
};

export default function ResellerLayout({
    children,
    title,
}: ResellerLayoutProps) {
    const { props, url } = usePage<SharedProps>();
    const { auth } = props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-gojamu-50 text-herbal-950">
            <header className="sticky top-0 z-20 border-b border-gojamu-100 bg-white/90 px-4 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div>
                            <Link
                                href={dashboard.url()}
                                className="inline-block rounded text-xs font-bold tracking-[0.24em] text-gojamu-700 uppercase transition hover:text-gojamu-950 focus-visible:ring-2 focus-visible:ring-gojamu-500 focus-visible:outline-none"
                            >
                                🌿 GoJamu Reseller
                            </Link>
                            <h1 className="text-xl font-black text-gojamu-950 md:text-2xl">
                                {title}
                            </h1>
                        </div>
                    </div>

                    <nav
                        className="hidden items-center gap-6 md:flex"
                        aria-label="Navigasi desktop"
                    >
                        {bottomItems.map((item) => {
                            const isActive = isActiveBottomItem(url, item);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={[
                                        'text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-gojamu-500 focus-visible:outline-none',
                                        isActive
                                            ? 'text-gojamu-950 underline decoration-kunyit-500 decoration-2 underline-offset-8'
                                            : 'text-gojamu-700 hover:text-gojamu-950',
                                    ].join(' ')}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right text-sm md:block">
                            <p className="font-bold">
                                {user?.name ?? 'Reseller'}
                            </p>
                            <p className="text-gojamu-700">Portal reseller</p>
                        </div>
                        <Form action={logout.url()} method="post">
                            <button className="rounded-2xl bg-gojamu-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-gojamu-950/15 transition hover:bg-gojamu-700">
                                Keluar
                            </button>
                        </Form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:py-8">
                {children}
            </main>

            <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gojamu-100 bg-white/95 px-2 py-2 shadow-2xl shadow-gojamu-950/10 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
                    {bottomItems.map((item) => {
                        const isActive = isActiveBottomItem(url, item);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={[
                                    'rounded-2xl px-2 py-2 text-xs font-bold',
                                    isActive
                                        ? 'bg-gojamu-700 text-white'
                                        : 'text-gojamu-700',
                                ].join(' ')}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
