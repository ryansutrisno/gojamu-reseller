import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type AdminPriceTier = {
    id: number;
    name: string;
    min_qty: number;
    max_qty: number | null;
    price_per_pcs: number;
    status: string;
    status_label: string;
};

type AdminPriceTiersIndexProps = {
    priceTiers: AdminPriceTier[];
};

type PriceTierForm = {
    name: string;
    min_qty: number | '';
    max_qty: number | '';
    price_per_pcs: number | '';
    status: 'active' | 'inactive';
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

function statusTone(status: string): 'success' | 'warning' {
    return status === 'active' ? 'success' : 'warning';
}

export default function AdminPriceTiersIndex({
    priceTiers,
}: AdminPriceTiersIndexProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<PriceTierForm>({
            name: '',
            min_qty: '',
            max_qty: '',
            price_per_pcs: '',
            status: 'active',
        });

    function openCreateModal() {
        reset();
        clearErrors();
        setEditId(null);
        setIsOpen(true);
    }

    function openEditModal(tier: AdminPriceTier) {
        clearErrors();
        setEditId(tier.id);
        setData({
            name: tier.name,
            min_qty: tier.min_qty,
            max_qty: tier.max_qty ?? '',
            price_per_pcs: tier.price_per_pcs,
            status: tier.status as 'active' | 'inactive',
        });
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
        setEditId(null);
        reset();
        clearErrors();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editId) {
            put(`/admin/price-tiers/${editId}`, {
                onSuccess: () => handleClose(),
            });
        } else {
            post('/admin/price-tiers', {
                onSuccess: () => handleClose(),
            });
        }
    }

    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus tier harga ini?')) {
            return;
        }

        router.delete(`/admin/price-tiers/${id}`);
    }

    return (
        <AdminLayout title="Tier Harga" eyebrow="Master Data">
            <Head title="Tier Harga" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                            Master Data
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Daftar Tier Harga
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Kelola tier harga grosir berdasarkan kuantitas pembelian reseller.
                        </p>
                    </div>
                    <Button
                        id="btn-add-price-tier"
                        variant="primary"
                        onClick={openCreateModal}
                    >
                        Tambah Tier Harga
                    </Button>
                </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-3xl border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-herbal-100 text-sm">
                        <thead className="bg-gojamu-50 text-left text-xs font-black tracking-[0.14em] text-gojamu-700 uppercase">
                            <tr>
                                <th className="px-5 py-4">Nama Tier</th>
                                <th className="px-5 py-4">Min Qty</th>
                                <th className="px-5 py-4">Max Qty</th>
                                <th className="px-5 py-4">Harga / pcs</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-herbal-100">
                            {priceTiers.map((tier) => (
                                <tr
                                    key={tier.id}
                                    className="hover:bg-gojamu-50/50"
                                >
                                    <td className="px-5 py-4 font-black text-gojamu-950">
                                        {tier.name}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700 font-bold">
                                        {tier.min_qty.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {tier.max_qty !== null
                                            ? tier.max_qty.toLocaleString('id-ID')
                                            : '∞'}
                                    </td>
                                    <td className="px-5 py-4 font-bold text-gojamu-950">
                                        {currency.format(tier.price_per_pcs)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge tone={statusTone(tier.status)}>
                                            {tier.status_label}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                id={`btn-edit-tier-${tier.id}`}
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => openEditModal(tier)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                id={`btn-delete-tier-${tier.id}`}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(tier.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {priceTiers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-herbal-500"
                                    >
                                        Belum ada tier harga.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal Form */}
            {isOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-gojamu-100 bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-black text-gojamu-950">
                            {editId ? 'Edit Tier Harga' : 'Tambah Tier Harga'}
                        </h2>
                        <p className="text-herbal-600 mt-1 text-sm">
                            Atur nama tier, rentang kuantitas, dan harga satuan.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label
                                    htmlFor="input-tier-name"
                                    className="block text-sm font-semibold text-gojamu-950"
                                >
                                    Nama Tier
                                </label>
                                <input
                                    id="input-tier-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                    required
                                />
                                {errors.name ? (
                                    <p className="mt-1 text-xs text-mahakunir-600">
                                        {errors.name}
                                    </p>
                                ) : null}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="input-min-qty"
                                        className="block text-sm font-semibold text-gojamu-950"
                                    >
                                        Min Qty
                                    </label>
                                    <input
                                        id="input-min-qty"
                                        type="number"
                                        min="1"
                                        value={data.min_qty}
                                        onChange={(e) =>
                                            setData(
                                                'min_qty',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            )
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                        required
                                    />
                                    {errors.min_qty ? (
                                        <p className="mt-1 text-xs text-mahakunir-600">
                                            {errors.min_qty}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <label
                                        htmlFor="input-max-qty"
                                        className="block text-sm font-semibold text-gojamu-950"
                                    >
                                        Max Qty
                                    </label>
                                    <input
                                        id="input-max-qty"
                                        type="number"
                                        min="1"
                                        value={data.max_qty}
                                        onChange={(e) =>
                                            setData(
                                                'max_qty',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            )
                                        }
                                        className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                        placeholder="Tak terbatas"
                                    />
                                    <p className="mt-1.5 text-xs text-herbal-500">
                                        Kosongkan jika tak terbatas
                                    </p>
                                    {errors.max_qty ? (
                                        <p className="mt-1 text-xs text-mahakunir-600">
                                            {errors.max_qty}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="input-price"
                                    className="block text-sm font-semibold text-gojamu-950"
                                >
                                    Harga per pcs (Rp)
                                </label>
                                <input
                                    id="input-price"
                                    type="number"
                                    min="0"
                                    value={data.price_per_pcs}
                                    onChange={(e) =>
                                        setData(
                                            'price_per_pcs',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        )
                                    }
                                    className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                    required
                                />
                                {errors.price_per_pcs ? (
                                    <p className="mt-1 text-xs text-mahakunir-600">
                                        {errors.price_per_pcs}
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
                                        setData(
                                            'status',
                                            e.target.value as 'active' | 'inactive',
                                        )
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

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    id="btn-submit-tier"
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Button
                                    id="btn-cancel-tier"
                                    variant="ghost"
                                    onClick={handleClose}
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
