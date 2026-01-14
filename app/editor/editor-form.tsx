'use client'

import { useState } from 'react'
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
})

export function EditorForm({ defaultProfile, defaultPortfolio, userId }: { defaultProfile: any, defaultPortfolio: any, userId: string }) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: defaultProfile?.full_name || '',
            username: defaultProfile?.username || '',
            title: defaultPortfolio?.title || '',
            bio: defaultPortfolio?.bio || '',
            slug: defaultPortfolio?.slug || defaultProfile?.username || '',
            skills: defaultPortfolio?.skills ? (defaultPortfolio.skills as string[]).join(', ') : '',
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <Card>
                    <CardContent className="pt-6 space-y-4">
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
                                        포트폴리오 URL에 사용됩니다.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>포트폴리오 URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="my-portfolio" {...field} />
                                    </FormControl>
                                    <FormDescription>
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
                                        <Input placeholder="React, Next.js, Node.js" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        쉼표로 구분해서 입력하세요
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>자기소개</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="간단한 자기소개를 작성하세요" className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" disabled={loading}>
                    {loading ? '저장 중...' : '저장하기'}
                </Button>
            </form>
        </Form>
    )
}
