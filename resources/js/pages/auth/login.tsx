import { Head, Form } from '@inertiajs/react';
import { store as loginStore } from '@/routes/login';

export default function Login() {
    return (
        <>
            <Head title="Masuk" />

            <main className="min-h-screen bg-gradient-to-br from-gojamu-50 via-herbal-50 to-kunyit-50 px-4 py-10 text-herbal-950">
                <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="hidden lg:block">
                        <div className="inline-flex rounded-full bg-gojamu-100 px-4 py-2 text-sm font-semibold text-gojamu-700">
                            GoJamu Reseller Management System
                        </div>
                        <h1 className="mt-6 max-w-xl text-5xl font-bold tracking-tight text-gojamu-950">
                            Operasional reseller herbal lebih rapi, cepat, dan terukur.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-8 text-herbal-700">
                            Pantau order, verifikasi pembayaran, kelola pengiriman, dan siapkan pondasi reward point reseller dalam satu portal internal.
                        </p>
                        <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                            {[
                                ['Tier Harga', 'Otomatis'],
                                ['Point', 'Siap pakai'],
                                ['Gudang', 'Terarah'],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-3xl border border-gojamu-100 bg-white/75 p-4 shadow-sm shadow-gojamu-100/60">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-herbal-500">{label}</p>
                                    <p className="mt-2 text-lg font-bold text-gojamu-950">{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-gojamu-100/80 backdrop-blur">
                        <div className="mb-8 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gojamu-950 text-2xl text-kunyit-300 shadow-lg shadow-gojamu-300/30">
                                🌿
                            </div>
                            <h2 className="mt-5 text-2xl font-bold text-gojamu-950">Masuk ke GoJamu</h2>
                            <p className="mt-2 text-sm text-herbal-600">Gunakan akun admin atau reseller yang sudah dibuat.</p>
                        </div>

                        <Form {...loginStore.form()} className="space-y-5">
                            {({ errors, processing }) => (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-herbal-700">Email</span>
                                        <input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="mt-2 w-full rounded-2xl border border-herbal-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gojamu-500 focus:ring-4 focus:ring-gojamu-100"
                                            placeholder="admin@gojamu.test"
                                        />
                                        {errors.email && <span className="mt-2 block text-sm font-medium text-mahakunir-700">{errors.email}</span>}
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-herbal-700">Password</span>
                                        <input
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="mt-2 w-full rounded-2xl border border-herbal-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gojamu-500 focus:ring-4 focus:ring-gojamu-100"
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <span className="mt-2 block text-sm font-medium text-mahakunir-700">{errors.password}</span>}
                                    </label>

                                    <label className="flex items-center gap-3 text-sm font-medium text-herbal-700">
                                        <input name="remember" type="checkbox" className="h-4 w-4 rounded border-herbal-300 text-gojamu-700" />
                                        Ingat saya
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-bold text-gojamu-950 shadow-lg shadow-kunyit-100 transition hover:bg-kunyit-300 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? 'Memproses...' : 'Masuk'}
                                    </button>
                                </>
                            )}
                        </Form>

                        <div className="mt-6 rounded-2xl bg-gojamu-50 p-4 text-xs leading-6 text-herbal-700">
                            <p className="font-bold text-gojamu-950">Akun awal seed:</p>
                            <p>admin@gojamu.test / password</p>
                            <p>reseller@gojamu.test / password</p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
