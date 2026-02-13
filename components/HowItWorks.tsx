import React from 'react';
import { ToolIcon, PencilIcon, SparklesIcon, ArrowRightIcon } from './Icons';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-50 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-50 blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">
            كيف تصنع محتواك في <span className="text-purple-600">3 خطوات</span>؟
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            لا حاجة لخبرة تقنية. واجهة بسيطة وذكية تأخذ بيدك من الفكرة إلى النتيجة النهائية في ثوانٍ.
          </p>
        </div>

        <div className="space-y-24">
          
          {/* Step 1: Choose Tool */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Visual Mockup - Card Selection */}
              <div className="relative bg-slate-100 rounded-3xl p-6 aspect-[4/3] flex items-center justify-center shadow-inner overflow-hidden border border-slate-200">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                
                {/* Simulated Interface */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 opacity-50 scale-95">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                    <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-10 bg-slate-100 rounded"></div>
                  </div>
                  
                  {/* Active Card */}
                  <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-purple-500 transform scale-110 transition-transform relative">
                    <div className="absolute -top-3 -right-3 bg-purple-600 text-white p-1 rounded-full shadow-lg">
                      <ToolIcon className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg mb-2 flex items-center justify-center">
                       <ToolIcon className="w-5 h-5" />
                    </div>
                    <div className="h-2 w-20 bg-slate-800 rounded mb-2"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                    
                    {/* Simulated Cursor */}
                    <div className="absolute -bottom-8 -right-8 animate-bounce-slow">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 3.5L11.5 19.5L14.5 12.5L21.5 9.5L5.5 3.5Z" fill="black" stroke="white" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 opacity-50 scale-95">
                    <div className="w-8 h-8 bg-green-100 rounded-lg mb-2"></div>
                    <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-10 bg-slate-100 rounded"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 opacity-50 scale-95">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg mb-2"></div>
                    <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-10 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-right">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-6">1</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">اختر الأداة المناسبة</h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                سواء كنت بحاجة إلى أفكار جديدة، سكريبت احترافي، هاشتاقات ترند، أو حتى تحويل صورة لفيديو.. لدينا أداة مخصصة لكل احتياج.
              </p>
            </div>
          </div>

          {/* Step 2: Enter Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 text-center lg:text-right">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mb-6">2</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">أدخل تفاصيل بسيطة</h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                لا داعي لكتابة أوامر معقدة (Prompts). فقط أجب على سؤال بسيط مثل "عن ماذا يتحدث الفيديو؟" وسيقوم النظام بالباقي.
              </p>
            </div>

            <div className="order-2 relative">
               {/* Visual Mockup - Typing */}
               <div className="relative bg-slate-900 rounded-3xl p-6 aspect-[4/3] flex flex-col items-center justify-center shadow-2xl overflow-hidden border border-slate-800">
                  <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-lg">
                    {/* Window Header */}
                    <div className="bg-slate-100 px-4 py-2 border-b flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    {/* Input Area */}
                    <div className="p-6 space-y-4">
                       <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <PencilIcon className="w-4 h-4" />
                          عن ماذا يتحدث الفيديو؟
                       </div>
                       <div className="bg-slate-50 p-3 rounded-lg border border-purple-200 relative h-24">
                          <div className="absolute top-3 right-3 flex items-center">
                            <span className="text-slate-800 font-medium">أفضل 5 نصائح للتصوير</span>
                            <span className="w-0.5 h-5 bg-purple-600 ml-1 animate-pulse"></span>
                          </div>
                       </div>
                       <div className="h-10 w-full bg-indigo-600 rounded-lg opacity-90 flex items-center justify-center text-white text-xs font-bold">
                          توليد المحتوى
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Step 3: Magic Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
               {/* Visual Mockup - Result */}
               <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 aspect-[4/3] flex items-center justify-center shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  
                  {/* Floating Result Card */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm shadow-2xl transform translate-y-4 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                       <SparklesIcon className="w-6 h-6 text-yellow-500 animate-spin-slow" />
                       <span className="font-bold text-gray-800">النتيجة المقترحة</span>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                       <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                       <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">
                          100% فريد
                       </div>
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-purple-100 hover:text-purple-600 transition-colors cursor-pointer">
                          <ArrowRightIcon className="w-4 h-4 rotate-180" />
                       </div>
                    </div>
                  </div>

                  {/* Confetti / Sparkles Decorations */}
                  <div className="absolute top-10 left-10 text-yellow-300 animate-bounce delay-75">✦</div>
                  <div className="absolute bottom-10 right-20 text-pink-300 animate-bounce delay-150">★</div>
                  <div className="absolute top-1/2 right-10 text-white opacity-50 animate-ping">●</div>
               </div>
            </div>

            <div className="order-1 lg:order-2 text-center lg:text-right">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-xl mb-6">3</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">استلم النتيجة فوراً</h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                ستحصل على نتائج احترافية ومنسقة جاهزة للنسخ والنشر، أو فيديو جاهز للتحميل. يتم حفظ كل شيء في سجلك للرجوع إليه لاحقاً.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;