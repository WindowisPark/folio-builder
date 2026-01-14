'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Provider } from '@supabase/supabase-js'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // OAuth Removed


    // Fallback to Email/Password (keeping it for now or removing? User said "recommended code remove just oauth".
    // "Invitation code remove just Oauth". It implies removing invitation code.
    // I will keep email/password login as an option but remove invitation logic from signup.
    // But strictly speaking, "Just OAuth" might mean ONLY OAuth.
    // I'll keep Email/Password as standard, but add OAuth.
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) redirect('/login?error=Could not authenticate user')
        revalidatePath('/', 'layout')
        redirect('/editor')
    }
}


export async function signup(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for convenience
    // In a production app, you might want to validate these
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
