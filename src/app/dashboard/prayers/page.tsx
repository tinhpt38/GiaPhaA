'use client'

import { PrayerTexts } from '@/components/dashboard/PrayerTexts'

export default function PrayersPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Các bài văn khấn thông dụng</h1>
                <p className="text-muted-foreground">
                    Tuyển tập các bài văn cúng dịp lễ Tết, hiếu hỉ trong năm
                </p>
            </div>
            <PrayerTexts />
        </div>
    )
}
