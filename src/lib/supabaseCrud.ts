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
    // Step 1: Check File Size (Supabase or mobile connections often fail silently for very large files)
    const MAX_MB = 10; // 10MB limit
    if (file.size > MAX_MB * 1024 * 1024) {
        throw new Error(`The image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose an image smaller than ${MAX_MB}MB.`);
    }

    // Step 2: Ensure a clean, safe filename structure (mobile devices sometimes give weird names or emojis)
    const originalName = file.name || 'mobile_upload.jpg';
    const fileExt = originalName.includes('.') ? originalName.split('.').pop()?.toLowerCase() : 'jpg';

    // Create a guaranteed unique, URL-safe filename using timestamp + random string
    const safeRandom = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}-${safeRandom}.${fileExt}`;

    // Step 3: Upload with specific content options
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error("Storage upload error details:", uploadError);
        throw new Error(uploadError.message || 'Failed to upload to storage bucket.');
    }

    // Step 4: Get and return the public URL
    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};
