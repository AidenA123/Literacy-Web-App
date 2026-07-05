/* ==============================
   LESSON INFORMATION
============================== */
// Lesson 1 unlocked by default
if (localStorage.getItem("lesson1Unlocked") === null) {
  localStorage.setItem("lesson1Unlocked", "true");
}

const lessons = [
  {
    id: 1,
    title: "Basic Vowels",
    desc: "Learn the five core vowel sounds and how they appear in simple words.",
    xp: 100
  },
  {
    id: 2,
    title: "Consonants",
    desc: "Explore common consonants and their pronunciations in everyday words.",
    xp: 150
  },
  {
    id: 3,
    title: "Short Sentences",
    desc: "Build and read short sentences using words you have already learned.",
    xp: 200
  },
  {
    id: 4,
    title: "Phonics",
    desc: "Practice reading complete passages with speed and accuracy.",
    xp: 250
  },
  {
    id: 5,
    title: "Type What You See",
    desc: "Look at an image and type the word you see. Practice your spelling!",
    xp: 300
  }
];

/* ==============================
   TOTAL LESSONS
============================== */
const TOTAL_LESSONS = 5;

/* ==============================
   APPLY LOCK / COMPLETION STATUS
============================== */
lessons.forEach(lesson => {
  lesson.locked =
    localStorage.getItem(`lesson${lesson.id}Unlocked`) !== "true";

  lesson.completed =
    localStorage.getItem(`lesson${lesson.id}Complete`) === "true";
});

/* ==============================
   CURRENTLY SELECTED LESSON
============================== */
let currentLessonId = null;

/* ==============================
   SELECT A LESSON
============================== */
function selectLesson(id) {
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return;

  currentLessonId = id;

  const btn   = document.getElementById("start-btn");
  const title = document.getElementById("sel-title");
  const desc  = document.getElementById("sel-desc");
  const xp    = document.getElementById("sel-xp");

  // Locked lesson
  if (lesson.locked) {
    title.textContent = `🔒 ${lesson.title}`;
    desc.textContent  = "This lesson is locked. Complete the previous lesson to unlock it.";
    xp.textContent    = "🔒 Locked";
    xp.style.color    = "#94A3B8";
    btn.disabled      = true;
    return;
  }

  // Completed lesson
  if (lesson.completed) {
    title.textContent = `✅ ${lesson.title}`;
    desc.textContent  = lesson.desc;
    xp.textContent    = `✅ Completed • ⭐ ${lesson.xp} XP`;
    xp.style.color    = "#22C55E";
    btn.disabled      = false;
    return;
  }

  // Available lesson
  title.textContent = lesson.title;
  desc.textContent  = lesson.desc;
  xp.textContent    = `⭐ Reward: ${lesson.xp} XP`;
  xp.style.color    = "#4361EE";
  btn.disabled      = false;
}

/* ==============================
   START LESSON
============================== */
function startLesson() {
  if (currentLessonId === null) {
    alert("Please select a lesson first.");
    return;
  }

  const lesson = lessons.find(l => l.id === currentLessonId);

  if (!lesson || lesson.locked) {
    alert("This lesson is locked.");
    return;
  }

  window.location.href = `Lesson${currentLessonId}.html`;
}

/* ==============================
   UPDATE LESSON NODE APPEARANCE
   Adds node-locked / node-unlocked / node-completed class
   and lock or check icon to each .node[data-id] element.
============================== */
function renderLessonNodes() {
  lessons.forEach(lesson => {
    const node = document.querySelector(`.node[data-id="${lesson.id}"]`);
    if (!node) return;

    node.classList.remove("node-locked", "node-unlocked", "node-completed");
    node.classList.add(
      lesson.completed ? "node-completed" :
      lesson.locked    ? "node-locked"    : "node-unlocked"
    );

    const existingIcon = node.querySelector(".lock-icon, .check-icon");
    if (existingIcon) existingIcon.remove();

    if (lesson.completed) {
      const icon = document.createElement("span");
      icon.className   = "check-icon";
      icon.textContent = "✓";
      node.appendChild(icon);
    } else if (lesson.locked) {
      const icon = document.createElement("span");
      icon.className   = "lock-icon";
      icon.textContent = "🔒";
      node.appendChild(icon);
    }
  });
}

