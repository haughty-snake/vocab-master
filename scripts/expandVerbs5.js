const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 동사 수:', data.words.length);

const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

const moreVerbs = [
  // 최종 마무리 동사들
  { word: "oust", meaning: "축출하다", example: "The CEO was ousted from the company.", translation: "CEO가 회사에서 축출되었다.", subcategory: "비즈니스", past: "ousted", pp: "ousted" },
  { word: "revamp", meaning: "개편하다", example: "They revamped the website.", translation: "그들은 웹사이트를 개편했다.", subcategory: "비즈니스", past: "revamped", pp: "revamped" },
  { word: "spearhead", meaning: "선두에 서다", example: "She spearheaded the project.", translation: "그녀가 프로젝트의 선두에 섰다.", subcategory: "비즈니스", past: "spearheaded", pp: "spearheaded" },
  { word: "debunk", meaning: "폭로하다", example: "Scientists debunked the myth.", translation: "과학자들이 그 미신을 폭로했다.", subcategory: "의사소통", past: "debunked", pp: "debunked" },
  { word: "defuse", meaning: "진정시키다", example: "He defused the tense situation.", translation: "그가 긴장된 상황을 진정시켰다.", subcategory: "의사소통", past: "defused", pp: "defused" },
  { word: "sideline", meaning: "옆으로 밀어내다", example: "He was sidelined after the injury.", translation: "그는 부상 후 벤치로 밀려났다.", subcategory: "스포츠", past: "sidelined", pp: "sidelined" },
  { word: "catapult", meaning: "급등시키다", example: "The song catapulted her to fame.", translation: "그 노래가 그녀를 유명하게 만들었다.", subcategory: "추상", past: "catapulted", pp: "catapulted" },
  { word: "galvanize", meaning: "자극하다", example: "The speech galvanized the crowd.", translation: "연설이 군중을 자극했다.", subcategory: "추상", past: "galvanized", pp: "galvanized" },
  { word: "kindle", meaning: "불붙이다, 일으키다", example: "The movie kindled my interest.", translation: "그 영화가 내 관심을 불러일으켰다.", subcategory: "추상", past: "kindled", pp: "kindled" },
  { word: "quash", meaning: "진압하다", example: "The rebellion was quashed.", translation: "반란이 진압되었다.", subcategory: "추상", past: "quashed", pp: "quashed" },
  { word: "stifle", meaning: "억누르다", example: "She stifled a yawn.", translation: "그녀는 하품을 참았다.", subcategory: "추상", past: "stifled", pp: "stifled" },
  { word: "thwart", meaning: "좌절시키다", example: "The plan was thwarted.", translation: "계획이 좌절되었다.", subcategory: "추상", past: "thwarted", pp: "thwarted" },
  { word: "waylay", meaning: "가로막다", example: "He was waylaid by fans.", translation: "그는 팬들에게 가로막혔다.", subcategory: "동작", past: "waylaid", pp: "waylaid" },
  { word: "zigzag", meaning: "지그재그로 가다", example: "The path zigzagged up the hill.", translation: "길이 언덕을 지그재그로 올라갔다.", subcategory: "이동", past: "zigzagged", pp: "zigzagged" },
  { word: "nag", meaning: "잔소리하다", example: "Stop nagging me about it.", translation: "그것에 대해 잔소리하지 마.", subcategory: "의사소통", past: "nagged", pp: "nagged" },
  { word: "pester", meaning: "귀찮게 하다", example: "He pestered me for an answer.", translation: "그는 답을 달라고 나를 귀찮게 했다.", subcategory: "의사소통", past: "pestered", pp: "pestered" },
  { word: "badger", meaning: "조르다", example: "She badgered him into agreeing.", translation: "그녀는 그를 졸라서 동의하게 했다.", subcategory: "의사소통", past: "badgered", pp: "badgered" },
  { word: "coax", meaning: "달래다, 구슬리다", example: "She coaxed the cat out of the tree.", translation: "그녀는 고양이를 나무에서 내려오도록 달랬다.", subcategory: "의사소통", past: "coaxed", pp: "coaxed" },
  { word: "entice", meaning: "유혹하다", example: "They enticed customers with discounts.", translation: "그들은 할인으로 고객을 유혹했다.", subcategory: "비즈니스", past: "enticed", pp: "enticed" },
  { word: "lure", meaning: "유인하다", example: "The offer lured many applicants.", translation: "그 제안이 많은 지원자를 유인했다.", subcategory: "비즈니스", past: "lured", pp: "lured" },
  { word: "sway", meaning: "흔들리다, 영향을 주다", example: "Don't let him sway your decision.", translation: "그가 네 결정에 영향을 주도록 하지 마.", subcategory: "추상", past: "swayed", pp: "swayed" },
  { word: "waver", meaning: "흔들리다, 망설이다", example: "She wavered between the two options.", translation: "그녀는 두 선택지 사이에서 망설였다.", subcategory: "추상", past: "wavered", pp: "wavered" },
  { word: "falter", meaning: "주춤하다", example: "Her voice faltered with emotion.", translation: "그녀의 목소리가 감정에 떨렸다.", subcategory: "추상", past: "faltered", pp: "faltered" },
  { word: "flounder", meaning: "허우적거리다", example: "He floundered during the interview.", translation: "그는 면접에서 허우적거렸다.", subcategory: "추상", past: "floundered", pp: "floundered" },
  { word: "fumble", meaning: "더듬거리다", example: "She fumbled for the light switch.", translation: "그녀는 전등 스위치를 더듬어 찾았다.", subcategory: "동작", past: "fumbled", pp: "fumbled" },
];

let startIndex = data.words.length;
let addedCount = 0;

for (const verb of moreVerbs) {
  if (!existingWords.has(verb.word.toLowerCase())) {
    const newWord = {
      id: `verbs_${verb.word.replace(/[\s-]+/g, '_')}_${startIndex + addedCount}`,
      word: verb.word,
      pronunciation: "",
      subcategory: verb.subcategory,
      meanings: [{
        partOfSpeech: "verb",
        meaning: verb.meaning,
        examples: [{
          sentence: verb.example,
          translation: verb.translation
        }]
      }],
      pastTense: verb.past,
      pastParticiple: verb.pp,
      antonym: ""
    };
    data.words.push(newWord);
    existingWords.add(verb.word.toLowerCase());
    addedCount++;
  }
}

console.log('추가된 동사 수:', addedCount);
console.log('최종 동사 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
