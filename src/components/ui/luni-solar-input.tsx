'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import lunisolar from 'lunisolar'

interface DateInputProps {
    value?: string // YYYY-MM-DD solar
    onChange: (value: string) => void
    label?: string
    isLunarInput?: boolean
    onLunarChange?: (lunarDate: string) => void // Simple string representation
}

export function LuniSolarDateInput({ value, onChange, label }: DateInputProps) {
    // Internal state for Lunar representation
    const [lunarStr, setLunarStr] = useState("")

    useEffect(() => {
        if (value) {
            try {
                const date = lunisolar(value)
                setLunarStr(`${date.lunar.day}/${date.lunar.month}/${date.lunar.year} (Âm lịch)`)
            } catch {
                setLunarStr("")
            }
        } else {
            setLunarStr("")
        }
    }, [value])

    return (
        <div className="space-y-1">
            {label && <Label>{label}</Label>}
            <Input
                type="date"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
            {lunarStr && (
                <p className="text-xs text-muted-foreground italic">
                    {lunarStr}
                </p>
            )}
        </div>
    )
}
