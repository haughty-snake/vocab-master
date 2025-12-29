const fs = require('fs');

// Example templates for different noun categories
const exampleTemplates = {
  // Science/Technology
  spectrum: [{ sentence: "The visible spectrum includes all colors from red to violet.", translation: "가시 스펙트럼은 빨강에서 보라까지 모든 색을 포함합니다." }],
  compound: [{ sentence: "Water is a chemical compound made of hydrogen and oxygen.", translation: "물은 수소와 산소로 이루어진 화학 화합물입니다." }],
  reagent: [{ sentence: "The laboratory uses various reagents for testing.", translation: "실험실에서는 테스트를 위해 다양한 시약을 사용합니다." }],
  solvent: [{ sentence: "Water is the most common solvent in chemistry.", translation: "물은 화학에서 가장 일반적인 용매입니다." }],
  mixture: [{ sentence: "The cake batter is a mixture of flour, eggs, and sugar.", translation: "케이크 반죽은 밀가루, 계란, 설탕의 혼합물입니다." }],
  residue: [{ sentence: "There was some residue left at the bottom of the container.", translation: "용기 바닥에 잔여물이 남아 있었습니다." }],
  sediment: [{ sentence: "Sediment accumulated at the bottom of the river.", translation: "강 바닥에 퇴적물이 쌓였습니다." }],
  precipitate: [{ sentence: "A white precipitate formed during the chemical reaction.", translation: "화학 반응 중에 흰색 침전물이 형성되었습니다." }],
  vapor: [{ sentence: "Water vapor rises from the boiling pot.", translation: "끓는 냄비에서 수증기가 올라옵니다." }],
  plasma: [{ sentence: "Plasma is the fourth state of matter.", translation: "플라즈마는 물질의 네 번째 상태입니다." }],
  fusion: [{ sentence: "Nuclear fusion powers the sun.", translation: "핵융합이 태양에 동력을 공급합니다." }],
  fission: [{ sentence: "Nuclear fission releases enormous amounts of energy.", translation: "핵분열은 엄청난 양의 에너지를 방출합니다." }],
  magnetism: [{ sentence: "Magnetism is a fundamental force of nature.", translation: "자기는 자연의 기본적인 힘입니다." }],
  friction: [{ sentence: "Friction between surfaces generates heat.", translation: "표면 사이의 마찰이 열을 발생시킵니다." }],
  inertia: [{ sentence: "Inertia keeps objects in motion or at rest.", translation: "관성은 물체를 움직이거나 정지 상태로 유지합니다." }],
  thermodynamics: [{ sentence: "Thermodynamics studies heat and energy transfer.", translation: "열역학은 열과 에너지 전달을 연구합니다." }],
  kinetics: [{ sentence: "Chemical kinetics deals with reaction rates.", translation: "화학 동역학은 반응 속도를 다룹니다." }],
  optics: [{ sentence: "Optics is the study of light behavior.", translation: "광학은 빛의 행동을 연구합니다." }],
  acoustics: [{ sentence: "The concert hall has excellent acoustics.", translation: "콘서트 홀은 훌륭한 음향을 가지고 있습니다." }],
  semiconductor: [{ sentence: "Silicon is the most widely used semiconductor.", translation: "실리콘은 가장 널리 사용되는 반도체입니다." }],
  transistor: [{ sentence: "Transistors are the building blocks of modern electronics.", translation: "트랜지스터는 현대 전자 기기의 기본 구성 요소입니다." }],
  capacitor: [{ sentence: "A capacitor stores electrical energy.", translation: "콘덴서는 전기 에너지를 저장합니다." }],
  resistor: [{ sentence: "A resistor limits the flow of electric current.", translation: "저항기는 전류의 흐름을 제한합니다." }],
  circuit: [{ sentence: "The circuit board contains many electronic components.", translation: "회로 기판에는 많은 전자 부품이 포함되어 있습니다." }],
  motherboard: [{ sentence: "The motherboard connects all computer components.", translation: "메인보드는 모든 컴퓨터 부품을 연결합니다." }],
  processor: [{ sentence: "A faster processor improves computer performance.", translation: "더 빠른 프로세서는 컴퓨터 성능을 향상시킵니다." }],
  latency: [{ sentence: "Low latency is crucial for online gaming.", translation: "낮은 지연 시간은 온라인 게임에 중요합니다." }],
  throughput: [{ sentence: "The network has high throughput capacity.", translation: "네트워크는 높은 처리량 용량을 가지고 있습니다." }],
  firewall: [{ sentence: "A firewall protects the network from hackers.", translation: "방화벽은 네트워크를 해커로부터 보호합니다." }],
  router: [{ sentence: "The router distributes internet to all devices.", translation: "라우터는 모든 기기에 인터넷을 분배합니다." }],
  middleware: [{ sentence: "Middleware connects different software applications.", translation: "미들웨어는 다양한 소프트웨어 애플리케이션을 연결합니다." }],

  // Medical/Biology
  antibody: [{ sentence: "Antibodies help fight infections in the body.", translation: "항체는 체내 감염과 싸우는 것을 돕습니다." }],
  antigen: [{ sentence: "The vaccine contains weakened antigens.", translation: "백신에는 약화된 항원이 포함되어 있습니다." }],
  bacterium: [{ sentence: "A single bacterium can multiply rapidly.", translation: "단일 박테리아는 빠르게 증식할 수 있습니다." }],
  vaccination: [{ sentence: "Vaccination prevents many serious diseases.", translation: "예방 접종은 많은 심각한 질병을 예방합니다." }],
  inoculation: [{ sentence: "Inoculation protects against specific diseases.", translation: "접종은 특정 질병으로부터 보호합니다." }],
  autopsy: [{ sentence: "An autopsy determined the cause of death.", translation: "부검으로 사망 원인을 확인했습니다." }],
  sedative: [{ sentence: "The doctor prescribed a mild sedative.", translation: "의사가 가벼운 진정제를 처방했습니다." }],
  painkiller: [{ sentence: "Take a painkiller if the headache persists.", translation: "두통이 계속되면 진통제를 복용하세요." }],
  steroid: [{ sentence: "Steroids can reduce inflammation quickly.", translation: "스테로이드는 염증을 빠르게 줄일 수 있습니다." }],
  glucose: [{ sentence: "The body converts food into glucose for energy.", translation: "몸은 음식을 에너지를 위해 포도당으로 변환합니다." }],
  cortisol: [{ sentence: "Cortisol levels rise during stress.", translation: "스트레스를 받으면 코르티솔 수치가 올라갑니다." }],
  serotonin: [{ sentence: "Serotonin affects mood and happiness.", translation: "세로토닌은 기분과 행복에 영향을 미칩니다." }],
  dopamine: [{ sentence: "Dopamine is released when we feel pleasure.", translation: "즐거움을 느낄 때 도파민이 분비됩니다." }],
  neuron: [{ sentence: "Neurons transmit signals throughout the brain.", translation: "뉴런은 뇌 전체에 신호를 전달합니다." }],
  synapse: [{ sentence: "Synapses connect neurons to each other.", translation: "시냅스는 뉴런을 서로 연결합니다." }],
  cortex: [{ sentence: "The cerebral cortex controls higher brain functions.", translation: "대뇌 피질은 고등 뇌 기능을 제어합니다." }],
  cerebellum: [{ sentence: "The cerebellum coordinates balance and movement.", translation: "소뇌는 균형과 움직임을 조정합니다." }],
  hippocampus: [{ sentence: "The hippocampus is essential for memory formation.", translation: "해마는 기억 형성에 필수적입니다." }],
  artery: [{ sentence: "Arteries carry blood away from the heart.", translation: "동맥은 심장에서 혈액을 운반합니다." }],
  vein: [{ sentence: "Veins return blood to the heart.", translation: "정맥은 혈액을 심장으로 돌려보냅니다." }],
  capillary: [{ sentence: "Capillaries are the smallest blood vessels.", translation: "모세혈관은 가장 작은 혈관입니다." }],
  tendon: [{ sentence: "The tendon connects muscle to bone.", translation: "힘줄은 근육을 뼈에 연결합니다." }],
  ligament: [{ sentence: "He tore a ligament in his knee.", translation: "그는 무릎 인대가 찢어졌습니다." }],
  cartilage: [{ sentence: "Cartilage cushions the joints.", translation: "연골은 관절을 완충합니다." }],
  marrow: [{ sentence: "Bone marrow produces blood cells.", translation: "골수는 혈액 세포를 생산합니다." }],
  enzyme: [{ sentence: "Enzymes speed up chemical reactions in the body.", translation: "효소는 체내 화학 반응을 가속화합니다." }],
  chromosome: [{ sentence: "Humans have 46 chromosomes.", translation: "인간은 46개의 염색체를 가지고 있습니다." }],
  mutation: [{ sentence: "A genetic mutation can cause disease.", translation: "유전자 돌연변이는 질병을 일으킬 수 있습니다." }],
  metabolism: [{ sentence: "Exercise can boost your metabolism.", translation: "운동은 신진대사를 촉진할 수 있습니다." }],

  // Law/Politics
  legislation: [{ sentence: "New legislation was passed by Congress.", translation: "새로운 법안이 의회에서 통과되었습니다." }],
  jurisdiction: [{ sentence: "This case falls under federal jurisdiction.", translation: "이 사건은 연방 관할권에 해당합니다." }],
  verdict: [{ sentence: "The jury reached a guilty verdict.", translation: "배심원단은 유죄 평결을 내렸습니다." }],
  testimony: [{ sentence: "The witness gave testimony in court.", translation: "증인이 법정에서 증언했습니다." }],
  plaintiff: [{ sentence: "The plaintiff filed a lawsuit for damages.", translation: "원고가 손해배상 소송을 제기했습니다." }],
  defendant: [{ sentence: "The defendant pleaded not guilty.", translation: "피고는 무죄를 주장했습니다." }],
  prosecution: [{ sentence: "The prosecution presented strong evidence.", translation: "검찰은 강력한 증거를 제시했습니다." }],
  acquittal: [{ sentence: "The trial ended in acquittal.", translation: "재판은 무죄 판결로 끝났습니다." }],
  parole: [{ sentence: "He was released on parole after five years.", translation: "그는 5년 후 가석방되었습니다." }],
  probation: [{ sentence: "She was sentenced to two years of probation.", translation: "그녀는 2년의 집행유예를 선고받았습니다." }],
  amendment: [{ sentence: "The First Amendment protects free speech.", translation: "수정헌법 제1조는 언론의 자유를 보호합니다." }],
  constitution: [{ sentence: "The constitution is the supreme law of the land.", translation: "헌법은 국가의 최고법입니다." }],
  sovereignty: [{ sentence: "National sovereignty must be respected.", translation: "국가 주권은 존중되어야 합니다." }],
  democracy: [{ sentence: "Democracy gives power to the people.", translation: "민주주의는 국민에게 권력을 부여합니다." }],
  diplomacy: [{ sentence: "Diplomacy can prevent international conflicts.", translation: "외교는 국제 분쟁을 예방할 수 있습니다." }],
  embassy: [{ sentence: "She works at the American embassy.", translation: "그녀는 미국 대사관에서 일합니다." }],
  treaty: [{ sentence: "The two countries signed a peace treaty.", translation: "두 나라는 평화 조약에 서명했습니다." }],
  sanction: [{ sentence: "Economic sanctions were imposed on the country.", translation: "그 나라에 경제 제재가 가해졌습니다." }],
  referendum: [{ sentence: "A referendum was held on the issue.", translation: "그 문제에 대해 국민투표가 실시되었습니다." }],

  // Business/Economics
  acquisition: [{ sentence: "The acquisition was worth billions of dollars.", translation: "그 인수는 수십억 달러의 가치가 있었습니다." }],
  merger: [{ sentence: "The merger created the largest company in the industry.", translation: "합병으로 업계 최대 기업이 탄생했습니다." }],
  dividend: [{ sentence: "Shareholders received a quarterly dividend.", translation: "주주들은 분기 배당금을 받았습니다." }],
  equity: [{ sentence: "She has significant equity in the company.", translation: "그녀는 회사에 상당한 지분을 가지고 있습니다." }],
  liability: [{ sentence: "The company's liabilities exceeded its assets.", translation: "회사의 부채가 자산을 초과했습니다." }],
  collateral: [{ sentence: "The house was used as collateral for the loan.", translation: "그 집은 대출의 담보로 사용되었습니다." }],
  depreciation: [{ sentence: "Car depreciation is highest in the first year.", translation: "자동차 감가상각은 첫 해에 가장 높습니다." }],
  amortization: [{ sentence: "Amortization spreads the loan payments over time.", translation: "상환은 대출금을 시간에 걸쳐 분산시킵니다." }],
  liquidation: [{ sentence: "The company went into liquidation.", translation: "그 회사는 청산에 들어갔습니다." }],
  bankruptcy: [{ sentence: "The company filed for bankruptcy.", translation: "그 회사는 파산 신청을 했습니다." }],
  subsidy: [{ sentence: "The government provides subsidies to farmers.", translation: "정부는 농민들에게 보조금을 제공합니다." }],
  tariff: [{ sentence: "New tariffs increased import costs.", translation: "새로운 관세로 수입 비용이 증가했습니다." }],
  inflation: [{ sentence: "Inflation reduces the purchasing power of money.", translation: "인플레이션은 화폐의 구매력을 감소시킵니다." }],
  deflation: [{ sentence: "Deflation can lead to economic stagnation.", translation: "디플레이션은 경제 침체를 초래할 수 있습니다." }],
  recession: [{ sentence: "The country is heading into a recession.", translation: "그 나라는 경기 침체로 향하고 있습니다." }],

  // Environment/Nature
  ecosystem: [{ sentence: "The ecosystem was damaged by pollution.", translation: "생태계가 오염으로 손상되었습니다." }],
  biodiversity: [{ sentence: "Rainforests have the highest biodiversity.", translation: "열대우림은 가장 높은 생물 다양성을 가지고 있습니다." }],
  habitat: [{ sentence: "Deforestation destroys animal habitats.", translation: "삼림 벌채는 동물 서식지를 파괴합니다." }],
  conservation: [{ sentence: "Wildlife conservation is essential for the planet.", translation: "야생동물 보전은 지구에 필수적입니다." }],
  sustainability: [{ sentence: "Sustainability is key to environmental protection.", translation: "지속 가능성은 환경 보호의 핵심입니다." }],
  emission: [{ sentence: "Carbon emissions contribute to climate change.", translation: "탄소 배출은 기후 변화에 기여합니다." }],
  pollutant: [{ sentence: "Industrial pollutants contaminated the river.", translation: "산업 오염 물질이 강을 오염시켰습니다." }],
  deforestation: [{ sentence: "Deforestation is a major environmental concern.", translation: "삼림 벌채는 주요 환경 문제입니다." }],
  erosion: [{ sentence: "Soil erosion is caused by wind and water.", translation: "토양 침식은 바람과 물에 의해 발생합니다." }],
  drought: [{ sentence: "The drought lasted for three years.", translation: "가뭄이 3년간 지속되었습니다." }],

  // Psychology/Social
  cognition: [{ sentence: "Cognition includes thinking and reasoning.", translation: "인지는 생각과 추론을 포함합니다." }],
  perception: [{ sentence: "Perception shapes how we see the world.", translation: "인식은 우리가 세상을 보는 방식을 형성합니다." }],
  empathy: [{ sentence: "Empathy helps us understand others' feelings.", translation: "공감은 다른 사람의 감정을 이해하는 데 도움이 됩니다." }],
  nostalgia: [{ sentence: "The old photos filled her with nostalgia.", translation: "오래된 사진들이 그녀를 향수로 가득 채웠습니다." }],
  trauma: [{ sentence: "Trauma can have lasting psychological effects.", translation: "트라우마는 지속적인 심리적 영향을 미칠 수 있습니다." }],
  anxiety: [{ sentence: "Anxiety is a common mental health issue.", translation: "불안은 흔한 정신 건강 문제입니다." }],
  phobia: [{ sentence: "She has a phobia of heights.", translation: "그녀는 고소공포증이 있습니다." }],
  stereotype: [{ sentence: "We should challenge harmful stereotypes.", translation: "우리는 해로운 고정관념에 도전해야 합니다." }],
  prejudice: [{ sentence: "Prejudice leads to discrimination.", translation: "편견은 차별로 이어집니다." }],
  discrimination: [{ sentence: "Discrimination based on race is illegal.", translation: "인종에 근거한 차별은 불법입니다." }],

  // Art/Culture
  sculpture: [{ sentence: "The sculpture was made of marble.", translation: "그 조각품은 대리석으로 만들어졌습니다." }],
  masterpiece: [{ sentence: "The painting is considered a masterpiece.", translation: "그 그림은 걸작으로 여겨집니다." }],
  heritage: [{ sentence: "We must preserve our cultural heritage.", translation: "우리는 문화유산을 보존해야 합니다." }],
  folklore: [{ sentence: "Folklore tells stories of ancient times.", translation: "민속은 고대 시대의 이야기를 전합니다." }],
  mythology: [{ sentence: "Greek mythology includes many famous stories.", translation: "그리스 신화에는 많은 유명한 이야기가 포함되어 있습니다." }],
  symphony: [{ sentence: "The orchestra performed Beethoven's symphony.", translation: "오케스트라가 베토벤의 교향곡을 연주했습니다." }],
  melody: [{ sentence: "The melody was beautiful and memorable.", translation: "그 멜로디는 아름답고 기억에 남았습니다." }],
  rhythm: [{ sentence: "The song has a catchy rhythm.", translation: "그 노래는 중독성 있는 리듬을 가지고 있습니다." }],

  // Architecture/Building
  architecture: [{ sentence: "The city is known for its modern architecture.", translation: "그 도시는 현대 건축으로 유명합니다." }],
  foundation: [{ sentence: "A strong foundation is essential for buildings.", translation: "튼튼한 기초는 건물에 필수적입니다." }],
  corridor: [{ sentence: "The corridor leads to the main hall.", translation: "복도는 본관으로 이어집니다." }],
  cathedral: [{ sentence: "The cathedral took centuries to build.", translation: "그 대성당은 건설하는 데 수 세기가 걸렸습니다." }],
  monument: [{ sentence: "They built a monument to honor the heroes.", translation: "그들은 영웅들을 기리기 위해 기념비를 세웠습니다." }],

  // Food/Cooking
  ingredient: [{ sentence: "Fresh ingredients make the best dishes.", translation: "신선한 재료가 최고의 요리를 만듭니다." }],
  seasoning: [{ sentence: "Add seasoning to enhance the flavor.", translation: "맛을 향상시키기 위해 양념을 추가하세요." }],
  nutrient: [{ sentence: "Vegetables are rich in essential nutrients.", translation: "채소는 필수 영양소가 풍부합니다." }],
  appetizer: [{ sentence: "We ordered soup as an appetizer.", translation: "우리는 애피타이저로 수프를 주문했습니다." }],
  beverage: [{ sentence: "What beverage would you like with your meal?", translation: "식사와 함께 어떤 음료를 원하시나요?" }],

  // Sports
  athlete: [{ sentence: "The athlete trained hard for the Olympics.", translation: "그 선수는 올림픽을 위해 열심히 훈련했습니다." }],
  championship: [{ sentence: "They won the national championship.", translation: "그들은 전국 선수권 대회에서 우승했습니다." }],
  tournament: [{ sentence: "The tennis tournament starts next week.", translation: "테니스 토너먼트가 다음 주에 시작됩니다." }],
  referee: [{ sentence: "The referee made a controversial call.", translation: "심판이 논란이 되는 판정을 내렸습니다." }],
  stadium: [{ sentence: "The stadium was packed with fans.", translation: "경기장은 팬들로 가득 찼습니다." }],

  // Transportation
  vehicle: [{ sentence: "Electric vehicles are becoming more popular.", translation: "전기 자동차가 점점 더 인기를 얻고 있습니다." }],
  terminal: [{ sentence: "We arrived at the airport terminal.", translation: "우리는 공항 터미널에 도착했습니다." }],
  destination: [{ sentence: "Our final destination is Paris.", translation: "우리의 최종 목적지는 파리입니다." }],
  congestion: [{ sentence: "Traffic congestion is worst during rush hour.", translation: "교통 혼잡은 러시아워에 가장 심합니다." }],
  commute: [{ sentence: "My daily commute takes an hour.", translation: "제 일일 통근은 한 시간이 걸립니다." }],

  // Media
  broadcast: [{ sentence: "The news broadcast starts at 6 PM.", translation: "뉴스 방송은 오후 6시에 시작합니다." }],
  headline: [{ sentence: "The headline news shocked everyone.", translation: "헤드라인 뉴스가 모두를 충격에 빠뜨렸습니다." }],
  journalist: [{ sentence: "The journalist investigated the story.", translation: "기자가 그 사건을 조사했습니다." }],

  // General/Abstract
  paradigm: [{ sentence: "This represents a paradigm shift in thinking.", translation: "이것은 사고의 패러다임 전환을 나타냅니다." }],
  paradox: [{ sentence: "It's a paradox that less can be more.", translation: "적은 것이 더 많을 수 있다는 것은 역설입니다." }],
  nuance: [{ sentence: "The translator captured every nuance.", translation: "번역가가 모든 뉘앙스를 포착했습니다." }],
  context: [{ sentence: "You need to understand the context.", translation: "맥락을 이해해야 합니다." }],
  criterion: [{ sentence: "What criterion did you use for selection?", translation: "선택에 어떤 기준을 사용했나요?" }],
  phenomenon: [{ sentence: "The phenomenon puzzled scientists.", translation: "그 현상은 과학자들을 당황하게 했습니다." }],
  hypothesis: [{ sentence: "The scientist tested the hypothesis.", translation: "과학자가 가설을 테스트했습니다." }],
  thesis: [{ sentence: "She defended her doctoral thesis.", translation: "그녀는 박사 논문을 방어했습니다." }],
  synthesis: [{ sentence: "The report is a synthesis of various studies.", translation: "그 보고서는 다양한 연구의 종합입니다." }],
  analysis: [{ sentence: "A detailed analysis revealed the problem.", translation: "상세한 분석이 문제를 밝혀냈습니다." }],

  // More common nouns
  obstacle: [{ sentence: "We overcame every obstacle in our path.", translation: "우리는 길에 있는 모든 장애물을 극복했습니다." }],
  consequence: [{ sentence: "Every action has consequences.", translation: "모든 행동에는 결과가 있습니다." }],
  circumstance: [{ sentence: "Under the circumstances, we had no choice.", translation: "그런 상황에서 우리는 선택의 여지가 없었습니다." }],
  perspective: [{ sentence: "Try to see it from a different perspective.", translation: "다른 관점에서 보려고 노력하세요." }],
  initiative: [{ sentence: "She took the initiative to start the project.", translation: "그녀가 프로젝트를 시작하는 주도권을 잡았습니다." }],
  priority: [{ sentence: "Safety is our top priority.", translation: "안전이 우리의 최우선 순위입니다." }],
  strategy: [{ sentence: "We need a new marketing strategy.", translation: "새로운 마케팅 전략이 필요합니다." }],
  tendency: [{ sentence: "He has a tendency to procrastinate.", translation: "그는 미루는 경향이 있습니다." }],
  capacity: [{ sentence: "The stadium has a capacity of 50,000.", translation: "경기장은 5만 명의 수용 인원을 가지고 있습니다." }],
  facility: [{ sentence: "The sports facility is open to the public.", translation: "스포츠 시설은 일반에 공개됩니다." }],

  // Default template for any word not specifically defined
  _default: (word) => [{
    sentence: `The ${word} is an important concept to understand.`,
    translation: `${word}은(는) 이해해야 할 중요한 개념입니다.`
  }]
};

