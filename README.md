# Digi Tools

Dashboard pribadi untuk memantau katalog Digiflazz di https://tools.lfamiliastore.my.id. Kode sumber ini memakai Cloudflare Worker + D1 yang sudah ada, dilindungi Cloudflare Access.

## Fitur yang sudah aktif

- Koneksi dari sesi yang disimpan terenkripsi AES-GCM di D1, uji sesi, dan pencarian jalur API tanpa menampilkan cookie.
- Scan katalog dan kandidat seller dari endpoint Digiflazz yang dipakai dashboard mereka, perubahan harga, log, filter SKU, kunci produk dari otomasi, rating dan batas harga, ulasan minimal, prioritas/blokir seller, aturan per lingkup, grup zona, skor kandidat, serta alat hitung max price dan kode layanan acak.
- Tombol ganti seller manual dan set max price melakukan cek ulang data terbaru, satu POST ke endpoint dashboard Digiflazz, lalu membaca ulang hasilnya. Respons yang ambigu dikunci dan tidak diulang otomatis.
- Cron 5 menit; interval scan bisa lebih panjang melalui panel. Auto-switch hanya dapat diaktifkan sesudah satu perubahan manual berhasil dikonfirmasi; default tetap pratinjau.
- Semua permintaan dashboard diverifikasi memakai tanda tangan JWT Cloudflare Access. Domain Workers bawaan dinonaktifkan; akses pengguna hanya lewat domain yang sudah ada.

## Batas verifikasi

Jalur daftar kandidat, perubahan produk, dan field seller dicocokkan dengan skrip dashboard Digiflazz. Hasil tulis pada akun ini belum diuji: coba satu switch manual melalui dashboard sebelum mengaktifkan auto-switch. Tombol set max price tersedia per produk; kalkulator dan generator kode menyiapkan nilai, tetapi tidak mengisi halaman Digiflazz lintas situs. Fitur dari OtoSwitch yang bergantung pada format data khusus di akun ini bisa berbeda dari implementasi ini. Jangan meletakkan cookie/sesi Digiflazz dalam issue atau commit.

## Pengembangan

Jalankan npm run check (Node.js 20+). npm run build membuat src/index.js dari src/worker.js dan src/ui.html; npm run deploy memakai Wrangler. Jalankan migrasi 0001–0004 pada D1 sebelum deploy. Secret SESSION_ENCRYPTION_KEY di Cloudflare harus tetap ada; jangan menaruh cURL, cookie, atau key dalam repo.
