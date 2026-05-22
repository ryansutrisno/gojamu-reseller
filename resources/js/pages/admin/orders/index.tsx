import { Head, Link } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { show } from '@/routes/admin/orders';

type AdminOrder = {
    id: number;
    invoice_number: string;
    reseller_name: string;
    status: string;
    status_label: string;
    payment_status: string;
    shipment_status: string;
    total_qty: number;
    total_amount: number;
    ordered_at: string | null;
};

type AdminOrdersIndexProps = {
    orders: AdminOrder[];
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

export default function AdminOrdersIndex({ orders }: AdminOrdersIndexProps) {
    return (
        <AdminLayout title="Order Reseller" eyebrow="Order Core">
            <Head title="Order Reseller" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gojamu-600">Operasional</p>
                <h1 className="mt-1 text-2xl font-black text-gojamu-950">Daftar order reseller</h1>
                <p className="mt-2 text-sm text-herbal-600">Pantau invoice yang dibuat reseller sebelum masuk proses pembayaran dan pengiriman.</p>
            </section>

            <section className="mt-5 overflow-hidden rounded-3xl border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-herbal-100 text-sm">
                        <thead className="bg-gojamu-50 text-left text-xs font-black uppercase tracking-[0.14em] text-gojamu-700">
                            <tr>
                                <th className="px-5 py-4">Invoice</th>
                                <th className="px-5 py-4">Reseller</th>
                                <th className="px-5 py-4">Qty</th>
                                <th className="px-5 py-4">Total</th>
                                <th className="px-5 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-herbal-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gojamu-50/50">
                                    <td className="px-5 py-4 font-black text-gojamu-950">
                                        <Link href={show.url(order.id)} className="hover:text-gojamu-700">{order.invoice_number}</Link>
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">{order.reseller_name}</td>
                                    <td className="px-5 py-4 text-herbal-700">{order.total_qty} pcs</td>
                                    <td className="px-5 py-4 font-bold text-gojamu-950">{currency.format(order.total_amount)}</td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-kunyit-50 px-3 py-1 text-xs font-bold text-kunyit-800">{order.status_label}</span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-herbal-500">Belum ada order reseller.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
}
