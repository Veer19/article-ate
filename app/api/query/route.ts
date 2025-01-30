import { NextResponse } from "next/server";
import { generateChatResponse } from "@/app/utils/azure-ai";

export const runtime = "nodejs";
export const maxDuration = 60;  // Set maximum duration to 1 minute

export async function POST(request: Request) {
  try {
    const { message, content } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "No content context provided" },
        { status: 400 }
      );
    }

    // Generate response using Azure OpenAI
    const response = await generateChatResponse(message, content);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
