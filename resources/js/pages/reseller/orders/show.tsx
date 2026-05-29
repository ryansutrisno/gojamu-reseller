import { Head, Link, useForm } from '@inertiajs/react';

import ResellerLayout from '@/layouts/reseller-layout';
import { dashboard } from '@/routes/reseller';
import { create, index } from '@/routes/reseller/orders';
import { store as storePaymentProof } from '@/routes/reseller/orders/payment-proof';

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

type PaymentDetail = {
    id: number;
    method: string;
    amount: number;
    status: string;
    status_label: string;
    paid_at: string | null;
    verified_at: string | null;
    rejected_reason: string | null;
} | null;

type PaymentProofDetail = {
    id: number;
    status: string;
    status_label: string;
    notes: string | null;
    uploaded_at: string | null;
    uploader_name: string | null;
};

type PaymentInstructions = {
    bank_name: string;
    account_number: string;
    account_name: string;
    amount: number;
    steps: string[];
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
    earned_points: number;
    completed_at: string | null;
    ordered_at: string | null;
    price_per_pcs: number;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    reseller_notes: string | null;
    warehouse: { id: number; name: string; code: string } | null;
    price_tier: { id: number; name: string } | null;
    items: OrderItem[];
    payment: PaymentDetail;
    payment_proofs: PaymentProofDetail[];
    latest_payment_proof: PaymentProofDetail | null;
    payment_instructions: PaymentInstructions;
    can_upload_payment_proof: boolean;
    shipment: ShipmentDetail;
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

function statusTone(status: string): string {
    if (status === 'approved' || status === 'paid') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
    }

    if (status === 'rejected') {
        return 'bg-red-50 text-red-700 ring-red-100';
    }

    return 'bg-amber-50 text-amber-700 ring-amber-100';
}

