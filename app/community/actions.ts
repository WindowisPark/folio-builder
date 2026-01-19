'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendFriendRequest(receiverId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }
    if (user.id === receiverId) return { error: '본인에게 친구 요청을 보낼 수 없습니다.' }

    const { error } = await supabase
        .from('friendships')
        .insert({
            requester_id: user.id,
            receiver_id: receiverId,
            status: 'pending'
        })

    if (error) return { error: error.message }
    revalidatePath('/community')
    return { success: true }
}

export async function acceptFriendRequest(friendshipId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .eq('receiver_id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/community')
    return { success: true }
}

export async function searchUsers(query: string) {
    const supabase = await createClient()
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(10)

    if (error) return { error: error.message }
    return { profiles }
}
