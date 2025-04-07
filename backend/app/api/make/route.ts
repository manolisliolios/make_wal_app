import { fireworks } from "@ai-sdk/fireworks";
import { streamText } from "ai";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export async function POST(req: Request) {
  const { messages, systemPrompt } = await req.json();

  const codeGenModel = wrapLanguageModel({
    model: fireworks("accounts/fireworks/models/deepseek-r1"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  });

  const result = streamText({
    model: codeGenModel,
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
