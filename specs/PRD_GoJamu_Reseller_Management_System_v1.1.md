---
title: "PRD GoJamu Reseller Management System"
version: "1.1"
status: "Draft MVP - Revised with Brand Palette and Extensible Database"
product_type: "Internal Web Application"
recommended_stack: "Laravel + Inertia.js + React + MySQL/MariaDB"
primary_focus: "MVP internal untuk order reseller, harga tier, pembayaran manual, pengiriman manual, point reward, redeem hadiah, dan fondasi database yang aman untuk pengembangan bertahap"
---

# PRD GoJamu Reseller Management System

## 1. Ringkasan Produk

**GoJamu Reseller Management System** adalah aplikasi internal untuk membantu tim GoJamu mengelola proses order reseller dari gudang pusat.

Sistem mencakup:

- Manajemen reseller.
- Manajemen produk GoJamu.
- Manajemen stok sederhana.
- Harga reseller bertingkat berdasarkan jumlah pembelian.
- Order stok reseller.
- Upload dan verifikasi bukti pembayaran manual.
- Pengiriman manual dengan input kurir, ongkir, dan nomor resi.
- Cetak invoice PDF.
- Cetak label pengiriman PDF untuk printer stiker/thermal.
- Perhitungan point otomatis.
- Point ledger/history.
- Redeem reward reseller.
- Laporan dasar operasional.

Sistem ini **bukan SaaS pada tahap awal**. Sistem dibuat sebagai aplikasi internal dengan jumlah pengguna terbatas, traffic rendah sampai menengah, deployment sederhana, dan biaya produksi yang tidak membengkak.

---

## 2. Tujuan Produk

Tujuan utama sistem:

1. Menyatukan proses order reseller GoJamu dalam satu aplikasi internal.
2. Mengurangi ketergantungan pada WhatsApp, spreadsheet, dan pencatatan manual.
3. Mengotomatisasi perhitungan harga reseller berdasarkan total jumlah pcs dalam order.
4. Mengotomatisasi perhitungan point reward berdasarkan jumlah pcs pembelian.
5. Membantu admin/gudang mencetak invoice dan label pengiriman.
6. Memberikan portal sederhana untuk reseller agar bisa order, upload bukti bayar, melihat status pesanan, melihat point, dan mengajukan redeem reward.
7. Menjadi fondasi yang bisa dikembangkan ke payment gateway, ekspedisi otomatis, dan laporan lanjutan pada fase berikutnya.

---

## 3. Latar Belakang Masalah

Program reseller GoJamu memiliki beberapa kebutuhan operasional:

- Reseller perlu melakukan order produk ke gudang pusat.
- Harga reseller berubah berdasarkan jumlah pembelian.
- Pembelian reseller menghasilkan point yang bisa ditukar reward.
- Admin perlu memantau pembayaran, pengiriman, dan stok.
- Gudang perlu mencetak invoice dan label pengiriman seperti marketplace.
- Reseller perlu melihat histori order, tracking, dan saldo point.
- Tim GoJamu perlu laporan performa reseller dan program reward.

Tanpa sistem terpusat, proses ini berisiko tersebar di WhatsApp, spreadsheet, bukti transfer terpisah, dan catatan manual. Akibatnya rawan salah hitung harga, salah hitung point, kesulitan audit, dan proses fulfillment menjadi lambat.

---

## 4. Scope Produk

## 4.1 Scope MVP

MVP fokus pada fitur inti agar sistem cepat digunakan secara internal.

Fitur MVP:

1. Authentication dan role user.
2. Manajemen reseller.
3. Manajemen produk.
4. Manajemen stok sederhana.
5. Manajemen harga reseller bertingkat.
6. Order reseller.
7. Upload bukti pembayaran.
8. Verifikasi pembayaran manual oleh admin/finance.
9. Input ongkir, kurir, dan nomor resi manual.
10. Cetak invoice PDF.
11. Cetak label pengiriman PDF.
12. Perhitungan point otomatis.
13. Point ledger/history.
14. Manajemen reward.
15. Pengajuan redeem reward.
16. Approval redeem oleh admin.
17. Dashboard dan laporan dasar.

## 4.2 Di Luar Scope MVP

Fitur berikut ditunda ke fase berikutnya:

1. Payment gateway otomatis.
2. Integrasi ekspedisi otomatis.
3. Tracking otomatis via API.
4. Multi warehouse kompleks.
5. Marketplace sync.
6. Mobile app native.
7. Direct thermal print tanpa PDF/browser.
8. Sistem komisi reseller kompleks.
9. Multi-tenant SaaS.
10. Custom domain per brand.
11. Billing subscription.
12. AI forecasting atau rekomendasi stok.

---

## 5. Target Pengguna

## 5.1 Super Admin

Super Admin memiliki akses penuh ke sistem.

Kebutuhan:

- Kelola semua user.
- Kelola role dan permission.
- Kelola produk, reseller, order, reward, point, dan laporan.
- Melihat semua data operasional.

## 5.2 Admin GoJamu

Admin bertugas mengelola data utama dan proses bisnis.

Kebutuhan:

- Kelola reseller.
- Kelola produk.
- Kelola harga tier.
- Kelola reward.
- Melihat semua order.
- Update status order.
- Melihat laporan.

## 5.3 Admin Gudang

Admin gudang fokus pada proses fulfillment.

Kebutuhan:

- Melihat order yang sudah dibayar.
- Menyiapkan pesanan.
- Mengurangi atau menyesuaikan stok.
- Mencetak invoice.
- Mencetak label pengiriman.
- Input kurir, ongkir, dan nomor resi.
- Update status pengiriman.

## 5.4 Finance

Finance fokus pada pembayaran dan rekonsiliasi.

Kebutuhan:

- Melihat order pending payment.
- Melihat bukti pembayaran.
- Verifikasi pembayaran.
- Reject pembayaran jika tidak valid.
- Melihat laporan transaksi.
- Export data pembayaran.

## 5.5 Reseller

Reseller menggunakan portal sederhana untuk order dan memantau reward.

Kebutuhan:

- Login ke portal reseller.
- Melihat katalog produk.
- Membuat order.
- Upload bukti pembayaran.
- Melihat status order.
- Melihat nomor resi.
- Melihat histori order.
- Melihat saldo point.
- Melihat reward.
- Mengajukan redeem reward.

---

## 6. Role dan Hak Akses

| Role | Hak Akses Utama |
|---|---|
| Super Admin | Akses semua fitur, kelola user, setting sistem |
| Admin | Kelola reseller, produk, order, reward, laporan |
| Gudang | Kelola fulfillment, invoice, label, resi, stok |
| Finance | Verifikasi pembayaran dan laporan pembayaran |
| Reseller | Buat order, upload bukti bayar, lihat point, redeem reward |

Catatan MVP:

- Role bisa dibuat sederhana dulu: Super Admin, Admin/Gudang, dan Reseller.
- Role Finance dapat ditambahkan jika verifikasi pembayaran perlu dipisah dari admin utama.

---

## 7. Aturan Bisnis Utama

## 7.1 Harga Reseller Bertingkat

Harga reseller ditentukan berdasarkan total jumlah pcs dalam satu order.

| Jumlah Pembelian | Harga / pcs |
|---:|---:|
| 1 - 12 pcs | Rp55.000 |
| 13 - 50 pcs | Rp47.000 |
| 51 - 100 pcs | Rp42.000 |
| 101 - 200 pcs | Rp37.000 |
| 201 - 300 pcs | Rp32.000 |

### Aturan MVP

1. Tier harga dihitung berdasarkan total qty seluruh produk dalam satu order.
2. Semua produk menggunakan harga tier yang sama.
3. Jika qty lebih dari 300 pcs, sistem menggunakan tier tertinggi yaitu Rp32.000/pcs, kecuali admin menambah tier baru.
4. Harga tier harus bisa diubah oleh admin dari dashboard.
5. Perubahan harga tier tidak mengubah order lama yang sudah dibuat.
6. Harga yang digunakan saat checkout harus disimpan sebagai snapshot di order dan order item.

### Contoh Perhitungan Harga

| Total Qty Order | Harga / pcs | Subtotal |
|---:|---:|---:|
| 10 pcs | Rp55.000 | Rp550.000 |
| 20 pcs | Rp47.000 | Rp940.000 |
| 75 pcs | Rp42.000 | Rp3.150.000 |
| 150 pcs | Rp37.000 | Rp5.550.000 |
| 250 pcs | Rp32.000 | Rp8.000.000 |

---

## 7.2 Perhitungan Point

Program reward GoJamu menggunakan aturan:

> Setiap pembelian 10 pcs produk GoJamu mendapatkan 1 point.

### Rumus MVP

