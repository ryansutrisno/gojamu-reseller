import { Head, useForm } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import {
    approve,
    complete,
    process as processRedemption,
    reject,
} from '@/routes/admin/reward-redemptions';

type Redemption = {
    id: number;
    points: number;
    status: string;
    status_label: string;
    admin_notes: string | null;
    rejected_reason: string | null;
    requested_at: string | null;
    approved_at: string | null;
    rejected_at: string | null;
    processed_at: string | null;
    completed_at: string | null;
    reseller: { id: number; name: string; reseller_code: string | null } | null;
    reward: {
        id: number;
        name: string;
        required_points: number;
        stock: number | null;
        status: string;
        status_label: string;
    } | null;
    approver_name: string | null;
    processor_name: string | null;
};

type AdminRewardRedemptionsIndexProps = {
    redemptions: Redemption[];
};

type NotesFormData = {
    admin_notes: string;
    redemption?: string;
};

type RejectFormData = {
    reason: string;
    redemption?: string;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    return value ? dateFormatter.format(new Date(value)) : '-';
}

function statusTone(
    status: string,
): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
    if (status === 'completed') {
        return 'success';
    }

    if (status === 'rejected') {
        return 'danger';
    }

    if (status === 'processing') {
        return 'info';
    }

    if (status === 'approved') {
        return 'success';
    }

    return 'warning';
}

function ActionNotes({
    label,
    value,
    onChange,
    error,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder: string;
}) {
    return (
        <label className="block">
            <span className="text-xs font-bold tracking-[0.16em] text-herbal-500 uppercase">
                {label}
            </span>
            <textarea
                className="border-herbal-200 focus:border-gojamu-400 mt-2 min-h-24 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-herbal-700 transition outline-none focus:ring-4 focus:ring-gojamu-100"
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                value={value}
            />
            {error ? (
                <p className="mt-2 text-sm font-medium text-mahakunir-700">
                    {error}
                </p>
            ) : null}
        </label>
    );
}

function RedemptionError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-3 text-sm font-semibold text-mahakunir-700">
            {message}
        </p>
    ) : null;
}

