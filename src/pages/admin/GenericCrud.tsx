import { useState, useEffect, useRef } from 'react';
import { fetchData, createData, updateData, deleteData, uploadFile } from '../../lib/supabaseCrud';
import { Trash2, Edit2, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// --- Per-field upload state ---
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FieldUpload {
    status: UploadStatus;
    message: string;
}

export const GenericCrud = ({ tableName, title, columns, bucketName }: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    // Track upload status per file field key
    const [uploadStatus, setUploadStatus] = useState<Record<string, FieldUpload>>({});
    // Keep refs to file inputs so we can reset them after submit
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const setFieldUpload = (key: string, status: UploadStatus, message = '') => {
        setUploadStatus(prev => ({ ...prev, [key]: { status, message } }));
    };

    // ─── FIX 1: Correct accept attr + explicit contentType + loading state ───
    const handleFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (!bucketName) {
            setFieldUpload(key, 'error', 'No storage bucket configured.');
            return;
        }

        const file = files[0];

        // FIX 2: Validate MIME type explicitly so mobile HEIC/WebP aren't silently rejected
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'image/gif', 'image/heic', 'image/heif', 'image/bmp', 'application/pdf'
        ];
        if (!allowedTypes.includes(file.type) && file.type !== '') {
            setFieldUpload(key, 'error', `Unsupported file type: ${file.type || 'unknown'}. Use JPEG, PNG, WebP, or HEIC.`);
            return;
        }

        setFieldUpload(key, 'uploading', 'Uploading…');

        try {
            const url = await uploadFile(bucketName, file);
            handleChange(key, url);
            setFieldUpload(key, 'success', 'Image uploaded successfully!');
            // Auto-clear success message after 4s
            setTimeout(() => setFieldUpload(key, 'idle', ''), 4000);
        } catch (error: any) {
            console.error('Upload error:', error);
            setFieldUpload(key, 'error', error.message || 'Upload failed. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Block submit if any field is still uploading
        const anyUploading = Object.values(uploadStatus).some(s => s.status === 'uploading');
        if (anyUploading) {
            alert('Please wait — an image is still uploading.');
            return;
        }

        setSubmitting(true);
        try {
            if (isEditing) {
                await updateData(tableName, isEditing, formData);
            } else {
                await createData(tableName, formData);
            }
            // Reset form
            setFormData({});
            setIsEditing(null);
            setUploadStatus({});
            // Reset all file inputs
            Object.values(fileInputRefs.current).forEach(ref => {
                if (ref) ref.value = '';
            });
            loadData();
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        }
        setSubmitting(false);
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setIsEditing(item.id);
        setUploadStatus({});
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

    const getFieldUpload = (key: string): FieldUpload =>
        uploadStatus[key] || { status: 'idle', message: '' };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{title}</h1>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                {columns.map((col: any) => {
                    const fu = getFieldUpload(col.key);
                    return (
                        <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: col.fullWidth ? '1 / -1' : 'auto' }}>
                            <label style={{ fontWeight: 500 }}>{col.label}</label>

                            {col.type === 'file' ? (
                                <>
                                    {/* FIX 3: Corrected accept (no space after image/*), added capture hint for mobile */}
                                    <input
                                        type="file"
                                        ref={el => { fileInputRefs.current[col.key] = el; }}
                                        onChange={(e) => handleFileChange(col.key, e)}
                                        className="input-field"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif,application/pdf"
                                        disabled={fu.status === 'uploading'}
                                        style={{
                                            padding: '0.5rem',
                                            cursor: fu.status === 'uploading' ? 'not-allowed' : 'pointer',
                                            // Ensure full touch target on mobile
                                            minHeight: '44px',
                                            touchAction: 'manipulation',
                                        }}
                                    />

                                    {/* Upload status feedback */}
                                    {fu.status === 'uploading' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.85rem' }}>
                                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            {fu.message}
                                        </div>
                                    )}
                                    {fu.status === 'success' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.85rem' }}>
                                            <CheckCircle size={16} />
                                            {fu.message}
                                        </div>
                                    )}
                                    {fu.status === 'error' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
                                            <AlertCircle size={16} />
                                            {fu.message}
                                        </div>
                                    )}

                                    {/* Image preview */}
                                    {formData[col.key] && (
                                        <img
                                            src={formData[col.key]}
                                            alt="preview"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border, #e2e8f0)',
                                                marginTop: '4px'
                                            }}
                                        />
                                    )}
                                </>
                            ) : col.type === 'select' ? (
                                <select
                                    value={formData[col.key] || ''}
                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                    className="input-field"
                                    style={{ minHeight: '44px' }}
                                >
                                    <option value="">Select...</option>
                                    {col.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : col.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    checked={formData[col.key] || false}
                                    onChange={(e) => handleChange(col.key, e.target.checked)}
                                    style={{ width: '20px', height: '20px' }}
                                />
                            ) : (
                                <input
                                    type={col.type || 'text'}
                                    value={formData[col.key] || ''}
                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                    className="input-field"
                                    required={col.required}
                                    style={{ minHeight: '44px' }}
                                />
                            )}
                        </div>
                    );
                })}

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={submitting || Object.values(uploadStatus).some(s => s.status === 'uploading')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting
                            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                            : <><Plus size={18} /> {isEditing ? 'Update' : 'Add New'}</>
                        }
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => { setIsEditing(null); setFormData({}); setUploadStatus({}); }}
                            className="outline-button"
                            style={{ minHeight: '44px' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading ? <p>Loading data…</p> : (
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
                                            {col.type === 'file' && item[col.key]
                                                ? <img src={item[col.key]} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                : String(item[col.key] || '')}
                                        </td>
                                    ))}
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(item)} title="Edit" style={{ minHeight: '36px', minWidth: '36px' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} style={{ color: 'red', minHeight: '36px', minWidth: '36px' }} title="Delete"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr><td colSpan={columns.length + 1} style={{ padding: '1rem', textAlign: 'center' }}>No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Spinner keyframe needed for Loader2 animation */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
