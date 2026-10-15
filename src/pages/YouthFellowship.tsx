import { useState, useEffect } from 'react';
import { Users, Award, Zap, Flame } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const POSITION_LABELS: Record<string, string> = {
    PRESIDENT: 'President',
    VICE_PRESIDENT: 'Vice President',
    SECRETARY: 'Secretary',
    JOINT_SECRETARY: 'Joint Secretary',
    TREASURER: 'Treasurer',
    PRAYER_LEADER: 'Prayer Leader',
    WORSHIP_LEADER: 'Worship Leader',
    SPORTS_SECRETARY: 'Sports Secretary',
    CULTURAL_SECRETARY: 'Cultural Secretary',
    EXECUTIVE_MEMBER: 'Executive Member',
    MEMBER: 'Member',
};

const POSITION_COLORS: Record<string, string> = {
    PRESIDENT: '#1a3e7a',
    VICE_PRESIDENT: '#2a5ea0',
    SECRETARY: '#1a7a50',
    JOINT_SECRETARY: '#2a9a70',
    TREASURER: '#7a301a',
    PRAYER_LEADER: '#6a1a7a',
    WORSHIP_LEADER: '#ba2060',
    SPORTS_SECRETARY: '#1a607a',
    CULTURAL_SECRETARY: '#7a601a',
    EXECUTIVE_MEMBER: '#555',
    MEMBER: '#444',
};

const YouthFellowship = () => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from('youth_fellowship_members')
                .select('*')
                .eq('status', 'PUBLISHED')
                .order('display_order', { ascending: true });
            if (data) setMembers(data);
            setLoading(false);
        };
        fetchMembers();
    }, []);

    return (
        <div className="section container">
            {/* Header */}
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '50px', padding: '8px 20px', marginBottom: '20px'
                }}>
                    <Zap size={16} color="#2563eb" />
                    <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Sandeeka
                    </span>
                </div>
                <h1 className="section-title">Youth Fellowship</h1>
                <p className="section-subtitle">
                    Igniting the next generation with the fire of faith and purpose
                </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2" style={{ marginBottom: '64px' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #1a3e7a, #0f2550)', color: '#fff', borderRadius: '16px' }}>
                    <Flame size={28} color="#60a5fa" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: '#93c5fd', fontSize: '1.4rem', marginBottom: '12px' }}>Our Vision</h3>
                    <p style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.7' }}>
                        To raise a generation of young believers who are rooted in the Word, fired by the Spirit, and committed to a life of service.
                    </p>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, #1e7a50, #0f5030)', color: '#fff', borderRadius: '16px' }}>
                    <Zap size={28} color="#6ee7b7" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: '#a7f3d0', fontSize: '1.4rem', marginBottom: '12px' }}>Our Mission</h3>
                    <p style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.7' }}>
                        To engage youth through dynamic worship, Bible study, sports, cultural events, and community outreach that transforms lives.
                    </p>
                </div>
            </div>

            {/* Members Grid */}
            <h2 style={{ fontSize: '2rem', marginBottom: '12px', textAlign: 'center' }}>
                Meet Our Leadership &amp; Members
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
                Young leaders serving with energy and dedication
            </p>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading members...</p>
            ) : members.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Users size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Members will be listed here soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-4">
                    {members.map((m, idx) => (
                        <div key={idx} className="card" style={{
                            textAlign: 'center', padding: '32px 20px',
                            borderRadius: '16px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = '';
                                (e.currentTarget as HTMLElement).style.boxShadow = '';
                            }}
                        >
                            {/* Photo */}
                            <div style={{
                                width: '110px', height: '110px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--border), #dde)',
                                margin: '0 auto 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid #3b82f6',
                                overflow: 'hidden'
                            }}>
                                {m.photo_url ? (
                                    <img src={m.photo_url} alt={m.name_en}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Users size={36} color="var(--text-muted)" />
                                )}
                            </div>

                            {/* Name */}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{m.name_en}</h3>

                            {/* Position Badge */}
                            {m.position && (
                                <span style={{
                                    display: 'inline-block',
                                    background: POSITION_COLORS[m.position] || '#444',
                                    color: '#fff',
                                    padding: '4px 14px', borderRadius: '50px',
                                    fontSize: '0.78rem', fontWeight: 700,
                                    letterSpacing: '0.5px',
                                    marginBottom: '10px'
                                }}>
                                    {POSITION_LABELS[m.position] || m.position}
                                </span>
                            )}

                            {/* Qualification */}
                            {m.qualification_en && (
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    <Award size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    {m.qualification_en}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YouthFellowship;
