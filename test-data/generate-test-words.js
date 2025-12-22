/**
 * 만건 단어 테스트 데이터 생성 스크립트
 * 실행: node generate-test-words.js
 */

const fs = require('fs');
const path = require('path');

const WORD_COUNT = 10000;

// 랜덤 문자열 생성
function randomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 랜덤 발음 기호 생성
function randomPronunciation() {
    const vowels = ['æ', 'ɑ', 'ɔ', 'ə', 'ɛ', 'ɪ', 'i', 'ʊ', 'u', 'ʌ'];
    const consonants = ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z', 'ʃ', 'θ', 'ð'];

    let result = '';
    const syllables = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < syllables; i++) {
        result += consonants[Math.floor(Math.random() * consonants.length)];
        result += vowels[Math.floor(Math.random() * vowels.length)];
    }
    return result;
}

// 품사 목록
const partsOfSpeech = ['명사', '동사', '형용사', '부사', '전치사'];

// 한글 의미 생성
function randomMeaning() {
    const prefixes = ['테스트', '샘플', '예시', '임의', '가상', '더미', '모의'];
    const suffixes = ['단어', '데이터', '항목', '값', '내용', '텍스트'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix} ${Math.floor(Math.random() * 1000)}`;
}

console.log(`${WORD_COUNT}개 테스트 단어 생성 중...`);

// JSON 형식 데이터 생성
const jsonData = [];
for (let i = 0; i < WORD_COUNT; i++) {
    const wordLength = Math.floor(Math.random() * 8) + 3; // 3-10 글자
    const word = `test_${randomString(wordLength)}_${i + 1}`;
    const hasMultipleMeanings = Math.random() > 0.7; // 30%는 다의어

    const wordObj = {
        word: word,
        pronunciation: randomPronunciation(),
        meanings: []
    };

    const meaningCount = hasMultipleMeanings ? Math.floor(Math.random() * 3) + 2 : 1;
    for (let j = 0; j < meaningCount; j++) {
        wordObj.meanings.push({
            partOfSpeech: partsOfSpeech[Math.floor(Math.random() * partsOfSpeech.length)],
            meaning: randomMeaning(),
            examples: [{
                sentence: `This is a test sentence for ${word}.`,
                translation: `이것은 ${word}의 테스트 문장입니다.`
            }]
        });
    }

    jsonData.push(wordObj);

    if ((i + 1) % 1000 === 0) {
        console.log(`  ${i + 1}개 생성 완료...`);
    }
}

// JSON 파일 저장
const jsonPath = path.join(__dirname, 'test-10000-words.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log(`JSON 저장 완료: ${jsonPath}`);

// CSV 형식 데이터 생성
const csvLines = ['word,pronunciation,partOfSpeech,meaning,example,translation'];
for (let i = 0; i < WORD_COUNT; i++) {
    const wordLength = Math.floor(Math.random() * 8) + 3;
    const word = `csv_${randomString(wordLength)}_${i + 1}`;
    const pronunciation = randomPronunciation();
    const partOfSpeech = partsOfSpeech[Math.floor(Math.random() * partsOfSpeech.length)];
    const meaning = randomMeaning();
    const example = `This is a CSV test for ${word}.`;
    const translation = `이것은 ${word}의 CSV 테스트입니다.`;

    // CSV 이스케이프 처리
    csvLines.push(`${word},${pronunciation},${partOfSpeech},${meaning},"${example}","${translation}"`);
}

// CSV 파일 저장
const csvPath = path.join(__dirname, 'test-10000-words.csv');
fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');
console.log(`CSV 저장 완료: ${csvPath}`);

// 파일 크기 출력
const jsonStats = fs.statSync(jsonPath);
const csvStats = fs.statSync(csvPath);
console.log(`\n파일 크기:`);
console.log(`  JSON: ${(jsonStats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`  CSV:  ${(csvStats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n완료!`);
