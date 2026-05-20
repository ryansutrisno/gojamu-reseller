import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className = '', ...props }: TableHTMLAttributes<HTMLTableElement>) {
    return <table className={['w-full text-left text-sm', className].filter(Boolean).join(' ')} {...props} />;
}

export function TableHead({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={['bg-gojamu-50 text-xs uppercase tracking-wide text-herbal-500', className].filter(Boolean).join(' ')} {...props} />;
}

export function TableBody({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={['divide-y divide-herbal-100 text-herbal-700', className].filter(Boolean).join(' ')} {...props} />;
}

export function TableHeadCell({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return <th className={['px-4 py-3 font-semibold', className].filter(Boolean).join(' ')} {...props} />;
}

export function TableCell({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={['px-4 py-3', className].filter(Boolean).join(' ')} {...props} />;
}
