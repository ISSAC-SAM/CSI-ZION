import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [settings, setSettings] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('church_settings').select('*').single();
            if (data) {
                setSettings(data);
            }
        };
        fetchSettings();
    }, []);

    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatusText('');

        try {
            const { error } = await supabase.from('contact_messages').insert([{ name, email, message, status: 'NEW' }]);
            if (error) throw error;
            setStatusText('Your message has been sent successfully. We will get back to you soon!');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error: any) {
            setStatusText('Failed to send message: ' + error.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="section container">
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle">We would love to hear from you. Come visit us or get in touch.</p>

            <div className="grid grid-cols-2" style={{ gap: '64px' }}>
                <div>
                    <div className="card" style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Get in Touch</h3>
                        <form onSubmit={handleMessageSubmit}>
                            {statusText && (
                                <div style={{ padding: '12px', borderRadius: '4px', marginBottom: '16px', background: statusText.includes('successfully') ? '#dcfce7' : '#fee2e2', color: statusText.includes('successfully') ? '#166534' : '#991b1b', fontSize: '0.9rem' }}>
                                    {statusText}
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input type="text" className="form-input" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address (Optional)</label>
                                <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message / Prayer Request *</label>
                                <textarea className="form-input" placeholder="How can we help you?" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: '32px', background: 'var(--primary)', color: 'var(--surface)' }}>
                        <h3 style={{ color: 'var(--surface)', fontSize: '1.25rem', marginBottom: '24px' }}>Church Information</h3>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <MapPin size={24} color="var(--secondary)" style={{ flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Address</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line' }}>{settings?.address_en || "HHWW+JG6 C.S.I Zion Church,\nRailady St, Gandhi Nagar,\nAttur, Tamil Nadu 636102"}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <Phone size={24} color="var(--secondary)" style={{ flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Phone</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{settings?.phone || "+91 98765 43210"}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <Mail size={24} color="var(--secondary)" style={{ flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Email</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{settings?.email || "contact@csizionattur.org"}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Clock size={24} color="var(--secondary)" style={{ flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Office Hours</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line' }}>{settings?.office_hours_en || "Tuesday - Saturday\n9:00 AM - 5:00 PM"}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            <iframe
                                title="CSI Zion Church Google Maps Location"
                                src="https://maps.google.com/maps?q=HHWW%2BJG6%20C.S.I%20Zion%20Church,%20Attur,%20Railady%20St,%20Gandhi%20Nagar,%20Attur,%20Tamil%20Nadu%20636102&t=&z=16&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=HHWW%2BJG6%20C.S.I%20Zion%20Church,%20Attur,%20Railady%20St,%20Gandhi%20Nagar,%20Attur,%20Tamil%20Nadu%20636102"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}
                        >
                            <MapPin size={20} />
                            Get GPS Navigation Directions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
