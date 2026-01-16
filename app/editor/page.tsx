import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditorForm } from './editor-form'
import Link from 'next/link'
import { FolderOpen, ExternalLink, FileText, Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as motion from 'framer-motion/client'

export default async function EditorPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Profile & Portfolio
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Count projects
    const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 shadow-none border-none">
            {/* Hero/Intro Area */}
            <div className="mb-12 space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-surface)] text-[var(--text-secondary)] rounded-full w-fit border border-[var(--border-color)]">
                    <Sparkles size={10} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Workspace</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-[calc(-0.05em)] text-slate-900 leading-[0.9]">
                    BUILD YOUR<br />
                    <span className="text-[var(--primary)] underline decoration-[6px] decoration-[var(--primary)]/10 underline-offset-[12px]">IDENTITY.</span>
                </h2>
                <p className="text-[var(--text-secondary)] font-medium text-lg max-w-lg leading-relaxed pt-4">
                    당신의 기술과 경험을 가장 세련된 방식으로 정의하세요.
                </p>
            </div>

            {/* Dashboard Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {/* Project Card */}
                <Link href="/editor/projects" className="group">
                    <div className="relative h-full overflow-hidden bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-sm hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                        <div className="space-y-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] text-[var(--text-muted)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                                <FolderOpen size={20} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] tracking-tight">Projects</h3>
                                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                    {projectCount || 0} ITEMS SAVED
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Resume Card */}
                <Link href="/editor/resume" className="group">
                    <div className="relative h-full overflow-hidden bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-sm hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                        <div className="space-y-8 relative z-10 font-bold">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] text-[var(--text-muted)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] tracking-tight">Resume</h3>
                                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                    CAREER & EDUCATION
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Live Site Card */}
                {profile?.username && (
                    <Link href={`/${profile.username}`} className="group">
                        <div className="relative h-full overflow-hidden bg-[var(--text-primary)] p-8 rounded-[2rem] border border-[var(--text-primary)] shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-500">
                            <div className="space-y-8 relative z-10 font-bold">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--background)]/10 text-[var(--background)] flex items-center justify-center group-hover:bg-[var(--primary)] transition-all duration-500">
                                    <ExternalLink size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-black text-xl text-[var(--background)] tracking-tight">Live Preview</h3>
                                        <ChevronRight className="w-5 h-5 text-[var(--background)]/40 group-hover:text-[var(--background)] group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-xs text-[var(--background)]/60 font-bold tracking-tight truncate">
                                        /{profile.username}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">CORE PROFILE SETTINGS</span>
                <div className="h-px bg-[var(--border-color)] flex-1" />
            </div>

            {/* Form Container */}
            <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl shadow-slate-200/50 overflow-hidden p-8 md:p-12 relative">
                <EditorForm
                    defaultProfile={profile}
                    defaultPortfolio={portfolio}
                    userId={user.id}
                />
            </div>
        </div>
    )
}
