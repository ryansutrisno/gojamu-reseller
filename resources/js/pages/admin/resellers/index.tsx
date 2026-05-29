import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type AdminReseller = {
    id: number;
    reseller_code: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    city: string | null;
    province: string | null;
    status: string;
    status_label: string;
    current_points: number;
    total_qty_purchased: number;
    total_spent: number;
};

type AdminResellersIndexProps = {
    resellers: AdminReseller[];
};

const currency = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
});

function statusTone(status: string): 'success' | 'warning' {
    return status === 'active' ? 'success' : 'warning';
}

export default function AdminResellersIndex({
    resellers,
}: AdminResellersIndexProps) {
    const [search, setSearch] = useState('');

    const filtered = resellers.filter((reseller) => {
        if (!search) {
            return true;
        }

        const query = search.toLowerCase();

        return (
            reseller.name.toLowerCase().includes(query) ||
            (reseller.reseller_code ?? '').toLowerCase().includes(query)
        );
    });

    function handleResetPassword(id: number) {
        if (!confirm('Reset password reseller ini ke "password"?')) {
            return;
        }

        router.post(`/admin/resellers/${id}/reset-password`, {
            password: 'password',
        });
    }

    return (
        <AdminLayout title="Reseller" eyebrow="Master Data">
            <Head title="Reseller" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                            Master Data
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Daftar Reseller
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Kelola data reseller yang terdaftar di sistem.
                        </p>
                    </div>
                    <Link href="/admin/resellers/create">
                        <Button id="btn-add-reseller" variant="primary">
                            Tambah Reseller
                        </Button>
                    </Link>
                </div>
                <div className="mt-4">
                    <input
                        id="search-reseller"
                        type="text"
                        placeholder="Cari nama atau kode reseller..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                    />
                </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-3xl border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-herbal-100 text-sm">
                        <thead className="bg-gojamu-50 text-left text-xs font-black tracking-[0.14em] text-gojamu-700 uppercase">
                            <tr>
                                <th className="px-5 py-4">Kode</th>
                                <th className="px-5 py-4">Nama</th>
                                <th className="px-5 py-4">WhatsApp</th>
                                <th className="px-5 py-4">Kota</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Total Order</th>
                                <th className="px-5 py-4">Point</th>
                                <th className="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-herbal-100">
                            {filtered.map((reseller) => (
                                <tr
                                    key={reseller.id}
                                    className="hover:bg-gojamu-50/50"
                                >
                                    <td className="px-5 py-4 font-black text-gojamu-950">
                                        {reseller.reseller_code ?? '-'}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {reseller.name}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {reseller.phone ?? '-'}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {reseller.city ?? '-'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge
                                            tone={statusTone(reseller.status)}
                                        >
                                            {reseller.status_label}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-gojamu-950">
                                        {currency.format(
                                            reseller.total_spent,
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700">
                                        {reseller.current_points.toLocaleString(
                                            'id-ID',
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/resellers/${reseller.id}/edit`}
                                            >
                                                <Button
                                                    id={`btn-edit-reseller-${reseller.id}`}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                id={`btn-reset-password-${reseller.id}`}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleResetPassword(
                                                        reseller.id,
                                                    )
                                                }
                                            >
                                                Reset Password
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-10 text-center text-herbal-500"
                                    >
                                        Belum ada reseller.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
}
