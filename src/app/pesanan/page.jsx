export default async function PesananPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || 'pending';
  const orderId = params?.order_id || '';

  const content = {
    success: { title: 'Pembayaran berhasil diproses', description: 'Midtrans melaporkan pembayaran berhasil. Simpan nomor pesanan ini untuk referensi. Status akhir pesanan tetap perlu disinkronkan melalui notifikasi server Midtrans.' },
    pending: { title: 'Menunggu pembayaran', description: 'Transaksi sudah dibuat, tetapi pembayaran masih menunggu penyelesaian. Ikuti instruksi pada metode pembayaran yang kamu pilih.' },
    closed: { title: 'Popup pembayaran ditutup', description: 'Kamu menutup halaman pembayaran sebelum menyelesaikan transaksi. Pesanan belum dianggap lunas.' },
  };
  const current = content[status] || content.pending;

  return (
    <main style={{maxWidth: 720, margin: '80px auto', padding: '32px 24px', textAlign: 'center', border: '1px solid #e5eaf0', borderRadius: 16, background: '#fff'}}>
      <div style={{fontSize: 42, marginBottom: 12}}>{status === 'success' ? '✓' : status === 'pending' ? '◷' : '!'}</div>
      <h1 style={{fontSize: 25, color: '#172b4d', marginBottom: 10}}>{current.title}</h1>
      <p style={{color: '#64748b', lineHeight: 1.7}}>{current.description}</p>
      {orderId && <p style={{marginTop: 20, color: '#172b4d'}}><strong>Order ID:</strong> {orderId}</p>}
      <a href="/" style={{display: 'inline-block', marginTop: 24, padding: '11px 20px', borderRadius: 7, background: '#0861e9', color: '#fff', textDecoration: 'none', fontWeight: 600}}>Kembali ke Beranda</a>
    </main>
  );
}
