'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import TreeVisualizer from '@/components/tree/TreeVisualizer'
import { MemberForm } from '@/components/tree/MemberForm'
import { Button } from '@/components/ui/button'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import {
    Search,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    FileDown,
    Share2,
    Plus,
    Locate,
    BookOpen,
    X,
    Users as UsersIcon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface SelectedState {
    mode: 'view' | 'create' | 'edit'
    member?: any
    parentId?: string
    spouseId?: string
}

// Wrapper component to access ReactFlow controls
function TreeBuilderContent({
    id,
    tree,
    members,
    selectedState,
    setSelectedState,
    handleNodeClick,
    handleAddChild,
    handleAddSpouse,
    handleDelete,
    zoom,
    setZoom
}: any) {
    const reactFlowInstance = useReactFlow()
    const [showMemberList, setShowMemberList] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleZoomIn = () => {
        if (reactFlowInstance) {
            reactFlowInstance.zoomIn()
            setZoom(Math.round(reactFlowInstance.getZoom() * 100))
        }
    }

    const handleZoomOut = () => {
        if (reactFlowInstance) {
            reactFlowInstance.zoomOut()
            setZoom(Math.round(reactFlowInstance.getZoom() * 100))
        }
    }

    const handleFitView = () => {
        if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2 })
            setZoom(Math.round(reactFlowInstance.getZoom() * 100))
        }
    }

    const filteredMembers = members.filter((m: any) =>
        m.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between border-b border-[#e5e1e1] bg-white px-6 z-30 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">{tree?.name || 'Gia Phả'}</h1>
                        <p className="text-xs text-[#9a4c4c] font-medium">Chỉnh sửa cây gia phả</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Member List Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMemberList(!showMemberList)}
                        className="flex items-center gap-2 border-[#e5e1e1]"
                    >
                        <UsersIcon className="w-4 h-4" />
                        <span>Danh sách ({members.length})</span>
                    </Button>

                    <div className="flex items-center bg-white border border-[#e5e1e1] rounded-lg p-1">
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            title="Hoàn tác"
                            onClick={() => {/* TODO: Implement undo */ }}
                        >
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            title="Làm lại"
                            onClick={() => {/* TODO: Implement redo */ }}
                        >
                            <Redo2 className="w-5 h-5" />
                        </button>
                        <div className="w-[1px] h-6 bg-[#e5e1e1] mx-1" />
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleZoomIn}
                            title="Phóng to"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <span className="px-2 text-xs font-semibold min-w-[45px] text-center">{zoom}%</span>
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleZoomOut}
                            title="Thu nhỏ"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <div className="w-[1px] h-6 bg-[#e5e1e1] mx-1" />
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            onClick={handleFitView}
                            title="Căn giữa"
                        >
                            <Locate className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                            <FileDown className="w-4 h-4" />
                            <span>Xuất PDF</span>
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 bg-[#f3e7e7] text-[#1b0d0d] border-[#e5e1e1] hover:bg-[#eadbdb]">
                            <Share2 className="w-4 h-4" />
                            <span>Chia sẻ</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Detail Panel (moved from right) */}
                {selectedState && (
                    <aside className="w-1/3 min-w-[400px] max-w-[600px] bg-white border-r border-[#e5e1e1] flex flex-col z-20 overflow-hidden">
                        <div className="p-5 border-b border-[#e5e1e1] flex justify-between items-center bg-[#fcf8f8]">
                            <h3 className="font-bold text-[#1b0d0d]">
                                {selectedState.mode === 'edit' ? 'Thông tin chi tiết' : 'Thêm thành viên mới'}
                            </h3>
                            <button
                                onClick={() => setSelectedState(null)}
                                className="text-[#9a4c4c] hover:text-[#1b0d0d] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <MemberForm
                                mode={selectedState.mode === 'edit' ? 'edit' : 'create'}
                                treeId={id}
                                parentId={selectedState.parentId}
                                spouseId={selectedState.spouseId}
                                editMember={selectedState.member}
                                onSuccess={() => setSelectedState(null)}
                                onCancel={() => setSelectedState(null)}
                            />
                        </div>
                    </aside>
                )}

                {/* Main Canvas Area */}
                <main className="flex-1 relative overflow-hidden"
                    style={{
                        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundColor: '#f8f6f6'
                    }}
                >
                    {members.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="mb-4 text-gray-500 text-lg font-medium">Gia phả chưa có thành viên nào</p>
                            <Button
                                onClick={() => setSelectedState({ mode: 'create', parentId: undefined })}
                                className="shadow-lg shadow-primary/20"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Thêm Thủy Tổ (Root)
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            <TreeVisualizer
                                initialMembers={members}
                                onNodeClick={handleNodeClick}
                                onAddChild={handleAddChild}
                                onAddSpouse={handleAddSpouse}
                                onEdit={handleNodeClick}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}

                    {/* Floating Add Button */}
                    {members.length > 0 && !selectedState && (
                        <div className="fixed bottom-6 right-6 z-10">
                            <button
                                onClick={() => setSelectedState({ mode: 'create', parentId: undefined })}
                                className="size-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                                title="Thêm thành viên"
                            >
                                <Plus className="w-7 h-7" />
                            </button>
                        </div>
                    )}
                </main>

                {/* Member List Sidebar (Toggle) */}
                {showMemberList && (
                    <aside className="w-80 bg-white border-l border-[#e5e1e1] flex flex-col z-30 shadow-xl">
                        <div className="p-4 border-b border-[#e5e1e1] flex justify-between items-center bg-[#fcf8f8]">
                            <h3 className="font-bold text-[#1b0d0d]">
                                Danh sách thành viên ({filteredMembers.length})
                            </h3>
                            <button
                                onClick={() => setShowMemberList(false)}
                                className="text-[#9a4c4c] hover:text-[#1b0d0d] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 border-b border-[#e5e1e1]">
                            <div className="flex items-center bg-[#f3e7e7] rounded-lg px-3 py-2 gap-2">
                                <Search className="text-[#9a4c4c] w-4 h-4" />
                                <input
                                    className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full placeholder:text-[#9a4c4c]"
                                    placeholder="Tìm kiếm..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-1">
                                {filteredMembers.map((member: any) => (
                                    <div
                                        key={member.id}
                                        onClick={() => {
                                            handleNodeClick(member)
                                            setShowMemberList(false)
                                        }}
                                        className={`flex items-center gap-3 p-3 hover:bg-[#f3e7e7] rounded-lg cursor-pointer transition-colors ${selectedState?.member?.id === member.id
                                            ? 'border-l-4 border-primary bg-[#f3e7e7]/50'
                                            : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                            {member.full_name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{member.full_name || 'Chưa đặt tên'}</p>
                                            <p className="text-xs text-[#9a4c4c] truncate">
                                                {member.info?.generation_name || 'Chưa xác định'} - Đời {member.generation || '?'}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {filteredMembers.length === 0 && (
                                    <div className="text-center py-12 text-sm text-gray-400">
                                        {searchQuery ? 'Không tìm thấy thành viên' : 'Chưa có thành viên'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </>
    )
}

export default function TreeDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [tree, setTree] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedState, setSelectedState] = useState<SelectedState | null>(null)
    const [zoom, setZoom] = useState(100)

    const supabase = createClient()

    async function loadTreeData() {
        const { data: treeData } = await supabase
            .from('trees')
            .select('*')
            .eq('id', id)
            .single()
        setTree(treeData)

        const { data: membersData } = await supabase
            .from('members')
            .select('*')
            .eq('tree_id', id)

        setMembers(membersData || [])
        setLoading(false)
    }

    useEffect(() => {
        if (!id) return

        loadTreeData()

        const channel = supabase
            .channel('members-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'members',
                    filter: `tree_id=eq.${id}`
                },
                (payload) => {
                    console.log('Realtime update:', payload)
                    loadTreeData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id, supabase])

    const handleNodeClick = (member: any) => {
        setSelectedState({ mode: 'edit', member })
    }

    const handleAddChild = (parentId: string) => {
        setSelectedState({ mode: 'create', parentId })
    }

    const handleAddSpouse = (spouseId: string) => {
        setSelectedState({ mode: 'create', spouseId })
    }

    const handleDelete = async (memberId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return

        const { count } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', memberId)

        if (count && count > 0) {
            alert(`Không thể xóa thành viên này vì còn ${count} người con.`)
            return
        }

        await supabase
            .from('members')
            .update({ spouse_id: null })
            .eq('spouse_id', memberId)

        const { error } = await supabase.from('members').delete().eq('id', memberId)

        if (error) {
            alert("Lỗi khi xóa: " + error.message)
        } else {
            loadTreeData()
            setSelectedState(null)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f6f6]">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#f8f6f6]">
            <ReactFlowProvider>
                <TreeBuilderContent
                    id={id}
                    tree={tree}
                    members={members}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    handleNodeClick={handleNodeClick}
                    handleAddChild={handleAddChild}
                    handleAddSpouse={handleAddSpouse}
                    handleDelete={handleDelete}
                    zoom={zoom}
                    setZoom={setZoom}
                />
            </ReactFlowProvider>
        </div>
    )
}