```txt
point = floor(total_qty / 10)
```

### Contoh Perhitungan Point

| Total Qty | Point Didapat |
|---:|---:|
| 9 pcs | 0 point |
| 10 pcs | 1 point |
| 25 pcs | 2 point |
| 50 pcs | 5 point |
| 75 pcs | 7 point |
| 100 pcs | 10 point |
| 250 pcs | 25 point |

### Aturan MVP

1. Point dihitung dari total qty dalam satu order.
2. Point masuk setelah order berstatus `Completed`.
3. Point tidak masuk saat order masih `Pending Payment`, `Paid`, `Processing`, `Packed`, atau `Shipped`.
4. Jika order `Cancelled`, point tidak diberikan.
5. Jika order dikembalikan/refund, admin dapat melakukan koreksi point manual.
6. Sisa pcs di bawah kelipatan 10 tidak diakumulasi pada MVP.

Contoh:

- Order 25 pcs mendapat 2 point.
- Sisa 5 pcs tidak dibawa ke order berikutnya.

---

## 7.3 Reward Program

Reward awal berdasarkan materi promosi:

| Reward | Point Dibutuhkan |
|---|---:|
| Umroh | 3000 point |
| Sepeda Motor | 2700 point |
| HP iPhone | 2500 point |
| TV | 2400 point |
| Emas 3 Gram | 2200 point |

### Aturan MVP

1. Reseller dapat melihat daftar reward aktif.
2. Reseller dapat mengajukan redeem jika point cukup.
3. Request redeem masuk ke admin.
4. Admin dapat approve atau reject request redeem.
5. Point dipotong saat admin approve redeem.
6. Jika request ditolak, point tidak berubah.
7. Reward memiliki stok dan status aktif/nonaktif.
8. Admin dapat menambah, mengubah, dan menonaktifkan reward.

---

## 7.4 Stok Produk

### Aturan MVP

1. Setiap produk memiliki stok tersedia.
2. Saat order dibuat, sistem dapat menandai qty sebagai reserved.
3. Jika order dibatalkan, reserved stock dikembalikan.
4. Jika order completed atau shipped, stok berkurang final.
5. Admin dapat melakukan adjustment stok manual.
6. Sistem mencatat histori pergerakan stok.

Untuk MVP, implementasi stok cukup menggunakan:

- `stock_available`
- `stock_reserved`
- `stock_movements`

---

## 8. Alur Sistem

## 8.1 Alur Pendaftaran Reseller

```txt
Calon reseller didaftarkan oleh admin atau registrasi mandiri
↓
Data reseller masuk status Pending
↓
Admin mengecek data reseller
↓
Admin approve reseller
↓
Akun reseller aktif
↓
Reseller dapat login dan membuat order
```

### Rekomendasi MVP

Untuk awal, reseller dibuat oleh admin dari dashboard. Registrasi mandiri dapat ditambahkan di fase berikutnya.

---

## 8.2 Alur Order Reseller

```txt
Reseller login
↓
Reseller membuka katalog produk
↓
Reseller memilih produk dan qty
↓
Sistem menghitung total qty
↓
Sistem menentukan harga tier
↓
Sistem menghitung subtotal dan potensi point
↓
Reseller checkout
↓
Sistem membuat invoice
↓
Order berstatus Pending Payment
```

---

## 8.3 Alur Pembayaran Manual MVP

```txt
Order dibuat
↓
Reseller transfer manual
↓
Reseller upload bukti pembayaran
↓
Admin/Finance mengecek bukti pembayaran
↓
Jika valid, status payment menjadi Paid
↓
Order masuk ke proses gudang
```

Jika pembayaran tidak valid:

```txt
Admin reject bukti pembayaran
↓
Order tetap Pending Payment
↓
Reseller upload ulang bukti pembayaran
```

---

## 8.4 Alur Fulfillment Gudang

```txt
Order Paid
↓
Gudang mulai proses picking dan packing
↓
Status order menjadi Processing
↓
Gudang cetak invoice dan label
↓
Gudang input kurir, ongkir, dan nomor resi
↓
Status order menjadi Shipped
↓
Jika pesanan selesai, admin update Completed
↓
Point masuk otomatis ke reseller
```

---

## 8.5 Alur Redeem Reward

```txt
Reseller membuka halaman Reward
↓
Reseller memilih reward
↓
Sistem cek saldo point
↓
Jika point cukup, reseller submit redeem request
↓
Admin review request
↓
Admin approve/reject
↓
Jika approve, point dipotong
↓
Reward diproses
↓
Status redeem menjadi Completed
```

---

## 9. Modul dan Requirement Detail MVP

# 9.1 Authentication & Authorization

## Deskripsi

Sistem memiliki login berdasarkan role. Setiap role hanya dapat mengakses fitur sesuai hak aksesnya.

## User Story

Sebagai pengguna sistem, saya ingin login dengan akun saya agar dapat mengakses fitur sesuai peran saya.

## Functional Requirements

1. User dapat login menggunakan email dan password.
2. User dapat logout.
3. Password disimpan dalam bentuk hash.
4. Sistem membedakan akses berdasarkan role.
5. Reseller hanya dapat melihat data miliknya sendiri.
6. Admin dapat membuat akun reseller.
7. Admin dapat menonaktifkan user.

## Acceptance Criteria

- User dengan kredensial valid dapat login.
- User dengan kredensial salah tidak dapat login.
- Reseller tidak dapat membuka halaman admin.
- Admin dapat membuka halaman manajemen reseller dan order.
- User nonaktif tidak dapat login.

---

# 9.2 Dashboard Admin

## Deskripsi

Dashboard admin menampilkan ringkasan operasional utama.

## Functional Requirements

Dashboard menampilkan:

1. Total order hari ini.
2. Total omzet bulan ini.
3. Order pending payment.
4. Order paid/perlu diproses.
5. Order shipped.
6. Total reseller aktif.
7. Produk stok menipis.
8. Total point issued.
9. Redeem request pending.
10. Top reseller berdasarkan omzet atau qty.

## Acceptance Criteria

- Admin dapat melihat ringkasan data setelah login.
- Angka dashboard mengikuti data order dan reseller terbaru.
- Dashboard tidak menampilkan data reseller yang tidak relevan kepada role reseller.

---

# 9.3 Manajemen Reseller

## Deskripsi

Admin dapat mengelola data reseller GoJamu.

## Data Reseller

- Nama reseller.
- Kode reseller.
- Nomor WhatsApp.
- Email.
- Alamat.
- Kota.
- Provinsi.
- Status.
- Tanggal bergabung.
- Total order.
- Total qty pembelian.
- Total nilai pembelian.
- Current point.
- Catatan internal.

## Functional Requirements

1. Admin dapat membuat reseller baru.
2. Admin dapat mengubah data reseller.
3. Admin dapat menonaktifkan reseller.
4. Admin dapat melihat detail reseller.
5. Admin dapat melihat histori order reseller.
6. Admin dapat melihat histori point reseller.
7. Sistem otomatis membuat kode reseller unik.
8. Admin dapat reset password reseller.

## Acceptance Criteria

- Reseller baru dapat dibuat oleh admin.
- Kode reseller tidak boleh duplikat.
- Reseller nonaktif tidak dapat login/order.
- Detail reseller menampilkan order dan point yang benar.

---

# 9.4 Manajemen Produk

## Deskripsi

Admin dapat mengelola produk GoJamu.

## Data Produk

- SKU.
- Nama produk.
- Foto produk.
- Deskripsi.
- Berat produk.
- Stok tersedia.
- Status aktif/nonaktif.
- Color key produk untuk kebutuhan UI.
- Color hex produk jika dibutuhkan untuk badge/card.

## Produk Awal

1. Nirlawa.
2. Ko Gan Ti Teh Celup Balakacida.
3. Mahakunir.

## Functional Requirements

1. Admin dapat menambah produk.
2. Admin dapat mengubah produk.
3. Admin dapat menonaktifkan produk.
4. Admin dapat upload foto produk.
5. Produk aktif tampil di portal reseller.
6. Produk nonaktif tidak tampil di portal reseller.

## Acceptance Criteria

- Produk aktif muncul di katalog reseller.
- Produk nonaktif tidak bisa dipesan.
- Produk memiliki SKU unik.

---

# 9.5 Manajemen Stok

## Deskripsi

Sistem mencatat stok produk untuk membantu gudang menghindari overselling.

## Functional Requirements

1. Admin/gudang dapat melihat stok produk.
2. Admin/gudang dapat menambah stok masuk.
3. Admin/gudang dapat melakukan adjustment stok.
4. Sistem mencatat stock movement.
5. Sistem memberi tanda jika stok menipis.
6. Sistem mencegah checkout jika qty melebihi stok tersedia.

