import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import { randomUUID } from "crypto";

if (!process.env.AZURE_OPENAI_KEY) {
	throw new Error("AZURE_OPENAI_KEY is not set in environment variables");
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
	throw new Error(
		"AZURE_OPENAI_ENDPOINT is not set in environment variables"
	);
}

if (!process.env.AZURE_SEARCH_ENDPOINT) {
	throw new Error(
		"AZURE_SEARCH_ENDPOINT is not set in environment variables"
	);
}

if (!process.env.AZURE_SEARCH_KEY) {
	throw new Error("AZURE_SEARCH_KEY is not set in environment variables");
}

const client = new AzureOpenAI({
	apiKey: process.env.AZURE_OPENAI_KEY,
	endpoint: process.env.AZURE_OPENAI_ENDPOINT,
	deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-35-turbo", // Make sure to set this in your .env
	apiVersion: "2023-12-01-preview", // Using a stable API version
});

const searchClient = new SearchClient(
	process.env.AZURE_SEARCH_ENDPOINT,
	"articles-index",
	new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
);

interface ArticleDocument {
	id: string;
	sessionId: string;
	url: string;
	content: string;
	contentVector: number[];
	timestamp: Date;
}

export const generateSummary = async (
	text: string
): Promise<{ summary: string; questions: string[] }> => {
	const deploymentName =
		process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-35-turbo";

	try {
		const messages: any = [
			{
				role: "system",
				content:
					"You are a helpful assistant that provides clear and concise summaries of text and generates engaging questions. Provide your response in the following format:\n\n[summary]\nYour summary here\n[questions]\n1. First question\n2. Second question\n(and so on...)",
			},
			{
				role: "user",
				content: `Analyze and respond about this text:\n\n${text}`,
			},
		];

		const response = await client.chat.completions.create({
			model: deploymentName,
			messages,
			temperature: 0.3,
			max_tokens: 800,
			n: 1,
		});

		const content = response.choices[0]?.message?.content || "";

		// Extract summary and questions using the markers
		const summaryMatch = content.match(
			/\[summary\]\n([\s\S]*?)\n\[questions\]/
		);
		const questionsMatch = content.match(/\[questions\]\n([\s\S]*?)$/);

		const summary = summaryMatch ? summaryMatch[1].trim() : "";
		const questionsText = questionsMatch ? questionsMatch[1].trim() : "";

		// Extract individual questions
		const questions = questionsText
			.split(/\n/)
			.map((q) => q.replace(/^\d+\.\s*/, "").trim())
			.filter((q) => q.length > 0);

		return {
			summary,
			questions,
		};
	} catch (error) {
		console.error("Error generating summary:", error);
		throw error;
	}
};

export const generateChatResponse = async (
	sessionId: string,
	message: string
): Promise<string> => {
	const deploymentName =
		process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-35-turbo";

	try {
		// Generate embeddings for the user's message
		const messageEmbedding = await fetchEmbeddings(message);

		// Search for document with matching sessionId and use vector similarity
		const searchResults = await searchClient.search(
			`sessionId:${sessionId}`,
			{
				vectorSearchOptions: {
					queries: [
						{
							vector: messageEmbedding,
							fields: ["contentVector"],
							kNearestNeighborsCount: 3,
							kind: "vector",
						},
					],
				},
				select: ["content", "id", "sessionId"],
				top: 1,
			}
		);
		// Combine only the most relevant context chunks
		let relevantContext = "";
		for await (const result of searchResults.results) {
			const document = result.document as ArticleDocument;
			console.log(document);
			console.log(sessionId);
			// In vector search, the order of results already represents relevance
			if (
				document.id &&
				document.content &&
				document.sessionId === sessionId
			) {
				relevantContext += document.content + "\n\n";
			}
		}
		console.log("RELEVANT CONTENT LENGTH - ", relevantContext.length);
		console.log(relevantContext);
		const messages: any = [
			{
				role: "system",
				content:
					"You are a helpful assistant that answers questions about the provided content. Use the context to provide accurate and relevant answers. Try to keep it short. DO NOT answer the question if it is not related to the context provided.",
			},
			{
				role: "user",
				content: `Context:\n${relevantContext}\n\nQuestion: ${message}`,
			},
		];
		console.log(messages);
		const response = await client.chat.completions.create({
			model: deploymentName,
			messages,
			temperature: 0.5,
			max_tokens: 300,
			n: 1,
		});

		return (
			response.choices[0]?.message?.content ||
			"I couldn't generate a response."
		);
	} catch (error) {
		console.error("Error generating chat response:", error);
		throw new Error("Failed to generate response");
	}
};

export const storeEmbeddings = async (
	sessionId: string,
	url: string,
	content: string[],
	embeddings: number[][]
) => {
	try {
		console.log("Content", content.length);

		const documents: ArticleDocument[] = content.map((content, index) => ({
			id: `${sessionId}-${index}`,
			sessionId,
			url,
			content,
			contentVector: embeddings[index],
			timestamp: new Date(),
		}));
		console.log("Documents", documents.length);

		const result = await searchClient.uploadDocuments(documents);
		console.log("Result", result);
		return { success: true, id: sessionId };
	} catch (error) {
		console.error("Error storing embeddings:", error);
		throw new Error("Failed to store embeddings in the search index");
	}
};

export const fetchEmbeddings = async (text: string) => {
	try {
		const client = new AzureOpenAI({
			apiKey: process.env.AZURE_OPENAI_KEY!,
			endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
			deployment:
				process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ||
				"text-embedding-ada-002",
			apiVersion: "2023-12-01-preview",
		});

		const response = await client.embeddings.create({
			input: text,
			model:
				process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ||
				"text-embedding-ada-002",
		});

		return response.data[0].embedding;
	} catch (error) {
		console.error("Error generating embeddings:", error);
		throw new Error("Failed to generate embeddings");
	}
};