export default function OrdersShow({ order }: OrdersShowProps) {
    const { data, setData, post, processing, progress, errors, reset } =
        useForm<{ proof: File | null; notes: string }>({
            notes: '',
            proof: null,
        });

    const submitProof = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(storePaymentProof.url(order.id), {
            forceFormData: true,
            onSuccess: () => reset('proof', 'notes'),
            preserveScroll: true,
        });
    };

    return (
        <ResellerLayout title="Detail Order">
            <Head title={`Order ${order.invoice_number}`} />

            <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase">
                            <Link
                                href={dashboard.url()}
                                className="text-gojamu-700 hover:text-gojamu-950"
                            >
                                Dashboard
                            </Link>
                            <span className="text-gojamu-300">/</span>
                            <Link
                                href={index.url()}
                                className="text-gojamu-700 hover:text-gojamu-950"
                            >
                                Order Saya
                            </Link>
                            <span className="text-gojamu-300">/</span>
                            <span className="text-gojamu-400">Detail</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-slate-950">
                            {order.invoice_number}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Dibuat {formatDate(order.ordered_at)}
                        </p>
                    </div>
                    <Link
                        className="hover:bg-kunyit-400 rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-bold text-gojamu-950 shadow-sm shadow-kunyit-100 transition"
                        href={create.url()}
                    >
                        Buat Order Lagi
                    </Link>
                </div>
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                        Status
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                        {order.status_label}
                    </p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                        Pembayaran
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                        {order.payment?.status_label ??
                            order.payment_status.replace('_', ' ')}
                    </p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                        Pengiriman
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                        {order.shipment?.status_label ??
                            order.shipment_status.replace('_', ' ')}
                    </p>
                </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-5">
                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
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
                                        <p className="text-xs text-slate-400">
                                            {item.weight_gram} gram/pcs
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

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-gojamu-600 text-xs font-semibold tracking-[0.2em] uppercase">
                                    Tracking Pengiriman
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-slate-950">
                                    Status Paket
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Nomor resi akan muncul setelah gudang
                                    mengirim pesanan.
                                </p>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                {order.shipment?.status_label ??
                                    order.shipment_status.replace('_', ' ')}
                            </span>
                        </div>

                        {order.shipment ? (
                            <div className="mt-4 grid gap-3 rounded-3xl bg-gojamu-50 p-4 text-sm text-slate-700 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                        Kurir
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-slate-950">
                                        {order.shipment.courier ?? '-'}{' '}
                                        {order.shipment.service ?? ''}
                                    </p>
                                    <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                        Nomor Resi
                                    </p>
                                    <p className="mt-1 rounded-2xl bg-white px-3 py-2 font-mono text-base font-bold break-all text-gojamu-700 ring-1 ring-gojamu-100">
                                        {order.shipment.tracking_number ??
                                            'Belum tersedia'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                        Alamat Penerima
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
                                    <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                                        <p>
                                            Dikirim:{' '}
                                            {formatDate(
                                                order.shipment.shipped_at,
                                            )}
                                        </p>
                                        <p>
                                            Diterima:{' '}
                                            {formatDate(
                                                order.shipment.delivered_at,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                Pesanan belum masuk tahap pengiriman. Tenang Mas
                                Bro, nanti resinya muncul di sini.
                            </div>
                        )}
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-gojamu-600 text-xs font-semibold tracking-[0.2em] uppercase">
                                    Instruksi Pembayaran
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-slate-950">
                                    Transfer Manual
                                </h2>
                            </div>
                            <p className="text-xl font-bold text-gojamu-700">
                                {currency.format(
                                    order.payment_instructions.amount,
                                )}
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-3xl bg-gojamu-50 p-4 text-sm text-slate-700 md:grid-cols-3">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                    Bank
                                </p>
                                <p className="mt-1 font-bold text-slate-950">
                                    {order.payment_instructions.bank_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                    Nomor Rekening
                                </p>
                                <p className="mt-1 font-bold text-slate-950">
                                    {order.payment_instructions.account_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                    Atas Nama
                                </p>
                                <p className="mt-1 font-bold text-slate-950">
                                    {order.payment_instructions.account_name}
                                </p>
                            </div>
                        </div>

                        <ol className="mt-4 space-y-2 text-sm text-slate-600">
                            {order.payment_instructions.steps.map(
                                (step, index) => (
                                    <li className="flex gap-2" key={step}>
                                        <span className="bg-gojamu-600 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ),
                            )}
                        </ol>
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    Bukti Pembayaran
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Upload bukti transfer agar tim finance bisa
                                    verifikasi.
                                </p>
                            </div>
                            {order.latest_payment_proof ? (
                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(
                                        order.latest_payment_proof.status,
                                    )}`}
                                >
                                    {order.latest_payment_proof.status_label}
                                </span>
                            ) : null}
                        </div>

                        {order.can_upload_payment_proof ? (
                            <form
                                className="mt-4 space-y-4"
                                onSubmit={submitProof}
                            >
                                <div>
                                    <label
                                        className="text-sm font-semibold text-slate-700"
                                        htmlFor="proof"
                                    >
                                        File bukti transfer
                                    </label>
                                    <input
                                        accept="image/*,application/pdf"
                                        className="focus:border-gojamu-400 mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-gojamu-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gojamu-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        id="proof"
                                        name="proof"
                                        onChange={(event) =>
                                            setData(
                                                'proof',
                                                event.target.files?.[0] ?? null,
                                            )
                                        }
                                        type="file"
                                    />
                                    {errors.proof ? (
                                        <p className="mt-2 text-sm font-medium text-red-600">
                                            {errors.proof}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-semibold text-slate-700"
                                        htmlFor="notes"
                                    >
                                        Catatan opsional
                                    </label>
                                    <textarea
                                        className="focus:border-gojamu-400 mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:ring-4 focus:ring-gojamu-100 focus:outline-none"
                                        id="notes"
                                        onChange={(event) =>
                                            setData('notes', event.target.value)
                                        }
                                        placeholder="Contoh: transfer dari rekening BCA a.n. Ryan"
                                        value={data.notes}
                                    />
                                    {errors.notes ? (
                                        <p className="mt-2 text-sm font-medium text-red-600">
                                            {errors.notes}
                                        </p>
                                    ) : null}
                                </div>

                                {progress ? (
                                    <div className="space-y-2">
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="bg-gojamu-600 h-full rounded-full transition-all"
                                                style={{
                                                    width: `${progress.percentage ?? 0}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500">
                                            Upload {progress.percentage ?? 0}%
                                        </p>
                                    </div>
                                ) : null}

                                <button
                                    className="bg-gojamu-600 shadow-gojamu-200 rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gojamu-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    disabled={processing || !data.proof}
                                    type="submit"
                                >
                                    {processing
                                        ? 'Mengupload...'
                                        : 'Upload Bukti Pembayaran'}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                Upload bukti pembayaran tidak tersedia untuk
                                status pembayaran saat ini.
                            </div>
                        )}

                        {order.payment_proofs.length > 0 ? (
                            <div className="mt-5 space-y-3">
                                <h3 className="text-sm font-bold text-slate-950">
                                    Riwayat Bukti
                                </h3>
                                {order.payment_proofs.map((proof) => (
                                    <div
                                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                                        key={proof.id}
                                    >
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-950">
                                                    {proof.status_label}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Diupload{' '}
                                                    {formatDate(
                                                        proof.uploaded_at,
                                                    )}{' '}
                                                    oleh{' '}
                                                    {proof.uploader_name ??
                                                        'Reseller'}
                                                </p>
                                            </div>
                                            <span
                                                className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(
                                                    proof.status,
                                                )}`}
                                            >
                                                {proof.status_label}
                                            </span>
                                        </div>
                                        {proof.notes ? (
                                            <p className="mt-3 text-sm text-slate-600">
                                                {proof.notes}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-sm">
                        <h2 className="text-lg font-bold">Ringkasan</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">Total Qty</span>
                                <span className="font-semibold">
                                    {order.total_qty} pcs
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">
                                    Harga / pcs
                                </span>
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
                                    Potensi poin: {order.potential_points} ·
                                    Poin didapat: {order.earned_points}
                                </p>
                                {order.completed_at ? (
                                    <p className="mt-1 text-xs text-white/50">
                                        Selesai:{' '}
                                        {formatDate(order.completed_at)}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gojamu-100">
                        <h2 className="text-lg font-bold text-slate-950">
                            Gudang
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {order.warehouse?.name ?? '-'} (
                            {order.warehouse?.code ?? '-'})
                        </p>
                        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                            Price Tier
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                            {order.price_tier?.name ?? '-'}
                        </p>
                        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                            Catatan
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            {order.reseller_notes ?? 'Tidak ada catatan.'}
                        </p>
                    </div>
                </aside>
            </section>
        </ResellerLayout>
    );
}
