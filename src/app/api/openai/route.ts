import { NextRequest, NextResponse } from "next/server";
import { llmRequestSchema } from "@/lib/schemas";
import { generateContentOpenAI } from "@/lib/openai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request with Zod
        const validationResult = llmRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationResult.error.issues
                        .map((e: { message: string }) => e.message)
                        .join(", "),
                },
                { status: 400 }
            );
        }

        const { model, systemPrompt, userPrompt, images } = validationResult.data;

        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "OPENAI_API_KEY is not configured. Please add it to your .env.local file.",
                },
                { status: 500 }
            );
        }

        // Generate content using OpenAI
        const content = await generateContentOpenAI(
            model,
            systemPrompt,
            userPrompt,
            images
        );

        return NextResponse.json({
            success: true,
            content,
        });
    } catch (error) {
        console.error("API error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
