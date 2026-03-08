"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PortalAgrotek() {
  const [listInfo, setListInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const { data, error } = await supabase
          .from('pengumpulan_tugas')
          .select('*')
          .eq('nama_mahasiswa', 'INFO_TUGAS')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setListInfo(data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    ambilData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050a06', color: 'white', fontFamily: 'sans-serif' }}>
      {/* Header Identitas Kampus */}
      <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0d1a0e', borderBottom: '4px solid #4ade80' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#4ade80', margin: 0, letterSpacing: '1px' }}>
          PORTAL MANAJEMEN KELAS C
        </h1>
        <p style={{ color: '#f59e0b', fontWeight: 'bold', marginTop: '10px', fontSize: '1.1rem' }}>
          AGROTEKNOLOGI - UPN "VETERAN" JAWA TIMUR
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        {/* Box Info Tugas */}
        <div style={{ background: '#0e160f', padding: '25px', borderRadius: '15px', border: '1px solid #1a2e1c', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#4ade80', borderBottom: '1px solid #1a2e1c', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📌 Info Tugas & Praktikum
          </h2>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Memuat data...</p>
          ) : listInfo.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Belum ada info tugas terbaru, Fer.</p>
          ) : (
            listInfo.map((tugas) => (
              <div key={tugas.id} style={{ padding: '20px 0', borderBottom: '1px solid #1a2e1c' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>{tugas.nama_file}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: '500' }}>
                    📅 Deadline: {tugas.url_file || 'Segera'}
                  </span>
                  <button style={{ background: '#166534', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Admin */}
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#4b5563', fontSize: '0.8rem' }}>
          Dikelola oleh Komting Kelas C Agroteknologi © 2026
        </p>
      </div>
    </div>
  );
}