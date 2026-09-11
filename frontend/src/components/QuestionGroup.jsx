import { useState } from 'react';
import {
  Users,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Bot
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

export default function QuestionGroup({
  group,
  isTeacher = false,
  onOpenAnswer,
  onUpvoteGroup,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClassWide = group.classWide || (group.studentCount >= 3);
  const isAnswered = group.status === 'answered' || Boolean(group.answer);

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-5 space-y-3.5 ${
        isClassWide
          ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 shadow-lg shadow-rose-500/5'
          : isAnswered
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
          : 'bg-white dark:bg-gray-900/90 border-gray-200 dark:border-white/10 shadow-md'
      }`}
    >
      {/* Top Warning Banner for Class-Wide Doubts */}
      {isClassWide && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
          <AlertTriangle size={15} />
          <span>🚨 CLASS-WIDE DOUBT DETECTED ({group.studentCount} students affected)</span>
        </div>
      )}

      {/* Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge category={group.category} />
          <PriorityBadge priority={group.priority} />
          {isAnswered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={12} /> ANSWERED
            </span>
          )}
        </div>

        {/* Student Count Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold">
          <Users size={14} />
          <span>{group.studentCount || 1} Students</span>
        </div>
      </div>

      {/* Main Representative Question */}
      <div>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
          AI Representative Question:
        </span>
        <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-snug">
          {group.mainQuestion}
        </h3>
      </div>

      {/* Expandable Grouped Variations */}
      {group.questions && group.questions.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer py-1"
          >
            <span>{isExpanded ? 'Hide' : 'View'} {group.questions.length} student question variations</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isExpanded && (
            <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-indigo-300 dark:border-indigo-500/40 animate-slide-up">
              {group.questions.map((q, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800/60 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white mr-1.5">"{q.text || q}"</span>
                  <span className="text-[10px] text-gray-400">— {q.studentName || 'Student'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teacher Answer Box Display */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 space-y-1.5 animate-slide-up">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={15} /> Instructor Answer Broadcast:
          </div>
          <p className="text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
            {group.answer?.text || group.answer || 'Answer provided by instructor in live session.'}
          </p>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        {!isTeacher && onUpvoteGroup && (
          <button
            type="button"
            onClick={() => onUpvoteGroup(group.id || group._id)}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ThumbsUp size={14} />
            <span>I Have This Doubt Too ({group.studentCount || 1})</span>
          </button>
        )}

        {isTeacher && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => onOpenAnswer(group)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isAnswered
                  ? 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-800 dark:text-white'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-emerald-500/20 hover:brightness-110'
              }`}
            >
              <MessageSquare size={14} />
              <span>{isAnswered ? 'Update Answer' : 'Answer This Group'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
