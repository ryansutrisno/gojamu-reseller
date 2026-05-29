import { Head, Link, useForm } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import {
    complete,
    index,
    process as processOrder,
    ship,
} from '@/routes/admin/orders';
import {
    approve,
    reject,
    show as showPaymentProof,
} from '@/routes/admin/orders/payment-proofs';

type AdminOrderItem = {
    id: number;
    product_name: string;
    variant_name: string | null;
    sku: string;
    qty: number;
    price_per_pcs: number;
    subtotal: number;
};

type PaymentDetail = {
    id: number;
    method: string;
    amount: number;
    status: string;
    status_label: string;
    paid_at: string | null;
    verified_at: string | null;
    rejected_reason: string | null;
    verifier_name: string | null;
} | null;

type PaymentProofDetail = {
    id: number;
    status: string;
    status_label: string;
    notes: string | null;
    uploaded_at: string | null;
    uploader_name: string | null;
    view_url?: string;
    can_approve: boolean;
    can_reject: boolean;
};

type ShipmentDetail = {
    id: number;
    status: string;
    status_label: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_city: string;
    recipient_province: string;
    recipient_postal_code: string | null;
    courier: string | null;
    service: string | null;
    tracking_number: string | null;
    shipping_cost: number;
    shipped_at: string | null;
    delivered_at: string | null;
} | null;

type FulfillmentActions = {
    can_process: boolean;
    can_ship: boolean;
    can_complete: boolean;
};

type AdminOrderDetail = {
    id: number;
    invoice_number: string;
    status: string;
    status_label?: string;
    payment_status: string;
    shipment_status: string;
    total_qty: number;
    price_per_pcs: number;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    potential_points: number;
    earned_points: number;
    completed_at?: string | null;
    reseller_notes: string | null;
    ordered_at?: string | null;
    reseller?: { name: string; reseller_code: string } | null;
    warehouse?: { name: string; code: string } | null;
    price_tier?: { name: string } | null;
    items: AdminOrderItem[];
    payment: PaymentDetail;
    payment_proofs: PaymentProofDetail[];
    latest_payment_proof: PaymentProofDetail | null;
    shipment: ShipmentDetail;
    fulfillment_actions: FulfillmentActions;
};

type AdminOrdersShowProps = {
    order: AdminOrderDetail;
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

function formatDate(value: string | null | undefined): string {
    return value ? dateFormatter.format(new Date(value)) : '-';
}

function statusTone(status: string): string {
    if (status === 'approved' || status === 'paid') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
    }

    if (status === 'rejected') {
        return 'bg-red-50 text-red-700 ring-red-100';
    }

    return 'bg-amber-50 text-amber-700 ring-amber-100';
}

function proofUrl(orderId: number, proof: PaymentProofDetail): string {
    return (
        proof.view_url ??
        showPaymentProof.url({ order: orderId, paymentProof: proof.id })
    );
}

