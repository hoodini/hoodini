/* =============================================================================
 *  YUV.AI — סקר קהילת AI סגורה
 *  קובץ הגדרות + שאלות. זה הקובץ היחיד שצריך לערוך כדי לשנות תוכן / קישורים.
 * ============================================================================= */

const CONFIG = {
  /* ---- מיתוג ---- */
  brand: "YUV.AI",
  accent: "#7c5cff",        // צבע ההדגשה הראשי
  accent2: "#22d3ee",       // צבע משני (גרדיאנט)

  /* ---- איסוף תשובות ----
   * שלוש דרכים נתמכות. ראו survey/README.md להוראות מלאות.
   *   endpointType: "formspree" | "gas" | "generic" | ""(דמו)
   *   formEndpoint: כתובת ה־URL לשליחת התשובות.
   * אם משאירים formEndpoint ריק — הסקר רץ ב"מצב דמו": התשובות נשמרות
   * מקומית בדפדפן (localStorage) וניתן לייצא אותן ל־CSV דרך עמוד #admin.
   */
  endpointType: "",
  formEndpoint: "",

  /* ---- הקורס (מוצג בסיום למי שהשלים את הסקר) ---- */
  course: {
    name: "השליטה ב-Claude Desktop",
    // החליפו לכתובת הרכישה האמיתית של הקורס:
    url: "https://www.yuv.ai/",
    // קוד הקופון להנחה (יוצג למשתמש ויצורף לקישור):
    couponCode: "SURVEY10",
    discountText: "10% הנחה",
    appendCouponParam: "coupon", // הפרמטר שיתווסף ל-URL: ?coupon=SURVEY10. ריק = לא לצרף.
  },

  /* ---- מטה ---- */
  estimatedMinutes: 3,
  privacyNote: "אנחנו שומרים על הפרטיות שלך. הפרטים משמשים אך ורק כדי לעצב את הקהילה וליצור איתך קשר אם ביקשת.",
};

/* =============================================================================
 *  שאלות הסקר
 *  סוגי שאלות נתמכים:
 *   welcome   — מסך פתיחה
 *   single    — בחירה יחידה (מתקדם אוטומטית)
 *   multi     — בחירה מרובה (עם כפתור המשך, maxSelect אופציונלי)
 *   scale     — סולם מספרי (min..max)
 *   shorttext — טקסט קצר
 *   longtext  — טקסט ארוך
 *   email     — שם + אימייל
 *   statement — מסך מעבר/הסבר (ללא קלט)
 *   end       — מסך סיום + הקורס
 *
 *  שדות שימושיים: id, title, subtitle, required, options[{value,label,emoji}],
 *  allowOther(bool), maxSelect, placeholder, min/max/minLabel/maxLabel (scale),
 *  condition: fn(answers) => boolean  (האם להציג את השאלה).
 * ============================================================================= */

