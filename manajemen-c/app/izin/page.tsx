"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Hubungkan ke kunci di .env.local kamu
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function IzinPage() {
  const [nama, setNama] = useState('');
  const [npm, setNpm] = useState('');
  const [ket, setKet] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimpan = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('perizinan')
      .insert([{ nama, npm, keterangan: ket }]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      alert("Berhasil! Data izin sudah masuk ke database Ferdy.");
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <button onClick={() => window.location.href = "/"} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', marginBottom: '20px' }}>← Kembali</button>
      
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ color: '#4ade80' }}>Form Izin Kuliah</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '30px' }}>Isi data sesuai KTP/KTM ya!</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input placeholder="Nama Lengkap" onChange={(e) => setNama(e.target.value)} style={inputStyle} />
          <input placeholder="NPM / NIM" onChange={(e) => setNpm(e.target.value)} style={inputStyle} />
          <textarea placeholder="Alasan Izin (Sakit/Izin)" onChange={(e) => setKet(e.target.value)} style={{ ...inputStyle, height: '100px' }} />
          
          <button onClick={handleSimpan} disabled={loading} style={{ 
            background: '#10b981', color: 'white', border: 'none', padding: '15px', 
            borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' 
          }}>
            {loading ? "Mengirim..." : "KIRIM LAPORAN"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: '#162217',
  border: '1px solid #2d3f2e',
  padding: '15px',
  borderRadius: '10px',
  color: 'white',
  outline: 'none'
};