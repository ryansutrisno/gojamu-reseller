import { Head } from '@inertiajs/react';

import { QuickActionsCard } from '@/components/admin/dashboard/quick-actions-card';
import type { QuickActionItem } from '@/components/admin/dashboard/quick-actions-card';
import { RecentOrdersTable } from '@/components/admin/dashboard/recent-orders-table';
import type { RecentOrder } from '@/components/admin/dashboard/recent-orders-table';
import { StatCard } from '@/components/admin/dashboard/stat-card';
import type { DashboardMetricTone } from '@/components/admin/dashboard/stat-card';
import { StockCard } from '@/components/admin/dashboard/stock-card';
import type { StockItem } from '@/components/admin/dashboard/stock-card';
import { Card, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as rewardRedemptionsIndex } from '@/routes/admin/reward-redemptions';

type DashboardMetric = {
    helper: string;
    label: string;
    tone: DashboardMetricTone;
    value: string;
};

type StatMetricData = {
    value: string;
    helper: string;
};

type TopResellerData = {
    initials: string;
    name: string;
    points: string;
};

type AdminDashboardProps = {
    metrics: {
        orders_today: StatMetricData;
        omzet_month: StatMetricData;
        pending_payment: StatMetricData;
        redeem_pending: StatMetricData;
    };
    recent_orders: RecentOrder[];
    stock_items: StockItem[];
    top_resellers: TopResellerData[];
};

export function TopResellersCard({ items }: { items: TopResellerData[] }) {
    return (
        <Card className="p-5">
            <p className="text-sm font-semibold tracking-[0.18em] text-kunyit-500 uppercase">
                Klasemen
            </p>
            <CardTitle className="mt-1 text-xl text-gojamu-950">
                Top reseller (point)
            </CardTitle>

            <ul className="mt-5 space-y-3" role="list">
                {items.map((item) => (
                    <li
                        key={item.name}
                        className="flex items-center justify-between gap-4 border-b border-herbal-50 py-2 last:border-0 last:pb-0"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="grid size-8 place-items-center rounded-2xl bg-gojamu-50 text-sm font-bold text-gojamu-700">
                                {item.initials}
                            </div>
                            <span className="truncate font-bold text-herbal-700">
                                {item.name}
                            </span>
                        </div>
                        <span className="shrink-0 rounded-full bg-kunyit-100 px-3 py-1 text-xs font-black text-kunyit-900">
                            {item.points}
                        </span>
                    </li>
                ))}
                {items.length === 0 ? (
                    <li className="py-2 text-sm text-herbal-500">
                        Belum ada data reseller.
                    </li>
                ) : null}
            </ul>
        </Card>
    );
}

export default function AdminDashboard({
    metrics,
    recent_orders,
    stock_items,
    top_resellers,
}: AdminDashboardProps) {
    const dashboardMetrics: DashboardMetric[] = [
        {
            helper: metrics.orders_today.helper,
            label: 'Order hari ini',
            tone: 'gojamu',
            value: metrics.orders_today.value,
        },
        {
            helper: metrics.omzet_month.helper,
            label: 'Omzet bulan ini',
            tone: 'kunyit',
            value: metrics.omzet_month.value,
        },
        {
            helper: metrics.pending_payment.helper,
            label: 'Pending payment',
            tone: 'mahakunir',
            value: metrics.pending_payment.value,
        },
        {
            helper: metrics.redeem_pending.helper,
            label: 'Redeem pending',
            tone: 'nirlawa',
            value: metrics.redeem_pending.value,
        },
    ];

    const quickActions: QuickActionItem[] = [
        {
            description: `${metrics.pending_payment.value} bukti menunggu.`,
            label: 'Verifikasi Bayar',
            tone: 'kunyit',
            href: adminOrdersIndex.url(),
        },
        {
            description: 'Order Paid siap cetak dokumen.',
            label: 'Cetak Invoice',
            tone: 'gojamu',
            href: adminOrdersIndex.url(),
        },
        {
            description: 'Input nomor resi untuk pengiriman.',
            label: 'Input Resi',
            tone: 'nirlawa',
            href: adminOrdersIndex.url(),
        },
        {
            description: `${metrics.redeem_pending.value} redeem menunggu.`,
            label: 'Redeem Reward',
            tone: 'mahakunir',
            href: rewardRedemptionsIndex.url(),
        },
    ];

    return (
        <AdminLayout title="Dashboard Admin" eyebrow="Ringkasan Operasional">
            <Head title="Dashboard Admin" />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardMetrics.map((metric) => (
                    <StatCard key={metric.label} {...metric} />
                ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                <RecentOrdersTable orders={recent_orders} />

                <aside className="space-y-4">
                    <StockCard items={stock_items} />
                    <TopResellersCard items={top_resellers} />
                    <QuickActionsCard actions={quickActions} />
                </aside>
            </section>
        </AdminLayout>
    );
}
