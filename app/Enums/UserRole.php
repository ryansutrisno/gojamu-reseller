<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Admin = 'admin';
    case Warehouse = 'warehouse';
    case Finance = 'finance';
    case Reseller = 'reseller';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::Admin => 'Admin GoJamu',
            self::Warehouse => 'Admin Gudang',
            self::Finance => 'Finance',
            self::Reseller => 'Reseller',
        };
    }

    public function dashboardRouteName(): string
    {
        return $this === self::Reseller ? 'reseller.dashboard' : 'admin.dashboard';
    }
}
