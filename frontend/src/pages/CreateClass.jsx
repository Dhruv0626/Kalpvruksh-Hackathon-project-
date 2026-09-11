import { useState } from 'react';
import { PlusCircle, Sparkles, ArrowRight, ShieldCheck, BookOpen, Radio, Copy, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function CreateClass({ user, onLogout, onNavigate, onSelectClass }) {
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    topic: '',
    classCode: 'CS' + Math.floor(100 + Math.random() * 900),
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const generateRandomCode = () => {
    const prefixes = ['JAVA', 'CS', 'AI', 'DBMS', 'DSA', 'WEB'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const newCode = `${prefix}${num}`;
    setFormData((prev) => ({ ...prev, classCode: newCode }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formData.classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.createClass({
        className: formData.className,
        subject: formData.subject,
        topic: formData.topic,
        classCode: formData.classCode,
      });

      if (response?.success && response?.class) {
        if (onSelectClass) onSelectClass(response.class);
        onNavigate('teacher_dashboard');
      } else {
        setErrorMessage(response?.message || 'Unable to create classroom session. Please check your connection and try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="create_class" />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <PlusCircle size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
              Create Live Classroom Session
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Set up your live course session and generate an enrollment code for students.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Class / Course Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Java & Object-Oriented Programming"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Subject / Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Class Code</label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Generate New Code
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={formData.classCode}
                    onChange={(e) => setFormData({ ...formData, classCode: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-mono font-bold text-xs sm:text-sm uppercase focus:outline-none focus:border-emerald-500 tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute right-3 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-white text-xs cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current Lecture Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-3">
              <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Real-time AI Grouping:</strong> Questions asked by students during the session will be automatically clustered into representative doubt groups.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio size={16} /> Start Live Session & Open Dashboard
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
