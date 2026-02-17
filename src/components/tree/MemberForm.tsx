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
import { LuniSolarDateInput } from "@/components/ui/luni-solar-input"

const formSchema = z.object({
    full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    nickname: z.string().optional(),
    title: z.string().optional(),
    posthumous_name: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    dob_solar: z.string().optional(),
    dod_solar: z.string().optional(),
    is_alive: z.boolean(),
    job: z.string().optional(),
    achievement: z.string().optional(),
    residence: z.string().optional(),
    birth_place: z.string().optional(),
    burial_place: z.string().optional(),
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

    const form = useForm<FormValues>({
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
                dob_solar: editMember.dob_solar || "",
                dod_solar: editMember.dod_solar || "",
                job: editMember.job || "",
                achievement: editMember.achievement || "",
                residence: editMember.residence || "",
                birth_place: editMember.birth_place || "",
                burial_place: editMember.burial_place || "",
                father_name: editMember.father_name || "",
                mother_name: editMember.mother_name || "",
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
        setLoading(true)
        const payload: any = { ...values }
        if (!payload.dob_solar) payload.dob_solar = null
        if (!payload.dod_solar) payload.dod_solar = null

        let error = null

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

        setLoading(false)

        if (error) {
            alert("Lỗi: " + error.message)
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    {/* Is Alive toggle could go here */}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="dob_solar" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày sinh</FormLabel>
                                            <FormControl>
                                                <LuniSolarDateInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="dod_solar" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày mất</FormLabel>
                                            <FormControl>
                                                <LuniSolarDateInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
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
                                            <FormLabel>Sinh quán</FormLabel>
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
                                <FormField control={form.control} name="burial_place" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>An táng tại</FormLabel>
                                        <FormControl><Input className="bg-white" {...field} /></FormControl>
                                        <FormDescription>Nơi chôn cất, mộ phần</FormDescription>
                                    </FormItem>
                                )} />
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
