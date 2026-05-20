import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const quickActionToneClasses = {
    gojamu: 'bg-gojamu-100 text-gojamu-950',
    kunyit: 'bg-kunyit-300 text-gojamu-950',
    mahakunir: 'bg-mahakunir-300 text-gojamu-950',
    nirlawa: 'bg-nirlawa-300 text-gojamu-950',
} as const;

export type QuickActionTone = keyof typeof quickActionToneClasses;

export type QuickActionItem = {
    description: string;
    label: string;
    tone: QuickActionTone;
};

type QuickActionsCardProps = {
    actions: QuickActionItem[];
};

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
    return (
        <Card tone="dark" className="relative overflow-hidden p-5">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,202,59,0.18),_transparent_50%)]" />

            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-gojamu-100">Aksi cepat</p>
                    <CardTitle className="mt-1 text-xl text-white">Shortcut operasional</CardTitle>
                    <CardDescription className="mt-1 text-gojamu-100/80">Eksekusi tugas harian tanpa harus masuk ke halaman yang lebih dalam.</CardDescription>
                </div>
                <Badge tone="warning" className="shrink-0">
                    {actions.length} aksi
                </Badge>
            </div>

            <ul className="relative mt-4 grid gap-3 sm:grid-cols-2" role="list">
                {actions.map((action) => (
                    <li key={action.label}>
                        <button
                            type="button"
                            className="group h-full w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gojamu-950"
                        >
                            <span className={['inline-flex size-10 items-center justify-center rounded-2xl text-sm font-black', quickActionToneClasses[action.tone]].join(' ')}>
                                ↗
                            </span>
                            <span className="mt-3 block text-sm font-bold text-white">{action.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-gojamu-100/80">{action.description}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
