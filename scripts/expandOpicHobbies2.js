const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/opicHobbies.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 패턴 수:', data.words.length);

const morePatterns = [
  // 추가 패턴들
  { word: "I started this hobby during the pandemic.", subcategory: "일반", meaning: "팬데믹 때 이 취미를 시작했어요.", example: "I started this hobby during the pandemic to stay busy at home." },
  { word: "My hobby keeps me mentally active.", subcategory: "일반", meaning: "제 취미가 정신적으로 활발하게 해줘요.", example: "My hobby keeps me mentally active and engaged." },
  { word: "I spend about two hours a day on my hobby.", subcategory: "일반", meaning: "하루에 약 두 시간을 취미에 써요.", example: "I spend about two hours a day on my hobby after work." },
  { word: "My hobby has become a side job.", subcategory: "일반", meaning: "제 취미가 부업이 됐어요.", example: "My hobby has become a side job. I earn extra income from it." },
  { word: "I've met many people through my hobby.", subcategory: "일반", meaning: "취미를 통해 많은 사람을 만났어요.", example: "I've met many people through my hobby who share my interests." },

  // 게임 추가
  { word: "I enjoy retro games from the 90s.", subcategory: "게임", meaning: "90년대 레트로 게임을 즐겨요.", example: "I enjoy retro games from the 90s for nostalgia." },
  { word: "I play games to bond with my kids.", subcategory: "게임", meaning: "아이들과 유대감을 위해 게임을 해요.", example: "I play games to bond with my kids. We play together." },
  { word: "I enjoy escape room games.", subcategory: "게임", meaning: "방탈출 게임을 즐겨요.", example: "I enjoy escape room games with my friends." },

  // 운동 추가
  { word: "I practice martial arts.", subcategory: "운동/헬스", meaning: "무술을 수련해요.", example: "I practice martial arts like Taekwondo for fitness." },
  { word: "I enjoy pilates for core strength.", subcategory: "운동/헬스", meaning: "코어 운동을 위해 필라테스를 해요.", example: "I enjoy pilates for core strength and flexibility." },
  { word: "I play tennis on weekends.", subcategory: "운동/헬스", meaning: "주말에 테니스를 쳐요.", example: "I play tennis on weekends at a local court." },
  { word: "Golf is my new hobby.", subcategory: "운동/헬스", meaning: "골프가 새 취미예요.", example: "Golf is my new hobby. I go to the driving range weekly." },
  { word: "I do aerobics classes.", subcategory: "운동/헬스", meaning: "에어로빅 수업을 들어요.", example: "I do aerobics classes three times a week." },

  // 영화/드라마 추가
  { word: "I'm into foreign films.", subcategory: "영화", meaning: "외국 영화에 빠져 있어요.", example: "I'm into foreign films. I watch them with subtitles." },
  { word: "I enjoy animated movies.", subcategory: "영화", meaning: "애니메이션 영화를 즐겨요.", example: "I enjoy animated movies. Pixar films are my favorite." },
  { word: "I watch behind-the-scenes content.", subcategory: "드라마/TV", meaning: "비하인드 영상을 봐요.", example: "I watch behind-the-scenes content of my favorite shows." },
  { word: "I discuss episodes with online communities.", subcategory: "드라마/TV", meaning: "온라인 커뮤니티에서 에피소드를 토론해요.", example: "I discuss episodes with online communities after watching." },

  // 음악 추가
  { word: "I enjoy karaoke with friends.", subcategory: "음악", meaning: "친구들과 노래방을 즐겨요.", example: "I enjoy karaoke with friends. We go every month." },
  { word: "I'm learning to read sheet music.", subcategory: "음악", meaning: "악보 읽는 법을 배우고 있어요.", example: "I'm learning to read sheet music for piano." },
  { word: "I attend music festivals.", subcategory: "음악", meaning: "음악 축제에 참가해요.", example: "I attend music festivals every summer." },

  // 요리 추가
  { word: "I enjoy making traditional Korean dishes.", subcategory: "요리", meaning: "전통 한식 만드는 걸 즐겨요.", example: "I enjoy making traditional Korean dishes like bibimbap." },
  { word: "I experiment with international cuisines.", subcategory: "요리", meaning: "다양한 나라 요리를 실험해요.", example: "I experiment with international cuisines every week." },
  { word: "I host dinner parties.", subcategory: "요리", meaning: "디너 파티를 열어요.", example: "I host dinner parties and cook for my guests." },

  // 여행 추가
  { word: "I plan my trips months in advance.", subcategory: "여행", meaning: "몇 달 전부터 여행을 계획해요.", example: "I plan my trips months in advance for better deals." },
  { word: "I enjoy staycations too.", subcategory: "여행", meaning: "스테이케이션도 즐겨요.", example: "I enjoy staycations too when I can't travel far." },
  { word: "I use travel points for free flights.", subcategory: "여행", meaning: "무료 항공편을 위해 여행 포인트를 사용해요.", example: "I use travel points for free flights and upgrades." },

  // 독서 추가
  { word: "I listen to audiobooks during commute.", subcategory: "독서", meaning: "출퇴근할 때 오디오북을 들어요.", example: "I listen to audiobooks during commute to save time." },
  { word: "I read book summaries first.", subcategory: "독서", meaning: "먼저 책 요약을 읽어요.", example: "I read book summaries first to decide what to read." },
  { word: "I write book reviews online.", subcategory: "독서", meaning: "온라인에 독서 리뷰를 써요.", example: "I write book reviews online to share my thoughts." },
];

let startIdx = data.words.length;

for (let i = 0; i < morePatterns.length; i++) {
  const p = morePatterns[i];
  const newWord = {
    id: `opic_hobby_${String(startIdx + i + 1).padStart(3, '0')}`,
    word: p.word,
    subcategory: p.subcategory,
    meanings: [{
      partOfSpeech: "표현",
      meaning: p.meaning,
      examples: [{ sentence: p.example, translation: "" }]
    }]
  };
  data.words.push(newWord);
}

console.log('추가된 패턴 수:', morePatterns.length);
console.log('최종 패턴 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
