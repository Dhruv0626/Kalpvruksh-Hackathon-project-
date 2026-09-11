import { useState } from 'react';
import { Send, Sparkles, HelpCircle } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export default function QuestionInput({ onAskQuestion, isSubmitting = false }) {
  const [text, setText] = useState('');

  // Real-time categorization preview
  const getPredictedCategory = (query) => {
    const q = query.toLowerCase();
    if (!q.trim()) return null;
    if (q.includes('due') || q.includes('time') || q.includes('deadline') || q.includes('exam') || q.includes('date') || q.includes('attendance')) {
      return 'administrative';
    }
    if (q.includes('mic') || q.includes('voice') || q.includes('video') || q.includes('screen') || q.includes('lag') || q.includes('sound')) {
      return 'technical';
    }
    if (q.includes('homework') || q.includes('assignment') || q.includes('lab') || q.includes('project')) {
      return 'homework';
    }
    return 'conceptual';
  };

  const predictedCategory = getPredictedCategory(text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    onAskQuestion(text.trim(), predictedCategory);
    setText('');
  };

  const suggestions = [
    'What is inheritance?',
    'Can you explain method overriding?',
    'When is the OOP assignment due?',
    'What is the difference between class and interface?',
  ];

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <HelpCircle size={15} className="text-indigo-500" /> Ask a Question or Doubt
        </label>
        {predictedCategory && (
          <div className="flex items-center gap-1.5 animate-slide-up">
            <span className="text-[10px] text-gray-400">AI Tag:</span>
            <CategoryBadge category={predictedCategory} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your question in natural language (AI will group similar doubts)..."
          className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800/90 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 text-xs md:text-sm focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 active:scale-95 disabled:opacity-50 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
        >
          {isSubmitting ? (
            <Sparkles size={16} className="animate-spin" />
          ) : (
            <>
              <span>Ask Doubt</span>
              <Send size={15} />
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
        <span className="text-[10px] text-gray-400 shrink-0">Quick Ask:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setText(s)}
            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-[11px] text-gray-600 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-white/5 transition-all cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
