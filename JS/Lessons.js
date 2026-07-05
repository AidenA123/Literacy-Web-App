/* =========================================================
   STAGE SYSTEM & PERFORMANCE TRACKING
========================================================= */
function getCurrentStage(lessonNumber) {
    return parseInt(localStorage.getItem(`lesson${lessonNumber}Stage`) || "1");
}

function setCurrentStage(lessonNumber, stage) {
    localStorage.setItem(`lesson${lessonNumber}Stage`, stage);
}

function getStageProgress(lessonNumber) {
    const currentStage = getCurrentStage(lessonNumber);
    return `Stage ${currentStage} of 5`;
}

function getStageScore(lessonNumber, stage) {
    return parseInt(localStorage.getItem(`lesson${lessonNumber}Stage${stage}Score`) || "0");
}

function setStageScore(lessonNumber, stage, score) {
    localStorage.setItem(`lesson${lessonNumber}Stage${stage}Score`, score);
}

function getStageStars(lessonNumber, stage) {
    const score = getStageScore(lessonNumber, stage);
    if (score >= 100) return 3;
    if (score >= 70)  return 2;
    if (score >= 50)  return 1;
    return 0;
}

function getStageFeedback(lessonNumber, stage, score) {
    if (score >= 100) return "Perfect! 🌟";
    if (score >= 80)  return "Great job! 👍";
    if (score >= 60)  return "Good effort! 💪";
    if (score >= 40)  return "Keep practicing! 📚";
    return "Try again! 🎯";
}

function getLessonAverageScore(lessonNumber) {
    let total = 0;
    for (let i = 1; i <= 5; i++) {
        total += getStageScore(lessonNumber, i);
    }
    return Math.round(total / 5);
}

/* =========================================================
   LESSON TIMER
   Start time is saved to localStorage on stage 1 so it
   survives the location.reload() between stages.
   Cleared when the lesson is completed or reset.
========================================================= */
function startLessonTimer(lessonNumber) {
    const key = `lesson${lessonNumber}StartTime`;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, Date.now());
    }
}

function clearLessonTimer(lessonNumber) {
    localStorage.removeItem(`lesson${lessonNumber}StartTime`);
}

function formatElapsedTime(lessonNumber) {
    const startTime = parseInt(localStorage.getItem(`lesson${lessonNumber}StartTime`));
    if (!startTime) return "N/A";
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

/* =========================================================
   ATTEMPT & SCORING TRACKING
   NOTE: attemptCount is incremented in handleCheckAnswer
   BEFORE calling recordAnswer — recordAnswer must NOT
   increment it again.
========================================================= */
let attemptCount = 0;
let correctOnFirstTry = false;
let hintsUsed = 0;

function recordAnswer(isAttempt, isCorrect) {
    if (isAttempt) {
        if (isCorrect && attemptCount === 1) {
            correctOnFirstTry = true;
        }
    }
}

function getStagePoints() {
    if (correctOnFirstTry) return 100;
    if (attemptCount <= 2) return 80;
    if (attemptCount <= 3) return 60;
    if (attemptCount <= 4) return 40;
    return 20;
}

/* =========================================================
   BUTTON LOCKING
   Disables all option buttons once a correct answer is given
   so the user cannot click a wrong answer after getting it right.
========================================================= */
function lockOptionButtons() {
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
    });
}

/* =========================================================
   HINT SYSTEM
========================================================= */
function showHint(hintText) {
    hintsUsed++;
    const result = document.getElementById("result");
    result.innerHTML = `<span style='color: #F59E0B;'>💡 Hint: ${hintText}</span>`;
    result.style.color = "#F59E0B";

    const hintBtn = document.getElementById("hint-btn");
    if (hintBtn) hintBtn.disabled = true;
}

/* =========================================================
   SHARED LESSON STAGE FUNCTIONS
   initLesson(n) is called by each lesson HTML on DOMContentLoaded.
   handleCheckAnswer() and showHintModal() use currentLesson so
   the HTML files only need to define stages{} and call initLesson().
   Lesson 5 (typing) overrides initLesson with its own version.
========================================================= */
let currentLesson = null;
let hintIndex = 0;

