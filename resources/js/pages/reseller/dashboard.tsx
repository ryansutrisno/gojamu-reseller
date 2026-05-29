import { Head, Link } from '@inertiajs/react';
import ResellerLayout from '@/layouts/reseller-layout';
import { create } from '@/routes/reseller/orders';

type DashboardMetricProps = {
    total_orders: number;
    active_points: number;
    total_pcs: number;
    total_spent: number;
};

type CatalogProductProps = {
    name: string;
    color_key: string | null;
    color_hex: string | null;
    stock_label: string;
};

type NextRewardProps = {
    name: string;
    required_points: number;
} | null;

type ResellerDashboardProps = {
    metrics: DashboardMetricProps;
    next_reward: NextRewardProps;
    catalog_products: CatalogProductProps[];
};

const getToneClass = (colorKey: string | null) => {
    switch (colorKey) {
        case 'mahakunir':
            return 'bg-mahakunir-100 text-mahakunir-900';
        case 'nirlawa':
            return 'bg-nirlawa-100 text-nirlawa-900';
        case 'amber':
            return 'bg-amber-100 text-amber-900';
        case 'orange':
            return 'bg-orange-100 text-orange-950';
        case 'red':
            return 'bg-red-100 text-red-900';
        default:
            return 'bg-gojamu-100 text-gojamu-900';
    }
};

export default function ResellerDashboard({
    metrics,
    next_reward,
    catalog_products,
}: ResellerDashboardProps) {
    return (
        <ResellerLayout title="Portal Reseller">
            <Head title="Dashboard Reseller" />

            <section className="rounded-[2rem] bg-gradient-to-br from-gojamu-700 to-gojamu-950 p-6 text-white shadow-xl shadow-gojamu-100">
                <p className="text-sm font-semibold text-gojamu-100">
                    Selamat datang kembali
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Reseller Demo GoJamu
                </h1>
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                        ['Total order', metrics.total_orders],
                        ['Active point', metrics.active_points],
                        [
                            'Total pcs',
                            metrics.total_pcs.toLocaleString('id-ID'),
                        ],
                    ].map(([label, value]) => (
                        <div
                            key={label as string}
                            className="rounded-2xl bg-white/12 p-4 backdrop-blur"
                        >
                            <p className="text-xs text-gojamu-100">
                                {label as string}
                            </p>
                            <p className="mt-1 text-xl font-bold">{value}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-5 rounded-[2rem] border border-kunyit-100 bg-kunyit-50 p-5 shadow-sm shadow-kunyit-100">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold tracking-[0.18em] text-kunyit-700 uppercase">
                            Reward point
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-gojamu-950">
                            {metrics.active_points} point aktif
                        </h2>
                        {next_reward ? (
                            <p className="mt-2 text-sm text-herbal-700">
                                Progress ke {next_reward.name}: butuh{' '}
                                {Math.max(
                                    0,
                                    next_reward.required_points -
                                        metrics.active_points,
                                )}{' '}
                                point lagi.
                            </p>
                        ) : (
                            <p className="mt-2 text-sm text-herbal-700">
                                Kamu telah mencapai target reward tertinggi!
                            </p>
                        )}
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                        <p className="text-xs text-herbal-500">Target</p>
                        <p className="font-bold text-kunyit-900">
                            {next_reward
                                ? `${next_reward.required_points} pt`
                                : '-'}
                        </p>
                    </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-white">
                    <div
                        className="h-3 rounded-full bg-kunyit-500 transition-all duration-500"
                        style={{
                            width: `${next_reward ? Math.min(100, (metrics.active_points / next_reward.required_points) * 100) : 100}%`,
                        }}
                    />
                </div>
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-[0.18em] text-gojamu-500 uppercase">
                                Katalog
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-gojamu-950">
                                Produk GoJamu
                            </h2>
                        </div>
                        <span className="rounded-full bg-gojamu-50 px-3 py-1 text-xs font-bold text-gojamu-700">
                            Aktif
                        </span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {catalog_products.map((product) => (
                            <Link
                                key={product.name}
                                href={create.url()}
                                className="block rounded-3xl border border-herbal-100 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                            >
                                <div
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getToneClass(product.color_key)}`}
                                >
                                    {product.name}
                                </div>
                                <p className="mt-4 text-sm font-semibold text-herbal-700">
                                    {product.stock_label}
                                </p>
                                <p className="mt-2 text-xs leading-5 text-herbal-500">
                                    Harga tier otomatis mengikuti total pcs
                                    dalam order.
                                </p>
                            </Link>
                        ))}
                    </div>
                </article>

                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <p className="text-sm font-semibold tracking-[0.18em] text-gojamu-500 uppercase">
                        Preview order
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gojamu-950">
                        75 pcs = Rp42.000/pcs
                    </h2>
                    <div className="mt-5 space-y-3 text-sm text-herbal-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <strong>Rp3.150.000</strong>
                        </div>
                        <div className="flex justify-between">
                            <span>Ongkir</span>
                            <strong>Ditentukan admin</strong>
                        </div>
                        <div className="flex justify-between border-t border-herbal-100 pt-3">
                            <span>Potensi point</span>
                            <strong>7 point</strong>
                        </div>
                    </div>
                    <Link
                        href={create.url()}
                        className="mt-6 inline-flex w-full justify-center rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-bold text-gojamu-950 shadow-sm shadow-kunyit-100"
                    >
                        Buat Order Baru →
                    </Link>
                </article>
            </section>
        </ResellerLayout>
    );
}
