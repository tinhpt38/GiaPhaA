'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import lunisolar from 'lunisolar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, RefreshCw, X, ArrowDown } from "lucide-react"

interface DateParts {
    day?: number
    month?: number
    year?: number
}

interface AdvancedDateInputProps {
    label: string
    solarDate?: DateParts
    lunarDate?: DateParts
    onChange: (solar: DateParts, lunar: DateParts) => void
}

export function AdvancedDateInput({
    label,
    solarDate = {},
    lunarDate = {},
    onChange
}: AdvancedDateInputProps) {
    // Local state for inputs to allow typing freely
    const [sDay, setSDay] = useState(solarDate.day?.toString() || '')
    const [sMonth, setSMonth] = useState(solarDate.month?.toString() || '')
    const [sYear, setSYear] = useState(solarDate.year?.toString() || '')

    const [lDay, setLDay] = useState(lunarDate.day?.toString() || '')
    const [lMonth, setLMonth] = useState(lunarDate.month?.toString() || '')
    const [lYear, setLYear] = useState(lunarDate.year?.toString() || '')

    // Sync from props if they change externally (e.g. form reset)
    useEffect(() => {
        setSDay(solarDate.day?.toString() || '')
        setSMonth(solarDate.month?.toString() || '')
        setSYear(solarDate.year?.toString() || '')
        setLDay(lunarDate.day?.toString() || '')
        setLMonth(lunarDate.month?.toString() || '')
        setLYear(lunarDate.year?.toString() || '')
    }, [solarDate.day, solarDate.month, solarDate.year, lunarDate.day, lunarDate.month, lunarDate.year])

    const handleSolarChange = (field: 'day' | 'month' | 'year', value: string) => {
        // Validation logic could go here
        const numVal = parseInt(value)
        if (value && isNaN(numVal)) return // simple number check

        let newDay = sDay
        let newMonth = sMonth
        let newYear = sYear

        if (field === 'day') { setSDay(value); newDay = value }
        if (field === 'month') { setSMonth(value); newMonth = value }
        if (field === 'year') { setSYear(value); newYear = value }

        notifyChange({ day: parseInt(newDay), month: parseInt(newMonth), year: parseInt(newYear) },
            { day: parseInt(lDay), month: parseInt(lMonth), year: parseInt(lYear) })
    }

    const handleLunarChange = (field: 'day' | 'month' | 'year', value: string) => {
        const numVal = parseInt(value)
        if (value && isNaN(numVal)) return

        let newDay = lDay
        let newMonth = lMonth
        let newYear = lYear

        if (field === 'day') { setLDay(value); newDay = value }
        if (field === 'month') { setLMonth(value); newMonth = value }
        if (field === 'year') { setLYear(value); newYear = value }

        notifyChange({ day: parseInt(sDay), month: parseInt(sMonth), year: parseInt(sYear) },
            { day: parseInt(newDay), month: parseInt(newMonth), year: parseInt(newYear) })
    }

    const convertSolarToLunar = () => {
        const d = parseInt(sDay)
        const m = parseInt(sMonth)
        const y = parseInt(sYear)

        if (!d || !m || !y) return

        if (y < 1900 || y > 2100) {
            alert("Năm phải từ 1900 đến 2100 để chuyển đổi chính xác.")
            return
        }

        try {
            // lunisolar uses 0-indexed month for Date constructor
            const inputDate = new Date(y, m - 1, d)
            // Check if valid date
            if (isNaN(inputDate.getTime())) {
                alert("Ngày không hợp lệ")
                return
            }

            const date = lunisolar(inputDate)
            const lunar = date.lunar
            setLDay(lunar.day.toString())
            setLMonth(lunar.month.toString())
            setLYear(lunar.year.toString())

            notifyChange(
                { day: d, month: m, year: y },
                { day: lunar.day, month: lunar.month, year: lunar.year }
            )
        } catch (e) {
            console.error("Lỗi chuyển đổi ngày:", e)
            alert("Không thể chuyển đổi ngày này")
        }
    }

    const convertLunarToSolar = () => {
        const d = parseInt(lDay)
        const m = parseInt(lMonth)
        const y = parseInt(lYear)

        if (d && m && y) {
            try {
                // lunisolar library might not have direct fromLunar method easily exposed without a plugin
                // usually: lunisolar.fromLunar(year, month, day)
                const solar = lunisolar.fromLunar({ year: y, month: m, day: d })
                const solarDate = solar.toDate()

                setSDay(solarDate.getDate().toString())
                setSMonth((solarDate.getMonth() + 1).toString())
                setSYear(solarDate.getFullYear().toString())

                notifyChange(
                    { day: solarDate.getDate(), month: solarDate.getMonth() + 1, year: solarDate.getFullYear() },
                    { day: d, month: m, year: y }
                )
            } catch (e) {
                console.error("Invalid lunar date", e)
            }
        }
    }

    const notifyChange = (solar: DateParts, lunar: DateParts) => {
        // Clean NaN values to undefined
        const clean = (obj: DateParts) => {
            return {
                day: isNaN(obj.day!) ? undefined : obj.day,
                month: isNaN(obj.month!) ? undefined : obj.month,
                year: isNaN(obj.year!) ? undefined : obj.year,
            }
        }
        onChange(clean(solar), clean(lunar))
    }

    return (
        <div className="space-y-3 p-4 border rounded-md bg-slate-50">
            <Label className="font-semibold">{label}</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Solar Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Dương lịch</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={convertSolarToLunar}
                            disabled={!sDay || !sMonth || !sYear}
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Đổi sang Âm
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-16">
                            <Input placeholder="Ngày" value={sDay} onChange={(e) => handleSolarChange('day', e.target.value)} maxLength={2} className="text-center" />
                        </div>
                        <div className="w-16">
                            <Input placeholder="Tháng" value={sMonth} onChange={(e) => handleSolarChange('month', e.target.value)} maxLength={2} className="text-center" />
                        </div>
                        <div className="flex-1">
                            <Input placeholder="Năm" value={sYear} onChange={(e) => handleSolarChange('year', e.target.value)} maxLength={4} className="text-center" />
                        </div>
                    </div>
                </div>

                {/* Lunar Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Âm lịch</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={convertLunarToSolar}
                            disabled={!lDay || !lMonth || !lYear}
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Đổi sang Dương
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-16">
                            <Input placeholder="Ngày" value={lDay} onChange={(e) => handleLunarChange('day', e.target.value)} maxLength={2} className="text-center bg-amber-50/50 border-amber-200" />
                        </div>
                        <div className="w-16">
                            <Input placeholder="Tháng" value={lMonth} onChange={(e) => handleLunarChange('month', e.target.value)} maxLength={2} className="text-center bg-amber-50/50 border-amber-200" />
                        </div>
                        <div className="flex-1">
                            <Input placeholder="Năm" value={lYear} onChange={(e) => handleLunarChange('year', e.target.value)} maxLength={4} className="text-center bg-amber-50/50 border-amber-200" />
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center pt-1">* Nhập đầy đủ 3 trường để chuyển đổi tự động</p>
        </div>
    )
}
