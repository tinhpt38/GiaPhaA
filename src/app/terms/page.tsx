import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif] p-6 lg:p-20">
            <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-slate-100">
                <Link href="/" className="inline-flex items-center gap-2 text-[#8B0000] hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-[#8B0000]/10 rounded-xl text-[#8B0000]">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-[#111621] tracking-tight">Điều khoản dịch vụ</h1>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                    <p>Chào mừng bạn đến với Gia Phả Việt. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản sau đây. Vui lòng đọc kỹ.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">1. Chấp nhận điều khoản</h3>
                    <p>Bằng việc truy cập và sử dụng website Gia Phả Việt, bạn đồng ý tuân thủ các điều khoản và quy định của chúng tôi. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">2. Tài khoản người dùng</h3>
                    <p>Bạn phải bảo mật thông tin tài khoản của mình. Mọi hoạt động phát sinh từ tài khoản của bạn sẽ do bạn chịu trách nhiệm.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">3. Quyền sáng tạo và nội dung</h3>
                    <p>Người dùng giữ quyền sở hữu đối với các thông tin gia phả do mình tải lên. Bằng việc đăng tải, bạn cam kết các thông tin này không vi phạm pháp luật và bạn chịu hoàn toàn trách nhiệm đối với tính chính xác của dữ liệu.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">4. Thay đổi điều khoản</h3>
                    <p>Chúng tôi có quyền cập nhật và thay đổi điều khoản dịch vụ vào bất kỳ lúc nào mà không cần báo trước. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải.</p>

                    <p className="mt-12 text-sm text-slate-400">Cập nhật lần cuối: 24/02/2026</p>
                </div>
            </div>
        </div>
    )
}
