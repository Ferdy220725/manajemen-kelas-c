"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPanelTugas() {
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [deadline, setDeadline] = useState(''); // Format: YYYY-MM-DDTHH:mm
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTugas();
  }, []);

  const fetchTugas = async () => {
    const { data } = await supabase.from('pengumpulan_tugas').select('*').order('created_at', { ascending: false });
    if (data) setTugasList(data);
  };

  const handleTambahTugas = async () => {
    if (!judul || !deadline) return alert("Isi judul tugas dan deadlinenya dulu, Fer!");
    setLoading(true);
    const { error } = await supabase.from('pengumpulan_tugas').insert([{ 
      nama_file: judul, 
      url_file: deadline, // Kita simpan tanggal deadline di sini
      nama_mahasiswa: "INFO TUGAS"
    }]);

    if (!error) {
      setJudul(''); setDeadline('');
      fetchTugas();
      alert("Tugas berhasil dipublish!");
    }
    setLoading(false);
  };

  // Fungsi buat hitung mundur (Timer)
  const getCountdown = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - new Date().getTime();
    if (diff <= 0) return "WAKTU HABIS";
    const hari = Math.floor(diff / (1000 * 60 * 60 * 24));
    const jam = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${hari} Hari, ${jam} Jam Lagi`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#4ade80' }}>🛠 Admin Panel - Penugasan</h1>
        
        {/* FORM INPUT UNTUK KAMU (ADMIN) */}
        <div style={{ background: '#162217', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #2d3f2e' }}>
          <h3>Tambah Info Tugas Baru</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Judul Tugas (Contoh: Laporan Dasar Agronomi)" value={judul} onChange={(e) => setJudul(e.target.value)} style={inputStyle} />
            <p style={{ margin: '0', fontSize: '12px' }}>Pilih Tanggal & Jam Deadline:</p>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
            <button onClick={handleTambahTugas} disabled={loading} style={btnStyle}>
              {loading ? "Menyimpan..." : "PUBLISH TUGAS"}
            </button>
          </div>
        </div>

        {/* DAFTAR TUGAS UNTUK TEMEN-TEMEN */}
        <h3>📌 Daftar Tugas Aktif</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {tugasList.map((t) => (
            <div key={t.id} style={{ background: '#162217', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{t.nama_file}</h4>
              <div style={{ background: '#0a120b', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: '12px', color: '#f59e0b' }}>SISA WAKTU:</p>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#4ade80' }}>{getCountdown(t.url_file)}</p>
              </div>
              <p style={{ fontSize: '11px', marginTop: '10px', opacity: 0.6 }}>Deadline: {new Date(t.url_file).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { background: '#0a120b', border: '1px solid #2d3f2e', padding: '12px', borderRadius: '8px', color: 'white' };
const btnStyle = { background: '#4ade80', color: '#0a120b', fontWeight: 'bold', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer' };