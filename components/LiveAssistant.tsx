// src/components/LiveAssistant.tsx
import React, { useEffect, useRef, useState } from "react";
import { XIcon, MicIcon, StopIcon, SparklesIcon } from "./Icons";

interface LiveAssistantProps {
  onClose: () => void;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("اضغط للبدء");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // التحقق من دعم المتصفح
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("المتصفح لا يدعم التعرف على الصوت");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-DZ"; // لهجة جزائرية عربية
    recognition.continuous = false; // توقف تلقائي بعد توقف الكلام
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setStatus("أنا أستمع إليك...");
    };

    recognition.onend = () => {
      setListening(false);
      // لا نعيد التشغيل تلقائيًا لتجنب الحلقة اللانهائية
      setStatus("اضغط للبدء");
    };

    recognition.onerror = (event: any) => {
      console.error("خطأ في التعرف على الصوت:", event.error);
      setStatus("حدث خطأ أثناء الاستماع");
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setStatus(`قلت: "${transcript}"`);
      // رد تلقائي بسيط (بدون AI)
      const response = `سمعتك تقول: ${transcript}`;
      speak(response);
    };

    recognitionRef.current = recognition;

    // تنظيف عند إلغاء التحميل
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
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
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"            aria-label="إغلاق"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Status */}
        <p className="text-center text-white/80 mb-6 min-h-[24px]">{status}</p>

        {/* Controls */}
        {!listening ? (
          <button
            onClick={startListening}
            disabled={!recognitionRef.current}
            className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition disabled:opacity-50"
          >
            <MicIcon className="w-5 h-5" />
            بدء المحادثة
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="w-full bg-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            <StopIcon className="w-5 h-5" />
            إيقاف
          </button>
        )}
      </div>
    </div>
  );
};