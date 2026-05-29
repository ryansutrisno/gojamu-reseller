import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as rewardRedemptionsIndex } from '@/routes/admin/reward-redemptions';
import type { UserRole } from '@/types';

const operationalAdminRoles: UserRole[] = [
    'super_admin',
    'admin',
    'warehouse',
    'finance',
];
const programAdminRoles: UserRole[] = ['super_admin', 'admin'];

export type AdminNavItem = {
    active?: boolean;
    activePattern?: string;
    allowedRoles?: UserRole[];
    badge?: number | string;
    href?: string;
    label: string;
};

export type AdminNavGroup = {
    items: AdminNavItem[];
    label: string;
};

const baseAdminNavigationGroups: AdminNavGroup[] = [
    {
        label: 'Utama',
        items: [
            {
                activePattern: adminDashboard.url(),
                allowedRoles: operationalAdminRoles,
                href: adminDashboard.url(),
                label: 'Dashboard',
            },
            {
                activePattern: adminOrdersIndex.url(),
                allowedRoles: operationalAdminRoles,
                href: adminOrdersIndex.url(),
                label: 'Order',
            },
        ],
    },
    {
        label: 'Program',
        items: [
            {
                activePattern: rewardRedemptionsIndex.url(),
                allowedRoles: programAdminRoles,
                href: rewardRedemptionsIndex.url(),
                label: 'Redeem Reward',
            },
        ],
    },
];

const normalizeUrl = (url: string) =>
    url.split('?')[0]?.replace(/\/$/, '') || '/';

const isActiveNavigationItem = (
    currentUrl: string,
    item: AdminNavItem,
): boolean => {
    if (!item.activePattern) {
        return false;
    }

    const normalizedCurrentUrl = normalizeUrl(currentUrl);
    const normalizedPattern = normalizeUrl(item.activePattern);

    if (normalizedPattern === adminDashboard.url()) {
        return normalizedCurrentUrl === normalizedPattern;
    }

    return (
        normalizedCurrentUrl === normalizedPattern ||
        normalizedCurrentUrl.startsWith(`${normalizedPattern}/`)
    );
};

export const makeAdminNavigationGroups = (
    role: UserRole | undefined,
    currentUrl: string,
): AdminNavGroup[] => {
    return baseAdminNavigationGroups
        .map((group) => ({
            ...group,
            items: group.items
                .filter((item) =>
                    role
                        ? (item.allowedRoles ?? operationalAdminRoles).includes(
                              role,
                          )
                        : false,
                )
                .map((item) => ({
                    ...item,
                    active: isActiveNavigationItem(currentUrl, item),
                })),
        }))
        .filter((group) => group.items.length > 0);
};
