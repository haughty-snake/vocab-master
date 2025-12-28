const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/nouns.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingWords = new Set(data.words.map(w => w.word.toLowerCase()));
console.log('현재 명사 수:', existingWords.size);

const newNouns = [
  // 일상용품/도구 (100개)
  "appliance", "basket", "blanket", "bottle", "bowl", "box", "broom", "brush", "bucket", "cabinet",
  "candle", "carpet", "chain", "chair", "clock", "cloth", "container", "cord", "counter", "cup",
  "curtain", "cushion", "desk", "dish", "drawer", "fan", "flashlight", "fork", "frame", "glass",
  "handle", "hanger", "jar", "kettle", "key", "knife", "lamp", "lid", "lock", "mat",
  "mattress", "mirror", "mop", "mug", "needle", "ornament", "pan", "pencil", "pillow", "pin",
  "pipe", "pitcher", "plate", "plug", "pocket", "pot", "rack", "rag", "razor", "ribbon",
  "ring", "rope", "rug", "saucer", "scissors", "shade", "shelf", "shovel", "soap", "socket",
  "sofa", "spoon", "stapler", "stool", "strap", "string", "table", "tape", "thread", "tile",
  "tin", "tissue", "tongs", "tool", "towel", "tray", "tube", "umbrella", "utensil", "vase",
  "wallet", "wire", "wrapper", "zipper", "accessory", "adapter", "antenna", "badge", "battery", "bell",

  // 의류/패션 (80개)
  "apron", "belt", "blouse", "boot", "bow", "bracelet", "brooch", "button", "cap", "cardigan",
  "cloak", "coat", "collar", "costume", "cuff", "dress", "earring", "fabric", "gown", "glove",
  "hat", "heel", "hem", "hood", "jacket", "jeans", "jersey", "jumper", "lace", "lapel",
  "leggings", "lingerie", "loafer", "mitten", "necklace", "nightgown", "outfit", "overcoat", "pajamas", "pants",
  "pendant", "petticoat", "pleat", "pocket", "polo", "poncho", "pullover", "purse", "raincoat", "robe",
  "sandal", "scarf", "seam", "shirt", "shoe", "shorts", "skirt", "sleeve", "slipper", "sneaker",
  "sock", "stitch", "stocking", "suit", "suspender", "sweater", "tie", "tights", "trousers", "tunic",
  "tuxedo", "undergarment", "uniform", "vest", "waistcoat", "wardrobe", "watch", "wig", "wristband", "zipper",

  // 동물/생물 (100개)
  "alligator", "ant", "ape", "badger", "bat", "bear", "beaver", "bee", "beetle", "bison",
  "buffalo", "butterfly", "camel", "caterpillar", "cheetah", "chimpanzee", "clam", "cobra", "cockroach", "cod",
  "coyote", "crab", "crane", "cricket", "crocodile", "crow", "deer", "dolphin", "donkey", "dove",
  "dragonfly", "duck", "eagle", "eel", "elephant", "elk", "falcon", "fawn", "ferret", "finch",
  "firefly", "flamingo", "flea", "fox", "frog", "gazelle", "gerbil", "giraffe", "goat", "goose",
  "gorilla", "grasshopper", "hamster", "hare", "hawk", "hedgehog", "heron", "hippopotamus", "hornet", "hummingbird",
  "hyena", "iguana", "jackal", "jaguar", "jellyfish", "kangaroo", "koala", "ladybug", "lamb", "lark",
  "lemur", "leopard", "lion", "lizard", "llama", "lobster", "locust", "lynx", "mackerel", "magpie",
  "mammal", "manatee", "mantis", "marmot", "meerkat", "mink", "mole", "mongoose", "monkey", "moose",
  "mosquito", "moth", "mouse", "mule", "mussel", "newt", "nightingale", "octopus", "opossum", "orangutan",

  // 식물/농업 (60개)
  "acorn", "almond", "bamboo", "bark", "bean", "beet", "berry", "blossom", "branch", "broccoli",
  "bud", "bulb", "bush", "cabbage", "cactus", "carrot", "celery", "cherry", "chestnut", "clover",
  "coconut", "corn", "cucumber", "daisy", "dandelion", "fern", "fig", "garlic", "grain", "grape",
  "herb", "ivy", "jasmine", "kale", "lavender", "leaf", "lemon", "lettuce", "lily", "lime",
  "lotus", "mango", "maple", "melon", "mint", "moss", "mushroom", "oak", "olive", "onion",
  "orchid", "palm", "parsley", "peach", "peanut", "pear", "pepper", "pine", "plum", "poplar",

  // 건물/장소 (80개)
  "abbey", "alley", "apartment", "asylum", "attic", "bakery", "balcony", "bank", "barn", "barracks",
  "basement", "bathhouse", "brewery", "bridge", "bungalow", "bunker", "cabin", "cafeteria", "campus", "casino",
  "castle", "cathedral", "cemetery", "chapel", "cinema", "clinic", "clubhouse", "college", "colony", "compound",
  "conservatory", "convent", "cottage", "courtroom", "crematorium", "dairy", "depot", "dispensary", "dormitory", "dungeon",
  "dwelling", "embassy", "factory", "farmhouse", "fortress", "foundry", "gallery", "garage", "garden", "gazebo",
  "granary", "greenhouse", "gymnasium", "hall", "hangar", "harbor", "headquarters", "hospital", "hostel", "hotel",
  "hut", "inn", "jail", "kennel", "kiosk", "laboratory", "landmark", "library", "lighthouse", "lodge",
  "loft", "mansion", "market", "mill", "monastery", "monument", "morgue", "mosque", "motel", "museum",

  // 음악/악기 (50개)
  "accordion", "bagpipe", "banjo", "bass", "baton", "beat", "brass", "bugle", "cello", "chime",
  "clarinet", "cymbal", "drum", "drumstick", "fiddle", "flute", "gong", "guitar", "harmonica", "harp",
  "harpsichord", "horn", "instrument", "keyboard", "lute", "lyre", "mandolin", "maracas", "metronome", "oboe",
  "organ", "percussion", "piano", "piccolo", "recorder", "saxophone", "score", "string", "tambourine", "triangle",
  "trombone", "trumpet", "tuba", "tune", "ukulele", "viola", "violin", "whistle", "woodwind", "xylophone",

  // 음식/음료 (100개)
  "ale", "bacon", "bagel", "biscuit", "bread", "broth", "brownie", "butter", "cake", "candy",
  "casserole", "cereal", "cheese", "chili", "chip", "chocolate", "cider", "cinnamon", "cocoa", "coffee",
  "cookie", "cream", "croissant", "crumb", "crust", "cupcake", "curry", "dessert", "dip", "doughnut",
  "dumpling", "egg", "espresso", "feast", "flour", "fries", "fritter", "frosting", "fruit", "fudge",
  "gelatin", "ginger", "gravy", "ham", "hamburger", "honey", "hotdog", "ice", "icing", "jam",
  "jelly", "juice", "ketchup", "lasagna", "lemonade", "loaf", "macaroni", "margarine", "marmalade", "mayonnaise",
  "meatball", "milk", "milkshake", "muffin", "mustard", "noodle", "oatmeal", "oil", "omelet", "pancake",
  "pasta", "pastry", "peanut", "pickle", "pie", "pizza", "popcorn", "porridge", "pretzel", "pudding",
  "punch", "relish", "rice", "roast", "salad", "salmon", "salsa", "sandwich", "sausage", "sherbet",
  "smoothie", "snack", "soda", "soup", "spaghetti", "steak", "stew", "sugar", "syrup", "taco",

  // 감정/상태 (60개)
  "affection", "agony", "anger", "anguish", "anxiety", "apathy", "awe", "bewilderment", "bliss", "boredom",
  "calmness", "compassion", "concern", "contempt", "contentment", "courage", "curiosity", "delight", "desperation", "disappointment",
  "disgust", "dismay", "distress", "doubt", "dread", "eagerness", "ecstasy", "embarrassment", "empathy", "envy",
  "excitement", "exhilaration", "fascination", "fatigue", "fright", "fury", "glee", "gloom", "gratitude", "grief",
  "guilt", "happiness", "hatred", "hope", "horror", "hostility", "humiliation", "hysteria", "indifference", "irritation",
  "jealousy", "joy", "loneliness", "longing", "melancholy", "misery", "nostalgia", "optimism", "panic", "passion",

  // 스포츠/게임 (60개)
  "archery", "arena", "athlete", "badminton", "baseball", "basketball", "billiards", "bowling", "boxing", "championship",
  "chess", "climbing", "coach", "competition", "cricket", "cycling", "dart", "dice", "diving", "fencing",
  "football", "golf", "gymnastics", "handball", "hockey", "javelin", "jogging", "judo", "karate", "lacrosse",
  "marathon", "medal", "opponent", "paddle", "polo", "racket", "referee", "relay", "rowing", "rugby",
  "sailing", "skating", "skiing", "soccer", "softball", "sprint", "squash", "surfing", "swimming", "tennis",
  "track", "triathlon", "trophy", "volleyball", "weightlifting", "wrestling", "yoga", "referee", "scorer", "spectator",

  // 날씨/기후 (40개)
  "avalanche", "blizzard", "breeze", "climate", "cloud", "cyclone", "dew", "downpour", "drizzle", "drought",
  "dust", "fog", "frost", "gale", "hail", "haze", "heat", "humidity", "hurricane", "ice",
  "lightning", "mist", "monsoon", "precipitation", "rain", "rainbow", "sleet", "smog", "snow", "snowflake",
  "storm", "sunshine", "temperature", "thunder", "tornado", "tsunami", "typhoon", "weather", "wind", "winter",

  // 교통/운송 추가 (50개)
  "aircraft", "ambulance", "automobile", "bicycle", "boat", "bus", "cab", "canoe", "car", "caravan",
  "chariot", "coach", "cruiser", "engine", "ferry", "freighter", "glider", "gondola", "helicopter", "highway",
  "hovercraft", "jet", "limousine", "locomotive", "lorry", "metro", "minivan", "motorcycle", "parachute", "raft",
  "railway", "rickshaw", "sailboat", "scooter", "sedan", "ship", "shuttle", "sled", "streetcar", "submarine",
  "subway", "tanker", "taxi", "tractor", "trailer", "train", "tram", "trolley", "truck", "van",

  // 직위/역할 (50개)
  "admiral", "ambassador", "ancestor", "apprentice", "attendant", "author", "bachelor", "bride", "captain", "caretaker",
  "chairman", "champion", "chancellor", "citizen", "civilian", "commander", "companion", "competitor", "conductor", "correspondent",
  "critic", "customer", "dean", "deputy", "descendant", "director", "duchess", "duke", "emperor", "empress",
  "executor", "governor", "guardian", "heir", "hero", "hostess", "inspector", "instructor", "janitor", "judge",
  "king", "knight", "landlady", "landlord", "leader", "lieutenant", "lord", "maiden", "manager", "mayor",

  // 수량/측정 (40개)
  "acre", "amount", "area", "bushel", "capacity", "centimeter", "circumference", "cubic", "cup", "degree",
  "depth", "diameter", "distance", "dose", "dozen", "fathom", "foot", "gallon", "gram", "height",
  "inch", "kilogram", "kilometer", "length", "liter", "mass", "meter", "mile", "millimeter", "ounce",
  "pint", "pound", "quart", "quantity", "radius", "tablespoon", "teaspoon", "ton", "volume", "width",

  // 우주/천문 (30개)
  "asteroid", "astronaut", "astronomy", "atmosphere", "aurora", "comet", "constellation", "cosmos", "crater", "eclipse",
  "equator", "galaxy", "gravity", "hemisphere", "horizon", "meteor", "meteorite", "moon", "nebula", "orbit",
  "planet", "pulsar", "satellite", "solar", "spacecraft", "star", "supernova", "telescope", "universe", "zodiac",

  // 종교/신화 (30개)
  "altar", "angel", "apostle", "baptism", "blessing", "cathedral", "ceremony", "chapel", "charity", "confession",
  "congregation", "cross", "deity", "demon", "disciple", "doctrine", "faith", "god", "goddess", "gospel",
  "heaven", "hell", "hymn", "miracle", "monastery", "myth", "paradise", "prayer", "preacher", "prophecy",

  // 군사/전쟁 (40개)
  "admiral", "aircraft", "ammunition", "armor", "army", "arsenal", "artillery", "barracks", "battalion", "battle",
  "bomb", "brigade", "bullet", "bunker", "cannon", "cavalry", "colonel", "combat", "commander", "corps",
  "defeat", "defense", "division", "fleet", "fortress", "general", "grenade", "infantry", "invasion", "marine",
  "medal", "military", "missile", "navy", "officer", "parachute", "patrol", "platoon", "regiment", "rifle",

  // 범죄/법 (40개)
  "accomplice", "alibi", "arrest", "arson", "assault", "attorney", "blackmail", "bribe", "burglary", "case",
  "cell", "charge", "confession", "convict", "court", "crime", "criminal", "custody", "detective", "evidence",
  "felony", "fine", "forgery", "fraud", "guilt", "hearing", "homicide", "innocence", "judge", "jury",
  "kidnapping", "lawsuit", "lawyer", "murder", "parole", "penalty", "prison", "probation", "robbery", "sentence",

  // 기타 추가 (90개)
  "absence", "abstract", "accident", "account", "acid", "acre", "action", "activity", "actor", "addition",
  "address", "adult", "advance", "advantage", "adventure", "advice", "affair", "affect", "afternoon", "age",
  "agent", "agreement", "aid", "aim", "air", "alarm", "alcohol", "alternative", "amateur", "ambition",
  "analysis", "ancestor", "angle", "animal", "anniversary", "announcement", "answer", "anxiety", "anybody", "apartment",
  "apology", "appeal", "appearance", "appetite", "applause", "apple", "appointment", "appreciation", "approach", "approval",
  "architect", "argument", "arm", "arrangement", "arrival", "arrow", "article", "artist", "aspect", "assembly",
  "asset", "assignment", "assistance", "associate", "association", "assumption", "athlete", "atmosphere", "atom", "attachment",
  "attack", "attempt", "attention", "attitude", "attraction", "audience", "author", "authority", "availability", "average",
  "award", "awareness", "baby", "background", "balance", "ball", "band", "bargain", "barrier", "base"
];

let addedCount = 0;
const startIndex = data.words.length;

for (const noun of newNouns) {
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
