import { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Zap,
  School,
  FileCheck,
  IdCard,
  LockKeyhole,
  AlertCircle
} from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot' | 'success'
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edunova-theme') || 'dark';
  });

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    teacherId: '',
    password: '',
    departmentOrGrade: '',
    rememberMe: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);

  // Sync theme with HTML class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('edunova-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass) && pass.length >= 8) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'signin'
        ? {
            role,
            identifier: formData.identifier,
            teacherId: role === 'teacher' ? formData.teacherId : undefined,
            password: formData.password,
          }
        : {
            role,
            name: formData.name,
            email: formData.identifier,
            teacherId: role === 'teacher' ? formData.teacherId : undefined,
            password: formData.password,
            departmentOrGrade: formData.departmentOrGrade,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('edunova_token', data.token);
      }
      setUserProfile(data.user);
      setMode('success');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to authentication server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotStep === 1) {
      setForgotStep(2);
    } else if (forgotStep === 2) {
      setForgotStep(3);
    } else {
      setMode('signin');
      setForgotStep(1);
    }
  };

  const isStudent = role === 'student';

  return (
    <div className="relative min-h-screen w-full flex overflow-x-hidden bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 transition-colors duration-300 select-none font-['Plus_Jakarta_Sans']">
      {/* Ambient background glow orbs */}
      <div
        className={`pointer-events-none absolute -top-36 -left-36 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 dark:opacity-30 animate-pulse-slow ${
          isStudent ? 'bg-indigo-400 dark:bg-indigo-600' : 'bg-emerald-400 dark:bg-emerald-600'
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-36 -right-28 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 dark:opacity-25 animate-pulse-slow-reverse ${
          isStudent ? 'bg-pink-400 dark:bg-pink-600' : 'bg-cyan-400 dark:bg-cyan-600'
        }`}
      />

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/90 dark:bg-gray-900/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>
      </div>

      <div className="flex w-full min-h-screen z-10">
        {/* ================= LEFT HERO PANEL ================= */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-14 bg-white/70 dark:bg-gray-900/40 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 transition-colors duration-300">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                isStudent
                  ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-indigo-500/30'
                  : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-emerald-500/30'
              }`}
            >
              <Sparkles size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white font-['Outfit']">
                EduNova
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
                  isStudent
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                }`}
              >
                {isStudent ? 'Student Portal' : 'Faculty & Teacher Portal'}
              </span>
            </div>
          </div>

          {/* Hero Main Copy */}
          <div className="my-auto py-8 animate-slide-up">
            <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight font-['Outfit'] mb-4 text-gray-900 dark:text-white">
              {isStudent ? (
                <>
                  Learn, Collaborate &{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Excel
                  </span>
                </>
              ) : (
                <>
                  Manage, Assess &{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Educate
                  </span>
                </>
              )}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed mb-8">
              {isStudent
                ? 'Sign in to access your registered courses, view assignments, track attendance, and connect with peers and instructors.'
                : 'Sign in to access your assigned batches, manage course curriculum, review student submissions, and publish grades.'}
            </p>

            {/* Platform Feature Overview */}
            <div className="flex flex-col gap-3.5 max-w-lg">
              {isStudent ? (
                <>
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Laptop size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Live Classroom Sessions</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Join virtual classrooms and access course materials.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Assignments & Submissions</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Submit projects and receive evaluations from teachers.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400 shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Academic Progress</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View official scores, attendance logs, and schedules.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Course & Assessment Management</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Create quizzes, schedule lectures, and grade submissions.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Student Roster</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track enrolled students, submissions, and performance.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Department Administration</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Secure role-based tools and official communication.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Clean Security Info Banner */}
          <div className="flex items-center gap-6 pt-6 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <LockKeyhole size={15} className="text-gray-400 dark:text-gray-500" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-gray-400 dark:text-gray-500" />
              <span>Institutional Auth</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT AUTH PANEL ================= */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-20">
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl dark:shadow-indigo-950/20 transition-all duration-300">
            {/* SUCCESS STATE */}
            {mode === 'success' ? (
              <div className="text-center py-4 animate-slide-up">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-white shadow-xl ${
                    isStudent
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/40'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-500/40'
                  }`}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white mb-2">
                  Authenticated Successfully
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Signed in as{' '}
                  <span className={`font-semibold ${isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isStudent ? 'Student' : 'Faculty / Teacher'}
                  </span>
                </p>

                {/* Entered Account Details */}
                <div className="p-4 bg-gray-100/90 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-white/10 text-left text-xs mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                  {(userProfile?.name || formData.name) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="font-semibold">{userProfile?.name || formData.name}</span>
                    </div>
                  )}
                  {!isStudent && (userProfile?.teacherId || formData.teacherId) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Teacher ID:</span>
                      <span className="font-semibold font-mono">{userProfile?.teacherId || formData.teacherId}</span>
                    </div>
                  )}
                  {(userProfile?.email || formData.identifier) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Account:</span>
                      <span className="font-semibold">{userProfile?.email || formData.identifier}</span>
                    </div>
                  )}
                  {(userProfile?.departmentOrGrade || formData.departmentOrGrade) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Department / Grade:</span>
                      <span className="font-semibold">{userProfile?.departmentOrGrade || formData.departmentOrGrade}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const authenticatedUser = userProfile || {
                      name: formData.name || (isStudent ? 'Student User' : 'Faculty Member'),
                      email: formData.identifier,
                      role: role,
                      teacherId: formData.teacherId,
                      departmentOrGrade: formData.departmentOrGrade,
                    };
                    if (onLoginSuccess) {
                      onLoginSuccess(authenticatedUser);
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-98 cursor-pointer ${
                    isStudent
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/30'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/30'
                  }`}
                >
                  Continue to Portal <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('edunova_token');
                    setMode('signin');
                    setUserProfile(null);
                    setFormData({
                      name: '',
                      identifier: '',
                      teacherId: '',
                      password: '',
                      departmentOrGrade: '',
                      rememberMe: true,
                    });
                  }}
                  className={`mt-4 text-xs font-semibold hover:underline cursor-pointer ${
                    isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  ← Sign out / Switch Account
                </button>
              </div>
            ) : mode === 'forgot' ? (
              /* FORGOT PASSWORD STATE */
              <div className="animate-slide-up">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white mb-1.5">Reset Password</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {forgotStep === 1 && 'Enter your institutional email to receive a recovery code.'}
                    {forgotStep === 2 && 'Enter the 4-digit code sent to your email.'}
                    {forgotStep === 3 && 'Enter your new password.'}
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                  {forgotStep === 1 && (
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Registered Email</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                          type="email"
                          required
                          placeholder="Enter your registered email"
                          value={formData.identifier}
                          onChange={handleInputChange}
                          name="identifier"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {forgotStep === 2 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">4-Digit Verification PIN</label>
                      <div className="flex justify-center gap-3 my-2">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={otp[idx]}
                            onChange={(e) => {
                              const newOtp = [...otp];
                              newOtp[idx] = e.target.value;
                              setOtp(newOtp);
                              if (e.target.value && e.target.nextElementSibling) {
                                e.target.nextElementSibling.focus();
                              }
                            }}
                            className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                        Didn't receive code?{' '}
                        <button
                          type="button"
                          onClick={() => alert('Verification code resent.')}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Resend Code
                        </button>
                      </p>
                    </div>
                  )}

                  {forgotStep === 3 && (
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                          type="password"
                          required
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`w-full py-3 mt-2 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-98 cursor-pointer ${
                      isStudent
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/30'
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/30'
                    }`}
                  >
                    {forgotStep === 1 ? 'Send Code' : forgotStep === 2 ? 'Verify PIN' : 'Update Password'}
                  </button>

                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setForgotStep(1);
                      }}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* SIGN IN & SIGN UP FORM */
              <div className="animate-slide-up">
                {/* ROLE SELECTOR TABS */}
                <div className="grid grid-cols-2 p-1 bg-gray-200/70 dark:bg-gray-800/70 border border-gray-300/60 dark:border-white/10 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setErrorMessage('');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isStudent
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <GraduationCap size={16} /> Student
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('teacher');
                      setErrorMessage('');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      !isStudent
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <BookOpen size={16} /> Teacher / Faculty
                  </button>
                </div>

                {/* Form Header */}
                <div className="text-left mb-6">
                  <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white mb-1">
                    {mode === 'signin' ? `Sign In` : `Create Account`}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {mode === 'signin'
                      ? isStudent
                        ? 'Enter your Student ID or institute email to sign in.'
                        : 'Enter your Teacher ID and credentials to sign in.'
                      : isStudent
                        ? 'Register your student profile to access courses.'
                        : 'Register your faculty profile to access management tools.'}
                  </p>
                </div>

                {/* Error message alert banner */}
                {errorMessage && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs mb-4 animate-slide-up">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Login/Signup Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  {/* Name field (for Signup) */}
                  {mode === 'signup' && (
                    <div className="flex flex-col gap-1 text-left animate-slide-up">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none transition-all ${
                            isStudent
                              ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                              : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Teacher ID Field (Specially for Teachers) */}
                  {!isStudent && (
                    <div className="flex flex-col gap-1 text-left animate-slide-up">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Teacher / Faculty ID <span className="text-emerald-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <IdCard className="absolute left-3.5 text-emerald-500 pointer-events-none" size={17} />
                        <input
                          type="text"
                          name="teacherId"
                          required
                          placeholder="Enter Teacher ID"
                          value={formData.teacherId}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email / Student ID Field */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {isStudent ? 'Student Email / Roll Number' : 'Official Faculty Email'}
                    </label>
                    <div className="relative flex items-center">
                      {isStudent ? (
                        <School className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
                      ) : (
                        <Mail className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
                      )}
                      <input
                        type={isStudent ? 'text' : 'email'}
                        name="identifier"
                        required
                        placeholder={isStudent ? 'Enter student email or roll number' : 'Enter faculty email'}
                        value={formData.identifier}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none transition-all ${
                          isStudent
                            ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                            : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Department/Grade for Signup */}
                  {mode === 'signup' && (
                    <div className="flex flex-col gap-1 text-left animate-slide-up">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {isStudent ? 'Semester & Program' : 'Department & Specialization'}
                      </label>
                      <div className="relative flex items-center">
                        <BookOpen className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
                        <input
                          type="text"
                          name="departmentOrGrade"
                          placeholder={isStudent ? 'Enter semester & program' : 'Enter department'}
                          value={formData.departmentOrGrade}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none transition-all ${
                            isStudent
                              ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                              : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none transition-all ${
                          isStudent
                            ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                            : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {mode === 'signup' && formData.password && (
                      <div className="flex gap-1.5 mt-1.5">
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-rose-500' : passwordStrength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= 2 ? (passwordStrength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Options: Remember & Forgot */}
                  {mode === 'signin' && (
                    <div className="flex items-center justify-between text-xs mt-0.5">
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className={`rounded border-gray-300 dark:border-gray-700 cursor-pointer ${
                            isStudent ? 'accent-indigo-600' : 'accent-emerald-600'
                          }`}
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className={`font-semibold hover:underline cursor-pointer ${
                          isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 mt-2 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-98 cursor-pointer ${
                      isStudent
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/30'
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/30'
                    }`}
                  >
                    {isLoading ? (
                      'Authenticating...'
                    ) : (
                      <>
                        {mode === 'signin' ? `Sign In as ${isStudent ? 'Student' : 'Teacher'}` : 'Create Account'}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch between Sign In / Sign Up */}
                <div className="text-center mt-5 text-xs text-gray-600 dark:text-gray-400">
                  {mode === 'signin' ? (
                    <>
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setErrorMessage('');
                        }}
                        className={`font-bold hover:underline cursor-pointer ${
                          isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        Register Now
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          setErrorMessage('');
                        }}
                        className={`font-bold hover:underline cursor-pointer ${
                          isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
