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
import dagre from 'dagre'
import MemberNode from './MemberNode'

// Dagre Layout Setup
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 200
const nodeHeight = 100

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB' })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        return {
            ...node,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
            draggable: true // Enable dragging
        }
    })

    return { nodes: newNodes, edges }
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
                // Ensure we only add the edge once (e.g. from husband to wife, or smaller ID to larger ID)
                // Here we check if the current member ID is smaller than spouse ID to avoid duplicates if bi-directional
                if (m.id < m.spouse_id) {
                    flowEdges.push({
                        id: `s${m.id}-${m.spouse_id}`,
                        source: m.id,
                        target: m.spouse_id,
                        type: 'straight', // Changed to straight for cleaner look with dagre
                        animated: false,
                        style: { stroke: '#ec4899', strokeDasharray: '5,5', strokeWidth: 1.5 },
                        label: '❤️',
                        labelStyle: { fill: '#ec4899', fontWeight: 700, fontSize: 12 },
                        sourceHandle: 'right', // Connect from right side of source
                        targetHandle: 'left'   // To left side of target
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
