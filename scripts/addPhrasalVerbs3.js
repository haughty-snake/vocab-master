const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/phrasalVerbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 구동사 수:', existingWords.size);

const finalPhrasalVerbs = [
  { word: "goof around", pronunciation: "guf əˈraʊnd", subcategory: "일상 구동사", meaning: "빈둥거리다", examples: [{ sentence: "Stop goofing around!", translation: "빈둥거리지 마!" }] },
  { word: "mess around", pronunciation: "mes əˈraʊnd", subcategory: "일상 구동사", meaning: "빈둥거리다", examples: [{ sentence: "We were just messing around.", translation: "그냥 놀고 있었어요." }] },
  { word: "horse around", pronunciation: "hɔrs əˈraʊnd", subcategory: "일상 구동사", meaning: "장난치다", examples: [{ sentence: "The kids were horsing around.", translation: "아이들이 장난치고 있었어요." }] },
  { word: "fool around", pronunciation: "ful əˈraʊnd", subcategory: "일상 구동사", meaning: "장난치다", examples: [{ sentence: "Don't fool around with that!", translation: "그거 가지고 장난치지 마!" }] },
  { word: "laze around", pronunciation: "leɪz əˈraʊnd", subcategory: "일상 구동사", meaning: "빈둥거리다", examples: [{ sentence: "I lazed around all weekend.", translation: "주말 내내 빈둥거렸어요." }] },
  { word: "bum around", pronunciation: "bʌm əˈraʊnd", subcategory: "일상 구동사", meaning: "방랑하다", examples: [{ sentence: "He bummed around Europe.", translation: "그는 유럽을 방랑했어요." }] },
  { word: "stick around", pronunciation: "stɪk əˈraʊnd", subcategory: "일상 구동사", meaning: "머무르다", examples: [{ sentence: "Stick around, I'll be back soon.", translation: "있어, 곧 돌아올게." }] },
  { word: "hang around", pronunciation: "hæŋ əˈraʊnd", subcategory: "일상 구동사", meaning: "어슬렁거리다", examples: [{ sentence: "Don't hang around here.", translation: "여기서 어슬렁거리지 마." }] },
  { word: "shop around", pronunciation: "ʃɑp əˈraʊnd", subcategory: "일상 구동사", meaning: "여기저기 비교하다", examples: [{ sentence: "Shop around for the best price.", translation: "최저가를 찾아 비교해봐요." }] },
  { word: "ask around", pronunciation: "æsk əˈraʊnd", subcategory: "일상 구동사", meaning: "수소문하다", examples: [{ sentence: "I'll ask around about it.", translation: "그것에 대해 수소문해볼게요." }] },
  { word: "look around", pronunciation: "lʊk əˈraʊnd", subcategory: "일상 구동사", meaning: "둘러보다", examples: [{ sentence: "Let's look around the store.", translation: "가게를 둘러봅시다." }] },
  { word: "poke around", pronunciation: "poʊk əˈraʊnd", subcategory: "일상 구동사", meaning: "뒤지다", examples: [{ sentence: "Stop poking around my stuff!", translation: "내 물건 뒤지지 마!" }] },
  { word: "nose around", pronunciation: "noʊz əˈraʊnd", subcategory: "일상 구동사", meaning: "캐묻다", examples: [{ sentence: "Journalists were nosing around.", translation: "기자들이 캐묻고 다녔어요." }] },
  { word: "sniff around", pronunciation: "snɪf əˈraʊnd", subcategory: "일상 구동사", meaning: "냄새 맡다, 탐색하다", examples: [{ sentence: "The dog sniffed around.", translation: "개가 냄새를 맡으며 돌아다녔어요." }] },
  { word: "fiddle around", pronunciation: "ˈfɪdl əˈraʊnd", subcategory: "일상 구동사", meaning: "만지작거리다", examples: [{ sentence: "Stop fiddling around with your phone.", translation: "폰 만지작거리지 마." }] },
  { word: "tinker with", pronunciation: "ˈtɪŋkər wɪð", subcategory: "일반 구동사", meaning: "손보다", examples: [{ sentence: "He loves tinkering with cars.", translation: "그는 차 손보는 걸 좋아해요." }] },
  { word: "tamper with", pronunciation: "ˈtæmpər wɪð", subcategory: "일반 구동사", meaning: "함부로 건드리다", examples: [{ sentence: "Don't tamper with the evidence.", translation: "증거를 함부로 건드리지 마세요." }] },
  { word: "meddle with", pronunciation: "ˈmedl wɪð", subcategory: "일반 구동사", meaning: "간섭하다", examples: [{ sentence: "Don't meddle with my affairs.", translation: "내 일에 간섭하지 마." }] },
  { word: "interfere with", pronunciation: "ˌɪntərˈfɪr wɪð", subcategory: "일반 구동사", meaning: "방해하다", examples: [{ sentence: "Don't interfere with my work.", translation: "내 일을 방해하지 마." }] },
  { word: "toy with", pronunciation: "tɔɪ wɪð", subcategory: "일반 구동사", meaning: "가지고 놀다", examples: [{ sentence: "She toyed with her food.", translation: "그녀는 음식을 가지고 놀았어요." }] },
  { word: "grapple with", pronunciation: "ˈgræpəl wɪð", subcategory: "일반 구동사", meaning: "씨름하다", examples: [{ sentence: "We're grappling with the problem.", translation: "우리는 그 문제와 씨름 중이에요." }] },
  { word: "wrestle with", pronunciation: "ˈresəl wɪð", subcategory: "일반 구동사", meaning: "고심하다", examples: [{ sentence: "I'm wrestling with a decision.", translation: "결정에 고심 중이에요." }] },
  { word: "contend with", pronunciation: "kənˈtend wɪð", subcategory: "일반 구동사", meaning: "맞서다", examples: [{ sentence: "We have to contend with many challenges.", translation: "많은 도전에 맞서야 해요." }] },
  { word: "reckon with", pronunciation: "ˈrekən wɪð", subcategory: "일반 구동사", meaning: "고려하다", examples: [{ sentence: "You'll have to reckon with the consequences.", translation: "결과를 고려해야 할 거예요." }] },
  { word: "tally with", pronunciation: "ˈtæli wɪð", subcategory: "일반 구동사", meaning: "일치하다", examples: [{ sentence: "Your story doesn't tally with the facts.", translation: "네 이야기가 사실과 일치하지 않아." }] },
  { word: "square with", pronunciation: "skwer wɪð", subcategory: "일반 구동사", meaning: "일치하다", examples: [{ sentence: "This doesn't square with what you said before.", translation: "이건 전에 네가 말한 것과 일치하지 않아." }] },
  { word: "make off", pronunciation: "meɪk ɔf", subcategory: "일반 구동사", meaning: "달아나다", examples: [{ sentence: "The thief made off with the money.", translation: "도둑이 돈을 가지고 달아났어요." }] },
  { word: "run off", pronunciation: "rʌn ɔf", subcategory: "일반 구동사", meaning: "달아나다", examples: [{ sentence: "He ran off without paying.", translation: "그는 돈을 안 내고 달아났어요." }] },
  { word: "take off", pronunciation: "teɪk ɔf", subcategory: "일반 구동사", meaning: "급히 떠나다", examples: [{ sentence: "I have to take off now.", translation: "지금 급히 가야 해요." }] },
  { word: "buzz off", pronunciation: "bʌz ɔf", subcategory: "일반 구동사", meaning: "꺼지다", examples: [{ sentence: "Buzz off!", translation: "꺼져!" }] },
  { word: "clear off", pronunciation: "klɪr ɔf", subcategory: "일반 구동사", meaning: "가버리다", examples: [{ sentence: "Clear off! This is private property.", translation: "가! 여기는 사유지야." }] },
  { word: "push off", pronunciation: "pʊʃ ɔf", subcategory: "일반 구동사", meaning: "가다", examples: [{ sentence: "I'd better push off now.", translation: "이제 가봐야겠어." }] },
  { word: "slope off", pronunciation: "sloʊp ɔf", subcategory: "일반 구동사", meaning: "슬쩍 빠지다", examples: [{ sentence: "He sloped off early.", translation: "그는 일찍 슬쩍 빠졌어요." }] },
  { word: "slip off", pronunciation: "slɪp ɔf", subcategory: "일반 구동사", meaning: "슬쩍 나가다", examples: [{ sentence: "She slipped off unnoticed.", translation: "그녀는 눈에 띄지 않게 슬쩍 나갔어요." }] },
  { word: "nod off", pronunciation: "nɑd ɔf", subcategory: "일상 구동사", meaning: "꾸벅꾸벅 졸다", examples: [{ sentence: "I nodded off during the lecture.", translation: "강의 중에 꾸벅꾸벅 졸았어요." }] },
  { word: "drop off", pronunciation: "drɑp ɔf", subcategory: "일상 구동사", meaning: "잠들다", examples: [{ sentence: "I dropped off in front of the TV.", translation: "TV 앞에서 잠들었어요." }] },
  { word: "wear off", pronunciation: "wer ɔf", subcategory: "일반 구동사", meaning: "효과가 사라지다", examples: [{ sentence: "The effect wore off.", translation: "효과가 사라졌어요." }] },
  { word: "pay off", pronunciation: "peɪ ɔf", subcategory: "일반 구동사", meaning: "결실을 맺다", examples: [{ sentence: "Hard work pays off.", translation: "노력은 결실을 맺어요." }] },
  { word: "show off", pronunciation: "ʃoʊ ɔf", subcategory: "일반 구동사", meaning: "뽐내다", examples: [{ sentence: "Stop showing off!", translation: "뽐내지 마!" }] },
  { word: "tell off", pronunciation: "tel ɔf", subcategory: "일반 구동사", meaning: "혼내다", examples: [{ sentence: "My mom told me off.", translation: "엄마가 나를 혼냈어요." }] }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const pv of finalPhrasalVerbs) {
  if (!existingWords.has(pv.word.toLowerCase())) {
    const newWord = {
      id: `phrasalVerbs_${pv.word.replace(/\s+/g, '_')}_${startIndex + addedCount}`,
      word: pv.word,
      pronunciation: pv.pronunciation,
      subcategory: pv.subcategory,
      meanings: [{
        partOfSpeech: "",
        meaning: pv.meaning,
        examples: pv.examples
      }]
    };
    data.words.push(newWord);
    existingWords.add(pv.word.toLowerCase());
    addedCount++;
  }
}

console.log('추가된 구동사 수:', addedCount);
console.log('최종 구동사 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
