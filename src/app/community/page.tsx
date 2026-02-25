'use client'

import { useEffect, useState } from 'react'
import { getPublicTrees } from '@/lib/community'
import Link from 'next/link'
import { Eye, Heart, User, BookOpen, History, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function CommunityPage() {
    const [trees, setTrees] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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
            <Navbar />

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
            <Footer />
        </div>
    )
}
