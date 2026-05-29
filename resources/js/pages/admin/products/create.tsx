import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type CreateProductForm = {
    sku: string;
    name: string;
    description: string;
    weight_gram: number | '';
    status: string;
    color_key: string;
    color_hex: string;
    sort_order: number | '';
};

export default function AdminProductsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<CreateProductForm>({
            sku: '',
            name: '',
            description: '',
            weight_gram: '',
            status: 'active',
            color_key: '',
            color_hex: '',
            sort_order: '',
        });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/products');
    }

    return (
        <AdminLayout title="Tambah Produk" eyebrow="Master Data">
            <Head title="Tambah Produk" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                    Master Data
                </p>
                <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                    Tambah Produk Baru
                </h1>
                <p className="text-herbal-600 mt-2 text-sm">
                    Isi data produk baru untuk ditambahkan ke katalog.
                </p>
            </section>

            <section className="mt-5 rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="input-sku"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                SKU
                            </label>
                            <input
                                id="input-sku"
                                type="text"
                                value={data.sku}
                                onChange={(e) =>
                                    setData('sku', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.sku ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.sku}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-name"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Nama Produk
                            </label>
                            <input
                                id="input-name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.name ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.name}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-weight"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Berat (gram)
                            </label>
                            <input
                                id="input-weight"
                                type="number"
                                value={data.weight_gram}
                                onChange={(e) =>
                                    setData(
                                        'weight_gram',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.weight_gram ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.weight_gram}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-status"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Status
                            </label>
                            <select
                                id="input-status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                            {errors.status ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.status}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-color-key"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Kunci Warna
                            </label>
                            <input
                                id="input-color-key"
                                type="text"
                                value={data.color_key}
                                onChange={(e) =>
                                    setData('color_key', e.target.value)
                                }
                                placeholder="contoh: hijau, merah"
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.color_key ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.color_key}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-color-hex"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Kode Warna (Hex)
                            </label>
                            <input
                                id="input-color-hex"
                                type="text"
                                value={data.color_hex}
                                onChange={(e) =>
                                    setData('color_hex', e.target.value)
                                }
                                placeholder="contoh: #4CAF50"
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.color_hex ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.color_hex}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-sort-order"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Urutan
                            </label>
                            <input
                                id="input-sort-order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.sort_order ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.sort_order}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="input-description"
                            className="block text-sm font-semibold text-gojamu-950"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="input-description"
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                        />
                        {errors.description ? (
                            <p className="mt-1 text-xs text-mahakunir-600">
                                {errors.description}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            id="btn-submit-product"
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Produk'}
                        </Button>
                        <Link href="/admin/products">
                            <Button
                                id="btn-back-products"
                                variant="ghost"
                            >
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </form>
            </section>
        </AdminLayout>
    );
}
