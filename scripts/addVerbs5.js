const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 동사 수:', existingWords.size);

const finalVerbs = [
  { word: "overthrow", pronunciation: "ˌoʊvərˈθroʊ", meaning: "전복하다", examples: [{ sentence: "They overthrew the government.", translation: "그들은 정부를 전복했다." }] },
  { word: "overturn", pronunciation: "ˌoʊvərˈtɜrn", meaning: "뒤집다", examples: [{ sentence: "The court overturned the ruling.", translation: "법원이 판결을 뒤집었다." }] },
  { word: "undermine", pronunciation: "ˌʌndərˈmaɪn", meaning: "약화시키다", examples: [{ sentence: "Don't undermine my authority.", translation: "내 권위를 약화시키지 마." }] },
  { word: "underestimate", pronunciation: "ˌʌndərˈestɪmeɪt", meaning: "과소평가하다", examples: [{ sentence: "Don't underestimate him.", translation: "그를 과소평가하지 마." }] },
  { word: "overestimate", pronunciation: "ˌoʊvərˈestɪmeɪt", meaning: "과대평가하다", examples: [{ sentence: "I overestimated my abilities.", translation: "내 능력을 과대평가했어." }] },
  { word: "oversee", pronunciation: "ˌoʊvərˈsi", meaning: "감독하다", examples: [{ sentence: "She oversees the project.", translation: "그녀가 프로젝트를 감독한다." }] },
  { word: "overlook", pronunciation: "ˌoʊvərˈlʊk", meaning: "간과하다", examples: [{ sentence: "Don't overlook details.", translation: "세부사항을 간과하지 마." }] },
  { word: "overwhelm", pronunciation: "ˌoʊvərˈwelm", meaning: "압도하다", examples: [{ sentence: "I'm overwhelmed with work.", translation: "일에 압도당하고 있어." }] },
  { word: "overhaul", pronunciation: "ˌoʊvərˈhɔl", meaning: "점검하다, 개혁하다", examples: [{ sentence: "Overhaul the system.", translation: "시스템을 개혁하세요." }] },
  { word: "override", pronunciation: "ˌoʊvərˈraɪd", meaning: "무시하다", examples: [{ sentence: "Override the default settings.", translation: "기본 설정을 무시하세요." }] },
  { word: "outperform", pronunciation: "ˌaʊtpərˈfɔrm", meaning: "능가하다", examples: [{ sentence: "She outperformed everyone.", translation: "그녀가 모두를 능가했다." }] },
  { word: "outlast", pronunciation: "aʊtˈlæst", meaning: "더 오래 지속하다", examples: [{ sentence: "Quality outlasts quantity.", translation: "품질이 양보다 오래간다." }] },
  { word: "outnumber", pronunciation: "aʊtˈnʌmbər", meaning: "수가 더 많다", examples: [{ sentence: "They outnumbered us.", translation: "그들이 우리보다 수가 많았다." }] },
  { word: "outweigh", pronunciation: "aʊtˈweɪ", meaning: "더 중요하다", examples: [{ sentence: "Benefits outweigh the risks.", translation: "이점이 위험보다 크다." }] },
  { word: "outgrow", pronunciation: "aʊtˈgroʊ", meaning: "성장하여 벗어나다", examples: [{ sentence: "He outgrew his clothes.", translation: "그는 옷이 작아졌다." }] }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const verb of finalVerbs) {
  if (!existingWords.has(verb.word.toLowerCase())) {
    const newWord = {
      id: `verbs_${verb.word.replace(/\s+/g, '_')}_${startIndex + addedCount}`,
      word: verb.word,
      pronunciation: verb.pronunciation,
      meanings: [{
        partOfSpeech: "verb",
        meaning: verb.meaning,
        examples: verb.examples
      }]
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
