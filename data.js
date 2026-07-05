/* ============================================================
   アプリの動きの仕組み（普段は編集しないファイル）
   ------------------------------------------------------------
   問題の表示・採点・進捗保存などの処理です。
   問題を増やす/直すだけなら js/data.js だけで完結します。
   ============================================================ */
"use strict";

const STORAGE_KEY = "memuro-tanken-progress-v1";

/* ---- がんばりの記録(コースごとの最高記録・にがてノート) ----
   まちがえた問題は「問題文」で覚えます。data.js の問題を
   増減して番号がずれても、にがてノートが壊れないためです。
   名前などの個人情報は絶対に保存しません。 */
const RECORDS_KEY = "memuro-tanken-records-v1";
let records = loadRecords();
function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECORDS_KEY));
    if (saved && typeof saved === "object") {
      return { best: saved.best || {}, perfect: saved.perfect || {}, maxCombo: saved.maxCombo || 0, weak: saved.weak || {} };
    }
  } catch { /* 破損時は初期化 */ }
  return { best: {}, perfect: {}, maxCombo: 0, weak: {} };
}
function saveRecords() { localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }
function weakQueue(level) {
  return (records.weak[level] || [])
    .map((text) => questions.findIndex((q) => q.level === level && q.question === text))
    .filter((index) => index >= 0);
}
function addWeak(level, text) {
  const list = records.weak[level] || (records.weak[level] = []);
  if (!list.includes(text)) { list.push(text); saveRecords(); }
}
function removeWeak(level, text) {
  const list = records.weak[level];
  if (!list) return;
  const at = list.indexOf(text);
  if (at >= 0) { list.splice(at, 1); saveRecords(); }
}
const screens = [...document.querySelectorAll(".screen")];
const $ = (id) => document.getElementById(id);

let state = {
  level: null,
  queue: [],
  index: 0,
  score: 0,
  wrong: [],
  reviewMode: false,
  sound: true,
  locked: false,
  currentChoices: []
};

function getLevelQuestions(level) {
  return questions.filter((item) => item.level === level);
}

// 将来ランダム出題にする場合は、この関数の返り値をシャッフルします。
function buildQuestionQueue(level) {
  return getLevelQuestions(level).map((item) => questions.indexOf(item));
}

function shuffleChoices(item) {
  const choices = item.choices.map((text, originalIndex) => ({ text, originalIndex }));
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[randomIndex]] = [choices[randomIndex], choices[index]];
  }
  const unchanged = choices.every((choice, index) => choice.originalIndex === index);
  if (unchanged) [choices[0], choices[1]] = [choices[1], choices[0]];
  return choices;
}

function showScreen(id) {
  screens.forEach((screen) => { screen.hidden = screen.id !== id; });
  if (id === "topScreen") renderTopScreen();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz(level, queue = buildQuestionQueue(level), reviewMode = false) {
  state = { ...state, level, queue, index: 0, score: 0, wrong: [], reviewMode, locked: false, currentChoices: [], combo: 0 };
  $("comboChip").hidden = true;
  showScreen("quizScreen");
  renderQuestion();
  saveProgress();
}

function renderQuestion() {
  const item = questions[state.queue[state.index]];
  const total = state.queue.length;
  const displayTotal = state.reviewMode ? total : 25;
  $("questionCounter").innerHTML = `<ruby>第<rt>だい</rt></ruby>${state.index + 1}<ruby>問<rt>もん</rt></ruby> / ${displayTotal}<ruby>問<rt>もん</rt></ruby>`;
  $("scoreChip").textContent = `★ ${state.score}`;
  $("levelLabel").innerHTML = `${kidHtml(levelInfo[state.level].name)}（${kidHtml(levelInfo[state.level].label)}）${state.reviewMode ? `・${kidHtml("復習")}` : ""}`;
  const questionElement = $("questionText");
  setKidHtml(questionElement, item.question);
  questionElement.classList.toggle("is-long", item.question.length >= 22);
  questionElement.classList.toggle("is-very-long", item.question.length >= 32);
  $("progressBar").style.width = `${((state.index + 1) / total) * 100}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuemax", total);
  document.querySelector(".progress-track").setAttribute("aria-valuenow", state.index + 1);
  $("feedback").hidden = true;
  state.locked = false;
  state.currentChoices = shuffleChoices(item);

  const main = document.querySelector(".question-main");
  if (item.image) {
    main.classList.remove("no-image");
    $("imageFrame").hidden = false;
    $("imageFrame").classList.add("is-covered");
    $("imageFrame").classList.remove("is-revealed");
    $("questionImage").src = `images/${item.image}`;
    $("questionImage").classList.toggle("map-focus", item.image === "memuro-map.jpg");
    $("questionImage").alt = "もんだいの てがかりになる しゃしん";
    setKidHtml($("imageCredit"), imageCredits[item.image] || "写真：地域学習書「めむろ学」");
    $("questionImage").onerror = () => {
      $("questionImage").onerror = null;
      $("questionImage").src = "images/placeholder.jpg";
      $("questionImage").alt = "めむろちょうの はたけと ひだかさんみゃくの イメージ（しゃしん じゅんびちゅう）";
      setKidHtml($("imageCredit"), "写真準備中");
    };
  } else {
    main.classList.add("no-image");
    $("imageFrame").hidden = true;
    $("imageFrame").classList.remove("is-covered", "is-revealed");
    $("questionImage").classList.remove("map-focus");
    $("questionImage").removeAttribute("src");
  }

  $("choiceList").replaceChildren(...state.currentChoices.map((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.classList.toggle("is-long-choice", choice.text.length >= 14);
    button.classList.toggle("is-very-long-choice", choice.text.length >= 22);
    button.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + index)}</span><span class="choice-text">${kidHtml(choice.text)}</span>`;
    button.addEventListener("click", () => chooseAnswer(index));
    return button;
  }));
}

