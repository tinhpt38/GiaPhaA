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
                dates: m.dob_solar,
                image_url: m.image_url,
                canAddSpouse: true,
                onEdit: () => onEdit && onEdit(m),
                onAddChild: () => onAddChild && onAddChild(m.id),
                onAddSpouse: () => onAddSpouse && onAddSpouse(m.id),
                onDelete: () => onDelete && onDelete(m.id)
            },
            position: { x: 0, y: 0 }
        }))

        const flowEdges: Edge[] = []
        initialMembers.forEach(m => {
            if (m.parent_id) {
                flowEdges.push({
                    id: `e${m.parent_id}-${m.id}`,
                    source: m.parent_id,
                    target: m.id,
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#b1b1b7' }
                })
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

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
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
