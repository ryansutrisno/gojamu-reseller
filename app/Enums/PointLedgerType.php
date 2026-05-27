<?php

namespace App\Enums;

enum PointLedgerType: string
{
    case Credit = 'credit';
    case Debit = 'debit';

    public function label(): string
    {
        return match ($this) {
            self::Credit => 'Penambahan Poin',
            self::Debit => 'Pengurangan Poin',
        };
    }
}
