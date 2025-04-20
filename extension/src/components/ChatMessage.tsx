import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
	type: "user" | "ai" | "system";
	content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ type, content }) => {
	if (type === "user") {
		return (
			<div
				className={`p-4 rounded-lg bg-[#FF906D] text-white ml-auto max-w-[80%]`}
			>
				{content}
			</div>
		);
	}

	return (
		<div className={`p-4 rounded-lg bg-gray-100 max-w-[80%] prose`}>
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
};
