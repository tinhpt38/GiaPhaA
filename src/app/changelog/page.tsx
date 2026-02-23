import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, Mail, FileClock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function ChangelogPage() {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    let content = ''
    try {
        content = fs.readFileSync(changelogPath, 'utf8')
    } catch (e) {
        content = 'Chưa có thông tin cập nhật nào.'
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-['Be_Vietnam_Pro',sans-serif] p-6 lg:p-20">
            <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-slate-100">
                <Link href="/" className="inline-flex items-center gap-2 text-[#8B0000] hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
                </Link>

                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-8">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                        <FileClock className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black text-[#111621] tracking-tight">Nhật ký thay đổi</h1>
                        <p className="text-slate-500 mt-2">Theo dõi các bản cập nhật và tính năng mới từ Gia Phả Việt</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 marker:text-slate-500">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-[#8B0000] mt-8 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 text-slate-600" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-600" {...props} />,
                            li: ({ node, ...props }) => <li className="" {...props} />
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 mb-2">Đóng góp & Báo cáo lỗi nhanh?</h3>
                        <p className="text-slate-600">Mọi báo cáo lỗi hoặc chia sẻ ý tưởng tính năng đều sẽ được quản trị viên xử lý sớm nhất. Đừng ngần ngại cho chúng tôi biết, xin trân trọng cảm ơn.</p>
                    </div>
                    <a
                        href="mailto:tinhp.wk@gmail.com"
                        className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#8B0000] text-white px-6 py-4 rounded-xl hover:bg-red-800 transition-all font-bold shadow-lg shadow-[#8B0000]/20"
                    >
                        <Mail className="w-5 h-5" /> Gửi phản hồi
                    </a>
                </div>
            </div>
        </div>
    )
}
