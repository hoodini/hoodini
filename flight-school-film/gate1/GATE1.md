# Gate 1 — YUV.AI Flight School launch film

## Brief in 5 lines
1. A 30.0 s, 30 fps, muted-first Hebrew launch film for YUV.AI Flight School, built only from code (HyperFrames + GSAP). No generated video or images, no stock, no voiceover.
2. Story: orgs bought AI for everyone, yet only 1 in 4 uses it. Then Flight School (Flight Check → Missions → Co-Pilot → Mission Control) takes one employee, Michal from operations, to a working agent, and her team rises on the dashboard.
3. It ends on the Flight Guarantee (50% weekly active builders in 90 days, or the next months are on us) and a dual CTA: Pilot for individuals, Squadron for organizations.
4. Two native layouts share one timeline and one audio track: 1920×1080 and 1080×1920 (safe box x 90–990, y 240–1600). There is also a 12 s seamless 16:9 product-UI loop built from beats 6–9.
5. Look: Swiss editorial. Warm paper/ink/charcoal, ≤10% accents, Plex Hebrew/Mono + Frank Ruhl, real HTML UI, spring/expo/power2 motion, strict RTL, nothing that reads as AI-made.

## Beat sheet (96 BPM proposed: 1 bar = 2.5 s, so every cut lands on a downbeat; see decision 1)