function initLesson(lessonNumber) {
    currentLesson = lessonNumber;
    hintIndex = 0;
    attemptCount = 0;
    correctOnFirstTry = false;
    hintsUsed = 0;

    // Start the lesson timer — only records the time on the very first stage
    startLessonTimer(lessonNumber);

    const stage = getCurrentStage(lessonNumber);
    const stageData = stages[stage];

    document.getElementById("stageIndicator").textContent = getStageProgress(lessonNumber);
    document.getElementById("progressBar").style.width = `${(stage / 5) * 100}%`;
    document.getElementById("attemptCount").textContent = "0";
    document.getElementById("questionTitle").textContent = stageData.title;
    document.getElementById("hint-btn").disabled = false;
    document.getElementById("hint-btn").textContent = "💡 Get Hint";

    const questionContent = document.getElementById("questionContent");
    questionContent.innerHTML = `<p style="font-weight: 600; margin: 15px 0;">${stageData.question}</p>`;

    const optionsHtml = stageData.options.map((opt, idx) =>
        `<button class="option-btn" onclick="handleCheckAnswer(${idx})">${opt.text}</button>`
    ).join('');

    questionContent.innerHTML += `<div class="options-grid">${optionsHtml}</div>`;

    if (typeof ttsEnabled !== 'undefined' && ttsEnabled) {
        queueSpeech([stageData.question]);
    }
}

function handleCheckAnswer(answerIndex) {
    const stage = getCurrentStage(currentLesson);
    const stageData = stages[stage];
    const correctIndex = stageData.options.findIndex(o => o.correct);
    const result = document.getElementById("result");
    const explanation = document.getElementById("explanation");
    const nextBtn = document.getElementById("next-btn");
    const hintBtn = document.getElementById("hint-btn");

    attemptCount++;
    document.getElementById("attemptCount").textContent = attemptCount;

    if (answerIndex === correctIndex) {
        result.innerHTML = "<span style='font-size: 24px;'>✅ Correct! 🎉</span>";
        result.style.color = "#22C55E";
        explanation.textContent = stageData.explanation;
        explanation.style.display = "block";
        nextBtn.style.display = "inline-block";
        if (hintBtn) hintBtn.style.display = "none";
        lockOptionButtons();
        recordAnswer(true, true);
        if (typeof speak !== 'undefined') speak("Correct!");
    } else {
        result.innerHTML = "<span style='font-size: 16px;'>❌ Not quite! Try again or use a hint.</span>";
        result.style.color = "#EF4444";
        recordAnswer(true, false);
        if (typeof speak !== 'undefined') speak("Try again");
    }
}

function showHintModal() {
    const stage = getCurrentStage(currentLesson);
    const stageData = stages[stage];

    if (hintIndex < stageData.hints.length) {
        showHint(stageData.hints[hintIndex]);
        hintIndex++;
        if (hintIndex >= stageData.hints.length) {
            document.getElementById("hint-btn").textContent = "No more hints";
            document.getElementById("hint-btn").disabled = true;
        }
    }
}

/* =========================================================
   STAGE COMPLETION
========================================================= */
function nextStage(lessonNumber) {
    const currentStage = getCurrentStage(lessonNumber);
    const points = getStagePoints() - (hintsUsed * 10);

    setStageScore(lessonNumber, currentStage, Math.max(points, 10));

    if (currentStage < 5) {
        setCurrentStage(lessonNumber, currentStage + 1);
        attemptCount = 0;
        correctOnFirstTry = false;
        hintsUsed = 0;
        location.reload();
    } else {
        showLessonSummary(lessonNumber);
    }
}

