import { Head, Link } from '@inertiajs/react';

import ResellerLayout from '@/layouts/reseller-layout';
import { create } from '@/routes/reseller/orders';

type ResellerStatus = {
    label: string;
    value: string;
};

type ResellerSummary = {
    city: string | null;
    code: string;
    name: string;
    status: ResellerStatus;
};

type ResellerStats = {
    current_points: number;
    orders_count: number;
    total_qty_purchased: number;
    total_spent: string;
};

type PointProgress = {
    current: number;
    progress: number;
    target: number;
};

type RecentOrder = {
    id: number;
    invoice_number: string;
    ordered_at: string;
    payment_status: ResellerStatus;
    potential_points: number;
    status: ResellerStatus;
    total_amount: string;
    total_qty: number;
};

type ResellerDashboardProps = {
    latestOrder: RecentOrder | null;
    points: PointProgress;
    recentOrders: RecentOrder[];
    reseller: ResellerSummary;
    stats: ResellerStats;
};

const statCards = [
    { key: 'orders_count', label: 'Total order', suffix: 'order' },
    { key: 'current_points', label: 'Poin aktif', suffix: 'poin' },
    { key: 'total_qty_purchased', label: 'Total pcs', suffix: 'pcs' },
] as const;

export default function ResellerDashboard({ latestOrder, points, recentOrders, reseller, stats }: ResellerDashboardProps) {
    return (
        <ResellerLayout title="Dashboard Reseller">
            <Head title="Dashboard Reseller" />

            <div className="space-y-8">
                <section className="rounded-3xl bg-linear-to-br from-amber-100 via-white to-emerald-100 p-6 shadow-sm ring-1 ring-amber-200/70 md:p-8">
                    <p className="text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">Dashboard reseller</p>
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-950 md:text-4xl">Halo, {reseller.name}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                                Pantau performa order, poin aktif, dan status pembelian terakhir dari satu tempat.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm ring-1 ring-amber-200/70">
                            <p className="font-semibold text-stone-900">{reseller.code}</p>
                            <p className="text-stone-500">{reseller.city ?? 'Kota belum diisi'} · {reseller.status.label}</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {statCards.map((card) => (
                        <div key={card.key} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                            <p className="text-sm font-medium text-stone-500">{card.label}</p>
                            <p className="mt-3 text-3xl font-bold text-stone-950">{stats[card.key].toLocaleString('id-ID')}</p>
                            <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">{card.suffix}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl bg-stone-950 p-6 text-white shadow-sm">
                        <p className="text-sm font-semibold text-amber-200">Progress poin</p>
                        <div className="mt-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-4xl font-bold">{points.current.toLocaleString('id-ID')}</p>
                                <p className="mt-1 text-sm text-stone-300">Target berikutnya {points.target.toLocaleString('id-ID')} poin</p>
                            </div>
                            <p className="text-sm font-semibold text-emerald-200">{points.progress}%</p>
                        </div>
                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-amber-300" style={{ width: `${points.progress}%` }} />
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                        <p className="text-sm font-semibold text-stone-950">Order terbaru</p>
                        {latestOrder ? (
                            <div className="mt-5 space-y-3 text-sm text-stone-600">
                                <div className="flex items-center justify-between gap-3">
                                    <span>Invoice</span>
                                    <span className="font-semibold text-stone-950">{latestOrder.invoice_number}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Status order</span>
                                    <span className="font-semibold text-stone-950">{latestOrder.status.label}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Total</span>
                                    <span className="font-semibold text-stone-950">{latestOrder.total_amount}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Potensi poin</span>
                                    <span className="font-semibold text-stone-950">{latestOrder.potential_points.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-5 text-sm leading-6 text-stone-500">Belum ada order. Mulai buat order pertama supaya progres reseller bisa tercatat.</p>
                        )}
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-stone-950">Riwayat order terakhir</p>
                            <p className="mt-1 text-sm text-stone-500">Tiga order terbaru yang tercatat di akun reseller ini.</p>
                        </div>
                        <Link
                            className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                            href={create.url()}
                        >
                            Buat Order Baru →
                        </Link>
                    </div>

                    <div className="mt-6 divide-y divide-stone-100">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="grid gap-3 py-4 text-sm md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr] md:items-center">
                                    <div>
                                        <p className="font-semibold text-stone-950">{order.invoice_number}</p>
                                        <p className="text-stone-500">{order.ordered_at}</p>
                                    </div>
                                    <p className="text-stone-600">{order.status.label}</p>
                                    <p className="text-stone-600">{order.total_qty.toLocaleString('id-ID')} pcs</p>
                                    <p className="font-semibold text-stone-950 md:text-right">{order.total_amount}</p>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-sm text-stone-500">Belum ada riwayat order.</p>
                        )}
                    </div>
                </section>
            </div>
        </ResellerLayout>
    );
}
