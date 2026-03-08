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
  const [listData, setListData] = useState<any[]>([]);
  const [judulTugas, setJudulTugas] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === "komtingC2026") {
      setIsLoggedIn(true);
    } else {
      alert("Password Salah, Fer!");
    }
  };

  const ambilData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengumpulan_tugas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setListData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) ambilData();
  }, [isLoggedIn]);

  const publishInfoTugas = async () => {
    if (!judulTugas || !deadline) return alert("Isi judul & deadline dulu, Fer!");
    
    const { error } = await supabase.from('pengumpulan_tugas').insert([
      { 
        nama_mahasiswa: 'INFO_TUGAS', 
        nama_file: judulTugas, 
        url_file: deadline 
      }
    ]);

    if (!error) {
      alert("Info Tugas Berhasil Terbit! 🚀");
      setJudulTugas('');
      setDeadline('');
      ambilData();
    } else {
      alert("Gagal: " + error.message);
    }
  };

  const hapusData = async (id: string) => {
    if (confirm("Yakin mau hapus data ini?")) {
      await supabase.from('pengumpulan_tugas').delete().eq('id', id);
      ambilData();
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a120b', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#162217', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #4ade80', width: '320px' }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '20px' }}>🔐 Admin Panel</h2>
          <input 
            type="password" 
            placeholder="Masukkan Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle} 
          />
          <button onClick={handleLogin} style={btnGreen}>MASUK SEKARANG</button>
          <button onClick={() => window.location.href = "/"} style={{ background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer', fontSize: '12px' }}>Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#f59e0b', margin: 0 }}>🛠 Control Panel Komting</h2>
            <button onClick={() => window.location.href = "/"} style={{ background: '#1e291b', border: '1px solid #4ade80', color: '#4ade80', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Lihat Website</button>
        </div>
        
        {/* INPUT TUGAS BARU */}
        <div style={{ background: '#162217', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #2d3f2e' }}>
          <h3 style={{ marginTop: 0, color: '#4ade80' }}>📢 Terbitkan Informasi Tugas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Nama Mata Kuliah / Judul Tugas" value={judulTugas} onChange={(e) => setJudulTugas(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Set Tanggal & Waktu Deadline:</div>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
            <button onClick={publishInfoTugas} style={btnGreen}>PUBLISH KE HALAMAN DEPAN</button>
          </div>
        </div>

        {/* TABEL REKAP */}
        <h3 style={{ color: '#4ade80' }}>📊 Rekap Semua Data</h3>
        <div style={{ background: '#162217', borderRadius: '15px', overflow: 'hidden', border: '1px solid #2d3f2e' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2d3f2e', color: '#4ade80' }}>
                <th style={thStyle}>Tipe</th>
                <th style={thStyle}>Judul / Nama</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {listData.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>Belum ada data.</td></tr>
              ) : (
                listData.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #2d3f2e' }}>
                    <td style={tdStyle}>{d.nama_mahasiswa === 'INFO_TUGAS' ? '📌 INFO' : '📁 FILE'}</td>
                    <td style={tdStyle}>{d.nama_file}</td>
                    <td style={tdStyle}>
                      <button onClick={() => hapusData(d.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #2d3f2e', background: '#0a120b', color: 'white', width: '100%', boxSizing: 'border-box' as const };
const btnGreen = { background: '#4ade80', color: '#0a120b', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold' as const, width: '100%', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left' as const, fontSize: '14px' };
const tdStyle = { padding: '15px', fontSize: '14px' };