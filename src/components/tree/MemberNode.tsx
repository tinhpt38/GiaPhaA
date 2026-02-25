'use client'

import React, { memo } from 'react'
import { Plus, Heart, UserPlus, Trash2, Edit } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type MemberNodeData = {
    id: string
    name: string
    gender: 'male' | 'female' | 'other'
    image_url?: string
    isRoot?: boolean
    is_alive?: boolean
    nickname?: string
    posthumous_name?: string
    dates?: string
    father_name?: string
    mother_name?: string
    canAddSpouse?: boolean
    onAddChild?: () => void
    onAddSpouse?: () => void
    onEdit?: () => void
    onDelete?: () => void
    isReadOnly?: boolean
    showParents?: boolean
}

function MemberNode({ data }: { data: MemberNodeData }) {
    const genderLower = (data.gender || "").toLowerCase()
    const isMale = ['male', 'nam', 'trai'].includes(genderLower)
    const isFemale = ['female', 'nữ', 'nu', 'gái'].includes(genderLower)

    const isDeceased = data.is_alive === false
    const isReadOnly = data.isReadOnly

    const NodeContent = (
        <div className={`
                  px-3 py-2 rounded-tl-[12px] rounded-br-[12px] bg-white w-[160px] cursor-default transition-all relative
                  hover:scale-105 shadow-md
                  ${isDeceased
                ? 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : (isMale ? 'shadow-sky-50 hover:shadow-lg' : (isFemale ? 'shadow-pink-50 hover:shadow-lg' : ''))
            }
                  ${data.isRoot ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}
                `}>

            {/* BORDERS SVG OVERLAYS */}
            {isDeceased ? (
                <>
                    <img src="/border/top-left-border-deceased.svg" alt="" className="absolute -top-2.5 -left-2.5 w-12 h-12 pointer-events-none" />
                    <img src="/border/top-right-border-deceased.svg" alt="" className="absolute -top-2.5 -right-2.5 w-12 h-12 pointer-events-none" />
                    <img src="/border/bot-left-border-deceased.svg" alt="" className="absolute -bottom-2.5 -left-2.5 w-12 h-12 pointer-events-none" />
                    <img src="/border/bot-right-border-deceased.svg" alt="" className="absolute -bottom-2.5 -right-2.5 w-12 h-12 pointer-events-none" />
                </>
            ) : (
                <>
                    <img src="/border/left-border-alive.svg" alt=""
                        className="absolute w-auto h-[calc(100%+5px)] pointer-events-none"
                        style={{
                            top: '-5px',
                            left: '-3px',
                            borderTopLeftRadius: '12px',
                            borderBottomRightRadius: '12px',
                            borderBottomLeftRadius: '0px',
                            borderTopRightRadius: '0px'
                        }}
                    />
                    <img src="/border/right-border-alive.svg" alt=""
                        className="absolute w-auto h-[calc(100%+10px)] pointer-events-none"
                        style={{
                            top: '-5px',
                            right: '-3px',
                            borderTopRightRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            borderTopLeftRadius: '0px',
                            borderBottomRightRadius: '0px'
                        }}
                    />
                </>
            )}

            <div className="flex flex-col items-center mt-2 mb-1">
                <div className={`
                        w-10 h-10 rounded-full mb-1 flex items-center justify-center text-base font-bold text-white shadow-sm overflow-hidden border-2
                        ${isDeceased ? 'border-amber-200 bg-amber-100 text-amber-700' : (isMale ? 'border-sky-100 bg-sky-500' : 'border-pink-100 bg-pink-400')}
                    `}>
                    {data.image_url ? (
                        <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
                    ) : (
                        data.name.charAt(0).toUpperCase()
                    )}
                </div>

                <div className={`font-bold text-sm text-center leading-tight line-clamp-2 ${isDeceased ? 'text-amber-900' : 'text-gray-800'}`}>
                    {data.name}
                </div>

                {(data.nickname || data.posthumous_name) && (
                    <div className="text-[10px] text-gray-500 italic mt-0.5 text-center px-1">
                        {data.nickname && <span>({data.nickname})</span>}
                        {data.posthumous_name && <span>{data.nickname ? ' - ' : ''}Thụy: {data.posthumous_name}</span>}
                    </div>
                )}

                {data.dates && <div className="text-[10px] text-gray-400 mt-1 font-mono">{data.dates}</div>}

                {data.showParents && (data.father_name || data.mother_name) && (
                    <div className="text-[9px] text-slate-500 mt-1.5 flex flex-col items-center bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {data.father_name && <span>Cha: <span className="font-semibold text-slate-600">{data.father_name}</span></span>}
                        {data.mother_name && <span>Mẹ: <span className="font-semibold text-slate-600">{data.mother_name}</span></span>}
                    </div>
                )}
            </div>
        </div>
    )

    if (isReadOnly) {
        return (
            <div className="group relative">
                {NodeContent}
            </div>
        )
    }

    return (
        <div className="group relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                        {NodeContent}
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>
                        {data.name}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                            ({data.isRoot ? 'Thủy Tổ' : (isMale ? 'Nam' : (isFemale ? 'Nữ' : 'Khác'))})
                        </span>
                    </DropdownMenuLabel>
                    {data.onEdit && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onEdit?.() }}>
                                <Edit className="mr-2 h-4 w-4" /> Xem & Sửa thông tin
                            </DropdownMenuItem>
                        </>
                    )}

                    {data.onAddChild && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onAddChild?.() }}>
                                <UserPlus className="mr-2 h-4 w-4 text-green-600" /> Thêm Con
                            </DropdownMenuItem>
                        </>
                    )}

                    {data.canAddSpouse && data.onAddSpouse && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); data.onAddSpouse?.() }}>
                            <Heart className="mr-2 h-4 w-4 text-pink-500" /> Thêm Vợ/Chồng
                        </DropdownMenuItem>
                    )}

                    {!data.isRoot && data.onDelete && (
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
