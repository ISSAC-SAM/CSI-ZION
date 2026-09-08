import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export const AdminUsers = () => {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '', username: '', phone: '', role: 'ADMIN' });

    const handleCreateUser = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-user', {
                body: formData,
                headers: { Authorization: `Bearer ${session?.access_token}` }
            });

            if (error) {
                // Supabase functions.invoke throws a generic FunctionsHttpError on non-2xx.
                // We should try to get the real error from the context if possible, or use standard fetch
                console.error("Function error details:", error);

                // Fallback attempt: Fetch raw if invoke obfuscates it
                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://sixgdsqjesrhllfhvvnn.supabase.co'}/functions/v1/create-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`
                    },
                    body: JSON.stringify(formData)
                });

                const errorData = await response.json();
                if (errorData?.error) {
                    throw new Error(errorData.error);
                }

                throw new Error("Unable to create user. Ensure the email is not already registered.");
            }

            if (data?.error) throw new Error(data.error);

            // The edge function currently hardcodes role: 'CHURCH_USER'. 
            // If the admin selected 'ADMIN', we must update the profile directly after creation.
            if (formData.role === 'ADMIN' && data?.user?.id) {
                const { error: roleUpdateError } = await supabase
                    .from('profiles')
                    .update({ role: 'ADMIN' })
                    .eq('id', data.user.id);

                if (roleUpdateError) {
                    console.error("Failed to upgrade user to ADMIN:", roleUpdateError);
                    alert("User was created, but failed to grant ADMIN permissions.");
                }
            }

            alert('User created successfully!');
            setFormData({ email: '', password: '', full_name: '', username: '', phone: '', role: 'ADMIN' });
        } catch (error: any) {
            alert('Error creating user: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create User Account</h2>
            <form onSubmit={handleCreateUser} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Username" className="input-field" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                <input type="text" placeholder="Full Name" className="input-field" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                <input type="email" placeholder="Email" className="input-field" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <input type="text" placeholder="Phone" className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="ADMIN">Administrator (ADMIN)</option>
                    <option value="CHURCH_USER">Regular Member (CHURCH_USER)</option>
                </select>

                <input type="password" placeholder="Password" className="input-field" required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <button type="submit" className="primary-button" disabled={loading}>{loading ? 'Creating...' : 'Create Secure User'}</button>
            </form>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Important: Authentication passwords are securely hashed via edge function. NEVER exposed to client.</p>
        </div>
    );
}
