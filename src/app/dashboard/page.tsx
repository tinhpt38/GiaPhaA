'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Tree {
    id: string
    name: string
    description: string
    created_at: string
}

interface Profile {
    plan_tier: 'hieu' | 'dao'
}

export default function DashboardPage() {
    const [trees, setTrees] = useState<Tree[]>([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('plan_tier')
                .eq('id', user.id)
                .single()

            setProfile(profileData)

            // Fetch Trees
            const { data: treesData } = await supabase
                .from('trees')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })

            if (treesData) setTrees(treesData)
            setLoading(false)
        }

        loadData()
    }, [router, supabase])

    const handleCreateTree = async () => {
        // Optimistic check before server check
        if (profile?.plan_tier === 'hieu' && trees.length >= 2) {
            alert('Gói Hiếu chỉ được tạo tối đa 2 gia phả. Vui lòng nâng cấp gói Đạo để tạo thêm.')
            return
        }

        const name = prompt('Nhập tên gia phả mới:')
        if (!name) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('trees')
            .insert({
                owner_id: user.id,
                name: name,
                description: 'Mô tả ngắn về gia phả dòng họ...'
            })
            .select()
            .single()

        if (error) {
            // Handle trigger error message
            alert(error.message)
        } else if (data) {
            setTrees([data, ...trees])
        }
    }

    if (loading) return <div className="p-8">Đang tải dữ liệu...</div>

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Danh sách Gia Phả</h1>
                <p className="text-muted-foreground">
                    Gói hiện tại: <span className="font-semibold uppercase text-primary">{profile?.plan_tier || 'Thường'}</span>
                    {' '}({trees.length}/{profile?.plan_tier === 'dao' ? '∞' : '2'} gia phả)
                </p>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Các gia phả của bạn</h2>
                <Button onClick={handleCreateTree}>
                    <Plus className="mr-2 h-4 w-4" /> Tạo Gia Phả Mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trees.map((tree) => (
                    <div key={tree.id} className="border rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary bg-white">
                        <h3 className="text-xl font-semibold mb-2">{tree.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {tree.description || 'Chưa có mô tả'}
                        </p>
                        <div className="flex justify-between items-center mt-4 border-t pt-4">
                            <span className="text-xs text-muted-foreground">
                                Tạo ngày: {new Date(tree.created_at).toLocaleDateString('vi-VN')}
                            </span>
                            <Link href={`/tree/${tree.id}`}>
                                <Button variant="outline" size="sm">Xem chi tiết</Button>
                            </Link>
                        </div>
                    </div>
                ))}

                {trees.length === 0 && (
                    <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg bg-white">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4 text-lg">Bạn chưa có gia phả nào.</p>
                        <Button onClick={handleCreateTree} size="lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Bắt đầu tạo ngay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
