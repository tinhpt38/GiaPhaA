'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

export function Navbar() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [supabase])

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 lg:px-20 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 relative">
                        <Image src="/logo_v2.png" alt="Gia Pha Viet Logo" fill className="object-contain" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-[#8B0000]">GIA PHẢ VIỆT</h2>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#features">Tính năng</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/community">Cộng đồng</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#about">Về chúng tôi</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#pricing">Bảng giá</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#guide">Hướng dẫn</Link>
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
    )
}
