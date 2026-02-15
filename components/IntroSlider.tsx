import React, { useState, useEffect } from 'react';
import { SparklesIcon, ArrowRightIcon, ImageIcon, PencilIcon, PlayIcon } from './Icons';

interface IntroSliderProps {
  onTryFree: () => void;
}

const slides = [
  {
    id: 1,
    title: "InfluTools",
    subtitle: "منصتك الذكية لصناعة المحتوى",
    description: "اكتشف قوة الذكاء الاصطناعي في توليد الأفكار، كتابة السكريبتات، وتصميم الصور بضغطة زر.",
    icon: <SparklesIcon className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />,
    color: "from-purple-600 to-indigo-900",
    glowColor: "bg-purple-500",
    isMain: true
  },
  {
    id: 2,
    title: "حول كلماتك إلى صور",
    subtitle: "مصمم الصور الذكي",
    description: "أطلق العنان لخيالك. صف أي مشهد تريده، وسيقوم الذكاء الاصطناعي برسمه لك بجودة مذهلة.",
    icon: <ImageIcon className="w-20 h-20 text-rose-300" />,
    color: "from-rose-700 to-purple-900",
    glowColor: "bg-rose-500",
    isMain: false
  },
  {
    id: 3,
    title: "أفكار وسكريبتات لا تنتهي",
    subtitle: "مساعد الكتابة الذكي",
    description: "هل تعاني من 'قفلة الكاتب'؟ احصل على عناوين جذابة، هاشتاقات ترند، وسكريبتات كاملة في ثوانٍ.",
    icon: <PencilIcon className="w-20 h-20 text-blue-300" />,
    color: "from-blue-700 to-indigo-900",
    glowColor: "bg-blue-500",
    isMain: false
  }
];

const IntroSlider: React.FC<IntroSliderProps> = ({ onTryFree }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div 
      className="relative h-[600px] md:h-[500px] w-full overflow-hidden rounded-b-[3rem] shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center
            ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            bg-gradient-to-br ${slide.color}
          `}
        >
          {/* Background Abstract Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob ${slide.glowColor}`}></div>
            <div className={`absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000 ${slide.glowColor === 'bg-purple-500' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              
              {/* Text Content */}
              <div className={`text-center md:text-right space-y-6 max-w-2xl transition-all duration-700 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {slide.subtitle && (
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-bold mb-2">
                    {slide.subtitle}
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed">
                  {slide.description}
                </p>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={onTryFree}
                    className="px-8 py-4 bg-white text-purple-900 hover:bg-gray-100 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <SparklesIcon className="w-5 h-5" />
                    ابدأ التجربة المجانية
                  </button>
                  {slide.isMain && (
                     <button className="px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                        <PlayIcon className="w-5 h-5" />
                        كيف يعمل؟
                     </button>
                  )}
                </div>
              </div>

              {/* Visual / Icon */}
              <div className={`relative flex justify-center transition-all duration-1000 delay-300 transform ${index === current ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                 {slide.isMain ? (
                   // Glowing Logo Container
                   <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-full border border-white/20 shadow-2xl ring-4 ring-white/5">
                        {slide.icon}
                      </div>
                      {/* Floating Particles */}
                      <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                   </div>
                 ) : (
                   // Standard Icon Container
                   <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      {slide.icon}
                   </div>
                 )}
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-8">
        {/* Prev Arrow */}
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors border border-white/10 md:opacity-0 group-hover:opacity-100"
        >
          <ArrowRightIcon className="w-6 h-6 rotate-180" /> {/* Reused icon, rotated for RTL context means pointing right visually, but functionally prev */}
        </button>

        {/* Dots */}
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`transition-all duration-300 rounded-full shadow-sm
                ${idx === current ? 'w-12 h-3 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/60'}
              `}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Arrow */}
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors border border-white/10 md:opacity-0 group-hover:opacity-100"
        >
          <ArrowRightIcon className="w-6 h-6" /> {/* Pointing Left in RTL is Next */}
        </button>
      </div>
    </div>
  );
};

export default IntroSlider;
