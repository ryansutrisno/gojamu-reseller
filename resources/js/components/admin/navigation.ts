import { index as rewardRedemptionsIndex } from '@/routes/admin/reward-redemptions';

export type AdminNavItem = {
    active?: boolean;
    badge?: number | string;
    href?: string;
    label: string;
};

export type AdminNavGroup = {
    items: AdminNavItem[];
    label: string;
};

export const adminNavigationGroups: AdminNavGroup[] = [
    {
        label: 'Utama',
        items: [
            { active: true, label: 'Dashboard' },
            { badge: 24, label: 'Order' },
            { label: 'Reseller' },
            { label: 'Produk' },
        ],
    },
    {
        label: 'Operasional',
        items: [{ label: 'Pembayaran' }, { label: 'Gudang' }, { label: 'Pengiriman' }],
    },
    {
        label: 'Program',
        items: [{ label: 'Point' }, { href: rewardRedemptionsIndex.url(), label: 'Reward' }, { label: 'Laporan' }],
    },
];
