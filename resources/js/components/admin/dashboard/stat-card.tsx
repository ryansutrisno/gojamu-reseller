import { Card } from '@/components/ui/card';

const statCardToneClasses = {
    gojamu: 'border-gojamu-500',
    kunyit: 'border-kunyit-500',
    mahakunir: 'border-mahakunir-500',
    nirlawa: 'border-nirlawa-500',
} as const;

export type DashboardMetricTone = keyof typeof statCardToneClasses;

export type StatCardProps = {
    helper: string;
    label: string;
    tone: DashboardMetricTone;
    value: string;
};

export function StatCard({ helper, label, tone, value }: StatCardProps) {
    return (
        <Card className={["border-t-4 p-5", statCardToneClasses[tone]].join(' ')}>
            <p className="text-sm font-semibold text-herbal-500">{label}</p>
            <p className="mt-3 text-3xl font-bold text-gojamu-950">{value}</p>
            <p className="mt-2 text-xs font-medium text-herbal-500">{helper}</p>
        </Card>
    );
}
