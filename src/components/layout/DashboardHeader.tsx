'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

interface Profile {
    plan_tier?: string
    full_name?: string
}

export function DashboardHeader() {
    const pathname = usePathname()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkAuth()
    }, [supabase])

    const { data: profile } = useQuery({
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

    const getTitle = () => {
        if (pathname === '/dashboard') return 'Bảng điều khiển'
        if (pathname === '/dashboard/generations') return 'Hệ thống thế hệ'
        if (pathname === '/dashboard/prayers') return 'Văn khấn'
        if (pathname === '/dashboard/sample') return 'Gia phả mẫu'
        if (pathname.startsWith('/dashboard/tree/')) return 'Quản lý cây gia phả'
        return 'Gia Phả Việt'
    }

    const userName = profile?.full_name || user?.email?.split('@')[0] || '...'

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-3 lg:py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-4 font-bold text-gray-800">
                    <Link href="/dashboard" className="lg:hidden">
                        <div className="bg-primary p-1 rounded-lg text-white hover:scale-105 transition-transform cursor-pointer">
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </Link>
                    <h2 className="text-lg lg:text-xl truncate max-w-[150px] sm:max-w-none">{getTitle()}</h2>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Tìm kiếm..." className="pl-10 w-48 lg:w-64 bg-gray-100/50 border-none focus:bg-white transition-all shadow-none" />
                    </div>

                    <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-gray-200">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-bold text-gray-800">{userName}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                {profile?.plan_tier === 'dao' ? 'Gói Đạo' : 'Gói Hiếu'}
                            </p>
                        </div>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-primary to-[#A52A2A] p-[2px] shadow-sm">
                            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center font-bold text-primary text-sm lg:text-base">
                                {userName[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
