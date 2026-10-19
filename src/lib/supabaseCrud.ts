import { supabase } from './supabaseClient';

export const fetchData = async (table: string, orderColumn = 'created_at') => {
    const { data, error } = await supabase.from(table).select('*').order(orderColumn, { ascending: false });
    if (error) throw error;
    return data;
};

export const createData = async (table: string, payload: any) => {
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) throw error;
    return data;
};

export const updateData = async (table: string, id: string, payload: any) => {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteData = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
};

export const uploadFile = async (bucket: string, file: File) => {
    // Step 1: File size check — 10MB limit
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
        throw new Error(
            `Image too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). ` +
            `Please choose an image smaller than ${MAX_MB} MB.`
        );
    }

    // Step 2: Resolve MIME type explicitly.
    // Mobile browsers (especially iOS Safari) sometimes report file.type as ''
    // for HEIC/HEIF images. We detect by extension as a fallback.
    const originalName = file.name || 'mobile_upload.jpg';
    const rawExt = originalName.includes('.')
        ? originalName.split('.').pop()?.toLowerCase() ?? 'jpg'
        : 'jpg';

    // Map MIME type: prefer file.type, fall back to extension-based lookup
    const extToMime: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        heic: 'image/heic',
        heif: 'image/heif',
        bmp: 'image/bmp',
        pdf: 'application/pdf',
    };
    const contentType = file.type || extToMime[rawExt] || 'image/jpeg';

    // Use 'jpg' extension for HEIC/HEIF so URLs render in browsers without native HEIC support
    const storageExt = ['heic', 'heif'].includes(rawExt) ? 'jpg' : rawExt;

    // Step 3: Build a safe, unique filename
    const safeRandom = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}-${safeRandom}.${storageExt}`;

    // Step 4: Upload — explicitly pass contentType so Supabase doesn't guess
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType,          // ← KEY FIX: prevents silent rejection of HEIC/WebP on mobile
        });

    if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        throw new Error(
            uploadError.message ||
            'Upload failed. Check your internet connection and try again.'
        );
    }

    // Step 5: Return the public URL
    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};
