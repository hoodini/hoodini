import json,os
# scene id -> list of (hebrew narration, english caption)
S=[
('hook',[("בן אדם אמיתי קורא את השיחות שלך עם ChatGPT.","A real human is reading your ChatGPT chats."),("לא בוט. בן אדם.","Not a bot. A person.")]),
('define',[("זה מושן גרפיקס: עיצוב גרפי, ועוד זמן.","This is motion graphics: graphic design, plus time."),("בסרטון הזה, כל תנועה מסבירה עובדה אמיתית מהסיפור.","In this video, every move explains a real fact from the story.")]),
('position',[("404 Media חשפו ש-OpenAI מעסיקה מאות קבלנים.","404 Media revealed that OpenAI employs hundreds of contractors."),("הם קוראים שיחות אמיתיות של משתמשים. הפרויקט נקרא Project Lily.","They read real user conversations. The project is called Project Lily.")]),
('scale',[("יותר מתשע מאות מיליון משתמשים. ולפי הדיווח, קבלנים שמרוויחים יותר מחמישים דולר לשעה.","900 million-plus users. And per the report, contractors earning over $50 an hour.")]),
('rotation',[("התפקיד: לקרוא את הבקשה, לסכם מה המשתמש רצה, ולדרג תשובות של הבוט בסולם של אחד עד שבע.","The job: read the prompt, summarize what the user wanted, and rate the bot's answers from one to seven.")]),
('opacity',[("לפעמים הם רואים גם סיכום זיכרון על המשתמש: מקצוע, אזור מגורים, רקע אישי.","Sometimes they also see a memory summary of the user: profession, location, personal background.")]),
('stagger',[("מאות אנשים. ואצל כל אחד מהם, שיחות של אחרים.","Hundreds of people. Each with other people's conversations.")]),
('mask',[("OpenAI אומרת שהקבלנים לא רואים שמות משתמש, ושהיא מנסה להסיר מידע אישי.","OpenAI says contractors don't see usernames and that it tries to strip personal info."),("אבל היא מודה: פרטים רגישים עדיין יכולים לעבור.","But it admits: sensitive details can still get through.")]),
('camera',[("איך מכבים? Settings, אחר כך Data Controls, ולכבות את Improve the model for everyone.","How to opt out? Settings, then Data Controls, and turn off “Improve the model for everyone”.")]),
('morph',[("אבל יש קאץ'. הכיבוי חל רק על שיחות עתידיות, לא על אלה שכבר בבדיקה.","But there's a catch. Opting out only covers future chats, not ones already in review.")]),
('parallax',[("וזה לא רק OpenAI. גם Anthropic אישרה שהיא משתמשת בבדיקה אנושית כדי לשפר את Claude.","And it's not just OpenAI. Anthropic also confirmed it uses human review to improve Claude."),("הכלל: תבדקו את ההגדרות בכל כלי AI שאתם משתמשים בו.","The rule: check the settings in every AI tool you use.")]),
('prompt',[("רוצים סרטון כזה? זה מבנה הפרומפט: פורמט, סגנון, סטוריבורד, תנועות בשמות ובמספרים, קצב ובדיקה.","Want a video like this? The prompt structure: format, style, storyboard, named motion and numbers, rhythm, checks."),("Opus 5.5 לתכנון ובנייה. Sonnet 5.5 לסבבי תיקונים מהירים.","Opus 5.5 to plan and build. Sonnet 5.5 for fast fix rounds.")]),
('cta',[("עכשיו: היכנסו להגדרות, כבו את האפשרות, ושלחו את זה למי שמשתמש ב-ChatGPT.","Now: open settings, turn it off, and send this to anyone who uses ChatGPT."),("וכתבו לי בתגובות: כבר כיביתם?","And tell me in the comments: did you turn it off yet?")]),
]
real={}
if os.path.exists('timing.json'): real=json.load(open('timing.json'))  # {"hook_0":2.9,...}
out=[];t=0.0
for sid,sents in S:
    items=[];cur=0.35
    for i,(he,en) in enumerate(sents):
        k=f"{sid}_{i}"
        d=real.get(k, max(1.6,len(he)/12.5+0.5))
        items.append(dict(he=he,en=en,t=round(cur,2),d=round(d,2)));cur+=d+0.3
    D=round(cur+0.35,2)
    out.append(dict(id=sid,t0=round(t,2),D=D,s=items));t+=D
open('site/script.js','w').write('window.SCRIPT='+json.dumps(out,ensure_ascii=False)+';window.TOTAL='+str(round(t,2))+';')
print(round(t,1),[ (o['id'],o['D']) for o in out])
