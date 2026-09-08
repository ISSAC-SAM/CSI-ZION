import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Info, Trash2, X } from 'lucide-react';

export const AdminMessages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (data) {
            setMessages(data);
        } else {
            console.error('Error fetching messages: ', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from('contact_messages').update({ status: newStatus }).eq('id', id);
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
    };

    const deleteMessage = async (id: string) => {
        if (!window.confirm('Delete this message completely?')) return;
        await supabase.from('contact_messages').delete().eq('id', id);
        setSelectedMessage(null);
        fetchMessages();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '32px' }}>Contact & Prayer Requests</h2>

            {selectedMessage && (
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', marginBottom: '32px', border: '1px solid var(--border)', position: 'relative' }}>
                    <button
                        onClick={() => setSelectedMessage(null)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        <X size={24} />
                    </button>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--primary)' }}>Message / Prayer Request Info</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '16px', fontSize: '1rem', marginBottom: '24px' }}>
                        <strong>Name:</strong> <span>{selectedMessage.name}</span>
                        <strong>Email:</strong> <span>{selectedMessage.email || 'N/A'}</span>
                        <strong>Phone:</strong> <span>{selectedMessage.phone || 'N/A'}</span>
                        <strong>Date:</strong> <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                        <strong>Message:</strong>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {selectedMessage.message}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <strong style={{ whiteSpace: 'nowrap' }}>Change Status:</strong>
                        <select
                            value={selectedMessage.status}
                            onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                            className="form-input"
                            style={{ margin: 0, width: '200px' }}
                        >
                            <option value="NEW">NEW</option>
                            <option value="READ">READ</option>
                            <option value="RESPONDED">RESPONDED</option>
                        </select>

                        <button onClick={() => deleteMessage(selectedMessage.id)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', border: 'none', color: '#dc2626' }}>
                            <Trash2 size={16} /> Delete Message
                        </button>
                    </div>
                </div>
            )}

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Email</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading messages...</td>
                            </tr>
                        ) : messages.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No messages found.</td>
                            </tr>
                        ) : (
                            messages.map(msg => (
                                <tr key={msg.id} style={{ borderBottom: '1px solid var(--border)', background: selectedMessage?.id === msg.id ? '#f0f9ff' : 'transparent' }}>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 500 }}>{msg.name}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{msg.email || '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: msg.status === 'NEW' ? '#fef3c7' : msg.status === 'READ' ? '#e0f2fe' : '#dcfce7',
                                            color: msg.status === 'NEW' ? '#92400e' : msg.status === 'READ' ? '#075985' : '#166534'
                                        }}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setSelectedMessage(msg)} title="View Details" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex' }}>
                                                <Info size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
