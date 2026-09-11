import { ThumbsUp, Clock, User } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

export default function QuestionCard({ question, onUpvote }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-indigo-500/40 transition-all space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge category={question.category} />
          <PriorityBadge priority={question.priority} />
        </div>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <Clock size={11} /> {question.time || 'Just now'}
        </span>
      </div>

      <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
        {question.text}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-[11px]">
          <User size={13} className="text-gray-400" /> {question.studentName || 'Student'}
        </span>

        {onUpvote && (
          <button
            type="button"
            onClick={() => onUpvote(question.id || question._id)}
            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ThumbsUp size={13} />
            <span>Same Doubt ({question.upvotes || 1})</span>
          </button>
        )}
      </div>
    </div>
  );
}
