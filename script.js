// Hiragana básico + yōon (きゃ etc.). Sem dakuten/handakuten por enquanto.
// Se quiser eu adiciono tudo (が ぱ づ etc.) depois.

const HIRAGANA = [
  // vogais
  { kana: "あ", romaji: "a" }, { kana: "い", romaji: "i" }, { kana: "う", romaji: "u" }, { kana: "え", romaji: "e" }, { kana: "お", romaji: "o" },

  // k
  { kana: "か", romaji: "ka" }, { kana: "き", romaji: "ki" }, { kana: "く", romaji: "ku" }, { kana: "け", romaji: "ke" }, { kana: "こ", romaji: "ko" },

  // s
  { kana: "さ", romaji: "sa" }, { kana: "し", romaji: "shi" }, { kana: "す", romaji: "su" }, { kana: "せ", romaji: "se" }, { kana: "そ", romaji: "so" },

  // t
  { kana: "た", romaji: "ta" }, { kana: "ち", romaji: "chi" }, { kana: "つ", romaji: "tsu" }, { kana: "て", romaji: "te" }, { kana: "と", romaji: "to" },

  // n
  { kana: "な", romaji: "na" }, { kana: "に", romaji: "ni" }, { kana: "ぬ", romaji: "nu" }, { kana: "ね", romaji: "ne" }, { kana: "の", romaji: "no" },

  // h
  { kana: "は", romaji: "ha" }, { kana: "ひ", romaji: "hi" }, { kana: "ふ", romaji: "fu" }, { kana: "へ", romaji: "he" }, { kana: "ほ", romaji: "ho" },

  // m
  { kana: "ま", romaji: "ma" }, { kana: "み", romaji: "mi" }, { kana: "む", romaji: "mu" }, { kana: "め", romaji: "me" }, { kana: "も", romaji: "mo" },

  // y
  { kana: "や", romaji: "ya" }, { kana: "ゆ", romaji: "yu" }, { kana: "よ", romaji: "yo" },

  // r
  { kana: "ら", romaji: "ra" }, { kana: "り", romaji: "ri" }, { kana: "る", romaji: "ru" }, { kana: "れ", romaji: "re" }, { kana: "ろ", romaji: "ro" },

  // w + n
  { kana: "わ", romaji: "wa" }, { kana: "を", romaji: "wo" }, { kana: "ん", romaji: "n" },

  // yōon (combinações)
  { kana: "きゃ", romaji: "kya" }, { kana: "きゅ", romaji: "kyu" }, { kana: "きょ", romaji: "kyo" },
  { kana: "しゃ", romaji: "sha" }, { kana: "しゅ", romaji: "shu" }, { kana: "しょ", romaji: "sho" },
  { kana: "ちゃ", romaji: "cha" }, { kana: "ちゅ", romaji: "chu" }, { kana: "ちょ", romaji: "cho" },
  { kana: "にゃ", romaji: "nya" }, { kana: "にゅ", romaji: "nyu" }, { kana: "にょ", romaji: "nyo" },
  { kana: "ひゃ", romaji: "hya" }, { kana: "ひゅ", romaji: "hyu" }, { kana: "ひょ", romaji: "hyo" },
  { kana: "みゃ", romaji: "mya" }, { kana: "みゅ", romaji: "myu" }, { kana: "みょ", romaji: "myo" },
  { kana: "りゃ", romaji: "rya" }, { kana: "りゅ", romaji: "ryu" }, { kana: "りょ", romaji: "ryo" },
];

const TOTAL = 10;

const $ = (sel) => document.querySelector(sel);

const screenStart = $("#screenStart");
const screenQuiz  = $("#screenQuiz");
const screenEnd   = $("#screenEnd");

const btnStart   = $("#btnStart");
const btnRestart = $("#btnRestart");
const btnSkip    = $("#btnSkip");

const kanaChar  = $("#kanaChar");
const qIndexEl  = $("#qIndex");
const scoreNow  = $("#scoreNow");
const finalScore= $("#finalScore");

const formAnswer = $("#formAnswer");
const inputRomaji= $("#inputRomaji");
const feedback   = $("#feedback");
const reviewList = $("#reviewList");

let questions = [];
let current = 0;
let score = 0;
let review = []; // {kana, correct, user, ok}

function shuffle(arr){
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s){
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function show(el){
  el.classList.remove("hidden");
}
function hide(el){
  el.classList.add("hidden");
}

function startGame(){
  questions = shuffle(HIRAGANA).slice(0, TOTAL);
  current = 0;
  score = 0;
  review = [];

  hide(screenStart);
  hide(screenEnd);
  show(screenQuiz);

  feedback.textContent = "";
  renderQuestion();
}

function renderQuestion(){
  const q = questions[current];
  kanaChar.textContent = q.kana;
  qIndexEl.textContent = String(current + 1);
  scoreNow.textContent = String(score);

  inputRomaji.value = "";
  inputRomaji.focus();
  feedback.textContent = "";
}

function endGame(){
  hide(screenQuiz);
  show(screenEnd);

  finalScore.textContent = String(score);

  // montar revisão
  reviewList.innerHTML = "";
  for (const item of review){
    const li = document.createElement("li");
    const status = item.ok ? "✅" : "❌";
    li.textContent = `${status} ${item.kana} → correto: ${item.correct} | você: ${item.user || "(vazio)"}`;
    reviewList.appendChild(li);
  }
}

function nextQuestion(){
  current += 1;
  if (current >= TOTAL){
    endGame();
  } else {
    renderQuestion();
  }
}

function answer(userAnswer, skipped=false){
  const q = questions[current];
  const user = skipped ? "" : normalize(userAnswer);
  const correct = normalize(q.romaji);
  const ok = !skipped && user === correct;

  if (ok) score += 1;

  review.push({
    kana: q.kana,
    correct: q.romaji,
    user: skipped ? "" : userAnswer,
    ok
  });

  scoreNow.textContent = String(score);

  if (skipped){
    feedback.textContent = `Pulou. Resposta: ${q.romaji}`;
  } else if (ok){
    feedback.textContent = "Boa 😼 ✅";
  } else {
    feedback.textContent = `Quase! Era: ${q.romaji}`;
  }

  // delayzinho pro cérebro registrar
  setTimeout(nextQuestion, 650);
}

// eventos
btnStart.addEventListener("click", startGame);
btnRestart.addEventListener("click", () => {
  hide(screenEnd);
  show(screenStart);
});

formAnswer.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = inputRomaji.value;
  answer(val, false);
});

btnSkip.addEventListener("click", () => answer("", true));
