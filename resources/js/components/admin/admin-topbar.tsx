import { Button } from '@/components/ui/button';
import type { User } from '@/types';

type AdminTopbarProps = {
    eyebrow: string;
    title: string;
    user: User | null;
};

export function AdminTopbar({ eyebrow, title, user }: AdminTopbarProps) {
    const displayName = user?.name ?? 'Admin';
    const initial = displayName.trim().charAt(0).toUpperCase() || 'A';

    return (
        <header className="sticky top-0 z-20 border-b border-gojamu-100 bg-white/85 px-5 py-5 backdrop-blur md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.24em] text-gojamu-700 uppercase">
                        {eyebrow}
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-gojamu-950 md:text-3xl">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        className="hidden min-w-72 justify-start border-gojamu-100 bg-gojamu-50 text-herbal-500 md:inline-flex"
                    >
                        <span className="text-base">⌕</span>
                        <span>Cari order, reseller, produk...</span>
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="rounded-full border-kunyit-100 bg-kunyit-100 text-kunyit-900 hover:bg-kunyit-100"
                        aria-label="Buka notifikasi"
                    >
                        🔔
                    </Button>

                    <div
                        className="grid size-10 place-items-center rounded-full bg-gojamu-700 font-bold text-white"
                        title={displayName}
                    >
                        {initial}
                    </div>
                </div>
            </div>
        </header>
    );
}