function RedemptionCard({ redemption }: { redemption: Redemption }) {
    const approveForm = useForm<NotesFormData>({ admin_notes: '' });
    const rejectForm = useForm<RejectFormData>({ reason: '' });
    const processForm = useForm<NotesFormData>({ admin_notes: '' });
    const completeForm = useForm<NotesFormData>({ admin_notes: '' });

    const submitApprove = (): void => {
        approveForm.post(approve.url(redemption.id), {
            preserveScroll: true,
            onSuccess: () => approveForm.reset('admin_notes'),
        });
    };

    const submitReject = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        rejectForm.post(reject.url(redemption.id), {
            preserveScroll: true,
            onSuccess: () => rejectForm.reset('reason'),
        });
    };

    const submitProcess = (): void => {
        processForm.post(processRedemption.url(redemption.id), {
            preserveScroll: true,
            onSuccess: () => processForm.reset('admin_notes'),
        });
    };

    const submitComplete = (): void => {
        completeForm.post(complete.url(redemption.id), {
            preserveScroll: true,
            onSuccess: () => completeForm.reset('admin_notes'),
        });
    };

    return (
        <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-gojamu-950">
                            {redemption.reward?.name ?? 'Reward dihapus'}
                        </h2>
                        <Badge tone={statusTone(redemption.status)}>
                            {redemption.status_label}
                        </Badge>
                    </div>
                    <p className="text-herbal-600 mt-1 text-sm">
                        {redemption.reseller?.name ?? '-'} ·{' '}
                        {redemption.reseller?.reseller_code ?? '-'}
                    </p>
                    <p className="text-herbal-600 mt-1 text-sm">
                        {redemption.points} point
                    </p>
                </div>
                <div className="rounded-2xl bg-kunyit-50 px-4 py-3 text-right">
                    <p className="text-kunyit-800 text-xs font-bold tracking-[0.16em] uppercase">
                        Diajukan
                    </p>
                    <p className="mt-1 text-sm font-black text-gojamu-950">
                        {formatDate(redemption.requested_at)}
                    </p>
                </div>
            </div>

            <div className="text-herbal-600 mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <p>Disetujui: {formatDate(redemption.approved_at)}</p>
                <p>Diproses: {formatDate(redemption.processed_at)}</p>
                <p>Selesai: {formatDate(redemption.completed_at)}</p>
                <p>Ditolak: {formatDate(redemption.rejected_at)}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-herbal-500">
                {redemption.approver_name ? (
                    <span className="rounded-full bg-gojamu-50 px-3 py-1">
                        Approve: {redemption.approver_name}
                    </span>
                ) : null}
                {redemption.processor_name ? (
                    <span className="rounded-full bg-kunyit-50 px-3 py-1">
                        Ditangani: {redemption.processor_name}
                    </span>
                ) : null}
            </div>

            {redemption.rejected_reason ? (
                <div className="bg-mahakunir-50 text-mahakunir-800 mt-4 rounded-3xl p-4 text-sm">
                    <p className="font-bold">Alasan penolakan</p>
                    <p className="mt-1">{redemption.rejected_reason}</p>
                </div>
            ) : null}

            {redemption.admin_notes ? (
                <div className="mt-4 rounded-3xl bg-gojamu-50 p-4 text-sm text-herbal-700">
                    <p className="font-bold text-gojamu-950">Catatan admin</p>
                    <p className="mt-1">{redemption.admin_notes}</p>
                </div>
            ) : null}

            <div className="mt-5 space-y-4">
                {redemption.status === 'requested' ? (
                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-3xl bg-gojamu-50 p-4 ring-1 ring-gojamu-100">
                            <p className="text-sm font-black text-gojamu-950">
                                Approve penukaran
                            </p>
                            <p className="text-herbal-600 mt-1 text-sm">
                                Konfirmasi bahwa hadiah siap diproses.
                            </p>
                            <ActionNotes
                                error={approveForm.errors.admin_notes}
                                label="Catatan internal (opsional)"
                                onChange={(value) =>
                                    approveForm.setData('admin_notes', value)
                                }
                                placeholder="Contoh: stok aman, lanjut proses."
                                value={approveForm.data.admin_notes}
                            />
                            <RedemptionError
                                message={approveForm.errors.redemption}
                            />
                            <button
                                type="button"
                                onClick={submitApprove}
                                disabled={approveForm.processing}
                                className="hover:bg-gojamu-600 mt-3 rounded-full bg-gojamu-700 px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {approveForm.processing
                                    ? 'Memproses...'
                                    : 'Approve'}
                            </button>
                        </div>

                        <form
                            className="rounded-3xl bg-white p-4 ring-1 ring-red-100"
                            onSubmit={submitReject}
                        >
                            <p className="text-sm font-black text-gojamu-950">
                                Reject penukaran
                            </p>
                            <p className="text-herbal-600 mt-1 text-sm">
                                Wajib isi alasan agar reseller paham konteksnya.
                            </p>
                            <ActionNotes
                                error={rejectForm.errors.reason}
                                label="Alasan penolakan"
                                onChange={(value) =>
                                    rejectForm.setData('reason', value)
                                }
                                placeholder="Contoh: stok habis, silakan pilih reward lain."
                                value={rejectForm.data.reason}
                            />
                            <RedemptionError
                                message={rejectForm.errors.redemption}
                            />
                            <button
                                type="submit"
                                disabled={rejectForm.processing}
                                className="bg-mahakunir-600 mt-3 rounded-full px-4 py-2 text-sm font-bold text-white transition hover:bg-mahakunir-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {rejectForm.processing
                                    ? 'Memproses...'
                                    : 'Reject'}
                            </button>
                        </form>
                    </div>
                ) : null}

                {redemption.status === 'approved' ? (
                    <div className="rounded-3xl bg-gojamu-50 p-4 ring-1 ring-gojamu-100">
                        <p className="text-sm font-black text-gojamu-950">
                            Proses penukaran
                        </p>
                        <p className="text-herbal-600 mt-1 text-sm">
                            Masukkan catatan internal jika perlu sebelum lanjut
                            ke pengiriman hadiah.
                        </p>
                        <ActionNotes
                            error={processForm.errors.admin_notes}
                            label="Catatan internal (opsional)"
                            onChange={(value) =>
                                processForm.setData('admin_notes', value)
                            }
                            placeholder="Contoh: packing sudah disiapkan."
                            value={processForm.data.admin_notes}
                        />
                        <RedemptionError
                            message={processForm.errors.redemption}
                        />
                        <button
                            type="button"
                            onClick={submitProcess}
                            disabled={processForm.processing}
                            className="hover:bg-gojamu-600 mt-3 rounded-full bg-gojamu-700 px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {processForm.processing
                                ? 'Memproses...'
                                : 'Process'}
                        </button>
                    </div>
                ) : null}

                {redemption.status === 'processing' ? (
                    <div className="rounded-3xl bg-kunyit-50 p-4 ring-1 ring-kunyit-100">
                        <p className="text-sm font-black text-gojamu-950">
                            Selesaikan penukaran
                        </p>
                        <p className="text-herbal-600 mt-1 text-sm">
                            Tandai selesai setelah hadiah benar-benar sampai ke
                            reseller.
                        </p>
                        <ActionNotes
                            error={completeForm.errors.admin_notes}
                            label="Catatan internal (opsional)"
                            onChange={(value) =>
                                completeForm.setData('admin_notes', value)
                            }
                            placeholder="Contoh: paket diterima reseller."
                            value={completeForm.data.admin_notes}
                        />
                        <RedemptionError
                            message={completeForm.errors.redemption}
                        />
                        <button
                            type="button"
                            onClick={submitComplete}
                            disabled={completeForm.processing}
                            className="hover:bg-kunyit-400 mt-3 rounded-full bg-kunyit-500 px-4 py-2 text-sm font-bold text-gojamu-950 transition disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {completeForm.processing
                                ? 'Memproses...'
                                : 'Complete'}
                        </button>
                    </div>
                ) : null}
            </div>
        </article>
    );
}

