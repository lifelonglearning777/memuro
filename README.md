# まちるだいすけと めむろたんけん

小学校3・4年生が、地域学習教材「めむろ学」をもとに芽室町を楽しく学ぶ、静的クイズWebアプリです。

## 特長

- 3コース・各25問（合計75問）
- 3択の並びを毎問シャッフル（正解位置も自動追従）
- 回答直後の自動採点と短い解説
- 25問全問正解で認定証を表示
- まちがえた問題だけの復習
- 途中の問題番号と得点を端末内に保存
- 3年生までの漢字だけを使用し、表示する漢字には読みがなを付加
- 先生用の問題・答え一覧は、児童画面とは別のA4印刷PDF
- Chromebook、スマートフォン、キーボード操作に対応
- 外部API、ログイン、個人情報の保存なし
- 「めむろ学」掲載写真・図を使った地域色のある画面

## 使い方

`index.html` をChromeで開くだけで使えます。通信がない環境でも、フォルダ一式が端末にあれば動きます。

## 写真の追加・変更

写真は `images` フォルダへ入れます。`script.js` の各問題にある `image` へファイル名を指定してください。

```js
{
  level: "beginner",
  question: "この建物は何ですか。",
  image: "town-hall.jpg",
  choices: ["芽室町役場", "図書館", "消防署"],
  answer: 0,
  explanation: "町役場は、町の仕事を行う中心の建物です。",
  source: "めむろ学 p.22"
}
```

- `image: ""` の問題では画像枠を表示しません。
- 指定した写真がまだない場合は `images/placeholder.jpg` を表示します。
- 児童・施設が写る写真は、利用許可と肖像権を確認してください。
- 教材の写真をWebへ転載するときは、必ず著作権・利用条件を確認してください。
- 収録画像の出典一覧は `IMAGE-SOURCES.md` にあります。

## 問題の編集

問題は `script.js` 冒頭の `questions` 配列で管理しています。各コースは必ず25問にしてください。

- `level`: `beginner` / `intermediate` / `advanced`
- `choices`: 3つの選択肢
- `answer`: 正解の位置（最初は `0`）
- `explanation`: 回答後の短い説明
- `source`: 教材のページや確認した資料

公開前に、先生が「めむろ学」の最新版と照合し、表現・ページ・写真を確認してください。

## GitHub Pagesで公開

1. 配布用ZIP `memuro-tanken.zip` の中身をGitHubリポジトリのルートへ置きます。
2. GitHubの **Settings → Pages** を開きます。
3. **Deploy from a branch** を選び、`main` / `/ (root)` を指定します。
4. 表示されたURLをChromebookのChromeで開きます。

## ファイル

```text
index.html
style.css
script.js
kid-text.js
images/
  placeholder.jpg
IMAGE-SOURCES.md
README.md
```

先生用資料は `teacher-materials/memuro-tanken-teacher-question-list.pdf` にあります。児童用ZIPには含まれず、児童画面からも表示・リンクされません。

## 保存データ

途中経過だけをブラウザの Local Storage（`memuro-tanken-progress-v1`）へ保存します。氏名などの個人情報は保存しません。「もう一度挑戦」で前の途中記録は消えます。
