'use client'

import React from 'react'
import {
    PageFitMode,
    OrientationType,
    HorizontalAlignmentType,
    VerticalAlignmentType,
    ChildrenPlacementType,
    LineType,
    ConnectorType,
    ElbowType
} from 'basicprimitives'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Settings2 } from 'lucide-react'

export interface DiagramSettings {
    pageFitMode: number,
    orientationType: number,
    horizontalAlignment: number,
    verticalAlignment: number,
    childrenPlacementType: number,
    linesType: number,
    connectorType: number,
    elbowType: number,
}

export const defaultDiagramSettings: DiagramSettings = {
    pageFitMode: PageFitMode.FitToPage,
    orientationType: OrientationType.Top,
    horizontalAlignment: HorizontalAlignmentType.Center,
    verticalAlignment: VerticalAlignmentType.Middle,
    childrenPlacementType: ChildrenPlacementType.Horizontal,
    linesType: LineType.Solid,
    connectorType: ConnectorType.Squared,
    elbowType: ElbowType.None,
}

interface LayoutSettingsPanelProps {
    settings: DiagramSettings
    onChange: (newSettings: DiagramSettings) => void
    onClose: () => void
}

export function LayoutSettingsPanel({ settings, onChange, onClose }: LayoutSettingsPanelProps) {

    const updateSetting = (key: keyof DiagramSettings, val: number) => {
        onChange({ ...settings, [key]: val })
    }

    return (
        <aside className="fixed inset-y-0 right-0 md:relative md:w-64 lg:w-80 bg-white border-l border-[#e5e1e1] flex flex-col z-30 transition-all duration-300 shrink-0 shadow-lg md:shadow-none h-full">
            <div className="p-4 border-b border-[#e5e1e1] flex justify-between items-center bg-[#fcf8f8]">
                <div className="flex items-center gap-2 text-[#1b0d0d]">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Cài đặt hiển thị</h3>
                </div>
                <button onClick={onClose} className="text-[#9a4c4c] hover:text-[#1b0d0d] p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white text-sm">

                {/* 1. Page Fit Mode */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Chế độ hiển thị</Label>
                    <Select value={settings.pageFitMode.toString()} onValueChange={(val) => updateSetting('pageFitMode', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn kích thước" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={PageFitMode.None.toString()}>Thực tế (None)</SelectItem>
                            <SelectItem value={PageFitMode.PageWidth.toString()}>Vừa chiều rộng</SelectItem>
                            <SelectItem value={PageFitMode.PageHeight.toString()}>Vừa chiều cao</SelectItem>
                            <SelectItem value={PageFitMode.FitToPage.toString()}>Vừa toàn màn hình</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. Orientation */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Hướng vẽ cây</Label>
                    <Select value={settings.orientationType.toString()} onValueChange={(val) => updateSetting('orientationType', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn hướng vẽ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={OrientationType.Top.toString()}>Từ trên xuống</SelectItem>
                            <SelectItem value={OrientationType.Bottom.toString()}>Từ dưới lên</SelectItem>
                            <SelectItem value={OrientationType.Left.toString()}>Từ trái sang</SelectItem>
                            <SelectItem value={OrientationType.Right.toString()}>Từ phải sang</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 3. Horizontal Alignment */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Căn chỉnh ngang</Label>
                    <Select value={settings.horizontalAlignment.toString()} onValueChange={(val) => updateSetting('horizontalAlignment', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn căn lề" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={HorizontalAlignmentType.Center.toString()}>Giữa (Center)</SelectItem>
                            <SelectItem value={HorizontalAlignmentType.Left.toString()}>Trái (Left)</SelectItem>
                            <SelectItem value={HorizontalAlignmentType.Right.toString()}>Phải (Right)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 4. Children Placement */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Cách xếp con cái</Label>
                    <Select value={settings.childrenPlacementType.toString()} onValueChange={(val) => updateSetting('childrenPlacementType', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Cách sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ChildrenPlacementType.Auto.toString()}>Tự động (Auto)</SelectItem>
                            <SelectItem value={ChildrenPlacementType.Horizontal.toString()}>Ngang (Horizontal)</SelectItem>
                            <SelectItem value={ChildrenPlacementType.Vertical.toString()}>Dọc (Vertical)</SelectItem>
                            <SelectItem value={ChildrenPlacementType.Matrix.toString()}>Lưới (Matrix)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 5. Lines Style */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Kiểu đường kẻ</Label>
                    <Select value={settings.linesType.toString()} onValueChange={(val) => updateSetting('linesType', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn kiểu kẻ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={LineType.Solid.toString()}>Nét liền (Solid)</SelectItem>
                            <SelectItem value={LineType.Dotted.toString()}>Nét chấm (Dotted)</SelectItem>
                            <SelectItem value={LineType.Dashed.toString()}>Nét đứt (Dashed)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 6. Connector Style */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Góc nối</Label>
                    <Select value={settings.connectorType.toString()} onValueChange={(val) => updateSetting('connectorType', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn góc" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ConnectorType.Squared.toString()}>Vuông góc</SelectItem>
                            <SelectItem value={ConnectorType.Angular.toString()}>Góc nhọn</SelectItem>
                            <SelectItem value={ConnectorType.Curved.toString()}>Bo viền</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 7. Elbow Style */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Khớp nối nhánh</Label>
                    <Select value={settings.elbowType.toString()} onValueChange={(val) => updateSetting('elbowType', parseInt(val))}>
                        <SelectTrigger className="w-full bg-[#f8f6f6] border-[#e5e1e1]">
                            <SelectValue placeholder="Chọn khớp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ElbowType.None.toString()}>Không (None)</SelectItem>
                            <SelectItem value={ElbowType.Dot.toString()}>Dấu chấm (Dot)</SelectItem>
                            <SelectItem value={ElbowType.Bevel.toString()}>Vát (Bevel)</SelectItem>
                            <SelectItem value={ElbowType.Round.toString()}>Tròn (Round)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </aside>
    )
}
