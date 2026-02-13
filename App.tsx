import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IntroSlider from './components/IntroSlider'; // Changed from Hero
import HowItWorks from './components/HowItWorks';
import ToolRunner from './components/ToolRunner';
import AuthModal from './components/AuthModal';
import { LiveAssistant } from './components/LiveAssistant';
import { TOOLS, PRICING_PLANS } from './constants';
import { ToolDef } from './types';
import { MicIcon } from './components/Icons';
import { subscribeToAuthChanges } from './services/firebase';
import { User } from 'firebase/auth'; // Removed CheckIcon from here

// We redefine CheckIcon locally if it was imported from icons, 
// OR if types.ts/constants don't use it, we import from Icons
import { CheckIcon as CheckIconSvg } from './components/Icons';


function App() {
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleToolClick = (tool: ToolDef) => {
    setActiveTool(tool);
  };

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-cairo">
      <Navbar 
        user={user} 
        onOpenAuth={() => setShowAuthModal(true)} 
      />
      
      {/* Replaced Hero with IntroSlider */}
      <IntroSlider onTryFree={scrollToTools} />

      <main className="space-y-0">
        
        {/* How it Works Section - Added Here */}
        <HowItWorks />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
          
          {/* Tools Section */}
          <section id="tools" className="scroll-mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">أدواتنا الذكية</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                مجموعة متكاملة من الأدوات المدعومة بالذكاء الاصطناعي لمساعدتك في كل خطوة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOOLS.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-100 cursor-pointer overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${tool.color.replace('bg-', 'bg-gradient-to-r from-transparent via-')}-500 to-transparent`}></div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="scroll-mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">اختر الباقة المناسبة لك</h2>
              <p className="text-xl text-slate-500">ابدأ مجاناً وقم بالترقية عندما تحتاج للمزيد</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRICING_PLANS.map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300
                    ${plan.isPro ? 'shadow-2xl scale-105 border-2 border-purple-500 z-10' : 'shadow-lg border border-slate-100 hover:shadow-xl'}
                  `}
                >
                  {plan.isPro && (
                    <div className="bg-purple-600 text-white text-center py-2 text-sm font-bold">
                      الأكثر طلباً
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className={`text-2xl font-bold mb-4 ${plan.isPro ? 'text-purple-600' : 'text-slate-800'}`}>
                      {plan.title}
                    </h3>
                    <div className="flex items-baseline mb-8">
                      <span className="text-5xl font-black text-slate-900">{plan.price}$</span>
                      <span className="text-slate-500 mr-2">{plan.period}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-slate-600">
                          <div className={`ml-3 p-1 rounded-full ${plan.isPro ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                            <CheckIconSvg className="w-4 h-4" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => !user && setShowAuthModal(true)}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 shadow-md ${plan.buttonColor}`}
                    >
                      {user ? (plan.isPro ? 'ترقية الخطة' : 'الخطة الحالية') : plan.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6 opacity-80">
            <span className="font-black text-2xl">InfluTools</span>
          </div>
          <p className="text-slate-400 mb-8">جميع الحقوق محفوظة © 2024</p>
        </div>
      </footer>

      {/* Floating Action Button for Voice Assistant */}
      <button 
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-8 left-8 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce-slow"
        aria-label="Start Voice Assistant"
      >
        <MicIcon className="w-8 h-8" />
      </button>

      {/* Tool Runner Modal */}
      {activeTool && (
        <ToolRunner 
          tool={activeTool} 
          onClose={() => setActiveTool(null)}
          currentUser={user}
        />
      )}

      {/* Voice Assistant Modal */}
      {showAssistant && (
        <LiveAssistant 
          onClose={() => setShowAssistant(false)} 
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;
