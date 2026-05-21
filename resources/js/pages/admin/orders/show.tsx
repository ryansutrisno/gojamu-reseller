import { Head, Link } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { index } from '@/routes/admin/orders';

type AdminOrderItem = {
    id: number;
    product_name: string;
    variant_name: string | null;
    sku: string;
    qty: number;
    price_per_pcs: number;
    subtotal: number;
};

type AdminOrderDetail = {
    id: number;
    invoice_number: string;
    status: string;
    payment_status: string;
    shipment_status: string;
    total_qty: number;
    price_per_pcs: number;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    potential_points: number;
    reseller_notes: string | null;
    reseller?: { name: string; reseller_code: string | null };
    warehouse?: { name: string; code: string } | null;
    price_tier?: { name: string } | null;
    items: AdminOrderItem[];
};

type AdminOrdersShowProps = {
    order: AdminOrderDetail;
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

export default function AdminOrdersShow({ order }: AdminOrdersShowProps) {
    return (
        <AdminLayout title={order.invoice_number} eyebrow="Detail Order">
            <Head title={order.invoice_number} />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <Link href={index.url()} className="text-sm font-bold text-gojamu-700 hover:text-gojamu-950">← Kembali ke daftar order</Link>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                    <div>
                        <h1 className="text-2xl font-black text-gojamu-950">{order.invoice_number}</h1>
                        <p className="mt-2 text-sm text-herbal-600">{order.reseller?.name ?? '-'} · {order.reseller?.reseller_code ?? 'Kode reseller belum ada'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                        <span className="rounded-2xl bg-gojamu-50 px-3 py-2 text-gojamu-700">{order.status.replace('_', ' ')}</span>
                        <span className="rounded-2xl bg-kunyit-50 px-3 py-2 text-kunyit-800">{order.payment_status.replace('_', ' ')}</span>
                        <span className="rounded-2xl bg-herbal-50 px-3 py-2 text-herbal-700">{order.shipment_status.replace('_', ' ')}</span>
                    </div>
                </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <h2 className="text-lg font-black text-gojamu-950">Item order</h2>
                    <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-herbal-100 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-black text-gojamu-950">{item.product_name}</p>
                                        <p className="mt-1 text-sm text-herbal-600">{item.variant_name ?? '-'} · {item.sku}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-black text-gojamu-950">{item.qty} pcs</p>
                                        <p className="text-herbal-600">{currency.format(item.subtotal)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="rounded-3xl bg-gojamu-950 p-5 text-white shadow-xl shadow-gojamu-950/15">
                    <p className="text-sm font-bold text-gojamu-100">Ringkasan admin</p>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between"><span>Total pcs</span><strong>{order.total_qty} pcs</strong></div>
                        <div className="flex justify-between"><span>Tier</span><strong>{order.price_tier?.name ?? '-'}</strong></div>
                        <div className="flex justify-between"><span>Gudang</span><strong>{order.warehouse ? `${order.warehouse.name} (${order.warehouse.code})` : '-'}</strong></div>
                        <div className="flex justify-between"><span>Subtotal</span><strong>{currency.format(order.subtotal)}</strong></div>
                        <div className="flex justify-between"><span>Ongkir</span><strong>{currency.format(order.shipping_cost)}</strong></div>
                        <div className="flex justify-between"><span>Diskon</span><strong>{currency.format(order.discount_amount)}</strong></div>
                        <div className="flex justify-between border-t border-white/15 pt-3 text-base"><span>Total</span><strong>{currency.format(order.total_amount)}</strong></div>
                        <div className="flex justify-between text-kunyit-200"><span>Potensi point</span><strong>{order.potential_points} pt</strong></div>
                    </div>
                    {order.reseller_notes ? <p className="mt-5 rounded-2xl bg-white/10 p-3 text-sm text-gojamu-50">{order.reseller_notes}</p> : null}
                </aside>
            </section>
        </AdminLayout>
    );
}
