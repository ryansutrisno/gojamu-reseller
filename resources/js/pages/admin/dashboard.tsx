import { Head } from '@inertiajs/react';

import { QuickActionsCard } from '@/components/admin/dashboard/quick-actions-card';
import type { QuickActionItem } from '@/components/admin/dashboard/quick-actions-card';
import { RecentOrdersTable } from '@/components/admin/dashboard/recent-orders-table';
import type { RecentOrder } from '@/components/admin/dashboard/recent-orders-table';
import { StatCard } from '@/components/admin/dashboard/stat-card';
import type { DashboardMetricTone } from '@/components/admin/dashboard/stat-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';

type DashboardMetric = {
    helper: string;
    label: string;
    tone: DashboardMetricTone;
    value: string;
};

type OperationSummaryItem = {
    description: string;
    label: string;
    value: string;
};

type AdminDashboardProps = {
    metrics: DashboardMetric[];
    operationSummary: OperationSummaryItem[];
    recentOrders: RecentOrder[];
};

const quickActions: QuickActionItem[] = [
    {
        description: 'Pantau pembayaran manual yang perlu dicek finance.',
        label: 'Verifikasi payment',
        tone: 'gojamu',
    },
    {
        description: 'Lihat ringkasan penjualan dan ekspor CSV.',
        label: 'Laporan dasar',
        tone: 'kunyit',
    },
    {
        description: 'Pastikan order lunas masuk antrean proses.',
        label: 'Fulfillment',
        tone: 'mahakunir',
    },
    {
        description: 'Pantau reseller aktif yang siap order.',
        label: 'Reseller aktif',
        tone: 'nirlawa',
    },
];

export default function AdminDashboard({ metrics, operationSummary, recentOrders }: AdminDashboardProps) {
    return (
        <AdminLayout title="Dashboard Admin">
            <Head title="Dashboard Admin" />

            <div className="space-y-8">
                <section>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-kunyit-600">Admin Command Center</p>
                    <h1 className="mt-3 text-3xl font-bold text-gojamu-950">Dashboard Admin</h1>
                    <p className="mt-2 max-w-2xl text-sm text-herbal-600">
                        Ringkasan order, pembayaran manual, dan aktivitas reseller dari data operasional terbaru.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <StatCard key={metric.label} {...metric} />
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
                    <RecentOrdersTable orders={recentOrders} />

                    <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle>Ringkasan Operasional</CardTitle>
                            <CardDescription>Prioritas kerja tim hari ini berdasarkan status order dan pembayaran.</CardDescription>
                        </CardHeader>

                        <div className="space-y-3">
                            {operationSummary.map((item) => (
                                <div key={item.label} className="rounded-3xl border border-herbal-100 bg-herbal-50/70 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gojamu-950">{item.label}</p>
                                            <p className="mt-1 text-xs leading-5 text-herbal-600">{item.description}</p>
                                        </div>
                                        <p className="text-2xl font-bold text-kunyit-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                <QuickActionsCard actions={quickActions} />
            </div>
        </AdminLayout>
    );
}
