const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// 수동 분류
const manualClassification = {
  // 필러/연결 표현 -> expressions.json
  expressions: ['well', 'anyway', 'though', 'kind of', 'sort of', 'you know'],
  // 명사
  nouns: ['stuff', 'benchmark', 'remedy', 'precedent', 'remnant', 'survey', 'substitute'],
  // 동사
  verbs: [
    'acknowledge', 'attribute', 'compile', 'confine', 'disclose', 'embed', 'encompass',
    'grasp', 'immerse', 'incite', 'intercept', 'merge', 'obstruct', 'omit', 'orient',
    'precede', 'prevail', 'propel', 'pursue', 'refine', 'replenish', 'reprimand',
    'sprawl', 'surmount', 'suspend', 'trace', 'underscore', 'undo', 'unveil', 'vanquish'
  ],
  // 형용사
  adjectives: [
    'intriguing', 'averse', 'captivating', 'contradictory', 'distinct', 'dormant',
    'entrenched', 'forthcoming', 'gloomy', 'grueling', 'hefty', 'insignificant',
    'intact', 'interim', 'itinerant', 'minuscule', 'nascent', 'null', 'patent',
    'premature', 'preoccupied', 'pristine', 'redundant', 'reluctant', 'retaliatory',
    'rudimentary', 'scattered', 'sedentary', 'sparse', 'statutory', 'sterile',
    'sublime', 'subsequent', 'subsidiary', 'supplementary', 'thrifty', 'tiresome',
    'troublesome', 'turbulent', 'unsolicited', 'upfront', 'upscale', 'utmost',
    'wary', 'willing', 'acclaimed', 'advisory', 'aspiring', 'astounding', 'awkward',
    'balanced', 'bloated', 'breakneck', 'breathtaking', 'brittle', 'burdensome',
    'bustling', 'compliant', 'concerted', 'conflicting', 'congruent', 'contemporary',
    'crammed', 'crude', 'daunting', 'dazzling', 'deemed'
  ]
};

// 파일 로드
const vocabulary = JSON.parse(fs.readFileSync(path.join(dataDir, 'vocabulary.json'), 'utf8'));
const files = {
  nouns: JSON.parse(fs.readFileSync(path.join(dataDir, 'nouns.json'), 'utf8')),
  verbs: JSON.parse(fs.readFileSync(path.join(dataDir, 'verbs.json'), 'utf8')),
  adjectives: JSON.parse(fs.readFileSync(path.join(dataDir, 'adjectives.json'), 'utf8')),
  expressions: JSON.parse(fs.readFileSync(path.join(dataDir, 'expressions.json'), 'utf8'))
};

// 기존 단어 셋
const existingSets = {};
Object.entries(files).forEach(([key, data]) => {
  existingSets[key] = new Set(data.words.map(w => w.word.toLowerCase()));
});

// 분류
const classified = { nouns: [], verbs: [], adjectives: [], expressions: [], remaining: [] };

vocabulary.words.forEach(word => {
  const w = word.word.toLowerCase();
  let found = false;

  for (const [pos, words] of Object.entries(manualClassification)) {
    if (words.includes(w)) {
      // 중복 체크
      if (existingSets[pos]?.has(w)) {
        console.log(`[중복] ${word.word} -> ${pos}`);
      } else {
        classified[pos].push(word);
      }
      found = true;
      break;
    }
  }

  if (!found) {
    classified.remaining.push(word);
  }
});

// 결과 출력
console.log('\n=== 분류 결과 ===');
Object.entries(classified).forEach(([pos, words]) => {
  console.log(`${pos}: ${words.length}개`);
});

// ID 재생성 함수
function regenerateIds(words, prefix, startIdx) {
  return words.map((w, i) => ({
    ...w,
    id: `${prefix}_${w.word.replace(/\s+/g, '_')}_${startIdx + i}`
  }));
}

// 각 파일에 추가
const targets = {
  nouns: { data: files.nouns, file: 'nouns.json' },
  verbs: { data: files.verbs, file: 'verbs.json' },
  adjectives: { data: files.adjectives, file: 'adjectives.json' },
  expressions: { data: files.expressions, file: 'expressions.json' }
};

Object.entries(targets).forEach(([pos, { data, file }]) => {
  if (classified[pos].length > 0) {
    const newWords = regenerateIds(classified[pos], data.id, data.words.length);
    data.words.push(...newWords);
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
    console.log(`${file}: ${data.words.length}개 (+${classified[pos].length})`);
  }
});

// vocabulary.json 비우거나 남은 것만 저장
if (classified.remaining.length === 0) {
  // vocabulary.json 삭제
  fs.unlinkSync(path.join(dataDir, 'vocabulary.json'));
  console.log('\nvocabulary.json 삭제됨 (모든 단어 이동 완료)');
} else {
  vocabulary.words = regenerateIds(classified.remaining, 'vocabulary', 0);
  fs.writeFileSync(path.join(dataDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2));
  console.log(`\nvocabulary.json: ${classified.remaining.length}개 남음`);
  classified.remaining.forEach(w => console.log(`  - ${w.word}`));
}

console.log('\n완료!');
