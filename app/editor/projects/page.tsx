import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from './project-form'
import { getProjects } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProjectsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: projects, error } = await getProjects()

    return (
        <div className="container mx-auto max-w-3xl py-10 px-4">
            <div className="mb-8">
                <Link
                    href="/editor"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    프로필 편집으로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">프로젝트 관리</h1>
                <p className="text-muted-foreground mt-1">
                    포트폴리오에 표시될 프로젝트를 관리하세요. 주요 프로젝트는 상단에 크게 표시됩니다.
                </p>
            </div>

            {error ? (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            ) : (
                <ProjectForm projects={projects || []} />
            )}
        </div>
    )
}
