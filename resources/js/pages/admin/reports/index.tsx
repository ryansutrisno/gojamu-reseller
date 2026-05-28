import { Head } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeadCell } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import reports from '@/routes/admin/reports';

type ReportFilters = {
    end_date: string;
    payment_status: string;
    start_date: string;
    status: string;
};

type ReportSummary = {
    orders_count: number;
    potential_points: number;
    total_amount: number;
    total_qty: number;
};

type StatusOption = {
    label: string;
    value: string;
};

type ReportOrder = {
    id: number;
    invoice_number: string;
    ordered_at: string | null;
    payment_status: StatusOption;
    potential_points: number;
    reseller_code: string;
    reseller_name: string;
    status: StatusOption;
    total_amount: string;
    total_qty: number;
};

type AdminReportsProps = {
    filters: ReportFilters;
    orders: ReportOrder[];
    paymentStatusOptions: StatusOption[];
    statusOptions: StatusOption[];
    summary: ReportSummary;
};

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

const statusTone = (status: string) => {
    if (['paid', 'completed'].includes(status)) {
        return 'success' as const;
    }

    if (['processing', 'packed', 'waiting_verification'].includes(status)) {
        return 'warning' as const;
    }

    if (['shipped'].includes(status)) {
        return 'info' as const;
    }

    if (['failed', 'cancelled', 'rejected'].includes(status)) {
        return 'danger' as const;
    }

    return 'neutral' as const;
};

export default function AdminReportsIndex({ filters, orders, paymentStatusOptions, statusOptions, summary }: AdminReportsProps) {
    const exportUrl = reports.export.url({ query: filters });

    return (
        <AdminLayout title="Laporan Admin">
            <Head title="Laporan Admin" />

            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950 p-6 text-white shadow-2xl shadow-stone-950/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Reports & Export</p>
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Laporan Dasar</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-200">
                                Pantau order, status pembayaran, potensi poin, dan export CSV sesuai rentang tanggal.
                            </p>
                        </div>
                        <a
                            className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-200"
                            href={exportUrl}
                        >
                            Export CSV
                        </a>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total order</CardDescription>
                            <CardTitle>{formatNumber(summary.orders_count)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total pcs</CardDescription>
                            <CardTitle>{formatNumber(summary.total_qty)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total omzet</CardDescription>
                            <CardTitle>{formatRupiah(summary.total_amount)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Potensi poin</CardDescription>
                            <CardTitle>{formatNumber(summary.potential_points)}</CardTitle>
                        </CardHeader>
                    </Card>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter laporan</CardTitle>
                        <CardDescription>Gunakan filter untuk melihat laporan dan export data yang sama.</CardDescription>
                    </CardHeader>
                    <form action={reports.index.url()} className="grid gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-5" method="get">
                        <label className="space-y-2 text-sm font-bold text-stone-700">
                            Dari tanggal
                            <input
                                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                defaultValue={filters.start_date}
                                name="start_date"
                                type="date"
                            />
                        </label>
                        <label className="space-y-2 text-sm font-bold text-stone-700">
                            Sampai tanggal
                            <input
                                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                defaultValue={filters.end_date}
                                name="end_date"
                                type="date"
                            />
                        </label>
                        <label className="space-y-2 text-sm font-bold text-stone-700">
                            Status order
                            <select
                                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                defaultValue={filters.status}
                                name="status"
                            >
                                <option value="all">Semua status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="space-y-2 text-sm font-bold text-stone-700">
                            Status pembayaran
                            <select
                                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                defaultValue={filters.payment_status}
                                name="payment_status"
                            >
                                <option value="all">Semua pembayaran</option>
                                {paymentStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="flex items-end">
                            <button className="w-full rounded-2xl bg-stone-950 px-5 py-3 text-sm font-black text-white transition hover:bg-stone-800" type="submit">
                                Terapkan Filter
                            </button>
                        </div>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order terbaru</CardTitle>
                        <CardDescription>Menampilkan maksimal 100 order terbaru dari filter aktif.</CardDescription>
                    </CardHeader>
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeadCell>Invoice</TableHeadCell>
                                <TableHeadCell>Reseller</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Pembayaran</TableHeadCell>
                                <TableHeadCell>Qty</TableHeadCell>
                                <TableHeadCell>Total</TableHeadCell>
                                <TableHeadCell>Tanggal</TableHeadCell>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <TableCell className="font-black text-stone-950">{order.invoice_number}</TableCell>
                                        <TableCell>
                                            <div className="font-bold text-stone-900">{order.reseller_name}</div>
                                            <div className="text-xs font-semibold text-stone-500">{order.reseller_code}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge tone={statusTone(order.status.value)}>{order.status.label}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge tone={statusTone(order.payment_status.value)}>{order.payment_status.label}</Badge>
                                        </TableCell>
                                        <TableCell>{formatNumber(order.total_qty)}</TableCell>
                                        <TableCell>{order.total_amount}</TableCell>
                                        <TableCell>{order.ordered_at ?? '-'}</TableCell>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <TableCell className="py-8 text-center text-sm font-semibold text-stone-500" colSpan={7}>
                                        Belum ada order pada filter ini.
                                    </TableCell>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminLayout>
    );
}