| # | Time (s) | On-screen Hebrew copy (final) | Visual action | Transition in | Sound cue |
|---|---|---|---|---|---|
| 1 | 0.0–2.5 | קניתם לכולם AI. | Light canvas. License cards multiply on the beat, 12 → 48 → 247 (0.0 / 0.625 / 1.25 s). Mono counter ticks to 247, label "רישיונות AI בארגון". | Cold open from paper. First grid snaps in on frame 0. | Felt-piano motif starts. Card ticks on each multiply, plus a soft paper slide. |
| 2 | 2.5–5.0 | רק 1 מכל 4 באמת משתמש. · caption: IBM CEO Study 2026 | Three of every four cards desaturate to grey in a staggered RTL wave. One in four stays sky blue. Headline swaps by words. | Copy cut on the downbeat. The grid persists, with no cut. | Soft UI ticks as cards grey out. Hi-hat enters. |
| 3 | 5.0–7.5 | המטוסים עומדים על המסלול. | **Hard dark switch.** One 2 px line draws right → left across the frame (pen stroke) and opens into a runway. The grey cards drop and settle on the apron like parked aircraft (spring, slight overshoot). | Hard cut to charcoal on the drum hit (match cut: card row becomes the runway). | Drum hit, then drums drop out. Pen-stroke SFX. Muffled card thuds. |
| 4 | 7.5–10.0 | משתמש AI חוסך כ-2.2 שעות בשבוע. / השאר? לא. · caption: Federal Reserve Bank of St. Louis | Minimal clock face, ticking second hand. Hour ticks peel off and slide off the frame edge. Line 2 lands on its own beat. | Runway center-line becomes the clock's 12 o'clock hairline (shape match). | Sparse piano, clock tick, low room tone. No drums. |
| 5 | 10.0–12.5 | YUV.AI Flight School / בית הספר לטיסה של עידן ה-AI | **Hard light switch.** The runway line lifts into a climbing flight path, right → left. An orange path-head chevron leads. The wordmark reveals by line (expo-out), and the Frank Ruhl subtitle follows. | Hard cut to paper. The runway's y position is held, so the line continues (match cut). | Drums return hard. Low sub-hit on the wordmark. Score lifts. |
| 6 | 12.5–15.0 | מבחן גובה טיסה. 5 דקות. | Flight Check UI. Question plus 3 answers. The cursor glides and selects. The FL100 chip lands with spring overshoot (squash/stretch). The ladder underlines FL100. Name tag "מיכל · תפעול". | The flight-path baseline becomes the panel's top rule. The panel enters with expo-out and a slow 4% push-in. | Soft UI click on select. Pluck plus chip "pop" on FL100. |
| 7 | 15.0–17.5 | משימות קצרות. תוצר אמיתי. | Mission card slides in: "משימה: סוכן שמסכם כל פגישה ופותח משימות". Progress fills right → left. A checkmark stamps (squash), and the label "תוצר: עובד" appears. | Chip FL100 travels into the mission card's level slot (match move). | Paper slide, progress tick-roll, **stamp thud** on "תוצר: עובד". |
| 8 | 17.5–20.0 | מאמן AI בעברית. 24/7. | Hebrew chat. The user bubble types "איך מחברים את זה ליומן?" (the film's one typewriter line). Co-Pilot reply streams 2 short lines, word by word. | The mission card's footer becomes the chat composer. | Key clicks (light), message "send" tick, soft pluck on reply. |
| 9 | 20.0–22.5 | מודדים אימוץ. לא צפיות. | Mission Control. The "בונים פעילים בשבוע" meter fills 25% → 61% (orange) past the dashed "יעד 50%" line. Dept rows fill one after another. תפעול in sky blue (Michal's team). Corner tag "המחשה". | The chat thread collapses into the dashboard's תפעול row (match). The panel pushes in 6%. | Rising pluck arpeggio synced to the row fills. Tick on crossing 50%. |
| 10 | 22.5–25.0 | עם יותר מ-5 שעות הדרכה וליווי — יותר עובדים משתמשים בקביעות. · caption: BCG, AI at Work 2025 | Two mono numbers count up side by side, 67% and 79%. Labeled "פחות מ-5 שעות" / "יותר מ-5 שעות" (see decision 3). | The 61% meter collapses into two bars, which become the two number columns. | Two counter rolls, one resolving chord tone each. |
| 11 | 25.0–27.5 | הבטחת טיסה · 50% בונים פעילים תוך 90 יום — או שהחודשים הבאים עלינו. | A boarding-pass card prints in from the top edge (stepped feed). The perforation line tears, and the stub drops away with power2-in. | Paper-feed wipe on the downbeat. | **Printer chirp + tear.** |
| 12 | 27.5–30.0 | Fly High with AI · לעובדים: Pilot · לארגונים: Squadron · yuv.ai · בדקו את גובה הטיסה שלכם | End card on paper. "Fly High with AI" reveals by line. A hairline rule draws. Audience lines stagger. The orange CTA pill lands. **Static hold 29.2–30.0 s.** | The torn stub's edge becomes the rule (shape match). | Score resolves on the tonic. Final soft sub. Silence for the last ~0.4 s. |

## Keyframe stills (rendered from the real compositions, real fonts)
- `gate1/keyframes-16x9.png`: contact sheet of B2, B3, B5, B6, B9, B12
- `gate1/keyframes-9x16.png`: same beats, native vertical layout
- Full-res PNGs: `gate1/stills-16x9/`, `gate1/stills-9x16/`

## Decisions needed before Gate 2
1. **Tempo vs. cut grid.** At 100–108 BPM a 2.5 s beat is 4.17–4.5 beats, so cuts can't all land on the beat. 96 BPM gives exactly one 4/4 bar per beat. **Recommend 96 BPM.** The alternative is 108 BPM, with cuts landing on off-beats every other beat.
2. **Music source.** No licensed CC0 track will hit this exact bar map and the drum drop/return. I'll synthesize the score and SFX in code (numpy, deterministic), logged as "generated" in credits.txt. Risk: synthesized felt piano is less rich than a sampled one. Option: a CC0 piano sample set (e.g. Salamander Grand, CC-BY 3.0, which is *not* CC0) would need your OK.
3. **Beat 10 needs labels.** 67% and 79% alone are ambiguous. BCG's figures are 79% regular users with >5 h training vs 67% with <5 h. I'll add mono labels "פחות מ-5 שעות" / "יותר מ-5 שעות" (both numbers are in the brief).
4. **Invented-number guard.** UI uses only brief numbers. The Flight Check step progress uses segments, not "שאלה 4/8". Department bars carry no values. All UI microcopy is new real Hebrew (question, answers, tabs, "אין תשובה לא נכונה."). Approve or edit.
