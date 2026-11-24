# NusaKlik Store — Template Toko Online Produk Digital

**Tagline:** Solusi Belanja Digital Anda.

Template toko online profesional berbasis **HTML5, CSS3, dan JavaScript murni** (tanpa backend berbayar atau database eksternal). Ringan, responsif untuk desktop/tablet/HP, dan siap dipasang di hosting statis maupun **GitHub Pages**.

---

## Struktur Proyek

```text
├── index.html                  # Halaman utama toko
├── style.css                   # Stylesheet utama dan token tema warna
├── script.js                   # Logika katalog, keranjang (localStorage), & checkout WhatsApp
├── config.js                   # File konfigurasi terpusat toko & daftar produk
├── README.md                   # Panduan penggunaan berbahasa Indonesia
├── assets/
│   ├── logo/
│   │   ├── logo-utama.svg      # Logo utama NusaKlik Store
│   │   ├── logo-header.svg     # Logo horizontal untuk header
│   │   └── logo-footer.svg     # Logo terang untuk footer gelap
│   ├── banner/
│   │   ├── hero-banner.jpg     # Banner utama halaman beranda
│   │   └── promo-banner.jpg    # Banner promosi produk
│   ├── favicon/
│   │   └── favicon.svg         # Ikon tab browser
│   ├── icons/                  # Ikon kategori & keunggulan toko (SVG)
│   └── images/                 # Gambar cover produk & ilustrasi studio
└── pages/
    ├── produk.html             # Halaman detail produk & spesifikasi
    ├── tentang-kami.html       # Halaman Tentang Kami
    ├── kontak.html             # Halaman Kontak + formulir WhatsApp
    ├── cara-pembelian.html     # Halaman panduan pembelian
    ├── cara-pembayaran.html    # Halaman daftar metode pembayaran
    ├── faq.html                # Halaman pertanyaan umum (FAQ)
    ├── kebijakan-privasi.html  # Halaman Kebijakan Privasi
    └── syarat-ketentuan.html   # Halaman Syarat dan Ketentuan
```

---

## 1. Cara Menjalankan Website Secara Lokal

Anda dapat menjalankan template ini langsung di komputer tanpa instalasi database:

1. **Menggunakan Live Server (VS Code):**
   - Buka folder proyek di Visual Studio Code.
   - Pasang ekstensi **Live Server**.
   - Klik kanan pada `index.html`, lalu pilih **Open with Live Server**.
2. **Menggunakan Python HTTP Server:**
   - Buka terminal di folder proyek, lalu jalankan:
     ```bash
     python3 -m http.server 8080
     ```
   - Buka browser dan kunjungi `http://localhost:8080`.

---

## 2. Cara Mengubah Nama Toko, Tagline, & Informasi Kontak

Buka file `config.js`, lalu ubah bagian `store` dan `contact`:

```js
store: {
  name: "Nama Toko Anda",
  tagline: "Tagline Toko Anda.",
  description: "Deskripsi singkat toko Anda...",
  ...
},
contact: {
  whatsappNumber: "6281234567890", // Format internasional tanpa + atau spasi
  whatsappDisplay: "+62 812-3456-7890",
  email: "email@tokoanda.com",
  address: "Alamat toko Anda",
  operationalHours: "Senin – Sabtu, 09.00 – 18.00 WIB"
}
```

> **Catatan:** Jangan menyimpan kata sandi, API key pribadi, atau informasi rahasia di dalam `config.js` karena file ini bersifat publik di browser.

---

## 3. Cara Mengganti Nomor WhatsApp

1. Buka file `config.js`.
2. Cari properti `whatsappNumber` di dalam objek `contact`.
3. Ganti angka `"6281234567890"` dengan nomor WhatsApp admin toko Anda diawali kode negara `62` (tanpa tanda `+`, tanpa tanda hubung `-`, dan tanpa spasi). Contoh: `6285711223344`.
4. Ubah juga `whatsappDisplay` agar tampilan nomor di footer dan halaman kontak ikut menyesuaikan.

---

## 4. Cara Mengganti Logo, Favicon, & Banner

Seluruh aset visual tersimpan di folder `assets/`. Anda dapat mengganti file gambarnya langsung atau menunjuk ke nama file baru di `config.js`:

- **Logo Utama, Header, & Footer:**
  Simpan gambar baru Anda di folder `assets/logo/` (disarankan format `.svg` atau `.png` transparan), lalu perbarui path di `config.js`:
  ```js
  logoMain: "assets/logo/logo-utama.svg",
  logoHeader: "assets/logo/logo-header.svg",
  logoFooter: "assets/logo/logo-footer.svg",
  ```
