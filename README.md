# Digi Tools

Dashboard pribadi untuk memantau katalog Digiflazz di https://tools.lfamiliastore.my.id. Kode sumber ini memakai Cloudflare Worker + D1 yang sudah ada, dilindungi Cloudflare Access.

## Fitur yang sudah aktif

- Koneksi dari sesi yang disimpan terenkripsi AES-GCM di D1, uji sesi, dan pencarian jalur API tanpa menampilkan cookie.
- Scan katalog, data penjual, perubahan harga, log, filter SKU, kunci produk dari otomasi, rating dan batas harga, prioritas/blokir seller, aturan per lingkup, grup zona, skor kandidat yang tersedia, serta alat hitung max price dan kode layanan acak.
- Cron 5 menit; interval scan bisa lebih panjang melalui panel. Awalnya monitor mati sampai diaktifkan oleh pemilik.
- Semua permintaan dashboard diverifikasi memakai tanda tangan JWT Cloudflare Access. Domain Workers bawaan dinonaktifkan; akses pengguna hanya lewat domain yang sudah ada.

## Batas konektor

Endpoint publik dan dokumentasi yang tersedia belum memverifikasi bentuk request **ubah seller produk**, **ubah max price**, dan **daftar seller alternatif per produk** di dashboard Digiflazz. Kode tidak menebak endpoint itu. Auto-switch live dan tombol switch sengaja tertutup sampai request dan respons yang tepat diverifikasi pada akun ini. Pemindaian tidak melakukan transaksi atau mengubah produk. Alat input menyiapkan nilai untuk disalin, belum mengisi form Digiflazz lintas situs.

## Pengembangan

Jalankan npm run check (Node.js 20+). npm run build membuat src/index.js dari src/worker.js dan src/ui.html; npm run deploy memakai Wrangler. Jalankan migrasi 0001–0003 pada D1 sebelum deploy. Secret SESSION_ENCRYPTION_KEY di Cloudflare harus tetap ada; jangan menaruh cURL, cookie, atau key dalam repo.