export default function AdminRewardRedemptionsIndex({
    redemptions,
}: AdminRewardRedemptionsIndexProps) {
    return (
        <AdminLayout eyebrow="Reward" title="Reward Redemptions">
            <Head title="Reward Redemptions" />

            <section className="rounded-3xl border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                <p className="text-gojamu-600 text-xs font-bold tracking-[0.18em] uppercase">
                    Operasional reward
                </p>
                <h1 className="mt-1 text-2xl font-black text-gojamu-950">
                    Kelola penukaran point reseller
                </h1>
                <p className="text-herbal-600 mt-2 text-sm">
                    Approve, proses, lalu selesaikan penukaran hadiah dari
                    dashboard admin.
                </p>
            </section>

            {redemptions.length === 0 ? (
                <section className="border-gojamu-200 mt-5 rounded-3xl border border-dashed bg-white p-8 text-center shadow-sm">
                    <p className="text-lg font-black text-gojamu-950">
                        Belum ada redemption
                    </p>
                    <p className="text-herbal-600 mt-2 text-sm">
                        Semua penukaran reward akan muncul di sini.
                    </p>
                </section>
            ) : (
                <section className="mt-5 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                    {redemptions.map((redemption) => (
                        <RedemptionCard
                            key={redemption.id}
                            redemption={redemption}
                        />
                    ))}
                </section>
            )}
        </AdminLayout>
    );
}
