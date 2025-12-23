"use client";

import React, { memo, useCallback, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { MoreHorizontal, Plus, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { LLMNodeData, TextNodeData, ImageNodeData, GEMINI_MODELS } from "@/types/workflow";
import { useWorkflowStore } from "@/store/workflowStore";

const LLMNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as LLMNodeData;
  const { updateNodeData, deleteNode, nodes, edges } = useWorkflowStore();
  const [imageInputCount, setImageInputCount] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const connectedHandles = edges
    .filter((e) => e.target === id)
    .map((e) => e.targetHandle);

  const handleDelete = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  const addImageInput = useCallback(() => {
    if (imageInputCount < 5) {
      setImageInputCount((prev) => prev + 1);
    }
  }, [imageInputCount]);

  const collectInputs = useCallback(() => {
    const incomingEdges = edges.filter((e) => e.target === id);
    const images: string[] = [];
    let promptText = "";

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode) {
        const handleId = edge.targetHandle;

        if (sourceNode.type === "text") {
          const textData = sourceNode.data as TextNodeData;
          if (textData.content && handleId === "prompt") {
            promptText = textData.content;
          }
        } else if (sourceNode.type === "image") {
          const imageData = sourceNode.data as ImageNodeData;
          if (imageData.imageBase64) {
            images.push(imageData.imageBase64);
          }
        } else if (sourceNode.type === "llm") {
          const llmData = sourceNode.data as LLMNodeData;
          if (llmData.response && handleId === "prompt") {
            promptText = llmData.response;
          }
        }
      }
    }

    return { images, promptText };
  }, [id, nodes, edges]);

  const handleRun = useCallback(async () => {
    updateNodeData(id, { isLoading: true, error: null, response: null });

    try {
      const { images, promptText } = collectInputs();

      const fullUserPrompt = promptText || nodeData.userPrompt || "";

      if (!fullUserPrompt) {
        updateNodeData(id, {
          error: "Please connect a Prompt input",
          isLoading: false,
        });
        return;
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: nodeData.model || "gpt-4o",
          systemPrompt: nodeData.systemPrompt || undefined,
          userPrompt: fullUserPrompt,
          images: images.length > 0 ? images : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        updateNodeData(id, { response: result.content, isLoading: false });
      } else {
        updateNodeData(id, { error: result.error, isLoading: false });
      }
    } catch (error) {
      updateNodeData(id, {
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  }, [id, nodeData, updateNodeData, collectInputs]);

  const showLabels = isHovered;

  return (
    <div
      className={`bg-[#2a2a2a] border rounded-xl shadow-lg transition-all duration-200 ${selected
        ? "border-[#555] shadow-white/10"
        : "border-[#3a3a3a] hover:border-[#4a4a4a]"
        }`}
      style={{ width: "380px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Prompt Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ top: "60px" }}
        className="!w-3 !h-3 !bg-[#c084fc] !border-2 !border-[#c084fc]"
      />
      {(showLabels || !connectedHandles.includes("prompt")) && (
        <div
          className="absolute text-xs text-[#c084fc]"
          style={{ left: "-60px", top: "55px" }}
        >
          Prompt*
        </div>
      )}



      {/* Image Handles */}
      {Array.from({ length: imageInputCount }).map((_, i) => {
        const handleId = `image-${i}`;
        return (
          <React.Fragment key={i}>
            <Handle
              type="target"
              position={Position.Left}
              id={handleId}
              style={{ top: `${90 + i * 30}px` }}
              className="!w-3 !h-3 !bg-transparent !border-2 !border-[#34d399]"
            />
            {(showLabels || !connectedHandles.includes(handleId)) && (
              <div
                className="absolute text-xs text-[#34d399]"
                style={{ left: "-55px", top: `${85 + i * 30}px` }}
              >
                Image {i + 1}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ top: "60px" }}
        className="!w-3 !h-3 !bg-transparent !border-2 !border-[#c084fc]"
      />
      {showLabels && (
        <div
          className="absolute text-xs text-[#c084fc]"
          style={{ right: "-35px", top: "55px" }}
        >
          Text
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a]">
        <div className="flex items-center gap-2">
          <span className="text-white text-base font-medium">LLM</span>
          <div className="relative">
            <select
              value={nodeData.model || "gpt-4o"}
              onChange={(e) => updateNodeData(id, { model: e.target.value })}
              className="appearance-none bg-[#1a1a1a] border border-[#3a3a3a] text-[#aaa] text-xs rounded px-2 py-1 pr-6 focus:outline-none focus:border-[#555] cursor-pointer hover:border-[#555]"
            >
              {GEMINI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#666] pointer-events-none" />
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-[#3a3a3a] rounded transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-[#888]" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl">
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a]"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Input Area */}
      <div className="px-4 pt-4">
        <textarea
          value={nodeData.systemPrompt || ""}
          onChange={(e) => updateNodeData(id, { systemPrompt: e.target.value })}
          placeholder="Enter system prompt or instructions..."
          className="w-full h-16 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3 text-sm text-[#bbb] font-normal placeholder-[#555] resize-none focus:outline-none focus:border-[#555] transition-colors"
        />
      </div>

      {/* Response Area */}
      <div className="p-4">
        <div className="w-full min-h-[140px] bg-[#222] border border-[#3a3a3a] rounded-lg p-4">
          {nodeData.isLoading ? (
            <div className="flex items-center justify-center h-[110px]">
              <Loader2 className="w-6 h-6 text-[#888] animate-spin" />
            </div>
          ) : nodeData.error ? (
            <p className="text-sm text-red-400">{nodeData.error}</p>
          ) : nodeData.response ? (
            <p className="text-sm text-[#ccc] whitespace-pre-wrap">
              {nodeData.response}
            </p>
          ) : (
            <p className="text-sm text-[#666]">
              The generated text will appear here
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#3a3a3a]">
        <button
          onClick={addImageInput}
          disabled={imageInputCount >= 5}
          className="flex items-center gap-2 text-xs text-[#888] hover:text-white disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add another image input</span>
        </button>

        <button
          onClick={handleRun}
          disabled={nodeData.isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Run Model</span>
        </button>
      </div>
    </div>
  );
});

LLMNode.displayName = "LLMNode";

export default LLMNode;
