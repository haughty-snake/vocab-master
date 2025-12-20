/**
 * Convert all JSON data files to unified format matching custom category structure
 *
 * Unified format:
 * {
 *   "id": "category_id",
 *   "name": "카테고리명",
 *   "icon": "📦",
 *   "color": "#4285f4",
 *   "words": [
 *     {
 *       "id": "unique_word_id",
 *       "word": "apple",
 *       "pronunciation": "/ˈæpəl/",
 *       "subcategory": "과일",
 *       "meanings": [
 *         {
 *           "partOfSpeech": "명사",
 *           "meaning": "사과",
 *           "examples": [
 *             { "sentence": "I ate an apple.", "translation": "나는 사과를 먹었다." }
 *           ]
 *         }
 *       ],
 *       "pastTense": "",       // for verbs
 *       "pastParticiple": ""   // for verbs
 *     }
 *   ]
 * }
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Category metadata
const categoryMeta = {
    nouns: { name: '명사', icon: '📦', color: '#4285f4' },
    verbs: { name: '동사', icon: '🏃', color: '#34a853' },
    adjectives: { name: '형용사', icon: '🎨', color: '#fbbc05' },
    adverbs: { name: '부사', icon: '⚡', color: '#ea4335' },
    prepositions: { name: '전치사/접속사', icon: '🔗', color: '#9c27b0' },
    idioms: { name: '숙어/관용표현', icon: '💬', color: '#00bcd4' },
    phrasalVerbs: { name: '구동사', icon: '🚀', color: '#ff5722' },
    vocabulary: { name: 'OPIC 필수 단어', icon: '📚', color: '#795548' },
    patterns: { name: '문장 패턴', icon: '📝', color: '#607d8b' },
    expressions: { name: '추가 표현', icon: '🗣️', color: '#e91e63' },
    vocabIntermediate: { name: '중급 단어', icon: '📗', color: '#2196f3' },
    vocabAdvanced: { name: '고급 단어', icon: '📕', color: '#f44336' },
    additionalIdioms: { name: '추가 숙어', icon: '💡', color: '#009688' },
    additionalPhrasalVerbs: { name: '추가 구동사', icon: '🔥', color: '#ff9800' }
};

// Remove bold markers from text
function removeBold(text) {
    if (!text) return '';
    return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

// Generate unique word ID
function generateWordId(categoryId, word, index) {
    const cleanWord = word.replace(/[^a-zA-Z0-9가-힣]/g, '_').toLowerCase();
    return `${categoryId}_${cleanWord}_${index}`;
}

// Convert standard word format (nouns, adjectives, adverbs, prepositions)
function convertStandardWords(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    const wordMap = new Map(); // For merging polysemy

    data.forEach(cat => {
        if (!cat) return;
        const subcategory = cat.nameKo || cat.name || 'Unknown';
        const items = cat.words || [];

        items.forEach(item => {
            const wordKey = item.word.toLowerCase();
            const example = {
                sentence: removeBold(item.example || ''),
                translation: item.translation || ''
            };

            if (wordMap.has(wordKey)) {
                // Add as additional meaning
                const existing = wordMap.get(wordKey);
                existing.meanings.push({
                    partOfSpeech: '',
                    meaning: item.meaning,
                    examples: example.sentence ? [example] : []
                });
                // Update verb forms if not set
                if (!existing.pastTense && item.pastTense) {
                    existing.pastTense = item.pastTense;
                }
                if (!existing.pastParticiple && item.pastParticiple) {
                    existing.pastParticiple = item.pastParticiple;
                }
            } else {
                const word = {
                    id: generateWordId(categoryId, item.word, wordIndex++),
                    word: item.word,
                    pronunciation: item.pronunciation || '',
                    subcategory: subcategory,
                    meanings: [{
                        partOfSpeech: '',
                        meaning: item.meaning,
                        examples: example.sentence ? [example] : []
                    }],
                    pastTense: item.pastTense || '',
                    pastParticiple: item.pastParticiple || '',
                    antonym: item.antonym || ''
                };
                wordMap.set(wordKey, word);
            }
        });
    });

    wordMap.forEach(word => result.words.push(word));
    return result;
}

// Convert idioms format
function convertIdioms(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(cat => {
        if (!cat) return;
        const subcategory = cat.nameKo || cat.name || 'Unknown';
        const items = cat.expressions || cat.words || [];

        items.forEach(item => {
            const wordText = item.expression || item.word;
            // idioms.json has messed up field mapping, try to fix it
            let meaning = item.meaning;
            let example = item.example;
            let translation = item.translation;

            // Check if meaning looks like an example (starts with ** or contains full sentence structure)
            if (meaning && (meaning.includes('**') || meaning.match(/^[A-Z].*\./))) {
                // Fields are shifted: pronunciation has meaning, meaning has example, example has translation
                meaning = item.pronunciation || '';
                example = item.meaning || '';
                translation = item.example || '';
            }

            const word = {
                id: generateWordId(categoryId, wordText, wordIndex++),
                word: wordText,
                pronunciation: '',
                subcategory: subcategory,
                meanings: [{
                    partOfSpeech: '',
                    meaning: meaning,
                    examples: example ? [{
                        sentence: removeBold(example),
                        translation: translation || ''
                    }] : []
                }]
            };
            result.words.push(word);
        });
    });

    return result;
}

// Convert phrasal verbs format
function convertPhrasalVerbs(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(section => {
        if (!section || !section.phrasalVerbs) return;
        const subcategory = section.name || 'Unknown';

        section.phrasalVerbs.forEach(pv => {
            if (!pv.meanings) return;

            const meanings = pv.meanings.map(m => ({
                partOfSpeech: '',
                meaning: m.meaning,
                examples: m.examples ? m.examples.map(e => ({
                    sentence: removeBold(e.example || ''),
                    translation: e.translation || ''
                })) : []
            }));

            const word = {
                id: generateWordId(categoryId, pv.phrase, wordIndex++),
                word: pv.phrase,
                pronunciation: pv.pronunciation || '',
                subcategory: subcategory,
                meanings: meanings
            };
            result.words.push(word);
        });
    });

    return result;
}

// Convert patterns format
function convertPatterns(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(section => {
        if (!section || !section.patterns) return;
        const subcategory = section.name || 'Unknown';

        section.patterns.forEach(pattern => {
            if (!pattern.items) return;

            const examples = pattern.items.map(item => ({
                sentence: removeBold(item.example || ''),
                translation: item.translation || ''
            }));

            const word = {
                id: generateWordId(categoryId, pattern.name, wordIndex++),
                word: pattern.name,
                pronunciation: '',
                subcategory: subcategory,
                meanings: [{
                    partOfSpeech: '',
                    meaning: pattern.meaning || '',
                    examples: examples
                }]
            };
            result.words.push(word);
        });
    });

    return result;
}

// Convert expressions format
function convertExpressions(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(section => {
        if (!section || !section.subSections) return;

        section.subSections.forEach(sub => {
            if (!sub.expressions) return;
            const subcategory = `${section.nameKo || section.name} - ${sub.name}`;

            sub.expressions.forEach(exp => {
                const word = {
                    id: generateWordId(categoryId, exp.expression, wordIndex++),
                    word: exp.expression,
                    pronunciation: '',
                    subcategory: subcategory,
                    meanings: [{
                        partOfSpeech: '',
                        meaning: exp.meaning,
                        examples: exp.example ? [{
                            sentence: removeBold(exp.example),
                            translation: exp.translation || ''
                        }] : []
                    }]
                };
                result.words.push(word);
            });
        });
    });

    return result;
}

// Convert vocabulary format (has different structure with name)
function convertVocabulary(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(cat => {
        if (!cat) return;
        const subcategory = cat.name || 'Unknown';
        const items = cat.words || [];

        items.forEach(item => {
            const word = {
                id: generateWordId(categoryId, item.word, wordIndex++),
                word: item.word,
                pronunciation: item.pronunciation || '',
                subcategory: subcategory,
                meanings: [{
                    partOfSpeech: '',
                    meaning: item.meaning,
                    examples: item.example ? [{
                        sentence: removeBold(item.example),
                        translation: item.translation || ''
                    }] : []
                }]
            };
            result.words.push(word);
        });
    });

    return result;
}

// Convert vocab intermediate/advanced format (has subCategories)
function convertVocabLevel(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(cat => {
        if (!cat || !cat.subCategories) return;

        cat.subCategories.forEach(sub => {
            const subcategory = `${cat.nameKo || cat.name} - ${sub.name}`;
            const items = sub.words || [];

            items.forEach(item => {
                const word = {
                    id: generateWordId(categoryId, item.word, wordIndex++),
                    word: item.word,
                    pronunciation: '',
                    subcategory: subcategory,
                    meanings: [{
                        partOfSpeech: '',
                        meaning: item.meaning,
                        examples: item.example ? [{
                            sentence: removeBold(item.example),
                            translation: item.translation || ''
                        }] : []
                    }]
                };
                result.words.push(word);
            });
        });
    });

    return result;
}

// Convert additional idioms format
function convertAdditionalIdioms(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(cat => {
        if (!cat || !cat.subCategories) return;

        cat.subCategories.forEach(sub => {
            const subcategory = `${cat.name} - ${sub.name}`;
            const items = sub.expressions || sub.idioms || [];

            items.forEach(item => {
                const word = {
                    id: generateWordId(categoryId, item.expression || item.idiom, wordIndex++),
                    word: item.expression || item.idiom,
                    pronunciation: '',
                    subcategory: subcategory,
                    meanings: [{
                        partOfSpeech: '',
                        meaning: item.meaning,
                        examples: item.example ? [{
                            sentence: removeBold(item.example),
                            translation: item.translation || ''
                        }] : []
                    }]
                };
                result.words.push(word);
            });
        });
    });

    return result;
}

// Convert additional phrasal verbs format
function convertAdditionalPhrasalVerbs(categoryId, data, meta) {
    const result = {
        id: categoryId,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        words: []
    };

    let wordIndex = 0;
    data.forEach(cat => {
        if (!cat || !cat.subCategories) return;

        cat.subCategories.forEach(sub => {
            const subcategory = `${cat.name} - ${sub.name}`;
            const items = sub.phrasalVerbs || [];

            items.forEach(item => {
                const word = {
                    id: generateWordId(categoryId, item.phrase || item.phrasalVerb, wordIndex++),
                    word: item.phrase || item.phrasalVerb,
                    pronunciation: '',
                    subcategory: subcategory,
                    meanings: [{
                        partOfSpeech: '',
                        meaning: item.meaning,
                        examples: item.example ? [{
                            sentence: removeBold(item.example),
                            translation: item.translation || ''
                        }] : []
                    }]
                };
                result.words.push(word);
            });
        });
    });

    return result;
}

// Main conversion function
function convertAll() {
    const conversions = {
        nouns: convertStandardWords,
        verbs: convertStandardWords,
        adjectives: convertStandardWords,
        adverbs: convertStandardWords,
        prepositions: convertStandardWords,
        idioms: convertIdioms,
        phrasalVerbs: convertPhrasalVerbs,
        vocabulary: convertVocabulary,
        patterns: convertPatterns,
        expressions: convertExpressions,
        vocabIntermediate: convertVocabLevel,
        vocabAdvanced: convertVocabLevel,
        additionalIdioms: convertAdditionalIdioms,
        additionalPhrasalVerbs: convertAdditionalPhrasalVerbs
    };

    const allResults = {};

    Object.entries(conversions).forEach(([categoryId, convertFn]) => {
        const filePath = path.join(dataDir, `${categoryId}.json`);

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}`);
            return;
        }

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const meta = categoryMeta[categoryId];
            const result = convertFn(categoryId, data, meta);

            // Write converted file
            fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
            console.log(`✓ Converted ${categoryId}: ${result.words.length} words`);

            allResults[categoryId] = result;
        } catch (error) {
            console.error(`✗ Error converting ${categoryId}:`, error.message);
        }
    });

    // Generate bundle
    const bundlePath = path.join(__dirname, '..', 'js', 'data.bundle.js');
    const bundleContent = `// Auto-generated data bundle - DO NOT EDIT\n// Generated: ${new Date().toISOString()}\n\nconst DATA_BUNDLE = ${JSON.stringify(allResults, null, 2)};\n`;
    fs.writeFileSync(bundlePath, bundleContent, 'utf8');
    console.log(`\n✓ Generated data.bundle.js`);

    // Print summary
    let totalWords = 0;
    Object.values(allResults).forEach(cat => totalWords += cat.words.length);
    console.log(`\n=== Summary ===`);
    console.log(`Total categories: ${Object.keys(allResults).length}`);
    console.log(`Total words: ${totalWords}`);
}

// Run conversion
convertAll();
