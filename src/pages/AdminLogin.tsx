import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { session, profile, loading: authLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authLoading) return; // Wait until profile finishes loading
        if (session) {
            if (profile?.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                setError('Access denied: You do not have admin privileges.');
                setLoading(false);
                supabase.auth.signOut();
            }
        }
    }, [session, profile, authLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Let useEffect handle redirect based on profile loading automatically
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--secondary)', marginBottom: '16px' }}>
                        <Lock size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Login</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Secure access to CSI Zion Platform</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: '48px' }}
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                style={{ paddingLeft: '48px' }}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                <input type="checkbox" /> Remember me
                            </label>
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'} Password
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '16px', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Authenticating...' : 'Login securely'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
