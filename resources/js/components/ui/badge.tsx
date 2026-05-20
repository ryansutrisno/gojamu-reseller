import type { HTMLAttributes } from 'react';

const badgeToneClasses = {
    dark: 'bg-gojamu-950 text-white',
    danger: 'bg-mahakunir-100 text-mahakunir-900',
    info: 'bg-nirlawa-100 text-nirlawa-900',
    neutral: 'bg-herbal-100 text-herbal-700',
    success: 'bg-gojamu-100 text-gojamu-700',
    warning: 'bg-kunyit-100 text-kunyit-900',
} as const;

export type BadgeTone = keyof typeof badgeToneClasses;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    tone?: BadgeTone;
};

export function Badge({ children, className = '', tone = 'neutral', ...props }: BadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold leading-none whitespace-nowrap',
                badgeToneClasses[tone],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {children}
        </span>
    );
}
