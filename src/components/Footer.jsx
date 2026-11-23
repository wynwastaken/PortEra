import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link href="/" className="brand"><span className="brand-mark">P</span><span>Port<span className="brand-blue">Era</span></span></Link>
          <p>Layanan pembuatan portfolio profesional untuk mahasiswa, siap bersaing di magang, beasiswa, dan program global.</p>
        </div>
        <div><h4>Quick Links</h4><a href="/#portfolio">Contoh Portfolio</a><a href="/#keunggulan">Kenapa Kami</a><a href="/#paket">Paket</a><a href="/#cara-order">Cara Order</a><a href="/#faq">FAQ</a></div>
        <div><h4>Layanan</h4><a href="/#paket">Pitch Deck Portfolio</a><a href="/#paket">Website Portfolio</a><a href="/#paket">Bundle Deck + Website</a></div>
        <div><h4>Kontak & Media Sosial</h4><span>WhatsApp</span><strong>+62 81226863661</strong><span>Instagram</span><strong>@portera.id</strong><span>Jam Kerja</span><strong>Senin – Sabtu (09.00 – 20.00 WIB)</strong></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 PortEra Enterprise Services. Hak cipta dilindungi undang-undang.</span><div><a href="/#faq">Kebijakan Privasi</a><a href="/#faq">Syarat & Ketentuan</a></div></div>
    </footer>
  );
}
