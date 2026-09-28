# Digi Tools

Dashboard pribadi untuk mengelola katalog dan Auto Switch seller Digiflazz di `https://tools.lfamiliastore.my.id`. Aplikasi berjalan di Cloudflare Worker + D1 dan akses dashboard dilindungi Cloudflare Access.

## Fitur production

- Sesi Digiflazz disimpan terenkripsi AES-GCM di D1. cURL GET baru diuji terlebih dahulu sebelum menggantikan sesi lama.
- Scan katalog, seller aktif, harga, stok, cut-off, rating, SLA, perubahan harga, riwayat switch, dan log operasional.
- Produk diurutkan berdasarkan brand/game lalu nominal terkecil ke terbesar, bukan berdasarkan harga seller.
- Max Price hanya memakai **Max Price masing-masing produk Buyer di Digiflazz**. Tidak ada Max Price global atau price cap kedua di tools.
- Seller wajib lolos rating minimal, status aktif, stok, cut-off, zona, dan Max Price produk.
- Urutan Auto Switch: **tier rating 4,5–5 → Seller Prioritas → SLA tercepat → toleransi harga → rating → jumlah ulasan → harga**. Rating 4,0–4,49 hanya dipakai bila tidak ada kandidat tier 4,5–5 yang lolos. Jenis koneksi IP/API/H2H tidak memengaruhi ranking.
- Default production saat ini memakai rating minimal 4 dan toleransi harga 2%.
- Seller dapat berstatus **Biasa**, **Prioritas**, atau **Blokir**. Prioritas hanya mendahulukan seller di dalam tier rating aktif dan tidak dapat melewati syarat rating minimum, stok, cut-off, Max Price, zona, atau blokir.\n- Menu **Penjual** memakai endpoint direktori seller Digiflazz melalui sesi cURL tersimpan sebagai sumber kebenaran. Nama, rating, ulasan, dan jumlah produk ditampilkan sesuai response Digiflazz tanpa dihitung ulang dari `seller_options`. Cache lokal hanya menyimpan response langsung terakhir sebagai fallback jika endpoint live sementara gagal.
- Aturan khusus dapat diterapkan ke kategori, brand, tipe, atau SKU. Aturan khusus hanya mengubah rating minimal; proteksi stok dan cut-off tetap wajib.
- Zona memakai pola deskripsi seller dan assignment SKU. Product ID tidak diperlukan.
- Auto Switch hanya memasukkan SKU yang benar-benar punya kandidat pengganti yang memenuhi semua aturan. Produk bermasalah tanpa kandidat tetap muncul di **Perlu perhatian** tetapi tidak menghabiskan batch otomatis.
- Auto Switch otomatis dijalankan **1x per jam** pada menit 30. Scan penuh dipisah pada menit 00 dan interval scan memiliki minimum 60 menit agar database/request lebih hemat. Cooldown, batch Auto Switch, dan refresh rating/SLA tetap dapat dikonfigurasi dari panel.
- Hasil HTTP 4xx Digiflazz diklasifikasikan sebagai penolakan pasti. Target seller yang baru ditolak tidak langsung dicoba ulang.
- Penolakan kebijakan akun yang persisten (misalnya persyaratan KTP/verifikasi administrasi seller) diblokir per SKU+seller dari Auto Switch sampai percobaan manual berhasil.
- Seller options per SKU direfresh sebagai snapshot terbaru. Opsi seller lama yang sudah hilang di Digiflazz dibuang.
- Produk yang endpoint seller-nya menghasilkan daftar kosong diberi backoff 6 jam; error refresh biasa diberi retry 30 menit agar slot refresh tidak macet pada SKU yang sama.
- Ringkasan menampilkan **Perlu perhatian**, **Siap Auto Switch**, coverage rating/SLA, Max Price kosong, dan status scan.
- Riwayat dan Log Sistem memiliki filter server-side untuk SKU, status, manual/otomatis, level log, jenis log, dan pencarian pesan.

## Auto Seller Browser

Userscript `extension/digi-select.user.js` adalah pendamping opsional ketika membuka dashboard Digiflazz secara langsung.

- Versi saat ini: **v2.0**.
- Berjalan pada `member.digiflazz.com` dan menyinkronkan aturan seller non-rahasia dari `tools.lfamiliastore.my.id`.
- Yang disinkronkan: rating minimum, ulasan minimum, toleransi harga, daftar Seller Prioritas, dan daftar seller diblokir.
- Cookie atau token Digiflazz **tidak** disalin ke userscript melalui endpoint sinkronisasi.
- Kontrol lokal browser hanya: aktif/nonaktif helper, mode simpan Manual/Otomatis, dan SKU otomatis.
- Max Price tidak dihitung ulang oleh userscript.
- SKU otomatis mengikuti inisial game + nominal, misalnya `Mobile Legends 5 Diamond → ML5` dan `Free Fire 1000 Diamond → FF1000`.
- SKU yang sudah diisi manual tidak ditimpa.
- Tombol **Isi semua SKU di halaman** tetap tersedia.

Untuk Android, gunakan Firefox + Violentmonkey lalu pasang:

`https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js`

## Keamanan

- Semua endpoint dashboard selain `/api/health` memverifikasi JWT Cloudflare Access.
- Request mutasi non-GET/HEAD juga wajib memiliki `Origin` yang sama dengan domain tools.
- Cookie/cURL Digiflazz tidak boleh dimasukkan ke issue, commit, atau file repo.
- `SESSION_ENCRYPTION_KEY` tetap disimpan sebagai secret Cloudflare.
- Domain `workers.dev` tidak digunakan untuk akses pengguna.
- Operasi seller/harga dengan hasil ambigu tidak diulang buta; status `pending/unknown` harus direkonsiliasi sebelum mutasi berikutnya.

## Cron dan alur production

Cron Worker terpasang setiap 5 menit:

`*/5 * * * *`

Saat Auto Switch live:
1. Full scan dan Auto Switch **tidak dijalankan pada invocation yang sama**.
2. Full scan menggunakan cadence efektif dua kali interval scan agar batas subrequest Cloudflare Free tetap aman.
3. Invocation lain memproses cache perhatian dan batch Auto Switch.
4. Setelah switch sukses, produk dibaca ulang dari Digiflazz dan cache perhatian diperbarui.

Production saat ini menggunakan:
- scan enabled: true
- Auto Switch: true
- Mode Uji: false
- scan interval: 5 menit
- Auto Switch batch: 5 SKU
- cooldown: 24 jam
- refresh rating/SLA: 10 SKU per full scan
- min rating: 4
- min reviews: 0
- toleransi harga: 2%

Nilai production disimpan di D1 dan dapat berubah melalui panel; daftar di atas adalah konfigurasi yang diverifikasi saat dokumentasi ini diperbarui.

## Pengembangan

Gunakan Node.js 20+.

```bash
npm install
npm run check
```

`npm run check` menjalankan build, syntax check, pemeriksaan UI, dan seluruh regression test.

`npm run build` menggabungkan:
- `src/worker.js`
- `src/ui.html`

menjadi:
- `src/index.js`

Migrasi D1 yang digunakan saat ini:
- `0001_init.sql`
- `0002_digiflazz_connection.sql`
- `0003_dashboard.sql`
- `0003_manager.sql`
- `0004_switch_operations.sql`
- `0005_materialized_attention.sql`
- `0006_quality_refresh_state.sql`
- `0007_scan_single_flight.sql`
- `0008_seller_rejections.sql`

Jangan hardcode cookie, token, secret, account ID, atau kredensial lain ke source.
