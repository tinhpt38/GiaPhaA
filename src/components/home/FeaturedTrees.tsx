'use client'

import { useEffect, useState } from 'react'
import { getPublicTrees, getUserVotedTreeIds, toggleTreeVote } from '@/lib/community'
import Link from 'next/link'
import { Eye, Heart, User, ArrowRight, Share2 } from 'lucide-react'
import Image from 'next/image'

export function FeaturedTrees() {
    const [trees, setTrees] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [votedTreeIds, setVotedTreeIds] = useState<string[]>([])

    useEffect(() => {
        async function fetchTrees() {
            try {
                const data = await getPublicTrees()
                if (data) {
                    // Add initial vote tracking state
                    const treesWithInitState = data.map(t => ({
                        ...t,
                        has_initially_voted: false
                    }))

                    const ids = data.map(t => t.id)
                    const votedIds = await getUserVotedTreeIds(ids)
                    setVotedTreeIds(votedIds)

                    // Mark which ones were initially voted to correct count display optimistically
                    setTrees(treesWithInitState.map(t => ({
                        ...t,
                        has_initially_voted: votedIds.includes(t.id)
                    })))
                }
            } catch (error) {
                console.error('Failed to load featured trees', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrees()
    }, [])

    const handleShare = (treeId: string) => {
        const url = `${window.location.origin}/share/${treeId}`
        navigator.clipboard.writeText(url)
        alert('Đã sao chép liên kết chia sẻ!')
    }

    const handleVote = async (treeId: string) => {
        // Optimistic update
        const isVoted = votedTreeIds.includes(treeId)
        if (isVoted) {
            setVotedTreeIds(prev => prev.filter(id => id !== treeId))
        } else {
            setVotedTreeIds(prev => [...prev, treeId])
        }

        try {
            await toggleTreeVote(treeId)
        } catch (error) {
            console.error('Failed to vote', error)
            // Revert if failed
            if (isVoted) {
                setVotedTreeIds(prev => [...prev, treeId])
            } else {
                setVotedTreeIds(prev => prev.filter(id => id !== treeId))
            }
        }
    }

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
            </div>
        )
    }

    if (trees.length === 0) return null

    return (
        <section className="py-24 px-6 lg:px-20 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-[#8B0000] font-bold text-sm tracking-[0.2em] uppercase mb-4">Cộng đồng</h2>
                    <h3 className="text-3xl lg:text-4xl font-black text-[#111621] leading-tight">Gia Phả Nổi Bật</h3>
                    <p className="text-slate-500 mt-4 text-lg">Khám phá các gia phả được chia sẻ bởi cộng đồng người dùng Gia Phả Việt.</p>
                    <div className="mt-8">
                        <Link href="/community" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
                            Xem tất cả <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trees.map((tree) => (
                        <Link href={`/share/${tree.id}`} key={tree.id} className="group block">
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 h-full flex flex-col">
                                {/* Cover Image Placeholder */}
                                <div className="aspect-[3/2] bg-slate-100 relative overflow-hidden">
                                    {tree.cover_image ? (
                                        <Image
                                            src={tree.cover_image}
                                            alt={tree.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B0000]/5 to-[#D4AF37]/5">
                                            <span className="text-4xl">🌳</span>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#8B0000] shadow-sm">
                                        Nổi bật
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h4 className="text-xl font-bold text-[#111621] mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1">
                                        {tree.name}
                                    </h4>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                                        {tree.description || 'Chưa có mô tả.'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                                                {tree.profiles?.avatar_url ? (
                                                    <Image src={tree.profiles.avatar_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                                                        <User className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
                                                {tree.profiles?.full_name || 'Ẩn danh'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1" title="Lượt xem">
                                                <Eye className="w-3.5 h-3.5" />
                                                {new Intl.NumberFormat().format(tree.view_count || 0)}
                                            </div>
                                            <div className="flex items-center gap-1 text-red-500" title="Lượt thích">
                                                <Heart className="w-3.5 h-3.5 fill-current" />
                                                {new Intl.NumberFormat().format(tree.tree_votes?.[0]?.count || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
