import { Head, Link, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type AdminReward = {
    id: number;
    name: string;
    description: string | null;
    required_points: number;
    stock: number | null;
    status: string;
    status_label: string;
    start_date: string | null;
    end_date: string | null;
};

type AdminRewardsIndexProps = {
    rewards: AdminReward[];
};

function statusTone(status: string): 'success' | 'warning' {
    return status === 'active' ? 'success' : 'warning';
}

export default function AdminRewardsIndex({
    rewards,
}: AdminRewardsIndexProps) {
    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus reward ini?')) {
            return;
        }

        router.delete(`/admin/rewards/${id}`);
    }

    return (
        <AdminLayout title="Reward" eyebrow="Master Data">
            <Head title="Reward" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                            Master Data
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                            Daftar Reward
                        </h1>
                        <p className="text-herbal-600 mt-2 text-sm">
                            Kelola reward poin yang dapat ditukarkan oleh reseller.
                        </p>
                    </div>
                    <Link href="/admin/rewards/create">
                        <Button id="btn-add-reward" variant="primary">
                            Tambah Reward
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-3xl border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-herbal-100 text-sm">
                        <thead className="bg-gojamu-50 text-left text-xs font-black tracking-[0.14em] text-gojamu-700 uppercase">
                            <tr>
                                <th className="px-5 py-4">Nama Reward</th>
                                <th className="px-5 py-4">Poin Dibutuhkan</th>
                                <th className="px-5 py-4">Stok</th>
                                <th className="px-5 py-4">Masa Berlaku</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-herbal-100">
                            {rewards.map((reward) => (
                                <tr
                                    key={reward.id}
                                    className="hover:bg-gojamu-50/50"
                                >
                                    <td className="px-5 py-4 font-black text-gojamu-950">
                                        <div>
                                            <p>{reward.name}</p>
                                            {reward.description ? (
                                                <p className="text-xs font-normal text-herbal-500 mt-0.5 line-clamp-1">
                                                    {reward.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-mahakunir-600">
                                        {reward.required_points.toLocaleString('id-ID')} Poin
                                    </td>
                                    <td className="px-5 py-4 text-herbal-700 font-medium">
                                        {reward.stock !== null
                                            ? reward.stock.toLocaleString('id-ID')
                                            : '∞ (Tak Terbatas)'}
                                    </td>
                                    <td className="px-5 py-4 text-herbal-600 text-xs">
                                        {reward.start_date || reward.end_date ? (
                                            <>
                                                {reward.start_date ? new Date(reward.start_date).toLocaleDateString('id-ID') : '-'}
                                                {' s/d '}
                                                {reward.end_date ? new Date(reward.end_date).toLocaleDateString('id-ID') : '-'}
                                            </>
                                        ) : (
                                            'Selamanya'
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge tone={statusTone(reward.status)}>
                                            {reward.status_label}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/rewards/${reward.id}/edit`}>
                                                <Button
                                                    id={`btn-edit-reward-${reward.id}`}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                id={`btn-delete-reward-${reward.id}`}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(reward.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rewards.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-herbal-500"
                                    >
                                        Belum ada reward.
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
