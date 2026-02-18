'use client'

import { useEffect, useState } from 'react'
import { getPublicTrees } from '@/lib/community'
import Link from 'next/link'
import { Eye, Heart, User, BookOpen, History, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

export default function CommunityPage() {
    const [trees, setTrees] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [supabase])

    useEffect(() => {
        async function fetchTrees() {
            try {
                const data = await getPublicTrees()
                setTrees(data || [])
            } catch (error) {
                console.error('Failed to load community trees', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrees()
    }, [])

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 lg:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2 bg-[#8B0000] rounded-lg text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-[#8B0000]">GIA PHẢ VIỆT</h2>
                    </Link>

                    <nav className="hidden md:flex items-center gap-10">
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#features">Tính năng</Link>
                        <Link className="text-sm font-bold text-primary transition-colors" href="/community">Cộng đồng</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#about">Về chúng tôi</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#pricing">Bảng giá</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                                    Vào Dashboard
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                                        Bắt đầu ngay
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative py-20 px-6 lg:px-20 bg-white">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)',
                            backgroundSize: '24px 24px'
                        }}
                    />
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#8B0000] px-4 py-1.5 rounded-full border border-[#D4AF37]/20 w-fit mx-auto mb-6">
                            <History className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Di sản cộng đồng</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-[#111621] mb-6">
                            Khám phá <span className="text-[#8B0000]">Gia Phả Việt</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Những câu chuyện về nguồn cội được chia sẻ bởi cộng đồng. Tìm cảm hứng và kết nối với những người cùng dòng tộc.
                        </p>
                    </div>
                </section>

                {/* Trees List */}
                <section className="py-12 px-6 lg:px-20 bg-[#FDFBF7]">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="py-12 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                </div>
                            </div>
                        ) : trees.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-500">Chưa có gia phả nào được công khai.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trees.map((tree) => (
                                    <Link href={`/share/${tree.id}`} key={tree.id} className="group block h-full">
                                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 h-full flex flex-col">
                                            {/* Large Cover Image */}
                                            <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                                                {tree.cover_image ? (
                                                    <Image
                                                        src={tree.cover_image}
                                                        alt={tree.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B0000]/5 to-[#D4AF37]/5">
                                                        <span className="text-6xl">🌳</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-8 flex flex-col flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative border border-white shadow-sm">
                                                        {tree.profiles?.avatar_url ? (
                                                            <Image src={tree.profiles.avatar_url} alt="" fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#8B0000] uppercase tracking-wide">
                                                            {tree.profiles?.full_name || 'Ẩn danh'}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {new Date(tree.created_at).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-bold text-[#111621] mb-3 group-hover:text-[#8B0000] transition-colors">
                                                    {tree.name}
                                                </h3>
                                                <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                                                    {tree.description || 'Chưa có mô tả.'}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                                        <div className="flex items-center gap-1.5" title="Lượt xem">
                                                            <Eye className="w-4 h-4" />
                                                            {new Intl.NumberFormat().format(tree.view_count || 0)}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-red-500" title="Lượt thích">
                                                            <Heart className="w-4 h-4 fill-current" />
                                                            {new Intl.NumberFormat().format(tree.tree_votes?.[0]?.count || 0)}
                                                        </div>
                                                    </div>
                                                    <span className="text-[#8B0000] font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        Xem chi tiết <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#8B0000] rounded-lg text-white scale-75 origin-left">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight text-[#8B0000] uppercase">Gia Phả Việt</h2>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Dự án văn hóa số hướng tới việc lưu giữ và phát huy giá trị gia đình Việt Nam trong thời đại mới.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Sản phẩm</h4>
                            <ul className="flex flex-col gap-4 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="/#features">Tính năng</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/community">Cộng đồng</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/sample">Mẫu gia phả</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/#pricing">Bảng giá</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Hỗ trợ</h4>
                            <ul className="flex flex-col gap-4 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="/guide">Hướng dẫn sử dụng</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/dashboard/generations">Hệ thống thế hệ</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/dashboard/prayers">Văn khấn</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Pháp lý</h4>
                            <ul className="flex flex-col gap-4 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-400">© 2024 Gia Phả Việt. Được tạo bởi Phan Trung Tính.</p>
                        <p className="text-xs text-slate-400">Tiếng Việt (Vietnam)</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
