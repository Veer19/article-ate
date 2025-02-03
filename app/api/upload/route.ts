import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import {
	fetchEmbeddings,
	generateSummary,
	storeEmbeddings,
} from "@/app/utils/azure-ai";
import { randomUUID } from "crypto";
export const runtime = "nodejs";
export const maxDuration = 60; // Set maximum duration to 5 minutes

export async function GET() {
	return NextResponse.json({ message: "Test API is working!" });
}

export async function POST(request: Request) {
	try {
		const { url } = await request.json();

		if (!url) {
			return NextResponse.json(
				{ error: "URL is required" },
				{ status: 400 }
			);
		}

		const content = await getWebContent(url);
		console.log("ORIGINAL CONTENT LENGTH - ", content.length);
		console.log(content);
		const summary = await generateSummary(content);

		// Split content into chunks (e.g., paragraphs or fixed-length segments)
		const chunks = splitContent(content);
		// Generate embeddings for each chunk
		console.log("Chunks", chunks.length);
		const embeddingsPromises = chunks.map((chunk) =>
			fetchEmbeddings(chunk)
		);
		const embeddings = await Promise.all(embeddingsPromises);
		console.log("Embeddings", embeddings.length);
		const sessionId = randomUUID();
		// Store each chunk with its embedding
		await storeEmbeddings(sessionId, url, chunks, embeddings);

		return NextResponse.json({
			sessionId: sessionId,
			content: summary.summary,
			questions: summary.questions,
		});
	} catch (error) {
		console.error("Error processing URL:", error);
		return NextResponse.json(
			{ error: "Failed to process URL" },
			{ status: 500 }
		);
	}
}

async function getWebContent(url: string) {
	// Validate URL
	try {
		new URL(url);
	} catch {
		throw new Error("Invalid URL format");
	}

	console.log("Fetching URL:", url);

	// Fetch the webpage content
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch URL: ${response.statusText}`);
	}

	const html = await response.text();

	// Use cheerio for better HTML parsing
	const $ = cheerio.load(html);

	// Remove unwanted elements
	$("script").remove();
	$("style").remove();
	$("nav").remove();
	$("header").remove();
	$("footer").remove();
	$('[role="navigation"]').remove();
	$('[role="banner"]').remove();
	$('[role="complementary"]').remove();

	// Extract main content
	let mainContent = $("main").text() || $("article").text();
	if (!mainContent) {
		// Fallback to body content if no main or article tags
		mainContent = $("body").text();
	}

	// Clean up the text
	const text = mainContent.replace(/\s+/g, " ").trim().slice(0, 6000); // Limit text length to control token usage

	console.log("Successfully extracted text, length:", text.length);

	return text;
}

function splitContent(text: string, maxChunkSize: number = 1000): string[] {
	// Split by paragraphs first
	let chunks = text.split(/\n\s*\n/);

	// Further split any chunks that are too large
	const result: string[] = [];
	for (const chunk of chunks) {
		if (chunk.length > maxChunkSize) {
			// Split by sentences if chunk is too large
			const sentences = chunk.match(/[^.!?]+[.!?]+/g) || [chunk];
			let currentChunk = "";

			for (const sentence of sentences) {
				if ((currentChunk + sentence).length > maxChunkSize) {
					if (currentChunk) result.push(currentChunk.trim());
					currentChunk = sentence;
				} else {
					currentChunk += " " + sentence;
				}
			}
			if (currentChunk) result.push(currentChunk.trim());
		} else {
			result.push(chunk.trim());
		}
	}

	return result.filter((chunk) => chunk.length > 0);
}
