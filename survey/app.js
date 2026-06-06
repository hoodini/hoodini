/* =============================================================================
 *  YUV.AI — Survey engine
 *  תלוי ב-config.js (CONFIG, QUESTIONS). אין תלות חיצונית.
 * ============================================================================= */
(function () {
  "use strict";

  /* ---- apply brand colors ---- */
  const root = document.documentElement;
  if (CONFIG.accent) root.style.setProperty("--accent", CONFIG.accent);
  if (CONFIG.accent2) root.style.setProperty("--accent2", CONFIG.accent2);
  document.getElementById("brand").textContent = CONFIG.brand;

  /* ---- state ---- */
  const answers = {};
  let history = []; // stack of visited question indexes
  let current = 0;
  const startedAt = Date.now();
  const LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ"];

  const stage = document.getElementById("stage");
  const progressBar = document.querySelector("#progress > span");
  const backBtn = document.getElementById("back");

  /* ---- helpers ---- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function isVisible(q) {
    return typeof q.condition !== "function" || q.condition(answers);
  }
  function visibleQuestions() {
    return QUESTIONS.filter(isVisible);
  }
  // index of next/prev *visible* question from a given absolute index
  function nextIndex(from) {
    for (let i = from + 1; i < QUESTIONS.length; i++) if (isVisible(QUESTIONS[i])) return i;
    return -1;
  }
  function updateProgress() {
    // only real, answerable questions count toward progress (exclude welcome/statement/end)
    const vis = visibleQuestions().filter((q) => !["welcome", "statement", "end"].includes(q.type));
    const answeredCount = vis.filter((q) => q.id in answers).length;
    const total = vis.length || 1;
    const pct = QUESTIONS[current] && QUESTIONS[current].type === "end"
      ? 100
      : Math.min(100, Math.round((answeredCount / total) * 100));
    progressBar.style.width = pct + "%";
  }

  /* ---- navigation ---- */
  function goTo(idx, push) {
    if (idx < 0 || idx >= QUESTIONS.length) return;
    const old = stage.querySelector(".slide");
    const doRender = () => {
      if (push !== false && current !== idx) history.push(current);
      current = idx;
      render();
    };
    if (old) {
      old.classList.add("out");
      setTimeout(doRender, 200);
    } else {
      doRender();
    }
  }
  function next() {
    const q = QUESTIONS[current];
    if (!validate(q)) return;
    const n = nextIndex(current);
    if (n === -1) return;
    goTo(n, true);
  }
  function back() {
    if (!history.length) return;
    const prev = history.pop();
    current = prev;
    render(true);
  }
  backBtn.addEventListener("click", back);

  function validate(q) {
    if (!q.required) return true;
    const v = answers[q.id];
    if (q.type === "multi") return Array.isArray(v) && v.length > 0;
    if (q.type === "email") return v && /.+@.+\..+/.test(v.email || "");
    return v !== undefined && v !== null && String(v).trim() !== "";
  }

  /* ---- render ---- */
  function render(noHistoryPush) {
    const q = QUESTIONS[current];
    backBtn.style.display = history.length ? "inline-flex" : "none";

    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = renderQuestion(q);
    stage.innerHTML = "";
    stage.appendChild(slide);
    wire(q, slide);
    updateProgress();

    // focus first input
    const inp = slide.querySelector("input[type=text], textarea, input[type=email]");
    if (inp) setTimeout(() => inp.focus(), 250);
  }

  function qNumberBadge() {
    const vis = visibleQuestions().filter((x) => !["welcome", "statement", "end"].includes(x.type));
    const pos = vis.findIndex((x) => x.id === QUESTIONS[current].id);
    if (pos === -1) return "";
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    return `<div class="qnum">${pos + 1} מתוך ${vis.length} ${arrow}</div>`;
  }

  function renderQuestion(q) {
    switch (q.type) {
      case "welcome":   return renderWelcome(q);
      case "statement": return renderStatement(q);
      case "single":    return renderChoice(q, false);
      case "multi":     return renderChoice(q, true);
      case "scale":     return renderScale(q);
      case "shorttext": return renderText(q, false);
      case "longtext":  return renderText(q, true);
      case "email":     return renderEmail(q);
      case "end":       return renderEnd(q);
      default:          return `<h1 class="q">${esc(q.title)}</h1>`;
    }
  }

  function renderWelcome(q) {
    return `
      <div class="center-block">
        <h1 class="q">${esc(q.title)}</h1>
        <p class="sub">${esc(q.subtitle)}</p>
        <div class="meta">
          <span>⏱️ כ-${CONFIG.estimatedMinutes} דקות</span>
          <span>🎁 מתנה בסיום</span>
          <span>🔒 אנונימי אם תרצה</span>
        </div>
        <div class="actions">
          <button type="button" class="btn" data-act="next">בוא נתחיל <span class="kbd">↵</span></button>
        </div>
      </div>`;
  }

  function renderStatement(q) {
    return `
      <div class="center-block">
        <div class="qnum">✨</div>
        <h1 class="q">${esc(q.title)}</h1>
        ${q.subtitle ? `<p class="sub">${esc(q.subtitle)}</p>` : ""}
        <div class="actions">
          <button type="button" class="btn" data-act="next">${esc(q.cta || "המשך")} <span class="kbd">↵</span></button>
        </div>
      </div>`;
  }

  function renderChoice(q, multi) {
    const sel = answers[q.id] || (multi ? [] : null);
    const opts = q.options.map((o, i) => {
      const isSel = multi ? sel.includes(o.value) : sel === o.value;
      const check = '<svg class="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>';
      const ariaRole = multi ? "checkbox" : "radio";
      return `
        <button type="button" class="opt ${isSel ? "selected" : ""}" data-val="${esc(o.value)}" data-i="${i}" role="${ariaRole}" aria-checked="${isSel}">
          <span class="key" aria-hidden="true">${LETTERS[i] || i + 1}</span>
          ${o.emoji ? `<span class="emoji" aria-hidden="true">${esc(o.emoji)}</span>` : ""}
          <span class="label">${esc(o.label)}</span>
          ${check}
        </button>`;
    }).join("");

    let otherBlock = "";
    if (q.allowOther) {
      const otherVal = (answers[q.id + "__other"]) || "";
      const otherSel = multi ? sel.includes("__other") : sel === "__other";
      const check = '<svg class="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>';
      otherBlock = `
        <div class="other-wrap">
          <button type="button" class="opt ${otherSel ? "selected" : ""}" data-val="__other" data-i="${q.options.length}" role="${multi ? "checkbox" : "radio"}" aria-checked="${otherSel}">
            <span class="key" aria-hidden="true">${LETTERS[q.options.length] || "+"}</span>
            <span class="emoji" aria-hidden="true">✏️</span>
            <span class="label">אחר…</span>
            ${check}
          </button>
          <input class="other-input" data-other="1" placeholder="ספר/י לי…" value="${esc(otherVal)}" style="${otherSel ? "" : "display:none"}">
        </div>`;
    }

    const continueBtn = multi
      ? `<div class="actions">
           <button type="button" class="btn" data-act="next" ${validate(q) ? "" : "disabled"}>המשך <span class="kbd">↵</span></button>
           ${q.maxSelect ? `<span class="hint">עד ${q.maxSelect} בחירות</span>` : ""}
         </div>`
      : `<div class="actions"><span class="hint">בחר/י כדי להמשיך, או הקש/י את האות</span></div>`;

    return `
      ${qNumberBadge()}
      <h1 class="q">${esc(q.title)}</h1>
      ${q.subtitle ? `<p class="sub">${esc(q.subtitle)}</p>` : ""}
      <div class="options">${opts}${otherBlock}</div>
      ${continueBtn}`;
  }

  function renderScale(q) {
    const sel = answers[q.id];
    let btns = "";
    for (let n = q.min; n <= q.max; n++) {
      btns += `<button type="button" data-val="${n}" class="${sel === n ? "selected" : ""}">${n}</button>`;
    }
    return `
      ${qNumberBadge()}
      <h1 class="q">${esc(q.title)}</h1>
      ${q.subtitle ? `<p class="sub">${esc(q.subtitle)}</p>` : ""}
      <div class="scale">${btns}</div>
      <div class="scale-labels"><span>${esc(q.minLabel || q.min)}</span><span>${esc(q.maxLabel || q.max)}</span></div>
      <div class="actions"><span class="hint">בחר/י דירוג כדי להמשיך</span></div>`;
  }

  function renderText(q, area) {
    const v = answers[q.id] || "";
    const field = area
      ? `<textarea class="text-area" placeholder="${esc(q.placeholder || "")}">${esc(v)}</textarea>`
      : `<input type="text" class="text-input" placeholder="${esc(q.placeholder || "")}" value="${esc(v)}">`;
    return `
      ${qNumberBadge()}
      <h1 class="q">${esc(q.title)}</h1>
      ${q.subtitle ? `<p class="sub">${esc(q.subtitle)}</p>` : ""}
      ${field}
      <div class="actions">
        <button type="button" class="btn" data-act="next">${q.required ? "המשך" : "המשך"} <span class="kbd">↵</span></button>
        ${q.required ? "" : `<button type="button" class="btn ghost" data-act="skip">דלג/י</button>`}
      </div>`;
  }

  function renderEmail(q) {
    const v = answers[q.id] || {};
    return `
      ${qNumberBadge()}
      <h1 class="q">${esc(q.title)}</h1>
      ${q.subtitle ? `<p class="sub">${esc(q.subtitle)}</p>` : ""}
      <div class="field"><label>שם (אופציונלי)</label><input type="text" data-k="name" placeholder="איך לקרוא לך?" value="${esc(v.name || "")}"></div>
      <div class="field"><label>אימייל</label><input type="email" data-k="email" placeholder="you@example.com" value="${esc(v.email || "")}"></div>
      <div class="actions">
        <button type="button" class="btn" data-act="next">סיום <span class="kbd">↵</span></button>
      </div>
      <p class="error-msg" data-err style="display:none">צריך אימייל תקין כדי שנוכל לעדכן אותך 🙂</p>`;
  }

  function renderEnd(q) {
    const c = CONFIG.course;
    let url = c.url;
    if (c.couponCode && c.appendCouponParam) {
      url += (url.includes("?") ? "&" : "?") + encodeURIComponent(c.appendCouponParam) + "=" + encodeURIComponent(c.couponCode);
    }
    const burst = '<div class="burst"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></div>';
    return `
      <div class="center-block" id="end-block">
        ${burst}
        <h1 class="q">${esc(q.title)}</h1>
        <p class="sub" data-status>${esc(q.subtitle)}</p>
        <div class="course">
          <span class="tag">${esc(c.discountText)} • מתנה על ההשתתפות</span>
          <h3>${esc(c.name)}</h3>
          <p>הקורס שלי שילמד אותך לרתום את Claude Desktop כמו מקצוען. הקופון תקף לזמן מוגבל 👇</p>
          ${c.couponCode ? `
          <div class="coupon">
            <code id="coupon">${esc(c.couponCode)}</code>
            <button type="button" class="copy-btn" data-copy>העתק/י קוד</button>
          </div>` : ""}
          <div class="actions">
            <a class="btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">לקורס עם ${esc(c.discountText)} ←</a>
          </div>
        </div>
      </div>`;
  }

  /* ---- wiring ---- */
  function wire(q, slide) {
    // generic next/skip buttons
    slide.querySelectorAll("[data-act]").forEach((b) => {
      b.addEventListener("click", () => {
        const act = b.getAttribute("data-act");
        if (act === "skip") { delete answers[q.id]; next(); }
        else next();
      });
    });

    if (q.type === "single" || q.type === "multi") wireChoice(q, slide);
    if (q.type === "scale") wireScale(q, slide);
    if (q.type === "shorttext" || q.type === "longtext") wireText(q, slide);
    if (q.type === "email") wireEmail(q, slide);
    if (q.type === "end") wireEnd(slide);
  }

  function wireChoice(q, slide) {
    const multi = q.type === "multi";
    slide.querySelectorAll(".opt").forEach((btn) => {
      btn.addEventListener("click", () => selectOpt(q, slide, btn.getAttribute("data-val")));
    });
    const otherInput = slide.querySelector("[data-other]");
    if (otherInput) {
      otherInput.addEventListener("input", () => { answers[q.id + "__other"] = otherInput.value; });
      otherInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); if (multi) next(); else next(); }
      });
    }
  }

  function selectOpt(q, slide, val) {
    const multi = q.type === "multi";
    if (multi) {
      const arr = answers[q.id] ? answers[q.id].slice() : [];
      const at = arr.indexOf(val);
      if (at >= 0) arr.splice(at, 1);
      else {
        if (q.maxSelect && arr.length >= q.maxSelect) return; // cap reached
        arr.push(val);
      }
      answers[q.id] = arr;
      refreshChoiceUI(q, slide);
    } else {
      answers[q.id] = val;
      refreshChoiceUI(q, slide);
      // auto-advance for single choice (unless "other" needs typing)
      if (val === "__other") {
        const oi = slide.querySelector("[data-other]");
        if (oi) oi.focus();
      } else {
        setTimeout(next, 260);
      }
    }
  }

  function refreshChoiceUI(q, slide) {
    const multi = q.type === "multi";
    const sel = answers[q.id] || (multi ? [] : null);
    slide.querySelectorAll(".opt").forEach((btn) => {
      const v = btn.getAttribute("data-val");
      const on = multi ? sel.includes(v) : sel === v;
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-checked", on);
      if (v === "__other") {
        const oi = slide.querySelector("[data-other]");
        if (oi) oi.style.display = on ? "" : "none";
      }
    });
    const cont = slide.querySelector('[data-act="next"]');
    if (cont && multi) cont.disabled = !validate(q);
    updateProgress();
  }

  function wireScale(q, slide) {
    slide.querySelectorAll(".scale button").forEach((b) => {
      b.addEventListener("click", () => {
        answers[q.id] = parseInt(b.getAttribute("data-val"), 10);
        slide.querySelectorAll(".scale button").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        updateProgress();
        setTimeout(next, 260);
      });
    });
  }

  function wireText(q, slide) {
    const el = slide.querySelector(".text-input, .text-area");
    if (!el) return;
    el.addEventListener("input", () => { answers[q.id] = el.value; updateProgress(); });
    el.addEventListener("keydown", (e) => {
      const enterToSubmit = q.type === "shorttext" || (e.key === "Enter" && (e.metaKey || e.ctrlKey));
      if (e.key === "Enter" && enterToSubmit) { e.preventDefault(); next(); }
    });
  }

  function wireEmail(q, slide) {
    const get = (k) => slide.querySelector(`[data-k="${k}"]`);
    const save = () => { answers[q.id] = { name: get("name").value.trim(), email: get("email").value.trim() }; };
    slide.querySelectorAll("[data-k]").forEach((i) => i.addEventListener("input", save));
    const err = slide.querySelector("[data-err]");
    const btn = slide.querySelector('[data-act="next"]');
    if (btn) {
      // override generic handler: validate first
      btn.replaceWith(btn.cloneNode(true));
      const fresh = slide.querySelector('[data-act="next"]');
      fresh.addEventListener("click", () => {
        save();
        if (!validate(q)) { err.style.display = "block"; return; }
        err.style.display = "none";
        next();
      });
    }
    get("email").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); slide.querySelector('[data-act="next"]').click(); } });
  }

  function wireEnd(slide) {
    const copy = slide.querySelector("[data-copy]");
    if (copy) {
      copy.addEventListener("click", () => {
        navigator.clipboard.writeText(CONFIG.course.couponCode).then(() => {
          copy.textContent = "הועתק! ✓";
          setTimeout(() => (copy.textContent = "העתק/י קוד"), 1800);
        });
      });
    }
    submitResults(slide);
  }

  /* ---- keyboard ---- */
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("admin-view")) return;
    const q = QUESTIONS[current];
    if (!q) return;
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea";

    if (e.key === "Enter" && !typing) {
      const nb = stage.querySelector('[data-act="next"]:not([disabled])');
      if (nb) { e.preventDefault(); nb.click(); }
      return;
    }
    // letter shortcuts for choice questions
    if ((q.type === "single" || q.type === "multi") && !typing) {
      const i = LETTERS.indexOf(e.key);
      if (i >= 0) {
        const btn = stage.querySelector(`.opt[data-i="${i}"]`);
        if (btn) { e.preventDefault(); btn.click(); }
      }
    }
  });

  /* ---- submission ---- */
  function buildPayload() {
    // Intentionally no userAgent / fingerprinting — keep the survey anonymous
    // unless the respondent explicitly opts in with name + email.
    const out = {
      submittedAt: new Date().toISOString(),
      durationSec: Math.round((Date.now() - startedAt) / 1000),
    };
    QUESTIONS.forEach((q) => {
      if (["welcome", "statement", "end"].includes(q.type)) return;
      if (!(q.id in answers)) return;
      if (!isVisible(q)) return; // skip answers from branches the user navigated away from
      let v = answers[q.id];
      // resolve labels for readability
      if ((q.type === "single" || q.type === "multi") && q.options) {
        const labelOf = (val) => {
          if (val === "__other") return "אחר: " + (answers[q.id + "__other"] || "");
          const o = q.options.find((x) => x.value === val);
          return o ? o.label : val;
        };
        v = q.type === "multi" ? v.map(labelOf) : labelOf(v);
      }
      if (q.type === "email") { out[q.id + "_name"] = v.name; out[q.id + "_email"] = v.email; return; }
      out[q.id] = Array.isArray(v) ? v.join(" | ") : v;
    });
    return out;
  }

  function submitResults(slide) {
    const payload = buildPayload();
    const status = slide.querySelector("[data-status]");

    // always keep a local copy
    try {
      const all = JSON.parse(localStorage.getItem("yuvai_survey") || "[]");
      all.push(payload);
      localStorage.setItem("yuvai_survey", JSON.stringify(all));
    } catch (e) { /* ignore */ }

    if (!CONFIG.formEndpoint) {
      // demo mode — data saved locally only
      return;
    }

    const note = document.createElement("span");
    note.className = "spinner";
    if (status) status.appendChild(note);

    const done = () => { if (note) note.remove(); };
    const fail = () => {
      done();
      if (status) {
        const e = document.createElement("p");
        e.className = "error-msg";
        e.textContent = "לא הצלחנו לשמור את התשובה לשרת, אבל היא נשמרה אצלך. אפשר לרענן ולנסות שוב.";
        status.parentElement.appendChild(e);
      }
    };

    let url = CONFIG.formEndpoint;
    let opts;
    if (CONFIG.endpointType === "formspree") {
      opts = { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) };
    } else if (CONFIG.endpointType === "gas") {
      // Google Apps Script web app — text/plain avoids CORS preflight
      opts = { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) };
    } else {
      opts = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
    }

    fetch(url, opts).then((r) => { if (!r.ok) throw new Error(r.status); done(); }).catch(fail);
  }

  /* ---- admin view (#admin) — view & export locally stored responses ---- */
  function maybeAdmin() {
    if (location.hash !== "#admin") return false;
    const data = JSON.parse(localStorage.getItem("yuvai_survey") || "[]");
    const app = document.getElementById("app");
    app.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.id = "admin-view";
    if (!data.length) {
      wrap.innerHTML = "<h1 class='q'>אין תשובות שמורות מקומית</h1><p class='sub'>תשובות שנאספות דרך השרת מופיעות ביעד שהגדרת (Formspree/Sheet), לא כאן.</p>";
      app.appendChild(wrap);
      return true;
    }
    const cols = Array.from(data.reduce((s, r) => { Object.keys(r).forEach((k) => s.add(k)); return s; }, new Set()));
    const th = cols.map((c) => `<th>${esc(c)}</th>`).join("");
    const rows = data.map((r) => "<tr>" + cols.map((c) => `<td>${esc(r[c] == null ? "" : r[c])}</td>`).join("") + "</tr>").join("");
    wrap.innerHTML = `
      <h1 class="q">תשובות (${data.length}) — מאוחסן מקומית בדפדפן זה</h1>
      <div class="actions">
        <button type="button" class="btn" id="csv">ייצוא CSV</button>
        <button type="button" class="btn ghost" id="clear">מחק הכל</button>
      </div>
      <div style="overflow:auto;margin-top:20px"><table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div>`;
    app.appendChild(wrap);
    document.getElementById("csv").addEventListener("click", () => exportCSV(cols, data));
    document.getElementById("clear").addEventListener("click", () => {
      if (confirm("למחוק את כל התשובות השמורות מקומית?")) { localStorage.removeItem("yuvai_survey"); location.reload(); }
    });
    return true;
  }

  function exportCSV(cols, data) {
    const escc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...data.map((r) => cols.map((c) => escc(r[c])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "yuvai-survey-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
  }

  /* ---- boot ---- */
  if (!maybeAdmin()) render();
  window.addEventListener("hashchange", () => { if (location.hash === "#admin") location.reload(); });
})();
