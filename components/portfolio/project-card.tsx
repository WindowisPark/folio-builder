import { ExternalLink } from 'lucide-react'

interface ProjectCardProps {
    name: string
    description: string | null
    url: string | null
    imageUrl: string | null
    techStack: string[]
    type: 'main' | 'toy'
}

export function ProjectCard({ name, description, url, imageUrl, techStack, type }: ProjectCardProps) {
    const CardWrapper = url ? 'a' : 'div'
    const cardProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {}

    return (
        <CardWrapper
            {...cardProps}
            className="group block space-y-4 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-1 hover:shadow-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[var(--color-surface)]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--color-surface)]">
                        <span className="text-4xl font-bold text-[var(--text-muted)] opacity-20">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Type Badge */}
                {type === 'main' && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-xs font-bold text-[var(--primary-foreground)] shadow-lg shadow-blue-500/20 uppercase tracking-tighter">
                            Featured
                        </span>
                    </div>
                )}

                {/* External Link Icon */}
                {url && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 rounded-full bg-[var(--background)]/90 shadow-sm">
                            <ExternalLink className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-3 pb-4 space-y-2">
                <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors tracking-tight">
                    {name}
                </h3>

                {description && (
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}

                {techStack && techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        {techStack.slice(0, 5).map((tech, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] border border-[var(--border-color)]"
                            >
                                {tech}
                            </span>
                        ))}
                        {techStack.length > 5 && (
                            <span className="inline-flex items-center rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                +{techStack.length - 5}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}
