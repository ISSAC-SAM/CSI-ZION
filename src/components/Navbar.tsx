import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const { lang, toggleLang, t } = useLanguage();

    const links = [
        { name: t('home'), path: '/' },
        { name: t('gallery'), path: '/gallery' },
        { name: t('events'), path: '/events' },
        { name: t('sundayClass'), path: '/sunday-school' },
        { name: t('churchMembers'), path: '/church-members' },
        { name: t('contact'), path: '/contact' }
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo-container" onClick={closeMenu}>
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" /></svg>
                    </div>
                    <div>
                        <div className="logo-text">CSI Zion</div>
                        <div className="logo-subtext">Church Attur</div>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="nav-links">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={location.pathname === link.path ? 'active' : ''}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions">
                    <button className="lang-switch" onClick={toggleLang} style={{ cursor: 'pointer' }}>
                        {lang === 'en' ? 'தமிழ் | EN' : 'EN | தமிழ்'}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isOpen ? 'active' : 'hidden'}`}>
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={closeMenu}
                            style={{ fontWeight: location.pathname === link.path ? 700 : 500 }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)' }}>
                        <button className="lang-switch" style={{ width: '100%' }}>Switch to Tamil</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
