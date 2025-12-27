const fs = require('fs');

const filePath = process.argv[2];
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newWords = [
  { word: 'accommodate', pronunciation: '/əˈkɒmədeɪt/', meaning: '수용하다, 편의를 제공하다', example: 'The hotel can accommodate up to 500 guests.', translation: '그 호텔은 최대 500명의 손님을 수용할 수 있어요.' },
  { word: 'acknowledge', pronunciation: '/əkˈnɒlɪdʒ/', meaning: '인정하다, 알리다', example: 'She acknowledged her mistake.', translation: '그녀는 자신의 실수를 인정했어요.' },
  { word: 'acquire', pronunciation: '/əˈkwaɪər/', meaning: '습득하다, 취득하다', example: 'He acquired new skills through training.', translation: '그는 훈련을 통해 새로운 기술을 습득했어요.' },
  { word: 'advocate', pronunciation: '/ˈædvəkeɪt/', meaning: '옹호하다, 지지하다', example: 'She advocates for environmental protection.', translation: '그녀는 환경 보호를 옹호해요.' },
  { word: 'allocate', pronunciation: '/ˈæləkeɪt/', meaning: '할당하다, 배분하다', example: 'We need to allocate resources wisely.', translation: '자원을 현명하게 배분해야 해요.' },
  { word: 'anticipate', pronunciation: '/ænˈtɪsɪpeɪt/', meaning: '예상하다, 기대하다', example: 'I anticipate some difficulties.', translation: '몇 가지 어려움이 예상돼요.' },
  { word: 'articulate', pronunciation: '/ɑːˈtɪkjʊleɪt/', meaning: '명확히 표현하다', example: 'He articulated his thoughts clearly.', translation: '그는 자신의 생각을 명확하게 표현했어요.' },
  { word: 'assimilate', pronunciation: '/əˈsɪmɪleɪt/', meaning: '동화되다, 흡수하다', example: 'It takes time to assimilate new information.', translation: '새로운 정보를 흡수하는 데 시간이 걸려요.' },
  { word: 'attribute', pronunciation: '/əˈtrɪbjuːt/', meaning: '~의 덕분으로 돌리다', example: 'She attributes her success to hard work.', translation: '그녀는 성공을 노력 덕분이라고 해요.' },
  { word: 'authenticate', pronunciation: '/ɔːˈθentɪkeɪt/', meaning: '인증하다, 확인하다', example: 'Please authenticate your identity.', translation: '신원을 인증해 주세요.' },
  { word: 'benchmark', pronunciation: '/ˈbentʃmɑːk/', meaning: '기준점, 벤치마크', example: 'This serves as a benchmark for quality.', translation: '이것은 품질의 기준점 역할을 해요.' },
  { word: 'brainstorm', pronunciation: '/ˈbreɪnstɔːm/', meaning: '브레인스토밍하다', example: 'Let us brainstorm some ideas.', translation: '아이디어를 브레인스토밍해 봐요.' },
  { word: 'calibrate', pronunciation: '/ˈkælɪbreɪt/', meaning: '보정하다, 조정하다', example: 'You need to calibrate the instrument.', translation: '기기를 보정해야 해요.' },
  { word: 'capitalize', pronunciation: '/ˈkæpɪtəlaɪz/', meaning: '활용하다, 대문자로 쓰다', example: 'We should capitalize on this opportunity.', translation: '이 기회를 활용해야 해요.' },
  { word: 'clarify', pronunciation: '/ˈklærɪfaɪ/', meaning: '명확히 하다', example: 'Could you clarify your point?', translation: '요점을 명확히 해 주시겠어요?' },
  { word: 'collaborate', pronunciation: '/kəˈlæbəreɪt/', meaning: '협력하다', example: 'We collaborate with other teams.', translation: '다른 팀들과 협력해요.' },
  { word: 'commemorate', pronunciation: '/kəˈmeməreɪt/', meaning: '기념하다', example: 'We commemorate the anniversary every year.', translation: '매년 기념일을 기념해요.' },
  { word: 'compensate', pronunciation: '/ˈkɒmpenseɪt/', meaning: '보상하다', example: 'The company will compensate for the damage.', translation: '회사가 피해를 보상할 거예요.' },
  { word: 'compile', pronunciation: '/kəmˈpaɪl/', meaning: '편집하다, 모으다', example: 'She compiled a list of contacts.', translation: '그녀는 연락처 목록을 작성했어요.' },
  { word: 'complement', pronunciation: '/ˈkɒmplɪment/', meaning: '보완하다', example: 'The wine complements the meal perfectly.', translation: '와인이 식사를 완벽하게 보완해요.' },
  { word: 'comply', pronunciation: '/kəmˈplaɪ/', meaning: '준수하다, 따르다', example: 'You must comply with the regulations.', translation: '규정을 준수해야 해요.' },
  { word: 'conceive', pronunciation: '/kənˈsiːv/', meaning: '생각해내다, 임신하다', example: 'I cannot conceive of such a thing.', translation: '그런 것은 상상할 수 없어요.' },
  { word: 'condense', pronunciation: '/kənˈdens/', meaning: '압축하다, 요약하다', example: 'Please condense the report to two pages.', translation: '보고서를 두 페이지로 요약해 주세요.' },
  { word: 'confine', pronunciation: '/kənˈfaɪn/', meaning: '제한하다, 가두다', example: 'Please confine your remarks to the topic.', translation: '발언을 주제에 한정해 주세요.' },
  { word: 'consolidate', pronunciation: '/kənˈsɒlɪdeɪt/', meaning: '통합하다, 강화하다', example: 'We need to consolidate our position.', translation: '우리 위치를 강화해야 해요.' },
  { word: 'constitute', pronunciation: '/ˈkɒnstɪtjuːt/', meaning: '구성하다', example: 'Women constitute 60% of our staff.', translation: '여성이 직원의 60%를 구성해요.' },
  { word: 'contemplate', pronunciation: '/ˈkɒntəmpleɪt/', meaning: '숙고하다, 고려하다', example: 'I am contemplating a career change.', translation: '직업 변경을 고려하고 있어요.' },
  { word: 'contradict', pronunciation: '/ˌkɒntrəˈdɪkt/', meaning: '모순되다, 반박하다', example: 'The evidence contradicts his statement.', translation: '증거가 그의 진술과 모순돼요.' },
  { word: 'convey', pronunciation: '/kənˈveɪ/', meaning: '전달하다', example: 'Please convey my regards to her.', translation: '그녀에게 안부를 전해 주세요.' },
  { word: 'correlate', pronunciation: '/ˈkɒrəleɪt/', meaning: '상관관계가 있다', example: 'Stress correlates with health problems.', translation: '스트레스는 건강 문제와 상관관계가 있어요.' },
  { word: 'culminate', pronunciation: '/ˈkʌlmɪneɪt/', meaning: '절정에 달하다', example: 'The festival culminated in a fireworks display.', translation: '축제는 불꽃놀이로 절정에 달했어요.' },
  { word: 'curtail', pronunciation: '/kɜːˈteɪl/', meaning: '축소하다, 삭감하다', example: 'We had to curtail our spending.', translation: '지출을 줄여야 했어요.' },
  { word: 'dedicate', pronunciation: '/ˈdedɪkeɪt/', meaning: '헌신하다, 바치다', example: 'She dedicated her life to teaching.', translation: '그녀는 평생을 교육에 바쳤어요.' },
  { word: 'delegate', pronunciation: '/ˈdelɪɡeɪt/', meaning: '위임하다', example: 'Learn to delegate tasks effectively.', translation: '효과적으로 업무를 위임하는 법을 배우세요.' },
  { word: 'deteriorate', pronunciation: '/dɪˈtɪərɪəreɪt/', meaning: '악화되다', example: 'His health deteriorated rapidly.', translation: '그의 건강이 급격히 악화됐어요.' },
  { word: 'devise', pronunciation: '/dɪˈvaɪz/', meaning: '고안하다', example: 'We need to devise a new strategy.', translation: '새로운 전략을 고안해야 해요.' },
  { word: 'differentiate', pronunciation: '/ˌdɪfəˈrenʃieɪt/', meaning: '구별하다', example: 'Can you differentiate between them?', translation: '둘을 구별할 수 있어요?' },
  { word: 'diminish', pronunciation: '/dɪˈmɪnɪʃ/', meaning: '줄어들다, 감소하다', example: 'The pain will diminish over time.', translation: '통증은 시간이 지나면 줄어들 거예요.' },
  { word: 'disclose', pronunciation: '/dɪsˈkləʊz/', meaning: '공개하다, 밝히다', example: 'He refused to disclose the information.', translation: '그는 정보 공개를 거부했어요.' },
  { word: 'dispatch', pronunciation: '/dɪˈspætʃ/', meaning: '발송하다, 파견하다', example: 'The package was dispatched yesterday.', translation: '소포가 어제 발송됐어요.' },
  { word: 'disseminate', pronunciation: '/dɪˈsemɪneɪt/', meaning: '퍼뜨리다, 보급하다', example: 'They disseminate information quickly.', translation: '그들은 정보를 빠르게 퍼뜨려요.' },
  { word: 'distinguish', pronunciation: '/dɪˈstɪŋɡwɪʃ/', meaning: '구별하다', example: 'Can you distinguish fact from fiction?', translation: '사실과 허구를 구별할 수 있어요?' },
  { word: 'diversify', pronunciation: '/daɪˈvɜːsɪfaɪ/', meaning: '다양화하다', example: 'We should diversify our investments.', translation: '투자를 다양화해야 해요.' },
  { word: 'dominate', pronunciation: '/ˈdɒmɪneɪt/', meaning: '지배하다', example: 'One company dominates the market.', translation: '한 회사가 시장을 지배해요.' },
  { word: 'elaborate', pronunciation: '/ɪˈlæbəreɪt/', meaning: '상세히 설명하다', example: 'Could you elaborate on that point?', translation: '그 점을 자세히 설명해 주시겠어요?' },
  { word: 'elicit', pronunciation: '/ɪˈlɪsɪt/', meaning: '이끌어내다', example: 'The question elicited a strong response.', translation: '그 질문은 강한 반응을 이끌어냈어요.' },
  { word: 'embark', pronunciation: '/ɪmˈbɑːk/', meaning: '착수하다, 승선하다', example: 'We embarked on a new project.', translation: '새로운 프로젝트에 착수했어요.' },
  { word: 'embed', pronunciation: '/ɪmˈbed/', meaning: '삽입하다, 심다', example: 'The video is embedded in the page.', translation: '비디오가 페이지에 삽입되어 있어요.' },
  { word: 'emulate', pronunciation: '/ˈemjʊleɪt/', meaning: '모방하다, 따라하다', example: 'She emulates her role model.', translation: '그녀는 롤모델을 따라해요.' },
  { word: 'encompass', pronunciation: '/ɪnˈkʌmpəs/', meaning: '포함하다, 아우르다', example: 'The course encompasses many topics.', translation: '그 과정은 많은 주제를 포함해요.' }
];

const prefix = data.id || 'vocabulary';
let startId = data.words.length;

// 기존 단어 목록 (중복 체크용)
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
let addedCount = 0;
let skippedCount = 0;

newWords.forEach((w) => {
  if (existingWords.has(w.word.toLowerCase())) {
    skippedCount++;
    console.log('  [중복] ' + w.word);
    return; // 중복 단어 건너뛰기
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

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(filePath + ': ' + data.words.length + '개 (+' + addedCount + ', 중복 ' + skippedCount + '개 제외)');
