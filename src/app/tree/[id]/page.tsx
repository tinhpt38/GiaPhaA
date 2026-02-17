'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import TreeVisualizer from '@/components/tree/TreeVisualizer'
import { MemberForm } from '@/components/tree/MemberForm'
import { GenealogyGuide } from '@/components/tree/GenealogyGuide'
import { Button } from '@/components/ui/button'
import { ReactFlowProvider } from '@xyflow/react'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

interface SelectedState {
    mode: 'view' | 'create' | 'edit'
    member?: any
    parentId?: string
    spouseId?: string
}

export default function TreeDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [tree, setTree] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedState, setSelectedState] = useState<SelectedState | null>(null)

    const supabase = createClient()

    async function loadTreeData() {
        // 1. Get Tree Info
        const { data: treeData } = await supabase
            .from('trees')
            .select('*')
            .eq('id', id)
            .single()
        setTree(treeData)

        // 2. Get Members
        const { data: membersData } = await supabase
            .from('members')
            .select('*')
            .eq('tree_id', id)

        setMembers(membersData || [])
        setLoading(false)
    }

    useEffect(() => {
        if (id) loadTreeData()
    }, [id, supabase])

    const handleInitRoot = async () => {
        // Just open the create form for root
        setSelectedState({ mode: 'create', member: null })
        // Note: we need to handle "root" relationship logic in form submission if parent is null but tree is empty
        // Updated Form logic might need to know if tree is empty to set 'root'
    }

    const handleSuccess = () => {
        loadTreeData()
        setSelectedState(null) // Close panel or stay? Let's close for now
    }

    // Handlers for Visualizer
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
        await supabase.from('members').delete().eq('id', memberId)
        loadTreeData()
        setSelectedState(null)
    }

    if (loading) return <div className="flex h-screen items-center justify-center">Đang tải...</div>

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="h-14 border-b bg-white flex items-center px-4 justify-between shrink-0 z-10">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="font-semibold text-lg">{tree?.name}</h1>
                </div>
                <div>
                    {/* Global Add Button if needed */}
                </div>
            </header>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Panel: Form / Details */}
                <aside className="w-1/3 min-w-[420px] bg-white border-r shadow-lg z-20 overflow-hidden transition-all duration-300">
                    {selectedState ? (
                        <div className="h-full">
                            <MemberForm
                                mode={selectedState.mode === 'edit' ? 'edit' : 'create'}
                                treeId={id}
                                parentId={selectedState.parentId}
                                spouseId={selectedState.spouseId}
                                editMember={selectedState.member}
                                onSuccess={handleSuccess}
                                onCancel={() => setSelectedState(null)}
                            />
                        </div>
                    ) : (
                        <GenealogyGuide />
                    )}
                </aside>

                {/* Right Panel: Visualization */}
                <main className="flex-1 relative bg-slate-50">
                    {members.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="mb-4 text-gray-500">Gia phả chưa có thành viên nào.</p>
                            <Button onClick={() => setSelectedState({ mode: 'create', parentId: undefined })}>
                                <Plus className="mr-2 h-4 w-4" /> Thêm Thủy Tổ (Root)
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            <ReactFlowProvider>
                                <TreeVisualizer
                                    initialMembers={members}
                                    onNodeClick={handleNodeClick}
                                    onAddChild={handleAddChild}
                                    onAddSpouse={handleAddSpouse}
                                    onEdit={handleNodeClick}
                                    onDelete={handleDelete}
                                />
                            </ReactFlowProvider>
                        </div>
                    )}

                    {/* Hint overlay if nothing selected */}
                    {!selectedState && members.length > 0 && (
                        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-3 rounded-lg shadow border text-sm text-gray-600 max-w-xs pointer-events-none">
                            Bấm vào thành viên để xem chi tiết hoặc chỉnh sửa.
                        </div>
                    )}
                </main>

            </div>
        </div>
    )
}
