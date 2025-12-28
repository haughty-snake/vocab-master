const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/verbs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));

console.log('현재 동사 수:', data.words.length);

const moreVerbs = [
  // 일상생활
  { word: "microwave", meaning: "전자레인지로 데우다", example: "I microwaved my lunch.", translation: "나는 점심을 전자레인지로 데웠다.", subcategory: "일상생활", past: "microwaved", pp: "microwaved" },
  { word: "vacuum", meaning: "진공청소기로 청소하다", example: "She vacuumed the carpet.", translation: "그녀는 카펫을 청소기로 청소했다.", subcategory: "일상생활", past: "vacuumed", pp: "vacuumed" },
  { word: "recycle", meaning: "재활용하다", example: "We recycle plastic bottles.", translation: "우리는 플라스틱 병을 재활용한다.", subcategory: "일상생활", past: "recycled", pp: "recycled" },
  { word: "commute", meaning: "통근하다", example: "I commute by train.", translation: "나는 기차로 통근한다.", subcategory: "일상생활", past: "commuted", pp: "commuted" },
  { word: "nap", meaning: "낮잠 자다", example: "I napped for an hour.", translation: "나는 한 시간 동안 낮잠 잤다.", subcategory: "일상생활", past: "napped", pp: "napped" },
  { word: "snooze", meaning: "선잠 자다, 졸다", example: "I snoozed the alarm.", translation: "나는 알람을 다시 맞추고 잤다.", subcategory: "일상생활", past: "snoozed", pp: "snoozed" },
  { word: "declutter", meaning: "정리정돈하다", example: "I decluttered my room.", translation: "나는 방을 정리했다.", subcategory: "일상생활", past: "decluttered", pp: "decluttered" },
  { word: "multitask", meaning: "여러 일을 동시에 하다", example: "She can multitask efficiently.", translation: "그녀는 멀티태스킹을 효율적으로 할 수 있다.", subcategory: "일상생활", past: "multitasked", pp: "multitasked" },
  { word: "unplug", meaning: "플러그를 뽑다, 휴식을 취하다", example: "I unplugged from social media.", translation: "나는 소셜 미디어에서 벗어났다.", subcategory: "일상생활", past: "unplugged", pp: "unplugged" },
  { word: "recharge", meaning: "충전하다, 재충전하다", example: "I need to recharge my batteries.", translation: "나는 재충전이 필요하다.", subcategory: "일상생활", past: "recharged", pp: "recharged" },

  // 요리/음식
  { word: "sauté", meaning: "볶다", example: "Sauté the onions until golden.", translation: "양파를 노릇해질 때까지 볶아라.", subcategory: "요리/음식", past: "sautéed", pp: "sautéed" },
  { word: "simmer", meaning: "끓이다, 졸이다", example: "Let the soup simmer for 20 minutes.", translation: "수프를 20분간 졸여라.", subcategory: "요리/음식", past: "simmered", pp: "simmered" },
  { word: "marinate", meaning: "재우다, 양념에 절이다", example: "Marinate the meat overnight.", translation: "고기를 밤새 재워라.", subcategory: "요리/음식", past: "marinated", pp: "marinated" },
  { word: "garnish", meaning: "장식하다, 가니시하다", example: "Garnish with fresh herbs.", translation: "신선한 허브로 장식하라.", subcategory: "요리/음식", past: "garnished", pp: "garnished" },
  { word: "dice", meaning: "깍둑썰기하다", example: "Dice the vegetables.", translation: "채소를 깍둑썰기하라.", subcategory: "요리/음식", past: "diced", pp: "diced" },
  { word: "mince", meaning: "다지다", example: "Mince the garlic finely.", translation: "마늘을 잘게 다져라.", subcategory: "요리/음식", past: "minced", pp: "minced" },
  { word: "grate", meaning: "강판에 갈다", example: "Grate the cheese.", translation: "치즈를 강판에 갈아라.", subcategory: "요리/음식", past: "grated", pp: "grated" },
  { word: "whisk", meaning: "휘젓다, 거품기로 젓다", example: "Whisk the eggs.", translation: "달걀을 휘저어라.", subcategory: "요리/음식", past: "whisked", pp: "whisked" },
  { word: "knead", meaning: "반죽하다", example: "Knead the dough for 10 minutes.", translation: "반죽을 10분간 치대라.", subcategory: "요리/음식", past: "kneaded", pp: "kneaded" },
  { word: "ferment", meaning: "발효시키다", example: "The mixture needs to ferment.", translation: "혼합물이 발효되어야 한다.", subcategory: "요리/음식", past: "fermented", pp: "fermented" },
  { word: "caramelize", meaning: "캐러멜화하다", example: "Caramelize the sugar.", translation: "설탕을 캐러멜화해라.", subcategory: "요리/음식", past: "caramelized", pp: "caramelized" },
  { word: "braise", meaning: "찜하다, 브레이징하다", example: "Braise the beef for hours.", translation: "소고기를 몇 시간 동안 찜해라.", subcategory: "요리/음식", past: "braised", pp: "braised" },
  { word: "poach", meaning: "수란을 만들다, 데치다", example: "Poach the eggs gently.", translation: "달걀을 부드럽게 수란으로 만들어라.", subcategory: "요리/음식", past: "poached", pp: "poached" },
  { word: "blanch", meaning: "데치다", example: "Blanch the vegetables briefly.", translation: "채소를 잠깐 데쳐라.", subcategory: "요리/음식", past: "blanched", pp: "blanched" },
  { word: "drizzle", meaning: "뿌리다", example: "Drizzle olive oil on top.", translation: "위에 올리브 오일을 뿌려라.", subcategory: "요리/음식", past: "drizzled", pp: "drizzled" },

  // 스포츠/운동
  { word: "dribble", meaning: "드리블하다", example: "He dribbled past the defender.", translation: "그는 수비수를 드리블로 제쳤다.", subcategory: "스포츠/운동", past: "dribbled", pp: "dribbled" },
  { word: "tackle", meaning: "태클하다", example: "The player tackled him.", translation: "선수가 그를 태클했다.", subcategory: "스포츠/운동", past: "tackled", pp: "tackled" },
  { word: "referee", meaning: "심판을 보다", example: "He refereed the match.", translation: "그가 경기 심판을 봤다.", subcategory: "스포츠/운동", past: "refereed", pp: "refereed" },
  { word: "sprint", meaning: "전력 질주하다", example: "She sprinted to the finish.", translation: "그녀는 결승선까지 전력 질주했다.", subcategory: "스포츠/운동", past: "sprinted", pp: "sprinted" },
  { word: "jog", meaning: "조깅하다", example: "I jog every morning.", translation: "나는 매일 아침 조깅한다.", subcategory: "스포츠/운동", past: "jogged", pp: "jogged" },
  { word: "bench", meaning: "벤치프레스하다, 벤치에 앉히다", example: "He can bench 200 pounds.", translation: "그는 200파운드를 벤치프레스할 수 있다.", subcategory: "스포츠/운동", past: "benched", pp: "benched" },
  { word: "squat", meaning: "스쿼트하다", example: "I squat with heavy weights.", translation: "나는 무거운 무게로 스쿼트한다.", subcategory: "스포츠/운동", past: "squatted", pp: "squatted" },
  { word: "lunge", meaning: "런지하다, 돌진하다", example: "She lunged forward.", translation: "그녀는 앞으로 런지했다.", subcategory: "스포츠/운동", past: "lunged", pp: "lunged" },
  { word: "flex", meaning: "근육을 긴장시키다", example: "He flexed his muscles.", translation: "그는 근육을 과시했다.", subcategory: "스포츠/운동", past: "flexed", pp: "flexed" },
  { word: "spar", meaning: "스파링하다", example: "The boxers sparred.", translation: "권투 선수들이 스파링했다.", subcategory: "스포츠/운동", past: "sparred", pp: "sparred" },

  // 기술/IT
  { word: "download", meaning: "다운로드하다", example: "Download the file.", translation: "파일을 다운로드하세요.", subcategory: "기술/IT", past: "downloaded", pp: "downloaded" },
  { word: "upload", meaning: "업로드하다", example: "Upload your photos.", translation: "사진을 업로드하세요.", subcategory: "기술/IT", past: "uploaded", pp: "uploaded" },
  { word: "reboot", meaning: "재부팅하다", example: "Reboot the computer.", translation: "컴퓨터를 재부팅하세요.", subcategory: "기술/IT", past: "rebooted", pp: "rebooted" },
  { word: "sync", meaning: "동기화하다", example: "Sync your devices.", translation: "기기를 동기화하세요.", subcategory: "기술/IT", past: "synced", pp: "synced" },
  { word: "backup", meaning: "백업하다", example: "Backup your data regularly.", translation: "데이터를 정기적으로 백업하세요.", subcategory: "기술/IT", past: "backed up", pp: "backed up" },
  { word: "uninstall", meaning: "제거하다", example: "Uninstall the app.", translation: "앱을 제거하세요.", subcategory: "기술/IT", past: "uninstalled", pp: "uninstalled" },
  { word: "livestream", meaning: "생방송하다", example: "She livestreams on YouTube.", translation: "그녀는 유튜브에서 생방송한다.", subcategory: "기술/IT", past: "livestreamed", pp: "livestreamed" },
  { word: "screenshot", meaning: "스크린샷을 찍다", example: "I screenshotted the message.", translation: "메시지를 스크린샷 찍었다.", subcategory: "기술/IT", past: "screenshotted", pp: "screenshotted" },
  { word: "troubleshoot", meaning: "문제를 해결하다", example: "He troubleshot the issue.", translation: "그가 문제를 해결했다.", subcategory: "기술/IT", past: "troubleshot", pp: "troubleshot" },
  { word: "spam", meaning: "스팸을 보내다", example: "They spammed my inbox.", translation: "그들이 내 받은 편지함에 스팸을 보냈다.", subcategory: "기술/IT", past: "spammed", pp: "spammed" },
  { word: "hack", meaning: "해킹하다", example: "Someone hacked my account.", translation: "누군가 내 계정을 해킹했다.", subcategory: "기술/IT", past: "hacked", pp: "hacked" },
  { word: "buffer", meaning: "버퍼링하다", example: "The video keeps buffering.", translation: "비디오가 계속 버퍼링 중이다.", subcategory: "기술/IT", past: "buffered", pp: "buffered" },
  { word: "glitch", meaning: "오류가 발생하다", example: "The system glitched.", translation: "시스템에 오류가 발생했다.", subcategory: "기술/IT", past: "glitched", pp: "glitched" },
  { word: "cache", meaning: "캐시하다, 저장하다", example: "The browser caches data.", translation: "브라우저가 데이터를 캐시한다.", subcategory: "기술/IT", past: "cached", pp: "cached" },
  { word: "ping", meaning: "핑을 보내다", example: "Ping the server.", translation: "서버에 핑을 보내세요.", subcategory: "기술/IT", past: "pinged", pp: "pinged" },

  // 비즈니스
  { word: "outsource", meaning: "외주를 주다", example: "They outsource their IT.", translation: "그들은 IT를 외주한다.", subcategory: "비즈니스", past: "outsourced", pp: "outsourced" },
  { word: "downsize", meaning: "구조조정하다, 축소하다", example: "The company downsized.", translation: "회사가 구조조정을 했다.", subcategory: "비즈니스", past: "downsized", pp: "downsized" },
  { word: "rebrand", meaning: "리브랜딩하다", example: "They rebranded their product.", translation: "그들은 제품을 리브랜딩했다.", subcategory: "비즈니스", past: "rebranded", pp: "rebranded" },
  { word: "pivot", meaning: "방향을 전환하다", example: "The startup pivoted.", translation: "스타트업이 방향을 전환했다.", subcategory: "비즈니스", past: "pivoted", pp: "pivoted" },
  { word: "streamline", meaning: "간소화하다", example: "We streamlined the process.", translation: "우리는 프로세스를 간소화했다.", subcategory: "비즈니스", past: "streamlined", pp: "streamlined" },
  { word: "onboard", meaning: "온보딩하다, 적응시키다", example: "We onboard new employees.", translation: "우리는 신입 직원을 온보딩한다.", subcategory: "비즈니스", past: "onboarded", pp: "onboarded" },
  { word: "leverage", meaning: "활용하다, 지렛대 역할을 하다", example: "Leverage your strengths.", translation: "당신의 강점을 활용하세요.", subcategory: "비즈니스", past: "leveraged", pp: "leveraged" },
  { word: "brainstorm", meaning: "브레인스토밍하다", example: "Let's brainstorm ideas.", translation: "아이디어를 브레인스토밍합시다.", subcategory: "비즈니스", past: "brainstormed", pp: "brainstormed" },
  { word: "network", meaning: "네트워킹하다", example: "I networked at the event.", translation: "나는 행사에서 네트워킹했다.", subcategory: "비즈니스", past: "networked", pp: "networked" },
  { word: "benchmark", meaning: "벤치마킹하다", example: "We benchmark our competitors.", translation: "우리는 경쟁사를 벤치마킹한다.", subcategory: "비즈니스", past: "benchmarked", pp: "benchmarked" },
  { word: "monetize", meaning: "수익화하다", example: "They monetized their app.", translation: "그들은 앱을 수익화했다.", subcategory: "비즈니스", past: "monetized", pp: "monetized" },
  { word: "scale", meaning: "확장하다", example: "The business scaled rapidly.", translation: "사업이 빠르게 확장되었다.", subcategory: "비즈니스", past: "scaled", pp: "scaled" },
  { word: "crowdfund", meaning: "크라우드펀딩하다", example: "They crowdfunded their project.", translation: "그들은 프로젝트를 크라우드펀딩했다.", subcategory: "비즈니스", past: "crowdfunded", pp: "crowdfunded" },
  { word: "franchise", meaning: "프랜차이즈하다", example: "They franchised the business.", translation: "그들은 사업을 프랜차이즈했다.", subcategory: "비즈니스", past: "franchised", pp: "franchised" },
  { word: "greenlight", meaning: "승인하다, 허가하다", example: "The boss greenlit the project.", translation: "상사가 프로젝트를 승인했다.", subcategory: "비즈니스", past: "greenlit", pp: "greenlit" },

  // SNS/미디어
  { word: "unfollow", meaning: "팔로우 취소하다", example: "I unfollowed him.", translation: "나는 그의 팔로우를 취소했다.", subcategory: "SNS/미디어", past: "unfollowed", pp: "unfollowed" },
  { word: "retweet", meaning: "리트윗하다", example: "She retweeted my post.", translation: "그녀가 내 게시물을 리트윗했다.", subcategory: "SNS/미디어", past: "retweeted", pp: "retweeted" },
  { word: "hashtag", meaning: "해시태그를 달다", example: "Hashtag your posts.", translation: "게시물에 해시태그를 달아라.", subcategory: "SNS/미디어", past: "hashtagged", pp: "hashtagged" },
  { word: "vlog", meaning: "브이로그를 찍다", example: "She vlogs daily.", translation: "그녀는 매일 브이로그를 찍는다.", subcategory: "SNS/미디어", past: "vlogged", pp: "vlogged" },
  { word: "blog", meaning: "블로그를 쓰다", example: "I blog about travel.", translation: "나는 여행에 대해 블로그한다.", subcategory: "SNS/미디어", past: "blogged", pp: "blogged" },
  { word: "photoshop", meaning: "포토샵으로 편집하다", example: "The image was photoshopped.", translation: "이미지가 포토샵 처리되었다.", subcategory: "SNS/미디어", past: "photoshopped", pp: "photoshopped" },
  { word: "binge-watch", meaning: "몰아보다", example: "I binge-watched the series.", translation: "나는 그 시리즈를 몰아봤다.", subcategory: "SNS/미디어", past: "binge-watched", pp: "binge-watched" },
  { word: "livestream", meaning: "생방송하다", example: "He livestreams gaming.", translation: "그는 게임을 생방송한다.", subcategory: "SNS/미디어", past: "livestreamed", pp: "livestreamed" },
  { word: "podcast", meaning: "팟캐스트하다", example: "They podcast weekly.", translation: "그들은 매주 팟캐스트를 한다.", subcategory: "SNS/미디어", past: "podcasted", pp: "podcasted" },
  { word: "meme", meaning: "밈으로 만들다", example: "The photo was memed.", translation: "그 사진이 밈이 되었다.", subcategory: "SNS/미디어", past: "memed", pp: "memed" },

  // 감각/지각
  { word: "sniff", meaning: "냄새를 맡다", example: "The dog sniffed the ground.", translation: "개가 땅 냄새를 맡았다.", subcategory: "감각/지각", past: "sniffed", pp: "sniffed" },
  { word: "squint", meaning: "눈을 찡그리다", example: "He squinted in the sun.", translation: "그는 햇빛에 눈을 찡그렸다.", subcategory: "감각/지각", past: "squinted", pp: "squinted" },
  { word: "glimpse", meaning: "흘끗 보다", example: "I glimpsed her in the crowd.", translation: "나는 군중 속에서 그녀를 흘끗 봤다.", subcategory: "감각/지각", past: "glimpsed", pp: "glimpsed" },
  { word: "glance", meaning: "힐끗 보다", example: "She glanced at her watch.", translation: "그녀는 시계를 힐끗 봤다.", subcategory: "감각/지각", past: "glanced", pp: "glanced" },
  { word: "gaze", meaning: "응시하다", example: "He gazed at the stars.", translation: "그는 별을 응시했다.", subcategory: "감각/지각", past: "gazed", pp: "gazed" },
  { word: "peer", meaning: "자세히 들여다보다", example: "She peered into the darkness.", translation: "그녀는 어둠 속을 자세히 들여다봤다.", subcategory: "감각/지각", past: "peered", pp: "peered" },
  { word: "eavesdrop", meaning: "엿듣다", example: "He eavesdropped on their conversation.", translation: "그는 그들의 대화를 엿들었다.", subcategory: "감각/지각", past: "eavesdropped", pp: "eavesdropped" },
  { word: "overhear", meaning: "우연히 듣다", example: "I overheard their argument.", translation: "나는 그들의 논쟁을 우연히 들었다.", subcategory: "감각/지각", past: "overheard", pp: "overheard" },
  { word: "savor", meaning: "음미하다", example: "Savor every moment.", translation: "모든 순간을 음미해라.", subcategory: "감각/지각", past: "savored", pp: "savored" },
  { word: "detect", meaning: "감지하다, 발견하다", example: "I detected a strange smell.", translation: "나는 이상한 냄새를 감지했다.", subcategory: "감각/지각", past: "detected", pp: "detected" },

  // 환경/자연
  { word: "compost", meaning: "퇴비로 만들다", example: "We compost our food waste.", translation: "우리는 음식물 쓰레기를 퇴비로 만든다.", subcategory: "환경/자연", past: "composted", pp: "composted" },
  { word: "deforest", meaning: "삼림을 벌채하다", example: "They deforested the area.", translation: "그들은 그 지역을 삼림 벌채했다.", subcategory: "환경/자연", past: "deforested", pp: "deforested" },
  { word: "reforest", meaning: "재조림하다", example: "We must reforest the hills.", translation: "우리는 언덕에 재조림해야 한다.", subcategory: "환경/자연", past: "reforested", pp: "reforested" },
  { word: "conserve", meaning: "보존하다, 절약하다", example: "Conserve water.", translation: "물을 절약하세요.", subcategory: "환경/자연", past: "conserved", pp: "conserved" },
  { word: "thaw", meaning: "녹다, 해동하다", example: "The ice began to thaw.", translation: "얼음이 녹기 시작했다.", subcategory: "환경/자연", past: "thawed", pp: "thawed" },
  { word: "hibernate", meaning: "동면하다", example: "Bears hibernate in winter.", translation: "곰은 겨울에 동면한다.", subcategory: "환경/자연", past: "hibernated", pp: "hibernated" },
  { word: "bloom", meaning: "꽃이 피다", example: "Flowers bloom in spring.", translation: "꽃은 봄에 핀다.", subcategory: "환경/자연", past: "bloomed", pp: "bloomed" },
  { word: "pollinate", meaning: "수분하다", example: "Bees pollinate flowers.", translation: "벌이 꽃의 수분을 돕는다.", subcategory: "환경/자연", past: "pollinated", pp: "pollinated" },
  { word: "germinate", meaning: "발아하다", example: "The seeds germinated.", translation: "씨앗이 발아했다.", subcategory: "환경/자연", past: "germinated", pp: "germinated" },
  { word: "photosynthesize", meaning: "광합성하다", example: "Plants photosynthesize.", translation: "식물은 광합성한다.", subcategory: "환경/자연", past: "photosynthesized", pp: "photosynthesized" },

  // 감정 표현
  { word: "sulk", meaning: "토라지다, 삐치다", example: "He sulked after losing.", translation: "그는 지고 나서 토라졌다.", subcategory: "감정 표현", past: "sulked", pp: "sulked" },
  { word: "pout", meaning: "삐죽거리다, 입술을 내밀다", example: "She pouted when refused.", translation: "그녀는 거절당하자 삐죽거렸다.", subcategory: "감정 표현", past: "pouted", pp: "pouted" },
  { word: "smirk", meaning: "능글맞게 웃다", example: "He smirked at her mistake.", translation: "그는 그녀의 실수에 능글맞게 웃었다.", subcategory: "감정 표현", past: "smirked", pp: "smirked" },
  { word: "sneer", meaning: "비웃다, 조소하다", example: "He sneered at the idea.", translation: "그는 그 아이디어를 비웃었다.", subcategory: "감정 표현", past: "sneered", pp: "sneered" },
  { word: "scowl", meaning: "찡그리다, 노려보다", example: "She scowled at him.", translation: "그녀는 그를 노려봤다.", subcategory: "감정 표현", past: "scowled", pp: "scowled" },
  { word: "sigh", meaning: "한숨 쉬다", example: "She sighed with relief.", translation: "그녀는 안도의 한숨을 쉬었다.", subcategory: "감정 표현", past: "sighed", pp: "sighed" },
  { word: "giggle", meaning: "낄낄거리다", example: "The children giggled.", translation: "아이들이 낄낄거렸다.", subcategory: "감정 표현", past: "giggled", pp: "giggled" },
  { word: "chuckle", meaning: "킥킥 웃다", example: "He chuckled at the joke.", translation: "그는 농담에 킥킥 웃었다.", subcategory: "감정 표현", past: "chuckled", pp: "chuckled" },
  { word: "snicker", meaning: "킥킥대며 웃다", example: "They snickered behind his back.", translation: "그들은 그의 뒤에서 킥킥대며 웃었다.", subcategory: "감정 표현", past: "snickered", pp: "snickered" },
  { word: "weep", meaning: "눈물을 흘리다", example: "She wept with joy.", translation: "그녀는 기쁨에 눈물을 흘렸다.", subcategory: "감정 표현", past: "wept", pp: "wept" },
  { word: "sob", meaning: "흐느끼다", example: "He sobbed uncontrollably.", translation: "그는 걷잡을 수 없이 흐느꼈다.", subcategory: "감정 표현", past: "sobbed", pp: "sobbed" },
  { word: "whimper", meaning: "훌쩍이다, 낑낑거리다", example: "The puppy whimpered.", translation: "강아지가 낑낑거렸다.", subcategory: "감정 표현", past: "whimpered", pp: "whimpered" },
  { word: "howl", meaning: "울부짖다", example: "The wolf howled at the moon.", translation: "늑대가 달을 보며 울부짖었다.", subcategory: "감정 표현", past: "howled", pp: "howled" },
  { word: "groan", meaning: "신음하다", example: "He groaned in pain.", translation: "그는 고통에 신음했다.", subcategory: "감정 표현", past: "groaned", pp: "groaned" },
  { word: "moan", meaning: "끙끙거리다, 한탄하다", example: "She moaned about the workload.", translation: "그녀는 업무량에 대해 한탄했다.", subcategory: "감정 표현", past: "moaned", pp: "moaned" },

  // 학습/교육
  { word: "tutor", meaning: "개인 지도하다", example: "She tutors students.", translation: "그녀는 학생들을 개인 지도한다.", subcategory: "학습/교육", past: "tutored", pp: "tutored" },
  { word: "mentor", meaning: "멘토 역할을 하다", example: "He mentors young professionals.", translation: "그는 젊은 전문가들을 멘토링한다.", subcategory: "학습/교육", past: "mentored", pp: "mentored" },
  { word: "cram", meaning: "벼락치기하다", example: "I crammed for the exam.", translation: "나는 시험을 위해 벼락치기했다.", subcategory: "학습/교육", past: "crammed", pp: "crammed" },
  { word: "plagiarize", meaning: "표절하다", example: "He plagiarized the essay.", translation: "그는 에세이를 표절했다.", subcategory: "학습/교육", past: "plagiarized", pp: "plagiarized" },
  { word: "proofread", meaning: "교정하다", example: "Please proofread my essay.", translation: "내 에세이를 교정해 주세요.", subcategory: "학습/교육", past: "proofread", pp: "proofread" },
  { word: "annotate", meaning: "주석을 달다", example: "She annotated the text.", translation: "그녀는 텍스트에 주석을 달았다.", subcategory: "학습/교육", past: "annotated", pp: "annotated" },
  { word: "paraphrase", meaning: "바꿔 말하다", example: "Can you paraphrase this?", translation: "이것을 바꿔 말해 줄 수 있어?", subcategory: "학습/교육", past: "paraphrased", pp: "paraphrased" },
  { word: "summarize", meaning: "요약하다", example: "Please summarize the article.", translation: "기사를 요약해 주세요.", subcategory: "학습/교육", past: "summarized", pp: "summarized" },
  { word: "quiz", meaning: "퀴즈를 내다", example: "The teacher quizzed us.", translation: "선생님이 우리에게 퀴즈를 냈다.", subcategory: "학습/교육", past: "quizzed", pp: "quizzed" },
  { word: "flunk", meaning: "낙제하다", example: "He flunked the test.", translation: "그는 시험에 낙제했다.", subcategory: "학습/교육", past: "flunked", pp: "flunked" },

  // 기타 동사
  { word: "babysit", meaning: "아이를 돌보다", example: "I babysit on weekends.", translation: "나는 주말에 아이를 돌봐.", subcategory: "기타", past: "babysat", pp: "babysat" },
  { word: "carpool", meaning: "카풀하다", example: "We carpool to work.", translation: "우리는 출근할 때 카풀한다.", subcategory: "기타", past: "carpooled", pp: "carpooled" },
  { word: "procrastinate", meaning: "미루다, 꾸물거리다", example: "Stop procrastinating!", translation: "그만 미뤄!", subcategory: "기타", past: "procrastinated", pp: "procrastinated" },
  { word: "overthink", meaning: "과하게 생각하다", example: "Don't overthink it.", translation: "너무 깊게 생각하지 마.", subcategory: "기타", past: "overthought", pp: "overthought" },
  { word: "underestimate", meaning: "과소평가하다", example: "Don't underestimate her.", translation: "그녀를 과소평가하지 마.", subcategory: "기타", past: "underestimated", pp: "underestimated" },
  { word: "overestimate", meaning: "과대평가하다", example: "He overestimated his abilities.", translation: "그는 자신의 능력을 과대평가했다.", subcategory: "기타", past: "overestimated", pp: "overestimated" },
  { word: "micromanage", meaning: "세세하게 간섭하다", example: "Don't micromanage your team.", translation: "팀을 세세하게 간섭하지 마.", subcategory: "기타", past: "micromanaged", pp: "micromanaged" },
  { word: "gatekeep", meaning: "접근을 제한하다", example: "Stop gatekeeping knowledge.", translation: "지식을 독점하지 마.", subcategory: "기타", past: "gatekept", pp: "gatekept" },
  { word: "mansplain", meaning: "남자가 잘난 척하며 설명하다", example: "He mansplained the topic to her.", translation: "그는 그녀에게 잘난 척하며 설명했다.", subcategory: "기타", past: "mansplained", pp: "mansplained" },
  { word: "ghostwrite", meaning: "대필하다", example: "She ghostwrites for celebrities.", translation: "그녀는 유명인들을 위해 대필한다.", subcategory: "기타", past: "ghostwrote", pp: "ghostwritten" },
  { word: "moonlight", meaning: "투잡하다, 부업하다", example: "He moonlights as a DJ.", translation: "그는 DJ로 부업한다.", subcategory: "기타", past: "moonlighted", pp: "moonlighted" },
  { word: "sideline", meaning: "제외시키다, 부업으로 하다", example: "He was sidelined due to injury.", translation: "그는 부상으로 제외되었다.", subcategory: "기타", past: "sidelined", pp: "sidelined" },
  { word: "gaslight", meaning: "심리적으로 조종하다", example: "He gaslighted her for years.", translation: "그는 수년간 그녀를 심리적으로 조종했다.", subcategory: "기타", past: "gaslighted", pp: "gaslighted" },
  { word: "catfish", meaning: "가짜 신분으로 속이다", example: "She was catfished online.", translation: "그녀는 온라인에서 가짜 신분에 속았다.", subcategory: "기타", past: "catfished", pp: "catfished" },
  { word: "binge", meaning: "폭식하다, 몰아하다", example: "I binged on snacks.", translation: "나는 간식을 폭식했다.", subcategory: "기타", past: "binged", pp: "binged" },
  { word: "splurge", meaning: "돈을 물 쓰듯 쓰다", example: "I splurged on a new bag.", translation: "나는 새 가방에 돈을 펑펑 썼다.", subcategory: "기타", past: "splurged", pp: "splurged" },
  { word: "freelance", meaning: "프리랜서로 일하다", example: "She freelances as a designer.", translation: "그녀는 디자이너로 프리랜서 일을 한다.", subcategory: "기타", past: "freelanced", pp: "freelanced" },
  { word: "crowdsource", meaning: "크라우드소싱하다", example: "They crowdsourced ideas.", translation: "그들은 아이디어를 크라우드소싱했다.", subcategory: "기타", past: "crowdsourced", pp: "crowdsourced" },
  { word: "snowball", meaning: "눈덩이처럼 불어나다", example: "The problem snowballed.", translation: "문제가 눈덩이처럼 불어났다.", subcategory: "기타", past: "snowballed", pp: "snowballed" },
  { word: "skyrocket", meaning: "급상승하다", example: "Prices skyrocketed.", translation: "가격이 급상승했다.", subcategory: "기타", past: "skyrocketed", pp: "skyrocketed" },
  { word: "nosedive", meaning: "급락하다", example: "The stock nosedived.", translation: "주가가 급락했다.", subcategory: "기타", past: "nosedived", pp: "nosedived" },
  { word: "bottleneck", meaning: "병목 현상을 일으키다", example: "Traffic bottlenecked at the bridge.", translation: "교통이 다리에서 병목현상이 생겼다.", subcategory: "기타", past: "bottlenecked", pp: "bottlenecked" },
  { word: "piggyback", meaning: "등에 업히다, 편승하다", example: "They piggybacked on our idea.", translation: "그들은 우리 아이디어에 편승했다.", subcategory: "기타", past: "piggybacked", pp: "piggybacked" },
  { word: "leapfrog", meaning: "건너뛰다, 추월하다", example: "The company leapfrogged competitors.", translation: "그 회사는 경쟁사들을 추월했다.", subcategory: "기타", past: "leapfrogged", pp: "leapfrogged" },
  { word: "earmark", meaning: "지정하다, 할당하다", example: "Funds were earmarked for education.", translation: "자금이 교육용으로 지정되었다.", subcategory: "기타", past: "earmarked", pp: "earmarked" },
  { word: "spearhead", meaning: "선두에 서다, 이끌다", example: "She spearheaded the initiative.", translation: "그녀가 그 계획을 이끌었다.", subcategory: "기타", past: "spearheaded", pp: "spearheaded" },
  { word: "jumpstart", meaning: "활성화시키다, 시동 걸다", example: "Coffee jumpstarts my morning.", translation: "커피가 내 아침을 깨워준다.", subcategory: "기타", past: "jumpstarted", pp: "jumpstarted" },
  { word: "sugarcoat", meaning: "감추다, 좋게 꾸미다", example: "Don't sugarcoat the truth.", translation: "진실을 감추지 마.", subcategory: "기타", past: "sugarcoated", pp: "sugarcoated" },
  { word: "whitewash", meaning: "회칠하다, 은폐하다", example: "They whitewashed the scandal.", translation: "그들은 스캔들을 은폐했다.", subcategory: "기타", past: "whitewashed", pp: "whitewashed" },
  { word: "greenwash", meaning: "그린워싱하다, 친환경 위장하다", example: "Companies greenwash their products.", translation: "회사들이 제품을 그린워싱한다.", subcategory: "기타", past: "greenwashed", pp: "greenwashed" }
];

let addedCount = 0;
const startIndex = data.words.length;

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
