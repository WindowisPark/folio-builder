'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Mail, Github, Linkedin, ExternalLink, Sparkles, ArrowRight, Edit3, FileText } from 'lucide-react'
import { ProjectCard } from './project-card'
import { Button } from '@/components/ui/button'
import { SmartList } from '@/components/ui/smart-list'

interface PortfolioViewProps {
    profile: any
    portfolio: any
    mainProjects: any[]
    toyProjects: any[]
    resumeData?: {
        work: any[]
        education: any[]
        awards: any[]
        certifications: any[]
        languages: any[]
    }
    isOwner?: boolean
}

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
}

export function PortfolioView({
    profile,
    portfolio,
    mainProjects,
    toyProjects,
    resumeData = { work: [], education: [], awards: [], certifications: [], languages: [] },
    isOwner = false
}: PortfolioViewProps) {
    const { work = [], education = [], awards = [], certifications = [], languages = [] } = resumeData || {}
    return (
        <div className="min-h-screen bg-[var(--bg-portfolio)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-[var(--bg-portfolio)] transition-colors duration-500 word-break-keep-all">
            {/* Owner Shortcut */}
            {isOwner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="fixed bottom-8 right-8 z-[100] print:hidden"
                >
                    <Link
                        href="/editor"
                        className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--background)] px-8 py-4 rounded-full shadow-2xl hover:scale-110 hover:opacity-90 transition-all font-bold group"
                    >
                        <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                        에디터로 돌아가기
                    </Link>
                </motion.div>
            )}

            {/* Header - Transparent & Minimal */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 left-0 right-0 z-50 print:hidden"
                style={{ mixBlendMode: 'var(--header-mix-blend)' as any }}
            >
                <div className="container mx-auto max-w-[794px] px-8 py-8 flex justify-between items-center">
                    <Link href="/" className="font-black text-2xl tracking-tighter text-[var(--text-primary)] group">
                        {profile.username}<span className="text-[var(--accent)] group-hover:animate-pulse">.</span>
                    </Link>
                    <nav className="flex gap-4 text-sm font-medium items-center">
                        <Link href={`/${profile.username}/resume`}>
                            <Button variant="outline" size="sm" className="rounded-full border-[var(--text-primary)] border text-[var(--text-primary)] font-bold hover:bg-[var(--text-primary)] hover:text-[var(--background)] transition-all px-6 text-xs uppercase tracking-widest">
                                Resume
                            </Button>
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-2.5 rounded-full font-black hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95 tracking-tight text-xs uppercase"
                        >
                            Export
                        </button>
                    </nav>
                </div>
            </motion.header>

            <main className="container mx-auto max-w-[850px] px-8 py-32 md:py-48 print:max-w-full print:py-0 print:px-0">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="space-y-24 print:space-y-12"
                >
                    {/* Hero Section */}
                    <motion.section variants={itemVars} className="space-y-8">
                        <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight print:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--accent)]">
                                {portfolio?.title || "Crafting digital experiences."}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed font-light print:text-lg">
                            {portfolio?.bio || "Code, design, and everything in between. Focused on building clean and functional products."}
                        </p>

                        <div className="flex gap-4 pt-4 print:hidden">
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full hover:bg-[var(--accent)] hover:text-[var(--bg-portfolio)] transition-colors" title="Website">
                                    <Globe size={18} />
                                </a>
                            )}
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full hover:bg-[var(--accent)] hover:text-[var(--bg-portfolio)] transition-colors" title="GitHub">
                                    <Github size={18} />
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full hover:bg-[var(--accent)] hover:text-[var(--bg-portfolio)] transition-colors" title="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {profile.email && (
                                <a href={`mailto:${profile.email}`} className="p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full hover:bg-[var(--accent)] hover:text-[var(--bg-portfolio)] transition-colors" title="Email">
                                    <Mail size={18} />
                                </a>
                            )}
                        </div>

                        {/* Skills - Tag Cloud */}
                        {portfolio?.skills && (
                            <div className="flex flex-wrap gap-2 pt-4">
                                {(portfolio.skills as string[]).map((skill, i) => (
                                    <span key={i} className="px-3 py-1 border border-[var(--border-color)] rounded-full text-sm font-medium text-[var(--text-secondary)] print:border-black">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.section>

                    {/* Work Experience */}
                    {work.length > 0 && (
                        <motion.section variants={itemVars} className="space-y-12">
                            <div className="flex items-baseline justify-between border-b-2 border-[var(--text-primary)] pb-2">
                                <h2 className="text-lg font-bold uppercase tracking-tighter text-[var(--text-primary)]">Work History</h2>
                                <span className="text-xs font-mono text-[var(--text-secondary)]">{work.length} Entries</span>
                            </div>

                            <div className="space-y-16">
                                {work.map((exp: any) => (
                                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                                        <div className="text-xs font-bold text-[var(--text-muted)] font-mono pt-1 uppercase tracking-widest">
                                            {exp.start_date.substring(0, 7)} — {exp.is_current ? 'Present' : exp.end_date?.substring(0, 7)}
                                        </div>
                                        <div className="md:col-span-3 space-y-4">
                                            <div>
                                                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{exp.company_name}</h3>
                                                <p className="text-sm font-black text-[var(--primary)] uppercase tracking-[0.2em] mt-1">{exp.role}</p>
                                            </div>
                                            <SmartList
                                                text={exp.description}
                                                className="text-lg text-[var(--text-secondary)] font-light"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Main Projects Grid */}
                    {mainProjects.length > 0 && (
                        <motion.section variants={itemVars}>
                            <div className="flex items-baseline justify-between mb-8 border-b border-[var(--border-color)] pb-2 print:mb-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Selected Projects</h2>
                                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase print:hidden">{mainProjects.length} Items</span>
                            </div>

                            <div className="grid grid-cols-1 gap-16 print:grid-cols-2 print:gap-4">
                                {mainProjects.map((project) => (
                                    <ProjectCardWrapper
                                        key={project.id}
                                        project={project}
                                        username={profile.username}
                                    />
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Toy Projects Grid */}
                    {toyProjects.length > 0 && (
                        <motion.section variants={itemVars}>
                            <div className="flex items-baseline justify-between mb-8 border-b border-[var(--border-color)] pb-2 print:mb-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Experiments / Additional Works</h2>
                                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase print:hidden">{toyProjects.length} Items</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-3 print:gap-3">
                                {toyProjects.map((project) => (
                                    <ProjectCardWrapper
                                        key={project.id}
                                        project={project}
                                        username={profile.username}
                                        type="toy"
                                    />
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <motion.section variants={itemVars} className="space-y-12">
                            <div className="flex items-baseline justify-between border-b-2 border-[var(--text-primary)] pb-2">
                                <h2 className="text-lg font-bold uppercase tracking-tighter text-[var(--text-primary)]">Education</h2>
                            </div>

                            <div className="space-y-10">
                                {education.map((edu: any) => (
                                    <div key={edu.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                                        <div className="text-sm font-bold text-[var(--text-muted)] font-mono pt-1">
                                            {edu.start_date.substring(0, 4)} — {edu.is_current ? 'Present' : edu.end_date?.substring(0, 4)}
                                        </div>
                                        <div className="md:col-span-3">
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{edu.school_name}</h3>
                                            <p className="text-lg text-[var(--text-secondary)] font-medium mt-1 flex items-center gap-2">
                                                {edu.degree} in {edu.major}
                                                {edu.status && (
                                                    <span className="text-[10px] px-2 py-0.5 bg-[var(--color-surface)] text-[var(--text-muted)] rounded-sm font-black uppercase tracking-widest border border-[var(--border-color)]">
                                                        {edu.status}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Awards & Certs */}
                    {(awards.length > 0 || certifications.length > 0) && (
                        <motion.section variants={itemVars}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {awards.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-baseline justify-between border-b-2 border-[var(--text-primary)] pb-2">
                                            <h2 className="text-lg font-bold uppercase tracking-tighter text-[var(--text-primary)]">Awards</h2>
                                        </div>
                                        <div className="space-y-8">
                                            {awards.map((award: any) => (
                                                <div key={award.id} className="space-y-2">
                                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{award.title}</h3>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[var(--text-secondary)] font-medium">{award.issuer}</span>
                                                        <span className="text-[var(--text-muted)] font-mono">{award.date.substring(0, 7)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {certifications.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-baseline justify-between border-b-2 border-[var(--text-primary)] pb-2">
                                            <h2 className="text-lg font-bold uppercase tracking-tighter text-[var(--text-primary)]">Certifications</h2>
                                        </div>
                                        <div className="space-y-8">
                                            {certifications.map((cert: any) => (
                                                <div key={cert.id} className="space-y-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h3 className="text-lg font-bold text-[var(--text-primary)] flex-1">{cert.name}</h3>
                                                        <div className="flex gap-2 print:hidden shrink-0">
                                                            {cert.file_url && (
                                                                <a href={cert.file_url} target="_blank" className="p-1.5 bg-[var(--color-surface)] text-[var(--text-primary)] rounded-md hover:bg-[var(--border-color)] transition-colors" title="View Proof">
                                                                    <FileText size={14} />
                                                                </a>
                                                            )}
                                                            {cert.credential_url && (
                                                                <a href={cert.credential_url} target="_blank" className="p-1.5 bg-[var(--color-surface)] text-[var(--text-primary)] rounded-md hover:bg-[var(--border-color)] transition-colors" title="Credential URL">
                                                                    <ExternalLink size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[var(--text-secondary)] font-medium">{cert.issuer}</span>
                                                        <span className="text-[var(--text-muted)] font-mono">{cert.date.substring(0, 7)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}

                    {/* Languages Certifications */}
                    {languages.length > 0 && (
                        <motion.section variants={itemVars}>
                            <div className="flex items-baseline justify-between mb-8 border-b-2 border-[var(--text-primary)] pb-2">
                                <h2 className="text-lg font-bold uppercase tracking-tighter text-[var(--text-primary)]">Language Certifications</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {languages.map((lang: any) => (
                                    <div key={lang.id} className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{lang.language}</h3>
                                                <p className="text-[var(--primary)] font-black text-xs tracking-widest uppercase">{lang.test_name}</p>
                                            </div>
                                            <div className="bg-[var(--color-surface)] text-[var(--text-primary)] border border-[var(--border-color)] px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-colors">
                                                {lang.score}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-mono text-[var(--text-muted)]">{lang.date.substring(0, 7)}</p>
                                            {lang.file_url && (
                                                <a
                                                    href={lang.file_url}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-[var(--text-primary)] text-[var(--background)] rounded-full hover:bg-[var(--primary)] transition-colors print:hidden"
                                                >
                                                    View Proof <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    <motion.footer variants={itemVars} className="pt-24 pb-12 text-center print:hidden border-t border-[var(--border-color)]">
                        <div className="inline-block w-8 h-1 bg-[var(--accent)] mb-8"></div>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {profile.full_name} &copy; {new Date().getFullYear()}
                        </p>
                    </motion.footer>

                </motion.div>
            </main>
            <TypographyStyles />
        </div>
    )
}

function ProjectCardWrapper({ project, username, type = 'main' }: { project: any, username: string, type?: 'main' | 'toy' }) {
    if (type === 'toy') {
        return (
            <div className="group block break-inside-avoid">
                {!project.image_url ? (
                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl transition-all hover:border-[var(--accent)] hover:shadow-xl hover:shadow-blue-500/5 group relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{project.name}</h3>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                {project.long_description && (
                                    <Link href={`/${username}/project/${project.slug || project.id}`} className="p-1.5 bg-[var(--color-surface)] text-[var(--text-secondary)] rounded-full hover:text-[var(--primary)]" title="Case Study">
                                        <Sparkles size={14} />
                                    </Link>
                                )}
                                {project.url && (
                                    <a href={project.url} target="_blank" className="p-1.5 bg-[var(--color-surface)] text-[var(--text-secondary)] rounded-full hover:text-[var(--primary)]">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-3 font-light">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.tech_stack?.slice(0, 3).map((t: string) => (
                                <span key={t} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]"># {t}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="aspect-[4/3] bg-[var(--card-bg)] border border-[var(--border-color)] mb-4 overflow-hidden rounded-2xl relative group-hover:border-[var(--accent)] transition-all">
                            <img src={project.image_url} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                {project.long_description && (
                                    <Link href={`/${username}/project/${project.id}`} className="p-2 bg-[var(--bg-portfolio)] text-[var(--text-primary)] rounded-full shadow-sm border border-[var(--border-color)] hover:text-[var(--primary)]" title="Case Study">
                                        <Sparkles size={16} />
                                    </Link>
                                )}
                                {project.url && (
                                    <a href={project.url} target="_blank" className="p-2 bg-[var(--bg-portfolio)] text-[var(--text-primary)] rounded-full shadow-sm border border-[var(--border-color)] hover:text-[var(--primary)]">
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{project.name}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.tech_stack?.slice(0, 3).map((t: string) => (
                                <span key={t} className="text-xs text-[var(--text-secondary)] opacity-60"># {t}</span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        )
    }

    // Main Project Layout
    return (
        <ProjectCard
            name={project.name}
            description={project.description}
            url={project.url}
            imageUrl={project.image_url}
            techStack={project.tech_stack}
            type={type}
            username={username}
            projectId={project.id}
            slug={project.slug}
            hasCaseStudy={!!project.long_description}
        />
    )
}

/**
 * Global Styles for Typography
 */
const TypographyStyles = () => (
    <style jsx global>{`
        .word-break-keep-all {
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        @media print {
            .word-break-keep-all {
                word-break: keep-all !important;
            }
        }
    `}</style>
)
