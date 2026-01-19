import { createClient } from '@/lib/supabase/server'
// Actually, for SEO and performance, we should keep it Server Component and use client islands.
// But to use full page transitions easily, let's make the page structure client-side or use a client wrapper.
// Strategy: Keep main page.tsx as Server Component for data fetching, pass data to a Client Component for rendering.

// Reverting to server component pattern for page.tsx, moving UI to a new client component.
import { notFound } from 'next/navigation'
import { PortfolioView } from '@/components/portfolio/portfolio-view'
import { getResumeData } from '@/app/editor/resume/actions'
import { Metadata } from 'next'

interface Props {
    params: Promise<{
        username: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('username', username)
        .single()

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('title, bio')
        .eq('slug', username) // Assuming slug usually matches username or we fetch by user_id
        .single()

    const title = profile?.full_name ? `${profile.full_name}의 포트폴리오` : '포트폴리오'
    const description = portfolio?.title || profile?.full_name || 'My-Folio Builder로 제작된 포트폴리오'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: profile?.avatar_url ? [profile.avatar_url] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: profile?.avatar_url ? [profile.avatar_url] : [],
        }
    }
}

export default async function PortfolioPage({ params }: Props) {
    const { username } = await params
    // Use createClient from server-side for data fetching
    const supabase = await createClient()

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // 2. Auth Check
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const isOwner = currentUser?.id === profile.id

    // 3. Visibility Check
    if (!isOwner) {
        if (profile.visibility === 'private') {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                    <h1 className="text-2xl font-bold mb-2">비공개 프로필입니다.</h1>
                    <p className="text-slate-500">이 사용자의 포트폴리오는 비공개 상태입니다.</p>
                </div>
            )
        }

        if (profile.visibility === 'friends_only') {
            // Check friendship
            const { data: friendship } = await supabase
                .from('friendships')
                .select('status')
                .or(`and(requester_id.eq.${currentUser?.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${currentUser?.id})`)
                .eq('status', 'accepted')
                .single()

            if (!friendship) {
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                        <h1 className="text-2xl font-bold mb-2">친구 전용 프로필입니다.</h1>
                        <p className="text-slate-500">이 사용자의 친구만 포트폴리오를 볼 수 있습니다.</p>
                    </div>
                )
            }
        }
    }

    // 4. Fetch Portfolio
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .single()

    // 5. Fetch Projects & Resume
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

        // Only owner can see resume data for now (per requirement "exclude resume for friends/public")
        if (isOwner) {
            resumeData = await getResumeData(portfolio.id)
        }
    }

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