## Stock Movement Type

- Initial stock.
- Stock in.
- Stock adjustment.
- Order reserved.
- Order cancelled.
- Order shipped/completed.

## Acceptance Criteria

- Stok produk berkurang sesuai order.
- Order tidak bisa dibuat jika stok tidak mencukupi.
- Setiap perubahan stok tercatat di histori.

---

# 9.6 Manajemen Harga Tier

## Deskripsi

Admin dapat mengelola harga reseller berdasarkan jumlah pembelian.

## Data Price Tier

- Min qty.
- Max qty.
- Harga per pcs.
- Status aktif/nonaktif.

## Functional Requirements

1. Admin dapat membuat price tier.
2. Admin dapat mengubah price tier.
3. Admin dapat menonaktifkan price tier.
4. Sistem memilih harga berdasarkan total qty order.
5. Sistem menyimpan harga yang digunakan pada order agar tidak berubah saat harga tier diubah kemudian.

## Acceptance Criteria

- Order 10 pcs menggunakan harga Rp55.000.
- Order 20 pcs menggunakan harga Rp47.000.
- Order 75 pcs menggunakan harga Rp42.000.
- Order 150 pcs menggunakan harga Rp37.000.
- Order 250 pcs menggunakan harga Rp32.000.
- Harga order lama tidak berubah saat admin mengubah tier.

---

# 9.7 Order Management

## Deskripsi

Reseller dapat membuat order produk. Admin dapat memantau dan memproses order.

## Data Order

- Invoice number.
- Reseller.
- Tanggal order.
- Status order.
- Status pembayaran.
- Status pengiriman.
- Total qty.
- Harga tier per pcs.
- Subtotal.
- Ongkir.
- Total bayar.
- Potensi point.
- Earned point.
- Catatan reseller.
- Catatan admin.

## Status Order

- Pending Payment.
- Paid.
- Processing.
- Packed.
- Shipped.
- Completed.
- Cancelled.

## Functional Requirements

1. Reseller dapat membuat order.
2. Reseller dapat memilih beberapa produk dalam satu order.
3. Sistem menghitung total qty.
4. Sistem menentukan harga tier otomatis.
5. Sistem menghitung subtotal.
6. Sistem menghitung potensi point.
7. Sistem membuat invoice number otomatis.
8. Admin dapat melihat semua order.
9. Admin dapat mengubah status order.
10. Reseller hanya dapat melihat order miliknya.
11. Admin dapat membatalkan order.

## Acceptance Criteria

- Reseller dapat checkout jika stok cukup.
- Invoice number unik.
- Harga tier dihitung benar.
- Potensi point tampil di detail order.
- Reseller tidak dapat melihat order reseller lain.

---

# 9.8 Pembayaran Manual

## Deskripsi

Pada MVP, pembayaran dilakukan melalui transfer manual dan upload bukti bayar.

## Functional Requirements

1. Reseller dapat melihat instruksi pembayaran.
2. Reseller dapat upload bukti pembayaran.
3. Admin/Finance dapat melihat bukti pembayaran.
4. Admin/Finance dapat approve pembayaran.
5. Admin/Finance dapat reject pembayaran.
6. Jika approve, payment status menjadi Paid.
7. Jika reject, reseller dapat upload ulang bukti pembayaran.
8. Sistem mencatat siapa yang melakukan verifikasi.

## Acceptance Criteria

- Bukti bayar berhasil diupload.
- Admin dapat membuka bukti bayar.
- Payment status berubah menjadi Paid setelah approve.
- Order Paid masuk ke daftar proses gudang.

---

# 9.9 Fulfillment dan Pengiriman Manual

## Deskripsi

Gudang memproses order yang sudah dibayar, mencetak dokumen, dan input resi.

## Functional Requirements

1. Admin/gudang dapat melihat order Paid.
2. Admin/gudang dapat mengubah status menjadi Processing.
3. Admin/gudang dapat input kurir.
4. Admin/gudang dapat input layanan pengiriman.
5. Admin/gudang dapat input ongkir.
6. Admin/gudang dapat input nomor resi.
7. Admin/gudang dapat mengubah status menjadi Shipped.
8. Reseller dapat melihat nomor resi.
9. Admin/gudang dapat mengubah status menjadi Completed.

## Acceptance Criteria

- Order Paid dapat diproses gudang.
- Nomor resi tampil di portal reseller.
- Order Completed memicu pemberian point.

---

# 9.10 Cetak Invoice PDF

## Deskripsi

Sistem dapat menghasilkan invoice dalam format PDF untuk dicetak.

## Isi Invoice

- Logo GoJamu.
- Nomor invoice.
- Tanggal order.
- Data reseller.
- Alamat pengiriman.
- Daftar produk.
- Qty per produk.
- Harga per pcs.
- Subtotal.
- Ongkir.
- Total bayar.
- Status pembayaran.
- Catatan.

## Functional Requirements

1. Admin/gudang dapat membuka invoice PDF.
2. Admin/gudang dapat mencetak invoice.
3. Reseller dapat melihat/download invoice miliknya.

## Acceptance Criteria

- Invoice PDF sesuai data order.
- Invoice dapat dicetak dari browser.
- Invoice lama tetap menampilkan harga saat order dibuat.

---

# 9.11 Cetak Label Pengiriman PDF

## Deskripsi

Sistem dapat menghasilkan label pengiriman untuk dicetak ke printer stiker/thermal via browser.

## Ukuran MVP

- 100 x 150 mm.
- Optional: 80 x 100 mm pada fase berikutnya.

## Isi Label

- Nama penerima.
- Nomor HP.
- Alamat lengkap.
- Kurir.
- Layanan.
- Nomor resi.
- Nomor invoice.
- QR code atau barcode invoice/resi.
- Ringkasan produk.

## Functional Requirements

1. Admin/gudang dapat membuka label PDF.
2. Admin/gudang dapat mencetak label.
3. Label mengikuti data pengiriman order.

## Acceptance Criteria

- Label PDF dapat dicetak dari browser.
- Label menampilkan alamat dan nomor resi yang benar.
- Label memiliki ukuran yang sesuai untuk printer stiker umum.

---

# 9.12 Point Ledger

## Deskripsi

Sistem mencatat semua transaksi point reseller secara historis.

## Data Point Ledger

- Reseller.
- Order.
- Redeem request.
- Tipe transaksi.
- Point masuk.
- Point keluar.
- Balance after.
- Deskripsi.
- Created by.
- Created at.

## Tipe Transaksi

- Earn from order.
- Redeem reward.
- Manual adjustment plus.
- Manual adjustment minus.
- Correction.

## Functional Requirements

1. Sistem membuat ledger saat order Completed.
2. Sistem membuat ledger saat redeem approved.
3. Admin dapat melihat histori point reseller.
4. Reseller dapat melihat histori point miliknya.
5. Admin dapat melakukan adjustment point manual.
6. Setiap adjustment wajib memiliki catatan.

## Acceptance Criteria

- Point reseller bertambah setelah order Completed.
- Point reseller berkurang setelah redeem approved.
- Histori point menampilkan saldo berjalan.
- Saldo point sesuai total ledger.

---

# 9.13 Reward Management

## Deskripsi

Admin mengelola daftar reward yang bisa ditukar oleh reseller.

## Data Reward

- Nama reward.
- Foto.
- Deskripsi.
- Point dibutuhkan.
- Stok reward.
- Periode berlaku.
- Status aktif/nonaktif.

## Functional Requirements

1. Admin dapat membuat reward.
2. Admin dapat mengubah reward.
3. Admin dapat menonaktifkan reward.
4. Reward aktif tampil di portal reseller.
5. Sistem menampilkan progress point reseller terhadap reward.

## Acceptance Criteria

- Reward aktif tampil di portal reseller.
- Reward nonaktif tidak bisa diredeem.
- Reseller dapat melihat jumlah point yang kurang untuk setiap reward.

---

# 9.14 Redeem Reward

## Deskripsi

Reseller dapat mengajukan penukaran point dengan reward.

## Status Redeem

- Requested.
- Approved.
- Rejected.
- Processing.
- Completed.
- Cancelled.

## Functional Requirements

1. Reseller dapat submit redeem jika point cukup.
2. Sistem menolak redeem jika point tidak cukup.
3. Admin dapat approve redeem.
4. Admin dapat reject redeem dengan alasan.
5. Point dipotong saat approve.
6. Admin dapat update status redeem menjadi Processing atau Completed.
7. Reseller dapat melihat status redeem.

## Acceptance Criteria

- Reseller dengan point kurang tidak bisa submit redeem.
- Reseller dengan point cukup bisa submit redeem.
- Point berkurang setelah admin approve.
- Reject tidak mengurangi point.

