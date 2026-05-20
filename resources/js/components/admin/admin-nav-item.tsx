import { Badge } from '@/components/ui/badge';

import type { AdminNavItem as AdminNavItemData } from './navigation';

type AdminNavItemProps = AdminNavItemData;

export function AdminNavItem({ active = false, badge, label }: AdminNavItemProps) {
    return (
        <button
            type="button"
            aria-current={active ? 'page' : undefined}
            className={[
                'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gojamu-950',
                active
                    ? 'bg-white text-gojamu-950 shadow-lg shadow-black/10'
                    : 'text-gojamu-100 hover:bg-white/10 hover:text-white',
            ]
                .join(' ')}
        >
            <span>{label}</span>
            {badge !== undefined ? <Badge tone="warning">{badge}</Badge> : null}
        </button>
    );
}
