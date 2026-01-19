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
 * Helper to sanitize resume items before saving to DB
 * - Trims all strings
 * - Converts empty strings to null (especially important for DATE/UUID columns)
 */
function sanitizeItems<T extends Record<string, any>>(items: T[]): T[] {
    return items.map(item => {
        const cleaned = { ...item } as any
        Object.keys(cleaned).forEach(key => {
            const val = cleaned[key]
            if (typeof val === 'string') {
                const trimmed = val.trim()
                cleaned[key] = trimmed === '' ? null : trimmed
            }
        })
        return cleaned as T
    })
}

/**
 * WORK EXPERIENCE ACTIONS
 */
export async function updateWorkExperience(portfolioId: string, items: WorkExperience[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const sanitized = sanitizeItems(items)

    // Use transactional RPC to avoid data loss
    const { error } = await supabase.rpc('update_resume_items', {
        p_portfolio_id: portfolioId,
        p_table_name: 'work_experiences',
        p_items: sanitized
    })

    if (error) return { error: error.message }
    revalidatePath('/editor/resume')
    return { success: true }
}

/**
 * EDUCATION ACTIONS
 */
export async function updateEducation(portfolioId: string, items: Education[]) {
    const supabase = await createClient()
    const sanitized = sanitizeItems(items)
    const { error } = await supabase.rpc('update_resume_items', {
        p_portfolio_id: portfolioId,
        p_table_name: 'educations',
        p_items: sanitized
    })

    if (error) return { error: error.message }
    revalidatePath('/editor/resume')
    return { success: true }
}

/**
 * AWARD ACTIONS
 */
export async function updateAwards(portfolioId: string, items: Award[]) {
    const supabase = await createClient()
    const sanitized = sanitizeItems(items)
    const { error } = await supabase.rpc('update_resume_items', {
        p_portfolio_id: portfolioId,
        p_table_name: 'awards',
        p_items: sanitized
    })

    if (error) return { error: error.message }
    revalidatePath('/editor/resume')
    return { success: true }
}

/**
 * CERTIFICATION ACTIONS
 */
export async function updateCertifications(portfolioId: string, items: Certification[]) {
    const supabase = await createClient()
    const sanitized = sanitizeItems(items)
    const { error } = await supabase.rpc('update_resume_items', {
        p_portfolio_id: portfolioId,
        p_table_name: 'certifications',
        p_items: sanitized
    })

    if (error) return { error: error.message }
    revalidatePath('/editor/resume')
    return { success: true }
}

/**
 * LANGUAGE CERTIFICATION ACTIONS
 */
export async function updateLanguageCerts(portfolioId: string, items: LanguageCertification[]) {
    const supabase = await createClient()
    const sanitized = sanitizeItems(items)
    const { error } = await supabase.rpc('update_resume_items', {
        p_portfolio_id: portfolioId,
        p_table_name: 'language_certs',
        p_items: sanitized
    })

    if (error) return { error: error.message }
    revalidatePath('/editor/resume')
    return { success: true }
}
