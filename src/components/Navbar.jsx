'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [
  ['Contoh Portfolio', '/#portfolio'],
  ['Kenapa Kami', '/#keunggulan'],
  ['Paket', '/#paket'],
  ['Cara Order', '/#cara-order'],
  ['FAQ', '/#faq'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">P</span><span>Port<span className="brand-blue">Era</span></span>
        </Link>
        <button className="menu-toggle" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <div className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="nav-cta" href="/pemesanan" onClick={() => setOpen(false)}>Pesan Sekarang <ArrowUpRight size={15}/></Link>
        </div>
      </nav>
    </header>
  );
}
