import { Badge } from '@/components/ui/badge';

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'packed' | 'shipped' | 'completed' | 'cancelled';

type StatusTone = 'success' | 'warning' | 'info' | 'neutral';

const statusBadgeConfig: Record<OrderStatus, { label: string; tone: StatusTone }> = {
    pending_payment: { label: 'Menunggu Pembayaran', tone: 'neutral' },
    paid: { label: 'Sudah Dibayar', tone: 'success' },
    processing: { label: 'Diproses', tone: 'warning' },
    packed: { label: 'Dikemas', tone: 'info' },
    shipped: { label: 'Dikirim', tone: 'info' },
    completed: { label: 'Selesai', tone: 'success' },
    cancelled: { label: 'Dibatalkan', tone: 'neutral' },
};

type StatusBadgeProps = {
    status: OrderStatus | string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { label, tone } = statusBadgeConfig[status as OrderStatus] ?? { label: status, tone: 'neutral' as const };

    return <Badge tone={tone}>{label}</Badge>;
}
