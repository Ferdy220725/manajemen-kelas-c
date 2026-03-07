"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminTugas() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [listTugas, setListTugas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State Baru untuk Upload Materi
  const [fileMateri, setFileMateri] = useState<File | null>(null);
  const [matkulTerpilih, setMatkulTerpilih] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const passwordBenar = "komtingC2026"; 
  const daftarMatkul = [
    "Dasar Budidaya Tanaman", "Dasar Ilmu Tanah", 
    "Dasar Perlindungan Tanaman", "Fisiologi Tanaman", 
    "Genetika Pertanian", "Pertanian Perkotaan"
  ];

  const handleLogin = () => {
    if (password === passwordBenar) { 
      setIsLoggedIn(true);
      ambilData();
    } else {
      alert("Password salah, Fer!");
    }
  };

  async function ambilData() {
    setLoading(true);
    const { data } = await supabase.from('pengumpulan_tugas').select('*').order('created_at', { ascending: false });
    if (data) setListTugas(data);
    setLoading(false);
  }

  // FUNGSI UPLOAD MATERI BARU
  const uploadMateri = async () => {
    if (!fileMateri || !matkulTerpilih) return alert("Pilih file dan mata kuliah dulu!");
    setIsUploading(true);

    const fileExt = fileMateri.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `materi/${fileName}`;

    // 1. Upload ke Storage
    const { error: uploadError } = await supabase.storage.from('file-tugas').upload(filePath, fileMateri);

    if (!uploadError) {
      // 2. Simpan link ke tabel data_materi
      await supabase.from('data_materi').insert([
        { mata_kuliah: matkulTerpilih, nama_file: fileMateri.name, url_file: filePath }
      ]);
      alert("Materi berhasil diupload!");
      setFileMateri(null);
    }
    setIsUploading(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a120b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#162217', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #4ade80', width: '320px' }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '20px' }}>🔐 Admin Panel</h2>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', marginBottom: '15px', width: '100%', background: '#0a120b', color: 'white', border: '1px solid #3d5a3e' }} />
          <button onClick={handleLogin} style={{ background: '#4ade80', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>MASUK</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>📊 Admin Panel Komting</h2>
          <button onClick={() => window.location.href = "/"} style={{ background: '#1e291b', border: '1px solid #4ade80', color: '#4ade80', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>⬅️ Kembali</button>
        </div>

        {/* SECTION UPLOAD MATERI */}
        <div style={{ background: '#162217', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginTop: 0 }}>📤 Upload Materi Kuliah Baru</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select onChange={(e) => setMatkulTerpilih(e.target.value)} style={inputStyle}>
              <option value="">-- Pilih Mata Kuliah --</option>
              {daftarMatkul.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="file" onChange={(e) => setFileMateri(e.target.files?.[0] || null)} style={inputStyle} />
            <button onClick={uploadMateri} disabled={isUploading} style={btnUpload}>
              {isUploading ? "Memproses..." : "Upload Materi"}
            </button>
          </div>
        </div>

        {/* SECTION REKAP TUGAS (Tabel yang lama) */}
        <h3>📑 Rekap Tugas Mahasiswa ({listTugas.length})</h3>
        <div style={{ background: '#162217', borderRadius: '15px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#1e291b' }}>
              <tr>
                <th style={thStyle}>Nama Mahasiswa</th>
                <th style={thStyle}>Mata Kuliah</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {listTugas.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #2d3f2e' }}>
                  <td style={tdStyle}>{t.nama_mahasiswa}</td>
                  <td style={tdStyle}>{t.nama_file}</td>
                  <td style={tdStyle}><button style={btnView}>Lihat</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '8px', background: '#0a120b', color: 'white', border: '1px solid #3d5a3e', flex: 1, minWidth: '200px' };
const btnUpload = { background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '15px', textAlign: 'left' as const };
const tdStyle = { padding: '15px' };
const btnView = { background: '#f59e0b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' };