/* The single source of truth for timing: beat grid, the beat map and every SFX cue.
   Grid calibrated to the real kick hits of "Electro Dreams" (Arulo, Mixkit #190):
   120.001 BPM, film t=0 = song 48.0309 s, film beat 32 (the drop) = song beat 128 (64.0307 s). */
export const B = 0.49999612;
export const bt = k => k * B;
export const NB = 64;                 // beats 0..63, the mark lands on beat 64 (song bar 40 downbeat)
export const DUR = bt(64) + 0.9;      // 32.9 s
export const SONG_S0 = 48.030869;     // song time at film t = 0
export const DROP = 32;

// typing: human at 16ths (scene 1, scene 7), Copilot at 32nds (scene 5)
export const PROMPT = 'File my expenses in Ledger 98';
export const PROMPT_T0 = bt(2);
export const MERCH = 'Team offsite dinner', MERCH_T0 = bt(44.25);
export const AMT = '$1,240.00', AMT_T0 = bt(46.5);
export const CMD = '/computer on', CMD_T0 = bt(56.25);
export const charT = (s, t0, step) => Array.from(s).map((_, i) => t0 + i * step);

/* beat map: one row per beat. [beat, scene, what happens, made out of, sfx] */
export const MAP = [
  [0, '01 ASK', 'Copilot mark pops in a white disc on the day sky; kicker rises', 'nothing (first frame: sky)', 'pop_hard'],
  [1, '01 ASK', 'disc stretches into the prompt pill, mark rides to its left end, neon edge on', 'the disc', 'swoosh'],
  [2, '01 ASK', 'typing starts at 16ths: "File my expenses in Ledger 98"', 'the pill', 'key x4'],
  [3, '01 ASK', 'typing; camera pans with the caret (one eased move)', 'the pill', 'key x4'],
  [4, '01 ASK', 'hook slams "YOUR AGENT" (8ths) above the pill; typing continues', 'mask line above the pill', 'slam x2 + keys'],
  [5, '01 ASK', 'typing', 'the pill', 'key x4'],
  [6, '01 ASK', '"GOT HANDS." slams, fire marker sweeps behind HANDS', 'mask line', 'slam x2 + keys'],
  [7, '01 ASK', 'typing', 'the pill', 'key x4'],
  [8, '01 ASK', 'typing ends ("Ledger 98")', 'the pill', 'key x4'],
  [9, '01 ASK', 'last key; caret blinks once on the beat', 'the pill', 'key x1'],
  [10, '01 ASK', 'send button squashes, click ring', 'the send button', 'enter'],
  [11, '01 ASK', 'Copilot reply chip "Opening Ledger 98" pops under the pill', 'grows out of the send button', 'pop'],
  [12, '02 WALL', 'pill grows into the Ledger 98 window (a legacy GUI-only app); chip shrinks into its title bar', 'the prompt pill', 'swoosh'],
  [13, '02 WALL', '"API" chip slams on the window edge, fire strike sweeps right-to-left', 'the window edge', 'error'],
  [14, '02 WALL', '"CLI" chip, struck', 'the window edge', 'error'],
  [15, '02 WALL', '"MCP" chip, struck', 'the window edge', 'error'],
  [16, '02 WALL', 'headline slams "GUI"', 'mask line left column', 'slam'],
  [17, '02 WALL', '"ONLY." slams, fire marker sweeps behind it', 'mask line', 'slam'],
  [18, '02 WALL', 'your cursor clicks a field; hard-cut caption "CLICK."', 'enters from the frame edge', 'click'],
  [19, '02 WALL', 'clicks again; caption "CLICK. CLICK."', 'the cursor', 'click'],
  [20, '03 SWITCH', 'window morphs into Copilot app Settings (content swaps behind its own masks)', 'the Ledger window', 'swoosh'],
  [21, '03 SWITCH', 'sidebar indicator stretches to "Computer Use" (two springs); "ONE" slams', 'the sidebar', 'tick + slam'],
  [22, '03 SWITCH', '"SWITCH." slams with marker; cursor glides to the toggle', 'mask line', 'slam'],
  [23, '03 SWITCH', 'neon edge wraps the "Enable Computer Use" toggle, pulses', 'the toggle', 'tick'],
  [24, '03 SWITCH', 'click: knob stretches across on two springs, track turns fire', 'the toggle', 'switch'],
  [25, '03 SWITCH', 'macOS "Accessibility: Granted" row pops', 'the settings list', 'confirm'],
  [26, '03 SWITCH', '"Screen Recording: Granted" row pops', 'the settings list', 'confirm'],
  [27, '03 SWITCH', 'toast pill "Copilot wants to use Ledger 98" pops from the toggle', 'the toggle', 'notif'],
  [28, '03 SWITCH', 'toast grows into the approval card: Decline / Always allow / Allow', 'the toast pill', 'swoosh'],
  [29, '03 SWITCH', 'cursor glides to Allow; camera starts its push-in on Allow (build)', 'the cursor', 'tick'],
  [30, '03 SWITCH', 'neon edge on Allow; press at the "and"; fire flood pours out of Allow (0.35 s)', 'the Allow button', 'click + whoosh'],
  [31, '03 SWITCH', 'navy follows the fire from the same point; camera resets under the flood', 'the fire flood', 'riser peak at 32'],
  [32, '04 IDEA', 'DROP. Phoenix Night: "COPILOT NOW / USES YOUR / DESKTOP APPS." slams on 16ths', 'the navy flood', 'drop'],
  [33, '04 IDEA', '"EVEN THE ONES WITH NO API." rises', 'mask line', 'swoosh_light'],
  [34, '04 IDEA', '"MACOS" "WINDOWS" "PUBLIC PREVIEW" chips pop', 'the subline', 'pop'],
  [35, '04 IDEA', 'white Copilot mark pops; on the "and" the night shrinks into the Ledger window', 'the night page', 'pop + swoosh'],
  [36, '05 HOW', 'back to day; the mark becomes Copilot\'s cursor badge; "READS." slams', 'the night page -> window', 'slam'],
  [37, '05 HOW', 'fire scan line sweeps the window, every control gets a dotted box', 'the window', 'scan'],
  [38, '05 HOW', 'role chips pop on 16ths: textbox, combobox, button', 'the dotted boxes', 'pop x3'],
  [39, '05 HOW', 'Copilot cursor glides to "New expense"', 'the cursor', 'tick'],
  [40, '05 HOW', '"CLICKS." replaces "READS." (own masks)', 'the verb slot', 'slam'],
  [41, '05 HOW', 'Copilot clicks "New expense": squash + ring, row highlight sweeps', 'the button', 'click'],
  [42, '05 HOW', 'cursor glides to Category', 'the cursor', 'tick'],
  [43, '05 HOW', 'click: dropdown pops, "Travel" picked on the "and"', 'the Category field', 'click + tick'],
  [44, '05 HOW', '"TYPES." slams; Copilot types at 32nds "Team offsite dinner"', 'the Merchant field', 'slam + keys'],
  [45, '05 HOW', 'typing', 'the Merchant field', 'keys'],
  [46, '05 HOW', 'amount "$1,240.00" types', 'the Amount field', 'keys'],
  [47, '05 HOW', 'amount done; caret settles', 'the Amount field', 'keys'],
  [48, '05 HOW', '"DRAGS." slams; paperclip pill grows into a Finder "Receipts" window', 'the paperclip', 'slam + swoosh'],
  [49, '05 HOW', 'Copilot grabs receipt-oct.pdf', 'the file tile', 'click'],
  [50, '05 HOW', 'drags it across apps into Ledger', 'the file tile', 'drag'],
  [51, '05 HOW', 'drop: receipt attached; Finder shrinks back into the paperclip', 'the Finder window', 'confirm'],
  [52, '06 CONTROL', 'Copilot clicks Submit; the window collapses into a "Submitted" pill', 'the Ledger window', 'click + success'],
  [53, '06 CONTROL', '"YOU\'RE IN / CONTROL." slams; pill becomes "APPROVE EACH APP"', 'the Submitted pill', 'slam + pop'],
  [54, '06 CONTROL', '"STOP ANYTIME · ESC" chip; Esc keycap presses', 'chip 1', 'pop + key'],
  [55, '06 CONTROL', '"RESET ALWAYS-ALLOWED" chip', 'chip 2', 'pop'],
  [56, '07 GET IT', 'the three chips merge into the neon CTA pill; "TURN IT" slams; "/computer on" types', 'the chips', 'swoosh + slam + keys'],
  [57, '07 GET IT', '"ON." slams with marker', 'mask line', 'slam'],
  [58, '07 GET IT', '"OR: SETTINGS > COMPUTER USE" rises', 'mask line', 'swoosh_light'],
  [59, '07 GET IT', '"MACOS · WINDOWS · PUBLIC PREVIEW" rises; Enter on the "and"; navy flood pours out of the CTA', 'the CTA pill', 'enter + whoosh'],
  [60, '08 END', 'Phoenix Night end card: "COMPUTER USE" slams, gold kicker', 'the navy flood', 'impact'],
  [61, '08 END', 'how-to line + source line rise', 'mask line', 'swoosh_light'],
  [62, '08 END', 'everything shrinks into one point', 'the end card type', 'swoosh'],
  [63, '08 END', 'the point grows into a disc', 'the point', 'pop'],
  [64, '08 END', 'the disc becomes the YUV.AI phoenix mark + wordmark (last beat)', 'the disc', 'logo']
];

