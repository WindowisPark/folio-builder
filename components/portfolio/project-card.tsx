import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SmartList } from '@/components/ui/smart-list'

interface ProjectCardProps {
    name: string
    description: string | null
    url: string | null
    imageUrl: string | null
    techStack: string[]
    type: 'main' | 'toy'
    username: string
    projectId: string
    slug: string | null
    hasCaseStudy: boolean
}

export function ProjectCard({ name, description, url, imageUrl, techStack, type, username, projectId, slug, hasCaseStudy }: ProjectCardProps) {
    const isInternal = hasCaseStudy
    const targetUrl = isInternal ? `/${username}/project/${slug || projectId}` : (url || '#')
    const CardWrapper = isInternal ? Link : (url ? 'a' : 'div')
    const cardProps: any = isInternal ? { href: targetUrl } : (url ? { href: targetUrl, target: '_blank', rel: 'noopener noreferrer' } : {})

    return (
        <CardWrapper
            {...cardProps}
            className={`group block space-y-4 rounded-3xl border border-[var(--border-color)] bg-[var(--card)] p-2 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 print:rounded-xl print:p-1 print:space-y-2 break-inside-avoid ${!imageUrl ? 'flex flex-col justify-center min-h-[200px] p-8 text-center print:min-h-0 print:p-4' : ''}`}
        >
            {/* Image Section */}
            {imageUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--color-surface)] print:rounded-lg print:max-h-24">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 print:group-hover:scale-100"
                    />

                    {/* Type Badge */}
                    {type === 'main' && (
                        <div className="absolute top-3 left-3 print:top-1 print:left-1">
                            <span className="inline-flex items-center rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-xs font-bold text-[var(--primary-foreground)] shadow-lg shadow-blue-500/20 uppercase tracking-tighter print:text-[8px] print:px-1.5 print:py-0">
                                Featured
                            </span>
                        </div>
                    )}

                    {/* External Link Icon */}
                    {url && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                            <div className="p-1.5 rounded-full bg-[var(--background)]/90 shadow-sm">
                                <ExternalLink className="w-4 h-4 text-[var(--primary)]" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className={`space-y-3 print:space-y-1 ${!imageUrl ? 'w-full' : 'px-3 pb-4 print:px-2 print:pb-2'}`}>
                <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors print:text-sm ${!imageUrl && type === 'main' ? 'text-2xl w-full text-center print:text-base' : 'text-lg'}`}>
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 print:hidden">
                        {hasCaseStudy && (
                            <Sparkles className="w-4 h-4 text-[var(--primary)] animate-pulse" />
                        )}
                        {!imageUrl && type === 'main' && url && !hasCaseStudy && (
                            <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                        )}
                    </div>
                </div>

                {description && (
                    <SmartList
                        text={description}
                        className={`text-[var(--text-secondary)] font-light print:text-xs print:line-clamp-2 ${!imageUrl ? 'text-center' : 'text-sm'}`}
                        itemClassName={!imageUrl ? 'justify-center' : ''}
                    />
                )}

                {hasCaseStudy && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] group-hover:gap-3 transition-all print:hidden ${!imageUrl ? 'justify-center' : ''}`}>
                        View Case Study <ArrowRight size={12} />
                    </div>
                )}

                {techStack && techStack.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 pt-2 print:pt-1 print:gap-1 ${!imageUrl ? 'justify-center' : ''}`}>
                        {techStack.slice(0, 5).map((tech, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-[var(--color-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] border border-[var(--border-color)] print:px-1.5 print:py-0.5 print:text-[8px]"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}
