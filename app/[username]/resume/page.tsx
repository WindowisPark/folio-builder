import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getResumeData } from '@/app/editor/resume/actions'
import { ResumeView } from '@/components/resume/resume-view'

interface Props {
    params: Promise<{
        username: string
    }>
}

export default async function DedicatedResumePage({ params }: Props) {
    const { username } = await params
    const supabase = await createClient()

    // Fetch Profile by Username
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // Fetch Portfolio by User ID
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .single()

    if (!portfolio) {
        notFound()
    }

    // Fetch Resume Data
    const resumeData = await getResumeData(portfolio.id)

    return (
        <ResumeView
            profile={profile}
            portfolio={portfolio}
            resumeData={resumeData}
        />
    )
}
