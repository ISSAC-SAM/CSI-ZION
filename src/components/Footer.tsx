import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Share2, Globe, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>CSI Zion Church</h3>
                        <p className="footer-subtitle">Growing in Faith. Walking in Love. Serving Christ.</p>
                        <div className="footer-links" style={{ flexDirection: 'row', gap: '16px' }}>
                            <a href="#"><Share2 size={20} /></a>
                            <a href="#"><Globe size={20} /></a>
                            <a href="#"><Heart size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/gallery">Gallery</Link>
                            <Link to="/events">Events & Services</Link>
                            <Link to="/sunday-school">Sunday School</Link>
                            <Link to="/church-members">Leadership</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Resources</h4>
                        <div className="footer-links">
                            <a href="#">Daily Bible Reading</a>
                            <a href="#">Prayer Requests</a>
                            <a href="#">Sermon Archive</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Contact Us</h4>
                        <div className="footer-links">
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <MapPin size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
                                <span>CSI Zion Church,<br />Attur, Salem, Tamil Nadu, India</span>
                            </span>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </span>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Mail size={18} />
                                <span>contact@csizionattur.org</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} CSI Zion Church. All Rights Reserved.</p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/admin">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
