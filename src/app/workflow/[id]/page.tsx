"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import WorkflowBuilder from "@/components/WorkflowBuilder";
import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowEditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const workflowId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        workflowName,
        nodes,
        edges,
        setWorkflowId,
        setWorkflowName,
        setNodes,
        setEdges,
    } = useWorkflowStore();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Load workflow
    useEffect(() => {
        if (session && workflowId) {
            loadWorkflow();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, workflowId]);

    const loadWorkflow = async () => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}`);
            if (!res.ok) {
                router.push("/dashboard");
                return;
            }

            const data = await res.json();
            if (data.workflow) {
                setWorkflowId(data.workflow._id);
                setWorkflowName(data.workflow.name);
                setNodes(data.workflow.nodes || []);
                setEdges(data.workflow.edges || []);
            }
        } catch (error) {
            console.error("Failed to load workflow:", error);
            router.push("/dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-save function
    const saveWorkflow = useCallback(async () => {
        if (!workflowId || isSaving) return;

        // Don't save if any LLM node is currently loading
        const isAnyNodeLoading = nodes.some(
            (node) => node.type === "llm" && (node.data as { isLoading?: boolean }).isLoading
        );
        if (isAnyNodeLoading) return;

        // Sanitize nodes - remove transient state before saving
        const sanitizedNodes = nodes.map((node) => {
            if (node.type === "llm") {
                const { isLoading, ...restData } = node.data as Record<string, unknown>;
                return { ...node, data: { ...restData, isLoading: false } };
            }
            return node;
        });

        setIsSaving(true);
        try {
            await fetch(`/api/workflows/${workflowId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: workflowName,
                    nodes: sanitizedNodes,
                    edges,
                }),
            });
        } catch (error) {
            console.error("Failed to save workflow:", error);
        } finally {
            setIsSaving(false);
        }
    }, [workflowId, workflowName, nodes, edges, isSaving]);

    // Auto-save on changes (debounced)
    useEffect(() => {
        if (!isLoading && workflowId) {
            const timer = setTimeout(() => {
                saveWorkflow();
            }, 2000); // Save 2 seconds after last change

            return () => clearTimeout(timer);
        }
    }, [nodes, edges, workflowName, isLoading, workflowId, saveWorkflow]);

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <p className="text-[#666] text-sm">Loading workflow...</p>
                </div>
            </div>
        );
    }

    return <WorkflowBuilder />;
}
