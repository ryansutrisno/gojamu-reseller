import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import ResellerLayout from '@/layouts/reseller-layout';
import { dashboard } from '@/routes/reseller';
import { index, store } from '@/routes/reseller/orders';

type CatalogVariant = {
    id: number;
    name: string;
    sku: string;
    weight_gram: number;
    stock_available: number;
};

type CatalogProduct = {
    id: number;
    name: string;
    sku: string;
    color_key: string | null;
    color_hex: string | null;
    variants: CatalogVariant[];
};

type PriceTier = {
    id: number;
    name: string;
    min_qty: number;
    max_qty: number | null;
    price_per_pcs: number;
};

type OrdersCreateProps = {
    catalog: CatalogProduct[];
    priceTiers: PriceTier[];
};

type OrderLinePayload = {
    product_variant_id: number;
    qty: number;
};

type OrderForm = {
    reseller_notes: string;
    items: OrderLinePayload[];
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

function resolveTier(
    priceTiers: PriceTier[],
    totalQty: number,
): PriceTier | null {
    if (totalQty <= 0) {
        return null;
    }

    return (
        priceTiers.find(
            (tier) =>
                tier.min_qty <= totalQty &&
                (tier.max_qty === null || tier.max_qty >= totalQty),
        ) ??
        [...priceTiers]
            .filter((tier) => tier.min_qty <= totalQty)
            .sort((a, b) => b.min_qty - a.min_qty)[0] ??
        null
    );
}

export default function OrdersCreate({
    catalog,
    priceTiers,
}: OrdersCreateProps) {
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const form = useForm<OrderForm>({
        items: [],
        reseller_notes: '',
    });

    const selectedItems = useMemo<OrderLinePayload[]>(() => {
        return Object.entries(quantities)
            .map(([variantId, qty]) => ({
                product_variant_id: Number(variantId),
                qty,
            }))
            .filter((item) => item.qty > 0);
    }, [quantities]);

    const totalQty = selectedItems.reduce((sum, item) => sum + item.qty, 0);
    const activeTier = resolveTier(priceTiers, totalQty);
    const pricePerPcs = activeTier?.price_per_pcs ?? 0;
    const subtotal = totalQty * pricePerPcs;
    const potentialPoints = Math.floor(totalQty / 10);
    const itemError = form.errors.items as string | undefined;

    function updateQty(variant: CatalogVariant, value: string): void {
        const parsedQty = Math.max(0, Number.parseInt(value || '0', 10));
        const qty = Number.isNaN(parsedQty)
            ? 0
            : Math.min(parsedQty, variant.stock_available);

        setQuantities((current) => ({
            ...current,
            [variant.id]: qty,
        }));
    }

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        form.transform(() => ({
            items: selectedItems,
            reseller_notes: form.data.reseller_notes,
        }));

        form.post(store.url(), {
            preserveScroll: true,
        });
    }

    return (
        <ResellerLayout title="Buat Order">
            <Head title="Buat Order" />

            <form
                onSubmit={submit}
                className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]"
            >
                <section className="space-y-5">
                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 shadow-gojamu-100 ring-gojamu-100">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase">
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
                            <span className="text-gojamu-400">Buat Order</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Pilih produk dan jumlah pcs
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Harga tier otomatis mengikuti total pcs dalam satu
                            order. Pilih paketnya, biar mesin hitung yang
                            pusing, Mas Bro 😄
                        </p>
                        {itemError ? (
                            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                {itemError}
                            </p>
                        ) : null}
                    </div>

                    {catalog.map((product) => (
                        <article
                            key={product.id}
                            className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 shadow-gojamu-100 ring-gojamu-100"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                                        {product.sku}
                                    </p>
                                    <h2 className="mt-1 text-xl font-black text-gojamu-950">
                                        {product.name}
                                    </h2>
                                </div>
                                <span className="rounded-full bg-gojamu-50 px-3 py-1 text-xs font-bold text-gojamu-700">
                                    {product.variants.length} varian
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                {product.variants.map((variant) => {
                                    const qty = quantities[variant.id] ?? 0;

                                    return (
                                        <label
                                            key={variant.id}
                                            className="rounded-3xl border border-herbal-100 p-4 transition focus-within:border-gojamu-300 focus-within:ring-2 focus-within:ring-gojamu-100"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-black text-gojamu-950">
                                                        {variant.name}
                                                    </p>
                                                    <p className="text-herbal-600 mt-1 text-sm">
                                                        {variant.sku} ·{' '}
                                                        {variant.weight_gram} gr
                                                    </p>
                                                    <p className="mt-2 text-xs font-bold text-gojamu-700">
                                                        Stok tersedia:{' '}
                                                        {
                                                            variant.stock_available
                                                        }{' '}
                                                        pcs
                                                    </p>
                                                </div>
                                                <input
                                                    min={0}
                                                    max={
                                                        variant.stock_available
                                                    }
                                                    type="number"
                                                    value={qty}
                                                    onChange={(event) =>
                                                        updateQty(
                                                            variant,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="border-herbal-200 w-24 rounded-2xl border bg-white px-3 py-2 text-right text-sm font-black text-gojamu-950 transition outline-none focus:border-gojamu-500"
                                                />
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </section>

                <aside className="lg:sticky lg:top-28 lg:self-start">
                    <div className="rounded-[2rem] bg-gojamu-950 p-5 text-white shadow-xl shadow-gojamu-950/15">
                        <p className="text-sm font-bold text-gojamu-100">
                            Preview order
                        </p>
                        <h2 className="mt-2 text-2xl font-black">
                            {totalQty} pcs
                        </h2>
                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Tier aktif</span>
                                <strong>{activeTier?.name ?? '-'}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Harga/pcs</span>
                                <strong>{currency.format(pricePerPcs)}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <strong>{currency.format(subtotal)}</strong>
                            </div>
                            <div className="text-kunyit-200 flex justify-between">
                                <span>Potensi point</span>
                                <strong>{potentialPoints} pt</strong>
                            </div>
                        </div>

                        <label className="mt-5 block">
                            <span className="text-sm font-bold text-gojamu-100">
                                Catatan reseller
                            </span>
                            <textarea
                                value={form.data.reseller_notes}
                                onChange={(event) =>
                                    form.setData(
                                        'reseller_notes',
                                        event.target.value,
                                    )
                                }
                                rows={4}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-gojamu-100 focus:border-kunyit-300"
                                placeholder="Contoh: kirim setelah pembayaran terkonfirmasi."
                            />
                            {form.errors.reseller_notes ? (
                                <span className="mt-2 block text-sm font-bold text-red-200">
                                    {form.errors.reseller_notes}
                                </span>
                            ) : null}
                        </label>

                        <button
                            type="submit"
                            disabled={form.processing || totalQty === 0}
                            className="hover:bg-kunyit-400 mt-5 w-full rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-black text-gojamu-950 shadow-sm shadow-kunyit-900/20 transition disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/70"
                        >
                            {form.processing
                                ? 'Membuat order...'
                                : 'Buat Pending Payment'}
                        </button>
                    </div>
                </aside>
            </form>
        </ResellerLayout>
    );
}
