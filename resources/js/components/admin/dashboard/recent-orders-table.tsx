import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
} from '@/components/ui/table';
import {
    index as adminOrdersIndex,
    show as adminOrdersShow,
} from '@/routes/admin/orders';

import { StatusBadge } from './status-badge';
import type { OrderStatus } from './status-badge';

export type RecentOrder = {
    id: number;
    invoice: string;
    quantity: string;
    reseller: string;
    status: OrderStatus;
};

type RecentOrdersTableProps = {
    orders: RecentOrder[];
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between gap-4 px-5 py-5">
                <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-gojamu-500 uppercase">
                        Operasional
                    </p>
                    <CardTitle className="mt-1 text-xl text-gojamu-950">
                        Order terbaru
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Monitor transaksi yang paling dekat dengan pengiriman.
                    </CardDescription>
                </div>
                <Link
                    href={adminOrdersIndex.url()}
                    className="text-sm font-semibold text-gojamu-700 transition hover:text-gojamu-950"
                >
                    Lihat semua →
                </Link>
            </div>

            <div className="border-t border-herbal-100">
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeadCell>Invoice</TableHeadCell>
                            <TableHeadCell>Reseller</TableHeadCell>
                            <TableHeadCell>Qty</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <tr key={order.invoice}>
                                <TableCell className="font-bold text-gojamu-950">
                                    <Link
                                        href={adminOrdersShow.url(order.id)}
                                        className="hover:text-gojamu-700 hover:underline"
                                    >
                                        {order.invoice}
                                    </Link>
                                </TableCell>
                                <TableCell>{order.reseller}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>
                                    <StatusBadge status={order.status} />
                                </TableCell>
                            </tr>
                        ))}
                        {orders.length === 0 ? (
                            <tr>
                                <TableCell
                                    colSpan={4}
                                    className="py-6 text-center text-herbal-500"
                                >
                                    Belum ada order terbaru.
                                </TableCell>
                            </tr>
                        ) : null}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
