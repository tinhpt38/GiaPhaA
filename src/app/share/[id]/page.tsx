'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import TreeVisualizer from '@/components/tree/TreeVisualizer'
import { Button } from '@/components/ui/button'

import {
    ZoomIn,
    ZoomOut,
    Share2,
    Locate,
    BookOpen,
    Eye,
    Heart,
} from 'lucide-react'
import { incrementTreeView, getTreeStats, toggleTreeVote, checkUserVote } from '@/lib/community'

function SharePageContent({
    id,
    tree,
    members,
    zoom,
    setZoom,
    viewCount,
    voteCount,
    hasVoted,
    onVoteChange
}: any) {
    const handleZoomIn = () => {
        setZoom((prev: number) => Math.min(prev + 10, 200))
    }

    const handleZoomOut = () => {
        setZoom((prev: number) => Math.max(prev - 10, 10))
    }

    const handleFitView = () => {
        setZoom(100)
    }

    return (
        <>
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between border-b border-[#e5e1e1] bg-white px-3 md:px-6 z-30 shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="bg-primary p-1 md:p-1.5 rounded-lg text-white">
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm md:text-lg font-bold leading-tight truncate max-w-[120px] sm:max-w-none">{tree?.name || 'Gia Phả'}</h1>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {new Intl.NumberFormat().format(viewCount || 0)}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3 fill-red-500 text-red-500" /> {new Intl.NumberFormat().format(voteCount || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant={hasVoted ? "secondary" : "outline"}
                        size="sm"
                        className={`hidden sm:flex items-center gap-2 h-8 md:h-9 ${hasVoted ? 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200' : 'border-[#e5e1e1]'}`}
                        onClick={async () => {
                            try {
                                const result = await toggleTreeVote(id)
                                onVoteChange(result.status === 'voted')
                            } catch (e) {
                                console.error(e)
                                alert('Không thể thực hiện hành động này.')
                            }
                        }}
                    >
                        <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                        <span className="hidden md:inline">{hasVoted ? 'Đã yêu thích' : 'Yêu thích'}</span>
                    </Button>
                    <div className="hidden md:flex items-center bg-white border border-[#e5e1e1] rounded-lg p-1">
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleZoomIn}
                            title="Phóng to"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <span className="px-2 text-xs font-semibold min-w-[45px] text-center">{zoom}%</span>
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleZoomOut}
                            title="Thu nhỏ"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <div className="w-[1px] h-6 bg-[#e5e1e1] mx-1" />
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleFitView}
                            title="Căn giữa"
                        >
                            <Locate className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-1 md:gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex items-center gap-2 bg-[#f3e7e7] text-[#1b0d0d] border-[#e5e1e1] h-8 md:h-9"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                alert("Đã sao chép liên kết chia sẻ!")
                            }}
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden md:inline">Chia sẻ</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 relative overflow-hidden"
                    style={{
                        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundColor: '#f8f6f6'
                    }}
                >
                    <div className="w-full h-full relative">
                        <TreeVisualizer
                            initialMembers={members}
                            readOnly={true}
                        />
                    </div>
                </main>
            </div>
        </>
    )
}

export default function ShareTreePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [tree, setTree] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(100)
    const [viewCount, setViewCount] = useState(0)
    const [voteCount, setVoteCount] = useState(0)
    const [hasVoted, setHasVoted] = useState(false)

    const supabase = createClient()

    async function loadTreeData() {
        const { data: { user } } = await supabase.auth.getUser()

        const { data: treeData, error } = await supabase
            .from('trees')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !treeData) {
            router.push('/')
            return
        }

        // Only allow if public or user is the owner
        if (!treeData.is_public && treeData.owner_id !== user?.id) {
            router.push('/')
            return
        }

        setTree(treeData)

        const { data: membersData } = await supabase
            .from('members')
            .select('*')
            .eq('tree_id', id)

        setMembers(membersData || [])
        setLoading(false)

        // Fetch stats
        if (id) {
            const stats = await getTreeStats(id)
            setViewCount(stats.view_count)
            setVoteCount(stats.vote_count)

            const voted = await checkUserVote(id)
            setHasVoted(voted)
        }
    }

    useEffect(() => {
        // Increment view count on mount
        if (id) {
            incrementTreeView(id)
        }
    }, [id])

    useEffect(() => {
        if (!id) return

        loadTreeData()

        const channel = supabase
            .channel('members-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'members',
                    filter: `tree_id=eq.${id}`
                },
                (payload) => {
                    console.log('Realtime update:', payload)
                    loadTreeData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id, supabase])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f6f6]">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f8f6f6]">
            <SharePageContent
                id={id}
                tree={tree}
                members={members}
                zoom={zoom}
                setZoom={setZoom}
                viewCount={viewCount}
                voteCount={voteCount}
                hasVoted={hasVoted}
                onVoteChange={(voted: boolean) => {
                    setHasVoted(voted)
                    setVoteCount(prev => voted ? prev + 1 : prev - 1)
                }}
            />
        </div>
    )
}
