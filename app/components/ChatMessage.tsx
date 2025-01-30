import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  type: 'user' | 'ai' | 'system';
  content: string;
  isSmall?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ type, content, isSmall = false }) => {
  if (type === 'user') {
    return (
      <div className={`p-4 rounded-lg bg-[#FF906D] text-white ml-auto max-w-[80%] ${isSmall ? 'text-sm' : ''}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-gray-100 max-w-[80%] prose ${isSmall ? 'prose-sm' : ''}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
