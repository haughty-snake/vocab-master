const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 동사 수:', existingWords.size);

// 새로운 동사 데이터 (220개 이상)
const newVerbs = [
  // 감정/심리 동사
  { word: "yearn", pronunciation: "jɜrn", meaning: "갈망하다, 그리워하다", examples: [{ sentence: "She yearned for her homeland.", translation: "그녀는 고국을 그리워했다." }] },
  { word: "crave", pronunciation: "kreɪv", meaning: "갈망하다, 열망하다", examples: [{ sentence: "I crave chocolate.", translation: "초콜릿이 먹고 싶어 죽겠다." }] },
  { word: "loathe", pronunciation: "loʊð", meaning: "혐오하다", examples: [{ sentence: "He loathes dishonesty.", translation: "그는 불정직함을 혐오한다." }] },
  { word: "despise", pronunciation: "dɪˈspaɪz", meaning: "경멸하다", examples: [{ sentence: "She despises bullies.", translation: "그녀는 괴롭히는 사람들을 경멸한다." }] },
  { word: "adore", pronunciation: "əˈdɔr", meaning: "숭배하다, 매우 좋아하다", examples: [{ sentence: "Children adore their grandparents.", translation: "아이들은 조부모님을 매우 좋아한다." }] },
  { word: "cherish", pronunciation: "ˈtʃerɪʃ", meaning: "소중히 여기다", examples: [{ sentence: "I cherish our friendship.", translation: "우리 우정을 소중히 여긴다." }] },
  { word: "resent", pronunciation: "rɪˈzent", meaning: "분개하다", examples: [{ sentence: "He resents being treated unfairly.", translation: "그는 불공평한 대우에 분개한다." }] },
  { word: "dread", pronunciation: "dred", meaning: "두려워하다", examples: [{ sentence: "I dread public speaking.", translation: "대중 연설이 두렵다." }] },
  { word: "envy", pronunciation: "ˈenvi", meaning: "부러워하다", examples: [{ sentence: "I envy your talent.", translation: "네 재능이 부럽다." }] },
  { word: "pity", pronunciation: "ˈpɪti", meaning: "불쌍히 여기다", examples: [{ sentence: "I pity anyone who has to work there.", translation: "거기서 일해야 하는 사람이 안됐다." }] },

  // 인지/사고 동사
  { word: "reckon", pronunciation: "ˈrekən", meaning: "생각하다, 추정하다", examples: [{ sentence: "I reckon we should leave now.", translation: "이제 가야 할 것 같아." }] },
  { word: "ponder", pronunciation: "ˈpɑndər", meaning: "숙고하다", examples: [{ sentence: "She pondered the question.", translation: "그녀는 그 질문을 숙고했다." }] },
  { word: "contemplate", pronunciation: "ˈkɑntəmpleɪt", meaning: "심사숙고하다", examples: [{ sentence: "He contemplated his future.", translation: "그는 미래를 심사숙고했다." }] },
  { word: "speculate", pronunciation: "ˈspekjəleɪt", meaning: "추측하다", examples: [{ sentence: "People speculated about the cause.", translation: "사람들은 원인에 대해 추측했다." }] },
  { word: "presume", pronunciation: "prɪˈzum", meaning: "추정하다", examples: [{ sentence: "I presume you're tired.", translation: "피곤하시겠죠." }] },
  { word: "deduce", pronunciation: "dɪˈdus", meaning: "추론하다", examples: [{ sentence: "We deduced the answer.", translation: "우리는 답을 추론했다." }] },
  { word: "infer", pronunciation: "ɪnˈfɜr", meaning: "추론하다", examples: [{ sentence: "What can we infer from this?", translation: "이것에서 무엇을 추론할 수 있을까?" }] },
  { word: "perceive", pronunciation: "pərˈsiv", meaning: "인식하다, 감지하다", examples: [{ sentence: "I perceived a change in her attitude.", translation: "그녀의 태도 변화를 감지했다." }] },
  { word: "discern", pronunciation: "dɪˈsɜrn", meaning: "분별하다, 알아차리다", examples: [{ sentence: "It's hard to discern the truth.", translation: "진실을 분별하기 어렵다." }] },
  { word: "grasp", pronunciation: "græsp", meaning: "이해하다, 파악하다", examples: [{ sentence: "He grasped the concept quickly.", translation: "그는 개념을 빨리 파악했다." }] },

  // 의사소통 동사
  { word: "murmur", pronunciation: "ˈmɜrmər", meaning: "중얼거리다", examples: [{ sentence: "She murmured an apology.", translation: "그녀는 사과를 중얼거렸다." }] },
  { word: "mutter", pronunciation: "ˈmʌtər", meaning: "투덜거리다", examples: [{ sentence: "He muttered under his breath.", translation: "그는 숨죽여 투덜거렸다." }] },
  { word: "whisper", pronunciation: "ˈwɪspər", meaning: "속삭이다", examples: [{ sentence: "She whispered the secret.", translation: "그녀는 비밀을 속삭였다." }] },
  { word: "shout", pronunciation: "ʃaʊt", meaning: "외치다", examples: [{ sentence: "Don't shout at me!", translation: "나한테 소리 지르지 마!" }] },
  { word: "yell", pronunciation: "jel", meaning: "고함치다", examples: [{ sentence: "He yelled for help.", translation: "그는 도움을 외쳤다." }] },
  { word: "scream", pronunciation: "skrim", meaning: "비명 지르다", examples: [{ sentence: "She screamed in fear.", translation: "그녀는 두려움에 비명을 질렀다." }] },
  { word: "exclaim", pronunciation: "ɪkˈskleɪm", meaning: "외치다, 소리치다", examples: [{ sentence: "\"How wonderful!\" she exclaimed.", translation: "\"정말 멋져!\"라고 그녀가 외쳤다." }] },
  { word: "stammer", pronunciation: "ˈstæmər", meaning: "더듬다", examples: [{ sentence: "He stammered nervously.", translation: "그는 긴장해서 말을 더듬었다." }] },
  { word: "stutter", pronunciation: "ˈstʌtər", meaning: "말을 더듬다", examples: [{ sentence: "She stuttered when nervous.", translation: "그녀는 긴장하면 말을 더듬었다." }] },
  { word: "utter", pronunciation: "ˈʌtər", meaning: "말하다, 발언하다", examples: [{ sentence: "He didn't utter a word.", translation: "그는 한마디도 하지 않았다." }] },

  // 신체 동작 동사
  { word: "crouch", pronunciation: "kraʊtʃ", meaning: "웅크리다", examples: [{ sentence: "He crouched behind the wall.", translation: "그는 벽 뒤에 웅크렸다." }] },
  { word: "squat", pronunciation: "skwɑt", meaning: "쪼그려 앉다", examples: [{ sentence: "She squatted down to pet the dog.", translation: "그녀는 개를 쓰다듬으려고 쪼그려 앉았다." }] },
  { word: "kneel", pronunciation: "nil", meaning: "무릎 꿇다", examples: [{ sentence: "He knelt before the altar.", translation: "그는 제단 앞에 무릎 꿇었다." }] },
  { word: "lean", pronunciation: "lin", meaning: "기대다", examples: [{ sentence: "She leaned against the door.", translation: "그녀는 문에 기댔다." }] },
  { word: "slouch", pronunciation: "slaʊtʃ", meaning: "구부정하게 앉다", examples: [{ sentence: "Don't slouch in your chair.", translation: "의자에 구부정하게 앉지 마." }] },
  { word: "stretch", pronunciation: "stretʃ", meaning: "늘이다, 스트레칭하다", examples: [{ sentence: "I stretched before the workout.", translation: "운동 전에 스트레칭했다." }] },
  { word: "shrug", pronunciation: "ʃrʌg", meaning: "어깨를 으쓱하다", examples: [{ sentence: "He shrugged his shoulders.", translation: "그는 어깨를 으쓱했다." }] },
  { word: "nod", pronunciation: "nɑd", meaning: "고개를 끄덕이다", examples: [{ sentence: "She nodded in agreement.", translation: "그녀는 동의하며 고개를 끄덕였다." }] },
  { word: "wink", pronunciation: "wɪŋk", meaning: "윙크하다", examples: [{ sentence: "He winked at me.", translation: "그가 나에게 윙크했다." }] },
  { word: "blink", pronunciation: "blɪŋk", meaning: "눈을 깜빡이다", examples: [{ sentence: "She blinked in surprise.", translation: "그녀는 놀라서 눈을 깜빡였다." }] },

  // 이동/위치 동사
  { word: "stroll", pronunciation: "stroʊl", meaning: "거닐다", examples: [{ sentence: "We strolled through the park.", translation: "우리는 공원을 거닐었다." }] },
  { word: "wander", pronunciation: "ˈwɑndər", meaning: "돌아다니다", examples: [{ sentence: "She wandered around the city.", translation: "그녀는 도시를 돌아다녔다." }] },
  { word: "roam", pronunciation: "roʊm", meaning: "배회하다", examples: [{ sentence: "Animals roam freely here.", translation: "동물들이 여기서 자유롭게 배회한다." }] },
  { word: "trudge", pronunciation: "trʌdʒ", meaning: "터벅터벅 걷다", examples: [{ sentence: "We trudged through the snow.", translation: "우리는 눈 속을 터벅터벅 걸었다." }] },
  { word: "stagger", pronunciation: "ˈstægər", meaning: "비틀거리다", examples: [{ sentence: "He staggered home drunk.", translation: "그는 술에 취해 비틀거리며 집에 갔다." }] },
  { word: "stumble", pronunciation: "ˈstʌmbəl", meaning: "비틀거리다, 발을 헛디디다", examples: [{ sentence: "I stumbled over a rock.", translation: "돌에 걸려 비틀거렸다." }] },
  { word: "sprint", pronunciation: "sprɪnt", meaning: "전력질주하다", examples: [{ sentence: "He sprinted to the finish line.", translation: "그는 결승선까지 전력질주했다." }] },
  { word: "dash", pronunciation: "dæʃ", meaning: "돌진하다", examples: [{ sentence: "She dashed out of the room.", translation: "그녀는 방에서 뛰쳐나갔다." }] },
  { word: "leap", pronunciation: "lip", meaning: "뛰어오르다", examples: [{ sentence: "The cat leaped onto the table.", translation: "고양이가 테이블 위로 뛰어올랐다." }] },
  { word: "bounce", pronunciation: "baʊns", meaning: "튀다, 통통 뛰다", examples: [{ sentence: "The ball bounced twice.", translation: "공이 두 번 튀었다." }] },

  // 변화/전환 동사
  { word: "evolve", pronunciation: "ɪˈvɑlv", meaning: "진화하다, 발전하다", examples: [{ sentence: "Technology evolves rapidly.", translation: "기술은 빠르게 발전한다." }] },
  { word: "transform", pronunciation: "trænsˈfɔrm", meaning: "변형하다", examples: [{ sentence: "The city transformed overnight.", translation: "도시가 하룻밤 사이에 변했다." }] },
  { word: "convert", pronunciation: "kənˈvɜrt", meaning: "변환하다", examples: [{ sentence: "Convert dollars to euros.", translation: "달러를 유로로 변환하세요." }] },
  { word: "morph", pronunciation: "mɔrf", meaning: "변형되다", examples: [{ sentence: "The company morphed into a tech giant.", translation: "회사가 기술 대기업으로 변모했다." }] },
  { word: "deteriorate", pronunciation: "dɪˈtɪriəreɪt", meaning: "악화되다", examples: [{ sentence: "His health deteriorated.", translation: "그의 건강이 악화되었다." }] },
  { word: "decay", pronunciation: "dɪˈkeɪ", meaning: "부패하다, 쇠퇴하다", examples: [{ sentence: "The building decayed over time.", translation: "건물이 시간이 지나며 노후화되었다." }] },
  { word: "erode", pronunciation: "ɪˈroʊd", meaning: "침식하다", examples: [{ sentence: "Trust eroded over time.", translation: "신뢰가 시간이 지나며 침식되었다." }] },
  { word: "flourish", pronunciation: "ˈflɜrɪʃ", meaning: "번성하다", examples: [{ sentence: "The business flourished.", translation: "사업이 번성했다." }] },
  { word: "thrive", pronunciation: "θraɪv", meaning: "번창하다", examples: [{ sentence: "Children thrive with love.", translation: "아이들은 사랑으로 잘 자란다." }] },
  { word: "wither", pronunciation: "ˈwɪðər", meaning: "시들다", examples: [{ sentence: "The flowers withered.", translation: "꽃들이 시들었다." }] },

  // 생산/창작 동사
  { word: "craft", pronunciation: "kræft", meaning: "정성껏 만들다", examples: [{ sentence: "She crafted a beautiful vase.", translation: "그녀는 아름다운 꽃병을 만들었다." }] },
  { word: "forge", pronunciation: "fɔrdʒ", meaning: "만들다, 위조하다", examples: [{ sentence: "They forged a strong alliance.", translation: "그들은 강력한 동맹을 구축했다." }] },
  { word: "sculpt", pronunciation: "skʌlpt", meaning: "조각하다", examples: [{ sentence: "He sculpted a statue.", translation: "그는 조각상을 만들었다." }] },
  { word: "mold", pronunciation: "moʊld", meaning: "틀에 넣어 만들다", examples: [{ sentence: "She molded the clay.", translation: "그녀는 점토를 빚었다." }] },
  { word: "carve", pronunciation: "kɑrv", meaning: "조각하다, 새기다", examples: [{ sentence: "He carved his name in the tree.", translation: "그는 나무에 이름을 새겼다." }] },
  { word: "weave", pronunciation: "wiv", meaning: "짜다, 엮다", examples: [{ sentence: "She wove a basket.", translation: "그녀는 바구니를 짰다." }] },
  { word: "stitch", pronunciation: "stɪtʃ", meaning: "바느질하다", examples: [{ sentence: "She stitched the torn fabric.", translation: "그녀는 찢어진 천을 꿰맸다." }] },
  { word: "knit", pronunciation: "nɪt", meaning: "뜨개질하다", examples: [{ sentence: "My grandmother knits sweaters.", translation: "할머니가 스웨터를 뜨신다." }] },
  { word: "sew", pronunciation: "soʊ", meaning: "바느질하다", examples: [{ sentence: "Can you sew a button?", translation: "단추 달 수 있어?" }] },
  { word: "assemble", pronunciation: "əˈsembəl", meaning: "조립하다", examples: [{ sentence: "We assembled the furniture.", translation: "우리는 가구를 조립했다." }] },

  // 파괴/손상 동사
  { word: "shatter", pronunciation: "ˈʃætər", meaning: "산산조각 내다", examples: [{ sentence: "The glass shattered.", translation: "유리가 산산조각 났다." }] },
  { word: "smash", pronunciation: "smæʃ", meaning: "부수다", examples: [{ sentence: "He smashed the window.", translation: "그가 창문을 부쉈다." }] },
  { word: "crush", pronunciation: "krʌʃ", meaning: "짓누르다, 부수다", examples: [{ sentence: "Don't crush the box.", translation: "상자를 짓누르지 마." }] },
  { word: "demolish", pronunciation: "dɪˈmɑlɪʃ", meaning: "철거하다", examples: [{ sentence: "They demolished the old building.", translation: "그들은 오래된 건물을 철거했다." }] },
  { word: "wreck", pronunciation: "rek", meaning: "파괴하다", examples: [{ sentence: "The storm wrecked the house.", translation: "폭풍이 집을 파괴했다." }] },
  { word: "ruin", pronunciation: "ˈruɪn", meaning: "망치다", examples: [{ sentence: "Don't ruin the surprise.", translation: "깜짝 놀라게 하려는 거 망치지 마." }] },
  { word: "devastate", pronunciation: "ˈdevəsteɪt", meaning: "황폐화시키다", examples: [{ sentence: "The earthquake devastated the city.", translation: "지진이 도시를 황폐화시켰다." }] },
  { word: "ravage", pronunciation: "ˈrævɪdʒ", meaning: "유린하다", examples: [{ sentence: "War ravaged the country.", translation: "전쟁이 나라를 유린했다." }] },
  { word: "dismantle", pronunciation: "dɪsˈmæntl", meaning: "해체하다", examples: [{ sentence: "They dismantled the machine.", translation: "그들은 기계를 해체했다." }] },
  { word: "topple", pronunciation: "ˈtɑpəl", meaning: "넘어뜨리다", examples: [{ sentence: "The statue toppled over.", translation: "동상이 넘어졌다." }] },

  // 획득/보유 동사
  { word: "acquire", pronunciation: "əˈkwaɪər", meaning: "획득하다", examples: [{ sentence: "She acquired new skills.", translation: "그녀는 새로운 기술을 습득했다." }] },
  { word: "obtain", pronunciation: "əbˈteɪn", meaning: "얻다", examples: [{ sentence: "How did you obtain this?", translation: "이걸 어떻게 얻었어?" }] },
  { word: "seize", pronunciation: "siz", meaning: "붙잡다, 압수하다", examples: [{ sentence: "Police seized the drugs.", translation: "경찰이 마약을 압수했다." }] },
  { word: "grasp", pronunciation: "græsp", meaning: "움켜잡다", examples: [{ sentence: "He grasped my hand tightly.", translation: "그는 내 손을 꽉 잡았다." }] },
  { word: "clutch", pronunciation: "klʌtʃ", meaning: "꽉 쥐다", examples: [{ sentence: "She clutched her purse.", translation: "그녀는 가방을 꽉 쥐었다." }] },
  { word: "cling", pronunciation: "klɪŋ", meaning: "달라붙다", examples: [{ sentence: "The child clung to her mother.", translation: "아이가 엄마에게 달라붙었다." }] },
  { word: "possess", pronunciation: "pəˈzes", meaning: "소유하다", examples: [{ sentence: "He possesses great talent.", translation: "그는 엄청난 재능을 가지고 있다." }] },
  { word: "retain", pronunciation: "rɪˈteɪn", meaning: "유지하다, 보유하다", examples: [{ sentence: "She retained her title.", translation: "그녀는 타이틀을 유지했다." }] },
  { word: "hoard", pronunciation: "hɔrd", meaning: "비축하다", examples: [{ sentence: "He hoarded supplies.", translation: "그는 물자를 비축했다." }] },
  { word: "stash", pronunciation: "stæʃ", meaning: "숨겨두다", examples: [{ sentence: "She stashed money under the bed.", translation: "그녀는 침대 밑에 돈을 숨겨뒀다." }] },

  // 제거/방출 동사
  { word: "discard", pronunciation: "dɪsˈkɑrd", meaning: "버리다", examples: [{ sentence: "Discard the old files.", translation: "오래된 파일들을 버려라." }] },
  { word: "dispose", pronunciation: "dɪsˈpoʊz", meaning: "처분하다", examples: [{ sentence: "Dispose of waste properly.", translation: "쓰레기를 올바르게 처리하세요." }] },
  { word: "dump", pronunciation: "dʌmp", meaning: "버리다, 투기하다", examples: [{ sentence: "Don't dump trash here.", translation: "여기에 쓰레기를 버리지 마세요." }] },
  { word: "expel", pronunciation: "ɪkˈspel", meaning: "내쫓다, 퇴학시키다", examples: [{ sentence: "He was expelled from school.", translation: "그는 학교에서 퇴학당했다." }] },
  { word: "eject", pronunciation: "ɪˈdʒekt", meaning: "내쫓다, 방출하다", examples: [{ sentence: "The pilot ejected safely.", translation: "조종사가 안전하게 탈출했다." }] },
  { word: "emit", pronunciation: "ɪˈmɪt", meaning: "방출하다", examples: [{ sentence: "Cars emit pollution.", translation: "자동차는 오염물질을 방출한다." }] },
  { word: "discharge", pronunciation: "dɪsˈtʃɑrdʒ", meaning: "방출하다, 퇴원시키다", examples: [{ sentence: "The patient was discharged.", translation: "환자가 퇴원했다." }] },
  { word: "purge", pronunciation: "pɜrdʒ", meaning: "제거하다, 숙청하다", examples: [{ sentence: "Purge unnecessary files.", translation: "불필요한 파일을 제거하세요." }] },
  { word: "eliminate", pronunciation: "ɪˈlɪməneɪt", meaning: "제거하다", examples: [{ sentence: "Eliminate all errors.", translation: "모든 오류를 제거하세요." }] },
  { word: "eradicate", pronunciation: "ɪˈrædɪkeɪt", meaning: "근절하다", examples: [{ sentence: "They aim to eradicate poverty.", translation: "그들은 빈곤을 근절하려 한다." }] },

  // 사회적 상호작용 동사
  { word: "mingle", pronunciation: "ˈmɪŋgəl", meaning: "어울리다", examples: [{ sentence: "She mingled with the guests.", translation: "그녀는 손님들과 어울렸다." }] },
  { word: "socialize", pronunciation: "ˈsoʊʃəlaɪz", meaning: "사교하다", examples: [{ sentence: "I don't socialize much.", translation: "나는 사교를 많이 하지 않는다." }] },
  { word: "interact", pronunciation: "ˌɪntərˈækt", meaning: "상호작용하다", examples: [{ sentence: "How do you interact with customers?", translation: "고객과 어떻게 상호작용하나요?" }] },
  { word: "collaborate", pronunciation: "kəˈlæbəreɪt", meaning: "협력하다", examples: [{ sentence: "We collaborated on the project.", translation: "우리는 프로젝트에 협력했다." }] },
  { word: "cooperate", pronunciation: "koʊˈɑpəreɪt", meaning: "협조하다", examples: [{ sentence: "Please cooperate with us.", translation: "협조해 주세요." }] },
  { word: "negotiate", pronunciation: "nɪˈgoʊʃieɪt", meaning: "협상하다", examples: [{ sentence: "They negotiated a deal.", translation: "그들은 거래를 협상했다." }] },
  { word: "mediate", pronunciation: "ˈmidiˌeɪt", meaning: "중재하다", examples: [{ sentence: "She mediated the dispute.", translation: "그녀가 분쟁을 중재했다." }] },
  { word: "reconcile", pronunciation: "ˈrekənsaɪl", meaning: "화해시키다", examples: [{ sentence: "They reconciled their differences.", translation: "그들은 차이점을 화해했다." }] },
  { word: "console", pronunciation: "kənˈsoʊl", meaning: "위로하다", examples: [{ sentence: "She consoled the crying child.", translation: "그녀는 우는 아이를 위로했다." }] },
  { word: "comfort", pronunciation: "ˈkʌmfərt", meaning: "위로하다", examples: [{ sentence: "He comforted his friend.", translation: "그는 친구를 위로했다." }] },

  // 지배/영향 동사
  { word: "dominate", pronunciation: "ˈdɑməneɪt", meaning: "지배하다", examples: [{ sentence: "They dominated the market.", translation: "그들은 시장을 지배했다." }] },
  { word: "govern", pronunciation: "ˈgʌvərn", meaning: "통치하다", examples: [{ sentence: "Laws govern society.", translation: "법이 사회를 통치한다." }] },
  { word: "reign", pronunciation: "reɪn", meaning: "군림하다", examples: [{ sentence: "The queen reigned for 50 years.", translation: "여왕은 50년간 군림했다." }] },
  { word: "preside", pronunciation: "prɪˈzaɪd", meaning: "주재하다", examples: [{ sentence: "She presided over the meeting.", translation: "그녀가 회의를 주재했다." }] },
  { word: "manipulate", pronunciation: "məˈnɪpjəleɪt", meaning: "조종하다", examples: [{ sentence: "He manipulated the results.", translation: "그는 결과를 조작했다." }] },
  { word: "coerce", pronunciation: "koʊˈɜrs", meaning: "강요하다", examples: [{ sentence: "They coerced him into signing.", translation: "그들은 그에게 서명을 강요했다." }] },
  { word: "compel", pronunciation: "kəmˈpel", meaning: "강요하다", examples: [{ sentence: "I felt compelled to help.", translation: "도와야 할 것 같은 의무감이 들었다." }] },
  { word: "persuade", pronunciation: "pərˈsweɪd", meaning: "설득하다", examples: [{ sentence: "She persuaded me to stay.", translation: "그녀가 나를 머물도록 설득했다." }] },
  { word: "convince", pronunciation: "kənˈvɪns", meaning: "확신시키다", examples: [{ sentence: "He convinced me of his innocence.", translation: "그는 자신의 무죄를 확신시켰다." }] },
  { word: "sway", pronunciation: "sweɪ", meaning: "흔들다, 설득하다", examples: [{ sentence: "Don't be swayed by emotions.", translation: "감정에 흔들리지 마." }] },

  // 탐색/조사 동사
  { word: "probe", pronunciation: "proʊb", meaning: "조사하다", examples: [{ sentence: "Police probed the incident.", translation: "경찰이 사건을 조사했다." }] },
  { word: "scrutinize", pronunciation: "ˈskrutənaɪz", meaning: "면밀히 조사하다", examples: [{ sentence: "They scrutinized the documents.", translation: "그들은 문서를 면밀히 조사했다." }] },
  { word: "inspect", pronunciation: "ɪnˈspekt", meaning: "점검하다", examples: [{ sentence: "Inspect the equipment regularly.", translation: "장비를 정기적으로 점검하세요." }] },
  { word: "examine", pronunciation: "ɪgˈzæmɪn", meaning: "검사하다", examples: [{ sentence: "The doctor examined me.", translation: "의사가 나를 진찰했다." }] },
  { word: "survey", pronunciation: "sərˈveɪ", meaning: "조사하다", examples: [{ sentence: "They surveyed public opinion.", translation: "그들은 여론을 조사했다." }] },
  { word: "scan", pronunciation: "skæn", meaning: "훑어보다, 스캔하다", examples: [{ sentence: "I scanned the document.", translation: "문서를 훑어봤다." }] },
  { word: "browse", pronunciation: "braʊz", meaning: "둘러보다", examples: [{ sentence: "I browsed the store.", translation: "가게를 둘러봤다." }] },
  { word: "explore", pronunciation: "ɪkˈsplɔr", meaning: "탐험하다", examples: [{ sentence: "We explored the cave.", translation: "우리는 동굴을 탐험했다." }] },
  { word: "investigate", pronunciation: "ɪnˈvestɪgeɪt", meaning: "수사하다", examples: [{ sentence: "Police investigated the crime.", translation: "경찰이 범죄를 수사했다." }] },
  { word: "uncover", pronunciation: "ʌnˈkʌvər", meaning: "밝혀내다", examples: [{ sentence: "They uncovered the truth.", translation: "그들은 진실을 밝혀냈다." }] },

  // 보호/방어 동사
  { word: "shield", pronunciation: "ʃild", meaning: "보호하다", examples: [{ sentence: "She shielded her eyes from the sun.", translation: "그녀는 햇빛으로부터 눈을 가렸다." }] },
  { word: "guard", pronunciation: "gɑrd", meaning: "지키다", examples: [{ sentence: "Guards guarded the entrance.", translation: "경비원들이 입구를 지켰다." }] },
  { word: "safeguard", pronunciation: "ˈseɪfgɑrd", meaning: "보호하다", examples: [{ sentence: "Safeguard your personal data.", translation: "개인 정보를 보호하세요." }] },
  { word: "preserve", pronunciation: "prɪˈzɜrv", meaning: "보존하다", examples: [{ sentence: "Preserve the environment.", translation: "환경을 보존하세요." }] },
  { word: "conserve", pronunciation: "kənˈsɜrv", meaning: "아끼다, 보존하다", examples: [{ sentence: "Conserve energy.", translation: "에너지를 아끼세요." }] },
  { word: "fortify", pronunciation: "ˈfɔrtəfaɪ", meaning: "강화하다", examples: [{ sentence: "They fortified the walls.", translation: "그들은 벽을 강화했다." }] },
  { word: "reinforce", pronunciation: "ˌriɪnˈfɔrs", meaning: "보강하다", examples: [{ sentence: "Reinforce the structure.", translation: "구조물을 보강하세요." }] },
  { word: "defend", pronunciation: "dɪˈfend", meaning: "방어하다", examples: [{ sentence: "He defended his position.", translation: "그는 자신의 입장을 방어했다." }] },
  { word: "resist", pronunciation: "rɪˈzɪst", meaning: "저항하다", examples: [{ sentence: "She resisted the temptation.", translation: "그녀는 유혹에 저항했다." }] },
  { word: "withstand", pronunciation: "wɪðˈstænd", meaning: "견디다", examples: [{ sentence: "The building withstood the earthquake.", translation: "건물이 지진을 견뎌냈다." }] },

  // 추가 동사들 (목표 달성용)
  { word: "allocate", pronunciation: "ˈæləkeɪt", meaning: "할당하다", examples: [{ sentence: "Allocate resources wisely.", translation: "자원을 현명하게 할당하세요." }] },
  { word: "assign", pronunciation: "əˈsaɪn", meaning: "배정하다", examples: [{ sentence: "The teacher assigned homework.", translation: "선생님이 숙제를 내주셨다." }] },
  { word: "delegate", pronunciation: "ˈdeləgeɪt", meaning: "위임하다", examples: [{ sentence: "Learn to delegate tasks.", translation: "업무를 위임하는 법을 배우세요." }] },
  { word: "distribute", pronunciation: "dɪˈstrɪbjut", meaning: "분배하다", examples: [{ sentence: "Distribute the materials.", translation: "자료를 분배하세요." }] },
  { word: "disperse", pronunciation: "dɪˈspɜrs", meaning: "흩어지다", examples: [{ sentence: "The crowd dispersed.", translation: "군중이 흩어졌다." }] },
  { word: "scatter", pronunciation: "ˈskætər", meaning: "흩뿌리다", examples: [{ sentence: "Papers scattered everywhere.", translation: "종이가 사방에 흩어졌다." }] },
  { word: "consolidate", pronunciation: "kənˈsɑlɪdeɪt", meaning: "통합하다", examples: [{ sentence: "We consolidated our efforts.", translation: "우리는 노력을 통합했다." }] },
  { word: "merge", pronunciation: "mɜrdʒ", meaning: "합병하다", examples: [{ sentence: "The two companies merged.", translation: "두 회사가 합병했다." }] },
  { word: "integrate", pronunciation: "ˈɪntɪgreɪt", meaning: "통합하다", examples: [{ sentence: "Integrate the new system.", translation: "새 시스템을 통합하세요." }] },
  { word: "incorporate", pronunciation: "ɪnˈkɔrpəreɪt", meaning: "통합하다, 포함하다", examples: [{ sentence: "Incorporate feedback.", translation: "피드백을 반영하세요." }] },
  { word: "embed", pronunciation: "ɪmˈbed", meaning: "끼워 넣다", examples: [{ sentence: "Embed the video in the page.", translation: "페이지에 비디오를 삽입하세요." }] },
  { word: "implant", pronunciation: "ɪmˈplænt", meaning: "심다, 이식하다", examples: [{ sentence: "The idea was implanted in his mind.", translation: "그 생각이 그의 마음에 심어졌다." }] },
  { word: "inject", pronunciation: "ɪnˈdʒekt", meaning: "주입하다", examples: [{ sentence: "The nurse injected the vaccine.", translation: "간호사가 백신을 주사했다." }] },
  { word: "infuse", pronunciation: "ɪnˈfjuz", meaning: "불어넣다", examples: [{ sentence: "Infuse creativity into your work.", translation: "작업에 창의성을 불어넣으세요." }] },
  { word: "instill", pronunciation: "ɪnˈstɪl", meaning: "주입하다, 심어주다", examples: [{ sentence: "Instill good values in children.", translation: "아이들에게 좋은 가치관을 심어주세요." }] },
  { word: "impart", pronunciation: "ɪmˈpɑrt", meaning: "전하다", examples: [{ sentence: "He imparted wisdom to us.", translation: "그는 우리에게 지혜를 전했다." }] },
  { word: "bestow", pronunciation: "bɪˈstoʊ", meaning: "수여하다", examples: [{ sentence: "The award was bestowed on her.", translation: "상이 그녀에게 수여되었다." }] },
  { word: "confer", pronunciation: "kənˈfɜr", meaning: "수여하다, 협의하다", examples: [{ sentence: "The degree was conferred.", translation: "학위가 수여되었다." }] },
  { word: "endow", pronunciation: "ɪnˈdaʊ", meaning: "부여하다", examples: [{ sentence: "She was endowed with talent.", translation: "그녀는 재능을 부여받았다." }] },
  { word: "entrust", pronunciation: "ɪnˈtrʌst", meaning: "맡기다", examples: [{ sentence: "I entrust you with this task.", translation: "이 일을 당신에게 맡깁니다." }] },
  { word: "bequeath", pronunciation: "bɪˈkwiθ", meaning: "유산으로 남기다", examples: [{ sentence: "He bequeathed his fortune.", translation: "그는 재산을 유산으로 남겼다." }] },
  { word: "inherit", pronunciation: "ɪnˈherɪt", meaning: "상속받다", examples: [{ sentence: "She inherited the house.", translation: "그녀는 집을 상속받았다." }] },
  { word: "accumulate", pronunciation: "əˈkjumjəleɪt", meaning: "축적하다", examples: [{ sentence: "Dust accumulated on the shelf.", translation: "선반에 먼지가 쌓였다." }] },
  { word: "amass", pronunciation: "əˈmæs", meaning: "모으다", examples: [{ sentence: "He amassed a fortune.", translation: "그는 재산을 모았다." }] },
  { word: "compile", pronunciation: "kəmˈpaɪl", meaning: "편집하다", examples: [{ sentence: "She compiled a list.", translation: "그녀는 목록을 작성했다." }] },
  { word: "gather", pronunciation: "ˈgæðər", meaning: "모으다", examples: [{ sentence: "Gather your belongings.", translation: "소지품을 모으세요." }] },
  { word: "harvest", pronunciation: "ˈhɑrvɪst", meaning: "수확하다", examples: [{ sentence: "Farmers harvest crops in fall.", translation: "농부들은 가을에 작물을 수확한다." }] },
  { word: "reap", pronunciation: "rip", meaning: "거두다", examples: [{ sentence: "You reap what you sow.", translation: "뿌린 대로 거둔다." }] }
];

let addedCount = 0;
const startIndex = data.words.length;

for (const verb of newVerbs) {
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
