import React from 'react';
import { ToolDef, ToolType, PricingPlan } from './types';
import { 
  PencilIcon, 
  HashIcon, 
  FileTextIcon, 
  LightbulbIcon,
  ImageIcon
} from './components/Icons';

export const TOOLS: ToolDef[] = [
  {
    id: ToolType.OPTIMIZER,
    title: "محسن الوصف والعنوان",
    description: "حسن وصفك لترتيب أكبر في نتائج البحث",
    icon: <PencilIcon className="w-8 h-8 text-blue-500" />,
    inputLabel: "عن ماذا يتحدث الفيديو الخاص بك؟",
    inputPlaceholder: "مثال: روتين صباحي، شرح البرمجة للمبتدئين...",
    color: "bg-blue-50",
    promptTemplate: (input) => `قم بدور خبير SEO ومنشئ محتوى على يوتيوب.
المهمة: اكتب 5 عناوين جذابة (Click-worthy) ووصف فيديو محسن لمحركات البحث (SEO) بناءً على الموضوع التالي.
الموضوع: ${input}

الناتج يجب أن يكون باللغة العربية ومنسق بشكل جميل.
تنسيق الناتج:
**العناوين المقترحة:**
1. ...
2. ...

**الوصف المقترح:**
...`
  },
  {
    id: ToolType.HASHTAGS,
    title: "مولد هاشتاقات",
    description: "ابحث عن الهاشتاقات الشائعة والمتخصصة لزيادة الوصول والمشاركة",
    icon: <HashIcon className="w-8 h-8 text-indigo-500" />,
    inputLabel: "ما هو مجال محتواك؟",
    inputPlaceholder: "مثال: طبخ، تقنية، رياضة...",
    color: "bg-indigo-50",
    promptTemplate: (input) => `قم بدور خبير تسويق عبر وسائل التواصل الاجتماعي.
المهمة: استخرج قائمة بأفضل 30 هاشتاق (Hashtags) نشط وترند حالياً للمجال التالي: "${input}"

المخرجات المطلوبة:
يجب أن يكون الرد بصيغة JSON فقط (بدون أي نصوص إضافية أو علامات markdown) بالشكل التالي:
{
  "high": ["#tag1", "#tag2", ...],
  "medium": ["#tag3", "#tag4", ...],
  "niche": ["#tag5", "#tag6", ...]
}

حيث:
- high: هاشتاقات عالية المنافسة (High Volume).
- medium: هاشتاقات متوسطة المنافسة.
- niche: هاشتاقات دقيقة ومتخصصة جداً.`
  },
  {
    id: ToolType.SCRIPT,
    title: "كاتب سكريبت ريلز",
    description: "اكتب سكريبت إبداعي للريلز وتيك توك",
    icon: <FileTextIcon className="w-8 h-8 text-purple-500" />,
    inputLabel: "ما هي فكرة الفيديو؟",
    inputPlaceholder: "مثال: 5 نصائح لتصوير فيديو احترافي...",
    color: "bg-purple-50",
    promptTemplate: (input) => `قم بدور كاتب سكريبتات محترف لمنصات الفيديو القصيرة (TikTok, Reels, Shorts).
المهمة: اكتب سكريبت فيديو قصير مدته 60 ثانية للموضوع التالي.
الموضوع: ${input}

السكريبت يجب أن يحتوي على:
1. خطاف بصري/سمعي (Hook) في أول 3 ثواني.
2. المحتوى القيم (Value) بشكل مختصر وسريع.
3. دعوة لاتخاذ إجراء (Call to Action).

استخدم لهجة عامية بيضاء أو فصحى بسيطة وجذابة.`
  },
  {
    id: ToolType.IDEAS,
    title: "مولد أفكار المحتوى",
    description: "احصل على أفكار إبداعية لجمهورك",
    icon: <LightbulbIcon className="w-8 h-8 text-yellow-500" />,
    inputLabel: "من هو جمهورك المستهدف؟",
    inputPlaceholder: "مثال: طلاب الجامعات، المهتمين باللياقة البدنية...",
    color: "bg-yellow-50",
    promptTemplate: (input) => `قم بدور استراتيجي محتوى.
المهمة: اقترح 10 أفكار فيديوهات مبتكرة وغير تقليدية للجمهور المستهدف التالي.
الجمهور/المجال: ${input}

لكل فكرة، اكتب سطر واحد يشرح لماذا ستنتشر هذه الفكرة (Viral Potential).`
  },
  {
    id: ToolType.IMAGE,
    title: "مصمم الصور (AI)",
    description: "حول كلماتك إلى لوحات فنية مذهلة",
    icon: <ImageIcon className="w-8 h-8 text-rose-500" />,
    inputLabel: "تخيل الصورة واكتب وصفها",
    inputPlaceholder: "مثال: رائد فضاء يركب حصاناً على المريخ بأسلوب سايبر بانك، إضاءة نيون...",
    color: "bg-rose-50",
    promptTemplate: (input) => input // For Image Gen, we use the input directly
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: "مجانية",
    price: "0",
    period: "/ شهر",
    features: [
      "5 استخدامات يومياً",
      "إعلانات محدودة",
      "وصول للأدوات الأساسية",
      "دعم فني عبر المجتمع"
    ],
    isPro: false,
    buttonText: "ابدأ الآن",
    buttonColor: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "برو",
    price: "5",
    period: "/ شهر",
    features: [
      "استخدام غير محدود",
      "بدون إعلانات",
      "وصول مبكر للميزات الجديدة",
      "دعم فني مباشر"
    ],
    isPro: true,
    buttonText: "اشترك الآن",
    buttonColor: "bg-rose-500 hover:bg-rose-600"
  }
];
