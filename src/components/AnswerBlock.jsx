import React, { memo, useCallback, useMemo } from "react";
import { Type } from "lucide-react";

const AnswerBlock = ({ question, index, setResponses, secId, types }) => {

  const Icon = useMemo(() => {
    return types.find((ele) => ele.type === question.type)?.icon || Type;
  }, [types, question.type]);

  const handleAnswer = useCallback((e) => {
      const value = e.target.value;
      setResponses((prev) =>
        prev.map((section) => {
          if (section.id === secId) {
            return {
              ...section,
              questions: section.questions.map((q) =>
                q.id === question.id ? { ...q, answer: value } : q
              ),
            };
          }
          return section;
        })
      );
    },
    [setResponses, secId, question.id]
  );


  let content;
  switch (question.type) {
    case "short_text":
      content = (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm text-slate-900">{question.text}</p>
          <input
            type="text"
            onChange={handleAnswer}
            placeholder="Write your answer here"
            className="w-full p-2 bg-slate-200 text-black rounded"
          />
        </div>
      );
      break;

    case "numeric_range":
      content = (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm text-slate-900">{question.text}</p>
          <input
            type="number"
            onChange={handleAnswer}
            className="w-full p-2 bg-slate-200 border border-gray-600 rounded"
          />
        </div>
      );
      break;

    case "long_text":
      content = (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm text-slate-900">{question.text}</p>
          <textarea
            onChange={handleAnswer}
            className="w-full p-2 bg-slate-200 border border-gray-600 rounded resize-none"
            rows={3}
            placeholder="Write your answer..."
          />
        </div>
      );
      break;

    case "single_choice":
      content = (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm text-slate-900">{question.text}</p>
          <div className="flex flex-col gap-1">
            {question.options.map((ele, idx) => (
              <label className="flex items-center gap-2 text-slate-900" key={idx}>
                <input
                  type="radio"
                  value={ele}
                  onChange={handleAnswer}
                  name={`question-${question.id}`}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
                {ele}
              </label>
            ))}
          </div>
        </div>
      );
      break;

    default:
      content = (
        <p className="text-sm text-slate-500">
          question type: {question.type}
        </p>
      );
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-xl mb-4">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-300">
        <div className="flex items-center gap-2 text-slate-900">
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-sm">Question {index + 1}</span>
        </div>
      </div>
      {content}
    </div>
  );
};


export default memo(AnswerBlock);
