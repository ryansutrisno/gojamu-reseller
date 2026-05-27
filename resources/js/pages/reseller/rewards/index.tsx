import { Head, useForm } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import ResellerLayout from '@/layouts/reseller-layout';
import { store as storeRedemption } from '@/routes/reseller/rewards/redemptions';

type Reward = {
    id: number;
    name: string;
    image: string | null;
    description: string | null;
    required_points: number;
    stock: number | null;
    status: string;
    status_label: string;
    start_date: string | null;
    end_date: string | null;
    can_redeem: boolean;
};

type PointLedger = {
    id: number;
    type: string;
    type_label: string;
    points: number;
    balance_before: number;
    balance_after: number;
    description: string | null;
    order_invoice_number: string | null;
    reward_redemption_status: string | null;
    created_at: string | null;
};

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

type RewardsIndexProps = {
    current_points: number;
    rewards: Reward[];
    recent_point_ledgers: PointLedger[];
    recent_redemptions: Redemption[];
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    return value ? dateFormatter.format(new Date(value)) : '-';
}

function rewardStatusTone(status: string, canRedeem: boolean): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
    if (!canRedeem) {
        return 'warning';
    }

    if (status === 'active') {
        return 'success';
    }

    if (status === 'expired' || status === 'inactive') {
        return 'neutral';
    }

    return 'info';
}

function redemptionTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
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

function ledgerTone(type: string): string {
    if (type === 'debit' || type === 'redeem' || type === 'deduct') {
        return 'bg-mahakunir-50 text-mahakunir-800 ring-mahakunir-100';
    }

    if (type === 'credit' || type === 'earned' || type === 'earn') {
        return 'bg-gojamu-50 text-gojamu-800 ring-gojamu-100';
    }

    return 'bg-herbal-50 text-herbal-700 ring-herbal-100';
}

function RewardCard({ reward }: { reward: Reward }) {
    const form = useForm<{ reward: number | null }>({ reward: null });

    const stock = reward.stock;
    const hasLimitedStock = stock !== null;
    const isDisabled = !reward.can_redeem || (hasLimitedStock && stock <= 0) || reward.status !== 'active';

    const submitRedeem = (): void => {
        form.transform(() => ({ reward: reward.id }));

        form.post(storeRedemption.url({ reward: reward.id }), {
            preserveScroll: true,
        });
    };

    return (
        <article className="overflow-hidden rounded-[2rem] border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-[16/10] bg-gradient-to-br from-gojamu-50 via-white to-kunyit-50">
                {reward.image ? (
                    <img alt={reward.name} className="h-full w-full object-cover" src={reward.image} />
                ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                        <div>
                            <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-gojamu-950 text-2xl text-kunyit-300 shadow-lg shadow-gojamu-950/20">
                                🎁
                            </div>
                            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-gojamu-700">
                                Reward GoJamu
                            </p>
                        </div>
                    </div>
                )}
                <div className="absolute left-4 top-4">
                    <Badge tone={rewardStatusTone(reward.status, reward.can_redeem)}>{reward.status_label}</Badge>
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black text-gojamu-950">{reward.name}</h2>
                            <p className="mt-1 text-sm text-herbal-600">
                                {reward.description ?? 'Tukar point dengan hadiah yang tersedia di katalog ini.'}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-kunyit-50 px-3 py-2 text-right">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kunyit-800">Butuh point</p>
                            <p className="mt-1 text-lg font-black text-gojamu-950">{reward.required_points} pt</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gojamu-50 p-3">
                        <p className="text-xs font-semibold text-gojamu-700">Stok</p>
                        <p className="mt-1 text-sm font-black text-gojamu-950">{hasLimitedStock ? `${stock} pcs` : 'Tanpa batas'}</p>
                    </div>
                    <div className="rounded-2xl bg-herbal-50 p-3">
                        <p className="text-xs font-semibold text-herbal-700">Periode</p>
                        <p className="mt-1 text-sm font-black text-gojamu-950">{formatDate(reward.start_date)}</p>
                        <p className="text-xs text-herbal-600">s/d {formatDate(reward.end_date)}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <button
                        type="button"
                        disabled={isDisabled || form.processing}
                        onClick={submitRedeem}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-kunyit-500 px-5 py-3 text-sm font-black text-gojamu-950 shadow-sm shadow-kunyit-100 transition hover:bg-kunyit-400 disabled:cursor-not-allowed disabled:bg-herbal-100 disabled:text-herbal-400"
                    >
                        {form.processing ? 'Memproses...' : 'Tukar reward'}
                    </button>
                    {isDisabled ? (
                        <p className="text-xs font-medium text-herbal-500">
                            {hasLimitedStock && stock <= 0
                                ? 'Stok habis.'
                                : reward.status !== 'active'
                                  ? 'Reward belum aktif.'
                                  : 'Point belum cukup atau reward belum bisa ditukar.'}
                        </p>
                    ) : null}
                    {form.errors.reward ? <p className="text-sm font-medium text-mahakunir-700">{form.errors.reward}</p> : null}
                </div>
            </div>
        </article>
    );
}

