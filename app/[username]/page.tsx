import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProjectCard } from '@/components/portfolio/project-card'
import { Github, Linkedin, Mail, Globe } from 'lucide-react'

interface Props {
    params: Promise<{
        username: string
    }>
}

type Project = {
    id: string
    name: string
    description: string | null
    url: string | null
    image_url: string | null
    project_type: 'main' | 'toy'
    tech_stack: string[]
}

export default async function PortfolioPage({ params }: Props) {
    const { username } = await params
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

    // Fetch Projects
    let mainProjects: Project[] = []
    let toyProjects: Project[] = []

    if (portfolio) {
        const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .eq('portfolio_id', portfolio.id)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })

        if (projects) {
            mainProjects = projects.filter(p => p.project_type === 'main') as Project[]
            toyProjects = projects.filter(p => p.project_type === 'toy') as Project[]
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Nav */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto max-w-5xl px-6 py-4 flex justify-between items-center">
                    <Link href={`/${username}`} className="font-bold text-xl tracking-tight hover:text-gray-600 transition-colors">
                        {profile.full_name || username}
                    </Link>
                    <nav className="flex items-center gap-6">
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-black transition-colors"
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            홈
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-6 py-16 space-y-20">
                {/* Hero Section */}
                <section className="space-y-6 max-w-3xl">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        {portfolio?.title || "크리에이티브 개발자"}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                        {portfolio?.bio || "의미 있는 디지털 경험을 만듭니다."}
                    </p>

                    {portfolio?.skills && (portfolio.skills as string[]).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {(portfolio.skills as string[]).map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* Main Projects Section */}
                {mainProjects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">주요 프로젝트</h2>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                {mainProjects.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mainProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    name={project.name}
                                    description={project.description}
                                    url={project.url}
                                    imageUrl={project.image_url}
                                    techStack={project.tech_stack || []}
                                    type="main"
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Toy Projects Section */}
                {toyProjects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">토이 프로젝트</h2>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                {toyProjects.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {toyProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    name={project.name}
                                    description={project.description}
                                    url={project.url}
                                    imageUrl={project.image_url}
                                    techStack={project.tech_stack || []}
                                    type="toy"
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {mainProjects.length === 0 && toyProjects.length === 0 && (
                    <section className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">프로젝트 준비 중</h3>
                        <p className="text-gray-500">곧 멋진 작업물을 공개할 예정입니다!</p>
                    </section>
                )}
            </main>

            <footer className="border-t border-gray-100 py-12">
                <div className="container mx-auto max-w-5xl px-6 text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} {profile.full_name || username}. My-Folio로 제작됨
                    </p>
                </div>
            </footer>
        </div>
    )
}
