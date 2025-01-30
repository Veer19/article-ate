import { AzureOpenAI } from "openai";

if (!process.env.AZURE_OPENAI_KEY) {
	throw new Error("AZURE_OPENAI_KEY is not set in environment variables");
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
	throw new Error(
		"AZURE_OPENAI_ENDPOINT is not set in environment variables"
	);
}

const client = new AzureOpenAI({
	apiKey: process.env.AZURE_OPENAI_KEY,
	endpoint: process.env.AZURE_OPENAI_ENDPOINT,
	deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-35-turbo", // Make sure to set this in your .env
	apiVersion: "2023-12-01-preview", // Using a stable API version
});

export const generateSummary = async (text: string): Promise<{summary: string, questions: string[]}> => {
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
		const summaryMatch = content.match(/\[summary\]\n([\s\S]*?)\n\[questions\]/);
		const questionsMatch = content.match(/\[questions\]\n([\s\S]*?)$/);

		const summary = summaryMatch ? summaryMatch[1].trim() : "";
		const questionsText = questionsMatch ? questionsMatch[1].trim() : "";
		
		// Extract individual questions
		const questions = questionsText
			.split(/\n/)
			.map(q => q.replace(/^\d+\.\s*/, '').trim())
			.filter(q => q.length > 0);

		return {
			summary,
			questions
		};
	} catch (error) {
		console.error("Error generating summary:", error);
		throw error;
	}
};

export const generateChatResponse = async (
	message: string,
	context: string
): Promise<string> => {
	const deploymentName =
		process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-35-turbo";

	try {
		const messages: any = [
			{
				role: "system",
				content:
					"You are a helpful assistant that answers questions about the provided content. Use the context to provide accurate and relevant answers. Try to keep it short",
			},
			{
				role: "user",
				content: `Context:\n${context}\n\nQuestion: ${message}`,
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
		console.log(response);
		return (
			response.choices[0]?.message?.content ||
			"I couldn't generate a response."
		);
	} catch (error) {
		console.error("Error generating chat response:", error);
		throw new Error("Failed to generate response");
	}
};
