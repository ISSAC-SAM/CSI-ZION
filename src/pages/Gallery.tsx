import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Gallery = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // category removed since we don't handle it in crud yet

    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase.from('gallery').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false });
            if (data) setImages(data);
            setLoading(false);
        };
        fetchGallery();
    }, []);

    return (
        <div className="section container">
            <h1 className="section-title">Church Gallery</h1>
            <p className="section-subtitle">Moments of grace, worship, and community at CSI Zion Church.</p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : (
                <div className="grid grid-cols-3">
                    {images.map((img) => (
                        <div key={img.id} style={{
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <img
                                src={img.image_url}
                                alt={img.title_en}
                                style={{ width: '100%', height: '300px', objectFit: 'cover', background: '#f5f5f5' }}
                                className="gallery-img-hover"
                            />
                            {(img.title_en || img.description_en) && (
                                <div style={{ padding: '16px' }}>
                                    {img.title_en && <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{img.title_en}</h3>}
                                    {img.description_en && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{img.description_en}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No images currently published in the gallery.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
