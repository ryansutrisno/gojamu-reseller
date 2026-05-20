import { Head } from '@inertiajs/react';

import { QuickActionsCard, type QuickActionItem } from '@/components/admin/dashboard/quick-actions-card';
import { RecentOrdersTable, type RecentOrder } from '@/components/admin/dashboard/recent-orders-table';
import { StatCard, type DashboardMetricTone } from '@/components/admin/dashboard/stat-card';
import { StockCard, type StockItem } from '@/components/admin/dashboard/stock-card';
import AdminLayout from '@/layouts/admin-layout';

type DashboardMetric = {
    helper: string;
    label: string;
    tone: DashboardMetricTone;
    value: string;
};

const metrics: DashboardMetric[] = [
    { helper: '+8 dari kemarin', label: 'Order hari ini', tone: 'gojamu', value: '24' },
    { helper: 'Manual payment', label: 'Omzet bulan ini', tone: 'kunyit', value: '48,2 jt' },
    { helper: 'Butuh verifikasi', label: 'Pending payment', tone: 'mahakunir', value: '5' },
    { helper: 'Reward reseller', label: 'Redeem pending', tone: 'nirlawa', value: '3' },
];

const recentOrders: RecentOrder[] = [
    { invoice: 'INV-00024', quantity: '75 pcs', reseller: 'Reseller Bandung', status: 'paid' },
    { invoice: 'INV-00023', quantity: '40 pcs', reseller: 'Reseller Solo', status: 'processing' },
    { invoice: 'INV-00022', quantity: '120 pcs', reseller: 'Reseller Jakarta', status: 'shipped' },
    { invoice: 'INV-00021', quantity: '12 pcs', reseller: 'Reseller Depok', status: 'pending' },
];

const stockItems: StockItem[] = [
    { name: 'Mahakunir', percent: 82, stock: '312 pcs', tone: 'mahakunir' },
    { name: 'Nirlawa', percent: 56, stock: '87 pcs', tone: 'nirlawa' },
    { name: 'Ko Gan Ti', percent: 24, stock: '24 pcs', tone: 'kunyit' },
];

const quickActions: QuickActionItem[] = [
    { description: 'Cocokkan mutasi dan tutup transaksi yang sudah masuk.', label: 'Verifikasi Bayar', tone: 'kunyit' },
    { description: 'Siapkan dokumen pengiriman untuk order yang sudah final.', label: 'Cetak Invoice', tone: 'gojamu' },
    { description: 'Input nomor resi agar reseller bisa pantau pengiriman.', label: 'Input Resi', tone: 'nirlawa' },
    { description: 'Tambah reseller baru tanpa ganggu alur operasional.', label: 'Tambah Reseller', tone: 'mahakunir' },
];

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard Admin" eyebrow="Ringkasan Operasional">
            <Head title="Dashboard Admin" />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <StatCard key={metric.label} {...metric} />
                ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                <RecentOrdersTable orders={recentOrders} />

                <aside className="space-y-4">
                    <StockCard items={stockItems} />
                    <QuickActionsCard actions={quickActions} />
                </aside>
            </section>
        </AdminLayout>
    );
}
