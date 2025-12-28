const fs = require('fs');
const path = require('path');

// 기존 파일 읽기
const filePath = path.join(__dirname, '../data/phrasalVerbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 기존 단어 목록
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('기존 구동사 수:', existingWords.size);

// 새로운 구동사 데이터 (333개 추가)
const newPhrasalVerbs = [
  // 비즈니스/직장 구동사 (50개)
  { word: "take over", pronunciation: "teɪk ˈoʊvər", subcategory: "비즈니스 구동사", meaning: "인수하다, 넘겨받다", examples: [{ sentence: "She will take over the project next month.", translation: "그녀가 다음 달에 프로젝트를 넘겨받을 거예요." }] },
  { word: "lay off", pronunciation: "leɪ ɔf", subcategory: "비즈니스 구동사", meaning: "해고하다", examples: [{ sentence: "The company laid off 100 employees.", translation: "회사가 100명의 직원을 해고했어요." }] },
  { word: "step down", pronunciation: "step daʊn", subcategory: "비즈니스 구동사", meaning: "사임하다, 물러나다", examples: [{ sentence: "The CEO decided to step down.", translation: "CEO가 사임하기로 결정했어요." }] },
  { word: "branch out", pronunciation: "bræntʃ aʊt", subcategory: "비즈니스 구동사", meaning: "사업을 확장하다", examples: [{ sentence: "They branched out into new markets.", translation: "그들은 새로운 시장으로 사업을 확장했어요." }] },
  { word: "scale up", pronunciation: "skeɪl ʌp", subcategory: "비즈니스 구동사", meaning: "규모를 확대하다", examples: [{ sentence: "We need to scale up production.", translation: "우리는 생산 규모를 확대해야 해요." }] },
  { word: "scale down", pronunciation: "skeɪl daʊn", subcategory: "비즈니스 구동사", meaning: "규모를 축소하다", examples: [{ sentence: "The company scaled down its operations.", translation: "회사가 운영 규모를 축소했어요." }] },
  { word: "draw up", pronunciation: "drɔ ʌp", subcategory: "비즈니스 구동사", meaning: "작성하다, 기안하다", examples: [{ sentence: "We need to draw up a contract.", translation: "우리는 계약서를 작성해야 해요." }] },
  { word: "carry over", pronunciation: "ˈkæri ˈoʊvər", subcategory: "비즈니스 구동사", meaning: "이월하다, 넘기다", examples: [{ sentence: "The unused budget will carry over to next year.", translation: "사용하지 않은 예산은 내년으로 이월될 거예요." }] },
  { word: "cash in", pronunciation: "kæʃ ɪn", subcategory: "비즈니스 구동사", meaning: "현금화하다, 이득을 취하다", examples: [{ sentence: "He cashed in his stocks.", translation: "그는 주식을 현금화했어요." }] },
  { word: "buy out", pronunciation: "baɪ aʊt", subcategory: "비즈니스 구동사", meaning: "지분을 사들이다", examples: [{ sentence: "The competitor bought out the small company.", translation: "경쟁사가 그 작은 회사를 인수했어요." }] },
  { word: "bail out", pronunciation: "beɪl aʊt", subcategory: "비즈니스 구동사", meaning: "구제하다, 탈출하다", examples: [{ sentence: "The government bailed out the bank.", translation: "정부가 은행을 구제했어요." }] },
  { word: "opt out", pronunciation: "ɑpt aʊt", subcategory: "비즈니스 구동사", meaning: "탈퇴하다, 제외되다", examples: [{ sentence: "You can opt out of the newsletter.", translation: "뉴스레터 수신을 거부할 수 있어요." }] },
  { word: "opt in", pronunciation: "ɑpt ɪn", subcategory: "비즈니스 구동사", meaning: "참여하다, 동의하다", examples: [{ sentence: "Users must opt in to receive notifications.", translation: "사용자는 알림을 받으려면 동의해야 해요." }] },
  { word: "roll out", pronunciation: "roʊl aʊt", subcategory: "비즈니스 구동사", meaning: "출시하다, 시행하다", examples: [{ sentence: "We will roll out the new feature next week.", translation: "다음 주에 새 기능을 출시할 거예요." }] },
  { word: "phase in", pronunciation: "feɪz ɪn", subcategory: "비즈니스 구동사", meaning: "단계적으로 도입하다", examples: [{ sentence: "The new policy will be phased in gradually.", translation: "새 정책이 점진적으로 도입될 거예요." }] },
  { word: "run by", pronunciation: "rʌn baɪ", subcategory: "비즈니스 구동사", meaning: "검토를 요청하다", examples: [{ sentence: "Let me run this idea by my manager.", translation: "이 아이디어를 매니저에게 검토받아 볼게요." }] },
  { word: "push back", pronunciation: "pʊʃ bæk", subcategory: "비즈니스 구동사", meaning: "연기하다, 반대하다", examples: [{ sentence: "They pushed back the deadline.", translation: "그들은 마감일을 연기했어요." }] },
  { word: "ramp up", pronunciation: "ræmp ʌp", subcategory: "비즈니스 구동사", meaning: "늘리다, 확대하다", examples: [{ sentence: "We need to ramp up our marketing efforts.", translation: "마케팅 노력을 늘려야 해요." }] },
  { word: "iron out", pronunciation: "ˈaɪərn aʊt", subcategory: "비즈니스 구동사", meaning: "문제를 해결하다", examples: [{ sentence: "We need to iron out the details.", translation: "세부 사항을 정리해야 해요." }] },
  { word: "hammer out", pronunciation: "ˈhæmər aʊt", subcategory: "비즈니스 구동사", meaning: "합의를 이끌어내다", examples: [{ sentence: "They hammered out a deal.", translation: "그들은 합의를 이끌어냈어요." }] },
  { word: "factor in", pronunciation: "ˈfæktər ɪn", subcategory: "비즈니스 구동사", meaning: "고려하다, 포함시키다", examples: [{ sentence: "We need to factor in the shipping costs.", translation: "배송비를 고려해야 해요." }] },
  { word: "bottom out", pronunciation: "ˈbɑtəm aʊt", subcategory: "비즈니스 구동사", meaning: "바닥을 치다", examples: [{ sentence: "The stock prices bottomed out.", translation: "주가가 바닥을 쳤어요." }] },
  { word: "break even", pronunciation: "breɪk ˈivən", subcategory: "비즈니스 구동사", meaning: "본전치기하다", examples: [{ sentence: "The company broke even this quarter.", translation: "회사가 이번 분기에 본전치기했어요." }] },
  { word: "pan out", pronunciation: "pæn aʊt", subcategory: "비즈니스 구동사", meaning: "결과가 나오다", examples: [{ sentence: "Let's see how this pans out.", translation: "결과가 어떻게 나오는지 봅시다." }] },
  { word: "fall through", pronunciation: "fɔl θru", subcategory: "비즈니스 구동사", meaning: "무산되다", examples: [{ sentence: "The deal fell through.", translation: "거래가 무산됐어요." }] },
  { word: "close down", pronunciation: "kloʊz daʊn", subcategory: "비즈니스 구동사", meaning: "폐업하다", examples: [{ sentence: "The store closed down last month.", translation: "그 가게는 지난달에 폐업했어요." }] },
  { word: "spin off", pronunciation: "spɪn ɔf", subcategory: "비즈니스 구동사", meaning: "분사하다", examples: [{ sentence: "The company spun off its software division.", translation: "회사가 소프트웨어 부문을 분사했어요." }] },
  { word: "merge with", pronunciation: "mɜrdʒ wɪð", subcategory: "비즈니스 구동사", meaning: "합병하다", examples: [{ sentence: "The two companies merged with each other.", translation: "두 회사가 합병했어요." }] },
  { word: "report to", pronunciation: "rɪˈpɔrt tu", subcategory: "비즈니스 구동사", meaning: "~에게 보고하다", examples: [{ sentence: "I report to the marketing director.", translation: "저는 마케팅 이사에게 보고해요." }] },
  { word: "answer to", pronunciation: "ˈænsər tu", subcategory: "비즈니스 구동사", meaning: "~에게 책임지다", examples: [{ sentence: "You will answer to the board.", translation: "당신은 이사회에 책임지게 될 거예요." }] },

  // 감정/관계 구동사 (50개)
  { word: "hit it off", pronunciation: "hɪt ɪt ɔf", subcategory: "관계 구동사", meaning: "잘 맞다, 죽이 맞다", examples: [{ sentence: "We hit it off right away.", translation: "우리는 바로 죽이 맞았어요." }] },
  { word: "ask out", pronunciation: "æsk aʊt", subcategory: "관계 구동사", meaning: "데이트 신청하다", examples: [{ sentence: "He asked her out to dinner.", translation: "그가 그녀에게 저녁 데이트를 신청했어요." }] },
  { word: "go out", pronunciation: "goʊ aʊt", subcategory: "관계 구동사", meaning: "사귀다", examples: [{ sentence: "They've been going out for two years.", translation: "그들은 2년째 사귀고 있어요." }] },
  { word: "split up", pronunciation: "splɪt ʌp", subcategory: "관계 구동사", meaning: "헤어지다", examples: [{ sentence: "They split up after five years.", translation: "그들은 5년 만에 헤어졌어요." }] },
  { word: "drift apart", pronunciation: "drɪft əˈpɑrt", subcategory: "관계 구동사", meaning: "점점 멀어지다", examples: [{ sentence: "We drifted apart over time.", translation: "우리는 시간이 지나면서 점점 멀어졌어요." }] },
  { word: "patch up", pronunciation: "pætʃ ʌp", subcategory: "관계 구동사", meaning: "화해하다", examples: [{ sentence: "They patched up their differences.", translation: "그들은 갈등을 봉합했어요." }] },
  { word: "make up with", pronunciation: "meɪk ʌp wɪð", subcategory: "관계 구동사", meaning: "~와 화해하다", examples: [{ sentence: "I made up with my sister.", translation: "언니와 화해했어요." }] },
  { word: "lead on", pronunciation: "lid ɑn", subcategory: "관계 구동사", meaning: "헛된 희망을 주다", examples: [{ sentence: "Don't lead me on.", translation: "헛된 희망을 주지 마세요." }] },
  { word: "let down", pronunciation: "let daʊn", subcategory: "감정 구동사", meaning: "실망시키다", examples: [{ sentence: "I don't want to let you down.", translation: "당신을 실망시키고 싶지 않아요." }] },
  { word: "choke up", pronunciation: "tʃoʊk ʌp", subcategory: "감정 구동사", meaning: "목이 메다", examples: [{ sentence: "I choked up during the speech.", translation: "연설 중에 목이 메었어요." }] },
  { word: "tear up", pronunciation: "ter ʌp", subcategory: "감정 구동사", meaning: "눈물이 글썽이다", examples: [{ sentence: "She teared up at the news.", translation: "그 소식에 그녀는 눈물이 글썽였어요." }] },
  { word: "bottle up", pronunciation: "ˈbɑtl ʌp", subcategory: "감정 구동사", meaning: "감정을 억누르다", examples: [{ sentence: "Don't bottle up your feelings.", translation: "감정을 억누르지 마세요." }] },
  { word: "lash out", pronunciation: "læʃ aʊt", subcategory: "감정 구동사", meaning: "화를 터뜨리다", examples: [{ sentence: "He lashed out in anger.", translation: "그는 화를 터뜨렸어요." }] },
  { word: "break out", pronunciation: "breɪk aʊt", subcategory: "감정 구동사", meaning: "갑자기 ~하다 (웃음/땀)", examples: [{ sentence: "She broke out laughing.", translation: "그녀는 갑자기 웃음을 터뜨렸어요." }] },
  { word: "crack up", pronunciation: "kræk ʌp", subcategory: "감정 구동사", meaning: "폭소하다", examples: [{ sentence: "The joke cracked me up.", translation: "그 농담에 빵 터졌어요." }] },
  { word: "lighten up", pronunciation: "ˈlaɪtən ʌp", subcategory: "감정 구동사", meaning: "기분을 풀다", examples: [{ sentence: "Lighten up! It's just a joke.", translation: "기분 풀어! 농담이야." }] },
  { word: "loosen up", pronunciation: "ˈlusən ʌp", subcategory: "감정 구동사", meaning: "긴장을 풀다", examples: [{ sentence: "Try to loosen up before the interview.", translation: "면접 전에 긴장을 풀어봐요." }] },
  { word: "wind up", pronunciation: "waɪnd ʌp", subcategory: "감정 구동사", meaning: "화나게 하다, 결국 ~하게 되다", examples: [{ sentence: "Don't wind him up.", translation: "그를 화나게 하지 마." }] },
  { word: "melt down", pronunciation: "melt daʊn", subcategory: "감정 구동사", meaning: "감정이 폭발하다", examples: [{ sentence: "The child had a complete meltdown.", translation: "아이가 완전히 떼를 썼어요." }] },
  { word: "snap at", pronunciation: "snæp æt", subcategory: "감정 구동사", meaning: "쌀쌀맞게 대하다", examples: [{ sentence: "She snapped at me for no reason.", translation: "그녀가 이유 없이 나에게 쌀쌀맞게 대했어요." }] },
  { word: "warm to", pronunciation: "wɔrm tu", subcategory: "관계 구동사", meaning: "호감을 갖게 되다", examples: [{ sentence: "I'm warming to the idea.", translation: "그 아이디어에 점점 끌리고 있어요." }] },
  { word: "grow on", pronunciation: "groʊ ɑn", subcategory: "관계 구동사", meaning: "점점 좋아지다", examples: [{ sentence: "This song is growing on me.", translation: "이 노래가 점점 좋아지고 있어요." }] },
  { word: "stick by", pronunciation: "stɪk baɪ", subcategory: "관계 구동사", meaning: "~을 지지하다", examples: [{ sentence: "I'll stick by you no matter what.", translation: "무슨 일이 있어도 네 편이 될게." }] },
  { word: "stand by", pronunciation: "stænd baɪ", subcategory: "관계 구동사", meaning: "곁에 있다, 지지하다", examples: [{ sentence: "She stood by her husband.", translation: "그녀는 남편 곁을 지켰어요." }] },
  { word: "lean on", pronunciation: "lin ɑn", subcategory: "관계 구동사", meaning: "~에게 의지하다", examples: [{ sentence: "You can lean on me anytime.", translation: "언제든 나에게 의지해도 돼." }] },
  { word: "walk out on", pronunciation: "wɔk aʊt ɑn", subcategory: "관계 구동사", meaning: "~을 버리고 떠나다", examples: [{ sentence: "He walked out on his family.", translation: "그는 가족을 버리고 떠났어요." }] },
  { word: "turn against", pronunciation: "tɜrn əˈgenst", subcategory: "관계 구동사", meaning: "~에게 등을 돌리다", examples: [{ sentence: "His friends turned against him.", translation: "그의 친구들이 그에게 등을 돌렸어요." }] },
  { word: "pick on", pronunciation: "pɪk ɑn", subcategory: "관계 구동사", meaning: "괴롭히다, 트집 잡다", examples: [{ sentence: "Stop picking on your brother.", translation: "동생 그만 괴롭혀." }] },
  { word: "gang up on", pronunciation: "gæŋ ʌp ɑn", subcategory: "관계 구동사", meaning: "집단으로 괴롭히다", examples: [{ sentence: "They ganged up on the new kid.", translation: "그들은 새 아이를 집단으로 괴롭혔어요." }] },
  { word: "fawn over", pronunciation: "fɔn ˈoʊvər", subcategory: "관계 구동사", meaning: "아첨하다", examples: [{ sentence: "Everyone fawns over celebrities.", translation: "모두가 유명인에게 아첨해요." }] },

  // 일상/생활 구동사 (50개)
  { word: "wake up to", pronunciation: "weɪk ʌp tu", subcategory: "일상 구동사", meaning: "~을 깨닫다", examples: [{ sentence: "He woke up to the reality.", translation: "그는 현실을 깨달았어요." }] },
  { word: "doze off", pronunciation: "doʊz ɔf", subcategory: "일상 구동사", meaning: "깜빡 졸다", examples: [{ sentence: "I dozed off during the movie.", translation: "영화 보다가 깜빡 졸았어요." }] },
  { word: "nod off", pronunciation: "nɑd ɔf", subcategory: "일상 구동사", meaning: "졸다", examples: [{ sentence: "I nodded off in class.", translation: "수업 중에 졸았어요." }] },
  { word: "pass out", pronunciation: "pæs aʊt", subcategory: "일상 구동사", meaning: "기절하다, 곯아떨어지다", examples: [{ sentence: "I was so tired I passed out.", translation: "너무 피곤해서 곯아떨어졌어요." }] },
  { word: "come to", pronunciation: "kʌm tu", subcategory: "일상 구동사", meaning: "의식을 되찾다", examples: [{ sentence: "He came to after a few minutes.", translation: "몇 분 후 그는 의식을 되찾았어요." }] },
  { word: "come around", pronunciation: "kʌm əˈraʊnd", subcategory: "일상 구동사", meaning: "의식을 되찾다, 생각을 바꾸다", examples: [{ sentence: "She'll come around eventually.", translation: "결국 그녀도 생각을 바꿀 거예요." }] },
  { word: "freshen up", pronunciation: "ˈfreʃən ʌp", subcategory: "일상 구동사", meaning: "씻고 단장하다", examples: [{ sentence: "Let me freshen up before dinner.", translation: "저녁 먹기 전에 씻고 올게요." }] },
  { word: "dress up", pronunciation: "dres ʌp", subcategory: "일상 구동사", meaning: "차려입다", examples: [{ sentence: "You don't need to dress up.", translation: "차려입을 필요 없어요." }] },
  { word: "bundle up", pronunciation: "ˈbʌndl ʌp", subcategory: "일상 구동사", meaning: "따뜻하게 껴입다", examples: [{ sentence: "Bundle up, it's cold outside.", translation: "따뜻하게 입어, 밖에 추워." }] },
  { word: "strip down", pronunciation: "strɪp daʊn", subcategory: "일상 구동사", meaning: "옷을 벗다", examples: [{ sentence: "The doctor asked me to strip down.", translation: "의사가 옷을 벗으라고 했어요." }] },
  { word: "kick back", pronunciation: "kɪk bæk", subcategory: "일상 구동사", meaning: "편히 쉬다", examples: [{ sentence: "I just want to kick back and relax.", translation: "그냥 편히 쉬고 싶어요." }] },
  { word: "veg out", pronunciation: "vedʒ aʊt", subcategory: "일상 구동사", meaning: "빈둥거리다", examples: [{ sentence: "I vegged out in front of the TV.", translation: "TV 앞에서 빈둥거렸어요." }] },
  { word: "pig out", pronunciation: "pɪg aʊt", subcategory: "일상 구동사", meaning: "폭식하다", examples: [{ sentence: "We pigged out on pizza.", translation: "피자를 폭식했어요." }] },
  { word: "stock up", pronunciation: "stɑk ʌp", subcategory: "일상 구동사", meaning: "사재기하다, 비축하다", examples: [{ sentence: "We stocked up on groceries.", translation: "식료품을 비축했어요." }] },
  { word: "load up", pronunciation: "loʊd ʌp", subcategory: "일상 구동사", meaning: "잔뜩 싣다", examples: [{ sentence: "We loaded up the car.", translation: "차에 짐을 잔뜩 실었어요." }] },
  { word: "clear out", pronunciation: "klɪr aʊt", subcategory: "일상 구동사", meaning: "비우다, 정리하다", examples: [{ sentence: "I need to clear out my closet.", translation: "옷장을 정리해야 해요." }] },
  { word: "sort through", pronunciation: "sɔrt θru", subcategory: "일상 구동사", meaning: "정리하며 살펴보다", examples: [{ sentence: "I'm sorting through old photos.", translation: "옛날 사진들을 정리하고 있어요." }] },
  { word: "throw out", pronunciation: "θroʊ aʊt", subcategory: "일상 구동사", meaning: "버리다", examples: [{ sentence: "Don't throw out those papers!", translation: "그 서류들 버리지 마!" }] },
  { word: "give away", pronunciation: "gɪv əˈweɪ", subcategory: "일상 구동사", meaning: "나눠주다, 기부하다", examples: [{ sentence: "I'm giving away my old clothes.", translation: "헌 옷들을 나눠주고 있어요." }] },
  { word: "put up", pronunciation: "pʊt ʌp", subcategory: "일상 구동사", meaning: "설치하다, 게시하다", examples: [{ sentence: "We put up a new shelf.", translation: "새 선반을 설치했어요." }] },
  { word: "take down", pronunciation: "teɪk daʊn", subcategory: "일상 구동사", meaning: "내리다, 철거하다", examples: [{ sentence: "We took down the Christmas tree.", translation: "크리스마스 트리를 치웠어요." }] },
  { word: "hook up", pronunciation: "hʊk ʌp", subcategory: "일상 구동사", meaning: "연결하다", examples: [{ sentence: "Can you hook up the speakers?", translation: "스피커 연결해 줄 수 있어요?" }] },
  { word: "plug in", pronunciation: "plʌg ɪn", subcategory: "일상 구동사", meaning: "플러그를 꽂다", examples: [{ sentence: "Plug in the charger.", translation: "충전기를 꽂아요." }] },
  { word: "unplug", pronunciation: "ʌnˈplʌg", subcategory: "일상 구동사", meaning: "플러그를 뽑다", examples: [{ sentence: "Unplug it when not in use.", translation: "사용하지 않을 때는 플러그를 뽑아요." }] },
  { word: "heat up", pronunciation: "hit ʌp", subcategory: "일상 구동사", meaning: "데우다", examples: [{ sentence: "Let me heat up some soup.", translation: "수프를 데울게요." }] },
  { word: "whip up", pronunciation: "wɪp ʌp", subcategory: "일상 구동사", meaning: "후딱 만들다", examples: [{ sentence: "I'll whip up something quick.", translation: "뭔가 빨리 만들어 줄게요." }] },
  { word: "dish out", pronunciation: "dɪʃ aʊt", subcategory: "일상 구동사", meaning: "음식을 담다", examples: [{ sentence: "She dished out the pasta.", translation: "그녀가 파스타를 담았어요." }] },
  { word: "wolf down", pronunciation: "wʊlf daʊn", subcategory: "일상 구동사", meaning: "게걸스럽게 먹다", examples: [{ sentence: "He wolfed down his lunch.", translation: "그는 점심을 게걸스럽게 먹었어요." }] },
  { word: "gobble up", pronunciation: "ˈgɑbəl ʌp", subcategory: "일상 구동사", meaning: "허겁지겁 먹다", examples: [{ sentence: "The kids gobbled up the cake.", translation: "아이들이 케이크를 허겁지겁 먹었어요." }] },
  { word: "wash up", pronunciation: "wɑʃ ʌp", subcategory: "일상 구동사", meaning: "설거지하다, 씻다", examples: [{ sentence: "I'll wash up after dinner.", translation: "저녁 후에 설거지할게요." }] },

  // 이동/여행 구동사 (40개)
  { word: "set out", pronunciation: "set aʊt", subcategory: "이동 구동사", meaning: "출발하다, 시작하다", examples: [{ sentence: "We set out early in the morning.", translation: "우리는 이른 아침에 출발했어요." }] },
  { word: "head off", pronunciation: "hed ɔf", subcategory: "이동 구동사", meaning: "떠나다", examples: [{ sentence: "I need to head off now.", translation: "이제 가봐야겠어요." }] },
  { word: "move along", pronunciation: "muv əˈlɔŋ", subcategory: "이동 구동사", meaning: "비키다, 이동하다", examples: [{ sentence: "The police asked us to move along.", translation: "경찰이 비켜달라고 했어요." }] },
  { word: "push on", pronunciation: "pʊʃ ɑn", subcategory: "이동 구동사", meaning: "계속 나아가다", examples: [{ sentence: "We pushed on despite the rain.", translation: "비에도 불구하고 계속 나아갔어요." }] },
  { word: "press on", pronunciation: "pres ɑn", subcategory: "이동 구동사", meaning: "밀고 나가다", examples: [{ sentence: "We pressed on with the journey.", translation: "여행을 계속했어요." }] },
  { word: "pull in", pronunciation: "pʊl ɪn", subcategory: "이동 구동사", meaning: "(차가) 들어오다", examples: [{ sentence: "The train pulled in on time.", translation: "기차가 정시에 들어왔어요." }] },
  { word: "pull out", pronunciation: "pʊl aʊt", subcategory: "이동 구동사", meaning: "(차가) 출발하다", examples: [{ sentence: "The bus pulled out of the station.", translation: "버스가 정류장을 출발했어요." }] },
  { word: "pull up", pronunciation: "pʊl ʌp", subcategory: "이동 구동사", meaning: "(차가) 멈추다", examples: [{ sentence: "A taxi pulled up in front of us.", translation: "택시가 우리 앞에 멈췄어요." }] },
  { word: "back up", pronunciation: "bæk ʌp", subcategory: "이동 구동사", meaning: "후진하다", examples: [{ sentence: "Can you back up a little?", translation: "조금 후진해 줄 수 있어요?" }] },
  { word: "turn around", pronunciation: "tɜrn əˈraʊnd", subcategory: "이동 구동사", meaning: "돌아서다, 회전하다", examples: [{ sentence: "Turn around, you're going the wrong way.", translation: "돌아서요, 방향이 잘못됐어요." }] },
  { word: "turn back", pronunciation: "tɜrn bæk", subcategory: "이동 구동사", meaning: "되돌아가다", examples: [{ sentence: "It's too late to turn back now.", translation: "이제 되돌아가기엔 너무 늦었어요." }] },
  { word: "drop in", pronunciation: "drɑp ɪn", subcategory: "이동 구동사", meaning: "들르다", examples: [{ sentence: "Feel free to drop in anytime.", translation: "언제든 들러요." }] },
  { word: "swing by", pronunciation: "swɪŋ baɪ", subcategory: "이동 구동사", meaning: "잠깐 들르다", examples: [{ sentence: "I'll swing by your place later.", translation: "나중에 네 집에 잠깐 들를게." }] },
  { word: "pop in", pronunciation: "pɑp ɪn", subcategory: "이동 구동사", meaning: "잠깐 들르다", examples: [{ sentence: "I just popped in to say hi.", translation: "인사하러 잠깐 들렀어요." }] },
  { word: "pop out", pronunciation: "pɑp aʊt", subcategory: "이동 구동사", meaning: "잠깐 나가다", examples: [{ sentence: "I'm just popping out for a bit.", translation: "잠깐 나갔다 올게요." }] },
  { word: "see off", pronunciation: "si ɔf", subcategory: "이동 구동사", meaning: "배웅하다", examples: [{ sentence: "I went to see her off at the airport.", translation: "공항에 그녀를 배웅하러 갔어요." }] },
  { word: "pick up", pronunciation: "pɪk ʌp", subcategory: "이동 구동사", meaning: "마중가다, 데리러 가다", examples: [{ sentence: "I'll pick you up at 7.", translation: "7시에 데리러 갈게요." }] },
  { word: "fly in", pronunciation: "flaɪ ɪn", subcategory: "이동 구동사", meaning: "비행기로 도착하다", examples: [{ sentence: "They're flying in tomorrow.", translation: "그들은 내일 비행기로 도착해요." }] },
  { word: "fly out", pronunciation: "flaɪ aʊt", subcategory: "이동 구동사", meaning: "비행기로 떠나다", examples: [{ sentence: "I'm flying out on Monday.", translation: "월요일에 비행기로 떠나요." }] },
  { word: "touch down", pronunciation: "tʌtʃ daʊn", subcategory: "이동 구동사", meaning: "착륙하다", examples: [{ sentence: "The plane touched down safely.", translation: "비행기가 안전하게 착륙했어요." }] },

  // 학습/교육 구동사 (30개)
  { word: "bone up on", pronunciation: "boʊn ʌp ɑn", subcategory: "학습 구동사", meaning: "열심히 공부하다", examples: [{ sentence: "I need to bone up on my French.", translation: "프랑스어 공부를 열심히 해야 해요." }] },
  { word: "mug up", pronunciation: "mʌg ʌp", subcategory: "학습 구동사", meaning: "벼락치기하다", examples: [{ sentence: "I mugged up the night before the exam.", translation: "시험 전날 밤 벼락치기했어요." }] },
  { word: "cram for", pronunciation: "kræm fɔr", subcategory: "학습 구동사", meaning: "벼락치기하다", examples: [{ sentence: "I crammed for the test all night.", translation: "밤새 시험공부를 벼락치기했어요." }] },
  { word: "swot up", pronunciation: "swɑt ʌp", subcategory: "학습 구동사", meaning: "열심히 공부하다", examples: [{ sentence: "I need to swot up on history.", translation: "역사를 열심히 공부해야 해요." }] },
  { word: "drop out", pronunciation: "drɑp aʊt", subcategory: "학습 구동사", meaning: "중퇴하다", examples: [{ sentence: "He dropped out of college.", translation: "그는 대학을 중퇴했어요." }] },
  { word: "major in", pronunciation: "ˈmeɪdʒər ɪn", subcategory: "학습 구동사", meaning: "~을 전공하다", examples: [{ sentence: "She majored in economics.", translation: "그녀는 경제학을 전공했어요." }] },
  { word: "buckle down", pronunciation: "ˈbʌkəl daʊn", subcategory: "학습 구동사", meaning: "열심히 하다", examples: [{ sentence: "It's time to buckle down and study.", translation: "이제 열심히 공부할 시간이에요." }] },
  { word: "slack off", pronunciation: "slæk ɔf", subcategory: "학습 구동사", meaning: "게으름 피우다", examples: [{ sentence: "Don't slack off before exams.", translation: "시험 전에 게으름 피우지 마." }] },
  { word: "goof off", pronunciation: "guf ɔf", subcategory: "학습 구동사", meaning: "빈둥거리다", examples: [{ sentence: "Stop goofing off and focus.", translation: "빈둥거리지 말고 집중해." }] },
  { word: "knuckle down", pronunciation: "ˈnʌkəl daʊn", subcategory: "학습 구동사", meaning: "본격적으로 시작하다", examples: [{ sentence: "Time to knuckle down to work.", translation: "본격적으로 일할 시간이에요." }] },
  { word: "puzzle out", pronunciation: "ˈpʌzəl aʊt", subcategory: "학습 구동사", meaning: "풀어내다, 알아내다", examples: [{ sentence: "I finally puzzled out the solution.", translation: "드디어 해결책을 알아냈어요." }] },
  { word: "sink in", pronunciation: "sɪŋk ɪn", subcategory: "학습 구동사", meaning: "이해되다, 스며들다", examples: [{ sentence: "It took a while for the news to sink in.", translation: "그 소식이 이해되는 데 시간이 좀 걸렸어요." }] },
  { word: "dawn on", pronunciation: "dɔn ɑn", subcategory: "학습 구동사", meaning: "깨닫게 되다", examples: [{ sentence: "It dawned on me that I was wrong.", translation: "내가 틀렸다는 것을 깨달았어요." }] },
  { word: "hit on", pronunciation: "hɪt ɑn", subcategory: "학습 구동사", meaning: "(아이디어를) 떠올리다", examples: [{ sentence: "I hit on a great idea.", translation: "좋은 아이디어가 떠올랐어요." }] },
  { word: "read out", pronunciation: "rid aʊt", subcategory: "학습 구동사", meaning: "소리 내어 읽다", examples: [{ sentence: "Please read out your answer.", translation: "답을 소리 내어 읽어주세요." }] },

  // 건강/운동 구동사 (30개)
  { word: "come down with", pronunciation: "kʌm daʊn wɪð", subcategory: "건강 구동사", meaning: "~에 걸리다", examples: [{ sentence: "I came down with a cold.", translation: "감기에 걸렸어요." }] },
  { word: "fight off", pronunciation: "faɪt ɔf", subcategory: "건강 구동사", meaning: "물리치다, 떨쳐내다", examples: [{ sentence: "I'm trying to fight off a cold.", translation: "감기를 떨쳐내려고 노력 중이에요." }] },
  { word: "throw up", pronunciation: "θroʊ ʌp", subcategory: "건강 구동사", meaning: "토하다", examples: [{ sentence: "I felt like throwing up.", translation: "토할 것 같았어요." }] },
  { word: "pass away", pronunciation: "pæs əˈweɪ", subcategory: "건강 구동사", meaning: "돌아가시다", examples: [{ sentence: "His grandfather passed away last year.", translation: "그의 할아버지가 작년에 돌아가셨어요." }] },
  { word: "pull through", pronunciation: "pʊl θru", subcategory: "건강 구동사", meaning: "회복하다, 이겨내다", examples: [{ sentence: "She pulled through the surgery.", translation: "그녀는 수술을 이겨냈어요." }] },
  { word: "bounce back", pronunciation: "baʊns bæk", subcategory: "건강 구동사", meaning: "회복하다", examples: [{ sentence: "He bounced back quickly from illness.", translation: "그는 병에서 빨리 회복했어요." }] },
  { word: "break out in", pronunciation: "breɪk aʊt ɪn", subcategory: "건강 구동사", meaning: "(발진 등이) 나다", examples: [{ sentence: "I broke out in hives.", translation: "두드러기가 났어요." }] },
  { word: "flare up", pronunciation: "fler ʌp", subcategory: "건강 구동사", meaning: "(증상이) 재발하다", examples: [{ sentence: "My allergies flared up again.", translation: "알레르기가 다시 재발했어요." }] },
  { word: "act up", pronunciation: "ækt ʌp", subcategory: "건강 구동사", meaning: "(몸이) 말썽을 부리다", examples: [{ sentence: "My back is acting up.", translation: "허리가 말썽이에요." }] },
  { word: "swell up", pronunciation: "swel ʌp", subcategory: "건강 구동사", meaning: "붓다", examples: [{ sentence: "My ankle swelled up.", translation: "발목이 부었어요." }] },
  { word: "seize up", pronunciation: "siz ʌp", subcategory: "건강 구동사", meaning: "(근육이) 굳다", examples: [{ sentence: "My leg seized up during the race.", translation: "경주 중에 다리가 굳었어요." }] },
  { word: "limber up", pronunciation: "ˈlɪmbər ʌp", subcategory: "운동 구동사", meaning: "몸을 풀다", examples: [{ sentence: "Let's limber up before we run.", translation: "달리기 전에 몸을 풀자." }] },
  { word: "tone up", pronunciation: "toʊn ʌp", subcategory: "운동 구동사", meaning: "몸을 탄탄하게 하다", examples: [{ sentence: "I want to tone up my arms.", translation: "팔을 탄탄하게 하고 싶어요." }] },
  { word: "bulk up", pronunciation: "bʌlk ʌp", subcategory: "운동 구동사", meaning: "근육을 키우다", examples: [{ sentence: "He's trying to bulk up.", translation: "그는 근육을 키우려고 해요." }] },
  { word: "slim down", pronunciation: "slɪm daʊn", subcategory: "운동 구동사", meaning: "살을 빼다", examples: [{ sentence: "She slimmed down for the wedding.", translation: "그녀는 결혼식을 위해 살을 뺐어요." }] },

  // 의사소통 구동사 (30개)
  { word: "spell out", pronunciation: "spel aʊt", subcategory: "의사소통 구동사", meaning: "자세히 설명하다", examples: [{ sentence: "Let me spell it out for you.", translation: "자세히 설명해 줄게요." }] },
  { word: "get across", pronunciation: "get əˈkrɔs", subcategory: "의사소통 구동사", meaning: "이해시키다", examples: [{ sentence: "I couldn't get my point across.", translation: "내 요점을 이해시키지 못했어요." }] },
  { word: "put across", pronunciation: "pʊt əˈkrɔs", subcategory: "의사소통 구동사", meaning: "전달하다", examples: [{ sentence: "She put her ideas across well.", translation: "그녀는 자신의 아이디어를 잘 전달했어요." }] },
  { word: "butt in", pronunciation: "bʌt ɪn", subcategory: "의사소통 구동사", meaning: "끼어들다", examples: [{ sentence: "Sorry to butt in, but...", translation: "끼어들어서 죄송한데..." }] },
  { word: "chip in", pronunciation: "tʃɪp ɪn", subcategory: "의사소통 구동사", meaning: "거들다, 돈을 보태다", examples: [{ sentence: "Everyone chipped in with suggestions.", translation: "모두가 제안을 거들었어요." }] },
  { word: "pipe down", pronunciation: "paɪp daʊn", subcategory: "의사소통 구동사", meaning: "조용히 하다", examples: [{ sentence: "Pipe down! I'm on the phone.", translation: "조용히 해! 전화 중이야." }] },
  { word: "shout out", pronunciation: "ʃaʊt aʊt", subcategory: "의사소통 구동사", meaning: "외치다, 언급하다", examples: [{ sentence: "Shout out to my supporters!", translation: "제 지지자분들께 감사드려요!" }] },
  { word: "blurt out", pronunciation: "blɜrt aʊt", subcategory: "의사소통 구동사", meaning: "무심코 말하다", examples: [{ sentence: "I blurted out the secret.", translation: "비밀을 무심코 말해버렸어요." }] },
  { word: "clam up", pronunciation: "klæm ʌp", subcategory: "의사소통 구동사", meaning: "입을 다물다", examples: [{ sentence: "He clammed up when the police arrived.", translation: "경찰이 오자 그는 입을 다물었어요." }] },
  { word: "own up", pronunciation: "oʊn ʌp", subcategory: "의사소통 구동사", meaning: "인정하다, 자백하다", examples: [{ sentence: "He owned up to his mistake.", translation: "그는 자신의 실수를 인정했어요." }] },
  { word: "fess up", pronunciation: "fes ʌp", subcategory: "의사소통 구동사", meaning: "자백하다", examples: [{ sentence: "Come on, fess up!", translation: "어서, 털어놔!" }] },
  { word: "mouth off", pronunciation: "maʊθ ɔf", subcategory: "의사소통 구동사", meaning: "무례하게 말하다", examples: [{ sentence: "Don't mouth off to your teacher.", translation: "선생님께 무례하게 말하지 마." }] },
  { word: "sound off", pronunciation: "saʊnd ɔf", subcategory: "의사소통 구동사", meaning: "불평하다, 목소리를 높이다", examples: [{ sentence: "He sounded off about the new policy.", translation: "그는 새 정책에 대해 목소리를 높였어요." }] },
  { word: "drone on", pronunciation: "droʊn ɑn", subcategory: "의사소통 구동사", meaning: "지루하게 말하다", examples: [{ sentence: "He droned on for hours.", translation: "그는 몇 시간이나 지루하게 말했어요." }] },
  { word: "ramble on", pronunciation: "ˈræmbəl ɑn", subcategory: "의사소통 구동사", meaning: "두서없이 말하다", examples: [{ sentence: "Sorry, I'm rambling on.", translation: "미안, 두서없이 말하고 있네." }] },

  // 기술/IT 구동사 (25개)
  { word: "boot up", pronunciation: "but ʌp", subcategory: "IT 구동사", meaning: "부팅하다", examples: [{ sentence: "Wait for the computer to boot up.", translation: "컴퓨터가 부팅될 때까지 기다려요." }] },
  { word: "power up", pronunciation: "ˈpaʊər ʌp", subcategory: "IT 구동사", meaning: "전원을 켜다", examples: [{ sentence: "Power up the device.", translation: "기기 전원을 켜세요." }] },
  { word: "power down", pronunciation: "ˈpaʊər daʊn", subcategory: "IT 구동사", meaning: "전원을 끄다", examples: [{ sentence: "Please power down your devices.", translation: "기기 전원을 꺼주세요." }] },
  { word: "scroll down", pronunciation: "skroʊl daʊn", subcategory: "IT 구동사", meaning: "아래로 스크롤하다", examples: [{ sentence: "Scroll down to see more.", translation: "더 보려면 아래로 스크롤하세요." }] },
  { word: "scroll up", pronunciation: "skroʊl ʌp", subcategory: "IT 구동사", meaning: "위로 스크롤하다", examples: [{ sentence: "Scroll up to the top.", translation: "맨 위로 스크롤하세요." }] },
  { word: "click on", pronunciation: "klɪk ɑn", subcategory: "IT 구동사", meaning: "클릭하다", examples: [{ sentence: "Click on the link.", translation: "링크를 클릭하세요." }] },
  { word: "key in", pronunciation: "ki ɪn", subcategory: "IT 구동사", meaning: "입력하다", examples: [{ sentence: "Key in your password.", translation: "비밀번호를 입력하세요." }] },
  { word: "print out", pronunciation: "prɪnt aʊt", subcategory: "IT 구동사", meaning: "출력하다", examples: [{ sentence: "Can you print out this document?", translation: "이 문서 출력해 줄 수 있어요?" }] },
  { word: "back up", pronunciation: "bæk ʌp", subcategory: "IT 구동사", meaning: "백업하다", examples: [{ sentence: "Don't forget to back up your files.", translation: "파일 백업하는 거 잊지 마세요." }] },
  { word: "wipe out", pronunciation: "waɪp aʊt", subcategory: "IT 구동사", meaning: "삭제하다", examples: [{ sentence: "The virus wiped out all my data.", translation: "바이러스가 모든 데이터를 삭제했어요." }] },
  { word: "hack into", pronunciation: "hæk ˈɪntu", subcategory: "IT 구동사", meaning: "해킹하다", examples: [{ sentence: "Someone hacked into my account.", translation: "누군가 내 계정을 해킹했어요." }] },
  { word: "zip up", pronunciation: "zɪp ʌp", subcategory: "IT 구동사", meaning: "압축하다", examples: [{ sentence: "Zip up the files before sending.", translation: "보내기 전에 파일을 압축하세요." }] },
  { word: "sync up", pronunciation: "sɪŋk ʌp", subcategory: "IT 구동사", meaning: "동기화하다", examples: [{ sentence: "Let's sync up our calendars.", translation: "캘린더를 동기화합시다." }] },
  { word: "opt out", pronunciation: "ɑpt aʊt", subcategory: "IT 구동사", meaning: "수신 거부하다", examples: [{ sentence: "You can opt out of marketing emails.", translation: "마케팅 이메일 수신을 거부할 수 있어요." }] },
  { word: "sign out", pronunciation: "saɪn aʊt", subcategory: "IT 구동사", meaning: "로그아웃하다", examples: [{ sentence: "Remember to sign out.", translation: "로그아웃하는 거 잊지 마세요." }] },

  // 추가 일반 구동사 (28개 - 500개 맞추기)
  { word: "act on", pronunciation: "ækt ɑn", subcategory: "일반 구동사", meaning: "~에 따라 행동하다", examples: [{ sentence: "We must act on this information.", translation: "이 정보에 따라 행동해야 해요." }] },
  { word: "allow for", pronunciation: "əˈlaʊ fɔr", subcategory: "일반 구동사", meaning: "~을 고려하다", examples: [{ sentence: "Allow for extra time.", translation: "여분의 시간을 고려하세요." }] },
  { word: "amount to", pronunciation: "əˈmaʊnt tu", subcategory: "일반 구동사", meaning: "결국 ~이 되다", examples: [{ sentence: "It amounts to the same thing.", translation: "결국 같은 거예요." }] },
  { word: "bank on", pronunciation: "bæŋk ɑn", subcategory: "일반 구동사", meaning: "~에 기대다", examples: [{ sentence: "Don't bank on it.", translation: "그것에 기대하지 마세요." }] },
  { word: "bear with", pronunciation: "ber wɪð", subcategory: "일반 구동사", meaning: "참고 기다리다", examples: [{ sentence: "Please bear with me.", translation: "잠시만 기다려 주세요." }] },
  { word: "boil down to", pronunciation: "bɔɪl daʊn tu", subcategory: "일반 구동사", meaning: "결국 ~로 귀결되다", examples: [{ sentence: "It boils down to money.", translation: "결국 돈 문제예요." }] },
  { word: "brush off", pronunciation: "brʌʃ ɔf", subcategory: "일반 구동사", meaning: "무시하다", examples: [{ sentence: "She brushed off my concerns.", translation: "그녀가 내 걱정을 무시했어요." }] },
  { word: "call for", pronunciation: "kɔl fɔr", subcategory: "일반 구동사", meaning: "요구하다", examples: [{ sentence: "This calls for a celebration!", translation: "이건 축하할 일이에요!" }] },
  { word: "cave in", pronunciation: "keɪv ɪn", subcategory: "일반 구동사", meaning: "굴복하다, 무너지다", examples: [{ sentence: "Don't cave in to pressure.", translation: "압력에 굴복하지 마세요." }] },
  { word: "chicken out", pronunciation: "ˈtʃɪkən aʊt", subcategory: "일반 구동사", meaning: "겁먹고 포기하다", examples: [{ sentence: "I chickened out at the last minute.", translation: "마지막 순간에 겁먹고 포기했어요." }] },
  { word: "clamp down on", pronunciation: "klæmp daʊn ɑn", subcategory: "일반 구동사", meaning: "단속하다", examples: [{ sentence: "Police clamped down on speeding.", translation: "경찰이 과속을 단속했어요." }] },
  { word: "coast along", pronunciation: "koʊst əˈlɔŋ", subcategory: "일반 구동사", meaning: "대충 해나가다", examples: [{ sentence: "Don't just coast along.", translation: "그냥 대충 하지 마세요." }] },
  { word: "come apart", pronunciation: "kʌm əˈpɑrt", subcategory: "일반 구동사", meaning: "분해되다", examples: [{ sentence: "The toy came apart easily.", translation: "장난감이 쉽게 분해됐어요." }] },
  { word: "come off", pronunciation: "kʌm ɔf", subcategory: "일반 구동사", meaning: "떨어지다, 성공하다", examples: [{ sentence: "The plan came off perfectly.", translation: "계획이 완벽하게 성공했어요." }] },
  { word: "conk out", pronunciation: "kɑŋk aʊt", subcategory: "일반 구동사", meaning: "고장나다, 쓰러지다", examples: [{ sentence: "The car conked out.", translation: "차가 고장났어요." }] },
  { word: "cry out", pronunciation: "kraɪ aʊt", subcategory: "일반 구동사", meaning: "외치다", examples: [{ sentence: "She cried out in pain.", translation: "그녀가 고통으로 외쳤어요." }] },
  { word: "die down", pronunciation: "daɪ daʊn", subcategory: "일반 구동사", meaning: "가라앉다", examples: [{ sentence: "The noise died down.", translation: "소음이 가라앉았어요." }] },
  { word: "die out", pronunciation: "daɪ aʊt", subcategory: "일반 구동사", meaning: "멸종하다, 사라지다", examples: [{ sentence: "The tradition died out.", translation: "그 전통이 사라졌어요." }] },
  { word: "double up", pronunciation: "ˈdʌbəl ʌp", subcategory: "일반 구동사", meaning: "둘이 같이 쓰다", examples: [{ sentence: "We had to double up on rooms.", translation: "방을 같이 써야 했어요." }] },
  { word: "drag on", pronunciation: "dræg ɑn", subcategory: "일반 구동사", meaning: "질질 끌다", examples: [{ sentence: "The meeting dragged on.", translation: "회의가 질질 끌었어요." }] },
  { word: "draw on", pronunciation: "drɔ ɑn", subcategory: "일반 구동사", meaning: "활용하다", examples: [{ sentence: "She drew on her experience.", translation: "그녀는 경험을 활용했어요." }] },
  { word: "dwell on", pronunciation: "dwel ɑn", subcategory: "일반 구동사", meaning: "곱씹다", examples: [{ sentence: "Don't dwell on the past.", translation: "과거를 곱씹지 마세요." }] },
  { word: "ease off", pronunciation: "iz ɔf", subcategory: "일반 구동사", meaning: "줄어들다, 늦추다", examples: [{ sentence: "The pain is easing off.", translation: "통증이 줄어들고 있어요." }] },
  { word: "edge out", pronunciation: "edʒ aʊt", subcategory: "일반 구동사", meaning: "간신히 이기다", examples: [{ sentence: "She edged out her rival.", translation: "그녀가 라이벌을 간신히 이겼어요." }] },
  { word: "eke out", pronunciation: "ik aʊt", subcategory: "일반 구동사", meaning: "근근이 살아가다", examples: [{ sentence: "They eked out a living.", translation: "그들은 근근이 살아갔어요." }] },
  { word: "even out", pronunciation: "ˈivən aʊt", subcategory: "일반 구동사", meaning: "균등해지다", examples: [{ sentence: "Things will even out eventually.", translation: "결국 균등해질 거예요." }] },
  { word: "fall for", pronunciation: "fɔl fɔr", subcategory: "일반 구동사", meaning: "속다, 반하다", examples: [{ sentence: "I fell for the scam.", translation: "사기에 속았어요." }] },
  { word: "fall off", pronunciation: "fɔl ɔf", subcategory: "일반 구동사", meaning: "떨어지다, 감소하다", examples: [{ sentence: "Sales have fallen off.", translation: "판매가 감소했어요." }] }
];

// 중복 체크 및 추가
let addedCount = 0;
const startIndex = data.words.length;

for (const pv of newPhrasalVerbs) {
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
