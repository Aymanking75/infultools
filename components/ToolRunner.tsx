import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ToolDef, ToolType } from '../types';
import { generateToolContent, generateImage } from '../services/geminiService';
import { saveHistory } from '../services/firebase';
import { XIcon, SparklesIcon, ArrowRightIcon, DownloadIcon, ImageIcon, HashIcon, CheckIcon } from './Icons';
import { User } from 'firebase/auth';

interface ToolRunnerProps {
  tool: ToolDef;
  onClose: () => void;
  currentUser: User | null;
}

const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, onClose, currentUser }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // Image specific state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const isImageTool = tool.id === ToolType.IMAGE;

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    setImageUrl(null);
    setStatusMessage('');
    setCopyFeedback(false);

    try {
      if (isImageTool) {
        if (!input.trim()) {
            alert("يرجى كتابة وصف للصورة");
            setLoading(false);
            return;
        }

        setStatusMessage("جاري تخيل الصورة ورسمها...");
        
        const imageResult = await generateImage(input);
        
        if (imageResult) {
            setImageUrl(imageResult);
            // Save to Cloud
            if (currentUser) {
                saveHistory(currentUser.uid, tool.id, input, "image_generated", 'image');
            }
        } else {
            alert("فشل إنشاء الصورة. حاول مرة أخرى.");
        }

      } else {
        // Text Tools
        if (!input.trim()) return;
        const prompt = tool.promptTemplate(input);
        const content = await generateToolContent(prompt);
        setResult(content);
        
        // Save to Cloud
        if (currentUser) {
            saveHistory(currentUser.uid, tool.id, input, content, 'text');
        }
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("حدث خطأ أثناء المعالجة.");
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  // Helper for Hashtag Parsing
  const parseHashtags = (jsonString: string) => {
    try {
      const cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return null;
    }
  };

  const renderHashtags = (resultText: string) => {
    const tags = parseHashtags(resultText);
    
    // If parsing fails, fall back to markdown
    if (!tags) return <ReactMarkdown>{resultText}</ReactMarkdown>;

    const allTags = [...(tags.high||[]), ...(tags.medium||[]), ...(tags.niche||[])].join(' ');
    
    const copyAll = () => {
       navigator.clipboard.writeText(allTags);
       setCopyFeedback(true);
       setTimeout(() => setCopyFeedback(false), 2000);
    };

    return (
      <div className="space-y-6">
         {/* Actions Header */}
         <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100 gap-4">
            <div className="text-center sm:text-right">
               <h3 className="font-bold text-indigo-900 text-lg">الهاشتاقات المولدة</h3>
               <p className="text-sm text-indigo-600/80">
                 {[(tags.high||[]).length, (tags.medium||[]).length, (tags.niche||[]).length].reduce((a:number,b:number)=>a+b,0)} هاشتاق جاهز للنسخ
               </p>
            </div>
            <button 
              onClick={copyAll}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto justify-center
                ${copyFeedback ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              `}
            >
              {copyFeedback ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  تم النسخ بنجاح
                </>
              ) : (
                <>
                  <HashIcon className="w-5 h-5" />
                  نسخ جميع الهاشتاقات
                </>
              )}
            </button>
         </div>

         {/* High Competition */}
         {tags.high && tags.high.length > 0 && (
           <div className="animate-fade-in">
             <h4 className="text-sm font-bold text-rose-600 mb-3 flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></span>
               منافسة عالية (High Volume)
             </h4>
             <div className="flex flex-wrap gap-2">
               {tags.high.map((tag: string, i: number) => (
                 <button 
                    key={i} 
                    onClick={() => navigator.clipboard.writeText(tag)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-all cursor-pointer active:scale-95"
                    title="اضغط للنسخ"
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* Medium Competition */}
         {tags.medium && tags.medium.length > 0 && (
           <div className="animate-fade-in delay-75">
             <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
               منافسة متوسطة (Medium Volume)
             </h4>
             <div className="flex flex-wrap gap-2">
               {tags.medium.map((tag: string, i: number) => (
                 <button 
                    key={i} 
                    onClick={() => navigator.clipboard.writeText(tag)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all cursor-pointer active:scale-95"
                    title="اضغط للنسخ"
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </div>
         )}

          {/* Niche */}
         {tags.niche && tags.niche.length > 0 && (
           <div className="animate-fade-in delay-100">
             <h4 className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
               متخصصة (Niche)
             </h4>
             <div className="flex flex-wrap gap-2">
               {tags.niche.map((tag: string, i: number) => (
                 <button 
                    key={i} 
                    onClick={() => navigator.clipboard.writeText(tag)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all cursor-pointer active:scale-95"
                    title="اضغط للنسخ"
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm touch-none">
      <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className={`p-4 md:p-6 border-b flex justify-between items-center ${tool.color} flex-shrink-0`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm">
              {tool.icon}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{tool.title}</h2>
              <p className="text-xs md:text-sm text-gray-600 truncate">{tool.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 overscroll-contain">
          
          {/* Text Input Section (Used for both text tools and image prompt) */}
          <div className="space-y-3">
            <label className="block text-base md:text-lg font-medium text-gray-700">
              {tool.inputLabel}
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tool.inputPlaceholder}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all min-h-[120px] text-base md:text-lg resize-none"
                disabled={loading}
              />
              <div className="absolute bottom-3 left-3 text-gray-400 text-xs">
                {input.length} حرف
              </div>
            </div>
          </div>
          
          {isImageTool && (
             <div className="bg-purple-50 p-3 rounded-lg text-xs md:text-sm text-purple-800 flex items-start gap-2">
                <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>يتم توليد الصور باستخدام نموذج Gemini 2.5 Image القوي.</p>
             </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]
              ${(loading || !input.trim()) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-200'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {statusMessage || 'جاري المعالجة...'}
              </>
            ) : (
              <>
                {isImageTool ? <ImageIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                {isImageTool ? 'توليد الصورة' : 'توليد المحتوى'}
              </>
            )}
          </button>

          {/* Result Section (Text & Hashtags) */}
          {!isImageTool && result && (
            <div className="mt-8 animate-fade-in pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                   <h3 className="text-xl font-bold text-gray-800">النتيجة:</h3>
                </div>
                {currentUser && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">محفوظ</span>
                )}
              </div>
              
              {tool.id === ToolType.HASHTAGS ? (
                // Specialized UI for Hashtags
                renderHashtags(result)
              ) : (
                // Standard UI for other tools
                <>
                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100 prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-800 text-sm md:text-base">
                     <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        setCopyFeedback(true);
                        setTimeout(() => setCopyFeedback(false), 2000);
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 text-sm"
                    >
                      {copyFeedback ? (
                          <>
                             <CheckIcon className="w-4 h-4" />
                             تم النسخ
                          </>
                      ) : (
                          <>
                             نسخ النص
                             <ArrowRightIcon className="w-4 h-4 rotate-180" />
                          </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Result Section (Image) */}
          {isImageTool && imageUrl && (
             <div className="mt-8 animate-fade-in space-y-4 pb-4">
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <div className="h-8 w-1 bg-rose-500 rounded-full"></div>
                     <h3 className="text-xl font-bold text-gray-800">تم إنشاء الصورة!</h3>
                  </div>
                  {currentUser && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">محفوظ</span>
                  )}
               </div>
               
               <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-lg border border-gray-200 group">
                  <img 
                     src={imageUrl} 
                     alt="Generated" 
                     className="w-full h-auto object-cover"
                  />
               </div>

               <a 
                 href={imageUrl} 
                 download="generated-image.png"
                 className="block w-full text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
               >
                 <DownloadIcon className="w-5 h-5" />
                 تحميل الصورة
               </a>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ToolRunner;
