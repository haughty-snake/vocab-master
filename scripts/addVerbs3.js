const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 동사 수:', existingWords.size);

const finalVerbs = [
  { word: "anticipate", pronunciation: "ænˈtɪsɪpeɪt", meaning: "예상하다", examples: [{ sentence: "I didn't anticipate this.", translation: "이건 예상 못 했어." }] },
  { word: "foresee", pronunciation: "fɔrˈsi", meaning: "예견하다", examples: [{ sentence: "I foresee problems.", translation: "문제가 예상된다." }] },
  { word: "predict", pronunciation: "prɪˈdɪkt", meaning: "예측하다", examples: [{ sentence: "It's hard to predict the future.", translation: "미래를 예측하기 어렵다." }] },
  { word: "forecast", pronunciation: "ˈfɔrkæst", meaning: "예보하다", examples: [{ sentence: "Rain is forecast for tomorrow.", translation: "내일 비가 예보됐다." }] },
  { word: "project", pronunciation: "prəˈdʒekt", meaning: "예상하다, 투영하다", examples: [{ sentence: "We project growth of 5%.", translation: "5% 성장을 예상한다." }] },
  { word: "estimate", pronunciation: "ˈestɪmeɪt", meaning: "추정하다", examples: [{ sentence: "Estimate the cost.", translation: "비용을 추정하세요." }] },
  { word: "calculate", pronunciation: "ˈkælkjəleɪt", meaning: "계산하다", examples: [{ sentence: "Calculate the total.", translation: "합계를 계산하세요." }] },
  { word: "compute", pronunciation: "kəmˈpjut", meaning: "계산하다", examples: [{ sentence: "Computers compute data.", translation: "컴퓨터가 데이터를 계산한다." }] },
  { word: "assess", pronunciation: "əˈses", meaning: "평가하다", examples: [{ sentence: "Assess the situation.", translation: "상황을 평가하세요." }] },
  { word: "evaluate", pronunciation: "ɪˈvæljueɪt", meaning: "평가하다", examples: [{ sentence: "Evaluate the results.", translation: "결과를 평가하세요." }] },

  { word: "appraise", pronunciation: "əˈpreɪz", meaning: "감정하다", examples: [{ sentence: "Appraise the property.", translation: "부동산을 감정하세요." }] },
  { word: "gauge", pronunciation: "geɪdʒ", meaning: "측정하다", examples: [{ sentence: "Gauge the reaction.", translation: "반응을 측정하세요." }] },
  { word: "measure", pronunciation: "ˈmeʒər", meaning: "측정하다", examples: [{ sentence: "Measure the length.", translation: "길이를 측정하세요." }] },
  { word: "weigh", pronunciation: "weɪ", meaning: "무게를 재다", examples: [{ sentence: "Weigh the options.", translation: "선택지를 저울질하세요." }] },
  { word: "quantify", pronunciation: "ˈkwɑntɪfaɪ", meaning: "정량화하다", examples: [{ sentence: "Quantify the benefits.", translation: "이점을 정량화하세요." }] },
  { word: "calibrate", pronunciation: "ˈkælɪbreɪt", meaning: "보정하다", examples: [{ sentence: "Calibrate the instrument.", translation: "기기를 보정하세요." }] },
  { word: "adjust", pronunciation: "əˈdʒʌst", meaning: "조정하다", examples: [{ sentence: "Adjust the volume.", translation: "볼륨을 조정하세요." }] },
  { word: "modify", pronunciation: "ˈmɑdɪfaɪ", meaning: "수정하다", examples: [{ sentence: "Modify the settings.", translation: "설정을 수정하세요." }] },
  { word: "alter", pronunciation: "ˈɔltər", meaning: "변경하다", examples: [{ sentence: "Alter the design.", translation: "디자인을 변경하세요." }] },
  { word: "revise", pronunciation: "rɪˈvaɪz", meaning: "수정하다", examples: [{ sentence: "Revise your essay.", translation: "에세이를 수정하세요." }] },

  { word: "amend", pronunciation: "əˈmend", meaning: "수정하다", examples: [{ sentence: "Amend the contract.", translation: "계약서를 수정하세요." }] },
  { word: "rectify", pronunciation: "ˈrektɪfaɪ", meaning: "바로잡다", examples: [{ sentence: "Rectify the error.", translation: "오류를 바로잡으세요." }] },
  { word: "remedy", pronunciation: "ˈremədi", meaning: "치료하다, 고치다", examples: [{ sentence: "Remedy the situation.", translation: "상황을 바로잡으세요." }] },
  { word: "resolve", pronunciation: "rɪˈzɑlv", meaning: "해결하다", examples: [{ sentence: "Resolve the conflict.", translation: "갈등을 해결하세요." }] },
  { word: "settle", pronunciation: "ˈsetl", meaning: "해결하다, 정착하다", examples: [{ sentence: "Settle the dispute.", translation: "분쟁을 해결하세요." }] },
  { word: "conclude", pronunciation: "kənˈklud", meaning: "결론짓다", examples: [{ sentence: "We concluded the meeting.", translation: "회의를 마쳤다." }] },
  { word: "finalize", pronunciation: "ˈfaɪnəlaɪz", meaning: "마무리하다", examples: [{ sentence: "Finalize the deal.", translation: "거래를 마무리하세요." }] },
  { word: "terminate", pronunciation: "ˈtɜrmɪneɪt", meaning: "종료하다", examples: [{ sentence: "Terminate the contract.", translation: "계약을 종료하세요." }] },
  { word: "cease", pronunciation: "sis", meaning: "중단하다", examples: [{ sentence: "Cease fire!", translation: "사격 중지!" }] },
  { word: "halt", pronunciation: "hɔlt", meaning: "멈추다", examples: [{ sentence: "Halt production.", translation: "생산을 중단하세요." }] },

  { word: "suspend", pronunciation: "səˈspend", meaning: "중단하다, 정학시키다", examples: [{ sentence: "Suspend the program.", translation: "프로그램을 중단하세요." }] },
  { word: "interrupt", pronunciation: "ˌɪntəˈrʌpt", meaning: "중단시키다", examples: [{ sentence: "Don't interrupt me.", translation: "나를 방해하지 마." }] },
  { word: "disrupt", pronunciation: "dɪsˈrʌpt", meaning: "방해하다", examples: [{ sentence: "Don't disrupt the class.", translation: "수업을 방해하지 마." }] },
  { word: "obstruct", pronunciation: "əbˈstrʌkt", meaning: "막다", examples: [{ sentence: "Don't obstruct the view.", translation: "시야를 막지 마세요." }] },
  { word: "hinder", pronunciation: "ˈhɪndər", meaning: "방해하다", examples: [{ sentence: "Nothing will hinder us.", translation: "아무것도 우리를 방해할 수 없다." }] },
  { word: "impede", pronunciation: "ɪmˈpid", meaning: "방해하다", examples: [{ sentence: "Rain impeded progress.", translation: "비가 진행을 방해했다." }] },
  { word: "hamper", pronunciation: "ˈhæmpər", meaning: "방해하다", examples: [{ sentence: "Weather hampered rescue efforts.", translation: "날씨가 구조 작업을 방해했다." }] },
  { word: "thwart", pronunciation: "θwɔrt", meaning: "좌절시키다", examples: [{ sentence: "They thwarted his plans.", translation: "그들은 그의 계획을 좌절시켰다." }] },
  { word: "foil", pronunciation: "fɔɪl", meaning: "좌절시키다", examples: [{ sentence: "Police foiled the robbery.", translation: "경찰이 강도를 저지했다." }] },
  { word: "deter", pronunciation: "dɪˈtɜr", meaning: "단념시키다", examples: [{ sentence: "Nothing deters him.", translation: "아무것도 그를 단념시키지 못한다." }] },

  { word: "discourage", pronunciation: "dɪsˈkɜrɪdʒ", meaning: "낙담시키다", examples: [{ sentence: "Don't be discouraged.", translation: "낙담하지 마." }] },
  { word: "dissuade", pronunciation: "dɪˈsweɪd", meaning: "단념시키다", examples: [{ sentence: "I tried to dissuade him.", translation: "그를 단념시키려 했다." }] },
  { word: "caution", pronunciation: "ˈkɔʃən", meaning: "경고하다", examples: [{ sentence: "I cautioned him about the risks.", translation: "위험에 대해 그에게 경고했다." }] },
  { word: "warn", pronunciation: "wɔrn", meaning: "경고하다", examples: [{ sentence: "I warned you.", translation: "경고했잖아." }] },
  { word: "alert", pronunciation: "əˈlɜrt", meaning: "경보를 울리다", examples: [{ sentence: "Alert the authorities.", translation: "당국에 알리세요." }] },
  { word: "notify", pronunciation: "ˈnoʊtɪfaɪ", meaning: "통지하다", examples: [{ sentence: "Notify me when ready.", translation: "준비되면 알려주세요." }] },
  { word: "inform", pronunciation: "ɪnˈfɔrm", meaning: "알리다", examples: [{ sentence: "Keep me informed.", translation: "계속 알려주세요." }] },
  { word: "brief", pronunciation: "brif", meaning: "브리핑하다", examples: [{ sentence: "Brief the team.", translation: "팀에 브리핑하세요." }] },
  { word: "update", pronunciation: "ʌpˈdeɪt", meaning: "업데이트하다", examples: [{ sentence: "Update the software.", translation: "소프트웨어를 업데이트하세요." }] },
  { word: "upgrade", pronunciation: "ʌpˈgreɪd", meaning: "업그레이드하다", examples: [{ sentence: "Upgrade your plan.", translation: "플랜을 업그레이드하세요." }] },

  { word: "downgrade", pronunciation: "ˈdaʊngreɪd", meaning: "다운그레이드하다", examples: [{ sentence: "Don't downgrade the service.", translation: "서비스를 낮추지 마세요." }] },
  { word: "enhance", pronunciation: "ɪnˈhæns", meaning: "향상시키다", examples: [{ sentence: "Enhance your skills.", translation: "기술을 향상시키세요." }] },
  { word: "boost", pronunciation: "bust", meaning: "높이다", examples: [{ sentence: "Boost your energy.", translation: "에너지를 높이세요." }] },
  { word: "amplify", pronunciation: "ˈæmplɪfaɪ", meaning: "증폭하다", examples: [{ sentence: "Amplify the signal.", translation: "신호를 증폭하세요." }] },
  { word: "magnify", pronunciation: "ˈmægnɪfaɪ", meaning: "확대하다", examples: [{ sentence: "Magnify the image.", translation: "이미지를 확대하세요." }] },
  { word: "enlarge", pronunciation: "ɪnˈlɑrdʒ", meaning: "확대하다", examples: [{ sentence: "Enlarge the photo.", translation: "사진을 확대하세요." }] },
  { word: "minimize", pronunciation: "ˈmɪnɪmaɪz", meaning: "최소화하다", examples: [{ sentence: "Minimize risks.", translation: "위험을 최소화하세요." }] },
  { word: "maximize", pronunciation: "ˈmæksɪmaɪz", meaning: "최대화하다", examples: [{ sentence: "Maximize profits.", translation: "이익을 최대화하세요." }] },
  { word: "optimize", pronunciation: "ˈɑptɪmaɪz", meaning: "최적화하다", examples: [{ sentence: "Optimize performance.", translation: "성능을 최적화하세요." }] },
  { word: "streamline", pronunciation: "ˈstrimlaɪn", meaning: "간소화하다", examples: [{ sentence: "Streamline the process.", translation: "프로세스를 간소화하세요." }] }
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
