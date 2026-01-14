import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditorForm } from './editor-form'
import Link from 'next/link'
import { FolderOpen, ExternalLink, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function EditorPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Profile & Portfolio
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Count projects
    let projectCount = 0
    if (portfolio) {
        const { count } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('portfolio_id', portfolio.id)
        projectCount = count || 0
    }

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <div className="mb-8 space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">포트폴리오 편집</h1>
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" size="sm" type="submit">
                            <LogOut className="w-4 h-4 mr-2" />
                            로그아웃
                        </Button>
                    </form>
                </div>
                <p className="text-muted-foreground">
                    포트폴리오 내용을 관리하세요.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Link href="/editor/projects">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <FolderOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">프로젝트</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {projectCount}개
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {profile?.username && (
                    <Link href={`/${profile.username}`} target="_blank">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50">
                                        <ExternalLink className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">포트폴리오 보기</h3>
                                        <p className="text-sm text-muted-foreground">
                                            /{profile.username}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            <EditorForm
                defaultProfile={profile}
                defaultPortfolio={portfolio}
                userId={user.id}
            />
        </div>
    )
}
