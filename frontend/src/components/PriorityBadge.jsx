export default function PriorityBadge({ priority = 'medium' }) {
  const p = (priority || 'medium').toLowerCase();

  if (p === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        High Priority
      </span>
    );
  }

  if (p === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Medium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Low
    </span>
  );
}