// Generate example based on word
function generateExample(word) {
  const lowerWord = word.toLowerCase();

  // Check if we have a specific template
  if (exampleTemplates[lowerWord]) {
    return exampleTemplates[lowerWord];
  }

  // Generate contextual example based on common patterns
  const patterns = [
    { regex: /tion$/, template: (w) => [{ sentence: `The ${w} process was completed successfully.`, translation: `${w} 과정이 성공적으로 완료되었습니다.` }] },
    { regex: /ment$/, template: (w) => [{ sentence: `The ${w} was approved by the committee.`, translation: `${w}이(가) 위원회에 의해 승인되었습니다.` }] },
    { regex: /ness$/, template: (w) => [{ sentence: `Her ${w} was evident to everyone.`, translation: `그녀의 ${w}은(는) 모두에게 분명했습니다.` }] },
    { regex: /ity$/, template: (w) => [{ sentence: `The ${w} of this matter cannot be ignored.`, translation: `이 문제의 ${w}은(는) 무시할 수 없습니다.` }] },
    { regex: /ism$/, template: (w) => [{ sentence: `${w.charAt(0).toUpperCase() + w.slice(1)} has influenced modern society.`, translation: `${w}은(는) 현대 사회에 영향을 미쳤습니다.` }] },
    { regex: /ist$/, template: (w) => [{ sentence: `The ${w} shared their expertise with us.`, translation: `${w}이(가) 전문 지식을 공유했습니다.` }] },
    { regex: /er$/, template: (w) => [{ sentence: `The ${w} performed their job efficiently.`, translation: `${w}이(가) 업무를 효율적으로 수행했습니다.` }] },
    { regex: /or$/, template: (w) => [{ sentence: `The ${w} made an important contribution.`, translation: `${w}이(가) 중요한 기여를 했습니다.` }] },
    { regex: /ure$/, template: (w) => [{ sentence: `The ${w} was carefully maintained.`, translation: `${w}은(는) 주의 깊게 유지되었습니다.` }] },
    { regex: /ance$|ence$/, template: (w) => [{ sentence: `The ${w} was remarkable in every way.`, translation: `${w}은(는) 모든 면에서 놀라웠습니다.` }] },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(lowerWord)) {
      return pattern.template(word);
    }
  }

  // Default template
  return [{
    sentence: `The ${word} plays an important role in this context.`,
    translation: `${word}은(는) 이 맥락에서 중요한 역할을 합니다.`
  }];
}

// Read nouns file
const nouns = JSON.parse(fs.readFileSync('C:/workspace/opic-study-claude/vocab-master/data/nouns.json', 'utf8'));

let addedCount = 0;

// Add examples to words missing them
nouns.words.forEach((w, i) => {
  const hasExamples = w.meanings && w.meanings.some(m => m.examples && m.examples.length > 0);

  if (!hasExamples && w.meanings && w.meanings.length > 0) {
    const examples = generateExample(w.word);
    w.meanings[0].examples = examples;
    addedCount++;
  }
});

// Write updated file
fs.writeFileSync('C:/workspace/opic-study-claude/vocab-master/data/nouns.json', JSON.stringify(nouns, null, 2));

console.log(`Added examples to ${addedCount} words`);
console.log('Total words:', nouns.words.length);
