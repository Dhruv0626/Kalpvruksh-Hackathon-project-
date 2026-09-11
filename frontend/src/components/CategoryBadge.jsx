export default function CategoryBadge({ category = 'conceptual' }) {
  const cat = (category || 'conceptual').toLowerCase();

  const configs = {
    conceptual: {
      label: 'Conceptual',
      dot: 'bg-purple-500',
      style: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20',
    },
    administrative: {
      label: 'Administrative',
      dot: 'bg-blue-500',
      style: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    },
    technical: {
      label: 'Technical',
      dot: 'bg-cyan-500',
      style: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/20',
    },
    homework: {
      label: 'Homework',
      dot: 'bg-emerald-500',
      style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    },
    other: {
      label: 'General',
      dot: 'bg-gray-400',
      style: 'bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-500/20',
    },
  };

  const config = configs[cat] || configs.other;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${config.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
