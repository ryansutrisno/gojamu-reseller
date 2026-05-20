import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const stockToneClasses = {
    gojamu: 'bg-gojamu-500',
    kunyit: 'bg-kunyit-500',
    mahakunir: 'bg-mahakunir-500',
    nirlawa: 'bg-nirlawa-500',
} as const;

export type StockTone = keyof typeof stockToneClasses;

export type StockItem = {
    name: string;
    percent: number;
    stock: string;
    tone: StockTone;
};

type StockCardProps = {
    items: StockItem[];
};

export function StockCard({ items }: StockCardProps) {
    return (
        <Card className="p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gojamu-500">Gudang</p>
            <CardTitle className="mt-1 text-xl text-gojamu-950">Stok produk</CardTitle>
            <CardDescription className="mt-1">Ringkas, padat, dan cukup buat lihat kondisi gudang sekilas.</CardDescription>

            <ul className="mt-5 space-y-4" role="list">
                {items.map((item) => (
                    <li key={item.name}>
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="font-bold text-herbal-700">{item.name}</span>
                            <span className="text-herbal-500">{item.stock}</span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label={`Ketersediaan stok ${item.name}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={item.percent}
                            className="mt-2 h-2 overflow-hidden rounded-full bg-herbal-100"
                        >
                            <div className={['h-2 rounded-full', stockToneClasses[item.tone]].join(' ')} style={{ width: `${item.percent}%` }} />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
