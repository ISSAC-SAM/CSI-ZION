import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sixgdsqjesrhllfhvvnn.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeGdkc3FqZXNyaGxsZmh2dm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODM2MDcsImV4cCI6MjEwNDM1OTYwN30.M-NpJXPRDQiZNfBmyc7KXu9dSXVRz54dNPDnwsTL1B8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log('Logging in as existing admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'saral@csizionattur.org',
        password: 'password123'
    });

    if (signInError) {
        console.error('Sign In Error:', signInError.message);
        return;
    }

    const session = signInData.session;
    console.log('Logged in successfully!');

    // Change email
    console.log('Updating email to csizionattur@gmail.com...');
    const { error: updateEmailError } = await supabase.auth.updateUser({
        email: 'csizionattur@gmail.com'
    });

    if (updateEmailError) {
        console.error('Update Email Error:', updateEmailError.message);
        // Maybe we just create a new admin?
    } else {
        console.log('Email updated successfully! Please check the emails for confirmation (if required).');
    }

    // Change password
    console.log('Updating password to Csi_zion1...');
    const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: 'Csi_zion1'
    });

    if (updatePasswordError) {
        console.error('Update Password Error:', updatePasswordError.message);
    } else {
        console.log('Password updated successfully!');
    }
}

main();
