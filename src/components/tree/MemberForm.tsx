'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedDateInput } from "@/components/ui/advanced-date-input"

const formSchema = z.object({
    full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    nickname: z.string().optional(),
    title: z.string().optional(),
    posthumous_name: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    is_alive: z.boolean(),

    // Generation
    generation: z.coerce.number().optional(),

    // Legacy date strings (optional, can be derived)
    dob_solar: z.string().optional(),
    dod_solar: z.string().optional(),

    // Split Date Fields - Birth
    dob_solar_day: z.coerce.number().optional(),
    dob_solar_month: z.coerce.number().optional(),
    dob_solar_year: z.coerce.number().optional(),
    dob_lunar_day: z.coerce.number().optional(),
    dob_lunar_month: z.coerce.number().optional(),
    dob_lunar_year: z.coerce.number().optional(),

    // Split Date Fields - Death
    dod_solar_day: z.coerce.number().optional(),
    dod_solar_month: z.coerce.number().optional(),
    dod_solar_year: z.coerce.number().optional(),
    dod_lunar_day: z.coerce.number().optional(),
    dod_lunar_month: z.coerce.number().optional(),
    dod_lunar_year: z.coerce.number().optional(),

    // Marriage Date
    marriage_date_solar_day: z.coerce.number().optional(),
    marriage_date_solar_month: z.coerce.number().optional(),
    marriage_date_solar_year: z.coerce.number().optional(),
    marriage_date_lunar_day: z.coerce.number().optional(),
    marriage_date_lunar_month: z.coerce.number().optional(),
    marriage_date_lunar_year: z.coerce.number().optional(),

    // Other fields
    spouse_name: z.string().optional(), // Fallback if no linked spouse
    image_url: z.string().optional(),

    job: z.string().optional(),
    achievement: z.string().optional(),
    residence: z.string().optional(),
    birth_place: z.string().optional(), // Sinh quán
    death_place: z.string().optional(), // Nơi mất (Tử tại)
    burial_place: z.string().optional(), // An táng tại
    father_name: z.string().optional(),
    mother_name: z.string().optional(),
    info: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface MemberFormProps {
    mode: 'create' | 'edit'
    treeId: string
    parentId?: string
    spouseId?: string
    editMember?: any
    onSuccess: () => void
    onCancel: () => void
}



export function MemberForm({
    mode,
    treeId,
    parentId,
    spouseId,
    editMember,
    onSuccess,
    onCancel
}: MemberFormProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            gender: "male",
            is_alive: true,
            father_name: "",
            mother_name: ""
        },
    })

    useEffect(() => {
        if (mode === 'edit' && editMember) {
            form.reset({
                full_name: editMember.full_name || "",
                nickname: editMember.nickname || "",
                title: editMember.title || "",
                posthumous_name: editMember.posthumous_name || "",
                gender: editMember.gender,
                is_alive: editMember.is_alive ?? true,
                generation: editMember.generation,
                image_url: editMember.image_url || "",
                spouse_name: editMember.spouse_name || "",

                // Legacy
                dob_solar: editMember.dob_solar || "",
                dod_solar: editMember.dod_solar || "",

                // Split Dates - Birth
                dob_solar_day: editMember.dob_solar_day,
                dob_solar_month: editMember.dob_solar_month,
                dob_solar_year: editMember.dob_solar_year,
                dob_lunar_day: editMember.dob_lunar_day,
                dob_lunar_month: editMember.dob_lunar_month,
                dob_lunar_year: editMember.dob_lunar_year,

                // Split Dates - Death
                dod_solar_day: editMember.dod_solar_day,
                dod_solar_month: editMember.dod_solar_month,
                dod_solar_year: editMember.dod_solar_year,
                dod_lunar_day: editMember.dod_lunar_day,
                dod_lunar_month: editMember.dod_lunar_month,
                dod_lunar_year: editMember.dod_lunar_year,

                // Marriage
                marriage_date_solar_day: editMember.marriage_date_solar_day,
                marriage_date_solar_month: editMember.marriage_date_solar_month,
                marriage_date_solar_year: editMember.marriage_date_solar_year,
                marriage_date_lunar_day: editMember.marriage_date_lunar_day,
                marriage_date_lunar_month: editMember.marriage_date_lunar_month,
                marriage_date_lunar_year: editMember.marriage_date_lunar_year,

                job: editMember.job || "",
                achievement: editMember.achievement || "",
                residence: editMember.residence || "",
                birth_place: editMember.birth_place || "",
                death_place: editMember.death_place || "",
                burial_place: editMember.burial_place || "",
                father_name: editMember.father_name || "",
                mother_name: editMember.mother_name || "",
                info: editMember.info ? (typeof editMember.info === 'object' ? JSON.stringify(editMember.info) : String(editMember.info)) : "",
            })
        } else {
            form.reset({
                full_name: "",
                gender: "male",
                is_alive: true,
            })
        }
    }, [mode, editMember, form])

    async function onSubmit(values: FormValues) {
        console.log("Submitting form with values:", values)
        setLoading(true)
        const payload: any = { ...values }

        // Ensure nullable fields are null if undefined/empty
        const dateFields = [
            'dob_solar_day', 'dob_solar_month', 'dob_solar_year',
            'dob_lunar_day', 'dob_lunar_month', 'dob_lunar_year',
            'dod_solar_day', 'dod_solar_month', 'dod_solar_year',
            'dod_lunar_day', 'dod_lunar_month', 'dod_lunar_year',
            'marriage_date_solar_day', 'marriage_date_solar_month', 'marriage_date_solar_year',
            'marriage_date_lunar_day', 'marriage_date_lunar_month', 'marriage_date_lunar_year',
            'generation'
        ]

        dateFields.forEach(field => {
            if (!payload[field] && payload[field] !== 0) payload[field] = null
        })

        // Try to construct standard dates from split fields if possible for dob_solar/dod_solar
        if (payload.dob_solar_year && payload.dob_solar_month && payload.dob_solar_day) {
            payload.dob_solar = `${payload.dob_solar_year}-${String(payload.dob_solar_month).padStart(2, '0')}-${String(payload.dob_solar_day).padStart(2, '0')}`
        } else {
            if (!payload.dob_solar) payload.dob_solar = null
        }

        if (payload.dod_solar_year && payload.dod_solar_month && payload.dod_solar_day) {
            payload.dod_solar = `${payload.dod_solar_year}-${String(payload.dod_solar_month).padStart(2, '0')}-${String(payload.dod_solar_day).padStart(2, '0')}`
        } else {
            if (!payload.dod_solar) payload.dod_solar = null
        }

        let error = null

        try {
            if (mode === 'edit' && editMember) {
                const { error: err } = await supabase
                    .from('members')
                    .update(payload)
                    .eq('id', editMember.id)
                error = err
            } else {
                payload.tree_id = treeId
                if (parentId) {
                    payload.parent_id = parentId
                    payload.relationship = 'child'
                } else if (spouseId) {
                    payload.spouse_id = spouseId
                    payload.relationship = 'spouse'
                }

                const { error: err } = await supabase
                    .from('members')
                    .insert(payload)
                error = err
            }
        } catch (e: any) {
            console.error("Javascript Error in onSubmit:", e)
            error = e
        }

        setLoading(false)

        if (error) {
            console.error("Supabase Error:", error)
            alert("Lỗi khi lưu: " + (error.message || JSON.stringify(error)))
        } else {
            onSuccess()
        }
    }

    const title = mode === 'edit'
        ? `Sửa: ${editMember?.full_name}`
        : (parentId ? "Thêm người con" : (spouseId ? "Thêm Vợ/Chồng" : "Thêm thành viên"))

    return (
        <Card className="h-full border-0 shadow-none flex flex-col bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 shrink-0 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-xl">{title}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.error("Validation Errors Object:", errors)
                        console.error("Form Values:", form.getValues())
                        console.error("Form State:", form.formState)
                        alert("Lỗi validate: " + JSON.stringify(errors, null, 2))
                    })} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="basic">Thông tin Cơ bản</TabsTrigger>
                                <TabsTrigger value="details">Chi tiết dòng tộc</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ và tên (Tên húy)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nguyễn Văn A" className="bg-white" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Tên do cha mẹ đặt từ nhỏ. Sau khi trưởng thành có thể dùng tên khác.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giới tính</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Chọn" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Nam</SelectItem>
                                                        <SelectItem value="female">Nữ</SelectItem>
                                                        <SelectItem value="other">Khác</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="generation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Đời thứ (Generation)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="bg-white" {...field} value={field.value as number ?? ''} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* Is Alive toggle could go here */}
                                </div>

                                <div className="space-y-4">
                                    <AdvancedDateInput
                                        label="Ngày Sinh"
                                        solarDate={{
                                            day: form.watch('dob_solar_day') as number,
                                            month: form.watch('dob_solar_month') as number,
                                            year: form.watch('dob_solar_year') as number
                                        }}
                                        lunarDate={{
                                            day: form.watch('dob_lunar_day') as number,
                                            month: form.watch('dob_lunar_month') as number,
                                            year: form.watch('dob_lunar_year') as number
                                        }}
                                        onChange={(solar, lunar) => {
                                            form.setValue('dob_solar_day', solar.day)
                                            form.setValue('dob_solar_month', solar.month)
                                            form.setValue('dob_solar_year', solar.year)
                                            form.setValue('dob_lunar_day', lunar.day)
                                            form.setValue('dob_lunar_month', lunar.month)
                                            form.setValue('dob_lunar_year', lunar.year)
                                        }}
                                    />

                                    <AdvancedDateInput
                                        label="Ngày Mất"
                                        solarDate={{
                                            day: form.watch('dod_solar_day') as number,
                                            month: form.watch('dod_solar_month') as number,
                                            year: form.watch('dod_solar_year') as number
                                        }}
                                        lunarDate={{
                                            day: form.watch('dod_lunar_day') as number,
                                            month: form.watch('dod_lunar_month') as number,
                                            year: form.watch('dod_lunar_year') as number
                                        }}
                                        onChange={(solar, lunar) => {
                                            form.setValue('dod_solar_day', solar.day)
                                            form.setValue('dod_solar_month', solar.month)
                                            form.setValue('dod_solar_year', solar.year)
                                            form.setValue('dod_lunar_day', lunar.day)
                                            form.setValue('dod_lunar_month', lunar.month)
                                            form.setValue('dod_lunar_year', lunar.year)
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField control={form.control} name="father_name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Con Ông</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>
                                                Ghi rõ tên cha ruột (nếu người này không có trong gia phả hoặc là rể)
                                            </FormDescription>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mother_name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Con Bà</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>
                                                Ghi rõ tên mẹ ruột
                                            </FormDescription>
                                        </FormItem>
                                    )} />
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-5">
                                <FormField control={form.control} name="image_url" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ảnh đại diện (URL)</FormLabel>
                                        <FormControl><Input className="bg-white" placeholder="https://..." {...field} /></FormControl>
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField control={form.control} name="nickname" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên Tự</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>
                                                Tên của trí thức thời trước, thường tự đặt cho mình.
                                            </FormDescription>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên Hiệu</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>
                                                Tên hiệu của phụ nữ có thể là bút hiệu nếu có sáng tác văn thơ, hoặc pháp danh theo tôn giáo.
                                            </FormDescription>
                                        </FormItem>
                                    )} />
                                </div>

                                <FormField control={form.control} name="posthumous_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên Thụy</FormLabel>
                                        <FormControl><Input className="bg-white" {...field} /></FormControl>
                                        <FormDescription>
                                            Tên chính do đương sự tự đặt trước khi mất hoặc con cháu đặt, để khấn khi cúng cơm.
                                        </FormDescription>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="spouse_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên Phối ngẫu (Vợ/Chồng)</FormLabel>
                                        <FormControl><Input className="bg-white" {...field} /></FormControl>
                                        <FormDescription>
                                            Nhập tên nếu người phối ngẫu chưa có trong gia phả.
                                        </FormDescription>
                                    </FormItem>
                                )} />

                                <AdvancedDateInput
                                    label="Ngày Kết Hôn"
                                    solarDate={{
                                        day: form.watch('marriage_date_solar_day') as number,
                                        month: form.watch('marriage_date_solar_month') as number,
                                        year: form.watch('marriage_date_solar_year') as number
                                    }}
                                    lunarDate={{
                                        day: form.watch('marriage_date_lunar_day') as number,
                                        month: form.watch('marriage_date_lunar_month') as number,
                                        year: form.watch('marriage_date_lunar_year') as number
                                    }}
                                    onChange={(solar, lunar) => {
                                        form.setValue('marriage_date_solar_day', solar.day)
                                        form.setValue('marriage_date_solar_month', solar.month)
                                        form.setValue('marriage_date_solar_year', solar.year)
                                        form.setValue('marriage_date_lunar_day', lunar.day)
                                        form.setValue('marriage_date_lunar_month', lunar.month)
                                        form.setValue('marriage_date_lunar_year', lunar.year)
                                    }}
                                />

                                <FormField control={form.control} name="job" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nghề nghiệp/Chức vụ</FormLabel>
                                        <FormControl><Textarea className="resize-none h-20 bg-white" placeholder="Chức vụ, công việc chính..." {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="achievement" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Công danh/Khoa bảng</FormLabel>
                                        <FormControl><Textarea className="resize-none h-20 bg-white" {...field} /></FormControl>
                                        <FormDescription>
                                            Ghi rõ khoa bảng đỗ đạt (Tú tài, Cử nhân, Tiến sĩ...) và chức vụ đã đạt được.
                                        </FormDescription>
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField control={form.control} name="birth_place" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sinh quán (Nơi sinh)</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>Nơi sinh ra</FormDescription>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="residence" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Định cư</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>Nơi sinh sống chủ yếu</FormDescription>
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField control={form.control} name="death_place" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tử tại (Nơi mất)</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="burial_place" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>An táng tại</FormLabel>
                                            <FormControl><Input className="bg-white" {...field} /></FormControl>
                                            <FormDescription>Nơi chôn cất, mộ phần</FormDescription>
                                        </FormItem>
                                    )} />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="pt-4 sticky bottom-0 bg-slate-50/50 backdrop-blur pb-2 border-t mt-4">
                            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
                                {loading ? "Đang lưu..." : "Lưu thông tin"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
