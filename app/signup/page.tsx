import Link from 'next/link'
import { signup } from './actions'
import { LayoutDashboard, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>
}) {
    const { error, success } = await searchParams

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            {/* Left: Branding/Visual (Complementary to Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600 items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-800" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

                <div className="relative z-10 text-center space-y-6 max-w-lg px-12 text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm backdrop-blur-md">
                        <Sparkles size={16} className="text-yellow-300" />
                        <span>Join 5,000+ Creative Professionals</span>
                    </div>
                    <h1 className="text-6xl font-bold tracking-tighter leading-tight">
                        Start your <span className="text-indigo-200">journey</span> today.
                    </h1>
                    <p className="text-indigo-100 text-lg opacity-80">
                        복잡한 코딩 없이, 드래그 앤 드롭만으로 완성하는
                        당신만의 독창적인 온라인 아이덴티티.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-10 text-left">
                        {[
                            'Free Themes', 'Instant Export',
                            'Custom Slugs', 'SEO Optimized'
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-indigo-300" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Signup Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32">
                <div className="mx-auto w-full max-w-sm lg:max-w-md space-y-10">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight mb-8">
                            <LayoutDashboard size={24} />
                            MyFolio.
                        </Link>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                            Create account
                        </h2>
                        <p className="text-slate-500">
                            회원가입 후 나만의 포트폴리오를 만들어보세요.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {success && (
                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3 text-indigo-700 text-sm animate-in fade-in slide-in-from-top-1">
                                <CheckCircle2 className="text-indigo-500" size={18} />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" action={signup}>
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-bold text-slate-700 ml-1">
                                    이름
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        placeholder="홍길동"
                                        className="block w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">
                                    비밀번호
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="6자 이상 입력"
                                        className="block w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full h-14 bg-slate-950 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">가입하기</span>
                                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500">
                            이미 계정이 있으신가요?{' '}
                            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline">
                                로그인
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
