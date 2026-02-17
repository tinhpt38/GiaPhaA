'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GenerationGuide() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Hệ thống tên gọi các thế hệ (Cửu tộc)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Hệ thống tên gọi các thế hệ trong gia đình người Việt thường được tính theo <strong>"Cửu tộc"</strong> (9 đời),
                    lấy cha mẹ mình làm trung tâm.
                </p>

                <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                        <h4 className="font-semibold text-sm mb-1">Thế hệ trên (4 đời)</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li><strong>Cao Tổ</strong> - Ông cố (đời thứ 4 trở lên)</li>
                            <li><strong>Tằng Tổ</strong> - Ông kỵ (đời thứ 3)</li>
                            <li><strong>Tổ</strong> - Ông nội/ngoại (đời thứ 2)</li>
                            <li><strong>Phụ/Mẫu</strong> - Cha/Mẹ (đời thứ 1)</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                        <h4 className="font-semibold text-sm mb-1">Thế hệ mình (1 đời)</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li><strong>Kỷ/Thân</strong> - Bản thân mình</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50">
                        <h4 className="font-semibold text-sm mb-1">Thế hệ dưới (4 đời)</h4>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li><strong>Tử</strong> - Con (đời thứ 1)</li>
                            <li><strong>Tôn</strong> - Cháu (đời thứ 2)</li>
                            <li><strong>Tằng Tôn</strong> - Chắt (đời thứ 3)</li>
                            <li><strong>Huyền Tôn</strong> - Chút (đời thứ 4 trở xuống)</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                    <p className="text-xs text-slate-600 italic">
                        <strong>Lưu ý:</strong> Hệ thống Cửu tộc giúp xác định rõ ràng mối quan hệ huyết thống và
                        trách nhiệm thờ cúng trong gia đình. Khi lập gia phả, cần ghi chú đầy đủ thông tin về
                        từng thế hệ để con cháu sau này dễ dàng tra cứu.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
