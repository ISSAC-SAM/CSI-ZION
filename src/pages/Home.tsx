import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Copy, Heart, BookOpen, Users, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../lib/LanguageContext';

const Home = () => {
    const { t, l, lang } = useLanguage();
    const [settings, setSettings] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('church_settings').select('*').limit(1).single();
            if (data) setSettings(data);
        };
        const fetchEvents = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await supabase.from('events').select('*').eq('status', 'PUBLISHED').gte('event_date', today).order('event_date', { ascending: true }).limit(3);
            if (data) setEvents(data);
        };
        fetchSettings();
        fetchEvents();
    }, []);

    const handleCopy = () => {
        const verse = l(settings, 'verse_text') || '"Your word is a lamp to my feet and a light to my path."';
        const ref = l(settings, 'verse_reference') || 'Psalm 119:105';
        navigator.clipboard.writeText(`${verse} - ${ref}`);
        alert('Copied to clipboard!');
    };

    const handleShare = async () => {
        const verse = l(settings, 'verse_text') || '"Your word is a lamp to my feet and a light to my path."';
        const ref = l(settings, 'verse_reference') || 'Psalm 119:105';
        const content = `${verse} - ${ref}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Verse of the Day',
                    text: content
                });
            } catch (err) {
                console.error('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(content);
            alert('Copied to clipboard (Share not supported down device)');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-location">{l(settings, 'church_name')} • Attur, Salem</span>
                        <h1 className="hero-title">{l(settings, 'hero_title') || 'Growing in Faith. Walking in Love. Serving Christ.'}</h1>
                        <p className="hero-subtitle">
                            {l(settings, 'hero_subtitle') || 'Welcome to our spiritual home. A place of worship, fellowship, and divine encounter where every soul matters.'}
                        </p>
                        <div className="hero-buttons">
                            <Link to="/about" className="btn btn-secondary">{t('exploreChurch')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Verse Section */}
            <section className="daily-verse-section container">
                <div className="verse-card">
                    <span className="verse-tag">{t('verseOfDay')} • {new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US')}</span>
                    <p className="verse-text">{l(settings, 'verse_text') || '"Your word is a lamp to my feet and a light to my path."'}</p>
                    <p className="verse-ref">{l(settings, 'verse_reference') || 'Psalm 119:105'}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={handleCopy}>
                            <Copy size={16} /> {t('copy')}
                        </button>
                        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={handleShare}>
                            <Share2 size={16} /> {t('share')}
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section container">
                <div className="about-grid">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1548625361-98aade47bc63?q=80&w=2069&auto=format&fit=crop"
                            alt="Church Interior"
                            className="about-img"
                        />
                    </div>
                    <div>
                        <h2 className="section-title" style={{ textAlign: 'left' }}>{l(settings, 'about_title') || t('aboutOurChurch')}</h2>
                        <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                            {l(settings, 'about_desc1') || 'CSI Zion Church, located in the heart of Attur, Salem, is a vibrant and growing community of believers. Our mission is to spread the love of Christ, nurture spiritual growth, and serve our community with compassion.'}
                        </p>
                        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
                            {l(settings, 'about_desc2') || 'We hold firm to the teachings of the Bible, celebrating our faith through heartfelt worship, dedicated prayer, and engaging fellowship. Whether you are seeking answers, looking for a church home, or simply passing through, you are welcome here.'}
                        </p>
                        <Link to="/about" className="btn btn-primary">
                            {t('learnMore') || 'Learn More'} <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="section" style={{ backgroundColor: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">Church Highlights</h2>
                    <p className="section-subtitle">Discover the various ways we worship, grow, and serve together.</p>

                    <div className="grid grid-cols-3">
                        {[
                            { title: 'Worship', icon: <Heart />, desc: 'Join us in heartfelt praise and worship every week.' },
                            { title: 'Prayer', icon: <Clock />, desc: 'Experience the power of collective prayer and intercession.' },
                            { title: 'Bible Study', icon: <BookOpen />, desc: 'Dive deeper into the word of God and strengthen your faith.' },
                            { title: 'Sunday School', icon: <Users />, desc: 'Nurturing young hearts with biblical teachings and love.' },
                            { title: 'Youth Ministry', icon: <Users />, desc: 'Empowering the next generation for Christ.' },
                            { title: 'Community Service', icon: <Heart />, desc: 'Reaching out to those in need with the love of Jesus.' }
                        ].map((item, idx) => (
                            <div key={idx} className="card">
                                <div className="highlight-icon">{item.icon}</div>
                                <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Services */}
            <section className="section container">
                <h2 className="section-title">{t('upcomingServices')}</h2>
                <div className="grid grid-cols-3">
                    {events.length > 0 ? events.map((ev, idx) => {
                        const evtDate = new Date(ev.event_date);
                        const dayName = evtDate.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US', { weekday: 'long' });
                        const dateStr = evtDate.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                        const hasStart = !!ev.start_time;
                        const hr = hasStart ? parseInt(ev.start_time.split(':')[0]) : 10;
                        const ampm = hr >= 12 ? 'PM' : 'AM';
                        const displayTime = hasStart ? ev.start_time.substring(0, 5) : '10:00';

                        return (
                            <div key={idx} className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                                <span style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    {dayName}, {dateStr} • {displayTime} {ampm}
                                </span>
                                <h3 style={{ margin: '8px 0 16px' }}>{l(ev, 'title')}</h3>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    <Users size={16} /> {l(ev, 'person_name') || 'Church Leaders'}
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                    <Clock size={16} /> {l(ev, 'location') || 'Main Sanctuary'}
                                </p>
                            </div>
                        );
                    }) : (
                        <p style={{ gridColumn: 'span 3', textAlign: 'center', padding: '24px' }}>No upcoming events scheduled right now.</p>
                    )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/events" className="btn btn-outline">{t('viewAllEvents')}</Link>
                </div>
            </section>

        </>
    );
};

export default Home;
