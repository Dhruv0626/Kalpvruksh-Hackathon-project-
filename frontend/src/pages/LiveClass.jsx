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
  Volume2,
  LogIn,
  LogOut,
  DoorOpen,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import VideoPanel from '../components/VideoPanel';
import QuestionInput from '../components/QuestionInput';
import QuestionGroup from '../components/QuestionGroup';
import { api } from '../services/api';

export default function LiveClass({ user, activeClass, onLogout, onNavigate, onExitClass }) {
  const hasActiveClass = Boolean(activeClass && (activeClass._id || activeClass.id) && activeClass.classCode);

  const [liveClassDetails, setLiveClassDetails] = useState(activeClass || null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  const currentClass = liveClassDetails || activeClass || {
    id: '',
    className: 'Live Classroom Session',
    classCode: '',
    subject: 'General',
    topic: 'Live Discussion',
    instructor: 'Faculty Instructor',
    students: [],
    studentsCount: 0,
  };

  // AI Grouped Question Doubts State (Loaded from Database)
  const [questionGroups, setQuestionGroups] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unanswered' | 'answered' | 'conceptual'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Real-time polling from MongoDB
  useEffect(() => {
    let isMounted = true;

    async function loadQuestionsAndStatus() {
      const classId = activeClass?._id || activeClass?.id;
      if (classId) {
        try {
          const resQuestions = await api.getClassQuestions(classId);
          if (isMounted && resQuestions?.groups) {
            setQuestionGroups(resQuestions.groups);
          }

          const resClass = await api.getClassById(classId);
          if (isMounted && resClass?.class) {
            setLiveClassDetails(resClass.class);
            if (resClass.class.status === 'ended') {
              setIsSessionEnded(true);
            }
          }
        } catch (err) {
          console.error('Error fetching questions/status:', err);
        }
      }
    }

    if (hasActiveClass) {
      loadQuestionsAndStatus();
      const interval = setInterval(loadQuestionsAndStatus, 3500);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [activeClass, hasActiveClass]);

  const [showExitModal, setShowExitModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleConfirmExit = async () => {
    setIsLeaving(true);
    const classId = activeClass?._id || activeClass?.id;
    if (classId) {
      try {
        await api.leaveClass(classId);
      } catch (err) {
        console.error('Failed to leave class on server:', err);
      }
    }
    setIsLeaving(false);
    setShowExitModal(false);
    if (onExitClass) onExitClass();
    onNavigate('student_home');
  };

  // Handle student asking question
  const handleAskQuestion = async (questionText, predictedCategory, isAnonymous = false) => {
    setIsSubmitting(true);
    const classId = activeClass?._id || activeClass?.id;

    if (!classId) {
      setToastMessage('Error: No active class session connected.');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const apiResponse = await api.submitQuestion({
        classId,
        text: questionText,
        category: predictedCategory,
        isAnonymous,
      });

      if (apiResponse?.group) {
        setToastMessage(apiResponse.message || 'Question grouped and submitted');
      } else {
        setToastMessage('Question submitted successfully');
      }

      // Immediate refresh from MongoDB
      const res = await api.getClassQuestions(classId);
      if (res?.groups) {
        setQuestionGroups(res.groups);
      }
    } catch (err) {
      setToastMessage(`Error submitting question: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleUpvoteGroup = async (groupId) => {
    try {
      await api.upvoteQuestion(groupId);
      const classId = activeClass?._id || activeClass?.id;
      if (classId) {
        const res = await api.getClassQuestions(classId);
        if (res?.groups) {
          setQuestionGroups(res.groups);
        }
      }
      setToastMessage('Vote recorded for this question group');
    } catch (err) {
      setToastMessage('Vote recorded for this question group');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredGroups = questionGroups.filter((g) => {
    if (activeFilter === 'unanswered') return g.status !== 'answered';
    if (activeFilter === 'answered') return g.status === 'answered';
    if (activeFilter === 'conceptual') return g.category === 'conceptual';
    return true;
  });

  const enrolledStudentsCount = currentClass.students?.length || 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeClass={hasActiveClass ? currentClass : null}
        currentPage="live_class"
      />

      {/* Real-time AI Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-slide-up max-w-md">
          <Sparkles size={18} className="shrink-0 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal / Banner when Instructor Ends Session */}
      {isSessionEnded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-5 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-500/20 shadow-lg shadow-rose-500/10">
              <LogOut size={30} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                Live Classroom Session Ended
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                The instructor has ended this lecture. The live doubts, AI analytics, and teacher answers have been archived to your session summary report.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onExitClass) onExitClass();
                  onNavigate('class_summary');
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText size={16} /> View Summary Report
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onExitClass) onExitClass();
                  onNavigate('student_home');
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col justify-center">
        {!hasActiveClass ? (
          <div className="py-16 px-6 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <Radio size={36} className="opacity-75" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                No Live Classrooms
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                You haven't joined an active classroom session yet. Enter an instructor's class code or choose an ongoing lecture from your dashboard.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('join_class')}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn size={16} /> Join a Classroom
              </button>
              <button
                type="button"
                onClick={() => onNavigate('student_home')}
                className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Top Bar with Exit Button */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold animate-pulse">
                  <Radio size={13} /> LIVE LECTURE
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{currentClass.className}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Topic: {currentClass.topic} • Instructor: {currentClass.instructor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <Users size={14} className="text-indigo-500" />
                  <span>{enrolledStudentsCount} Student{enrolledStudentsCount !== 1 ? 's' : ''} Connected</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExitModal(true)}
                  className="px-4 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <DoorOpen size={14} />
                  <span>Exit Session</span>
                </button>
              </div>
            </div>

            {/* Attractive Exit Session Confirmation Modal */}
            {showExitModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                <div className="max-w-md w-full p-7 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-6 animate-slide-up">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-500/20 shadow-lg shadow-rose-500/10">
                    <DoorOpen size={30} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                      Leave Live Classroom?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      You will exit the ongoing lecture stream for <strong>{currentClass.className}</strong>. You can re-enter anytime using code <span className="font-mono font-bold text-indigo-500">{currentClass.classCode}</span> while the lecture is live.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowExitModal(false)}
                      disabled={isLeaving}
                      className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      Stay in Class
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmExit}
                      disabled={isLeaving}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLeaving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Leaving...</span>
                        </>
                      ) : (
                        <>
                          <DoorOpen size={16} />
                          <span>Yes, Exit Room</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Grid: Left Video Stream (7 cols) & Right AI Question Organizer (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT 7 COLS: Video Player + Ask Question Box */}
              <div className="lg:col-span-7 space-y-5">
                <VideoPanel
                  className={currentClass.className}
                  topic={currentClass.topic}
                  instructor={currentClass.instructor}
                  studentCount={enrolledStudentsCount}
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
                    Conceptual
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
        )}
      </main>
    </div>
  );
}
