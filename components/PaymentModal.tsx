import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PricingPlan } from '../types';
import { XIcon, CheckIcon, CreditCardIcon } from './Icons';
import { upgradeUserToPro, verifyPaymentWithBackend } from '../services/firebase';
import { User } from 'firebase/auth';

interface PaymentModalProps {
  plan: PricingPlan;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, user, onClose, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Get Client ID from Env or use a sandbox placeholder for demo
  // IMPORTANT: Replace 'test' with your actual Production Client ID from PayPal Developer Dashboard
  const initialOptions = {
    clientId: process.env.PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const handleApprove = async (data: any, actions: any) => {
    try {
      setError(null);
      setProcessing(true); // Start loading UI
      
      // 1. Capture Payment from PayPal
      const order = await actions.order.capture();
      console.log("Payment Captured:", order);

      // 2. Verify with Backend (Secure Step)
      const token = await user.getIdToken();
      await verifyPaymentWithBackend(token, order.id);
      
      // 3. Update User in Database
      await upgradeUserToPro(user.uid, order);
      
      setSuccess(true);
      
      // Close after delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3500);
      
    } catch (err) {
      console.error("Payment Error:", err);
      setError("حدث خطأ أثناء معالجة الدفع أو التحقق منه. يرجى المحاولة مرة أخرى.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative transition-all">
        
        {/* Loading Overlay */}
        {processing && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">جاري تفعيل الاشتراك...</h3>
                <p className="text-gray-500 text-sm">يرجى الانتظار وعدم إغلاق النافذة</p>
            </div>
        )}

        {/* Close Button */}
        {!success && !processing && (
            <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
            <XIcon className="w-5 h-5 text-gray-600" />
            </button>
        )}

        {success ? (
          <div className="p-12 text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
              <CheckIcon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">تم الدفع بنجاح!</h2>
            <p className="text-gray-500 text-lg mb-6">
              شكراً لاشتراكك، {user.displayName?.split(' ')[0]}.<br/>
              تم تفعيل ميزات <strong>{plan.title}</strong> في حسابك فوراً.
            </p>
            <div className="w-full bg-gray-50 rounded-xl p-4 text-xs text-gray-400">
                سيتم إعادة توجيهك تلقائياً...
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <h2 className="text-2xl font-bold mb-2 relative z-10">تأكيد الاشتراك</h2>
               <div className="flex items-center justify-center gap-2 text-purple-100 relative z-10 bg-white/10 backdrop-blur-md inline-block px-4 py-1 rounded-full text-sm">
                  <CreditCardIcon className="w-4 h-4" />
                  <span>دفع آمن ومحمي 100%</span>
               </div>
            </div>

            {/* Plan Summary */}
            <div className="p-8 pb-4">
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 flex justify-between items-center mb-6 shadow-sm">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{plan.title}</h3>
                        <p className="text-gray-500 text-sm">وصول شامل لكل الأدوات</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-black text-purple-600">{plan.price}$</span>
                        <span className="text-gray-400 text-xs">/ شهر</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 text-center flex items-center gap-2 justify-center">
                        <span className="font-bold">تنبيه:</span> {error}
                    </div>
                )}
                
                {/* PayPal Buttons */}
                <div className="relative z-0 min-h-[150px]">
                    <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons 
                            style={{ layout: "vertical", shape: "rect", label: "pay", height: 48 }} 
                            disabled={processing}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "USD",
                                                value: plan.price, 
                                            },
                                            description: `InfluTools ${plan.title} Subscription`
                                        },
                                    ],
                                });
                            }}
                            onApprove={handleApprove}
                            onError={(err) => {
                                console.error(err);
                                setError("تعذر الاتصال ببوابة الدفع. تأكد من اتصال الإنترنت.");
                            }}
                        />
                    </PayPalScriptProvider>
                </div>
            </div>
            
            <div className="p-6 text-center space-y-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500">
                    بالنقر على الدفع، أنت توافق على <a href="#" className="text-purple-600 underline">شروط الخدمة</a>.
                </p>
                <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {/* Simulated Card Logos */}
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;