/* ==============================
   STARS & COMPLETION HELPERS
============================== */
function getTotalStars() {
  let total = 0;
  for (let lesson = 1; lesson <= TOTAL_LESSONS; lesson++) {
    for (let stage = 1; stage <= 5; stage++) {
      const score = parseInt(localStorage.getItem(`lesson${lesson}Stage${stage}Score`) || "0");
      if (score >= 100)     total += 3;
      else if (score >= 70) total += 2;
      else if (score >= 50) total += 1;
    }
  }
  return total;
}

function getCompletedLessons() {
  let count = 0;
  for (let i = 1; i <= TOTAL_LESSONS; i++) {
    if (localStorage.getItem(`lesson${i}Complete`) === "true") count++;
  }
  return count;
}

/* ==============================
   SYNC DASHBOARD STATS
   Reads XP, words learnt, streak, stars, and lesson completion
   from localStorage and updates all dashboard stat elements.
============================== */
function syncDashboardStats() {
  const xpText       = document.getElementById("xp-text");
  const levelText    = document.getElementById("level-text");
  const goalFill     = document.getElementById("goal-fill");
  const goalPct      = document.getElementById("goal-percentage");
  const statWords    = document.getElementById("stat-words");
  const statLessons  = document.getElementById("stat-lessons");
  const statStreak   = document.getElementById("stat-streak");
  const statStars    = document.getElementById("stat-stars");

  if (!xpText && !goalFill) return; // not on dashboard page

  const xp             = parseInt(localStorage.getItem("xp")) || 0;
  const level          = Math.floor(xp / 100) + 1;
  const wordsLearned   = parseInt(localStorage.getItem("wordsLearned")) || 0;
  const streak         = parseInt(localStorage.getItem("streak")) || 0;
  const completedCount = getCompletedLessons();
  const goalPercent    = Math.round((completedCount / TOTAL_LESSONS) * 100);

  if (xpText)      xpText.textContent      = `XP: ${xp}`;
  if (levelText)   levelText.textContent   = `Level ${level}`;
  if (goalFill)    goalFill.style.width    = `${goalPercent}%`;
  if (goalPct)     goalPct.textContent     = `${goalPercent}%`;
  if (statWords)   statWords.textContent   = wordsLearned;
  if (statLessons) statLessons.textContent = `${completedCount} / ${TOTAL_LESSONS}`;
  if (statStreak)  statStreak.textContent  = `${streak} Day${streak === 1 ? "" : "s"}`;
  if (statStars)   statStars.textContent   = getTotalStars();
}

/* ==============================
   AUTHENTICATION HELPERS
============================== */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function resetAllProgress() {
  const confirmed = confirm(
    "⚠️ Are you sure? This will reset ALL progress, lock all lessons, and return to Level 1.\n\nThis action cannot be undone."
  );
  if (!confirmed) return;

  // Matches any key that belongs to progress data.
  // Covers lesson1Complete, lesson2Stage3Score, lesson3StartTime, etc.
  function isProgressKey(key) {
    return (
      key.startsWith("lesson")   ||
      key === "xp"               ||
      key === "wordsLearned"     ||
      key === "streak"           ||
      key === "lastActiveDate"
    );
  }

  // Snapshot only non-progress keys (settings, currentUser, etc.)
  const toRestore = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!isProgressKey(key)) {
      toRestore[key] = localStorage.getItem(key);
    }
  }

  localStorage.clear();

  // Restore non-progress data
  for (const [key, value] of Object.entries(toRestore)) {
    localStorage.setItem(key, value);
  }

  // Reset progress to defaults
  localStorage.setItem("lesson1Unlocked", "true");
  localStorage.setItem("xp", "0");
  localStorage.setItem("wordsLearned", "0");
  localStorage.setItem("streak", "0");

  alert("✅ Progress reset! Returning to dashboard...");
  window.location.reload();
}

function ensureAuthenticated() {
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "index.html";
  }
}

/* ==============================
   INIT (dashboard only)
============================== */
/* ==============================
   UNLOCK AUDIT
   On every dashboard load, ensure no lesson is unlocked
   unless the previous lesson is complete (or it's lesson 1).
   This clears any stale flags left over from testing.
============================== */
function auditUnlocks() {
  for (let i = 2; i <= TOTAL_LESSONS; i++) {
    const prevComplete = localStorage.getItem(`lesson${i - 1}Complete`) === "true";
    if (!prevComplete) {
      localStorage.removeItem(`lesson${i}Unlocked`);
    }
  }
}

window.addEventListener("load", () => {
  ensureAuthenticated();
  auditUnlocks();
  renderLessonNodes();
  syncDashboardStats();
});