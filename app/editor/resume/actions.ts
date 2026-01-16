'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Common types for Resume data
 */
export type WorkExperience = {
    id: string
    portfolio_id: string
    company_name: string
    role: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string | null
    display_order: number
}

export type Education = {
    id: string
    portfolio_id: string
    school_name: string
    degree: string | null
    major: string | null
    status: string | null // e.g. 졸업, 재학, 중퇴
    start_date: string
    end_date: string | null
    is_current: boolean
    display_order: number
}

export type Award = {
    id: string
    portfolio_id: string
    title: string
    issuer: string | null
    date: string
    description: string | null
    display_order: number
}

export type Certification = {
    id: string
    portfolio_id: string
    name: string
    issuer: string | null
    date: string
    credential_url: string | null
    file_url: string | null // New
    display_order: number
}

export type LanguageCertification = {
    id: string
    portfolio_id: string
    language: string
    test_name: string
    score: string | null
    date: string
    file_url: string | null
    display_order: number
}

/**
 * GET ALL RESUME DATA
 */
export async function getResumeData(portfolioId: string) {
    const supabase = await createClient()

    const [
        { data: work },
        { data: edu },
        { data: awards },
        { data: certs },
        { data: languages }
    ] = await Promise.all([
        supabase.from('work_experiences').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true }),
        supabase.from('educations').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true }),
        supabase.from('awards').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true }),
        supabase.from('certifications').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true }),
        supabase.from('language_certs').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true })
    ])

    return {
        work: work || [],
        education: edu || [],
        awards: awards || [],
        certifications: certs || [],
        languages: languages || []
    }
}

/**
 * WORK EXPERIENCE ACTIONS
 */
export async function updateWorkExperience(portfolioId: string, items: any[]) {
    const supabase = await createClient()

    // Simplified approach: Delete and re-insert for the demo-like scale, 
    // or properly upsert. Let's do a more robust upsert/delete logic.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // First delete items not in the new list
    const incomingIds = items.filter(i => i.id).map(i => i.id)
    if (incomingIds.length > 0) {
        await supabase.from('work_experiences').delete().eq('portfolio_id', portfolioId).not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
        await supabase.from('work_experiences').delete().eq('portfolio_id', portfolioId)
    }

    // Upsert remaining
    const { error } = await supabase.from('work_experiences').upsert(
        items.map((item, index) => ({
            ...item,
            portfolio_id: portfolioId,
            display_order: index,
            id: item.id || undefined // Let Postgres generate if new
        }))
    )

    if (error) return { error: error.message }
    revalidatePath('/editor')
    return { success: true }
}

/**
 * EDUCATION ACTIONS
 */
export async function updateEducation(portfolioId: string, items: any[]) {
    const supabase = await createClient()
    const incomingIds = items.filter(i => i.id).map(i => i.id)

    if (incomingIds.length > 0) {
        await supabase.from('educations').delete().eq('portfolio_id', portfolioId).not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
        await supabase.from('educations').delete().eq('portfolio_id', portfolioId)
    }

    const { error } = await supabase.from('educations').upsert(
        items.map((item, index) => ({
            ...item,
            portfolio_id: portfolioId,
            display_order: index,
            id: item.id || undefined
        }))
    )

    if (error) return { error: error.message }
    revalidatePath('/editor')
    return { success: true }
}

/**
 * AWARD ACTIONS
 */
export async function updateAwards(portfolioId: string, items: any[]) {
    const supabase = await createClient()
    const incomingIds = items.filter(i => i.id).map(i => i.id)

    if (incomingIds.length > 0) {
        await supabase.from('awards').delete().eq('portfolio_id', portfolioId).not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
        await supabase.from('awards').delete().eq('portfolio_id', portfolioId)
    }

    const { error } = await supabase.from('awards').upsert(
        items.map((item, index) => ({
            ...item,
            portfolio_id: portfolioId,
            display_order: index,
            id: item.id || undefined
        }))
    )

    if (error) return { error: error.message }
    revalidatePath('/editor')
    return { success: true }
}

/**
 * CERTIFICATION ACTIONS
 */
export async function updateCertifications(portfolioId: string, items: any[]) {
    const supabase = await createClient()
    const incomingIds = items.filter(i => i.id).map(i => i.id)

    if (incomingIds.length > 0) {
        await supabase.from('certifications').delete().eq('portfolio_id', portfolioId).not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
        await supabase.from('certifications').delete().eq('portfolio_id', portfolioId)
    }

    const { error } = await supabase.from('certifications').upsert(
        items.map((item, index) => ({
            ...item,
            portfolio_id: portfolioId,
            display_order: index,
            id: item.id || undefined
        }))
    )

    if (error) return { error: error.message }
    revalidatePath('/editor')
    return { success: true }
}

/**
 * LANGUAGE CERTIFICATION ACTIONS
 */
export async function updateLanguageCerts(portfolioId: string, items: any[]) {
    const supabase = await createClient()
    const incomingIds = items.filter(i => i.id).map(i => i.id)

    if (incomingIds.length > 0) {
        await supabase.from('language_certs').delete().eq('portfolio_id', portfolioId).not('id', 'in', `(${incomingIds.join(',')})`)
    } else {
        await supabase.from('language_certs').delete().eq('portfolio_id', portfolioId)
    }

    const { error } = await supabase.from('language_certs').upsert(
        items.map((item, index) => ({
            ...item,
            portfolio_id: portfolioId,
            display_order: index,
            id: item.id || undefined
        }))
    )

    if (error) return { error: error.message }
    revalidatePath('/editor')
    return { success: true }
}
