'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Users, Calendar, Heart, List, Network } from 'lucide-react'
import sampleTreeData from '@/data/sample-tree.json'
import dynamic from 'next/dynamic'

// Dynamically import TreeVisualizerWrapper to avoid SSR issues
const TreeVisualizerWrapper = dynamic(
    () => import('@/components/tree/TreeVisualizerWrapper'),
    { ssr: false }
)

interface Member {
    id: string
    full_name: string
    gender: string
    generation_name: string
    posthumous_name?: string
    nickname?: string
    dob_solar?: string
    dod_solar?: string
    is_alive: boolean
    relationship: string
    parent_id?: string
    spouse_id?: string
    children_ids?: string[]
}

export default function SampleTreePage() {
    const { tree, members } = sampleTreeData as { tree: any, members: Member[] }

    // Nhóm members theo thế hệ
    const generationOrder = ['Cao Tổ', 'Tằng Tổ', 'Tổ', 'Khảo', 'Tỷ', 'Phụ', 'Mẫu', 'Kỷ', 'Tử', 'Tôn', 'Huyền']

    const membersByGeneration = members.reduce((acc, member) => {
        const gen = member.generation_name
        if (!acc[gen]) acc[gen] = []
        acc[gen].push(member)
        return acc
    }, {} as Record<string, Member[]>)

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleDateString('vi-VN')
    }

    const getAge = (dob?: string, dod?: string) => {
        if (!dob) return ''
        const birthYear = new Date(dob).getFullYear()
        const deathYear = dod ? new Date(dod).getFullYear() : new Date().getFullYear()
        return deathYear - birthYear
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">

            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Về hệ thống Cửu tộc</AlertTitle>
                <AlertDescription>
                    Cửu tộc là hệ thống gọi tên 9 thế hệ trong gia đình người Việt, bao gồm:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>4 đời trên:</strong> Cao Tổ → Tằng Tổ → Tổ → Khảo (Ông)</li>
                        <li><strong>1 đời mình:</strong> Kỷ (Mình)</li>
                        <li><strong>4 đời dưới:</strong> Tử (Con) → Tôn (Cháu) → Huyền (Chắt) → Huyền Tôn (Chút)</li>
                    </ul>
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng số thành viên</p>
                                <p className="text-2xl font-bold">{members.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Số thế hệ</p>
                                <p className="text-2xl font-bold">9</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Heart className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Còn sinh sống</p>
                                <p className="text-2xl font-bold">{members.filter(m => m.is_alive).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="tree" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="tree" className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Sơ đồ cây
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Danh sách
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tree" className="mt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sơ đồ cây gia phả</CardTitle>
                            <CardDescription>
                                Xem mối quan hệ giữa các thành viên qua 9 thế hệ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[800px] border rounded-lg bg-slate-50">
                                <TreeVisualizerWrapper
                                    initialMembers={members}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 text-center">
                                💡 Sử dụng chuột để zoom và kéo sơ đồ. Click vào node để xem chi tiết.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Danh sách thành viên theo thế hệ</h2>

                        {generationOrder.map(genName => {
                            const genMembers = membersByGeneration[genName]
                            if (!genMembers || genMembers.length === 0) return null

                            return (
                                <Card key={genName}>
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            Thế hệ {genName}
                                        </CardTitle>
                                        <CardDescription>
                                            {genMembers.length} thành viên
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {genMembers.map(member => {
                                                const spouse = member.spouse_id
                                                    ? members.find(m => m.id === member.spouse_id)
                                                    : null

                                                return (
                                                    <div
                                                        key={member.id}
                                                        className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">
                                                                    {member.full_name}
                                                                    {member.nickname && (
                                                                        <span className="text-sm text-muted-foreground ml-2">
                                                                            ({member.nickname})
                                                                        </span>
                                                                    )}
                                                                </h3>
                                                                {member.posthumous_name && (
                                                                    <p className="text-sm text-amber-700 font-medium">
                                                                        {member.posthumous_name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${member.gender === 'male'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-pink-100 text-pink-700'
                                                                }`}>
                                                                {member.gender === 'male' ? 'Nam' : 'Nữ'}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1 text-sm">
                                                            {member.dob_solar && (
                                                                <p className="text-muted-foreground">
                                                                    <span className="font-medium">Sinh:</span> {formatDate(member.dob_solar)}
                                                                    {member.is_alive && ` (${getAge(member.dob_solar)} tuổi)`}
                                                                </p>
                                                            )}
                                                            {member.dod_solar && (
                                                                <p className="text-muted-foreground">
                                                                    <span className="font-medium">Mất:</span> {formatDate(member.dod_solar)}
                                                                    {` (thọ ${getAge(member.dob_solar, member.dod_solar)} tuổi)`}
                                                                </p>
                                                            )}
                                                            {spouse && (
                                                                <p className="text-muted-foreground">
                                                                    <span className="font-medium">Vợ/Chồng:</span> {spouse.full_name}
                                                                </p>
                                                            )}
                                                            {member.children_ids && member.children_ids.length > 0 && (
                                                                <p className="text-muted-foreground">
                                                                    <span className="font-medium">Con cái:</span> {member.children_ids.length} người
                                                                </p>
                                                            )}
                                                            <div className={`inline-block mt-2 px-2 py-1 rounded text-xs ${member.is_alive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {member.is_alive ? 'Còn sống' : 'Đã mất'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Gợi ý sử dụng</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                    <li>Gia phả mẫu này minh họa cách tổ chức thông tin theo hệ thống Cửu tộc</li>
                    <li>Mỗi thành viên có đầy đủ thông tin: họ tên, ngày sinh/mất, mối quan hệ</li>
                    <li>Các thế hệ được sắp xếp từ Cao Tổ (xa nhất) đến Huyền (gần nhất)</li>
                    <li>Sử dụng tab "Sơ đồ cây" để xem visualization hoặc "Danh sách" để xem chi tiết</li>
                    <li>Bạn có thể tham khảo để tạo gia phả của riêng mình</li>
                </ul>
            </div>
        </div>
    )
}
