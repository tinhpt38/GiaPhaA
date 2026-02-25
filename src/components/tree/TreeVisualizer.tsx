'use client'

import React, { useMemo } from 'react'
import { OrganizationChart } from 'primereact/organizationchart'
import { TreeNode } from 'primereact/treenode'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import MemberNode, { MemberNodeData } from './MemberNode'

// Define the shape of our nodes for PrimeReact
interface FamilyTreeNode extends TreeNode {
    expanded: boolean;
    data: {
        members: MemberNodeData[];
    };
    children: FamilyTreeNode[];
}

interface TreeVisualizerProps {
    initialMembers: any[]
    onNodeClick?: (member: any) => void
    onAddChild?: (parentId: string) => void
    onAddSpouse?: (spouseId: string) => void
    onEdit?: (member: any) => void
    onDelete?: (memberId: string) => void
    readOnly?: boolean
    // We keep onNodeDragStop in interface just to prevent breaking parent component
    // though it won't be used by PrimeReact
    onNodeDragStop?: (updates: any) => void
    // Ref to expose zoom functionalities to parent
    transformComponentRef?: React.RefObject<any>;
}

export default function TreeVisualizer({
    initialMembers,
    onNodeClick,
    onAddChild,
    onAddSpouse,
    onEdit,
    onDelete,
    readOnly = false,
    transformComponentRef
}: TreeVisualizerProps) {

    // Transform flat DB members into hierarchical Family Groups
    const treeData = useMemo(() => {
        if (!initialMembers || initialMembers.length === 0) return []

        // 1. Group by Main Member and Spouses
        // A family group is identified by the main member (or the earliest member in the relationship)
        const membersMap = new Map<string, any>(initialMembers.map(m => [m.id, m]))

        const nodeDataMap = new Map<string, MemberNodeData>()
        initialMembers.forEach(m => {
            nodeDataMap.set(m.id, {
                id: m.id,
                name: m.full_name,
                gender: m.gender,
                isRoot: m.relationship === 'root',
                is_alive: m.is_alive,
                dates: m.dob_solar ? (m.dod_solar ? `${m.dob_solar} - ${m.dod_solar}` : `Sinh: ${m.dob_solar}`) : (m.dod_solar ? `Mất: ${m.dod_solar}` : ''),
                image_url: m.image_url,
                nickname: m.nickname,
                posthumous_name: m.posthumous_name,
                father_name: m.father_name,
                mother_name: m.mother_name,
                canAddSpouse: true,
                onEdit: () => onEdit && onEdit(m),
                onAddChild: () => onAddChild && onAddChild(m.id),
                onAddSpouse: () => onAddSpouse && onAddSpouse(m.id),
                onDelete: () => onDelete && onDelete(m.id),
                isReadOnly: readOnly
            })
        })

        // 2. Identify Family Groups (Compound Nodes)
        const familyGroups = new Map<string, MemberNodeData[]>()
        const bloodlineIds = new Set<string>()

        // Pass 1: Identify all bloodline members (those with parents, or are parents themselves, or root)
        const parentIds = new Set(initialMembers.map(m => m.parent_id).filter(Boolean))

        initialMembers.forEach(m => {
            if (m.parent_id || m.relationship === 'root' || parentIds.has(m.id)) {
                bloodlineIds.add(m.id)
            }
        })

        // Give a pass for ties (root couple with no children and no relationship='root', or floating couples)
        initialMembers.forEach(m => {
            if (!m.parent_id && !bloodlineIds.has(m.id)) {
                // Check if spouse is also not in bloodline
                const spouseId = m.spouse_id || initialMembers.find(sm => sm.spouse_id === m.id)?.id
                if (!spouseId || !bloodlineIds.has(spouseId)) {
                    // Make this member the bloodline anchor
                    bloodlineIds.add(m.id)
                }
            }
        })

        // Pass 2: Group members into their appropriate primary bloodline id
        initialMembers.forEach(m => {
            let primaryId = m.id

            // If this member is NOT a bloodline member, find their bloodline spouse
            if (!bloodlineIds.has(m.id)) {
                if (m.spouse_id && bloodlineIds.has(m.spouse_id)) {
                    primaryId = m.spouse_id
                } else {
                    // Check if a bloodline member points to them as a spouse
                    const bloodSpouse = initialMembers.find(sm => sm.spouse_id === m.id && bloodlineIds.has(sm.id))
                    if (bloodSpouse) {
                        primaryId = bloodSpouse.id
                    } else if (m.spouse_id) {
                        // Tie breaker if neither is bloodline
                        primaryId = m.spouse_id
                    }
                }
            }

            if (!familyGroups.has(primaryId)) {
                familyGroups.set(primaryId, [])
            }
            familyGroups.get(primaryId)!.push(nodeDataMap.get(m.id)!)
        })

        // Pass 3: Sort arrays so the primary member is in the middle
        familyGroups.forEach((group, pId) => {
            if (group.length > 2) {
                const primaryIndex = group.findIndex(m => m.id === pId)
                if (primaryIndex !== -1) {
                    const primaryMember = group[primaryIndex]
                    const spouses = group.filter(m => m.id !== pId)

                    // Reconstruct array: half spouses, primary, other half spouses
                    const mid = Math.floor(spouses.length / 2)
                    const leftSpouses = spouses.slice(0, mid)
                    const rightSpouses = spouses.slice(mid)

                    const newGroup = [...leftSpouses, primaryMember, ...rightSpouses]

                    // Replace elements in place
                    group.length = 0
                    group.push(...newGroup)
                }
            } else if (group.length === 2) {
                // For 2 people, just keep primary first to maintain consistency
                group.sort((a, b) => {
                    if (a.id === pId) return -1
                    if (b.id === pId) return 1
                    return 0
                })
            }
        })

        // 3. Build Tree Hierarchy
        const treeNodesMap = new Map<string, FamilyTreeNode>()

        familyGroups.forEach((groupMembers, primaryId) => {
            treeNodesMap.set(primaryId, {
                key: primaryId,
                expanded: true,
                className: 'family-group-node',
                data: { members: groupMembers },
                children: []
            })
        })

        const roots: FamilyTreeNode[] = []

        familyGroups.forEach((groupMembers, primaryId) => {
            const primaryMember = membersMap.get(primaryId)
            const treeNode = treeNodesMap.get(primaryId)!

            if (primaryMember && primaryMember.parent_id) {
                // Find which group the parent belongs to
                let parentGroupId = primaryMember.parent_id

                // If the parent is actually a spouse in another group, find that group's primary ID
                familyGroups.forEach((members, gId) => {
                    if (members.some(m => m.id === primaryMember.parent_id)) {
                        parentGroupId = gId
                    }
                })

                const parentNode = treeNodesMap.get(parentGroupId)
                if (parentNode) {
                    parentNode.children.push(treeNode)
                } else {
                    roots.push(treeNode) // Fallback if parent not found
                }
            } else {
                roots.push(treeNode)
            }
        })

        return roots
    }, [initialMembers, onAddChild, onAddSpouse, onDelete, onEdit, readOnly])

    // Render a family group (Main member + Spouses)
    const nodeTemplate = (node: FamilyTreeNode) => {
        return (
            <div className="flex gap-4 items-center justify-center">
                {node.data.members.map((member, index) => (
                    <React.Fragment key={member.id}>
                        {index > 0 && <div className="text-pink-500 font-bold text-xl px-2">❤️</div>}
                        <MemberNode data={member} />
                    </React.Fragment>
                ))}
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-hidden bg-[#f8f9fa] relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .p-organizationchart .p-organizationchart-node-content {
                    border: none;
                    background: transparent;
                    padding: 0 !important;
                }
                .p-organizationchart table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    margin: 0 auto;
                    table-layout: fixed !important;
                }
                .p-organizationchart tbody {
                    width: 100%;
                    display: inline-table;
                }
                .p-organizationchart td {
                    padding: 8px 4px !important;
                    white-space: nowrap;
                    width: auto !important;
                }
                .p-organizationchart .p-organizationchart-lines td {
                    padding: 0 !important;
                }
                .p-organizationchart .p-organizationchart-line-down {
                    background: #b1b1b7;
                    width: 2px;
                    height: 20px !important;
                    margin: 0 auto;
                }
                .p-organizationchart .p-organizationchart-line-left {
                    border-right: 2px solid #b1b1b7;
                }
                .p-organizationchart .p-organizationchart-line-right {
                    border-left: 2px solid #b1b1b7;
                }
                .p-organizationchart .p-organizationchart-line-top {
                    border-top: 2px solid #b1b1b7;
                }
                .p-organizationchart .p-node-toggler {
                    display: none !important; /* Hide PrimeReact's built in expand/collapse button which breaks the lines and adds massive empty space */
                }
                .p-organizationchart-node-content:hover {
                    background-color: transparent !important;
                }
                .p-organizationchart-node-content.p-highlight {
                    background-color: transparent !important;
                }
                .family-group-node {
                    transition: all 0.2s;
                }
            `}} />

            {treeData.length > 0 ? (
                <TransformWrapper
                    initialScale={1}
                    minScale={0.1}
                    maxScale={3}
                    centerOnInit={true}
                    limitToBounds={false}
                    ref={transformComponentRef}
                    onZoom={(ref) => {
                        // Triggers when zooming, we can notify parent about zoom level but currently the ref approach is easier
                        // Let parent call ref.current.instance.transformState.scale directly if needed
                    }}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Float zoom controls moved to Header */}

                            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div className="min-w-max p-16">
                                    <OrganizationChart
                                        value={treeData}
                                        nodeTemplate={nodeTemplate}
                                    />
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500 min-h-[400px]">
                    Chưa có dữ liệu gia phả.
                </div>
            )}
        </div>
    )
}
