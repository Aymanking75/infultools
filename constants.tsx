import React from 'react';
import { ToolDef, ToolType, PricingPlan } from './types';
import { 
  PencilIcon, 
  HashIcon, 
  FileTextIcon, 
  LightbulbIcon,
  ImageIcon,
  ShoppingBagIcon,
  MonitorIcon,
  VideoIcon,
  CodeIcon,
  CheckIcon,
  GlobeIcon
} from './components/Icons';

export const TOOLS: ToolDef[] = [
  {
    id: ToolType.LANDING_PAGE,
    title: "منشئ صفحات الهبوط",
    description: "صمم صفحات بيع احترافية (Landing Pages) عالية التحويل لمنتجك بضغطة زر",
    icon: <MonitorIcon className="w-8 h-8 text-pink-500" />,
    inputLabel: "ما هو المنتج أو العرض الذي تريد تسويقه؟",
    inputPlaceholder: "مثال: كورس لتعلم اللغة الإنجليزية، مكمل غذائي، تطبيق لتنظيم الوقت...",
    color: "bg-pink-50",
    modelName: "gemini-3-pro-preview",
    promptTemplate: (input) => `Act as an Expert UI/UX Designer and Frontend Developer.
Task: Create a HIGH-CONVERSION Single-Page Landing Page for: "${input}"

### 🎨 Design Requirements:
1. **Framework:** HTML5 + Tailwind CSS (CDN).
2. **Language:** Arabic (dir="rtl"), Font: 'Cairo'.
3. **Style:** Modern, Clean, "Glassmorphism" touches, Soft Shadows, Gradient Buttons.
4. **Responsiveness:** Fully mobile-responsive.

### 🏗️ Page Structure (Sections):
1. **Navbar:** Logo (InfluTools style) & CTA Button.
2. **Hero Section:** 
   - Powerful Headline & Subheadline.
   - Primary CTA Button (High contrast).
   - Hero Image (Use a high-quality placeholder from placehold.co/600x400).
3. **Social Proof:** "Trusted by" logos strip (gray scale).
4. **Features/Benefits:** 3-4 cards with icons describing key benefits, not just features.
5. **Testimonials:** 3 realistic reviews with star ratings.
6. **FAQ Section:** Accordion style (Use simple inline JS for toggling).
7. **Final CTA:** A strong closing section encouraging purchase/signup.
8. **Footer:** Simple copyright and links.

### 📦 Output Format:
- Return **ONLY** the raw HTML code block.
- Include all CSS/JS inside the file (Single File Component).
- Do not use external CSS files other than Tailwind CDN.
- Use FontAwesome for icons.`
  },
  {
    id: ToolType.WEBSITE,
    title: "المبرمج الذكي (كود)",
    description: "أنشئ مواقع، قواعد بيانات (SQL)، وسكريبتات (Python/PHP) فوراً",
    icon: <CodeIcon className="w-8 h-8 text-emerald-500" />,
    inputLabel: "ماذا تريد أن تبرمج اليوم؟",
    inputPlaceholder: "مثال: صفحة هبوط لبيع العطور، كود بايثون لتحليل البيانات، جدول MySQL...",
    color: "bg-emerald-50",
    modelName: "gemini-3-pro-preview",
    promptTemplate: (input) => `Act as an Expert Full Stack Developer, UI/UX Designer, and Code Wizard.
Your Goal: Generate the BEST possible code solution for the user's request: "${input}"

### 🚀 Rules for WEBSITES / LANDING PAGES:
1. **Design Quality:** Create a stunning, modern, production-ready Single-File Application. Use gradients, glassmorphism, soft shadows, and rounded corners (rounded-2xl).
2. **Tech Stack:** HTML5 + Tailwind CSS (via CDN) + FontAwesome (CDN) + Vanilla JS.
3. **Responsive:** Mobile-first approach is mandatory.
4. **Arabic Support:** If the input implies Arabic, YOU MUST:
   - Add \`dir="rtl"\` to the \`<html>\` tag.
   - Use the 'Cairo' font from Google Fonts.
   - Ensure all text is in professional Arabic.
5. **Structure:** 
   - **Hero Section:** Engaging headline, subheadline, CTA button, and a visual placeholder (use https://placehold.co/600x400/e2e8f0/475569).
   - **Features Section:** Grid layout with icons.
   - **Footer:** Professional layout.
   - **Color Palette:** Use modern Indigo/Purple/Slate combinations unless specified otherwise.

### 🐍 Rules for Python / PHP / SQL / Other:
1. **Efficiency:** Write clean, optimized, and secure code.
2. **Comments:** Add helpful comments explaining complex logic.
3. **Completeness:** Include all necessary imports.

### 📦 Output Format:
1. Start directly with the code block.
2. Use Markdown code blocks: \`\`\`html ... \`\`\` or \`\`\`python ... \`\`\`.
3. After the code, provide a very brief (1-2 sentences) guide on how to use it.
`
  },
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
    id: ToolType.OUTLINE,
    title: "مولد هيكل الفيديو",
    description: "نظم أفكارك واحصل على هيكل متكامل لفيديوهاتك الطويلة",
    icon: <VideoIcon className="w-8 h-8 text-red-500" />,
    inputLabel: "ما هو عنوان أو موضوع الفيديو؟",
    inputPlaceholder: "مثال: مراجعة شاملة لآيفون 15 برو ماكس...",
    color: "bg-red-50",
    promptTemplate: (input) => `قم بدور صانع محتوى خبير على يوتيوب.
المهمة: كتابة هيكل تفصيلي (Video Outline) لفيديو يوتيوب طويل حول الموضوع: "${input}"

المخرجات المطلوبة:
1. **العنوان المقترح:** عنوان جذاب (Clickbait بسماكة مقبولة).
2. **المقدمة (Intro):**
   - الخطاف (Hook): جملة افتتاحية قوية.
   - الوعد (The Promise): ماذا سيتعلم المشاهد.
3. **جسم الفيديو (The Body):**
   - قسم الفيديو إلى نقاط رئيسية أو فصول (Chapters).
   - لكل نقطة، اذكر الفكرة الأساسية ومثال توضيحي.
4. **الخاتمة (Conclusion):**
   - ملخص سريع.
   - سؤال للمشاهدين (لزيادة التعليقات).
   - دعوة للاشتراك (CTA).`
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
    id: ToolType.STORE,
    title: "منشئ خطط المتاجر",
    description: "خطط لمتجرك القادم: اسم، منتجات، وتسويق",
    icon: <ShoppingBagIcon className="w-8 h-8 text-orange-500" />,
    inputLabel: "ما هو نوع المنتجات أو النيش؟",
    inputPlaceholder: "مثال: ملابس رياضية مستدامة، إكسسوارات قهوة...",
    color: "bg-orange-50",
    promptTemplate: (input) => `قم بدور خبير تجارة إلكترونية وريادة أعمال.
المهمة: قم بإنشاء خطة عمل مبدئية لمتجر إلكتروني بناءً على المجال/النيش التالي: "${input}"

المخرجات المطلوبة (باللغة العربية، منسقة ومفصلة):
1. **اسم المتجر (Brand Name):** اقترح 3 أسماء رنانة ومميزة (عربي أو إنجليزي معرب) مع سبب التسمية.
2. **الشعار اللفظي (Slogan):** عبارة تسويقية قصيرة.
3. **لوحة الألوان (Color Palette):** اقترح 3 ألوان رئيسية (Hex Codes) تعكس هوية العلامة التجارية ونفسية المستهلك.
4. **المنتجات المقترحة (Product Line):** قائمة بـ 5 منتجات رئيسية للبدء بها، مع وصف جذاب وسعر مقترح تقريبي.
5. **استراتيجية التسويق:** 3 أفكار لتسويق المتجر عبر انستجرام وتيك توك.`
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