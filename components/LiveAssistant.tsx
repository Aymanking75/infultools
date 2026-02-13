import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { XIcon, MicIcon, StopIcon, SettingsIcon, VolumeIcon, SparklesIcon } from './Icons';

// --- Types ---
type ToneType = 'Soft' | 'Tech' | 'Pop';

interface LiveAssistantProps {
  onClose: () => void;
}

// --- Audio Utils ---
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm' });
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// --- Component ---
export const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0); // For visualization (0-100)
  
  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tone, setTone] = useState<ToneType>('Pop');
  const [isMuted, setIsMuted] = useState(false);

  // Refs for Audio
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Ref for Session
  const sessionRef = useRef<any>(null);

  // Mapping Tones to Voices
  const voiceName = useMemo(() => {
    switch (tone) {
      case 'Soft': return 'Kore';   // Calm
      case 'Tech': return 'Puck';   // Crisp/Neutral
      case 'Pop': return 'Zephyr';  // Energetic
      default: return 'Zephyr';
    }
  }, [tone]);

  // Cleanup Function
  const cleanup = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    setConnected(false);
  };

  const connect = async () => {
    try {
      setError(null);
      cleanup(); // Ensure clean state before connecting

      // 1. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 2. Setup Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // 3. Setup Analyser for Visuals
      analyserRef.current = outputAudioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
      
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(outputAudioContextRef.current.destination);

      // 4. Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 5. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setConnected(true);

            // Start Input Streaming
            if (!inputAudioContextRef.current || !streamRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            inputSourceRef.current = source;
            
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert Float32 to Int16 PCM Base64
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                 int16[i] = inputData[i] * 32768;
              }
              const bytes = new Uint8Array(int16.buffer);
              let binary = '';
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (base64Audio) {
                if (!outputAudioContextRef.current || !outputNodeRef.current) return;

                // Adjust output volume (mute if needed)
                outputNodeRef.current.gain.value = isMuted ? 0 : 1;

                nextStartTimeRef.current = Math.max(
                  nextStartTimeRef.current,
                  outputAudioContextRef.current.currentTime
                );

                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  outputAudioContextRef.current,
                  24000,
                  1
                );

                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
             }

             // Handle Interruption
             if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(src => src.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
             }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setError("حدث خطأ في الاتصال");
            setConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } }
          },
          systemInstruction: "You are a helpful and energetic creative assistant for content creators. Speak Arabic naturally.",
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (e) {
      console.error(e);
      setError("تعذر الوصول للميكروفون أو الاتصال بالخادم.");
    }
  };

  // Handle Tone Change (Requires Reconnect)
  const handleToneChange = (newTone: ToneType) => {
    setTone(newTone);
    if (connected) {
      // Small delay to allow UI to update before reconnecting
      setTimeout(() => {
        cleanup();
        setTimeout(connect, 500); 
      }, 100);
    }
  };

  // Visualization Loop
  useEffect(() => {
    let animationId: number;
    const updateVolume = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avg); // 0-255 roughly
      }
      animationId = requestAnimationFrame(updateVolume);
    };
    updateVolume();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-2 text-white/80">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm">المساعد الصوتي</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-full transition-colors ${settingsOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/60'}`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Settings Panel Overlay */}
        <div className={`absolute top-16 left-0 w-full bg-gray-800/90 backdrop-blur-md z-30 transition-all duration-300 overflow-hidden border-b border-white/10
          ${settingsOpen ? 'max-h-64 py-4' : 'max-h-0 py-0'}
        `}>
          <div className="px-6 space-y-4">
            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">نبرة الصوت</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Soft', 'Tech', 'Pop'] as ToneType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleToneChange(t)}
                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border
                      ${tone === t 
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                    `}
                  >
                    {t === 'Soft' && 'هادئ'}
                    {t === 'Tech' && 'تقني'}
                    {t === 'Pop' && 'حيوي'}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Toggle */}
            <div className="flex items-center justify-between pt-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">مؤثرات صوتية</label>
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className={`relative w-12 h-7 rounded-full transition-colors ${!isMuted ? 'bg-green-500' : 'bg-gray-600'}`}
               >
                 <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${!isMuted ? 'translate-x-5' : 'translate-x-0'}`}></div>
               </button>
            </div>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Glowing Orb */}
          <div 
             className={`w-40 h-40 rounded-full blur-2xl transition-all duration-100 ease-out opacity-60
               ${connected ? 'bg-purple-600' : 'bg-gray-700'}
             `}
             style={{ 
               transform: `scale(${1 + (volume / 255) * 0.5})`,
             }}
          ></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300
               ${connected 
                  ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                  : 'border-white/10'}
             `}>
                <MicIcon className={`w-12 h-12 transition-colors ${connected ? 'text-white' : 'text-gray-500'}`} />
             </div>
          </div>

          <div className="mt-12 text-center px-6">
            <h3 className="text-2xl font-black text-white mb-2">
              {connected ? 'أنا أستمع إليك...' : 'جاهز للمساعدة'}
            </h3>
            <p className="text-white/50 text-sm">
               {error ? <span className="text-red-400">{error}</span> : 
                connected ? 'تحدث بحرية، سأجيبك فوراً.' : 'اضغط على الزر أدناه لبدء المحادثة.'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 flex justify-center z-20">
          {!connected ? (
            <button
              onClick={connect}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <MicIcon className="w-5 h-5" />
              بدء المحادثة
            </button>
          ) : (
            <div className="flex gap-4 w-full">
               <button
                 onClick={() => setIsMuted(!isMuted)}
                 className={`flex-1 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 border border-white/10
                   ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white hover:bg-white/10'}
                 `}
               >
                 <VolumeIcon className="w-5 h-5" />
                 {isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
               </button>
               <button
                 onClick={cleanup}
                 className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
               >
                 <StopIcon className="w-5 h-5" />
                 إنهاء
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
