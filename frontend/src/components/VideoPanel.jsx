import { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Radio,
  Users,
  Monitor,
  Volume2,
  Sparkles
} from 'lucide-react';

export default function VideoPanel({
  className = 'Java & Object-Oriented Programming',
  topic = 'Inheritance & Polymorphism',
  instructor = 'Dr. Priya Mehta',
  studentCount = 42,
}) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [mode, setMode] = useState('lecture'); // 'lecture' | 'slides'

  return (
    <div className="relative w-full rounded-3xl bg-gray-950 border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between aspect-video md:aspect-[16/9] text-white">
      {/* Top Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 animate-pulse">
            <Radio size={13} /> LIVE LECTURE
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold">
            <Users size={13} className="text-indigo-400" /> {studentCount} Connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'lecture' ? 'slides' : 'lecture'))}
            className="px-3 py-1 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Monitor size={14} className="text-cyan-400" />
            {mode === 'lecture' ? 'View Slides' : 'View Instructor'}
          </button>
        </div>
      </div>

      {/* Main Video Stream Simulation */}
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-950">
        {mode === 'lecture' ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-slide-up">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl shadow-emerald-500/30">
                {instructor[0]}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-gray-950 flex items-center justify-center">
                <Radio size={10} className="text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-white">{instructor}</h3>
              <p className="text-xs text-indigo-300 font-medium">Presenting: {topic}</p>
              <span className="inline-block mt-2 text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/10 text-gray-300">
                {className}
              </span>
            </div>

            {/* Audio Wave Simulation */}
            <div className="flex items-center gap-1 pt-2">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-7 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : (
          /* Slide Deck Mode */
          <div className="w-full h-full p-8 flex flex-col justify-between bg-slate-900 text-left">
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-4">
                <span>SLIDE 14 OF 32</span>
                <span>OOP PRINCIPLES</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] text-white mb-4">
                Understanding Inheritance & Polymorphism
              </h2>
              <ul className="space-y-3 text-xs md:text-sm text-gray-300 max-w-xl">
                <li className="flex items-start gap-2">
                  <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Inheritance:</strong> Enables a child class to inherit fields and methods from a parent class (<code>extends</code> keyword in Java).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Method Overriding:</strong> Runtime polymorphism allows dynamic method dispatch at execution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Code Reusability:</strong> Eliminates boilerplate duplicate logic across related domain entities.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
              <span>EduNova Interactive Whiteboard</span>
              <span>Live Synced</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAudioOn((a) => !a)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
              isAudioOn ? 'bg-black/60 hover:bg-black/80 border-white/10 text-white' : 'bg-rose-600 border-rose-500 text-white'
            }`}
          >
            {isAudioOn ? <Mic size={17} /> : <MicOff size={17} />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn((v) => !v)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
              isVideoOn ? 'bg-black/60 hover:bg-black/80 border-white/10 text-white' : 'bg-rose-600 border-rose-500 text-white'
            }`}
          >
            {isVideoOn ? <Video size={17} /> : <VideoOff size={17} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
            <Volume2 size={15} className="text-emerald-400" />
            <span>HD Audio</span>
          </div>
          <button
            type="button"
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white cursor-pointer"
          >
            <Maximize2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
