import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onQuestionClick }) => {
  if (!questions.length) return null;

  return (
    <div className="mt-8">
      <div className="mb-3">Here are some questions you may be interested in:</div>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="block w-full text-left p-3 rounded-lg text-white bg-[#FF906D] hover:bg-[#ff8055] text-sm transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
