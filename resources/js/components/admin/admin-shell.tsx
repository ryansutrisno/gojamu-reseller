import type { ReactNode } from 'react';

type AdminShellProps = {
    children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-herbal-100 text-herbal-950">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(62,155,100,0.16),_transparent_60%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-24 -left-24 size-80 rounded-full bg-kunyit-100/30 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 size-96 rounded-full bg-gojamu-100/40 blur-3xl"
            />

            <div className="relative flex min-h-screen w-full bg-gojamu-50 lg:h-[100dvh] lg:overflow-hidden">
                {children}
            </div>
        </div>
    );
}
