const fs = require('fs');
const path = require('path');

// 기존 파일 읽기
const filePath = path.join(__dirname, '../data/phrasalVerbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 기존 단어 목록
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 구동사 수:', existingWords.size);

// 추가 구동사 (142개 이상)
const morePhrasalVerbs = [
  // 추가 비즈니스 구동사
  { word: "sign off on", pronunciation: "saɪn ɔf ɑn", subcategory: "비즈니스 구동사", meaning: "승인하다", examples: [{ sentence: "The manager signed off on the budget.", translation: "매니저가 예산을 승인했어요." }] },
  { word: "weigh in", pronunciation: "weɪ ɪn", subcategory: "비즈니스 구동사", meaning: "의견을 내다", examples: [{ sentence: "Would you like to weigh in on this?", translation: "이 건에 대해 의견 주시겠어요?" }] },
  { word: "zero in on", pronunciation: "ˈzɪroʊ ɪn ɑn", subcategory: "비즈니스 구동사", meaning: "집중하다", examples: [{ sentence: "Let's zero in on the main issue.", translation: "핵심 문제에 집중합시다." }] },
  { word: "lock in", pronunciation: "lɑk ɪn", subcategory: "비즈니스 구동사", meaning: "확정하다", examples: [{ sentence: "We locked in the price.", translation: "가격을 확정했어요." }] },
  { word: "flesh out", pronunciation: "fleʃ aʊt", subcategory: "비즈니스 구동사", meaning: "구체화하다", examples: [{ sentence: "We need to flesh out this proposal.", translation: "이 제안서를 구체화해야 해요." }] },
  { word: "think through", pronunciation: "θɪŋk θru", subcategory: "비즈니스 구동사", meaning: "숙고하다", examples: [{ sentence: "Think it through before deciding.", translation: "결정하기 전에 숙고하세요." }] },
  { word: "thrash out", pronunciation: "θræʃ aʊt", subcategory: "비즈니스 구동사", meaning: "논의 끝에 결론 내다", examples: [{ sentence: "We thrashed out the details.", translation: "세부 사항을 논의 끝에 정했어요." }] },
  { word: "farm out", pronunciation: "fɑrm aʊt", subcategory: "비즈니스 구동사", meaning: "외주를 주다", examples: [{ sentence: "They farmed out the project.", translation: "프로젝트를 외주 줬어요." }] },
  { word: "tighten up", pronunciation: "ˈtaɪtən ʌp", subcategory: "비즈니스 구동사", meaning: "단속을 강화하다", examples: [{ sentence: "We need to tighten up security.", translation: "보안을 강화해야 해요." }] },
  { word: "shore up", pronunciation: "ʃɔr ʌp", subcategory: "비즈니스 구동사", meaning: "보강하다", examples: [{ sentence: "We need to shore up our finances.", translation: "재정을 보강해야 해요." }] },

  // 추가 감정/관계 구동사
  { word: "reach out", pronunciation: "ritʃ aʊt", subcategory: "관계 구동사", meaning: "연락하다", examples: [{ sentence: "Feel free to reach out anytime.", translation: "언제든 연락하세요." }] },
  { word: "open up to", pronunciation: "ˈoʊpən ʌp tu", subcategory: "관계 구동사", meaning: "마음을 열다", examples: [{ sentence: "She opened up to me about her problems.", translation: "그녀가 자신의 문제에 대해 마음을 열었어요." }] },
  { word: "hang in", pronunciation: "hæŋ ɪn", subcategory: "감정 구동사", meaning: "버티다", examples: [{ sentence: "Hang in there!", translation: "버텨!" }] },
  { word: "perk up", pronunciation: "pɜrk ʌp", subcategory: "감정 구동사", meaning: "기운을 내다", examples: [{ sentence: "Coffee perked me up.", translation: "커피가 기운 나게 해줬어요." }] },
  { word: "mope around", pronunciation: "moʊp əˈraʊnd", subcategory: "감정 구동사", meaning: "우울하게 지내다", examples: [{ sentence: "Stop moping around.", translation: "우울하게 지내지 마." }] },
  { word: "brood over", pronunciation: "brud ˈoʊvər", subcategory: "감정 구동사", meaning: "곰곰이 생각하다", examples: [{ sentence: "Don't brood over it.", translation: "그것에 대해 곰곰이 생각하지 마." }] },
  { word: "liven up", pronunciation: "ˈlaɪvən ʌp", subcategory: "감정 구동사", meaning: "활기를 띠다", examples: [{ sentence: "The party livened up after midnight.", translation: "자정 후에 파티가 활기를 띠었어요." }] },
  { word: "live up to", pronunciation: "lɪv ʌp tu", subcategory: "관계 구동사", meaning: "기대에 부응하다", examples: [{ sentence: "He lived up to expectations.", translation: "그는 기대에 부응했어요." }] },
  { word: "miss out on", pronunciation: "mɪs aʊt ɑn", subcategory: "감정 구동사", meaning: "놓치다", examples: [{ sentence: "Don't miss out on this opportunity.", translation: "이 기회를 놓치지 마세요." }] },
  { word: "own up to", pronunciation: "oʊn ʌp tu", subcategory: "관계 구동사", meaning: "~을 인정하다", examples: [{ sentence: "Own up to your mistakes.", translation: "실수를 인정해." }] },

  // 추가 일상 구동사
  { word: "rustle up", pronunciation: "ˈrʌsəl ʌp", subcategory: "일상 구동사", meaning: "급히 마련하다", examples: [{ sentence: "I'll rustle up some lunch.", translation: "점심을 급히 마련할게요." }] },
  { word: "polish off", pronunciation: "ˈpɑlɪʃ ɔf", subcategory: "일상 구동사", meaning: "재빨리 끝내다", examples: [{ sentence: "We polished off the cake.", translation: "케이크를 다 해치웠어요." }] },
  { word: "knock back", pronunciation: "nɑk bæk", subcategory: "일상 구동사", meaning: "벌컥 마시다", examples: [{ sentence: "He knocked back a few drinks.", translation: "그는 술을 몇 잔 벌컥 마셨어요." }] },
  { word: "chow down", pronunciation: "tʃaʊ daʊn", subcategory: "일상 구동사", meaning: "먹다", examples: [{ sentence: "Let's chow down!", translation: "먹자!" }] },
  { word: "tuck in", pronunciation: "tʌk ɪn", subcategory: "일상 구동사", meaning: "맛있게 먹다", examples: [{ sentence: "Tuck in, everyone!", translation: "다들 맛있게 드세요!" }] },
  { word: "turn in", pronunciation: "tɜrn ɪn", subcategory: "일상 구동사", meaning: "잠자리에 들다", examples: [{ sentence: "I'm going to turn in early.", translation: "일찍 잠자리에 들 거예요." }] },
  { word: "lie in", pronunciation: "laɪ ɪn", subcategory: "일상 구동사", meaning: "늦잠 자다", examples: [{ sentence: "I love to lie in on weekends.", translation: "주말에 늦잠 자는 게 좋아요." }] },
  { word: "zonk out", pronunciation: "zɑŋk aʊt", subcategory: "일상 구동사", meaning: "곯아떨어지다", examples: [{ sentence: "I zonked out on the couch.", translation: "소파에서 곯아떨어졌어요." }] },
  { word: "sober up", pronunciation: "ˈsoʊbər ʌp", subcategory: "일상 구동사", meaning: "술이 깨다", examples: [{ sentence: "Drink some coffee to sober up.", translation: "술 깨려면 커피 좀 마셔." }] },
  { word: "dry out", pronunciation: "draɪ aʊt", subcategory: "일상 구동사", meaning: "말리다, 금주하다", examples: [{ sentence: "Let the clothes dry out.", translation: "옷을 말려요." }] },

  // 추가 이동 구동사
  { word: "race off", pronunciation: "reɪs ɔf", subcategory: "이동 구동사", meaning: "급히 떠나다", examples: [{ sentence: "She raced off to the meeting.", translation: "그녀는 회의에 급히 갔어요." }] },
  { word: "whizz by", pronunciation: "wɪz baɪ", subcategory: "이동 구동사", meaning: "쌩 지나가다", examples: [{ sentence: "Cars whizzed by us.", translation: "차들이 우리 옆을 쌩 지나갔어요." }] },
  { word: "trudge along", pronunciation: "trʌdʒ əˈlɔŋ", subcategory: "이동 구동사", meaning: "터벅터벅 걷다", examples: [{ sentence: "We trudged along in the snow.", translation: "눈 속을 터벅터벅 걸었어요." }] },
  { word: "stroll around", pronunciation: "stroʊl əˈraʊnd", subcategory: "이동 구동사", meaning: "산책하다", examples: [{ sentence: "We strolled around the park.", translation: "공원을 산책했어요." }] },
  { word: "wander off", pronunciation: "ˈwɑndər ɔf", subcategory: "이동 구동사", meaning: "정처없이 가다", examples: [{ sentence: "The child wandered off.", translation: "아이가 어디론가 가버렸어요." }] },
  { word: "sneak in", pronunciation: "snik ɪn", subcategory: "이동 구동사", meaning: "몰래 들어오다", examples: [{ sentence: "I sneaked in late.", translation: "늦게 몰래 들어왔어요." }] },
  { word: "sneak out", pronunciation: "snik aʊt", subcategory: "이동 구동사", meaning: "몰래 나가다", examples: [{ sentence: "He sneaked out of the party.", translation: "그는 파티에서 몰래 빠져나왔어요." }] },
  { word: "creep up on", pronunciation: "krip ʌp ɑn", subcategory: "이동 구동사", meaning: "몰래 다가가다", examples: [{ sentence: "Don't creep up on me like that!", translation: "그렇게 몰래 다가오지 마!" }] },
  { word: "dash off", pronunciation: "dæʃ ɔf", subcategory: "이동 구동사", meaning: "급히 가다", examples: [{ sentence: "I have to dash off now.", translation: "지금 급히 가야 해요." }] },
  { word: "zoom off", pronunciation: "zum ɔf", subcategory: "이동 구동사", meaning: "쏜살같이 가다", examples: [{ sentence: "The car zoomed off.", translation: "차가 쏜살같이 갔어요." }] },

  // 추가 학습 구동사
  { word: "hand in", pronunciation: "hænd ɪn", subcategory: "학습 구동사", meaning: "제출하다", examples: [{ sentence: "Hand in your homework.", translation: "숙제를 제출하세요." }] },
  { word: "hand back", pronunciation: "hænd bæk", subcategory: "학습 구동사", meaning: "돌려주다", examples: [{ sentence: "The teacher handed back the tests.", translation: "선생님이 시험지를 돌려줬어요." }] },
  { word: "get through", pronunciation: "get θru", subcategory: "학습 구동사", meaning: "끝마치다", examples: [{ sentence: "I got through the entire book.", translation: "책 전체를 끝마쳤어요." }] },
  { word: "flunk out", pronunciation: "flʌŋk aʊt", subcategory: "학습 구동사", meaning: "낙제하다", examples: [{ sentence: "He flunked out of college.", translation: "그는 대학에서 낙제했어요." }] },
  { word: "breeze through", pronunciation: "briz θru", subcategory: "학습 구동사", meaning: "쉽게 통과하다", examples: [{ sentence: "She breezed through the exam.", translation: "그녀는 시험을 쉽게 통과했어요." }] },
  { word: "scrape by", pronunciation: "skreɪp baɪ", subcategory: "학습 구동사", meaning: "간신히 통과하다", examples: [{ sentence: "I scraped by with a C.", translation: "C로 간신히 통과했어요." }] },
  { word: "muddle through", pronunciation: "ˈmʌdəl θru", subcategory: "학습 구동사", meaning: "어떻게든 해내다", examples: [{ sentence: "We muddled through somehow.", translation: "어떻게든 해냈어요." }] },
  { word: "touch on", pronunciation: "tʌtʃ ɑn", subcategory: "학습 구동사", meaning: "간략히 다루다", examples: [{ sentence: "The lecture touched on AI.", translation: "강의에서 AI를 간략히 다뤘어요." }] },
  { word: "pick up on", pronunciation: "pɪk ʌp ɑn", subcategory: "학습 구동사", meaning: "알아채다", examples: [{ sentence: "I picked up on the hint.", translation: "힌트를 알아챘어요." }] },
  { word: "zone out", pronunciation: "zoʊn aʊt", subcategory: "학습 구동사", meaning: "멍해지다", examples: [{ sentence: "I zoned out during class.", translation: "수업 중에 멍해졌어요." }] },

  // 추가 건강 구동사
  { word: "work off", pronunciation: "wɜrk ɔf", subcategory: "운동 구동사", meaning: "운동으로 빼다", examples: [{ sentence: "I need to work off these calories.", translation: "이 칼로리를 운동으로 빼야 해요." }] },
  { word: "pump up", pronunciation: "pʌmp ʌp", subcategory: "운동 구동사", meaning: "근육을 키우다", examples: [{ sentence: "He's pumping up at the gym.", translation: "그는 체육관에서 근육을 키우고 있어요." }] },
  { word: "stretch out", pronunciation: "stretʃ aʊt", subcategory: "운동 구동사", meaning: "스트레칭하다", examples: [{ sentence: "Stretch out before running.", translation: "달리기 전에 스트레칭해요." }] },
  { word: "shake off", pronunciation: "ʃeɪk ɔf", subcategory: "건강 구동사", meaning: "떨쳐내다", examples: [{ sentence: "I can't shake off this cold.", translation: "이 감기를 떨쳐낼 수가 없어요." }] },
  { word: "lay up", pronunciation: "leɪ ʌp", subcategory: "건강 구동사", meaning: "누워있게 하다", examples: [{ sentence: "The flu laid me up for a week.", translation: "독감 때문에 일주일 동안 누워 있었어요." }] },
  { word: "pep up", pronunciation: "pep ʌp", subcategory: "건강 구동사", meaning: "기운 나게 하다", examples: [{ sentence: "This drink will pep you up.", translation: "이 음료가 기운 나게 해줄 거예요." }] },
  { word: "shape up", pronunciation: "ʃeɪp ʌp", subcategory: "건강 구동사", meaning: "몸매를 가꾸다", examples: [{ sentence: "I need to shape up.", translation: "몸매를 가꿔야 해요." }] },
  { word: "keel over", pronunciation: "kil ˈoʊvər", subcategory: "건강 구동사", meaning: "쓰러지다", examples: [{ sentence: "He keeled over from exhaustion.", translation: "그는 지쳐서 쓰러졌어요." }] },
  { word: "black out", pronunciation: "blæk aʊt", subcategory: "건강 구동사", meaning: "기절하다", examples: [{ sentence: "I blacked out for a moment.", translation: "잠깐 기절했어요." }] },
  { word: "burn off", pronunciation: "bɜrn ɔf", subcategory: "운동 구동사", meaning: "태우다", examples: [{ sentence: "Running burns off fat.", translation: "달리기는 지방을 태워요." }] },

  // 추가 의사소통 구동사
  { word: "hear out", pronunciation: "hɪr aʊt", subcategory: "의사소통 구동사", meaning: "끝까지 듣다", examples: [{ sentence: "Please hear me out.", translation: "제 말 끝까지 들어주세요." }] },
  { word: "talk down to", pronunciation: "tɔk daʊn tu", subcategory: "의사소통 구동사", meaning: "깔보듯 말하다", examples: [{ sentence: "Don't talk down to me.", translation: "나를 깔보듯 말하지 마." }] },
  { word: "speak out", pronunciation: "spik aʊt", subcategory: "의사소통 구동사", meaning: "목소리를 높이다", examples: [{ sentence: "She spoke out against injustice.", translation: "그녀는 불의에 목소리를 높였어요." }] },
  { word: "shout down", pronunciation: "ʃaʊt daʊn", subcategory: "의사소통 구동사", meaning: "야유하다", examples: [{ sentence: "The crowd shouted him down.", translation: "군중이 그를 야유했어요." }] },
  { word: "run down", pronunciation: "rʌn daʊn", subcategory: "의사소통 구동사", meaning: "헐뜯다", examples: [{ sentence: "Stop running me down.", translation: "나를 헐뜯지 마." }] },
  { word: "play down", pronunciation: "pleɪ daʊn", subcategory: "의사소통 구동사", meaning: "축소하다", examples: [{ sentence: "He played down his role.", translation: "그는 자신의 역할을 축소했어요." }] },
  { word: "play up", pronunciation: "pleɪ ʌp", subcategory: "의사소통 구동사", meaning: "과장하다", examples: [{ sentence: "The media played up the story.", translation: "언론이 그 이야기를 과장했어요." }] },
  { word: "tip off", pronunciation: "tɪp ɔf", subcategory: "의사소통 구동사", meaning: "정보를 흘리다", examples: [{ sentence: "Someone tipped off the police.", translation: "누군가 경찰에 정보를 흘렸어요." }] },
  { word: "lash out at", pronunciation: "læʃ aʊt æt", subcategory: "의사소통 구동사", meaning: "맹비난하다", examples: [{ sentence: "She lashed out at the critics.", translation: "그녀가 비평가들을 맹비난했어요." }] },
  { word: "brush up", pronunciation: "brʌʃ ʌp", subcategory: "의사소통 구동사", meaning: "복습하다", examples: [{ sentence: "I need to brush up my English.", translation: "영어를 복습해야 해요." }] },

  // 추가 IT 구동사
  { word: "freeze up", pronunciation: "friz ʌp", subcategory: "IT 구동사", meaning: "멈추다", examples: [{ sentence: "My computer froze up.", translation: "컴퓨터가 멈췄어요." }] },
  { word: "crash", pronunciation: "kræʃ", subcategory: "IT 구동사", meaning: "다운되다", examples: [{ sentence: "The system crashed.", translation: "시스템이 다운됐어요." }] },
  { word: "pop up", pronunciation: "pɑp ʌp", subcategory: "IT 구동사", meaning: "팝업되다", examples: [{ sentence: "A window popped up.", translation: "창이 팝업됐어요." }] },
  { word: "load up", pronunciation: "loʊd ʌp", subcategory: "IT 구동사", meaning: "로딩하다", examples: [{ sentence: "Wait for the page to load up.", translation: "페이지가 로딩될 때까지 기다리세요." }] },
  { word: "hook up", pronunciation: "hʊk ʌp", subcategory: "IT 구동사", meaning: "연결하다", examples: [{ sentence: "Hook up to the WiFi.", translation: "WiFi에 연결하세요." }] },
  { word: "lock out", pronunciation: "lɑk aʊt", subcategory: "IT 구동사", meaning: "잠기다", examples: [{ sentence: "I got locked out of my account.", translation: "계정에서 잠겼어요." }] },
  { word: "filter out", pronunciation: "ˈfɪltər aʊt", subcategory: "IT 구동사", meaning: "걸러내다", examples: [{ sentence: "The spam filter filters out junk mail.", translation: "스팸 필터가 정크 메일을 걸러내요." }] },
  { word: "phase out", pronunciation: "feɪz aʊt", subcategory: "IT 구동사", meaning: "단계적으로 폐지하다", examples: [{ sentence: "They're phasing out the old system.", translation: "구 시스템을 단계적으로 폐지하고 있어요." }] },
  { word: "touch up", pronunciation: "tʌtʃ ʌp", subcategory: "IT 구동사", meaning: "수정하다", examples: [{ sentence: "I need to touch up this photo.", translation: "이 사진을 수정해야 해요." }] },
  { word: "mock up", pronunciation: "mɑk ʌp", subcategory: "IT 구동사", meaning: "모형을 만들다", examples: [{ sentence: "Can you mock up a design?", translation: "디자인 모형을 만들 수 있어요?" }] },

  // 추가 일반 구동사
  { word: "fade away", pronunciation: "feɪd əˈweɪ", subcategory: "일반 구동사", meaning: "사라지다", examples: [{ sentence: "The sound faded away.", translation: "소리가 사라졌어요." }] },
  { word: "peter out", pronunciation: "ˈpitər aʊt", subcategory: "일반 구동사", meaning: "점차 사라지다", examples: [{ sentence: "The conversation petered out.", translation: "대화가 점차 사라졌어요." }] },
  { word: "fizzle out", pronunciation: "ˈfɪzəl aʊt", subcategory: "일반 구동사", meaning: "흐지부지되다", examples: [{ sentence: "Their enthusiasm fizzled out.", translation: "그들의 열정이 흐지부지됐어요." }] },
  { word: "taper off", pronunciation: "ˈteɪpər ɔf", subcategory: "일반 구동사", meaning: "점점 줄다", examples: [{ sentence: "Sales tapered off.", translation: "매출이 점점 줄었어요." }] },
  { word: "level off", pronunciation: "ˈlevəl ɔf", subcategory: "일반 구동사", meaning: "안정되다", examples: [{ sentence: "Prices leveled off.", translation: "가격이 안정됐어요." }] },
  { word: "trail off", pronunciation: "treɪl ɔf", subcategory: "일반 구동사", meaning: "(목소리가) 점점 작아지다", examples: [{ sentence: "Her voice trailed off.", translation: "그녀의 목소리가 점점 작아졌어요." }] },
  { word: "branch off", pronunciation: "bræntʃ ɔf", subcategory: "일반 구동사", meaning: "갈라지다", examples: [{ sentence: "The road branches off here.", translation: "길이 여기서 갈라져요." }] },
  { word: "stem from", pronunciation: "stem frɑm", subcategory: "일반 구동사", meaning: "~에서 비롯되다", examples: [{ sentence: "The problem stems from poor planning.", translation: "문제는 부실한 계획에서 비롯됐어요." }] },
  { word: "spring from", pronunciation: "sprɪŋ frɑm", subcategory: "일반 구동사", meaning: "~에서 나오다", examples: [{ sentence: "Great ideas spring from curiosity.", translation: "위대한 아이디어는 호기심에서 나와요." }] },
  { word: "grow out of", pronunciation: "groʊ aʊt ʌv", subcategory: "일반 구동사", meaning: "~에서 발전하다", examples: [{ sentence: "The project grew out of a simple idea.", translation: "프로젝트는 간단한 아이디어에서 발전했어요." }] },
  { word: "tie in with", pronunciation: "taɪ ɪn wɪð", subcategory: "일반 구동사", meaning: "~와 연결되다", examples: [{ sentence: "This ties in with our goals.", translation: "이것은 우리 목표와 연결돼요." }] },
  { word: "fit in with", pronunciation: "fɪt ɪn wɪð", subcategory: "일반 구동사", meaning: "~와 맞다", examples: [{ sentence: "This fits in with my schedule.", translation: "이것은 제 일정과 맞아요." }] },
  { word: "get away with", pronunciation: "get əˈweɪ wɪð", subcategory: "일반 구동사", meaning: "~을 무사히 넘기다", examples: [{ sentence: "He got away with it.", translation: "그는 무사히 넘겼어요." }] },
  { word: "do away with", pronunciation: "du əˈweɪ wɪð", subcategory: "일반 구동사", meaning: "없애다", examples: [{ sentence: "They did away with the old rules.", translation: "그들은 옛 규칙을 없앴어요." }] },
  { word: "make do with", pronunciation: "meɪk du wɪð", subcategory: "일반 구동사", meaning: "~으로 때우다", examples: [{ sentence: "We'll make do with what we have.", translation: "있는 것으로 때울게요." }] },
  { word: "put up to", pronunciation: "pʊt ʌp tu", subcategory: "일반 구동사", meaning: "~을 부추기다", examples: [{ sentence: "Who put you up to this?", translation: "누가 이걸 시켰어?" }] },
  { word: "stick up for", pronunciation: "stɪk ʌp fɔr", subcategory: "일반 구동사", meaning: "~을 옹호하다", examples: [{ sentence: "Stick up for yourself.", translation: "네 자신을 옹호해." }] },
  { word: "stack up", pronunciation: "stæk ʌp", subcategory: "일반 구동사", meaning: "비교하다", examples: [{ sentence: "How does it stack up against competitors?", translation: "경쟁사와 비교하면 어때요?" }] },
  { word: "measure up", pronunciation: "ˈmeʒər ʌp", subcategory: "일반 구동사", meaning: "기준에 맞다", examples: [{ sentence: "Does he measure up to the job?", translation: "그가 그 일에 적합해요?" }] },
  { word: "add up", pronunciation: "æd ʌp", subcategory: "일반 구동사", meaning: "앞뒤가 맞다", examples: [{ sentence: "Something doesn't add up.", translation: "뭔가 앞뒤가 안 맞아요." }] },
  { word: "wise up", pronunciation: "waɪz ʌp", subcategory: "일반 구동사", meaning: "정신 차리다", examples: [{ sentence: "It's time to wise up.", translation: "정신 차릴 때야." }] },
  { word: "smarten up", pronunciation: "ˈsmɑrtən ʌp", subcategory: "일반 구동사", meaning: "정신 차리다, 단정히 하다", examples: [{ sentence: "Smarten up your appearance.", translation: "외모를 단정히 해." }] },
  { word: "ease up", pronunciation: "iz ʌp", subcategory: "일반 구동사", meaning: "풀어지다, 누그러지다", examples: [{ sentence: "Ease up on her.", translation: "그녀에게 좀 누그러져." }] },
  { word: "let up", pronunciation: "let ʌp", subcategory: "일반 구동사", meaning: "그치다, 줄어들다", examples: [{ sentence: "The rain finally let up.", translation: "마침내 비가 그쳤어요." }] },
  { word: "pipe up", pronunciation: "paɪp ʌp", subcategory: "일반 구동사", meaning: "끼어들어 말하다", examples: [{ sentence: "Someone piped up from the back.", translation: "뒤에서 누군가가 끼어들었어요." }] },
  { word: "crop up", pronunciation: "krɑp ʌp", subcategory: "일반 구동사", meaning: "불쑥 나타나다", examples: [{ sentence: "Problems keep cropping up.", translation: "문제들이 자꾸 불쑥 나타나요." }] },
  { word: "turn up", pronunciation: "tɜrn ʌp", subcategory: "일반 구동사", meaning: "나타나다", examples: [{ sentence: "He turned up unexpectedly.", translation: "그가 예상치 못하게 나타났어요." }] },
  { word: "make out", pronunciation: "meɪk aʊt", subcategory: "일반 구동사", meaning: "이해하다, 알아보다", examples: [{ sentence: "I can't make out what you're saying.", translation: "네가 뭐라는지 이해할 수 없어." }] },
  { word: "work out", pronunciation: "wɜrk aʊt", subcategory: "일반 구동사", meaning: "해결되다, 잘 되다", examples: [{ sentence: "Everything worked out fine.", translation: "모든 게 잘 됐어요." }] },
  { word: "bring off", pronunciation: "brɪŋ ɔf", subcategory: "일반 구동사", meaning: "성공적으로 해내다", examples: [{ sentence: "They brought off a difficult deal.", translation: "그들은 어려운 거래를 성공적으로 해냈어요." }] },
  { word: "pull off", pronunciation: "pʊl ɔf", subcategory: "일반 구동사", meaning: "해내다", examples: [{ sentence: "She pulled off the impossible.", translation: "그녀는 불가능한 것을 해냈어요." }] },
  { word: "carry off", pronunciation: "ˈkæri ɔf", subcategory: "일반 구동사", meaning: "성공시키다", examples: [{ sentence: "He carried off the role brilliantly.", translation: "그는 그 역할을 훌륭하게 해냈어요." }] },
  { word: "see through", pronunciation: "si θru", subcategory: "일반 구동사", meaning: "꿰뚫어 보다", examples: [{ sentence: "I can see through your lies.", translation: "네 거짓말을 꿰뚫어 볼 수 있어." }] },
  { word: "see off", pronunciation: "si ɔf", subcategory: "일반 구동사", meaning: "물리치다", examples: [{ sentence: "We saw off the competition.", translation: "우리는 경쟁을 물리쳤어요." }] },
  { word: "back down", pronunciation: "bæk daʊn", subcategory: "일반 구동사", meaning: "물러서다", examples: [{ sentence: "He refused to back down.", translation: "그는 물러서기를 거부했어요." }] },
  { word: "stand down", pronunciation: "stænd daʊn", subcategory: "일반 구동사", meaning: "사임하다, 물러나다", examples: [{ sentence: "The chairman stood down.", translation: "회장이 물러났어요." }] }
];

// 중복 체크 및 추가
let addedCount = 0;
const startIndex = data.words.length;

for (const pv of morePhrasalVerbs) {
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

// 파일 저장
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
