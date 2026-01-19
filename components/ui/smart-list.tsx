import React from 'react'
import { Sparkles } from 'lucide-react'

interface SmartListProps {
    text: string | null | undefined
    className?: string
    itemClassName?: string
}

/**
 * SmartList Component
 * Automatically detects bullet points (-, *, •) and renders them as a styled list.
 */
export function SmartList({ text, className = "", itemClassName = "" }: SmartListProps) {
    if (!text) return null

    // Split by lines and filter empty lines (but keep some structure)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Check if at least one line starts with a bullet point
    const hasBullet = lines.some(line => /^[-*•]/.test(line))

    if (!hasBullet) {
        return <p className={`whitespace-pre-wrap ${className}`}>{text}</p>
    }

    return (
        <ul className={`space-y-3 ${className}`}>
            {lines.map((line, index) => {
                // Match bullet patterns: - , * , • 
                const match = line.match(/^[-*•]\s*(.*)/)
                const content = match ? match[1] : line

                return (
                    <li key={index} className={`flex items-start gap-3 ${itemClassName}`}>
                        <span className="mt-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </span>
                        <span className="text-inherit leading-relaxed">{content}</span>
                    </li>
                )
            })}
        </ul>
    )
}
