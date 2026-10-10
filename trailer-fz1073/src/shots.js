// Shot list + timing. Every hold is computed here from the final on-screen strings, never hand-typed.
// Gen Z 2026 formula: hold = max(0.45 s, words × 0.22 s + 0.25 s), quantized UP to whole beats at 128 BPM,
// min 2 beats (readability floor: no text under 0.9 s), 0.3 s transitions between shots.
// Fixed holds (deliberate extensions): shot 1 cold open (5 beats, from the brief's table), shot 19 catharsis (6), shot 20 end card (9).
(function () {
  const BPM = 128, BEAT = 60 / BPM, TRANS = 0.3, FPS = 30;

  // text: the spec's on-screen string (counted); head: how it is broken into lines; counter: Assistant 300 counter-line (counted)
  const SHOTS = [
    { id: 1,  act: 1, scene: 'Cold open',        text: '30.9.2026',                       head: ['30.9.2026'],                         counter: '',                          fixedBeats: 5, gfx: 'date',     layout: 'center', headKind: 'mono' },
    { id: 2,  act: 1, scene: 'Route',            text: 'דובאי ← תל אביב',                  head: ['דובאי ← תל אביב'],                    counter: 'FZ1073',                    gfx: 'route',    layout: 'gfx' },
    { id: 3,  act: 1, scene: 'Souls on board',   text: '174 נוסעים',                        head: ['174 נוסעים'],                          counter: '',                          gfx: 'cabin',    layout: 'gfx' },
    { id: 4,  act: 1, scene: 'Souls on board 2', text: '27 מהם ילדים',                      head: ['27 מהם ילדים'],                        counter: '',                          gfx: 'cabinKids', layout: 'gfx' },
    { id: 5,  act: 1, scene: 'Cruise',           text: 'גובה שיוט',                         head: ['גובה שיוט'],                           counter: '34,000 רגל',                gfx: 'altimeter', layout: 'gfx' },
    { id: 6,  act: 2, scene: 'Silence',          text: 'ואז',                               head: ['ואז'],                                 counter: '',                          gfx: null,       layout: 'center' },
    { id: 7,  act: 2, scene: 'Cockpit',          text: 'תא הטייס',                          head: ['תא הטייס'],                            counter: '',                          gfx: 'door',     layout: 'gfx' },
    { id: 8,  act: 2, scene: 'Attack',           text: 'טייס אחד דקר את השני',              head: ['טייס אחד', 'דקר את השני'],             counter: 'באמצע הטיסה',               gfx: null,       layout: 'center', punch: true },
    { id: 9,  act: 2, scene: 'Intent',           text: 'וניסה להפיל את המטוס',              head: ['וניסה להפיל', 'את המטוס'],             counter: 'החקירה נמשכת',              gfx: null,       layout: 'center', punch: true },
    { id: 10, act: 3, scene: 'Dive',             text: 'המטוס צולל',                        head: ['המטוס צולל'],                          counter: 'אלפי רגל בשניות',           gfx: 'altimeter', layout: 'gfx', shake: true },
    { id: 11, act: 3, scene: 'Squawk 1',         text: '7700 מצב חירום',                    head: ['מצב חירום'],                           counter: 'קוד מצוקה',                 gfx: 'xpdr',     layout: 'gfx', code: '7700' },
    { id: 12, act: 3, scene: 'Squawk 2',         text: '7500 חטיפה',                        head: ['חטיפה'],                               counter: 'הקוד שודר 7 דקות אחרי',     gfx: 'xpdr',     layout: 'gfx', code: '7500', punch: true },
    { id: 13, act: 3, scene: 'Scramble',         text: 'מטוסי קרב באוויר',                  head: ['מטוסי קרב', 'באוויר'],                 counter: 'הוזנקו מישראל',             gfx: 'radar',    layout: 'gfx' },
    { id: 14, act: 4, scene: 'Turn',             text: 'הנוסעים לא חיכו',                   head: ['הנוסעים', 'לא חיכו'],                  counter: '',                          gfx: 'people',   layout: 'gfx' },
    { id: 15, act: 4, scene: 'Breach',           text: 'הם נכנסו לתא הטייס',                head: ['הם נכנסו', 'לתא הטייס'],               counter: 'הקברניט הפצוע פתח את הדלת', gfx: 'doorOpen', layout: 'gfx', punch: true },
    { id: 16, act: 4, scene: 'Subdue',           text: 'והשתלטו על התוקף',                  head: ['והשתלטו', 'על התוקף'],                 counter: 'עם הצוות',                  gfx: 'peopleStand', layout: 'gfx' },
    { id: 17, act: 4, scene: 'Control',          text: 'אנשי צוות על הסיפון לקחו פיקוד',     head: ['אנשי צוות', 'על הסיפון', 'לקחו פיקוד'], counter: 'של flydubai',               gfx: null,       layout: 'center', punch: true },
    { id: 18, act: 4, scene: 'Landing',          text: 'נחיתה בטוחה בתבוק',                 head: ['נחיתה בטוחה', 'בתבוק'],                counter: '',                          gfx: 'divert',   layout: 'gfx' },
    { id: 19, act: 4, scene: 'Hero (extended)',  text: '174 נוסעים נחתו בשלום',             head: ['174 נוסעים', 'נחתו בשלום'],            counter: '',                          fixedBeats: 6, gfx: 'dawn', layout: 'hero', marker: 'בשלום' },
    { id: 20, act: 5, scene: 'End card (extended)', text: 'הפרטים עדיין מתבררים',           head: ['הפרטים עדיין מתבררים.'],               counter: '',                          fixedBeats: 9, gfx: 'end',      layout: 'end' },
  ];

  // Attribution chips: each stays up for its whole group of shots.
  const CHIPS = [
    { from: 2,  to: 2,  html: 'לפי <bdi class="lat">flydubai</bdi>' },
    { from: 3,  to: 4,  html: 'לפי <bdi class="lat">ynet</bdi>' },
    { from: 5,  to: 5,  html: 'לפי <bdi class="lat">Times of Israel</bdi>' },
    { from: 8,  to: 9,  html: 'לפי ראש הממשלה' },
    { from: 10, to: 10, html: 'לפי הדיווחים' },
    { from: 11, to: 13, html: 'לפי <bdi class="lat">Wikipedia</bdi> ו-<bdi class="lat">Times of Israel</bdi>' },
    { from: 14, to: 16, html: 'לפי ראש הממשלה' },
    { from: 17, to: 19, html: 'לפי <bdi class="lat">flydubai</bdi>' },
  ];

  const countWords = (s) => s.split(/\s+/).filter((w) => w && !/^[←→·]$/.test(w)).length;

  let t = 0;
  SHOTS.forEach((s, i) => {
    s.words = countWords(s.text) + (s.counter ? countWords(s.counter) : 0);
    s.formula = Math.max(0.45, s.words * 0.22 + 0.25);
    s.beats = s.fixedBeats || Math.max(2, Math.ceil(s.formula / BEAT - 1e-9));
    s.hold = s.beats * BEAT;
    s.start = t;
    s.end = t + s.hold;
    t = s.end + (i < SHOTS.length - 1 ? TRANS : 0);
  });
  const TOTAL = t;
  const FRAMES = Math.round(TOTAL * FPS);
  const byId = (id) => SHOTS[id - 1];

  window.TIMING = { BPM, BEAT, TRANS, FPS, SHOTS, CHIPS, TOTAL, FRAMES, byId, countWords };
})();
