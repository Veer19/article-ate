/// <reference types="chrome"/>
import { useEffect, useRef, useState, FormEvent } from "react";
import { SummarySection } from "./components/SummarySection";
import { ChatSection } from "./components/ChatSection";
export interface Message {
	type: "user" | "ai" | "system";
	content: string;
}

function App() {
	const [currentUrl, setCurrentUrl] = useState<string>("");

	const [sessionId, setSessionId] = useState("");
	const [articleContent, setArticleContent] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isChatLoading, setIsChatLoading] = useState(false);
	const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<"summary" | "chat">("summary");
	const [error, setError] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// Get current tab URL
		try {
			chrome.tabs.query(
				{ active: true, currentWindow: true },
				function (tabs: any) {
					const url = tabs[0].url;
					if (url) {
						setCurrentUrl(url);
					}
				}
			);
		} catch (error: any) {
			console.error("Error fetching URL: ", error);
			setCurrentUrl("https://www.google.com");
		}
	}, []);
	useEffect(() => {
		const fetchContent = async () => {
			try {
				const response = await fetch(
					"https://article-ate.vercel.app/api/upload",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ url: currentUrl }),
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setArticleContent(data.content);
				setSessionId(data.sessionId);
				setSuggestedQuestions(data.questions || []);
				setMessages([
					{
						type: "ai",
						content:
							"Hi, you can ask me anything about the article.",
					},
				]);
			} catch (error) {
				console.log("Error fetching URL: ", currentUrl);
				console.error("Error fetching content:", error);
				setError(
					"Unable to process this page. Please try a different page."
				);
			} finally {
				setIsLoading(false);
			}
		};
		if (currentUrl) {
			fetchContent();
		}
	}, [currentUrl]);

	const handleQuestionClick = async (question: string) => {
		setMessages((prev) => [...prev, { type: "user", content: question }]);
		setIsChatLoading(true);
		try {
			await handleQuery(question);
		} finally {
			setIsChatLoading(false);
		}
	};

	const handleQuery = async (message: string) => {
		try {
			console.log("Sending Session ID - ", sessionId);
			const response = await fetch(
				"https://article-ate.vercel.app/api/query",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message, sessionId }),
				}
			);
			const data = await response.json();
			setMessages((prev) => [
				...prev,
				{ type: "ai", content: data.message },
			]);
		} catch (error) {
			console.error("Error querying API:", error);
			setMessages((prev) => [
				...prev,
				{
					type: "system",
					content: "Error processing your request. Please try again.",
				},
			]);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: Message = { type: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsChatLoading(true);
		try {
			await handleQuery(input);
		} finally {
			setIsChatLoading(false);
		}
	};

	if (error) {
		return (
			<div className="w-[400px] h-[600px] flex items-center justify-center">
				<div className="bg-white rounded-lg shadow-lg p-4">
					<p className="text-red-500">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 w-[400px] h-[600px]" ref={containerRef}>
			<div className="bg-white rounded-lg shadow-lg w-full h-full flex flex-col">
				{isLoading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF906D] border-t-transparent mx-auto mb-4"></div>
							<h2 className="text-xl font-semibold text-gray-900">
								Loading content...
							</h2>
						</div>
					</div>
				) : (
					<div className="flex flex-col w-full h-full">
						<div className="flex justify-between items-center p-4 border-b">
							<a href="/" className="flex items-center space-x-2">
								<span className="text-xl font-bold text-[#FF906D]">
									Articlate
								</span>
							</a>
							<div className="flex space-x-4">
								<button
									className={`px-4 py-2 rounded-lg ${
										activeTab === "summary"
											? "bg-[#FF906D] text-white"
											: "text-gray-600"
									}`}
									onClick={() => setActiveTab("summary")}
								>
									Summary
								</button>
								<button
									className={`px-4 py-2 rounded-lg ${
										activeTab === "chat"
											? "bg-[#FF906D] text-white"
											: "text-gray-600"
									}`}
									onClick={() => setActiveTab("chat")}
								>
									Chat
								</button>
							</div>
						</div>
						<div className="flex-1 overflow-auto">
							{activeTab === "summary" ? (
								<SummarySection
									isLoading={isLoading}
									articleContent={articleContent}
									suggestedQuestions={suggestedQuestions}
									onQuestionClick={(question) => {
										handleQuestionClick(question);
										setActiveTab("chat");
									}}
								/>
							) : (
								<ChatSection
									messages={messages}
									isLoading={isChatLoading}
									input={input}
									onInputChange={setInput}
									onSubmit={handleSubmit}
									messagesEndRef={messagesEndRef}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
