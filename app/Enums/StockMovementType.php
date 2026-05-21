<?php

namespace App\Enums;

enum StockMovementType: string
{
    case InitialStock = 'initial_stock';
    case StockIn = 'stock_in';
    case StockAdjustment = 'stock_adjustment';
    case OrderReserved = 'order_reserved';
    case OrderCancelled = 'order_cancelled';
    case OrderShipped = 'order_shipped';
    case OrderCompleted = 'order_completed';
    case ReturnIn = 'return_in';

    public function label(): string
    {
        return match ($this) {
            self::InitialStock => 'Stok awal',
            self::StockIn => 'Stok masuk',
            self::StockAdjustment => 'Penyesuaian stok',
            self::OrderReserved => 'Stok dipesan',
            self::OrderCancelled => 'Order dibatalkan',
            self::OrderShipped => 'Order dikirim',
            self::OrderCompleted => 'Order selesai',
            self::ReturnIn => 'Retur masuk',
        };
    }
}
