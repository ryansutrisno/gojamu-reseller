import type { ButtonHTMLAttributes } from 'react';

const buttonVariantClasses = {
    dark: 'bg-gojamu-950 text-white shadow-lg shadow-gojamu-950/15 hover:bg-gojamu-700',
    ghost: 'text-herbal-700 hover:bg-herbal-100',
    primary: 'bg-gojamu-700 text-white shadow-lg shadow-gojamu-700/15 hover:bg-gojamu-500',
    secondary: 'border border-gojamu-100 bg-gojamu-50 text-gojamu-700 hover:bg-white',
    soft: 'bg-white/10 text-white hover:bg-white/20',
} as const;

const buttonSizeClasses = {
    icon: 'size-10 p-0 text-base',
    lg: 'h-12 px-5 text-base',
    md: 'h-11 px-4 text-sm',
    sm: 'h-9 px-3 text-sm',
} as const;

export type ButtonVariant = keyof typeof buttonVariantClasses;
export type ButtonSize = keyof typeof buttonSizeClasses;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: ButtonSize;
    variant?: ButtonVariant;
};

export function Button({ className = '', size = 'md', type = 'button', variant = 'primary', ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-60',
                buttonVariantClasses[variant],
                buttonSizeClasses[size],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        />
    );
}
