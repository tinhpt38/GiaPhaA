'use client'

import { ReactFlowProvider } from '@xyflow/react'
import TreeVisualizer from './TreeVisualizer'

interface TreeVisualizerWrapperProps {
    initialMembers: any[]
}

export default function TreeVisualizerWrapper({ initialMembers }: TreeVisualizerWrapperProps) {
    return (
        <ReactFlowProvider>
            <TreeVisualizer initialMembers={initialMembers} />
        </ReactFlowProvider>
    )
}
