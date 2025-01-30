import React from 'react';
import { SuggestedQuestions } from './SuggestedQuestions';

interface SummarySectionProps {
  isLoading: boolean;
  articleContent: string;
  suggestedQuestions: string[];
  onQuestionClick: (question: string) => void;
  isSmall?: boolean;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  isLoading,
  articleContent,
  suggestedQuestions,
  onQuestionClick,
  isSmall = false,
}) => {
  return (
    <div className="flex-1 p-6 h-full overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      ) : (
        <div>
          {articleContent && (
            <div className="whitespace-pre-wrap text-sm md:text-base">
              {articleContent}
            </div>
          )}
          <SuggestedQuestions 
            questions={suggestedQuestions} 
            onQuestionClick={onQuestionClick} 
          />
        </div>
      )}
    </div>
  );
};
