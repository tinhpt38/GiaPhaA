'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Plus,
    BookOpen,
    Users,
    Calendar,
    Layers,
    Search,
    Bell,
    Settings,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

interface Tree {
    id: string
    name: string
    description: string
    created_at: string
}

interface Profile {
    plan_tier: 'hieu' | 'dao'
    full_name?: string
}

export default function DashboardPage() {
    const [trees, setTrees] = useState<Tree[]>([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('plan_tier, full_name')
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
            alert(error.message)
        } else if (data) {
            setTrees([data, ...trees])
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    const userName = profile?.full_name || user?.email?.split('@')[0] || 'Bạn'

    return (
        <div className="min-h-screen bg-[#f8f6f6]">
            {/* Top Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Bảng điều khiển</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative w-64 group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary" />
                            <input
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="Tìm kiếm gia phả..."
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500 uppercase">{profile?.plan_tier || 'Thường'}</p>
                            </div>
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#A52A2A] text-white p-8 md:p-12 shadow-2xl">
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest mb-4">
                                Chào mừng trở lại
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold mb-2">Chào mừng, {userName}!</h3>
                            <p className="text-white/80 max-w-lg leading-relaxed">
                                Bạn đang quản lý {trees.length} gia phả.
                                {trees.length === 0 ? ' Hãy bắt đầu tạo gia phả đầu tiên của bạn.' : ' Tiếp tục xây dựng và hoàn thiện cây gia phả của dòng họ.'}
                            </p>
                            <div className="flex gap-4 mt-8">
                                {trees.length > 0 ? (
                                    <Link href={`/tree/${trees[0].id}`}>
                                        <Button className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl">
                                            Xem Cây Gia Phả
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button onClick={handleCreateTree} className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl">
                                        Tạo Gia Phả Đầu Tiên
                                    </Button>
                                )}
                                <Link href="/dashboard/generations">
                                    <Button variant="outline" className="bg-primary/20 border-white/30 text-white hover:bg-white/10 font-bold">
                                        Tìm hiểu Cửu tộc
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <BookOpen className="w-40 h-40 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="size-10 rounded-lg bg-red-100 text-primary flex items-center justify-center mb-2">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Tổng số gia phả</p>
                                    <div className="flex items-end gap-2 mt-1">
                                        <h4 className="text-3xl font-bold">{trees.length}</h4>
                                        <span className="text-xs text-gray-400 mb-1">
                                            / {profile?.plan_tier === 'dao' ? '∞' : '2'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="size-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Gói hiện tại</p>
                                    <div className="flex items-end gap-2 mt-1">
                                        <h4 className="text-3xl font-bold uppercase">{profile?.plan_tier || 'Thường'}</h4>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Tham gia từ</p>
                                    <div className="flex items-end gap-2 mt-1">
                                        <h4 className="text-lg font-bold">
                                            {new Date(user?.created_at).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Trees Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Các gia phả của bạn</h2>
                        <Button onClick={handleCreateTree} className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Tạo Gia Phả Mới
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trees.map((tree) => (
                            <Card key={tree.id} className="group hover:shadow-xl transition-all hover:border-primary/50 border-gray-100">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold mb-1 truncate">{tree.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {tree.description || 'Chưa có mô tả'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(tree.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                        <Link href={`/tree/${tree.id}`}>
                                            <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                                                Xem <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {trees.length === 0 && (
                            <div className="col-span-full">
                                <Card className="border-2 border-dashed border-gray-200">
                                    <CardContent className="text-center py-16">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <h3 className="text-xl font-bold mb-2">Bạn chưa có gia phả nào</h3>
                                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                            Bắt đầu ghi chép lịch sử gia đình của bạn ngay hôm nay. Tạo gia phả đầu tiên để lưu giữ những câu chuyện quý giá.
                                        </p>
                                        <Button onClick={handleCreateTree} size="lg" className="shadow-lg shadow-primary/20">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Bắt đầu tạo ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/dashboard/generations">
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer border-gray-100">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Hệ thống thế hệ</h4>
                                    <p className="text-sm text-muted-foreground">Tìm hiểu Cửu tộc</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/dashboard/prayers">
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer border-gray-100">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Văn khấn</h4>
                                    <p className="text-sm text-muted-foreground">Bài khấn truyền thống</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/sample">
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer border-gray-100">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Gia phả mẫu</h4>
                                    <p className="text-sm text-muted-foreground">Xem mẫu tham khảo</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    )
}
