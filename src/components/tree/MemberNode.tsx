'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Plus, Heart, UserPlus, Trash2, Edit } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MemberNodeData = {
    name: string
    gender: 'male' | 'female' | 'other'
    image_url?: string
    isRoot?: boolean
    dates?: string
    canAddSpouse?: boolean
    onAddChild?: () => void
    onAddSpouse?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

function MemberNode({ data }: { data: MemberNodeData }) {
    const isMale = data.gender === 'male'
    const isFemale = data.gender === 'female'

    return (
        // Group enables hover effect on children
        <div className="group relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className={`
                  px-4 py-3 shadow-md rounded-xl border-2 bg-white min-w-[160px] cursor-pointer transition-all 
                  hover:shadow-lg hover:scale-105 active:scale-95
                  ${isMale ? 'border-sky-500 shadow-sky-50' : (isFemale ? 'border-pink-400 shadow-pink-50' : 'border-gray-400')}
                  ${data.isRoot ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
                `}>
                        <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col items-center">
                            <div className={`
                        w-10 h-10 rounded-full mb-2 flex items-center justify-center text-lg font-bold text-white shadow-sm overflow-hidden
                        ${isMale ? 'bg-sky-500' : (isFemale ? 'bg-pink-400' : 'bg-gray-400')}
                    `}>
                                {data.image_url ? (
                                    <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
                                ) : (
                                    data.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="font-bold text-sm text-gray-800 text-center leading-tight line-clamp-2">{data.name}</div>
                            {data.dates && <div className="text-[10px] text-gray-400 mt-1">{data.dates}</div>}
                        </div>

                        <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </DropdownMenuTrigger>

                {/* Context Menu on Click/Hover Trigger */}
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                        {data.name}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                            ({data.isRoot ? 'Thủy Tổ' : (isMale ? 'Nam' : 'Nữ')})
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onEdit?.() }}>
                        <Edit className="mr-2 h-4 w-4" /> Xem & Sửa thông tin
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onAddChild?.() }}>
                        <UserPlus className="mr-2 h-4 w-4 text-green-600" /> Thêm Con
                    </DropdownMenuItem>

                    {data.canAddSpouse && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onAddSpouse?.() }}>
                            <Heart className="mr-2 h-4 w-4 text-pink-500" /> Thêm Vợ/Chồng
                        </DropdownMenuItem>
                    )}

                    {!data.isRoot && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onDelete?.() }} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa thành viên
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default memo(MemberNode)
