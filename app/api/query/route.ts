import { NextResponse } from "next/server";
import { generateChatResponse } from "@/app/utils/azure-ai";

export const runtime = "nodejs";
export const maxDuration = 60; // Set maximum duration to 1 minute

export async function POST(request: Request) {
	try {
		const { sessionId, message } = await request.json();

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID not provided" },
				{ status: 400 }
			);
		}

		if (!message) {
			return NextResponse.json(
				{ error: "No message provided" },
				{ status: 400 }
			);
		}

		// Generate response using Azure OpenAI
		const response = await generateChatResponse(sessionId, message);

		return NextResponse.json({ message: response });
	} catch (error) {
		console.error("Error processing query:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "An error occurred",
			},
			{ status: 500 }
		);
	}
}
