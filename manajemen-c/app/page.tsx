"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PortalAgrotekUPN() {
  const [listInfo, setListInfo] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [judulTugas, setJudulTugas] = useState('');
  const [deadlineTugas, setDeadlineTugas] = useState('');

  const ambilInfoTugas = async () => {
    const { data } = await supabase
      .from('pengumpulan_tugas')
      .select('*')
      .eq('nama_mahasiswa', 'INFO_TUGAS')
      .order('created_at', { ascending: false });
    if (data) setListInfo(data);
  };

  useEffect(() => { ambilInfoTugas(); }, []);

  const handlePublish = async () => {
    if (!judulTugas || !deadlineTugas) return alert("Lengkapi data dulu, Fer!");
    const { error } = await supabase.from('pengumpulan_tugas').insert([{ 
      nama_mahasiswa: 'INFO_TUGAS', nama_file: judulTugas, url_file: deadlineTugas 
    }]);
    if (!error) {
      alert("Info Tugas UPN Jatim Berhasil Terbit! 🚀");
      setJudulTugas(''); setDeadlineTugas('');
      ambilInfoTugas();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050a06', color: 'white', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
      
      {/* HEADER KHAS UPN JATIM */}
      <div style={{ textAlign: 'center', padding: '70px 20px', background: 'linear-gradient(to bottom, #102012, #050a06)', borderBottom: '3px solid #4ade80' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#4ade80', margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>PORTAL KELAS C</h1>
        <p style={{ fontSize: '1.2rem', color: '#f59e0b', marginTop: '5px', fontWeight: 'bold' }}>AGROTEKNOLOGI - UPN "VETERAN" JAWA TIMUR</p>
        <p style={{ opacity: 0.6, fontSize: '14px' }}>Wira Bhakti Udhu - Bela Negara</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* GRID 5 MENU */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginTop: '-30px', marginBottom: '50px' }}>
          <button onClick={() => window.location.href='/materi'} style={cardStyle}>📚<br/>MATERI KULIAH</button>
          <button onClick={() => window.location.href='/izin'} style={cardStyle}>📝<br/>IZIN PRAKTIKUM</button>
          <button onClick={() => window.location.href='/kumpul-tugas'} style={cardStyle}>📤<br/>KUMPUL TUGAS</button>
          <button onClick={() => document.getElementById('papan-tugas')?.scrollIntoView({behavior:'smooth'})} style={{...cardStyle, border: '2px solid #f59e0b', background: '#1a1408'}}>📌<br/>INFO TUGAS</button>
          <button onClick={() => setIsAdminMode(!isAdminMode)} style={{...cardStyle, background: '#112213'}}>🔐<br/>ADMIN PANEL</button>
        </div>

        {/* PAPAN INFO TUGAS */}
        <div id="papan-tugas" style={{ background: '#0e160f', padding: '35px', borderRadius: '25px', border: '1px solid #1a2e1c', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 0 }}>
            <span style={{ fontSize: '30px' }}>📌</span> Papan Pengumuman Tugas
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Update otomatis dari Komting untuk Kelas C</p>
          <hr style={{ border: '0.5px solid #1a2e1c', margin: '20px 0' }} />
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {listInfo.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px', border: '1px dashed #1a2e1c', borderRadius: '15px' }}>
                Belum ada tugas baru, Fer. Infokan ke temen-temen buat tetep pantau! 🌿
              </div>
            ) : (
              listInfo.map((t) => (
                <div key={t.id} style={{ background: '#050a06', padding: '25px', borderRadius: '15px', borderLeft: '6px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '20px', color: '#4ade80' }}>{t.nama_file}</h4>
                    <div style={{ display: 'inline-block', marginTop: '10px', padding: '5px 12px', background: '#1a1408', borderRadius: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: 'bold' }}>
                      ⏳ STATUS: AKTIF
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '150px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>BATAS PENGUMPULAN:</div>
                    <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{new Date(t.url_file).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} WIB</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ADMIN MODE */}
        {isAdminMode && (
          <div style={{ marginTop: '40px', background: '#112213', padding: '30px', borderRadius: '25px', border: '2px dashed #4ade80' }}>
            <h3 style={{ marginTop: 0, color: '#4ade80' }}>🔐 Kendali Komting Agrotek</h3>
            <p style={{ fontSize: '13px', opacity: 0.7 }}>Silahkan masukkan password untuk update informasi kelas.</p>
            <input type="password" placeholder="Password Admin" onChange={(e) => setPassInput(e.target.value)} style={inputStyle} />
            
            {passInput === "komtingC2026" ? (
              <div style={{ marginTop: '25px', padding: '20px', background: '#050a06', borderRadius: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '13px', color: '#4ade80', fontWeight: 'bold' }}>Mata Kuliah / Judul Praktikum:</label>
                  <input placeholder="Contoh: Dasar Perlindungan Tanaman" value={judulTugas} onChange={(e) => setJudulTugas(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', color: '#4ade80', fontWeight: 'bold' }}>Waktu Deadline (WIB):</label>
                  <input type="datetime-local" value={deadlineTugas} onChange={(e) => setDeadlineTugas(e.target.value)} style={inputStyle} />
                </div>
                <button onClick={handlePublish} style={btnPublish}>TERBITKAN SEKARANG 📢</button>
              </div>
            ) : passInput !== "" && <p style={{ color: '#ef4444', fontSize: '12px' }}>Akses ditolak, Fer...</p>}
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5, fontSize: '12px' }}>
        © 2026 Mahasiswa Agroteknologi - UPN "Veteran" Jawa Timur.
      </footer>
    </div>
  );
}

const cardStyle = { 
  background: '#0e160f', padding: '30px 15px', borderRadius: '20px', border: '1px solid #1a2e1c', 
  color: 'white', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '14px', transition: '0.3s'
};

const inputStyle = { 
  width: '100%', padding: '14px', margin: '8px 0 0 0', borderRadius: '12px', 
  border: '1px solid #1a2e1c', background: '#050a06', color: 'white', boxSizing: 'border-box' as const 
};

const btnPublish = { 
  width: '100%', padding: '16px', borderRadius: '12px', border: 'none', 
  background: '#4ade80', color: '#050a06', fontWeight: 'bold' as const, cursor: 'pointer' 
};