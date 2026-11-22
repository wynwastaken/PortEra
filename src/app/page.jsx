import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Palette, BookOpenCheck, RefreshCw, Gauge, Check } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import FAQList from '@/components/FAQList';

const benefits = [
  [Palette, 'Desain Profesional', 'Tata letak modern dengan hierarki visual terarah, tipografi bersih, dan palet warna standar industri.', 'ENTERPRISE GRADE'],
  [BookOpenCheck, 'Storytelling yang Kuat', 'Penyusunan narasi STAR (Situation, Task, Action, Result) yang menonjolkan dampak dan kontribusi nyata kamu.', 'STAR METHODOLOGY'],
  [RefreshCw, 'Revisi Sampai Puas', 'Penyesuaian detail konten, copy, dan visual hingga portfolio benar-benar selaras dengan karakter profilmu.', 'QUALITY ASSURANCE'],
  [Gauge, 'Proses Cepat dan Jelas', 'Estimasi waktu terukur (3–7 hari kerja) dengan alur komunikasi WhatsApp yang responsif dan transparan.', '3–7 DAYS SLA'],
];
const steps = [
  ['Pilih paket', 'Tentukan paket pitch deck, website, atau bundle sesuai kebutuhanmu.'],
  ['Isi formulir brief', 'Pilih layanan dan lengkapi profil, target karier, materi, serta preferensi desain.'],
  ['Kirim materi dan brief', 'Unggah CV, draft tulisan, link proyek, atau materi pendukung yang kamu miliki.'],
  ['Terima portfolio-mu', 'Review draft pertama, ajukan revisi, dan terima hasil final siap pakai.'],
];
const reviews = [
  ['AP', 'Arya Pratama', 'Teknik Informatika, Universitas Indonesia', '“Desain pitch deck dari PortEra benar-benar mengubah cara saya mempresentasikan project coding dan UI/UX. Sangat terstruktur, rapi, dan terbukti membantu saya hingga diterima di Apple Developer Academy!”'],
  ['NA', 'Nabila Azzahra', 'Desain Komunikasi Visual, ITB', '“Website portfolionya sangat bersih, responsif di HP, dan recruiter gampang menemukan hasil langsung notice saat sesi interview. Harganya sangat ramah kantong mahasiswa.”'],
  ['DW', 'Dimas Wicaksono', 'Manajemen Bisnis, Universitas Gadjah Mada', '“Sebelumnya bingung merangkum 5 proyek riset dan konsultasi bisnis dalam format singkat. PortEra menyusun narasinya dengan tajam sehingga lolos seleksi magang BUMN prestisius.”'],
];
const samples = [
  { src: '/images/portfolio-dark.png', title: 'Dark Editorial', desc: 'Tampilan monokrom dengan tipografi tegas dan fokus pada personal branding.' },
  { src: '/images/portfolio-minimal.png', title: 'Clean Minimal', desc: 'Layout bersih, grid halus, dan struktur informasi yang mudah dipindai.' },
  { src: '/images/portfolio-showcase.png', title: 'Modern Professional', desc: 'Gaya visual profesional untuk menonjolkan pengalaman dan pencapaian.' },
];
const plans = [
  { name: 'Pitch Deck', price: 'Rp100.000', desc: 'Untuk kamu yang membutuhkan portfolio PDF yang ringkas dan profesional.', features: ['Kurasi konten dan storytelling', 'Desain slide profesional', 'File PDF dan editable', 'Revisi sesuai ketentuan paket'] },
  { name: 'Website Portfolio', price: 'Rp200.000', desc: 'Bangun personal branding online dengan website portfolio responsif.', features: ['Desain website personal', 'Responsive desktop dan mobile', 'Section pengalaman dan proyek', 'Bantuan publikasi website'], featured: true },
  { name: 'Bundle Lengkap', price: 'Rp250.000', desc: 'Paket lengkap untuk konsistensi portfolio online dan dokumen.', features: ['Semua benefit Pitch Deck', 'Semua benefit Website', 'Konsistensi visual lintas media', 'Prioritas koordinasi'] },
];

