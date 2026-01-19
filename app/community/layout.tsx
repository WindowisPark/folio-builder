'use client'

import { NavHeader } from '@/components/layout/nav-header'

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden transition-colors duration-500 text-[var(--text-primary)]">
            <NavHeader />
            <main className="relative z-10">
                {children}
            </main>
        </div>
    )
}
