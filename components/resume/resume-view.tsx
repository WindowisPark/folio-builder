'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, Globe, MapPin, Printer, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SmartList } from '@/components/ui/smart-list'

interface ResumeViewProps {
    profile: any
    portfolio: any
    resumeData: {
        work: any[]
        education: any[]
        awards: any[]
        certifications: any[]
        languages: any[]
    }
}

export function ResumeView({ profile, portfolio, resumeData }: ResumeViewProps) {
    const { work = [], education = [], awards = [], certifications = [], languages = [] } = resumeData || {}

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 print:bg-white print:p-0 transition-colors duration-300 word-break-keep-all text-[var(--foreground)]">
            {/* Control Bar - Hidden on print */}
            <div className="container mx-auto max-w-4xl mb-8 flex items-center justify-between print:hidden">
                <Link href={`/${profile.username}`}>
                    <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Portfolio
                    </Button>
                </Link>
                <Button onClick={handlePrint} className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full hover:scale-105 transition-all font-black text-xs uppercase tracking-widest px-8 h-10 shadow-lg shadow-blue-500/20">
                    <Printer className="w-4 h-4 mr-2" />
                    Print / Save PDF
                </Button>
            </div>

            {/* Resume "Paper" */}
            <main className="container mx-auto max-w-[210mm] min-h-[297mm] bg-[var(--card)] shadow-2xl shadow-slate-200/50 p-[20mm] print:shadow-none print:m-0 print:w-full border-t-[8px] border-[var(--accent)] text-[var(--text-primary)]">
                {/* Header */}
                <header className="mb-10 flex justify-between items-start border-b border-[var(--border-color)] pb-12 text-[var(--text-primary)]">
                    <div>
                        <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-2">{profile.full_name}</h1>
                        <p className="text-xl font-bold text-[var(--accent)] uppercase tracking-[0.2em]">{portfolio.title || 'Developer'}</p>
                    </div>
                    <div className="text-right space-y-2 pt-2">
                        <div className="flex items-center justify-end gap-2 text-sm font-bold text-[var(--text-primary)]">
                            <span>{profile.username}@my-folio.com</span>
                            <Mail size={14} className="text-[var(--accent)]" />
                        </div>
                        {profile.website && (
                            <div className="flex items-center justify-end gap-2 text-sm font-bold text-[var(--text-primary)]">
                                <span>{profile.website.replace('https://', '')}</span>
                                <Globe size={14} className="text-[var(--accent)]" />
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-2 text-sm font-bold text-[var(--text-primary)]">
                            <span>Seoul, South Korea</span>
                            <MapPin size={14} className="text-[var(--accent)]" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-12">
                    {/* About */}
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-4 flex items-center gap-4">
                            Summary <div className="h-px bg-[var(--border-color)] flex-1"></div>
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                            {portfolio.bio}
                        </p>
                    </section>

                    {/* Work Experience */}
                    {work.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-6 flex items-center gap-4">
                                Experience <div className="h-px bg-[var(--border-color)] flex-1"></div>
                            </h2>
                            <div className="space-y-10">
                                {work.map((item: any) => (
                                    <div key={item.id} className="group text-[var(--text-primary)]">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{item.company_name}</h3>
                                            <span className="text-sm font-bold text-[var(--text-secondary)] font-mono">
                                                {item.start_date.substring(0, 7)} — {item.is_current ? 'Present' : item.end_date?.substring(0, 7)}
                                            </span>
                                        </div>
                                        <p className="text-md font-black text-[var(--text-secondary)] uppercase tracking-wider mb-3 underline decoration-[var(--text-primary)] decoration-1 underline-offset-8">{item.role}</p>
                                        <SmartList
                                            text={item.description}
                                            className="text-[var(--text-secondary)] font-medium"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-6 flex items-center gap-4">
                                Education <div className="h-px bg-[var(--border-color)] flex-1"></div>
                            </h2>
                            <div className="space-y-6">
                                {education.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.school_name}</h3>
                                            <p className="text-[var(--text-secondary)] font-medium">
                                                {item.degree} in {item.major}
                                                {item.status && (
                                                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                                                        {item.status}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-[var(--text-secondary)] font-mono">
                                            {item.start_date.substring(0, 4)} — {item.is_current ? 'Present' : item.end_date?.substring(0, 4)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {Array.isArray(portfolio.skills) && portfolio.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-6 flex items-center gap-4">
                                Top Skills <div className="h-px bg-[var(--border-color)] flex-1"></div>
                            </h2>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {portfolio.skills.map((skill: string, i: number) => (
                                    <span key={i} className="text-[var(--text-primary)] font-bold flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full"></span>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-12">
                        {/* Awards */}
                        {awards.length > 0 && (
                            <section>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-4 flex items-center gap-4">
                                    Awards <div className="h-px bg-[var(--border-color)] flex-1"></div>
                                </h2>
                                <div className="space-y-4">
                                    {awards.map((item: any) => (
                                        <div key={item.id}>
                                            <h3 className="font-bold text-[var(--text-primary)] leading-tight">{item.title}</h3>
                                            <div className="flex justify-between text-xs text-[var(--text-secondary)] font-bold mt-0.5">
                                                <span>{item.issuer}</span>
                                                <span className="font-mono">{item.date?.substring(0, 7)}</span>
                                            </div>
                                            {item.description && (
                                                <SmartList
                                                    text={item.description}
                                                    className="mt-2 text-[var(--text-secondary)]"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certs */}
                        {(certifications.length > 0 || languages.length > 0) && (
                            <div className="space-y-12">
                                {certifications.length > 0 && (
                                    <section>
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-4 flex items-center gap-4">
                                            Certifications <div className="h-px bg-[var(--border-color)] flex-1"></div>
                                        </h2>
                                        <div className="space-y-4">
                                            {certifications.map((item: any) => (
                                                <div key={item.id}>
                                                    <h3 className="font-bold text-[var(--text-primary)] leading-tight flex items-center gap-2">
                                                        {item.name}
                                                        {item.credential_url && <ExternalLink size={10} className="text-[var(--text-secondary)] print:hidden" />}
                                                    </h3>
                                                    <div className="flex justify-between text-xs text-[var(--text-secondary)] font-bold mt-0.5">
                                                        <span>{item.issuer}</span>
                                                        <span className="font-mono">{item.date.substring(0, 7)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {languages.length > 0 && (
                                    <section>
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)] mb-4 flex items-center gap-4">
                                            Languages <div className="h-px bg-[var(--border-color)] flex-1"></div>
                                        </h2>
                                        <div className="space-y-4">
                                            {languages.map((item: any) => (
                                                <div key={item.id} className="group">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h3 className="font-bold text-[var(--text-primary)] leading-tight">{item.language}</h3>
                                                        <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-0.5 rounded text-[10px] font-black shadow-sm">{item.score}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-[var(--text-secondary)] font-bold">
                                                        <span>{item.test_name}</span>
                                                        <span className="font-mono">{item.date.substring(0, 7)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer / Branding */}
                <footer className="mt-20 pt-8 border-t border-[var(--border-color)] text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">
                        Generated by My-Folio Builder &copy; {new Date().getFullYear()}
                    </p>
                </footer>
            </main>

            <style jsx global>{`
                .word-break-keep-all {
                    word-break: keep-all;
                    overflow-wrap: break-word;
                }
                @media print {
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    body {
                        background: white !important;
                        word-break: keep-all !important;
                    }
                    .min-h-screen {
                        padding: 0 !important;
                        min-height: auto !important;
                    }
                }
            `}</style>
        </div>
    )
}
