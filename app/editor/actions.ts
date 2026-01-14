'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string
    const username = formData.get('username') as string

    // Update Profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, username })
        .eq('id', user.id)

    if (profileError) {
        return { error: profileError.message }
    }

    // Handle Portfolio Data
    const title = formData.get('title') as string
    const bio = formData.get('bio') as string
    const slug = formData.get('slug') as string
    const skills = formData.get('skills') as string // received as a comma-separated string for now

    // Upsert Portfolio (we assume one per user for now, but RLS checks user_id)
    // First check if portfolio exists to get ID, or just upsert based on user_id if we had a unique constraint on user_id?
    // Our schema doesn't enforce unique user_id on portfolios but RLS restricts. 
    // Let's first try to find existing portfolio.
    const { data: existing } = await supabase.from('portfolios').select('id').eq('user_id', user.id).single()

    let portfolioError
    if (existing) {
        const { error } = await supabase
            .from('portfolios')
            .update({
                title,
                bio,
                slug,
                skills: skills ? skills.split(',').map(s => s.trim()) : [],
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
        portfolioError = error
    } else {
        const { error } = await supabase
            .from('portfolios')
            .insert({
                user_id: user.id,
                title,
                bio,
                slug,
                skills: skills ? skills.split(',').map(s => s.trim()) : [],
            })
        portfolioError = error
    }

    if (portfolioError) {
        return { error: portfolioError.message }
    }

    revalidatePath('/editor')
    return { success: true }
}
