import React, { useEffect, useRef, useState } from "react";
import { XIcon, MicIcon, StopIcon, VolumeIcon, SparklesIcon } from "./Icons";

interface LiveAssistantProps {
  onClose: () => void;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "ar";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = async (e: any) => {
      const transcript = e.results[e.results.length - 1][0].transcript;
      setText(transcript);

      // أرسل النص إلى API
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: transcript })
      });

      const data = await res.json();
      speak(data.text);
    };

    recognitionRef.current = rec;
  }, []);

  const start = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speak = (msg: string) => {
    const utter = new SpeechSynthesisUtterance(msg);
    utter.lang = "ar";
    speechSynthesis.speak(utter);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md text-white">

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="font-bold">المساعد الصوتي</span>
          </div>
          <button onClick={onClose}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-6">
          {listening ? "أنا أستمع إليك..." : "اضغط للبدء"}
        </p>

        {!listening ? (
          <button
            onClick={start}
            className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <MicIcon className="w-5 h-5" />
            بدء
          </button>
        ) : (
          <button
            onClick={stop}
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