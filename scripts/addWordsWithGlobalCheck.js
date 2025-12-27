const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
  console.error('Usage: node addWordsWithGlobalCheck.js <target-file>');
  process.exit(1);
}

// 대상 파일에서만 기존 단어 수집
const data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

console.log('대상 파일 기존 단어 수:', existingWords.size);

const prefix = data.id || path.basename(targetFile, '.json');
let startId = data.words.length;

// 새 단어 목록
const newWords = require('./newWords.js');

let addedCount = 0;
let skippedCount = 0;

newWords.forEach((w) => {
  if (existingWords.has(w.word.toLowerCase())) {
    skippedCount++;
    console.log('  [중복] ' + w.word);
    return;
  }
  existingWords.add(w.word.toLowerCase());
  const currentId = startId + addedCount;
  addedCount++;
  data.words.push({
    id: prefix + '_' + w.word + '_' + currentId,
    word: w.word,
    pronunciation: w.pronunciation,
    subcategory: w.subcategory || '고급 어휘',
    meanings: [{
      partOfSpeech: '',
      meaning: w.meaning,
      examples: [{
        sentence: w.example,
        translation: w.translation
      }]
    }]
  });
});

fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
console.log(path.basename(targetFile) + ': ' + data.words.length + '개 (+' + addedCount + ', 중복 ' + skippedCount + '개 제외)');
