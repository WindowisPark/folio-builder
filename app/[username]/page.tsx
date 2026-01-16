import { createClient } from '@/lib/supabase/server'
// Actually, for SEO and performance, we should keep it Server Component and use client islands.
// But to use full page transitions easily, let's make the page structure client-side or use a client wrapper.
// Strategy: Keep main page.tsx as Server Component for data fetching, pass data to a Client Component for rendering.

// Reverting to server component pattern for page.tsx, moving UI to a new client component.
import { notFound } from 'next/navigation'
import { PortfolioView } from '@/components/portfolio/portfolio-view'
import { getResumeData } from '@/app/editor/resume/actions'

interface Props {
    params: Promise<{
        username: string
    }>
}

export default async function PortfolioPage({ params }: Props) {
    const { username } = await params
    // Use createClient from server-side for data fetching
    const supabase = await createClient()

    // Fetch Profile by Username
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // Fetch Portfolio by User ID
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .single()

    // Fetch Projects (1:N)
    let mainProjects: any[] = []
    let toyProjects: any[] = []
    let resumeData: any = { work: [], education: [], awards: [], certifications: [], languages: [] }

    if (portfolio) {
        const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .eq('portfolio_id', portfolio.id)
            .order('display_order', { ascending: true })

        if (projects) {
            mainProjects = projects.filter(p => p.project_type === 'main')
            toyProjects = projects.filter(p => p.project_type === 'toy')
        }

        // Fetch Resume Data
        resumeData = await getResumeData(portfolio.id)
    }

    // Check for authenticated user to see if they are the owner
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const isOwner = currentUser?.id === profile.id

    return (
        <PortfolioView
            profile={profile}
            portfolio={portfolio}
            mainProjects={mainProjects}
            toyProjects={toyProjects}
            resumeData={resumeData}
            isOwner={isOwner}
        />
    )
}
