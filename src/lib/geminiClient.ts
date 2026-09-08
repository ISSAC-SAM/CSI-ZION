import { supabase } from './supabaseClient';

export const fetchAIResponse = async (query: string): Promise<string> => {
    try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session?.access_token) {
            throw new Error("You must be logged in to access the AI Assistant.");
        }

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-gemini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.access_token}`
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to communicate with AI endpoint.");
        }

        const data = await response.json();
        return data.reply;
    } catch (error: any) {
        console.error("AI Assistant Error:", error);
        return error.message || "I am currently unable to access the church knowledge base.";
    }
};
