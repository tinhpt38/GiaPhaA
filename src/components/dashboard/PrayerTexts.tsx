'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

// Import dữ liệu văn khấn
import prayerDataRaw from '@/data/prayers.json'

interface Prayer {
    stt: number
    title: string
    category: string
    content: string
}

export function PrayerTexts() {
    // Filter out invalid prayers - only keep those with valid stt numbers
    const prayerData: Prayer[] = prayerDataRaw.filter((p: any): p is Prayer =>
        typeof p.stt === 'number' &&
        typeof p.title === 'string' &&
        typeof p.category === 'string' &&
        typeof p.content === 'string'
    )

    // Nhóm các bài văn khấn theo category
    const categories = {
        'sinh_duong': 'Sinh dưỡng & Hiếu hỉ',
        'tang_gio': 'Tang lễ & Giỗ chạp',
        'tet': 'Lễ Tết trong năm',
        'nha_o': 'Nhà ở & Công trình',
        'chua_dinh': 'Lễ Chùa, Đình, Miếu',
        'le_khac': 'Hướng dẫn & Lễ khác'
    }

    const groupedPrayers: Record<string, Prayer[]> = {
        sinh_duong: [],
        tang_gio: [],
        tet: [],
        nha_o: [],
        chua_dinh: [],
        le_khac: []
    }

    // Phân loại các bài văn khấn
    prayerData.forEach((prayer) => {
        const cat = prayer.category.toLowerCase()
        if (cat.includes('sinh dưỡng')) {
            groupedPrayers.sinh_duong.push(prayer)
        } else if (cat.includes('tang lễ') || cat.includes('giỗ')) {
            groupedPrayers.tang_gio.push(prayer)
        } else if (cat.includes('tết') || cat.includes('táo') || cat.includes('giao thừa')) {
            groupedPrayers.tet.push(prayer)
        } else if (cat.includes('chùa') || cat.includes('đình') || cat.includes('miếu')) {
            groupedPrayers.chua_dinh.push(prayer)
        } else if (cat.includes('nhà') || cat.includes('đất') || cat.includes('khai trương')) {
            groupedPrayers.nha_o.push(prayer)
        } else {
            groupedPrayers.le_khac.push(prayer)
        }
    })

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-2xl">Tuyển tập các bài văn khấn thông dụng</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Sưu tầm và biên soạn {prayerData.length} bài văn khấn và hướng dẫn nghi lễ
                </p>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="sinh_duong" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                        <TabsTrigger value="sinh_duong">Sinh dưỡng</TabsTrigger>
                        <TabsTrigger value="tang_gio">Tang/Giỗ</TabsTrigger>
                        <TabsTrigger value="tet">Lễ Tết</TabsTrigger>
                        <TabsTrigger value="nha_o">Nhà ở</TabsTrigger>
                        <TabsTrigger value="chua_dinh">Chùa/Đình</TabsTrigger>
                        <TabsTrigger value="le_khac">Khác</TabsTrigger>
                    </TabsList>

                    {Object.entries(groupedPrayers).map(([key, prayers]) => (
                        <TabsContent key={key} value={key} className="mt-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{categories[key as keyof typeof categories]}</h3>
                                <p className="text-sm text-muted-foreground">Có {prayers.length} bài văn khấn</p>
                            </div>

                            <ScrollArea className="h-[600px] pr-4">
                                <Accordion type="single" collapsible className="w-full">
                                    {prayers.map((prayer) => (
                                        <AccordionItem key={prayer.stt} value={`prayer-${prayer.stt}`}>
                                            <AccordionTrigger className="text-base font-medium hover:no-underline">
                                                <div className="flex items-start gap-2 text-left">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                                        {prayer.stt}
                                                    </span>
                                                    <span>{prayer.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-3 text-sm">
                                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                                                    <p className="text-xs text-amber-800 font-medium mb-1">Phân loại:</p>
                                                    <p className="text-sm text-amber-900">{prayer.category}</p>
                                                </div>
                                                <div className="prose prose-sm max-w-none">
                                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border">
                                                        {prayer.content}
                                                    </pre>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                        <strong>Lưu ý:</strong> Các bài văn khấn trên là mẫu tham khảo. Khi cúng, bạn có thể điều chỉnh
                        cho phù hợp với hoàn cảnh và tập quán của gia đình. Điều quan trọng nhất là lòng thành kính
                        và sự tôn trọng đối với tổ tiên, thần linh.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
