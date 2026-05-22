<?php

namespace App\Enums;

enum ShipmentStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Packed = 'packed';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Belum Diproses',
            self::Processing => 'Diproses',
            self::Packed => 'Dikemas',
            self::Shipped => 'Dikirim',
            self::Delivered => 'Terkirim',
            self::Cancelled => 'Dibatalkan',
        };
    }
}
