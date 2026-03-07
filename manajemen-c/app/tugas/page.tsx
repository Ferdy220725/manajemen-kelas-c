"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TugasPage() {
  const [nama, setNama] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !nama) return alert("Isi nama dan pilih file dulu, Fer!");
    setLoading(true);

    // 1. Upload file ke Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('file-tugas')
      .upload(fileName, file);

    if (uploadError) {
      alert("Gagal upload file: " + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Simpan data ke tabel pengumpulan_tugas
    const { error: dbError } = await supabase
  .from('pengumpulan_tugas')
  .insert([{ 
    nama_mahasiswa: nama, 
    nama_file: file.name, // Sekarang sudah sinkron dengan kolom nama_file di SQL
    url_file: fileName    // Sekarang sudah sinkron dengan kolom url_file di SQL
  }]);

    if (dbError) {
      alert("Gagal simpan data: " + dbError.message);
    } else {
      alert("Mantap! Tugas " + file.name + " sudah terkirim.");
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <button onClick={() => window.location.href = "/"} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', marginBottom: '20px' }}>← Kembali</button>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ color: '#f59e0b' }}>📤 Kumpul Tugas</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <input placeholder="Nama Lengkap" onChange={(e) => setNama(e.target.value)} style={inputStyle} />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={inputStyle} />
          <button onClick={handleUpload} disabled={loading} style={{ 
            background: '#f59e0b', color: 'white', border: 'none', padding: '15px', 
            borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' 
          }}>
            {loading ? "Sabar, lagi upload..." : "UPLOAD TUGAS SEKARANG"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { background: '#162217', border: '1px solid #2d3f2e', padding: '15px', borderRadius: '10px', color: 'white' };