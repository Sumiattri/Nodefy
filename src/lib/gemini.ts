import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContent(
  model: string,
  systemPrompt: string | undefined,
  userPrompt: string,
  images?: string[]
): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
  });

  // Build content parts
  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [];

  // Add images if provided
  if (images && images.length > 0) {
    for (const imageBase64 of images) {
      // Extract mime type and data from base64 string
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }
  }

  // Add text prompt
  parts.push({ text: userPrompt });

  const result = await geminiModel.generateContent(parts);
  const response = await result.response;
  return response.text();
}
