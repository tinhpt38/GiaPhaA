'use client'

import React, { useMemo } from 'react'
import { Enabled, PageFitMode } from 'basicprimitives'
import { FamDiagram } from 'basicprimitivesreact'
import MemberNode from './MemberNode'

interface TreeVisualizerProps {
    initialMembers: any[]
    onNodeClick?: (member: any) => void
    onAddChild?: (parentId: string) => void
    onAddSpouse?: (spouseId: string) => void
    onEdit?: (member: any) => void
    onDelete?: (memberId: string) => void
    readOnly?: boolean
    diagramSettings?: any
}

export default function TreeVisualizer({
    initialMembers,
    onNodeClick,
    onAddChild,
    onAddSpouse,
    onEdit,
    onDelete,
    readOnly = false,
    diagramSettings = {}
}: TreeVisualizerProps) {

    const config = useMemo(() => {
        if (!initialMembers || initialMembers.length === 0) {
            return { items: [] }
        }

        // 1. Map all members to Basic Primitives Item structure
        const itemsMap = new Map<string, any>()

        initialMembers.forEach((m) => {
            const isMale = ['male', 'nam', 'trai'].includes((m.gender || "").toLowerCase())

            itemsMap.set(m.id, {
                id: m.id,
                title: m.full_name,
                description: m.posthumous_name || m.nickname || '', // Map extra names to description
                image: m.image_url,
                itemTitleColor: isMale ? '#0ea5e9' : '#f472b6',
                parents: m.parent_id ? [m.parent_id] : [],
                spouses: m.spouse_id ? [m.spouse_id] : [],
                // Custom data directly mapping to the MemberNode parameters
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
                    onDelete: () => onDelete && onDelete(m.id),
                    isReadOnly: readOnly
                },
                // Link raw member object for onclick actions
                rawMember: m
            });
        })

        // 2. Spouse Handling: In Basic Primitives, "spouses" are usually just linked via multiple parents for a child.
        // Or we use "spouses" on the Family Item structure if available in FamDiagram, but parents is the key array for children.
        // It's safest to keep `parents` accurate based on `m.parent_id`. However, if a child explicitly links only to the father,
        // and we want the mother positioned as a spouse, basicprimitives connects nodes via `parents`.

        // Let's resolve the `parents` array for spouses so `FamDiagram` couples them.
        // If B is spouse of A. And C is child of A. Then C's parents should ideally be [A, B].
        initialMembers.forEach((m) => {
            if (m.parent_id) {
                const parentNode = itemsMap.get(m.parent_id);
                if (parentNode && parentNode.spouses && parentNode.spouses.length > 0) {
                    const item = itemsMap.get(m.id);
                    if (item && !item.parents.includes(parentNode.spouses[0])) {
                        item.parents.push(parentNode.spouses[0]);
                    }
                }
            }
        });

        // 3. Clear circular references or incorrect reverse spouses to avoid Infinite Loops
        // Just extract the flat values array
        const finalItems = Array.from(itemsMap.values());

        return {
            items: finalItems,
            cursorItem: finalItems.length > 0 ? finalItems[0].id : null,
            linesWidth: 1,
            linesColor: '#b1b1b7',
            hasSelectorCheckbox: Enabled.False,
            normalLevelShift: 60,
            dotLevelShift: 40,
            lineLevelShift: 40,
            normalItemsInterval: 30,
            dotItemsInterval: 20,
            lineItemsInterval: 20,
            pageFitMode: PageFitMode.FitToPage,
            ...diagramSettings,
            templates: [
                {
                    name: 'defaultTemplate',
                    itemSize: { width: 220, height: 130 },
                    minimizedItemSize: { width: 3, height: 3 },
                    onItemRender: ({ context: itemConfig }: any) => {
                        return (
                            <div
                                style={{ width: '100%', height: '100%' }}
                                onClick={(e) => {
                                    if (onNodeClick && itemConfig.rawMember && !readOnly) {
                                        onNodeClick(itemConfig.rawMember)
                                    }
                                }}
                            >
                                <MemberNode data={itemConfig.data} />
                            </div>
                        );
                    }
                }
            ]
        };
    }, [initialMembers, onAddChild, onAddSpouse, onEdit, onDelete, onNodeClick, readOnly, diagramSettings])

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '600px', backgroundColor: '#f1f1f1' }}>
            {config.items.length > 0 ? (
                <FamDiagram config={config as any} />
            ) : (
                <div className="flex w-full h-full items-center justify-center text-gray-400">
                    Chưa có thành viên nào trong gia phả.
                </div>
            )}
        </div>
    )
}
