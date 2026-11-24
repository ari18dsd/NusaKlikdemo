/**
 * ============================================================================
 * KONFIGURASI TERPUSAT NUSAKLIK STORE
 * ============================================================================
 * Ubah pengaturan toko, tema warna, kontak WhatsApp, metode pembayaran,
 * banner, testimoni, kategori, dan daftar produk langsung melalui file ini.
 * Jangan menyimpan kata sandi, token rahasia, atau kredensial pribadi di sini.
 * ============================================================================
 */

window.NUSAKLIK_CONFIG = {
  store: {
    name: "NusaKlik Store",
    tagline: "Solusi Belanja Digital Anda.",
    description:
      "Etalase produk digital profesional untuk template website, e-book bisnis, dokumen operasional, desain antarmuka, dan perangkat produktivitas siap pakai.",
    logoMain: "assets/logo/logo-utama.svg",
    logoHeader: "assets/logo/logo-header.svg",
    logoFooter: "assets/logo/logo-footer.svg",
    favicon: "assets/favicon/favicon.svg",
    heroBanner: "assets/banner/hero-banner.jpg",
    promoBanner: "assets/banner/promo-banner.jpg",
    aboutImage: "assets/images/about-studio.jpg",
    copyrightYear: "2026"
  },

  theme: {
    primary: "#0D5BD9",
    primaryHover: "#0A49B0",
    navy: "#0B2545",
    lightBlue: "#E8F1FD",
    accent: "#38BDF8",
    bgCanvas: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textMuted: "#475569"
  },

  contact: {
    // Ganti dengan nomor WhatsApp admin Anda (format internasional tanpa tanda + atau spasi)
    whatsappNumber: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890 (Nomor Contoh)",
    email: "halo@nusaklik-store.example",
    address: "Jl. Contoh Merdeka Digital No. 45, Jakarta Selatan, Indonesia",
    operationalHours: "Senin – Sabtu, 09.00 – 18.00 WIB",
    instagramUrl: "https://instagram.com",
    githubUrl: "https://github.com"
  },

  // Informasi pembayaran placeholder — silakan ganti sesuai metode pembayaran toko Anda
  paymentMethods: [
    {
      name: "Transfer Bank (Contoh)",
      accountNumber: "1234-5678-9012 (Placeholder)",
      accountHolder: "NusaKlik Store Official",
      note: "Gunakan nomor rekening bisnis Anda pada file config.js sebelum dipublikasikan."
    },
    {
      name: "E-Wallet / Dompet Digital (Contoh)",
      accountNumber: "0812-3456-7890 (Placeholder)",
      accountHolder: "NusaKlik Store",
      note: "Mendukung konfirmasi transfer cepat melalui WhatsApp Admin."
    },
    {
      name: "QRIS Toko (Contoh)",
      accountNumber: "QRIS-NUSAKLIK-DEMO",
      accountHolder: "NusaKlik Store Digital",
      note: "Gambar QRIS dapat dikirimkan langsung oleh admin saat checkout WhatsApp."
    }
  ],

  hero: {
    kicker: "Solusi Belanja Digital Anda",
    headline: "Belanja Produk Digital Lebih Mudah & Praktis",
    subheadline:
      "Temukan template siap pakai, e-book panduan terstruktur, dan perangkat produktivitas berkualitas tinggi dengan proses pemesanan cepat langsung melalui WhatsApp.",
    primaryCta: "Jelajahi Katalog",
    secondaryCta: "Cara Pembelian"
  },

  promo: {
    kicker: "Penawaran Spesial Koleksi Pilihan",
    title: "Dapatkan Produk Digital Favorit Anda Sekarang",
    description:
      "Nikmati potongan harga khusus hingga 35% untuk produk digital pilihan dengan pembaruan gratis dan dokumentasi lengkap berbahasa Indonesia.",
    ctaLabel: "Lihat Produk Promo"
  },

  advantages: [
    {
      icon: "assets/icons/keunggulan-kualitas.svg",
      title: "Produk Berkualitas",
      description:
        "Setiap template, e-book, dan aset desain dikurasi agar langsung siap digunakan untuk kebutuhan profesional."
    },
    {
      icon: "assets/icons/keunggulan-harga.svg",
      title: "Harga Terbaik",
      description:
        "Transparansi harga tanpa biaya langganan tersembunyi, lengkap dengan promo berkala dan produk gratis."
    },
    {
      icon: "assets/icons/keunggulan-support.svg",
      title: "Support Responsif",
      description:
        "Panduan instalasi terstruktur dan bantuan langsung melalui WhatsApp apabila Anda membutuhkan pendampingan."
    },
    {
      icon: "assets/icons/keunggulan-aman.svg",
      title: "Pembayaran Aman",
      description:
        "Alur konfirmasi pesanan yang jelas, ringkasan tagihan transparan, dan pengiriman tautan akses secara langsung."
    }
  ],

  // Testimoni contoh yang dapat diganti sesuai ulasan pelanggan Anda
  testimonials: [
    {
      name: "Dimas Pratama",
      role: "Pemilik Usaha Kuliner",
      organization: "Dapur Nusantara Mandiri",
      quote:
        "Sebelumnya kami menghabiskan dua minggu menyusun pencatatan stok secara manual. Setelah memakai paket dokumen UMKM dari NusaKlik Store, rekap penjualan harian selesai dalam sepuluh menit."
    },
    {
      name: "Rani Kartika",
      role: "Desainer Lepas",
      organization: "Studio Rancang Aksara",
      quote:
        "Struktur template dan sistem komponennya sangat rapi dan mudah disesuaikan. Klien saya bisa langsung meluncurkan etalase produk digital mereka tanpa biaya server bulanan."
    },
    {
      name: "Bagus Wijaya",
      role: "Konsultan Pemasaran",
      organization: "Karya Digital Lokal",
      quote:
        "Proses pemesanan lewat WhatsApp langsung menampilkan rincian item dan total belanja secara otomatis, sehingga konfirmasi pembayaran jauh lebih praktis."
    }
  ],

  categories: [
    {
      id: "semua",
      name: "Semua Produk",
      icon: "assets/icons/icon-semua.svg"
    },
    {
      id: "Template",
      name: "Template",
      icon: "assets/icons/icon-template.svg"
    },
    {
      id: "E-Book",
      name: "E-Book",
      icon: "assets/icons/icon-ebook.svg"
    },
    {
      id: "Dokumen",
      name: "Dokumen",
      icon: "assets/icons/icon-dokumen.svg"
    },
    {
      id: "Desain UI",
      name: "Desain UI",
      icon: "assets/icons/icon-desain.svg"
    },
    {
      id: "Produktivitas",
      name: "Produktivitas",
      icon: "assets/icons/icon-produktivitas.svg"
    }
  ],

  products: [
    {
      id: "template-toko-digital-pro",
      name: "Template Toko Online Profesional",
      category: "Template",
      price: 149000,
      discountPrice: 99000,
      badge: "Promo",
      featured: true,
      isNew: true,
      popular: true,
      image: "assets/images/product-template-web.jpg",
      shortDescription:
        "Template toko online berbasis HTML, CSS, dan JavaScript murni yang ringan, responsif, dan siap dipasang di GitHub Pages.",
      fullDescription:
        "Solusi lengkap untuk membangun etalase produk digital atau fisik tanpa biaya server bulanan. Dilengkapi pencarian cepat, filter kategori, keranjang belanja persisten dengan localStorage, serta integrasi checkout WhatsApp otomatis.",
      specs: {
        "Format File": "HTML5, CSS3, Vanilla JS (Paket ZIP)",
        "Ukuran File": "2,4 MB (Ringan & Teroptimasi)",
        "Kompatibilitas": "Semua Browser Modern, Desktop & Mobile",
        "Lisensi": "Penggunaan Komersial & Pribadi",
        "Pembaruan": "Gratis Pembaruan Berkala",
        "Pengiriman": "Tautan Unduh Instan via WhatsApp / Email"
      }
    },
    {
      id: "ebook-strategi-produk-digital",
      name: "E-Book Strategi Jualan Produk Digital",
      category: "E-Book",
      price: 89000,
      discountPrice: 59000,
      badge: "Promo",
      featured: true,
      isNew: false,
      popular: true,
      image: "assets/images/product-ebook-bisnis.jpg",
      shortDescription:
        "Panduan langkah demi langkah merancang, menentukan harga, dan memasarkan produk digital yang relevan bagi pasar Indonesia.",
      fullDescription:
        "Disusun secara sistematis mulai dari riset kebutuhan pembeli, penyusunan portofolio produk digital, penyusunan halaman penawaran yang meyakinkan, hingga strategi konversi melalui WhatsApp dan media sosial.",
      specs: {
        "Format File": "PDF Resolusi Tinggi & EPUB",
        "Jumlah Halaman": "118 Halaman Terstruktur",
        "Ukuran File": "6,8 MB",
        "Bonus": "Checklist Peluncuran Produk Digital",
        "Bahasa": "Bahasa Indonesia",
        "Pengiriman": "Unduh Instan Setelah Konfirmasi"
      }
    },
    {
      id: "paket-dokumen-bisnis-umkm",
      name: "Paket Dokumen & Pembukuan UMKM",
      category: "Dokumen",
      price: 95000,
      discountPrice: null,
      badge: "",
      featured: true,
      isNew: true,
      popular: false,
      image: "assets/images/product-dokumen-bisnis.jpg",
      shortDescription:
        "Kumpulan template invoice otomatis, laporan arus kas bulanan, daftar inventaris, dan surat penawaran kerja sama resmi.",
      fullDescription:
        "Membantu pemilik usaha kecil dan kreator digital menertibkan administrasi bisnis tanpa perlu menyusun rumus dari nol. Semua kolom sudah dilengkapi formula otomatis dan panduan pengisian.",
      specs: {
        "Format File": "Excel (.xlsx), Google Sheets, & Word (.docx)",
        "Jumlah Template": "14 Dokumen Siap Pakai",
        "Ukuran File": "4,1 MB",
        "Kompatibilitas": "Microsoft Office & Google Workspace",
        "Lisensi": "Penggunaan Bisnis Internal",
        "Pengiriman": "Tautan Akses Google Drive & ZIP"
      }
    },
    {
      id: "kit-identitas-merek-minimalis",
      name: "Starter Kit Identitas Merek Minimalis",
      category: "Desain UI",
      price: 0,
      discountPrice: null,
      badge: "Gratis",
      featured: false,
      isNew: false,
      popular: true,
      image: "assets/images/product-branding-kit.jpg",
      shortDescription:
        "Paket gratis berisi template kartu nama digital, kop surat minimalis, dan panduan palet warna biru korporat siap pakai.",
      fullDescription:
        "Cocok untuk pelaku usaha baru yang ingin tampil rapi dan kredibel sejak hari pertama. Anda dapat mengubah teks, logo, dan detail kontak dalam hitungan menit tanpa perlu keahlian desain tingkat lanjut.",
      specs: {
        "Format File": "SVG, Figma, & PDF Editable",
        "Isi Paket": "6 Aset Identitas Dasar",
        "Ukuran File": "3,2 MB",
        "Lisensi": "Gratis untuk Pribadi & UMKM",
        "Dukungan": "Panduan Penggunaan Singkat",
        "Pengiriman": "Konfirmasi Gratis via WhatsApp"
      }
    },
    {
      id: "planner-manajemen-proyek",
      name: "Dashboard Produktivitas & Pelacak Proyek",
      category: "Produktivitas",
      price: 79000,
      discountPrice: null,
      badge: "",
      featured: false,
      isNew: true,
      popular: true,
      image: "assets/images/product-notion-planner.jpg",
      shortDescription:
        "Sistem manajemen tugas, jadwal konten, target pendapatan bulanan, dan evaluasi proyek dalam satu ruang kerja terpusat.",
      fullDescription:
        "Dirancang untuk kreator solo maupun tim kecil agar seluruh progres pekerjaan, tenggat waktu, dan catatan klien tersimpan rapi dalam satu tampilan kalender dan daftar tugas yang bersih.",
      specs: {
        "Format File": "Template Duplikat Web & Spreadsheet",
        "Modul Tersedia": "Tugas, Kalender, Keuangan, Klien",
        "Ukuran File": "1,8 MB (Panduan + Tautan Duplikasi)",
        "Kompatibilitas": "Desktop, Tablet, & Smartphone",
        "Lisensi": "Penggunaan Pribadi & Tim",
        "Pengiriman": "Tautan Instan via WhatsApp"
      }
    },
    {
      id: "ui-component-system-navy",
      name: "Sistem Komponen UI Web — Edisi Navy",
      category: "Desain UI",
      price: 169000,
      discountPrice: 119000,
      badge: "Promo",
      featured: false,
      isNew: true,
      popular: false,
      image: "assets/images/product-ui-kit.jpg",
      shortDescription:
        "Lebih dari 60 komponen antarmuka modern (kartu produk, formulir, tabel, navigasi, modal) dalam gaya minimalis profesional.",
      fullDescription:
        "Percepat proses perancangan antarmuka situs web dan aplikasi bisnis Anda dengan komponen modular yang konsisten dalam jarak, tipografi, serta hierarki warna navy dan biru profesional.",
      specs: {
        "Format File": "Figma (.fig) & Potongan HTML/CSS",
        "Jumlah Komponen": "64+ Komponen & 8 Tata Letak Halaman",
        "Ukuran File": "11,5 MB",
        "Kompatibilitas": "Figma & Browser Modern",
        "Lisensi": "Komersial Tak Terbatas untuk Proyek Klien",
        "Pengiriman": "Unduh Instan Setelah Pembayaran"
      }
    }
  ]
};
