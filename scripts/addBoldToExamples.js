const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Helper function to escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add bold to word in example (case insensitive)
function addBoldToExample(example, word) {
    if (!example || !word) return example;

    // Skip if already has bold markers
    if (example.includes('**')) return example;

    // Create regex pattern for word (case insensitive, word boundary)
    const pattern = new RegExp(`\\b(${escapeRegex(word)})\\b`, 'gi');

    // Replace with bold
    const result = example.replace(pattern, '**$1**');

    return result;
}

// Add bold for verb forms (including -ing, -s, -ed forms)
function addBoldToExampleVerb(example, word, pastTense, pastParticiple) {
    if (!example || !word) return example;
    if (example.includes('**')) return example;

    // Build pattern for all forms
    const forms = [word];

    // Add common verb forms
    if (word.endsWith('e')) {
        forms.push(word + 'd');           // like -> liked
        forms.push(word + 's');           // like -> likes
        forms.push(word.slice(0, -1) + 'ing'); // like -> liking
    } else if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2])) {
        forms.push(word.slice(0, -1) + 'ies'); // carry -> carries
        forms.push(word.slice(0, -1) + 'ied'); // carry -> carried
        forms.push(word + 'ing');              // carry -> carrying
    } else {
        forms.push(word + 's');
        forms.push(word + 'ed');
        forms.push(word + 'ing');
        // Double consonant for short words (get -> getting)
        if (word.length <= 4 && /[bcdfghjklmnpqrstvwxyz]$/.test(word)) {
            forms.push(word + word[word.length - 1] + 'ing');
            forms.push(word + word[word.length - 1] + 'ed');
        }
    }

    // Add past tense and past participle if provided
    if (pastTense) {
        pastTense.split('/').forEach(pt => forms.push(pt.trim()));
    }
    if (pastParticiple) {
        pastParticiple.split('/').forEach(pp => forms.push(pp.trim()));
    }

    // Sort by length (longest first) to avoid partial matches
    const sortedForms = [...new Set(forms)].sort((a, b) => b.length - a.length);

    // Create combined pattern
    const pattern = new RegExp(`\\b(${sortedForms.map(escapeRegex).join('|')})\\b`, 'gi');

    return example.replace(pattern, '**$1**');
}

