import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type EditRewardProps = {
    reward: {
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
};

type EditRewardForm = {
    name: string;
    description: string;
    required_points: number | '';
    stock: number | '';
    status: 'active' | 'inactive';
    start_date: string;
    end_date: string;
};

export default function AdminRewardsEdit({ reward }: EditRewardProps) {
    const { data, setData, put, processing, errors } =
        useForm<EditRewardForm>({
            name: reward.name,
            description: reward.description ?? '',
            required_points: reward.required_points,
            stock: reward.stock ?? '',
            status: reward.status as 'active' | 'inactive',
            start_date: reward.start_date ? reward.start_date.substring(0, 10) : '',
            end_date: reward.end_date ? reward.end_date.substring(0, 10) : '',
        });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        put(`/admin/rewards/${reward.id}`);
    }

    return (
        <AdminLayout title="Edit Reward" eyebrow="Master Data">
            <Head title="Edit Reward" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                    Master Data
                </p>
                <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                    Edit Reward: {reward.name}
                </h1>
                <p className="text-herbal-600 mt-2 text-sm">
                    Ubah detail informasi reward poin.
                </p>
            </section>

            <section className="mt-5 rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="input-name"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Nama Reward
                            </label>
                            <input
                                id="input-name"
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

                        <div>
                            <label
                                htmlFor="input-points"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Poin Yang Dibutuhkan
                            </label>
                            <input
                                id="input-points"
                                type="number"
                                min="1"
                                value={data.required_points}
                                onChange={(e) =>
                                    setData(
                                        'required_points',
                                        e.target.value ? Number(e.target.value) : '',
                                    )
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                                required
                            />
                            {errors.required_points ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.required_points}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-stock"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Stok (Kosongkan jika tak terbatas)
                            </label>
                            <input
                                id="input-stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) =>
                                    setData(
                                        'stock',
                                        e.target.value ? Number(e.target.value) : '',
                                    )
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.stock ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.stock}
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

                        <div>
                            <label
                                htmlFor="input-start-date"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Tanggal Mulai Berlaku
                            </label>
                            <input
                                id="input-start-date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.start_date ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.start_date}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-end-date"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Tanggal Akhir Berlaku
                            </label>
                            <input
                                id="input-end-date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.end_date ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.end_date}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="input-description"
                            className="block text-sm font-semibold text-gojamu-950"
                        >
                            Deskripsi Reward
                        </label>
                        <textarea
                            id="input-description"
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
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
                            id="btn-submit-reward"
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Link href="/admin/rewards">
                            <Button id="btn-back-rewards" variant="ghost">
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </form>
            </section>
        </AdminLayout>
    );
}
