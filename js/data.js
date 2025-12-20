// Data Management
const VocabData = {
    categories: [],
    allWords: [],
    loaded: false,

    // Category definitions with icons and colors
    categoryMeta: {
        nouns: { name: '명사', icon: '📦', color: '#4285f4', dataKey: 'nouns', difficulty: 'basic' },
        verbs: { name: '동사', icon: '🏃', color: '#34a853', dataKey: 'verbs', difficulty: 'basic' },
        adjectives: { name: '형용사', icon: '🎨', color: '#fbbc05', dataKey: 'adjectives', difficulty: 'basic' },
        adverbs: { name: '부사', icon: '⚡', color: '#ea4335', dataKey: 'adverbs', difficulty: 'basic' },
        prepositions: { name: '전치사/접속사', icon: '🔗', color: '#9c27b0', dataKey: 'prepositions', difficulty: 'basic' },
        idioms: { name: '숙어/관용표현', icon: '💬', color: '#00bcd4', dataKey: 'idioms', difficulty: 'basic' },
        phrasalVerbs: { name: '구동사', icon: '🚀', color: '#ff5722', dataKey: 'phrasalVerbs', difficulty: 'basic' },
        vocabulary: { name: 'OPIC 필수 단어', icon: '📚', color: '#795548', dataKey: 'vocabulary', difficulty: 'basic' },
        patterns: { name: '문장 패턴', icon: '📝', color: '#607d8b', dataKey: 'patterns', difficulty: 'basic' },
        expressions: { name: '추가 표현', icon: '🗣️', color: '#e91e63', dataKey: 'expressions', difficulty: 'basic' },
        vocabIntermediate: { name: '중급 단어', icon: '📗', color: '#2196f3', dataKey: 'vocabIntermediate', difficulty: 'intermediate' },
        vocabAdvanced: { name: '고급 단어', icon: '📕', color: '#f44336', dataKey: 'vocabAdvanced', difficulty: 'advanced' },
        additionalIdioms: { name: '추가 숙어', icon: '💡', color: '#009688', dataKey: 'additionalIdioms', difficulty: 'intermediate' },
        additionalPhrasalVerbs: { name: '추가 구동사', icon: '🔥', color: '#ff9800', dataKey: 'additionalPhrasalVerbs', difficulty: 'intermediate' }
    },

    // TTS (Text-to-Speech) functionality
    tts: {
        synth: window.speechSynthesis,
        voice: null,
        rate: 0.9,
        pitch: 1,

        init() {
            // Load voices
            const loadVoices = () => {
                const voices = this.synth.getVoices();
                // Prefer English voices
                this.voice = voices.find(v => v.lang.startsWith('en-US')) ||
                             voices.find(v => v.lang.startsWith('en')) ||
                             voices[0];
            };

            if (this.synth.getVoices().length) {
                loadVoices();
            }
            this.synth.onvoiceschanged = loadVoices;
        },

        speak(text, lang = 'en-US') {
            if (!this.synth) return;

            // Cancel any ongoing speech
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = this.rate;
            utterance.pitch = this.pitch;

            if (lang === 'en-US' && this.voice) {
                utterance.voice = this.voice;
            }

            this.synth.speak(utterance);
        },

        stop() {
            if (this.synth) {
                this.synth.cancel();
            }
        }
    },

    // Load all data from bundle
    async loadAll() {
        if (this.loaded) return;

        // Check if DATA_BUNDLE exists (loaded from data.bundle.js)
        if (typeof DATA_BUNDLE === 'undefined') {
            console.error('DATA_BUNDLE not found. Make sure data.bundle.js is loaded before data.js');
            return;
        }

        Object.entries(this.categoryMeta).forEach(([key, meta]) => {
            try {
                const data = DATA_BUNDLE[meta.dataKey] || [];
                this.processCategory(key, data, meta);
                console.log(`✓ Loaded ${meta.name}: ${data.length} items`);
            } catch (error) {
                console.error(`Error processing ${meta.name}:`, error);
            }
        });

        this.loaded = true;
        console.log(`Total loaded: ${this.allWords.length} items`);
    },

    // Process category data into unified format
    processCategory(key, data, meta) {
        const category = {
            id: key,
            name: meta.name,
            icon: meta.icon,
            color: meta.color,
            subcategories: [],
            words: []
        };

        if (key === 'phrasalVerbs') {
            // Phrasal verbs have different structure
            data.forEach(section => {
                if (!section || !section.phrasalVerbs) return;
                const subcat = {
                    name: section.name,
                    words: []
                };
                section.phrasalVerbs.forEach(pv => {
                    if (!pv.meanings) return;
                    pv.meanings.forEach((meaning, idx) => {
                        const word = {
                            id: `${key}_${pv.phrase.replace(/\s/g, '_')}_${idx}`,
                            category: key,
                            categoryName: meta.name,
                            word: pv.phrase,
                            pronunciation: pv.pronunciation,
                            meaning: meaning.meaning,
                            examples: meaning.examples ? meaning.examples.map(e => ({
                                sentence: e.example,
                                translation: e.translation
                            })) : []
                        };
                        subcat.words.push(word);
                        category.words.push(word);
                        this.allWords.push(word);
                    });
                });
                category.subcategories.push(subcat);
            });
        } else if (key === 'patterns') {
            // Patterns have sections and patterns - one entry per pattern
            data.forEach(section => {
                if (!section || !section.patterns) return;
                const subcat = {
                    name: section.name,
                    words: []
                };
                section.patterns.forEach((pattern, idx) => {
                    if (!pattern.items) return;
                    const word = {
                        id: `${key}_${section.name}_${idx}`.replace(/\s/g, '_'),
                        category: key,
                        categoryName: meta.name,
                        word: pattern.name,  // "I usually + 동사원형"
                        pronunciation: '',
                        meaning: pattern.meaning || '',  // "나는 보통 ~해"
                        examples: pattern.items.map(item => ({
                            sentence: item.example,
                            translation: item.translation
                        }))
                    };
                    subcat.words.push(word);
                    category.words.push(word);
                    this.allWords.push(word);
                });
                if (subcat.words.length > 0) {
                    category.subcategories.push(subcat);
                }
            });
        } else if (key === 'expressions') {
            // Expressions have sections and subsections
            data.forEach(section => {
                if (!section || !section.subSections) return;
                section.subSections.forEach(sub => {
                    if (!sub.expressions) return;
                    const subcat = {
                        name: `${section.nameKo} - ${sub.name}`,
                        words: []
                    };
                    sub.expressions.forEach((exp, idx) => {
                        const word = {
                            id: `${key}_${section.nameKo}_${sub.name}_${idx}`.replace(/\s/g, '_'),
                            category: key,
                            categoryName: meta.name,
                            word: exp.expression,
                            pronunciation: '',
                            meaning: exp.meaning,
                            examples: [{
                                sentence: exp.example,
                                translation: exp.translation
                            }]
                        };
                        subcat.words.push(word);
                        category.words.push(word);
                        this.allWords.push(word);
                    });
                    category.subcategories.push(subcat);
                });
            });
        } else if (key === 'idioms') {
            // Idioms structure
            data.forEach(cat => {
                if (!cat) return;
                const subcat = {
                    name: cat.nameKo || cat.name || 'Unknown',
                    words: []
                };
                const items = cat.expressions || cat.words || [];
                items.forEach((item, idx) => {
                    const word = {
                        id: `${key}_${(cat.nameKo || cat.name || 'unknown')}_${idx}`.replace(/\s/g, '_'),
                        category: key,
                        categoryName: meta.name,
                        word: item.expression || item.word,
                        pronunciation: item.pronunciation || '',
                        meaning: item.meaning,
                        difficulty: meta.difficulty || 'basic',
                        examples: [{
                            sentence: item.example,
                            translation: item.translation
                        }]
                    };
                    subcat.words.push(word);
                    category.words.push(word);
                    this.allWords.push(word);
                });
                category.subcategories.push(subcat);
            });
        } else if (key === 'vocabIntermediate' || key === 'vocabAdvanced') {
            // Additional vocabulary (intermediate/advanced) - has subCategories structure
            data.forEach(cat => {
                if (!cat || !cat.subCategories) return;
                cat.subCategories.forEach(sub => {
                    const subcat = {
                        name: `${cat.nameKo || cat.name} - ${sub.name}`,
                        words: []
                    };
                    const items = sub.words || [];
                    items.forEach((item, idx) => {
                        const word = {
                            id: `${key}_${(cat.nameKo || cat.name || 'unknown')}_${sub.name}_${idx}`.replace(/\s/g, '_'),
                            category: key,
                            categoryName: meta.name,
                            word: item.word,
                            pronunciation: '',
                            meaning: item.meaning,
                            difficulty: item.difficulty || meta.difficulty,
                            examples: [{
                                sentence: item.example,
                                translation: item.translation
                            }]
                        };
                        subcat.words.push(word);
                        category.words.push(word);
                        this.allWords.push(word);
                    });
                    if (subcat.words.length > 0) {
                        category.subcategories.push(subcat);
                    }
                });
            });
        } else if (key === 'additionalIdioms') {
            // Additional idioms - has subCategories structure
            data.forEach(cat => {
                if (!cat || !cat.subCategories) return;
                cat.subCategories.forEach(sub => {
                    const subcat = {
                        name: `${cat.name} - ${sub.name}`,
                        words: []
                    };
                    const items = sub.expressions || sub.idioms || [];
                    items.forEach((item, idx) => {
                        const word = {
                            id: `${key}_${(cat.name || 'unknown')}_${sub.name}_${idx}`.replace(/\s/g, '_'),
                            category: key,
                            categoryName: meta.name,
                            word: item.expression || item.idiom,
                            pronunciation: '',
                            meaning: item.meaning,
                            difficulty: meta.difficulty,
                            examples: [{
                                sentence: item.example,
                                translation: item.translation
                            }]
                        };
                        subcat.words.push(word);
                        category.words.push(word);
                        this.allWords.push(word);
                    });
                    if (subcat.words.length > 0) {
                        category.subcategories.push(subcat);
                    }
                });
            });
        } else if (key === 'additionalPhrasalVerbs') {
            // Additional phrasal verbs - has subCategories structure
            data.forEach(cat => {
                if (!cat || !cat.subCategories) return;
                cat.subCategories.forEach(sub => {
                    const subcat = {
                        name: `${cat.name} - ${sub.name}`,
                        words: []
                    };
                    const items = sub.phrasalVerbs || [];
                    items.forEach((item, idx) => {
                        const word = {
                            id: `${key}_${(cat.name || 'unknown')}_${sub.name}_${idx}`.replace(/\s/g, '_'),
                            category: key,
                            categoryName: meta.name,
                            word: item.phrasalVerb,
                            pronunciation: '',
                            meaning: item.meaning,
                            difficulty: meta.difficulty,
                            examples: [{
                                sentence: item.example,
                                translation: item.translation
                            }]
                        };
                        subcat.words.push(word);
                        category.words.push(word);
                        this.allWords.push(word);
                    });
                    if (subcat.words.length > 0) {
                        category.subcategories.push(subcat);
                    }
                });
            });
        } else {
            // Standard word format (nouns, verbs, adjectives, adverbs, prepositions, vocabulary)
            data.forEach(cat => {
                if (!cat) return;
                const subcat = {
                    name: cat.nameKo || cat.name || 'Unknown',
                    words: []
                };
                const items = cat.words || [];
                items.forEach((item, idx) => {
                    const word = {
                        id: `${key}_${(cat.nameKo || cat.name || 'unknown')}_${idx}`.replace(/\s/g, '_'),
                        category: key,
                        categoryName: meta.name,
                        word: item.word,
                        pronunciation: item.pronunciation || '',
                        meaning: item.meaning,
                        difficulty: meta.difficulty || 'basic',
                        pastTense: item.pastTense || '',
                        pastParticiple: item.pastParticiple || '',
                        examples: [{
                            sentence: item.example,
                            translation: item.translation
                        }]
                    };
                    subcat.words.push(word);
                    category.words.push(word);
                    this.allWords.push(word);
                });
                category.subcategories.push(subcat);
            });
        }

        this.categories.push(category);
    },

    // Get category by ID
    getCategory(categoryId) {
        return this.categories.find(c => c.id === categoryId);
    },

    // Search words
    search(query) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return this.allWords.filter(word =>
            word.word.toLowerCase().includes(q) ||
            word.meaning.toLowerCase().includes(q)
        ).slice(0, 50);
    },

    // Get words by category
    getWordsByCategory(categoryId) {
        if (categoryId === 'all') return this.allWords;
        const category = this.getCategory(categoryId);
        return category ? category.words : [];
    },

    // Get random words
    getRandomWords(count, categoryId = 'all') {
        const words = this.getWordsByCategory(categoryId);
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // Speak word using TTS
    speak(text, lang = 'en-US') {
        this.tts.speak(text, lang);
    },

    // Stop TTS
    stopSpeaking() {
        this.tts.stop();
    },

    // Get word count by difficulty
    getCountByDifficulty() {
        const counts = { all: this.allWords.length, basic: 0, intermediate: 0, advanced: 0 };
        this.allWords.forEach(word => {
            if (word.difficulty) {
                counts[word.difficulty] = (counts[word.difficulty] || 0) + 1;
            }
        });
        return counts;
    }
};

// Initialize data loading
document.addEventListener('DOMContentLoaded', () => {
    // Initialize TTS
    VocabData.tts.init();

    VocabData.loadAll().then(() => {
        if (typeof initApp === 'function') {
            initApp();
        }
    });
});
