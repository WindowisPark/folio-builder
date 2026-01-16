import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Layout, Sparkles, Zap } from 'lucide-react'
import { HomeClient } from './home-client'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tighter">My-Folio.</Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/editor" className="text-sm font-medium text-slate-600 hover:text-black transition-colors">
                  대시보드
                </Link>
                <Link href="/editor" className="text-sm font-medium bg-black text-white px-5 h-10 flex items-center rounded-full hover:bg-slate-800 transition-all">
                  에디터로 이동
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-black transition-colors h-10 flex items-center">
                  로그인
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-black text-white px-5 h-10 flex items-center rounded-full hover:bg-slate-800 transition-all">
                  시작하기
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HomeClient isLoggedIn={!!user} />

        {/* Features Section - Static part ok here but better in HomeClient for consistency? Let's move animations to HomeClient */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold">압도적인 속도</h3>
                <p className="text-slate-500 leading-relaxed">
                  몇 번의 클릭만으로 전문적인 포트폴리오가 완성됩니다.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                  <Layout className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold">PDF 최적화 레이아웃</h3>
                <p className="text-slate-500 leading-relaxed">
                  A4 비율의 깔끔한 PDF로도 저장할 수 있습니다.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold">프리미엄 디자인</h3>
                <p className="text-slate-500 leading-relaxed">
                  글로벌 트렌드를 반영한 미니멀하고 세련된 디자인입니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto max-w-6xl px-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} My-Folio Builder. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
