// Data Management - Unified Format
const VocabData = {
    categories: [],
    allWords: [],
    loaded: false,

    // TTS (Text-to-Speech) functionality
    tts: {
        synth: window.speechSynthesis,
        voice: null,
        rate: 0.9,
        pitch: 1,

        init() {
            const loadVoices = () => {
                const voices = this.synth.getVoices();
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

        if (typeof DATA_BUNDLE === 'undefined') {
            console.error('DATA_BUNDLE not found. Make sure data.bundle.js is loaded before data.js');
            return;
        }

        Object.entries(DATA_BUNDLE).forEach(([key, categoryData]) => {
            try {
                this.processCategory(categoryData);
                console.log(`✓ Loaded ${categoryData.name}: ${categoryData.words.length} words`);
            } catch (error) {
                console.error(`Error processing ${key}:`, error);
            }
        });

        this.loaded = true;
        console.log(`Total loaded: ${this.allWords.length} items`);
    },

    // Process unified category format
    processCategory(categoryData) {
        const category = {
            id: categoryData.id,
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
            subcategories: [],
            words: []
        };

        // Group words by subcategory
        const subcatMap = new Map();

        categoryData.words.forEach(wordData => {
            // Build word object with backward compatibility
            const word = {
                id: wordData.id,
                category: categoryData.id,
                categoryName: categoryData.name,
                subcategory: wordData.subcategory || '',
                word: wordData.word,
                pronunciation: wordData.pronunciation || '',
                meanings: wordData.meanings || [],
                // Backward compatibility: set meaning as joined meanings
                meaning: wordData.meanings
                    ? wordData.meanings.map(m => m.meaning).join(', ')
                    : '',
                // Backward compatibility: set examples from first meaning
                examples: wordData.meanings && wordData.meanings[0]
                    ? wordData.meanings[0].examples || []
                    : [],
                // Verb-specific fields
                pastTense: wordData.pastTense || '',
                pastParticiple: wordData.pastParticiple || '',
                antonym: wordData.antonym || ''
            };

            category.words.push(word);
            this.allWords.push(word);

            // Group by subcategory
            const subcatName = word.subcategory || 'Default';
            if (!subcatMap.has(subcatName)) {
                subcatMap.set(subcatName, { name: subcatName, words: [] });
            }
            subcatMap.get(subcatName).words.push(word);
        });

        subcatMap.forEach(subcat => category.subcategories.push(subcat));
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

    // Get words by category (respects disabled categories for 'all')
    getWordsByCategory(categoryId) {
        if (categoryId === 'all') {
            if (typeof Storage !== 'undefined' && Storage.isCategoryDisabled) {
                const activeCategories = this.categories.filter(cat => !Storage.isCategoryDisabled(cat.id));
                return activeCategories.reduce((acc, cat) => acc.concat(cat.words), []);
            }
            return this.allWords;
        }
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
    },

    // Load custom categories from Storage
    loadCustomCategories() {
        if (typeof Storage === 'undefined' || !Storage.customCategories) return;

        Storage.customCategories.forEach(customCat => {
            if (this.categories.find(c => c.id === customCat.id)) return;

            const category = {
                id: customCat.id,
                name: customCat.name,
                icon: customCat.icon || '📁',
                color: customCat.color || '#6c757d',
                isCustom: true,
                subcategories: [],
                words: []
            };

            customCat.words.forEach(wordData => {
                const word = {
                    id: wordData.id,
                    category: customCat.id,
                    categoryName: customCat.name,
                    word: wordData.word,
                    pronunciation: wordData.pronunciation || '',
                    meanings: wordData.meanings || [],
                    meaning: wordData.meanings && wordData.meanings.length > 0
                        ? wordData.meanings.map(m => m.meaning).join(', ')
                        : wordData.meaning || '',
                    examples: wordData.meanings && wordData.meanings[0]
                        ? wordData.meanings[0].examples || []
                        : wordData.examples || [],
                    partOfSpeech: wordData.partOfSpeech || '',
                    isCustom: true
                };
                category.words.push(word);
                this.allWords.push(word);
            });

            this.categories.push(category);
        });
    },

    // Reload custom categories
    reloadCustomCategories() {
        this.allWords = this.allWords.filter(w => !w.isCustom);
        this.categories = this.categories.filter(c => !c.isCustom);
        this.loadCustomCategories();
    }
};

// Initialize data loading
document.addEventListener('DOMContentLoaded', () => {
    VocabData.tts.init();

    if (typeof Storage !== 'undefined' && Storage.init) {
        Storage.init();
    }

    VocabData.loadAll().then(() => {
        VocabData.loadCustomCategories();

        if (typeof initApp === 'function') {
            initApp();
        }
    });
});