---

# 9.15 Portal Reseller

## Deskripsi

Portal reseller adalah dashboard sederhana untuk reseller melakukan order dan memantau reward.

## Menu Reseller MVP

1. Dashboard.
2. Katalog Produk.
3. Buat Order/Keranjang.
4. Order Saya.
5. Invoice.
6. Pengiriman/Resi.
7. Point Saya.
8. Reward.
9. Profil.

## Dashboard Reseller Menampilkan

- Total order.
- Total qty pembelian.
- Total nilai pembelian.
- Point saat ini.
- Reward terdekat.
- Progress menuju reward.
- Order terbaru.

## Acceptance Criteria

- Reseller dapat membuat order dari portal.
- Reseller dapat melihat order miliknya.
- Reseller dapat melihat point miliknya.
- Reseller dapat mengajukan redeem reward.

---

# 9.16 Laporan Dasar

## Deskripsi

Sistem menyediakan laporan dasar untuk admin.

## Laporan MVP

1. Laporan order.
2. Laporan penjualan.
3. Laporan pembayaran.
4. Laporan reseller.
5. Laporan point.
6. Laporan redeem reward.
7. Laporan stok.

## Filter Laporan

- Tanggal mulai.
- Tanggal akhir.
- Reseller.
- Produk.
- Status order.
- Status pembayaran.

## Export MVP

- CSV atau Excel.

PDF laporan bisa ditunda ke fase berikutnya.

## Acceptance Criteria

- Admin dapat filter laporan berdasarkan tanggal.
- Admin dapat export data order.
- Laporan menampilkan total sesuai filter.

---

## 10. Prioritas Fitur

## 10.1 P0 — Wajib untuk MVP

Fitur yang harus ada agar sistem bisa digunakan operasional:

1. Login dan role access.
2. Manajemen reseller.
3. Manajemen produk.
4. Manajemen stok sederhana.
5. Harga reseller bertingkat.
6. Order reseller.
7. Perhitungan harga otomatis.
8. Upload bukti pembayaran.
9. Verifikasi pembayaran manual.
10. Input kurir, ongkir, dan resi manual.
11. Cetak invoice PDF.
12. Cetak label pengiriman PDF.
13. Point otomatis setelah order completed.
14. Point ledger.
15. Reward management.
16. Redeem reward approval.
17. Dashboard admin dasar.
18. Portal reseller dasar.

## 10.2 P1 — Setelah MVP Stabil

Fitur penting tetapi tidak menghalangi operasional awal:

1. Registrasi reseller mandiri + approval.
2. Notifikasi email/WhatsApp manual template.
3. Export Excel lebih lengkap.
4. Setting rekening pembayaran.
5. Payment expired reminder.
6. Stok menipis notification.
7. Reward campaign.
8. Level reseller.
9. Progress target reseller.
10. Leaderboard reseller.
11. Multi format label.
12. Audit log admin.

## 10.3 P2 — Automation Phase

Fitur otomatisasi setelah proses manual tervalidasi:

1. Payment gateway Midtrans/Xendit/Duitku/Tripay.
2. Webhook pembayaran otomatis.
3. Cek ongkir otomatis.
4. Integrasi ekspedisi via aggregator.
5. Tracking otomatis.
6. Generate resi otomatis.
7. WhatsApp notification API.
8. Scheduled reminder payment.
9. Scheduled tracking update.

## 10.4 P3 — Advanced Phase

Fitur lanjutan jika jumlah reseller/order meningkat:

1. Multi warehouse.
2. Role permission granular.
3. Stock transfer antar gudang.
4. Return/refund management.
5. Marketplace integration.
6. API untuk aplikasi eksternal.
7. Direct print thermal via local print agent.
8. Advanced analytics.
9. Reorder prediction.
10. Reseller performance scoring.

---

## 11. Rekomendasi Tech Stack

Karena sistem ini masih internal, pengguna tidak banyak, dan traffic tidak tinggi, pendekatan terbaik adalah **monolith**.

Tujuan:

- Development lebih cepat.
- Deployment lebih sederhana.
- Biaya server lebih murah.
- Tidak perlu banyak service terpisah.
- Lebih mudah maintenance.
- Cocok untuk Laravel ecosystem.

---

## 11.1 Opsi Utama: Laravel Inertia React

### Stack

- Laravel 11/12.
- Inertia.js.
- React.
- TypeScript optional.
- Tailwind CSS.
- shadcn/ui optional.
- MySQL/MariaDB.

### Kelebihan

1. Monolith, tetapi frontend tetap React.
2. Tidak perlu maintain API frontend/backend terpisah di awal.
3. Routing, auth, session, middleware, dan permission lebih sederhana.
4. Deployment cukup satu aplikasi Laravel.
5. Cocok untuk dashboard internal.
6. Biaya production lebih hemat.

### Kekurangan

1. Jika nanti butuh mobile app native/API publik, perlu menambah API layer.
2. Struktur frontend tidak sefleksibel Next.js fullstack.
3. Perlu disiplin menjaga komponen React tetap rapi.

### Rekomendasi

Untuk GoJamu saat ini, **Laravel Inertia React adalah pilihan paling ideal**.

---

## 11.2 Opsi Alternatif: Laravel API + Next.js

### Stack

- Laravel sebagai REST API.
- Next.js sebagai frontend.
- MySQL/MariaDB.

### Kelebihan

1. Frontend lebih fleksibel.
2. Lebih siap jika nanti ingin dipisah menjadi public web, reseller portal, dan admin.
3. Cocok jika butuh SEO untuk halaman publik.

### Kekurangan

1. Deployment lebih kompleks.
2. Biaya bisa lebih tinggi karena frontend dan backend bisa terpisah.
3. Auth dan session perlu dirancang lebih hati-hati.
4. Development local lebih banyak setup.

### Rekomendasi

Gunakan opsi ini jika nanti GoJamu ingin punya portal publik/landing/reseller yang sangat SEO-oriented atau aplikasi frontend terpisah.

---

## 11.3 Keputusan Tech Stack MVP

```txt
Laravel + Inertia.js + React + Tailwind CSS + MySQL/MariaDB
```

Alasan:

- Cocok untuk internal app.
- Pengguna sedikit.
- Traffic rendah.
- Biaya server rendah.
- Development cepat.
- Deployment sederhana.
- Tidak perlu membangun API terpisah dari awal.

---

## 12. Infrastruktur Development Local

## 12.1 Recommended Local Setup

Opsi yang nyaman:

1. Laravel Herd untuk PHP lokal.
2. MySQL/MariaDB lokal via DBngin, Herd, Docker, atau Orbstack.
3. Node.js via NVM.
4. PNPM/NPM untuk frontend asset.
5. Vite untuk bundling.

## 12.2 Local Commands

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
pnpm install
pnpm dev
php artisan serve
```

Jika menggunakan Laravel Herd, `php artisan serve` tidak wajib.

## 12.3 Seeder MVP

Seeder perlu menyiapkan:

1. User Super Admin.
2. Role default.
3. Produk awal GoJamu.
4. Price tier default.
5. Reward default.
6. Setting rekening pembayaran.

---

## 13. Infrastruktur Production

## 13.1 Prinsip Production

Karena ini aplikasi internal dengan traffic rendah, production tidak perlu kompleks.

Target:

- 1 VPS kecil/menengah.
- 1 database di server yang sama.
- 1 domain/subdomain.
- SSL.
- Backup otomatis.
- Queue worker sederhana jika dibutuhkan.

## 13.2 Spesifikasi VPS Awal

Minimum:

- 1 vCPU.
- 1-2 GB RAM.
- 25-40 GB SSD.
- Ubuntu LTS.
- Nginx atau OpenLiteSpeed.
- PHP 8.3+.
- MySQL/MariaDB.

Aman:

- 2 vCPU.
- 2-4 GB RAM.
- 50-80 GB SSD.

## 13.3 Recommended Production Setup

```txt
1 VPS + Laravel Monolith + MySQL/MariaDB + Nginx/OpenLiteSpeed + SSL + Backup
```

## 13.4 Deployment Strategy

Untuk awal:

1. Pull code dari Git repository.
2. Install composer dependencies.
3. Install frontend dependencies.
4. Build frontend asset.
5. Run migration.
6. Clear dan cache config.
7. Restart queue worker jika ada.

Contoh command:

```bash
git pull origin main
composer install --no-dev --optimize-autoloader
pnpm install --frozen-lockfile
pnpm build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

---

## 14. Arsitektur Aplikasi

## 14.1 High Level Architecture

```txt
Browser Admin/Reseller
        ↓
Laravel Inertia React App
        ↓
Laravel Controllers / Services
        ↓
MySQL/MariaDB
        ↓
Storage Local/S3-Compatible untuk images & proof payment
```