export default function AdminOrdersShow({ order }: AdminOrdersShowProps) {
    const approveForm = useForm({});
    const rejectForm = useForm<{ reason: string }>({ reason: '' });
    const processForm = useForm({});
    const completeForm = useForm({});
    const shipForm = useForm<{
        courier: string;
        service: string;
        tracking_number: string;
        shipping_cost: string;
    }>({
        courier: order.shipment?.courier ?? '',
        service: order.shipment?.service ?? '',
        shipping_cost: String(order.shipping_cost ?? 0),
        tracking_number: order.shipment?.tracking_number ?? '',
    });

    const latestProof = order.latest_payment_proof;

    const submitApprove = (proof: PaymentProofDetail) => {
        approveForm.post(
            approve.url({ order: order.id, paymentProof: proof.id }),
            {
                preserveScroll: true,
            },
        );
    };

    const submitReject = (
        event: React.FormEvent<HTMLFormElement>,
        proof: PaymentProofDetail,
    ) => {
        event.preventDefault();

        rejectForm.post(
            reject.url({ order: order.id, paymentProof: proof.id }),
            {
                onSuccess: () => rejectForm.reset('reason'),
                preserveScroll: true,
            },
        );
    };

    const submitProcess = () => {
        processForm.post(processOrder.url(order.id), {
            preserveScroll: true,
        });
    };

    const submitShip = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        shipForm.post(ship.url(order.id), {
            preserveScroll: true,
        });
    };

    const submitComplete = () => {
        completeForm.post(complete.url(order.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={order.invoice_number} eyebrow="Detail Order">
            <Head title={order.invoice_number} />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm">
                <Link
                    className="text-gojamu-600 text-sm font-semibold hover:text-gojamu-700"
                    href={index.url()}
                >
                    ← Kembali ke daftar order
                </Link>
                <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_0.7fr] md:items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-950">
                            {order.invoice_number}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {order.reseller?.name ?? '-'} ·{' '}
                            {order.reseller?.reseller_code ?? '-'}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Dibuat {formatDate(order.ordered_at)}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <span className="rounded-full bg-gojamu-50 px-3 py-1 text-xs font-bold text-gojamu-700">
                            {order.status_label ?? order.status}
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                            {order.payment?.status_label ??
                                order.payment_status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {order.shipment_status}
                        </span>
                    </div>
                </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-5">
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-950">
                            Item Order
                        </h2>
                        <div className="mt-4 divide-y divide-slate-100">
                            {order.items.map((item) => (
                                <div
                                    className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                                    key={item.id}
                                >
                                    <div>
                                        <p className="font-semibold text-slate-950">
                                            {item.product_name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {item.variant_name ??
                                                'Varian default'}{' '}
                                            · {item.sku}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="font-semibold text-slate-950">
                                            {item.qty} pcs
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {currency.format(
                                                item.price_per_pcs,
                                            )}{' '}
                                            / pcs
                                        </p>
                                        <p className="text-sm font-semibold text-gojamu-700">
                                            {currency.format(item.subtotal)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-gojamu-600 text-xs font-semibold tracking-[0.2em] uppercase">
                                    Fulfillment Gudang
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-slate-950">
                                    Pengiriman Manual
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Proses order, isi kurir dan resi, lalu
                                    selesaikan setelah paket diterima.
                                </p>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                {order.shipment?.status_label ??
                                    order.shipment_status}
                            </span>
                        </div>

                        {order.shipment ? (
                            <div className="mt-4 grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                        Penerima
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-950">
                                        {order.shipment.recipient_name}
                                    </p>
                                    <p>{order.shipment.recipient_phone}</p>
                                    <p>{order.shipment.recipient_address}</p>
                                    <p>
                                        {order.shipment.recipient_city},{' '}
                                        {order.shipment.recipient_province}{' '}
                                        {order.shipment.recipient_postal_code ??
                                            ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                        Tracking
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-950">
                                        {order.shipment.courier ?? '-'}{' '}
                                        {order.shipment.service ?? ''}
                                    </p>
                                    <p>
                                        {order.shipment.tracking_number ??
                                            'Nomor resi belum diisi.'}
                                    </p>
                                    <p>
                                        Ongkir:{' '}
                                        {currency.format(
                                            order.shipment.shipping_cost,
                                        )}
                                    </p>
                                    <p>
                                        Dikirim:{' '}
                                        {formatDate(order.shipment.shipped_at)}
                                    </p>
                                    <p>
                                        Diterima:{' '}
                                        {formatDate(
                                            order.shipment.delivered_at,
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                Shipment belum dibuat. Klik proses gudang
                                setelah pembayaran lunas.
                            </div>
                        )}

                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                            <div className="rounded-3xl bg-gojamu-50 p-4 ring-1 ring-gojamu-100">
                                <p className="text-sm font-semibold text-slate-950">
                                    1. Proses gudang
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Tandai order lunas agar masuk antrean
                                    packing.
                                </p>
                                <button
                                    className="bg-gojamu-600 mt-3 rounded-full px-4 py-2 text-sm font-bold text-white transition hover:bg-gojamu-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    disabled={
                                        !order.fulfillment_actions
                                            .can_process ||
                                        processForm.processing
                                    }
                                    onClick={submitProcess}
                                    type="button"
                                >
                                    {processForm.processing
                                        ? 'Memproses...'
                                        : 'Proses'}
                                </button>
                            </div>

                            <form
                                className="rounded-3xl bg-white p-4 ring-1 ring-slate-200"
                                onSubmit={submitShip}
                            >
                                <p className="text-sm font-semibold text-slate-950">
                                    2. Input resi
                                </p>
                                <div className="mt-3 space-y-3">
                                    <input
                                        className="focus:border-gojamu-400 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        onChange={(event) =>
                                            shipForm.setData(
                                                'courier',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Kurir, contoh: JNE"
                                        value={shipForm.data.courier}
                                    />
                                    {shipForm.errors.courier ? (
                                        <p className="text-sm font-medium text-red-600">
                                            {shipForm.errors.courier}
                                        </p>
                                    ) : null}
                                    <input
                                        className="focus:border-gojamu-400 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        onChange={(event) =>
                                            shipForm.setData(
                                                'service',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Layanan, contoh: REG"
                                        value={shipForm.data.service}
                                    />
                                    <input
                                        className="focus:border-gojamu-400 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        onChange={(event) =>
                                            shipForm.setData(
                                                'tracking_number',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Nomor resi"
                                        value={shipForm.data.tracking_number}
                                    />
                                    {shipForm.errors.tracking_number ? (
                                        <p className="text-sm font-medium text-red-600">
                                            {shipForm.errors.tracking_number}
                                        </p>
                                    ) : null}
                                    <input
                                        className="focus:border-gojamu-400 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        min="0"
                                        onChange={(event) =>
                                            shipForm.setData(
                                                'shipping_cost',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Ongkir"
                                        type="number"
                                        value={shipForm.data.shipping_cost}
                                    />
                                    {shipForm.errors.shipping_cost ? (
                                        <p className="text-sm font-medium text-red-600">
                                            {shipForm.errors.shipping_cost}
                                        </p>
                                    ) : null}
                                </div>
                                <button
                                    className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    disabled={
                                        !order.fulfillment_actions.can_ship ||
                                        shipForm.processing
                                    }
                                    type="submit"
                                >
                                    {shipForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Resi'}
                                </button>
                            </form>

                            <div className="rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                                <p className="text-sm font-semibold text-slate-950">
                                    3. Selesaikan
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Ubah order menjadi selesai dan berikan poin
                                    reseller.
                                </p>
                                <button
                                    className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    disabled={
                                        !order.fulfillment_actions
                                            .can_complete ||
                                        completeForm.processing
                                    }
                                    onClick={submitComplete}
                                    type="button"
                                >
                                    {completeForm.processing
                                        ? 'Memproses...'
                                        : 'Selesaikan'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-gojamu-600 text-xs font-semibold tracking-[0.2em] uppercase">
                                    Verifikasi Pembayaran
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-slate-950">
                                    Bukti Transfer
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cek bukti transfer sebelum approve atau
                                    reject pembayaran.
                                </p>
                            </div>
                            {latestProof ? (
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(
                                        latestProof.status,
                                    )}`}
                                >
                                    {latestProof.status_label}
                                </span>
                            ) : null}
                        </div>

                        {latestProof ? (
                            <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-950">
                                            Bukti terakhir:{' '}
                                            {latestProof.status_label}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Diupload{' '}
                                            {formatDate(
                                                latestProof.uploaded_at,
                                            )}{' '}
                                            oleh{' '}
                                            {latestProof.uploader_name ??
                                                'Reseller'}
                                        </p>
                                    </div>
                                    <a
                                        className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-gojamu-700 ring-1 ring-gojamu-100 transition hover:bg-gojamu-50"
                                        href={proofUrl(order.id, latestProof)}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        Lihat Bukti
                                    </a>
                                </div>
                                {latestProof.notes ? (
                                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-600">
                                        {latestProof.notes}
                                    </p>
                                ) : null}

                                {latestProof.can_approve ||
                                latestProof.can_reject ? (
                                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                        {latestProof.can_approve ? (
                                            <div className="rounded-3xl bg-white p-4 ring-1 ring-emerald-100">
                                                <p className="text-sm font-semibold text-slate-950">
                                                    Approve pembayaran
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Order akan ditandai lunas
                                                    dan siap diproses.
                                                </p>
                                                <button
                                                    className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                                    disabled={
                                                        approveForm.processing
                                                    }
                                                    onClick={() =>
                                                        submitApprove(
                                                            latestProof,
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    {approveForm.processing
                                                        ? 'Memproses...'
                                                        : 'Approve'}
                                                </button>
                                            </div>
                                        ) : null}

                                        {latestProof.can_reject ? (
                                            <form
                                                className="rounded-3xl bg-white p-4 ring-1 ring-red-100"
                                                onSubmit={(event) =>
                                                    submitReject(
                                                        event,
                                                        latestProof,
                                                    )
                                                }
                                            >
                                                <label
                                                    className="text-sm font-semibold text-slate-950"
                                                    htmlFor="reason"
                                                >
                                                    Reject pembayaran
                                                </label>
                                                <textarea
                                                    className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-red-300 focus:ring-4 focus:ring-red-100 focus:outline-none"
                                                    id="reason"
                                                    onChange={(event) =>
                                                        rejectForm.setData(
                                                            'reason',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Tulis alasan penolakan untuk reseller"
                                                    value={
                                                        rejectForm.data.reason
                                                    }
                                                />
                                                {rejectForm.errors.reason ? (
                                                    <p className="mt-2 text-sm font-medium text-red-600">
                                                        {
                                                            rejectForm.errors
                                                                .reason
                                                        }
                                                    </p>
                                                ) : null}
                                                <button
                                                    className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                                    disabled={
                                                        rejectForm.processing
                                                    }
                                                    type="submit"
                                                >
                                                    {rejectForm.processing
                                                        ? 'Memproses...'
                                                        : 'Reject'}
                                                </button>
                                            </form>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                Belum ada bukti pembayaran yang diupload
                                reseller.
                            </div>
                        )}

                        {order.payment_proofs.length > 0 ? (
                            <div className="mt-5 space-y-3">
                                <h3 className="text-sm font-bold text-slate-950">
                                    Riwayat Bukti
                                </h3>
                                {order.payment_proofs.map((proof) => (
                                    <div
                                        className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
                                        key={proof.id}
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-950">
                                                {proof.status_label}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDate(proof.uploaded_at)}{' '}
                                                ·{' '}
                                                {proof.uploader_name ??
                                                    'Reseller'}
                                            </p>
                                            {proof.notes ? (
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {proof.notes}
                                                </p>
                                            ) : null}
                                        </div>
                                        <a
                                            className="w-fit rounded-full px-4 py-2 text-sm font-bold text-gojamu-700 ring-1 ring-gojamu-100 transition hover:bg-gojamu-50"
                                            href={proofUrl(order.id, proof)}
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            Lihat
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                <aside className="space-y-5 rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
                    <h2 className="text-lg font-bold">Ringkasan Admin</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-white/60">Gudang</span>
                            <span className="font-semibold">
                                {order.warehouse?.name ?? '-'} (
                                {order.warehouse?.code ?? '-'})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Price Tier</span>
                            <span className="font-semibold">
                                {order.price_tier?.name ?? '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Total Qty</span>
                            <span className="font-semibold">
                                {order.total_qty} pcs
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Harga / pcs</span>
                            <span className="font-semibold">
                                {currency.format(order.price_per_pcs)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Subtotal</span>
                            <span className="font-semibold">
                                {currency.format(order.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Ongkir</span>
                            <span className="font-semibold">
                                {currency.format(order.shipping_cost)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Diskon</span>
                            <span className="font-semibold">
                                {currency.format(order.discount_amount)}
                            </span>
                        </div>
                        <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>
                                    {currency.format(order.total_amount)}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-white/60">
                                Potensi poin: {order.potential_points}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/70">
                        <p className="font-semibold text-white">Pembayaran</p>
                        <p className="mt-2">
                            Status:{' '}
                            {order.payment?.status_label ??
                                order.payment_status}
                        </p>
                        <p>
                            Nominal:{' '}
                            {currency.format(
                                order.payment?.amount ?? order.total_amount,
                            )}
                        </p>
                        <p>
                            Diverifikasi:{' '}
                            {formatDate(order.payment?.verified_at)}
                        </p>
                        <p>Oleh: {order.payment?.verifier_name ?? '-'}</p>
                        {order.payment?.rejected_reason ? (
                            <p className="mt-2 text-red-200">
                                Alasan reject: {order.payment.rejected_reason}
                            </p>
                        ) : null}
                    </div>

                    <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/70">
                        <p className="font-semibold text-white">
                            Catatan Reseller
                        </p>
                        <p className="mt-2">
                            {order.reseller_notes ?? 'Tidak ada catatan.'}
                        </p>
                    </div>
                </aside>
            </section>
        </AdminLayout>
    );
}
