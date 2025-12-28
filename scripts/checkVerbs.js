const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('총 동사 수:', data.words.length);

const emptyMeaning = data.words.filter(w => !w.meanings[0].meaning || w.meanings[0].meaning === '');
console.log('빈 뜻 수:', emptyMeaning.length);

const noExamples = data.words.filter(w => !w.meanings[0].examples || w.meanings[0].examples.length === 0);
console.log('예문 없는 수:', noExamples.length);

console.log('\n샘플 (처음 3개):');
console.log(JSON.stringify(data.words.slice(0, 3), null, 2));
