'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './pemesanan.css';

const packages = [
  { id: 'pitch', name: 'PITCH DECK', title: 'Slide Presentasi', description: '10 slide visual elegan format 16:9 PDF & PPTX siap kirim magang.', amount: 100000, price: 'Rp100.000', note: 'sekali bayar' },
  { id: 'website', name: 'WEBSITE LIVE', title: 'Website Portfolio', description: '1 halaman responsif live URL, subdomain personal + fast-load hosting.', amount: 200000, price: 'Rp200.000', note: 'termasuk hosting', popular: true },
  { id: 'bundle', name: 'BUNDLE LENGKAP', title: 'Deck + Website', description: 'Solusi dual-format 360° terlengkap. Presentasi plus web interaktif.', amount: 250000, price: 'Rp250.000', oldPrice: 'Rp300.000', note: 'hemat Rp50.000' },
];
const industries = ['Tech & Product (PM, UX, Dev)', 'Data Science & AI Analytics', 'Management Consulting (MBB/Big4)', 'Creative, Brand & Art Direction', 'Banking, Finance & Investment', 'Lainnya / Lintas Bidang'];
const styles = [
  { id: 'corporate', name: 'Corporate Enterprise', description: 'Gaya SAP, McKinsey, & Big 4. Rapi, terstruktur, berbasis data matriks metrik kuantitatif.' },
  { id: 'modern', name: 'Modern Tech & Startup', description: 'Nuansa Silicon Valley & Unicorn. Tipografi bold, micro-interaction visual, dan app showcase.' },
  { id: 'creative', name: 'Creative Minimalist', description: 'Gaya studio desain & agensi global. Lapang, editorial, dan berfokus pada hasil karya visual.' },
  { id: 'academic', name: 'Academic & Research', description: 'Khusus beasiswa master (LPDP/Chevening), publikasi ilmiah, riset laboratorium, dan data.' },
];
const palettes = [
  { id: 'navy', name: 'Royal Navy & Ocean Blue', description: 'PortEra Classic • Direkomendasikan', colors: ['#101b35', '#2563eb', '#e2e8f0'] },
  { id: 'emerald', name: 'Emerald & Deep Teal', description: 'Segar, Finansial & ESG/Sustainability', colors: ['#00866c', '#13b8a6', '#d1fae5'] },
  { id: 'slate', name: 'Slate Dark Monochrome', description: 'Elegan, Modern, Architecture & Dev', colors: ['#111827', '#475569', '#e2e8f0'] },
  { id: 'crimson', name: 'Crimson & Warm Amber', description: 'Bold, Dinamis, Business Leadership', colors: ['#b0123b', '#e58a00', '#ffe4e6'] },
];

const addons = [
  { id: 'express', name: 'Ekspres 24 Jam (Fast-track)', amount: 30000, price: '+Rp30.000' },
  { id: 'ats', name: 'Review CV ATS-Friendly', amount: 20000, price: '+Rp20.000' },
];

const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace('IDR', 'Rp').trim();

function SectionTitle({ letter, title, description, extra }) {
  return <div className="brief-section-heading"><span className="brief-letter">{letter}</span><div className="brief-heading-copy"><h2>{title}</h2><p>{description}</p></div>{extra && <span className="brief-heading-extra">{extra}</span>}</div>;
}

