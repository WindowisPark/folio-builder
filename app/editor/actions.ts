'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

const profileSchema = z.object({
    fullName: z.string().min(2),
    username: z.string().min(3),
    website: z.string().url().or(z.literal('')).optional(),
    githubUrl: z.string().url().or(z.literal('')).optional(),
    linkedinUrl: z.string().url().or(z.literal('')).optional(),
    title: z.string().optional(),
    bio: z.string().max(500).optional(),
    slug: z.string().min(3),
    skills: z.string().optional(),
    visibility: z.enum(['public', 'friends_only', 'private']).default('public')
})

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const rawData = {
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
        website: formData.get('website') as string,
        githubUrl: formData.get('githubUrl') as string,
        linkedinUrl: formData.get('linkedinUrl') as string,
        title: formData.get('title') as string,
        bio: formData.get('bio') as string,
        slug: formData.get('slug') as string,
        skills: formData.get('skills') as string,
        visibility: (formData.get('visibility') as any) || 'public'
    }

    const validation = profileSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { data: values } = validation

    // Update Profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: values.fullName,
            username: values.username,
            website: values.website,
            github_url: values.githubUrl,
            linkedin_url: values.linkedinUrl,
            visibility: values.visibility,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (profileError) {
        return { error: profileError.message }
    }

    // Handle Portfolio Data
    const { data: existing } = await supabase.from('portfolios').select('id').eq('user_id', user.id).single()

    let portfolioError
    const portfolioData = {
        title: values.title,
        bio: values.bio,
        slug: values.slug,
        skills: values.skills ? values.skills.split(',').map(s => s.trim()) : [],
        updated_at: new Date().toISOString()
    }

    if (existing) {
        const { error } = await supabase
            .from('portfolios')
            .update(portfolioData)
            .eq('id', existing.id)
        portfolioError = error
    } else {
        const { error } = await supabase
            .from('portfolios')
            .insert({
                ...portfolioData,
                user_id: user.id,
            })
        portfolioError = error
    }

    if (portfolioError) {
        return { error: portfolioError.message }
    }

    revalidatePath('/editor')
    return { success: true }
}
