import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sixgdsqjesrhllfhvvnn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2]; // Passed as argument

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Creating saral@csizionattur.org...');

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'saral@csizionattur.org',
        password: 'password123',
        email_confirm: true
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log('Created user with ID:', userId);

    // 2. Insert into Profiles as ADMIN
    const { error: profileError } = await supabase.from('profiles').insert([
        {
            id: userId,
            email: 'saral@csizionattur.org',
            full_name: 'Saral',
            role: 'ADMIN',
            status: 'ACTIVE'
        }
    ]);

    if (profileError) {
        console.error('Profile Error:', profileError.message);
    } else {
        console.log('Successfully added to profiles as ADMIN!');
    }
}

main();
