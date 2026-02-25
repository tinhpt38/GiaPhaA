import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 relative">
                                <Image src="/logo_v2.png" alt="Gia Pha Viet Logo" fill className="object-contain" />
                            </div>
                            <h2 className="text-xl font-black tracking-tight text-[#8B0000] uppercase">Gia Phả Việt</h2>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Dự án văn hóa số hướng tới việc lưu giữ và phát huy giá trị gia đình Việt Nam trong thời đại mới.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Sản phẩm</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" href="/#features">Tính năng</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/sample">Mẫu gia phả</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/#pricing">Bảng giá</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Hỗ trợ</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" href="/#guide">Hướng dẫn sử dụng</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/changelog">Nhật ký thay đổi (Changelog)</Link></li>
                            {/* <li><a href="mailto:tinhp.wk@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">Báo cáo lỗi / Liên hệ</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Pháp lý</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-colors" href="/terms">Điều khoản dịch vụ</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/privacy">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">© 2024 Gia Phả Việt. Được tạo bởi Phan Trung Tính.</p>
                    <p className="text-xs text-slate-400">Tiếng Việt (Vietnam)</p>
                </div>
            </div>
        </footer>
    )
}