function chooseAnswer(selected) {
  if (state.locked) return;
  state.locked = true;
  const item = questions[state.queue[state.index]];
  const correct = state.currentChoices[selected].originalIndex === item.answer;
  const buttons = [...document.querySelectorAll(".choice-button")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (state.currentChoices[index].originalIndex === item.answer) button.classList.add("correct");
    if (index === selected && !correct) button.classList.add("wrong");
  });
  if (item.image) {
    $("imageFrame").classList.remove("is-covered");
    $("imageFrame").classList.add("is-revealed");
  }

  if (correct) {
    state.score += 1;
    if ($("feedbackMascot")) $("feedbackMascot").src = "images/machiru-wave.png";
    setKidHtml($("feedbackTitle"), ["やったね！", "すごい！", "いい調子！"][state.index % 3]);
    playTone(660);
    state.combo = (state.combo || 0) + 1;
    removeWeak(state.level, item.question);
    if (state.combo >= 2) {
      $("comboChip").hidden = false;
      $("comboChip").textContent = `🔥 ${state.combo}れんぞく！`;
    }
    if (state.combo > records.maxCombo) { records.maxCombo = state.combo; saveRecords(); }
    if (state.combo % 5 === 0) launchConfetti(18);
  } else {
    state.wrong.push(state.queue[state.index]);
    if ($("feedbackMascot")) $("feedbackMascot").src = "images/machiru-front.png";
    setKidHtml($("feedbackTitle"), ["次はいけるよ！", "だいじょうぶ、発見できたね！"][state.index % 2]);
    playTone(330);
    state.combo = 0;
    $("comboChip").hidden = true;
    addWeak(state.level, item.question);
  }
  $("scoreChip").textContent = `★ ${state.score}`;
  $("feedbackText").innerHTML = `${kidHtml(item.explanation)}（${kidHtml(item.source)}）`;
  $("feedback").hidden = false;
  const isLast = state.index + 1 >= state.queue.length;
  setKidHtml($("nextButton"), isLast ? "けっかを みる ▶" : "つぎへ ▶");
  $("nextButton").focus();
}

function nextQuestion() {
  state.index += 1;
  if (state.index < state.queue.length) {
    renderQuestion();
    saveProgress();
  } else {
    showResult();
  }
}

function showResult() {
  localStorage.removeItem(STORAGE_KEY);
  updateResumeButton();
  showScreen("resultScreen");
  const total = state.queue.length;
  const passed = !state.reviewMode && total === 25 && state.score === 25;
  $("resultCard").classList.toggle("fail", !passed);
  $("resultScore").textContent = state.score;
  document.querySelector(".score-display span").innerHTML = `/ ${total}<ruby>点<rt>てん</rt></ruby>`;
  $("resultKicker").innerHTML = `${kidHtml(levelInfo[state.level].name)}（${kidHtml(levelInfo[state.level].label)}）`;
  setKidHtml($("resultTitle"), passed ? "たんけんクリア！" : state.reviewMode ? "復習できたね！" : "もう一回チャレンジ！");
  $("resultSummary").textContent = passed
    ? "25もん すべてせいかい！ めむろちょうの たんけんめいじんです。"
    : `${total}もんちゅう ${state.score}もんせいかい。まちがいも、あたらしいはっけんへのいっぽだよ。`;
  $("certificate").hidden = !passed;
  $("certificateCourse").innerHTML = `${kidHtml(levelInfo[state.level].name)} ${kidHtml(levelInfo[state.level].label)}`;
  $("reviewButton").hidden = state.wrong.length === 0;
  $("reviewButton").textContent = `まちがいふくしゅう（${state.wrong.length}もん）`;
  if (!state.reviewMode && total === 25) {
    if (state.score > (records.best[state.level] || 0)) records.best[state.level] = state.score;
    if (state.score === 25) records.perfect[state.level] = true;
    saveRecords();
  }
  if (passed) {
    $("certificateName").value = "";  // 名前は毎回まっさら(保存しない)
    $("certificateDate").innerHTML = todayHtml();
    launchConfetti(44);
  }
  playTone(passed ? 880 : 440);
}

