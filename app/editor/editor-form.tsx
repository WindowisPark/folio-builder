'use client'

import { useState, useEffect } from 'react'
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
})

type FormValues = z.infer<typeof formSchema>

export function EditorForm({ defaultProfile, defaultPortfolio, userId }: { defaultProfile: any, defaultPortfolio: any, userId: string }) {
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

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
            alert('저장되었습니다!')
        }
    }

    if (!mounted) return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-slate-50 rounded-2xl md:col-span-2" />
                <div className="h-64 bg-slate-50 rounded-2xl" />
                <div className="h-64 bg-slate-50 rounded-2xl" />
                <div className="h-48 bg-slate-50 rounded-2xl md:col-span-2" />
            </div>
        </div>
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="md:col-span-2">
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>이름</FormLabel>
                                        <FormControl>
                                            <Input placeholder="홍길동" {...field} />
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
                                        <FormLabel>사용자명</FormLabel>
                                        <FormControl>
                                            <Input placeholder="gildong" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            프로필 관리에 사용됩니다.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">포트폴리오 정보</h3>
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>포트폴리오 URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="my-portfolio" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-[10px]">
                                            yoursite.com/{field.value || 'slug'}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>직함 / 한줄 소개</FormLabel>
                                        <FormControl>
                                            <Input placeholder="풀스택 개발자" {...field} />
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
                                        <FormLabel>기술 스택</FormLabel>
                                        <FormControl>
                                            <Input placeholder="React, Next.js" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">소셜 링크</h3>
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>개인 웹사이트</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
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
                                        <FormLabel>GitHub</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/..." {...field} />
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
                                        <FormLabel>LinkedIn</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/in/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardContent className="pt-6">
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>자기소개</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="간단한 자기소개를 작성하세요" className="min-h-[120px] resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={loading} className="px-12 rounded-full h-12 text-base font-bold">
                        {loading ? '저장 중...' : '프로필 저장하기'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
