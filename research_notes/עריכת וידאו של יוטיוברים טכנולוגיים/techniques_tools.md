# Visual Editing Techniques and Tool Workflows in High-End Tech YouTube (2025-2026)

Research date: 2026-10-29. About 23 search/fetch calls. Source-date flags: [2026] = in window (Nov 2025 to Oct 2026); [OLD-yyyy] = older, flagged.

## Q1: For each technique, what it is, why it works, exact current tool/feature names (2025-2026), and a step-by-step workflow summary

### Takeaway
The biggest 2026 change is that one-click AI subject masking is now built into every major NLE. Premiere 26.0 (Jan 2026) has Object Mask. The After Effects Object Matte suite has been in beta since 26.2 (Feb 2026) and replaces Roto Brush as the main roto workflow. Resolve has Magic Mask 2 (Resolve 20, Studio only) and CapCut has Auto removal. Together these make "text behind subject" a roughly 5-minute job. Resolve 21 (June 2026) added Bezier/easing keyframing on the Edit page and 100+ Fusion motion-graphics tools, and AE 26.x added native 3D primitives, Substance materials, shadows and depth of field. These strengthen the "2.5D/3D product" toolset.

### Cited Findings

**(1) Text behind subject / text between layers**
- Premiere 26.0 was released in January 2026 and rebranded, dropping "Pro" from the name. Its headline feature is the AI **Object Mask**: hover and click to mask and track a person or object. It runs on-device, offers six colored overlays or a B/W alpha view, and can be refined with lasso/rectangle add/subtract plus feather/expansion. Adobe claims tracking is up to 20x faster. Object Mask was first previewed as a beta at Adobe MAX in Oct 2025. [2026] — [PetaPixel](https://petapixel.com/2026/01/20/rebranded-adobe-premiere-26-arrives-with-one-click-object-tracking)
- Premiere 26.0 also brought redesigned shape masks (Ellipse, Rectangle, Pen) with "dynamic bezier curves", and you can add, subtract or mix multiple masks with blend modes. Other 26.0 additions: Firefly Boards, Frame.io V4, Adobe Stock (52M assets), interactive audio fades, and new RAW support. [2026] — [Newsshooter](https://www.newsshooter.com/2026/01/20/whats-new-in-adobe-premiere-pro-26-0/); [PetaPixel](https://petapixel.com/2026/01/20/rebranded-adobe-premiere-26-arrives-with-one-click-object-tracking); see also [Larry Jordan, "Adobe Updates Masking in Premiere 26"](https://larryjordan.com/articles/adobe-updates-and-modifies-masking-in-premiere-26/)
- **Official Adobe step-by-step (dated June 1, 2026), "Text behind subject with Object Mask":**
  1. Put the clip on the timeline.
  2. Scrub to a frame with a clear silhouette (all limbs visible).
  3. Select the **Object Masking** tool and hover until a red overlay appears, then click.
  4. Click to add missing parts. Alt/Option-click to subtract.
  5. In Effect Controls, find the mask under **Unassigned Masks** and click **Track forward and backward**.
  6. Add text with the Text tool.
  7. Alt/Option-drag the clip from V1 to V3.
  8. On the V3 copy, drag the Object Mask from Unassigned Masks into **Opacity**.
  9. The final stack is V3 = masked subject, middle = text, V1 = original.

  [2026] — [Adobe Learn](https://www.adobe.com/learn/premiere-pro/web/text-behind-subject-object-mask)
- After Effects has an **AI-powered Object Matte** suite, announced in the 26.2 public beta in Feb 2026. It uses a "hybrid approach" that combines single-click AI subject selection with precision refinement and propagation over time. It has four tools: Object Matte Tool (one-click or marquee selection), **Quick Selection Tool** (the renamed, reworked Roto Brush), Selection Brush Tool and Refine Edge Tool. It uses the same AI as Premiere's Object Mask, and the beta caches propagation to disk. [2026] — [Adobe Community beta announcement](https://community.adobe.com/announcements-532/new-in-beta-object-matte-in-after-effects-1550754); [Adobe HelpX: AI-powered Object Matte](https://helpx.adobe.com/after-effects/desktop/roto-brush-and-refine-matte/roto-brush/object-matte.html); classic workflow: [HelpX Roto Brush and Refine Matte](https://helpx.adobe.com/ca/after-effects/desktop/roto-brush-and-refine-matte/roto-brush/roto-brush-refine-matte.html)
- AE 26.5 (Sept 2026) notes include **disk caching for Object Matte**, guides, effect color labels, an Effect Controls panel update and ACES 2.0. This is a search-result summary of CG Channel; I did not verify it on the full page. [2026] — [CG Channel tag page](https://www.cgchannel.com/tag/draft-3d-preview/)
- In DaVinci Resolve 20, **Magic Mask 2** is used to separate foreground from background, and it requires **DaVinci Resolve Studio**. [OLD-2025] — [Larry Jordan](https://larryjordan.com/articles/separate-foreground-from-background-using-magic-mask-2-in-davinci-resolve-20/)
- Resolve 20 lists **AI Depth Map v2** and **Magic Mask 2** among its features. [OLD-2025] — [Mixing Light (Jason Bowdach)](https://mixinglight.com/color-grading-tutorials/davinci-resolve-20-favorite-new-features-bowdach). Resolve 20.2.3 (Nov 2025) gives "up to 4x faster Magic Mask, Depth Map, Super Scale on Intel GPUs". [2025-11, in window] — [Newsshooter](https://www.newsshooter.com/2025/11/04/blackmagic-design-davinci-resolve-20-2-3-update/)
- Tip: render (cache) the Magic Mask matte so it isn't lost when a timeline is duplicated or its resolution changes. — [Creative Video Tips](https://creativevideotips.com/tutorials/never-retrack-magic-mask) (date not verified)
- **CapCut, official method:**
  1. Put the text on the timeline with a duplicate video clip above it.
  2. Select the top clip, then go to **Smart tools > Remove background > Auto removal**.
  3. The result is a three-layer "sandwich": original, then text, then cutout.

  Menu locations vary by version ("Mask"/"Effects", or a "Layer" tool for ordering on mobile). — [CapCut resource ("...for Free in 2026")](https://www.capcut.com/resource/how-to-put-text-behind-a-person-in-capcut); [TourBox](https://www.tourboxtech.com/en/news/how-to-put-text-behind-a-person-in-capcut.html)
- For stills (thumbnails), Photoshop's version is Select Subject, then Alt/Option-click the layer-mask icon on the type group. — [Adobe Learn (Photoshop)](https://adobe.com/learn/photoshop/web/create-flexible-text-layouts-dynamic-text)

**(2) 2.5D parallax / Z-axis camera / 3D product animation**
- **After Effects 26.0** (Jan 2026) added:
  - Native **Substance 3D** (.sbsar) materials.
  - A **parametric mesh** tool that draws cubes, spheres, cylinders, cones, tori and planes inside AE, with roughness, metalness and emissivity.
  - Shadows from Spot and Parallel lights in the **Advanced 3D** renderer.
  - Animation of every axis of a variable font (up to 8 axes per layer).
  - SVG import as editable shape layers, with gradients and strokes preserved.
  - Lossless compressed playback, native Windows on ARM, and new audio effects (Gate, Compressor, Distortion).

  [2026] — [CG Channel](https://www.cgchannel.com/2026/01/adobe-releases-after-effects-26-0-with-native-substance-support/); [Digital Production](https://digitalproduction.com/2026/01/23/adobe-after-effects-2026-lands-with-3d-text-and-performance-boosts/)
- **After Effects 26.3** (June 2026) added a **Depth of Field** effect in Advanced 3D, which can focus on 3D models, parametric meshes, Substance materials, 3D text and shape layers. Motion blur is **still unsupported** in the GPU (Advanced 3D) renderer. [2026] — [CG Channel 26.3](https://www.cgchannel.com/?p=176596); [CG Channel tag summary](https://www.cgchannel.com/tag/classic-3d-renderer/)
- **DaVinci Resolve 21** was announced at NAB 2026, and the final release came around June 2–3, 2026.
  - Fusion gained 100+ motion-graphics tools, including the Krokodove toolset with 70+ new graphics.
  - The Cut and Edit pages gained four-point Bezier keyframing, advanced easing, looping and reverse animation, plus a Macro Editor.
  - New AI tools: **IntelliSearch** (content search), **CineFocus** (AI focus/focal-emphasis change after capture) and facial refinement.
  - A new **Photo page** was added.

  [2026] — [No Film School](https://nofilmschool.com/davinci-resolve-21); [PetaPixel](https://petapixel.com/2026/06/03/davinci-resolve-21-officially-released-with-new-photo-editing-ai-tools/) (403 on fetch; search snippet only); [Newsshooter](https://www.newsshooter.com/2026/06/02/davinci-resolve-21-final-release/); [ProVideo Coalition](https://www.provideocoalition.com/davinci-resolve-21-announced-with-new-ai-features-and-a-new-photo-page/)
- **Resolve 21.1** (Sept 2026) added:
  - A **native MCP server** for AI assistants (Claude, Claude Code, ChatGPT Codex) that can analyze projects, organize media, change settings and batch-render. This is in Studio.
  - 25+ new Krokodove Fusion tools, including **Connect 3D, Heightfield Create 3D and Tube Create 3D**.
  - Fusion 3D deep rendering that is up to 8x faster.
  - Multicam with up to 25 angles.
  - New log color spaces (DJI D-Log2, GoPro Log, Leica L-Log and others).

  [2026] — [Gigazine](https://gigazine.net/gsc_news/en/20260909-davinci-resolve-21-1-update)
- Resolve's **Depth Map** isolates parts of an image by their distance from camera. It is the basis for depth-based mattes and fake DOF. [OLD-2023] — [3D World via Readly](https://gb.readly.com/magazines/3d-world/2023-08-08/64cc5bfba3c20eed6ed14b01)

**(3) Keyframe easing, speed ramps, motion blur**
- In AE, a speed ramp works like this:
  1. Enable Time Remapping.
  2. Keyframe the speed-up and slow-down points.
  3. Apply Easy Ease (F9) and refine in the Graph Editor's Value Graph.

  A steeper curve plays faster and a flatter curve plays slower. — [AEJuice](https://aejuice.com/blog/how-to-speed-ramp-footage-in-after-effects/) (undated)
- The Speed Graph changes the rate of change, while the Value Graph edits the property values themselves. — [Noble Desktop](https://www.nobledesktop.com/learn/adobe/speed-graph). Joey Korenman (School of Motion) usually prefers the Value Graph because it gives clearer feedback. [OLD] — [School of Motion: Intro to the Graph Editor](https://www.schoolofmotion.com/tutorials/intro-to-the-graph-editor-in-after-effects/)
- Resolve 21 brings four-point Bezier keyframes and easing presets to the Edit page, so editors can ease curves without opening Fusion. [2026] — [Newsshooter search summary](https://www.newsshooter.com/2026/06/02/davinci-resolve-21-final-release/); [No Film School](https://nofilmschool.com/davinci-resolve-21)
- Advanced 3D (GPU) in AE still has no motion blur as of 26.3. Editors who want blurred 3D moves must use the Classic 3D renderer or add blur in post, for example with Pixel Motion Blur or RSMB. The plugin names are my inference, not sourced. — [CG Channel](https://www.cgchannel.com/tag/june-2026/)

**(4) Punch-in zooms, whip/zoom transitions, camera shake**
- I found no authoritative 2025-26 source dedicated to this. The Mister Horse/aescripts "Editors bundle" and Animation Composer presets include transitions and motion presets, but I did not verify the specific shake or whip contents. — [aescripts editors bundle](https://aescripts.com/editors-bundle/)
- Mrwhosetheboss's style is described as constant motion, with on-screen text that viewers read, and "every video ... is an editing marathon". This is a low-authority commentary source. — [gotranscript](https://gotranscript.com/public/mastering-youtube-editing-5-strategies-from-top-creators-to-keep-viewers-hooked)

**(5) Motion graphics, kinetic type, UI / screen-recording zooms**
- **Screen Studio** (macOS) automatically zooms toward the cursor, enlarges and smooths the cursor, records webcam, mic, system audio and USB-connected iOS devices, edits on a timeline, can hide the cursor automatically, and exports up to 4K. I found no 2026 changelog. — [screen.studio](https://www.screen.studio/?aff=ZylBO); [G2](https://www.g2.com/sellers/screen-studio)
- Alternatives with auto-zoom:
  - **ScreenCursor** (Chrome extension, 1080p cap, no webcam).
  - **Screenize** (open-source macOS app, Apache-2.0).
  - **ScreenGlimpse** (cross-platform, live zoom on click).
  - **CursorClip** (4K60, $47 one-time).
  - **Drift** (free, open source, WebM export).

  Most of these are vendor or aggregator listings. — [chatgate (ScreenCursor)](https://chatgate.ai/post/screencursor); [AlternativeTo (Screenize)](https://alternativeto.net/software/screenize/about); [Product Hunt (ScreenGlimpse)](https://www.producthunt.com/products/screenglimpse); [SourceForge (CursorClip)](https://sourceforge.net/software/product/CursorClip/alternatives)
- AE 26.0's variable-font axis animation (up to 8 axes per layer) directly supports kinetic typography such as weight and width morphs. [2026] — [CG Channel](https://www.cgchannel.com/2026/01/adobe-releases-after-effects-26-0-with-native-substance-support/)
- Resolve 21 adds 100+ motion-graphics effects and "greater graphic format support" on the Cut and Edit pages. [2026] — [No Film School](https://nofilmschool.com/davinci-resolve-21)

**(6) Overlays: light leaks, grain, glow, glassmorphism**
- I found no 2025-26 sources specific to this. The AE 26.0 **Unmult** keyer removes solid black or white backgrounds from stock fire and smoke clips, and the same use applies to light-leak or flare stock on black. It works in 8, 16 and 32 bpc. [2026] — [CG Channel](https://www.cgchannel.com/2026/01/adobe-releases-after-effects-26-0-with-native-substance-support/)

**(7) Macro product B-roll: motion control, robot arms**
- MKBHD visited Motorized Precision (Portland) in 2018 to try the **Kira** robot arm. Kira reaches about 9 ft, moves at up to 9 ft/s, carries up to 40 lb, and is programmed in software or driven with an Xbox controller, including focus, zoom and iris during moves. It can do orbit, top-down and follow shots. [OLD-2018] — [PetaPixel](https://petapixel.com/2018/04/04/the-crazy-shots-you-can-do-with-a-camera-robot/); [4K Shooters](https://4kshooters.net/2018/05/21/dope-camera-movements-with-the-kira-camera-robot-and-red-monstro-8k-vv)
- A Fast Company profile describes a **$250,000 mechanical arm** in MKBHD's Kearny, NJ studio, used for "swoopy camera pans" that became "a signature element of his gadget reviews". It is undated and does not name the model. — [Fast Company via Magzter](https://react.magzter.com/stories/Business/Fast-Company/The-Helpful-Hardware-Man)
- **MRMC Cinebot Mini** has a 1.3 m reach and a 10 kg payload. You can move it by hand to teach it a move and it records and repeats the path. It runs on battery for about 8 hours and can be phone-controlled. **Cinebot Max** handles 20 kg and reaches a 3.2 m camera height. MRMC demonstrated macro accuracy at IBC 2024. [OLD-2024] — [CineD](https://www.cined.com/?p=302747); [MRMC](https://mrmoco.com/?p=28007); [SVC](https://www.svconline.com/?p=142444); [SportsVideo](https://www.sportsvideo.org/?p=258313); [NewscastStudio](https://www.newscaststudio.com/2024/08/19/mrmc-unveils-studiobot-lt-and-cinebot-range-across-two-booths-at-ibc2024/)

**(8) AI-era tools 2025-2026**
- Premiere 26 Object Mask and AE Object Matte: see section (1).
- **Generative Extend** in Premiere (Firefly Video Model) went into beta in Feb 2025. It generates new frames at the start or end of a clip. The beta was 1080p, and Adobe "hinted" 4K was coming. Claims of 2026 4K/9:16 support come only from low-quality SEO sites, and stated extension lengths conflict (2 s originally, 2–5 s in other reports). [OLD-2025 / unverified 2026] — [CineD](https://www.cined.com/es/adobe-firefly-video-model-launches-in-public-beta/); [Adobe Research](https://research.adobe.com/news/adobe-research-and-firefly-team-pioneer-new-video-generation-tech/); [digen.ai (low-quality)](https://resource.digen.ai/adobe-firefly-video-generation-model-2026-guide/)
- **Resolve 21:** IntelliSearch, CineFocus and facial refinement. **Resolve 21.1:** a native MCP server for Claude, Claude Code and Codex. [2026] — [No Film School](https://nofilmschool.com/davinci-resolve-21); [Gigazine](https://gigazine.net/gsc_news/en/20260909-davinci-resolve-21-1-update)
- **Runway Aleph 2.0 + Edit Studio** (May 21, 2026) handles clips up to 30 s at 1080p, and its edits can span multiple shots. Third-party listings say it can add, remove or replace objects, relight, change weather, restyle and reframe, at $0.28/s via API. The original Aleph launched in July 2025 and could generate new camera angles from existing footage. [2026] — [Runway](https://runway.com/news/introducing-aleph-2-and-edit-studio); [OpenRouter](https://openrouter.ai/runway/aleph-2/api); [The Decoder](https://the-decoder.com/?p=25830); [No Film School](https://nofilmschool.com/runway-new-aleph-video-model)
- **Descript Underlord** is an AI co-editor that is still labeled beta in the help center, where its model list shows Claude Haiku 4.5 and Auto. Aggregators report two 2026 updates that I could not verify with Descript:
  - Claude Opus 5 integration (July 24, 2026).
  - Persistent editing-preference memory.

  — [Descript Help](https://help.descript.com/hc/en-us/articles/36803785502221-Underlord-beta-Your-AI-co-editor-in-Descript); [createwith (Opus 5)](https://www.createwith.com/tool/descript/updates/descript-integrates-anthropics-claude-opus-5-into-underlord-ai-co-editor); [createwith (memory)](https://www.createwith.com/tool/descript/updates/descripts-underlord-now-remembers-your-editing-preferences-across-projects)

### Inferences
These are my synthesis or general practice. They are not individually sourced, and the writer should present them as such.
- **Why text-behind-subject works:** it creates an occlusion depth cue. The brain reads the text as sitting inside the 3D scene rather than on top of it, which makes the frame feel designed and premium. The tool chain is the same everywhere: duplicate the clip, mask the top copy, and put the text between the two copies. Premiere 26, AE Object Matte, Resolve Magic Mask 2 and CapCut Auto removal each do this in one click plus tracking.
- **2.5D parallax:**
  - Typical method:
    1. Cut the screenshot or still into foreground, midground and background layers, using Photoshop Select Subject or generative fill to patch holes.
    2. Make the layers 3D in AE and space them along Z.
    3. Animate a 2-node camera slowly on Z with eased keyframes.

    An alternative is to apply a Depth Map (Resolve) or an AI depth tool to drive displacement.
  - **Why it works:** motion parallax is a strong monocular depth cue.
  - **Apple-style product shots:** use AE 26's parametric meshes, Substance materials, shadows and DOF, or Element 3D, Cinema 4D or Blender.
- **Easing:** ease-out entries and ease-in exits imitate physical inertia. Speed ramps (fast-slow-fast) emphasize the moment a product is revealed. Turn on motion blur (with a 180-degree shutter equivalent) so fast moves look filmed rather than computer-generated.
- **Punch-ins:**
  - Scale 110–130% on a cut, or keyframe the scale with easing, to emphasize a line.
  - Whip transition: a fast position or scale move plus directional blur across the cut.
  - Camera shake: the Wiggle expression, or presets from Animation Composer or FX Console.
- **Plugins and templates:** commonly assumed tools include Animation Composer (Mister Horse), Video Copilot Element 3D and FX Console, Motion Array or Envato templates, and Red Giant/Maxon. I could only source Mister Horse's subscription status (see Q2).

### Gaps
- I found no in-window, authoritative source on whip/zoom transitions, camera-shake presets, light leaks, grain, glow or glassmorphism workflows. These rely on general practice.
- I could not confirm 4K or 2026 changes to Generative Extend with an official Adobe source.
- The PetaPixel Resolve 21 page and Adobe HelpX "What's new" returned 403, so details come from search summaries and other outlets.
- I found no current (2025-26) specifics on MKBHD's current robot model, or on probe lenses (e.g. Laowa 24mm probe), turntables or lighting setups. I did not search probe lenses due to budget.
- AI depth tools beyond Resolve, such as Depth Anything-based plugins or "DepthScanner", were not researched.

## Q2: Which templates/plugins/presets do tech YouTuber editors commonly use (Motion Array, Envato, Animation Composer, Mister Horse, FX Console, Video Copilot Element 3D)?

### Takeaway
Mister Horse has retired its standalone Animation Composer 3 and Pro listings in favor of one subscription. The free core library (100+ presets) remains, and the plugin is claimed to have 900k+ users. I found no reliable source tying specific plugins to named tech YouTubers' editors.

### Cited Findings
- On aescripts, Animation Composer 3 and Animation Composer Pro are "no longer available" as separate products. Buyers are pointed to a single subscription that covers all Mister Horse products. — [aescripts Animation Composer](https://aescripts.com/animation-composer/); [aescripts Animation Composer Pro](https://aescripts.com/animation-composer-pro/)
- The free Animation Composer includes 100+ motion presets, precomps and sounds, which can be added or removed without permanently changing the project. Pro contains no presets itself and lets users load their own project, sound and video libraries. — [aescripts](https://aescripts.com/animation-composer/); [misterhorse.com](https://misterhorse.com/products/animation-composer-pro/3298)
- G2 says Animation Composer is used by "over 900,000 motion designers" (vendor-adjacent claim). — [G2](https://www.g2.com/sellers/mister-horse)
- An "Editors bundle" and a "Motion designers bundle" exist on aescripts. — [aescripts editors bundle](https://aescripts.com/editors-bundle/); [aescripts motion designers bundle](https://aescripts.com/motion-designers-bundle/)

### Inferences
- Animation Composer (in AE) and Premiere Composer (in Premiere) are the free or cheap default for the transitions, shakes and text presets used in punchy tech edits. Video Copilot Element 3D and FX Console, and Motion Array or Envato subscriptions for lower thirds, callouts and UI mockup templates, are widely used. They are not confirmed for specific channels here.

### Gaps
- I found no sources on Video Copilot Element 3D or FX Console 2025-26 status, or on Motion Array or Envato usage by tech channels.
- I found no first-hand editor interviews listing the plugin stacks of MKBHD, Mrwhosetheboss or Linus Tech Tips.

## Q3: What tutorials by named editors or educators explain "how to edit like MKBHD/Mrwhosetheboss"?

### Takeaway
Web search surfaced no high-quality written or official "edit like MKBHD/Mrwhosetheboss" breakdowns. Those live mainly on YouTube and were not reachable through these searches. The best citable how-tos are vendor tutorials for the core techniques: Adobe Learn, CapCut, Larry Jordan, School of Motion, and Mixing Light.

### Cited Findings
- Adobe's official "text behind subject" tutorial for Premiere Object Mask (June 2026). — [Adobe Learn](https://www.adobe.com/learn/premiere-pro/web/text-behind-subject-object-mask)
- Larry Jordan's tutorials on Magic Mask 2 foreground/background separation and on Premiere 26 masking. — [Larry Jordan MM2](https://larryjordan.com/articles/separate-foreground-from-background-using-magic-mask-2-in-davinci-resolve-20/); [Larry Jordan Premiere 26](https://larryjordan.com/articles/adobe-updates-and-modifies-masking-in-premiere-26/)
- School of Motion (Joey Korenman), Intro to the Graph Editor. [OLD] — [School of Motion](https://www.schoolofmotion.com/tutorials/intro-to-the-graph-editor-in-after-effects/)
- Mixing Light: Jason Bowdach's favorite Resolve 20 features, and Pat's take on whether Magic Mask 2 makes Power Windows obsolete. — [Mixing Light Bowdach](https://mixinglight.com/color-grading-tutorials/davinci-resolve-20-favorite-new-features-bowdach); [Mixing Light AI](https://mixinglight.com/color-grading/ai)
- MKBHD's signature robot-arm moves are documented in his 2018 "Dope Tech: Camera Robots" video and coverage of it. [OLD-2018] — [PetaPixel](https://petapixel.com/2018/04/04/the-crazy-shots-you-can-do-with-a-camera-robot/); [r/mkbhd thread](https://redlib.ssps.io/r/mkbhd/comments/89ju2m/dope_tech_camera_robots)
- Mrwhosetheboss is described only in passing, as "constant motion" with heavy on-screen text. — [gotranscript](https://gotranscript.com/public/mastering-youtube-editing-5-strategies-from-top-creators-to-keep-viewers-hooked); [amraandelma](https://www.amraandelma.com/tech-influencers-with-video-editing-techniques/)

### Inferences
- Writers should point readers to YouTube channels by name as search destinations, not as cited claims: Justin Odisho, Premiere Gal, Cinecom (Jordy Vandeput), Ben Marriott, School of Motion, and Casey Faris for Resolve. Specific video titles were not verified.

### Gaps
- I verified no tutorials by MKBHD or Mrwhosetheboss editors themselves (for example, their editors' own channels or interviews).
- I found no Ben Marriott, Justin Odisho, Premiere Gal or Cinecom written pages in the results. YouTube content is not indexed well by this search tool.
- I found no Reddit r/editors threads or 2025-26 No Film School or PetaPixel pieces specifically on "tech YouTube editing style".
