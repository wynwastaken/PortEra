'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const items = [
  ['Berapa lama estimasi pengerjaan portfolio?', 'Estimasi pengerjaan sekitar 3–7 hari kerja, tergantung paket dan kelengkapan materi yang kamu kirimkan.'],
  ['Apa saja yang perlu saya siapkan sebelum order?', 'Siapkan CV, pengalaman organisasi atau kerja, daftar proyek, sertifikat, foto profesional, dan referensi desain jika ada.'],
  ['Berapa kali jumlah revisi yang saya dapatkan?', 'Setiap paket memiliki jatah revisi. Kami akan menyampaikan jumlah revisi secara transparan sebelum pengerjaan dimulai.'],
  ['Format file apa saja yang akan saya terima?', 'Untuk pitch deck, file final tersedia dalam PDF dan format presentasi yang dapat diedit. Untuk website, kamu akan menerima tautan website dan source code sesuai paket.'],
  ['Metode pembayaran apa saja yang didukung?', 'Pembayaran dapat dilakukan melalui transfer bank dan QRIS. Detail pembayaran akan dikirimkan setelah paket dikonfirmasi.'],
];

export default function FAQList() {
  const [active, setActive] = useState(0);
  return <div className="faq-list">{items.map(([question, answer], index) => <div className={`faq-item ${active === index ? 'faq-active' : ''}`} key={question}><button onClick={() => setActive(active === index ? -1 : index)} aria-expanded={active === index}><span>{question}</span><ChevronDown size={18}/></button>{active === index && <p>{answer}</p>}</div>)}</div>;
}
