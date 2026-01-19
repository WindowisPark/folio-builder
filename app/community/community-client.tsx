'use client'

import { useState } from 'react'
import { searchUsers, sendFriendRequest, acceptFriendRequest } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, UserPlus, Check, UserPen, Users, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export function CommunityClient({ initialFriends, initialRequests }: { initialFriends: any[], initialRequests: any[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    async function handleSearch() {
        if (!searchQuery.trim()) return
        setLoading(true)
        const result = await searchUsers(searchQuery)
        if (result.profiles) {
            setSearchResults(result.profiles)
        }
        setLoading(false)
    }

    async function handleAddFriend(userId: string) {
        const result = await sendFriendRequest(userId)
        if (result.success) {
            alert('친구 요청을 보냈습니다.')
            setSearchResults(prev => prev.filter(u => u.id !== userId))
        } else {
            alert(result.error)
        }
    }

    async function handleAccept(requestId: string) {
        const result = await acceptFriendRequest(requestId)
        if (result.success) {
            alert('친구 요청을 수락했습니다.')
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 space-y-12">
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <Users className="text-[var(--primary)]" />
                        COMMUNITY
                    </h2>
                    <p className="text-[var(--text-secondary)] font-medium">다른 개발자들과 연결하고 포트폴리오를 공유하세요.</p>
                </div>
                <Link href="/editor">
                    <Button variant="ghost" className="rounded-full gap-2 font-bold text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-bg)]">
                        <LayoutDashboard size={18} />
                        대시보드로 돌아가기
                    </Button>
                </Link>
            </div>

            {/* Search Section */}
            <section className="space-y-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="사용자명 또는 실명으로 검색..."
                            className="pl-10 h-12 rounded-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={loading} className="h-12 px-8 rounded-2xl font-bold">
                        {loading ? '검색 중...' : '검색'}
                    </Button>
                </div>

                {searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((user) => (
                            <Card key={user.id} className="overflow-hidden border-[var(--border-color)]">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                                    {user.full_name?.[0] || user.username[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.full_name}</p>
                                            <p className="text-xs text-slate-400 font-medium tracking-tight">@{user.username}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleAddFriend(user.id)} className="rounded-full gap-2 text-xs font-bold">
                                        <UserPlus size={14} />
                                        친구 추가
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Pending Requests */}
                <section className="space-y-6">
                    <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">보낸/받은 요청</h3>
                    <div className="space-y-4">
                        {initialRequests.length === 0 ? (
                            <p className="text-sm text-slate-400 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">대기 중인 요청이 없습니다.</p>
                        ) : (
                            initialRequests.map((req) => (
                                <Card key={req.id} className="border-blue-100 bg-blue-50/30">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                                <UserPen size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold truncate max-w-[150px]">{req.requester.full_name}</p>
                                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">FRIEND REQUEST</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleAccept(req.id)} className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                                            <Check size={14} />
                                            수락하기
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Friends List */}
                <section className="space-y-6">
                    <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">친구 목록</h3>
                    <div className="space-y-4">
                        {initialFriends.length === 0 ? (
                            <p className="text-sm text-slate-400 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">아직 친구가 없습니다.</p>
                        ) : (
                            initialFriends.map((friend) => (
                                <Link key={friend.id} href={`/${friend.username}`} className="block group">
                                    <Card className="hover:border-[var(--primary)] transition-all overflow-hidden">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                    {friend.avatar_url ? (
                                                        <img src={friend.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-400">{friend.full_name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900 group-hover:text-[var(--primary)] transition-colors">{friend.full_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">@{friend.username}</p>
                                                </div>
                                            </div>
                                            <div className="text-[var(--primary)] text-xs font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all">
                                                VIEW PORTFOLIO →
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
