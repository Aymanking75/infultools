import React, { useState } from 'react';
import { SparklesIcon, UserIcon, LogOutIcon, MenuIcon, XIcon, ArrowRightIcon } from './Icons';
import { User } from 'firebase/auth';
import { logoutUser } from '../services/firebase';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer relative z-50" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <SparklesIcon className="h-8 w-8 text-white bg-purple-600 p-1.5 rounded-lg" />
              <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                InfluTools
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a 
                href="#" 
                onClick={(e) => scrollToSection(e, 'top')} 
                className="text-gray-900 font-bold hover:text-purple-600 transition-colors"
              >
                الرئيسية
              </a>
              <a 
                href="#tools" 
                onClick={(e) => scrollToSection(e, 'tools')} 
                className="text-gray-600 font-medium hover:text-purple-600 transition-colors"
              >
                الأدوات
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => scrollToSection(e, 'pricing')} 
                className="text-gray-600 font-medium hover:text-purple-600 transition-colors"
              >
                التسعير
              </a>
            </div>

            {/* User / CTA (Desktop + Mobile Trigger) */}
            <div className="flex items-center gap-3">
              {/* User Profile (Desktop) */}
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="flex items-center gap-3 pl-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-sm font-bold">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="User" 
                          className="w-9 h-9 rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={logoutUser}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="تسجيل الخروج"
                    >
                      <LogOutIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onOpenAuth}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    تسجيل دخول
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center z-50">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                  aria-label="Toggle menu"
                >
                   <MenuIcon className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-white bg-purple-600 p-1 rounded-md" />
              <span className="font-bold text-lg text-gray-900">InfluTools</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {/* User Info Section (Mobile) */}
           {user ? (
              <div className="bg-purple-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                 ) : (
                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                     <UserIcon className="w-6 h-6" />
                   </div>
                 )}
                 <div className="overflow-hidden">
                   <p className="font-bold text-gray-900 truncate">{user.displayName || "مستخدم"}</p>
                   <p className="text-xs text-gray-500 truncate">{user.email}</p>
                 </div>
              </div>
           ) : (
              <div className="mb-6">
                <button 
                  onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-5 h-5" />
                  تسجيل دخول / حساب جديد
                </button>
              </div>
           )}

           <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">القائمة</p>
              <a 
                href="#" 
                onClick={(e) => scrollToSection(e, 'top')} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                 <span>الرئيسية</span>
                 <ArrowRightIcon className="w-4 h-4 text-gray-400 rotate-180" />
              </a>
              <a 
                href="#tools" 
                onClick={(e) => scrollToSection(e, 'tools')} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                 <span>الأدوات</span>
                 <ArrowRightIcon className="w-4 h-4 text-gray-400 rotate-180" />
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => scrollToSection(e, 'pricing')} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                 <span>التسعير</span>
                 <ArrowRightIcon className="w-4 h-4 text-gray-400 rotate-180" />
              </a>
           </div>
        </div>

        {/* Drawer Footer */}
        {user && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
             <button 
                onClick={() => { logoutUser(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-3 rounded-xl font-bold transition-colors"
             >
                <LogOutIcon className="w-5 h-5" />
                تسجيل الخروج
             </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;