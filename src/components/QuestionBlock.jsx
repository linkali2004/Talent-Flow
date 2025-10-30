import React, { memo, useMemo } from "react";
import {Trash2,Type,CornerDownRight,} from "lucide-react";
const QuestionBlock = ({question,secId,index,onTypeChange,onDeleteHandle,updateQuestionText,updateQuestionOptions,updateNumericalValue,types}) => {
  const Icon = useMemo(() => {
    return types.find((t) => t.type === question.type)?.icon || Type;
  }, [question.type, types]);

  return (
    <div className="p-4 rounded-lg shadow-xl border border-gray-600 mb-4">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-600">
        <div className="flex items-center gap-2 text-slate-900">
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-sm">Question {index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => onTypeChange(question.id, e.target.value)}
            value={question.type}
            className="bg-gray-800 text-sm text-gray-200 p-1.5 rounded border border-gray-600 focus:ring-sky-400 focus:border-sky-400"
          >
            {types.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            className="text-red-500 hover:text-red-400 p-1 rounded transition"
            onClick={() => onDeleteHandle(question.id)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <textarea
        placeholder="Enter your question text here..."
        rows="2"
        value={question.text}
        onChange={(e) =>
          updateQuestionText(question.id, secId, e.target.value)
        }
        className="w-full p-2 bg-slate-100 rounded-lg text-slate-700 focus:outline-none"
      />

      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
        {question.type === "single_choice" && (
          <div className="space-y-2 text-gray-300">
            <p className="text-sm font-medium text-slate-700">Options:</p>
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    updateQuestionOptions(question.id, secId, i, e.target.value)
                  }
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="w-full p-1 bg-slate-200 text-slate-700 border-gray-500 rounded text-sm focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {question.type === "numeric_range" && (
          <div className="flex gap-4 text-gray-300">
            <input
              type="number"
              value={question.numerical}
              onChange={(e) =>
                updateNumericalValue(question.id, secId, e.target.value)
              }
              placeholder="Value"
              className="w-1/2 p-1 bg-slate-200 text-slate-900 border-gray-500 rounded text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(QuestionBlock);