const QUESTIONS = [
  {
    type: "welcome",
    id: "welcome",
    title: "רגע לפני שאני פותח קהילת AI סגורה — אשמח לשמוע אותך 🙏",
    subtitle:
      "אני יובל. אני חוקר כלי AI וטכנולוגיות ויוצר על זה תוכן. אני שוקל לפתוח קהילה סגורה עם תוכן בלעדי ומענה אישי — ולפני הכל חשוב לי להבין מה אתם הכי מחפשים, כדי לבנות את זה נכון.\n\nזה ייקח כ-3 דקות. בסוף מחכה לכם מתנה קטנה כתודה 🎁",
  },

  /* ---------- מי אתם ---------- */
  {
    type: "single",
    id: "role",
    title: "מה הכי מתאר אותך?",
    required: true,
    allowOther: true,
    options: [
      { value: "dev", label: "מפתח/ת / מהנדס/ת", emoji: "👩‍💻" },
      { value: "founder", label: "יזם/ית / בעל/ת עסק", emoji: "🚀" },
      { value: "manager", label: "מנהל/ת / איש/אשת מוצר", emoji: "🧭" },
      { value: "pro", label: "מקצוען/ית לא-טכני (שיווק, עיצוב, ייעוץ...)", emoji: "🎯" },
      { value: "researcher", label: "חוקר/ת / אקדמיה", emoji: "🔬" },
      { value: "student", label: "סטודנט/ית / בתחילת הדרך", emoji: "🎓" },
    ],
  },
  {
    type: "single",
    id: "ai_level",
    title: "כמה את/ה עוסק/ת ב-AI ביום-יום?",
    required: true,
    options: [
      { value: "curious", label: "סקרן/ית — מתחיל/ה להתנסות", emoji: "🌱" },
      { value: "regular", label: "משתמש/ת קבוע/ה בכלים", emoji: "⚡" },
      { value: "builder", label: "בונה דברים עם AI (קוד / סוכנים / אוטומציות)", emoji: "🛠️" },
      { value: "pro", label: "זה חלק מהותי מהעבודה / העסק שלי", emoji: "💼" },
    ],
  },

  /* ---------- הליבה: מה תחפשו בקהילה ---------- */
  {
    type: "statement",
    id: "intro_core",
    title: "הלב של הסקר ❤️",
    subtitle:
      "השאלות הבאות עוזרות לי להבין מה באמת יהיה בעל ערך בשבילך בקהילה כזו — לפני שאני בכלל שואל אם תרצה להצטרף.",
    cta: "יאללה",
  },
  {
    type: "multi",
    id: "join_motivation",
    title: "אם הייתה נפתחת קהילת AI סגורה — מה הכי היה גורם לך להצטרף?",
    subtitle: "אפשר לבחור כמה שרלוונטי",
    required: true,
    allowOther: true,
    options: [
      { value: "exclusive", label: "תוכן בלעדי ומעמיק שלא מתפרסם בחוץ", emoji: "🔒" },
      { value: "access", label: "מענה אישי ומהיר ממומחה כשאני נתקע", emoji: "💬" },
      { value: "network", label: "נטוורקינג עם אנשים איכותיים בתחום", emoji: "🤝" },
      { value: "early", label: "גישה מוקדמת לכלים, מדריכים ותבניות", emoji: "🎁" },
      { value: "live", label: "סדנאות והדרכות חיות", emoji: "🎥" },
      { value: "feedback", label: "עזרה וביקורת על הפרויקטים שלי", emoji: "🧪" },
      { value: "updates", label: "להישאר מעודכן/ת ולא לפספס כלום", emoji: "📡" },
    ],
  },
  {
    type: "multi",
    id: "topics",
    title: "באילו נושאים תרצה/י שנתמקד?",
    subtitle: "אלה הנושאים שאני הכי אוהב לחקור — סמן/י מה שמדבר אליך",
    required: true,
    allowOther: true,
    options: [
      { value: "local_llm", label: "הרצת LLM מקומית (Ollama / llama.cpp)", emoji: "🏠" },
      { value: "finetune", label: "אימון וכיוונון מודלים (fine-tuning)", emoji: "🎚️" },
      { value: "infra", label: "תכנון תשתית AI לוקאלית ומאובטחת לארגון", emoji: "🛡️" },
      { value: "agents", label: "סוכני AI ואוטומציות", emoji: "🤖" },
      { value: "rag", label: "RAG ובניית מערכות ידע", emoji: "📚" },
      { value: "privacy", label: "פרטיות ואבטחת מידע ב-AI", emoji: "🔐" },
      { value: "coding", label: "Vibe coding וכלי קוד מבוססי AI", emoji: "💻" },
      { value: "prompting", label: "פרומפטינג מתקדם", emoji: "✍️" },
      { value: "tools", label: "מודלים וכלים חדשים — סקירות וביקורת", emoji: "🧰" },
    ],
  },
  {
    type: "multi",
    id: "format",
    title: "באיזה פורמט תוכן הכי תפיק/י ממנו ערך?",
    required: true,
    maxSelect: 3,
    subtitle: "עד 3 בחירות",
    options: [
      { value: "video", label: "וידאו והקלטות מעמיקות", emoji: "📹" },
      { value: "written", label: "מדריכים כתובים + קוד", emoji: "📝" },
      { value: "qa", label: "שיחות Q&A חיות", emoji: "🎙️" },
      { value: "workshops", label: "וובינרים וסדנאות", emoji: "🧑‍🏫" },
      { value: "chat", label: "צ'אט קהילתי שוטף", emoji: "💭" },
      { value: "templates", label: "ספריית תבניות וקוד מוכן לשימוש", emoji: "📦" },
    ],
  },
  {
    type: "single",
    id: "platform",
    title: "על איזו פלטפורמה הכי היית רוצה שהקהילה תתנהל?",
    subtitle: "איפה יהיה לך הכי נוח להיות חלק מהקהילה",
    required: true,
    allowOther: true,
    options: [
      { value: "whatsapp", label: "וואטסאפ", emoji: "🟢" },
      { value: "telegram", label: "טלגרם", emoji: "✈️" },
      { value: "discord", label: "דיסקורד", emoji: "🎮" },
      { value: "slack", label: "סלאק", emoji: "💼" },
      { value: "facebook", label: "קבוצת פייסבוק", emoji: "📘" },
      { value: "forum", label: "פורום / פלטפורמה ייעודית באתר (Skool/Circle וכו')", emoji: "🌐" },
      { value: "app", label: "אפליקציה ייעודית", emoji: "📱" },
      { value: "nopref", label: "אין לי העדפה — מה שיהיה הכי טוב", emoji: "🤷" },
    ],
  },

  /* ---------- קהילות בתשלום היום ---------- */
  {
    type: "single",
    id: "member_paid",
    title: "האם את/ה כרגע חבר/ה בקהילה אחת או יותר בתשלום?",
    subtitle: "כל סוג — מקצועית, לימודית, תחביב",
    required: true,
    options: [
      { value: "yes", label: "כן", emoji: "✅" },
      { value: "past", label: "הייתי בעבר אבל עזבתי", emoji: "↩️" },
      { value: "no", label: "לא, אף פעם", emoji: "🚫" },
    ],
  },
  {
    type: "shorttext",
    id: "paid_which",
    title: "באיזו קהילה/קהילות? (פלטפורמה או שם)",
    subtitle: "אופציונלי — עוזר לי להבין את הנוף",
    placeholder: "לדוגמה: Skool, Discord, Patreon, קהילה ישראלית...",
    required: false,
    condition: (a) => a.member_paid === "yes" || a.member_paid === "past",
  },
  {
    type: "longtext",
    id: "paid_best",
    title: "מה הדבר הכי טוב שאת/ה מקבל/ת שם?",
    placeholder: "מה גורם לזה להיות שווה את הכסף?",
    required: false,
    condition: (a) => a.member_paid === "yes" || a.member_paid === "past",
  },
  {
    type: "longtext",
    id: "paid_missing",
    title: "מה החיסרון הכי גדול, או מה חסר לך שם?",
    placeholder: "כאן בדיוק אני רוצה לעשות אחרת...",
    required: false,
    condition: (a) => a.member_paid === "yes" || a.member_paid === "past",
  },
  {
    type: "longtext",
    id: "no_paid_why",
    title: "מה היה גורם לך לשקול לשלם על קהילה בפעם הראשונה?",
    placeholder: "מה צריך לקרות כדי שזה ירגיש שווה?",
    required: false,
    condition: (a) => a.member_paid === "no",
  },

  /* ---------- נכונות לשלם ---------- */
  {
    type: "single",
    id: "willing_pay",
    title: "כמה היית מוכן/ה לשלם על חברות בקהילה כזו, בחודש?",
    required: true,
    options: [
      { value: "0", label: "לא הייתי משלם/ת", emoji: "🙅" },
      { value: "1-30", label: "עד ₪30", emoji: "🪙" },
      { value: "30-60", label: "₪30–60", emoji: "💵" },
      { value: "60-120", label: "₪60–120", emoji: "💳" },
      { value: "120-250", label: "₪120–250", emoji: "💎" },
      { value: "250+", label: "מעל ₪250", emoji: "👑" },
    ],
  },
  {
    type: "single",
    id: "billing",
    title: "איזה מודל תשלום הכי מתאים לך?",
    required: false,
    condition: (a) => a.willing_pay !== "0",
    options: [
      { value: "monthly", label: "מנוי חודשי", emoji: "🗓️" },
      { value: "annual", label: "מנוי שנתי בהנחה", emoji: "📆" },
      { value: "onetime", label: "תשלום חד-פעמי לגישה לכל החיים", emoji: "♾️" },
      { value: "perevent", label: "תשלום לפי סדנה/אירוע", emoji: "🎟️" },
    ],
  },

  /* ---------- עוצמת העניין ---------- */
  {
    type: "scale",
    id: "likelihood",
    title: "עד כמה סביר שתצטרף/י לקהילה כזו אם תיפתח?",
    required: true,
    min: 0,
    max: 10,
    minLabel: "ממש לא",
    maxLabel: "בוודאות",
  },
  {
    type: "longtext",
    id: "must_have",
    title: "מה הכי חשוב לך שיהיה בקהילה — משהו שעוד לא שאלתי עליו?",
    placeholder: "המקום שלך להשפיע ישירות על מה שאבנה 🙌",
    required: false,
  },

  /* ---------- עדכון כשהקהילה תיפתח ---------- */
  {
    type: "single",
    id: "want_updates",
    title: "רוצה שאעדכן אותך כשהקהילה תיפתח?",
    subtitle: "ללא ספאם — רק עדכון אחד כשזה קורה",
    required: true,
    options: [
      { value: "yes", label: "כן, עדכנו אותי 🔔", emoji: "🔔" },
      { value: "no", label: "לא תודה", emoji: "🙏" },
    ],
  },
  {
    type: "email",
    id: "contact",
    title: "לאן לשלוח את העדכון?",
    subtitle: CONFIG.privacyNote,
    required: true,
    condition: (a) => a.want_updates === "yes",
  },

  /* ---------- סיום + קורס ---------- */
  {
    type: "end",
    id: "end",
    title: "תודה ענקית! 🙏 התשובות שלך ממש יעזרו לי.",
    subtitle:
      "כתודה על ההשתתפות — קופון " +
      CONFIG.course.discountText +
      " לקורס שלי " +
      "“" + CONFIG.course.name + "”.",
  },
];
