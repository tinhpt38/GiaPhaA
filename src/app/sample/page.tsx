'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Users, Calendar, Heart, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function SampleTreePublicPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkUser()
    }, [supabase])

    const homePath = isAuthenticated ? '/dashboard' : '/'

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 lg:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href={homePath} className="flex items-center gap-3">
                        <div className="p-2 bg-[#8B0000] rounded-lg text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-[#8B0000]">GIA PHẢ VIỆT</h2>
                    </Link>

                    <Link href={homePath}>
                        <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại {isAuthenticated ? 'Bảng điều khiển' : 'trang chủ'}
                        </button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto py-12 px-6 max-w-6xl">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#8B0000] px-4 py-1.5 rounded-full border border-[#D4AF37]/20 mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Mẫu tham khảo</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-4 text-[#111621]">
                        Gia phả họ Nguyễn - Mẫu tham khảo
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Gia phả mẫu theo hệ thống Cửu tộc (9 thế hệ) để tham khảo cách tổ chức và ghi chép gia phả
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="border-[#D4AF37]/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Users className="h-10 w-10 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng số thành viên</p>
                                    <p className="text-3xl font-bold">19</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#D4AF37]/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-10 w-10 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Số thế hệ</p>
                                    <p className="text-3xl font-bold">9</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#D4AF37]/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Heart className="h-10 w-10 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Còn sinh sống</p>
                                    <p className="text-3xl font-bold">8</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sample Tree Image */}
                <Card className="border-[#D4AF37]/20 mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">Sơ đồ cây gia phả mẫu</h2>
                        <div className="relative w-full aspect-video bg-gradient-to-br from-[#8B0000]/5 to-[#D4AF37]/5 rounded-xl border-2 border-dashed border-[#D4AF37]/30 flex items-center justify-center">
                            <div className="text-center p-8">
                                <BookOpen className="w-24 h-24 mx-auto mb-4 text-[#8B0000]/30" />
                                <p className="text-xl font-bold text-slate-600 mb-2">Sơ đồ cây gia phả</p>
                                <p className="text-slate-500">
                                    Minh họa cây gia phả 9 thế hệ theo hệ thống Cửu tộc
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-4 text-center">
                            💡 Đăng nhập để xem sơ đồ chi tiết và tương tác với cây gia phả
                        </p>
                    </CardContent>
                </Card>

                {/* Cửu tộc System */}
                <Card className="border-[#D4AF37]/20 mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Hệ thống Cửu tộc (9 thế hệ)</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#8B0000]/5 rounded-lg border border-[#8B0000]/10">
                                <h3 className="font-bold text-[#8B0000] mb-2">4 đời trên (Tổ tiên)</h3>
                                <ul className="space-y-1 text-slate-600">
                                    <li>• <strong>Cao Tổ</strong> - Nguyễn Văn Thủy (1800-1880)</li>
                                    <li>• <strong>Tằng Tổ</strong> - Nguyễn Văn Tằng (1825-1905)</li>
                                    <li>• <strong>Tổ</strong> - Nguyễn Văn Tiên (1850-1925)</li>
                                    <li>• <strong>Khảo/Tỷ</strong> - Nguyễn Văn Khảo & Hoàng Thị Tuyết (1875-1950)</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20">
                                <h3 className="font-bold text-[#D4AF37] mb-2">1 đời mình (Trung tâm)</h3>
                                <ul className="space-y-1 text-slate-600">
                                    <li>• <strong>Phụ/Mẫu</strong> - Nguyễn Văn Phụ & Đỗ Thị Mẫu (1900-1980)</li>
                                    <li>• <strong>Kỷ</strong> - Nguyễn Văn Kỷ & Vũ Thị Hương (1930-nay)</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-blue-700 mb-2">4 đời dưới (Con cháu)</h3>
                                <ul className="space-y-1 text-slate-600">
                                    <li>• <strong>Tử</strong> - Nguyễn Văn Tử (1960-nay)</li>
                                    <li>• <strong>Tôn</strong> - Nguyễn Văn Tôn (1990-nay)</li>
                                    <li>• <strong>Huyền</strong> - Nguyễn Văn Huyền & Nguyễn Thị Anh (2020-nay)</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-br from-[#8B0000] to-[#A52A2A] rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-black mb-4">Tạo gia phả của riêng bạn</h2>
                    <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                        Bắt đầu xây dựng cây gia phả cho dòng họ của bạn với đầy đủ tính năng chuyên nghiệp
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <button className="bg-white text-[#8B0000] text-lg font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform">
                                Đăng nhập để bắt đầu
                            </button>
                        </Link>
                        <Link href="/">
                            <button className="bg-[#D4AF37] text-[#111621] text-lg font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform">
                                Tìm hiểu thêm
                            </button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-20">
                <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
                    <p>© 2024 Gia Phả Việt. Được tạo bởi Phan Trung Tính.</p>
                </div>
            </footer>
        </div>
    )
}
