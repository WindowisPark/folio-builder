'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type Project = {
    id: string
    portfolio_id: string
    name: string
    description: string | null
    url: string | null
    image_url: string | null
    project_type: 'main' | 'toy'
    tech_stack: string[]
    display_order: number
    created_at: string
    updated_at: string
}

export async function getProjects(): Promise<{ data: Project[] | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // Get user's portfolio first
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!portfolio) {
        return { data: [], error: null }
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data: data as Project[], error: null }
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Get or create portfolio
    let { data: portfolio } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!portfolio) {
        // Create portfolio if doesn't exist
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()

        const slug = profile?.username || user.id.slice(0, 8)

        const { data: newPortfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .insert({ user_id: user.id, slug })
            .select('id')
            .single()

        if (portfolioError) {
            return { success: false, error: portfolioError.message }
        }
        portfolio = newPortfolio
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const url = formData.get('url') as string | null
    const imageUrl = formData.get('imageUrl') as string | null
    const projectType = (formData.get('projectType') as 'main' | 'toy') || 'toy'
    const techStackStr = formData.get('techStack') as string | null
    const techStack = techStackStr ? techStackStr.split(',').map(s => s.trim()).filter(Boolean) : []

    const { error } = await supabase
        .from('projects')
        .insert({
            portfolio_id: portfolio.id,
            name,
            description,
            url,
            image_url: imageUrl,
            project_type: projectType,
            tech_stack: techStack,
        })

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/editor/projects')
    return { success: true, error: null }
}

export async function updateProject(formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const url = formData.get('url') as string | null
    const imageUrl = formData.get('imageUrl') as string | null
    const projectType = (formData.get('projectType') as 'main' | 'toy') || 'toy'
    const techStackStr = formData.get('techStack') as string | null
    const techStack = techStackStr ? techStackStr.split(',').map(s => s.trim()).filter(Boolean) : []

    const { error } = await supabase
        .from('projects')
        .update({
            name,
            description,
            url,
            image_url: imageUrl,
            project_type: projectType,
            tech_stack: techStack,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/editor/projects')
    return { success: true, error: null }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/editor/projects')
    return { success: true, error: null }
}

export async function reorderProjects(orderedIds: string[]): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Update each project's display_order
    for (let i = 0; i < orderedIds.length; i++) {
        const { error } = await supabase
            .from('projects')
            .update({ display_order: i })
            .eq('id', orderedIds[i])

        if (error) {
            return { success: false, error: error.message }
        }
    }

    revalidatePath('/editor/projects')
    return { success: true, error: null }
}
