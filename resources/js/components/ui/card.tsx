import type { HTMLAttributes } from 'react';

const cardToneClasses = {
    dark: 'border border-gojamu-900 bg-gojamu-950 text-white shadow-sm shadow-gojamu-200',
    muted: 'border border-herbal-100 bg-gojamu-50 shadow-sm shadow-gojamu-100',
    surface: 'border border-gojamu-100 bg-white shadow-sm shadow-gojamu-100',
} as const;

export type CardTone = keyof typeof cardToneClasses;

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    tone?: CardTone;
};

export function Card({ className = '', tone = 'surface', ...props }: CardProps) {
    return (
        <div
            className={[
                'rounded-3xl',
                cardToneClasses[tone],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        />
    );
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={['flex items-center justify-between gap-4', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <h2 className={['text-xl font-bold text-gojamu-950', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardDescription({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className={['text-sm text-herbal-500', className].filter(Boolean).join(' ')} {...props} />;
}