export default function RewardsIndex({ current_points, rewards, recent_point_ledgers, recent_redemptions }: RewardsIndexProps) {
    return (
        <ResellerLayout title="Point & Reward">
            <Head title="Point & Reward" />

            <section className="rounded-[2rem] bg-gradient-to-br from-gojamu-950 via-gojamu-900 to-herbal-900 p-6 text-white shadow-xl shadow-gojamu-950/15">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-kunyit-300">Reward point</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Kumpulkan point, tukar hadiah.</h1>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-gojamu-100/90 md:text-base">
                            Point aktif Mas Bro tersimpan di sini. Pilih reward yang tersedia, lalu sistem akan memproses penukaran sesuai stok.
                        </p>
                    </div>

                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gojamu-100">Point aktif</p>
                            <p className="mt-2 text-3xl font-black text-kunyit-300">{current_points} pt</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gojamu-100">Reward tersedia</p>
                            <p className="mt-2 text-3xl font-black text-white">{rewards.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gojamu-700">Katalog reward</p>
                        <h2 className="mt-1 text-2xl font-black text-gojamu-950">Pilih hadiah yang paling worth it</h2>
                    </div>
                </div>

                {rewards.length === 0 ? (
                    <div className="mt-4 rounded-[2rem] border border-dashed border-gojamu-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-lg font-black text-gojamu-950">Belum ada reward</p>
                        <p className="mt-2 text-sm text-herbal-600">Nanti katalog hadiah muncul di sini. Sabar dikit, sistemnya lagi manis-manisnya 😄</p>
                    </div>
                ) : (
                    <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                        {rewards.map((reward) => (
                            <RewardCard key={reward.id} reward={reward} />
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gojamu-700">Riwayat penukaran</p>
                            <h2 className="mt-1 text-xl font-black text-gojamu-950">Redemption terbaru</h2>
                        </div>
                    </div>

                    {recent_redemptions.length === 0 ? (
                        <div className="mt-4 rounded-3xl bg-gojamu-50 p-5 text-sm text-herbal-600">
                            Belum ada penukaran reward.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {recent_redemptions.map((redemption) => (
                                <div key={redemption.id} className="rounded-3xl border border-herbal-100 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-black text-gojamu-950">
                                                    {redemption.reward?.name ?? 'Reward dihapus'}
                                                </p>
                                                <Badge tone={redemptionTone(redemption.status)}>{redemption.status_label}</Badge>
                                            </div>
                                            <p className="mt-1 text-sm text-herbal-600">{redemption.points} point</p>
                                        </div>
                                        <p className="text-xs text-herbal-500">{formatDate(redemption.requested_at)}</p>
                                    </div>

                                    <div className="mt-3 grid gap-2 text-sm text-herbal-600 sm:grid-cols-2">
                                        <p>Disetujui: {formatDate(redemption.approved_at)}</p>
                                        <p>Diproses: {formatDate(redemption.processed_at)}</p>
                                        <p>Selesai: {formatDate(redemption.completed_at)}</p>
                                        <p>Ditolak: {formatDate(redemption.rejected_at)}</p>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-herbal-500">
                                        {redemption.approver_name ? (
                                            <span className="rounded-full bg-gojamu-50 px-3 py-1">Approve: {redemption.approver_name}</span>
                                        ) : null}
                                        {redemption.processor_name ? (
                                            <span className="rounded-full bg-kunyit-50 px-3 py-1">Ditangani: {redemption.processor_name}</span>
                                        ) : null}
                                    </div>

                                    {redemption.rejected_reason ? (
                                        <p className="mt-3 rounded-2xl bg-mahakunir-50 p-3 text-sm text-mahakunir-800">
                                            {redemption.rejected_reason}
                                        </p>
                                    ) : null}
                                    {redemption.admin_notes ? (
                                        <p className="mt-3 rounded-2xl bg-herbal-50 p-3 text-sm text-herbal-700">
                                            {redemption.admin_notes}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="rounded-[2rem] border border-gojamu-100 bg-white p-5 shadow-sm shadow-gojamu-100">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gojamu-700">Ledger point</p>
                            <h2 className="mt-1 text-xl font-black text-gojamu-950">Mutasi point terbaru</h2>
                        </div>
                    </div>

                    {recent_point_ledgers.length === 0 ? (
                        <div className="mt-4 rounded-3xl bg-gojamu-50 p-5 text-sm text-herbal-600">
                            Belum ada mutasi point.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {recent_point_ledgers.map((ledger) => (
                                <div key={ledger.id} className="rounded-3xl border border-herbal-100 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-black text-gojamu-950">{ledger.type_label}</p>
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${ledgerTone(ledger.type)}`}>
                                                    {ledger.points > 0 ? '+' : ''}
                                                    {ledger.points} pt
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-herbal-600">Saldo: {ledger.balance_before} → {ledger.balance_after}</p>
                                            {ledger.description ? <p className="mt-2 text-sm text-herbal-700">{ledger.description}</p> : null}
                                        </div>
                                        <p className="text-xs text-herbal-500">{formatDate(ledger.created_at)}</p>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-herbal-500">
                                        {ledger.order_invoice_number ? (
                                            <span className="rounded-full bg-gojamu-50 px-3 py-1">Order {ledger.order_invoice_number}</span>
                                        ) : null}
                                        {ledger.reward_redemption_status ? (
                                            <span className="rounded-full bg-kunyit-50 px-3 py-1">{ledger.reward_redemption_status}</span>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </section>
        </ResellerLayout>
    );
}
