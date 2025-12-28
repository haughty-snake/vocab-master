const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

console.log('현재 동사 수:', data.words.length);

const newVerbs = [
  // 감정/심리 동사
  { word: "adore", meaning: "숭배하다, 아주 좋아하다", example: "I adore my grandmother.", translation: "나는 할머니를 아주 좋아해.", subcategory: "감정/심리", past: "adored", pp: "adored" },
  { word: "crave", meaning: "갈망하다, 몹시 원하다", example: "I crave chocolate when I'm stressed.", translation: "스트레스 받으면 초콜릿이 먹고 싶어.", subcategory: "감정/심리", past: "craved", pp: "craved" },
  { word: "loathe", meaning: "혐오하다, 몹시 싫어하다", example: "I loathe getting up early.", translation: "나는 일찍 일어나는 게 정말 싫어.", subcategory: "감정/심리", past: "loathed", pp: "loathed" },
  { word: "resent", meaning: "분개하다, 화내다", example: "He resents being treated like a child.", translation: "그는 어린아이 취급받는 것에 분개한다.", subcategory: "감정/심리", past: "resented", pp: "resented" },
  { word: "cherish", meaning: "소중히 여기다", example: "I cherish our friendship.", translation: "나는 우리의 우정을 소중히 여겨.", subcategory: "감정/심리", past: "cherished", pp: "cherished" },
  { word: "despise", meaning: "경멸하다, 멸시하다", example: "He despises dishonesty.", translation: "그는 부정직함을 경멸한다.", subcategory: "감정/심리", past: "despised", pp: "despised" },
  { word: "grieve", meaning: "슬퍼하다, 애도하다", example: "She is grieving for her lost pet.", translation: "그녀는 잃어버린 반려동물을 슬퍼하고 있다.", subcategory: "감정/심리", past: "grieved", pp: "grieved" },
  { word: "rejoice", meaning: "기뻐하다, 환호하다", example: "The fans rejoiced at the victory.", translation: "팬들은 승리에 기뻐했다.", subcategory: "감정/심리", past: "rejoiced", pp: "rejoiced" },
  { word: "sympathize", meaning: "동정하다, 공감하다", example: "I sympathize with your situation.", translation: "나는 당신의 상황에 공감해요.", subcategory: "감정/심리", past: "sympathized", pp: "sympathized" },
  { word: "envy", meaning: "부러워하다, 질투하다", example: "I envy your talent.", translation: "나는 네 재능이 부러워.", subcategory: "감정/심리", past: "envied", pp: "envied" },
  { word: "dread", meaning: "두려워하다, 무서워하다", example: "I dread going to the dentist.", translation: "나는 치과 가는 게 무서워.", subcategory: "감정/심리", past: "dreaded", pp: "dreaded" },
  { word: "yearn", meaning: "그리워하다, 갈망하다", example: "She yearns for her homeland.", translation: "그녀는 고향을 그리워한다.", subcategory: "감정/심리", past: "yearned", pp: "yearned" },
  { word: "mourn", meaning: "애도하다, 슬퍼하다", example: "The nation mourned the leader's death.", translation: "온 국민이 지도자의 죽음을 애도했다.", subcategory: "감정/심리", past: "mourned", pp: "mourned" },
  { word: "regret", meaning: "후회하다", example: "I regret not studying harder.", translation: "더 열심히 공부하지 않은 것을 후회해.", subcategory: "감정/심리", past: "regretted", pp: "regretted" },
  { word: "appreciate", meaning: "감사하다, 고마워하다", example: "I appreciate your help.", translation: "도움에 감사드려요.", subcategory: "감정/심리", past: "appreciated", pp: "appreciated" },

  // 의사소통 동사
  { word: "announce", meaning: "발표하다, 알리다", example: "They announced the winner.", translation: "그들은 우승자를 발표했다.", subcategory: "의사소통", past: "announced", pp: "announced" },
  { word: "declare", meaning: "선언하다, 공표하다", example: "The country declared independence.", translation: "그 나라는 독립을 선언했다.", subcategory: "의사소통", past: "declared", pp: "declared" },
  { word: "proclaim", meaning: "선포하다, 공포하다", example: "The king proclaimed a new law.", translation: "왕은 새 법을 선포했다.", subcategory: "의사소통", past: "proclaimed", pp: "proclaimed" },
  { word: "assert", meaning: "주장하다, 단언하다", example: "She asserted her innocence.", translation: "그녀는 자신의 무죄를 주장했다.", subcategory: "의사소통", past: "asserted", pp: "asserted" },
  { word: "confess", meaning: "고백하다, 자백하다", example: "He confessed his love for her.", translation: "그는 그녀에 대한 사랑을 고백했다.", subcategory: "의사소통", past: "confessed", pp: "confessed" },
  { word: "whisper", meaning: "속삭이다", example: "She whispered a secret to me.", translation: "그녀는 내게 비밀을 속삭였다.", subcategory: "의사소통", past: "whispered", pp: "whispered" },
  { word: "murmur", meaning: "중얼거리다", example: "He murmured something under his breath.", translation: "그는 무언가를 중얼거렸다.", subcategory: "의사소통", past: "murmured", pp: "murmured" },
  { word: "stammer", meaning: "더듬거리다, 말을 더듬다", example: "He stammered when he was nervous.", translation: "그는 긴장하면 말을 더듬었다.", subcategory: "의사소통", past: "stammered", pp: "stammered" },
  { word: "boast", meaning: "자랑하다", example: "He boasts about his achievements.", translation: "그는 자신의 성과를 자랑한다.", subcategory: "의사소통", past: "boasted", pp: "boasted" },
  { word: "gossip", meaning: "험담하다, 수군거리다", example: "They gossip about their neighbors.", translation: "그들은 이웃에 대해 수군거린다.", subcategory: "의사소통", past: "gossiped", pp: "gossiped" },
  { word: "inquire", meaning: "묻다, 문의하다", example: "She inquired about the price.", translation: "그녀는 가격을 문의했다.", subcategory: "의사소통", past: "inquired", pp: "inquired" },
  { word: "narrate", meaning: "서술하다, 이야기하다", example: "He narrated the story beautifully.", translation: "그는 이야기를 아름답게 서술했다.", subcategory: "의사소통", past: "narrated", pp: "narrated" },
  { word: "recite", meaning: "낭독하다, 암송하다", example: "She recited a poem.", translation: "그녀는 시를 낭독했다.", subcategory: "의사소통", past: "recited", pp: "recited" },
  { word: "utter", meaning: "말하다, 발언하다", example: "He didn't utter a word.", translation: "그는 한마디도 하지 않았다.", subcategory: "의사소통", past: "uttered", pp: "uttered" },
  { word: "articulate", meaning: "또렷이 말하다, 명확히 표현하다", example: "She articulated her ideas clearly.", translation: "그녀는 자신의 생각을 명확히 표현했다.", subcategory: "의사소통", past: "articulated", pp: "articulated" },

  // 신체 동작
  { word: "stumble", meaning: "비틀거리다, 넘어지다", example: "He stumbled over a rock.", translation: "그는 돌에 걸려 비틀거렸다.", subcategory: "신체 동작", past: "stumbled", pp: "stumbled" },
  { word: "stagger", meaning: "비틀거리며 걷다", example: "He staggered home after the party.", translation: "그는 파티 후 비틀거리며 집에 갔다.", subcategory: "신체 동작", past: "staggered", pp: "staggered" },
  { word: "crawl", meaning: "기어가다", example: "The baby is learning to crawl.", translation: "아기가 기어가는 법을 배우고 있다.", subcategory: "신체 동작", past: "crawled", pp: "crawled" },
  { word: "crouch", meaning: "웅크리다, 쪼그리다", example: "She crouched behind the wall.", translation: "그녀는 벽 뒤에 웅크렸다.", subcategory: "신체 동작", past: "crouched", pp: "crouched" },
  { word: "kneel", meaning: "무릎 꿇다", example: "He knelt to tie his shoelace.", translation: "그는 신발끈을 묶으려고 무릎을 꿇었다.", subcategory: "신체 동작", past: "knelt", pp: "knelt" },
  { word: "squat", meaning: "쪼그리고 앉다", example: "She squatted to pick up the coin.", translation: "그녀는 동전을 줍기 위해 쪼그리고 앉았다.", subcategory: "신체 동작", past: "squatted", pp: "squatted" },
  { word: "leap", meaning: "뛰다, 도약하다", example: "The cat leaped onto the table.", translation: "고양이가 테이블 위로 뛰어올랐다.", subcategory: "신체 동작", past: "leaped/leapt", pp: "leaped/leapt" },
  { word: "hop", meaning: "깡충 뛰다", example: "The rabbit hopped across the field.", translation: "토끼가 들판을 깡충깡충 뛰었다.", subcategory: "신체 동작", past: "hopped", pp: "hopped" },
  { word: "skip", meaning: "깡충깡충 뛰다, 건너뛰다", example: "The children skipped happily.", translation: "아이들이 행복하게 깡충깡충 뛰었다.", subcategory: "신체 동작", past: "skipped", pp: "skipped" },
  { word: "dash", meaning: "돌진하다, 달려가다", example: "She dashed to catch the bus.", translation: "그녀는 버스를 타려고 달려갔다.", subcategory: "신체 동작", past: "dashed", pp: "dashed" },
  { word: "sprint", meaning: "전력 질주하다", example: "He sprinted to the finish line.", translation: "그는 결승선까지 전력 질주했다.", subcategory: "신체 동작", past: "sprinted", pp: "sprinted" },
  { word: "tiptoe", meaning: "발끝으로 걷다", example: "She tiptoed past the sleeping baby.", translation: "그녀는 자는 아기 곁을 발끝으로 지나갔다.", subcategory: "신체 동작", past: "tiptoed", pp: "tiptoed" },
  { word: "shiver", meaning: "떨다, 오싹하다", example: "She shivered in the cold.", translation: "그녀는 추위에 떨었다.", subcategory: "신체 동작", past: "shivered", pp: "shivered" },
  { word: "tremble", meaning: "떨리다, 전율하다", example: "His hands trembled with fear.", translation: "그의 손은 두려움에 떨렸다.", subcategory: "신체 동작", past: "trembled", pp: "trembled" },
  { word: "yawn", meaning: "하품하다", example: "He yawned during the meeting.", translation: "그는 회의 중에 하품했다.", subcategory: "신체 동작", past: "yawned", pp: "yawned" },
  { word: "stretch", meaning: "기지개를 켜다, 늘리다", example: "She stretched after waking up.", translation: "그녀는 일어나서 기지개를 켰다.", subcategory: "신체 동작", past: "stretched", pp: "stretched" },
  { word: "blink", meaning: "눈을 깜박이다", example: "He blinked in the bright light.", translation: "그는 밝은 빛에 눈을 깜박였다.", subcategory: "신체 동작", past: "blinked", pp: "blinked" },
  { word: "wink", meaning: "윙크하다", example: "He winked at her playfully.", translation: "그는 그녀에게 장난스럽게 윙크했다.", subcategory: "신체 동작", past: "winked", pp: "winked" },
  { word: "frown", meaning: "찡그리다, 인상을 쓰다", example: "She frowned at the bad news.", translation: "그녀는 나쁜 소식에 인상을 찡그렸다.", subcategory: "신체 동작", past: "frowned", pp: "frowned" },
  { word: "grin", meaning: "활짝 웃다", example: "He grinned from ear to ear.", translation: "그는 귀까지 찢어지게 웃었다.", subcategory: "신체 동작", past: "grinned", pp: "grinned" },

  // 인지/사고 동사
  { word: "perceive", meaning: "인식하다, 감지하다", example: "I perceived a change in his attitude.", translation: "나는 그의 태도 변화를 감지했다.", subcategory: "인지/사고", past: "perceived", pp: "perceived" },
  { word: "comprehend", meaning: "이해하다, 파악하다", example: "I cannot comprehend this theory.", translation: "나는 이 이론을 이해할 수 없다.", subcategory: "인지/사고", past: "comprehended", pp: "comprehended" },
  { word: "grasp", meaning: "파악하다, 이해하다", example: "She quickly grasped the concept.", translation: "그녀는 개념을 빨리 파악했다.", subcategory: "인지/사고", past: "grasped", pp: "grasped" },
  { word: "contemplate", meaning: "숙고하다, 깊이 생각하다", example: "He contemplated his future.", translation: "그는 자신의 미래를 숙고했다.", subcategory: "인지/사고", past: "contemplated", pp: "contemplated" },
  { word: "ponder", meaning: "곰곰이 생각하다", example: "She pondered the question carefully.", translation: "그녀는 그 질문을 곰곰이 생각했다.", subcategory: "인지/사고", past: "pondered", pp: "pondered" },
  { word: "speculate", meaning: "추측하다, 짐작하다", example: "We can only speculate about the cause.", translation: "우리는 원인에 대해 추측만 할 수 있다.", subcategory: "인지/사고", past: "speculated", pp: "speculated" },
  { word: "presume", meaning: "추정하다, 가정하다", example: "I presume you know the answer.", translation: "당신이 답을 알고 있다고 추정합니다.", subcategory: "인지/사고", past: "presumed", pp: "presumed" },
  { word: "deduce", meaning: "추론하다, 연역하다", example: "She deduced the truth from the clues.", translation: "그녀는 단서들로부터 진실을 추론했다.", subcategory: "인지/사고", past: "deduced", pp: "deduced" },
  { word: "infer", meaning: "추론하다, 추측하다", example: "I inferred from his tone that he was angry.", translation: "그의 말투에서 그가 화났다고 추론했다.", subcategory: "인지/사고", past: "inferred", pp: "inferred" },
  { word: "reckon", meaning: "생각하다, 계산하다", example: "I reckon he'll be late.", translation: "그가 늦을 거라고 생각해.", subcategory: "인지/사고", past: "reckoned", pp: "reckoned" },
  { word: "recollect", meaning: "회상하다, 기억해 내다", example: "I cannot recollect his name.", translation: "그의 이름이 기억나지 않아.", subcategory: "인지/사고", past: "recollected", pp: "recollected" },
  { word: "reminisce", meaning: "추억하다, 회상하다", example: "They reminisced about their school days.", translation: "그들은 학창 시절을 회상했다.", subcategory: "인지/사고", past: "reminisced", pp: "reminisced" },
  { word: "visualize", meaning: "시각화하다, 상상하다", example: "I can't visualize what you mean.", translation: "네가 무슨 말인지 상상이 안 돼.", subcategory: "인지/사고", past: "visualized", pp: "visualized" },
  { word: "envision", meaning: "상상하다, 마음에 그리다", example: "She envisioned a bright future.", translation: "그녀는 밝은 미래를 상상했다.", subcategory: "인지/사고", past: "envisioned", pp: "envisioned" },
  { word: "foresee", meaning: "예견하다, 내다보다", example: "No one could foresee the disaster.", translation: "아무도 그 재난을 예견하지 못했다.", subcategory: "인지/사고", past: "foresaw", pp: "foreseen" },

  // 변화/변형 동사
  { word: "transform", meaning: "변형시키다, 바꾸다", example: "The city has transformed completely.", translation: "그 도시는 완전히 변했다.", subcategory: "변화/변형", past: "transformed", pp: "transformed" },
  { word: "convert", meaning: "전환하다, 변환하다", example: "They converted the garage into a studio.", translation: "그들은 차고를 스튜디오로 개조했다.", subcategory: "변화/변형", past: "converted", pp: "converted" },
  { word: "alter", meaning: "바꾸다, 변경하다", example: "She altered the dress to fit better.", translation: "그녀는 드레스를 더 잘 맞게 수선했다.", subcategory: "변화/변형", past: "altered", pp: "altered" },
  { word: "modify", meaning: "수정하다, 변경하다", example: "We need to modify the plan.", translation: "우리는 계획을 수정해야 해.", subcategory: "변화/변형", past: "modified", pp: "modified" },
  { word: "adjust", meaning: "조정하다, 맞추다", example: "Please adjust the volume.", translation: "볼륨을 조절해 주세요.", subcategory: "변화/변형", past: "adjusted", pp: "adjusted" },
  { word: "adapt", meaning: "적응하다, 맞추다", example: "She adapted quickly to the new environment.", translation: "그녀는 새 환경에 빠르게 적응했다.", subcategory: "변화/변형", past: "adapted", pp: "adapted" },
  { word: "evolve", meaning: "진화하다, 발전하다", example: "Technology evolves rapidly.", translation: "기술은 빠르게 발전한다.", subcategory: "변화/변형", past: "evolved", pp: "evolved" },
  { word: "deteriorate", meaning: "악화되다, 나빠지다", example: "His health deteriorated quickly.", translation: "그의 건강이 빠르게 악화되었다.", subcategory: "변화/변형", past: "deteriorated", pp: "deteriorated" },
  { word: "diminish", meaning: "줄어들다, 감소하다", example: "The pain slowly diminished.", translation: "통증이 서서히 줄어들었다.", subcategory: "변화/변형", past: "diminished", pp: "diminished" },
  { word: "intensify", meaning: "강화되다, 심해지다", example: "The storm intensified overnight.", translation: "폭풍이 밤새 강해졌다.", subcategory: "변화/변형", past: "intensified", pp: "intensified" },
  { word: "accelerate", meaning: "가속하다, 빨라지다", example: "The car accelerated quickly.", translation: "차가 빨리 가속했다.", subcategory: "변화/변형", past: "accelerated", pp: "accelerated" },
  { word: "decelerate", meaning: "감속하다, 느려지다", example: "Please decelerate before the turn.", translation: "코너 전에 속도를 줄여주세요.", subcategory: "변화/변형", past: "decelerated", pp: "decelerated" },
  { word: "expand", meaning: "확장하다, 늘리다", example: "The company plans to expand.", translation: "그 회사는 확장할 계획이다.", subcategory: "변화/변형", past: "expanded", pp: "expanded" },
  { word: "shrink", meaning: "줄어들다, 수축하다", example: "The shirt shrank in the wash.", translation: "셔츠가 세탁 후 줄어들었다.", subcategory: "변화/변형", past: "shrank", pp: "shrunk" },
  { word: "swell", meaning: "부풀다, 붓다", example: "Her ankle swelled after the injury.", translation: "그녀의 발목이 부상 후 부었다.", subcategory: "변화/변형", past: "swelled", pp: "swollen" },

  // 사회적 상호작용
  { word: "collaborate", meaning: "협력하다, 공동 작업하다", example: "We collaborated on the project.", translation: "우리는 프로젝트에서 협력했다.", subcategory: "사회적 상호작용", past: "collaborated", pp: "collaborated" },
  { word: "cooperate", meaning: "협조하다, 협력하다", example: "Please cooperate with the police.", translation: "경찰에 협조해 주세요.", subcategory: "사회적 상호작용", past: "cooperated", pp: "cooperated" },
  { word: "negotiate", meaning: "협상하다", example: "They negotiated a peace treaty.", translation: "그들은 평화 조약을 협상했다.", subcategory: "사회적 상호작용", past: "negotiated", pp: "negotiated" },
  { word: "mediate", meaning: "중재하다, 조정하다", example: "She mediated between the two parties.", translation: "그녀가 두 당사자 사이를 중재했다.", subcategory: "사회적 상호작용", past: "mediated", pp: "mediated" },
  { word: "reconcile", meaning: "화해시키다, 조화시키다", example: "They reconciled after the argument.", translation: "그들은 다툼 후 화해했다.", subcategory: "사회적 상호작용", past: "reconciled", pp: "reconciled" },
  { word: "interact", meaning: "상호 작용하다, 교류하다", example: "Children interact with each other.", translation: "아이들은 서로 교류한다.", subcategory: "사회적 상호작용", past: "interacted", pp: "interacted" },
  { word: "associate", meaning: "연관짓다, 교제하다", example: "I associate this song with summer.", translation: "나는 이 노래를 여름과 연관 지어.", subcategory: "사회적 상호작용", past: "associated", pp: "associated" },
  { word: "mingle", meaning: "어울리다, 섞이다", example: "He mingled with the guests.", translation: "그는 손님들과 어울렸다.", subcategory: "사회적 상호작용", past: "mingled", pp: "mingled" },
  { word: "socialize", meaning: "사교 활동을 하다", example: "I rarely socialize during weekdays.", translation: "평일에는 거의 사교 활동을 안 해.", subcategory: "사회적 상호작용", past: "socialized", pp: "socialized" },
  { word: "confront", meaning: "맞서다, 직면하다", example: "She confronted her fears.", translation: "그녀는 두려움에 맞섰다.", subcategory: "사회적 상호작용", past: "confronted", pp: "confronted" },
  { word: "oppose", meaning: "반대하다, 대항하다", example: "Many people oppose the new law.", translation: "많은 사람들이 새 법에 반대한다.", subcategory: "사회적 상호작용", past: "opposed", pp: "opposed" },
  { word: "defy", meaning: "거역하다, 무시하다", example: "He defied his parents' wishes.", translation: "그는 부모님의 바람을 거역했다.", subcategory: "사회적 상호작용", past: "defied", pp: "defied" },
  { word: "comply", meaning: "따르다, 준수하다", example: "You must comply with the rules.", translation: "규칙을 따라야 합니다.", subcategory: "사회적 상호작용", past: "complied", pp: "complied" },
  { word: "obey", meaning: "복종하다, 따르다", example: "Dogs should obey their owners.", translation: "개는 주인에게 복종해야 한다.", subcategory: "사회적 상호작용", past: "obeyed", pp: "obeyed" },
  { word: "submit", meaning: "제출하다, 복종하다", example: "Please submit your application.", translation: "신청서를 제출해 주세요.", subcategory: "사회적 상호작용", past: "submitted", pp: "submitted" },

  // 창조/생산 동사
  { word: "compose", meaning: "작곡하다, 구성하다", example: "He composed a beautiful symphony.", translation: "그는 아름다운 교향곡을 작곡했다.", subcategory: "창조/생산", past: "composed", pp: "composed" },
  { word: "devise", meaning: "고안하다, 발명하다", example: "She devised a new strategy.", translation: "그녀는 새로운 전략을 고안했다.", subcategory: "창조/생산", past: "devised", pp: "devised" },
  { word: "fabricate", meaning: "제작하다, 날조하다", example: "The company fabricates steel parts.", translation: "그 회사는 철강 부품을 제작한다.", subcategory: "창조/생산", past: "fabricated", pp: "fabricated" },
  { word: "generate", meaning: "생성하다, 발생시키다", example: "Solar panels generate electricity.", translation: "태양광 패널은 전기를 생성한다.", subcategory: "창조/생산", past: "generated", pp: "generated" },
  { word: "manufacture", meaning: "제조하다, 생산하다", example: "They manufacture cars.", translation: "그들은 자동차를 제조한다.", subcategory: "창조/생산", past: "manufactured", pp: "manufactured" },
  { word: "assemble", meaning: "조립하다, 모으다", example: "Workers assemble the products.", translation: "작업자들이 제품을 조립한다.", subcategory: "창조/생산", past: "assembled", pp: "assembled" },
  { word: "construct", meaning: "건설하다, 구성하다", example: "They are constructing a new bridge.", translation: "그들은 새 다리를 건설하고 있다.", subcategory: "창조/생산", past: "constructed", pp: "constructed" },
  { word: "erect", meaning: "세우다, 건립하다", example: "They erected a statue.", translation: "그들은 동상을 세웠다.", subcategory: "창조/생산", past: "erected", pp: "erected" },
  { word: "formulate", meaning: "공식화하다, 만들다", example: "Scientists formulated a new theory.", translation: "과학자들이 새 이론을 만들었다.", subcategory: "창조/생산", past: "formulated", pp: "formulated" },
  { word: "originate", meaning: "시작되다, 유래하다", example: "The idea originated from him.", translation: "그 아이디어는 그에게서 시작되었다.", subcategory: "창조/생산", past: "originated", pp: "originated" },
  { word: "cultivate", meaning: "경작하다, 기르다", example: "Farmers cultivate rice.", translation: "농부들은 쌀을 경작한다.", subcategory: "창조/생산", past: "cultivated", pp: "cultivated" },
  { word: "harvest", meaning: "수확하다, 거두다", example: "They harvest wheat in autumn.", translation: "그들은 가을에 밀을 수확한다.", subcategory: "창조/생산", past: "harvested", pp: "harvested" },
  { word: "breed", meaning: "번식시키다, 기르다", example: "They breed horses on the farm.", translation: "그들은 농장에서 말을 기른다.", subcategory: "창조/생산", past: "bred", pp: "bred" },
  { word: "nurture", meaning: "양육하다, 기르다", example: "Parents nurture their children.", translation: "부모는 자녀를 양육한다.", subcategory: "창조/생산", past: "nurtured", pp: "nurtured" },
  { word: "foster", meaning: "양육하다, 촉진하다", example: "The program fosters creativity.", translation: "그 프로그램은 창의성을 촉진한다.", subcategory: "창조/생산", past: "fostered", pp: "fostered" },

  // 파괴/손상 동사
  { word: "demolish", meaning: "철거하다, 파괴하다", example: "They demolished the old building.", translation: "그들은 오래된 건물을 철거했다.", subcategory: "파괴/손상", past: "demolished", pp: "demolished" },
  { word: "shatter", meaning: "산산조각 내다", example: "The glass shattered on the floor.", translation: "유리가 바닥에 떨어져 산산조각 났다.", subcategory: "파괴/손상", past: "shattered", pp: "shattered" },
  { word: "smash", meaning: "부수다, 깨뜨리다", example: "He smashed the window.", translation: "그는 창문을 부쉈다.", subcategory: "파괴/손상", past: "smashed", pp: "smashed" },
  { word: "crush", meaning: "으깨다, 짓누르다", example: "The machine crushes rocks.", translation: "그 기계는 바위를 으깬다.", subcategory: "파괴/손상", past: "crushed", pp: "crushed" },
  { word: "wreck", meaning: "파괴하다, 난파시키다", example: "The storm wrecked the ship.", translation: "폭풍이 배를 난파시켰다.", subcategory: "파괴/손상", past: "wrecked", pp: "wrecked" },
  { word: "ruin", meaning: "망치다, 파멸시키다", example: "The rain ruined our picnic.", translation: "비가 우리 소풍을 망쳤다.", subcategory: "파괴/손상", past: "ruined", pp: "ruined" },
  { word: "spoil", meaning: "망치다, 상하게 하다", example: "Don't spoil the surprise.", translation: "깜짝 선물을 망치지 마.", subcategory: "파괴/손상", past: "spoiled", pp: "spoiled" },
  { word: "corrupt", meaning: "부패시키다, 타락시키다", example: "Power can corrupt people.", translation: "권력은 사람을 부패시킬 수 있다.", subcategory: "파괴/손상", past: "corrupted", pp: "corrupted" },
  { word: "contaminate", meaning: "오염시키다", example: "Chemicals contaminated the water.", translation: "화학물질이 물을 오염시켰다.", subcategory: "파괴/손상", past: "contaminated", pp: "contaminated" },
  { word: "pollute", meaning: "오염시키다", example: "Factories pollute the air.", translation: "공장들이 공기를 오염시킨다.", subcategory: "파괴/손상", past: "polluted", pp: "polluted" },
  { word: "erode", meaning: "침식하다, 부식시키다", example: "Water eroded the rock.", translation: "물이 바위를 침식했다.", subcategory: "파괴/손상", past: "eroded", pp: "eroded" },
  { word: "corrode", meaning: "부식시키다", example: "Salt corrodes metal.", translation: "소금은 금속을 부식시킨다.", subcategory: "파괴/손상", past: "corroded", pp: "corroded" },
  { word: "decay", meaning: "썩다, 부패하다", example: "The fruit began to decay.", translation: "과일이 썩기 시작했다.", subcategory: "파괴/손상", past: "decayed", pp: "decayed" },
  { word: "rot", meaning: "썩다, 부패하다", example: "The wood rotted over time.", translation: "나무가 시간이 지나며 썩었다.", subcategory: "파괴/손상", past: "rotted", pp: "rotted" },
  { word: "wither", meaning: "시들다, 쇠약해지다", example: "The flowers withered in the heat.", translation: "꽃들이 더위에 시들었다.", subcategory: "파괴/손상", past: "withered", pp: "withered" },

  // 금융/경제 동사
  { word: "invest", meaning: "투자하다", example: "She invested in stocks.", translation: "그녀는 주식에 투자했다.", subcategory: "금융/경제", past: "invested", pp: "invested" },
  { word: "deposit", meaning: "예금하다, 맡기다", example: "I deposited money in the bank.", translation: "나는 은행에 돈을 예금했다.", subcategory: "금융/경제", past: "deposited", pp: "deposited" },
  { word: "withdraw", meaning: "인출하다, 철회하다", example: "He withdrew cash from the ATM.", translation: "그는 ATM에서 현금을 인출했다.", subcategory: "금융/경제", past: "withdrew", pp: "withdrawn" },
  { word: "borrow", meaning: "빌리다", example: "Can I borrow your pen?", translation: "펜 좀 빌려도 될까요?", subcategory: "금융/경제", past: "borrowed", pp: "borrowed" },
  { word: "lend", meaning: "빌려주다", example: "She lent me her car.", translation: "그녀가 차를 빌려줬다.", subcategory: "금융/경제", past: "lent", pp: "lent" },
  { word: "owe", meaning: "빚지다", example: "I owe you $50.", translation: "나 너한테 50달러 빚졌어.", subcategory: "금융/경제", past: "owed", pp: "owed" },
  { word: "reimburse", meaning: "상환하다, 환불하다", example: "The company reimbursed my expenses.", translation: "회사가 내 경비를 상환해 줬다.", subcategory: "금융/경제", past: "reimbursed", pp: "reimbursed" },
  { word: "compensate", meaning: "보상하다, 배상하다", example: "They compensated for the damage.", translation: "그들은 손해를 보상했다.", subcategory: "금융/경제", past: "compensated", pp: "compensated" },
  { word: "subsidize", meaning: "보조금을 주다", example: "The government subsidizes farmers.", translation: "정부가 농부들에게 보조금을 준다.", subcategory: "금융/경제", past: "subsidized", pp: "subsidized" },
  { word: "fund", meaning: "자금을 대다", example: "They funded the research.", translation: "그들이 연구에 자금을 댔다.", subcategory: "금융/경제", past: "funded", pp: "funded" },
  { word: "finance", meaning: "융자하다, 자금을 조달하다", example: "Banks finance new businesses.", translation: "은행들이 새 사업에 융자해 준다.", subcategory: "금융/경제", past: "financed", pp: "financed" },
  { word: "budget", meaning: "예산을 세우다", example: "We need to budget carefully.", translation: "우리는 예산을 신중히 세워야 해.", subcategory: "금융/경제", past: "budgeted", pp: "budgeted" },
  { word: "economize", meaning: "절약하다", example: "We must economize on electricity.", translation: "우리는 전기를 절약해야 한다.", subcategory: "금융/경제", past: "economized", pp: "economized" },
  { word: "auction", meaning: "경매하다", example: "They auctioned the painting.", translation: "그들은 그 그림을 경매했다.", subcategory: "금융/경제", past: "auctioned", pp: "auctioned" },
  { word: "bid", meaning: "입찰하다", example: "She bid on the antique vase.", translation: "그녀는 골동품 꽃병에 입찰했다.", subcategory: "금융/경제", past: "bid", pp: "bid" },

  // 법률/행정 동사
  { word: "legislate", meaning: "입법하다, 법률을 제정하다", example: "Congress legislates new laws.", translation: "의회가 새 법률을 제정한다.", subcategory: "법률/행정", past: "legislated", pp: "legislated" },
  { word: "enforce", meaning: "시행하다, 집행하다", example: "Police enforce the law.", translation: "경찰이 법을 집행한다.", subcategory: "법률/행정", past: "enforced", pp: "enforced" },
  { word: "prosecute", meaning: "기소하다, 고발하다", example: "They prosecuted the criminal.", translation: "그들은 범인을 기소했다.", subcategory: "법률/행정", past: "prosecuted", pp: "prosecuted" },
  { word: "acquit", meaning: "무죄를 선고하다", example: "The jury acquitted him.", translation: "배심원이 그에게 무죄를 선고했다.", subcategory: "법률/행정", past: "acquitted", pp: "acquitted" },
  { word: "convict", meaning: "유죄를 선고하다", example: "He was convicted of theft.", translation: "그는 절도죄로 유죄 선고를 받았다.", subcategory: "법률/행정", past: "convicted", pp: "convicted" },
  { word: "sentence", meaning: "선고하다, 판결하다", example: "The judge sentenced him to prison.", translation: "판사가 그에게 징역형을 선고했다.", subcategory: "법률/행정", past: "sentenced", pp: "sentenced" },
  { word: "sue", meaning: "고소하다, 소송을 제기하다", example: "She sued the company.", translation: "그녀는 회사를 고소했다.", subcategory: "법률/행정", past: "sued", pp: "sued" },
  { word: "testify", meaning: "증언하다", example: "He testified in court.", translation: "그는 법정에서 증언했다.", subcategory: "법률/행정", past: "testified", pp: "testified" },
  { word: "appeal", meaning: "항소하다, 호소하다", example: "The lawyer appealed the decision.", translation: "변호사가 판결에 항소했다.", subcategory: "법률/행정", past: "appealed", pp: "appealed" },
  { word: "pardon", meaning: "사면하다, 용서하다", example: "The president pardoned him.", translation: "대통령이 그를 사면했다.", subcategory: "법률/행정", past: "pardoned", pp: "pardoned" },
  { word: "regulate", meaning: "규제하다, 조절하다", example: "The government regulates industries.", translation: "정부가 산업을 규제한다.", subcategory: "법률/행정", past: "regulated", pp: "regulated" },
  { word: "authorize", meaning: "허가하다, 권한을 부여하다", example: "She authorized the payment.", translation: "그녀가 지불을 허가했다.", subcategory: "법률/행정", past: "authorized", pp: "authorized" },
  { word: "prohibit", meaning: "금지하다", example: "Smoking is prohibited here.", translation: "여기서는 흡연이 금지됩니다.", subcategory: "법률/행정", past: "prohibited", pp: "prohibited" },
  { word: "abolish", meaning: "폐지하다", example: "They abolished the old law.", translation: "그들은 구 법을 폐지했다.", subcategory: "법률/행정", past: "abolished", pp: "abolished" },
  { word: "amend", meaning: "수정하다, 개정하다", example: "They amended the constitution.", translation: "그들은 헌법을 개정했다.", subcategory: "법률/행정", past: "amended", pp: "amended" },

  // 의료/건강 동사
  { word: "diagnose", meaning: "진단하다", example: "The doctor diagnosed the illness.", translation: "의사가 질병을 진단했다.", subcategory: "의료/건강", past: "diagnosed", pp: "diagnosed" },
  { word: "prescribe", meaning: "처방하다", example: "The doctor prescribed medicine.", translation: "의사가 약을 처방했다.", subcategory: "의료/건강", past: "prescribed", pp: "prescribed" },
  { word: "vaccinate", meaning: "예방 접종하다", example: "Children should be vaccinated.", translation: "아이들은 예방 접종을 받아야 한다.", subcategory: "의료/건강", past: "vaccinated", pp: "vaccinated" },
  { word: "immunize", meaning: "면역시키다", example: "The vaccine immunizes against flu.", translation: "그 백신은 독감에 면역력을 준다.", subcategory: "의료/건강", past: "immunized", pp: "immunized" },
  { word: "inject", meaning: "주사하다, 주입하다", example: "The nurse injected the medicine.", translation: "간호사가 약을 주사했다.", subcategory: "의료/건강", past: "injected", pp: "injected" },
  { word: "operate", meaning: "수술하다, 작동하다", example: "The surgeon operated on him.", translation: "외과의사가 그를 수술했다.", subcategory: "의료/건강", past: "operated", pp: "operated" },
  { word: "transplant", meaning: "이식하다", example: "They transplanted the heart.", translation: "그들은 심장을 이식했다.", subcategory: "의료/건강", past: "transplanted", pp: "transplanted" },
  { word: "resuscitate", meaning: "소생시키다", example: "They resuscitated the patient.", translation: "그들은 환자를 소생시켰다.", subcategory: "의료/건강", past: "resuscitated", pp: "resuscitated" },
  { word: "rehabilitate", meaning: "재활시키다, 복권시키다", example: "He is rehabilitating after surgery.", translation: "그는 수술 후 재활 중이다.", subcategory: "의료/건강", past: "rehabilitated", pp: "rehabilitated" },
  { word: "sterilize", meaning: "살균하다, 소독하다", example: "Doctors sterilize their equipment.", translation: "의사들은 장비를 살균한다.", subcategory: "의료/건강", past: "sterilized", pp: "sterilized" },
  { word: "anesthetize", meaning: "마취시키다", example: "They anesthetized the patient.", translation: "그들은 환자를 마취시켰다.", subcategory: "의료/건강", past: "anesthetized", pp: "anesthetized" },
  { word: "hospitalize", meaning: "입원시키다", example: "He was hospitalized for a week.", translation: "그는 일주일간 입원했다.", subcategory: "의료/건강", past: "hospitalized", pp: "hospitalized" },
  { word: "recuperate", meaning: "회복하다, 쾌유하다", example: "She is recuperating at home.", translation: "그녀는 집에서 회복 중이다.", subcategory: "의료/건강", past: "recuperated", pp: "recuperated" },
  { word: "relapse", meaning: "재발하다, 다시 나빠지다", example: "The patient relapsed.", translation: "환자의 병이 재발했다.", subcategory: "의료/건강", past: "relapsed", pp: "relapsed" },
  { word: "infect", meaning: "감염시키다", example: "The virus infected many people.", translation: "바이러스가 많은 사람을 감염시켰다.", subcategory: "의료/건강", past: "infected", pp: "infected" },

  // 이동/운송 동사
  { word: "commute", meaning: "통근하다", example: "I commute by subway.", translation: "나는 지하철로 통근한다.", subcategory: "이동/운송", past: "commuted", pp: "commuted" },
  { word: "navigate", meaning: "항해하다, 길을 찾다", example: "She navigated through the city.", translation: "그녀는 도시를 헤쳐 나갔다.", subcategory: "이동/운송", past: "navigated", pp: "navigated" },
  { word: "steer", meaning: "조종하다, 방향을 잡다", example: "He steered the boat carefully.", translation: "그는 조심히 배를 조종했다.", subcategory: "이동/운송", past: "steered", pp: "steered" },
  { word: "accelerate", meaning: "가속하다", example: "The car accelerated quickly.", translation: "차가 빠르게 가속했다.", subcategory: "이동/운송", past: "accelerated", pp: "accelerated" },
  { word: "reverse", meaning: "후진하다, 뒤집다", example: "She reversed the car into the garage.", translation: "그녀는 차를 차고에 후진시켰다.", subcategory: "이동/운송", past: "reversed", pp: "reversed" },
  { word: "tow", meaning: "견인하다, 끌다", example: "The truck towed the broken car.", translation: "트럭이 고장난 차를 견인했다.", subcategory: "이동/운송", past: "towed", pp: "towed" },
  { word: "haul", meaning: "운반하다, 끌다", example: "They hauled the cargo.", translation: "그들은 화물을 운반했다.", subcategory: "이동/운송", past: "hauled", pp: "hauled" },
  { word: "ferry", meaning: "나룻배로 건네다", example: "The boat ferries passengers daily.", translation: "그 배는 매일 승객을 실어 나른다.", subcategory: "이동/운송", past: "ferried", pp: "ferried" },
  { word: "shuttle", meaning: "왕복 운행하다", example: "Buses shuttle between terminals.", translation: "버스가 터미널 사이를 왕복한다.", subcategory: "이동/운송", past: "shuttled", pp: "shuttled" },
  { word: "trek", meaning: "트레킹하다, 긴 여행을 하다", example: "We trekked through the mountains.", translation: "우리는 산을 통과해 트레킹했다.", subcategory: "이동/운송", past: "trekked", pp: "trekked" },
  { word: "roam", meaning: "돌아다니다, 배회하다", example: "He roamed the streets.", translation: "그는 거리를 돌아다녔다.", subcategory: "이동/운송", past: "roamed", pp: "roamed" },
  { word: "wander", meaning: "방황하다, 헤매다", example: "She wandered through the park.", translation: "그녀는 공원을 거닐었다.", subcategory: "이동/운송", past: "wandered", pp: "wandered" },
  { word: "stroll", meaning: "거닐다, 산책하다", example: "We strolled along the beach.", translation: "우리는 해변을 거닐었다.", subcategory: "이동/운송", past: "strolled", pp: "strolled" },
  { word: "hike", meaning: "하이킹하다, 도보 여행하다", example: "They hiked up the mountain.", translation: "그들은 산을 올랐다.", subcategory: "이동/운송", past: "hiked", pp: "hiked" },
  { word: "migrate", meaning: "이주하다, 이동하다", example: "Birds migrate south in winter.", translation: "새들은 겨울에 남쪽으로 이동한다.", subcategory: "이동/운송", past: "migrated", pp: "migrated" },

  // 기술/과학 동사
  { word: "compute", meaning: "계산하다, 연산하다", example: "Computers compute data quickly.", translation: "컴퓨터는 데이터를 빠르게 계산한다.", subcategory: "기술/과학", past: "computed", pp: "computed" },
  { word: "program", meaning: "프로그래밍하다", example: "She programs in Python.", translation: "그녀는 파이썬으로 프로그래밍한다.", subcategory: "기술/과학", past: "programmed", pp: "programmed" },
  { word: "encrypt", meaning: "암호화하다", example: "The data is encrypted.", translation: "데이터가 암호화되어 있다.", subcategory: "기술/과학", past: "encrypted", pp: "encrypted" },
  { word: "decode", meaning: "해독하다, 디코딩하다", example: "They decoded the message.", translation: "그들은 메시지를 해독했다.", subcategory: "기술/과학", past: "decoded", pp: "decoded" },
  { word: "simulate", meaning: "시뮬레이션하다, 모의 실험하다", example: "The software simulates flight.", translation: "그 소프트웨어는 비행을 시뮬레이션한다.", subcategory: "기술/과학", past: "simulated", pp: "simulated" },
  { word: "calibrate", meaning: "교정하다, 조정하다", example: "They calibrated the equipment.", translation: "그들은 장비를 교정했다.", subcategory: "기술/과학", past: "calibrated", pp: "calibrated" },
  { word: "synthesize", meaning: "합성하다, 종합하다", example: "Scientists synthesize new materials.", translation: "과학자들이 새 물질을 합성한다.", subcategory: "기술/과학", past: "synthesized", pp: "synthesized" },
  { word: "analyze", meaning: "분석하다", example: "We analyzed the data carefully.", translation: "우리는 데이터를 신중히 분석했다.", subcategory: "기술/과학", past: "analyzed", pp: "analyzed" },
  { word: "hypothesize", meaning: "가설을 세우다", example: "Scientists hypothesized a new theory.", translation: "과학자들이 새 이론을 가설로 세웠다.", subcategory: "기술/과학", past: "hypothesized", pp: "hypothesized" },
  { word: "experiment", meaning: "실험하다", example: "They experimented with new methods.", translation: "그들은 새 방법을 실험했다.", subcategory: "기술/과학", past: "experimented", pp: "experimented" },
  { word: "innovate", meaning: "혁신하다", example: "Companies must innovate to survive.", translation: "회사들은 생존을 위해 혁신해야 한다.", subcategory: "기술/과학", past: "innovated", pp: "innovated" },
  { word: "automate", meaning: "자동화하다", example: "They automated the process.", translation: "그들은 과정을 자동화했다.", subcategory: "기술/과학", past: "automated", pp: "automated" },
  { word: "digitize", meaning: "디지털화하다", example: "Libraries digitize old books.", translation: "도서관들은 오래된 책을 디지털화한다.", subcategory: "기술/과학", past: "digitized", pp: "digitized" },
  { word: "upgrade", meaning: "업그레이드하다", example: "I upgraded my phone.", translation: "나는 휴대폰을 업그레이드했다.", subcategory: "기술/과학", past: "upgraded", pp: "upgraded" },
  { word: "debug", meaning: "디버그하다, 오류를 수정하다", example: "Programmers debug the code.", translation: "프로그래머들이 코드를 디버그한다.", subcategory: "기술/과학", past: "debugged", pp: "debugged" }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const verb of newVerbs) {
  if (!existingWords.has(verb.word.toLowerCase())) {
    const newWord = {
      id: `verbs_${verb.word.replace(/\s+/g, '_')}_${startIndex + addedCount}`,
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
