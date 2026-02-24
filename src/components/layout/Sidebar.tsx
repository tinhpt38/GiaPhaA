'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BookOpen, Scroll, Users, BookMarked, Calendar } from 'lucide-react'

const menuItems = [
    {
        title: 'Gia phả của tôi',
        href: '/dashboard',
        icon: BookOpen,
    },
    {
        title: 'Lịch Nhắc',
        href: '/dashboard/events',
        icon: Calendar,
    },
    {
        title: 'Gia phả mẫu',
        href: '/dashboard/sample',
        icon: BookMarked,
    },
    {
        title: 'Hệ thống thế hệ',
        href: '/dashboard/generations',
        icon: Users,
    },
    {
        title: 'Văn khấn',
        href: '/dashboard/prayers',
        icon: Scroll,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-white shrink-0">
            <div className="p-6 border-b">
                <div className="flex items-center gap-2 mb-1">
                    <div className="relative w-8 h-8">
                        <Image src="/logo_v2.png" alt="Gia Pha Viet" fill className="object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Gia Phả Việt</h2>
                </div>
                <p className="text-xs text-muted-foreground">Giữ gìn cội nguồn, kết nối tương lai</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="border-t p-4">
                <p className="text-xs text-muted-foreground text-center">
                    © 2026 Gia Phả App
                </p>
            </div>
        </div>
    )
}