## 14.2 Modul Backend

- Auth module.
- User & role module.
- Reseller module.
- Product module.
- Inventory module.
- Price tier module.
- Order module.
- Payment proof module.
- Shipment module.
- Invoice module.
- Point module.
- Reward module.
- Report module.

## 14.3 Service Layer yang Disarankan

Agar logic tidak menumpuk di controller:

- `PriceTierService`.
- `OrderCalculationService`.
- `StockService`.
- `PaymentVerificationService`.
- `ShipmentService`.
- `PointService`.
- `RewardRedemptionService`.
- `InvoiceService`.

---

## 15. Database Design Awal yang Future-Friendly

Database untuk MVP tetap dibuat sederhana, tetapi struktur tabel harus disiapkan agar penambahan fitur fase berikutnya tidak merusak data lama.

Prinsip desain database:

1. **Snapshot data penting di transaksi.** Data order tidak boleh berubah ketika nama produk, harga tier, alamat reseller, atau setting perusahaan berubah.
2. **Gunakan ledger untuk data finansial, point, dan stok.** Jangan hanya menyimpan angka total tanpa histori.
3. **Pisahkan master data dan transaksi.** Produk, reseller, reward, dan setting adalah master data. Order, payment, shipment, stock movement, dan point ledger adalah transaksi.
4. **Jangan hardcode business rule di banyak tempat.** Rule harga, point, status, dan reward sebaiknya punya tabel/config sendiri.
5. **Siapkan kolom ekstensi tanpa memaksa integrasi sejak MVP.** Contoh: `gateway_provider`, `external_payment_id`, `courier_provider`, dan `external_shipment_id` boleh nullable dulu.
6. **Gunakan status yang konsisten.** Status boleh berupa enum/string terbatas di Laravel, tetapi sebaiknya dikontrol lewat constants agar tidak typo.
7. **Gunakan soft delete untuk master data penting.** Produk, reseller, reward, dan user sebaiknya tidak dihapus permanen jika sudah pernah dipakai transaksi.

## 15.1 users

Menyimpan akun login untuk admin, gudang, finance, dan reseller.

```txt
id
name
email
email_verified_at nullable
password
role
status
last_login_at nullable
created_at
updated_at
deleted_at nullable
```

Catatan:

- MVP boleh memakai kolom `role` sederhana.
- Fase berikutnya bisa migrasi ke tabel `roles`, `permissions`, dan `model_has_roles` jika memakai Spatie Permission.

## 15.2 resellers

Menyimpan profil reseller.

```txt
id
user_id
reseller_code
name
phone
email nullable
address
city
province
postal_code nullable
status
joined_at nullable
total_qty_purchased default 0
total_spent default 0
current_points default 0
internal_notes nullable
created_at
updated_at
deleted_at nullable
```

Catatan future-friendly:

- `total_qty_purchased`, `total_spent`, dan `current_points` adalah cache untuk performa.
- Sumber kebenaran tetap dari `orders` dan `point_ledgers`.
- Jika nanti ada level reseller, tambahkan `reseller_level_id nullable`, bukan mengubah struktur order lama.

## 15.3 reseller_addresses

Menyimpan alamat reseller. Untuk MVP bisa dibuat satu alamat utama, tetapi tabel ini membuat sistem siap untuk multi alamat.

```txt
id
reseller_id
label
recipient_name
phone
address
city
province
postal_code nullable
is_default boolean
created_at
updated_at
```

Catatan:

- Order harus menyimpan snapshot alamat di tabel `shipments`, bukan hanya referensi ke alamat ini.

## 15.4 products

Menyimpan master produk.

```txt
id
sku
name
slug
image
description nullable
weight_gram default 0
status
sort_order default 0
created_at
updated_at
deleted_at nullable
```

Produk awal:

1. Nirlawa.
2. Ko Gan Ti Teh Celup Balakacida.
3. Mahakunir.

Catatan future-friendly:

- Jangan simpan stok langsung di `products` jika ingin siap multi gudang.
- Untuk MVP, stok bisa tetap dihitung dari `inventories`, walau hanya ada satu gudang default.

## 15.5 product_variants

Opsional untuk MVP, tetapi sangat disarankan dibuat dari awal agar tidak rusak jika nanti ada variasi ukuran, paket bundling, atau SKU turunan.

```txt
id
product_id
sku
name
weight_gram default 0
image nullable
status
created_at
updated_at
deleted_at nullable
```

Catatan MVP:

- Jika belum ada varian, buat satu varian default per produk.
- Order item sebaiknya mengacu ke `product_variant_id` agar aman jika nanti produk punya varian.

## 15.6 warehouses

Untuk MVP hanya perlu satu gudang pusat, tetapi tabel ini membuat sistem siap multi warehouse.

```txt
id
code
name
address nullable
city nullable
province nullable
status
created_at
updated_at
```

Default MVP:

```txt
code: MAIN
name: Gudang Pusat GoJamu
```

## 15.7 inventories

Menyimpan stok per produk/variant per gudang.

```txt
id
warehouse_id
product_id
product_variant_id nullable
stock_available default 0
stock_reserved default 0
low_stock_threshold default 0
created_at
updated_at
```

Catatan:

- Walaupun MVP hanya satu gudang, struktur ini tidak perlu dirombak ketika multi warehouse ditambahkan.

## 15.8 stock_movements

Ledger stok untuk audit.

```txt
id
warehouse_id
product_id
product_variant_id nullable
order_id nullable
order_item_id nullable
type
qty
stock_before
stock_after
notes nullable
created_by nullable
created_at
updated_at
```

Tipe movement:

```txt
initial_stock
stock_in
stock_adjustment
order_reserved
order_cancelled
order_shipped
order_completed
return_in
```

## 15.9 price_tiers

Menyimpan harga reseller berdasarkan total qty order.

```txt
id
name
min_qty
max_qty nullable
price_per_pcs
status
starts_at nullable
ends_at nullable
created_at
updated_at
```

Catatan:

- `max_qty nullable` berarti open-ended, misalnya qty di atas 300.
- `starts_at` dan `ends_at` disiapkan untuk campaign harga di fase berikutnya.

## 15.10 point_rules

Menyimpan aturan point agar tidak hardcode.

```txt
id
name
qty_per_point
point_value
rounding_method
status
starts_at nullable
ends_at nullable
created_at
updated_at
```

Default MVP:

```txt
name: Default GoJamu Point Rule
qty_per_point: 10
point_value: 1
rounding_method: floor
status: active
```

Catatan:

- Dengan tabel ini, jika nanti ada campaign double point, sistem tidak perlu bongkar struktur utama.

## 15.11 orders

Menyimpan header order.

```txt
id
invoice_number
reseller_id
warehouse_id nullable
status
payment_status
shipment_status
total_qty
price_tier_id nullable
price_per_pcs
subtotal
shipping_cost default 0
discount_amount default 0
total_amount
potential_points
earned_points default 0
point_rule_id nullable
reseller_notes nullable
admin_notes nullable
ordered_at
paid_at nullable
completed_at nullable
cancelled_at nullable
created_by nullable
created_at
updated_at
```

Status order:

```txt
pending_payment
paid
processing
packed
shipped
completed
cancelled
```

Catatan future-friendly:

- `price_per_pcs` harus disimpan sebagai snapshot.
- `price_tier_id` hanya referensi historis.
- Jika harga tier berubah, order lama tetap aman karena punya snapshot harga.

## 15.12 order_items

Menyimpan detail produk dalam order.

```txt
id
order_id
product_id
product_variant_id nullable
product_name
variant_name nullable
sku
qty
price_per_pcs
subtotal
weight_gram default 0
created_at
updated_at
```

Catatan:

- `product_name`, `variant_name`, `sku`, `price_per_pcs`, dan `weight_gram` adalah snapshot.
- Ini melindungi invoice lama dari perubahan master produk.

## 15.13 payments

Menyimpan status pembayaran order.

```txt
id
order_id
method
provider nullable
external_payment_id nullable
amount
status
paid_at nullable
verified_by nullable
verified_at nullable
rejected_reason nullable
created_at
updated_at
```

Status payment:

```txt
pending
waiting_verification
paid
rejected
expired
refunded
```

Catatan MVP:

- `provider` dan `external_payment_id` nullable untuk sekarang.
- Saat payment gateway ditambahkan, kolom ini sudah siap dipakai.

## 15.14 payment_proofs

Menyimpan bukti pembayaran manual. Dipisahkan dari `payments` agar reseller bisa upload ulang jika bukti ditolak.

```txt
id
payment_id
order_id
file_path
uploaded_by
status
notes nullable
created_at
updated_at
```

Status proof:

```txt
submitted
approved
rejected
```

## 15.15 shipments

Menyimpan data pengiriman order.

```txt
id
order_id
recipient_name
recipient_phone
recipient_address
recipient_city
recipient_province
recipient_postal_code nullable
courier
service nullable
tracking_number nullable
shipping_cost default 0
status
provider nullable
external_shipment_id nullable
label_url nullable
shipped_at nullable
delivered_at nullable
created_at
updated_at
```

Status shipment:

```txt
pending
ready_to_ship
shipped
delivered
failed
returned
```

Catatan:

- Data penerima adalah snapshot dari alamat saat order dibuat.
- `provider` dan `external_shipment_id` disiapkan untuk integrasi ekspedisi fase berikutnya.

## 15.16 order_status_histories

Menyimpan riwayat perubahan status order.

```txt
id
order_id
from_status nullable
to_status
notes nullable
changed_by nullable
created_at
updated_at
```

Catatan:

- Berguna untuk audit ketika ada komplain atau order macet.

## 15.17 point_ledgers

Ledger point reseller. Ini adalah sumber kebenaran point.

```txt
id
reseller_id
order_id nullable
reward_redemption_id nullable
type
points_in default 0
points_out default 0
balance_after
description nullable
expires_at nullable
created_by nullable
created_at
updated_at
```

Tipe ledger:

```txt
earn_from_order
redeem_reward
manual_adjustment_plus
manual_adjustment_minus
correction
expired
```

Catatan:

- Jika program point 1 tahun kalender benar-benar diterapkan, gunakan `expires_at`.
- Untuk MVP, expiry boleh belum dieksekusi otomatis, tetapi kolomnya sudah siap.

## 15.18 rewards

Menyimpan master reward.

```txt
id
name
image nullable
description nullable
required_points
stock nullable
status
start_date nullable
end_date nullable
created_at
updated_at
deleted_at nullable
```

Reward awal:

1. Umroh — 3000 point.
2. Sepeda Motor — 2700 point.
3. HP iPhone — 2500 point.
4. TV — 2400 point.
5. Emas 3 Gram — 2200 point.

## 15.19 reward_redemptions

Menyimpan pengajuan redeem reward.

```txt
id
reseller_id
reward_id
points_used
status
request_notes nullable
admin_notes nullable
approved_by nullable
approved_at nullable
rejected_by nullable
rejected_at nullable
completed_at nullable
created_at
updated_at
```

Status redeem:

```txt
requested
approved
rejected
processing
completed
cancelled
```

## 15.20 attachments

Tabel umum untuk file tambahan. Opsional, tetapi berguna agar upload tidak tersebar ke banyak tabel.

```txt
id
attachable_type
attachable_id
file_path
file_name
mime_type
file_size
uploaded_by nullable
created_at
updated_at
```

Contoh penggunaan:

- Bukti pembayaran.
- Foto reward.
- File invoice hasil generate.
- File label pengiriman.

## 15.21 settings

Menyimpan konfigurasi sistem sederhana.

```txt
id
key
value
type
created_at
updated_at
```

Contoh settings:

```txt
payment_bank_name
payment_account_number
payment_account_holder
company_name
company_address
company_phone
invoice_prefix
point_expiry_enabled
point_expiry_months
default_warehouse_id
```

## 15.22 activity_logs

Audit log untuk aksi penting. Bisa dibuat custom sederhana atau memakai package.

```txt
id
user_id nullable
action
subject_type nullable
subject_id nullable
properties json nullable
created_at
updated_at
```

Aksi yang perlu dicatat minimal:

- Approve/reject payment.
- Change order status.
- Manual stock adjustment.
- Manual point adjustment.
- Approve/reject redeem.
- Change price tier.

## 15.23 Rekomendasi Index Database

Tambahkan index untuk kolom yang sering dipakai filter/search.

```txt
users.email unique
resellers.user_id index
resellers.reseller_code unique
products.sku unique
product_variants.sku unique
orders.invoice_number unique
orders.reseller_id index
orders.status index
orders.payment_status index
orders.shipment_status index
orders.created_at index
order_items.order_id index
payments.order_id index
shipments.order_id index
point_ledgers.reseller_id index
reward_redemptions.reseller_id index
stock_movements.product_id index
stock_movements.warehouse_id index
```

## 15.24 Database Implementation Priority

### P0 — Wajib dibuat sejak MVP

```txt
users
resellers
products
product_variants
warehouses
inventories
stock_movements
price_tiers
point_rules
orders
order_items
payments
payment_proofs
shipments
point_ledgers
rewards
reward_redemptions
settings
```

### P1 — Bisa dibuat setelah MVP berjalan, tetapi disarankan dari awal jika sempat

```txt
reseller_addresses
order_status_histories
activity_logs
attachments
```

### P2 — Fase integrasi otomatis

Tidak harus tabel baru. Cukup manfaatkan kolom yang sudah disiapkan:

```txt
payments.provider
payments.external_payment_id
shipments.provider
shipments.external_shipment_id
shipments.label_url
```

## 16. Calculation Logic

## 16.1 Menentukan Harga Tier

Input:

- `total_qty`

Output:

- `price_per_pcs`

Pseudocode:

```txt
find price tier where min_qty <= total_qty and max_qty >= total_qty
if max_qty is null, use tier as open ended
return price_per_pcs
```

## 16.2 Menghitung Order

Input:

- `order_items`
- `shipping_cost`

Logic:

```txt
total_qty = sum(order_items.qty)
price_per_pcs = get_price_tier(total_qty)
subtotal = total_qty * price_per_pcs
total_amount = subtotal + shipping_cost
potential_points = floor(total_qty / 10)
```

## 16.3 Memberikan Point

Trigger:

- Order status berubah menjadi `Completed`.

Logic:

```txt
if order.earned_points == 0 and order.potential_points > 0:
    reseller.current_points += order.potential_points
    create point ledger
    order.earned_points = order.potential_points
```

## 16.4 Redeem Reward

Trigger:

- Admin approve redeem request.

Logic:

```txt
if reseller.current_points >= reward.required_points:
    reseller.current_points -= reward.required_points
    reward.stock -= 1
    redemption.status = Approved
    create point ledger
else:
    reject action
```

---

## 17. Non-Functional Requirements

## 17.1 Performance

- Halaman dashboard utama loading kurang dari 3 detik pada koneksi normal.
- List order menggunakan pagination.
- Upload gambar dibatasi ukuran maksimal.
- Query laporan diberi filter tanggal agar tidak berat.

## 17.2 Security

- Password harus di-hash.
- Role access wajib diterapkan di backend.
- File upload dibatasi tipe dan ukuran.
- Bukti pembayaran tidak boleh public tanpa kontrol akses.
- Reseller hanya bisa melihat data sendiri.
- Admin action penting dicatat di audit log minimal untuk payment, order, point, dan redeem.
- CSRF protection aktif.
- Validasi input dilakukan di backend.

## 17.3 Backup

- Database backup otomatis harian.
- File storage backup minimal mingguan.
- Simpan backup minimal 7-14 hari.
- Backup sebaiknya disimpan di lokasi berbeda jika sudah production.

## 17.4 Reliability

- Sistem tetap bisa digunakan walau payment gateway belum tersedia.
- Sistem bisa memproses order manual.
- Data order lama tidak boleh berubah saat harga produk/tier berubah.

## 17.5 Maintainability

- Logic harga, point, stok, dan redeem dipisahkan ke service class.
- Gunakan migration dan seeder.
- Gunakan form request validation.
- Gunakan enum/status constants agar status tidak typo.
- Gunakan resource/action/service pattern secukupnya.

---

## 18. Brand Color Palette dan Design System

Sistem menggunakan palet warna yang diambil dari identitas visual GoJamu, landing page, dan warna produk utama.

Tujuan penggunaan color palette:

1. Membuat dashboard terasa konsisten dengan brand GoJamu.
2. Membantu admin dan reseller mengenali kategori produk secara visual.
3. Membuat status, CTA, reward, dan highlight lebih mudah dibaca.
4. Menyiapkan fondasi design system agar UI tidak berubah-ubah ketika fitur bertambah.

## 18.1 Primary — Hijau Herbal

Digunakan sebagai warna utama brand, navigasi, header, sidebar, tombol utama, dan elemen yang merepresentasikan herbal/natural.

| Nama Warna | Hex | Penggunaan |
|---|---|---|
| Dark Forest | `#1A4D2E` | Sidebar, navbar, heading penting, background navigasi utama |
| Emerald | `#2D7A4F` | Tombol utama, active menu, badge utama |
| Herbal Green | `#3E9B64` | Status sukses, paid, completed, data positif |
| Mint | `#6DBF8A` | Hover state, chart positif, secondary success |
| Pale Mint | `#C5EDD4` | Background badge sukses, card ringan |
| Mist | `#EDF7F1` | Background halaman atau panel lembut |

