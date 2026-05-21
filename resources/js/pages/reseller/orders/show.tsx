import { Head, Link } from '@inertiajs/react';

import ResellerLayout from '@/layouts/reseller-layout';
import { create, index } from '@/routes/reseller/orders';

type OrderItem = {
    id: number;
    product_name: string;
    variant_name: string | null;
    sku: string;
    qty: number;
    price_per_pcs: number;
    subtotal: number;
    weight_gram: number;
};

type OrderDetail = {
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
    price_per_pcs: number;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    reseller_notes: string | null;
    warehouse: { id: number; name: string; code: string } | null;
    price_tier: { id: number; name: string } | null;
    items: OrderItem[];
};

type OrdersShowProps = {
    order: OrderDetail;
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    return value ? dateFormatter.format(new Date(value)) : '-';
}

export default function OrdersShow({ order }: OrdersShowProps) {
    return (
        <ResellerLayout title="Detail Order">
            <Head title={`Order ${order.invoice_number}`} />

            <section className="rounded-[2rem] bg-white p-5 shadow-sm shadow-gojamu-100 ring-1 ring-gojamu-100">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <Link href={index.url()} className="text-sm font-bold text-gojamu-700 hover:text-gojamu-950">← Kembali ke order</Link>
                        <h1 className="mt-3 text-2xl font-black text-gojamu-950">{order.invoice_number}</h1>
                        <p className="mt-2 text-sm text-herbal-600">Dibuat {formatDate(order.ordered_at)}</p>
                    </div>
                    <Link href={create.url()} className="inline-flex rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-black text-gojamu-950 transition hover:bg-kunyit-400">
                        Buat Order Lagi
                    </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-gojamu-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gojamu-700">Status</p>
                        <p className="mt-2 text-lg font-black text-gojamu-950">{order.status_label}</p>
                    </div>
                    <div className="rounded-2xl bg-kunyit-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-kunyit-800">Pembayaran</p>
                        <p className="mt-2 text-lg font-black text-gojamu-950 capitalize">{order.payment_status.replace('_', ' ')}</p>
                    </div>
                    <div className="rounded-2xl bg-herbal-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-herbal-700">Pengiriman</p>
                        <p className="mt-2 text-lg font-black text-gojamu-950 capitalize">{order.shipment_status.replace('_', ' ')}</p>
                    </div>
                </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-[2rem] bg-white p-5 shadow-sm shadow-gojamu-100 ring-1 ring-gojamu-100">
                    <h2 className="text-lg font-black text-gojamu-950">Item order</h2>
                    <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-herbal-100 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-black text-gojamu-950">{item.product_name}</p>
                                        <p className="mt-1 text-sm text-herbal-600">{item.variant_name ?? 'Tanpa varian'} · {item.sku}</p>
                                    </div>
                                    <div className="text-sm sm:text-right">
                                        <p className="font-black text-gojamu-950">{item.qty} pcs</p>
                                        <p className="text-herbal-600">{currency.format(item.price_per_pcs)}/pcs</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between border-t border-herbal-100 pt-3 text-sm">
                                    <span className="text-herbal-600">Subtotal</span>
                                    <strong className="text-gojamu-950">{currency.format(item.subtotal)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="rounded-[2rem] bg-gojamu-950 p-5 text-white shadow-xl shadow-gojamu-950/15">
                        <p className="text-sm font-bold text-gojamu-100">Ringkasan</p>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between"><span>Total pcs</span><strong>{order.total_qty} pcs</strong></div>
                            <div className="flex justify-between"><span>Tier</span><strong>{order.price_tier?.name ?? '-'}</strong></div>
                            <div className="flex justify-between"><span>Harga/pcs</span><strong>{currency.format(order.price_per_pcs)}</strong></div>
                            <div className="flex justify-between"><span>Subtotal</span><strong>{currency.format(order.subtotal)}</strong></div>
                            <div className="flex justify-between"><span>Ongkir</span><strong>{currency.format(order.shipping_cost)}</strong></div>
                            <div className="flex justify-between"><span>Diskon</span><strong>{currency.format(order.discount_amount)}</strong></div>
                            <div className="flex justify-between border-t border-white/15 pt-3 text-base"><span>Total</span><strong>{currency.format(order.total_amount)}</strong></div>
                            <div className="flex justify-between text-kunyit-200"><span>Potensi point</span><strong>{order.potential_points} pt</strong></div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm shadow-gojamu-100 ring-1 ring-gojamu-100">
                        <p className="text-sm font-black text-gojamu-950">Gudang</p>
                        <p className="mt-2 text-sm text-herbal-600">{order.warehouse ? `${order.warehouse.name} (${order.warehouse.code})` : '-'}</p>
                        {order.reseller_notes ? <p className="mt-4 rounded-2xl bg-herbal-50 p-3 text-sm text-herbal-700">{order.reseller_notes}</p> : null}
                    </div>
                </aside>
            </section>
        </ResellerLayout>
    );
}
