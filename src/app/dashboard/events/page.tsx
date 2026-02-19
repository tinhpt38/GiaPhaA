
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getUpcomingEvents, CalendarEvent } from '@/lib/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Loader2, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function EventsPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [syncedCount, setSyncedCount] = useState(0)
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
                // Select all by default
                setSelectedEventIds(new Set(filtered.map(e => getEventId(e))))
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

    // Helper to generate unique ID for event (memberId + type + date)
    const getEventId = (event: CalendarEvent) => `${event.memberId}-${event.type}-${event.date.toISOString()}`

    const toggleEvent = (eventId: string) => {
        const newSelected = new Set(selectedEventIds)
        if (newSelected.has(eventId)) {
            newSelected.delete(eventId)
        } else {
            newSelected.add(eventId)
        }
        setSelectedEventIds(newSelected)
    }

    const toggleAll = () => {
        if (selectedEventIds.size === events.length) {
            setSelectedEventIds(new Set())
        } else {
            setSelectedEventIds(new Set(events.map(e => getEventId(e))))
        }
    }

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
        const eventsToSync = events.filter(e => selectedEventIds.has(getEventId(e)))

        if (eventsToSync.length === 0) {
            alert("Vui lòng chọn ít nhất một sự kiện để đồng bộ.")
            return
        }

        try {
            // Dynamically import to avoid SSR issues with window object if any
            const { syncEventsToGoogleCalendar } = await import('@/lib/google-calendar')
            const count = await syncEventsToGoogleCalendar(eventsToSync)
            setSyncedCount(count)
            setShowSuccessDialog(true)
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
                        Đồng bộ {selectedEventIds.size} sự kiện
                    </Button>
                </div>
            </div>

            {events.length > 0 && (
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={toggleAll} className="text-sm font-medium">
                        {selectedEventIds.size === events.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </Button>
                </div>
            )}

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
                                {groupedEvents[month].map((event, idx) => {
                                    const eventId = getEventId(event)
                                    const isSelected = selectedEventIds.has(eventId)

                                    return (
                                        <div
                                            key={eventId}
                                            className="relative group cursor-pointer"
                                            onClick={() => toggleEvent(eventId)}
                                        >
                                            <div className={`absolute inset-0 rounded-xl blur opacity-20 transition-opacity ${isSelected ? (event.type === 'anniversary' ? 'bg-[#8B0000] opacity-40' : 'bg-blue-500 opacity-40') : 'opacity-0'
                                                }`} />
                                            <Card className={`relative border-0 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden ${isSelected ? 'ring-2 ring-offset-2 ring-primary/20' : 'opacity-70 hover:opacity-100'
                                                }`}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.type === 'anniversary' ? 'bg-[#8B0000]' : 'bg-blue-500'
                                                    }`} />

                                                {/* Checkbox Overlay */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                                                        ? 'bg-primary border-primary text-white'
                                                        : 'bg-white border-slate-300'
                                                        }`}>
                                                        {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    </div>
                                                </div>

                                                <CardContent className="p-4 pl-6">
                                                    <div className="flex justify-between items-start mb-2 pr-6">
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
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}


            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            Đồng bộ thành công!
                        </DialogTitle>
                        <DialogDescription>
                            Đã thêm {syncedCount} sự kiện vào Google Calendar của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <p className="text-sm text-muted-foreground">
                                Bạn có thể xem và quản lý các sự kiện này trên ứng dụng Google Calendar.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button type="button" variant="secondary" onClick={() => setShowSuccessDialog(false)}>
                            Đóng
                        </Button>
                        <Button type="button" onClick={() => window.open('https://calendar.google.com', '_blank')}>
                            Mở Google Calendar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
