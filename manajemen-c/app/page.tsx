"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [listInfo, setListInfo] = useState<any[]>([]);

  useEffect(() => {
    const ambilInfo = async () => {
      const { data } = await supabase
        .from('pengumpulan_tugas')
        .select('*')
        .eq('nama_mahasiswa', 'INFO_TUGAS') // Hanya ambil info dari Admin Panel
        .order('created_at', { ascending: false });
      
      if (data) setListInfo(data);
    };
    ambilInfo();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* HEADER PORTAL */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#4ade80', marginBottom: '5px' }}>PORTAL KELAS C</h1>
        <p style={{ opacity: 0.7 }}>Agroteknologi - Universitas Majalengka</p>
      </div>

      {/* 1. MENU KARTU UTAMA (Atas) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px', 
        maxWidth: '800px', 
        margin: '0 auto 50px auto' 
      }}>
        <Link href="/izin" style={linkStyle}><div style={cardStyle}><h3>IZIN</h3><p>Absensi Praktikum</p></div></Link>
        <Link href="/materi" style={linkStyle}><div style={cardStyle}><h3>MATERI</h3><p>Modul & PPT</p></div></Link>
        <Link href="/admin-tugas" style={linkStyle}><div style={{...cardStyle, border: '1px solid #f59e0b'}}><h3>ADMIN</h3><p>Khusus Komting</p></div></Link>
      </div>

      {/* 2. PAPAN INFO TUGAS (Bawah) */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#f59e0b', borderBottom: '2px solid #2d3f2e', paddingBottom: '10px' }}>📌 Tugas Aktif Hari Ini</h2>
        
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {listInfo.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5 }}>Belum ada info tugas baru. Aman, Fer! 🌿</p>
          ) : (
            listInfo.map((info) => (
              <div key={info.id} style={{ 
                background: '#162217', 
                padding: '20px', 
                borderRadius: '15px', 
                borderLeft: '5px solid #4ade80',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>{info.nama_file}</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏳ Deadline:</span> {info.url_file}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

const linkStyle = { textDecoration: 'none', color: 'inherit' };
const cardStyle = { 
  background: '#162217', 
  padding: '20px', 
  borderRadius: '15px', 
  textAlign: 'center' as const,
  border: '1px solid #2d3f2e',
  cursor: 'pointer'
};