const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/opicRoleplay.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('현재 패턴 수:', data.words.length);

const newPatterns = [
  // 식당 - 추가 상황
  { word: "We'd like a table by the window, please.", subcategory: "식당 - 좌석", meaning: "창가 자리로 부탁드립니다.", example: "We'd like a table by the window, please. The view is nice." },
  { word: "Is there a wait for a table?", subcategory: "식당 - 대기", meaning: "자리 있을 때까지 얼마나 기다려야 하나요?", example: "Is there a wait for a table? We don't have a reservation." },
  { word: "How long is the wait?", subcategory: "식당 - 대기", meaning: "대기 시간이 얼마나 되나요?", example: "How long is the wait? We're in a bit of a hurry." },
  { word: "Could we see the wine list?", subcategory: "식당 - 주문", meaning: "와인 리스트 볼 수 있을까요?", example: "Could we see the wine list? We'd like to order some wine." },
  { word: "What's today's special?", subcategory: "식당 - 주문", meaning: "오늘의 특선 요리가 뭔가요?", example: "What's today's special? I'd like to try something new." },
  { word: "I'd like my steak medium-rare, please.", subcategory: "식당 - 주문", meaning: "스테이크는 미디엄 레어로 부탁드립니다.", example: "I'd like my steak medium-rare, please. Not too well done." },
  { word: "Could I get this to go?", subcategory: "식당 - 주문", meaning: "이거 포장해 주실 수 있나요?", example: "Could I get this to go? I'm running late." },
  { word: "Can I get a box for the leftovers?", subcategory: "식당 - 식사 후", meaning: "남은 음식 포장해 주실 수 있나요?", example: "Can I get a box for the leftovers? I'd like to take this home." },
  { word: "This isn't what I ordered.", subcategory: "식당 - 문제", meaning: "이건 제가 주문한 게 아닌데요.", example: "This isn't what I ordered. I asked for the chicken, not the fish." },
  { word: "This dish is cold. Could you heat it up?", subcategory: "식당 - 문제", meaning: "음식이 식었어요. 데워주실 수 있나요?", example: "This dish is cold. Could you heat it up, please?" },
  { word: "Excuse me, we've been waiting for our food for 30 minutes.", subcategory: "식당 - 문제", meaning: "저희 음식을 30분째 기다리고 있어요.", example: "Excuse me, we've been waiting for our food for 30 minutes. Is everything okay?" },

  // 병원/의사
  { word: "I'd like to make an appointment with Dr. Smith.", subcategory: "병원 - 예약", meaning: "스미스 박사님과 예약을 잡고 싶습니다.", example: "I'd like to make an appointment with Dr. Smith for a checkup." },
  { word: "I'm here for my appointment.", subcategory: "병원 - 방문", meaning: "예약하고 왔습니다.", example: "I'm here for my appointment at 2 PM with Dr. Kim." },
  { word: "I've been having headaches for a week.", subcategory: "병원 - 증상 설명", meaning: "일주일째 두통이 있습니다.", example: "I've been having headaches for a week. They're getting worse." },
  { word: "I think I might have the flu.", subcategory: "병원 - 증상 설명", meaning: "독감인 것 같아요.", example: "I think I might have the flu. I have a fever and body aches." },
  { word: "Where does it hurt?", subcategory: "병원 - 진료", meaning: "어디가 아프세요?", example: "Where does it hurt? Can you point to the area?" },
  { word: "How long have you had these symptoms?", subcategory: "병원 - 진료", meaning: "이 증상이 얼마나 됐나요?", example: "How long have you had these symptoms? When did they start?" },
  { word: "Are you taking any medication?", subcategory: "병원 - 진료", meaning: "현재 복용 중인 약이 있나요?", example: "Are you taking any medication? Any allergies I should know about?" },
  { word: "I need to see a specialist.", subcategory: "병원 - 진료", meaning: "전문의를 만나봐야 할 것 같습니다.", example: "I need to see a specialist. Can you refer me to one?" },
  { word: "Do I need any tests?", subcategory: "병원 - 진료", meaning: "검사를 받아야 하나요?", example: "Do I need any tests? Should I get blood work done?" },
  { word: "When will I get the test results?", subcategory: "병원 - 진료", meaning: "검사 결과는 언제 나오나요?", example: "When will I get the test results? Should I call or come back?" },

  // 헬스장/피트니스
  { word: "I'd like to get information about membership options.", subcategory: "헬스장 - 가입", meaning: "회원권 옵션에 대해 알고 싶습니다.", example: "I'd like to get information about membership options. What plans do you have?" },
  { word: "Can I get a tour of the facility?", subcategory: "헬스장 - 가입", meaning: "시설 둘러볼 수 있을까요?", example: "Can I get a tour of the facility? I'd like to see the equipment." },
  { word: "Do you offer personal training?", subcategory: "헬스장 - 서비스", meaning: "개인 트레이닝이 있나요?", example: "Do you offer personal training? I'm new to working out." },
  { word: "What classes do you have?", subcategory: "헬스장 - 서비스", meaning: "어떤 수업들이 있나요?", example: "What classes do you have? I'm interested in yoga and spinning." },
  { word: "How do I sign up for a class?", subcategory: "헬스장 - 서비스", meaning: "수업 등록은 어떻게 하나요?", example: "How do I sign up for a class? Is there a limit on participants?" },
  { word: "I'd like to cancel my membership.", subcategory: "헬스장 - 취소", meaning: "회원권을 해지하고 싶습니다.", example: "I'd like to cancel my membership. What's the process?" },
  { word: "Can I freeze my membership for a month?", subcategory: "헬스장 - 변경", meaning: "한 달간 회원권을 정지할 수 있나요?", example: "Can I freeze my membership for a month? I'll be traveling." },

  // 도서관
  { word: "How do I get a library card?", subcategory: "도서관 - 등록", meaning: "도서관 카드는 어떻게 만드나요?", example: "How do I get a library card? What documents do I need?" },
  { word: "I'd like to check out these books.", subcategory: "도서관 - 대출", meaning: "이 책들을 대출하고 싶습니다.", example: "I'd like to check out these books. How long can I keep them?" },
  { word: "Can I renew this book?", subcategory: "도서관 - 대출", meaning: "이 책 대출 연장 가능한가요?", example: "Can I renew this book? I haven't finished reading it yet." },
  { word: "I'd like to return these books.", subcategory: "도서관 - 반납", meaning: "이 책들을 반납하고 싶습니다.", example: "I'd like to return these books. Where's the return desk?" },
  { word: "Do you have this book in stock?", subcategory: "도서관 - 찾기", meaning: "이 책이 있나요?", example: "Do you have this book in stock? I couldn't find it on the shelf." },
  { word: "Can you help me find a book on...?", subcategory: "도서관 - 찾기", meaning: "~에 관한 책을 찾는 걸 도와주실 수 있나요?", example: "Can you help me find a book on Korean history?" },
  { word: "Where is the children's section?", subcategory: "도서관 - 위치", meaning: "어린이 코너가 어디에 있나요?", example: "Where is the children's section? I'm looking for books for my daughter." },

  // 우체국
  { word: "I'd like to send this package.", subcategory: "우체국 - 발송", meaning: "이 소포를 보내고 싶습니다.", example: "I'd like to send this package to the United States." },
  { word: "What's the fastest shipping option?", subcategory: "우체국 - 발송", meaning: "가장 빠른 배송 옵션이 뭔가요?", example: "What's the fastest shipping option? It needs to arrive by Friday." },
  { word: "How much does it cost to send this?", subcategory: "우체국 - 발송", meaning: "이거 보내는 데 얼마예요?", example: "How much does it cost to send this by express mail?" },
  { word: "I'd like to send this by registered mail.", subcategory: "우체국 - 발송", meaning: "등기우편으로 보내고 싶습니다.", example: "I'd like to send this by registered mail. It's important documents." },
  { word: "Can I track this package?", subcategory: "우체국 - 추적", meaning: "이 소포 추적이 가능한가요?", example: "Can I track this package? I need to know when it arrives." },
  { word: "I need to pick up a package.", subcategory: "우체국 - 수령", meaning: "소포를 찾으러 왔습니다.", example: "I need to pick up a package. I received this notice." },
  { word: "I need stamps for domestic mail.", subcategory: "우체국 - 우표", meaning: "국내우편용 우표가 필요합니다.", example: "I need stamps for domestic mail. Ten stamps, please." },

  // 기술 지원
  { word: "My internet isn't working.", subcategory: "기술 지원 - 인터넷", meaning: "인터넷이 안 돼요.", example: "My internet isn't working. I've tried restarting the router." },
  { word: "The connection keeps dropping.", subcategory: "기술 지원 - 인터넷", meaning: "연결이 자꾸 끊겨요.", example: "The connection keeps dropping. It happens several times a day." },
  { word: "I'm having trouble with my phone service.", subcategory: "기술 지원 - 전화", meaning: "전화 서비스에 문제가 있어요.", example: "I'm having trouble with my phone service. I can't make calls." },
  { word: "My TV isn't getting any signal.", subcategory: "기술 지원 - TV", meaning: "TV에 신호가 안 잡혀요.", example: "My TV isn't getting any signal. The screen is just black." },
  { word: "I need a technician to come out.", subcategory: "기술 지원 - 방문", meaning: "기사님이 방문해 주셔야 할 것 같아요.", example: "I need a technician to come out. I can't fix this myself." },
  { word: "When can someone come to fix this?", subcategory: "기술 지원 - 방문", meaning: "언제 와서 수리해 주실 수 있나요?", example: "When can someone come to fix this? I work from home." },
  { word: "Have you tried turning it off and on again?", subcategory: "기술 지원 - 안내", meaning: "껐다가 다시 켜보셨나요?", example: "Have you tried turning it off and on again? That often fixes the issue." },

  // 휴대폰/통신사
  { word: "I'd like to upgrade my phone.", subcategory: "통신사 - 기기", meaning: "휴대폰을 업그레이드하고 싶습니다.", example: "I'd like to upgrade my phone. What models are available?" },
  { word: "What plans do you have?", subcategory: "통신사 - 요금제", meaning: "어떤 요금제가 있나요?", example: "What plans do you have? I need unlimited data." },
  { word: "I'd like to change my plan.", subcategory: "통신사 - 요금제", meaning: "요금제를 변경하고 싶습니다.", example: "I'd like to change my plan to something with more data." },
  { word: "My bill seems too high this month.", subcategory: "통신사 - 청구", meaning: "이번 달 청구서가 너무 높은 것 같아요.", example: "My bill seems too high this month. Can you explain these charges?" },
  { word: "I'd like to add someone to my family plan.", subcategory: "통신사 - 요금제", meaning: "가족 요금제에 사람을 추가하고 싶습니다.", example: "I'd like to add someone to my family plan. How much extra would that be?" },
  { word: "My phone screen is cracked. Can I get it repaired?", subcategory: "통신사 - 수리", meaning: "휴대폰 화면이 깨졌어요. 수리 가능한가요?", example: "My phone screen is cracked. Can I get it repaired here?" },

  // 집 수리
  { word: "I need someone to fix my plumbing.", subcategory: "집 수리 - 배관", meaning: "배관 수리가 필요합니다.", example: "I need someone to fix my plumbing. The sink is leaking." },
  { word: "My toilet is clogged.", subcategory: "집 수리 - 배관", meaning: "화장실이 막혔어요.", example: "My toilet is clogged. I've tried plunging it but it won't drain." },
  { word: "The air conditioning isn't working.", subcategory: "집 수리 - 냉난방", meaning: "에어컨이 작동하지 않아요.", example: "The air conditioning isn't working. It's really hot in here." },
  { word: "I need to get the heater fixed.", subcategory: "집 수리 - 냉난방", meaning: "히터를 수리해야 합니다.", example: "I need to get the heater fixed before winter comes." },
  { word: "There's a problem with the electrical wiring.", subcategory: "집 수리 - 전기", meaning: "전기 배선에 문제가 있어요.", example: "There's a problem with the electrical wiring. The lights keep flickering." },
  { word: "How much would it cost to fix this?", subcategory: "집 수리 - 비용", meaning: "수리 비용이 얼마나 될까요?", example: "How much would it cost to fix this? Can I get an estimate?" },
  { word: "How long will the repair take?", subcategory: "집 수리 - 시간", meaning: "수리하는 데 얼마나 걸릴까요?", example: "How long will the repair take? I need to plan my day." },

  // 미용실/이발소
  { word: "I'd like to make an appointment for a haircut.", subcategory: "미용실 - 예약", meaning: "커트 예약을 하고 싶습니다.", example: "I'd like to make an appointment for a haircut on Saturday." },
  { word: "Just a trim, please.", subcategory: "미용실 - 스타일", meaning: "다듬기만 해주세요.", example: "Just a trim, please. About an inch off." },
  { word: "I'd like to change my hairstyle.", subcategory: "미용실 - 스타일", meaning: "헤어스타일을 바꾸고 싶어요.", example: "I'd like to change my hairstyle. What would you recommend?" },
  { word: "Can you make it shorter on the sides?", subcategory: "미용실 - 스타일", meaning: "옆머리를 더 짧게 해주실 수 있나요?", example: "Can you make it shorter on the sides? I like it longer on top." },
  { word: "I'd like to dye my hair.", subcategory: "미용실 - 염색", meaning: "머리를 염색하고 싶어요.", example: "I'd like to dye my hair. Do you have any color samples?" },
  { word: "How much is a haircut?", subcategory: "미용실 - 가격", meaning: "커트 비용이 얼마인가요?", example: "How much is a haircut? Does that include washing?" },

  // 반려동물 서비스
  { word: "I'd like to schedule a checkup for my dog.", subcategory: "동물병원 - 예약", meaning: "강아지 건강검진 예약을 하고 싶습니다.", example: "I'd like to schedule a checkup for my dog. When's available?" },
  { word: "My cat hasn't been eating well.", subcategory: "동물병원 - 증상", meaning: "고양이가 밥을 잘 안 먹어요.", example: "My cat hasn't been eating well for the past few days." },
  { word: "Does my pet need any vaccinations?", subcategory: "동물병원 - 예방접종", meaning: "반려동물 예방접종이 필요한가요?", example: "Does my pet need any vaccinations? When was the last one?" },
  { word: "I'd like to book a grooming appointment.", subcategory: "반려동물 - 미용", meaning: "미용 예약을 하고 싶습니다.", example: "I'd like to book a grooming appointment for my poodle." },
  { word: "Do you offer pet boarding?", subcategory: "반려동물 - 호텔", meaning: "반려동물 호텔 서비스가 있나요?", example: "Do you offer pet boarding? I'll be away for a week." },

  // 여행사
  { word: "I'm looking for a vacation package.", subcategory: "여행사 - 패키지", meaning: "휴가 패키지를 찾고 있습니다.", example: "I'm looking for a vacation package to Hawaii for two people." },
  { word: "What destinations do you recommend this time of year?", subcategory: "여행사 - 추천", meaning: "이맘때 어디로 가는 게 좋을까요?", example: "What destinations do you recommend this time of year? We prefer warm weather." },
  { word: "Does the package include flights and hotel?", subcategory: "여행사 - 패키지", meaning: "패키지에 항공편과 호텔이 포함되어 있나요?", example: "Does the package include flights and hotel? What about meals?" },
  { word: "I need to book a round-trip flight.", subcategory: "여행사 - 항공", meaning: "왕복 항공권을 예약해야 합니다.", example: "I need to book a round-trip flight to New York for next month." },
  { word: "Can you help me plan an itinerary?", subcategory: "여행사 - 일정", meaning: "일정 짜는 걸 도와주실 수 있나요?", example: "Can you help me plan an itinerary? It's my first time visiting Europe." },

  // 이사 서비스
  { word: "I need to get a moving quote.", subcategory: "이사 - 견적", meaning: "이사 견적을 받고 싶습니다.", example: "I need to get a moving quote. I'm moving to a new apartment." },
  { word: "How much do you charge for a local move?", subcategory: "이사 - 비용", meaning: "시내 이사는 비용이 얼마인가요?", example: "How much do you charge for a local move? It's about 30 minutes away." },
  { word: "Do you provide packing services?", subcategory: "이사 - 서비스", meaning: "포장 서비스도 제공하나요?", example: "Do you provide packing services? I don't have time to pack myself." },
  { word: "How many movers will come?", subcategory: "이사 - 서비스", meaning: "몇 명이 오나요?", example: "How many movers will come? I have a lot of heavy furniture." },
  { word: "What time will the movers arrive?", subcategory: "이사 - 일정", meaning: "이사 직원들이 몇 시에 오나요?", example: "What time will the movers arrive? I need to be there to let them in." },

  // 부동산
  { word: "I'm looking for an apartment to rent.", subcategory: "부동산 - 임대", meaning: "임대할 아파트를 찾고 있습니다.", example: "I'm looking for an apartment to rent in the downtown area." },
  { word: "What's the monthly rent?", subcategory: "부동산 - 비용", meaning: "월세가 얼마인가요?", example: "What's the monthly rent? Does it include utilities?" },
  { word: "Is there a security deposit?", subcategory: "부동산 - 비용", meaning: "보증금이 있나요?", example: "Is there a security deposit? How much is it?" },
  { word: "When can I move in?", subcategory: "부동산 - 입주", meaning: "언제 입주할 수 있나요?", example: "When can I move in? I need to move by the end of the month." },
  { word: "Can I see the apartment?", subcategory: "부동산 - 방문", meaning: "집을 볼 수 있을까요?", example: "Can I see the apartment? When would be a good time?" },
  { word: "Are pets allowed?", subcategory: "부동산 - 조건", meaning: "반려동물 키울 수 있나요?", example: "Are pets allowed? I have a small dog." },
  { word: "How long is the lease?", subcategory: "부동산 - 계약", meaning: "계약 기간이 얼마인가요?", example: "How long is the lease? Is it a one-year lease?" },

  // 면접
  { word: "I'm here for a job interview.", subcategory: "면접 - 방문", meaning: "면접 보러 왔습니다.", example: "I'm here for a job interview at 10 AM with Ms. Park." },
  { word: "Thank you for the opportunity to interview.", subcategory: "면접 - 인사", meaning: "면접 기회를 주셔서 감사합니다.", example: "Thank you for the opportunity to interview for this position." },
  { word: "Could you tell me more about the position?", subcategory: "면접 - 질문", meaning: "이 직책에 대해 더 알려주실 수 있나요?", example: "Could you tell me more about the position and responsibilities?" },
  { word: "What are the working hours?", subcategory: "면접 - 질문", meaning: "근무 시간이 어떻게 되나요?", example: "What are the working hours? Is there flexibility?" },
  { word: "When can I expect to hear back from you?", subcategory: "면접 - 결과", meaning: "언제쯤 결과를 알 수 있을까요?", example: "When can I expect to hear back from you about the decision?" },

  // 자동차 정비
  { word: "My car is making a strange noise.", subcategory: "정비소 - 증상", meaning: "차에서 이상한 소리가 나요.", example: "My car is making a strange noise when I brake." },
  { word: "I need an oil change.", subcategory: "정비소 - 서비스", meaning: "오일 교환이 필요합니다.", example: "I need an oil change. It's been about 5,000 miles." },
  { word: "The check engine light is on.", subcategory: "정비소 - 증상", meaning: "엔진 경고등이 켜졌어요.", example: "The check engine light is on. What could be wrong?" },
  { word: "How much will the repair cost?", subcategory: "정비소 - 비용", meaning: "수리 비용이 얼마나 될까요?", example: "How much will the repair cost? Can I get a written estimate?" },
  { word: "How long will it take to fix?", subcategory: "정비소 - 시간", meaning: "수리하는 데 얼마나 걸릴까요?", example: "How long will it take to fix? Can I wait here?" },
  { word: "Do you have a loaner car available?", subcategory: "정비소 - 서비스", meaning: "대여 차량이 있나요?", example: "Do you have a loaner car available while mine is being repaired?" },
  { word: "I think my battery is dead.", subcategory: "정비소 - 증상", meaning: "배터리가 방전된 것 같아요.", example: "I think my battery is dead. The car won't start." },
  { word: "I need new tires.", subcategory: "정비소 - 서비스", meaning: "새 타이어가 필요합니다.", example: "I need new tires. What brands do you carry?" },

  // 세탁소
  { word: "I'd like to have these dry cleaned.", subcategory: "세탁소 - 세탁", meaning: "드라이클리닝 해주세요.", example: "I'd like to have these dry cleaned. When will they be ready?" },
  { word: "Can you remove this stain?", subcategory: "세탁소 - 세탁", meaning: "이 얼룩 제거할 수 있나요?", example: "Can you remove this stain? It's coffee." },
  { word: "I need this by tomorrow.", subcategory: "세탁소 - 긴급", meaning: "내일까지 필요해요.", example: "I need this by tomorrow. Is express service available?" },
  { word: "When will my clothes be ready?", subcategory: "세탁소 - 확인", meaning: "옷이 언제 준비되나요?", example: "When will my clothes be ready? I dropped them off yesterday." },
  { word: "I'm here to pick up my clothes.", subcategory: "세탁소 - 수령", meaning: "옷 찾으러 왔습니다.", example: "I'm here to pick up my clothes. The name is Kim." },
  { word: "Can you alter this suit?", subcategory: "세탁소 - 수선", meaning: "이 양복 수선해 주실 수 있나요?", example: "Can you alter this suit? The pants are too long." },

  // 티켓 구매
  { word: "I'd like two tickets for the 7 PM show.", subcategory: "공연 - 구매", meaning: "7시 공연 티켓 2장 주세요.", example: "I'd like two tickets for the 7 PM show, please." },
  { word: "Are there any seats still available?", subcategory: "공연 - 확인", meaning: "아직 좌석이 있나요?", example: "Are there any seats still available for tonight's concert?" },
  { word: "Where are these seats located?", subcategory: "공연 - 좌석", meaning: "이 좌석이 어디에 있나요?", example: "Where are these seats located? Are they in the front?" },
  { word: "Can I choose my seats?", subcategory: "공연 - 좌석", meaning: "좌석을 선택할 수 있나요?", example: "Can I choose my seats? I'd prefer something in the middle." },
  { word: "Is there a student discount?", subcategory: "공연 - 할인", meaning: "학생 할인이 있나요?", example: "Is there a student discount? I have my student ID." },
  { word: "Can I get a refund for this ticket?", subcategory: "공연 - 환불", meaning: "이 티켓 환불 가능한가요?", example: "Can I get a refund for this ticket? I can't make it to the show." },

  // 호텔 - 추가 상황
  { word: "Is breakfast included?", subcategory: "호텔 - 서비스", meaning: "조식이 포함되어 있나요?", example: "Is breakfast included in the room rate?" },
  { word: "What time does breakfast start?", subcategory: "호텔 - 서비스", meaning: "조식이 몇 시부터인가요?", example: "What time does breakfast start? And where is it served?" },
  { word: "Could I get a wake-up call at 7 AM?", subcategory: "호텔 - 서비스", meaning: "7시에 모닝콜 해주실 수 있나요?", example: "Could I get a wake-up call at 7 AM? I have an early flight." },
  { word: "Is there WiFi in the rooms?", subcategory: "호텔 - 서비스", meaning: "객실에 와이파이가 있나요?", example: "Is there WiFi in the rooms? What's the password?" },
  { word: "Could I have some extra towels?", subcategory: "호텔 - 요청", meaning: "수건을 더 주실 수 있나요?", example: "Could I have some extra towels sent to my room?" },
  { word: "The room hasn't been cleaned yet.", subcategory: "호텔 - 문제", meaning: "아직 방 청소가 안 됐어요.", example: "The room hasn't been cleaned yet. Could you send housekeeping?" },
  { word: "I locked myself out of my room.", subcategory: "호텔 - 문제", meaning: "방에 키를 두고 나왔어요.", example: "I locked myself out of my room. Can I get another key card?" },
  { word: "The neighbors are being too loud.", subcategory: "호텔 - 문제", meaning: "옆방이 너무 시끄러워요.", example: "The neighbors are being too loud. Is there anything you can do?" },
  { word: "Can I store my luggage after checkout?", subcategory: "호텔 - 체크아웃", meaning: "체크아웃 후에 짐을 맡길 수 있나요?", example: "Can I store my luggage after checkout? My flight isn't until evening." },

  // 사고/보험
  { word: "I've been in a car accident.", subcategory: "사고 - 신고", meaning: "교통사고가 났습니다.", example: "I've been in a car accident. No one is seriously hurt." },
  { word: "I need to file an insurance claim.", subcategory: "보험 - 청구", meaning: "보험 청구를 해야 합니다.", example: "I need to file an insurance claim for the damage to my car." },
  { word: "Can I get a copy of the police report?", subcategory: "사고 - 서류", meaning: "경찰 보고서 사본을 받을 수 있나요?", example: "Can I get a copy of the police report? I need it for insurance." },
  { word: "What information do you need from me?", subcategory: "보험 - 정보", meaning: "제게 어떤 정보가 필요하신가요?", example: "What information do you need from me to process the claim?" },
  { word: "How long will it take to process the claim?", subcategory: "보험 - 처리", meaning: "청구 처리에 얼마나 걸리나요?", example: "How long will it take to process the claim? I need to get my car fixed." },

  // 이웃 관련
  { word: "Hi, I just moved in next door.", subcategory: "이웃 - 인사", meaning: "안녕하세요, 옆집에 새로 이사 왔어요.", example: "Hi, I just moved in next door. I wanted to introduce myself." },
  { word: "Could you please keep the noise down?", subcategory: "이웃 - 요청", meaning: "소음 좀 줄여주실 수 있을까요?", example: "Could you please keep the noise down after 10 PM?" },
  { word: "My package was delivered to your address by mistake.", subcategory: "이웃 - 문의", meaning: "제 택배가 실수로 댁으로 배달된 것 같아요.", example: "My package was delivered to your address by mistake. Did you receive it?" },
  { word: "Could you watch my place while I'm away?", subcategory: "이웃 - 부탁", meaning: "제가 없는 동안 집 좀 봐주실 수 있나요?", example: "Could you watch my place while I'm away on vacation?" },
  { word: "I'm having a party this weekend. I hope it won't be too noisy.", subcategory: "이웃 - 알림", meaning: "이번 주말에 파티를 하는데 너무 시끄럽지 않았으면 좋겠어요.", example: "I'm having a party this weekend. I hope it won't be too noisy for you." },

  // 공항 - 추가 상황
  { word: "I'd like to check in for my flight.", subcategory: "공항 - 체크인", meaning: "비행기 체크인하고 싶습니다.", example: "I'd like to check in for my flight to Tokyo." },
  { word: "How many bags can I check?", subcategory: "공항 - 수하물", meaning: "가방을 몇 개 부칠 수 있나요?", example: "How many bags can I check? Is there a weight limit?" },
  { word: "Is my flight on time?", subcategory: "공항 - 확인", meaning: "비행기 정시에 출발하나요?", example: "Is my flight on time? I see it's not on the board yet." },
  { word: "Where can I get a boarding pass?", subcategory: "공항 - 체크인", meaning: "탑승권은 어디서 받을 수 있나요?", example: "Where can I get a boarding pass? I checked in online." },
  { word: "I missed my connecting flight.", subcategory: "공항 - 문제", meaning: "연결편을 놓쳤습니다.", example: "I missed my connecting flight because of the delay. What can I do?" },
  { word: "Can I change my seat?", subcategory: "공항 - 좌석", meaning: "좌석을 변경할 수 있나요?", example: "Can I change my seat? I'd prefer a window seat." },
  { word: "Where is the currency exchange?", subcategory: "공항 - 시설", meaning: "환전소가 어디에 있나요?", example: "Where is the currency exchange? I need to get some local money." },

  // 쇼핑 - 추가 상황
  { word: "Do you have this in other colors?", subcategory: "쇼핑 - 옵션", meaning: "다른 색상도 있나요?", example: "Do you have this in other colors? I'm looking for something darker." },
  { word: "What's your return policy?", subcategory: "쇼핑 - 정책", meaning: "반품 정책이 어떻게 되나요?", example: "What's your return policy? How many days do I have?" },
  { word: "Does this come with a warranty?", subcategory: "쇼핑 - 보증", meaning: "보증이 있나요?", example: "Does this come with a warranty? How long does it last?" },
  { word: "Can you gift wrap this for me?", subcategory: "쇼핑 - 서비스", meaning: "선물 포장해 주실 수 있나요?", example: "Can you gift wrap this for me? It's a birthday present." },
  { word: "Do you price match?", subcategory: "쇼핑 - 가격", meaning: "가격 매칭해 주시나요?", example: "Do you price match? I found it cheaper online." },
  { word: "Is there a fitting room available?", subcategory: "쇼핑 - 피팅", meaning: "탈의실 사용 가능한가요?", example: "Is there a fitting room available? I'd like to try a few things on." },

  // 교통 - 택시/우버
  { word: "Can you take me to the airport?", subcategory: "택시 - 목적지", meaning: "공항까지 가주실 수 있나요?", example: "Can you take me to the airport? I have a flight at 3 PM." },
  { word: "How much will it cost to get to downtown?", subcategory: "택시 - 비용", meaning: "시내까지 얼마나 나올까요?", example: "How much will it cost to get to downtown? Is it metered?" },
  { word: "Could you turn on the meter, please?", subcategory: "택시 - 요청", meaning: "미터기 켜주시겠어요?", example: "Could you turn on the meter, please? I'd prefer to use the meter." },
  { word: "Please take the fastest route.", subcategory: "택시 - 요청", meaning: "가장 빠른 길로 가주세요.", example: "Please take the fastest route. I'm in a hurry." },
  { word: "Can you drop me off at the corner?", subcategory: "택시 - 요청", meaning: "저 모퉁이에서 내려주시겠어요?", example: "Can you drop me off at the corner? That would be perfect." },
  { word: "Keep the change.", subcategory: "택시 - 결제", meaning: "잔돈은 가지세요.", example: "Here you go. Keep the change. Thank you!" },

  // 카페
  { word: "I'd like a large coffee, please.", subcategory: "카페 - 주문", meaning: "큰 사이즈 커피 주세요.", example: "I'd like a large coffee, please. Black with no sugar." },
  { word: "Can I get that with oat milk?", subcategory: "카페 - 옵션", meaning: "귀리 우유로 해주실 수 있나요?", example: "Can I get that with oat milk instead of regular milk?" },
  { word: "Is there a plug where I can charge my laptop?", subcategory: "카페 - 시설", meaning: "노트북 충전할 수 있는 콘센트가 있나요?", example: "Is there a plug where I can charge my laptop? I'll be working here." },
  { word: "What's the WiFi password?", subcategory: "카페 - 시설", meaning: "와이파이 비밀번호가 뭔가요?", example: "What's the WiFi password? I need to get online." },
  { word: "Can I get this for here, not to go?", subcategory: "카페 - 주문", meaning: "테이크아웃 말고 여기서 마실게요.", example: "Can I get this for here, not to go? I'd like a real cup, please." },

  // 은행 - 추가
  { word: "I'd like to apply for a credit card.", subcategory: "은행 - 신청", meaning: "신용카드를 신청하고 싶습니다.", example: "I'd like to apply for a credit card. What are the requirements?" },
  { word: "I need to report my card as lost.", subcategory: "은행 - 분실", meaning: "카드 분실 신고를 해야 합니다.", example: "I need to report my card as lost. Can you block it immediately?" },
  { word: "I'd like to deposit this check.", subcategory: "은행 - 입금", meaning: "이 수표를 입금하고 싶습니다.", example: "I'd like to deposit this check into my savings account." },
  { word: "What's the interest rate on savings accounts?", subcategory: "은행 - 문의", meaning: "저축 계좌 이자율이 어떻게 되나요?", example: "What's the interest rate on savings accounts?" },
  { word: "I need to update my address.", subcategory: "은행 - 정보 변경", meaning: "주소를 변경해야 합니다.", example: "I need to update my address. I've recently moved." },

  // 기타 상황들
  { word: "I'd like to file a complaint about noise.", subcategory: "민원 - 소음", meaning: "소음에 대해 민원을 넣고 싶습니다.", example: "I'd like to file a complaint about noise from the construction site." },
  { word: "Where can I recycle these bottles?", subcategory: "일상 - 재활용", meaning: "이 병들을 어디서 재활용할 수 있나요?", example: "Where can I recycle these bottles? Is there a recycling bin nearby?" },
  { word: "I need to report a power outage.", subcategory: "긴급 - 정전", meaning: "정전 신고를 해야 합니다.", example: "I need to report a power outage. The whole building is dark." },
  { word: "Is there a restroom nearby?", subcategory: "일상 - 시설", meaning: "근처에 화장실이 있나요?", example: "Is there a restroom nearby? I really need to use one." },
  { word: "Could you take a picture of us?", subcategory: "일상 - 요청", meaning: "저희 사진 좀 찍어주시겠어요?", example: "Could you take a picture of us? Just press this button." },
  { word: "Do you have a charger I could borrow?", subcategory: "일상 - 요청", meaning: "빌릴 수 있는 충전기 있나요?", example: "Do you have a charger I could borrow? My phone is about to die." },
  { word: "What time do you close?", subcategory: "일상 - 문의", meaning: "몇 시에 문 닫나요?", example: "What time do you close? I want to make sure I have enough time." },
  { word: "Do you accept credit cards?", subcategory: "결제 - 문의", meaning: "신용카드 되나요?", example: "Do you accept credit cards? Or is it cash only?" },
  { word: "Can I pay with my phone?", subcategory: "결제 - 문의", meaning: "휴대폰으로 결제할 수 있나요?", example: "Can I pay with my phone? I have Apple Pay." },
  { word: "I think you gave me the wrong change.", subcategory: "결제 - 문제", meaning: "거스름돈이 잘못된 것 같아요.", example: "I think you gave me the wrong change. I gave you a $20 bill." }
];

let startIdx = data.words.length;

for (let i = 0; i < newPatterns.length; i++) {
  const p = newPatterns[i];
  const newWord = {
    id: `opic_rp_${String(startIdx + i + 1).padStart(3, '0')}`,
    word: p.word,
    subcategory: p.subcategory,
    meanings: [{ meaning: p.meaning, examples: [p.example] }]
  };
  data.words.push(newWord);
}

console.log('추가된 패턴 수:', newPatterns.length);
console.log('최종 패턴 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
