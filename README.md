# PortEra — Next.js App Router

Project website PortEra menggunakan Next.js App Router, React, JavaScript, dan CSS biasa.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Struktur halaman

- `/` — landing page satu halaman. Navbar menggunakan anchor `/#portfolio`, `/#keunggulan`, `/#paket`, `/#cara-order`, dan `/#faq` untuk scroll ke section terkait.
- `/pemesanan` — halaman formulir brief mahasiswa lengkap dengan bagian A–E dan ringkasan checkout.

## Struktur folder utama

```text
src/
├── app/
│   ├── page.jsx
│   ├── layout.jsx
│   ├── globals.css
│   └── pemesanan/
│       ├── page.jsx
│       └── pemesanan.css
└── components/
    ├── Navbar.jsx
    ├── Footer.jsx
    ├── FAQList.jsx
    └── SectionHeading.jsx
```

## Catatan

- Routing menggunakan Next.js App Router; tidak menggunakan `react-router-dom`.
- Landing page berada dalam satu `src/app/page.jsx`.
- Formulir pemesanan berada di route `/pemesanan`.
- Ringkasan harga masih contoh statis dan belum terhubung ke payment gateway/backend.
- Upload file masih berupa input frontend; backend perlu ditambahkan untuk menyimpan file.
- Ganti nomor WhatsApp placeholder dengan nomor bisnis PortEra.