- **Favicon:**
  Ganti file `assets/favicon/favicon.svg` (atau ubah path `favicon` di `config.js` serta tag `<link rel="icon">` di file HTML).
- **Banner Utama & Banner Promosi:**
  Simpan gambar baru (disarankan rasio `16:9` dan ukuran file terkompresi di bawah `200 KB`) ke folder `assets/banner/`, lalu perbarui:
  ```js
  heroBanner: "assets/banner/hero-banner.jpg",
  promoBanner: "assets/banner/promo-banner.jpg",
  ```

---

## 5. Cara Mengganti Warna Tema

Buka file `config.js` pada bagian `theme` dan ubah kode warna HEX sesuai merek Anda:

```js
theme: {
  primary: "#0D5BD9",       // Warna utama tombol & aksen aktif
  primaryHover: "#0A49B0",  // Warna tombol saat diarahkan kursor
  navy: "#0B2545",          // Warna teks judul utama, footer, & tombol sekunder
  lightBlue: "#E8F1FD",     // Warna latar aksen lembut
  accent: "#38BDF8",        // Warna sorotan sekunder
  bgCanvas: "#F8FAFC",      // Warna latar halaman
  surface: "#FFFFFF"        // Warna kartu & panel
}
```

Warna akan otomatis diterapkan ke seluruh halaman melalui variabel CSS saat website dibuka.

---

## 6. Cara Menambah, Mengedit Produk, & Mengganti Harga

Buka file `config.js`, cari array `products: [ ... ]`. Setiap produk memiliki struktur berikut:

```js
{
  id: "slug-unik-produk",            // Wajib unik tanpa spasi
  name: "Nama Produk Digital Anda",
  category: "Template",              // Cocokkan dengan nama di array categories
  price: 150000,                     // Harga normal (angka tanpa titik, isi 0 jika gratis)
  discountPrice: 99000,              // Harga promo (isi null jika tidak ada diskon)
  badge: "Promo",                    // Isi "Promo", "Gratis", atau "" (kosong)
  featured: true,                    // true agar tampil di bagian Produk Unggulan
  isNew: true,                       // true agar muncul pada filter Terbaru
  popular: true,                     // true agar muncul pada filter Populer
  image: "assets/images/cover.jpg",  // Path gambar cover produk (rasio 4:3)
  shortDescription: "Ringkasan singkat produk.",
  fullDescription: "Deskripsi lengkap yang tampil di halaman detail produk.",
  specs: {
    "Format File": "PDF / ZIP",
    "Ukuran File": "5 MB",
    "Lisensi": "Komersial"
  }
}
```

- **Mengganti harga:** Ubah angka `price` (harga normal) dan `discountPrice` (harga diskon). Jika tidak ada diskon, ubah `discountPrice: null`.
- **Menjadikan produk gratis:** Isi `price: 0`, `discountPrice: null`, dan `badge: "Gratis"`.

---

## 7. Cara Mengunggah ke GitHub

1. Buat akun di [GitHub](https://github.com) jika belum memiliki akun.
2. Buat repository baru dengan mengklik tombol **New Repository** (misalnya bernama `nusaklik-store`), pilih **Public**, lalu klik **Create repository**.
3. Unggah seluruh isi folder proyek ini ke repository tersebut:
   - **Cara mudah lewat browser:** Klik **uploading an existing file** pada halaman repository baru Anda, seret seluruh file dan folder (`index.html`, `style.css`, `script.js`, `config.js`, `README.md`, `assets/`, `pages/`), lalu klik **Commit changes**.
   - **Atau lewat Git di terminal:**
     ```bash
     git init
     git add .
     git commit -m "Rilis awal NusaKlik Store"
     git branch -M main
     git remote add origin https://github.com/USERNAME_ANDA/nusaklik-store.git
     git push -u origin main
     ```

---

## 8. Cara Mengaktifkan GitHub Pages

1. Buka repository proyek Anda di GitHub.
2. Klik tab **Settings** di bagian atas.
3. Pada menu sebelah kiri, pilih **Pages**.
4. Di bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
5. Pada bagian **Branch**, pilih **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
6. Tunggu 1–2 menit hingga tautan website aktif muncul di bagian atas halaman Pages (misalnya: `https://username-anda.github.io/nusaklik-store/`).

Website NusaKlik Store Anda kini sudah online dan siap digunakan tanpa biaya server bulanan.
