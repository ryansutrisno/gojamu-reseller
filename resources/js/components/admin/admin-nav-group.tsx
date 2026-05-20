import type { AdminNavGroup as AdminNavGroupData } from './navigation';
import { AdminNavItem } from './admin-nav-item';

type AdminNavGroupProps = AdminNavGroupData;

export function AdminNavGroup({ items, label }: AdminNavGroupProps) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gojamu-300">{label}</p>
            <ul className="space-y-1" role="list">
                {items.map((item) => (
                    <li key={item.label}>
                        <AdminNavItem {...item} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
