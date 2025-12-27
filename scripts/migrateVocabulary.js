const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// 파일 로드
const vocabulary = JSON.parse(fs.readFileSync(path.join(dataDir, 'vocabulary.json'), 'utf8'));
const nouns = JSON.parse(fs.readFileSync(path.join(dataDir, 'nouns.json'), 'utf8'));
const verbs = JSON.parse(fs.readFileSync(path.join(dataDir, 'verbs.json'), 'utf8'));
const adjectives = JSON.parse(fs.readFileSync(path.join(dataDir, 'adjectives.json'), 'utf8'));
const adverbs = JSON.parse(fs.readFileSync(path.join(dataDir, 'adverbs.json'), 'utf8'));
const prepositions = JSON.parse(fs.readFileSync(path.join(dataDir, 'prepositions.json'), 'utf8'));

// 기존 단어 셋 (중복 방지)
const existingWords = {
  nouns: new Set(nouns.words.map(w => w.word.toLowerCase())),
  verbs: new Set(verbs.words.map(w => w.word.toLowerCase())),
  adjectives: new Set(adjectives.words.map(w => w.word.toLowerCase())),
  adverbs: new Set(adverbs.words.map(w => w.word.toLowerCase())),
  prepositions: new Set(prepositions.words.map(w => w.word.toLowerCase()))
};

// 품사 판별 함수
function detectPartOfSpeech(word) {
  const subcategory = (word.subcategory || '').toLowerCase();
  const meaning = (word.meanings[0]?.meaning || '').toLowerCase();
  const wordText = word.word.toLowerCase();

  // subcategory 기반 판별
  if (subcategory.includes('동사') || subcategory.includes('verb')) return 'verbs';
  if (subcategory.includes('명사') || subcategory.includes('noun')) return 'nouns';
  if (subcategory.includes('형용사') || subcategory.includes('adjective')) return 'adjectives';
  if (subcategory.includes('부사') || subcategory.includes('adverb')) return 'adverbs';
  if (subcategory.includes('전치사') || subcategory.includes('접속사')) return 'prepositions';

  // meaning 기반 판별 (한국어 어미로 추론)
  if (meaning.endsWith('하다') || meaning.endsWith('되다') || meaning.endsWith('시키다') ||
      meaning.endsWith('내다') || meaning.endsWith('주다') || meaning.endsWith('받다') ||
      meaning.endsWith('가다') || meaning.endsWith('오다') || meaning.endsWith('보다') ||
      meaning.endsWith('먹다') || meaning.endsWith('쓰다') || meaning.endsWith('듣다') ||
      meaning.endsWith('말하다') || meaning.endsWith('생각하다') || meaning.endsWith('느끼다') ||
      meaning.includes('~하다') || meaning.includes('~되다')) return 'verbs';

  if (meaning.endsWith('한') || meaning.endsWith('된') || meaning.endsWith('적인') ||
      meaning.endsWith('스러운') || meaning.endsWith('로운') || meaning.endsWith('없는') ||
      meaning.endsWith('있는') || meaning.endsWith('같은')) return 'adjectives';

  if (meaning.endsWith('히') || meaning.endsWith('게') || meaning.endsWith('으로') ||
      meaning.endsWith('하게')) return 'adverbs';

  // 영어 단어 형태 기반 판별
  if (wordText.endsWith('ly') && !wordText.endsWith('ally')) return 'adverbs';
  if (wordText.endsWith('tion') || wordText.endsWith('sion') || wordText.endsWith('ment') ||
      wordText.endsWith('ness') || wordText.endsWith('ity') || wordText.endsWith('ance') ||
      wordText.endsWith('ence') || wordText.endsWith('er') || wordText.endsWith('or') ||
      wordText.endsWith('ist') || wordText.endsWith('ism')) return 'nouns';
  if (wordText.endsWith('ive') || wordText.endsWith('ous') || wordText.endsWith('ful') ||
      wordText.endsWith('less') || wordText.endsWith('able') || wordText.endsWith('ible') ||
      wordText.endsWith('al') || wordText.endsWith('ical') || wordText.endsWith('ic')) return 'adjectives';
  if (wordText.endsWith('ize') || wordText.endsWith('ify') || wordText.endsWith('ate') ||
      wordText.endsWith('en')) return 'verbs';

  // 구동사 (phrasal verb)는 동사로
  if (wordText.includes(' ')) {
    const parts = wordText.split(' ');
    const lastPart = parts[parts.length - 1];
    if (['up', 'down', 'out', 'in', 'on', 'off', 'over', 'away', 'back', 'through', 'around', 'about'].includes(lastPart)) {
      return 'verbs';
    }
  }

  // 기본값: 의미에서 동작성 확인
  if (meaning.includes('~을') || meaning.includes('~를') || meaning.includes('~에게')) return 'verbs';

  return 'unknown';
}

// 분류 결과
const classified = {
  nouns: [],
  verbs: [],
  adjectives: [],
  adverbs: [],
  prepositions: [],
  unknown: []
};

// 단어 분류
vocabulary.words.forEach(word => {
  const pos = detectPartOfSpeech(word);

  // 중복 체크
  if (pos !== 'unknown' && existingWords[pos]?.has(word.word.toLowerCase())) {
    console.log(`[중복] ${word.word} -> ${pos}`);
    return;
  }

  classified[pos].push(word);
});

// 결과 출력
console.log('\n=== 분류 결과 ===');
console.log(`명사 (nouns): ${classified.nouns.length}개`);
console.log(`동사 (verbs): ${classified.verbs.length}개`);
console.log(`형용사 (adjectives): ${classified.adjectives.length}개`);
console.log(`부사 (adverbs): ${classified.adverbs.length}개`);
console.log(`전치사 (prepositions): ${classified.prepositions.length}개`);
console.log(`미분류 (unknown): ${classified.unknown.length}개`);

// 미분류 단어 출력 (처음 20개)
if (classified.unknown.length > 0) {
  console.log('\n=== 미분류 단어 (처음 20개) ===');
  classified.unknown.slice(0, 20).forEach(w => {
    console.log(`  ${w.word}: ${w.meanings[0]?.meaning} [${w.subcategory}]`);
  });
}

// ID 재생성 함수
function regenerateIds(words, prefix, startIdx) {
  return words.map((w, i) => ({
    ...w,
    id: `${prefix}_${w.word.replace(/\s+/g, '_')}_${startIdx + i}`
  }));
}

// 각 파일에 추가
const targets = {
  nouns: { data: nouns, file: 'nouns.json' },
  verbs: { data: verbs, file: 'verbs.json' },
  adjectives: { data: adjectives, file: 'adjectives.json' },
  adverbs: { data: adverbs, file: 'adverbs.json' }
};

Object.entries(targets).forEach(([pos, { data, file }]) => {
  if (classified[pos].length > 0) {
    const newWords = regenerateIds(classified[pos], data.id, data.words.length);
    data.words.push(...newWords);
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
    console.log(`\n${file}: ${data.words.length}개 (+${classified[pos].length})`);
  }
});

// vocabulary.json 업데이트 (미분류만 남김)
vocabulary.words = regenerateIds(classified.unknown, 'vocabulary', 0);
fs.writeFileSync(path.join(dataDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2));
console.log(`\nvocabulary.json: ${vocabulary.words.length}개 (미분류만 남음)`);

console.log('\n완료!');
