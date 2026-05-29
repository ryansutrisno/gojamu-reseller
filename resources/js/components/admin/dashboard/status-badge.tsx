import { Badge } from '@/components/ui/badge';

export type OrderStatus = 'paid' | 'pending' | 'processing' | 'shipped';

const statusBadgeConfig: Record<
    OrderStatus,
    { label: string; tone: 'success' | 'warning' | 'info' | 'neutral' }
> = {
    paid: { label: 'Lunas', tone: 'success' },
    pending: { label: 'Tertunda', tone: 'neutral' },
    processing: { label: 'Diproses', tone: 'warning' },
    shipped: { label: 'Dikirim', tone: 'info' },
};

type StatusBadgeProps = {
    status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { label, tone } = statusBadgeConfig[status];

    return <Badge tone={tone}>{label}</Badge>;
}
