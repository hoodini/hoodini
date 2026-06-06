# סקר קהילת AI סגורה — YUV.AI

סקר אינטראקטיבי בסגנון **Typeform** (שאלה אחת על המסך, ניווט במקלדת, RTL מלא),
שנבנה כדי לבדוק ביקוש לקהילת AI סגורה בתשלום — **ובעיקר להבין מה אנשים הכי
מחפשים בקהילה כזו** לפני שמקימים אותה.

אפליקציית ווב סטטית (HTML/CSS/JS), בלי תלויות ובלי build. אפשר לארח בכל מקום.

```
survey/
├─ index.html             # מעטפת הדף
├─ styles.css             # עיצוב (RTL, סגנון Typeform)
├─ app.js                 # מנוע הסקר
├─ config.js              # ← הקובץ היחיד לעריכה: שאלות, צבעים, קישור לקורס, יעד איסוף
├─ google-apps-script.gs  # backend אופציונלי לאיסוף ל-Google Sheet
└─ README.md
```

## הרצה מקומית

```bash
cd survey
python3 -m http.server 8000
# פותחים http://localhost:8000
```

## מה בסקר (מבנה השאלות)

1. **פתיחה** + הצגת המתנה בסיום.
2. **מי אתם** — תפקיד ורמת מעורבות ב-AI (פילוח המשיבים).
3. **הלב** — מה הכי היה גורם לך להצטרף, באילו נושאים להתמקד (מבוסס הנישה שלך:
   הרצת LLM לוקאלית, fine-tuning, תשתית מאובטחת, סוכנים, RAG...), באיזה פורמט,
   ועל איזו **פלטפורמה** (וואטסאפ / טלגרם / דיסקורד / סלאק / פייסבוק / פורום ייעודי).
4. **קהילות בתשלום היום** — האם חבר, באילו, מה הכי טוב שם, מה חסר/חיסרון
   (עם הסתעפות: למי שלא חבר נשאלת שאלה אחרת).
5. **נכונות לשלם** — כמה לחודש + מודל תשלום מועדף.
6. **עוצמת עניין** — סבירות הצטרפות בסולם 0–10.
7. **עדכון** — אופט-אין מפורש לקבלת עדכון כשהקהילה תיפתח (שם + אימייל).
8. **סיום** — קישור לרכישת הקורס *Claude Desktop* עם **10% הנחה** וקוד קופון.

לשינוי נוסח/שאלות — ערכו את `config.js` בלבד (מתועד בפנים).

## הגדרת הקורס וההנחה

ב-`config.js`, תחת `CONFIG.course`:

```js
course: {
  name: "השליטה ב-Claude Desktop",
  url: "https://www.yuv.ai/",   // ← החליפו לכתובת הרכישה האמיתית
  couponCode: "SURVEY10",        // קוד הקופון שיוצג ויצורף ל-URL
  discountText: "10% הנחה",
  appendCouponParam: "coupon",   // יוצר ...?coupon=SURVEY10 (ריק = לא לצרף)
}
```

## איסוף התשובות

הגדירו ב-`config.js` את `endpointType` ואת `formEndpoint`.

### א. Netlify Forms (ברירת המחדל) — `endpointType: "netlify"`
כשהאתר מתארח ב-Netlify, התשובות נאספות **אוטומטית** בלוח הבקרה
(`Forms → survey`) בלי שום שרת. הזיהוי מתבסס על ה-`<form name="survey">`
המוסתר ב-`index.html`. כל תשובה נשמרת כ-JSON בשדה `payload`, ובנוסף
`email`/`name` נשמרים בנפרד לנוחות. ייצוא ל-CSV זמין ישירות מ-Netlify.

### ב. Google Sheets (חינמי) — `endpointType: "gas"`
1. צרו Google Sheet → `Extensions → Apps Script`.
2. הדביקו את `google-apps-script.gs`, ועשו `Deploy → Web app`
   (Execute as: Me, Access: Anyone).
3. הדביקו את ה-URL שמסתיים ב-`/exec` ל-`formEndpoint` והגדירו `endpointType: "gas"`.

### ג. Formspree — `endpointType: "formspree"`
פתחו טופס ב-[formspree.io](https://formspree.io), הדביקו את כתובת ה-endpoint
(`https://formspree.io/f/xxxx`) ל-`formEndpoint`.

### ד. מצב דמו — `endpointType: ""`
התשובות נשמרות מקומית בדפדפן בלבד. נוח לבדיקה.

> בכל המצבים נשמר עותק מקומי כגיבוי, וניתן לצפות/לייצא ל-CSV דרך `index.html#admin`.

## פרסום

### Netlify (מומלץ — כולל איסוף תשובות מובנה)
`netlify.toml` בשורש הריפו מגדיר `publish = "survey"`, כך שהסקר מוגש בשורש
האתר. פרסום: `netlify deploy --prod` (או דרך לוח הבקרה / חיבור ל-GitHub).
Netlify Forms נדלק אוטומטית כשמזוהה הטופס בפריסה.

### GitHub Pages (חלופה)
1. `Settings → Pages → Build from branch` (`main`, root).
2. הסקר יהיה זמין ב-`https://hoodini.github.io/hoodini/survey/`.
   (במצב זה כדאי לעבור לאיסוף דרך Google Sheets/Formspree.)

## נגישות ו-UX
- ניווט מלא במקלדת: `Enter` להמשך, אותיות (א/ב/ג…) לבחירה מהירה.
- בחירה יחידה מתקדמת אוטומטית; בחירה מרובה עם כפתור "המשך".
- מד התקדמות, כפתור חזרה, שמירת תשובות בעת מעבר אחורה.
- `prefers-reduced-motion` נתמך.
