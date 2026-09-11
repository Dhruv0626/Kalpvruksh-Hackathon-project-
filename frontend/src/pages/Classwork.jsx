import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Trash2,
  Send,
  Award,
  Layers,
  Search,
  Filter,
  Eye,
  FileCode,
  Video,
  Presentation,
  Bookmark,
  CheckCheck,
  ChevronRight,
  X,
  UserCheck,
  RefreshCw,
  Tag
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function Classwork({ user, activeClass, onLogout, onNavigate }) {
  const isTeacher = user?.role === 'teacher';

  // Active Main Tab: 'assignments' | 'materials'
  const [activeTab, setActiveTab] = useState('assignments');

  // State: Assignments
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // all | pending | submitted | graded
  const [assignmentSearch, setAssignmentSearch] = useState('');

  // State: Materials
  const [materials, setMaterials] = useState([]);
  const [groupedTopics, setGroupedTopics] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [materialSearch, setMaterialSearch] = useState('');

  // Modals & Drawers
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false);
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Student Submit Modal
  const [submitModalAssignment, setSubmitModalAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);

  // Teacher Grading State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);

  // View Student Feedback Modal
  const [viewFeedbackModal, setViewFeedbackModal] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form States
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    topic: 'Module 1: Core Fundamentals',
    subject: activeClass?.subject || 'Computer Science',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    points: 100,
    attachmentUrl: '',
  });

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    topic: 'Module 1: Core Fundamentals',
    subject: activeClass?.subject || 'Computer Science',
    type: 'notes',
    fileUrl: '',
    fileSize: 'PDF Document',
  });

  // Load Assignments
  const fetchAssignments = async () => {
    setIsLoadingAssignments(true);
    try {
      const res = await api.getAssignments();
      if (res?.success) {
        setAssignments(res.assignments || []);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
      showToast('Could not load assignments', 'error');
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  // Load Materials
  const fetchMaterials = async () => {
    setIsLoadingMaterials(true);
    try {
      const res = await api.getMaterials();
      if (res?.success) {
        setMaterials(res.materials || []);
        setGroupedTopics(res.groupedTopics || []);
      }
    } catch (err) {
      console.error('Failed to load study materials:', err);
      showToast('Could not load materials', 'error');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchMaterials();
  }, []);

  // Handle Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const attachments = newAssignment.attachmentUrl
        ? [{ title: 'Reference Material', url: newAssignment.attachmentUrl, type: 'link' }]
        : [];

      const payload = {
        title: newAssignment.title,
        description: newAssignment.description,
        topic: newAssignment.topic,
        subject: newAssignment.subject,
        dueDate: newAssignment.dueDate,
        points: Number(newAssignment.points),
        classId: activeClass?._id || null,
        attachments,
      };

      const res = await api.createAssignment(payload);
      if (res?.success) {
        showToast('Assignment published successfully!');
        setShowCreateAssignmentModal(false);
        setNewAssignment({
          title: '',
          description: '',
          topic: 'Module 1: Core Fundamentals',
          subject: activeClass?.subject || 'Computer Science',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          points: 100,
          attachmentUrl: '',
        });
        fetchAssignments();
      } else {
        showToast(res?.message || 'Failed to create assignment', 'error');
      }
    } catch (err) {
      showToast('Error creating assignment', 'error');
    }
  };

  // Handle Create Material
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newMaterial.title,
        description: newMaterial.description,
        topic: newMaterial.topic,
        subject: newMaterial.subject,
        type: newMaterial.type,
        fileUrl: newMaterial.fileUrl,
        fileSize: newMaterial.fileSize || 'Reference Resource',
        classId: activeClass?._id || null,
      };

      const res = await api.createMaterial(payload);
      if (res?.success) {
        showToast('Study resource added to classwork!');
        setShowCreateMaterialModal(false);
        setNewMaterial({
          title: '',
          description: '',
          topic: 'Module 1: Core Fundamentals',
          subject: activeClass?.subject || 'Computer Science',
          type: 'notes',
          fileUrl: '',
          fileSize: 'PDF Document',
        });
        fetchMaterials();
      } else {
        showToast(res?.message || 'Failed to publish material', 'error');
      }
    } catch (err) {
      showToast('Error publishing material', 'error');
    }
  };

  // Handle Delete Assignment
  const handleDeleteAssignment = async (id) => {
    try {
      const res = await api.deleteAssignment(id);
      if (res?.success) {
        showToast('Assignment deleted.');
        fetchAssignments();
        if (selectedAssignmentForSubmissions?._id === id) {
          setSelectedAssignmentForSubmissions(null);
        }
      }
    } catch (err) {
      showToast('Failed to delete assignment', 'error');
    }
  };

  // Handle Delete Material
  const handleDeleteMaterial = async (id) => {
    try {
      const res = await api.deleteMaterial(id);
      if (res?.success) {
        showToast('Study resource removed.');
        fetchMaterials();
      }
    } catch (err) {
      showToast('Failed to remove resource', 'error');
    }
  };

  // Handle Student Submit
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!submitModalAssignment) return;
    setIsSubmittingWork(true);
    try {
      const res = await api.submitAssignment(submitModalAssignment._id, {
        content: submissionContent,
        attachmentUrl: submissionLink,
      });

      if (res?.success) {
        showToast(res.message || 'Assignment submitted!');
        setSubmitModalAssignment(null);
        setSubmissionContent('');
        setSubmissionLink('');
        fetchAssignments();
      } else {
        showToast(res?.message || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast('Error submitting assignment', 'error');
    } finally {
      setIsSubmittingWork(false);
    }
  };

  // View Submissions for Teacher
  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignmentForSubmissions(assignment);
    setIsLoadingSubmissions(true);
    try {
      const res = await api.getAssignmentById(assignment._id);
      if (res?.success) {
        setSubmissionsList(res.submissions || []);
      }
    } catch (err) {
      showToast('Failed to load submissions', 'error');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Trigger AI Auto Evaluation
  const handleAIEvaluate = async (submissionId) => {
    setIsEvaluatingAI(true);
    try {
      const res = await api.aiEvaluateSubmission(submissionId);
      if (res?.success && res.aiEvaluation) {
        showToast('AI analysis completed!');
        // Update local submission in list
        setSubmissionsList((prev) =>
          prev.map((s) => (s._id === submissionId ? { ...s, aiEvaluation: res.aiEvaluation } : s))
        );
        if (gradingSubmission?._id === submissionId) {
          setGradingSubmission((prev) => ({ ...prev, aiEvaluation: res.aiEvaluation }));
          if (res.aiEvaluation.suggestedScore !== undefined) {
            setGradeInput(String(res.aiEvaluation.suggestedScore));
          }
        }
      }
    } catch (err) {
      showToast('AI Evaluation failed', 'error');
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  // Save Teacher Grade
  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    setIsSavingGrade(true);
    try {
      const res = await api.gradeSubmission(gradingSubmission._id, {
        grade: Number(gradeInput),
        feedback: feedbackInput,
      });

      if (res?.success) {
        showToast('Grade and feedback saved!');
        setSubmissionsList((prev) =>
          prev.map((s) => (s._id === gradingSubmission._id ? res.submission : s))
        );
        setGradingSubmission(null);
        fetchAssignments();
      } else {
        showToast(res?.message || 'Failed to save grade', 'error');
      }
    } catch (err) {
      showToast('Error saving grade', 'error');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Helper type icons for materials
  const getMaterialIcon = (type) => {
    switch (type) {
      case 'slides':
        return <Presentation className="text-amber-500" size={20} />;
      case 'code':
        return <FileCode className="text-emerald-500" size={20} />;
      case 'video':
        return <Video className="text-rose-500" size={20} />;
      case 'syllabus':
        return <Bookmark className="text-purple-500" size={20} />;
      default:
        return <FileText className="text-indigo-500" size={20} />;
    }
  };

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      a.topic.toLowerCase().includes(assignmentSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (assignmentFilter === 'all') return true;
    if (assignmentFilter === 'submitted') return a.isSubmitted;
    if (assignmentFilter === 'pending') return !a.isSubmitted;
    if (assignmentFilter === 'graded') return a.myStatus === 'graded';
    return true;
  });

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.topic.toLowerCase().includes(materialSearch.toLowerCase());

    const matchesTopic = selectedTopic === 'All' || m.topic === selectedTopic;
    const matchesType = selectedType === 'All' || m.type === selectedType;

    return matchesSearch && matchesTopic && matchesType;
  });

  // Distinct topics list for filters
  const allTopicsList = ['All', ...new Set(materials.map((m) => m.topic).filter(Boolean))];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} activeClass={activeClass} onLogout={onLogout} onNavigate={onNavigate} currentPage="classwork" />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-lg flex items-center gap-3 text-sm font-semibold border animate-fade-in ${
            toast.type === 'error'
              ? 'bg-rose-500/90 text-white border-rose-400'
              : 'bg-emerald-600/90 text-white border-emerald-400'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <BookOpen size={13} /> Google Classroom Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Classwork, Assignments & Learning Vault
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              {isTeacher
                ? 'Create assignments, evaluate student submissions with AI assistance, and organize chapter notes & slides.'
                : 'Turn in homework tasks, view constructive AI feedback, and access course notes and lecture materials.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isTeacher ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> New Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateMaterialModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add Study Notes
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-xs text-white">
                <Award size={16} className="text-amber-300" />
                <span>Enrolled as Student</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 bg-gray-200/70 dark:bg-gray-800/80 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText size={16} /> Assignments & Tasks
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-500 font-extrabold">
                {assignments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Layers size={16} /> Study Materials & Vault
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-500 font-extrabold">
                {materials.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RefreshCw
              size={14}
              className="cursor-pointer hover:rotate-180 transition-transform duration-500"
              onClick={() => {
                fetchAssignments();
                fetchMaterials();
              }}
            />
            <span>Auto-synced with MongoDB</span>
          </div>
        </div>

        {/* TAB 1: ASSIGNMENTS & HOMEWORK */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search assignments by topic or title..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {!isTeacher && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['all', 'pending', 'submitted', 'graded'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setAssignmentFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        assignmentFilter === filter
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments List */}
            {isLoadingAssignments ? (
              <div className="p-16 text-center rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400">Loading assignments...</p>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-white/10 space-y-3">
                <FileText size={40} className="mx-auto text-gray-400 opacity-60" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No Assignments Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {isTeacher
                    ? 'You have not created any assignments yet. Click "+ New Assignment" above to assign coursework.'
                    : 'There are no active homework assignments for your enrolled classes at this time.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAssignments.map((assignment) => {
                  const isDuePast = new Date() > new Date(assignment.dueDate);
                  return (
                    <div
                      key={assignment._id}
                      className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                            {assignment.topic || 'General Topic'}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                            <Clock size={12} />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white font-['Outfit']">
                            {assignment.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mt-1 leading-relaxed">
                            {assignment.description}
                          </p>
                        </div>

                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {assignment.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                <ExternalLink size={12} /> {att.title || 'Attachment Link'}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            Max: {assignment.points} Pts
                          </span>
                          {isTeacher && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
                              {assignment.totalSubmissions} Submissions
                            </span>
                          )}
                        </div>

                        {/* Actions according to role */}
                        {isTeacher ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewSubmissions(assignment)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <UserCheck size={14} /> Review & Grade ({assignment.totalSubmissions})
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(assignment._id)}
                              title="Delete Assignment"
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {assignment.isSubmitted ? (
                              assignment.myGrade !== null ? (
                                <button
                                  type="button"
                                  onClick={() => setViewFeedbackModal(assignment.mySubmission)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <CheckCheck size={14} /> Score: {assignment.myGrade}/{assignment.points} (View Feedback)
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSubmitModalAssignment(assignment);
                                    setSubmissionContent(assignment.mySubmission?.content || '');
                                    setSubmissionLink(assignment.mySubmission?.attachmentUrl || '');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <CheckCircle2 size={14} /> Turned In (Resubmit)
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSubmitModalAssignment(assignment);
                                  setSubmissionContent('');
                                  setSubmissionLink('');
                                }}
                                className={`px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isDuePast ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
                                }`}
                              >
                                <Send size={14} /> {isDuePast ? 'Turn In (Late)' : 'Turn In Work'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STUDY MATERIALS & CLASSWORK VAULT */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search notes, slides, code snippets..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Type Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'notes', 'slides', 'syllabus', 'code', 'video'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      selectedType === type
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Filter Chips */}
            {allTopicsList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                  <Tag size={13} /> Topic:
                </span>
                {allTopicsList.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedTopic === topic
                        ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            {/* Materials Display */}
            {isLoadingMaterials ? (
              <div className="p-16 text-center rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 space-y-3">
                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400">Loading learning materials from MongoDB...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-white/10 space-y-3">
                <Layers size={40} className="mx-auto text-gray-400 opacity-60" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No Study Materials Yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {isTeacher
                    ? 'Upload lecture slides, notes, reference PDFs, and cheat sheets for your students.'
                    : 'Your instructors have not published any study resources in this category yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredMaterials.map((mat) => (
                  <div
                    key={mat._id}
                    className="p-5 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getMaterialIcon(mat.type)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                          {mat.type}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                          {mat.topic}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug group-hover:text-purple-500 transition-colors">
                          {mat.title}
                        </h3>
                        {mat.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {mat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">{mat.fileSize || 'Online Document'}</span>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-500/20"
                        >
                          <ExternalLink size={13} /> Open
                        </a>

                        {isTeacher && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMaterial(mat._id)}
                            title="Delete Material"
                            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: CREATE ASSIGNMENT (TEACHER) */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">
                  Create New Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAssignmentModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 4: Binary Search Tree Implementation"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Topic / Module *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 3: Trees & Graphs"
                  value={newAssignment.topic}
                  onChange={(e) => setNewAssignment({ ...newAssignment, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Instructions & Requirements *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Explain problem requirements, constraints, submission expectations, and grading rubric..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Attachment Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or GitHub link"
                  value={newAssignment.attachmentUrl}
                  onChange={(e) => setNewAssignment({ ...newAssignment, attachmentUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE STUDY MATERIAL (TEACHER) */}
      {showCreateMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">
                  Add Study Resource
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateMaterialModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3: Dynamic Programming Cheat Sheet"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="notes">Lecture Notes (PDF)</option>
                    <option value="slides">Presentation Slides</option>
                    <option value="syllabus">Syllabus & Guide</option>
                    <option value="code">Source Code / Repo</option>
                    <option value="video">Recorded Video Lecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Topic / Chapter *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Module 2: Recursion"
                    value={newMaterial.topic}
                    onChange={(e) => setNewMaterial({ ...newMaterial, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Resource File Link / URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... (Google Drive, Dropbox, YouTube, GitHub)"
                  value={newMaterial.fileUrl}
                  onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description / Study Tips
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide context or instructions for students reviewing these notes..."
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateMaterialModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT SUBMIT HOMEWORK */}
      {submitModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                  {submitModalAssignment.topic}
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">
                  Turn In: {submitModalAssignment.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSubmitModalAssignment(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Assignment Prompt</span>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {submitModalAssignment.description}
              </p>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Your Answer / Code / Solution *
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Type your explanation, algorithm analysis, solution code, or summary here..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Project Link or Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/... or Google Drive link"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-xs">
                <Sparkles size={16} />
                <span>EduNova AI will immediately analyze your solution upon submission.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSubmitModalAssignment(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWork}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingWork ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: TEACHER REVIEW & GRADE SUBMISSIONS */}
      {selectedAssignmentForSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                  Reviewing Submissions ({submissionsList.length})
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">
                  {selectedAssignmentForSubmissions.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignmentForSubmissions(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {isLoadingSubmissions ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-400">Loading student submissions...</p>
              </div>
            ) : submissionsList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-300 dark:border-white/10 space-y-2">
                <UserCheck size={36} className="mx-auto text-gray-400" />
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">No Student Submissions Yet</h4>
                <p className="text-xs text-gray-400">Students enrolled in this class have not turned in their work yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissionsList.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
                          {sub.studentName ? sub.studentName[0].toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sub.studentName}</h4>
                          <span className="text-[11px] text-gray-400">
                            Submitted: {new Date(sub.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status === 'graded' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/30">
                            Graded: {sub.grade}/{selectedAssignmentForSubmissions.points} Pts
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/30">
                            Pending Grade
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeInput(sub.grade !== null ? String(sub.grade) : sub.aiEvaluation?.suggestedScore ? String(sub.aiEvaluation.suggestedScore) : '');
                            setFeedbackInput(sub.feedback || sub.aiEvaluation?.summary || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Award size={13} /> {sub.status === 'graded' ? 'Edit Grade' : 'Grade Work'}
                        </button>
                      </div>
                    </div>

                    {/* Student Solution Text */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                      {sub.content}
                    </div>

                    {sub.attachmentUrl && (
                      <a
                        href={sub.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:underline"
                      >
                        <ExternalLink size={13} /> Attached Link: {sub.attachmentUrl}
                      </a>
                    )}

                    {/* AI Evaluation Box */}
                    {sub.aiEvaluation && (
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                            <Sparkles size={14} /> AI Suggested Score:{' '}
                            <span className="text-purple-700 dark:text-purple-300 font-mono">
                              {sub.aiEvaluation.suggestedScore} / {selectedAssignmentForSubmissions.points}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAIEvaluate(sub._id)}
                            disabled={isEvaluatingAI}
                            className="text-[11px] font-semibold text-purple-500 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw size={11} className={isEvaluatingAI ? 'animate-spin' : ''} /> Re-evaluate AI
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{sub.aiEvaluation.summary}</p>
                        {sub.aiEvaluation.strengths && sub.aiEvaluation.strengths.length > 0 && (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 space-y-0.5">
                            <span className="font-bold">Key Strengths:</span>
                            <ul className="list-disc pl-4">
                              {sub.aiEvaluation.strengths.map((st, i) => (
                                <li key={i}>{st}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: TEACHER GRADE FORM */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white">
                Grade: {gradingSubmission.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Grade Score (Out of {selectedAssignmentForSubmissions?.points || 100}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedAssignmentForSubmissions?.points || 100}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Teacher Feedback / Remarks
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide constructive feedback, praise, and areas for improvement..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGrade}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSavingGrade ? <RefreshCw size={14} className="animate-spin" /> : <Award size={14} />}
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT VIEW FEEDBACK */}
      {viewFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-emerald-500" />
                <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">
                  Graded Evaluation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewFeedbackModal(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Your Score
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {viewFeedbackModal.grade} <span className="text-sm font-normal text-gray-500">Pts</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Teacher Remarks:</label>
              <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-xl border border-gray-200 dark:border-white/5 leading-relaxed">
                {viewFeedbackModal.feedback || 'Great job on completing this assignment.'}
              </p>
            </div>

            {viewFeedbackModal.aiEvaluation && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <Sparkles size={14} /> AI Constructive Feedback
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {viewFeedbackModal.aiEvaluation.summary}
                </p>
                {viewFeedbackModal.aiEvaluation.strengths && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 space-y-0.5">
                    <span className="font-bold">Strengths:</span>
                    <ul className="list-disc pl-4">
                      {viewFeedbackModal.aiEvaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {viewFeedbackModal.aiEvaluation.improvements && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 space-y-0.5">
                    <span className="font-bold">Next Steps for Improvement:</span>
                    <ul className="list-disc pl-4">
                      {viewFeedbackModal.aiEvaluation.improvements.map((im, i) => (
                        <li key={i}>{im}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewFeedbackModal(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
