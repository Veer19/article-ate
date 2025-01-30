import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';
import { generateSummary } from "@/app/utils/azure-ai";

export const runtime = "nodejs";
export const maxDuration = 300;  // Set maximum duration to 5 minutes

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
		const summary = await generateSummary(content);

		return NextResponse.json({
			content: summary.summary,
			questions: summary.questions
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
  $('script').remove();
  $('style').remove();
  $('nav').remove();
  $('header').remove();
  $('footer').remove();
  $('[role="navigation"]').remove();
  $('[role="banner"]').remove();
  $('[role="complementary"]').remove();
  
  // Extract main content
  let mainContent = $('main').text() || $('article').text();
  if (!mainContent) {
    // Fallback to body content if no main or article tags
    mainContent = $('body').text();
  }
  
  // Clean up the text
  const text = mainContent
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000); // Limit text length to control token usage
  
  console.log("Successfully extracted text, length:", text.length);
  
  return text;
}
