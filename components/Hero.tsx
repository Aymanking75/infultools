import React, { useState, useRef } from 'react';
import { TOOLS } from '../constants';
import { ToolDef } from '../types';
import { PlayIcon, XIcon, VideoIcon, UploadIcon } from './Icons';

interface HeroProps {
  onTryFree: () => void;
}

const Hero: React.FC<HeroProps> = ({ onTryFree }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState('/demo.mp4');
  const [videoError, setVideoError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenVideo = () => {
    // Reset state when opening
    setVideoError(false);
    setShowVideo(true);
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoError(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 text-white pb-20 pt-10 rounded-b-[3rem] shadow-2xl">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
         <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-right space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-2">
              ✨ الذكاء الاصطناعي بين يديك
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              أدوات المؤثرين
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                لصناعة المحتوى
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 font-light max-w-2xl mx-auto lg:mx-0">
              اكتشف أفكار، سكريبتات، وهاشتاجات بضغطة زر. دع الذكاء الاصطناعي يقوم بالعمل الشاق بينما تركز أنت على الإبداع!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onTryFree}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
              >
                جرب مجاناً
              </button>
              <button 
                onClick={handleOpenVideo}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayIcon className="w-4 h-4 ml-0.5" />
                </div>
                شاهد الفيديو
              </button>
            </div>
            <p className="text-sm text-purple-200 opacity-80">
              ابدأ اليوم بدون بطاقة ائتمان!
            </p>
          </div>

          {/* Hero Image / Illustration Placeholder */}
          <div className="relative flex justify-center">
             <div className="relative w-full max-w-md aspect-square">
                {/* Simulated 3D Character Area */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-800/50 to-transparent rounded-full filter blur-xl bottom-0 h-1/4"></div>
                <img 
                  src="https://picsum.photos/seed/influencer3d/800/800" 
                  alt="Influencer Illustration" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float mask-image-gradient"
                  style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} 
                />
                
                {/* Floating Elements */}
                <div className="absolute top-10 right-0 bg-white p-3 rounded-2xl shadow-xl animate-bounce-slow text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </div>
                <div className="absolute bottom-20 left-0 bg-white p-3 rounded-2xl shadow-xl animate-bounce-slow animation-delay-1000 text-blue-400">
                  <span className="text-2xl font-black">#</span>
                </div>
                <div className="absolute top-1/2 -right-8 bg-white p-3 rounded-2xl shadow-xl animate-bounce-slow animation-delay-2000 text-yellow-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
            >
              <XIcon className="w-8 h-8" />
            </button>
            
            {!videoError ? (
               <>
                 <div className="relative w-full h-full flex items-center justify-center">
                    <video 
                        className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl outline-none object-contain bg-black/50 ring-1 ring-white/10"
                        controls 
                        autoPlay
                        playsInline
                        src={videoSrc}
                        onError={() => setVideoError(true)}
                    >
                        متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                 </div>
                 <p className="text-white/50 text-sm mt-4 font-light animate-pulse">
                   شرح توضيحي لكيفية استخدام منصة InfluTools
                 </p>
               </>
            ) : (
                <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm max-w-md animate-fade-in-up">
                    <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <VideoIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">عذراً، الفيديو غير متوفر</h3>
                    <p className="text-white/70 text-base mb-8 leading-relaxed">
                        لم يتم العثور على ملف الفيديو في الموقع.
                        <br />
                        هل تريد تشغيل الفيديو الذي لديك على جهازك؟
                    </p>
                    
                    <input 
                        type="file" 
                        accept="video/*" 
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleLocalFile}
                    />

                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mb-3"
                    >
                        <UploadIcon className="w-5 h-5" />
                        اختر الفيديو من جهازك
                    </button>
                    
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="w-full px-6 py-3 bg-transparent hover:bg-white/5 text-white/60 font-medium rounded-xl transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Hero;