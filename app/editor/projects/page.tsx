import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from './project-form'
import { getProjects } from './actions'
import Link from 'next/link'
import { X, FolderOpen } from 'lucide-react'

export default async function ProjectsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: projects, error } = await getProjects()

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .single()

    return (
        <div className="py-8">
            {error ? (
                <div className="container mx-auto max-w-5xl px-4 rounded-xl bg-red-50 p-6 border border-red-100 flex items-center gap-3 text-red-600">
                    <X className="w-5 h-5" />
                    <p className="font-bold">{error}</p>
                </div>
            ) : (
                <ProjectForm projects={projects || []} portfolioId={portfolio?.id || ''} />
            )}
        </div>
    )
}
