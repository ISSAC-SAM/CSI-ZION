import { useState, useEffect } from 'react';
import { fetchData, createData, updateData, deleteData, uploadFile } from '../../lib/supabaseCrud';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';

export const GenericCrud = ({ tableName, title, columns, bucketName }: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            setData(await fetchData(tableName, columns[0].key));
        } catch (e: any) {
            alert('Error loading: ' + e.message);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [tableName]);

    const handleChange = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleFileChange = async (key: string, e: any) => {
        if (!e.target.files || e.target.files.length === 0 || !bucketName) return;
        const file = e.target.files[0];
        try {
            const url = await uploadFile(bucketName, file);
            handleChange(key, url);
        } catch (error: any) {
            alert('Upload failed: ' + error.message);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateData(tableName, isEditing, formData);
            } else {
                await createData(tableName, formData);
            }
            setFormData({});
            setIsEditing(null);
            loadData();
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        }
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setIsEditing(item.id);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await deleteData(tableName, id);
            loadData();
        } catch (error: any) {
            alert('Error deleting: ' + error.message);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{title}</h1>
            
            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                {columns.map((col: any) => (
                    <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: col.fullWidth ? '1 / -1' : 'auto' }}>
                        <label>{col.label}</label>
                        {col.type === 'file' ? (
                            <input type="file" onChange={(e) => handleFileChange(col.key, e)} className="input-field" accept="image/*, application/pdf" />
                        ) : col.type === 'select' ? (
                            <select value={formData[col.key] || ''} onChange={(e) => handleChange(col.key, e.target.value)} className="input-field">
                                <option value="">Select...</option>
                                {col.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : col.type === 'checkbox' ? (
                            <input type="checkbox" checked={formData[col.key] || false} onChange={(e) => handleChange(col.key, e.target.checked)} />
                        ) : (
                            <input type={col.type || 'text'} value={formData[col.key] || ''} onChange={(e) => handleChange(col.key, e.target.value)} className="input-field" required={col.required} />
                        )}
                        {col.type === 'file' && formData[col.key] && <img src={formData[col.key]} width={50} alt="preview" />}
                    </div>
                ))}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="primary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> {isEditing ? 'Update' : 'Add New'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(null); setFormData({}); }} className="outline-button">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading ? <p>Loading data...</p> : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {columns.map((col: any) => <th key={col.key} style={{ padding: '1rem' }}>{col.label}</th>)}
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    {columns.map((col: any) => (
                                        <td key={col.key} style={{ padding: '1rem' }}>
                                            {col.type === 'file' && item[col.key] ? <ImageIcon /> : String(item[col.key] || '')}
                                        </td>
                                    ))}
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && <tr><td colSpan={columns.length + 1} style={{ padding: '1rem', textAlign: 'center' }}>No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
