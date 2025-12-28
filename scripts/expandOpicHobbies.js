const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/opicHobbies.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 패턴 수:', data.words.length);

const newPatterns = [
  // 독서 추가
  { word: "I'm currently reading a best-seller.", subcategory: "독서", meaning: "지금 베스트셀러를 읽고 있어요.", example: "I'm currently reading a best-seller that everyone's talking about." },
  { word: "I belong to a book club.", subcategory: "독서", meaning: "독서 모임에 가입해 있어요.", example: "I belong to a book club. We meet once a month to discuss books." },
  { word: "I can't put this book down.", subcategory: "독서", meaning: "이 책을 손에서 놓을 수가 없어요.", example: "I can't put this book down. It's so gripping." },
  { word: "The author's writing style is amazing.", subcategory: "독서", meaning: "작가의 문체가 정말 대단해요.", example: "The author's writing style is amazing. I've read all her books." },
  { word: "I like to read in a quiet café.", subcategory: "독서", meaning: "조용한 카페에서 책 읽는 걸 좋아해요.", example: "I like to read in a quiet café with a cup of coffee." },

  // 영화 추가
  { word: "I'm a fan of director Christopher Nolan.", subcategory: "영화", meaning: "크리스토퍼 놀란 감독의 팬이에요.", example: "I'm a fan of director Christopher Nolan. His films are masterpieces." },
  { word: "I always stay for the end credits.", subcategory: "영화", meaning: "항상 엔딩 크레딧까지 봐요.", example: "I always stay for the end credits in case there's a bonus scene." },
  { word: "The soundtrack was incredible.", subcategory: "영화", meaning: "OST가 정말 대단했어요.", example: "The soundtrack was incredible. I downloaded it right after." },
  { word: "I love watching classic films.", subcategory: "영화", meaning: "고전 영화 보는 걸 좋아해요.", example: "I love watching classic films from the 80s and 90s." },
  { word: "I'm looking forward to the sequel.", subcategory: "영화", meaning: "속편이 기대돼요.", example: "I'm looking forward to the sequel. The first one was amazing." },

  // 드라마/TV
  { word: "I binge-watch shows on weekends.", subcategory: "드라마/TV", meaning: "주말에 드라마를 몰아봐요.", example: "I binge-watch shows on weekends. I can't stop once I start." },
  { word: "I'm hooked on this new K-drama.", subcategory: "드라마/TV", meaning: "이 새 한국 드라마에 푹 빠졌어요.", example: "I'm hooked on this new K-drama. The storyline is so good." },
  { word: "I watch reality shows for fun.", subcategory: "드라마/TV", meaning: "재미로 리얼리티 쇼를 봐요.", example: "I watch reality shows for fun. They're entertaining." },
  { word: "I never miss an episode.", subcategory: "드라마/TV", meaning: "한 회도 안 빠지고 봐요.", example: "I never miss an episode. I set reminders for new releases." },
  { word: "The cliffhanger was insane.", subcategory: "드라마/TV", meaning: "그 반전 엔딩이 미쳤어요.", example: "The cliffhanger was insane. I can't wait for next week." },
  { word: "I prefer documentaries over dramas.", subcategory: "드라마/TV", meaning: "드라마보다 다큐멘터리를 더 좋아해요.", example: "I prefer documentaries over dramas. They're more informative." },
  { word: "This show has great character development.", subcategory: "드라마/TV", meaning: "이 드라마는 캐릭터 성장이 좋아요.", example: "This show has great character development throughout the seasons." },
  { word: "I watch variety shows to laugh.", subcategory: "드라마/TV", meaning: "웃으려고 예능 프로그램을 봐요.", example: "I watch variety shows to laugh after a long day." },
  { word: "I discuss fan theories online.", subcategory: "드라마/TV", meaning: "온라인에서 팬 이론을 토론해요.", example: "I discuss fan theories online with other viewers." },
  { word: "I'm waiting for the new season.", subcategory: "드라마/TV", meaning: "새 시즌을 기다리고 있어요.", example: "I'm waiting for the new season to come out next month." },

  // 카페/커피
  { word: "I'm a coffee lover.", subcategory: "카페/커피", meaning: "저는 커피 애호가예요.", example: "I'm a coffee lover. I can't start my day without it." },
  { word: "I enjoy café hopping.", subcategory: "카페/커피", meaning: "카페 투어하는 걸 즐겨요.", example: "I enjoy café hopping on weekends to find new spots." },
  { word: "I prefer specialty coffee shops.", subcategory: "카페/커피", meaning: "스페셜티 커피숍을 선호해요.", example: "I prefer specialty coffee shops over chain stores." },
  { word: "I make my own coffee at home.", subcategory: "카페/커피", meaning: "집에서 직접 커피를 내려 마셔요.", example: "I make my own coffee at home using a drip machine." },
  { word: "I've tried different brewing methods.", subcategory: "카페/커피", meaning: "다양한 추출 방법을 시도해 봤어요.", example: "I've tried different brewing methods like pour-over and French press." },
  { word: "Cafés are my favorite places to work.", subcategory: "카페/커피", meaning: "카페가 일하기 가장 좋은 장소예요.", example: "Cafés are my favorite places to work. The atmosphere is great." },
  { word: "I collect coffee beans from different countries.", subcategory: "카페/커피", meaning: "여러 나라의 원두를 모아요.", example: "I collect coffee beans from different countries to try various flavors." },
  { word: "I prefer iced coffee over hot.", subcategory: "카페/커피", meaning: "따뜻한 것보다 아이스 커피를 더 좋아해요.", example: "I prefer iced coffee over hot even in winter." },
  { word: "I've learned latte art.", subcategory: "카페/커피", meaning: "라떼 아트를 배웠어요.", example: "I've learned latte art. I can make a heart shape." },
  { word: "Coffee helps me stay focused.", subcategory: "카페/커피", meaning: "커피가 집중하는 데 도움이 돼요.", example: "Coffee helps me stay focused when I'm studying." },

  // 등산/하이킹
  { word: "I go hiking every weekend.", subcategory: "등산/하이킹", meaning: "매 주말 등산을 가요.", example: "I go hiking every weekend to enjoy nature." },
  { word: "Mountain climbing is my passion.", subcategory: "등산/하이킹", meaning: "등산은 제 열정이에요.", example: "Mountain climbing is my passion. I've climbed many peaks." },
  { word: "I love the fresh air on the trails.", subcategory: "등산/하이킹", meaning: "등산로의 신선한 공기가 좋아요.", example: "I love the fresh air on the trails. It's so refreshing." },
  { word: "The view from the summit was breathtaking.", subcategory: "등산/하이킹", meaning: "정상에서의 풍경이 숨막히게 아름다웠어요.", example: "The view from the summit was breathtaking. It was worth the climb." },
  { word: "I hike with my friends regularly.", subcategory: "등산/하이킹", meaning: "정기적으로 친구들과 등산해요.", example: "I hike with my friends regularly. We have a hiking club." },
  { word: "I enjoy taking photos during hikes.", subcategory: "등산/하이킹", meaning: "등산하면서 사진 찍는 걸 즐겨요.", example: "I enjoy taking photos during hikes to capture the scenery." },
  { word: "Hiking helps me clear my mind.", subcategory: "등산/하이킹", meaning: "등산은 머리를 맑게 해줘요.", example: "Hiking helps me clear my mind from stress." },
  { word: "I always bring snacks for the trail.", subcategory: "등산/하이킹", meaning: "항상 등산할 때 간식을 가져가요.", example: "I always bring snacks for the trail like energy bars." },
  { word: "I've conquered several famous mountains.", subcategory: "등산/하이킹", meaning: "유명한 산 여러 개를 정복했어요.", example: "I've conquered several famous mountains including Hallasan." },
  { word: "I prefer easy trails over challenging ones.", subcategory: "등산/하이킹", meaning: "어려운 코스보다 쉬운 코스를 선호해요.", example: "I prefer easy trails over challenging ones because I'm a beginner." },

  // 캠핑
  { word: "I go camping in the summer.", subcategory: "캠핑", meaning: "여름에 캠핑을 가요.", example: "I go camping in the summer with my family." },
  { word: "I love sleeping under the stars.", subcategory: "캠핑", meaning: "별 아래서 자는 걸 좋아해요.", example: "I love sleeping under the stars. It's so peaceful." },
  { word: "Setting up the tent is part of the fun.", subcategory: "캠핑", meaning: "텐트 치는 것도 재미의 일부예요.", example: "Setting up the tent is part of the fun for me." },
  { word: "I enjoy cooking outdoors.", subcategory: "캠핑", meaning: "야외에서 요리하는 걸 즐겨요.", example: "I enjoy cooking outdoors on a portable stove." },
  { word: "Campfires are the best part.", subcategory: "캠핑", meaning: "캠프파이어가 최고예요.", example: "Campfires are the best part. We roast marshmallows." },
  { word: "I prefer glamping over regular camping.", subcategory: "캠핑", meaning: "일반 캠핑보다 글램핑을 더 좋아해요.", example: "I prefer glamping over regular camping because it's more comfortable." },
  { word: "I've invested in good camping gear.", subcategory: "캠핑", meaning: "좋은 캠핑 장비에 투자했어요.", example: "I've invested in good camping gear over the years." },
  { word: "Camping helps me disconnect from technology.", subcategory: "캠핑", meaning: "캠핑은 기술에서 벗어나게 해줘요.", example: "Camping helps me disconnect from technology and relax." },
  { word: "I go car camping for convenience.", subcategory: "캠핑", meaning: "편의를 위해 차박을 해요.", example: "I go car camping for convenience. Everything is accessible." },
  { word: "Waking up to nature sounds is amazing.", subcategory: "캠핑", meaning: "자연 소리에 깨어나는 건 정말 좋아요.", example: "Waking up to nature sounds is amazing when camping." },

  // 자전거
  { word: "I ride my bike to work.", subcategory: "자전거", meaning: "자전거로 출퇴근해요.", example: "I ride my bike to work. It saves time and money." },
  { word: "Cycling is my favorite exercise.", subcategory: "자전거", meaning: "자전거 타기가 제일 좋아하는 운동이에요.", example: "Cycling is my favorite exercise. I do it daily." },
  { word: "I enjoy long bike rides on weekends.", subcategory: "자전거", meaning: "주말에 장거리 라이딩을 즐겨요.", example: "I enjoy long bike rides on weekends along the Han River." },
  { word: "I recently bought a road bike.", subcategory: "자전거", meaning: "최근에 로드 바이크를 샀어요.", example: "I recently bought a road bike for more serious riding." },
  { word: "Cycling helps me stay in shape.", subcategory: "자전거", meaning: "자전거는 체력 유지에 도움이 돼요.", example: "Cycling helps me stay in shape without going to the gym." },
  { word: "I've joined a cycling club.", subcategory: "자전거", meaning: "자전거 동호회에 가입했어요.", example: "I've joined a cycling club. We ride together every Sunday." },
  { word: "I wear a helmet for safety.", subcategory: "자전거", meaning: "안전을 위해 헬멧을 써요.", example: "I always wear a helmet for safety when cycling." },
  { word: "I track my rides with an app.", subcategory: "자전거", meaning: "앱으로 라이딩을 기록해요.", example: "I track my rides with an app to monitor my progress." },
  { word: "Biking along the river is relaxing.", subcategory: "자전거", meaning: "강을 따라 자전거 타는 건 편안해요.", example: "Biking along the river is relaxing and scenic." },
  { word: "I'm training for a cycling event.", subcategory: "자전거", meaning: "자전거 대회를 위해 훈련하고 있어요.", example: "I'm training for a cycling event next month." },

  // 낚시
  { word: "Fishing is my favorite weekend activity.", subcategory: "낚시", meaning: "낚시가 제일 좋아하는 주말 활동이에요.", example: "Fishing is my favorite weekend activity. I go every Saturday." },
  { word: "I find fishing very relaxing.", subcategory: "낚시", meaning: "낚시가 정말 편안해요.", example: "I find fishing very relaxing. It helps me unwind." },
  { word: "I usually go fishing with my dad.", subcategory: "낚시", meaning: "보통 아버지와 낚시를 가요.", example: "I usually go fishing with my dad. It's our bonding time." },
  { word: "I caught a big fish last time.", subcategory: "낚시", meaning: "지난번에 큰 물고기를 잡았어요.", example: "I caught a big fish last time. I was so excited." },
  { word: "I practice catch and release.", subcategory: "낚시", meaning: "저는 캐치 앤 릴리스를 해요.", example: "I practice catch and release to protect the ecosystem." },
  { word: "I have my own fishing gear.", subcategory: "낚시", meaning: "제 낚시 장비가 있어요.", example: "I have my own fishing gear including rods and tackle." },
  { word: "I prefer freshwater fishing.", subcategory: "낚시", meaning: "민물낚시를 더 좋아해요.", example: "I prefer freshwater fishing over sea fishing." },
  { word: "The patience required for fishing is therapeutic.", subcategory: "낚시", meaning: "낚시에 필요한 인내심이 치유가 돼요.", example: "The patience required for fishing is therapeutic for me." },
  { word: "I enjoy the peace and quiet by the water.", subcategory: "낚시", meaning: "물가의 평화와 고요함을 즐겨요.", example: "I enjoy the peace and quiet by the water while fishing." },
  { word: "I've started fly fishing recently.", subcategory: "낚시", meaning: "최근에 플라이 낚시를 시작했어요.", example: "I've started fly fishing recently. It's quite challenging." },

  // 그림/미술
  { word: "I enjoy painting as a hobby.", subcategory: "그림/미술", meaning: "취미로 그림 그리는 걸 즐겨요.", example: "I enjoy painting as a hobby. It's very relaxing." },
  { word: "I took an art class last year.", subcategory: "그림/미술", meaning: "작년에 미술 수업을 들었어요.", example: "I took an art class last year to improve my skills." },
  { word: "I prefer watercolor over oil painting.", subcategory: "그림/미술", meaning: "유화보다 수채화를 더 좋아해요.", example: "I prefer watercolor over oil painting. It's easier to clean up." },
  { word: "Drawing helps me express myself.", subcategory: "그림/미술", meaning: "그림은 자기 표현에 도움이 돼요.", example: "Drawing helps me express myself creatively." },
  { word: "I often visit art galleries for inspiration.", subcategory: "그림/미술", meaning: "영감을 얻으려고 미술관을 자주 가요.", example: "I often visit art galleries for inspiration." },
  { word: "I sketch in my free time.", subcategory: "그림/미술", meaning: "여가 시간에 스케치를 해요.", example: "I sketch in my free time. I always carry a sketchbook." },
  { word: "Digital art is my new interest.", subcategory: "그림/미술", meaning: "디지털 아트가 새로운 관심사예요.", example: "Digital art is my new interest. I use a tablet to draw." },
  { word: "I've sold some of my artwork.", subcategory: "그림/미술", meaning: "제 작품 몇 개를 팔았어요.", example: "I've sold some of my artwork online." },
  { word: "I love the smell of paint.", subcategory: "그림/미술", meaning: "물감 냄새가 좋아요.", example: "I love the smell of paint. It reminds me of art class." },
  { word: "Art is a great stress reliever.", subcategory: "그림/미술", meaning: "미술은 훌륭한 스트레스 해소법이에요.", example: "Art is a great stress reliever for me after work." },

  // DIY/공예
  { word: "I enjoy DIY projects.", subcategory: "DIY/공예", meaning: "DIY 프로젝트를 즐겨요.", example: "I enjoy DIY projects. I make furniture myself." },
  { word: "I learned to knit from my grandmother.", subcategory: "DIY/공예", meaning: "할머니에게 뜨개질을 배웠어요.", example: "I learned to knit from my grandmother. I make scarves." },
  { word: "I make handmade gifts for friends.", subcategory: "DIY/공예", meaning: "친구들에게 손수 만든 선물을 줘요.", example: "I make handmade gifts for friends. They appreciate them." },
  { word: "I'm into candle making these days.", subcategory: "DIY/공예", meaning: "요즘 캔들 만들기에 빠져 있어요.", example: "I'm into candle making these days. I sell them too." },
  { word: "Crafting helps me relax.", subcategory: "DIY/공예", meaning: "공예는 긴장을 푸는 데 도움이 돼요.", example: "Crafting helps me relax after a stressful day." },
  { word: "I follow craft tutorials on YouTube.", subcategory: "DIY/공예", meaning: "유튜브에서 공예 튜토리얼을 봐요.", example: "I follow craft tutorials on YouTube to learn new skills." },
  { word: "I've set up a small workshop at home.", subcategory: "DIY/공예", meaning: "집에 작은 작업실을 만들었어요.", example: "I've set up a small workshop at home for my projects." },
  { word: "I enjoy making jewelry.", subcategory: "DIY/공예", meaning: "악세서리 만드는 걸 즐겨요.", example: "I enjoy making jewelry like earrings and bracelets." },
  { word: "Upcycling old items is fun.", subcategory: "DIY/공예", meaning: "오래된 물건을 업사이클링하는 게 재미있어요.", example: "Upcycling old items is fun and eco-friendly." },
  { word: "I take pride in making things myself.", subcategory: "DIY/공예", meaning: "직접 만드는 것에 자부심을 느껴요.", example: "I take pride in making things myself rather than buying." },

  // 원예/가드닝
  { word: "Gardening is my therapy.", subcategory: "원예/가드닝", meaning: "정원 가꾸기가 제 치료법이에요.", example: "Gardening is my therapy. It helps me relax." },
  { word: "I grow vegetables in my backyard.", subcategory: "원예/가드닝", meaning: "뒤뜰에서 채소를 키워요.", example: "I grow vegetables in my backyard like tomatoes and peppers." },
  { word: "I have many indoor plants.", subcategory: "원예/가드닝", meaning: "실내 식물을 많이 키워요.", example: "I have many indoor plants. They make my home cozy." },
  { word: "Taking care of plants is rewarding.", subcategory: "원예/가드닝", meaning: "식물을 돌보는 건 보람 있어요.", example: "Taking care of plants is rewarding when they bloom." },
  { word: "I started a small herb garden.", subcategory: "원예/가드닝", meaning: "작은 허브 정원을 시작했어요.", example: "I started a small herb garden on my balcony." },
  { word: "Watching plants grow is satisfying.", subcategory: "원예/가드닝", meaning: "식물이 자라는 걸 보는 게 만족스러워요.", example: "Watching plants grow is satisfying and peaceful." },
  { word: "I spend weekends in my garden.", subcategory: "원예/가드닝", meaning: "주말은 정원에서 보내요.", example: "I spend weekends in my garden planting and weeding." },
  { word: "I've learned a lot about plant care.", subcategory: "원예/가드닝", meaning: "식물 관리에 대해 많이 배웠어요.", example: "I've learned a lot about plant care through trial and error." },
  { word: "I exchange plant cuttings with friends.", subcategory: "원예/가드닝", meaning: "친구들과 식물 삽목을 교환해요.", example: "I exchange plant cuttings with friends to grow new plants." },
  { word: "My garden is my happy place.", subcategory: "원예/가드닝", meaning: "정원이 제 행복한 공간이에요.", example: "My garden is my happy place where I can unwind." },

  // 봉사활동
  { word: "I volunteer at a local shelter.", subcategory: "봉사활동", meaning: "지역 보호소에서 봉사해요.", example: "I volunteer at a local shelter every Saturday." },
  { word: "Helping others is fulfilling.", subcategory: "봉사활동", meaning: "다른 사람을 돕는 건 보람 있어요.", example: "Helping others is fulfilling. It makes me happy." },
  { word: "I donate blood regularly.", subcategory: "봉사활동", meaning: "정기적으로 헌혈해요.", example: "I donate blood regularly to help save lives." },
  { word: "I teach children in my free time.", subcategory: "봉사활동", meaning: "여가 시간에 아이들을 가르쳐요.", example: "I teach children in my free time as a volunteer tutor." },
  { word: "Volunteering taught me to be grateful.", subcategory: "봉사활동", meaning: "봉사 활동이 감사하는 법을 가르쳐 줬어요.", example: "Volunteering taught me to be grateful for what I have." },
  { word: "I joined an environmental cleanup group.", subcategory: "봉사활동", meaning: "환경 정화 단체에 가입했어요.", example: "I joined an environmental cleanup group to help the community." },
  { word: "I visit nursing homes to spend time with seniors.", subcategory: "봉사활동", meaning: "어르신들과 시간을 보내러 요양원에 가요.", example: "I visit nursing homes to spend time with seniors." },
  { word: "Community service is important to me.", subcategory: "봉사활동", meaning: "지역 사회 봉사가 제게 중요해요.", example: "Community service is important to me. I try to give back." },
  { word: "I participate in charity runs.", subcategory: "봉사활동", meaning: "자선 마라톤에 참여해요.", example: "I participate in charity runs to raise money for causes." },
  { word: "Volunteering has broadened my perspective.", subcategory: "봉사활동", meaning: "봉사 활동이 제 시야를 넓혀줬어요.", example: "Volunteering has broadened my perspective on life." },

  // 외국어 학습
  { word: "I'm learning English as a hobby.", subcategory: "외국어 학습", meaning: "취미로 영어를 배우고 있어요.", example: "I'm learning English as a hobby. It's challenging but fun." },
  { word: "I use language learning apps daily.", subcategory: "외국어 학습", meaning: "매일 언어 학습 앱을 사용해요.", example: "I use language learning apps daily like Duolingo." },
  { word: "I watch shows in English to improve.", subcategory: "외국어 학습", meaning: "실력 향상을 위해 영어로 프로그램을 봐요.", example: "I watch shows in English to improve my listening skills." },
  { word: "I attend language exchange meetups.", subcategory: "외국어 학습", meaning: "언어 교환 모임에 참석해요.", example: "I attend language exchange meetups to practice speaking." },
  { word: "Learning a new language opens doors.", subcategory: "외국어 학습", meaning: "새로운 언어를 배우면 기회가 열려요.", example: "Learning a new language opens doors to new opportunities." },
  { word: "I practice speaking with native speakers online.", subcategory: "외국어 학습", meaning: "온라인에서 원어민과 말하기 연습을 해요.", example: "I practice speaking with native speakers online every week." },
  { word: "I keep a vocabulary journal.", subcategory: "외국어 학습", meaning: "어휘 노트를 작성해요.", example: "I keep a vocabulary journal to review new words." },
  { word: "I'm studying Japanese right now.", subcategory: "외국어 학습", meaning: "지금 일본어를 공부하고 있어요.", example: "I'm studying Japanese right now because I love anime." },
  { word: "I listen to podcasts in English.", subcategory: "외국어 학습", meaning: "영어로 팟캐스트를 들어요.", example: "I listen to podcasts in English during my commute." },
  { word: "I set a goal to become fluent.", subcategory: "외국어 학습", meaning: "유창해지는 것을 목표로 세웠어요.", example: "I set a goal to become fluent in English within two years." },

  // 운전/드라이브
  { word: "I enjoy going for drives.", subcategory: "운전/드라이브", meaning: "드라이브하는 걸 즐겨요.", example: "I enjoy going for drives along the coast." },
  { word: "Driving is relaxing for me.", subcategory: "운전/드라이브", meaning: "운전은 저한테 편안해요.", example: "Driving is relaxing for me. I listen to music and unwind." },
  { word: "I love road trips.", subcategory: "운전/드라이브", meaning: "로드 트립을 좋아해요.", example: "I love road trips with friends during long weekends." },
  { word: "I drive to scenic spots on weekends.", subcategory: "운전/드라이브", meaning: "주말에 경치 좋은 곳으로 드라이브해요.", example: "I drive to scenic spots on weekends to enjoy nature." },
  { word: "Driving at night is peaceful.", subcategory: "운전/드라이브", meaning: "밤 운전은 평화로워요.", example: "Driving at night is peaceful when there's no traffic." },
  { word: "I recently got my driver's license.", subcategory: "운전/드라이브", meaning: "최근에 운전면허를 땄어요.", example: "I recently got my driver's license. I'm excited to drive." },
  { word: "I enjoy exploring new places by car.", subcategory: "운전/드라이브", meaning: "차로 새로운 곳을 탐험하는 걸 즐겨요.", example: "I enjoy exploring new places by car. It's so freeing." },
  { word: "I wash and maintain my car regularly.", subcategory: "운전/드라이브", meaning: "정기적으로 세차하고 차를 관리해요.", example: "I wash and maintain my car regularly. It's my hobby." },
  { word: "I'm saving up for a nice car.", subcategory: "운전/드라이브", meaning: "좋은 차를 위해 저축하고 있어요.", example: "I'm saving up for a nice car that I've always wanted." },
  { word: "I enjoy driving with the windows down.", subcategory: "운전/드라이브", meaning: "창문을 내리고 운전하는 게 좋아요.", example: "I enjoy driving with the windows down on nice days." },

  // SNS/유튜브
  { word: "I spend a lot of time on social media.", subcategory: "SNS/유튜브", meaning: "SNS에 시간을 많이 써요.", example: "I spend a lot of time on social media keeping up with friends." },
  { word: "I watch YouTube videos to relax.", subcategory: "SNS/유튜브", meaning: "릴렉스하려고 유튜브 영상을 봐요.", example: "I watch YouTube videos to relax before bed." },
  { word: "I follow food bloggers on Instagram.", subcategory: "SNS/유튜브", meaning: "인스타그램에서 음식 블로거를 팔로우해요.", example: "I follow food bloggers on Instagram for restaurant recommendations." },
  { word: "I started my own YouTube channel.", subcategory: "SNS/유튜브", meaning: "제 유튜브 채널을 시작했어요.", example: "I started my own YouTube channel about cooking." },
  { word: "I enjoy watching vlogs.", subcategory: "SNS/유튜브", meaning: "브이로그 보는 걸 즐겨요.", example: "I enjoy watching vlogs. They're entertaining and relatable." },
  { word: "I use TikTok for short videos.", subcategory: "SNS/유튜브", meaning: "짧은 영상을 위해 틱톡을 사용해요.", example: "I use TikTok for short videos. It's addictive." },
  { word: "I keep up with trends through social media.", subcategory: "SNS/유튜브", meaning: "SNS를 통해 트렌드를 따라가요.", example: "I keep up with trends through social media." },
  { word: "I share my daily life on Instagram.", subcategory: "SNS/유튜브", meaning: "인스타그램에 일상을 공유해요.", example: "I share my daily life on Instagram with my followers." },
  { word: "I've learned a lot from YouTube tutorials.", subcategory: "SNS/유튜브", meaning: "유튜브 튜토리얼에서 많이 배웠어요.", example: "I've learned a lot from YouTube tutorials about many things." },
  { word: "I try to limit my screen time.", subcategory: "SNS/유튜브", meaning: "화면 보는 시간을 제한하려고 해요.", example: "I try to limit my screen time to be more productive." },

  // 수집
  { word: "I collect vintage records.", subcategory: "수집", meaning: "빈티지 레코드를 모아요.", example: "I collect vintage records. I have over 200 now." },
  { word: "Collecting stamps is my hobby.", subcategory: "수집", meaning: "우표 수집이 제 취미예요.", example: "Collecting stamps is my hobby since childhood." },
  { word: "I enjoy hunting for rare items.", subcategory: "수집", meaning: "희귀한 물건을 찾는 걸 즐겨요.", example: "I enjoy hunting for rare items at flea markets." },
  { word: "My collection brings me joy.", subcategory: "수집", meaning: "제 수집품이 기쁨을 줘요.", example: "My collection brings me joy every time I look at it." },
  { word: "I collect action figures.", subcategory: "수집", meaning: "액션 피규어를 모아요.", example: "I collect action figures from my favorite movies." },
  { word: "I display my collection in my room.", subcategory: "수집", meaning: "제 방에 수집품을 전시해요.", example: "I display my collection in my room on special shelves." },
  { word: "I trade items with other collectors.", subcategory: "수집", meaning: "다른 수집가들과 물건을 교환해요.", example: "I trade items with other collectors to complete my set." },
  { word: "I've been collecting for over 10 years.", subcategory: "수집", meaning: "10년 넘게 수집하고 있어요.", example: "I've been collecting for over 10 years now." },
  { word: "I collect sneakers as a hobby.", subcategory: "수집", meaning: "취미로 운동화를 모아요.", example: "I collect sneakers as a hobby. I have over 50 pairs." },
  { word: "Finding rare pieces is exciting.", subcategory: "수집", meaning: "희귀한 것을 찾는 건 흥미진진해요.", example: "Finding rare pieces is exciting. It's like treasure hunting." },

  // 쇼핑 추가
  { word: "I compare prices before buying.", subcategory: "쇼핑", meaning: "사기 전에 가격을 비교해요.", example: "I compare prices before buying to get the best deal." },
  { word: "I enjoy browsing in bookstores.", subcategory: "쇼핑", meaning: "서점에서 구경하는 걸 즐겨요.", example: "I enjoy browsing in bookstores for hours." },
  { word: "I shop during sales seasons.", subcategory: "쇼핑", meaning: "세일 시즌에 쇼핑해요.", example: "I shop during sales seasons to save money." },
  { word: "I'm trying to be a more mindful shopper.", subcategory: "쇼핑", meaning: "더 신중한 소비자가 되려고 해요.", example: "I'm trying to be a more mindful shopper and buy less." },
  { word: "I love trying on new outfits.", subcategory: "쇼핑", meaning: "새 옷 입어보는 걸 좋아해요.", example: "I love trying on new outfits even if I don't buy them." },

  // 반려동물 추가
  { word: "I adopted my pet from a shelter.", subcategory: "반려동물", meaning: "보호소에서 입양했어요.", example: "I adopted my pet from a shelter. It was the best decision." },
  { word: "My pet is my best friend.", subcategory: "반려동물", meaning: "제 반려동물은 제 절친이에요.", example: "My pet is my best friend. We do everything together." },
  { word: "I take my dog to the dog park.", subcategory: "반려동물", meaning: "강아지를 애견 공원에 데려가요.", example: "I take my dog to the dog park every evening." },
  { word: "I've trained my dog to do tricks.", subcategory: "반려동물", meaning: "강아지에게 재주를 가르쳤어요.", example: "I've trained my dog to do tricks like shake and roll over." },
  { word: "Pets bring so much happiness.", subcategory: "반려동물", meaning: "반려동물은 많은 행복을 가져다줘요.", example: "Pets bring so much happiness into our lives." },

  // 사진 추가
  { word: "I capture everyday moments.", subcategory: "사진", meaning: "일상의 순간들을 담아요.", example: "I capture everyday moments with my camera." },
  { word: "Street photography interests me.", subcategory: "사진", meaning: "길거리 사진에 관심이 있어요.", example: "Street photography interests me. I love candid shots." },
  { word: "I've won a photography contest.", subcategory: "사진", meaning: "사진 대회에서 우승했어요.", example: "I've won a photography contest last year." },
  { word: "I'm learning portrait photography.", subcategory: "사진", meaning: "인물 사진을 배우고 있어요.", example: "I'm learning portrait photography to take better photos." },
  { word: "Photography has taught me to see beauty everywhere.", subcategory: "사진", meaning: "사진이 어디서든 아름다움을 보는 법을 가르쳐줬어요.", example: "Photography has taught me to see beauty everywhere." },

  // 운동/헬스 추가
  { word: "I do home workouts using apps.", subcategory: "운동/헬스", meaning: "앱을 이용해서 홈트레이닝을 해요.", example: "I do home workouts using apps when I can't go to the gym." },
  { word: "I stretch every morning.", subcategory: "운동/헬스", meaning: "매일 아침 스트레칭해요.", example: "I stretch every morning to stay flexible." },
  { word: "I'm training for a marathon.", subcategory: "운동/헬스", meaning: "마라톤을 위해 훈련 중이에요.", example: "I'm training for a marathon next spring." },
  { word: "I take online fitness classes.", subcategory: "운동/헬스", meaning: "온라인 피트니스 수업을 들어요.", example: "I take online fitness classes from home." },
  { word: "I believe in a healthy lifestyle.", subcategory: "운동/헬스", meaning: "건강한 생활 방식을 믿어요.", example: "I believe in a healthy lifestyle with exercise and good food." },

  // 요리 추가
  { word: "I'm experimenting with fusion cuisine.", subcategory: "요리", meaning: "퓨전 요리를 실험하고 있어요.", example: "I'm experimenting with fusion cuisine mixing Korean and Italian." },
  { word: "I grow my own herbs for cooking.", subcategory: "요리", meaning: "요리용 허브를 직접 키워요.", example: "I grow my own herbs for cooking on my windowsill." },
  { word: "I enjoy making desserts.", subcategory: "요리", meaning: "디저트 만드는 걸 즐겨요.", example: "I enjoy making desserts like cakes and cookies." },
  { word: "Cooking for others brings me joy.", subcategory: "요리", meaning: "다른 사람을 위해 요리하는 게 기뻐요.", example: "Cooking for others brings me joy. I love seeing them happy." },
  { word: "I document my recipes online.", subcategory: "요리", meaning: "온라인에 레시피를 기록해요.", example: "I document my recipes online on my blog." },

  // 게임 추가
  { word: "I compete in online tournaments.", subcategory: "게임", meaning: "온라인 토너먼트에 참가해요.", example: "I compete in online tournaments for fun." },
  { word: "I stream my gameplay sometimes.", subcategory: "게임", meaning: "가끔 게임 플레이를 스트리밍해요.", example: "I stream my gameplay sometimes on Twitch." },
  { word: "I've made friends through online gaming.", subcategory: "게임", meaning: "온라인 게임을 통해 친구를 사귀었어요.", example: "I've made friends through online gaming from different countries." },
  { word: "Puzzle games are my favorite.", subcategory: "게임", meaning: "퍼즐 게임이 제일 좋아요.", example: "Puzzle games are my favorite. They keep my mind sharp." },
  { word: "I balance gaming with other hobbies.", subcategory: "게임", meaning: "게임과 다른 취미 사이에 균형을 맞춰요.", example: "I balance gaming with other hobbies and responsibilities." },

  // 여행 추가
  { word: "I love exploring local hidden gems.", subcategory: "여행", meaning: "지역의 숨겨진 명소 탐험을 좋아해요.", example: "I love exploring local hidden gems that tourists don't know." },
  { word: "Solo travel has taught me independence.", subcategory: "여행", meaning: "혼자 여행이 독립심을 가르쳐줬어요.", example: "Solo travel has taught me independence and confidence." },
  { word: "I collect souvenirs from every trip.", subcategory: "여행", meaning: "여행마다 기념품을 모아요.", example: "I collect souvenirs from every trip as memories." },
  { word: "I make a bucket list of places to visit.", subcategory: "여행", meaning: "가고 싶은 곳의 버킷리스트를 만들어요.", example: "I make a bucket list of places to visit around the world." },
  { word: "Experiencing different cultures excites me.", subcategory: "여행", meaning: "다른 문화를 경험하는 게 설레요.", example: "Experiencing different cultures excites me when traveling." },

  // 음악 추가
  { word: "I'm learning to play the piano.", subcategory: "음악", meaning: "피아노를 배우고 있어요.", example: "I'm learning to play the piano. It's harder than I thought." },
  { word: "I write my own songs.", subcategory: "음악", meaning: "제 노래를 직접 써요.", example: "I write my own songs as a creative outlet." },
  { word: "I collect vinyl records.", subcategory: "음악", meaning: "LP 판을 모아요.", example: "I collect vinyl records for their warm sound quality." },
  { word: "Music brings people together.", subcategory: "음악", meaning: "음악은 사람들을 하나로 모아요.", example: "Music brings people together regardless of background." },
  { word: "I discover new music through streaming.", subcategory: "음악", meaning: "스트리밍으로 새로운 음악을 발견해요.", example: "I discover new music through streaming recommendations." }
];

let startIdx = data.words.length;

for (let i = 0; i < newPatterns.length; i++) {
  const p = newPatterns[i];
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

console.log('추가된 패턴 수:', newPatterns.length);
console.log('최종 패턴 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
