import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type AdminProductVariant = {
    id: number;
    sku: string;
    name: string;
    stock_available: number;
};

type AdminProduct = {
    id: number;
    sku: string;
    name: string;
    weight_gram: number;
    status: string;
    status_label: string;
    color_key: string | null;
    color_hex: string | null;
    variants: AdminProductVariant[];
};

type AdminProductsIndexProps = {
    products: AdminProduct[];
};

type AdjustStockState = {
    product: AdminProduct;
    variant_id: number | '';
    adjustment: number | '';
    notes: string;
};

function statusTone(status: string): 'success' | 'warning' {
    return status === 'active' ? 'success' : 'warning';
}

export default function AdminProductsIndex({
    products,
}: AdminProductsIndexProps) {
    const [adjustStock, setAdjustStock] = useState<AdjustStockState | null>(
        null,
    );
    const [adjusting, setAdjusting] = useState(false);

    function openAdjustModal(product: AdminProduct) {
        setAdjustStock({
            product,
            variant_id: product.variants.length === 1
                ? product.variants[0].id
                : '',
            adjustment: '',
            notes: '',
        });
    }

    function handleAdjustSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!adjustStock) {
            return;
        }

        setAdjusting(true);

        router.post(
            `/admin/products/${adjustStock.product.id}/adjust-stock`,
            {
                variant_id: adjustStock.variant_id,
                adjustment: adjustStock.adjustment,
                notes: adjustStock.notes,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setAdjusting(false);
                    setAdjustStock(null);
                },
            },
        );
    }

    return (
        <AdminLayout title="Produk" eyebrow="Master Data">
            <Head title="Produk" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                            Master Data
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Daftar Produk
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Kelola katalog produk dan stok yang tersedia.
                        </p>
                    </div>
                    <Link href="/admin/products/create">
                        <Button id="btn-add-product" variant="primary">
                            Tambah Produk
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-3xl border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-herbal-100 text-sm">
                        <thead className="bg-gojamu-50 text-left text-xs font-black tracking-[0.14em] text-gojamu-700 uppercase">
                            <tr>
                                <th className="px-5 py-4">SKU</th>
                                <th className="px-5 py-4">Nama</th>
                                <th className="px-5 py-4">Berat</th>
                                <th className="px-5 py-4">Stok</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-herbal-100">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gojamu-50/50"
                                >
                                    <td className="px-5 py-4 font-black text-gojamu-950">
                                        {product.sku}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        <div className="flex items-center gap-2">
                                            {product.color_hex ? (
                                                <span
                                                    className="inline-block size-4 rounded-full border border-herbal-200"
                                                    style={{
                                                        backgroundColor:
                                                            product.color_hex,
                                                    }}
                                                />
                                            ) : null}
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {product.weight_gram} g
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {product.variants[0]
                                            ?.stock_available ?? 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge
                                            tone={statusTone(product.status)}
                                        >
                                            {product.status_label}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                            >
                                                <Button
                                                    id={`btn-edit-product-${product.id}`}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                id={`btn-adjust-stock-${product.id}`}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    openAdjustModal(product)
                                                }
                                            >
                                                Adjust Stok
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-herbal-500"
                                    >
                                        Belum ada produk.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Adjust Stock Modal */}
            {adjustStock ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-gojamu-100 bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-black text-gojamu-950">
                            Adjust Stok
                        </h2>
                        <p className="text-herbal-600 mt-1 text-sm">
                            {adjustStock.product.name} ({adjustStock.product.sku})
                        </p>

                        <form
                            onSubmit={handleAdjustSubmit}
                            className="mt-5 space-y-4"
                        >
                            {adjustStock.product.variants.length > 1 ? (
                                <div>
                                    <label
                                        htmlFor="adjust-variant"
                                        className="block text-sm font-semibold text-gojamu-950"
                                    >
                                        Varian
                                    </label>
                                    <select
                                        id="adjust-variant"
                                        value={adjustStock.variant_id}
                                        onChange={(e) =>
                                            setAdjustStock({
                                                ...adjustStock,
                                                variant_id: e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            })
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                    >
                                        <option value="">
                                            Pilih varian
                                        </option>
                                        {adjustStock.product.variants.map(
                                            (variant) => (
                                                <option
                                                    key={variant.id}
                                                    value={variant.id}
                                                >
                                                    {variant.name} (
                                                    {variant.sku}) — Stok:{' '}
                                                    {variant.stock_available}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            ) : null}

                            <div>
                                <label
                                    htmlFor="adjust-amount"
                                    className="block text-sm font-semibold text-gojamu-950"
                                >
                                    Jumlah Penyesuaian (negatif untuk
                                    pengurangan)
                                </label>
                                <input
                                    id="adjust-amount"
                                    type="number"
                                    value={adjustStock.adjustment}
                                    onChange={(e) =>
                                        setAdjustStock({
                                            ...adjustStock,
                                            adjustment: e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        })
                                    }
                                    className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="adjust-notes"
                                    className="block text-sm font-semibold text-gojamu-950"
                                >
                                    Catatan (wajib)
                                </label>
                                <textarea
                                    id="adjust-notes"
                                    rows={3}
                                    value={adjustStock.notes}
                                    onChange={(e) =>
                                        setAdjustStock({
                                            ...adjustStock,
                                            notes: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    id="btn-submit-adjust"
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        adjusting ||
                                        !adjustStock.variant_id ||
                                        adjustStock.adjustment === '' ||
                                        !adjustStock.notes
                                    }
                                >
                                    {adjusting
                                        ? 'Menyimpan...'
                                        : 'Simpan'}
                                </Button>
                                <Button
                                    id="btn-cancel-adjust"
                                    variant="ghost"
                                    onClick={() => setAdjustStock(null)}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
