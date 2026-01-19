'use client'

import Link from 'next/link'
import { LayoutDashboard, Sparkles, LogOut, Home, LayoutList, FileUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function NavHeader() {
    const pathname = usePathname()

    const navItems = [
        { name: '대시보드', href: '/editor', icon: LayoutDashboard },
        { name: '프로젝트', href: '/editor/projects', icon: LayoutList },
        { name: '이력서', href: '/editor/resume', icon: FileUser },
        { name: '커뮤니티', href: '/community', icon: Sparkles },
    ]

    return (
        <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
            <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo & Name */}
                    <Link href="/editor" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center font-black"
                        >
                            <Sparkles size={16} fill="currentColor" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-black text-[var(--text-primary)] tracking-tighter uppercase">
                                My Folio
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Items */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive
                                        ? 'bg-[var(--text-primary)] text-[var(--background)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]'
                                        }`}>
                                        <item.icon size={12} />
                                        {item.name}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full font-black text-[10px] uppercase tracking-widest">
                            <Home size={14} className="mr-2" />
                            Main Home
                        </Button>
                    </Link>
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" size="icon" type="submit" className="text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-surface)] rounded-full transition-all">
                            <LogOut size={18} />
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    )
}
