"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://etdcqxdjmdyexbvgjaza.supabase.co', 
  'sb_publishable_69qNJfkxRc2lPnSUMYXCeQ_lsypv2Ba'
);

// Ini yang bikin VS Code nggak marah lagi
interface Tugas {
  id: number;
  matkul: string;
  nama_tugas: string;
  deadline: string;
}

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [listTugas, setListTugas] = useState<Tugas[]>([]); 
  const [form, setForm] = useState({ matkul: '', nama_tugas: '', deadline: '' });

  useEffect(() => {
    fetchTugas();
  }, []);

  const fetchTugas = async () => {
    const { data } = await supabase.from('daftar_tugas').select('*').order('deadline', { ascending: true });
    if (data) setListTugas(data as Tugas[]);
  };

  const simpanTugas = async () => {
    if (!form.matkul || !form.nama_tugas || !form.deadline) return alert("Isi semua dulu, Fer!");
    const { error } = await supabase.from('daftar_tugas').insert([form]);
    if (!error) {
      alert("Tugas Berhasil Terbit! ✨");
      setForm({ matkul: '', nama_tugas: '', deadline: '' });
      fetchTugas();
    }
  };

  const blastWA = (t: Tugas) => {
    const teks = `*📢 PENGINGAT TUGAS KELAS C*\n\n*Matkul:* ${t.matkul}\n*Tugas:* ${t.nama_tugas}\n*Deadline:* ${new Date(t.deadline).toLocaleString('id-ID')}\n\nSegera diselesaikan rek! Semangat Agrotek! 💪🌿`;
    window.open(`https://wa.me/?text=${encodeURIComponent(teks)}`, '_blank');
  };

  if (!showMenu) {
    return (
      <div style={containerCenter}>
        <h1 style={titleStyle}>PORTAL KELAS C</h1>
        <button onClick={() => setShowMenu(true)} style={btnUtama}>MASUK DASHBOARD 🚀</button>
        <div onClick={() => setIsAdmin(!isAdmin)} style={{marginTop: '30px', cursor: 'pointer'}}>
          <p style={{fontSize: '11px', color: isAdmin ? '#4ade80' : '#3d5a3e'}}>
            {isAdmin ? "🔓 MODE ADMIN AKTIF" : "🔒 Mode Mahasiswa"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerPage}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px' }}>📅 Info Tugas</h2>
            <button onClick={() => setShowMenu(false)} style={btnKecil}>Kembali</button>
        </div>
        {isAdmin && (
          <div style={panelAdmin}>
            <input type="text" placeholder="Matkul" style={inputStyle} value={form.matkul} onChange={e => setForm({...form, matkul: e.target.value})} />
            <input type="text" placeholder="Tugas" style={inputStyle} value={form.nama_tugas} onChange={e => setForm({...form, nama_tugas: e.target.value})} />
            <input type="datetime-local" style={inputStyle} value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
            <button onClick={simpanTugas} style={btnSimpan}>TERBITKAN 📢</button>
          </div>
        )}
        {listTugas.map((t) => (
          <div key={t.id} style={cardTugas}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0', fontSize: '14px', color: '#4ade80' }}>{t.matkul}</h3>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{t.nama_tugas}</p>
              <p style={{ fontSize: '12px', color: '#f59e0b' }}>⏰ {new Date(t.deadline).toLocaleString('id-ID')}</p>
            </div>
            {isAdmin && <button onClick={() => blastWA(t)} style={btnWA}>📲 WA</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Styling (biar scannable)
const containerCenter = { minHeight: '100vh', background: '#0a120b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' } as any;
const containerPage = { minHeight: '100vh', background: '#0a120b', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' } as any;
const titleStyle = { fontSize: '40px', fontWeight: '900', background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } as any;
const btnUtama = { background: '#4ade80', color: '#0a120b', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' } as any;
const btnKecil = { background: 'none', border: '1px solid #3d5a3e', color: '#94a3b8', padding: '5px 15px', borderRadius: '10px' } as any;
const panelAdmin = { background: '#162217', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #4ade80' } as any;
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', background: '#0a120b', color: 'white', border: '1px solid #334155' } as any;
const btnSimpan = { width: '100%', padding: '12px', background: '#4ade80', color: '#0a120b', borderRadius: '8px', fontWeight: 'bold', border: 'none' } as any;
const cardTugas = { background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center' } as any;
const btnWA = { background: '#25D366', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: 'bold' } as any;