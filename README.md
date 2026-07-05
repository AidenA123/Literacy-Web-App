# Literacy App - Quick Reference Guide

A literacy support web app with login/register, a lesson dashboard, five interactive phonics/reading lessons, and accessibility features (dark mode, high contrast, text-to-speech, adjustable font size)

---

# Files

| File                | Purpose                                                        |
| ------------------- | --------------------------------------------------------------- |
| `index.html`        | Login / Register page                                          |
| `Dashboard.html`    | Main hub — app info, lesson map, statistics, settings           |
| `Lesson1.html`      | Lesson 1 — Basic Vowels                                         |
| `Lesson2.html`      | Lesson 2 — Consonants                                           |
| `Lesson3.html`      | Lesson 3 — Short Sentences                                      |
| `Lesson4.html`      | Lesson 4 — Phonics                                              |
| `Lesson5.html`      | Lesson 5 — Type What You See                                    |
| `CSS/Styles.css`    | Colours, sizing, spacing, and appearance                        |
| `JS/Account.js`     | Login / Register form logic                                     |
| `JS/Script.js`      | Lesson data, lock/unlock logic, dashboard stats sync             |
| `JS/Lessons.js`     | Stage system, scoring, hints, timers, lesson completion          |
| `JS/Accessibility.js` | Theme, high contrast, text-to-speech, font size controls       |
| `Assets/Images/book.ico` | Favicon                                                    |

---

# App Sections

## 1. Login / Register (`index.html`)

Two tabs — Login and Register — toggled via `showLogin()` / `showRegister()` in `JS/Account.js`.

* Registered accounts are stored in `localStorage` under `users`
* On successful login, the current user is stored under `currentUser` and the app redirects to `Dashboard.html`

---

## 2. App Info Card (`Dashboard.html`)

Shows:

* App Name
* User Level (`#level-text`)
* User XP (`#xp-text`)
* Daily Goal Progress (`#goal-fill`, `#goal-percentage`)

### Change App Name

Search for (Dashboard.html):

```html
<h2 class="app-name">Literacy App</h2>
```

### Level, XP, and Goal text

These are **not hardcoded** — they're calculated and written in automatically by `syncDashboardStats()` in `JS/Script.js`, based on values stored in `localStorage` (`xp`, `wordsLearned`, lesson completion, etc.). To change starting values, edit the defaults in `Script.js` or clear progress via **Reset Progress** in Settings.

---

## 3. Selected Lesson Card (`Dashboard.html`)

Shows details for whichever lesson node was last clicked.

* `#sel-title` — lesson title
* `#sel-desc` — lesson description
* `#sel-xp` — XP reward, locked/completed state

Populated by `selectLesson(id)` in `JS/Script.js`. To edit lesson titles, descriptions, or XP rewards, edit the `lessons` array at the top of `Script.js`:

```javascript
const lessons = [
  { id: 1, title: "Basic Vowels", desc: "...", xp: 100 },
  ...
];
```

---

## 4. Learning Card (`Dashboard.html`)

Shows the five lesson nodes in sequence, connected by arrows.

* `.node-unlocked` — available lesson
* `.node-locked` — locked lesson (shows 🔒)
* `.node-completed` — finished lesson (shows ✓)

These classes are applied automatically by `renderLessonNodes()` in `Script.js` — don't set them manually in the HTML, as they'll be overwritten on page load.

### Change Lesson Names

Search for (Dashboard.html):

```html
<div class="node" data-id="1" onclick="selectLesson(1)">
    <span>Basic Vowels</span>
</div>
```

---

## 5. Statistics Card (`Dashboard.html`)

Shows learner progress, all auto-populated from `localStorage`:

| Stat                  | Element ID          | Set by                        |
| ---------------------- | ------------------- | ------------------------------ |
| Words Learnt           | `#stat-words`       | `Script.js`                    |
| Lessons Completed      | `#stat-lessons`     | `Script.js` (out of 5, not 4)  |
| Current Streak         | `#stat-streak`      | `Script.js` / `updateStreak()` in `Lessons.js` |
| Stars Earned           | `#stat-stars`       | `Script.js` (`getTotalStars()`)|
| Avg Completion Time    | `#stat-avg-time`    | Inline script in `Dashboard.html` |

---

## 6. Settings Card (`Dashboard.html`)

Contains:

* **Theme** — Light / Dark (`setTheme()` in `Accessibility.js`)
* **Font Size** — A− / A / A+ (`decreaseFont()`, `defaultFont()`, `increaseFont()` in `Accessibility.js`)
* **Accessibility** — High Contrast toggle, Text to Speech toggle (`toggleContrast()`, `toggleTTS()` in `Accessibility.js`)
* **Account** — Log Out (`logout()` in `Script.js`), Reset Progress (`resetAllProgress()` in `Script.js`)

