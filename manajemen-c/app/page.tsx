"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header Portal */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_Indonesia.svg" alt="Bendera" style={{ width: '40px', marginBottom: '10px' }} />
        <h1 style={{ fontSize: '2.5rem', color: '#4ade80', margin: 0 }}>PORTAL KELAS C</h1>
        <p style={{ opacity: 0.8 }}>Agroteknologi - UNMA</p>
      </div>

      {/* Grid Menu - Sekarang 5 Menu */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', maxWidth: '1000px' }}>
        
        <Link href="/materi" style={linkStyle}><div style={cardStyle}><h3>📚 MATERI</h3></div></Link>
        <Link href="/izin" style={linkStyle}><div style={cardStyle}><h3>📝 IZIN</h3></div></Link>
        <Link href="/kumpul-tugas" style={linkStyle}><div style={cardStyle}><h3>📤 KUMPUL TUGAS</h3></div></Link>
        
        {/* MENU KE-5 YANG BARU */}
        <Link href="/tugas" style={linkStyle}>
          <div style={{ ...cardStyle, border: '2px solid #f59e0b' }}>
            <h3 style={{ color: '#f59e0b' }}>📌 INFO TUGAS</h3>
          </div>
        </Link>

        <Link href="/admin-tugas" style={linkStyle}><div style={cardStyle}><h3>🔐 ADMIN</h3></div></Link>
      </div>

    </div>
  );
}

const linkStyle = { textDecoration: 'none', color: 'inherit' };
const cardStyle = { background: '#162217', padding: '30px', borderRadius: '20px', textAlign: 'center' as const, border: '1px solid #2d3f2e', cursor: 'pointer' };