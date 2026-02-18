'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  History,
  Heart,
  FileText
} from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FeaturedTrees } from '@/components/home/FeaturedTrees'

export default function HomePage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B0000] rounded-lg text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#8B0000]">GIA PHẢ VIỆT</h2>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#features">Tính năng</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#about">Về chúng tôi</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#pricing">Bảng giá</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#guide">Hướng dẫn</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="hidden sm:block text-sm font-bold px-5 py-2.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all text-primary">
                Đăng nhập
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                Bắt đầu ngay
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 px-6 lg:px-20">
          {/* Traditional pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#8B0000] px-4 py-1.5 rounded-full border border-[#D4AF37]/20 w-fit">
                <History className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Di sản văn hóa Việt</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-[#111621] tracking-tight">
                Gìn giữ <span className="text-[#8B0000]">nguồn cội</span>, kết nối tương lai
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Nền tảng hiện đại giúp bạn tạo lập, lưu trữ và chia sẻ phả hệ gia đình một cách trân trọng và chuyên nghiệp nhất. Hãy cùng chúng tôi viết tiếp trang sử vàng của dòng họ.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="bg-[#8B0000] text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl shadow-[#8B0000]/20 hover:bg-red-800 transition-all flex items-center justify-center gap-2">
                    Bắt đầu tạo Gia Phả
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/sample">
                  <button className="bg-white text-[#111621] text-lg font-bold px-8 py-4 rounded-xl border border-slate-200 hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-sm">
                    Xem mẫu phả hệ
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-slate-200">
                    <Image
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop"
                      alt="User 1"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-slate-200">
                    <Image
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&auto=format&fit=crop"
                      alt="User 2"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-slate-200">
                    <Image
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop"
                      alt="User 3"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 relative z-10">
                    10k+
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">Hơn 10,000+ gia đình đã tham gia</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-[#D4AF37]/20 rounded-[2.5rem] blur-3xl opacity-30" />
              <div className="relative rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl aspect-square lg:aspect-video bg-white">
                <Image
                  src="/home-feature.jpg"
                  alt="Gia Phả Việt Feature"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Trees Section */}
        <FeaturedTrees />

        {/* Why Use Section */}
        <section id="about" className="py-24 px-6 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-[#8B0000] font-bold text-sm tracking-[0.2em] uppercase mb-4">Ý nghĩa thiêng liêng</h2>
                <h3 className="text-3xl lg:text-4xl font-black text-[#111621] leading-tight">Tại sao cần tạo Gia Phả?</h3>
                <p className="text-slate-500 mt-4 text-lg">Gia phả không chỉ là danh sách tên tuổi, đó là sợi dây kết nối các thế hệ và lưu giữ tinh hoa gia đình.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-[#FDFBF7] border border-slate-100 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-[#8B0000]/10 text-[#8B0000] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">Lưu giữ truyền thống</h4>
                <p className="text-slate-600 leading-relaxed">Bảo tồn lịch sử dòng họ qua nhiều thế hệ, ghi chép lại những công đức và bài học của tổ tiên.</p>
              </div>

              <div className="group p-8 rounded-2xl bg-[#FDFBF7] border border-slate-100 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">Kết nối thành viên</h4>
                <p className="text-slate-600 leading-relaxed">Tìm lại nguồn cội và gắn kết người thân khắp mọi miền, xây dựng mạng lưới dòng tộc vững mạnh.</p>
              </div>

              <div className="group p-8 rounded-2xl bg-[#FDFBF7] border border-slate-100 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">Giáo dục con cháu</h4>
                <p className="text-slate-600 leading-relaxed">Giúp thế hệ trẻ hiểu rõ gốc gác, tự hào về bản sắc và truyền thống tốt đẹp của gia đình.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-20 bg-[#f1f3f7]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">Công nghệ tiên phong</h2>
              <h3 className="text-3xl lg:text-4xl font-black text-[#111621] leading-tight">Tính năng nổi bật</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-6 relative group bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image
                    src="/feature-f1.jpg"
                    alt="Kéo thả dễ dàng"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-4 pb-4">
                  <h4 className="text-xl font-bold mb-2">Kéo-thả dễ dàng</h4>
                  <p className="text-slate-500 text-sm">Xây dựng cây gia phả phức tạp chỉ với vài thao tác chuột đơn giản, trực quan và chuyên nghiệp.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-6 relative group bg-gradient-to-br from-[#8B0000]/10 to-[#8B0000]/5">
                  <Image
                    src="/feature-f2.jpg"
                    alt="Lưu trữ ký ức"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-4 pb-4">
                  <h4 className="text-xl font-bold mb-2">Lưu trữ ký ức</h4>
                  <p className="text-slate-500 text-sm">Kho lưu trữ hình ảnh, tài liệu và video chất lượng cao giúp bảo tồn mọi khoảnh khắc quý giá.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-6 relative group bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5">
                  <Image
                    src="/feature-f3.jpg"
                    alt="Viết tiếp sử gia"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-4 pb-4">
                  <h4 className="text-xl font-bold mb-2">Viết tiếp sử gia</h4>
                  <p className="text-slate-500 text-sm">Công cụ soạn thảo chuyên nghiệp để viết nên những trang sử gia đình một cách sống động.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="guide" className="py-24 px-6 lg:px-20 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <h3 className="text-3xl font-black text-[#111621]">Bắt đầu chỉ với 3 bước</h3>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#D4AF37]/20 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-black text-2xl mb-6 shadow-xl border-4 border-white">1</div>
                  <h5 className="text-lg font-bold mb-2">Tạo tài khoản</h5>
                  <p className="text-slate-500 text-sm px-4">Đăng ký dễ dàng bằng email hoặc mạng xã hội để bắt đầu ngay lập tức.</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-black text-2xl mb-6 shadow-xl border-4 border-white">2</div>
                  <h5 className="text-lg font-bold mb-2">Nhập thông tin</h5>
                  <p className="text-slate-500 text-sm px-4">Thêm các thành viên, hình ảnh và câu chuyện về từng người trong gia đình.</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-black text-2xl mb-6 shadow-xl border-4 border-white">3</div>
                  <h5 className="text-lg font-bold mb-2">Chia sẻ & Kết nối</h5>
                  <p className="text-slate-500 text-sm px-4">Mời người thân tham gia đóng góp và cùng nhau hoàn thiện cây gia phả.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto bg-[#111621] rounded-[2rem] p-8 lg:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Sẵn sàng gìn giữ<br />truyền thống dòng họ?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Tham gia cùng hàng ngàn gia đình Việt đang xây dựng ngôi nhà số cho ký ức của họ.
              </p>
              <Link href="/login">
                <button className="bg-[#D4AF37] text-[#111621] text-lg font-black px-10 py-4 rounded-xl shadow-2xl shadow-[#D4AF37]/20 hover:bg-yellow-500 transition-all">
                  Tạo Gia Phả Miễn Phí Ngay
                </button>
              </Link>
              <p className="text-slate-500 text-sm mt-6">Không cần thẻ tín dụng • Khởi tạo trong 30 giây</p>
            </div>
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
                <li><a className="hover:text-primary transition-colors" href="#features">Tính năng</a></li>
                <li><Link className="hover:text-primary transition-colors" href="/sample">Mẫu gia phả</Link></li>
                <li><a className="hover:text-primary transition-colors" href="#pricing">Bảng giá</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Hỗ trợ</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#guide">Hướng dẫn sử dụng</a></li>
                <li><Link className="hover:text-primary transition-colors" href="/dashboard/generations">Hệ thống thế hệ</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/dashboard/prayers">Văn khấn</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Pháp lý</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a></li>
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
