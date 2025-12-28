const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 동사 수:', data.words.length);

const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

const moreVerbs = [
  // 동물/자연 관련
  { word: "neuter", meaning: "중성화하다", example: "We neutered our cat.", translation: "우리는 고양이를 중성화했다.", subcategory: "동물", past: "neutered", pp: "neutered" },
  { word: "groom", meaning: "(동물을) 손질하다", example: "I groom my dog every week.", translation: "나는 매주 강아지를 손질한다.", subcategory: "동물", past: "groomed", pp: "groomed" },
  { word: "domesticate", meaning: "길들이다", example: "Humans domesticated dogs thousands of years ago.", translation: "인간은 수천 년 전에 개를 길들였다.", subcategory: "동물", past: "domesticated", pp: "domesticated" },
  { word: "molt", meaning: "털갈이하다", example: "Birds molt their feathers seasonally.", translation: "새들은 계절에 따라 깃털을 갈아낸다.", subcategory: "동물", past: "molted", pp: "molted" },
  { word: "spawn", meaning: "산란하다, 생성하다", example: "Salmon spawn in rivers.", translation: "연어는 강에서 산란한다.", subcategory: "동물", past: "spawned", pp: "spawned" },
  { word: "camouflage", meaning: "위장하다", example: "The chameleon camouflaged itself.", translation: "카멜레온이 자신을 위장했다.", subcategory: "동물", past: "camouflaged", pp: "camouflaged" },

  // 물리적 동작
  { word: "fumble", meaning: "더듬거리다, 실수하다", example: "He fumbled with his keys.", translation: "그는 열쇠를 더듬거렸다.", subcategory: "동작", past: "fumbled", pp: "fumbled" },
  { word: "stumble", meaning: "비틀거리다", example: "She stumbled on the stairs.", translation: "그녀는 계단에서 비틀거렸다.", subcategory: "동작", past: "stumbled", pp: "stumbled" },
  { word: "slouch", meaning: "구부정하게 앉다", example: "Don't slouch in your chair.", translation: "의자에 구부정하게 앉지 마.", subcategory: "동작", past: "slouched", pp: "slouched" },
  { word: "squint", meaning: "눈을 가늘게 뜨다", example: "I squinted in the bright sunlight.", translation: "나는 밝은 햇빛에 눈을 가늘게 떴다.", subcategory: "동작", past: "squinted", pp: "squinted" },
  { word: "fidget", meaning: "안절부절못하다", example: "Stop fidgeting during the meeting.", translation: "회의 중에 안절부절하지 마.", subcategory: "동작", past: "fidgeted", pp: "fidgeted" },
  { word: "flinch", meaning: "움찔하다", example: "He flinched at the loud noise.", translation: "그는 큰 소리에 움찔했다.", subcategory: "동작", past: "flinched", pp: "flinched" },
  { word: "shrug", meaning: "어깨를 으쓱하다", example: "She just shrugged and walked away.", translation: "그녀는 어깨만 으쓱하고 가버렸다.", subcategory: "동작", past: "shrugged", pp: "shrugged" },
  { word: "wince", meaning: "움찔하다, 찡그리다", example: "He winced in pain.", translation: "그는 고통에 얼굴을 찡그렸다.", subcategory: "동작", past: "winced", pp: "winced" },
  { word: "crouch", meaning: "웅크리다", example: "The cat crouched before pouncing.", translation: "고양이가 덮치기 전에 웅크렸다.", subcategory: "동작", past: "crouched", pp: "crouched" },
  { word: "lunge", meaning: "돌진하다", example: "He lunged at the ball.", translation: "그가 공을 향해 돌진했다.", subcategory: "동작", past: "lunged", pp: "lunged" },
  { word: "pounce", meaning: "덮치다", example: "The lion pounced on its prey.", translation: "사자가 먹잇감에게 덮쳤다.", subcategory: "동작", past: "pounced", pp: "pounced" },

  // 소리 관련
  { word: "murmur", meaning: "중얼거리다", example: "She murmured something under her breath.", translation: "그녀가 낮은 목소리로 뭔가를 중얼거렸다.", subcategory: "소리", past: "murmured", pp: "murmured" },
  { word: "mumble", meaning: "우물거리다", example: "He mumbled an apology.", translation: "그는 사과를 우물거렸다.", subcategory: "소리", past: "mumbled", pp: "mumbled" },
  { word: "stammer", meaning: "더듬거리다", example: "He stammered when nervous.", translation: "그는 긴장하면 말을 더듬었다.", subcategory: "소리", past: "stammered", pp: "stammered" },
  { word: "stutter", meaning: "말을 더듬다", example: "She stuttered during the presentation.", translation: "그녀는 발표 중에 말을 더듬었다.", subcategory: "소리", past: "stuttered", pp: "stuttered" },
  { word: "hum", meaning: "콧노래를 부르다", example: "She hummed a tune while cooking.", translation: "그녀는 요리하면서 콧노래를 불렀다.", subcategory: "소리", past: "hummed", pp: "hummed" },
  { word: "chant", meaning: "구호를 외치다", example: "The crowd chanted his name.", translation: "군중이 그의 이름을 외쳤다.", subcategory: "소리", past: "chanted", pp: "chanted" },
  { word: "blurt", meaning: "불쑥 말하다", example: "He blurted out the secret.", translation: "그가 비밀을 불쑥 말해버렸다.", subcategory: "소리", past: "blurted", pp: "blurted" },
  { word: "shriek", meaning: "비명을 지르다", example: "She shrieked in terror.", translation: "그녀는 공포에 비명을 질렀다.", subcategory: "소리", past: "shrieked", pp: "shrieked" },
  { word: "snore", meaning: "코를 골다", example: "My dad snores loudly.", translation: "우리 아빠는 코를 크게 곤다.", subcategory: "소리", past: "snored", pp: "snored" },

  // 시각/외모 관련
  { word: "glare", meaning: "노려보다", example: "She glared at him angrily.", translation: "그녀는 화가 나서 그를 노려보았다.", subcategory: "시각", past: "glared", pp: "glared" },
  { word: "gaze", meaning: "응시하다", example: "He gazed at the stars.", translation: "그는 별들을 응시했다.", subcategory: "시각", past: "gazed", pp: "gazed" },
  { word: "peek", meaning: "몰래 보다", example: "She peeked through the curtains.", translation: "그녀는 커튼 사이로 몰래 보았다.", subcategory: "시각", past: "peeked", pp: "peeked" },
  { word: "peep", meaning: "엿보다", example: "The sun peeped through the clouds.", translation: "해가 구름 사이로 나왔다.", subcategory: "시각", past: "peeped", pp: "peeped" },
  { word: "squeak", meaning: "삐걱거리다, 끽 소리내다", example: "The door squeaked when opened.", translation: "문이 열릴 때 삐걱거렸다.", subcategory: "소리", past: "squeaked", pp: "squeaked" },
  { word: "creak", meaning: "삐걱거리다", example: "The old floor creaked under my feet.", translation: "낡은 바닥이 내 발 아래에서 삐걱거렸다.", subcategory: "소리", past: "creaked", pp: "creaked" },

  // 비유적/추상적
  { word: "backfire", meaning: "역효과를 내다", example: "His plan backfired.", translation: "그의 계획이 역효과를 냈다.", subcategory: "추상", past: "backfired", pp: "backfired" },
  { word: "snowball", meaning: "눈덩이처럼 불어나다", example: "The problem snowballed out of control.", translation: "문제가 눈덩이처럼 커져 통제 불능이 되었다.", subcategory: "추상", past: "snowballed", pp: "snowballed" },
  { word: "skyrocket", meaning: "급등하다", example: "Prices skyrocketed after the shortage.", translation: "부족 사태 이후 가격이 급등했다.", subcategory: "추상", past: "skyrocketed", pp: "skyrocketed" },
  { word: "plummet", meaning: "급락하다", example: "The stock price plummeted.", translation: "주가가 급락했다.", subcategory: "추상", past: "plummeted", pp: "plummeted" },
  { word: "spiral", meaning: "나선형으로 움직이다, 악화되다", example: "The situation spiraled out of control.", translation: "상황이 통제 불능으로 악화되었다.", subcategory: "추상", past: "spiraled", pp: "spiraled" },
  { word: "mushroom", meaning: "급성장하다", example: "The business mushroomed after going viral.", translation: "바이럴 후 사업이 급성장했다.", subcategory: "추상", past: "mushroomed", pp: "mushroomed" },

  // 감정 표현
  { word: "sulk", meaning: "뾰루퉁해지다", example: "He sulked after losing the game.", translation: "그는 게임에서 지고 뾰루퉁해졌다.", subcategory: "감정", past: "sulked", pp: "sulked" },
  { word: "pout", meaning: "입을 삐죽거리다", example: "She pouted when she didn't get her way.", translation: "그녀는 뜻대로 안 되자 입을 삐죽거렸다.", subcategory: "감정", past: "pouted", pp: "pouted" },
  { word: "mope", meaning: "풀이 죽다", example: "Stop moping around the house.", translation: "집에서 풀 죽어 있지 마.", subcategory: "감정", past: "moped", pp: "moped" },
  { word: "brood", meaning: "곰곰이 생각하다", example: "He brooded over his mistakes.", translation: "그는 자신의 실수에 대해 곰곰이 생각했다.", subcategory: "감정", past: "brooded", pp: "brooded" },
  { word: "fume", meaning: "화가 나다, 연기를 내뿜다", example: "She was fuming with anger.", translation: "그녀는 분노로 부글부글 끓고 있었다.", subcategory: "감정", past: "fumed", pp: "fumed" },
  { word: "seethe", meaning: "속으로 끓다", example: "He seethed with jealousy.", translation: "그는 질투심으로 속이 부글부글 끓었다.", subcategory: "감정", past: "seethed", pp: "seethed" },
  { word: "gloat", meaning: "고소해하다", example: "Don't gloat over your victory.", translation: "승리에 대해 고소해하지 마.", subcategory: "감정", past: "gloated", pp: "gloated" },
  { word: "rejoice", meaning: "기뻐하다", example: "They rejoiced at the news.", translation: "그들은 그 소식에 기뻐했다.", subcategory: "감정", past: "rejoiced", pp: "rejoiced" },
  { word: "grieve", meaning: "슬퍼하다", example: "She grieved for her late husband.", translation: "그녀는 돌아가신 남편을 슬퍼했다.", subcategory: "감정", past: "grieved", pp: "grieved" },
  { word: "mourn", meaning: "애도하다", example: "The nation mourned the loss.", translation: "국민들이 그 죽음을 애도했다.", subcategory: "감정", past: "mourned", pp: "mourned" },

  // 파괴/손상
  { word: "vandalize", meaning: "파괴하다", example: "Someone vandalized the school.", translation: "누군가가 학교를 파괴했다.", subcategory: "파괴", past: "vandalized", pp: "vandalized" },
  { word: "sabotage", meaning: "방해 공작하다", example: "They sabotaged the project.", translation: "그들은 프로젝트를 방해했다.", subcategory: "파괴", past: "sabotaged", pp: "sabotaged" },
  { word: "tamper", meaning: "손을 대다, 조작하다", example: "Someone tampered with the evidence.", translation: "누군가가 증거를 조작했다.", subcategory: "파괴", past: "tampered", pp: "tampered" },
  { word: "corrode", meaning: "부식시키다", example: "Salt corrodes metal.", translation: "소금이 금속을 부식시킨다.", subcategory: "파괴", past: "corroded", pp: "corroded" },
  { word: "rust", meaning: "녹슬다", example: "The old gate has rusted.", translation: "오래된 문이 녹슬었다.", subcategory: "파괴", past: "rusted", pp: "rusted" },
  { word: "rot", meaning: "썩다", example: "The fruit rotted in the heat.", translation: "과일이 더위에 썩었다.", subcategory: "파괴", past: "rotted", pp: "rotted" },
  { word: "decay", meaning: "부패하다", example: "Teeth decay without proper care.", translation: "적절한 관리 없이 이가 썩는다.", subcategory: "파괴", past: "decayed", pp: "decayed" },
  { word: "wither", meaning: "시들다", example: "The flowers withered in the heat.", translation: "꽃들이 더위에 시들었다.", subcategory: "파괴", past: "withered", pp: "withered" },

  // 옷/패션
  { word: "hem", meaning: "단을 치다", example: "I need to hem these pants.", translation: "이 바지 단을 쳐야 해.", subcategory: "패션", past: "hemmed", pp: "hemmed" },
  { word: "tailor", meaning: "맞춤 제작하다", example: "I had my suit tailored.", translation: "정장을 맞춤 제작했다.", subcategory: "패션", past: "tailored", pp: "tailored" },
  { word: "embroider", meaning: "자수를 놓다", example: "She embroidered flowers on the cloth.", translation: "그녀는 천에 꽃을 수놓았다.", subcategory: "패션", past: "embroidered", pp: "embroidered" },
  { word: "stitch", meaning: "바느질하다", example: "The doctor stitched up the wound.", translation: "의사가 상처를 꿰맸다.", subcategory: "패션", past: "stitched", pp: "stitched" },
  { word: "unravel", meaning: "풀리다, 해명하다", example: "The sweater started to unravel.", translation: "스웨터가 풀리기 시작했다.", subcategory: "패션", past: "unraveled", pp: "unraveled" },

  // 건축/수리
  { word: "demolish", meaning: "철거하다", example: "They demolished the old building.", translation: "그들은 낡은 건물을 철거했다.", subcategory: "건축", past: "demolished", pp: "demolished" },
  { word: "renovate", meaning: "개조하다", example: "We renovated the kitchen.", translation: "우리는 주방을 개조했다.", subcategory: "건축", past: "renovated", pp: "renovated" },
  { word: "plaster", meaning: "회반죽을 바르다", example: "We plastered the walls.", translation: "우리는 벽에 회반죽을 발랐다.", subcategory: "건축", past: "plastered", pp: "plastered" },
  { word: "insulate", meaning: "단열하다", example: "We insulated the attic.", translation: "우리는 다락방을 단열 처리했다.", subcategory: "건축", past: "insulated", pp: "insulated" },
  { word: "soundproof", meaning: "방음 처리하다", example: "We soundproofed the studio.", translation: "우리는 스튜디오를 방음 처리했다.", subcategory: "건축", past: "soundproofed", pp: "soundproofed" },

  // 음식/맛
  { word: "ferment", meaning: "발효시키다", example: "The grapes fermented into wine.", translation: "포도가 발효되어 와인이 되었다.", subcategory: "음식", past: "fermented", pp: "fermented" },
  { word: "curdle", meaning: "응고시키다", example: "The milk curdled in the heat.", translation: "우유가 더위에 응고되었다.", subcategory: "음식", past: "curdled", pp: "curdled" },
  { word: "thicken", meaning: "걸쭉하게 하다", example: "Stir the sauce until it thickens.", translation: "소스가 걸쭉해질 때까지 저어라.", subcategory: "음식", past: "thickened", pp: "thickened" },
  { word: "dilute", meaning: "희석하다", example: "Dilute the juice with water.", translation: "주스를 물로 희석해라.", subcategory: "음식", past: "diluted", pp: "diluted" },
  { word: "drizzle", meaning: "뿌리다", example: "Drizzle olive oil over the salad.", translation: "샐러드에 올리브 오일을 뿌려라.", subcategory: "음식", past: "drizzled", pp: "drizzled" },

  // 기타 동사
  { word: "jostle", meaning: "밀치다", example: "People jostled to get on the train.", translation: "사람들이 기차에 타려고 밀쳤다.", subcategory: "동작", past: "jostled", pp: "jostled" },
  { word: "nudge", meaning: "쿡 찌르다", example: "She nudged me with her elbow.", translation: "그녀가 팔꿈치로 나를 쿡 찔렀다.", subcategory: "동작", past: "nudged", pp: "nudged" },
  { word: "prod", meaning: "쿡 찌르다", example: "He prodded me to wake up.", translation: "그가 나를 깨우려고 쿡 찔렀다.", subcategory: "동작", past: "prodded", pp: "prodded" },
  { word: "poke", meaning: "찌르다", example: "Don't poke the bear.", translation: "곰을 찌르지 마.", subcategory: "동작", past: "poked", pp: "poked" },
  { word: "tickle", meaning: "간지럽히다", example: "He tickled the baby.", translation: "그가 아기를 간지럽혔다.", subcategory: "동작", past: "tickled", pp: "tickled" },
  { word: "nibble", meaning: "조금씩 먹다", example: "She nibbled on a cracker.", translation: "그녀는 크래커를 조금씩 먹었다.", subcategory: "동작", past: "nibbled", pp: "nibbled" },
  { word: "gobble", meaning: "게걸스럽게 먹다", example: "He gobbled down his food.", translation: "그는 음식을 게걸스럽게 먹었다.", subcategory: "동작", past: "gobbled", pp: "gobbled" },
  { word: "slurp", meaning: "후루룩 마시다", example: "Don't slurp your soup.", translation: "국을 후루룩 소리내며 먹지 마.", subcategory: "동작", past: "slurped", pp: "slurped" },
  { word: "gulp", meaning: "꿀꺽 삼키다", example: "He gulped down his coffee.", translation: "그는 커피를 꿀꺽 삼켰다.", subcategory: "동작", past: "gulped", pp: "gulped" },
  { word: "sip", meaning: "홀짝이다", example: "She sipped her tea slowly.", translation: "그녀는 차를 천천히 홀짝였다.", subcategory: "동작", past: "sipped", pp: "sipped" },
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