// Add bold for phrasal verbs (handle separated forms like "wake up", "woke up", "waking up")
function addBoldToPhraseVerb(example, phrase) {
    if (!example || !phrase) return example;
    if (example.includes('**')) return example;

    const parts = phrase.split(' ');
    if (parts.length < 2) {
        return addBoldToExample(example, phrase);
    }

    const verb = parts[0];
    const particle = parts.slice(1).join(' ');

    // Common verb forms
    const verbForms = [verb];

    // Add verb variations
    if (verb.endsWith('e')) {
        verbForms.push(verb + 'd');
        verbForms.push(verb + 's');
        verbForms.push(verb.slice(0, -1) + 'ing');
    } else if (verb === 'wake') {
        verbForms.push('woke', 'woken', 'waking', 'wakes');
    } else if (verb === 'get') {
        verbForms.push('got', 'gotten', 'getting', 'gets');
    } else if (verb === 'hang') {
        verbForms.push('hung', 'hanging', 'hangs');
    } else if (verb === 'work') {
        verbForms.push('worked', 'working', 'works');
    } else if (verb === 'go') {
        verbForms.push('went', 'gone', 'going', 'goes');
    } else if (verb === 'come') {
        verbForms.push('came', 'coming', 'comes');
    } else if (verb === 'take') {
        verbForms.push('took', 'taken', 'taking', 'takes');
    } else if (verb === 'give') {
        verbForms.push('gave', 'given', 'giving', 'gives');
    } else if (verb === 'put') {
        verbForms.push('putting', 'puts');
    } else if (verb === 'run') {
        verbForms.push('ran', 'running', 'runs');
    } else if (verb === 'set') {
        verbForms.push('setting', 'sets');
    } else if (verb === 'turn') {
        verbForms.push('turned', 'turning', 'turns');
    } else if (verb === 'look') {
        verbForms.push('looked', 'looking', 'looks');
    } else if (verb === 'break') {
        verbForms.push('broke', 'broken', 'breaking', 'breaks');
    } else if (verb === 'pick') {
        verbForms.push('picked', 'picking', 'picks');
    } else if (verb === 'bring') {
        verbForms.push('brought', 'bringing', 'brings');
    } else if (verb === 'fall') {
        verbForms.push('fell', 'fallen', 'falling', 'falls');
    } else if (verb === 'keep') {
        verbForms.push('kept', 'keeping', 'keeps');
    } else if (verb === 'show') {
        verbForms.push('showed', 'shown', 'showing', 'shows');
    } else if (verb === 'think') {
        verbForms.push('thought', 'thinking', 'thinks');
    } else if (verb === 'find') {
        verbForms.push('found', 'finding', 'finds');
    } else if (verb === 'hold') {
        verbForms.push('held', 'holding', 'holds');
    } else if (verb === 'catch') {
        verbForms.push('caught', 'catching', 'catches');
    } else if (verb === 'check') {
        verbForms.push('checked', 'checking', 'checks');
    } else if (verb === 'fill') {
        verbForms.push('filled', 'filling', 'fills');
    } else if (verb === 'figure') {
        verbForms.push('figured', 'figuring', 'figures');
    } else if (verb === 'point') {
        verbForms.push('pointed', 'pointing', 'points');
    } else if (verb === 'calm') {
        verbForms.push('calmed', 'calming', 'calms');
    } else if (verb === 'slow') {
        verbForms.push('slowed', 'slowing', 'slows');
    } else if (verb === 'end') {
        verbForms.push('ended', 'ending', 'ends');
    } else if (verb === 'call') {
        verbForms.push('called', 'calling', 'calls');
    } else if (verb === 'blow') {
        verbForms.push('blew', 'blown', 'blowing', 'blows');
    } else if (verb === 'cut') {
        verbForms.push('cutting', 'cuts');
    } else if (verb === 'drop') {
        verbForms.push('dropped', 'dropping', 'drops');
    } else if (verb === 'eat') {
        verbForms.push('ate', 'eaten', 'eating', 'eats');
    } else if (verb === 'pass') {
        verbForms.push('passed', 'passing', 'passes');
    } else if (verb === 'pay') {
        verbForms.push('paid', 'paying', 'pays');
    } else if (verb === 'pull') {
        verbForms.push('pulled', 'pulling', 'pulls');
    } else if (verb === 'write') {
        verbForms.push('wrote', 'written', 'writing', 'writes');
    } else if (verb === 'sign') {
        verbForms.push('signed', 'signing', 'signs');
    } else if (verb === 'try') {
        verbForms.push('tried', 'trying', 'tries');
    } else if (verb === 'carry') {
        verbForms.push('carried', 'carrying', 'carries');
    } else if (verb === 'dress') {
        verbForms.push('dressed', 'dressing', 'dresses');
    } else if (verb === 'zip') {
        verbForms.push('zipped', 'zipping', 'zips');
    } else if (verb === 'back') {
        verbForms.push('backed', 'backing', 'backs');
    } else if (verb === 'stick') {
        verbForms.push('stuck', 'sticking', 'sticks');
    } else if (verb === 'clean') {
        verbForms.push('cleaned', 'cleaning', 'cleans');
    } else if (verb === 'stand') {
        verbForms.push('stood', 'standing', 'stands');
    } else if (verb === 'throw') {
        verbForms.push('threw', 'thrown', 'throwing', 'throws');
    } else if (verb === 'let') {
        verbForms.push('letting', 'lets');
    } else if (verb === 'cheer') {
        verbForms.push('cheered', 'cheering', 'cheers');
    } else if (verb === 'stay') {
        verbForms.push('stayed', 'staying', 'stays');
    } else if (verb === 'speak') {
        verbForms.push('spoke', 'spoken', 'speaking', 'speaks');
    } else if (verb === 'mix') {
        verbForms.push('mixed', 'mixing', 'mixes');
    } else if (verb === 'lie') {
        verbForms.push('lied', 'lying', 'lies', 'lay', 'lain');
    } else {
        verbForms.push(verb + 's');
        verbForms.push(verb + 'ed');
        verbForms.push(verb + 'ing');
        if (verb.length <= 4 && /[bcdfghjklmnpqrstvwxyz]$/.test(verb)) {
            verbForms.push(verb + verb[verb.length - 1] + 'ing');
            verbForms.push(verb + verb[verb.length - 1] + 'ed');
        }
    }

    // Try to match phrase together first (verb + particle)
    const sortedVerbForms = [...new Set(verbForms)].sort((a, b) => b.length - a.length);

    // Pattern for adjacent verb+particle
    let adjacentPattern = new RegExp(
        `\\b(${sortedVerbForms.map(escapeRegex).join('|')})\\s+(${escapeRegex(particle)})\\b`,
        'gi'
    );

    let result = example.replace(adjacentPattern, '**$1 $2**');

    // If no match found, try separated form (verb ... particle)
    if (!result.includes('**')) {
        // Pattern for verb...object...particle
        let separatedPattern = new RegExp(
            `\\b(${sortedVerbForms.map(escapeRegex).join('|')})\\b(.{1,30}?)\\b(${escapeRegex(particle)})\\b`,
            'gi'
        );
        result = example.replace(separatedPattern, '**$1**$2**$3**');
    }

    return result;
}

