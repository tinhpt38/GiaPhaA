'use client'

import TreeVisualizer from './TreeVisualizer'

interface TreeVisualizerWrapperProps {
    initialMembers: any[]
}

export default function TreeVisualizerWrapper({ initialMembers }: TreeVisualizerWrapperProps) {
    return (
        <TreeVisualizer initialMembers={initialMembers} />
    )
}
