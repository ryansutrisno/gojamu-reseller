<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Super Admin GoJamu', 'email' => 'superadmin@gojamu.test', 'role' => UserRole::SuperAdmin],
            ['name' => 'Admin GoJamu', 'email' => 'admin@gojamu.test', 'role' => UserRole::Admin],
            ['name' => 'Admin Gudang GoJamu', 'email' => 'gudang@gojamu.test', 'role' => UserRole::Warehouse],
            ['name' => 'Finance GoJamu', 'email' => 'finance@gojamu.test', 'role' => UserRole::Finance],
            ['name' => 'Reseller Demo GoJamu', 'email' => 'reseller@gojamu.test', 'role' => UserRole::Reseller],
        ];

        foreach ($users as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => 'password',
                    'role' => $user['role'],
                    'status' => UserStatus::Active,
                ],
            );
        }
    }
}
