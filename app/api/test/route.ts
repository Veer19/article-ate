console.log("✅ Upload API route loaded");
import { NextResponse, type NextRequest } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import pdf from "pdf-parse";
import { randomUUID as cryptoRandomUUID } from "crypto";
const HUGGINGFACE_API_KEY =
	process.env.HUGGINGFACE_API_KEY || "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";
const PINECONE_API_KEY =
	process.env.PINECONE_API_KEY ||
	"pcsk_4p785f_A2EseFJBuW6cGug1rJdm9YJnEVif1RwM5Ux2aUTQa1YzzByb9ezr8u6xBZ4ie72";
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "chat-pdf";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

if (!HUGGINGFACE_API_KEY || !PINECONE_API_KEY) {
	throw new Error("Missing required environment variables");
}

const pinecone = new Pinecone({
	apiKey: PINECONE_API_KEY,
});

async function getEmbedding(text: string) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ inputs: text }),
		}
	);

	if (!response.ok) {
		throw new Error(`Failed to get embedding: ${response.statusText}`);
	}

	const data = await response.json();
	return data[0];
}
console.log("Test Is here");
export async function GET() {
	return NextResponse.json({ message: "Test API is working!" });
}

export async function POST(request: any) {
	console.log("Upload API route hit");
	try {
		const formData = await request.formData();
		const file = formData.get("file");

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: "No file uploaded or invalid file" },
				{ status: 400 }
			);
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: "File size exceeds the maximum limit of 10 MB" },
				{ status: 400 }
			);
		}

		if (file.type !== "application/pdf") {
			return NextResponse.json(
				{ error: "Only PDF files are allowed" },
				{ status: 400 }
			);
		}

		const sessionId = cryptoRandomUUID();
		const arrayBuffer = await file.arrayBuffer();
		// const pdfData = await pdf(Buffer.from(arrayBuffer));

		const text = "Hello my name is Veer Singh";

		if (!text) {
			return NextResponse.json(
				{ error: "No text extracted from PDF" },
				{ status: 400 }
			);
		}

		const embedding = await getEmbedding(text);
		const index = pinecone.index(PINECONE_INDEX_NAME);

		await index.upsert([
			{
				id: sessionId,
				values: embedding,
				metadata: { text, sessionId },
			},
		]);

		// TODO: Implement actual file storage and get the real URL
		const pdfUrl = `https://your-storage-service.com/${sessionId}.pdf`;

		console.log("Sending response:", {
			message: "PDF processed and stored successfully",
			url: pdfUrl,
			sessionId,
		});
		return NextResponse.json({
			message: "PDF processed and stored successfully",
			url: "",
			sessionId,
		});
	} catch (error) {
		console.error("Error in upload API route:", error);
		console.error("Error processing PDF:", error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: `Failed to process PDF: ${error.message}` },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
	return NextResponse.json(
		{ error: "An unexpected error occurred" },
		{ status: 500 }
	);
}