export default function PemesananPage() {
  const router = useRouter();
  const [paymentError, setPaymentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState({ packageId: 'website', addons: [], visualStyle: 'corporate', palette: 'navy', industry: industries[0], language: 'id', graduation: 'fresh' });
  const waNumber =
  process.env.NEXT_PUBLIC_PORTERA_WHATSAPP_NUMBER || '6281226863661';

const waText = encodeURIComponent(
  'Halo tim PortEra, saya ingin bertanya mengenai layanan portfolio.'
);
  const selectedPackage = packages.find((pkg) => pkg.id === order.packageId) ?? packages[1];
  const selectedStyle = styles.find((style) => style.id === order.visualStyle) ?? styles[0];
  const selectedPalette = palettes.find((palette) => palette.id === order.palette) ?? palettes[0];
  const selectedGraduation = { fresh: 'Fresh Graduate', active: 'Mahasiswa Aktif', final: 'Mahasiswa Tingkat Akhir', other: 'Lainnya' }[order.graduation];
  const selectedAddons = addons.filter((addon) => order.addons.includes(addon.id));
  const addonTotal = selectedAddons.reduce((total, addon) => total + addon.amount, 0);
  const total = selectedPackage.amount + addonTotal;

  const toggleAddon = (addonId) => {
    setOrder((current) => ({
      ...current,
      addons: current.addons.includes(addonId)
        ? current.addons.filter((id) => id !== addonId)
        : [...current.addons, addonId],
    }));
  };

  const handleContinueToCheckout = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setPaymentError('');
    const formData = new FormData(event.currentTarget);

    const orderData = {
      packageId: order.packageId,
      addons: order.addons,
      customer: {
        fullname: String(formData.get('fullname') || '').trim(),
        whatsapp: String(formData.get('whatsapp') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        university: String(formData.get('university') || '').trim(),
        major: String(formData.get('major') || '').trim(),
      },
      brief: {
        graduation: order.graduation,
        industry: order.industry,
        language: order.language,
        visualStyle: order.visualStyle,
        palette: order.palette,
        cloudLink: String(formData.get('cloudLink') || '').trim(),
      },
      uploadedFiles: Array.from(formData.getAll('documents') || [])
        .filter((file) => file && file.name)
        .map((file) => ({ name: file.name, size: file.size })),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_PORTERA_API_URL;
      if (!apiUrl) throw new Error('URL API PortEra belum diatur di .env.local.');
      const response = await fetch(`${apiUrl}/create-order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.order_id) {
        throw new Error(data.message || 'Gagal menyimpan pesanan.');
      }
      router.push(`/checkout?order_id=${encodeURIComponent(data.order_id)}`);
    } catch (error) {
      console.error('Create order error:', error);
      setPaymentError(error.message || 'Pesanan gagal disimpan. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="order-breadcrumb"><Link href="/">Beranda</Link><span>›</span><strong>Formulir Brief Mahasiswa</strong></div>
        <div className="order-page-heading">
          <div><h1>Detail Pemesanan &amp; Brief Desain</h1><p>Lengkapi preferensi dan materi brief untuk kurator PortEra agar hasil portfolio sesuai dengan target karier dan magang impianmu.</p></div>
          <div className="brief-progress"><div className="progress-step done"><span>✓</span><b>Pilih Paket</b></div><i/><div className="progress-step active"><span>2</span><b>Detail Brief</b><small>SEDANG DIISI</small></div><i/><div className="progress-step"><span>3</span><b>Pembayaran</b></div></div>
        </div>

        <form className="order-layout" onSubmit={handleContinueToCheckout}>
          <div className="order-form-content">
            <section className="brief-section">
              <SectionTitle letter="A" title="Konfirmasi Paket PortEra" description="Ubah tipe format pengerjaan jika diperlukan sebelum tahap kurasi dimulai." extra="Langkah Wajib" />
              <div className="brief-package-grid">{packages.map(pkg => <label className="brief-package-card" key={pkg.id}>{pkg.popular && <span className="brief-popular">PALING POPULER</span>}<input type="radio" name="package" value={pkg.id} checked={order.packageId === pkg.id} onChange={() => setOrder(current => ({ ...current, packageId: pkg.id }))}/><span className="brief-package-name">{pkg.name}</span><strong>{pkg.title}</strong><p>{pkg.description}</p><div className="brief-price"><b>{pkg.price}</b>{pkg.oldPrice && <del>{pkg.oldPrice}</del>}</div><small>{pkg.note}</small></label>)}</div>
              <div className="brief-addons"><h3>PILIHAN TAMBAHAN REKOMENDASI (OPSIONAL)</h3><div className="brief-addon-grid"><label><input type="checkbox" name="addons" value="express" checked={order.addons.includes('express')} onChange={() => toggleAddon('express')}/><span><b>Ekspres 24 Jam (Fast-track) <em>+Rp30.000</em></b><small>Prioritas antrean pengerjaan kilat 1×24 jam bergaransi siap kirim.</small></span></label><label><input type="checkbox" name="addons" value="ats" checked={order.addons.includes('ats')} onChange={() => toggleAddon('ats')}/><span><b>Review CV ATS-Friendly <em>+Rp20.000</em></b><small>Pemeriksaan mendalam struktur kata kunci dan format screening HRD.</small></span></label></div></div>
            </section>

            <section className="brief-section">
              <SectionTitle letter="B" title="Profil Mahasiswa & Karir Sasaran" description="Data ini akan menjadi baseline personal branding pada header portfolio."/>
              <div className="brief-fields">
                <label>Nama Lengkap &amp; Gelar (jika ada) *<input name="fullname" placeholder="Nama lengkap kamu" required/></label>
                <label>Nomor WhatsApp Aktif *<input name="whatsapp" type="tel" placeholder="+62 812-3456-7890" required/></label>
                <label>Email Kampus / Email Profesional *<input name="email" type="email" placeholder="nama@email.com" required/></label>
                <label>Universitas / Institusi Akademik *<input name="university" placeholder="Nama universitas" required/></label>
                <label>Program Studi / Jurusan *<input name="major" placeholder="Contoh: Sistem Informasi" required/></label>
                <label>Status / Estimasi Tahun Lulus *<select name="graduation" value={order.graduation} onChange={event => setOrder(current => ({ ...current, graduation: event.target.value }))} required><option value="fresh">Fresh Graduate (Tahun 2024–2025)</option><option value="active">Mahasiswa Aktif</option><option value="final">Mahasiswa Tingkat Akhir</option><option value="other">Lainnya</option></select></label>
              </div>
              <div className="brief-industry"><b>Target Industri &amp; Peran Pekerjaan Sasaran</b><p>Pilih kategori utama agar tone of voice studi kasus disesuaikan:</p><div className="brief-choice-grid">{industries.map((item) => <label key={item}><input type="radio" name="industry" value={item} checked={order.industry === item} onChange={() => setOrder(current => ({ ...current, industry: item }))}/>{item}</label>)}</div></div>
              <div className="brief-language"><div><b>Bahasa Pengantar Portfolio</b><p>Kurator akan menyesuaikan terminologi industri dan copy-editing.</p></div><label><input type="radio" name="language" value="id" checked={order.language === 'id'} onChange={() => setOrder(current => ({ ...current, language: 'id' }))}/> Bahasa Indonesia</label><label><input type="radio" name="language" value="en" checked={order.language === 'en'} onChange={() => setOrder(current => ({ ...current, language: 'en' }))}/> Bahasa Inggris (English)</label></div>
            </section>

            <section className="brief-section">
              <SectionTitle letter="C" title="Upload CV / Resume & Draft Materi" description="Materi Anda akan diolah menjadi studi kasus dengan struktur STAR Method."/>
              <label className="brief-upload"><input type="file" name="documents" accept=".pdf,.doc,.docx,.zip,.rar" multiple/><span className="brief-upload-icon">⇧</span><b>Klik untuk pilih file atau tarik &amp; letakkan di sini</b><p>Unggah CV/Resume terkini, sertifikat, atau draft rangkuman kegiatan (PDF, DOCX, ZIP maks 25MB)</p><small>.PDF　 .DOCX　 .ZIP / .RAR</small></label>
              <label className="brief-cloud">Atau cantumkan Tautan Cloud (Google Drive / Notion / GitHub / Figma)<input type="url" name="cloudLink" placeholder="https://drive.google.com/drive/folders/..."/><small>Pastikan akses tautan diatur ke “Anyone with the link can view” agar tim desainer dapat langsung menganalisis berkas.</small></label>
            </section>

            <section className="brief-section">
              <SectionTitle letter="D" title="Style & Karakter Visual Portfolio" description="Pilih gaya tata letak tipografi dan estetika yang selaras dengan persona Anda." extra="Tersedia 4 Preset"/>
              <div className="brief-style-grid">{styles.map((style, i) => <label className="brief-style-card" key={style.id}><input type="radio" name="visualStyle" value={style.id} checked={order.visualStyle === style.id} onChange={() => setOrder(current => ({ ...current, visualStyle: style.id }))}/><span className="brief-style-status">{i === 0 ? 'DIREKOMENDASIKAN' : `PRESET 0${i + 1}`}</span><b>{style.name}</b><p>{style.description}</p></label>)}</div>
            </section>

            <section className="brief-section">
              <SectionTitle letter="E" title="Palet Warna Utama" description="Warna dominan yang menjadi identitas personal dokumen Anda."/>
              <div className="brief-palette-grid">{palettes.map((palette, i) => <label className="brief-palette-card" key={palette.id}><input type="radio" name="palette" value={palette.id} checked={order.palette === palette.id} onChange={() => setOrder(current => ({ ...current, palette: palette.id }))}/><span className="brief-swatches">{palette.colors.map(color => <i key={color} style={{backgroundColor: color}}/>)}</span><span><b>{palette.name}</b><small>{palette.description}</small></span></label>)}</div>
            </section>
            <div className="brief-form-actions"><Link href="/#paket" className="brief-back">← Kembali ke Paket</Link><button type="submit" disabled={submitting} className="brief-submit" >{submitting ? 'Menyimpan Pesanan...' : 'Lanjut ke Checkout →'}</button></div>
          </div>

          <aside className="order-sidebar">
            <div className="brief-summary">
              <div className="brief-summary-title"><div><h2>RINGKASAN PESANAN</h2><b>PortEra Checkout</b></div><span>♧</span></div>
              <div className="brief-summary-product"><span>◎</span><div><b>{selectedPackage.title}</b><small>{selectedPackage.description}</small><strong>{formatRupiah(selectedPackage.amount)}</strong></div></div>
              <div className="brief-summary-row"><span>Biaya Paket Utama:</span><b>{formatRupiah(selectedPackage.amount)}</b></div>
              {selectedAddons.map(addon => <div className="brief-summary-row" key={addon.id}><span>{addon.name}:</span><b>{formatRupiah(addon.amount)}</b></div>)}
              <div className="brief-summary-row"><span>Template Vibe:</span><b>{selectedStyle.name}</b></div>
              <div className="brief-summary-row"><span>Palet Warna Terpilih:</span><b>{selectedPalette.name}</b></div>
              <div className="brief-summary-row"><span>Target Industri:</span><b>{order.industry}</b></div>
              <div className="brief-summary-row"><span>Bahasa Portfolio:</span><b>{order.language === 'id' ? 'Indonesia' : 'English'}</b></div>
              <div className="brief-summary-row"><span>Status Akademik:</span><b>{selectedGraduation}</b></div>
              <div className="brief-summary-row"><span>Kurasi Editorial &amp; Penyesuaian:</span><b>Gratis (Rp0)</b></div>
              <div className="brief-summary-row"><span>Revisi Desain (2x Putaran):</span><b>Termasuk</b></div>
              <div className="brief-summary-total"><b>TOTAL PEMBAYARAN</b><strong>{formatRupiah(total)}</strong></div><small className="brief-tax">Termasuk PPN &amp; lisensi font</small>
              <p className="brief-delivery">◷ Estimasi Pengerjaan: <b>{order.addons.includes('express') ? '1×24 Jam' : '2–4 Hari Kerja'}</b></p>
              {paymentError && <p className="brief-payment-error" role="alert">{paymentError}</p>}
              <button type="submit" disabled={submitting} className="brief-checkout" ><>{submitting ? 'Menyimpan Pesanan...' : <>Lanjut ke Checkout <b>({formatRupiah(total)})</b></>}</><span>→</span></button>
              <button type="button" className="brief-save">♧ Simpan Sebagai Draft</button>
            </div>
            <div className="brief-sidebar-info"><span>♢</span><div><b>Jaminan Kerahasiaan PortEra</b><p>Seluruh resume, data proyek akademik, dan identitas kontak Anda dilindungi secara rahasia di bawah komitmen NDA PortEra.</p></div></div>
            <div className="brief-sidebar-info"><span>◉</span><div><b>Ada Pertanyaan Brief?</b><p>Konsultasikan kebutuhan portfolio langsung ke tim desainer.</p><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">Chat Tim Desainer via WhatsApp ↗</a></div></div>
          </aside>
        </form>
      </div>
      <a
  className="checkout-whatsapp-float"
  href={`https://wa.me/${waNumber}?text=${waText}`}
  target="_blank"
  rel="noreferrer"
>
  <span>▣</span> Pesan via WhatsApp
</a>
    </div>
  );
}
