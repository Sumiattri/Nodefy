import { NextRequest, NextResponse } from "next/server";
import { geminiRequestSchema } from "@/lib/schemas";
import { generateContent } from "@/lib/gemini";
import { generateContentOpenAI } from "@/lib/openai";
import { generateContentGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request with Zod
        const validationResult = geminiRequestSchema.safeParse(body);

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

        let content: string;

        // Check which provider to use based on model name
        if (model.startsWith("llama") || model.startsWith("mixtral")) {
            // Use Groq for Llama/Mixtral models (FREE!)
            if (!process.env.GROQ_API_KEY) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "GROQ_API_KEY is not configured. Get a FREE key from https://console.groq.com/keys",
                    },
                    { status: 500 }
                );
            }
            content = await generateContentGroq(
                model,
                systemPrompt,
                userPrompt,
                images
            );
        } else if (model.startsWith("gpt-")) {
            // Use OpenAI for GPT models
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
            content = await generateContentOpenAI(
                model,
                systemPrompt,
                userPrompt,
                images
            );
        } else {
            // Use Gemini for Gemini models
            if (!process.env.GEMINI_API_KEY) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "GEMINI_API_KEY is not configured. Please add it to your .env.local file.",
                    },
                    { status: 500 }
                );
            }
            content = await generateContent(model, systemPrompt, userPrompt, images);
        }

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
