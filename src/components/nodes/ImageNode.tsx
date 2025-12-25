'use client';

import React, { memo, useCallback, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, ImageIcon, Upload, X } from 'lucide-react';
import { ImageNodeData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const ImageNode = memo(({ id, data, selected }: NodeProps) => {
    const nodeData = data as ImageNodeData;
    const { updateNodeData, deleteNode } = useWorkflowStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { label: e.target.value });
    }, [id, updateNodeData]);

    const handleDelete = useCallback(() => {
        deleteNode(id);
    }, [id, deleteNode]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateNodeData(id, {
                    imageUrl: URL.createObjectURL(file),
                    imageBase64: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    }, [id, updateNodeData]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateNodeData(id, {
                    imageUrl: URL.createObjectURL(file),
                    imageBase64: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    }, [id, updateNodeData]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const clearImage = useCallback(() => {
        updateNodeData(id, {
            imageUrl: null,
            imageBase64: null,
        });
    }, [id, updateNodeData]);

    return (
        <div
            className={`bg-[#161616] border rounded-lg shadow-lg min-w-[312px] max-w-[416px] transition-all duration-200 ${selected ? 'border-[#444] shadow-white/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#2a2a2a] bg-[#1a1a1a] rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-[#2a2a2a] rounded">
                        <ImageIcon className="w-3 h-3 text-[#888]" />
                    </div>
                    <input
                        type="text"
                        value={nodeData.label}
                        onChange={handleLabelChange}
                        className="bg-transparent text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#555] rounded px-1 w-16 truncate"
                    />
                </div>
                <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-[#333] rounded transition-colors group"
                >
                    <Trash2 className="w-3 h-3 text-[#555] group-hover:text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {nodeData.imageUrl ? (
                    <div className="relative">
                        <img
                            src={nodeData.imageUrl}
                            alt="Uploaded"
                            className="w-full h-36 object-cover rounded border border-[#2a2a2a]"
                        />
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-[#444] rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="w-full h-36 border-2 border-dashed border-[#2a2a2a] rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#444] hover:bg-[#1a1a1a] transition-all"
                    >
                        <Upload className="w-6 h-6 text-[#555]" />
                        <span className="text-xs text-[#555]">Upload</span>
                    </div>
                )}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                style={{ top: '50%' }}
                className="!w-3 !h-3 !bg-[#666] !border-2 !border-[#888] !transform-none"
            />
        </div>
    );
});

ImageNode.displayName = 'ImageNode';

export default ImageNode;
