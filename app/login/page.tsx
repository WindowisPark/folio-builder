import Link from 'next/link'
import { login } from './actions'
import { LayoutDashboard, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Left: Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-indigo-600/10" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 text-center space-y-6 max-w-lg px-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm backdrop-blur-md">
            <Sparkles size={16} className="text-indigo-400" />
            <span>The Ultimate Portfolio Builder</span>
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tighter leading-tight">
            Showcase your <span className="text-indigo-400">excellence.</span>
          </h1>
          <p className="text-slate-400 text-lg">
            디자이너, 개발자, 아티스트를 위한 가장 감각적인 포트폴리오 빌더.
            단 5분 만에 당신의 커리어를 예술로 만드세요.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32">
        <div className="mx-auto w-full max-w-sm lg:max-w-md space-y-10">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight mb-8">
              <LayoutDashboard size={24} />
              MyFolio.
            </Link>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-slate-500">
              계정에 로그인하여 포트폴리오를 관리하세요.
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <form className="space-y-5" action={login}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                  이메일
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-sm font-bold text-slate-700">
                    비밀번호
                  </label>
                  <Link href="#" className="text-xs font-semibold text-slate-400 hover:text-indigo-600">
                    비밀번호 찾기
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="block w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full h-14 bg-slate-950 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">로그인</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-400"><span className="bg-[#fafafa] px-4">New to our platform?</span></div>
            </div>

            <Link href="/signup">
              <button className="w-full h-14 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 rounded-2xl font-bold transition-all">
                회원가입 시작하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