---

## 7. Lesson Pages (`Lesson1.html` – `Lesson5.html`)

Each lesson page has 5 stages, driven by a `stages` object defined inline in that file:

```javascript
const stages = {
  1: {
    title: "Stage 1 - ...",
    question: "...",
    hints: ["...", "..."],
    explanation: "...",
    options: [
      { text: "...", correct: true },
      ...
    ]
  },
  ...
};
```

To change a lesson's questions, hints, or answers, edit the `stages` object in that specific `LessonN.html` file — the logic that drives it (`initLesson()`, `handleCheckAnswer()`, `showHintModal()`, `nextStage()`) lives in `JS/Lessons.js` and is shared across all five lessons.

Scoring per stage is based on attempts and hints used (`getStagePoints()` in `Lessons.js`) — first-try correct answers score highest.

---

# JavaScript Functions

## Located in `JS/Accessibility.js`

| Function            | Purpose                          |
| -------------------- | --------------------------------- |
| `setTheme('light')`  | Switches to Light Mode            |
| `setTheme('dark')`   | Switches to Dark Mode             |
| `toggleContrast()`   | Toggles high-contrast mode        |
| `toggleTTS()`        | Toggles text-to-speech on/off     |
| `increaseFont()`     | Increases font size (max 20px)    |
| `decreaseFont()`     | Decreases font size (min 10px)    |
| `defaultFont()`      | Resets font size to default (16px)|

## Located in `JS/Script.js`

| Function                | Purpose                                       |
| ------------------------ | ---------------------------------------------- |
| `selectLesson(id)`       | Loads a lesson's details into the selected-lesson card |
| `startLesson()`          | Navigates to the currently selected lesson    |
| `renderLessonNodes()`    | Applies locked/unlocked/completed styling to nodes |
| `syncDashboardStats()`   | Updates XP, level, goal bar, and stat cards   |
| `logout()`               | Clears the current user and returns to login  |
| `resetAllProgress()`     | Wipes all lesson progress after confirmation  |

## Located in `JS/Lessons.js`

| Function                | Purpose                                       |
| ------------------------ | ---------------------------------------------- |
| `initLesson(n)`          | Loads the current stage for lesson `n`        |
| `handleCheckAnswer(i)`   | Checks the selected answer                    |
| `showHintModal()`        | Reveals the next hint (costs points)          |
| `nextStage(n)`           | Advances to the next stage or shows summary   |
| `completeLessonFinal(n)` | Finalises and saves lesson completion         |

---

# Common CSS Changes

Located in `CSS/Styles.css`.

## Change Background Colour

```css
body {
    background: #EEF2FF;
}
```

## Change Dark Theme Colour

```css
body.dark {
    background: #0B1120;
}
```

## Change Button Colours

```css
.settings-btn
.settings-btn--active
```

## Change Card Appearance

```css
.card
```

Controls card colour, border, spacing, and corner radius.

---

# Quick Search Guide

| Want to Change      | Search For                       | File               |
| --------------------- | --------------------------------- | ------------------- |
| App Name             | `app-name`                        | Dashboard.html      |
| Lesson Data / XP     | `const lessons`                   | Script.js           |
| Lesson Questions     | `const stages`                    | LessonN.html        |
| Lesson Path Styling  | `node-unlocked` / `node-locked` / `node-completed` | Script.js (applied), Styles.css (styled) |
| Statistics           | `stat-value`, `stat-words`, etc.  | Dashboard.html / Script.js |
| Theme Buttons        | `setTheme()`                      | Accessibility.js    |
| Font Controls        | `increaseFont()`                  | Accessibility.js    |
| Text-to-Speech       | `toggleTTS()`, `queueSpeech()`    | Accessibility.js    |
| Background Colour    | `body {`                          | Styles.css          |
| Dark Theme           | `body.dark`                       | Styles.css          |
| Cards                | `.card`                           | Styles.css          |
| Buttons              | `.settings-btn`                   | Styles.css          |
| Login / Register     | `loginForm`, `registerForm`       | Account.js / index.html |

---

# Extensions Used During Development

* Code Spell Checker
* Git Prefix
* CodeSnap
* HTML/CSS/JavaScript Snippets
* Live Server
* Live Share (Collaborative Working)
* JavaScript (ES6) Code Snippets
* Path Intellisense
* Prettier - Code Formatter
