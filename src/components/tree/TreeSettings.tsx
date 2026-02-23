'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Settings, Globe, Lock, AlertTriangle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface TreeSettingsProps {
    tree: any
    onUpdate?: (updatedTree: any) => void
}

export function TreeSettings({ tree, onUpdate }: TreeSettingsProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(tree?.name || '')
    const [description, setDescription] = useState(tree?.description || '')
    const [isPublic, setIsPublic] = useState(tree?.is_public || false)
    const supabase = createClient()
    const router = useRouter()

    const handleSave = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('trees')
                .update({
                    name,
                    description,
                    is_public: isPublic
                })
                .eq('id', tree.id)
                .select()
                .single()

            if (error) throw error

            if (onUpdate) onUpdate(data)
            setOpen(false)
            router.refresh()
            alert('Cập nhật thành công!')
        } catch (error) {
            console.error('Error updating tree:', error)
            alert('Có lỗi xảy ra, vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Cài đặt</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cài đặt Gia Phả</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin và quyền riêng tư của gia phả này.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên gia phả</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                            <Label className="text-base flex items-center gap-2">
                                {isPublic ? <Globe className="w-4 h-4 text-blue-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
                                Công khai gia phả
                            </Label>
                            <div className="text-sm text-muted-foreground">
                                {isPublic
                                    ? "Gia phả sẽ hiển thị trên trang chủ và cộng đồng."
                                    : "Chỉ những người có liên kết chia sẻ mới xem được."}
                            </div>
                        </div>
                        <Switch
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                    </div>
                    {isPublic && (
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 text-sm text-orange-800 rounded-md flex items-start gap-3 mt-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Cảnh báo rò rỉ dữ liệu</p>
                                <p>Khi bạn bật "Công khai", mọi thông tin từ sơ đồ, thành viên, năm sinh đến hình ảnh sẽ được hiển thị công khai trên internet và Cộng đồng. Vui lòng đảm bảo các thành viên đồng ý trước khi chia sẻ.</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
