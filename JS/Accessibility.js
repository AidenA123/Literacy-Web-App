/* =========================================================
   STATE
========================================================= */
let currentTheme = localStorage.getItem("theme") || "light";
let ttsEnabled = localStorage.getItem("tts") === "true";
let fontSize = parseInt(localStorage.getItem("fontSize")) || 16;

let activeUtterance = null;
let isPaused = false;
let lastSpeechSegments = [];

let wordElements = [];
let speechQueue = [];

const SEGMENT_GAP_MS = 400; // pause between queued speech segments

/* =========================================================
   UTIL
========================================================= */
function save(k, v) {
  localStorage.setItem(k, v);
}

function cleanText(text = "") {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[🍎🐘🍦🍊☂️⭐🔒↓↑→←]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   THEME + CONTRAST
========================================================= */
function setTheme(mode) {
  currentTheme = mode;
  save("theme", mode);
  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle("dark", currentTheme === "dark");
  document.getElementById("btn-light")?.classList.toggle("settings-btn--active", currentTheme === "light");
  document.getElementById("btn-dark")?.classList.toggle("settings-btn--active", currentTheme === "dark");
}

function toggleContrast() {
  const enabled = document.body.classList.toggle("high-contrast");
  save("highContrast", enabled);
  document.getElementById("contrast-btn")?.classList.toggle("settings-btn--active", enabled);

  if (enabled) document.body.classList.remove("dark");
  else document.body.classList.toggle("dark", currentTheme === "dark");
}

/* =========================================================
   TTS QUEUE SYSTEM
   Speaks an array of text segments one at a time, waiting
   for each to finish before starting the next.
========================================================= */
function queueSpeech(textArray, saveLast = true) {
  if (!ttsEnabled || !textArray || !textArray.length) return;

  speechSynthesis.cancel();
  speechQueue = [...textArray];

  if (saveLast) lastSpeechSegments = [...textArray];

  speakNextInQueue();
}

function speakNextInQueue() {
  if (!speechQueue.length) return;

  const raw = speechQueue.shift();
  const clean = cleanText(raw);

  if (!clean) {
    speakNextInQueue();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  activeUtterance = utterance;
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onboundary = (e) => {
    if (!wordElements.length) return;

    const words = clean.split(" ");
    let count = 0;
    let index = 0;

    for (let i = 0; i < words.length; i++) {
      count += words[i].length + 1;
      if (count >= e.charIndex) {
        index = i;
        break;
      }
    }
    highlightWord(index);
  };

  utterance.onend = () => {
    setTimeout(speakNextInQueue, SEGMENT_GAP_MS);
  };

  speechSynthesis.speak(utterance);
}

// Single-segment speak for short one-off phrases
function speak(text, saveLast = true) {
  queueSpeech([text], saveLast);
}

function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  save("tts", ttsEnabled);
  document.getElementById("tts-btn")?.classList.toggle("tts-btn--on", ttsEnabled);

  if (ttsEnabled) speak("Text to speech enabled");
  else speechSynthesis.cancel();
}

function repeatSentence() {
  if (lastSpeechSegments.length) queueSpeech(lastSpeechSegments, false);
}

/* =========================================================
   WORD HIGHLIGHT
========================================================= */
function wrapWords(container) {
  const nodes = container.querySelectorAll("p, span, h1, h2, li, div");

  nodes.forEach(node => {
    if (node.children.length) return;
    const words = node.innerText.split(" ");
    node.innerHTML = words.map(w => `<span class="tts-word">${w}</span>`).join(" ");
  });

  wordElements = Array.from(container.querySelectorAll(".tts-word"));
}

function highlightWord(i) {
  wordElements.forEach(w => w.classList.remove("active"));
  if (wordElements[i]) wordElements[i].classList.add("active");
}

/* =========================================================
   PAUSE / RESUME
========================================================= */
function togglePauseSpeech() {
  if (!activeUtterance) return;

  if (!isPaused) {
    speechSynthesis.pause();
    isPaused = true;
  } else {
    speechSynthesis.resume();
    isPaused = false;
  }
}

/* =========================================================
   CLICK TO SPEAK
========================================================= */
document.addEventListener("click", (e) => {
  if (!ttsEnabled) return;

  const el = e.target;
  if (el.closest("button") || el.closest("input")) return;
  if (!["P", "SPAN", "LI", "H1", "H2", "DIV"].includes(el.tagName)) return;

  const text = el.innerText?.trim();
  if (!text || text.length > 100) return;

  queueSpeech([text]);
});

/* =========================================================
   TTS: READ LESSON (called from Script.js's selectLesson)
========================================================= */
function readLesson(lesson) {
  if (!ttsEnabled || !lesson) return;

  if (lesson.locked) {
    queueSpeech([`${lesson.title}.`, "This lesson is locked."]);
    return;
  }

  queueSpeech([
    `${lesson.title}.`,
    lesson.desc,
    `Reward ${lesson.xp} XP.`
  ]);
}

/* =========================================================
   LESSON PAGE AUTO READ
   Reads page content aloud when a lesson page loads.
   Walks h1/h2/p elements in order, then reads option
   buttons as separate segments with pauses between.
========================================================= */
function autoReadLesson() {
  if (!ttsEnabled) return;

  const container = document.querySelector(".lesson-container");
  if (!container) return;

  wrapWords(container);

  const segments = [];

  container.querySelectorAll("h1, h2, h3, p").forEach(el => {
    if (el.id === "result") return;
    const text = cleanText(el.innerText);
    if (text) segments.push(text);
  });

  const buttons = container.querySelectorAll("button:not(#complete-btn):not(#repeat-btn)");
  if (buttons.length) {
    segments.push("Your options are:");
    buttons.forEach(b => {
      const text = cleanText(b.innerText);
      if (text) segments.push(text);
    });
  }

  queueSpeech(["Lesson started.", ...segments]);
}

/* =========================================================
   FONT SYSTEM
========================================================= */
function setFont(size) {
  fontSize = size;
  document.documentElement.style.fontSize = size + "px";
  save("fontSize", size);
}

function increaseFont() { if (fontSize < 20) setFont(fontSize + 2); }
function decreaseFont() { if (fontSize > 10) setFont(fontSize - 2); }
function defaultFont()  { setFont(16); }

/* =========================================================
   DASHBOARD SYNC (Accessibility.js version)
   Updates XP, level, goal bar, words, lessons, streak, and
   stars. Only runs if dashboard elements exist on the page.
   TOTAL_LESSONS must match the number in Script.js.
========================================================= */
const TOTAL_LESSONS_A11Y = 5;

function syncDashboard() {
  const xpText      = document.getElementById("xp-text");
  const levelText   = document.getElementById("level-text");
  const goalFill    = document.getElementById("goal-fill");
  const goalPct     = document.getElementById("goal-percentage");
  const statLessons = document.getElementById("stat-lessons");
  const statWords   = document.getElementById("stat-words");
  const statStreak  = document.getElementById("stat-streak");

  if (!xpText && !goalFill) return;

  const xp           = parseInt(localStorage.getItem("xp")) || 0;
  const level        = Math.floor(xp / 100) + 1;
  const wordsLearned = parseInt(localStorage.getItem("wordsLearned")) || 0;
  const streak       = parseInt(localStorage.getItem("streak")) || 0;

  let completedCount = 0;
  for (let i = 1; i <= TOTAL_LESSONS_A11Y; i++) {
    if (localStorage.getItem(`lesson${i}Complete`) === "true") completedCount++;
  }

  const goalPercent = Math.round((completedCount / TOTAL_LESSONS_A11Y) * 100);

  if (xpText)      xpText.textContent      = `XP: ${xp}`;
  if (levelText)   levelText.textContent   = `Level ${level}`;
  if (goalFill)    goalFill.style.width    = `${goalPercent}%`;
  if (goalPct)     goalPct.textContent     = `${goalPercent}%`;
  if (statLessons) statLessons.textContent = `${completedCount} / ${TOTAL_LESSONS_A11Y}`;
  if (statWords)   statWords.textContent   = wordsLearned;
  if (statStreak)  statStreak.textContent  = `${streak} Day${streak === 1 ? "" : "s"}`;
}

/* =========================================================
   INIT
   Runs on every page. Applies saved theme, contrast, TTS
   state, and font size. Also runs autoReadLesson() (no-op
   on non-lesson pages) and syncDashboard() (no-op on
   non-dashboard pages).
========================================================= */
window.addEventListener("load", () => {
  applyTheme();

  document.body.classList.toggle("high-contrast", localStorage.getItem("highContrast") === "true");

  ttsEnabled = localStorage.getItem("tts") === "true";
  document.getElementById("tts-btn")?.classList.toggle("tts-btn--on", ttsEnabled);

  document.documentElement.style.fontSize = fontSize + "px";

  syncDashboard();
  autoReadLesson();
});