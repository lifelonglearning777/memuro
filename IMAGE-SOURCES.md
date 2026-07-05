/* ============================================================
   問題データ（先生が編集するのは、基本的にこのファイルだけ）
   ------------------------------------------------------------
   1問の形:
   { level:"beginner",                  // コース: beginner / intermediate / advanced
     question:"問題文",
     image:"corn.jpg",                  // imagesフォルダの写真名。""なら写真なし
     choices:["正解","誤答1","誤答2"],  // 3択。正解は必ず先頭に書く
     answer:0,                          // そのまま0でOK(出題時に自動シャッフル)
     explanation:"答えたあとに出る短い説明",
     source:"めむろ学 p.00" },          // 出典。必ず教材と照合すること

   【注意】各コースは必ず25問にしてください。
   【注意】新しい文を足したら、ふりがなが必要な漢字(4年生以上)が
           ないか確認し、必要なら js/furigana.js にも追記します。
   ============================================================ */
"use strict";

// 問題データ。image を空文字にすると画像枠を表示しません。
// 写真を追加するときは images フォルダへ入れ、ファイル名を image に指定します。
const questions = [
  { level:"beginner", question:"芽室町があるのは、どの都道府県？", image:"memuro-map.jpg", choices:["北海道","青森県","長野県"], answer:0, explanation:"芽室町は北海道の十勝地方にあります。", source:"めむろ学 p.14–15" },
  { level:"beginner", question:"芽室町がある平野は？", image:"fields.jpg", choices:["十勝平野","石狩平野","関東平野"], answer:0, explanation:"芽室町は広い十勝平野にあります。", source:"めむろ学 p.14–15" },
  { level:"beginner", question:"芽室町の西に見える山なみは？", image:"fields.jpg", choices:["日高山脈","富士山","大雪山だけ"], answer:0, explanation:"町の西側には日高山脈が広がります。", source:"めむろ学 p.14–17" },
  { level:"beginner", question:"芽室町の土地で多く見られるものは？", image:"fields.jpg", choices:["広い畑","高いビル","海岸"], answer:0, explanation:"芽室町には広い畑がたくさんあります。", source:"めむろ学 p.16–19" },
  { level:"beginner", question:"芽室町にとなり合う大きな市は？", image:"memuro-map.jpg", choices:["帯広市","札幌市","函館市"], answer:0, explanation:"芽室町は帯広市にとなり合っています。", source:"めむろ学 p.14–15" },
  { level:"beginner", question:"町の中心を通る鉄道の駅は？", image:"old-station.jpg", choices:["芽室駅","釧路駅","旭川駅"], answer:0, explanation:"JR根室本線の芽室駅があります。写真は開業したころの芽室駅です。", source:"めむろ学 p.72" },
  { level:"beginner", question:"町の仕事を行う中心の建物は？", image:"town-hall.jpg", choices:["芽室町役場","水族館","空港"], answer:0, explanation:"町役場では、くらしを支えるいろいろな仕事をします。", source:"めむろ学 p.20–23" },
  { level:"beginner", question:"本を借りたり調べたりする場所は？", image:"library.jpg", choices:["図書館","消防署","交番"], answer:0, explanation:"図書館では本や資料を利用できます。", source:"めむろ学 p.20–23" },
  { level:"beginner", question:"芽室町を流れる川はどれ？", image:"memuro-river.jpg", choices:["芽室川","信濃川","四万十川"], answer:0, explanation:"町には十勝川、芽室川、美生川などが流れます。", source:"めむろ学 p.14–17" },
  { level:"beginner", question:"芽室町は海に面している？", image:"", choices:["面していない","面している","島である"], answer:0, explanation:"芽室町は北海道の内陸にあります。", source:"めむろ学 p.14–15" },
  { level:"beginner", question:"芽室町の代表的な作物は？", image:"corn.jpg", choices:["スイートコーン","パイナップル","バナナ"], answer:0, explanation:"スイートコーンは芽室町を代表する作物の一つです。", source:"めむろ学 p.26–31" },
  { level:"beginner", question:"じゃがいもの別のよび方は？", image:"potato.jpg", choices:["ばれいしょ","てんさい","小麦"], answer:0, explanation:"ばれいしょは、じゃがいものことです。", source:"めむろ学 p.26–31" },
  { level:"beginner", question:"パンやめんの材料になる作物は？", image:"wheat.jpg", choices:["小麦","小豆","ビート"], answer:0, explanation:"小麦はパンやめんなどに加工されます。", source:"めむろ学 p.26–31" },
  { level:"beginner", question:"砂糖の材料になる作物は？", image:"sugar-beet.jpg", choices:["てんさい（ビート）","たまねぎ","大豆"], answer:0, explanation:"てんさいは砂糖の大切な原料です。", source:"めむろ学 p.26–35" },
  { level:"beginner", question:"芽室町の農業で中心となるのは？", image:"tractor.jpg", choices:["畑作","真珠づくり","海の漁業"], answer:0, explanation:"広い土地を生かした畑作がさかんです。", source:"めむろ学 p.26–37" },
  { level:"beginner", question:"畑で作物を育てる仕事をする人は？", image:"", choices:["農家","駅員","船員"], answer:0, explanation:"農家の人たちが工夫して作物を育てています。", source:"めむろ学 p.26–37" },
  { level:"beginner", question:"火事のときに出動する車は？", image:"fire-engine.jpg", choices:["消防車","ごみ収集車","トラクター"], answer:0, explanation:"消防車は火を消すための道具を運びます。", source:"めむろ学 p.50–59" },
  { level:"beginner", question:"急な病気やけがの人を運ぶ車は？", image:"ambulance.jpg", choices:["救急車","バス","除雪車"], answer:0, explanation:"救急車が病院などへ安全に運びます。", source:"めむろ学 p.50–59" },
  { level:"beginner", question:"赤信号のとき、歩く人はどうする？", image:"", choices:["止まって待つ","急いで渡る","道路で遊ぶ"], answer:0, explanation:"交通ルールを守ることが安全につながります。", source:"めむろ学 p.62–69" },
  { level:"beginner", question:"ごみを決められた日に出すのはなぜ？", image:"", choices:["安全に集めるため","道に広げるため","鳥にあげるため"], answer:0, explanation:"分別と収集日のルールが町をきれいにします。", source:"めむろ学 p.104–117" },
  { level:"beginner", question:"使える物をくり返し使うことは？", image:"reuse.jpg", choices:["リユース","リセット","リレー"], answer:0, explanation:"リユースは、物をくり返し使うことです。", source:"めむろ学 p.115" },
  { level:"beginner", question:"水道の水は、どこへ送られる？", image:"water-plant.jpg", choices:["家や学校","空の上","海の船だけ"], answer:0, explanation:"きれいにした水が水道管で家や学校へ届きます。", source:"めむろ学 p.90–99" },
  { level:"beginner", question:"冬の道路で活やくする車は？", image:"snowplow.jpg", choices:["除雪車","消防車","田植え機"], answer:0, explanation:"除雪車が雪をよけて道路を通りやすくします。", source:"めむろ学 p.70–77" },
  { level:"beginner", question:"町を地図で見ると分かることは？", image:"", choices:["場所や広がり","食べ物の味","音の大きさ"], answer:0, explanation:"地図では場所、道、土地の使われ方などが分かります。", source:"めむろ学 p.14–23" },
  { level:"beginner", question:"町を調べるよい方法は？", image:"", choices:["見学して話を聞く","思いつきだけで決める","何も見ない"], answer:0, explanation:"見学やインタビューで本物の情報を集められます。", source:"めむろ学 学び方コーナー" },

  { level:"intermediate", question:"芽室町の農地は町の面積のおよそ何％？", image:"fields.jpg", choices:["約42％","約4％","約90％"], answer:0, explanation:"町の約42％が農地です。", source:"めむろ学 p.16・町公式「農業の概要」" },
  { level:"intermediate", question:"芽室町の気候の特ちょうは？", image:"fields.jpg", choices:["晴れる日が多い","一年中雨","一年中暑い"], answer:0, explanation:"内陸性の気候で、日本有数の晴天率です。", source:"めむろ学 p.24–25" },
  { level:"intermediate", question:"作物を同じ畑で順番に変えて育てることは？", image:"potato.jpg", choices:["輪作","連休","分別"], answer:0, explanation:"輪作は土を守り、病気などを防ぐ工夫です。", source:"めむろ学 p.30–37" },
  { level:"intermediate", question:"大きな農業機械を使う主な理由は？", image:"harvester.jpg", choices:["広い畑で効率よく作業するため","音を出すため","道をせまくするため"], answer:0, explanation:"広い畑を少ない時間で作業できます。", source:"めむろ学 p.30–37" },
  { level:"intermediate", question:"農家が天気をよく調べるのはなぜ？", image:"tractor.jpg", choices:["作業や育ち方に関係するから","駅名を決めるから","本を返すから"], answer:0, explanation:"種まきや収穫などは天気と深く関わります。", source:"めむろ学 p.30–37" },
  { level:"intermediate", question:"農作物を集め、販売も支える組織は？", image:"ja.jpg", choices:["JA","消防署","図書館"], answer:0, explanation:"JAは農家の仕事や農産物の流通を支えます。", source:"めむろ学 p.34–39" },
  { level:"intermediate", question:"工場で農産物を加工するよさは？", image:"food-factory.jpg", choices:["食品にして届けられる","畑を海にできる","雪を降らせる"], answer:0, explanation:"地域の作物をさまざまな食品に加工できます。", source:"めむろ学 p.40–49" },
  { level:"intermediate", question:"ビートから作られるものは？", image:"sugar-beet.jpg", choices:["砂糖","紙だけ","ガラス"], answer:0, explanation:"製糖工場では、てんさいから砂糖を作ります。", source:"めむろ学 p.40–49" },
  { level:"intermediate", question:"店が品物をならべるときの工夫は？", image:"supermarket.jpg", choices:["買いやすく分類する","全部かくす","床に置く"], answer:0, explanation:"種類や使い方で分け、選びやすくしています。", source:"めむろ学 p.78–89" },
  { level:"intermediate", question:"品物は店に来る前、何で運ばれることが多い？", image:"delivery-truck.jpg", choices:["トラック","救急車","消防車"], answer:0, explanation:"道路を使って多くの品物が運ばれます。", source:"めむろ学 p.78–89" },
  { level:"intermediate", question:"地元で作った物を地元で食べることは？", image:"supermarket.jpg", choices:["地産地消","遠足","輪作"], answer:0, explanation:"地産地消は地域の農業を身近に感じる取り組みです。", source:"めむろ学 p.26–49" },
  { level:"intermediate", question:"消防署でいつでも出動できるようにする工夫は？", image:"fire-station.jpg", choices:["交代で勤務する","夜はだれもいない","車を動かさない"], answer:0, explanation:"いつ起きるか分からない火事や救急に備えます。", source:"めむろ学 p.50–59" },
  { level:"intermediate", question:"地域の消防団は、だれが参加する？", image:"fire-engine.jpg", choices:["地域でくらす人たち","外国の船員だけ","ロボットだけ"], answer:0, explanation:"仕事を持ちながら地域を守る人たちが活動します。", source:"めむろ学 p.58–61" },
  { level:"intermediate", question:"防災訓練を行う目的は？", image:"drill.jpg", choices:["災害時に安全に動くため","速く走る競争のため","買い物のため"], answer:0, explanation:"ふだんの練習が、いざという時の安全につながります。", source:"めむろ学 p.58–61" },
  { level:"intermediate", question:"110番につながるのは？", image:"", choices:["警察","消防・救急","図書館"], answer:0, explanation:"事件や事故は110番、火事や救急は119番です。", source:"めむろ学 p.50–69" },
  { level:"intermediate", question:"119番につながるのは？", image:"", choices:["消防・救急","警察","町の店"], answer:0, explanation:"火事や救急のときは119番です。", source:"めむろ学 p.50–59" },
  { level:"intermediate", question:"浄水場の大切な仕事は？", image:"water-plant.jpg", choices:["水をきれいにする","ごみを燃やす","電車を動かす"], answer:0, explanation:"安全に飲める水にして送り出します。", source:"めむろ学 p.90–99" },
  { level:"intermediate", question:"水を大切にする行動は？", image:"", choices:["使わない時は止める","出しっぱなしにする","道路にまく"], answer:0, explanation:"必要な分だけ使うことが節水になります。", source:"めむろ学 p.90–103" },
  { level:"intermediate", question:"くりりんセンターで燃やすごみの熱は？", image:"waste-center.jpg", choices:["発電に利用する","そのまま捨てる","氷にする"], answer:0, explanation:"ごみを燃やした熱を利用して電気を作ります。", source:"めむろ学 p.108" },
  { level:"intermediate", question:"ごみになる物を受け取らない4Rは？", image:"waste-center.jpg", choices:["リフューズ","リユース","リサイクル"], answer:0, explanation:"Refuseは、不要な物をことわることです。", source:"めむろ学 p.115" },
  { level:"intermediate", question:"ごみそのものを減らす4Rは？", image:"", choices:["リデュース","リユース","リサイクル"], answer:0, explanation:"Reduceは、ごみを減らす工夫です。", source:"めむろ学 p.115" },
  { level:"intermediate", question:"資源を原料にもどして作り直すことは？", image:"waste-center.jpg", choices:["リサイクル","リフューズ","リデュース"], answer:0, explanation:"資源を分別し、新しい製品の原料にします。", source:"めむろ学 p.104–117" },
  { level:"intermediate", question:"鉄道や道路が大切な理由は？", image:"old-station.jpg", choices:["人や物を運ぶため","川を止めるため","畑を小さくするため"], answer:0, explanation:"交通はくらしや産業をつないでいます。", source:"めむろ学 p.70–77" },
  { level:"intermediate", question:"芽室町に多い食品工場と深い関係があるのは？", image:"", choices:["地元の農産物","海のサンゴ","南国の果物だけ"], answer:0, explanation:"豊かな農産物を生かす食品製造が発達しています。", source:"めむろ学 p.40–49" },
  { level:"intermediate", question:"くらしを良くする話し合いに大切なのは？", image:"", choices:["いろいろな人の意見を聞く","一人だけで決める","資料を見ない"], answer:0, explanation:"資料と多くの意見をもとに考えることが大切です。", source:"めむろ学 学び方コーナー" },

  { level:"advanced", question:"「芽室」の名のもとになったアイヌ語は？", image:"ainu-place-name.jpg", choices:["メム・オロ","サッ・ポロ","トカプチだけ"], answer:0, explanation:"メム・オロが転じて「芽室」になったとされます。", source:"めむろ学 p.142–159・町公式「芽室町について」" },
  { level:"advanced", question:"「メム・オロ」に近い意味は？", image:"spring-river.jpg", choices:["泉や池から流れてくる川","大きな海","高い火山"], answer:0, explanation:"川の源の泉や池から流れてくる川を表します。", source:"めむろ学 p.142–159" },
  { level:"advanced", question:"文字の記録で「芽室」が初めて登場した年は？", image:"old-map.jpg", choices:["1800年","2000年","1600年"], answer:0, explanation:"1800年の十勝川調査の地図に「メモロ」と記されました。", source:"めむろ学 p.160–169・町公式「町の紹介」" },
  { level:"advanced", question:"芽室に戸長役場が置かれた年は？", image:"old-office.jpg", choices:["1900年","1945年","2020年"], answer:0, explanation:"1900年に戸長役場が置かれ、行政の中心となりました。", source:"めむろ学 p.160–169・町公式「町の紹介」" },
  { level:"advanced", question:"芽室駅が開業した年は？", image:"old-station.jpg", choices:["1907年","1807年","2007年"], answer:0, explanation:"芽室駅は1907（明治40）年に開業しました。", source:"めむろ学 p.72" },
  { level:"advanced", question:"芽室村が芽室町になった年は？", image:"old-station.jpg", choices:["1942年","1906年","1992年"], answer:0, explanation:"1942年に町制が施行され、芽室町になりました。", source:"めむろ学 p.99・町の歴史資料" },
  { level:"advanced", question:"昔の道具や町の歩みを学べる施設は？", image:"nenrin.jpg", choices:["ふるさと歴史館ねんりん","空港","水族館"], answer:0, explanation:"ねんりんでは芽室の歴史やくらしを学べます。", source:"めむろ学 p.160–177" },
  { level:"advanced", question:"北海道の先住民族は？", image:"ainu-culture.jpg", choices:["アイヌ民族","マオリ民族","サーミ民族"], answer:0, explanation:"アイヌ民族は独自の言語や文化を育んできました。", source:"めむろ学 p.142–159" },
  { level:"advanced", question:"アイヌの人々が大切にしてきたものは？", image:"ainu-culture.jpg", choices:["自然とのつながり","大量のビル","海底トンネルだけ"], answer:0, explanation:"自然の中のさまざまなものにカムイを感じてきました。", source:"めむろ学 p.142–159" },
  { level:"advanced", question:"アイヌ語で神を表す言葉は？", image:"", choices:["カムイ","コタン","モシリ"], answer:0, explanation:"カムイは神や、人の力をこえた存在を表します。", source:"めむろ学 p.148–153" },
  { level:"advanced", question:"アイヌ語で集落を表す言葉は？", image:"kotan.jpg", choices:["コタン","カムイ","イオマンテ"], answer:0, explanation:"コタンは人々がくらす集落です。", source:"めむろ学 p.142–159" },
  { level:"advanced", question:"アイヌ文化を学ぶとき大切な姿勢は？", image:"", choices:["敬意をもって正しく知る","決めつける","昔だけのものとする"], answer:0, explanation:"今も受けつがれる文化として敬意をもって学びます。", source:"めむろ学 p.142–159" },
  { level:"advanced", question:"芽室町で生まれたスポーツは？", image:"gateball.jpg", choices:["ゲートボール","野球","ラグビー"], answer:0, explanation:"ゲートボールは芽室町が発祥の地です。", source:"めむろ学 p.140–143" },
  { level:"advanced", question:"ゲートボールが考案されたのは、いつごろ？", image:"gateball.jpg", choices:["第二次世界大戦後","江戸時代の初め","縄文時代"], answer:0, explanation:"戦後、子どもたちが楽しめるスポーツとして考案されました。", source:"めむろ学 p.140–143" },
  { level:"advanced", question:"ゲートボールでボールを通すものは？", image:"gateball.jpg", choices:["ゲート","ゴールネット","バスケット"], answer:0, explanation:"スティックで打ち、決められたゲートを通します。", source:"めむろ学 p.140–143" },
  { level:"advanced", question:"ゲートボールは主にどんな競技？", image:"gateball.jpg", choices:["チームで協力する競技","一人だけの水泳","雪上の競技だけ"], answer:0, explanation:"仲間と作戦を考えながら進めるチーム競技です。", source:"めむろ学 p.140–143" },
  { level:"advanced", question:"地域の伝統を未来へつなぐ方法は？", image:"taiko.jpg", choices:["学び、伝え、参加する","忘れる","資料を捨てる"], answer:0, explanation:"知ること、体験すること、伝えることが継承につながります。", source:"めむろ学 p.178–191" },
  { level:"advanced", question:"芽室町の郷土芸能の一つは？", image:"memuoro-taiko.jpg", choices:["メムオロ太鼓","阿波おどりだけ","ねぶただけ"], answer:0, explanation:"メムオロ太鼓は地域で受けつがれる郷土芸能です。", source:"めむろ学 p.188–191" },
  { level:"advanced", question:"昔の町の様子を調べる資料は？", image:"historic-photo.jpg", choices:["古い写真や地図","今日の天気だけ","うわさだけ"], answer:0, explanation:"写真、地図、年表、聞き取りを比べると変化が分かります。", source:"めむろ学 p.160–177" },
  { level:"advanced", question:"昔と今を比べるとき大切なのは？", image:"", choices:["同じ場所や項目で比べる","一つだけ見る","想像だけで決める"], answer:0, explanation:"比べる条件をそろえると変化を見つけやすくなります。", source:"めむろ学 学び方コーナー" },
  { level:"advanced", question:"開拓が進む前から北海道にくらしていた人々は？", image:"", choices:["アイヌの人々","宇宙飛行士","南極観測隊"], answer:0, explanation:"アイヌの人々は長く北海道で文化を築いてきました。", source:"めむろ学 p.142–169" },
  { level:"advanced", question:"鉄道が開通して町に起きた変化は？", image:"old-station.jpg", choices:["人や物が行き来しやすくなった","川が消えた","山がなくなった"], answer:0, explanation:"鉄道は町の発展や物の輸送に大きく関わりました。", source:"めむろ学 p.70–77・p.160–177" },
  { level:"advanced", question:"上水道が芽室町にできた年は？", image:"water-plant.jpg", choices:["1958年","1858年","2008年"], answer:0, explanation:"年表には1958年に上水道ができたとあります。", source:"めむろ学 p.99" },
  { level:"advanced", question:"地域の歴史を聞き取る相手としてよいのは？", image:"", choices:["長く地域にくらす人","だれにも聞かない","町を知らない人だけ"], answer:0, explanation:"体験した人の話は、資料と合わせて大切な手がかりになります。", source:"めむろ学 学び方コーナー" },
  { level:"advanced", question:"地域文化を調べた後にするとよいことは？", image:"", choices:["分かったことを発信する","自分だけでかくす","資料をなくす"], answer:0, explanation:"まとめて伝えることで、文化を知る人が増えます。", source:"めむろ学 p.188–191" }
];

