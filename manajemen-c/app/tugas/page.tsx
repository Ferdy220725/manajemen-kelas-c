"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PapanInformasiTugas() {
  const [listInfo, setListInfo] = useState<any[]>([]);

  useEffect(() => {
    const ambilInfo = async () => {
      const { data } = await supabase
        .from('pengumpulan_tugas')
        .select('*')
        .eq('nama_mahasiswa', 'INFO_TUGAS') // Mengambil hanya info dari kamu
        .order('created_at', { ascending: false });
      
      if (data) setListInfo(data);
    };
    ambilInfo();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a120b', color: 'white', padding: '20px' }}>
      <h2 style={{ color: '#f59e0b', textAlign: 'center' }}>📌 Info Tugas Agroteknologi C</h2>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {listInfo.map((info) => (
          <div key={info.id} style={{ background: '#162217', padding: '15px', borderRadius: '12px', borderLeft: '5px solid #4ade80' }}>
            <h4 style={{ margin: 0 }}>{info.nama_file}</h4>
            <p style={{ color: '#f59e0b', fontSize: '13px' }}>Deadline: {info.url_file}</p>
          </div>
        ))}
      </div>
    </div>
  );
}