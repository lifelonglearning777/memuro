<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#71b957">
  <title>まちるだいすけと めむろたんけん</title>
  <link rel="stylesheet" href="style.css?v=20260628h">
</head>
<body>
  <a class="skip-link" href="#main">メインへ いどう</a>
  <div class="sky" aria-hidden="true"></div>

  <header class="app-header">
    <button id="homeButton" class="brand" type="button" aria-label="トップに もどる">
      <span class="brand-mark"><img src="images/machiru-front.png" alt=""></span>
      <span>まちるだいすけと<br><strong>めむろたんけん</strong></span>
    </button>
    <button id="soundButton" class="icon-button" type="button" aria-pressed="true" aria-label="こうかおんを きる">♪</button>
  </header>

  <main id="main">
    <section id="topScreen" class="screen top-screen">
      <div class="hero">
        <div class="hero-center">
          <img class="hero-mascot" src="images/machiru-wave.png" alt="手を上げる まちるだいすけ">
          <h1>
            <span class="hero-title-main">めむろ<ruby>検定<rt>けんてい</rt></ruby></span>
          </h1>
        </div>
      </div>

      <div id="resumeArea" class="resume-area" hidden>
        <button id="resumeButton" class="resume-button" type="button">前のつづきから</button>
      </div>

      <div class="level-grid" aria-label="コースをえらぶ">
        <button class="level-card beginner" type="button" data-level="beginner">
          <span class="level-stamp">1</span>
          <span class="level-icon" aria-hidden="true">🗺️</span>
          <span class="level-name">まちたんけん</span>
          <span class="level-sub">ビギナー級</span>
          <span class="level-meta">全25問　▶</span>
        </button>
        <button class="level-card intermediate" type="button" data-level="intermediate">
          <span class="level-stamp">2</span>
          <span class="level-icon" aria-hidden="true">🚜</span>
          <span class="level-name">くらし・しごとたんけん</span>
          <span class="level-sub">中級</span>
          <span class="level-meta">全25問　▶</span>
        </button>
        <button class="level-card advanced" type="button" data-level="advanced">
          <span class="level-stamp">3</span>
          <span class="level-icon" aria-hidden="true">🏑</span>
          <span class="level-name">れきし・文化たんけん</span>
          <span class="level-sub">上級</span>
          <span class="level-meta">全25問　▶</span>
        </button>
      </div>

    </section>

    <section id="quizScreen" class="screen quiz-screen" hidden>
      <div class="progress-row">
        <button id="quitButton" class="back-button" type="button">‹ やめる</button>
        <p id="questionCounter" aria-live="polite">第1問 / 25問</p>
        <p id="scoreChip">★ 0</p>
      </div>
      <div class="progress-track" role="progressbar" aria-label="クイズの進み具合" aria-valuemin="0" aria-valuemax="25" aria-valuenow="1">
        <div id="progressBar"></div>
      </div>

      <article class="question-card">
        <div class="question-main">
          <div>
            <p id="levelLabel" class="course-label"></p>
            <h2 id="questionText"></h2>
          </div>
          <figure id="imageFrame" class="image-frame">
            <img id="questionImage" alt="">
            <figcaption id="imageCredit">写真：地域学習書「めむろ学」</figcaption>
            <div id="imageCurtain" class="image-curtain" aria-hidden="true">
              <span>🔍</span>
              <strong>こたえの あとで<br>しゃしんが ひらくよ</strong>
            </div>
          </figure>
        </div>
        <div id="choiceList" class="choice-list" role="group" aria-label="答えをえらぶ"></div>
      </article>

      <div id="feedback" class="feedback" role="status" aria-live="assertive" hidden>
        <img id="feedbackMascot" class="feedback-mascot" src="images/machiru-wave.png" alt="">
        <div>
          <strong id="feedbackTitle"></strong>
          <p id="feedbackText"></p>
        </div>
      </div>
    </section>

    <section id="resultScreen" class="screen result-screen" hidden>
      <div id="resultCard" class="result-card">
        <div id="resultSeal" class="result-seal" aria-hidden="true">🌽</div>
        <p id="resultKicker" class="eyebrow"></p>
        <h2 id="resultTitle"></h2>
        <div class="score-display"><strong id="resultScore">0</strong><span>/ 25点</span></div>
        <p id="resultSummary"></p>
        <div id="certificate" class="certificate" hidden>
          <p>認 定 証</p>
          <strong id="certificateCourse"></strong>
          <span>芽室町のことをよく学び、全問正解したことを認定します。</span>
        </div>
        <div class="result-actions">
          <button id="retryButton" class="primary-button" type="button">もう一度挑戦</button>
          <button id="reviewButton" class="secondary-button" type="button">まちがい復習</button>
          <button id="resultHomeButton" class="secondary-button" type="button">トップに戻る</button>
        </div>
      </div>
    </section>

  </main>

  <script src="kid-text.js?v=20260628b"></script>
  <script src="script.js?v=20260628b"></script>
</body>
</html>