## 18.2 Secondary — Emas/Kunyit

Digunakan untuk CTA, highlight harga, point, reward, tier harga, dan elemen promosi.

| Nama Warna | Hex | Penggunaan |
|---|---|---|
| Deep Gold | `#7A4A00` | Text emphasis pada area reward/harga |
| Kunyit | `#C47F00` | Badge tier harga, icon reward |
| Golden | `#E8A800` | CTA sekunder, highlight penting |
| Sunlight | `#FACA3B` | Point, reward stars, leaderboard |
| Cream Gold | `#FDE8A0` | Background badge point/reward |
| Warm White | `#FDF6E3` | Background section promosi/reward |

## 18.3 Accent — Pink Mahakunir

Digunakan untuk identitas produk Mahakunir, badge produk, tag, dan aksen kampanye tertentu.

| Nama Warna | Hex | Penggunaan |
|---|---|---|
| Deep Rose | `#9C1A42` | Text emphasis Mahakunir, badge kuat |
| Rose | `#C4365E` | Tag produk Mahakunir, icon accent |
| Blush Pink | `#E86B92` | Highlight produk Mahakunir |
| Sakura | `#F5A8BC` | Background lembut Mahakunir |
| Petal | `#FDE6EE` | Card/background produk Mahakunir |

## 18.4 Accent — Biru Nirlawa

Digunakan untuk identitas produk Nirlawa, badge produk, tag, dan card produk.

| Nama Warna | Hex | Penggunaan |
|---|---|---|
| Deep Ocean | `#0D3A6B` | Text emphasis Nirlawa, badge kuat |
| Cerulean | `#1A6BAF` | Tag produk Nirlawa, icon accent |
| Sky Blue | `#3A9BD6` | Highlight produk Nirlawa |
| Mist Blue | `#9DD4F0` | Background lembut Nirlawa |
| Ice Blue | `#E3F4FC` | Card/background produk Nirlawa |

## 18.5 Neutral

Digunakan untuk text, border, background, table, dan layout dasar.

| Nama Warna | Hex | Penggunaan |
|---|---|---|
| Charcoal | `#1C1F1B` | Text utama |
| Dark Gray | `#4B5249` | Text sekunder |
| Mid Gray | `#8A9187` | Placeholder, disabled text |
| Light Gray | `#C8CFC6` | Border, divider |
| Off White | `#F0F2EF` | Background halaman |
| Pure | `#FAFBF9` | Card, modal, table background |

## 18.6 Mapping Warna untuk Dashboard

| Area UI | Warna Utama | Catatan |
|---|---|---|
| Sidebar & navbar | `#1A4D2E` atau `#2D7A4F` | Gunakan text putih/off-white |
| Tombol utama | `#2D7A4F` | Untuk aksi simpan, approve, checkout |
| CTA penting | `#E8A800` | Untuk bayar, redeem, highlight program |
| Status success | `#3E9B64` | Completed, Paid, data positif |
| Status warning | `#FACA3B` | Pending, waiting verification |
| Status danger | `#C4365E` | Rejected, cancelled, failed |
| Point & reward | `#FACA3B` dan `#FDE8A0` | Icon point, card reward, leaderboard |
| Produk Mahakunir | `#E86B92` dan `#FDE6EE` | Badge/tag/card produk |
| Produk Nirlawa | `#3A9BD6` dan `#E3F4FC` | Badge/tag/card produk |
| Background utama | `#F0F2EF` atau `#FAFBF9` | Hindari putih mentah terlalu dominan |

## 18.7 Token Design yang Disarankan

Gunakan token agar mudah diterapkan di Tailwind, CSS variable, atau design system React.

```txt
--color-primary-900: #1A4D2E;
--color-primary-700: #2D7A4F;
--color-primary-500: #3E9B64;
--color-primary-300: #6DBF8A;
--color-primary-100: #C5EDD4;
--color-primary-50:  #EDF7F1;

--color-gold-900: #7A4A00;
--color-gold-700: #C47F00;
--color-gold-500: #E8A800;
--color-gold-300: #FACA3B;
--color-gold-100: #FDE8A0;
--color-gold-50:  #FDF6E3;

--color-mahakunir-700: #9C1A42;
--color-mahakunir-500: #C4365E;
--color-mahakunir-300: #E86B92;
--color-mahakunir-100: #F5A8BC;
--color-mahakunir-50:  #FDE6EE;

--color-nirlawa-700: #0D3A6B;
--color-nirlawa-500: #1A6BAF;
--color-nirlawa-300: #3A9BD6;
--color-nirlawa-100: #9DD4F0;
--color-nirlawa-50:  #E3F4FC;

--color-neutral-900: #1C1F1B;
--color-neutral-700: #4B5249;
--color-neutral-500: #8A9187;
--color-neutral-300: #C8CFC6;
--color-neutral-100: #F0F2EF;
--color-neutral-50:  #FAFBF9;
```

## 18.8 Contoh Tailwind Theme Extension

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#1A4D2E',
          700: '#2D7A4F',
          500: '#3E9B64',
          300: '#6DBF8A',
          100: '#C5EDD4',
          50: '#EDF7F1',
        },
        gold: {
          900: '#7A4A00',
          700: '#C47F00',
          500: '#E8A800',
          300: '#FACA3B',
          100: '#FDE8A0',
          50: '#FDF6E3',
        },
        mahakunir: {
          700: '#9C1A42',
          500: '#C4365E',
          300: '#E86B92',
          100: '#F5A8BC',
          50: '#FDE6EE',
        },
        nirlawa: {
          700: '#0D3A6B',
          500: '#1A6BAF',
          300: '#3A9BD6',
          100: '#9DD4F0',
          50: '#E3F4FC',
        },
        neutral: {
          900: '#1C1F1B',
          700: '#4B5249',
          500: '#8A9187',
          300: '#C8CFC6',
          100: '#F0F2EF',
          50: '#FAFBF9',
        },
      },
    },
  },
};
```

## 18.9 UI Rule untuk Konsistensi MVP

1. Jangan gunakan terlalu banyak warna dalam satu halaman.
2. Sidebar cukup hijau tua, CTA cukup gold, status gunakan warna status.
3. Warna pink dan biru hanya untuk konteks produk Mahakunir dan Nirlawa.
4. Gunakan background netral agar dashboard tetap nyaman dipakai lama.
5. Badge status wajib konsisten di semua halaman.
6. Tabel admin harus tetap high contrast dan mudah dibaca.
7. Portal reseller boleh lebih visual daripada dashboard admin.

## 18.10 Database Support untuk Warna Produk

Agar warna produk bisa berkembang tanpa mengubah frontend, tambahkan kolom opsional di master produk atau gunakan tabel metadata.

Opsi sederhana MVP:

```txt
products.color_key nullable
products.color_hex nullable
```

Contoh:

```txt
Nirlawa:
color_key: nirlawa
color_hex: #3A9BD6

Mahakunir:
color_key: mahakunir
color_hex: #E86B92