export default function Home() {
  const waNumber =
  process.env.NEXT_PUBLIC_PORTERA_WHATSAPP_NUMBER || '6281234567890';

const waText = encodeURIComponent(
  'Halo tim PortEra, saya ingin bertanya mengenai layanan portfolio.'
);
 
  return <>
    <section className="hero container" id="home">
      <div className="hero-copy">
        <span className="hero-pill"><i/> JASA PEMBUATAN PORTFOLIO MAHASISWA</span>
        <h1>Portfolio yang Bisa Di-Scan <em>Recruiter</em><br/>Dalam Waktu <span className="highlight">Kurang Dari Semenit!</span></h1>
        <p>Pengalaman dan proyek kuliahmu banyak, tapi susah menceritakannya. Padahal recruiter hanya scan beberapa detik, dan ribuan kandidat lain ikut bersaing. Serahkan ceritamu ke PortEra, kami bantu mahasiswa membuat portfolio yang profesional, rapi, dan siap dikirim untuk magang!</p>
        <Link href="/pemesanan" className="primary-button">Mulai Buat Portfolio <ArrowUpRight size={17}/></Link>
      </div>
      <div className="showcase" aria-label="Contoh desain portfolio">
        <div className="showcase-side side-left"><Image src="/images/portfolio-dark.png" alt="Contoh portfolio dengan desain gelap" fill sizes="(max-width: 700px) 80vw, 24vw"/></div>
        <div className="showcase-main"><Image src="/images/portfolio-showcase.png" alt="Contoh desain website portfolio" fill priority sizes="(max-width: 700px) 90vw, 48vw"/></div>
        <div className="showcase-side side-right"><Image src="/images/portfolio-minimal.png" alt="Contoh portfolio minimalis" fill sizes="(max-width: 700px) 80vw, 24vw"/></div>
      </div>
      <div className="hero-note"><span>01 / PORTFOLIO THAT SPEAKS FOR YOU</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="portfolio-section" id="portfolio"><div className="container">
      <SectionHeading eyebrow="GALERI PORTFOLIO" title="Inspirasi Portfolio Profesional" description="Beberapa referensi gaya visual yang bisa menjadi titik awal portfolio-mu."/>
      <div className="sample-grid">{samples.map(item => <article className="sample-card" key={item.title}><div className="sample-image"><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 100vw, 33vw"/></div><h3>{item.title}</h3><p>{item.desc}</p></article>)}</div>
      <div className="center-cta"><Link className="primary-button" href="/pemesanan">Buat portfolio seperti ini <ArrowUpRight size={16}/></Link></div>
    </div></section>

    <section className="benefits-section" id="keunggulan"><div className="container"><SectionHeading eyebrow="KEUNGGULAN PORTERA" title="Kenapa Mahasiswa Memilih Kami?" description="Kami bukan sekadar pembuat slide, melainkan kurator pencapaian profesional Anda." centered={false}/><div className="benefit-grid">{benefits.map(([Icon, title, desc, tag]) => <article className="benefit-card" key={title}><div className="icon-box"><Icon size={20}/></div><h3>{title}</h3><p>{desc}</p><span>{tag}</span></article>)}</div></div></section>

    <section className="pricing-section" id="paket"><div className="container">
      <SectionHeading eyebrow="PAKET LAYANAN" title="Pilih Cara Terbaik untuk Menampilkan Dirimu" description="Pilih layanan yang sesuai dengan kebutuhan dan tahap kariermu."/>
      <div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>{plan.featured && <span className="popular-tag">PALING POPULER</span>}<h3>{plan.name}</h3><p>{plan.desc}</p><strong className="price">{plan.price}</strong><ul>{plan.features.map(feature => <li key={feature}><Check size={16}/>{feature}</li>)}</ul><Link href="/pemesanan" className={plan.featured ? 'primary-button' : 'outline-button'}>Pilih paket <ArrowUpRight size={16}/></Link></article>)}</div>
      <p className="pricing-note">*Harga dapat disesuaikan dengan kebutuhan, jumlah materi, dan kompleksitas desain.</p>
    </div></section>

    <section className="process-section" id="cara-order"><div className="container"><SectionHeading eyebrow="PROSES KERJA" title="Alur Pemesanan yang Praktis & Terstruktur" description="Hanya butuh 4 langkah mudah dari berkas mentah hingga siap dikirim ke reviewer."/><div className="steps-grid">{steps.map(([title, desc], i) => <article className="step" key={title}><div className="step-number">{i + 1}</div><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="process-cta"><span>Siap meningkatkan kualitas personal branding-mu?</span><Link href="/pemesanan">Isi formulir pemesanan <ArrowRight size={16}/></Link></div></div></section>

    <section className="reviews-section"><div className="container"><SectionHeading eyebrow="KISAH NYATA" title="Cerita Sukses Rekan Mahasiswa" description="Pengalaman nyata mereka yang telah mempercayakan kurasi portfolionya pada PortEra."/><div className="review-grid">{reviews.map(([initials, name, role, quote]) => <article className="review-card" key={name}><div className="stars">★★★★★</div><p className="quote">{quote}</p><div className="review-person"><span>{initials}</span><div><strong>{name}</strong><small>{role}</small></div></div></article>)}</div></div></section>

    <section className="faq-section" id="faq"><div className="container"><SectionHeading eyebrow="PUSAT BANTUAN" title="Pertanyaan yang Sering Diajukan" description="Jawaban transparan untuk menjawab rasa penasaranmu sebelum memulai pemesanan."/><FAQList/><div className="faq-more">Masih punya pertanyaan? <a href="https://wa.me/6280000000000" target="_blank" rel="noreferrer">Hubungi tim kami <ArrowUpRight size={14}/></a></div></div></section>
       <a
  className="checkout-whatsapp-float"
  href={`https://wa.me/${waNumber}?text=${waText}`}
  target="_blank"
  rel="noreferrer"
>
  <span>▣</span> Pesan via WhatsApp
</a>
  </>;
}
