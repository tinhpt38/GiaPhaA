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
    ChevronRight,
    Settings,
    Trash2
} from 'lucide-react'
import Link from 'next/link'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { useRouter } from 'next/navigation' // Add this import

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
    handleDeleteTree,
    handleNodeDragStop, // Add this prop
    zoom,
    setZoom,
    loadTreeData
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
            reactFlowInstance.fitView({ padding: 0.2, duration: 800 })
            setZoom(Math.round(reactFlowInstance.getZoom() * 100))
        }
    }

    const handleExportPDF = async () => {
        const element = document.querySelector('.react-flow') as HTMLElement
        if (!element) return

        try {
            // Hiển thị thông báo đang xử lý
            const originalTitle = tree?.name || 'Gia Phả'

            // Tạm thời ẩn các UI controls nếu cần (ReactFlow đã tự handle một số phần)
            const dataUrl = await toPng(element, {
                backgroundColor: '#f8f6f6',
                quality: 1,
                pixelRatio: 2, // Tăng chất lượng ảnh
                filter: (node) => {
                    // Loại bỏ các nút điều khiển của ReactFlow khỏi ảnh chụp
                    return !node.classList?.contains('react-flow__controls') &&
                        !node.classList?.contains('react-flow__panel')
                }
            })

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [element.offsetWidth, element.offsetHeight]
            })

            pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight)
            pdf.save(`Gia_Pha_${originalTitle.replace(/\s+/g, '_')}.pdf`)
        } catch (error) {
            console.error('Error exporting PDF:', error)
            alert('Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại.')
        }
    }

    const handleResetLayout = async () => {
        if (!confirm("Bạn có chắc chắn muốn đặt lại toàn bộ vị trí? Các chỉnh sửa vị trí thủ công sẽ bị mất.")) return

        const supabase = createClient()
        const { error } = await supabase
            .from('members')
            .update({ coordinate_x: null, coordinate_y: null })
            .eq('tree_id', id)

        if (error) {
            alert("Lỗi khi đặt lại vị trí: " + error.message)
        } else {
            loadTreeData()
            setTimeout(handleFitView, 500) // Fit view after reload
        }
    }

    const filteredMembers = members.filter((m: any) =>
        m.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between border-b border-[#e5e1e1] bg-white px-3 md:px-6 z-30 shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
                        <div className="bg-primary p-1 md:p-1.5 rounded-lg text-white">
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm md:text-lg font-bold leading-tight truncate max-w-[120px] sm:max-w-none">{tree?.name || 'Gia Phả'}</h1>
                            <p className="text-[10px] md:text-xs text-[#9a4c4c] font-medium truncate">Chỉnh sửa</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Member List Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMemberList(!showMemberList)}
                        className="flex items-center gap-2 border-[#e5e1e1] px-2 md:px-3"
                    >
                        <UsersIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Danh sách ({members.length})</span>
                        <span className="sm:hidden">{members.length}</span>
                    </Button>

                    <div className="hidden md:flex items-center bg-white border border-[#e5e1e1] rounded-lg p-1">
                        <button
                            className="p-1.5 hover:bg-[#f3e7e7] rounded text-[#1b0d0d] transition-colors"
                            title="Đặt lại vị trí (Auto Layout)"
                            onClick={handleResetLayout}
                        >
                            <Undo2 className="w-5 h-5" />
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

                    <div className="flex gap-1 md:gap-2">
                        <Button
                            onClick={handleExportPDF}
                            size="sm"
                            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 h-8 md:h-9"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden md:inline">Xuất PDF</span>
                        </Button>
                        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 bg-[#f3e7e7] text-[#1b0d0d] border-[#e5e1e1] h-8 md:h-9">
                            <Share2 className="w-4 h-4" />
                            <span className="hidden md:inline">Chia sẻ</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteTree}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 md:h-9"
                            title="Xóa Gia Phả"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline">Xóa</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Detail Panel (moved from right) */}
                {selectedState && (
                    <aside className="fixed inset-0 md:relative md:inset-auto md:w-1/3 md:min-w-[400px] md:max-w-[600px] bg-white md:border-r border-[#e5e1e1] flex flex-col z-40 md:z-20 overflow-hidden shadow-2xl md:shadow-none">
                        <div className="p-4 md:p-5 border-b border-[#e5e1e1] flex justify-between items-center bg-[#fcf8f8]">
                            <h3 className="font-bold text-[#1b0d0d] truncate pr-4">
                                {selectedState.mode === 'edit'
                                    ? `Chi tiết: ${selectedState.member?.full_name || ''}`
                                    : 'Thêm thành viên mới'}
                            </h3>
                            <button
                                onClick={() => setSelectedState(null)}
                                className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#9a4c4c] hover:text-[#1b0d0d] transition-colors shrink-0"
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
                                existingMembers={members} // Pass all members for selection
                                onSuccess={() => {
                                    loadTreeData()
                                    setSelectedState(null)
                                }}
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
                                onNodeDragStop={handleNodeDragStop}
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

            </div>
        </>
    )
}



export default function TreeDetailPage() {
    const params = useParams()
    const router = useRouter() // Use router
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

    const handleNodeDragStop = async (memberId: string, position: { x: number, y: number }) => {
        const { error } = await supabase
            .from('members')
            .update({
                coordinate_x: position.x,
                coordinate_y: position.y
            })
            .eq('id', memberId)

        if (error) {
            console.error("Error saving position:", error)
        }
    }

    const handleDeleteTree = async () => {
        if (!confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ Gia Phả này? Hành động này KHÔNG THỂ khôi phục.")) return
        if (!confirm("Xác nhận lần cuối: Mọi dữ liệu về thành viên và gia phả sẽ bị xóa vĩnh viễn. Bạn có chắc không?")) return

        try {
            // Delete trees (members should cascade delete if foreign key is set up correctly, 
            // but if not, we might need to delete members first? 
            // Usually Supabase handles cascade if configured. 
            // If not, we should delete members first. Assuming cascade for now or manual cleanup)

            // Safe approach: delete members first manually if unsure about cascade
            await supabase.from('members').delete().eq('tree_id', id)

            const { error } = await supabase.from('trees').delete().eq('id', id)

            if (error) throw error

            router.push('/dashboard')
        } catch (error: any) {
            console.error(error)
            alert("Lỗi khi xóa gia phả: " + error.message)
        }
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

    // ... (rest of loading check) ...

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
                    handleDeleteTree={handleDeleteTree} // Pass it here
                    handleNodeDragStop={handleNodeDragStop}
                    zoom={zoom}
                    setZoom={setZoom}
                    loadTreeData={loadTreeData}
                />
            </ReactFlowProvider>
        </div>
    )
}
