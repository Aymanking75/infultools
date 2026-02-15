import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import IntroSlider from './components/IntroSlider'; // Changed from Hero
import HowItWorks from './components/HowItWorks';
import ToolRunner from './components/ToolRunner';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import { LiveAssistant } from './components/LiveAssistant';
import { TOOLS, PRICING_PLANS } from './constants';
import { ToolDef, PricingPlan } from './types';
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
  
  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  
  // Parallax Ref
  const dashboardParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (dashboardParallaxRef.current) {
        const scrollY = window.scrollY;
        // Subtle parallax: move element slightly up as user scrolls down (negative Y)
        // or create a drag effect (positive Y). 
        // Using a small negative factor (-0.03) creates a nice "floating/lift" depth effect.
        const translateY = scrollY * -0.03; 
        
        requestAnimationFrame(() => {
          if (dashboardParallaxRef.current) {
            dashboardParallaxRef.current.style.transform = `translateY(${translateY}px)`;
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToolClick = (tool: ToolDef) => {
    setActiveTool(tool);
  };

  const handlePlanClick = (plan: PricingPlan) => {
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    
    // If it's a free plan, just scroll to tools or do nothing
    if (!plan.isPro) {
        scrollToTools();
        return;
    }

    // Open Payment Modal for Pro plans
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-cairo pb-20">
      <Navbar 
        user={user} 
        onOpenAuth={() => setShowAuthModal(true)} 
      />
      
      {/* Replaced Hero with IntroSlider */}
      <IntroSlider onTryFree={scrollToTools} />

      <main className="space-y-0 relative">
        
        {/* Background Decorative Elements for the whole main area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px]"></div>
        </div>

        {/* How it Works Section - Added Here */}
        <HowItWorks />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Dashboard Container Wrapper for Parallax */}
          <div ref={dashboardParallaxRef} className="will-change-transform">
            <div 
              className="dashboard-container relative bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 animate-border-pulse px-8 py-12 md:px-14 md:py-16 space-y-24 overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_0_35px_5px_rgba(124,58,237,0.12)] hover:border-purple-200 hover:scale-[1.002]"
            >
              
              {/* Subtle internal shine effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-50"></div>

              {/* Tools Section */}
              <section id="tools" className="scroll-mt-32">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-purple-50 text-purple-700 text-sm font-bold border border-purple-100">
                    🚀 أدوات الذكاء الاصطناعي
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
                    أدواتنا الذكية
                  </h2>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    مجموعة متكاملة من الأدوات المدعومة بالذكاء الاصطناعي لمساعدتك في كل خطوة
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TOOLS.map((tool) => (
                    <div 
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-purple-200 cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 w-full h-1 ${tool.color.replace('bg-', 'bg-gradient-to-r from-transparent via-')}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                          {tool.icon}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                          <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
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
              <section id="pricing" className="scroll-mt-32">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-100">
                    💎 خطط الاشتراك
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
                    اختر الباقة المناسبة
                  </h2>
                  <p className="text-xl text-slate-500">ابدأ مجاناً وقم بالترقية عندما تحتاج للمزيد</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {PRICING_PLANS.map((plan, idx) => (
                    <div 
                      key={idx} 
                      className={`relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 group
                        ${plan.isPro 
                          ? 'shadow-2xl scale-100 md:scale-105 border-2 border-purple-500 z-10' 
                          : 'shadow-lg border border-slate-100 hover:shadow-xl hover:border-slate-200'}
                      `}
                    >
                      {plan.isPro && (
                        <div className="absolute top-0 inset-x-0 bg-purple-600 text-white text-center py-2 text-sm font-bold tracking-wider uppercase">
                          الأكثر طلباً
                        </div>
                      )}
                      <div className={`p-8 md:p-10 ${plan.isPro ? 'pt-12' : ''}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${plan.isPro ? 'text-purple-600' : 'text-slate-800'}`}>
                          {plan.title}
                        </h3>
                        <div className="flex items-baseline mb-8">
                          <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}$</span>
                          <span className="text-slate-500 mr-2 font-medium">{plan.period}</span>
                        </div>
                        
                        <div className="space-y-4 mb-10">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center text-slate-600 group-hover:text-slate-800 transition-colors">
                              <div className={`ml-3 p-1.5 rounded-full flex-shrink-0 ${plan.isPro ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                <CheckIconSvg className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => handlePlanClick(plan)}
                          className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95 ${plan.buttonColor}`}
                        >
                          {user ? (plan.isPro ? 'اشتراك / ترقية' : 'الخطة الحالية') : plan.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12">
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && user && (
        <PaymentModal 
            plan={selectedPlan}
            user={user}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
                // Optional: Refresh user state or show confetti
                console.log("Upgraded to Pro!");
            }}
        />
      )}
    </div>
  );
}

export default App;