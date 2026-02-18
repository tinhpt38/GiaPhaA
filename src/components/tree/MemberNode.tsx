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
    is_alive?: boolean // Determine status
    nickname?: string
    posthumous_name?: string
    dates?: string
    canAddSpouse?: boolean
    onAddChild?: () => void
    onAddSpouse?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

function MemberNode({ data }: { data: MemberNodeData }) {
    const genderLower = (data.gender || "").toLowerCase()
    const isMale = ['male', 'nam', 'trai'].includes(genderLower)
    const isFemale = ['female', 'nữ', 'nu', 'gái'].includes(genderLower)

    // Check if deceased (explicit false or inferred from dates/posthumous name, but relying on is_alive is safest if provided)
    // Default to true if undefined, unless specifically told otherwise
    const isDeceased = data.is_alive === false

    return (
        // Group enables hover effect on children
        <div className="group relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className={`
                  px-4 py-3 rounded-xl border-2 bg-white w-[220px] cursor-pointer transition-all relative overflow-visible
                  hover:scale-105 active:scale-95
                  ${isDeceased
                            ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' // Golden aura for deceased
                            : (isMale ? 'border-sky-500 shadow-sky-50 shadow-md hover:shadow-lg' : (isFemale ? 'border-pink-400 shadow-pink-50 shadow-md hover:shadow-lg' : 'border-gray-400 shadow-md'))
                        }
                  ${data.isRoot ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}
                `}>
                        <Handle type="target" position={Position.Top} id="top" className="!bg-gray-400 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Handle type="target" position={Position.Left} id="left" className="!bg-ec4899 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col items-center">
                            {/* Avatar */}
                            <div className={`
                        w-12 h-12 rounded-full mb-2 flex items-center justify-center text-lg font-bold text-white shadow-sm overflow-hidden border-2
                        ${isDeceased ? 'border-amber-200 bg-amber-100 text-amber-700' : (isMale ? 'border-sky-100 bg-sky-500' : 'border-pink-100 bg-pink-400')}
                    `}>
                                {data.image_url ? (
                                    <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
                                ) : (
                                    data.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Main Name */}
                            <div className={`font-bold text-sm text-center leading-tight line-clamp-2 ${isDeceased ? 'text-amber-900' : 'text-gray-800'}`}>
                                {data.name}
                            </div>

                            {/* Extra Names (Nickname / Posthumous) */}
                            {(data.nickname || data.posthumous_name) && (
                                <div className="text-[10px] text-gray-500 italic mt-0.5 text-center px-1">
                                    {data.nickname && <span>({data.nickname})</span>}
                                    {data.posthumous_name && <span>{data.nickname ? ' - ' : ''}Thụy: {data.posthumous_name}</span>}
                                </div>
                            )}

                            {/* Dates */}
                            {data.dates && <div className="text-[10px] text-gray-400 mt-1 font-mono">{data.dates}</div>}
                        </div>

                        <Handle type="source" position={Position.Right} id="right" className="!bg-ec4899 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </DropdownMenuTrigger>

                {/* Context Menu on Click/Hover Trigger */}
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                        {data.name}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                            ({data.isRoot ? 'Thủy Tổ' : (isMale ? 'Nam' : (isFemale ? 'Nữ' : 'Khác'))})
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
