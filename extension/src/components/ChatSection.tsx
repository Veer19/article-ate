import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Message } from "../App";
import { ChatMessage } from "./ChatMessage";

interface ChatSectionProps {
	messages: Message[];
	isLoading: boolean;
	input: string;
	onInputChange: (value: string) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
	messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
	messages,
	isLoading,
	input,
	onInputChange,
	onSubmit,
	messagesEndRef,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		containerRef.current?.scrollTo({
			top: containerRef.current?.scrollHeight,
			behavior: "smooth",
		});
	}, [messages]);

	return (
		<div className="flex-1 overflow-hidden flex flex-col h-full">
			<div
				className="flex-1 p-6 h-full overflow-y-auto"
				ref={containerRef}
			>
				<div className="space-y-4">
					{messages.map((message, index) => (
						<ChatMessage
							key={index}
							type={message.type}
							content={message.content}
						/>
					))}
					{isLoading && (
						<div className="p-4 rounded-lg bg-gray-100 max-w-[20%] flex items-center space-x-2 justify-center">
							<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
							<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
							<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<form onSubmit={onSubmit} className="p-4 border-t">
				<div className="flex space-x-4">
					<input
						type="text"
						value={input}
						onChange={(e) => onInputChange(e.target.value)}
						placeholder="Ask a question..."
						className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF906D]"
					/>
					<button
						type="submit"
						disabled={!input.trim()}
						className="px-4 py-2 bg-[#FF906D] text-white rounded-lg hover:bg-[#ff8055] disabled:opacity-50"
					>
						<Send className="h-5 w-5" />
					</button>
				</div>
			</form>
		</div>
	);
};
