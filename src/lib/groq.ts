import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export async function generateContentGroq(
    model: string,
    systemPrompt: string | undefined,
    userPrompt: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    images?: string[]
): Promise<string> {
    const messages: ChatMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
        messages.push({
            role: "system",
            content: systemPrompt,
        });
    }

    // Note: Groq text models don't support images directly
    // Images would need to be processed separately
    messages.push({
        role: "user",
        content: userPrompt,
    });

    const response = await groq.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: 4096,
    });

    return response.choices[0]?.message?.content || "";
}
