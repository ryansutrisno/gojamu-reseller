import { Head, Link } from '@inertiajs/react';

import ResellerLayout from '@/layouts/reseller-layout';
import { dashboard } from '@/routes/reseller';
import { create, show } from '@/routes/reseller/orders';

type OrderSummary = {
    id: number;
    invoice_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    shipment_status: string;
    total_qty: number;
    total_amount: number;
    potential_points: number;
    ordered_at: string | null;
    items_count: number;
};

type OrdersIndexProps = {
    orders: OrderSummary[];
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    return value ? dateFormatter.format(new Date(value)) : '-';
}

function statusTone(status: string): string {
    if (status === 'cancelled') {
        return 'bg-red-50 text-red-700 ring-red-100';
    }

    if (status === 'completed') {
        return 'bg-gojamu-50 text-gojamu-700 ring-gojamu-100';
    }

    if (status === 'pending_payment') {
        return 'bg-kunyit-50 text-kunyit-800 ring-kunyit-100';
    }

    return 'bg-herbal-50 text-herbal-700 ring-herbal-100';
}

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <ResellerLayout title="Order Saya">
            <Head title="Order Saya" />

            <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 shadow-gojamu-100 ring-gojamu-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase">
                            <Link
                                href={dashboard.url()}
                                className="text-gojamu-700 hover:text-gojamu-950"
                            >
                                Dashboard
                            </Link>
                            <span className="text-gojamu-300">/</span>
                            <span className="text-gojamu-400">Order Saya</span>
                        </div>
                        <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                            Order core
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Daftar order reseller
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Pantau invoice, status pembayaran, dan potensi point
                            dari order yang Mas Bro buat.
                        </p>
                    </div>
                    <Link
                        href={create.url()}
                        className="hover:bg-kunyit-400 inline-flex items-center justify-center rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-black text-gojamu-950 shadow-sm shadow-kunyit-100 transition"
                    >
                        Buat Order Baru →
                    </Link>
                </div>
            </section>

            <section className="mt-5 space-y-3">
                {orders.length === 0 ? (
                    <div className="border-gojamu-200 rounded-[2rem] border border-dashed bg-white p-8 text-center">
                        <p className="text-lg font-black text-gojamu-950">
                            Belum ada order
                        </p>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Mulai dari katalog, pilih paket, lalu sistem
                            hitungkan tier harga otomatis. Santai, kalkulatornya
                            yang kerja keras 😄
                        </p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <Link
                            key={order.id}
                            href={show.url(order.id)}
                            className="block rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-black text-gojamu-950">
                                            {order.invoice_number}
                                        </h2>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(order.status)}`}
                                        >
                                            {order.status_label}
                                        </span>
                                    </div>
                                    <p className="text-herbal-600 mt-2 text-sm">
                                        {formatDate(order.ordered_at)} ·{' '}
                                        {order.items_count} item ·{' '}
                                        {order.total_qty} pcs
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:min-w-md">
                                    <div className="rounded-2xl bg-gojamu-50 p-3">
                                        <p className="text-xs font-semibold text-gojamu-700">
                                            Total
                                        </p>
                                        <p className="mt-1 font-black text-gojamu-950">
                                            {currency.format(
                                                order.total_amount,
                                            )}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-kunyit-50 p-3">
                                        <p className="text-kunyit-800 text-xs font-semibold">
                                            Potensi point
                                        </p>
                                        <p className="mt-1 font-black text-gojamu-950">
                                            {order.potential_points} pt
                                        </p>
                                    </div>
                                    <div className="col-span-2 rounded-2xl bg-herbal-50 p-3 sm:col-span-1">
                                        <p className="text-xs font-semibold text-herbal-700">
                                            Pembayaran
                                        </p>
                                        <p className="mt-1 font-black text-gojamu-950 capitalize">
                                            {order.payment_status.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </section>
        </ResellerLayout>
    );
}