/* ---- トップ画面のがんばり表示 ---- */
function renderTopScreen() {
  const levels = Object.keys(levelInfo);
  const perfectCount = levels.filter((level) => records.perfect[level]).length;
  const rankNames = ["みならい たんけんか", "かけだし たんけんか", "いちにんまえの たんけんか", "でんせつの たんけんめいじん"];
  $("rankTitle").textContent = `きみは いま… ⭐ ${rankNames[perfectCount]}`;
  document.querySelectorAll(".level-card").forEach((card) => {
    const level = card.dataset.level;
    const span = card.querySelector(".level-record");
    const best = records.best[level];
    if (best === undefined) { span.hidden = true; return; }
    span.hidden = false;
    span.textContent = `${records.perfect[level] ? "👑" : "⭐"} さいこう ${best}もん`;
  });
  const entries = levels
    .map((level) => ({ level, count: weakQueue(level).length }))
    .filter((entry) => entry.count > 0);
  $("weakArea").hidden = entries.length === 0;
  $("weakButtons").replaceChildren(...entries.map(({ level, count }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "weak-button";
    button.innerHTML = `${kidHtml(levelInfo[level].name)}の にがて ${count}もんに ちょうせん ▶`;
    button.addEventListener("click", () => startQuiz(level, weakQueue(level), true));
    return button;
  }));
}

/* ---- 認定証の日付(例: 2026年7月4日) ---- */
function todayHtml() {
  const now = new Date();
  return `${now.getFullYear()}<ruby>年<rt>ねん</rt></ruby>${now.getMonth() + 1}<ruby>月<rt>がつ</rt></ruby>${now.getDate()}<ruby>日<rt>にち</rt></ruby>`;
}

/* ---- 紙吹雪(「動きを減らす」設定の端末では出さない) ---- */
function launchConfetti(count) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#70b957", "#ffd84d", "#8dd8ee", "#e96957", "#ffffff"];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

function saveProgress() {
  if (!state.level || state.reviewMode) return;
  const saved = {
    level: state.level, queue: state.queue, index: state.index,
    score: state.score, wrong: state.wrong
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  updateResumeButton();
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !levelInfo[saved.level] || saved.index >= saved.queue.length) return;
    state = { ...state, ...saved, reviewMode: false, locked: false };
    showScreen("quizScreen");
    renderQuestion();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function updateResumeButton() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { /* 破損時は非表示 */ }
  $("resumeArea").hidden = !saved;
  if (saved && levelInfo[saved.level]) {
    $("resumeButton").innerHTML = `${kidHtml(levelInfo[saved.level].name)} <ruby>第<rt>だい</rt></ruby>${saved.index + 1}<ruby>問<rt>もん</rt></ruby>から`;
  }
}

function goHome() {
  showScreen("topScreen");
  updateResumeButton();
}

function confirmQuit() {
  if (window.confirm("ここまでの きろくを のこして、トップに もどりますか？")) goHome();
}

function playTone(frequency) {
  if (!state.sound || !window.AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.05, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

document.querySelectorAll(".level-card").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    startQuiz(button.dataset.level);
  });
});
$("resumeButton").addEventListener("click", loadProgress);
$("quitButton").addEventListener("click", confirmQuit);
$("homeButton").addEventListener("click", goHome);
$("resultHomeButton").addEventListener("click", goHome);
$("retryButton").addEventListener("click", () => startQuiz(state.level));
$("reviewButton").addEventListener("click", () => startQuiz(state.level, [...new Set(state.wrong)], true));
$("nextButton").addEventListener("click", () => {
  if ($("feedback").hidden) return;
  $("feedback").hidden = true;
  nextQuestion();
});
$("soundButton").addEventListener("click", () => {
  state.sound = !state.sound;
  $("soundButton").setAttribute("aria-pressed", String(state.sound));
  $("soundButton").setAttribute("aria-label", state.sound ? "こうかおんを きる" : "こうかおんを つける");
  $("soundButton").textContent = state.sound ? "♪" : "×";
});

updateResumeButton();
renderTopScreen();
applyKidText();