Balakacida:
color_key: primary
color_hex: #2D7A4F
```

Jika nanti butuh lebih rapi, buat tabel `product_theme_colors`:

```txt
id
product_id
color_key
primary_hex
background_hex
text_hex
created_at
updated_at
```

Untuk MVP, kolom `color_key` dan `color_hex` di `products` sudah cukup.

---

## 19. UI/UX Requirements

## 18.1 Prinsip UI

- Sederhana.
- Cepat dipahami admin dan reseller.
- Mobile friendly untuk reseller.
- Desktop friendly untuk admin/gudang.
- Tombol aksi utama jelas.
- Status order menggunakan badge warna.
- Perhitungan harga dan point transparan.

## 18.2 Admin UI

Admin panel menggunakan layout dashboard:

- Sidebar menu.
- Header.
- Table dengan search/filter.
- Detail drawer/page.
- Form sederhana.
- Badge status.
- Action button jelas.

## 18.3 Reseller UI

Portal reseller dibuat seperti mini commerce:

- Katalog produk dengan card.
- Cart/order summary.
- Progress point.
- Reward card.
- Status order yang mudah dibaca.

## 18.4 Tampilan Checkout Reseller

Checkout wajib menampilkan:

```txt
Total Qty: 75 pcs
Harga Tier: Rp42.000 / pcs
Subtotal: Rp3.150.000
Ongkir: Rp75.000
Total Bayar: Rp3.225.000
Point didapat setelah order selesai: 7 point
```

---

## 20. Risks dan Mitigasi

## 19.1 Salah Hitung Harga Tier

Risiko:

- Reseller mendapatkan harga yang tidak sesuai poster.

Mitigasi:

- Buat unit test untuk price tier.
- Simpan snapshot harga di order.
- Tampilkan breakdown di checkout.

## 19.2 Salah Hitung Point

Risiko:

- Komplain reseller karena point tidak sesuai.

Mitigasi:

- Gunakan point ledger.
- Berikan point hanya saat order completed.
- Buat audit trail adjustment point.

## 19.3 Stok Tidak Sinkron

Risiko:

- Reseller order melebihi stok.

Mitigasi:

- Cek stok saat checkout.
- Gunakan reserved stock.
- Catat stock movement.

## 19.4 Pembayaran Manual Rawan Human Error

Risiko:

- Admin salah approve pembayaran.

Mitigasi:

- Tampilkan amount order dan bukti bayar berdampingan.
- Catat admin yang melakukan approve.
- Tambahkan catatan verifikasi.

## 19.5 Scope Melebar

Risiko:

- MVP lama selesai karena terlalu banyak fitur otomatisasi.

Mitigasi:

- Fokus P0 dulu.
- Payment gateway dan ekspedisi otomatis masuk P2.
- Gunakan manual flow dulu.

---

## 21. Metrics Keberhasilan MVP

MVP dianggap berhasil jika:

1. Admin dapat mengelola reseller dan produk tanpa spreadsheet utama.
2. Reseller dapat membuat order dari portal.
3. Sistem menghitung harga tier dengan benar.
4. Sistem menghitung point dengan benar.
5. Admin dapat verifikasi pembayaran manual.
6. Gudang dapat mencetak invoice dan label.
7. Reseller dapat melihat status order dan resi.
8. Reseller dapat melihat saldo point.
9. Admin dapat approve redeem reward.
10. Operasional order reseller bisa berjalan end-to-end di sistem.

---

## 22. Milestone Development

## Milestone 1 — Foundation

Fitur:

- Setup project Laravel Inertia React.
- Auth dan role.
- Layout admin.
- Layout reseller.
- Seeder role dan admin.

Output:

- User bisa login.
- Role access dasar berjalan.

## Milestone 2 — Master Data

Fitur:

- CRUD reseller.
- CRUD produk.
- CRUD price tier.
- CRUD reward.
- Stok produk sederhana.

Output:

- Admin dapat mengelola data utama.

## Milestone 3 — Order Core

Fitur:

- Katalog reseller.
- Cart/order form.
- Kalkulasi harga tier.
- Kalkulasi potensi point.
- Generate invoice number.
- Order list dan order detail.

Output:

- Reseller dapat membuat order.

## Milestone 4 — Payment Manual

Fitur:

- Instruksi pembayaran.
- Upload bukti bayar.
- Admin approve/reject payment.
- Payment status.

Output:

- Order dapat berubah dari Pending Payment ke Paid.

## Milestone 5 — Fulfillment

Fitur:

- Order processing.
- Input ongkir, kurir, resi.
- Invoice PDF.
- Label PDF.
- Status shipped/completed.

Output:

- Gudang dapat memproses order dan cetak dokumen.

## Milestone 6 — Point & Reward

Fitur:

- Point otomatis saat order completed.
- Point ledger.
- Reward list reseller.
- Redeem request.
- Admin approve/reject redeem.

Output:

- Program reward berjalan di sistem.

## Milestone 7 — Reports & Polish

Fitur:

- Dashboard admin.
- Dashboard reseller.
- Laporan dasar.
- Export CSV/Excel.
- UI polish.
- Bug fixing.

Output:

- MVP siap dipakai internal.

---

## 23. Roadmap Fase Berikutnya

## Phase 1 — MVP Internal

Fokus:

- Manual payment.
- Manual shipment.
- Invoice/label PDF.
- Point dan reward.

## Phase 2 — Operational Enhancement

Fokus:

- Registrasi reseller mandiri.
- WhatsApp notification template.
- Export laporan lebih lengkap.
- Audit log.
- Level reseller.
- Leaderboard.
- Campaign point.

## Phase 3 — Payment & Shipping Automation

Fokus:

- Payment gateway.
- Payment webhook.
- Cek ongkir otomatis.
- Tracking otomatis.
- Integrasi ekspedisi.
- Generate resi otomatis.

## Phase 4 — Scale & Advanced Ops

Fokus:

- Multi warehouse.
- Return/refund.
- Stock transfer.
- Advanced reporting.
- Direct thermal printing.
- API integration.

---

## 24. Open Questions

Keputusan bisnis yang perlu dikonfirmasi sebelum development:

1. Apakah semua produk memakai harga tier yang sama?
2. Apakah tier harga dihitung dari total qty order campuran produk?
3. Apakah qty di atas 300 pcs tetap Rp32.000/pcs?
4. Apakah sisa qty point di bawah 10 pcs hangus atau diakumulasi?
5. Apakah reseller boleh cancel order sendiri sebelum bayar?
6. Apakah admin boleh membuat order atas nama reseller?
7. Apakah ongkir ditentukan manual oleh admin atau reseller input sendiri?
8. Apakah point memiliki masa berlaku 1 tahun kalender seperti poster?
9. Apakah reward perlu stok fisik?
10. Apakah reseller perlu upload KTP atau data legal?
11. Apakah perlu fitur approval reseller sejak MVP?
12. Apakah invoice perlu nomor pajak/NPWP?
13. Apakah label pengiriman cukup internal atau harus mengikuti format ekspedisi tertentu?

---

## 25. Rekomendasi Keputusan untuk MVP

Agar MVP cepat selesai, gunakan keputusan berikut:

1. Semua produk memakai harga tier yang sama.
2. Harga tier dihitung berdasarkan total qty dalam satu order.
3. Qty di atas 300 pcs memakai harga tier tertinggi.
4. Sisa qty point di bawah 10 pcs hangus per order.
5. Point masuk setelah order completed.
6. Reseller dibuat oleh admin dulu.
7. Pembayaran manual dengan upload bukti bayar.
8. Ongkir dan resi diinput manual oleh admin/gudang.
9. Invoice dan label dibuat PDF dari browser.
10. Reward dipotong point saat admin approve redeem.

---

## 25. LLM Implementation Prompt

Bagian ini bisa diberikan ke LLM/coding agent sebagai konteks pengembangan.

```txt
Kamu adalah senior full-stack engineer. Bangun aplikasi internal bernama GoJamu Reseller Management System menggunakan Laravel + Inertia.js + React + Tailwind CSS + MySQL/MariaDB.

Fokus MVP:
- Auth dan role access.
- Admin dashboard.
- Manajemen reseller.
- Manajemen produk.
- Manajemen stok sederhana.
- Harga reseller bertingkat berdasarkan total qty order.
- Order reseller.
- Upload bukti pembayaran.
- Verifikasi pembayaran manual.
- Input kurir, ongkir, dan resi manual.
- Cetak invoice PDF.
- Cetak label pengiriman PDF ukuran 100x150mm.
- Point otomatis: floor(total_qty / 10), diberikan setelah order Completed.
- Point ledger/history.
- Reward management.
- Redeem reward approval.
- Laporan dasar.

Aturan harga tier:
1-12 pcs = Rp55.000/pcs
13-50 pcs = Rp47.000/pcs
51-100 pcs = Rp42.000/pcs
101-200 pcs = Rp37.000/pcs
201-300 pcs = Rp32.000/pcs
Qty di atas 300 menggunakan harga tier tertinggi kecuali ada tier baru.

Aturan point:
10 pcs = 1 point.
Point = floor(total_qty / 10).
Point masuk setelah order Completed.
Sisa pcs di bawah 10 hangus per order pada MVP.

Pastikan logic harga, order calculation, stok, point, dan redeem dipisahkan ke service class.
Gunakan migration, seeder, form request validation, policy/middleware role access, dan pagination untuk table besar.
```

---

## 26. Kesimpulan

GoJamu Reseller Management System sebaiknya dibangun sebagai aplikasi internal monolith menggunakan **Laravel Inertia React**.

Fokus MVP adalah menyelesaikan alur operasional utama dari reseller order sampai reward point, tanpa langsung masuk ke payment gateway dan ekspedisi otomatis.

Prioritas utama MVP:

1. Reseller management.
2. Product dan stock management.
3. Price tier otomatis.
4. Order reseller.
5. Payment manual.
6. Fulfillment manual.
7. Invoice dan label PDF.
8. Point ledger.
9. Reward redeem.
10. Dashboard dan laporan dasar.

Dengan pendekatan ini, sistem bisa cepat digunakan oleh tim internal, biaya production tetap rendah, dan arsitektur tetap cukup fleksibel untuk dikembangkan ke fase automation ketika operasional sudah terbukti berjalan.
