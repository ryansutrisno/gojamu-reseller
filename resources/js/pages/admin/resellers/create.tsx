import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';

type CreateResellerForm = {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    internal_notes: string;
};

export default function AdminResellersCreate() {
    const { data, setData, post, processing, errors } =
        useForm<CreateResellerForm>({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            city: '',
            province: '',
            postal_code: '',
            internal_notes: '',
        });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/resellers');
    }

    return (
        <AdminLayout title="Tambah Reseller" eyebrow="Master Data">
            <Head title="Tambah Reseller" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                    Master Data
                </p>
                <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                    Tambah Reseller Baru
                </h1>
                <p className="text-herbal-600 mt-2 text-sm">
                    Isi data reseller baru untuk didaftarkan ke sistem.
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
                                Nama
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
                                htmlFor="input-email"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Email
                            </label>
                            <input
                                id="input-email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.email ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.email}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-password"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Password
                            </label>
                            <input
                                id="input-password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.password ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.password}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-phone"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                WhatsApp / Telepon
                            </label>
                            <input
                                id="input-phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.phone ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.phone}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-city"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Kota
                            </label>
                            <input
                                id="input-city"
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.city ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.city}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-province"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Provinsi
                            </label>
                            <input
                                id="input-province"
                                type="text"
                                value={data.province}
                                onChange={(e) =>
                                    setData('province', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.province ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.province}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="input-postal-code"
                                className="block text-sm font-semibold text-gojamu-950"
                            >
                                Kode Pos
                            </label>
                            <input
                                id="input-postal-code"
                                type="text"
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData('postal_code', e.target.value)
                                }
                                className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                            />
                            {errors.postal_code ? (
                                <p className="mt-1 text-xs text-mahakunir-600">
                                    {errors.postal_code}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="input-address"
                            className="block text-sm font-semibold text-gojamu-950"
                        >
                            Alamat Lengkap
                        </label>
                        <textarea
                            id="input-address"
                            rows={3}
                            value={data.address}
                            onChange={(e) =>
                                setData('address', e.target.value)
                            }
                            className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                        />
                        {errors.address ? (
                            <p className="mt-1 text-xs text-mahakunir-600">
                                {errors.address}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label
                            htmlFor="input-internal-notes"
                            className="block text-sm font-semibold text-gojamu-950"
                        >
                            Catatan Internal
                        </label>
                        <textarea
                            id="input-internal-notes"
                            rows={3}
                            value={data.internal_notes}
                            onChange={(e) =>
                                setData('internal_notes', e.target.value)
                            }
                            className="mt-1 block w-full rounded-2xl border border-gojamu-200 bg-white px-4 py-3 text-sm text-gojamu-950 shadow-sm transition focus:border-gojamu-500 focus:ring-2 focus:ring-gojamu-200 focus:outline-none"
                        />
                        {errors.internal_notes ? (
                            <p className="mt-1 text-xs text-mahakunir-600">
                                {errors.internal_notes}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            id="btn-submit-reseller"
                            type="submit"
                            variant="primary"
                            disabled={processing}
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Reseller'}
                        </Button>
                        <Link href="/admin/resellers">
                            <Button
                                id="btn-back-resellers"
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
