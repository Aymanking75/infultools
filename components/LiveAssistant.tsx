import React, { useEffect, useRef, useState } from "react";
import { XIcon, MicIcon, StopIcon, SparklesIcon } from "./Icons";

interface LiveAssistantProps {
  onClose: () => void;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("اضغط للبدء");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("المتصفح لا يدعم التعرف على الصوت");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-DZ";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setStatus("أنا أستمع إليك...");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus("اضغط للبدء");
    };

    recognition.onresult = async (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setStatus("قلت: " + transcript);

      // استجابة تلقائية (بدون GenAI)
      speak("سمعتك تقول: " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md p-6 rounded-2xl text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="font-bold">المساعد الصوتي</span>
          </div>
          <button onClick={onClose}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Status */}
        <p className="text-center text-white/60 mb-6">{status}</p>

        {/* Controls */}
        {!listening ? (
          <button
            onClick={startListening}
            className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <MicIcon className="w-5 h-5" />
            بدء المحادثة
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="w-full bg-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <StopIcon className="w-5 h-5" />
            إيقاف
          </button>
        )}
      </div>
    </div>
  );
};