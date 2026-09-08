import { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'PUBLISHED')
                .order('event_date', { ascending: true });

            if (data) {
                setEvents(data);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    // Format time from "10:00:00" to "10:00 AM" roughly
    const formatTime = (time: string) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minute} ${ampm}`;
    };

    return (
        <div className="section container">
            <h1 className="section-title">Events & Services</h1>
            <p className="section-subtitle">Join us in fellowship and worship.</p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : (
                <div className="grid grid-cols-2" style={{ gap: '48px', alignItems: 'start' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {events.map((event) => (
                                <div key={event.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary)' }}>{event.title_en}</h3>
                                        <span style={{ background: 'var(--border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {event.service_type?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        <Calendar size={18} /> {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        <Clock size={18} /> {formatTime(event.start_time)} {event.end_time ? `- ${formatTime(event.end_time)}` : ''}
                                    </p>
                                    {event.location_en && (
                                        <p style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
                                            <MapPin size={18} /> {event.location_en}
                                        </p>
                                    )}
                                    {event.description_en && (
                                        <p style={{ marginTop: '16px', fontSize: '0.95rem' }}>{event.description_en}</p>
                                    )}
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                                    No upcoming events published currently.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
