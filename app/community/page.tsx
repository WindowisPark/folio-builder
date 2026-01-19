import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CommunityClient } from './community-client'

export default async function CommunityPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch current friends (accepted status)
    const { data: friendships } = await supabase
        .from('friendships')
        .select(`
            id,
            status,
            requester:profiles!requester_id(id, full_name, username, avatar_url),
            receiver:profiles!receiver_id(id, full_name, username, avatar_url)
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted')

    const friendsList = friendships?.map(f => {
        const requester = Array.isArray(f.requester) ? f.requester[0] : f.requester
        const receiver = Array.isArray(f.receiver) ? f.receiver[0] : f.receiver

        const friend = requester.id === user.id ? receiver : requester
        return friend
    }) || []

    // 2. Fetch pending requests received
    const { data: pendingRequestsRaw } = await supabase
        .from('friendships')
        .select(`
            id,
            status,
            requester:profiles!requester_id(id, full_name, username, avatar_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')

    const pendingRequests = pendingRequestsRaw?.map(req => ({
        ...req,
        requester: Array.isArray(req.requester) ? req.requester[0] : req.requester
    })) || []

    return (
        <div className="bg-[#fafafa] min-h-screen">
            <CommunityClient
                initialFriends={friendsList}
                initialRequests={pendingRequests}
            />
        </div>
    )
}
