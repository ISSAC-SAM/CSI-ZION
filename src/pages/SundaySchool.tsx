import { useState, useEffect } from 'react';
import { Book, Users, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const SundaySchool = () => {
    const [settings, setSettings] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: sData } = await supabase.from('church_settings').select('*').limit(1).single();
            if (sData) setSettings(sData);

            const { data: tData } = await supabase.from('sunday_school_teachers').select('*');
            if (tData) setTeachers(tData);
        };
        fetchData();
    }, []);

    return (
        <div className="section container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
                <h1 className="section-title">Sunday School</h1>
                <p className="section-subtitle">Growing Young Hearts in God's Word</p>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '64px' }}>
                <div className="card" style={{ background: 'var(--primary)', color: 'var(--surface)' }}>
                    <h3 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '16px' }}>Our Mission</h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>{settings?.sunday_school_mission || 'To equip the next generation with a strong biblical foundation, fostering a personal relationship with Christ in a loving and fun environment.'}</p>
                </div>
                <div className="card" style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '16px' }}>Schedule</h3>
                    <p><strong>Every Sunday:</strong> {settings?.sunday_school_schedule || '8:30 AM - 9:45 AM'}</p>
                    <p><strong>Location:</strong> {settings?.sunday_school_location || 'Church Education Wing'}</p>
                </div>
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>Meet Our Dedicated Teachers</h2>
            <div className="grid grid-cols-4">
                {teachers.length > 0 ? teachers.map((t, idx) => (
                    <div key={idx} className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--border)',
                            margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {t.photo_url ? (
                                <img src={t.photo_url} alt={t.name_en} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <Users size={32} color="var(--text-muted)" />
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t.name_en}</h3>
                        <span style={{ display: 'inline-block', background: 'rgba(212, 181, 116, 0.2)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>{t.class_name_en}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><Book size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t.qualification_en}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}><Star size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t.experience}</p>
                    </div>
                )) : (
                    <p style={{ gridColumn: 'span 4', textAlign: 'center', padding: '40px' }}>Loading teachers...</p>
                )}
            </div>
        </div>
    );
};

export default SundaySchool;
