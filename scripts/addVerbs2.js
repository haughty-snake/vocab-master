const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 동사 수:', existingWords.size);

const moreVerbs = [
  // 추가 동사들
  { word: "proclaim", pronunciation: "proʊˈkleɪm", meaning: "선언하다", examples: [{ sentence: "He proclaimed his innocence.", translation: "그는 결백을 선언했다." }] },
  { word: "assert", pronunciation: "əˈsɜrt", meaning: "주장하다", examples: [{ sentence: "She asserted her rights.", translation: "그녀는 자신의 권리를 주장했다." }] },
  { word: "allege", pronunciation: "əˈledʒ", meaning: "주장하다 (증거 없이)", examples: [{ sentence: "He alleged fraud.", translation: "그는 사기라고 주장했다." }] },
  { word: "contend", pronunciation: "kənˈtend", meaning: "주장하다, 경쟁하다", examples: [{ sentence: "She contends that it's unfair.", translation: "그녀는 그것이 불공평하다고 주장한다." }] },
  { word: "dispute", pronunciation: "dɪˈspjut", meaning: "이의를 제기하다", examples: [{ sentence: "They disputed the claim.", translation: "그들은 그 주장에 이의를 제기했다." }] },
  { word: "refute", pronunciation: "rɪˈfjut", meaning: "반박하다", examples: [{ sentence: "He refuted the accusation.", translation: "그는 혐의를 반박했다." }] },
  { word: "rebut", pronunciation: "rɪˈbʌt", meaning: "반박하다", examples: [{ sentence: "She rebutted every argument.", translation: "그녀는 모든 주장을 반박했다." }] },
  { word: "counter", pronunciation: "ˈkaʊntər", meaning: "반박하다", examples: [{ sentence: "He countered with his own argument.", translation: "그는 자신의 주장으로 반박했다." }] },
  { word: "denounce", pronunciation: "dɪˈnaʊns", meaning: "비난하다", examples: [{ sentence: "They denounced the decision.", translation: "그들은 그 결정을 비난했다." }] },
  { word: "condemn", pronunciation: "kənˈdem", meaning: "비난하다", examples: [{ sentence: "Leaders condemned the attack.", translation: "지도자들이 공격을 비난했다." }] },
  { word: "criticize", pronunciation: "ˈkrɪtɪsaɪz", meaning: "비판하다", examples: [{ sentence: "Don't criticize others.", translation: "남을 비판하지 마." }] },
  { word: "blame", pronunciation: "bleɪm", meaning: "비난하다, 탓하다", examples: [{ sentence: "Don't blame me.", translation: "나를 탓하지 마." }] },
  { word: "accuse", pronunciation: "əˈkjuz", meaning: "고발하다", examples: [{ sentence: "She accused him of lying.", translation: "그녀는 그가 거짓말했다고 비난했다." }] },
  { word: "charge", pronunciation: "tʃɑrdʒ", meaning: "기소하다", examples: [{ sentence: "He was charged with theft.", translation: "그는 절도 혐의로 기소됐다." }] },
  { word: "prosecute", pronunciation: "ˈprɑsɪkjut", meaning: "기소하다", examples: [{ sentence: "They will prosecute offenders.", translation: "그들은 범죄자를 기소할 것이다." }] },
  { word: "sue", pronunciation: "su", meaning: "고소하다", examples: [{ sentence: "She sued the company.", translation: "그녀는 회사를 고소했다." }] },
  { word: "indict", pronunciation: "ɪnˈdaɪt", meaning: "기소하다", examples: [{ sentence: "The jury indicted him.", translation: "배심원이 그를 기소했다." }] },
  { word: "convict", pronunciation: "kənˈvɪkt", meaning: "유죄 판결하다", examples: [{ sentence: "He was convicted of murder.", translation: "그는 살인 유죄 판결을 받았다." }] },
  { word: "acquit", pronunciation: "əˈkwɪt", meaning: "무죄 판결하다", examples: [{ sentence: "The jury acquitted her.", translation: "배심원이 그녀에게 무죄 판결을 내렸다." }] },
  { word: "pardon", pronunciation: "ˈpɑrdən", meaning: "용서하다", examples: [{ sentence: "Please pardon the interruption.", translation: "방해해서 죄송합니다." }] },

  { word: "applaud", pronunciation: "əˈplɔd", meaning: "박수 치다", examples: [{ sentence: "The audience applauded.", translation: "관객들이 박수쳤다." }] },
  { word: "commend", pronunciation: "kəˈmend", meaning: "칭찬하다", examples: [{ sentence: "I commend your efforts.", translation: "당신의 노력을 칭찬합니다." }] },
  { word: "praise", pronunciation: "preɪz", meaning: "칭찬하다", examples: [{ sentence: "Teachers praised the student.", translation: "선생님들이 학생을 칭찬했다." }] },
  { word: "honor", pronunciation: "ˈɑnər", meaning: "기리다", examples: [{ sentence: "We honor our veterans.", translation: "우리는 참전용사를 기린다." }] },
  { word: "salute", pronunciation: "səˈlut", meaning: "경례하다", examples: [{ sentence: "Soldiers saluted the flag.", translation: "군인들이 국기에 경례했다." }] },
  { word: "acknowledge", pronunciation: "əkˈnɑlɪdʒ", meaning: "인정하다", examples: [{ sentence: "He acknowledged his mistake.", translation: "그는 실수를 인정했다." }] },
  { word: "recognize", pronunciation: "ˈrekəgnaɪz", meaning: "인식하다, 인정하다", examples: [{ sentence: "I didn't recognize you.", translation: "널 못 알아봤어." }] },
  { word: "identify", pronunciation: "aɪˈdentɪfaɪ", meaning: "식별하다", examples: [{ sentence: "Can you identify the suspect?", translation: "용의자를 식별할 수 있나요?" }] },
  { word: "distinguish", pronunciation: "dɪˈstɪŋgwɪʃ", meaning: "구별하다", examples: [{ sentence: "Distinguish fact from opinion.", translation: "사실과 의견을 구별하세요." }] },
  { word: "differentiate", pronunciation: "ˌdɪfəˈrenʃieɪt", meaning: "구별하다", examples: [{ sentence: "How do you differentiate them?", translation: "어떻게 구별하나요?" }] },

  { word: "categorize", pronunciation: "ˈkætəgəraɪz", meaning: "분류하다", examples: [{ sentence: "Categorize the items.", translation: "항목들을 분류하세요." }] },
  { word: "classify", pronunciation: "ˈklæsɪfaɪ", meaning: "분류하다", examples: [{ sentence: "Classify the data.", translation: "데이터를 분류하세요." }] },
  { word: "organize", pronunciation: "ˈɔrgənaɪz", meaning: "정리하다", examples: [{ sentence: "Organize your desk.", translation: "책상을 정리하세요." }] },
  { word: "arrange", pronunciation: "əˈreɪndʒ", meaning: "배열하다", examples: [{ sentence: "Arrange the flowers.", translation: "꽃을 배열하세요." }] },
  { word: "sort", pronunciation: "sɔrt", meaning: "분류하다", examples: [{ sentence: "Sort the laundry.", translation: "빨래를 분류하세요." }] },
  { word: "file", pronunciation: "faɪl", meaning: "정리하다, 제출하다", examples: [{ sentence: "File the documents.", translation: "서류를 정리하세요." }] },
  { word: "archive", pronunciation: "ˈɑrkaɪv", meaning: "보관하다", examples: [{ sentence: "Archive old emails.", translation: "오래된 이메일을 보관하세요." }] },
  { word: "store", pronunciation: "stɔr", meaning: "저장하다", examples: [{ sentence: "Store food properly.", translation: "음식을 제대로 보관하세요." }] },
  { word: "retrieve", pronunciation: "rɪˈtriv", meaning: "회수하다", examples: [{ sentence: "Retrieve the data.", translation: "데이터를 회수하세요." }] },
  { word: "fetch", pronunciation: "fetʃ", meaning: "가져오다", examples: [{ sentence: "Fetch me a glass of water.", translation: "물 한 잔 가져다줘." }] },

  { word: "summon", pronunciation: "ˈsʌmən", meaning: "소환하다", examples: [{ sentence: "He was summoned to court.", translation: "그는 법정에 소환됐다." }] },
  { word: "convene", pronunciation: "kənˈvin", meaning: "소집하다", examples: [{ sentence: "The committee convened.", translation: "위원회가 소집됐다." }] },
  { word: "adjourn", pronunciation: "əˈdʒɜrn", meaning: "휴정하다", examples: [{ sentence: "The meeting was adjourned.", translation: "회의가 휴회됐다." }] },
  { word: "postpone", pronunciation: "poʊstˈpoʊn", meaning: "연기하다", examples: [{ sentence: "We postponed the trip.", translation: "여행을 연기했다." }] },
  { word: "defer", pronunciation: "dɪˈfɜr", meaning: "연기하다", examples: [{ sentence: "They deferred the decision.", translation: "그들은 결정을 연기했다." }] },
  { word: "delay", pronunciation: "dɪˈleɪ", meaning: "지연시키다", examples: [{ sentence: "Don't delay any longer.", translation: "더 이상 미루지 마." }] },
  { word: "reschedule", pronunciation: "riˈskedʒul", meaning: "일정을 변경하다", examples: [{ sentence: "Can we reschedule?", translation: "일정을 바꿀 수 있을까요?" }] },
  { word: "expedite", pronunciation: "ˈekspɪdaɪt", meaning: "촉진하다", examples: [{ sentence: "Expedite the process.", translation: "과정을 촉진하세요." }] },
  { word: "accelerate", pronunciation: "əkˈseləreɪt", meaning: "가속하다", examples: [{ sentence: "The car accelerated.", translation: "차가 가속했다." }] },
  { word: "hasten", pronunciation: "ˈheɪsən", meaning: "서두르다", examples: [{ sentence: "Hasten your steps.", translation: "발걸음을 서둘러라." }] },

  { word: "linger", pronunciation: "ˈlɪŋgər", meaning: "머무르다", examples: [{ sentence: "Don't linger too long.", translation: "너무 오래 머물지 마." }] },
  { word: "loiter", pronunciation: "ˈlɔɪtər", meaning: "어슬렁거리다", examples: [{ sentence: "No loitering allowed.", translation: "배회 금지." }] },
  { word: "dwell", pronunciation: "dwel", meaning: "거주하다", examples: [{ sentence: "They dwell in the mountains.", translation: "그들은 산에 거주한다." }] },
  { word: "reside", pronunciation: "rɪˈzaɪd", meaning: "거주하다", examples: [{ sentence: "Where do you reside?", translation: "어디에 사세요?" }] },
  { word: "inhabit", pronunciation: "ɪnˈhæbɪt", meaning: "서식하다", examples: [{ sentence: "Fish inhabit the lake.", translation: "물고기가 호수에 서식한다." }] },
  { word: "occupy", pronunciation: "ˈɑkjəpaɪ", meaning: "점유하다", examples: [{ sentence: "The seat is occupied.", translation: "자리가 차 있습니다." }] },
  { word: "vacate", pronunciation: "ˈveɪkeɪt", meaning: "비우다", examples: [{ sentence: "Please vacate the premises.", translation: "구내를 비워주세요." }] },
  { word: "evacuate", pronunciation: "ɪˈvækjueɪt", meaning: "대피시키다", examples: [{ sentence: "Evacuate the building.", translation: "건물에서 대피하세요." }] },
  { word: "migrate", pronunciation: "ˈmaɪgreɪt", meaning: "이주하다", examples: [{ sentence: "Birds migrate south.", translation: "새들이 남쪽으로 이주한다." }] },
  { word: "emigrate", pronunciation: "ˈemɪgreɪt", meaning: "이민 가다", examples: [{ sentence: "They emigrated to Canada.", translation: "그들은 캐나다로 이민 갔다." }] },

  { word: "immigrate", pronunciation: "ˈɪmɪgreɪt", meaning: "이민 오다", examples: [{ sentence: "My family immigrated here.", translation: "우리 가족은 여기로 이민 왔다." }] },
  { word: "relocate", pronunciation: "riˈloʊkeɪt", meaning: "이전하다", examples: [{ sentence: "The company relocated.", translation: "회사가 이전했다." }] },
  { word: "transplant", pronunciation: "trænsˈplænt", meaning: "이식하다", examples: [{ sentence: "They transplanted the organ.", translation: "그들은 장기를 이식했다." }] },
  { word: "transfer", pronunciation: "trænsˈfɜr", meaning: "전송하다, 전근하다", examples: [{ sentence: "Transfer the files.", translation: "파일을 전송하세요." }] },
  { word: "transmit", pronunciation: "trænsˈmɪt", meaning: "전송하다", examples: [{ sentence: "The radio transmits signals.", translation: "라디오가 신호를 전송한다." }] },
  { word: "broadcast", pronunciation: "ˈbrɔdkæst", meaning: "방송하다", examples: [{ sentence: "They broadcast the news.", translation: "그들은 뉴스를 방송했다." }] },
  { word: "relay", pronunciation: "rɪˈleɪ", meaning: "중계하다", examples: [{ sentence: "Relay the message.", translation: "메시지를 전달하세요." }] },
  { word: "circulate", pronunciation: "ˈsɜrkjəleɪt", meaning: "순환하다", examples: [{ sentence: "Blood circulates through the body.", translation: "혈액이 몸을 순환한다." }] },
  { word: "rotate", pronunciation: "ˈroʊteɪt", meaning: "회전하다", examples: [{ sentence: "Rotate the image.", translation: "이미지를 회전하세요." }] },
  { word: "revolve", pronunciation: "rɪˈvɑlv", meaning: "회전하다", examples: [{ sentence: "Earth revolves around the sun.", translation: "지구는 태양 주위를 돈다." }] },

  { word: "spin", pronunciation: "spɪn", meaning: "돌다", examples: [{ sentence: "The wheel spins.", translation: "바퀴가 돈다." }] },
  { word: "twist", pronunciation: "twɪst", meaning: "비틀다", examples: [{ sentence: "Twist the cap off.", translation: "뚜껑을 돌려 여세요." }] },
  { word: "bend", pronunciation: "bend", meaning: "구부리다", examples: [{ sentence: "Bend your knees.", translation: "무릎을 구부리세요." }] },
  { word: "fold", pronunciation: "foʊld", meaning: "접다", examples: [{ sentence: "Fold the paper in half.", translation: "종이를 반으로 접으세요." }] },
  { word: "unfold", pronunciation: "ʌnˈfoʊld", meaning: "펼치다", examples: [{ sentence: "The story unfolds.", translation: "이야기가 펼쳐진다." }] },
  { word: "wrap", pronunciation: "ræp", meaning: "싸다", examples: [{ sentence: "Wrap the gift.", translation: "선물을 포장하세요." }] },
  { word: "unwrap", pronunciation: "ʌnˈræp", meaning: "풀다", examples: [{ sentence: "Unwrap the package.", translation: "포장을 푸세요." }] },
  { word: "seal", pronunciation: "sil", meaning: "봉인하다", examples: [{ sentence: "Seal the envelope.", translation: "봉투를 봉하세요." }] },
  { word: "enclose", pronunciation: "ɪnˈkloʊz", meaning: "동봉하다", examples: [{ sentence: "I enclosed a check.", translation: "수표를 동봉했습니다." }] },
  { word: "attach", pronunciation: "əˈtætʃ", meaning: "첨부하다", examples: [{ sentence: "Attach the file.", translation: "파일을 첨부하세요." }] },

  { word: "detach", pronunciation: "dɪˈtætʃ", meaning: "분리하다", examples: [{ sentence: "Detach the cable.", translation: "케이블을 분리하세요." }] },
  { word: "disconnect", pronunciation: "ˌdɪskəˈnekt", meaning: "연결을 끊다", examples: [{ sentence: "Disconnect the device.", translation: "기기 연결을 끊으세요." }] },
  { word: "link", pronunciation: "lɪŋk", meaning: "연결하다", examples: [{ sentence: "Link the two accounts.", translation: "두 계정을 연결하세요." }] },
  { word: "unlink", pronunciation: "ʌnˈlɪŋk", meaning: "연결을 해제하다", examples: [{ sentence: "Unlink your account.", translation: "계정 연결을 해제하세요." }] },
  { word: "bind", pronunciation: "baɪnd", meaning: "묶다", examples: [{ sentence: "Bind the papers together.", translation: "서류를 함께 묶으세요." }] },
  { word: "fasten", pronunciation: "ˈfæsən", meaning: "고정하다", examples: [{ sentence: "Fasten your seatbelt.", translation: "안전벨트를 매세요." }] },
  { word: "tighten", pronunciation: "ˈtaɪtən", meaning: "조이다", examples: [{ sentence: "Tighten the screw.", translation: "나사를 조이세요." }] },
  { word: "loosen", pronunciation: "ˈlusən", meaning: "느슨하게 하다", examples: [{ sentence: "Loosen your tie.", translation: "넥타이를 느슨하게 해." }] },
  { word: "squeeze", pronunciation: "skwiz", meaning: "짜다, 쥐어짜다", examples: [{ sentence: "Squeeze the lemon.", translation: "레몬을 짜세요." }] },
  { word: "compress", pronunciation: "kəmˈpres", meaning: "압축하다", examples: [{ sentence: "Compress the file.", translation: "파일을 압축하세요." }] },

  { word: "expand", pronunciation: "ɪkˈspænd", meaning: "확장하다", examples: [{ sentence: "Expand your horizons.", translation: "시야를 넓히세요." }] },
  { word: "extend", pronunciation: "ɪkˈstend", meaning: "연장하다", examples: [{ sentence: "Extend the deadline.", translation: "마감일을 연장하세요." }] },
  { word: "prolong", pronunciation: "prəˈlɔŋ", meaning: "연장하다", examples: [{ sentence: "Don't prolong the meeting.", translation: "회의를 길게 끌지 마세요." }] },
  { word: "shorten", pronunciation: "ˈʃɔrtən", meaning: "줄이다", examples: [{ sentence: "Shorten the dress.", translation: "드레스를 줄이세요." }] },
  { word: "abbreviate", pronunciation: "əˈbriviˌeɪt", meaning: "줄여쓰다", examples: [{ sentence: "Abbreviate the word.", translation: "단어를 줄여 쓰세요." }] },
  { word: "condense", pronunciation: "kənˈdens", meaning: "요약하다", examples: [{ sentence: "Condense the report.", translation: "보고서를 요약하세요." }] },
  { word: "summarize", pronunciation: "ˈsʌməraɪz", meaning: "요약하다", examples: [{ sentence: "Summarize the main points.", translation: "주요 요점을 요약하세요." }] },
  { word: "paraphrase", pronunciation: "ˈpærəfreɪz", meaning: "바꿔 말하다", examples: [{ sentence: "Paraphrase the sentence.", translation: "문장을 바꿔 말하세요." }] },
  { word: "quote", pronunciation: "kwoʊt", meaning: "인용하다", examples: [{ sentence: "Don't quote me on that.", translation: "그건 인용하지 마." }] },
  { word: "cite", pronunciation: "saɪt", meaning: "인용하다", examples: [{ sentence: "Cite your sources.", translation: "출처를 인용하세요." }] },
  { word: "reference", pronunciation: "ˈrefərəns", meaning: "참조하다", examples: [{ sentence: "Reference the manual.", translation: "설명서를 참조하세요." }] },

  { word: "consult", pronunciation: "kənˈsʌlt", meaning: "상담하다", examples: [{ sentence: "Consult a doctor.", translation: "의사와 상담하세요." }] },
  { word: "advise", pronunciation: "ədˈvaɪz", meaning: "조언하다", examples: [{ sentence: "I advise caution.", translation: "주의를 권합니다." }] },
  { word: "recommend", pronunciation: "ˌrekəˈmend", meaning: "추천하다", examples: [{ sentence: "I recommend this book.", translation: "이 책을 추천합니다." }] },
  { word: "suggest", pronunciation: "səgˈdʒest", meaning: "제안하다", examples: [{ sentence: "I suggest we leave.", translation: "떠나는 게 좋겠어요." }] },
  { word: "propose", pronunciation: "prəˈpoʊz", meaning: "제안하다", examples: [{ sentence: "He proposed a plan.", translation: "그가 계획을 제안했다." }] },
  { word: "nominate", pronunciation: "ˈnɑməneɪt", meaning: "지명하다", examples: [{ sentence: "She was nominated for the award.", translation: "그녀가 상 후보로 지명됐다." }] },
  { word: "elect", pronunciation: "ɪˈlekt", meaning: "선출하다", examples: [{ sentence: "They elected a new president.", translation: "그들은 새 회장을 선출했다." }] },
  { word: "appoint", pronunciation: "əˈpɔɪnt", meaning: "임명하다", examples: [{ sentence: "She was appointed CEO.", translation: "그녀가 CEO로 임명됐다." }] },
  { word: "designate", pronunciation: "ˈdezɪgneɪt", meaning: "지정하다", examples: [{ sentence: "Designate a meeting room.", translation: "회의실을 지정하세요." }] },
  { word: "authorize", pronunciation: "ˈɔθəraɪz", meaning: "허가하다", examples: [{ sentence: "I'm not authorized to do that.", translation: "그렇게 할 권한이 없어요." }] },
  { word: "certify", pronunciation: "ˈsɜrtɪfaɪ", meaning: "인증하다", examples: [{ sentence: "The document was certified.", translation: "문서가 인증됐다." }] },
  { word: "verify", pronunciation: "ˈverɪfaɪ", meaning: "확인하다", examples: [{ sentence: "Please verify your email.", translation: "이메일을 확인해 주세요." }] },
  { word: "validate", pronunciation: "ˈvælɪdeɪt", meaning: "검증하다", examples: [{ sentence: "Validate your ticket.", translation: "표를 검증하세요." }] },
  { word: "authenticate", pronunciation: "ɔˈθentɪkeɪt", meaning: "인증하다", examples: [{ sentence: "Authenticate your identity.", translation: "신원을 인증하세요." }] },
  { word: "confirm", pronunciation: "kənˈfɜrm", meaning: "확인하다", examples: [{ sentence: "Please confirm your reservation.", translation: "예약을 확인해 주세요." }] },
  { word: "affirm", pronunciation: "əˈfɜrm", meaning: "확인하다, 긍정하다", examples: [{ sentence: "He affirmed his commitment.", translation: "그는 약속을 확인했다." }] },
  { word: "ratify", pronunciation: "ˈrætɪfaɪ", meaning: "비준하다", examples: [{ sentence: "They ratified the treaty.", translation: "그들은 조약을 비준했다." }] },
  { word: "sanction", pronunciation: "ˈsæŋkʃən", meaning: "승인하다, 제재하다", examples: [{ sentence: "The plan was sanctioned.", translation: "계획이 승인됐다." }] },
  { word: "endorse", pronunciation: "ɪnˈdɔrs", meaning: "지지하다", examples: [{ sentence: "She endorsed the candidate.", translation: "그녀는 후보를 지지했다." }] },
  { word: "sponsor", pronunciation: "ˈspɑnsər", meaning: "후원하다", examples: [{ sentence: "They sponsor the event.", translation: "그들이 행사를 후원한다." }] },
  { word: "fund", pronunciation: "fʌnd", meaning: "자금을 지원하다", examples: [{ sentence: "The project is funded by the government.", translation: "프로젝트는 정부가 자금 지원한다." }] },
  { word: "finance", pronunciation: "fɪˈnæns", meaning: "자금을 조달하다", examples: [{ sentence: "We financed the expansion.", translation: "우리가 확장에 자금을 조달했다." }] },
  { word: "invest", pronunciation: "ɪnˈvest", meaning: "투자하다", examples: [{ sentence: "Invest wisely.", translation: "현명하게 투자하세요." }] },
  { word: "subsidize", pronunciation: "ˈsʌbsɪdaɪz", meaning: "보조금을 주다", examples: [{ sentence: "The government subsidizes farmers.", translation: "정부가 농민들에게 보조금을 준다." }] }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const verb of moreVerbs) {
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
