export default function PriorityBadge({ priority = 'medium' }) {
  const p = (priority || 'medium').toLowerCase();

  if (p === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        HIGH PRIORITY
      </span>
    );
  }

  if (p === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        MEDIUM
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      LOW
    </span>
  );
}
