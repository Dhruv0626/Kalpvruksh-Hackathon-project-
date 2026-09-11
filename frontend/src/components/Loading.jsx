import { Sparkles } from 'lucide-react';

export default function Loading({ message = 'Loading EduNova...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 animate-spin blur-sm opacity-60" />
        <div className="relative w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl">
          <Sparkles size={24} className="animate-pulse text-indigo-400" />
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}
