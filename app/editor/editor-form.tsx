'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { updateProfile } from './actions'
import { Globe, Users, Lock, Sparkles, User, Link as LinkIcon, Info, Check } from 'lucide-react'

const formSchema = z.object({
    fullName: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
    username: z.string().min(3, '사용자명은 3자 이상이어야 합니다.'),
    title: z.string().optional(),
    bio: z.string().max(500, '소개는 500자를 초과할 수 없습니다.').optional(),
    slug: z.string().min(3, 'URL 슬러그는 3자 이상이어야 합니다.').regex(/^[a-z0-9-]+$/, '영문 소문자, 숫자, 하이픈만 사용 가능합니다.'),
    skills: z.string().optional(),
    website: z.string().url('유효한 URL을 입력하세요.').or(z.literal('')).optional(),
    githubUrl: z.string().url('유효한 URL을 입력하세요.').or(z.literal('')).optional(),
    linkedinUrl: z.string().url('유효한 URL을 입력하세요.').or(z.literal('')).optional(),
    visibility: z.enum(['public', 'friends_only', 'private']),
})

type FormValues = z.infer<typeof formSchema>

export function EditorForm({ defaultProfile, defaultPortfolio, userId }: { defaultProfile: any, defaultPortfolio: any, userId: string }) {
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: defaultProfile?.full_name || '',
            username: defaultProfile?.username || '',
            title: defaultPortfolio?.title || '',
            bio: defaultPortfolio?.bio || '',
            slug: defaultPortfolio?.slug || defaultProfile?.username || '',
            skills: defaultPortfolio?.skills ? (defaultPortfolio.skills as string[]).join(', ') : '',
            website: defaultProfile?.website || '',
            githubUrl: defaultProfile?.github_url || '',
            linkedinUrl: defaultProfile?.linkedin_url || '',
            visibility: defaultProfile?.visibility || 'public',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value || '')
        })

        const result = await updateProfile(formData)
        setLoading(false)

        if (result?.error) {
            alert(result.error)
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
    }

    if (!mounted) return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-40 bg-slate-50/50 rounded-[2.5rem] md:col-span-2" />
                <div className="h-80 bg-slate-50/50 rounded-[2.5rem]" />
                <div className="h-80 bg-slate-50/50 rounded-[2.5rem]" />
                <div className="h-56 bg-slate-50/50 rounded-[2.5rem] md:col-span-2" />
            </div>
        </div>
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Basic Info Section */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-900 border border-slate-100">
                                        <User size={22} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight text-slate-900">기본 프로필</h3>
                                        <p className="text-slate-400 font-medium tracking-tight">당신을 나타내는 가장 기본적인 정보입니다.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="홍길동"
                                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">User ID</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="gildong"
                                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="visibility"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 block text-center">Profile Visibility</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {[
                                                            { value: 'public', label: '전체 공개', icon: Globe, desc: 'Everyon can see' },
                                                            { value: 'friends_only', label: '친구 공개', icon: Users, desc: 'Friends only' },
                                                            { value: 'private', label: '나만 보기', icon: Lock, desc: 'Only you' },
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => field.onChange(opt.value)}
                                                                className={`group relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all gap-2 overflow-hidden ${field.value === opt.value
                                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
                                                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                                                    }`}
                                                            >
                                                                <opt.icon size={24} className={`mb-1 transition-transform group-hover:scale-110 ${field.value === opt.value ? 'text-white' : 'text-slate-200'}`} strokeWidth={2.5} />
                                                                <span className="text-base font-black tracking-tight">{opt.label}</span>
                                                                <span className={`text-[10px] uppercase font-bold tracking-widest ${field.value === opt.value ? 'text-slate-400' : 'text-slate-300'}`}>{opt.desc}</span>

                                                                {field.value === opt.value && (
                                                                    <motion.div
                                                                        layoutId="active-visibility"
                                                                        className="absolute inset-0 bg-slate-900 -z-10"
                                                                    />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Branding Info Section */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm rounded-[2.5rem] h-full">
                            <CardContent className="p-8 md:p-10 space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-900 border border-slate-100">
                                        <Sparkles size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">브랜딩</h3>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Custom URL</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center bg-slate-50/50 rounded-2xl px-5 border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
                                                    <span className="text-slate-300 font-black text-lg pr-2 leading-none">/</span>
                                                    <Input
                                                        placeholder="my-name"
                                                        className="border-none bg-transparent h-14 px-0 focus-visible:ring-0 shadow-none font-bold text-slate-900 placeholder:text-slate-300"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Role / Intro</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="풀스택 개발자"
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Top Skills</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="React, Next.js, AI"
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2 px-1">Seperate with commas</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Social Section */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm rounded-[2.5rem] h-full">
                            <CardContent className="p-8 md:p-10 space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-900 border border-slate-100">
                                        <LinkIcon size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">연결망</h3>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://..."
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="githubUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">GitHub</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://github.com/..."
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="linkedinUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">LinkedIn</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://linkedin.com/in/..."
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Bio Section */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <Card className="border-none shadow-[0_8px_30_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm rounded-[2.5rem]">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-900 border border-slate-100">
                                        <Info size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">스토리</h3>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="당신만의 고도화된 스토리를 들려주세요..."
                                                    className="min-h-[200px] resize-none rounded-[2rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all p-8 font-bold text-xl leading-relaxed text-slate-900 placeholder:text-slate-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <div className="sticky bottom-8 z-20 flex justify-center">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading || saved}
                            className={`px-16 rounded-full h-16 text-xl font-black shadow-2xl transition-all duration-500 ${saved
                                ? 'bg-green-500 text-white shadow-green-100'
                                : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
                                }`}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" as const }}
                                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                />
                            ) : saved ? (
                                <div className="flex items-center gap-2">
                                    <Check size={24} strokeWidth={3} />
                                    <span>저장 완료</span>
                                </div>
                            ) : '변경사항 저장하기'}
                        </Button>
                    </motion.div>
                </div>
            </form>
        </Form>
    )
}
