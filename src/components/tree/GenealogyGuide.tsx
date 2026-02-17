import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GenealogyGuide() {
    return (
        <Card className="h-full border-0 shadow-none flex flex-col bg-white">
            <CardHeader className="py-4 px-6 shrink-0 border-b">
                <CardTitle className="text-xl text-primary">Hướng dẫn lập Gia Phả</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full px-6 py-6 overflow-y-auto">
                    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                        <section>
                            <h3 className="font-bold text-base mb-2 text-slate-900">1. Các thành phần cần ghi</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Đời:</strong> Ghi rõ đời thứ mấy.</li>
                                <li><strong>Tên họ:</strong> Tên huý, tên tự, tên hiệu, tên thuỵ (nếu có).</li>
                                <li><strong>Ngày sinh/mất:</strong> Ghi rõ Dương lịch và Âm lịch.</li>
                                <li><strong>Quan hệ:</strong> Con ông, con bà nào.</li>
                                <li><strong>Nghề nghiệp/Công danh:</strong> Khoa bảng, chức vụ, công việc.</li>
                                <li><strong>Cư trú:</strong> Sinh quán, nơi định cư, nơi mất, nơi an táng.</li>
                                <li><strong>Hôn phối:</strong> Tên vợ/chồng, ngày kết hôn, quê quán vợ/chồng.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-base mb-2 text-slate-900">2. Giải thích thuật ngữ</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-slate-800">Tên huý:</span> Tên do cha mẹ đặt từ nhỏ (tên khai sinh).
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-800">Tên tự:</span> Tên do trí thức xưa tự đặt hoặc bạn bè gọi, mang ý nghĩa bổ sung cho tên huý.
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-800">Tên hiệu:</span> Biệt danh, bút danh (nếu có sáng tác văn thơ) hoặc pháp danh (nếu quy y).
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-800">Tên thuỵ:</span> Tên đặt sau khi mất để khấn cúng. Thường do con cháu hoặc vua quan ban tặng dựa trên đức hạnh lúc sinh thời.
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="font-bold text-base mb-2 text-slate-900">3. Lưu ý khi nhập liệu</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Ghi rõ thân thế cha mẹ ruột (nếu biết).</li>
                                <li>Mục "Công danh" nên ghi chi tiết học vị (Tú tài, Cử nhân, Tiến sĩ...) và chức vụ.</li>
                                <li>Thứ bậc vợ chồng: Vợ chính (Đích nhất), vợ kế (Thứ nhất)...</li>
                                <li>Ghi lại đức hạnh, cách giáo dục con cái của tiền nhân để làm gương cho hậu thế.</li>
                            </ul>
                        </section>

                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 mt-4">
                            <strong>Mẹo:</strong> Bấm vào nút <strong>+</strong> trên cây gia phả để thêm thành viên mới, hoặc bấm vào thành viên để chỉnh sửa thông tin chi tiết.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
