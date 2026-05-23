import { NextRequest, NextResponse } from "next/server";

const MIMO_API_URL = "http://localhost:19911/v1/chat/completions";

const COPY_TYPES: Record<string, string> = {
  "landing": "Write a high-converting landing page copy",
  "ads": "Write compelling advertising copy for social media and search ads",
  "product": "Write detailed product description copy for e-commerce",
  "email": "Write professional marketing email copy",
  "social": "Write engaging social media post copy",
};

export async function POST(req: NextRequest) {
  try {
    const { productName, description, audience, tone, copyType } = await req.json();

    if (!productName || !description) {
      return NextResponse.json({ error: "Product name and description are required" }, { status: 400 });
    }

    const typeInstruction = COPY_TYPES[copyType] || COPY_TYPES["landing"];
    const toneInstruction = tone ? `Tone: ${tone}` : "Tone: professional and persuasive";
    const audienceInstruction = audience ? `Target audience: ${audience}` : "";

    const systemMessage = {
      role: "system",
      content: `You are CopyForge, an expert AI copywriter. You create high-converting marketing copy.

${typeInstruction} for the following product/service.

Rules:
- Be specific and compelling
- Use power words and emotional triggers
- Include clear calls-to-action
- Format with proper sections using markdown headers
- Be concise but impactful
- ${toneInstruction}
${audienceInstruction ? `- ${audienceInstruction}` : ""}`,
    };

    const userMessage = {
      role: "user",
      content: `Product/Service: ${productName}

Description: ${description}`,
    };

    const response = await fetch(MIMO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mimo-v2.5-pro",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 2048,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `API error: ${response.status} - ${errText}` }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
