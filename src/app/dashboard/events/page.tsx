
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getUpcomingEvents, CalendarEvent } from '@/lib/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Loader2, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function EventsPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Get all trees owned by user
            const { data: trees } = await supabase
                .from('trees')
                .select('id')
                .eq('owner_id', user.id)

            if (!trees || trees.length === 0) {
                setLoading(false)
                return
            }

            const treeIds = trees.map(t => t.id)

            // 2. Get all members from these trees
            const { data: members } = await supabase
                .from('members')
                .select('*')
                .in('tree_id', treeIds)

            if (members) {
                const upcoming = getUpcomingEvents(members)
                // Filter to show only next 365 days
                const now = new Date()
                const oneYearLater = new Date(now)
                oneYearLater.setFullYear(now.getFullYear() + 1)

                const filtered = upcoming.filter(e =>
                    e.date >= now && e.date <= oneYearLater
                )
                setEvents(filtered)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    // Group events by month
    const groupedEvents = events.reduce((acc, event) => {
        const monthKey = format(event.date, 'MM/yyyy')
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(event)
        return acc
    }, {} as Record<string, CalendarEvent[]>)

    const months = Object.keys(groupedEvents).sort((a, b) => {
        const [m1, y1] = a.split('/').map(Number)
        const [m2, y2] = b.split('/').map(Number)
        return (y1 - y2) * 12 + (m1 - m2)
    })

    const handleSync = async () => {
        try {
            // Dynamically import to avoid SSR issues with window object if any
            const { syncEventsToGoogleCalendar } = await import('@/lib/google-calendar')
            await syncEventsToGoogleCalendar(events)
            alert("Đã hoàn tất đồng bộ!")
        } catch (error) {
            console.error("Sync failed:", error)
            alert("Đồng bộ thất bại. Vui lòng kiểm tra console.")
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1b0d0d] mb-2">Lịch Sự Kiện</h1>
                    <p className="text-slate-500">
                        Danh sách các ngày kỷ niệm quan trọng trong gia đình (Cúng giỗ & Sinh nhật).
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchEvents} title="Làm mới">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                    </Button>
                    <Button onClick={handleSync} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Đồng bộ Google Calendar
                    </Button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Chưa có sự kiện nào sắp tới within 1 year.</p>
                    <p className="text-sm text-gray-400 mt-2">Hãy cập nhật ngày sinh/ngày mất cho các thành viên trong cây gia phả.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {months.map(month => (
                        <div key={month} className="space-y-4">
                            <h3 className="text-lg font-bold text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                                <span className="bg-primary/10 px-2 py-0.5 rounded text-sm">Tháng {month}</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedEvents[month].map((event, idx) => (
                                    <div key={`${event.memberId}-${idx}`} className="relative group">
                                        <div className={`absolute inset-0 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity ${event.type === 'anniversary' ? 'bg-[#8B0000]' : 'bg-blue-500'
                                            }`} />
                                        <Card className="relative border-0 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.type === 'anniversary' ? 'bg-[#8B0000]' : 'bg-blue-500'
                                                }`} />
                                            <CardContent className="p-4 pl-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-black text-[#1b0d0d] leading-none">
                                                            {format(event.date, 'dd')}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                            {format(event.date, 'EEE', { locale: vi })}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${event.type === 'anniversary'
                                                        ? 'text-[#8B0000] bg-[#8B0000]/10'
                                                        : 'text-blue-600 bg-blue-50'
                                                        }`}>
                                                        {event.type === 'anniversary' ? 'Cúng Giỗ' : 'Sinh Nhật'}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-base mb-1 truncate" title={event.title}>
                                                    {event.title.replace(/Audio|Image/gi, '')}
                                                </h4>

                                                <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                                                    <span>{event.description}</span>
                                                    {event.isLunar && (
                                                        <span className="text-amber-600 font-medium flex items-center gap-1">
                                                            (Lịch Âm: {event.originalDate})
                                                        </span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
