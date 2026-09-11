import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Radio,
  Users,
  Monitor,
  Camera,
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';

export default function VideoPanel({
  className = 'Live Class',
  topic = 'Live Session',
  instructor = 'Faculty Instructor',
  studentCount = 0,
}) {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [mode, setMode] = useState('lecture'); // 'lecture' | 'slides'
  const [hasCameraStream, setHasCameraStream] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [audioLevel, setAudioLevel] = useState([10, 10, 10, 10, 10]); // 5 bars

  const videoElementRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);

  // Attach stream to video element whenever video element or stream updates
  const attachStreamToVideo = useCallback((stream) => {
    if (videoElementRef.current && stream) {
      videoElementRef.current.srcObject = stream;
      videoElementRef.current.play().catch((err) => {
        console.warn('Video auto-play suppressed:', err);
      });
    }
  }, []);

  // Web Audio API Real-time Voice Analyzer
  const setupAudioAnalyzer = useCallback((stream) => {
    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume across frequency bins
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;

        if (avg > 3) {
          // Active speech detected - amplify dynamic responsiveness
          const base = Math.min(100, Math.max(25, (avg / 128) * 100));
          setAudioLevel([
            Math.min(100, Math.max(20, base * 0.7 + ((dataArray[1] || 0) / 255) * 40)),
            Math.min(100, Math.max(30, base * 1.0 + ((dataArray[3] || 0) / 255) * 50)),
            Math.min(100, Math.max(45, base * 1.3 + ((dataArray[5] || 0) / 255) * 60)),
            Math.min(100, Math.max(30, base * 0.9 + ((dataArray[7] || 0) / 255) * 50)),
            Math.min(100, Math.max(20, base * 0.6 + ((dataArray[9] || 0) / 255) * 40)),
          ]);
        } else {
          // Idle mic on - baseline indicator
          setAudioLevel([20, 30, 45, 30, 20]);
        }

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Audio analyzer error:', err);
    }
  }, []);

  const cleanAudioAnalyzer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel([10, 10, 10, 10, 10]);
  }, []);

  // Main Stream Lifecycle Management
  useEffect(() => {
    let isCancelled = false;

    async function syncMedia() {
      // Clean up previous analyzer
      cleanAudioAnalyzer();

      // If both camera and mic are off, stop all active tracks
      if (!isVideoOn && !isAudioOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = null;
        }
        setHasCameraStream(false);
        setMediaError('');
        return;
      }

      try {
        setMediaError('');

        // Stop existing tracks before requesting new configuration
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (window.isSecureContext === false || window.location.hostname !== 'localhost') {
            setMediaError(
              `Browser Security: Chrome/Edge requires HTTPS or a secure flag to access Camera/Mic over IP. In Chrome/Edge on this device, open chrome://flags/#unsafely-treat-insecure-origin-as-secure, add "${window.location.origin}", and enable it.`
            );
          } else {
            setMediaError('Camera/Microphone API is not supported in this browser.');
          }
          setHasCameraStream(false);
          return;
        }

        let stream;
        try {
          // Attempt ideal constraints
          const constraints = {
            video: isVideoOn
              ? {
                  width: { ideal: 1280, min: 480 },
                  height: { ideal: 720, min: 360 },
                  facingMode: 'user',
                }
              : false,
            audio: isAudioOn
              ? {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                }
              : false,
          };
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (initialErr) {
          console.warn('Initial media constraint failed, falling back to basic media request:', initialErr);
          // Fallback to basic constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isAudioOn,
          });
        }

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        // Check if video track is active and enabled
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0 && isVideoOn) {
          setHasCameraStream(true);
          // Use small timeout to ensure DOM element is mounted
          setTimeout(() => {
            attachStreamToVideo(stream);
          }, 100);
        } else {
          setHasCameraStream(false);
        }

        // Setup audio visualizer if mic active
        if (isAudioOn) {
          setupAudioAnalyzer(stream);
        }
      } catch (err) {
        console.warn('Hardware media stream error:', err.name, err.message);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMediaError('Permission denied. Please click the lock/camera icon in your browser address bar to allow Camera/Mic access.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setMediaError('Webcam is currently in use by another application or browser tab.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setMediaError('No camera or microphone hardware found on this device.');
        } else {
          setMediaError(err.message || 'Unable to access camera or microphone.');
        }
        setHasCameraStream(false);
      }
    }

    syncMedia();

    return () => {
      isCancelled = true;
      cleanAudioAnalyzer();
    };
  }, [isVideoOn, isAudioOn, attachStreamToVideo, setupAudioAnalyzer, cleanAudioAnalyzer]);

  // Handle ref callback so when video element mounts, it receives the stream immediately
  const handleVideoRef = useCallback(
    (node) => {
      videoElementRef.current = node;
      if (node && streamRef.current && isVideoOn) {
        node.srcObject = streamRef.current;
        node.play().catch(() => {});
      }
    },
    [isVideoOn]
  );

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl bg-gray-950 border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between aspect-video md:aspect-[16/9] text-white transition-all duration-300 select-none"
    >
      {/* Top Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 animate-pulse">
            <Radio size={13} /> LIVE BROADCAST
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold">
            <Users size={13} className="text-indigo-400" /> {studentCount} Connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'lecture' ? 'slides' : 'lecture'))}
            className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Monitor size={14} className="text-cyan-400" />
            <span>{mode === 'lecture' ? 'View Whiteboard' : 'View Instructor'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Stream Area */}
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-950 overflow-hidden">
        {mode === 'lecture' ? (
          hasCameraStream && isVideoOn ? (
            /* Live Camera Stream Feed */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={handleVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />

              {/* Bottom Left Live Name Badge with Audio Meter */}
              <div className="absolute bottom-16 left-4 px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center gap-3 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{instructor} (Live Video)</span>
                {isAudioOn ? (
                  <div className="flex items-end gap-1 h-3.5 pl-2 border-l border-white/20">
                    {audioLevel.map((lvl, idx) => (
                      <span
                        key={idx}
                        className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(20, lvl)}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                    Muted
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Presenter Avatar Presentation */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-slide-up max-w-md mx-auto">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-2xl shadow-emerald-500/30 border-2 border-white/20">
                  {instructor ? instructor[0].toUpperCase() : 'F'}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-gray-950 flex items-center justify-center shadow">
                  <Radio size={12} className="text-white animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
                  {instructor}
                </h3>
                <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                  Presenting: <strong className="text-white">{topic}</strong>
                </p>
                <span className="inline-block mt-1 text-[11px] font-mono px-3 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                  {className}
                </span>

                {mediaError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed flex items-center gap-2 text-left">
                    <AlertCircle size={15} className="shrink-0 text-amber-400" />
                    <span>{mediaError}</span>
                  </div>
                )}
              </div>

              {/* Real-time Web Audio Voice Level Waves */}
              {isAudioOn && (
                <div className="flex items-center gap-2 p-2 px-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md shadow-lg">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Voice Live:</span>
                  <div className="flex items-end justify-center gap-1.5 h-6">
                    {audioLevel.map((lvl, idx) => (
                      <span
                        key={idx}
                        className="w-1.5 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(25, lvl)}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* Whiteboard Deck Mode */
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-slate-900 text-left">
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ACTIVE TOPIC WHITEBOARD
                </span>
                <span>HD 1080P SYNCED</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] text-white mb-2">
                {topic}
              </h2>
              <p className="text-xs font-semibold text-indigo-300 mb-4">{className}</p>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-2 max-w-xl shadow-inner">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Sparkles size={16} className="text-indigo-400" /> AI-Powered Question Clustering Studio
                </div>
                <p className="leading-relaxed">
                  Submit doubts during the live presentation. EduNova's AI clusters similar questions in real-time, allowing the instructor to answer once and clarify doubts for all affected students simultaneously.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-3">
              <span className="font-semibold text-gray-300">EduNova Live Studio</span>
              {isAudioOn ? (
                <div className="flex items-center gap-2 font-mono text-emerald-400 text-xs">
                  <span>Voice Broadcasting</span>
                  <div className="flex items-end gap-1 h-3">
                    {audioLevel.map((lvl, idx) => (
                      <span
                        key={idx}
                        className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(20, lvl)}%` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="font-mono text-gray-500">Audio Muted</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar (Google Meet Style) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Hardware Toggles */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAudioOn((prev) => !prev)}
            className={`p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer flex items-center gap-2 font-bold text-xs shadow-lg ${
              isAudioOn
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/25'
                : 'bg-black/70 hover:bg-black/90 border-white/15 text-gray-300 hover:text-white'
            }`}
            title={isAudioOn ? 'Mute Microphone' : 'Turn On Microphone (Live Voice)'}
          >
            {isAudioOn ? <Mic size={17} /> : <MicOff size={17} />}
            <span className="hidden sm:inline">{isAudioOn ? 'Mic Active' : 'Mic Off'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn((prev) => !prev)}
            className={`p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer flex items-center gap-2 font-bold text-xs shadow-lg ${
              isVideoOn
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/25'
                : 'bg-black/70 hover:bg-black/90 border-white/15 text-gray-300 hover:text-white'
            }`}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera (Live Video)'}
          >
            {isVideoOn ? <Video size={17} /> : <VideoOff size={17} />}
            <span className="hidden sm:inline">{isVideoOn ? 'Camera Live' : 'Camera Off'}</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer shadow-lg"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
