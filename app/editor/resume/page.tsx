import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeForm } from './resume-form'
import { getResumeData } from './actions'

export default async function ResumeEditorPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Portfolio
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!portfolio) {
        redirect('/editor')
    }

    const resumeData = await getResumeData(portfolio.id)

    return (
        <div className="py-8">
            <ResumeForm
                portfolioId={portfolio.id}
                initialData={resumeData}
            />
        </div>
    )
}
