const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/nouns.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 명사 수:', existingWords.size);

const moreNouns = [
  // 추가 명사들 (280개)
  "batch", "bay", "beam", "bean", "beast", "beauty", "bed", "bedroom", "beef", "beer",
  "beginner", "beginning", "behalf", "behavior", "belief", "bell", "belly", "bench", "bend", "benefit",
  "bet", "bill", "bird", "birth", "bit", "bite", "blade", "blame", "blank", "blast",
  "blend", "blind", "block", "blood", "blow", "board", "boast", "body", "boil", "bomb",
  "bond", "bone", "bonus", "book", "boom", "boost", "border", "boss", "bother", "bottom",
  "bounce", "bound", "brain", "brake", "brand", "brass", "brave", "breach", "breakdown", "breast",
  "breath", "breed", "brick", "bride", "brief", "brightness", "broadcast", "brochure", "broker", "bronze",
  "brother", "brush", "bubble", "buck", "buddy", "budget", "buffer", "bug", "builder", "bulk",
  "bullet", "bunch", "bundle", "burden", "burial", "burst", "bush", "businessman", "buyer", "cabin",
  "cable", "cafe", "cage", "calcium", "calendar", "calf", "calm", "camera", "camp", "campaign",

  "canal", "cancer", "candidate", "candle", "candy", "cannon", "canvas", "canyon", "capability", "cape",
  "capital", "captain", "capture", "carbon", "card", "care", "career", "cargo", "carpet", "carrier",
  "carrot", "cart", "cartoon", "carving", "cash", "casino", "cast", "castle", "catalog", "catch",
  "category", "cattle", "cause", "caution", "cave", "ceiling", "celebration", "celebrity", "cell", "cellar",
  "cement", "center", "century", "cereal", "chain", "chair", "chalk", "challenge", "chamber", "champion",
  "chance", "channel", "chaos", "chapter", "character", "charm", "chart", "chase", "chat", "check",
  "cheek", "cheer", "chef", "chemical", "chest", "chicken", "chief", "child", "childhood", "chin",
  "chip", "choice", "choir", "chunk", "church", "cigarette", "cinema", "circle", "circuit", "circumstance",
  "citizen", "citizenship", "claim", "clarity", "clash", "class", "classic", "classroom", "clause", "clay",
  "cleaner", "clearing", "clerk", "click", "client", "cliff", "climate", "climb", "clinic", "clip",

  "cloak", "closure", "cloth", "clothing", "cloud", "club", "clue", "cluster", "clutch", "coach",
  "coal", "coalition", "coast", "coat", "code", "coffee", "coffin", "coil", "coin", "coincidence",
  "cold", "collapse", "collar", "colleague", "collector", "column", "combat", "comeback", "comedy", "comfort",
  "comic", "command", "commander", "comment", "commerce", "commission", "commitment", "committee", "commodity", "common",
  "commune", "communication", "communist", "compact", "companion", "company", "comparison", "compass", "compassion", "compensation",
  "competitor", "complaint", "complement", "completion", "complexity", "compliance", "component", "composer", "composition", "compound",
  "compromise", "computer", "concentrate", "concentration", "concept", "conception", "concern", "concert", "conclusion", "concrete",
  "condition", "conduct", "conductor", "cone", "conference", "confession", "confidence", "configuration", "confirmation", "conflict",
  "confusion", "congregation", "congress", "connection", "conscience", "consciousness", "consensus", "consent", "consequence", "conservation",
  "consideration", "consistency", "console", "conspiracy", "constant", "constitution", "constraint", "construction", "consultant", "consumer"
];

let addedCount = 0;
const startIndex = data.words.length;

for (const noun of moreNouns) {
  if (!existingWords.has(noun.toLowerCase())) {
    const newWord = {
      id: `nouns_${noun.replace(/\s+/g, '_')}_${startIndex + addedCount}`,
      word: noun,
      meanings: [{
        partOfSpeech: "noun",
        meaning: "",
        examples: []
      }]
    };
    data.words.push(newWord);
    existingWords.add(noun.toLowerCase());
    addedCount++;
  }
}

console.log('추가된 명사 수:', addedCount);
console.log('최종 명사 수:', data.words.length);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('파일 저장 완료');
