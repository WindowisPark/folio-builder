'use client'

import Link from 'next/link'
import { LayoutDashboard, Sparkles, LayoutList, FileUser } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { NavHeader } from '@/components/layout/nav-header'

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navItems = [
        { name: '대시보드', href: '/editor', icon: LayoutDashboard },
        { name: '프로젝트', href: '/editor/projects', icon: LayoutList },
        { name: '이력서', href: '/editor/resume', icon: FileUser },
        { name: '커뮤니티', href: '/community', icon: Sparkles },
    ]

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden transition-colors duration-500 text-[var(--text-primary)]">
            <NavHeader />

            <main className="relative z-10">
                {children}
            </main>

            {/* Visual Feedback - Modern Bottom bar on mobile */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--background)] shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-10 border border-[var(--border-color)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`text-center ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
                            >
                                <item.icon size={22} className="mx-auto" />
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

