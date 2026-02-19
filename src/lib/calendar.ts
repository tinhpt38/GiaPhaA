
import lunisolar from 'lunisolar'

export interface LunarDate {
    day: number
    month: number
    year: number
    isLeap?: boolean
}

export interface CalendarEvent {
    date: Date
    type: 'anniversary' | 'birthday'
    title: string
    memberId: string
    description?: string
    isLunar: boolean
    originalDate: string // Formatted string
}

/**
 * Calculates the next occurrence of a Lunar date in the Solar calendar.
 * It checks the current lunar year and the next lunar year to find the next upcoming date.
 */
export function getNextLunarDate(lunarDate: LunarDate): Date | null {
    try {
        const now = new Date()
        const currentLunar = lunisolar(now).lunar

        // We want to find the solar date for this lunar day/month in the CURRENT lunar year
        let targetLunarYear = currentLunar.year

        // Attempt 1: Current Lunar Year
        // lunisolar.fromLunar returns a Lunisolar object, we need .toDate()
        let solarDate = lunisolar.fromLunar({
            day: lunarDate.day,
            month: lunarDate.month,
            year: targetLunarYear,
            isLeap: lunarDate.isLeap
        }).toDate()

        // If the date has passed (e.g. today is 15/5 lunar, and we want 10/1 lunar),
        // we should look at the NEXT lunar year.
        // Note: We compare timestamps to be safe.
        // We set hours to 23:59:59 for the target date to ensure we don't skip "today" if it's the anniversary
        const endOfTargetDay = new Date(solarDate)
        endOfTargetDay.setHours(23, 59, 59, 999)

        if (endOfTargetDay.getTime() < now.getTime()) {
            targetLunarYear++
            solarDate = lunisolar.fromLunar({
                day: lunarDate.day,
                month: lunarDate.month,
                year: targetLunarYear,
                isLeap: lunarDate.isLeap
            }).toDate()
        }

        return solarDate
    } catch (e) {
        console.error("Error calculating next lunar date", e)
        return null
    }
}

/**
 * Calculates the next occurrence of a Solar date.
 */
export function getNextSolarDate(day: number, month: number): Date | null {
    try {
        const now = new Date()
        let year = now.getFullYear()

        let date = new Date(year, month - 1, day)

        // If date passed, move to next year
        const endOfTargetDay = new Date(date)
        endOfTargetDay.setHours(23, 59, 59, 999)

        if (endOfTargetDay.getTime() < now.getTime()) {
            year++
            date = new Date(year, month - 1, day)
        }

        return date
    } catch (e) {
        console.error("Error calculating next solar date", e)
        return null
    }
}

export function getUpcomingEvents(members: any[]): CalendarEvent[] {
    const events: CalendarEvent[] = []

    members.forEach(member => {
        // 1. Death Anniversaries (Cúng Giỗ) - for deceased members
        if (!member.is_alive) {
            if (member.dod_lunar) {
                // Handle JSONB object or parsed object
                const lunar = typeof member.dod_lunar === 'string' ? JSON.parse(member.dod_lunar) : member.dod_lunar
                if (lunar?.day && lunar?.month) {
                    const nextDate = getNextLunarDate(lunar)
                    if (nextDate) {
                        events.push({
                            date: nextDate,
                            type: 'anniversary',
                            title: `Giỗ ${member.full_name}`,
                            memberId: member.id,
                            description: `Ngày mất âm: ${lunar.day}/${lunar.month}`,
                            isLunar: true,
                            originalDate: `${lunar.day}/${lunar.month} (Âm)`
                        })
                    }
                }
            } else if (member.dod_solar) {
                // Fallback to solar death date if no lunar
                const date = new Date(member.dod_solar)
                const nextDate = getNextSolarDate(date.getDate(), date.getMonth() + 1)
                if (nextDate) {
                    events.push({
                        date: nextDate,
                        type: 'anniversary',
                        title: `Giỗ ${member.full_name}`,
                        memberId: member.id,
                        description: `Ngày mất dương: ${date.getDate()}/${date.getMonth() + 1}`,
                        isLunar: false,
                        originalDate: `${date.getDate()}/${date.getMonth() + 1} (Dương)`
                    })
                }
            }
        }
        // 2. Birthdays (Sinh Nhật) - for living members
        else {
            // Priority: Solar Birthday (most common for modern birthdays)
            // Check member.dob_solar
            if (member.dob_solar) {
                const date = new Date(member.dob_solar)
                const nextDate = getNextSolarDate(date.getDate(), date.getMonth() + 1)
                if (nextDate) {
                    events.push({
                        date: nextDate,
                        type: 'birthday',
                        title: `Sinh nhật ${member.full_name}`,
                        memberId: member.id,
                        description: `Ngày sinh: ${date.getDate()}/${date.getMonth() + 1}`,
                        isLunar: false,
                        originalDate: `${date.getDate()}/${date.getMonth() + 1}`
                    })
                }
            }

            // Also check Lunar Birthday if it exists (some elders celebrate lunar birthday)
            if (member.dob_lunar) {
                const lunar = typeof member.dob_lunar === 'string' ? JSON.parse(member.dob_lunar) : member.dob_lunar
                if (lunar?.day && lunar?.month) {
                    const nextDate = getNextLunarDate(lunar)
                    if (nextDate) {
                        events.push({
                            date: nextDate,
                            type: 'birthday',
                            title: `Sinh nhật (Âm) ${member.full_name}`,
                            memberId: member.id,
                            description: `Ngày sinh âm: ${lunar.day}/${lunar.month}`,
                            isLunar: true,
                            originalDate: `${lunar.day}/${lunar.month} (Âm)`
                        })
                    }
                }
            }
        }
    })

    // Sort by date (nearest first)
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
}
