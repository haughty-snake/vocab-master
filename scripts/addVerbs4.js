const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 동사 수:', existingWords.size);

const lastVerbs = [
  { word: "simplify", pronunciation: "ˈsɪmplɪfaɪ", meaning: "단순화하다", examples: [{ sentence: "Simplify the instructions.", translation: "지침을 단순화하세요." }] },
  { word: "complicate", pronunciation: "ˈkɑmplɪkeɪt", meaning: "복잡하게 하다", examples: [{ sentence: "Don't complicate things.", translation: "일을 복잡하게 만들지 마." }] },
  { word: "clarify", pronunciation: "ˈklærɪfaɪ", meaning: "명확히 하다", examples: [{ sentence: "Please clarify your point.", translation: "요점을 명확히 해주세요." }] },
  { word: "specify", pronunciation: "ˈspesɪfaɪ", meaning: "명시하다", examples: [{ sentence: "Specify the requirements.", translation: "요구사항을 명시하세요." }] },
  { word: "emphasize", pronunciation: "ˈemfəsaɪz", meaning: "강조하다", examples: [{ sentence: "I want to emphasize this point.", translation: "이 점을 강조하고 싶어요." }] },
  { word: "highlight", pronunciation: "ˈhaɪlaɪt", meaning: "강조하다", examples: [{ sentence: "Highlight the key points.", translation: "핵심 포인트를 강조하세요." }] },
  { word: "underline", pronunciation: "ˌʌndərˈlaɪn", meaning: "밑줄 긋다", examples: [{ sentence: "Underline important words.", translation: "중요한 단어에 밑줄 그으세요." }] },
  { word: "illustrate", pronunciation: "ˈɪləstreɪt", meaning: "설명하다, 그림 그리다", examples: [{ sentence: "Let me illustrate my point.", translation: "제 요점을 설명해 드릴게요." }] },
  { word: "demonstrate", pronunciation: "ˈdemənstreɪt", meaning: "보여주다", examples: [{ sentence: "Demonstrate how it works.", translation: "작동 방식을 보여주세요." }] },
  { word: "exhibit", pronunciation: "ɪgˈzɪbɪt", meaning: "전시하다", examples: [{ sentence: "The museum exhibits art.", translation: "박물관이 예술품을 전시한다." }] },

  { word: "display", pronunciation: "dɪˈspleɪ", meaning: "전시하다, 표시하다", examples: [{ sentence: "Display the results.", translation: "결과를 표시하세요." }] },
  { word: "showcase", pronunciation: "ˈʃoʊkeɪs", meaning: "선보이다", examples: [{ sentence: "Showcase your talents.", translation: "재능을 선보이세요." }] },
  { word: "feature", pronunciation: "ˈfitʃər", meaning: "특집으로 다루다", examples: [{ sentence: "The magazine featured her.", translation: "잡지가 그녀를 특집으로 다뤘다." }] },
  { word: "portray", pronunciation: "pɔrˈtreɪ", meaning: "묘사하다", examples: [{ sentence: "The movie portrays war.", translation: "영화가 전쟁을 묘사한다." }] },
  { word: "depict", pronunciation: "dɪˈpɪkt", meaning: "묘사하다", examples: [{ sentence: "The painting depicts nature.", translation: "그림이 자연을 묘사한다." }] },
  { word: "sketch", pronunciation: "sketʃ", meaning: "스케치하다", examples: [{ sentence: "She sketched the landscape.", translation: "그녀가 풍경을 스케치했다." }] },
  { word: "draft", pronunciation: "dræft", meaning: "초안을 작성하다", examples: [{ sentence: "Draft a proposal.", translation: "제안서 초안을 작성하세요." }] },
  { word: "outline", pronunciation: "ˈaʊtlaɪn", meaning: "개요를 설명하다", examples: [{ sentence: "Outline the plan.", translation: "계획을 개요를 설명하세요." }] },
  { word: "formulate", pronunciation: "ˈfɔrmjəleɪt", meaning: "공식화하다", examples: [{ sentence: "Formulate a strategy.", translation: "전략을 수립하세요." }] },
  { word: "devise", pronunciation: "dɪˈvaɪz", meaning: "고안하다", examples: [{ sentence: "Devise a plan.", translation: "계획을 고안하세요." }] },

  { word: "conceive", pronunciation: "kənˈsiv", meaning: "생각해내다", examples: [{ sentence: "She conceived the idea.", translation: "그녀가 그 아이디어를 생각해냈다." }] },
  { word: "envision", pronunciation: "ɪnˈvɪʒən", meaning: "상상하다", examples: [{ sentence: "Envision the future.", translation: "미래를 상상하세요." }] },
  { word: "visualize", pronunciation: "ˈvɪʒuəlaɪz", meaning: "시각화하다", examples: [{ sentence: "Visualize success.", translation: "성공을 시각화하세요." }] },
  { word: "simulate", pronunciation: "ˈsɪmjəleɪt", meaning: "모의실험하다", examples: [{ sentence: "Simulate the scenario.", translation: "시나리오를 모의실험하세요." }] },
  { word: "emulate", pronunciation: "ˈemjəleɪt", meaning: "모방하다", examples: [{ sentence: "Emulate their success.", translation: "그들의 성공을 모방하세요." }] },
  { word: "imitate", pronunciation: "ˈɪmɪteɪt", meaning: "모방하다", examples: [{ sentence: "Don't imitate others.", translation: "남을 따라하지 마." }] },
  { word: "mimic", pronunciation: "ˈmɪmɪk", meaning: "흉내 내다", examples: [{ sentence: "The bird mimics sounds.", translation: "새가 소리를 흉내 낸다." }] },
  { word: "replicate", pronunciation: "ˈreplɪkeɪt", meaning: "복제하다", examples: [{ sentence: "Replicate the experiment.", translation: "실험을 복제하세요." }] },
  { word: "duplicate", pronunciation: "ˈduplɪkeɪt", meaning: "복사하다", examples: [{ sentence: "Duplicate the file.", translation: "파일을 복사하세요." }] },
  { word: "clone", pronunciation: "kloʊn", meaning: "복제하다", examples: [{ sentence: "Clone the repository.", translation: "저장소를 복제하세요." }] },

  { word: "regenerate", pronunciation: "rɪˈdʒenəreɪt", meaning: "재생하다", examples: [{ sentence: "The body regenerates cells.", translation: "몸이 세포를 재생한다." }] },
  { word: "restore", pronunciation: "rɪˈstɔr", meaning: "복원하다", examples: [{ sentence: "Restore the backup.", translation: "백업을 복원하세요." }] },
  { word: "recover", pronunciation: "rɪˈkʌvər", meaning: "회복하다", examples: [{ sentence: "She recovered quickly.", translation: "그녀는 빨리 회복했다." }] },
  { word: "revive", pronunciation: "rɪˈvaɪv", meaning: "부활시키다", examples: [{ sentence: "Revive the tradition.", translation: "전통을 부활시키세요." }] },
  { word: "resurrect", pronunciation: "ˌrezəˈrekt", meaning: "부활시키다", examples: [{ sentence: "They resurrected the project.", translation: "그들은 프로젝트를 부활시켰다." }] },
  { word: "renew", pronunciation: "rɪˈnu", meaning: "갱신하다", examples: [{ sentence: "Renew your subscription.", translation: "구독을 갱신하세요." }] },
  { word: "refresh", pronunciation: "rɪˈfreʃ", meaning: "새로고침하다", examples: [{ sentence: "Refresh the page.", translation: "페이지를 새로고침하세요." }] },
  { word: "reload", pronunciation: "riˈloʊd", meaning: "다시 불러오다", examples: [{ sentence: "Reload the browser.", translation: "브라우저를 다시 불러오세요." }] },
  { word: "restart", pronunciation: "riˈstɑrt", meaning: "재시작하다", examples: [{ sentence: "Restart the computer.", translation: "컴퓨터를 재시작하세요." }] },
  { word: "reboot", pronunciation: "riˈbut", meaning: "재부팅하다", examples: [{ sentence: "Reboot the system.", translation: "시스템을 재부팅하세요." }] }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const verb of lastVerbs) {
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
