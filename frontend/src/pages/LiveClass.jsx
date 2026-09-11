import { useState, useEffect } from 'react';
import {
  Radio,
  Users,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Send,
  Volume2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import VideoPanel from '../components/VideoPanel';
import QuestionInput from '../components/QuestionInput';
import QuestionGroup from '../components/QuestionGroup';

export default function LiveClass({ user, activeClass, onLogout, onNavigate }) {
  const currentClass = activeClass || {
    id: 'cls_java101',
    className: 'Java & Object-Oriented Programming',
    classCode: 'JAVA101',
    subject: 'Computer Science',
    topic: 'Inheritance & Polymorphism in Java',
    instructor: 'Dr. Priya Mehta',
    studentsCount: 48,
  };

  // AI Grouped Question Doubts State
  const [questionGroups, setQuestionGroups] = useState([
    {
      id: 'grp_1',
      mainQuestion: 'What is inheritance and how does the extends keyword work?',
      category: 'conceptual',
      priority: 'high',
      studentCount: 14,
      classWide: true,
      status: 'answered',
      answer: {
        text: 'Inheritance allows a child class to inherit fields and methods from a parent class using the "extends" keyword. It enables code reuse and polymorphism.',
        teacher: 'Dr. Priya Mehta',
        time: '5 mins ago',
      },
      questions: [
        { text: 'What is inheritance?', studentName: 'Aarav' },
        { text: 'Can you explain inheritance?', studentName: 'Rohan' },
        { text: 'I do not understand inheritance.', studentName: 'Sneha' },
        { text: 'How to use extends keyword in child class?', studentName: 'Kavya' },
      ],
    },
    {
      id: 'grp_2',
      mainQuestion: 'Difference between Method Overloading vs Method Overriding?',
      category: 'conceptual',
      priority: 'high',
      studentCount: 9,
      classWide: false,
      status: 'unanswered',
      answer: null,
      questions: [
        { text: 'Is overloading same as overriding?', studentName: 'Dev' },
        { text: 'Difference between static and dynamic polymorphism?', studentName: 'Meera' },
      ],
    },
    {
      id: 'grp_3',
      mainQuestion: 'When is the Java assignment submission due date?',
      category: 'administrative',
      priority: 'low',
      studentCount: 4,
      classWide: false,
      status: 'answered',
      answer: {
        text: 'Assignment 2 is due this Friday by 11:59 PM in the student portal.',
        teacher: 'Dr. Priya Mehta',
        time: '12 mins ago',
      },
      questions: [
        { text: 'When is homework due?', studentName: 'Amit' },
        { text: 'Submission date for assignment 2?', studentName: 'Pooja' },
      ],
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unanswered' | 'answered' | 'conceptual'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle student asking question
  const handleAskQuestion = (questionText, predictedCategory) => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // AI Grouping check: check if matches inheritance or polymorphism
      const lower = questionText.toLowerCase();
      let matchedGroup = null;

      if (lower.includes('inheritance') || lower.includes('extend')) {
        matchedGroup = 'grp_1';
      } else if (lower.includes('overload') || lower.includes('override') || lower.includes('polymorph')) {
        matchedGroup = 'grp_2';
      } else if (lower.includes('due') || lower.includes('date') || lower.includes('assignment')) {
        matchedGroup = 'grp_3';
      }

      if (matchedGroup) {
        // Merge into existing group
        setQuestionGroups((prev) =>
          prev.map((grp) => {
            if (grp.id === matchedGroup) {
              const newCount = (grp.studentCount || 1) + 1;
              return {
                ...grp,
                studentCount: newCount,
                classWide: newCount >= 3,
                priority: newCount >= 10 ? 'high' : grp.priority,
                questions: [
                  ...grp.questions,
                  { text: questionText, studentName: user?.name || 'You' },
                ],
              };
            }
            return grp;
          })
        );
        setToastMessage(`✨ AI automatically grouped your question under: "${matchedGroup === 'grp_1' ? 'Inheritance' : matchedGroup === 'grp_2' ? 'Method Overloading vs Overriding' : 'Assignment Due Date'}"`);
      } else {
        // Create new grouped doubt
        const newGrp = {
          id: 'grp_' + Date.now(),
          mainQuestion: questionText,
          category: predictedCategory || 'conceptual',
          priority: 'medium',
          studentCount: 1,
          classWide: false,
          status: 'unanswered',
          answer: null,
          questions: [{ text: questionText, studentName: user?.name || 'You' }],
        };
        setQuestionGroups((prev) => [newGrp, ...prev]);
        setToastMessage('✨ Your question was submitted and prioritized by AI for the instructor.');
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 500);
  };

  const handleUpvoteGroup = (groupId) => {
    setQuestionGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          const newCount = (grp.studentCount || 1) + 1;
          return {
            ...grp,
            studentCount: newCount,
            classWide: newCount >= 3,
            priority: newCount >= 10 ? 'high' : grp.priority,
          };
        }
        return grp;
      })
    );
    setToastMessage('👍 Added your vote to this question group!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredGroups = questionGroups.filter((g) => {
    if (activeFilter === 'unanswered') return g.status !== 'answered';
    if (activeFilter === 'answered') return g.status === 'answered';
    if (activeFilter === 'conceptual') return g.category === 'conceptual';
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeClass={currentClass}
        currentPage="live_class"
      />

      {/* Real-time AI Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-slide-up max-w-md">
          <Sparkles size={18} className="shrink-0 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Main Grid: Left Video Stream (2 cols) & Right AI Question Organizer (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: Video Player + Ask Question Box */}
          <div className="lg:col-span-7 space-y-5">
            <VideoPanel
              className={currentClass.className}
              topic={currentClass.topic}
              instructor={currentClass.instructor}
              studentCount={currentClass.studentsCount}
            />

            <QuestionInput onAskQuestion={handleAskQuestion} isSubmitting={isSubmitting} />
          </div>

          {/* RIGHT 5 COLS: Live AI Question Groups Feed */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            {/* Header & Filter Pills */}
            <div className="flex flex-col gap-3 pb-2 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-indigo-500" /> AI Grouped Doubts
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Questions with similar meanings are automatically unified.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  {questionGroups.length} Groups
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white'
                  }`}
                >
                  All ({questionGroups.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('unanswered')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeFilter === 'unanswered'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white'
                  }`}
                >
                  Unanswered
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('answered')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeFilter === 'answered'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white'
                  }`}
                >
                  Resolved
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('conceptual')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeFilter === 'conceptual'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white'
                  }`}
                >
                  🧠 Conceptual
                </button>
              </div>
            </div>

            {/* Questions Feed */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {filteredGroups.map((group) => (
                <QuestionGroup
                  key={group.id}
                  group={group}
                  isTeacher={false}
                  onUpvoteGroup={handleUpvoteGroup}
                />
              ))}

              {filteredGroups.length === 0 && (
                <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-white/10 text-gray-400 text-xs">
                  No questions in this filter category yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