/* SFX cues: [name, beat (or seconds if sec:true), gain dB]. Placed so each file's measured PEAK lands on the event. */
export function cues() {
  const C = [];
  const at = (name, b, g) => C.push([name, +(bt(b)).toFixed(4), g]);
  const atS = (name, s, g) => C.push([name, +s.toFixed(4), g]);
  at('pop_hard', 0, -9); at('swoosh', 1, -13);
  charT(PROMPT, PROMPT_T0, B / 4).forEach((s, i) => { if (PROMPT[i] !== ' ') atS('key', s, -17); });
  at('slam', 4, -12); at('slam', 4.5, -13); at('slam', 6, -11); at('slam', 6.5, -11);
  at('enter', 10, -9); at('pop', 11, -11);
  at('swoosh', 12, -12); at('error', 13, -12); at('error', 14, -12); at('error', 15, -12);
  at('slam', 16, -9); at('slam', 17, -9); at('click', 18, -10); at('click', 19, -10);
  at('swoosh', 20, -12); at('tick', 21, -14); at('slam', 21, -11); at('slam', 22, -10); at('tick', 23, -14);
  at('switch', 24, -8); at('confirm', 25, -15); at('confirm', 26, -15); at('notif', 27, -12); at('swoosh', 28, -12);
  at('tick', 29.8, -15); at('click', 30.5, -9); at('whoosh', 31.15, -8); at('riser', 32, -9);
  at('drop', 32, -5); at('slam', 32.25, -12); at('slam', 32.5, -12);
  at('swoosh_light', 33, -14); at('pop', 34, -12); at('pop', 34.25, -13); at('pop', 34.5, -13); at('pop', 35, -11); at('swoosh', 35.75, -12);
  at('slam', 36, -10); at('scan', 37, -12); at('pop', 38, -15); at('pop', 38.25, -15); at('pop', 38.5, -15); at('tick', 39.6, -15);
  at('slam', 40, -10); at('click', 41, -9); at('tick', 42.6, -15); at('click', 43, -10); at('tick', 43.5, -13);
  at('slam', 44, -10);
  charT(MERCH, MERCH_T0, B / 8).forEach((s, i) => { if (MERCH[i] !== ' ' && i % 2 === 0) atS('key', s, -19); });
  charT(AMT, AMT_T0, B / 8).forEach((s, i) => { if (i % 2 === 0) atS('key', s, -19); });
  at('slam', 48, -10); at('swoosh', 48, -13); at('click', 49, -10); at('drag', 50, -10); at('confirm', 51, -11);
  at('click', 52, -10); at('success', 52.5, -11); at('slam', 53, -10); at('slam', 53.5, -11); at('pop', 53, -13);
  at('pop', 54, -12); at('key', 54.5, -10); at('pop', 55, -12);
  at('swoosh', 56, -12); at('slam', 56, -11);
  charT(CMD, CMD_T0, B / 4).forEach((s, i) => { if (CMD[i] !== ' ') atS('key', s, -17); });
  at('slam', 57, -10); at('swoosh_light', 58, -15); at('swoosh_light', 59, -15); at('enter', 59.25, -9); at('whoosh', 59.65, -8);
  at('impact', 60, -6); at('swoosh_light', 61, -15); at('swoosh', 62, -12); at('pop', 63, -11); at('logo', 64, -6);
  return C.sort((a, b) => a[1] - b[1]);
}
