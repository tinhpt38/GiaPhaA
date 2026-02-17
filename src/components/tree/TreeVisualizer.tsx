'use client'

import React, { useCallback, useMemo, useEffect } from 'react'
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Edge,
    Controls,
    Background,
    MiniMap,
    Position,
    Node,
    useReactFlow,
    reconnectEdge,
    Connection
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { hierarchy, tree, HierarchyPointNode } from 'd3-hierarchy'
import MemberNode from './MemberNode'

// Constants
const NODE_WIDTH = 240 // Increased node width
const NODE_HEIGHT = 120
const SPOUSE_SPACING = 60 // Gap between spouses
const LEVEL_SPACING = 200 // Reduced vertical spacing (120 height + 80 gap)
const SIBLING_SPACING = 80 // Horizontal gap between siblings
const COUSIN_SPACING = 150 // Horizontal gap between cousins (subtrees)
const COUPLE_WIDTH = NODE_WIDTH * 2 + SPOUSE_SPACING

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return { nodes, edges }

    // 1. Build a map of nodes for easy access
    const nodeMap = new Map(nodes.map(n => [n.id, n]))

    // 2. Identify relationships
    const childrenMap = new Map<string, string[]>()
    const spouseMap = new Map<string, string[]>() // Supports multiple spouses
    const hasParent = new Set<string>()

    edges.forEach(edge => {
        // Check edge types based on our convention
        // Parent-Child: sourceHandle='bottom', targetHandle='top' (or check ID prefix 'e')
        if (edge.id.startsWith('e')) {
            const parentId = edge.source
            const childId = edge.target
            if (!childrenMap.has(parentId)) childrenMap.set(parentId, [])
            childrenMap.get(parentId)?.push(childId)
            hasParent.add(childId)
        }
        // Spouse: ID starts with 's'
        else if (edge.id.startsWith('s')) { // Spouse
            if (!spouseMap.has(edge.source)) spouseMap.set(edge.source, [])
            if (!spouseMap.has(edge.target)) spouseMap.set(edge.target, [])

            // Add unique references
            if (!spouseMap.get(edge.source)?.includes(edge.target)) spouseMap.get(edge.source)?.push(edge.target)
            if (!spouseMap.get(edge.target)?.includes(edge.source)) spouseMap.get(edge.target)?.push(edge.source)
        }
    })

    // 3. Identify Root(s) - nodes without parents
    // We prioritize nodes that are explicitly marked as root or simply have no parents
    // Exclude nodes that are spouses of someone in the tree (they are attached sideways)
    // Wait, a spouse might not have a parent in the tree BUT shouldn't be a separate root if they are attached.
    // We only traverse from "Primary" roots.

    const visited = new Set<string>()
    const roots = nodes.filter(n => !hasParent.has(n.id))

    // We need to filter roots to avoid picking up spouses as separate roots if they are attached to a tree member
    // If A is Root, and B is Spouse of A. B has no parent. B is also a "Root" by definition above.
    // We should pick the 'primary' root. If A and B are spouses, we pick one as the anchor.
    // Let's use the one with lower ID or 'isRoot' flag as anchor.

    const trueRoots = roots.filter(n => {
        // Simple heuristic: If you have a spouse who has a parent, you are not the root (you married in)
        const spouses = spouseMap.get(n.id) || []
        for (const spouseId of spouses) {
            if (hasParent.has(spouseId) && !hasParent.has(n.id)) {
                return false // Spouse is bloodline, I am not
            }
        }
        // If both/all are roots, strict tie-break by ID to avoid dual roots
        // Only keep the smallest ID as the representative Root for layout
        if (spouses.length > 0) {
            const allInGroup = [n.id, ...spouses]
            // If any in group is visited processed as part of another tree? (Not yet)
            // Just check if I am the "Min ID" among the root-level cluster
            const minId = allInGroup.reduce((min, cur) => cur < min ? cur : min, n.id)
            if (n.id !== minId) return false
        }
        return true
    }).sort((a, b) => a.id.localeCompare(b.id))

    // 4. Build Hierarchy for D3
    type D3Node = {
        id: string
        members: string[] // [MainID, ...Spouses]
        children: D3Node[]
        w: number
    }

    const buildTree = (rootId: string): D3Node => {
        visited.add(rootId)

        let members = [rootId]

        // Find Spouses
        const spouses = spouseMap.get(rootId) || []
        spouses.forEach(sId => {
            if (!visited.has(sId)) {
                visited.add(sId)
                members.push(sId)
            }
        })

        // Calculate total width based on number of members
        const width = members.length * NODE_WIDTH + (members.length - 1) * SPOUSE_SPACING

        // Gather children from ALL members (Main + Spouses)
        const childrenIds = new Set<string>()
        members.forEach(mId => {
            const kids = childrenMap.get(mId)
            if (kids) kids.forEach(k => childrenIds.add(k))
        })

        const childrenObj: D3Node[] = Array.from(childrenIds)
            .sort((aId, bId) => {
                const nodeA = nodeMap.get(aId)
                const nodeB = nodeMap.get(bId)
                if (!nodeA || !nodeB) return 0

                // 1. Sort by Child Order
                const orderA = nodeA.data.child_order as number | undefined
                const orderB = nodeB.data.child_order as number | undefined

                // Both have order -> compare
                if (orderA !== undefined && orderA !== null && orderB !== undefined && orderB !== null) {
                    return orderA - orderB
                }
                // Only A has order -> A comes first
                if (orderA !== undefined && orderA !== null) return -1
                // Only B has order -> B comes first
                if (orderB !== undefined && orderB !== null) return 1

                // 2. Sort by Date of Birth
                const dobA = nodeA.data.dob_solar as string | undefined
                const dobB = nodeB.data.dob_solar as string | undefined

                if (dobA && dobB) {
                    return dobA.localeCompare(dobB)
                }
                // If A has date, it likely comes before unknown? Or treat unknown as last?
                // Usually treating specific as "known" is better. Let's put known dates first?
                // Actually, if date is missing, we don't know order. Let's stick to valid comparisons.
                if (dobA) return -1
                if (dobB) return 1

                // 3. Fallback to Name or ID
                return aId.localeCompare(bId)
            })
            .filter(kidId => !visited.has(kidId))
            .map(kidId => buildTree(kidId))

        return {
            id: rootId,
            members,
            children: childrenObj,
            w: width
        }
    }

    // Handle standard layout
    // D3 tree layout requires a single root. dealing with multiple roots (components)?
    // We'll layout each component separately.

    if (trueRoots.length === 0) return { nodes, edges } // Should not happen

    // For Simplicity, we assume one main tree or layout them horizontally next to each other
    let currentXOffset = 0

    trueRoots.forEach(rootNode => {
        const d3Data = buildTree(rootNode.id)
        const d3Hierarchy = hierarchy(d3Data)

        // Configure Tree Layout
        // Use nodeSize with 1 unit width to allow 'separation' to return pixel values directly
        const treeLayout = tree<D3Node>()
            .nodeSize([1, LEVEL_SPACING])
            .separation((a: HierarchyPointNode<D3Node>, b: HierarchyPointNode<D3Node>) => {
                const wA = a.data.w
                const wB = b.data.w

                // Add gap: Sibling gap or Cousin gap
                const gap = a.parent === b.parent ? SIBLING_SPACING : COUSIN_SPACING

                // Return total distance needed between centers
                return (wA / 2) + (wB / 2) + gap
            })

        const rootD3 = treeLayout(d3Hierarchy)

        // Calculate tree bounds to shift it correctly
        let minX = Infinity
        let maxX = -Infinity
        rootD3.each(d => {
            if (d.x < minX) minX = d.x
            if (d.x > maxX) maxX = d.x
        })

        // If single node, minX can be Infinity if not handled? No, rootD3 always has nodes.
        if (minX === Infinity) minX = 0
        if (maxX === -Infinity) maxX = 0

        // Extract Layout positions
        rootD3.each((d) => {
            const { x, y } = d
            // Shift x so the tree starts at 0 (relative) + current global offset
            const shiftX = x - minX + currentXOffset

            const members = d.data.members
            const mainNode = nodeMap.get(members[0])

            // Position Main Node (Centered)
            if (mainNode) {
                mainNode.position = { x: shiftX, y: y }
            }

            // Position Spouses (Alternating Left/Right)
            // i=1 (Spouse 1) -> Right 1
            // i=2 (Spouse 2) -> Left 1
            // i=3 (Spouse 3) -> Right 2
            for (let i = 1; i < members.length; i++) {
                const spouseNode = nodeMap.get(members[i])
                if (spouseNode) {
                    const isRight = i % 2 !== 0 // 1, 3, 5 -> Right
                    const pairIndex = Math.ceil(i / 2) // 1,2->1; 3,4->2

                    const offset = (NODE_WIDTH + SPOUSE_SPACING) * pairIndex
                    // If Right: +offset. If Left: -offset.

                    spouseNode.position = {
                        x: shiftX + (isRight ? offset : -offset),
                        y: y
                    }
                }
            }

            // Post-process layout to apply saved manual coordinates if they exist
            // We want to override the D3 layout if the user has manually set a position
            const applyManualPosition = (node: Node) => {
                if (node && typeof node.data.coordinate_x === 'number' && typeof node.data.coordinate_y === 'number') {
                    // Only apply if values are valid numbers
                    // Cast to number just in case
                    const x = Number(node.data.coordinate_x)
                    const y = Number(node.data.coordinate_y)
                    if (!isNaN(x) && !isNaN(y)) {
                        node.position = { x, y }
                    }
                }
            }

            if (mainNode) applyManualPosition(mainNode)
            for (let i = 1; i < members.length; i++) {
                const spouseNode = nodeMap.get(members[i])
                if (spouseNode) applyManualPosition(spouseNode)
            }
        })

        // Update global offset for the next tree
        // Width of this tree is (maxX - minX)
        // Add padding for next tree
        currentXOffset += (maxX - minX) + COUSIN_SPACING + NODE_WIDTH // Extra safety buffer
    })

    // 5. Update Edge Handles & Direction based on final positions
    edges.forEach(edge => {
        if (edge.id.startsWith('s')) {
            const nodeA = nodeMap.get(edge.source) // Original Source
            const nodeB = nodeMap.get(edge.target) // Original Target

            if (nodeA && nodeB && nodeA.position && nodeB.position) {
                // We enforce Left -> Right flow because:
                // Node's LEFT handle is Type=Target (Input)
                // Node's RIGHT handle is Type=Source (Output)
                // So Edge MUST go from Left Node (Right Handle) -> Right Node (Left Handle)

                if (nodeA.position.x <= nodeB.position.x) {
                    // A is Left, B is Right. Flow is correct.
                    edge.sourceHandle = 'right'
                    edge.targetHandle = 'left'
                } else {
                    // A is Right, B is Left. Flow is reversed.
                    // SWAP Source and Target
                    edge.source = nodeB.id
                    edge.target = nodeA.id
                    edge.sourceHandle = 'right'
                    edge.targetHandle = 'left'
                }
            }
        }
    })

    return { nodes, edges }
}

