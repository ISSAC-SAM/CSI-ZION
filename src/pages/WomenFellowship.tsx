import { useState, useEffect } from 'react';
import { Users, Award, Star, Heart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const POSITION_LABELS: Record<string, string> = {
    PRESIDENT: 'President',
    VICE_PRESIDENT: 'Vice President',
    SECRETARY: 'Secretary',
    JOINT_SECRETARY: 'Joint Secretary',
    TREASURER: 'Treasurer',
    PRAYER_LEADER: 'Prayer Leader',
    WORSHIP_LEADER: 'Worship Leader',
    EXECUTIVE_MEMBER: 'Executive Member',
    MEMBER: 'Member',
};

const POSITION_COLORS: Record<string, string> = {
    PRESIDENT: '#c8a951',
    VICE_PRESIDENT: '#a08040',
    SECRETARY: '#2c6e49',
    JOINT_SECRETARY: '#3a8a5c',
    TREASURER: '#1e5f9e',
    PRAYER_LEADER: '#7b3fa0',
    WORSHIP_LEADER: '#c0509e',
    EXECUTIVE_MEMBER: '#c06030',
    MEMBER: '#555',
};

const WomenFellowship = () => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from('women_fellowship_members')
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
                    background: 'linear-gradient(135deg, rgba(212,181,116,0.15), rgba(212,181,116,0.05))',
                    border: '1px solid rgba(212,181,116,0.35)',
                    borderRadius: '50px', padding: '8px 20px', marginBottom: '20px'
                }}>
                    <Heart size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Sandeeka
                    </span>
                </div>
                <h1 className="section-title">Women Fellowship</h1>
                <p className="section-subtitle">
                    Empowering women through faith, fellowship, and service in Christ
                </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2" style={{ marginBottom: '64px' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), #5a2d14)', color: '#fff', borderRadius: '16px' }}>
                    <Star size={28} color="var(--secondary)" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: 'var(--secondary)', fontSize: '1.4rem', marginBottom: '12px' }}>Our Vision</h3>
                    <p style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.7' }}>
                        To nurture godly women who lead their families and community in faith, love, and service to the Lord.
                    </p>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, #d4b574, #c8a020)', color: '#1a1a1a', borderRadius: '16px' }}>
                    <Award size={28} color="#3d1a00" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: '#3d1a00', fontSize: '1.4rem', marginBottom: '12px' }}>Our Mission</h3>
                    <p style={{ color: 'rgba(0,0,0,0.78)', lineHeight: '1.7' }}>
                        To encourage, equip and empower women of all ages through Bible study, prayer, praise and outreach ministries.
                    </p>
                </div>
            </div>

            {/* Members Grid */}
            <h2 style={{ fontSize: '2rem', marginBottom: '12px', textAlign: 'center' }}>
                Meet Our Leadership &amp; Members
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
                Dedicated women serving with purpose and passion
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
                                background: 'linear-gradient(135deg, var(--border), #eee)',
                                margin: '0 auto 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid var(--secondary)',
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
                                    background: POSITION_COLORS[m.position] || '#555',
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

export default WomenFellowship;
