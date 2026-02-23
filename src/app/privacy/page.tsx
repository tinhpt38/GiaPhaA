import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif] p-6 lg:p-20">
            <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-slate-100">
                <Link href="/" className="inline-flex items-center gap-2 text-[#8B0000] hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-[#111621] tracking-tight">Chính sách bảo mật</h1>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                    <p>Chào mừng bạn đến với Gia Phả Việt. Tại đây, chúng tôi hiểu rằng dữ liệu phả hệ gia đình là thiêng liêng và riêng tư, do đó chính sách bảo mật này được tạo ra để cam kết bảo vệ quyền riêng tư của bạn.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">1. Thu thập thông tin</h3>
                    <p>Khi đăng ký tài khoản và tạo gia phả, hệ thống sẽ thu thập thông tin cơ bản qua việc xác thực bởi Google (Email, ID, ảnh cá nhân). Đồng thời, bạn sẽ cung cấp các thông tin liên quan đến các thành viên gia phả do bạn tự tạo.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">2. Cách tiếp cận và sử dụng dữ liệu</h3>
                    <p>Dữ liệu tạo bởi người dùng được lưu trữ an toàn, phục vụ duy nhất cho cấu trúc hệ thống hoặc các công cụ xuất báo cáo (ví dụ: in ấn PDF, xuất JSON) khi có sự cho phép trực tiếp bởi các tính năng. Chúng tôi cam kết tuyệt đối không buôn bán hay kinh doanh trên dữ liệu phả hệ của bạn.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">3. Cảnh báo hiển thị và rò rỉ dữ liệu</h3>
                    <p>Tuy nhiên, nếu người dùng kích hoạt trạng thái "Công khai gia phả", link chia sẻ có thể được bất kì ai truy cập và nó sẽ hiển thị công khai trên dòng thời gian Cộng đồng. Điều này đồng nghĩa thông tin thành viên bạn cung cấp sẽ khả kiến trên toàn cầu internet. Vui lòng cân nhắc nguy cơ này.</p>

                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">4. Quyền xóa dữ liệu</h3>
                    <p>Bạn luôn có quyền kiểm soát toàn diện đối với dữ liệu cá nhân mình, bao gồm chỉnh sửa thông tin hoặc xóa vĩnh viễn cây gia phả. Mọi thao tác xoá là không thể bị đảo ngược.</p>

                    <p className="mt-12 text-sm text-slate-400">Cập nhật lần cuối: 24/02/2026</p>
                </div>
            </div>
        </div>
    )
}
