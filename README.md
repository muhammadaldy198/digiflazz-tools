# Digi Tools

Dashboard pribadi untuk memantau katalog Digiflazz di https://tools.lfamiliastore.my.id. Kode sumber ini memakai Cloudflare Worker + D1 yang sudah ada, dilindungi Cloudflare Access.

## Fitur yang sudah aktif

- Koneksi dari sesi yang disimpan terenkripsi AES-GCM di D1, uji sesi, dan pencarian jalur API tanpa menampilkan cookie.
- Scan katalog dan kandidat seller dari endpoint Digiflazz yang dipakai dashboard mereka, perubahan harga, log, filter SKU, kunci produk dari otomasi, rating dan batas harga, ulasan minimal, prioritas/blokir seller, aturan per lingkup, grup zona, skor kandidat, proactive sampling, tambahan max price global, serta generator kode layanan dari inisial game dan jumlah nominal.
- Tombol ganti seller manual dan set max price melakukan cek ulang data terbaru, satu POST ke endpoint dashboard Digiflazz, lalu membaca ulang hasilnya. Respons yang ambigu dikunci dan tidak diulang otomatis.
- Skrip pendamping `extension/digi-select.user.js` berjalan langsung di halaman Digiflazz saat tombol pilih seller suatu produk ditekan. Ia memakai fungsi Vue halaman Digiflazz untuk memilih kandidat, menyimpan otomatis hanya bila diaktifkan, mengisi max price dari harga seller baru ditambah nilai global, dan mengisi kode deterministik pada form Tambah Produk yang dikenali. Pengaturan disimpan di browser; skrip tidak mengirim cookie atau data sesi ke server lain.
- Cron 5 menit; interval scan bisa lebih panjang melalui panel. Auto-switch hanya dapat diaktifkan sesudah satu perubahan manual berhasil dikonfirmasi; default tetap pratinjau.
- Semua permintaan dashboard diverifikasi memakai tanda tangan JWT Cloudflare Access. Domain Workers bawaan dinonaktifkan; akses pengguna hanya lewat domain yang sudah ada.

## Batas verifikasi

Jalur daftar kandidat, pencarian SKU baru, perubahan produk, dan field seller dicocokkan dengan skrip serta respons baca dashboard Digiflazz. Hasil **POST** pada akun ini belum diuji: coba satu switch manual melalui dashboard sebelum mengaktifkan auto-switch. Respons POST yang tidak pasti dapat diperiksa ulang di detail SKU dan tidak diulang otomatis. Tombol set max price tersedia per produk; kalkulator dan generator kode di dashboard menyiapkan nilai, sedangkan skrip pendamping bekerja langsung pada halaman Digiflazz. Sebagian modul OtoSwitch seperti Telegram, langganan/billing dan kunci API eksternal tidak relevan atau belum tersedia di aplikasi pribadi ini. Jangan meletakkan cookie/sesi Digiflazz dalam issue atau commit.

## Auto Seller langsung pada Digiflazz di Android

Chrome Android tidak memasang ekstensi. Buka Firefox Android, pasang add-on [Violentmonkey](https://addons.mozilla.org/en-US/android/addon/violentmonkey/), lalu buka [digi-select.user.js](https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js) di Firefox untuk memasangnya. Login ke Digiflazz seperti biasa, buka Produk, lalu tekan pilihan seller pada satu produk. Tombol mengambang **⚡ Auto Seller** membuka panel rating minimal, batas harga, seller blokir/prioritas, mode simpan, dan **Tambahan max price untuk semua produk (Rp)**. Isi `1000` agar seller seharga Rp15.000 mendapat max price Rp16.000 setiap kali dipilih. Kode produk dibuat dari inisial game dan nominal, misalnya `Mobile Legends 5 Diamond → ML5` dan `Free Fire 1000DIAMOND → FF1000`; panel menyediakan tombol Buat kode dan Salin. Pada form Tambah Produk yang dikenali, skrip mengisi kode saat nama dan nominal tersedia; bila tidak dikenali, gunakan tombol Buat kode dan salin sendiri. Mode awal **Manual** mengisi pilihan seller tanpa menyimpan produk sampai tombol Simpan Digiflazz ditekan. Mode **Otomatis** memakai tombol simpan Digiflazz yang sama. Pengaturan panel Digiflazz disimpan di browser itu sendiri; nilai global di dashboard disimpan terpisah untuk perpindahan seller melalui Worker. Skrip bergantung pada komponen Vue halaman Digiflazz; perubahan tampilan Digiflazz dapat memerlukan pembaruan skrip. Keberhasilan klik seller otomatis pada sesi browser asli masih perlu diuji di halaman login akun ini.

## Pengembangan

Jalankan npm run check (Node.js 20+). npm run build membuat src/index.js dari src/worker.js dan src/ui.html; npm run deploy memakai Wrangler. Jalankan migrasi 0001–0004 pada D1 sebelum deploy. Secret SESSION_ENCRYPTION_KEY di Cloudflare harus tetap ada; jangan menaruh cURL, cookie, atau key dalam repo.