function showLessonSummary(lessonNumber) {
    const averageScore = getLessonAverageScore(lessonNumber);
    const totalStars = [1, 2, 3, 4, 5]
        .reduce((sum, i) => sum + getStageStars(lessonNumber, i), 0);
    const timeTaken = formatElapsedTime(lessonNumber);

    const container = document.querySelector(".lesson-container");
    container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <h1>🎉 Lesson Complete!</h1>
            <div style="margin: 30px 0;">
                <p style="font-size: 24px; line-height: 1.8; margin: 10px 0; word-break: break-word;">
                    ${'⭐'.repeat(Math.min(totalStars, 15))}
                </p>
                <p style="font-size: 24px; color: #4361ee; margin: 10px 0;">
                    ${totalStars}/15 Stars Earned
                </p>
                <p style="font-size: 18px; color: #666; margin: 10px 0;">
                    Average Score: ${averageScore}%
                </p>
                <p style="font-size: 18px; color: #666; margin: 10px 0;">
                    ⏱️ Time Taken: ${timeTaken}
                </p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background: #f0f4ff; border-radius: 12px;">
                <h3 style="margin-top: 0;">Stage Breakdown:</h3>
                ${[1, 2, 3, 4, 5].map(i => `
                    <div style="text-align: left; padding: 8px; margin: 5px 0;">
                        <span>Stage ${i}: </span>
                        <span>${'⭐'.repeat(getStageStars(lessonNumber, i))}</span>
                        <span style="color: #666;">(${getStageScore(lessonNumber, i)}%)</span>
                    </div>
                `).join('')}
            </div>

            <button onclick="completeLessonFinal(${lessonNumber})" style="
                padding: 15px 30px;
                font-size: 16px;
                background: #4361ee;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 20px;
            ">
                ✅ Complete & Return to Dashboard
            </button>
        </div>
    `;
}

function completeLessonFinal(lessonNumber) {
    // Save this lesson's completion time (in seconds) before the timer is cleared,
    // so the dashboard can include it in the average completion time stat.
    const startTime = parseInt(localStorage.getItem(`lesson${lessonNumber}StartTime`));
    if (startTime) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        localStorage.setItem(`lesson${lessonNumber}CompletionTime`, elapsedSeconds);
    }
    clearLessonTimer(lessonNumber);
    completeLesson(lessonNumber, 5, getLessonXP(lessonNumber));
}

function getLessonXP(lessonNumber) {
    const xpValues = { 1: 100, 2: 150, 3: 200, 4: 250, 5: 300 };
    return xpValues[lessonNumber] || 100;
}

/* =========================================================
   LESSON COMPLETION
   Marks a lesson complete, unlocks the next one, and awards
   XP + words learnt — but only the FIRST time it's completed.
========================================================= */
function completeLesson(lessonNumber, wordsCount, xpReward) {
    const alreadyComplete = localStorage.getItem(`lesson${lessonNumber}Complete`) === "true";

    if (!alreadyComplete) {
        localStorage.setItem(`lesson${lessonNumber}Complete`, "true");

        // Unlock exactly the next lesson — nothing beyond it.
        const nextLesson = lessonNumber + 1;
        if (nextLesson <= 5) {
            localStorage.setItem(`lesson${nextLesson}Unlocked`, "true");
        }
        // Ensure lessons further ahead are NOT unlocked prematurely.
        for (let i = nextLesson + 1; i <= 5; i++) {
            if (localStorage.getItem(`lesson${i}Complete`) !== "true") {
                localStorage.removeItem(`lesson${i}Unlocked`);
            }
        }

        let xp = parseInt(localStorage.getItem("xp")) || 0;
        xp += xpReward;
        localStorage.setItem("xp", xp);

        let words = parseInt(localStorage.getItem("wordsLearned")) || 0;
        words += wordsCount;
        localStorage.setItem("wordsLearned", words);

        updateStreak();

        alert(`Lesson ${lessonNumber} Complete! +${xpReward} XP`);
    } else {
        alert(`You've already completed Lesson ${lessonNumber} — no extra XP awarded.`);
    }

    localStorage.removeItem(`lesson${lessonNumber}Stage`);
    window.location.href = "Dashboard.html";
}

function resetLessonProgress(lessonNumber) {
    clearLessonTimer(lessonNumber);
    localStorage.removeItem(`lesson${lessonNumber}Stage`);
    setCurrentStage(lessonNumber, 1);
    location.reload();
}

/* =========================================================
   STREAK TRACKING
========================================================= */
function updateStreak() {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("lastActiveDate");

    if (lastActive === today) return;

    let streak = parseInt(localStorage.getItem("streak")) || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActive === yesterday.toDateString()) {
        streak += 1;
    } else {
        streak = 1;
    }

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastActiveDate", today);
}