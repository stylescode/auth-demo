import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/server';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    console.log('Attempting to create user:', email);

    // Use Supabase Admin client to create a new user
    const { data, error } = await supabaseAdmin.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 201 });
}
