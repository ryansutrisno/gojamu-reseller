# GoJamu Reseller Management System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13.x-red?style=for-the-badge&logo=laravel" alt="Laravel 13">
  <img src="https://img.shields.io/badge/PHP-8.3%2B-blue?style=for-the-badge&logo=php" alt="PHP 8.3+">
  <img src="https://img.shields.io/badge/Inertia-3.x-purple?style=for-the-badge" alt="Inertia 3">
  <img src="https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Tailwind-4.x-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4">
</p>

GoJamu Reseller Management System adalah aplikasi manajemen reseller untuk operasional GoJamu: autentikasi berbasis role, dashboard admin/reseller, master data produk, gudang, inventory, price tier, reward, dan pergerakan stok. Project ini dibangun dengan Laravel 13, Inertia.js v3, React 19, Tailwind CSS v4, Wayfinder, dan Pest.

> Status saat ini: **Milestone 1 Foundation** dan **Milestone 2 Backend Foundation** sudah selesai serta tervalidasi.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi Lokal](#instalasi-lokal)
- [Akun Demo](#akun-demo)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Project](#struktur-project)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Domain dan Database](#domain-dan-database)
- [Environment Variables](#environment-variables)
- [Command yang Tersedia](#command-yang-tersedia)
- [Testing dan Quality Check](#testing-dan-quality-check)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap Singkat](#roadmap-singkat)
- [Lisensi](#lisensi)

---

## Fitur Utama

### Foundation & Auth

- Login/logout berbasis session Laravel.
- Role-based dashboard redirect.
- Middleware role dan status user aktif.
- Role internal: Super Admin, Admin, Gudang, Finance.
- Role reseller dengan dashboard terpisah.
- Inertia shared auth props untuk frontend.

### Admin UI Foundation

- Layout admin full-screen/edge-to-edge.
- Sidebar, topbar, navigation group, navigation item, dan user card.
- Komponen UI reusable: button, badge, card, table.
- Dashboard admin dengan stat card, stock card, quick actions, status badge, dan recent orders table.

### Reseller UI Foundation

- Dashboard reseller awal.
- Layout reseller terpisah.
- Routing role-based untuk akses reseller.

### Backend Master Data

- Master reseller dan relasi ke user.
- Master produk dan product variant.
- Master warehouse/gudang.
- Inventory per gudang, produk, dan variant.
- Stock movement untuk audit stok.
- Price tier reseller berbasis kuantitas.
- Reward loyalitas reseller.
- Seeder default untuk akun demo, produk, gudang, inventory, price tier, reward, dan profil reseller demo.

---

## Tech Stack

| Area | Teknologi |
| --- | --- |
| Backend | Laravel 13 |
| Language | PHP 8.3+; CI menjalankan PHP 8.3, 8.4, 8.5 |
| Frontend Bridge | Inertia.js Laravel v3 + `@inertiajs/react` v3 |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Route Helpers | Laravel Wayfinder |
| Database | MySQL secara default di `.env.example`; SQLite in-memory untuk test |
| Queue/Session/Cache | Database driver secara default |
| Testing | Pest 4 + PHPUnit 12 |
| PHP Formatter | Laravel Pint |
| Frontend Quality | ESLint 9, Prettier 3, TypeScript |
| Local Tooling | Laravel Herd direkomendasikan |

---

## Prasyarat

Pastikan tool berikut tersedia di mesin lokal:

- PHP 8.3 atau lebih baru.
- Composer 2.
- Node.js 22 direkomendasikan, mengikuti GitHub Actions project ini.
- npm.
- MySQL/MariaDB untuk development normal, atau sesuaikan `.env` jika memakai SQLite/PostgreSQL.
- Laravel Herd direkomendasikan untuk macOS.

Opsional:

- Laravel Sail jika ingin menjalankan environment berbasis Docker.
- Redis jika nanti driver cache/queue/session dipindah dari database ke Redis.

---

## Instalasi Lokal

### 1. Clone Repository

```bash
git clone <repository-url> gojamu-reseller
cd gojamu-reseller
```

### 2. Install Dependency Backend

```bash
composer install
```

### 3. Install Dependency Frontend

```bash
npm install
```

### 4. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan konfigurasi database di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gojamu_reseller
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Jalankan Migrasi dan Seeder

```bash
php artisan migrate --seed
```

Seeder akan membuat:

- Akun internal demo.
- Akun reseller demo.
- Gudang Jakarta dan Surabaya.
- Produk GoJamu dan varian paket.
- Inventory awal di gudang utama.
- Initial stock movement.
- Price tier reseller.
- Reward loyalitas reseller.

### 6. Build Frontend Assets

```bash
npm run build
```

### 7. Setup Sekali Jalan

Project juga menyediakan script Composer untuk setup awal:

```bash
composer run setup
```

Script ini menjalankan `composer install`, membuat `.env` bila belum ada, generate app key, menjalankan migrasi, install dependency npm, dan build asset.

---

## Akun Demo

Semua akun demo memakai password:

```text
password
```

| Email | Role | Dashboard |
| --- | --- | --- |
| `superadmin@gojamu.test` | Super Admin | `/admin/dashboard` |
| `admin@gojamu.test` | Admin | `/admin/dashboard` |
| `gudang@gojamu.test` | Gudang | `/admin/dashboard` |
| `finance@gojamu.test` | Finance | `/admin/dashboard` |
| `reseller@gojamu.test` | Reseller | `/reseller/dashboard` |

Profil reseller demo dibuat dengan kode:

```text
RS-DEMO-001
```

---

## Menjalankan Aplikasi

### Laravel Herd

Jika menggunakan Laravel Herd, project biasanya tersedia otomatis di:

```text
https://gojamu-reseller.test
```

Jalankan Vite untuk development frontend:

```bash
npm run dev
```

### Composer Dev Script

Untuk menjalankan server Laravel, queue listener, log tailing, dan Vite bersamaan:

```bash
composer run dev
```

Script ini menjalankan:

- `php artisan serve --host=localhost`
- `php artisan queue:listen --tries=1 --timeout=0`
- `php artisan pail --timeout=0`
- `npm run dev`

### Manual

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

Kemudian buka URL lokal yang tampil di terminal atau URL Herd.

---

## Struktur Project

```text
gojamu-reseller/
├── app/
│   ├── Enums/                  # Enum role, status, dan tipe domain
│   ├── Http/
│   │   ├── Controllers/         # Controller auth dan controller dasar
│   │   └── Middleware/          # Inertia props dan role middleware
│   └── Models/                  # Eloquent models domain GoJamu
├── bootstrap/                   # Bootstrap Laravel dan middleware registration
├── config/                      # Konfigurasi Laravel
├── database/
│   ├── factories/               # Factory Pest/Eloquent
│   ├── migrations/              # Struktur database
│   └── seeders/                 # Data awal development/demo
├── public/                      # Entry point dan asset hasil build
├── resources/
│   ├── css/                     # Tailwind CSS entry
│   └── js/
│       ├── actions/             # Generated Wayfinder controller actions
│       ├── components/          # Komponen UI dan admin dashboard
│       ├── layouts/             # Admin dan reseller layout
│       ├── pages/               # Inertia pages
│       ├── routes/              # Generated Wayfinder route helpers
│       └── types/               # TypeScript shared types
├── routes/
│   └── web.php                  # Route web utama
├── specs/                       # Dokumen/artefak spesifikasi project
├── storage/                     # Storage Laravel
├── tests/                       # Pest tests
├── composer.json                # PHP dependencies dan Composer scripts
├── package.json                 # JS dependencies dan npm scripts
├── phpunit.xml                  # Konfigurasi PHPUnit/Pest
├── pint.json                    # Konfigurasi Laravel Pint
├── eslint.config.js             # Konfigurasi ESLint
├── tsconfig.json                # Konfigurasi TypeScript
└── vite.config.ts               # Vite, React, Inertia, Tailwind, Wayfinder
```

---

## Arsitektur Aplikasi

### Request Lifecycle

1. Browser mengakses route Laravel di `routes/web.php`.
2. Middleware Laravel memproses session, auth, dan role.
3. Controller/closure route mengembalikan Inertia response.
4. Inertia merender React page dari `resources/js/pages`.
5. React page memakai layout dan komponen UI dari `resources/js/layouts` dan `resources/js/components`.

### Data Flow

```text
User Action
  ↓
React/Inertia Page
  ↓
Inertia Visit / Form Submit
  ↓
Laravel Route + Middleware
  ↓
Controller / Eloquent Model
  ↓
Database
  ↓
Inertia Props kembali ke React
```

### Authentication & Authorization

- Auth menggunakan session Laravel standar.
- Login ditangani oleh `AuthenticatedSessionController`.
- Role dan status user disimpan sebagai enum di model `User`.
- Middleware `EnsureUserHasRole` membatasi dashboard admin/reseller.
- User tidak aktif tidak boleh masuk area protected.
- Root `/` akan redirect ke login atau dashboard sesuai role.

### Inertia + React

- Entry frontend berada di `resources/js/app.tsx`.
- Page Inertia berada di `resources/js/pages`.
- Shared auth props diproses oleh `HandleInertiaRequests`.
- Wayfinder menghasilkan route/action helpers TypeScript di `resources/js/actions` dan `resources/js/routes`.

### UI Layer

Admin UI dipisah menjadi komponen-komponen kecil:

- `AdminShell`
- `AdminSidebar`
- `AdminTopbar`
- `AdminNavGroup`
- `AdminNavItem`
- `AdminUserCard`
- Dashboard widgets seperti `StatCard`, `StockCard`, `QuickActionsCard`, dan `RecentOrdersTable`.

Komponen UI reusable:

- `Button`
- `Badge`
- `Card`
- `Table`

---

## Domain dan Database

### Core Models

| Model | Fungsi |
| --- | --- |
| `User` | Akun login internal dan reseller |
| `Reseller` | Profil reseller yang terhubung ke user |
| `Product` | Master produk GoJamu |
| `ProductVariant` | Varian/paket produk |
| `Warehouse` | Gudang/lokasi stok |
| `Inventory` | Saldo stok per gudang, produk, dan variant |
| `StockMovement` | Audit trail pergerakan stok |
| `PriceTier` | Harga reseller berdasarkan kuantitas |
| `Reward` | Hadiah/reward loyalitas reseller |

### Enums

| Enum | Nilai utama |
| --- | --- |
| `UserRole` | Super Admin, Admin, Warehouse, Finance, Reseller |
| `UserStatus` | Active, Inactive |
| `ResellerStatus` | Active, Inactive |
| `ProductStatus` | Active, Inactive |
| `WarehouseStatus` | Active, Inactive |
| `PriceTierStatus` | Active, Inactive |
| `RewardStatus` | Active, Inactive |
| `StockMovementType` | Initial Stock, Stock In, Stock Adjustment, Order Reserved, Order Cancelled, Order Shipped, Order Completed, Return In |

### Relasi Utama

```text
User
└── hasOne Reseller

Product
├── hasMany ProductVariant
├── hasMany Inventory
└── hasMany StockMovement

ProductVariant
├── belongsTo Product
└── hasMany Inventory

Warehouse
├── hasMany Inventory
└── hasMany StockMovement

Inventory
├── belongsTo Warehouse
├── belongsTo Product
└── belongsTo ProductVariant nullable

StockMovement
├── belongsTo Warehouse
├── belongsTo Product
├── belongsTo ProductVariant nullable
└── belongsTo User as creator
```

### Tabel Penting

| Tabel | Catatan |
| --- | --- |
| `users` | Role/status enum, password hashed, remember token |
| `resellers` | Profil reseller, kode unik, status, metrics pembelian dan poin |
| `products` | SKU dan slug unik, warna UI, status, sort order |
| `product_variants` | SKU unik per varian, product FK |
| `warehouses` | Kode gudang unik, status |
| `inventories` | Unique composite `warehouse_id`, `product_id`, `product_variant_id` |
| `stock_movements` | Nullable `order_id` dan `order_item_id` untuk integrasi order berikutnya |
| `price_tiers` | Rentang kuantitas dan harga per pcs |
| `rewards` | Required points, stok opsional, periode opsional |

---

## Environment Variables

File contoh tersedia di `.env.example`.

### Application

| Variable | Deskripsi | Default contoh |
| --- | --- | --- |
| `APP_NAME` | Nama aplikasi | `Laravel` |
| `APP_ENV` | Environment aplikasi | `local` |
| `APP_KEY` | Encryption key Laravel | kosong sebelum `key:generate` |
| `APP_DEBUG` | Debug mode | `true` |
| `APP_URL` | URL aplikasi | `http://localhost` |
| `APP_LOCALE` | Locale utama | `en` |

### Database

| Variable | Deskripsi | Default contoh |
| --- | --- | --- |
| `DB_CONNECTION` | Driver database | `mysql` |
| `DB_HOST` | Host database | `127.0.0.1` |
| `DB_PORT` | Port database | `3306` |
| `DB_DATABASE` | Nama database | `laravel` |
| `DB_USERNAME` | Username database | `root` |
| `DB_PASSWORD` | Password database | kosong |

### Session, Queue, Cache

| Variable | Deskripsi | Default contoh |
| --- | --- | --- |
| `SESSION_DRIVER` | Driver session | `database` |
| `QUEUE_CONNECTION` | Driver queue | `database` |
| `CACHE_STORE` | Driver cache | `database` |
| `BROADCAST_CONNECTION` | Driver broadcast | `log` |
| `FILESYSTEM_DISK` | Disk file default | `local` |

### Mail

| Variable | Deskripsi | Default contoh |
| --- | --- | --- |
| `MAIL_MAILER` | Driver email | `log` |
| `MAIL_HOST` | Host SMTP | `127.0.0.1` |
| `MAIL_PORT` | Port SMTP | `2525` |
| `MAIL_USERNAME` | Username SMTP | `null` |
| `MAIL_PASSWORD` | Password SMTP | `null` |
| `MAIL_FROM_ADDRESS` | Email pengirim | `hello@example.com` |
| `MAIL_FROM_NAME` | Nama pengirim | `${APP_NAME}` |

### Frontend

| Variable | Deskripsi |
| --- | --- |
| `VITE_APP_NAME` | Nama aplikasi yang diekspos ke Vite/frontend |

---

## Command yang Tersedia

### Composer Scripts

| Command | Fungsi |
| --- | --- |
| `composer run setup` | Setup awal project |
| `composer run dev` | Jalankan server, queue, pail logs, dan Vite bersama-sama |
| `composer run lint` | Format PHP dengan Pint parallel |
| `composer run lint:check` | Cek format PHP tanpa memperbaiki |
| `composer run test` | Clear config, cek Pint, lalu jalankan test Laravel |
| `composer run ci:check` | Frontend lint/format/type check dan backend test |

### NPM Scripts

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Jalankan Vite dev server |
| `npm run build` | Build asset production |
| `npm run build:ssr` | Build asset client dan SSR |
| `npm run format` | Format file di `resources/` dengan Prettier |
| `npm run format:check` | Cek format frontend |
| `npm run lint` | Jalankan ESLint dengan auto-fix |
| `npm run lint:check` | Jalankan ESLint tanpa auto-fix |
| `npm run types:check` | TypeScript check tanpa emit |

### Artisan Commands Umum

| Command | Fungsi |
| --- | --- |
| `php artisan migrate` | Jalankan migrasi database |
| `php artisan migrate --seed` | Migrasi dan seed data default |
| `php artisan migrate:fresh --seed` | Reset database lalu seed ulang |
| `php artisan db:seed` | Jalankan seeder saja |
| `php artisan route:list` | Lihat daftar route |
| `php artisan config:clear` | Bersihkan config cache |
| `php artisan cache:clear` | Bersihkan application cache |
| `php artisan wayfinder:generate --with-form --no-interaction` | Generate Wayfinder helpers |
| `php artisan test --compact` | Jalankan Pest dengan output ringkas |

---

## Testing dan Quality Check

### Backend Test

```bash
php artisan test --compact
```

Atau melalui Composer:

```bash
composer run test
```

Test project memakai Pest. Konfigurasi test berada di `phpunit.xml` dan memakai SQLite in-memory untuk test suite.

### PHP Formatting

```bash
vendor/bin/pint --dirty --format agent
```

Untuk cek tanpa memperbaiki:

```bash
composer run lint:check
```

### Frontend Checks

```bash
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

### CI Check Lokal

```bash
composer run ci:check
```

### Status Validasi Terakhir

Validasi terakhir yang sudah dijalankan:

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact
```

Hasil:

- Pint: passed.
- Pest: 7 tests, 25 assertions, passed.

---

## Development Workflow

1. Ambil branch terbaru.
2. Jalankan dependency install bila ada perubahan lockfile.
3. Jalankan migrasi bila ada migration baru.
4. Untuk perubahan backend:
   - Ikuti convention Laravel.
   - Tambahkan/ubah Pest test bila perilaku berubah.
   - Jalankan Pint.
   - Jalankan `php artisan test --compact`.
5. Untuk perubahan frontend:
   - Pakai komponen reusable yang sudah ada.
   - Jalankan `npm run types:check`.
   - Jalankan `npm run build`.
6. Untuk route frontend/backend:
   - Gunakan Wayfinder helpers, bukan hardcoded URL bila memungkinkan.
   - Regenerate helper dengan `php artisan wayfinder:generate --with-form --no-interaction` setelah route/controller berubah.

---

## Deployment

Belum ada konfigurasi deployment khusus seperti Dockerfile, Render, Fly.io, atau Vercel di project root. Panduan berikut adalah baseline deployment Laravel standar.

### Pre-Deployment Checklist

Pastikan environment production diset aman:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

Pastikan database production sudah dikonfigurasi:

```env
DB_CONNECTION=mysql
DB_HOST=<production-host>
DB_PORT=3306
DB_DATABASE=<production-database>
DB_USERNAME=<production-user>
DB_PASSWORD=<production-password>
```

### Build dan Optimize

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

### Permission

Pastikan web server dapat menulis ke folder berikut:

```bash
storage/
bootstrap/cache/
```

Contoh di server Linux:

```bash
chmod -R 775 storage bootstrap/cache
```

### Queue Worker

Project memakai `QUEUE_CONNECTION=database` secara default. Jika fitur queue dipakai di production, jalankan worker dengan process manager seperti Supervisor:

```bash
php artisan queue:work --tries=3
```

---

## GitHub Actions

Project memiliki dua workflow:

### `tests.yml`

- Trigger: push dan pull request ke `develop`, `main`, `master`, `workos`.
- Matrix PHP: 8.3, 8.4, 8.5.
- Setup Node 22.
- Install npm dan composer dependencies.
- Generate app key.
- Build assets.
- Jalankan Pest.

### `lint.yml`

- Trigger: push dan pull request ke `develop`, `main`, `master`, `workos`.
- Setup PHP 8.4.
- Install Composer dan npm dependencies.
- Jalankan Pint.
- Format frontend.
- Lint frontend.

---

## Troubleshooting

### Vite Manifest Error

Error:

```text
Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest
```

Solusi:

```bash
npm run build
```

Untuk development aktif:

```bash
npm run dev
```

### Database Connection Error

Jika muncul error koneksi database:

1. Pastikan MySQL/MariaDB berjalan.
2. Pastikan database di `.env` sudah dibuat.
3. Cek credential `DB_USERNAME` dan `DB_PASSWORD`.
4. Jalankan ulang migrasi:

```bash
php artisan migrate
```

### Login Redirect Tidak Sesuai Role

Pastikan user memiliki `role` dan `status` valid. User nonaktif tidak boleh masuk dashboard protected.

Cek route:

```bash
php artisan route:list
```

### Frontend Tidak Update

Jika perubahan React/Tailwind tidak terlihat:

```bash
npm run dev
```

Atau rebuild asset:

```bash
npm run build
```

### Wayfinder Helper Tidak Sinkron

Jika import dari `@/actions` atau `@/routes` error setelah route berubah:

```bash
php artisan wayfinder:generate --with-form --no-interaction
npm run types:check
```

### Test Gagal Karena Config Cache

```bash
php artisan config:clear
php artisan test --compact
```

---

## Roadmap Singkat

### Selesai

- Foundation auth, role, status, middleware.
- Admin/reseller dashboard routing.
- Admin UI shell dan dashboard components.
- Backend foundation untuk reseller, product, variant, warehouse, inventory, stock movement, price tier, reward.
- Factory dan seeder default master data.

### Berikutnya

- CRUD admin untuk master data.
- Alur order reseller.
- Reservasi stok dan fulfillment gudang.
- Perhitungan poin reseller.
- Reward redemption.
- Reporting admin dan finance.
- Hardening authorization/policies per fitur.

---

## Kontribusi

Untuk kontribusi internal:

1. Buat branch feature/fix.
2. Ikuti convention Laravel dan struktur yang sudah ada.
3. Tambahkan test untuk behavior baru.
4. Jalankan quality check lokal.
5. Buat pull request dengan ringkasan perubahan dan hasil test.

Checklist sebelum PR:

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact
npm run types:check
npm run build
```

> Untuk perubahan backend-only, frontend check bisa dilewati jika tidak ada file frontend yang berubah.

---

## Lisensi

Project ini menggunakan lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail.

---

## Credits

- **Ryan Sutrisno** - [GitHub](https://github.com/ryansutrisno)
