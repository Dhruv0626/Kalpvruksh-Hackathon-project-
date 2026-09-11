import { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, Users, Bot } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import PriorityBadge from './PriorityBadge';

export default function AnswerBox({ group, onClose, onSubmitAnswer }) {
  const [answerText, setAnswerText] = useState(group.answer?.text || group.answer || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!group) return null;

  const handleAiSuggest = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      let suggestion = `Inheritance allows a child class to inherit fields and methods from a parent class, promoting code reusability. In Java, this is accomplished using the 'extends' keyword. Runtime polymorphism enables dynamic method overriding.`;
      if (group.mainQuestion.toLowerCase().includes('polymorphism')) {
        suggestion = `Polymorphism means 'many forms'. In Java OOP, it occurs via compile-time overloading (same method name, distinct signatures) and runtime overriding (subclass redefines inherited parent method).`;
      }
      setAnswerText(suggestion);
      setIsGeneratingAi(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onSubmitAnswer(group.id || group._id, answerText.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-slide-up">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl p-6 md:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <CategoryBadge category={group.category} />
              <PriorityBadge priority={group.priority} />
              <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                <Users size={12} /> {group.studentCount || 1} Students
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
              {group.mainQuestion}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Instructor Explanation / Answer:
            </label>
            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={isGeneratingAi}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} className={isGeneratingAi ? 'animate-spin' : ''} />
              <span>{isGeneratingAi ? 'Generating...' : 'Suggest AI Draft'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            required
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type comprehensive explanation for all students asking this doubt..."
            className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs md:text-sm focus:outline-none focus:border-emerald-500 leading-relaxed transition-all"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400">
              Broadcasting to <strong>{group.studentCount || 1} related students</strong> instantly.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Send size={15} /> Broadcast Answer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
