"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MateriKuliah() {
  const [folderTerpilih, setFolderTerpilih] = useState<null | string>(null);
  const [filesDariDB, setFilesDariDB] = useState<any[]>([]);

  const daftarMatkul = [
    "Dasar Budidaya Tanaman", "Dasar Ilmu Tanah", 
    "Dasar Perlindungan Tanaman", "Fisiologi Tanaman", 
    "Genetika Pertanian", "Pertanian Perkotaan"
  ];

  // Ambil data materi dari Supabase
  useEffect(() => {
    async function ambilMateri() {
      const { data } = await supabase.from('data_materi').select('*');
      if (data) setFilesDariDB(data);
    }
    ambilMateri();
  }, []);

  const downloadFile = (path: string) => {
    const { data } = supabase.storage.from('file-tugas').getPublicUrl(path);
    window.open(data.publicUrl, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#3b82f6', margin: 0 }}>
            {folderTerpilih ? `📂 ${folderTerpilih}` : "📚 Materi Kuliah"}
          </h2>
          <button onClick={() => folderTerpilih ? setFolderTerpilih(null) : window.location.href = "/"} style={btnBack}>
            {folderTerpilih ? "⬅️ Kembali" : "Beranda"}
          </button>
        </div>

        {!folderTerpilih ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {daftarMatkul.map((matkul, i) => (
              <div key={i} style={cardFolder}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px' }}>📁</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{matkul}</h3>
                </div>
                <button onClick={() => setFolderTerpilih(matkul)} style={btnJelajahi}>Jelajahi</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Filter file berdasarkan folder yang dipilih */}
            {filesDariDB.filter(f => f.mata_kuliah === folderTerpilih).length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px' }}>Belum ada materi di sini.</p>
            ) : (
              filesDariDB.filter(f => f.mata_kuliah === folderTerpilih).map((file, index) => (
                <div key={index} style={fileItem}>
                  <span>📄 {file.nama_file}</span>
                  <button onClick={() => downloadFile(file.url_file)} style={btnDownload}>Download</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const cardFolder = { background: '#162217', padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const fileItem = { background: '#1e291b', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const btnBack = { background: '#162217', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' };
const btnJelajahi = { background: '#3b82f6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnDownload = { background: '#4ade80', border: 'none', color: '#0a120b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };