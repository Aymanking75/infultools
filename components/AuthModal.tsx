import React, { useState } from 'react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  updateUserProfile,
  sendUserVerification
} from '../services/firebase';
import { XIcon, GoogleIcon, SparklesIcon, MailIcon, CheckIcon } from './Icons';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for verification success message
  const [showVerificationSent, setShowVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login Flow
        await loginWithEmail(email, password);
        onClose();
      } else {
        // Registration Flow
        if (!name.trim()) {
            throw new Error("يرجى إدخال الاسم");
        }
        
        // 1. Create User
        const cred = await registerWithEmail(email, password);
        
        // 2. Update Profile (Name)
        await updateUserProfile(cred.user, { displayName: name });
        
        // 3. Send Verification Email
        await sendUserVerification(cred.user);
        
        // 4. Show Success Screen
        setShowVerificationSent(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("البريد الإلكتروني مسجل مسبقاً");
      } else if (err.code === 'auth/weak-password') {
        setError("كلمة المرور ضعيفة جداً");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError("فشل تسجيل الدخول باستخدام Google");
    } finally {
      setLoading(false);
    }
  };

  // --- Success / Verification View ---
  if (showVerificationSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up p-8 text-center m-auto">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailIcon className="w-10 h-10 text-green-600" />
             </div>
             
             <h2 className="text-2xl font-black text-gray-800 mb-3">
               تم إنشاء الحساب بنجاح!
             </h2>
             
             <p className="text-gray-600 mb-6 leading-relaxed">
               لقد أرسلنا رابط تفعيل إلى بريدك الإلكتروني: <br/>
               <span className="font-bold text-gray-800 break-all">{email}</span>
             </p>

             <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-8 flex items-start gap-3 text-right">
                <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>يرجى فحص صندوق الوارد (والمهملات) والنقر على الرابط لتأكيد حسابك قبل المتابعة.</span>
             </div>

             <button 
               onClick={() => {
                   setShowVerificationSent(false);
                   setIsLogin(true); // Switch to login mode
               }}
               className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all"
             >
               العودة لتسجيل الدخول
             </button>
        </div>
      </div>
    );
  }

  // --- Main Auth Form ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up m-auto">
        
        {/* Header */}
        <div className="relative p-6 md:p-8 pb-0 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="inline-flex p-3 bg-purple-50 rounded-2xl mb-4">
             <SparklesIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">
            {isLogin ? 'أهلاً بعودتك!' : 'انضم إلينا'}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'سجل دخولك للمتابعة في InfluTools' : 'أنشئ حسابك وابدأ رحلة صناعة المحتوى'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm md:text-base"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>المتابعة باستخدام Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-sm text-gray-400 absolute">أو</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show Name Field ONLY if Registering */}
            {!isLogin && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                  placeholder="مثال: أحمد محمد"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     جاري المعالجة...
                  </>
              ) : (
                  isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
              )}
            </button>
          </form>

          {/* Switcher */}
          <div className="text-center text-sm text-gray-600">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button 
              onClick={() => { 
                  setIsLogin(!isLogin); 
                  setError(null); 
                  setName('');
                  setEmail('');
                  setPassword('');
              }}
              className="text-purple-600 font-bold hover:underline"
            >
              {isLogin ? 'سجل الآن' : 'سجل دخول'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
