'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeClient({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="container mx-auto max-w-4xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                        나만의 포트폴리오, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-gradient">
                            가장 아름답게 완성하세요.
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                        복잡한 코딩 없이, 당신의 커리어를 돋보이게 할 프리미엄 포트폴리오를 만드세요.
                        PDF 내보내기까지 완벽하게 지원합니다.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={isLoggedIn ? "/editor" : "/signup"}
                            className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-all hover:scale-105"
                        >
                            {isLoggedIn ? "내 포트폴리오 관리" : "지금 무료로 만들기"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/demo"
                            className="text-slate-500 font-medium px-6 py-3 text-sm hover:text-black transition-colors"
                        >
                            예시 보기 &rarr;
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Abstract Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent blur-3xl -z-10 rounded-[100%] pointer-events-none" />
        </section>
    )
}