const levelInfo = {
  beginner: { name: "まちたんけん", label: "ビギナー級" },
  intermediate: { name: "くらし・しごとたんけん", label: "中級" },
  advanced: { name: "れきし・文化たんけん", label: "上級" }
};
const imageCredits = {
  "memuro-map.jpg": "写真・地図：めむろ学 p.13",
  "fields.jpg": "写真：めむろ学 p.12",
  "corn.jpg": "写真：めむろ学 p.26",
  "sugar-beet.jpg": "写真：めむろ学 p.26",
  "wheat.jpg": "写真：めむろ学 p.26",
  "potato.jpg": "写真：めむろ学 p.28",
  "harvester.jpg": "写真：めむろ学 p.28",
  "tractor.jpg": "写真：めむろ学 p.30",
  "food-factory.jpg": "写真：めむろ学 p.32",
  "supermarket.jpg": "写真：めむろ学 p.40",
  "fire-engine.jpg": "写真：めむろ学 p.51",
  "fire-station.jpg": "写真：めむろ学 p.51",
  "drill.jpg": "写真：めむろ学 p.52",
  "old-station.jpg": "写真：めむろ学 p.72",
  "water-plant.jpg": "写真・図：めむろ学 p.99",
  "waste-center.jpg": "図：めむろ学 p.108",
  "gateball.jpg": "写真：めむろ学 p.143",
  "ainu-culture.jpg": "写真：めむろ学 p.155",
  "historic-photo.jpg": "写真：めむろ学 p.149"
};
