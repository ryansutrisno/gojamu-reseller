import { Head, Link } from '@inertiajs/react';
import ResellerLayout from '@/layouts/reseller-layout';
import { create } from '@/routes/reseller/orders';

const products = [
    { name: 'Mahakunir', tone: 'bg-mahakunir-100 text-mahakunir-900', stock: 'Ready' },
    { name: 'Nirlawa', tone: 'bg-nirlawa-100 text-nirlawa-900', stock: 'Stok terbatas' },
    { name: 'Ko Gan Ti', tone: 'bg-gojamu-100 text-gojamu-900', stock: 'Ready' },
];

export default function ResellerDashboard() {
    return (
        <ResellerLayout title="Portal Reseller">
            <Head title="Dashboard Reseller" />

            <section className="rounded-[2rem] bg-gradient-to-br from-gojamu-700 to-gojamu-950 p-6 text-white shadow-xl shadow-gojamu-100">
                <p className="text-sm font-semibold text-gojamu-100">Selamat datang kembali</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Reseller Demo GoJamu</h1>
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                        ['Total order', '24'],
                        ['Active point', '248'],
                        ['Total pcs', '2.480'],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white/12 p-4 backdrop-blur">
                            <p className="text-xs text-gojamu-100">{label}</p>
                            <p className="mt-1 text-xl font-bold">{value}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-5 rounded-[2rem] border border-kunyit-100 bg-kunyit-50 p-5 shadow-sm shadow-kunyit-100">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-kunyit-700">Reward point</p>
                        <h2 className="mt-1 text-2xl font-bold text-gojamu-950">248 point aktif</h2>
                        <p className="mt-2 text-sm text-herbal-700">Progress ke Emas 3 Gram: butuh 1.952 point lagi.</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                        <p className="text-xs text-herbal-500">Target</p>
                        <p className="font-bold text-kunyit-900">2.200 pt</p>
                    </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-white">
                    <div className="h-3 w-[11.3%] rounded-full bg-kunyit-500" />
                </div>
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gojamu-500">Katalog</p>
                            <h2 className="mt-1 text-xl font-bold text-gojamu-950">Produk GoJamu</h2>
                        </div>
                        <span className="rounded-full bg-gojamu-50 px-3 py-1 text-xs font-bold text-gojamu-700">Aktif</span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {products.map((product) => (
                            <div key={product.name} className="rounded-3xl border border-herbal-100 p-4">
                                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${product.tone}`}>{product.name}</div>
                                <p className="mt-4 text-sm font-semibold text-herbal-700">{product.stock}</p>
                                <p className="mt-2 text-xs leading-5 text-herbal-500">Harga tier otomatis mengikuti total pcs dalam order.</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gojamu-500">Preview order</p>
                    <h2 className="mt-1 text-xl font-bold text-gojamu-950">75 pcs = Rp42.000/pcs</h2>
                    <div className="mt-5 space-y-3 text-sm text-herbal-700">
                        <div className="flex justify-between"><span>Subtotal</span><strong>Rp3.150.000</strong></div>
                        <div className="flex justify-between"><span>Ongkir</span><strong>Ditentukan admin</strong></div>
                        <div className="flex justify-between border-t border-herbal-100 pt-3"><span>Potensi point</span><strong>7 point</strong></div>
                    </div>
                    <Link href={create.url()} className="mt-6 inline-flex w-full justify-center rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-bold text-gojamu-950 shadow-sm shadow-kunyit-100">
                        Buat Order Baru →
                    </Link>
                </article>
            </section>
        </ResellerLayout>
    );
}
