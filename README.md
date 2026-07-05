# Literacy App - Quick Reference Guide

---

# Files

| File             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `Index.html`     | Page content and layout                  |
| `CSS/Styles.css` | Colours, sizing, spacing, and appearance |
| `JS/Script.js`   | Interactive features and functionality   |

---

# App Sections

## 1. App Information Card

Shows:

* App Name
* User Level
* User XP
* Daily Goal Progress

### Change App Name

Search for (Index.html):

```html
<h2 class="app-name">
```

Example:

```html
<h2 class="app-name">Literacy App</h2>
```

---

### Change Level

Search for (Index.html):

```html
<p class="app-details">Level 1</p>
```

---

### Change XP

Search for (Index.html):

```html
<p class="app-details">XP: 100</p>
```

---

### Change Daily Goal %

Search for (Index.html):

```html
<div class="goal-fill" style="width: 0%;"></div>
```

and

```html
<p class="goal-percentage">0%</p>
```

Example:

```html
<div class="goal-fill" style="width: 50%;"></div>
<p class="goal-percentage">50%</p>
```

---

# 2. Selected Lesson Card

Shows information about the currently selected lesson.

### Change Lesson Title

Search for (Index.html):

```html
<h3 class="selected-lesson-title">
```

---

### Change Lesson Description

Search for (Index.html):

```html
<p class="selected-lesson-desc">
```

---

### Change XP Reward

Search for (Index.html):

```html
<p class="selected-lesson-xp">
```

Example:

```html
⭐ Reward: 250 XP
```

---

# 3. Learning Card

Shows lesson progression.

### Unlocked Lesson

Search for (Index.html):

```html
<div class="node node-unlocked">
```

---

### Locked Lesson

Search for (Index.html):

```html
<div class="node node-locked">
```

---

### Change Lesson Names

Search for (Index.html):

```html
<span>Lesson Title</span>
```

Example:

```html
<span>Reading Basics</span>
```

---

### Lock Icon

Search for (Index.html):

```html
<span class="lock-icon">🔒</span>
```

Remove it if the lesson should be unlocked.

---

# 4. Statistics Card

Shows learner progress.

### Words Learned

Search for (Index.html):

```html
<p class="stat-value">0</p>
```

under:

```html
Words Learned
```

---

### Lessons Completed

Search for (Index.html):

```html
<p class="stat-value">0 / 4</p>
```

---

### Current Streak

Search for (Index.html):

```html
<p class="stat-value">0 Days</p>
```

---

# 5. Settings Card

Contains:

* Theme Controls
* Font Size Controls

---

# JavaScript Functions

Located in:

```text
JS/Script.js
```

---

## setTheme('light')

Changes the app to Light Mode.

Example:

```javascript
setTheme('light');
```

---

## setTheme('dark')

Changes the app to Dark Mode.

Example:

```javascript
setTheme('dark');
```

---

## increaseFont()

Makes text larger.

Example:

```javascript
increaseFont();
```

Current limit:

```text
20px
```

---

## decreaseFont()

Makes text smaller.

Example:

```javascript
decreaseFont();
```

Current limit:

```text
10px
```

---

## defaultFont()

Returns text size to normal.

Example:

```javascript
defaultFont();
```

Default size:

```text
14px
```

---

# Common CSS Changes

Located in:

```text
CSS/Styles.css
```

---

## Change Background Colour

Search for (Styles.css):

```css
body {
    background: #EEF2FF;
}
```

---

## Change Dark Theme Colour

Search for (Styles.css):

```css
body.dark {
    background: #0B1120;
}
```

---

## Change Button Colours

Search for (Styles.css):

```css
.settings-btn
```

and

```css
.settings-btn--active
```

---

## Change Card Appearance

Search for (Styles.css):

```css
.card
```

This controls:

* Card colour
* Card border
* Card spacing
* Card corners

---

# Quick Search Guide

| Want to Change     | Search For                      |
| ------------------ | ------------------------------- |
| App Name           | `app-name`                      |
| Level              | `Level 1`                       |
| XP                 | `XP:`                           |
| Daily Goal         | `goal-fill`                     |
| Lesson Title       | `selected-lesson-title`         |
| Lesson Description | `selected-lesson-desc`          |
| Lesson Reward      | `selected-lesson-xp`            |
| Learning Path      | `node-unlocked` / `node-locked` |
| Statistics         | `stat-value`                    |
| Theme Buttons      | `setTheme()`                    |
| Font Controls      | `increaseFont()`                |
| Background Colour  | `body {`                        |
| Dark Theme         | `body.dark`                     |
| Cards              | `.card`                         |
| Buttons            | `.settings-btn`                 |

---

# Before Making Changes
1. Create a backup before
2. Do 1 change at a time to minimise errors / warnings
3. Save and go to website to check changes made
4. If an error occurs, revert the change (CTRL+Z)
5. If a warning occurs, note it down (HTML <!-- Example Comment -->, CSS /* Example Comment */, JS /* Example Comment */)


# Debug Errors
1. If an error occurs, Go Live, right click the webpage and go to Console, this will give you the error message


# Apply Word Wrap
1. View -> Word Wrap


# Use <!-- TODO: Example Text --> for changes that will be done later on, for example, <!-- TODO: Theme Toggler (Light / Dark Mode) -->


# Extensions
# -------------------------------------------------
# Code Spell Checker
# Git Prefix
# CodeSnap
# HTML/CSS/JavaScript Snippets
# Live Server
# Live Share - (Collaborative Working)
# JavaScript (ES6) code snippets
# BLACKBOX AI / Blackbox Agent (if needed)
# Path Intellisense
# Prettier - Code formatter


# How to use Live Server
1. Install the extension
2. Press Go Live on the bottom right on the toolbar at the bottom. Changes will be applied when the file has been saved, does not need to be repeatedly closed and started to check changes


# References
1. https://youtu.be/_GTMOmRrqkU?t=124
2. https://www.w3schools.com/html/
3. https://developer.mozilla.org/en-US/docs/Web/HTML
4. https://www.w3schools.com/css/
5. https://www.codecademy.com/learn/learn-css
6. https://cssreference.io
7. https://web.dev/learn
8. https://www.w3schools.com/html/html_scripts.asp
9. https://www.youtube.com/watch?v=Ihy0QziLDf0
10. https://www.youtube.com/watch?v=xKOyDDuQSVY
11. https://www.youtube.com/watch?v=SgmNxE9lWcY
12. https://www.youtube.com/watch?v=aAP2k_fe99I
13. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API