import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SmartList } from '@/components/ui/smart-list'
import { ArrowLeft, ExternalLink, Sparkles, AlertCircle, CheckCircle2, Wrench } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ username: string, id: string }>
}) {
    const { username, id } = await params
    const supabase = await createClient()


    // 1. Fetch project by slug OR id (fallback)
    let { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .maybeSingle()

    if (!project) {
        // Fallback to ID
        const { data: projectById, error: idError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle()
        project = projectById
        projectError = idError
    }

    if (projectError || !project) {
        notFound()
    }

    // 2. Verify ownership via portfolio
    const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select(`id, user_id`)
        .eq('id', project.portfolio_id)
        .maybeSingle()

    if (portfolioError || !portfolio) {
        notFound()
    }

    // 3. Verify occupancy (username match)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', portfolio.user_id)
        .maybeSingle()

    if (profileError || !profile) {
        notFound()
    }

    // Case-insensitive comparison is safer
    if (profile.username?.toLowerCase() !== username?.toLowerCase()) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 border-t-4 border-indigo-600">
            {/* Project Header */}
            <header className="container mx-auto max-w-4xl px-6 py-12 md:py-24 space-y-8">
                <Link href={`/${username}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.map((tech: string) => (
                            <span key={tech} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-400">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-slate-900">
                        {project.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="rounded-full px-8 h-14 bg-slate-900 hover:bg-black text-white font-bold gap-2 shadow-xl shadow-slate-200">
                                <ExternalLink size={18} />
                                Visit Live Project
                            </Button>
                        </a>
                    )}
                </div>
            </header>

            {/* Featured Image */}
            {project.image_url && (
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="aspect-video rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                        <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
                    </div>
                </div>
            )}

            {/* Case Study Content */}
            <main className="container mx-auto max-w-4xl px-6 py-24 space-y-24">
                {/* Background Section */}
                {project.long_description && (
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                                <Sparkles size={14} />
                                Background
                            </h2>
                        </div>
                        <div className="md:col-span-8">
                            <SmartList
                                text={project.long_description}
                                className="text-xl md:text-2xl font-light leading-relaxed text-slate-700"
                            />
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Challenges */}
                    {project.challenges && (
                        <CardWrapper title="Challenges" icon={<AlertCircle className="text-red-500" />} text={project.challenges} />
                    )}
                    {/* Solutions */}
                    {project.solutions && (
                        <CardWrapper title="Solutions" icon={<CheckCircle2 className="text-emerald-500" />} text={project.solutions} />
                    )}
                </div>

                {/* Troubleshooting */}
                {project.troubleshooting && (
                    <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
                        <div className="space-y-4 relative z-10">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
                                <Wrench size={14} />
                                Troubleshooting
                            </h2>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">The technical deep dive.</h3>
                        </div>
                        <SmartList
                            text={project.troubleshooting}
                            className="text-lg md:text-xl text-slate-400 font-light relative z-10"
                        />
                    </section>
                )}

            </main>
        </div>
    )
}

function CardWrapper({ title, icon, text }: { title: string, icon: React.ReactNode, text: string }) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                {icon}
                {title}
            </h3>
            <SmartList
                text={text}
                className="text-lg text-slate-600 font-light"
            />
        </div>
    )
}
