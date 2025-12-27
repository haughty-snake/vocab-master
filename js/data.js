// Data Management - Unified Format
const VocabData = {
    categories: [],
    allWords: [],
    loaded: false,

    // TTS (Text-to-Speech) functionality - Android/iOS 모바일 최적화
    tts: {
        synth: window.speechSynthesis,
        voices: [],
        voiceCache: {},
        voicesLoaded: false,
        voicesLoadRetries: 0,
        rate: 1.0,
        pitch: 1,
        lastWarningLang: null,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),

        // 언어 코드 정규화 (Android: ja_JP, iOS: ja-JP)
        normalizeLanguageCode(lang) {
            if (!lang) return 'en-US';
            return lang.replace('_', '-');
        },

        // 기본 언어 코드 추출 (ja-JP -> ja)
        getBaseLang(lang) {
            return lang.split('-')[0].split('_')[0].toLowerCase();
        },

        // 언어별 대체 코드 (Android/iOS TTS 엔진별 차이 대응)
        getLanguageVariants(lang) {
            const baseLang = this.getBaseLang(lang);
            const variants = [lang, lang.replace('-', '_'), baseLang];

            const langVariantMap = {
                'ja': ['ja-JP', 'ja_JP', 'jpn', 'jpn-JPN', 'ja-jp'],
                'zh': ['zh-CN', 'zh_CN', 'zh-TW', 'zh_TW', 'cmn-Hans-CN', 'cmn-Hant-TW'],
                'ko': ['ko-KR', 'ko_KR', 'kor', 'ko-kr'],
                'en': ['en-US', 'en_US', 'en-GB', 'en_GB', 'eng'],
                'es': ['es-ES', 'es_ES', 'es-MX', 'spa'],
                'fr': ['fr-FR', 'fr_FR', 'fr-CA', 'fra'],
                'de': ['de-DE', 'de_DE', 'deu'],
                'vi': ['vi-VN', 'vi_VN', 'vie'],
                'th': ['th-TH', 'th_TH', 'tha'],
                'id': ['id-ID', 'id_ID', 'ind'],
                'it': ['it-IT', 'it_IT', 'ita'],
                'pt': ['pt-BR', 'pt_BR', 'pt-PT', 'por'],
                'ru': ['ru-RU', 'ru_RU', 'rus'],
            };

            if (langVariantMap[baseLang]) {
                variants.push(...langVariantMap[baseLang]);
            }
            return [...new Set(variants)];
        },

        init() {
            try {
                const savedSpeed = localStorage.getItem('ttsSpeed');
                if (savedSpeed) this.rate = parseFloat(savedSpeed);
            } catch (e) {
                console.error('TTS 속도 로드 오류:', e);
            }

            this.loadVoices();

            if (this.synth) {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }

            // iOS Safari: 첫 사용자 상호작용 후 음성 로드
            if (this.isIOS) {
                const initIOSVoices = () => {
                    this.loadVoices();
                    document.removeEventListener('touchstart', initIOSVoices);
                    document.removeEventListener('click', initIOSVoices);
                };
                document.addEventListener('touchstart', initIOSVoices, { once: true });
                document.addEventListener('click', initIOSVoices, { once: true });
            }
        },

        loadVoices() {
            if (!this.synth) return;

            const voices = this.synth.getVoices();
            if (voices.length > 0) {
                this.voices = voices;
                this.voicesLoaded = true;
                this.voiceCache = {};

                console.log('📢 TTS 음성 로드됨 (' + (this.isIOS ? 'iOS' : this.isAndroid ? 'Android' : 'Desktop') + '): ' + voices.length + '개');
                const langGroups = {};
                voices.forEach(v => {
                    const baseLang = this.getBaseLang(v.lang);
                    if (!langGroups[baseLang]) langGroups[baseLang] = [];
                    langGroups[baseLang].push(v.name.substring(0, 15) + '(' + v.lang + ')');
                });
                Object.keys(langGroups).sort().forEach(lang => {
                    console.log('  ' + lang + ': ' + langGroups[lang].slice(0, 2).join(', '));
                });
            } else if (this.voicesLoadRetries < 5) {
                this.voicesLoadRetries++;
                setTimeout(() => this.loadVoices(), 200 * this.voicesLoadRetries);
            }
        },

        // 언어에 맞는 최적 음성 찾기
        findVoiceForLanguage(lang) {
            const normalizedLang = this.normalizeLanguageCode(lang);

            if (this.voiceCache[normalizedLang] !== undefined) {
                return this.voiceCache[normalizedLang];
            }

            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return null;

            const variants = this.getLanguageVariants(normalizedLang);
            let foundVoice = null;

            // 1. 정확한 언어 코드 매칭
            for (const variant of variants) {
                const nv = this.normalizeLanguageCode(variant).toLowerCase();
                foundVoice = voices.find(v => this.normalizeLanguageCode(v.lang).toLowerCase() === nv);
                if (foundVoice) break;
            }

            // 2. 기본 언어 코드로 시작하는 음성
            if (!foundVoice) {
                const baseLang = this.getBaseLang(normalizedLang);
                foundVoice = voices.find(v => this.getBaseLang(v.lang) === baseLang);
            }

            // 3. 음성 이름에 언어명이 포함된 경우 (모든 지원 언어)
            if (!foundVoice) {
                const langNamePatterns = {
                    'en': ['english', 'samantha', 'alex', 'daniel', 'karen', 'moira', 'tessa', 'fiona'],
                    'ja': ['日本語', 'japanese', 'kyoko', 'otoya', 'hattori', 'o-ren'],
                    'zh': ['中文', '普通话', 'chinese', 'mandarin', 'ting-ting', 'mei-jia', 'sin-ji'],
                    'ko': ['한국어', 'korean', 'yuna', 'sora'],
                    'es': ['español', 'spanish', 'monica', 'jorge', 'paulina', 'diego'],
                    'fr': ['français', 'french', 'thomas', 'amelie', 'audrey'],
                    'de': ['deutsch', 'german', 'anna', 'markus', 'petra', 'yannick'],
                    'it': ['italiano', 'italian', 'alice', 'federica', 'luca', 'paola'],
                    'pt': ['português', 'portuguese', 'luciana', 'joana', 'felipe'],
                    'ru': ['русский', 'russian', 'milena', 'yuri', 'katya'],
                    'vi': ['tiếng việt', 'vietnamese', 'linh'],
                    'th': ['ไทย', 'thai', 'kanya', 'narisa'],
                    'id': ['indonesia', 'indonesian', 'damayanti'],
                };
                const baseLang = this.getBaseLang(normalizedLang);
                const patterns = langNamePatterns[baseLang] || [];

                for (const pattern of patterns) {
                    foundVoice = voices.find(v =>
                        v.name.toLowerCase().includes(pattern.toLowerCase())
                    );
                    if (foundVoice) break;
                }
            }

            this.voiceCache[normalizedLang] = foundVoice;
            return foundVoice;
        },

        // 언어 이름 (한국어)
        langNames: {
            'en': '영어', 'ja': '일본어', 'zh': '중국어', 'ko': '한국어',
            'es': '스페인어', 'fr': '프랑스어', 'de': '독일어', 'it': '이탈리아어',
            'pt': '포르투갈어', 'ru': '러시아어', 'vi': '베트남어', 'th': '태국어', 'id': '인도네시아어'
        },

        // 언어 이름 가져오기
        getLanguageName(lang) {
            const baseLang = this.getBaseLang(lang);
            return this.langNames[baseLang] || lang;
        },

        // 음성 지원 여부 확인
        hasVoiceForLanguage(lang) {
            return this.findVoiceForLanguage(lang) !== null;
        },

        // TTS 미지원 안내 다이얼로그 표시
        showLanguageInstallGuide(lang) {
            const langName = this.getLanguageName(lang);
            const modal = document.getElementById('tts-language-modal');
            const langNameEl = document.getElementById('tts-lang-name');
            const stepsEl = document.getElementById('tts-install-steps');

            if (!modal) return;

            langNameEl.textContent = langName;

            // 디바이스별 설치 안내
            if (this.isAndroid) {
                stepsEl.innerHTML = '<ol>' +
                    '<li>설정 > 일반 관리 > 언어 > 텍스트 읽어주기</li>' +
                    '<li>기본 엔진 선택 (Google TTS 권장)</li>' +
                    '<li>언어 > <strong>' + langName + '</strong> 다운로드</li>' +
                    '</ol>' +
                    '<p class="tts-note">※ 삼성 기기: 설정 > 접근성 > TTS</p>';
            } else if (this.isIOS) {
                stepsEl.innerHTML = '<ol>' +
                    '<li>설정 > 손쉬운 사용 > 음성 콘텐츠</li>' +
                    '<li>음성 > <strong>' + langName + '</strong> 선택</li>' +
                    '<li>원하는 음성 다운로드</li>' +
                    '</ol>';
            } else {
                stepsEl.innerHTML = '<ol>' +
                    '<li>Windows: 설정 > 시간 및 언어 > 음성</li>' +
                    '<li>음성 추가 > <strong>' + langName + '</strong> 선택</li>' +
                    '</ol>' +
                    '<p class="tts-note">※ macOS: 시스템 설정 > 손쉬운 사용 > 음성 콘텐츠</p>';
            }

            modal.classList.remove('hidden');
        },

        // TTS 미지원 토스트 표시 (자동재생용)
        showLanguageToast(lang) {
            const langName = this.getLanguageName(lang);
            if (typeof showToast === 'function') {
                showToast('🔇 ' + langName + ' TTS 미지원 (언어 설치 필요)');
            }
        },

        speak(text, lang = 'en-US', options = {}) {
            if (!this.synth) return false;
            this.synth.cancel();

            // 음성 지원 확인
            const voice = this.findVoiceForLanguage(lang);
            if (!voice) {
                const baseLang = this.getBaseLang(lang);

                // silent 모드 (자동재생): 토스트만 표시
                if (options.silent) {
                    // 중복 토스트 방지
                    if (this.lastWarningLang !== baseLang) {
                        this.lastWarningLang = baseLang;
                        this.showLanguageToast(lang);
                    }
                    return false;
                }

                // 수동 재생: 다이얼로그 표시
                this.showLanguageInstallGuide(lang);
                return false;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.lang = voice.lang;
            utterance.rate = this.rate;
            utterance.pitch = this.pitch;

            // iOS Safari 버그 대응: 긴 텍스트에서 멈춤 방지
            if (this.isIOS && text.length > 100) {
                let resumeTimer = setInterval(() => {
                    if (!this.synth.speaking) {
                        clearInterval(resumeTimer);
                    } else {
                        this.synth.pause();
                        this.synth.resume();
                    }
                }, 14000);

                utterance.onend = () => clearInterval(resumeTimer);
                utterance.onerror = () => clearInterval(resumeTimer);
            }

            this.synth.speak(utterance);
            return true;
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
            lang: categoryData.lang || 'en-US',
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
                lang: categoryData.lang || 'en-US',
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

            const categoryLang = customCat.lang || 'en-US';
            const category = {
                id: customCat.id,
                name: customCat.name,
                icon: customCat.icon || '📁',
                color: customCat.color || '#6c757d',
                lang: categoryLang,
                isCustom: true,
                subcategories: [],
                words: []
            };

            customCat.words.forEach(wordData => {
                const word = {
                    id: wordData.id,
                    category: customCat.id,
                    categoryName: customCat.name,
                    lang: categoryLang,
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
