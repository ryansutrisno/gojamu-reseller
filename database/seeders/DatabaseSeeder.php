<?php

namespace Database\Seeders;

use App\Enums\PriceTierStatus;
use App\Enums\ProductStatus;
use App\Enums\ResellerStatus;
use App\Enums\RewardStatus;
use App\Enums\StockMovementType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\WarehouseStatus;
use App\Models\Inventory;
use App\Models\PriceTier;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Reseller;
use App\Models\Reward;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = $this->seedUsers();
        $warehouses = $this->seedWarehouses();
        $products = $this->seedProducts();
        $this->seedPriceTiers();
        $this->seedRewards();
        $this->seedResellerProfile($users['reseller@gojamu.test']);
        $this->seedInventory($warehouses['WH-JKT'], $products, $users['admin@gojamu.test']);
    }

    /**
     * @return array<string, User>
     */
    private function seedUsers(): array
    {
        $seedUsers = [
            ['name' => 'Super Admin GoJamu', 'email' => 'superadmin@gojamu.test', 'role' => UserRole::SuperAdmin],
            ['name' => 'Admin GoJamu', 'email' => 'admin@gojamu.test', 'role' => UserRole::Admin],
            ['name' => 'Admin Gudang GoJamu', 'email' => 'gudang@gojamu.test', 'role' => UserRole::Warehouse],
            ['name' => 'Finance GoJamu', 'email' => 'finance@gojamu.test', 'role' => UserRole::Finance],
            ['name' => 'Reseller Demo GoJamu', 'email' => 'reseller@gojamu.test', 'role' => UserRole::Reseller],
        ];

        $users = [];

        foreach ($seedUsers as $user) {
            $users[$user['email']] = User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => 'password',
                    'role' => $user['role'],
                    'status' => UserStatus::Active,
                ],
            );
        }

        return $users;
    }

    /**
     * @return array<string, Warehouse>
     */
    private function seedWarehouses(): array
    {
        $seedWarehouses = [
            [
                'code' => 'WH-JKT',
                'name' => 'Gudang Utama Jakarta',
                'address' => 'Jl. Raya GoJamu No. 1',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
            ],
            [
                'code' => 'WH-SBY',
                'name' => 'Gudang Mitra Surabaya',
                'address' => 'Jl. Herbal Nusantara No. 12',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
            ],
        ];

        $warehouses = [];

        foreach ($seedWarehouses as $warehouse) {
            $warehouses[$warehouse['code']] = Warehouse::query()->updateOrCreate(
                ['code' => $warehouse['code']],
                [
                    ...$warehouse,
                    'status' => WarehouseStatus::Active,
                ],
            );
        }

        return $warehouses;
    }

    /**
     * @return array<string, array{product: Product, variants: array<string, ProductVariant>}>
     */
    private function seedProducts(): array
    {
        $seedProducts = [
            [
                'sku' => 'GJ-KA',
                'name' => 'GoJamu Kunyit Asam',
                'description' => 'Minuman herbal kunyit asam siap jual untuk reseller.',
                'weight_gram' => 250,
                'sort_order' => 1,
                'color_key' => 'amber',
                'color_hex' => '#F59E0B',
                'variants' => [
                    ['sku' => 'GJ-KA-12', 'name' => 'Dus 12 pcs', 'weight_gram' => 3000, 'stock' => 240, 'threshold' => 36],
                    ['sku' => 'GJ-KA-24', 'name' => 'Dus 24 pcs', 'weight_gram' => 6000, 'stock' => 180, 'threshold' => 24],
                ],
            ],
            [
                'sku' => 'GJ-BK',
                'name' => 'GoJamu Beras Kencur',
                'description' => 'Produk herbal beras kencur untuk repeat order reseller.',
                'weight_gram' => 250,
                'sort_order' => 2,
                'color_key' => 'orange',
                'color_hex' => '#F97316',
                'variants' => [
                    ['sku' => 'GJ-BK-12', 'name' => 'Dus 12 pcs', 'weight_gram' => 3000, 'stock' => 180, 'threshold' => 36],
                    ['sku' => 'GJ-BK-24', 'name' => 'Dus 24 pcs', 'weight_gram' => 6000, 'stock' => 120, 'threshold' => 24],
                ],
            ],
            [
                'sku' => 'GJ-JM',
                'name' => 'GoJamu Jahe Merah',
                'description' => 'Produk jahe merah hangat untuk paket reseller musiman.',
                'weight_gram' => 250,
                'sort_order' => 3,
                'color_key' => 'red',
                'color_hex' => '#EF4444',
                'variants' => [
                    ['sku' => 'GJ-JM-12', 'name' => 'Dus 12 pcs', 'weight_gram' => 3000, 'stock' => 150, 'threshold' => 30],
                    ['sku' => 'GJ-JM-24', 'name' => 'Dus 24 pcs', 'weight_gram' => 6000, 'stock' => 96, 'threshold' => 24],
                ],
            ],
        ];

        $products = [];

        foreach ($seedProducts as $productData) {
            $variants = $productData['variants'];
            unset($productData['variants']);

            $product = Product::query()->updateOrCreate(
                ['sku' => $productData['sku']],
                [
                    ...$productData,
                    'slug' => Str::slug($productData['name']),
                    'image' => null,
                    'status' => ProductStatus::Active,
                ],
            );

            $products[$product->sku] = [
                'product' => $product,
                'variants' => [],
            ];

            foreach ($variants as $variantData) {
                $variant = ProductVariant::query()->updateOrCreate(
                    ['sku' => $variantData['sku']],
                    [
                        'product_id' => $product->id,
                        'name' => $variantData['name'],
                        'weight_gram' => $variantData['weight_gram'],
                        'image' => null,
                        'status' => ProductStatus::Active,
                    ],
                );

                $products[$product->sku]['variants'][$variant->sku] = $variant;
                $products[$product->sku]['inventory'][$variant->sku] = [
                    'stock' => $variantData['stock'],
                    'threshold' => $variantData['threshold'],
                ];
            }
        }

        return $products;
    }

    private function seedPriceTiers(): void
    {
        $tiers = [
            ['name' => 'Tier 1-12 pcs', 'min_qty' => 1, 'max_qty' => 12, 'price_per_pcs' => 55000],
            ['name' => 'Tier 13-50 pcs', 'min_qty' => 13, 'max_qty' => 50, 'price_per_pcs' => 47000],
            ['name' => 'Tier 51-100 pcs', 'min_qty' => 51, 'max_qty' => 100, 'price_per_pcs' => 42000],
            ['name' => 'Tier 101-200 pcs', 'min_qty' => 101, 'max_qty' => 200, 'price_per_pcs' => 37000],
            ['name' => 'Tier 201-300 pcs', 'min_qty' => 201, 'max_qty' => 300, 'price_per_pcs' => 32000],
        ];

        foreach ($tiers as $tier) {
            PriceTier::query()->updateOrCreate(
                ['name' => $tier['name']],
                [
                    ...$tier,
                    'status' => PriceTierStatus::Active,
                    'starts_at' => null,
                    'ends_at' => null,
                ],
            );
        }
    }

    private function seedRewards(): void
    {
        $rewards = [
            ['name' => 'Voucher Belanja Rp50.000', 'required_points' => 100, 'stock' => 100],
            ['name' => 'Free Ongkir Nasional', 'required_points' => 150, 'stock' => 75],
            ['name' => 'Paket Display Counter', 'required_points' => 300, 'stock' => 30],
        ];

        foreach ($rewards as $reward) {
            Reward::query()->updateOrCreate(
                ['name' => $reward['name']],
                [
                    ...$reward,
                    'image' => null,
                    'description' => 'Reward loyalitas reseller GoJamu.',
                    'status' => RewardStatus::Active,
                    'start_date' => null,
                    'end_date' => null,
                ],
            );
        }
    }

    private function seedResellerProfile(User $user): void
    {
        Reseller::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'reseller_code' => 'RS-DEMO-001',
                'name' => $user->name,
                'phone' => '+6281234567890',
                'email' => $user->email,
                'address' => 'Jl. Reseller Demo No. 10',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'postal_code' => '40111',
                'status' => ResellerStatus::Active,
                'joined_at' => now()->toDateString(),
                'total_qty_purchased' => 0,
                'total_spent' => 0,
                'current_points' => 0,
                'internal_notes' => 'Akun demo reseller untuk pengujian.',
            ],
        );
    }

    /**
     * @param  array<string, array{product: Product, variants: array<string, ProductVariant>, inventory?: array<string, array{stock: int, threshold: int}>}>  $products
     */
    private function seedInventory(Warehouse $warehouse, array $products, User $creator): void
    {
        foreach ($products as $productBundle) {
            foreach ($productBundle['variants'] as $variantSku => $variant) {
                $stock = $productBundle['inventory'][$variantSku]['stock'] ?? 0;
                $threshold = $productBundle['inventory'][$variantSku]['threshold'] ?? 0;

                Inventory::query()->updateOrCreate(
                    [
                        'warehouse_id' => $warehouse->id,
                        'product_id' => $productBundle['product']->id,
                        'product_variant_id' => $variant->id,
                    ],
                    [
                        'stock_available' => $stock,
                        'stock_reserved' => 0,
                        'low_stock_threshold' => $threshold,
                    ],
                );

                StockMovement::query()->firstOrCreate(
                    [
                        'warehouse_id' => $warehouse->id,
                        'product_id' => $productBundle['product']->id,
                        'product_variant_id' => $variant->id,
                        'type' => StockMovementType::InitialStock,
                        'notes' => 'Stok awal dari seeder.',
                    ],
                    [
                        'qty' => $stock,
                        'stock_before' => 0,
                        'stock_after' => $stock,
                        'created_by' => $creator->id,
                    ],
                );
            }
        }
    }
}
