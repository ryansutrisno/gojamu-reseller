<?php

namespace App\Enums;

enum ShipmentStatus: string
{
    case Pending = 'pending';
    case ReadyToShip = 'ready_to_ship';
    case Processing = 'processing';
    case Packed = 'packed';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Failed = 'failed';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Belum Diproses',
            self::ReadyToShip => 'Siap Dikirim',
            self::Processing => 'Diproses',
            self::Packed => 'Dikemas',
            self::Shipped => 'Dikirim',
            self::Delivered => 'Terkirim',
            self::Failed => 'Gagal Dikirim',
            self::Returned => 'Dikembalikan',
            self::Cancelled => 'Dibatalkan',
        };
    }
}
