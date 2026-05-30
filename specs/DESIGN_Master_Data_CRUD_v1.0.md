# DESIGN: Master Data & Settings CRUD (Milestone 2)

Dokumen ini mendetailkan spesifikasi teknis dan desain antarmuka untuk fitur **Master Data & Pengaturan** (Milestone 2) pada GoJamu Reseller Management System.

---

## 1. Rangkuman Pemahaman (Understanding Summary)

* **Tujuan**: Membangun antarmuka CRUD (Create, Read, Update, Delete) yang lengkap namun minimalis untuk mengelola entitas data master utama.
* **Pengguna**:
  * `SuperAdmin` & `Admin`: Akses penuh untuk semua menu (Reseller, Produk, Price Tier, Reward).
  * `Warehouse` (Gudang): Akses melihat produk dan melakukan penyesuaian stok (*Stock Adjustment*) saja.
* **Entitas Utama**:
  1. **Reseller** (dan akun User terkait)
  2. **Product** (dan varian default-nya)
  3. **Price Tier** (Tier harga berdasarkan kuantitas)
  4. **Reward** (Daftar hadiah penukaran poin)
* **Non-Goals MVP**:
  * Tidak ada manajemen permission tingkat granular (cukup berdasarkan pengecekan role default).
  * Tidak ada integrasi pihak ketiga untuk penyimpanan gambar (menggunakan local disk storage).

---

## 2. Asumsi-Asumsi Desain

1. **Akun Reseller Baru**: Pembuatan data reseller baru melalui Admin Panel akan otomatis membuat baris data di tabel `users` (dengan role `reseller`, status `active`) dan mengaitkannya ke tabel `resellers`.
2. **Password Reseller**: Password untuk reseller baru ditentukan oleh admin secara manual saat input atau menggunakan password default (seperti `password`) untuk memudahkan admin menginformasikannya ke reseller.
3. **Varian Produk**: Untuk MVP, setiap produk memiliki minimal satu varian default agar struktur relasi database tetap future-friendly tanpa mempersulit UI.

---

## 3. Catatan Keputusan (Decision Log)

| Keputusan | Alternatif Dipertimbangkan | Alasan Memilih Opsi Ini |
| :--- | :--- | :--- |
| **Pendekatan Halaman Terpisah (Granular CRUD Pages)** | Single Page Tab Hub, Inline Modals | Lebih mudah didebug, terisolasi dengan baik, dan fleksibel untuk pengembangan fitur tiap modul di masa depan. |
| **Input Password Reseller Manual/Default** | Auto-generate & Kirim email otomatis | Menghemat kompleksitas integrasi email/WA API sejak MVP dan mempermudah admin memberi tahu reseller secara langsung. |
| **Penggunaan SoftDeletes & Snapshot** | Hard delete dengan Cascade, Nullable foreign keys | Melindungi laporan transaksi lama (Order, Invoice, Ledger) agar tidak rusak ketika produk atau reseller dihapus. |

---

## 4. Desain Detail Teknikal

### A. Rute Backend (Routing)
Rute didaftarkan pada [web.php](file:///Users/ryansutrisno/Sites/gojamu-reseller/routes/web.php) di bawah proteksi middleware otentikasi dan pengecekan role:

```php
Route::middleware('role:super_admin,admin')->group(function (): void {
    Route::resource('resellers', ResellerController::class);
    Route::post('resellers/{reseller}/reset-password', [ResellerController::class, 'resetPassword'])->name('resellers.reset-password');
    Route::resource('products', ProductController::class)->except(['show']);
    Route::resource('price-tiers', PriceTierController::class)->except(['show']);
    Route::resource('rewards', RewardController::class);
});

Route::middleware('role:super_admin,admin,warehouse')->group(function (): void {
    Route::post('products/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');
});
```

### B. Alur Validasi Spesifik
1. **Validasi Price Tier (Anti-Overlap)**:
   Sebelum menyimpan tier baru atau memperbarui tier, sistem memvalidasi bahwa tidak ada rentang `min_qty` dan `max_qty` yang tumpang tindih dengan tier lain yang berstatus aktif.
2. **Stock Adjustment Transaction**:
   Aksi `adjustStock` berjalan di dalam `DB::transaction` untuk menjamin konsistensi update stok di `inventories` dan logging di `stock_movements`.

---

## 5. Struktur Frontend (React & Inertia)

### Halaman Baru
* `admin/resellers/index.tsx` (Daftar, Search, Filter)
* `admin/resellers/create.tsx` & `edit.tsx` (Form Input)
* `admin/products/index.tsx` (Daftar, stok ringkas, tombol modal penyesuaian stok)
* `admin/products/create.tsx` & `edit.tsx` (Form Input & Upload Foto)
* `admin/price-tiers/index.tsx` (Daftar & Form Inline Modal)
* `admin/rewards/index.tsx` (Daftar Reward)
* `admin/rewards/create.tsx` & `edit.tsx` (Form Input & Upload Foto)