// Process nouns.json
function processNouns() {
    const filePath = path.join(dataDir, 'nouns.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(category => {
        if (category.words) {
            category.words.forEach(item => {
                const original = item.example;
                item.example = addBoldToExample(item.example, item.word);
                if (original !== item.example) changes++;
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`nouns.json: ${changes} examples updated`);
}

// Process verbs.json
function processVerbs() {
    const filePath = path.join(dataDir, 'verbs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(category => {
        if (category.words) {
            category.words.forEach(item => {
                const original = item.example;
                item.example = addBoldToExampleVerb(
                    item.example,
                    item.word,
                    item.pastTense,
                    item.pastParticiple
                );
                if (original !== item.example) changes++;
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`verbs.json: ${changes} examples updated`);
}

// Process adjectives.json
function processAdjectives() {
    const filePath = path.join(dataDir, 'adjectives.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(category => {
        if (category.words) {
            category.words.forEach(item => {
                const original = item.example;
                item.example = addBoldToExample(item.example, item.word);
                if (original !== item.example) changes++;
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`adjectives.json: ${changes} examples updated`);
}

// Process adverbs.json
function processAdverbs() {
    const filePath = path.join(dataDir, 'adverbs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(category => {
        if (category.words) {
            category.words.forEach(item => {
                const original = item.example;
                item.example = addBoldToExample(item.example, item.word);
                if (original !== item.example) changes++;
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`adverbs.json: ${changes} examples updated`);
}

// Process phrasalVerbs.json
function processPhrasalVerbs() {
    const filePath = path.join(dataDir, 'phrasalVerbs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(section => {
        if (section.phrasalVerbs) {
            section.phrasalVerbs.forEach(pv => {
                if (pv.meanings) {
                    pv.meanings.forEach(meaning => {
                        if (meaning.examples) {
                            meaning.examples.forEach(ex => {
                                const original = ex.example;
                                ex.example = addBoldToPhraseVerb(ex.example, pv.phrase);
                                if (original !== ex.example) changes++;
                            });
                        }
                    });
                }
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`phrasalVerbs.json: ${changes} examples updated`);
}

// Process patterns.json - bold the pattern keywords
function processPatterns() {
    const filePath = path.join(dataDir, 'patterns.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(section => {
        if (section.patterns) {
            section.patterns.forEach(pattern => {
                // Extract key phrase from pattern name (e.g., "I usually" from "I usually + 동사원형")
                const patternParts = pattern.name.match(/^([A-Za-z\s']+)/);
                if (patternParts && pattern.items) {
                    const keyPhrase = patternParts[1].trim();
                    pattern.items.forEach(item => {
                        const original = item.example;
                        // Bold the key phrase
                        const pattern = new RegExp(`^(${escapeRegex(keyPhrase)})`, 'i');
                        item.example = item.example.replace(pattern, '**$1**');
                        if (original !== item.example) changes++;
                    });
                }
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`patterns.json: ${changes} examples updated`);
}

// Process vocabIntermediate.json
function processVocabIntermediate() {
    const filePath = path.join(dataDir, 'vocabIntermediate.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(cat => {
        if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
                if (sub.words) {
                    sub.words.forEach(item => {
                        const original = item.example;
                        item.example = addBoldToExample(item.example, item.word);
                        if (original !== item.example) changes++;
                    });
                }
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`vocabIntermediate.json: ${changes} examples updated`);
}

// Process vocabAdvanced.json
function processVocabAdvanced() {
    const filePath = path.join(dataDir, 'vocabAdvanced.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(cat => {
        if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
                if (sub.words) {
                    sub.words.forEach(item => {
                        const original = item.example;
                        item.example = addBoldToExample(item.example, item.word);
                        if (original !== item.example) changes++;
                    });
                }
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`vocabAdvanced.json: ${changes} examples updated`);
}

// Process additionalIdioms.json
function processAdditionalIdioms() {
    const filePath = path.join(dataDir, 'additionalIdioms.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(cat => {
        if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
                const items = sub.expressions || sub.idioms || [];
                items.forEach(item => {
                    const word = item.expression || item.idiom;
                    const original = item.example;
                    item.example = addBoldToExample(item.example, word);
                    if (original !== item.example) changes++;
                });
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`additionalIdioms.json: ${changes} examples updated`);
}

// Process additionalPhrasalVerbs.json
function processAdditionalPhrasalVerbs() {
    const filePath = path.join(dataDir, 'additionalPhrasalVerbs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    data.forEach(cat => {
        if (cat.subCategories) {
            cat.subCategories.forEach(sub => {
                const items = sub.phrasalVerbs || [];
                items.forEach(item => {
                    const phrase = item.phrase || item.phrasalVerb;
                    const original = item.example;
                    item.example = addBoldToPhraseVerb(item.example, phrase);
                    if (original !== item.example) changes++;
                });
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`additionalPhrasalVerbs.json: ${changes} examples updated`);
}

// Run all processors
console.log('Adding bold markers to examples...\n');

processNouns();
processVerbs();
processAdjectives();
processAdverbs();
processPhrasalVerbs();
processPatterns();
processVocabIntermediate();
processVocabAdvanced();
processAdditionalIdioms();
processAdditionalPhrasalVerbs();

console.log('\nDone! Remember to run bundleData.js after this.');
