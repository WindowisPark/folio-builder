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
            className="group block space-y-4 rounded-xl border border-gray-100 bg-white p-1 hover:shadow-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-4xl font-bold text-gray-300">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Type Badge */}
                {type === 'main' && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">
                            주요
                        </span>
                    </div>
                )}

                {/* External Link Icon */}
                {url && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 rounded-full bg-white/90 shadow-sm">
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-3 pb-4 space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {name}
                </h3>

                {description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {description}
                    </p>
                )}

                {techStack && techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        {techStack.slice(0, 5).map((tech, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                            >
                                {tech}
                            </span>
                        ))}
                        {techStack.length > 5 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                +{techStack.length - 5}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </CardWrapper>
    )
}
