const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 동사 수:', data.words.length);

const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

const moreVerbs = [
  // 가정/집안일
  { word: "vacuum", meaning: "진공청소기로 청소하다", example: "I vacuum the carpet every week.", translation: "나는 매주 카펫을 진공청소기로 청소한다.", subcategory: "가정", past: "vacuumed", pp: "vacuumed" },
  { word: "mop", meaning: "대걸레로 닦다", example: "She mopped the kitchen floor.", translation: "그녀는 부엌 바닥을 대걸레로 닦았다.", subcategory: "가정", past: "mopped", pp: "mopped" },
  { word: "dust", meaning: "먼지를 털다", example: "Don't forget to dust the shelves.", translation: "선반 먼지 터는 것 잊지 마.", subcategory: "가정", past: "dusted", pp: "dusted" },
  { word: "scrub", meaning: "문질러 닦다", example: "I scrubbed the bathtub clean.", translation: "나는 욕조를 문질러 깨끗이 닦았다.", subcategory: "가정", past: "scrubbed", pp: "scrubbed" },
  { word: "polish", meaning: "광을 내다", example: "He polished his shoes before the interview.", translation: "그는 면접 전에 구두를 닦았다.", subcategory: "가정", past: "polished", pp: "polished" },
  { word: "tidy", meaning: "정리정돈하다", example: "Please tidy your room.", translation: "방 정리 좀 해.", subcategory: "가정", past: "tidied", pp: "tidied" },
  { word: "declutter", meaning: "잡동사니를 치우다", example: "I decluttered my closet this weekend.", translation: "이번 주말에 옷장 정리를 했다.", subcategory: "가정", past: "decluttered", pp: "decluttered" },
  { word: "sanitize", meaning: "살균하다", example: "Sanitize your hands frequently.", translation: "손을 자주 살균해라.", subcategory: "가정", past: "sanitized", pp: "sanitized" },

  // 감정/심리 추가
  { word: "resent", meaning: "분개하다, 원망하다", example: "She resented being treated unfairly.", translation: "그녀는 불공평한 대우에 분개했다.", subcategory: "감정/심리", past: "resented", pp: "resented" },
  { word: "despise", meaning: "경멸하다", example: "He despises dishonesty.", translation: "그는 정직하지 못함을 경멸한다.", subcategory: "감정/심리", past: "despised", pp: "despised" },
  { word: "cherish", meaning: "소중히 여기다", example: "I cherish our friendship.", translation: "나는 우리의 우정을 소중히 여긴다.", subcategory: "감정/심리", past: "cherished", pp: "cherished" },
  { word: "yearn", meaning: "갈망하다", example: "She yearns for adventure.", translation: "그녀는 모험을 갈망한다.", subcategory: "감정/심리", past: "yearned", pp: "yearned" },
  { word: "dread", meaning: "두려워하다", example: "I dread Monday mornings.", translation: "나는 월요일 아침이 두렵다.", subcategory: "감정/심리", past: "dreaded", pp: "dreaded" },
  { word: "loathe", meaning: "혐오하다", example: "He loathes getting up early.", translation: "그는 일찍 일어나는 것을 혐오한다.", subcategory: "감정/심리", past: "loathed", pp: "loathed" },
  { word: "crave", meaning: "갈망하다, 몹시 먹고 싶다", example: "I'm craving chocolate.", translation: "초콜릿이 너무 먹고 싶다.", subcategory: "감정/심리", past: "craved", pp: "craved" },
  { word: "adore", meaning: "아주 좋아하다, 숭배하다", example: "She adores her grandchildren.", translation: "그녀는 손주들을 아주 좋아한다.", subcategory: "감정/심리", past: "adored", pp: "adored" },

  // 비즈니스/직장
  { word: "delegate", meaning: "위임하다", example: "Learn to delegate tasks to your team.", translation: "팀에게 업무를 위임하는 법을 배워라.", subcategory: "비즈니스", past: "delegated", pp: "delegated" },
  { word: "negotiate", meaning: "협상하다", example: "We negotiated a better deal.", translation: "우리는 더 좋은 조건을 협상했다.", subcategory: "비즈니스", past: "negotiated", pp: "negotiated" },
  { word: "pitch", meaning: "제안하다, 발표하다", example: "I pitched my idea to the investors.", translation: "나는 투자자들에게 아이디어를 발표했다.", subcategory: "비즈니스", past: "pitched", pp: "pitched" },
  { word: "outsource", meaning: "외주를 주다", example: "They outsourced their IT department.", translation: "그들은 IT 부서를 외주로 돌렸다.", subcategory: "비즈니스", past: "outsourced", pp: "outsourced" },
  { word: "downsize", meaning: "규모를 축소하다", example: "The company downsized last year.", translation: "그 회사는 작년에 규모를 축소했다.", subcategory: "비즈니스", past: "downsized", pp: "downsized" },
  { word: "rebrand", meaning: "리브랜딩하다", example: "They rebranded their product line.", translation: "그들은 제품 라인을 리브랜딩했다.", subcategory: "비즈니스", past: "rebranded", pp: "rebranded" },
  { word: "pivot", meaning: "방향을 전환하다", example: "The startup pivoted to a new business model.", translation: "그 스타트업은 새로운 비즈니스 모델로 전환했다.", subcategory: "비즈니스", past: "pivoted", pp: "pivoted" },
  { word: "leverage", meaning: "활용하다, 이용하다", example: "Leverage your strengths.", translation: "당신의 강점을 활용하세요.", subcategory: "비즈니스", past: "leveraged", pp: "leveraged" },

  // 교통/이동
  { word: "commute", meaning: "통근하다", example: "I commute by subway.", translation: "나는 지하철로 통근한다.", subcategory: "교통/이동", past: "commuted", pp: "commuted" },
  { word: "carpool", meaning: "카풀하다", example: "We carpool to work together.", translation: "우리는 함께 카풀해서 출근한다.", subcategory: "교통/이동", past: "carpooled", pp: "carpooled" },
  { word: "jaywalk", meaning: "무단횡단하다", example: "Don't jaywalk; use the crosswalk.", translation: "무단횡단하지 말고 횡단보도를 이용해.", subcategory: "교통/이동", past: "jaywalked", pp: "jaywalked" },
  { word: "hitchhike", meaning: "히치하이크하다", example: "He hitchhiked across the country.", translation: "그는 히치하이크로 전국을 횡단했다.", subcategory: "교통/이동", past: "hitchhiked", pp: "hitchhiked" },
  { word: "detour", meaning: "우회하다", example: "We had to detour around the construction.", translation: "공사 현장을 우회해야 했다.", subcategory: "교통/이동", past: "detoured", pp: "detoured" },
  { word: "tailgate", meaning: "바짝 따라붙어 운전하다", example: "Don't tailgate other cars.", translation: "다른 차에 바짝 붙어 운전하지 마.", subcategory: "교통/이동", past: "tailgated", pp: "tailgated" },

  // 건강/의료
  { word: "diagnose", meaning: "진단하다", example: "The doctor diagnosed the illness.", translation: "의사가 병을 진단했다.", subcategory: "건강/의료", past: "diagnosed", pp: "diagnosed" },
  { word: "prescribe", meaning: "처방하다", example: "The doctor prescribed antibiotics.", translation: "의사가 항생제를 처방했다.", subcategory: "건강/의료", past: "prescribed", pp: "prescribed" },
  { word: "rehabilitate", meaning: "재활하다", example: "He's rehabilitating from surgery.", translation: "그는 수술 후 재활 중이다.", subcategory: "건강/의료", past: "rehabilitated", pp: "rehabilitated" },
  { word: "relapse", meaning: "재발하다", example: "The patient relapsed after a month.", translation: "환자는 한 달 후에 재발했다.", subcategory: "건강/의료", past: "relapsed", pp: "relapsed" },
  { word: "inoculate", meaning: "예방접종하다", example: "Children should be inoculated against measles.", translation: "아이들은 홍역 예방접종을 받아야 한다.", subcategory: "건강/의료", past: "inoculated", pp: "inoculated" },
  { word: "meditate", meaning: "명상하다", example: "I meditate every morning.", translation: "나는 매일 아침 명상한다.", subcategory: "건강/의료", past: "meditated", pp: "meditated" },
  { word: "detox", meaning: "해독하다", example: "She's detoxing from sugar.", translation: "그녀는 설탕 해독 중이다.", subcategory: "건강/의료", past: "detoxed", pp: "detoxed" },

  // 법률/행정
  { word: "litigate", meaning: "소송하다", example: "They decided to litigate the dispute.", translation: "그들은 분쟁을 소송하기로 했다.", subcategory: "법률/행정", past: "litigated", pp: "litigated" },
  { word: "arbitrate", meaning: "중재하다", example: "A neutral party will arbitrate the conflict.", translation: "중립적인 제3자가 분쟁을 중재할 것이다.", subcategory: "법률/행정", past: "arbitrated", pp: "arbitrated" },
  { word: "adjudicate", meaning: "판결하다", example: "The judge will adjudicate the case.", translation: "판사가 그 사건을 판결할 것이다.", subcategory: "법률/행정", past: "adjudicated", pp: "adjudicated" },
  { word: "prosecute", meaning: "기소하다", example: "The state will prosecute the offender.", translation: "주정부가 범죄자를 기소할 것이다.", subcategory: "법률/행정", past: "prosecuted", pp: "prosecuted" },
  { word: "acquit", meaning: "무죄 판결을 내리다", example: "The jury acquitted the defendant.", translation: "배심원이 피고인에게 무죄 판결을 내렸다.", subcategory: "법률/행정", past: "acquitted", pp: "acquitted" },
  { word: "indict", meaning: "기소하다, 고발하다", example: "The grand jury indicted him.", translation: "대배심이 그를 기소했다.", subcategory: "법률/행정", past: "indicted", pp: "indicted" },

  // 창작/예술
  { word: "sculpt", meaning: "조각하다", example: "She sculpted a beautiful statue.", translation: "그녀는 아름다운 조각상을 만들었다.", subcategory: "창작/예술", past: "sculpted", pp: "sculpted" },
  { word: "choreograph", meaning: "안무를 짜다", example: "He choreographed the dance routine.", translation: "그는 댄스 안무를 짰다.", subcategory: "창작/예술", past: "choreographed", pp: "choreographed" },
  { word: "improvise", meaning: "즉흥적으로 하다", example: "The comedian improvised the whole show.", translation: "그 코미디언은 전체 쇼를 즉흥으로 했다.", subcategory: "창작/예술", past: "improvised", pp: "improvised" },
  { word: "compose", meaning: "작곡하다, 구성하다", example: "She composed a symphony.", translation: "그녀는 교향곡을 작곡했다.", subcategory: "창작/예술", past: "composed", pp: "composed" },
  { word: "narrate", meaning: "나레이션하다, 서술하다", example: "Morgan Freeman narrated the documentary.", translation: "모건 프리먼이 다큐멘터리 나레이션을 했다.", subcategory: "창작/예술", past: "narrated", pp: "narrated" },
  { word: "illustrate", meaning: "삽화를 그리다, 설명하다", example: "She illustrated the children's book.", translation: "그녀는 아동 도서에 삽화를 그렸다.", subcategory: "창작/예술", past: "illustrated", pp: "illustrated" },

  // 자연/환경
  { word: "compost", meaning: "퇴비로 만들다", example: "We compost our food scraps.", translation: "우리는 음식물 쓰레기를 퇴비로 만든다.", subcategory: "자연/환경", past: "composted", pp: "composted" },
  { word: "recycle", meaning: "재활용하다", example: "Please recycle your bottles.", translation: "병을 재활용해 주세요.", subcategory: "자연/환경", past: "recycled", pp: "recycled" },
  { word: "conserve", meaning: "보존하다, 절약하다", example: "We must conserve water.", translation: "우리는 물을 절약해야 한다.", subcategory: "자연/환경", past: "conserved", pp: "conserved" },
  { word: "pollute", meaning: "오염시키다", example: "Factories pollute the air.", translation: "공장들이 공기를 오염시킨다.", subcategory: "자연/환경", past: "polluted", pp: "polluted" },
  { word: "erode", meaning: "침식하다", example: "The cliff is eroding due to waves.", translation: "절벽이 파도로 인해 침식되고 있다.", subcategory: "자연/환경", past: "eroded", pp: "eroded" },
  { word: "hibernate", meaning: "동면하다", example: "Bears hibernate during winter.", translation: "곰은 겨울에 동면한다.", subcategory: "자연/환경", past: "hibernated", pp: "hibernated" },
  { word: "migrate", meaning: "이주하다", example: "Birds migrate south for winter.", translation: "새들은 겨울에 남쪽으로 이주한다.", subcategory: "자연/환경", past: "migrated", pp: "migrated" },

  // 교육/학습
  { word: "tutor", meaning: "개인 지도하다", example: "She tutors students in math.", translation: "그녀는 학생들에게 수학을 개인 지도한다.", subcategory: "교육/학습", past: "tutored", pp: "tutored" },
  { word: "mentor", meaning: "멘토 역할을 하다", example: "He mentored young entrepreneurs.", translation: "그는 젊은 기업가들의 멘토가 되었다.", subcategory: "교육/학습", past: "mentored", pp: "mentored" },
  { word: "memorize", meaning: "암기하다", example: "I need to memorize these formulas.", translation: "이 공식들을 암기해야 해.", subcategory: "교육/학습", past: "memorized", pp: "memorized" },
  { word: "plagiarize", meaning: "표절하다", example: "Don't plagiarize other people's work.", translation: "다른 사람의 작품을 표절하지 마.", subcategory: "교육/학습", past: "plagiarized", pp: "plagiarized" },
  { word: "cram", meaning: "벼락치기하다", example: "I crammed for the exam last night.", translation: "어젯밤 시험 벼락치기를 했다.", subcategory: "교육/학습", past: "crammed", pp: "crammed" },
  { word: "flunk", meaning: "낙제하다", example: "He flunked the final exam.", translation: "그는 기말고사에서 낙제했다.", subcategory: "교육/학습", past: "flunked", pp: "flunked" },

  // 사회/관계
  { word: "befriend", meaning: "친구가 되다", example: "She befriended a new student.", translation: "그녀는 새로 온 학생과 친구가 되었다.", subcategory: "사회/관계", past: "befriended", pp: "befriended" },
  { word: "alienate", meaning: "소외시키다", example: "His behavior alienated his friends.", translation: "그의 행동이 친구들을 멀어지게 했다.", subcategory: "사회/관계", past: "alienated", pp: "alienated" },
  { word: "reconcile", meaning: "화해하다", example: "They finally reconciled after years.", translation: "그들은 수년 만에 마침내 화해했다.", subcategory: "사회/관계", past: "reconciled", pp: "reconciled" },
  { word: "ostracize", meaning: "따돌리다", example: "He was ostracized by the group.", translation: "그는 그룹에서 따돌림을 당했다.", subcategory: "사회/관계", past: "ostracized", pp: "ostracized" },
  { word: "empathize", meaning: "공감하다", example: "I empathize with your situation.", translation: "당신의 상황에 공감합니다.", subcategory: "사회/관계", past: "empathized", pp: "empathized" },
  { word: "socialize", meaning: "사교하다", example: "She likes to socialize with coworkers.", translation: "그녀는 동료들과 어울리는 걸 좋아한다.", subcategory: "사회/관계", past: "socialized", pp: "socialized" },

  // 기술/IT 추가
  { word: "encrypt", meaning: "암호화하다", example: "Always encrypt sensitive data.", translation: "민감한 데이터는 항상 암호화해라.", subcategory: "기술/IT", past: "encrypted", pp: "encrypted" },
  { word: "decrypt", meaning: "복호화하다", example: "The system decrypts the message.", translation: "시스템이 메시지를 복호화한다.", subcategory: "기술/IT", past: "decrypted", pp: "decrypted" },
  { word: "configure", meaning: "설정하다", example: "Configure your router settings.", translation: "라우터 설정을 구성하세요.", subcategory: "기술/IT", past: "configured", pp: "configured" },
  { word: "authenticate", meaning: "인증하다", example: "Please authenticate your identity.", translation: "신원을 인증해 주세요.", subcategory: "기술/IT", past: "authenticated", pp: "authenticated" },
  { word: "virtualize", meaning: "가상화하다", example: "We virtualized our servers.", translation: "우리는 서버를 가상화했다.", subcategory: "기술/IT", past: "virtualized", pp: "virtualized" },
  { word: "tokenize", meaning: "토큰화하다", example: "The system tokenizes credit card numbers.", translation: "시스템이 신용카드 번호를 토큰화한다.", subcategory: "기술/IT", past: "tokenized", pp: "tokenized" },

  // 금융
  { word: "refinance", meaning: "재융자하다", example: "We refinanced our mortgage.", translation: "우리는 주택담보대출을 재융자했다.", subcategory: "금융", past: "refinanced", pp: "refinanced" },
  { word: "divest", meaning: "투자를 회수하다", example: "They divested from fossil fuels.", translation: "그들은 화석 연료에서 투자를 회수했다.", subcategory: "금융", past: "divested", pp: "divested" },
  { word: "liquidate", meaning: "청산하다", example: "The company was liquidated.", translation: "그 회사는 청산되었다.", subcategory: "금융", past: "liquidated", pp: "liquidated" },
  { word: "subsidize", meaning: "보조금을 지급하다", example: "The government subsidizes farmers.", translation: "정부가 농민들에게 보조금을 지급한다.", subcategory: "금융", past: "subsidized", pp: "subsidized" },
  { word: "reimburse", meaning: "환급하다", example: "They reimbursed my travel expenses.", translation: "그들이 내 출장비를 환급해 주었다.", subcategory: "금융", past: "reimbursed", pp: "reimbursed" },

  // 의사소통
  { word: "articulate", meaning: "명확하게 표현하다", example: "She articulated her concerns clearly.", translation: "그녀는 자신의 우려를 명확하게 표현했다.", subcategory: "의사소통", past: "articulated", pp: "articulated" },
  { word: "convey", meaning: "전달하다", example: "The message was conveyed successfully.", translation: "메시지가 성공적으로 전달되었다.", subcategory: "의사소통", past: "conveyed", pp: "conveyed" },
  { word: "reiterate", meaning: "반복하여 말하다", example: "Let me reiterate my point.", translation: "제 요점을 다시 말씀드리겠습니다.", subcategory: "의사소통", past: "reiterated", pp: "reiterated" },
  { word: "elaborate", meaning: "상세히 설명하다", example: "Could you elaborate on that?", translation: "그것에 대해 자세히 설명해 주시겠어요?", subcategory: "의사소통", past: "elaborated", pp: "elaborated" },
  { word: "interject", meaning: "끼어들다", example: "He interjected with a question.", translation: "그가 질문으로 끼어들었다.", subcategory: "의사소통", past: "interjected", pp: "interjected" },

  // 인지/사고
  { word: "contemplate", meaning: "숙고하다", example: "I'm contemplating a career change.", translation: "직업을 바꾸는 것에 대해 숙고 중이다.", subcategory: "인지/사고", past: "contemplated", pp: "contemplated" },
  { word: "hypothesize", meaning: "가설을 세우다", example: "Scientists hypothesized a new theory.", translation: "과학자들이 새로운 이론을 가설로 세웠다.", subcategory: "인지/사고", past: "hypothesized", pp: "hypothesized" },
  { word: "rationalize", meaning: "합리화하다", example: "Don't rationalize your mistakes.", translation: "실수를 합리화하지 마.", subcategory: "인지/사고", past: "rationalized", pp: "rationalized" },
  { word: "conceptualize", meaning: "개념화하다", example: "It's hard to conceptualize infinity.", translation: "무한을 개념화하기는 어렵다.", subcategory: "인지/사고", past: "conceptualized", pp: "conceptualized" },
  { word: "deduce", meaning: "추론하다", example: "We deduced the answer from the clues.", translation: "우리는 단서들로부터 답을 추론했다.", subcategory: "인지/사고", past: "deduced", pp: "deduced" },

  // 요리/음식
  { word: "braise", meaning: "찜하다", example: "Braise the meat for two hours.", translation: "고기를 두 시간 동안 찜해라.", subcategory: "요리", past: "braised", pp: "braised" },
  { word: "sauté", meaning: "볶다", example: "Sauté the vegetables in olive oil.", translation: "올리브 오일에 채소를 볶아라.", subcategory: "요리", past: "sautéed", pp: "sautéed" },
  { word: "caramelize", meaning: "캐러멜화하다", example: "Caramelize the onions slowly.", translation: "양파를 천천히 캐러멜화해라.", subcategory: "요리", past: "caramelized", pp: "caramelized" },
  { word: "garnish", meaning: "고명을 얹다", example: "Garnish with fresh parsley.", translation: "신선한 파슬리로 고명을 얹어라.", subcategory: "요리", past: "garnished", pp: "garnished" },
  { word: "marinate", meaning: "재우다", example: "Marinate the chicken overnight.", translation: "닭고기를 밤새 재워라.", subcategory: "요리", past: "marinated", pp: "marinated" },
  { word: "dice", meaning: "깍둑썰기하다", example: "Dice the tomatoes finely.", translation: "토마토를 잘게 깍둑썰기해라.", subcategory: "요리", past: "diced", pp: "diced" },
  { word: "julienne", meaning: "채썰다", example: "Julienne the carrots for the salad.", translation: "샐러드용으로 당근을 채썰어라.", subcategory: "요리", past: "julienned", pp: "julienned" },

  // 변화/변형
  { word: "deteriorate", meaning: "악화되다", example: "His health deteriorated rapidly.", translation: "그의 건강이 급격히 악화되었다.", subcategory: "변화/변형", past: "deteriorated", pp: "deteriorated" },
  { word: "fluctuate", meaning: "변동하다", example: "Prices fluctuate throughout the year.", translation: "가격은 일년 내내 변동한다.", subcategory: "변화/변형", past: "fluctuated", pp: "fluctuated" },
  { word: "amplify", meaning: "증폭하다", example: "The speaker amplified the sound.", translation: "스피커가 소리를 증폭했다.", subcategory: "변화/변형", past: "amplified", pp: "amplified" },
  { word: "diminish", meaning: "줄어들다", example: "His influence diminished over time.", translation: "시간이 지나면서 그의 영향력이 줄어들었다.", subcategory: "변화/변형", past: "diminished", pp: "diminished" },
  { word: "intensify", meaning: "강화하다", example: "The storm intensified overnight.", translation: "폭풍이 밤새 강해졌다.", subcategory: "변화/변형", past: "intensified", pp: "intensified" },
  { word: "stagnate", meaning: "정체되다", example: "The economy has stagnated.", translation: "경제가 정체되었다.", subcategory: "변화/변형", past: "stagnated", pp: "stagnated" },

  // 일상/기타
  { word: "snooze", meaning: "잠깐 졸다, 알람을 미루다", example: "I hit snooze three times this morning.", translation: "오늘 아침에 알람을 세 번 미뤘다.", subcategory: "일상", past: "snoozed", pp: "snoozed" },
  { word: "procrastinate", meaning: "미루다", example: "Stop procrastinating and start working.", translation: "미루지 말고 일을 시작해.", subcategory: "일상", past: "procrastinated", pp: "procrastinated" },
  { word: "multitask", meaning: "멀티태스킹하다", example: "I can multitask effectively.", translation: "나는 효과적으로 멀티태스킹할 수 있다.", subcategory: "일상", past: "multitasked", pp: "multitasked" },
  { word: "prioritize", meaning: "우선순위를 정하다", example: "Learn to prioritize your tasks.", translation: "업무의 우선순위를 정하는 법을 배워라.", subcategory: "일상", past: "prioritized", pp: "prioritized" },
  { word: "brainstorm", meaning: "브레인스토밍하다", example: "Let's brainstorm some ideas.", translation: "아이디어를 브레인스토밍해 보자.", subcategory: "일상", past: "brainstormed", pp: "brainstormed" },
  { word: "reminisce", meaning: "추억에 잠기다", example: "We reminisced about our college days.", translation: "우리는 대학 시절을 추억했다.", subcategory: "일상", past: "reminisced", pp: "reminisced" },
  { word: "splurge", meaning: "흥청망청 쓰다", example: "I splurged on a new laptop.", translation: "새 노트북에 돈을 펑펑 썼다.", subcategory: "일상", past: "splurged", pp: "splurged" },
  { word: "vent", meaning: "화풀이하다, 하소연하다", example: "She vented her frustrations to me.", translation: "그녀는 나에게 불만을 털어놓았다.", subcategory: "일상", past: "vented", pp: "vented" },
];

let startIndex = data.words.length;
let addedCount = 0;

for (const verb of moreVerbs) {
  if (!existingWords.has(verb.word.toLowerCase())) {
    const newWord = {
      id: `verbs_${verb.word.replace(/[\s-]+/g, '_')}_${startIndex + addedCount}`,
      word: verb.word,
      pronunciation: "",
      subcategory: verb.subcategory,
      meanings: [{
        partOfSpeech: "verb",
        meaning: verb.meaning,
        examples: [{
          sentence: verb.example,
          translation: verb.translation
        }]
      }],
      pastTense: verb.past,
      pastParticiple: verb.pp,
      antonym: ""
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
