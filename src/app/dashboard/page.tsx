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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
    const [user, setUser] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newTreeName, setNewTreeName] = useState('')
    const [newTreeDescription, setNewTreeDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const supabase = createClient()
    const router = useRouter()
    const queryClient = useQueryClient()

    // 1. Kiểm tra xác thực
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)
        }
        checkAuth()
    }, [router, supabase])

    // 2. Lấy Profile với Cache
    const { data: profileData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select('plan_tier, full_name')
                .eq('id', user?.id)
                .single()
            return data as Profile
        },
        enabled: !!user?.id,
    })

    // 3. Lấy danh sách Gia phả với Cache
    const { data: treesData, isLoading: isTreesLoading } = useQuery({
        queryKey: ['trees', user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('trees')
                .select('*')
                .eq('owner_id', user?.id)
                .order('created_at', { ascending: false })
            return data as Tree[]
        },
        enabled: !!user?.id,
    })

    const effectiveTrees = treesData || []
    const effectiveProfile = profileData
    const isLoading = isProfileLoading || (isTreesLoading && effectiveTrees.length === 0)

    const handleCreateTree = async () => {
        if (!newTreeName.trim()) {
            alert('Vui lòng nhập tên gia phả')
            return
        }

        setIsSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('trees')
            .insert({
                owner_id: user.id,
                name: newTreeName,
                description: newTreeDescription || 'Mô tả ngắn về gia phả dòng họ...'
            })
            .select()
            .single()

        setIsSubmitting(false)
        if (error) {
            alert(error.message)
        } else {
            // Làm mới cache mà không cần reload trang
            queryClient.invalidateQueries({ queryKey: ['trees', user?.id] })
            setIsCreateDialogOpen(false)
            setNewTreeName('')
            setNewTreeDescription('')
        }
    }

    const openCreateDialog = () => {
        // Optimistic check before server check
        if (effectiveProfile?.plan_tier === 'hieu' && effectiveTrees.length >= 2) {
            alert('Gói Hiếu chỉ được tạo tối đa 2 gia phả. Vui lòng nâng cấp gói Đạo để tạo thêm.')
            return
        }
        setIsCreateDialogOpen(true)
    }

    // Nếu chưa có user (đang check auth), hiển thị màn hình chờ nhỏ
    if (!user && !effectiveTrees.length) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f6f6]">
                <BookOpen className="h-10 w-10 text-primary animate-pulse" />
            </div>
        )
    }

    const userName = effectiveProfile?.full_name || user?.email?.split('@')[0] || 'Bạn'

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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Notifications and Settings hidden as requested */}
                        </div>

                        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500 uppercase">{effectiveProfile?.plan_tier || 'Thường'}</p>
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

                    <div className="relative z-10">
                        <div>
                            <p className="text-sm text-white/80 mb-2 font-medium">Chào mừng bạn trở lại,</p>
                            <h1 className="text-3xl md:text-4xl font-black mb-4">
                                {isLoading ? "Đang chuẩn bị dữ liệu..." : `Gia tộc ${userName}`}
                            </h1>
                            <p className="text-lg text-white/90 max-w-xl leading-relaxed">
                                Nơi lưu giữ linh hồn và câu chuyện của dòng họ qua từng thế hệ. Hãy tiếp tục gieo mầm cho cây đại thụ gia đình mình.
                            </p>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <Button size="lg" onClick={openCreateDialog} className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl">
                                <Plus className="mr-2 h-5 w-5" /> Tạo gia phả mới
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-bold px-8">
                                Tìm hiểu thêm
                            </Button>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl text-white"></div>
                </div>



                {/* Family Trees Grid - Skeleton Support */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">Cây gia phả của bạn</h3>
                        <Button onClick={openCreateDialog} className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Tạo Gia Phả Mới
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            // Skeleton Cards
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl h-[180px] shadow-sm animate-pulse flex flex-col p-6 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex-1" />
                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                                        <div className="h-8 bg-gray-200 rounded w-20" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            effectiveTrees
                                .filter(tree => tree.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((tree) => (
                                    <Link key={tree.id} href={`/tree/${tree.id}`}>
                                        <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden rounded-2xl h-full">
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
                                                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                                                        Xem <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                        )}

                        {!isLoading && effectiveTrees.length === 0 && (
                            <div className="col-span-full">
                                <Card className="border-2 border-dashed border-gray-200">
                                    <CardContent className="text-center py-16">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <h3 className="text-xl font-bold mb-2">Bạn chưa có gia phả nào</h3>
                                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                            Bắt đầu ghi chép lịch sử gia đình của bạn ngay hôm nay. Tạo gia phả đầu tiên để lưu giữ những câu chuyện quý giá.
                                        </p>
                                        <Button onClick={openCreateDialog} size="lg" className="shadow-lg shadow-primary/20">
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

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Tạo Gia Phả Mới</DialogTitle>
                        <DialogDescription>
                            Bắt đầu hành trình ghi chép lịch sử dòng họ của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên gia phả</Label>
                            <Input
                                id="name"
                                placeholder="Ví dụ: Gia tộc Nguyễn Văn"
                                value={newTreeName}
                                onChange={(e) => setNewTreeName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                            <Textarea
                                id="description"
                                placeholder="Nhập một vài thông tin giới thiệu về gia phả..."
                                value={newTreeDescription}
                                onChange={(e) => setNewTreeDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreateTree} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Gia Phả'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