interface TreeVisualizerProps {
    initialMembers: any[]
    onNodeClick?: (member: any) => void
    onAddChild?: (parentId: string) => void
    onAddSpouse?: (spouseId: string) => void
    onEdit?: (member: any) => void
    onDelete?: (memberId: string) => void
    onNodeDragStop?: (memberId: string, position: { x: number, y: number }) => void
}

export default function TreeVisualizer({
    initialMembers,
    onNodeClick,
    onAddChild,
    onAddSpouse,
    onEdit,
    onDelete,
    onNodeDragStop
}: TreeVisualizerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { fitView } = useReactFlow()

    const handleNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
        if (onNodeDragStop) {
            onNodeDragStop(node.id, node.position)
        }
    }, [onNodeDragStop])

    // Convert DB members to React Flow Nodes & Edges
    useEffect(() => {
        if (!initialMembers || initialMembers.length === 0) return

        const flowNodes: Node[] = initialMembers.map((m) => ({
            id: m.id,
            type: 'member',
            data: {
                // Pass coordinates to data for layout access
                coordinate_x: m.coordinate_x,
                coordinate_y: m.coordinate_y,
                child_order: m.child_order,
                dob_solar: m.dob_solar,

                name: m.full_name,
                gender: m.gender,
                isRoot: m.relationship === 'root',
                is_alive: m.is_alive,
                dates: m.dob_solar ? (m.dod_solar ? `${m.dob_solar} - ${m.dod_solar}` : `Sinh: ${m.dob_solar}`) : (m.dod_solar ? `Mất: ${m.dod_solar}` : ''),
                image_url: m.image_url,
                nickname: m.nickname,
                posthumous_name: m.posthumous_name,
                canAddSpouse: true,
                onEdit: () => onEdit && onEdit(m),
                onAddChild: () => onAddChild && onAddChild(m.id),
                onAddSpouse: () => onAddSpouse && onAddSpouse(m.id),
                onDelete: () => onDelete && onDelete(m.id)
            },
            position: {
                x: (typeof m.coordinate_x === 'number' ? m.coordinate_x : 0),
                y: (typeof m.coordinate_y === 'number' ? m.coordinate_y : 0)
            },
            draggable: true // Enable dragging initially
        }))

        const flowEdges: Edge[] = []
        const processedSpousePairs = new Set<string>()

        initialMembers.forEach(m => {
            // Parent-Child Edge
            if (m.parent_id) {
                flowEdges.push({
                    id: `e${m.parent_id}-${m.id}`,
                    source: m.parent_id,
                    target: m.id,
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#b1b1b7' },
                    sourceHandle: 'bottom',
                    targetHandle: 'top'
                })
            }

            // Spouse Edge
            if (m.spouse_id) {
                // Ensure unique processing for the pair
                const id1 = m.id < m.spouse_id ? m.id : m.spouse_id
                const id2 = m.id < m.spouse_id ? m.spouse_id : m.id
                const pairId = `${id1}-${id2}`

                if (!processedSpousePairs.has(pairId)) {
                    processedSpousePairs.add(pairId)

                    // Direction handles will be fixed by layout
                    flowEdges.push({
                        id: `s${id1}-${id2}`,
                        source: id1,
                        target: id2,
                        type: 'straight',
                        animated: false,
                        style: { stroke: '#ec4899', strokeDasharray: '5,5', strokeWidth: 1.5 },
                        label: '❤️',
                        labelStyle: { fill: '#ec4899', fontWeight: 700, fontSize: 12 },
                        labelShowBg: false, // Hide white background behind emoji
                        sourceHandle: 'right', // Default
                        targetHandle: 'left'   // Default
                    })
                }
            }
        })

        const { nodes: layoutNodes, edges: layoutEdges } = getLayoutedElements(
            flowNodes,
            flowEdges
        )

        setNodes(layoutNodes)
        setEdges(layoutEdges)

        // Fit view on first load only if needed? Or on data change?
        // Let's do nothing here, let user control zoom

    }, [initialMembers, setNodes, setEdges, onAddChild, onAddSpouse, onEdit, onDelete])

    const nodeTypes = useMemo(() => ({ member: MemberNode }), [])

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        const member = initialMembers.find((m: any) => m.id === node.id)
        if (member && onNodeClick) {
            onNodeClick(member)
        }
    }, [initialMembers, onNodeClick])

    const onReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
        },
        [setEdges]
    )

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onReconnect={onReconnect}
                onNodeDragStop={handleNodeDragStop}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
                minZoom={0.1}
            >
                <Controls />
                <MiniMap zoomable pannable />
                <Background gap={12} size={1} color="#f1f1f1" />
            </ReactFlow>
        </div>
    )
}
