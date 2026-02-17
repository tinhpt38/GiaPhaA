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
const NODE_WIDTH = 200
const NODE_HEIGHT = 100
const SPOUSE_SPACING = 50 // Gap between spouses
const LEVEL_SPACING = 200 // Vertical gap between generations
const NODE_SPACING = 50 // Horizontal gap between siblings

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return { nodes, edges }

    // 1. Build a map of nodes for easy access
    const nodeMap = new Map(nodes.map(n => [n.id, n]))

    // 2. Identify relationships
    const childrenMap = new Map<string, string[]>()
    const spouseMap = new Map<string, string>()
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
        else if (edge.id.startsWith('s')) {
            // Bi-directional mapping for easy lookup
            spouseMap.set(edge.source, edge.target)
            spouseMap.set(edge.target, edge.source)
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
        const spouseId = spouseMap.get(n.id)
        if (spouseId) {
            // If spouse is also a root (no parent), pick the one that is 'isRoot' or smaller ID
            if (!hasParent.has(spouseId)) {
                const spouse = nodeMap.get(spouseId)
                // Prefer explicit root
                if (n.data.isRoot) return true
                if (spouse?.data.isRoot) return false
                return n.id < spouseId
            }
            // If spouse HAS a parent, then THIS node (n) is the outsider marrying in.
            // We usually attache n to spouse. So n is NOT a layout root.
            return false
        }
        return true
    })

    // 4. Build Hierarchy for D3
    // We create "Virtual Nodes" that represents a Unit (Single or Couple)
    type D3Node = {
        id: string
        members: string[] // [MainID] or [MainID, SpouseID]
        children: D3Node[]
        w: number
    }

    const buildTree = (rootId: string): D3Node => {
        visited.add(rootId)
        const spouseId = spouseMap.get(rootId)

        let members = [rootId]
        let width = NODE_WIDTH

        // If has spouse and spouse not visited (or attached to this node as primary)
        // We ensure we don't process the spouse separately
        if (spouseId && !visited.has(spouseId)) {
            visited.add(spouseId)
            // Check who is "primary" for layout?
            // Usually we keep the bloodline straight. childrenMap depends on who is the 'source' in edges.
            // Our edges are parent->child.
            // If A -> Child, and A is married to B.
            // We treat (A,B) as a unit.
            members.push(spouseId)
            width = (NODE_WIDTH * 2) + SPOUSE_SPACING
        }

        // Gather children
        // Children can belong to either member of the couple
        const childrenIds = new Set<string>()
        members.forEach(mId => {
            const kids = childrenMap.get(mId)
            if (kids) kids.forEach(k => childrenIds.add(k))
        })

        const childrenObj: D3Node[] = Array.from(childrenIds)
            .filter(kidId => !visited.has(kidId)) // Avoid cycles
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
        const treeLayout = tree<D3Node>()
            .nodeSize([NODE_WIDTH + NODE_SPACING, LEVEL_SPACING])
            .separation((a: HierarchyPointNode<D3Node>, b: HierarchyPointNode<D3Node>) => {
                // Determine width of nodes to calculate separation
                // Standard separation is 1.
                // We need to account for the width of the 'couples'
                const aWidth = a.data.members.length > 1 ? 2.2 : 1.2
                const bWidth = b.data.members.length > 1 ? 2.2 : 1.2
                return (aWidth + bWidth) / 2
                // return a.parent === b.parent ? 1.5 : 2
            })

        const rootD3 = treeLayout(d3Hierarchy)

        // Extract Layout positions
        rootD3.each((d) => {
            const { x, y } = d
            const members = d.data.members

            // Center the "Unit" at (x, y)
            // If Unit has 2 members:
            //   Left Member: x - (NODE_WIDTH + SPOUSE_SPACING)/2 + offset...
            //   Wait, D3 x is the Center of the node.

            if (members.length === 1) {
                const node = nodeMap.get(members[0])
                if (node) {
                    node.position = {
                        x: x + currentXOffset,
                        y: y
                    }
                }
            } else if (members.length === 2) {
                // Couple
                const m1 = nodeMap.get(members[0]) // Primary (Root/Bloodline)
                const m2 = nodeMap.get(members[1]) // Spouse

                // Position: M1 at Left, M2 at Right? Or centered?
                // Let's place them continuously.
                // Center of the couple is x.
                // Total width = 2*W + Gap.
                // Start X = x - (2*W + Gap)/2
                // M1 X = Start X + W/2
                // M2 X = Start X + W + Gap + W/2

                const totalWidth = (NODE_WIDTH * 2) + SPOUSE_SPACING
                const startX = x - (totalWidth / 2)

                if (m1) {
                    // Start from startX logic
                    // Unit starts at x - totalWidth/2
                    // ReactFlow node position is top-left
                    // So m1 is simply at startX
                    m1.position = {
                        x: startX + currentXOffset,
                        y: y
                    }
                }

                if (m2) {
                    m2.position = {
                        x: startX + NODE_WIDTH + SPOUSE_SPACING + currentXOffset,
                        y: y
                    }
                }
            }
        })

        // Shift next component
        // Find max x in this tree to update currentXOffset
        let maxX = -Infinity
        rootD3.each(d => {
            if (d.x > maxX) maxX = d.x
        })
        currentXOffset += maxX + 500 // Arbitrary gap between trees
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
}

export default function TreeVisualizer({
    initialMembers,
    onNodeClick,
    onAddChild,
    onAddSpouse,
    onEdit,
    onDelete
}: TreeVisualizerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { fitView } = useReactFlow()

    // Convert DB members to React Flow Nodes & Edges
    useEffect(() => {
        if (!initialMembers || initialMembers.length === 0) return

        const flowNodes: Node[] = initialMembers.map((m) => ({
            id: m.id,
            type: 'member',
            data: {
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
            position: { x: 0, y: 0 },
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
                const smallId = m.id < m.spouse_id ? m.id : m.spouse_id
                const largeId = m.id < m.spouse_id ? m.spouse_id : m.id
                const pairId = `${smallId}-${largeId}`

                if (!processedSpousePairs.has(pairId)) {
                    processedSpousePairs.add(pairId)

                    flowEdges.push({
                        id: `s${smallId}-${largeId}`,
                        source: smallId,      // Node on the left (convention)
                        target: largeId,      // Node on the right
                        type: 'straight',
                        animated: false,
                        style: { stroke: '#ec4899', strokeDasharray: '5,5', strokeWidth: 1.5 },
                        label: '❤️',
                        labelStyle: { fill: '#ec4899', fontWeight: 700, fontSize: 12 },
                        sourceHandle: 'right', // Connect from Right handle of the source (left node)
                        targetHandle: 'left'   // To Left handle of the target (right node)
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
