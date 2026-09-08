import { useState, useEffect } from 'react';
import { Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChurchMembers = () => {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from('church_members')
                .select('*')
                .eq('status', 'PUBLISHED')
                .order('created_at', { ascending: true });

            if (data) {
                setLeaders(data);
            }
            setLoading(false);
        };
        fetchMembers();
    }, []);

    return (
        <div className="section container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h1 className="section-title">Our Church Leadership</h1>
                <p className="section-subtitle">Dedicated servants leading our congregation.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : (
                <div className="grid grid-cols-3">
                    {leaders.map((leader) => (
                        <div key={leader.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--border)', margin: '0 auto 16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {leader.photo_url ? (
                                        <img src={leader.photo_url} alt={leader.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <User size={48} color="var(--text-muted)" />
                                    )}
                                </div>
                                <span className="verse-tag">{leader.position?.replace(/_/g, ' ') || 'Member'}</span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{leader.name_en}</h3>
                                {leader.qualification_en && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{leader.qualification_en}</p>}
                            </div>

                            {leader.experience && <p style={{ fontSize: '0.95rem', flexGrow: 1, marginBottom: '24px' }}>{leader.experience}</p>}

                            {(leader.phone || leader.email) && (
                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    {leader.phone && (
                                        <a href={`tel:${leader.phone}`} className="btn btn-outline" style={{ flexGrow: 1, padding: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                                            <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} /> Call
                                        </a>
                                    )}
                                    {leader.email && (
                                        <a href={`mailto:${leader.email}`} className="btn btn-outline" style={{ flexGrow: 1, padding: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                                            <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} /> Email
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {leaders.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            Leadership information is currently being updated.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChurchMembers;
