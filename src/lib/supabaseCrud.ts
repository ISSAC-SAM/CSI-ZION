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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
};
