'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Phone, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/dashboard')
            }
        }
        checkUser()
    }, [supabase, router])

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
        } catch (error) {
            console.error('Login error:', error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif]">
            {/* Left Side: Branding & Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#8B0000] to-[#A52A2A] relative overflow-hidden p-16 flex-col justify-between text-white">
                {/* Traditional pattern background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
                        <div className="p-2.5 bg-white rounded-xl text-[#8B0000] shadow-xl group-hover:scale-110 transition-transform">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Gia Phả Việt</h2>
                    </Link>

                    <h1 className="text-5xl font-black leading-tight mb-8">
                        Gìn giữ <span className="text-[#D4AF37]">nguồn cội</span>,<br />
                        Kết nối tương lai.
                    </h1>

                    <div className="space-y-6 max-w-md">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <p className="text-lg text-white/80 leading-relaxed">
                                Bảo mật tuyệt đối thông tin gia đình bạn với công nghệ mã hóa hiện đại.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Creator Info Section */}
                <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-[#D4AF37] font-bold text-sm tracking-[0.2em] uppercase mb-4">Thông tin nhà phát triển</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/50 bg-white/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Phan Trung Tính</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <a href="tel:0379080398" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors">
                                <div className="p-1.5 bg-white/10 rounded-md">
                                    <Phone className="w-4 h-4" />
                                </div>
                                0379.080.398
                            </a>
                            <a href="mailto:tinhp.wk@gmail.com" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors">
                                <div className="p-1.5 bg-white/10 rounded-md">
                                    <Mail className="w-4 h-4" />
                                </div>
                                tinhp.wk@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-[#8B0000] rounded-2xl text-white shadow-xl">
                                <BookOpen className="w-10 h-10" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-[#111621] mb-3">Chào mừng bạn!</h2>
                        <p className="text-slate-500">Đăng nhập để bắt đầu hành trình ghi chép lịch sử dòng họ.</p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-bold bg-white text-slate-700 border-2 border-slate-100 hover:border-[#8B0000] hover:bg-slate-50 hover:text-[#8B0000] shadow-sm transition-all flex items-center justify-center gap-4 rounded-2xl group"
                        >
                            <svg className="h-6 w-6" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            {isLoading ? 'Đang xử lý...' : 'Tiếp tục với Google'}
                            <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform opacity-50" />
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#FDFBF7] px-4 text-slate-400 font-medium tracking-widest">An toàn & Bảo mật</span>
                        </div>
                    </div>

                    {/* Creator info for mobile */}
                    <div className="lg:hidden bg-slate-100/50 p-6 rounded-2xl space-y-4">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] text-center">Nhà phát triển</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-[#8B0000]" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Phan Trung Tính</p>
                                <p className="text-xs text-slate-500">tinhp.wk@gmail.com • 0379.080.398</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                        Bằng việc tiếp tục, bạn đồng ý với <Link href="#" className="underline hover:text-slate-600">Điều khoản</Link> và <Link href="#" className="underline hover:text-slate-600">Chính sách</Link> của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    )
}

