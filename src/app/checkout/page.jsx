'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './checkout.css';

const packages = {
  pitch: { name: 'Paket Pitch Deck Portfolio', description: 'Presentasi profesional untuk melamar kerja dan magang.', amount: 100000, features: ['10 slide presentasi profesional format 16:9', 'Desain visual konsisten dan mudah dipindai', 'File final PDF dan PPTX siap digunakan'] },
  website: { name: 'Paket Website Portfolio', description: 'Situs web personal interaktif untuk melamar kerja & magang', amount: 200000, features: ['1 Halaman Web Responsif (Desktop, Tablet & Mobile)', '2x Sesi Revisi Detail & Refinement Konten', 'Termasuk Hosting Gratis & Link Live Siap Sebar (Subdomain)'] },
  bundle: { name: 'Bundle Lengkap Deck + Website', description: 'Solusi dual-format untuk presentasi dan portfolio online.', amount: 250000, features: ['Pitch deck profesional dan website portfolio', 'Desain visual konsisten di seluruh media', '2x Sesi Revisi Detail & Refinement Konten', 'Hosting gratis dan link live siap sebar'] },
};
const addons = { express: { name: 'Ekspres 24 Jam (Fast-track)', amount: 30000 }, ats: { name: 'Review CV ATS-Friendly', amount: 20000 } };
const styles = { corporate: 'Corporate Enterprise', modern: 'Modern Tech & Startup', creative: 'Creative Minimalist', academic: 'Academic & Research' };
const palettes = { navy: 'Royal Navy & Ocean Blue', emerald: 'Emerald & Deep Teal', slate: 'Slate Dark Monochrome', crimson: 'Crimson & Warm Amber' };
const graduations = { fresh: 'Fresh Graduate', active: 'Mahasiswa Aktif', final: 'Mahasiswa Tingkat Akhir', other: 'Lainnya' };
const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n).replace('IDR', 'Rp').trim();

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [voucher, setVoucher] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = new URLSearchParams(window.location.search).get('order_id');
      if (!orderId) {
        setPaymentError('Order ID tidak ditemukan. Silakan kembali ke formulir pemesanan.');
        setOrderLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_PORTERA_API_URL;
        if (!apiUrl) throw new Error('URL API PortEra belum diatur di .env.local.');
        const response = await fetch(`${apiUrl}/get-order.php?order_id=${encodeURIComponent(orderId)}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.order) {
          throw new Error(data.message || 'Pesanan tidak ditemukan.');
        }
        setOrder(data.order);
      } catch (error) {
        console.error('Checkout data error:', error);
        setPaymentError(error.message || 'Gagal mengambil data pesanan.');
      } finally {
        setOrderLoading(false);
      }
    };
    loadOrder();
  }, []);

  const selectedPackage = order ? packages[order.packageId] : null;
  const selectedAddons = useMemo(() => (order?.addons || []).map((id) => addons[id]).filter(Boolean), [order]);
  const subtotal = selectedPackage ? selectedPackage.amount + selectedAddons.reduce((sum, item) => sum + item.amount, 0) : 0;
  const total = subtotal;

  const applyVoucher = () => {
    if (voucher.trim().toUpperCase() === 'DISKONMHS') {
      setVoucherApplied(true);
      setVoucherMessage('Voucher DISKONMHS aktif: Bonus review CV & Portfolio gratis senilai Rp75.000!');
    } else {
      setVoucherApplied(false);
      setVoucherMessage(voucher.trim() ? 'Kode voucher tidak valid.' : 'Masukkan kode voucher terlebih dahulu.');
    }
  };

  const paymentSnap = async () => {
    if (loading || !order) return;
    setLoading(true);
    setPaymentError('');
    try {
      const tokenUrl = process.env.NEXT_PUBLIC_MIDTRANS_TOKEN_URL;
      if (!tokenUrl) throw new Error('URL token.php belum diatur di .env.local.');
      if (!window.snap) throw new Error('Midtrans Snap belum termuat. Periksa Client Key dan koneksi internet.');
      const body = new URLSearchParams({ order_id: order.order_id });
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body,
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.token) throw new Error(data.message || 'Gagal membuat token pembayaran Midtrans.');
      window.snap.pay(data.token, {
        onSuccess: () => router.push(`/pesanan?status=success&order_id=${encodeURIComponent(data.order_id)}`),
        onPending: () => router.push(`/pesanan?status=pending&order_id=${encodeURIComponent(data.order_id)}`),
        onError: () => setPaymentError('Pembayaran gagal diproses. Silakan coba kembali.'),
        onClose: () => setPaymentError('Popup pembayaran ditutup. Kamu masih bisa mencoba lagi dengan menekan Bayar Sekarang.'),
      });
    } catch (error) {
      console.error('Midtrans payment error:', error);
      setPaymentError(error.message || 'Terjadi kesalahan saat memulai pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  const waNumber = process.env.NEXT_PUBLIC_PORTERA_WHATSAPP_NUMBER || '6281226863661';
  const waText = encodeURIComponent(order?.customer?.fullname ? `Halo tim PortEra, saya ${order.customer.fullname}. Saya ingin bertanya tentang pesanan portfolio saya.` : 'Halo tim PortEra, saya ingin bertanya tentang layanan portfolio.');

  if (orderLoading) return <main className="checkout-page"><div className="checkout-empty"><h1>Memuat pesanan...</h1><p>Sedang mengambil detail pesanan dari database.</p></div></main>;

  if (!order || !selectedPackage) return (
    <main className="checkout-page">
      <div className="checkout-empty"><h1>Data checkout belum tersedia</h1><p>Silakan lengkapi formulir brief terlebih dahulu sebelum melanjutkan ke checkout.</p><Link href="/pemesanan">Kembali ke Formulir Pemesanan</Link></div>
      <a className="checkout-whatsapp-float" href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer"><span>▣</span> Pesan via WhatsApp</a>
    </main>
  );

  return (
    <main className="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-breadcrumb"><Link href="/">Beranda</Link><span>›</span><Link href="/pemesanan">Formulir Brief</Link><span>›</span><strong>Checkout</strong></div>
        <header className="checkout-header">
          <div><span className="checkout-eyebrow">PORTERA CHECKOUT</span><h1>Konfirmasi Pesanan</h1><p>Periksa kembali detail pesanan dan data kontak sebelum melanjutkan pembayaran.</p></div>
          <div className="checkout-step"><span>✓</span> Brief selesai <i/><b>2</b> Checkout <i/><span>3</span> Pembayaran</div>
        </header>
        <div className="checkout-grid">
          <section className="checkout-main-column">
            <article className="checkout-panel">
              <div className="checkout-panel-heading"><span className="checkout-panel-icon">♙</span><div><h2>Data Pemesan (Mahasiswa)</h2><p>Invoice resmi dan link hasil pengerjaan dikirimkan ke kontak ini.</p></div><strong>WAJIB DIISI</strong></div>
              <div className="customer-detail-grid">
                <div className="customer-detail full"><small>Nama Lengkap</small><strong>♙　{order.customer?.fullname || '-'}</strong></div>
                <div className="customer-detail"><small>Email Aktif</small><strong>＠　{order.customer?.email || '-'}</strong></div>
                <div className="customer-detail"><small>Nomor WhatsApp</small><strong>♧　{order.customer?.whatsapp || '-'}</strong></div>
                <div className="customer-detail full"><small>Universitas &amp; Program Studi</small><strong>♧　{[order.customer?.university, order.customer?.major].filter(Boolean).join(' - ') || '-'}</strong></div>
              </div>
              <button className="checkout-edit-link" type="button" onClick={() => router.push('/pemesanan')}>Ubah data brief</button>
            </article>
            <article className="checkout-panel">
              <div className="checkout-panel-heading"><span className="checkout-panel-icon">▤</span><div><h2>Ringkasan Brief Portfolio</h2><p>Preferensi desain yang kamu pilih pada formulir.</p></div></div>
              <div className="brief-review-grid">
                <div><small>Target Industri</small><strong>{order.brief?.industry || '-'}</strong></div>
                <div><small>Bahasa Portfolio</small><strong>{order.brief?.language === 'en' ? 'Bahasa Inggris' : 'Bahasa Indonesia'}</strong></div>
                <div><small>Template Vibe</small><strong>{styles[order.brief?.visualStyle] || '-'}</strong></div>
                <div><small>Palet Warna</small><strong>{palettes[order.brief?.palette] || '-'}</strong></div>
                <div><small>Status Akademik</small><strong>{graduations[order.brief?.graduation] || '-'}</strong></div>
                <div><small>Tautan Materi</small><strong className="break-anywhere">{order.brief?.cloudLink || 'Belum dicantumkan'}</strong></div>
              </div>
              {order.uploadedFiles?.length > 0 && <div className="checkout-upload-list"><small>Nama file terpilih (file belum diunggah ke server)</small>{order.uploadedFiles.map((file, i) => <span key={`${file.name}-${i}`}>▤ {file.name}</span>)}</div>}
            </article>
          </section>
          <aside className="checkout-side-column">
            <section className="checkout-order-card">
              <div className="checkout-order-title"><div><span>▣</span><div><small>Ringkasan Pesanan</small><strong>Layanan Kurasi PortEra</strong><small className="checkout-order-reference">Order ID: {order.order_id}</small></div></div><b>Paket #1 Terpopuler</b></div>
              <div className="checkout-product"><div><strong>{selectedPackage.name}</strong><p>{selectedPackage.description}</p></div><b>{rupiah(selectedPackage.amount)}</b></div>
              <ul className="checkout-features">
                {selectedPackage.features.map((feature) => <li key={feature}>{feature}</li>)}
                {selectedAddons.map((addon) => <li key={addon.name}>{addon.name} — {rupiah(addon.amount)}</li>)}
                <li>Waktu Pengerjaan Kilat: <b>{order.addons?.includes('express') ? '1×24 Jam' : '2 - 4 Hari Kerja'}</b></li>
                <li>Jaminan Kerahasiaan Brief &amp; Data Mahasiswa 100%</li>
              </ul>
              <div className="checkout-voucher"><label htmlFor="voucher">Voucher / Promo Mahasiswa</label><div className="checkout-voucher-control"><input id="voucher" value={voucher} onChange={(e) => { setVoucher(e.target.value); setVoucherMessage(''); }} placeholder="Masukkan kode voucher"/><button type="button" onClick={applyVoucher}>Terapkan</button></div>{voucherMessage && <p className={voucherApplied ? 'voucher-success' : 'voucher-error'}>{voucherApplied ? '✓ ' : '! '}{voucherMessage}</p>}</div>
              <div className="checkout-price-lines"><div><span>Subtotal Layanan</span><b>{rupiah(subtotal)}</b></div><div><span>Biaya Payment Gateway <small>Gratis</small></span><b className="price-free">{rupiah(0)}</b></div><div><span>Diskon Mahasiswa PortEra</span><b className="price-free">-{rupiah(0)}</b></div></div>
              <div className="checkout-total"><div><strong>Total Pembayaran</strong><b>{rupiah(total)}</b></div><small>Termasuk PPN &amp; Jaminan Pengerjaan</small><small className="checkout-currency">Mata uang IDR (Rupiah)</small></div>
              {paymentError && <p className="checkout-payment-error" role="alert">{paymentError}</p>}
              <button className="checkout-pay-button" type="button" onClick={paymentSnap} disabled={loading}><span>♙</span>{loading ? 'Menyiapkan pembayaran...' : <>Bayar Sekarang — {rupiah(total)}</>}</button>
            </section>
            <section className="checkout-trust-card"><div className="checkout-trust-items"><span>♧<small>256-Bit SSL Encrypted</small></span><span>▤<small>Mitra Bank Indonesia</small></span><span>✧<small>QRIS Regulated Partner</small></span></div><p>Mengalami kendala saat bayar?</p><a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer">Hubungi Tim Billing via WhatsApp ↗</a></section>
          </aside>
        </div>
      </div>
      <a className="checkout-whatsapp-float" href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer"><span>▣</span> Pesan via WhatsApp <i/></a>
    </main>
  );
}
