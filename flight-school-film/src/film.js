// Shared timeline for both aspect ratios. Gate 1: static keyframe layouts only;
// motion is authored in Gate 2/3. Every from-state will be set at t=0 (seek-safe).
(function () {
  const tl = gsap.timeline({ paused: true });
  document.fonts.ready.then(() => {
    tl.set("#root", { opacity: 1 }, 0);
    window.__timelines["main"] = tl;
  });
})();
