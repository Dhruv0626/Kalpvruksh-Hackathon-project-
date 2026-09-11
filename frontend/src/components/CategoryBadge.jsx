export default function CategoryBadge({ category = 'conceptual' }) {
  const cat = (category || 'conceptual').toLowerCase();

  const configs = {
    conceptual: {
      label: '🧠 CONCEPTUAL',
      style: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    },
    administrative: {
      label: '📅 ADMINISTRATIVE',
      style: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    technical: {
      label: '🔧 TECHNICAL',
      style: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    },
    homework: {
      label: '📚 HOMEWORK',
      style: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    other: {
      label: '💬 GENERAL',
      style: 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30',
    },
  };

  const config = configs[cat] || configs.other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.style}`}
    >
      {config.label}
    </span>
  );
}
