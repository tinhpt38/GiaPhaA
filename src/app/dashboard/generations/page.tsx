'use client'

import { GenerationGuide } from '@/components/dashboard/GenerationGuide'

export default function GenerationsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Hệ thống thế hệ (Cửu tộc)</h1>
                <p className="text-muted-foreground">
                    Tìm hiểu về hệ thống tên gọi các thế hệ trong gia đình người Việt
                </p>
            </div>
            <GenerationGuide />
        </div>
    )
}
