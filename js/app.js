// VocabMaster Main Application
let currentView = 'home-view';
let currentCategory = 'all';
let currentCategoryFilter = 'all'; // 'all', 'active', 'inactive'
let currentLanguageFilter = 'all'; // 'all', 'en-US', 'ko-KR', 'zh-CN', 'ja-JP', etc.

// Helper function to filter words by current language filter
function applyLanguageFilter(words) {
    if (currentLanguageFilter === 'all') return words;

    const mainLangs = ['en-US', 'en-GB', 'ko-KR', 'zh-CN', 'zh-TW', 'ja-JP', 'es-ES', 'fr-FR', 'de-DE', 'vi-VN'];
    if (currentLanguageFilter === 'other') {
        return words.filter(word => {
            const wordLang = word.lang || 'en-US';
            return !mainLangs.includes(wordLang);
        });
    } else if (currentLanguageFilter === 'en-US') {
        return words.filter(word => {
            const wordLang = word.lang || 'en-US';
            return wordLang === 'en-US' || wordLang === 'en-GB' || wordLang.startsWith('en');
        });
    } else {
        return words.filter(word => {
            const wordLang = word.lang || 'en-US';
            return wordLang === currentLanguageFilter;
        });
    }
}
let importAbortController = null; // 파일 가져오기 취소용
let pendingRecoveryData = null; // 복구 대기 중인 머지 데이터

// TTS 언어 코드 -> 한글 매핑
const LANG_TO_KOREAN = {
    'en-US': '영어',
    'en-GB': '영어',
    'ko-KR': '한국어',
    'zh-CN': '중국어',
    'zh-TW': '중국어',
    'ja-JP': '일본어',
    'es-ES': '스페인어',
    'fr-FR': '프랑스어',
    'de-DE': '독일어',
    'it-IT': '이탈리아어',
    'pt-BR': '포르투갈어',
    'ru-RU': '러시아어',
    'vi-VN': '베트남어',
    'th-TH': '태국어',
    'id-ID': '인도네시아어'
};

// 언어 코드를 한글로 변환
function getLangKorean(langCode) {
    if (!langCode) return '영어';
    return LANG_TO_KOREAN[langCode] || langCode;
}

// Global Loading Overlay Functions
function showGlobalLoading(message = '처리 중...') {
    const overlay = document.getElementById('global-loading');
    const text = document.getElementById('global-loading-text');
    if (overlay && text) {
        text.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideGlobalLoading() {
    const overlay = document.getElementById('global-loading');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Load category and filter states from localStorage on script load
(function loadStoredCategory() {
    try {
        const stored = localStorage.getItem('selectedCategory');
        if (stored) {
            currentCategory = stored;
        }
        // Load filter states
        const storedCategoryFilter = localStorage.getItem('categoryStatusFilter');
        if (storedCategoryFilter) {
            currentCategoryFilter = storedCategoryFilter;
        }
        const storedLanguageFilter = localStorage.getItem('categoryLanguageFilter');
        if (storedLanguageFilter) {
            currentLanguageFilter = storedLanguageFilter;
        }
    } catch (e) {
        console.error('Error loading category:', e);
    }
})();

// Markdown bold to HTML bold converter
function formatBold(text) {
    if (!text) return '';
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// Highlight word in example sentence
function highlightWord(sentence, word) {
    if (!sentence || !word) return sentence || '';

    // Remove any existing bold markers first
    let cleanSentence = sentence.replace(/\*\*([^*]+)\*\*/g, '$1');

    // Create regex to match the word and its variations (case-insensitive)
    // Match word boundaries and common variations (e.g., run, runs, running, ran)
    const baseWord = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b(${baseWord}\\w*)\\b`, 'gi');

    return cleanSentence.replace(pattern, '<strong>$1</strong>');
}

// Format meanings with part of speech: [품사]뜻, [품사]뜻
// If html=true, returns HTML with styled spans
// If maxCount > 0, limits the number of meanings shown
function formatMeaningWithPos(word, html = false, maxCount = 0) {
    if (word.meanings && word.meanings.length > 0) {
        const displayMeanings = maxCount > 0 ? word.meanings.slice(0, maxCount) : word.meanings;
        return displayMeanings.map(m => {
            if (m.partOfSpeech) {
                if (html) {
                    return `<span class="pos-light">[${m.partOfSpeech}]</span>${m.meaning}`;
                }
                return `[${m.partOfSpeech}]${m.meaning}`;
            }
            return m.meaning;
        }).join(', ');
    }
    // Fallback to old format
    if (word.partOfSpeech) {
        if (html) {
            return `<span class="pos-light">[${word.partOfSpeech}]</span>${word.meaning}`;
        }
        return `[${word.partOfSpeech}]${word.meaning}`;
    }
    return word.meaning || '';
}

// Get a random single meaning from a word (for quiz)
function getRandomMeaning(word, html = false) {
    if (word.meanings && word.meanings.length > 0) {
        const randomIdx = Math.floor(Math.random() * word.meanings.length);
        const m = word.meanings[randomIdx];
        if (m.partOfSpeech) {
            if (html) {
                return `<span class="pos-light">[${m.partOfSpeech}]</span>${m.meaning}`;
            }
            return `[${m.partOfSpeech}]${m.meaning}`;
        }
        return m.meaning;
    }
    // Fallback to old format
    if (word.partOfSpeech) {
        if (html) {
            return `<span class="pos-light">[${word.partOfSpeech}]</span>${word.meaning}`;
        }
        return `[${word.partOfSpeech}]${word.meaning}`;
    }
    return word.meaning || '';
}

let currentPage = 1;
let currentViewMode = 'full'; // 'full' or 'word-only'
let itemsPerPage = 20;
let filteredWords = [];
let categorySelectorCallback = null;

// Infinite scroll state
let loadedItemsCount = 0;
const itemsPerLoad = 100;
let isLoadingMore = false;
let scrollHandler = null;

// Category grid lazy loading state
let categoryGridLoaded = 0;
const categoryGridPerLoad = 20;
let categoryGridObserver = null;

// Save category to localStorage
function saveCategory(categoryId) {
    currentCategory = categoryId;
    localStorage.setItem('selectedCategory', categoryId);
}

// Flashcard state
let flashcardWords = [];
let flashcardIndex = 0;
let flashcardAutoTTS = false;
let flashcardAnimation = true;

// Blink state
let blinkInterval = null;
let blinkIndex = 0;
let blinkWords = [];
let blinkAlternatePhase = 0; // 0: word, 1: meaning
let blinkRepeatCurrent = 0;
let blinkRepeatCount = 2;
let blinkAutoTTS = true;
let blinkProgressInterval = null;

// Quiz state
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

// View loading helpers
function showViewLoading(viewId) {
    const overlay = document.getElementById(viewId);
    if (overlay) overlay.classList.remove('hidden');
}

function hideViewLoading(viewId) {
    const overlay = document.getElementById(viewId);
    if (overlay) overlay.classList.add('hidden');
}

// Initialize application
async function initApp() {
    showViewLoading('home-loading');

    // Allow UI to show loading state
    await new Promise(resolve => setTimeout(resolve, 10));

    try {
        validateStoredCategory();
        renderCategories();
        renderProgress();
        updateNavigation();
        updateAllCategoryBadges();
        displayAppVersion();
    } finally {
        hideViewLoading('home-loading');
    }
}

// Display app version in settings
function displayAppVersion() {
    const versionEl = document.getElementById('app-version');
    if (versionEl && typeof Version !== 'undefined') {
        versionEl.textContent = 'v' + Version.CURRENT;
    }
}

// Validate that stored category still exists
function validateStoredCategory() {
    if (currentCategory === 'all') return;

    // Check if VocabData is available and has loaded categories
    if (typeof VocabData !== 'undefined' && VocabData.loaded && VocabData.categories && VocabData.categories.length > 0) {
        const categoryExists = VocabData.categories.some(cat => cat.id === currentCategory);
        if (!categoryExists) {
            saveCategory('all');
        }
    }
}

// Navigation
function showView(viewId) {
    const previousView = currentView;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === viewId.replace('-view', ''));
    });

    currentView = viewId;

    // 홈에서 다른 뷰로 이동할 때 히스토리 추가
    if (previousView === 'home-view' && viewId !== 'home-view') {
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: 'app', view: viewId }, '', '');
        }
    }
}

// 이전 페이지가 홈이면 뒤로가기, 아니면 홈으로 이동
function goBack() {
    // SPA 내부에서는 항상 홈으로 이동
    showHome();
}

async function showHome() {
    showView('home-view');
    showViewLoading('home-loading');

    await new Promise(resolve => setTimeout(resolve, 10));

    try {
        // Restore filter UI state from stored values
        restoreFilterUIState();
        renderCategories();
        renderProgress();
    } finally {
        hideViewLoading('home-loading');
    }
}

// Restore filter UI state from stored values
function restoreFilterUIState() {
    // Restore status filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === currentCategoryFilter);
    });

    // Restore language filter select
    const langSelect = document.getElementById('language-filter');
    if (langSelect) {
        langSelect.value = currentLanguageFilter;
    }
}

async function showWordList() {
    showView('list-view');
    showViewLoading('list-loading');

    await new Promise(resolve => setTimeout(resolve, 10));

    try {
        populateCategorySelect();
        updateAllCategoryBadges();
        loadWordListSettings();
        // Use saved status filter
        const statusFilter = Storage.settings.ui?.wordList?.statusFilter || 'all';
        filterWords(statusFilter);
    } finally {
        hideViewLoading('list-loading');
    }
}

function showFlashcard() {
    showView('flashcard-view');
    updateAllCategoryBadges();
    loadFlashcardSettings();
    initFlashcards();
}

function showBlink() {
    showView('blink-view');
    updateAllCategoryBadges();
    loadBlinkSettings();
    document.querySelector('.blink-settings').classList.remove('hidden');
    document.getElementById('blink-display-area').classList.add('hidden');
}

function showQuiz() {
    showView('quiz-view');
    updateAllCategoryBadges();
    loadQuizSettings();
    document.getElementById('quiz-settings').classList.remove('hidden');
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
}

function updateNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === 'home') btn.classList.add('active');
    });
}

// Search functionality
function handleSearch(query) {
    const resultsContainer = document.getElementById('search-results');

    if (!query || query.length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }

    const results = VocabData.search(query);

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item"><em>검색 결과가 없습니다</em></div>';
    } else {
        resultsContainer.innerHTML = results.map(word => `
            <div class="search-result-item" onclick="showWordDetail('${word.id}')">
                <div class="search-result-word">${word.word}</div>
                <div class="search-result-meaning">${word.meaning}</div>
            </div>
        `).join('');
    }

    resultsContainer.classList.remove('hidden');
}

function performSearch() {
    const query = document.getElementById('search-input').value;
    handleSearch(query);
}

function showWordDetail(wordId) {
    const word = VocabData.allWords.find(w => w.id === wordId);
    if (word) {
        // Change to the word's category
        currentCategory = word.category;
        saveCategory(currentCategory);
        updateAllCategoryBadges();

        // Show word list view
        showWordList();

        // Find the word's index in filtered words
        filterWords();
        const wordIndex = filteredWords.findIndex(w => w.id === wordId);

        if (wordIndex !== -1) {
            const displayMode = Storage.settings.displayMode || 'paging';
            if (displayMode === 'paging') {
                // Calculate which page the word is on
                currentPage = Math.floor(wordIndex / itemsPerPage) + 1;
                renderWordList();
            } else {
                // Infinite scroll mode: ensure word is loaded
                if (wordIndex >= loadedItemsCount) {
                    loadedItemsCount = Math.min(wordIndex + itemsPerLoad, filteredWords.length);
                    renderWordList(true);
                }
            }

            // Scroll to and highlight the word after a brief delay
            setTimeout(() => {
                const wordElement = document.querySelector(`[data-id="${wordId}"]`);
                if (wordElement) {
                    wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    wordElement.classList.add('highlighted');
                    setTimeout(() => wordElement.classList.remove('highlighted'), 2000);
                }
            }, 100);
        }
    }
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('search-input').value = '';
}

// Category rendering with lazy loading
function renderCategories() {
    const grid = document.getElementById('category-grid');

    // Disconnect previous observer
    if (categoryGridObserver) {
        categoryGridObserver.disconnect();
        categoryGridObserver = null;
    }

    // Get active categories and their words for total count
    const activeCategories = VocabData.categories.filter(cat => !Storage.isCategoryDisabled(cat.id));
    const activeWords = activeCategories.reduce((acc, cat) => acc.concat(cat.words), []);
    const totalActiveWords = activeWords.length;
    const overallProgress = Storage.getCategoryProgress(activeWords);

    // Filter categories based on currentCategoryFilter
    let filteredCategories = VocabData.categories;
    if (currentCategoryFilter === 'active') {
        filteredCategories = VocabData.categories.filter(cat => !Storage.isCategoryDisabled(cat.id));
    } else if (currentCategoryFilter === 'inactive') {
        filteredCategories = VocabData.categories.filter(cat => Storage.isCategoryDisabled(cat.id));
    }

    // Filter categories based on currentLanguageFilter
    if (currentLanguageFilter !== 'all') {
        const mainLangs = ['en-US', 'en-GB', 'ko-KR', 'zh-CN', 'zh-TW', 'ja-JP', 'es-ES', 'fr-FR', 'de-DE', 'vi-VN'];
        if (currentLanguageFilter === 'other') {
            // Show categories with languages not in the main list
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return !mainLangs.includes(catLang);
            });
        } else if (currentLanguageFilter === 'en-US') {
            // English includes en-US and en-GB, and categories without lang field
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return catLang === 'en-US' || catLang === 'en-GB' || catLang.startsWith('en');
            });
        } else {
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return catLang === currentLanguageFilter;
            });
        }
    }

    // Sort categories by TTS language (English first), then by name
    filteredCategories = [...filteredCategories].sort((a, b) => {
        const langA = a.lang || 'en-US';
        const langB = b.lang || 'en-US';
        const isEnglishA = langA.startsWith('en');
        const isEnglishB = langB.startsWith('en');

        // English comes first
        if (isEnglishA && !isEnglishB) return -1;
        if (!isEnglishA && isEnglishB) return 1;

        // Then sort by Korean language name
        const langKoreanA = getLangKorean(langA);
        const langKoreanB = getLangKorean(langB);
        if (langKoreanA !== langKoreanB) {
            return langKoreanA.localeCompare(langKoreanB, 'ko');
        }
        return a.name.localeCompare(b.name, 'ko');
    });

    // Reset loaded count
    categoryGridLoaded = Math.min(categoryGridPerLoad, filteredCategories.length);

    // "All" category card (only show if not filtering to inactive only)
    let html = '';
    if (currentCategoryFilter !== 'inactive') {
        // Calculate word count for filtered categories
        const filteredActiveCategories = filteredCategories.filter(cat => !Storage.isCategoryDisabled(cat.id));
        const filteredActiveWords = filteredActiveCategories.reduce((acc, cat) => acc.concat(cat.words), []);
        const filteredWordCount = filteredActiveWords.length;
        const filteredProgress = Storage.getCategoryProgress(filteredActiveWords);

        const allSelected = currentCategory === 'all' ? 'selected' : '';
        html = `
            <div class="category-card all-category-card ${allSelected}" onclick="selectCategory('all')">
                <div class="category-icon" style="background: linear-gradient(135deg, #4285f4, #34a853); color: white;">📚</div>
                <div class="category-name">전체 보기</div>
                <div class="category-count">${filteredWordCount}개 단어</div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${filteredProgress.percentage}%"></div>
                </div>
            </div>
        `;
    }

    // Render only initial batch of categories
    const categoriesToShow = filteredCategories.slice(0, categoryGridLoaded);
    html += renderCategoryCards(categoriesToShow);

    // Add load more indicator if there are more categories
    if (categoryGridLoaded < filteredCategories.length) {
        html += `
            <div id="category-load-indicator" class="category-card load-more-card">
                <div class="category-icon">⏳</div>
                <div class="category-name">더 보기</div>
                <div class="category-count">${filteredCategories.length - categoryGridLoaded}개 남음</div>
            </div>
        `;
    } else {
        // Add "새 카테고리 추가" button (only if not filtering to inactive)
        if (currentCategoryFilter !== 'inactive') {
            html += `
                <div class="category-card add-category-card" onclick="openCustomCategoryModal()">
                    <div class="category-icon add-icon">+</div>
                    <div class="category-name">카테고리 추가</div>
                    <div class="category-count">나만의 단어장 만들기</div>
                </div>
            `;
        }
    }

    // Show empty state if no categories match filter
    if (filteredCategories.length === 0) {
        if (currentCategoryFilter === 'inactive') {
            html = '<div class="empty-state">비활성화된 카테고리가 없습니다.</div>';
        } else if (currentLanguageFilter !== 'all') {
            const langNames = {
                'en-US': '영어', 'ko-KR': '한국어', 'zh-CN': '중국어', 'ja-JP': '일본어',
                'es-ES': '스페인어', 'fr-FR': '프랑스어', 'de-DE': '독일어', 'vi-VN': '베트남어', 'other': '기타'
            };
            html = `<div class="empty-state">${langNames[currentLanguageFilter] || currentLanguageFilter} 카테고리가 없습니다.</div>`;
        }
    }

    grid.innerHTML = html;

    // Setup Intersection Observer for lazy loading
    if (categoryGridLoaded < filteredCategories.length) {
        setupCategoryGridObserver(filteredCategories);
    }
}

function renderCategoryCards(categories) {
    return categories.map(cat => {
        const progress = Storage.getCategoryProgress(cat.words);
        const isSelected = currentCategory === cat.id ? 'selected' : '';
        const isCustom = cat.isCustom ? 'custom-category' : '';
        const isDisabled = Storage.isCategoryDisabled(cat.id) ? 'disabled-category' : '';
        const isEnabled = !Storage.isCategoryDisabled(cat.id);
        // customBadge moved to badge-area
        const manageBtn = cat.isCustom ? `<button class="category-manage-btn" onclick="event.stopPropagation(); openWordManagementModal('${cat.id}')" title="단어 관리">⚙️</button>` : '';
        const toggleIcon = isEnabled ? '✅' : '❌';
        const toggleTitle = isEnabled ? '비활성화' : '활성화';
        const toggleBtn = `<button class="category-toggle-btn" onclick="event.stopPropagation(); toggleCategoryEnabled('${cat.id}')" title="${toggleTitle}">${toggleIcon}</button>`;
        const langKorean = getLangKorean(cat.lang || 'en-US');
        const badgeArea = `<span class="lang-badge">${langKorean}</span>`;
        const customBadge = cat.isCustom ? '<span class="custom-badge">사용자</span>' : '';

        return `
            <div class="category-card ${isSelected} ${isCustom} ${isDisabled}" onclick="selectCategory('${cat.id}')" style="--cat-color: ${cat.color}">
                <div class="badge-area">${badgeArea}</div>
                ${toggleBtn}
                ${manageBtn}
                <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color}">${cat.icon}</div>
                <div class="category-name">${cat.name}${customBadge}</div>
                <div class="category-count">${cat.words.length}개 단어</div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function setupCategoryGridObserver(filteredCategories) {
    const indicator = document.getElementById('category-load-indicator');
    if (!indicator) return;

    categoryGridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadMoreCategories(filteredCategories);
            }
        });
    }, { rootMargin: '100px' });

    categoryGridObserver.observe(indicator);
}

function loadMoreCategories(filteredCategories) {
    if (categoryGridLoaded >= filteredCategories.length) return;

    const grid = document.getElementById('category-grid');
    const indicator = document.getElementById('category-load-indicator');

    // Disconnect observer while loading
    if (categoryGridObserver) {
        categoryGridObserver.disconnect();
    }

    const startIndex = categoryGridLoaded;
    const endIndex = Math.min(startIndex + categoryGridPerLoad, filteredCategories.length);
    const newCategories = filteredCategories.slice(startIndex, endIndex);

    // Remove indicator
    if (indicator) {
        indicator.remove();
    }

    // Append new category cards
    grid.insertAdjacentHTML('beforeend', renderCategoryCards(newCategories));

    categoryGridLoaded = endIndex;

    // Add new indicator or add button
    if (categoryGridLoaded < filteredCategories.length) {
        grid.insertAdjacentHTML('beforeend', `
            <div id="category-load-indicator" class="category-card load-more-card">
                <div class="category-icon">⏳</div>
                <div class="category-name">더 보기</div>
                <div class="category-count">${filteredCategories.length - categoryGridLoaded}개 남음</div>
            </div>
        `);
        setupCategoryGridObserver(filteredCategories);
    } else if (currentCategoryFilter !== 'inactive') {
        grid.insertAdjacentHTML('beforeend', `
            <div class="category-card add-category-card" onclick="openCustomCategoryModal()">
                <div class="category-icon add-icon">+</div>
                <div class="category-name">카테고리 추가</div>
                <div class="category-count">나만의 단어장 만들기</div>
            </div>
        `);
    }
}

// Filter categories by status (all, active, inactive)
function filterCategoriesByStatus(filter) {
    currentCategoryFilter = filter;

    // Save to localStorage
    try {
        localStorage.setItem('categoryStatusFilter', filter);
    } catch (e) {
        console.error('Error saving status filter:', e);
    }

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    renderCategories();
}

// Filter categories by language
function filterCategoriesByLanguage(lang) {
    currentLanguageFilter = lang;

    // Save to localStorage
    try {
        localStorage.setItem('categoryLanguageFilter', lang);
    } catch (e) {
        console.error('Error saving language filter:', e);
    }

    renderCategories();
    renderProgress();
}

// Toggle category enabled/disabled
function toggleCategoryEnabled(categoryId) {
    const isNowEnabled = Storage.toggleCategoryEnabled(categoryId);
    showToast(isNowEnabled ? '카테고리가 활성화되었습니다' : '카테고리가 비활성화되었습니다');

    // If current category was disabled, switch to 'all'
    if (!isNowEnabled && currentCategory === categoryId) {
        saveCategory('all');
        updateAllCategoryBadges();
    }

    renderCategories();
    renderProgress();
}

function selectCategory(categoryId) {
    // Prevent selecting disabled categories (except 'all')
    if (categoryId !== 'all' && Storage.isCategoryDisabled(categoryId)) {
        showToast('비활성화된 카테고리는 선택할 수 없습니다');
        return;
    }

    saveCategory(categoryId);
    updateAllCategoryBadges();
    showWordList();
    // 카테고리 선택 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Progress rendering
function renderProgress() {
    const container = document.getElementById('progress-cards');

    // Calculate progress for active categories only
    let filteredCategories = VocabData.categories.filter(cat => !Storage.isCategoryDisabled(cat.id));

    // Apply language filter
    if (currentLanguageFilter !== 'all') {
        const mainLangs = ['en-US', 'en-GB', 'ko-KR', 'zh-CN', 'zh-TW', 'ja-JP', 'es-ES', 'fr-FR', 'de-DE', 'vi-VN'];
        if (currentLanguageFilter === 'other') {
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return !mainLangs.includes(catLang);
            });
        } else if (currentLanguageFilter === 'en-US') {
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return catLang === 'en-US' || catLang === 'en-GB' || catLang.startsWith('en');
            });
        } else {
            filteredCategories = filteredCategories.filter(cat => {
                const catLang = cat.lang || 'en-US';
                return catLang === currentLanguageFilter;
            });
        }
    }

    const activeWords = filteredCategories.reduce((acc, cat) => acc.concat(cat.words), []);
    const overall = Storage.getCategoryProgress(activeWords);

    container.innerHTML = `
        <div class="progress-card">
            <div class="progress-label">전체 진행률</div>
            <div class="progress-value" style="color: var(--primary-color)">${overall.percentage}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${overall.percentage}%; background: var(--primary-color)"></div>
            </div>
        </div>
        <div class="progress-card">
            <div class="progress-label">암기 완료</div>
            <div class="progress-value" style="color: var(--success-color)">${overall.memorized}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(overall.memorized / overall.total) * 100}%; background: var(--success-color)"></div>
            </div>
        </div>
        <div class="progress-card">
            <div class="progress-label">학습 중</div>
            <div class="progress-value" style="color: var(--warning-color)">${overall.learning}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(overall.learning / overall.total) * 100}%; background: var(--warning-color)"></div>
            </div>
        </div>
        <div class="progress-card">
            <div class="progress-label">총 단어 수</div>
            <div class="progress-value">${overall.total}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 100%; background: var(--bg-tertiary)"></div>
            </div>
        </div>
    `;
}

// Word list functions
function populateCategorySelect() {
    // Category select dropdown was removed, using modal selector instead
    // This function is kept for compatibility but does nothing
}

function filterByCategory(categoryId) {
    saveCategory(categoryId);
    currentPage = 1;
    updateAllCategoryBadges();
    filterWords();
}

function filterByStatus(status) {
    currentPage = 1;
    saveWordListSettings('statusFilter', status);
    filterWords(status);
}

function filterWords(statusFilter = 'all') {
    let words = VocabData.getWordsByCategory(currentCategory);

    // Apply language filter when viewing 'all' categories
    if (currentCategory === 'all') {
        words = applyLanguageFilter(words);
    }

    // Filter by status
    if (statusFilter !== 'all') {
        words = words.filter(word => Storage.getWordStatus(word.id) === statusFilter);
    }

    filteredWords = words;
    loadedItemsCount = 0; // Reset for infinite scroll
    renderWordList();
}

function renderWordList(preserveLoadedCount = false) {
    const container = document.getElementById('word-list');
    const displayMode = Storage.settings.displayMode || 'paging';

    // Remove previous scroll listener
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }

    let wordsToShow;
    if (displayMode === 'all') {
        // Infinite scroll mode
        if (!preserveLoadedCount || loadedItemsCount === 0) {
            // Reset to initial batch
            loadedItemsCount = Math.min(itemsPerLoad, filteredWords.length);
        }
        wordsToShow = filteredWords.slice(0, loadedItemsCount);
    } else {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        wordsToShow = filteredWords.slice(start, end);
    }

    if (filteredWords.length === 0) {
        container.innerHTML = '<div class="word-item"><em>표시할 단어가 없습니다</em></div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const showPronunciation = Storage.settings.showPronunciation;

    container.innerHTML = renderWordItems(wordsToShow);

    // Add load more indicator for infinite scroll
    if (displayMode === 'all' && loadedItemsCount < filteredWords.length) {
        container.innerHTML += `
            <div id="load-more-indicator" class="load-more-indicator">
                <span class="load-more-text">스크롤하여 더 보기 (${loadedItemsCount}/${filteredWords.length})</span>
            </div>
        `;
        setupInfiniteScroll();
    }

    renderPagination();
}

// Generate HTML for word items
function renderWordItems(words) {
    const showPronunciation = Storage.settings.showPronunciation;

    return words.map(word => {
        const status = Storage.getWordStatus(word.id);

        // Render meanings (support polysemy)
        let meaningsHtml = '';
        if (word.meanings && word.meanings.length > 0) {
            if (word.meanings.length === 1) {
                // Single meaning - no number prefix
                const m = word.meanings[0];
                const ex = m.examples && m.examples[0];
                const posTag = m.partOfSpeech ? `<span class="pos-tag">${m.partOfSpeech}</span>` : '';
                meaningsHtml = `
                    <div class="word-meaning">${m.meaning} ${posTag}</div>
                    ${ex && ex.sentence ? `
                        <div class="word-example">
                            <div class="example-sentence">${highlightWord(ex.sentence, word.word)}<button class="tts-btn-small" onclick="event.stopPropagation(); VocabData.speak('${ex.sentence.replace(/'/g, "\\'").replace(/\*\*/g, '')}', '${word.lang || 'en-US'}')" title="예문 듣기"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button></div>
                            ${ex.translation ? `<div class="word-translation">${ex.translation}</div>` : ''}
                        </div>` : ''}
                `;
            } else {
                // Multiple meanings (polysemy) - with number prefix
                meaningsHtml = word.meanings.map((m, idx) => {
                    const ex = m.examples && m.examples[0];
                    const posTag = m.partOfSpeech ? `<span class="pos-tag">${m.partOfSpeech}</span>` : '';
                    return `
                        <div class="word-meaning-item">
                            <div class="meaning-line">
                                <span class="meaning-number">${idx + 1}.</span>
                                <span class="meaning-text">${m.meaning}</span>
                                ${posTag}
                            </div>
                            ${ex && ex.sentence ? `
                                <div class="word-example">
                                    <div class="example-sentence">${highlightWord(ex.sentence, word.word)}<button class="tts-btn-small" onclick="event.stopPropagation(); VocabData.speak('${ex.sentence.replace(/'/g, "\\'").replace(/\*\*/g, '')}', '${word.lang || 'en-US'}')" title="예문 듣기"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button></div>
                                    ${ex.translation ? `<div class="word-translation">${ex.translation}</div>` : ''}
                                </div>` : ''}
                        </div>
                    `;
                }).join('');
            }
        } else {
            // Fallback for old structure (meaning string + examples array)
            const example = word.examples && word.examples[0] ? word.examples[0].sentence : '';
            const translation = word.examples && word.examples[0] ? word.examples[0].translation : '';
            const posTag = word.partOfSpeech ? `<span class="pos-tag">${word.partOfSpeech}</span>` : '';
            meaningsHtml = `
                <div class="word-meaning">${word.meaning} ${posTag}</div>
                ${example ? `
                    <div class="word-example">
                        <div class="example-sentence">${highlightWord(example, word.word)}<button class="tts-btn-small" onclick="event.stopPropagation(); VocabData.speak('${example.replace(/'/g, "\\'").replace(/\*\*/g, '')}', '${word.lang || 'en-US'}')" title="예문 듣기"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button></div>
                        ${translation ? `<div class="word-translation">${translation}</div>` : ''}
                    </div>` : ''}
            `;
        }

        const wordOnlyClass = currentViewMode === 'word-only' ? 'word-only-mode' : '';
        const wordOnlyBtns = currentViewMode === 'word-only' ? `
            <div class="word-only-btns">
                <button class="toggle-meaning-btn" onclick="toggleMeaning('${word.id}')">뜻</button>
                <button class="toggle-fullinfo-btn" onclick="toggleFullInfo('${word.id}')">전체</button>
            </div>
        ` : '';

        return `
            <div class="word-item ${wordOnlyClass}" data-id="${word.id}">
                <div class="word-status ${status}" onclick="toggleWordStatus('${word.id}')" title="클릭하여 상태 변경"></div>
                <div class="word-content">
                    <div class="word-main">
                        <span class="word-text">${word.word}</span>
                        <button class="tts-btn-small" onclick="event.stopPropagation(); VocabData.speak('${word.word.replace(/'/g, "\\'")}', '${word.lang || 'en-US'}')" title="발음 듣기"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>
                        ${showPronunciation && word.pronunciation ? `<span class="word-pronunciation">/${word.pronunciation}/</span>` : ''}
                    </div>
                    <div class="word-info">
                        ${meaningsHtml}
                    </div>
                </div>
                <div class="word-actions">
                    ${wordOnlyBtns}
                    <button class="word-action-btn ${status === 'memorized' ? 'active memorized' : ''}" onclick="markMemorized('${word.id}')" title="암기 완료">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <button class="word-action-btn ${status === 'learning' ? 'active learning' : ''}" onclick="markLearning('${word.id}')" title="학습 중">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Setup infinite scroll listener
function setupInfiniteScroll() {
    scrollHandler = function() {
        if (isLoadingMore) return;
        if (currentView !== 'list-view') return;

        const displayMode = Storage.settings.displayMode || 'paging';
        if (displayMode !== 'all') return;

        // Check if we're near the bottom (300px from bottom)
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 300) {
            loadMoreWords();
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
}

// Load more words for infinite scroll
function loadMoreWords() {
    if (isLoadingMore) return;
    if (loadedItemsCount >= filteredWords.length) return;

    isLoadingMore = true;

    // Update indicator to show loading
    const indicator = document.getElementById('load-more-indicator');
    if (indicator) {
        indicator.innerHTML = '<span class="load-more-text">로딩 중...</span>';
    }

    // Small delay for smooth UX
    setTimeout(() => {
        const container = document.getElementById('word-list');
        const startIndex = loadedItemsCount;
        const endIndex = Math.min(startIndex + itemsPerLoad, filteredWords.length);
        const newWords = filteredWords.slice(startIndex, endIndex);

        // Remove indicator before adding new items
        if (indicator) {
            indicator.remove();
        }

        // Append new word items
        container.insertAdjacentHTML('beforeend', renderWordItems(newWords));

        loadedItemsCount = endIndex;

        // Add new indicator if there are more words
        if (loadedItemsCount < filteredWords.length) {
            container.insertAdjacentHTML('beforeend', `
                <div id="load-more-indicator" class="load-more-indicator">
                    <span class="load-more-text">스크롤하여 더 보기 (${loadedItemsCount}/${filteredWords.length})</span>
                </div>
            `);
        }

        isLoadingMore = false;
    }, 100);
}

function renderPagination() {
    const container = document.getElementById('pagination');
    const displayMode = Storage.settings.displayMode || 'paging';

    // 전체 표시 모드일 때는 페이지네이션 숨김
    if (displayMode === 'all') {
        container.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(filteredWords.length / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    if (currentPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">&lt;</button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">&gt;</button>`;
    }

    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderWordList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shuffleList() {
    filteredWords = filteredWords.sort(() => Math.random() - 0.5);
    currentPage = 1;
    renderWordList();
    showToast('단어 목록이 섞였습니다');
}

function refreshWordList() {
    const status = document.getElementById('status-select').value;
    currentPage = 1;
    filterWords(status);
    showToast('목록이 새로고침되었습니다');
}

function changeViewMode(mode) {
    currentViewMode = mode;
    saveWordListSettings('viewMode', mode);
    // Preserve loaded items count when just changing view mode
    renderWordList(true);
}

function toggleMeaning(wordId) {
    const wordItem = document.querySelector(`.word-item[data-id="${wordId}"]`);
    if (wordItem) {
        wordItem.classList.remove('full-info-visible');
        wordItem.classList.toggle('meaning-visible');
    }
}

function toggleFullInfo(wordId) {
    const wordItem = document.querySelector(`.word-item[data-id="${wordId}"]`);
    if (wordItem) {
        wordItem.classList.remove('meaning-visible');
        wordItem.classList.toggle('full-info-visible');
    }
}

function toggleWordStatus(wordId) {
    const newStatus = Storage.toggleStatus(wordId);
    const wordItem = document.querySelector(`[data-id="${wordId}"]`);

    if (wordItem) {
        // Update status indicator
        const statusElement = wordItem.querySelector('.word-status');
        if (statusElement) {
            statusElement.className = `word-status ${newStatus}`;
        }

        // Update action buttons
        const memorizedBtn = wordItem.querySelectorAll('.word-action-btn')[0];
        const learningBtn = wordItem.querySelectorAll('.word-action-btn')[1];

        // Reset both buttons
        memorizedBtn?.classList.remove('active', 'memorized');
        learningBtn?.classList.remove('active', 'learning');

        // Set active state based on new status
        if (newStatus === 'memorized') {
            memorizedBtn?.classList.add('active', 'memorized');
        } else if (newStatus === 'learning') {
            learningBtn?.classList.add('active', 'learning');
        }
    }
    renderProgress();
}

function markMemorized(wordId) {
    const currentStatus = Storage.getWordStatus(wordId);
    const wordItem = document.querySelector(`[data-id="${wordId}"]`);

    if (currentStatus === 'memorized') {
        // Toggle off - set to new
        Storage.markNew(wordId);
        if (wordItem) {
            wordItem.querySelector('.word-status').className = 'word-status new';
            wordItem.querySelector('.word-action-btn.memorized')?.classList.remove('active', 'memorized');
        }
        showToast('새 단어로 표시했습니다');
    } else {
        // Set to memorized
        Storage.markMemorized(wordId);
        if (wordItem) {
            wordItem.querySelector('.word-status').className = 'word-status memorized';
            wordItem.querySelector('.word-action-btn.learning')?.classList.remove('active', 'learning');
            const memorizedBtn = wordItem.querySelectorAll('.word-action-btn')[0];
            memorizedBtn?.classList.add('active', 'memorized');
        }
        showToast('암기 완료로 표시했습니다');
    }
    renderProgress();
}

function markLearning(wordId) {
    const currentStatus = Storage.getWordStatus(wordId);
    const wordItem = document.querySelector(`[data-id="${wordId}"]`);

    if (currentStatus === 'learning') {
        // Toggle off - set to new
        Storage.markNew(wordId);
        if (wordItem) {
            wordItem.querySelector('.word-status').className = 'word-status new';
            wordItem.querySelector('.word-action-btn.learning')?.classList.remove('active', 'learning');
        }
        showToast('새 단어로 표시했습니다');
    } else {
        // Set to learning
        Storage.markLearning(wordId);
        if (wordItem) {
            wordItem.querySelector('.word-status').className = 'word-status learning';
            wordItem.querySelector('.word-action-btn.memorized')?.classList.remove('active', 'memorized');
            const learningBtn = wordItem.querySelectorAll('.word-action-btn')[1];
            learningBtn?.classList.add('active', 'learning');
        }
        showToast('학습 중으로 표시했습니다');
    }
    renderProgress();
}

// Flashcard functions
function initFlashcards() {
    let words = VocabData.getWordsByCategory(currentCategory);

    // Apply language filter when viewing 'all' categories
    if (currentCategory === 'all') {
        words = applyLanguageFilter(words);
    }

    if (words.length === 0) {
        words = applyLanguageFilter(VocabData.allWords);
    }

    // Apply status filter
    const statusFilter = document.getElementById('flashcard-status-filter')?.value || 'all';
    flashcardWords = filterWordsByStatus(words, statusFilter);

    flashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
}

function filterFlashcardsByStatus() {
    const status = document.getElementById('flashcard-status-filter')?.value || 'all';
    saveFlashcardSettings('statusFilter', status);
    initFlashcards();
}

function filterWordsByStatus(words, status) {
    if (status === 'all') return words;
    return words.filter(word => Storage.getWordStatus(word.id) === status);
}

function updateFlashcard() {
    const card = document.getElementById('flashcard');

    // Clear all content first (show blank)
    document.getElementById('fc-word').textContent = '';
    document.getElementById('fc-pronunciation').textContent = '';
    document.getElementById('fc-meaning').textContent = '';
    document.getElementById('fc-example').innerHTML = '';
    document.getElementById('fc-translation').textContent = '';

    // Instantly flip to front without animation
    card.classList.add('no-animation');
    card.classList.remove('flipped');

    // Force reflow to apply no-animation immediately
    card.offsetHeight;

    // Remove no-animation class after a brief moment
    requestAnimationFrame(() => {
        card.classList.remove('no-animation');
        // Load new content
        updateFlashcardContent();
    });
}

// Check if flashcard content fits within card
// Calculate optimal meaning count and font size based on text length
function calculateMeaningDisplay(meanings) {
    if (!meanings || meanings.length === 0) return { count: 0, fontSize: 22 };

    // Try different meaning counts and find optimal display
    for (let count = Math.min(meanings.length, 4); count >= 1; count--) {
        const displayMeanings = meanings.slice(0, count);
        let totalLength = 0;

        for (const m of displayMeanings) {
            totalLength += (m.meaning || '').length;
            if (m.partOfSpeech) totalLength += m.partOfSpeech.length + 3; // [pos]
            totalLength += 5; // numbering and spacing
        }

        // Determine font size for this length
        let fontSize;
        if (totalLength > 200) {
            fontSize = 10;
        } else if (totalLength > 150) {
            fontSize = 12;
        } else if (totalLength > 120) {
            fontSize = 14;
        } else if (totalLength > 90) {
            fontSize = 16;
        } else if (totalLength > 60) {
            fontSize = 18;
        } else if (totalLength > 40) {
            fontSize = 20;
        } else {
            fontSize = 22;
        }

        // If font size is acceptable (>= 12px), use this count
        if (fontSize >= 12) {
            return { count, fontSize };
        }
    }

    // Fallback: show 1 meaning with smallest readable font
    const singleLength = (meanings[0].meaning || '').length;
    let fontSize = 22;
    if (singleLength > 150) fontSize = 10;
    else if (singleLength > 120) fontSize = 12;
    else if (singleLength > 90) fontSize = 14;
    else if (singleLength > 60) fontSize = 16;
    else if (singleLength > 40) fontSize = 18;
    else if (singleLength > 25) fontSize = 20;

    return { count: 1, fontSize };
}

// Apply font size to meaning element
function adjustFlashcardFontSize(meaningEl, fontSize) {
    if (!meaningEl) return;
    meaningEl.style.fontSize = (fontSize || 22) + 'px';
}

// Adjust blink mode font size to fit content
function adjustBlinkFontSize(wordEl, meaningEl) {
    const container = wordEl.closest('.blink-display');
    if (!container) return;

    // Reset to default size first
    wordEl.style.fontSize = '';
    if (meaningEl) meaningEl.style.fontSize = '';

    const maxWidth = container.clientWidth - 96; // Account for padding
    const maxHeight = container.clientHeight * 0.4; // Use 40% of container height

    // Font sizes to try for word element (from large to small)
    const fontSizes = [64, 48, 40, 36, 32, 28, 24, 20, 18];

    for (const size of fontSizes) {
        wordEl.style.fontSize = size + 'px';
        // Check both width and height
        if (wordEl.scrollWidth <= maxWidth && wordEl.scrollHeight <= maxHeight) {
            break;
        }
    }

    // Also adjust meaning element if it has content
    if (meaningEl && meaningEl.innerHTML) {
        const meaningFontSizes = [32, 28, 24, 20, 18, 16, 14, 12];
        const meaningMaxHeight = container.clientHeight * 0.25; // 25% for meaning
        for (const size of meaningFontSizes) {
            meaningEl.style.fontSize = size + 'px';
            if (meaningEl.scrollWidth <= maxWidth && meaningEl.scrollHeight <= meaningMaxHeight) {
                break;
            }
        }
    }
}

function updateFlashcardContent() {
    if (flashcardWords.length === 0) return;

    const word = flashcardWords[flashcardIndex];
    document.getElementById('fc-word').textContent = word.word;
    document.getElementById('fc-pronunciation').textContent = word.pronunciation ? `/${word.pronunciation}/` : '';

    const meaningEl = document.getElementById('fc-meaning');
    const exampleEl = document.getElementById('fc-example');
    const translationEl = document.getElementById('fc-translation');
    const exampleTTSBtn = document.getElementById('fc-example-tts');

    // Find first example from meanings (lowest number priority)
    let firstExample = null;
    if (word.meanings && word.meanings.length > 0) {
        for (const m of word.meanings) {
            if (m.examples && m.examples.length > 0 && m.examples[0].sentence) {
                firstExample = m.examples[0];
                break;
            }
        }
    } else if (word.examples && word.examples[0]) {
        firstExample = word.examples[0];
    }

    // Enable/disable example TTS button
    if (exampleTTSBtn) {
        exampleTTSBtn.disabled = !firstExample;
        exampleTTSBtn.style.opacity = firstExample ? '1' : '0.3';
    }

    if (word.meanings && word.meanings.length > 0) {
        // Calculate optimal display based on text length
        const { count, fontSize } = calculateMeaningDisplay(word.meanings);
        const displayMeanings = word.meanings.slice(0, count);

        // Build meaning HTML
        if (displayMeanings.length > 1) {
            meaningEl.innerHTML = displayMeanings.map((m, idx) => {
                const pos = m.partOfSpeech ? `<span class="fc-pos">[${m.partOfSpeech}]</span>` : '';
                return `<span class="fc-meaning-item"><span class="fc-meaning-num">${idx + 1}.</span>${pos} ${m.meaning}</span>`;
            }).join('');
        } else {
            const m = displayMeanings[0];
            const pos = m.partOfSpeech ? `[${m.partOfSpeech}] ` : '';
            meaningEl.textContent = pos + m.meaning;
        }

        // Apply calculated font size
        adjustFlashcardFontSize(meaningEl, fontSize);

        // Show single example (first one with lowest meaning number)
        if (firstExample) {
            exampleEl.innerHTML = highlightWord(firstExample.sentence, word.word);
            translationEl.textContent = firstExample.translation || '';
        } else {
            exampleEl.innerHTML = '';
            translationEl.textContent = '';
        }
    } else {
        // Fallback for old structure
        const pos = word.partOfSpeech ? `[${word.partOfSpeech}] ` : '';
        meaningEl.textContent = pos + (word.meaning || '');
        if (firstExample) {
            exampleEl.innerHTML = highlightWord(firstExample.sentence, word.word);
            translationEl.textContent = firstExample.translation || '';
        } else {
            exampleEl.innerHTML = '';
            translationEl.textContent = '';
        }
    }

    // Auto TTS for flashcard
    if (flashcardAutoTTS) {
        VocabData.speak(word.word, word.lang || 'en-US');
    }
}

function updateFlashcardProgress() {
    document.getElementById('flashcard-current').textContent = flashcardIndex + 1;
    document.getElementById('flashcard-total').textContent = flashcardWords.length;
}

function flipCard() {
    const card = document.getElementById('flashcard');
    if (!flashcardAnimation) {
        card.classList.add('no-animation');
    } else {
        card.classList.remove('no-animation');
    }
    card.classList.toggle('flipped');
}

function nextCard() {
    if (flashcardIndex < flashcardWords.length - 1) {
        flashcardIndex++;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function prevCard() {
    if (flashcardIndex > 0) {
        flashcardIndex--;
        updateFlashcard();
        updateFlashcardProgress();
    }
}

function markKnown() {
    if (flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    Storage.markMemorized(word.id);
    showToast('암기 완료!');
    nextCard();
}

function markUnknown() {
    if (flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    Storage.markLearning(word.id);
    showToast('학습 중으로 표시했습니다');
    nextCard();
}

function shuffleFlashcards() {
    flashcardWords = flashcardWords.sort(() => Math.random() - 0.5);
    flashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
    showToast('카드가 섞였습니다');
}

function resetFlashcards() {
    flashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
}

// Blink mode functions
function toggleBlinkAlternateOptions() {
    const displayMode = document.getElementById('blink-display').value;
    const alternateOptions = document.getElementById('blink-alternate-options');
    if (displayMode === 'alternate') {
        alternateOptions.classList.remove('hidden');
    } else {
        alternateOptions.classList.add('hidden');
    }
}

function startBlink() {
    const speed = parseInt(document.getElementById('blink-speed').value);
    const displayMode = document.getElementById('blink-display').value;
    const statusFilter = document.getElementById('blink-status-filter')?.value || 'all';
    blinkAutoTTS = document.getElementById('blink-auto-tts')?.checked ?? true;
    blinkRepeatCount = parseInt(document.getElementById('blink-repeat-count')?.value || '2');

    let words = VocabData.getWordsByCategory(currentCategory);

    // Apply language filter when viewing 'all' categories
    if (currentCategory === 'all') {
        words = applyLanguageFilter(words);
    }

    if (words.length === 0) {
        words = applyLanguageFilter(VocabData.allWords);
    }

    // Apply status filter
    blinkWords = filterWordsByStatus(words, statusFilter);
    if (blinkWords.length === 0) {
        showToast('선택한 상태의 단어가 없습니다');
        return;
    }
    blinkWords = blinkWords.sort(() => Math.random() - 0.5);
    blinkIndex = 0;
    blinkAlternatePhase = 0;
    blinkRepeatCurrent = 0;

    document.querySelector('.blink-settings').classList.add('hidden');
    document.getElementById('blink-display-area').classList.remove('hidden');

    // 블링크 시작 시 히스토리 추가 (뒤로가기로 설정창 복귀 지원)
    if (window.history && window.history.pushState) {
        window.history.pushState({ page: 'app', view: 'blink-running' }, '', '');
    }

    showBlinkWord(displayMode);

    // Set up interval based on display mode
    if (displayMode === 'alternate') {
        // Alternate mode: show word then meaning
        blinkInterval = setInterval(() => {
            blinkAlternatePhase++;
            if (blinkAlternatePhase > 1) {
                // Finished showing word and meaning once
                blinkAlternatePhase = 0;
                blinkRepeatCurrent++;
                if (blinkRepeatCurrent >= blinkRepeatCount) {
                    // Move to next word
                    blinkRepeatCurrent = 0;
                    blinkIndex++;
                    if (blinkIndex >= blinkWords.length) {
                        blinkIndex = 0;
                    }
                }
            }
            showBlinkWord(displayMode);
        }, speed);
    } else {
        blinkInterval = setInterval(() => {
            blinkIndex++;
            if (blinkIndex >= blinkWords.length) {
                blinkIndex = 0;
            }
            showBlinkWord(displayMode);
        }, speed);
    }

    // Progress bar animation
    const progressBar = document.getElementById('blink-progress');
    progressBar.style.transition = `width ${speed}ms linear`;

    // Clear existing progress interval if any
    if (blinkProgressInterval) {
        clearInterval(blinkProgressInterval);
    }

    blinkProgressInterval = setInterval(() => {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }, speed);
}

function showBlinkWord(displayMode) {
    const word = blinkWords[blinkIndex];
    const wordEl = document.getElementById('blink-word');
    const meaningEl = document.getElementById('blink-meaning');
    // Limit to 2 meanings for blink mode
    const formattedMeaningHtml = formatMeaningWithPos(word, true, 2);

    wordEl.style.animation = 'none';
    meaningEl.style.animation = 'none';

    void wordEl.offsetWidth; // Trigger reflow

    wordEl.style.animation = 'fadeInUp 0.3s ease';
    meaningEl.style.animation = 'fadeInUp 0.3s ease 0.1s both';

    const wordLang = word.lang || 'en-US';
    if (displayMode === 'word') {
        wordEl.textContent = word.word;
        meaningEl.innerHTML = '';
        // Auto TTS for word mode
        if (blinkAutoTTS) {
            VocabData.speak(word.word, wordLang);
        }
    } else if (displayMode === 'meaning') {
        wordEl.innerHTML = formattedMeaningHtml;
        meaningEl.innerHTML = '';
    } else if (displayMode === 'alternate') {
        // Alternate mode: show word or meaning based on phase
        if (blinkAlternatePhase === 0) {
            // Show word
            wordEl.textContent = word.word;
            meaningEl.textContent = `(${blinkRepeatCurrent + 1}/${blinkRepeatCount})`;
            // Auto TTS when showing word
            if (blinkAutoTTS) {
                VocabData.speak(word.word, wordLang);
            }
        } else {
            // Show meaning
            wordEl.innerHTML = formattedMeaningHtml;
            meaningEl.textContent = word.word;
        }
    } else {
        // both mode
        wordEl.textContent = word.word;
        meaningEl.innerHTML = formattedMeaningHtml;
        // Auto TTS for both mode
        if (blinkAutoTTS) {
            VocabData.speak(word.word, wordLang);
        }
    }

    // Adjust font size for long text
    adjustBlinkFontSize(wordEl, meaningEl);
}

function stopBlink() {
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }
    if (blinkProgressInterval) {
        clearInterval(blinkProgressInterval);
        blinkProgressInterval = null;
    }
    document.querySelector('.blink-settings').classList.remove('hidden');
    document.getElementById('blink-display-area').classList.add('hidden');

    Storage.recordStudySession(blinkIndex + 1);
}

// Quiz functions
function startQuiz() {
    const count = parseInt(document.getElementById('quiz-count').value);
    const type = document.getElementById('quiz-type').value;
    const statusFilter = document.getElementById('quiz-status-filter')?.value || 'all';

    let words = VocabData.getWordsByCategory(currentCategory);

    // Apply language filter when viewing 'all' categories
    if (currentCategory === 'all') {
        words = applyLanguageFilter(words);
    }

    if (words.length === 0) {
        words = applyLanguageFilter(VocabData.allWords);
    }

    // Apply status filter
    words = filterWordsByStatus(words, statusFilter);
    if (words.length === 0) {
        showToast('선택한 상태의 단어가 없습니다');
        return;
    }

    // Shuffle and take required count
    words = words.sort(() => Math.random() - 0.5).slice(0, count);

    quizQuestions = words.map(word => {
        const questionType = type === 'mixed' ? (Math.random() > 0.5 ? 'meaning' : 'word') : type;
        // Use random single meaning for quiz
        const formattedMeaningHtml = getRandomMeaning(word, true);
        const formattedMeaning = getRandomMeaning(word, false);

        // Get wrong options
        const wrongWords = VocabData.allWords
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        let question, answer, options, questionHtml, optionsHtml;

        if (questionType === 'meaning') {
            question = word.word;
            questionHtml = word.word;
            answer = formattedMeaning;
            // Create paired options with random single meaning and shuffle together
            const pairedOptions = [
                { text: formattedMeaning, html: formattedMeaningHtml },
                ...wrongWords.map(w => ({ text: getRandomMeaning(w, false), html: getRandomMeaning(w, true) }))
            ].sort(() => Math.random() - 0.5);
            options = pairedOptions.map(p => p.text);
            optionsHtml = pairedOptions.map(p => p.html);
        } else {
            question = formattedMeaning;
            questionHtml = formattedMeaningHtml;
            answer = word.word;
            options = [word.word, ...wrongWords.map(w => w.word)].sort(() => Math.random() - 0.5);
            optionsHtml = options;
        }

        return { question, questionHtml, answer, options, optionsHtml, word };
    });

    quizIndex = 0;
    quizScore = 0;

    document.getElementById('quiz-settings').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-total').textContent = quizQuestions.length;

    // 퀴즈 시작 시 히스토리 추가 (뒤로가기로 설정창 복귀 지원)
    if (window.history && window.history.pushState) {
        window.history.pushState({ page: 'app', view: 'quiz-running' }, '', '');
    }

    showQuizQuestion();
}

function showQuizQuestion() {
    const q = quizQuestions[quizIndex];

    document.getElementById('quiz-current').textContent = quizIndex + 1;
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-question').innerHTML = q.questionHtml || q.question;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = q.options.map((opt, i) => {
        const optHtml = q.optionsHtml ? q.optionsHtml[i] : opt;
        return `<button class="quiz-option" data-value="${opt.replace(/"/g, '&quot;')}" onclick="selectQuizOption(this)">${optHtml}</button>`;
    }).join('');

    document.getElementById('quiz-feedback').classList.add('hidden');
}

function selectQuizOption(button) {
    const q = quizQuestions[quizIndex];
    const selected = button.dataset.value;
    const isCorrect = selected === q.answer;

    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.disabled = true;
        if (opt.dataset.value === q.answer) {
            opt.classList.add('correct');
        } else if (opt === button && !isCorrect) {
            opt.classList.add('wrong');
        }
    });

    // Show feedback
    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
        quizScore++;
        feedback.textContent = '정답입니다!';
        feedback.className = 'quiz-feedback correct';
        Storage.markMemorized(q.word.id);
    } else {
        feedback.textContent = `오답입니다. 정답: ${q.answer}`;
        feedback.className = 'quiz-feedback wrong';
        Storage.markLearning(q.word.id);
    }
    feedback.classList.remove('hidden');

    // Next question after delay
    setTimeout(() => {
        quizIndex++;
        if (quizIndex < quizQuestions.length) {
            showQuizQuestion();
        } else {
            showQuizResult();
        }
    }, 1500);
}

function showQuizResult() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    document.getElementById('result-correct').textContent = quizScore;
    document.getElementById('result-total').textContent = quizQuestions.length;

    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    document.getElementById('result-percentage').textContent = percentage + '%';

    Storage.recordStudySession(quizQuestions.length);
}

function retryQuiz() {
    document.getElementById('quiz-settings').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
}

// Settings functions
async function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    const loadingOverlay = document.getElementById('settings-loading');

    modal.classList.toggle('hidden');

    // Update displays when opening settings
    if (!modal.classList.contains('hidden')) {
        // Show loading spinner
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 10));

        try {
            updateLastBackupDateDisplay();
            loadDebugModeSettings();
            loadTTSSpeedSetting();     // TTS 속도 설정 로드
            updateCompressionStats();  // 압축률 통계 실시간 업데이트
            updateStorageUsage();      // 저장소 사용량 실시간 업데이트
        } finally {
            // Hide loading spinner
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }
    }
}

function toggleDarkMode() {
    const isDark = document.getElementById('dark-mode-toggle').checked;
    Storage.settings.darkMode = isDark;
    Storage.saveSettings();

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function togglePronunciation() {
    Storage.settings.showPronunciation = document.getElementById('pronunciation-toggle').checked;
    Storage.saveSettings();

    if (currentView === 'list-view') {
        renderWordList();
    }
}

function exportData() {
    showWordLoading('데이터 내보내기 중...');
    setTimeout(() => {
        Storage.exportData();
        hideWordLoading();
        showToast('데이터를 내보냈습니다');
    }, 100);
}

function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const isLzstr = file.name.toLowerCase().endsWith('.lzstr');
    showGlobalLoading('데이터 분석 중...');

    const reader = new FileReader();
    reader.onload = (e) => {
        let jsonData = e.target.result;

        // .lzstr 파일이면 압축 해제
        if (isLzstr) {
            try {
                if (typeof LZString === 'undefined') {
                    hideGlobalLoading();
                    showToast('압축 해제 라이브러리가 로드되지 않았습니다');
                    return;
                }
                jsonData = LZString.decompressFromUTF16(e.target.result);
                if (!jsonData) {
                    hideGlobalLoading();
                    showToast('압축 해제 실패');
                    return;
                }
            } catch (err) {
                hideGlobalLoading();
                console.error('Decompress error:', err);
                showToast('압축 해제 중 오류 발생');
                return;
            }
        }

        // 실제 압축 크기로 용량 체크 (메모리에서 병합 시뮬레이션)
        const recoveryCheck = Storage.prepareDataRecovery(jsonData);
        hideGlobalLoading();

        if (!recoveryCheck.canRecover) {
            showToast(recoveryCheck.message);
            event.target.value = '';
            return;
        }

        // 병합 데이터 저장 및 확인 모달 표시
        pendingRecoveryData = recoveryCheck.mergedData;

        // 용량 정보 표시
        const capacityInfo = document.getElementById('recovery-capacity-info');
        if (capacityInfo) {
            capacityInfo.innerHTML = `예상 저장소 사용량: <strong>${recoveryCheck.estimatedPercent.toFixed(1)}%</strong>`;
        }

        // 데이터 복구 확인 모달 표시
        document.getElementById('data-recovery-modal').classList.remove('hidden');
    };
    reader.readAsText(file);

    event.target.value = '';
}

// 데이터 복구 취소
function cancelDataRecovery() {
    pendingRecoveryData = null;
    document.getElementById('data-recovery-modal').classList.add('hidden');
    showToast('복구가 취소되었습니다');
}

// 백업 없이 복구 진행
function proceedRecoveryWithoutBackup() {
    document.getElementById('data-recovery-modal').classList.add('hidden');

    if (!pendingRecoveryData) {
        showToast('복구 데이터가 없습니다');
        return;
    }

    showGlobalLoading('데이터 복구 중...');

    setTimeout(() => {
        const result = Storage.executeDataRecovery(pendingRecoveryData);
        pendingRecoveryData = null;

        hideGlobalLoading();

        if (result && result.success) {
            VocabData.reloadCustomCategories();
            showToast('데이터를 성공적으로 복구했습니다');
            renderCategories();
            renderProgress();
            if (currentView === 'list-view') {
                filterWords();
            }
            updateCompressionStats();
            updateStorageUsage();
        } else {
            showToast(result?.error || '데이터 복구 실패');
        }
    }, 100);
}

// 백업 후 복구 진행
function proceedRecoveryWithBackup() {
    showGlobalLoading('백업 파일 생성 중...');

    setTimeout(() => {
        try {
            const { blob, filename } = Storage.createBackupBlob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);

            hideGlobalLoading();
            showToast('백업 파일이 다운로드되었습니다');

            // 백업 후 복구 진행
            proceedRecoveryWithoutBackup();
        } catch (err) {
            hideGlobalLoading();
            console.error('Backup error:', err);
            showToast('백업 생성 중 오류 발생');
        }
    }, 100);
}

// Export custom categories - show selection modal
function exportCustomCategories() {
    if (Storage.customCategories.length === 0) {
        showToast('내보낼 사용자 카테고리가 없습니다');
        return;
    }

    // Populate category list
    const listContainer = document.getElementById('export-category-list');
    listContainer.innerHTML = Storage.customCategories.map(cat => `
        <label class="export-category-item" data-id="${cat.id}">
            <input type="checkbox" class="export-category-checkbox" value="${cat.id}">
            <span class="category-icon">${cat.icon || '📁'}</span>
            <div class="export-category-info">
                <div class="export-category-name">${cat.name}</div>
                <div class="export-category-count">${cat.words?.length || 0}개 단어</div>
            </div>
        </label>
    `).join('');

    // Reset select all checkbox
    document.getElementById('export-select-all').checked = false;

    // Show modal
    document.getElementById('export-categories-modal').classList.remove('hidden');
}

function closeExportCategoriesModal() {
    document.getElementById('export-categories-modal').classList.add('hidden');
}

function toggleExportSelectAll() {
    const selectAll = document.getElementById('export-select-all').checked;
    document.querySelectorAll('.export-category-checkbox').forEach(cb => {
        cb.checked = selectAll;
    });
}

function confirmExportCategories() {
    const selectedIds = Array.from(document.querySelectorAll('.export-category-checkbox:checked'))
        .map(cb => cb.value);

    if (selectedIds.length === 0) {
        showToast('내보낼 카테고리를 선택하세요');
        return;
    }

    showWordLoading('카테고리 내보내기 중...');

    setTimeout(() => {
        const selectedCategories = Storage.customCategories.filter(cat => selectedIds.includes(cat.id));

        const exportData = {
            type: 'vocabmaster_custom_categories',
            version: Version.CURRENT,
            exportDate: new Date().toISOString(),
            categories: selectedCategories.map(cat => ({
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                lang: cat.lang || 'en-US',
                words: (cat.words || []).map(word => ({
                    word: word.word,
                    pronunciation: word.pronunciation || '',
                    meanings: word.meanings || [],
                    meaning: word.meaning || ''
                }))
            }))
        };

        const dateStr = new Date().toISOString().split('T')[0];
        let blob, filename;

        if (Storage.settings.compression?.enabled && typeof LZString !== 'undefined') {
            // 압축 모드: LZ-String으로 압축하여 .lzstr로 내보내기
            const compressed = LZString.compressToUTF16(JSON.stringify(exportData));
            blob = new Blob([compressed], { type: 'application/octet-stream' });
            filename = `vocabmaster_categories_${dateStr}.lzstr`;
        } else {
            // 일반 모드: JSON으로 내보내기 (공백 제거)
            blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
            filename = `vocabmaster_categories_${dateStr}.json`;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        closeExportCategoriesModal();
        hideWordLoading();
        showToast(`${selectedCategories.length}개의 카테고리를 내보냈습니다`);
    }, 100);
}

// Trigger import file dialog
function triggerImportCustomCategories() {
    document.getElementById('import-custom-categories-file').click();
}

// Handle custom categories import (bulk import)
function handleImportCustomCategories(event) {
    const file = event.target.files[0];
    if (!file) return;

    const isLzstr = file.name.toLowerCase().endsWith('.lzstr');
    showGlobalLoading('단어장 분석 중...');

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let jsonData = e.target.result;

            // .lzstr 파일이면 압축 해제
            if (isLzstr) {
                if (typeof LZString === 'undefined') {
                    hideGlobalLoading();
                    showToast('압축 해제 라이브러리가 로드되지 않았습니다');
                    return;
                }
                jsonData = LZString.decompressFromUTF16(e.target.result);
                if (!jsonData) {
                    hideGlobalLoading();
                    showToast('압축 해제 실패');
                    return;
                }
            }

            const data = JSON.parse(jsonData);

            // Validate file format
            if (data.type !== 'vocabmaster_custom_categories' || !data.categories) {
                hideGlobalLoading();
                showToast('올바른 카테고리 공유 파일이 아닙니다');
                return;
            }

            // 실제 압축 크기로 용량 체크 (메모리에서 병합 시뮬레이션)
            const importCheck = Storage.prepareSharedCategoryImport(data.categories);
            hideGlobalLoading();

            if (!importCheck.canImport) {
                showToast(importCheck.message);
                return;
            }

            if (importCheck.newCategories.length === 0) {
                showToast(`모든 카테고리가 동일 이름으로 건너뛰어졌습니다 (${importCheck.skippedCount}개)`);
                return;
            }

            // 일괄 저장 실행
            showGlobalLoading('단어장 가져오는 중...');

            setTimeout(() => {
                const result = Storage.executeSharedCategoryImport(
                    importCheck.mergedCategories,
                    importCheck.newCategories
                );

                hideGlobalLoading();

                if (result.success) {
                    VocabData.reloadCustomCategories();
                    renderCategories();
                    renderProgress();
                    updateStorageUsage();
                    updateCompressionStats();

                    if (importCheck.skippedCount > 0) {
                        showToast(`${result.importedCount}개 카테고리 가져옴, ${importCheck.skippedCount}개 동일 이름으로 건너뜀`);
                    } else {
                        showToast(`${result.importedCount}개 카테고리, ${result.wordCount}개 단어를 가져왔습니다`);
                    }
                } else {
                    showToast(result.error || '카테고리 가져오기 실패');
                }
            }, 100);

        } catch (err) {
            hideGlobalLoading();
            console.error('Import error:', err);
            showToast('파일을 읽는 중 오류가 발생했습니다');
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

function resetAllData() {
    if (confirm('정말 모든 학습 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        Storage.resetAll();
        showToast('학습 기록이 초기화되었습니다');
        // Reload page to ensure clean state
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}

// Settings reset function
function resetSettings() {
    if (confirm('설정을 기본값으로 초기화하시겠습니까?\n\n(학습 기록과 단어장은 유지됩니다)')) {
        Storage.resetSettings();
        showToast('설정이 초기화되었습니다');
        // Reload page to apply default settings
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}

// Compression toggle function (async for safe migration)
async function toggleCompression() {
    const toggle = document.getElementById('compression-toggle');
    const enableCompression = toggle.checked;

    // 비활성화 시 용량 초과 여부 사전 확인
    if (!enableCompression) {
        const check = Storage.canDisableCompression();
        if (!check.canDisable) {
            toggle.checked = true; // 토글 되돌리기
            showToast(`❌ ${check.message}`, 5000);
            return;
        }
    }

    // Confirm before changing compression
    const confirmMsg = enableCompression
        ? '데이터 압축을 활성화하시겠습니까?\n\n저장 용량이 줄어들지만, 다른 기기에서 데이터를 가져올 때 호환성 문제가 발생할 수 있습니다.'
        : '데이터 압축을 비활성화하시겠습니까?\n\n저장 용량이 늘어나지만, 데이터 호환성이 향상됩니다.';

    if (!confirm(confirmMsg)) {
        // Revert toggle if cancelled
        toggle.checked = !enableCompression;
        return;
    }

    // Migrate existing data (with UI blocking and safety checks)
    const result = await Storage.migrateCompression(enableCompression);

    if (result.success) {
        // Update settings only if migration succeeded
        Storage.settings.compression.enabled = enableCompression;
        Storage.saveSettings();

        // Update compression stats display
        updateCompressionStats();
        updateStorageUsage();

        showToast(enableCompression ? '데이터 압축이 활성화되었습니다' : '데이터 압축이 비활성화되었습니다');
    } else {
        // Revert toggle on failure
        toggle.checked = !enableCompression;
        showToast(`❌ ${result.message}`, 4000);

        // Log details for debugging
        console.error('[Compression] Migration failed:', result);
    }
}

// Update compression stats display
function updateCompressionStats() {
    const statsEl = document.getElementById('compression-stats');
    const infoEl = document.getElementById('compression-info');

    if (!statsEl || !infoEl) return;

    if (Storage.settings.compression?.enabled) {
        const stats = Storage.getCompressionStats();
        statsEl.style.display = 'flex';

        if (stats.ratio > 0) {
            infoEl.textContent = `압축률: ${stats.ratio}% (${stats.totalJsonSize}KB → ${stats.totalStoredSize}KB)`;
        } else if (stats.totalStoredSize > 0) {
            infoEl.textContent = `저장 용량: ${stats.totalStoredSize}KB`;
        } else {
            infoEl.textContent = '압축률: 데이터 없음';
        }
    } else {
        statsEl.style.display = 'none';
    }
}

// Update storage usage display
function updateStorageUsage() {
    const barFill = document.getElementById('storage-bar-fill');
    const textEl = document.getElementById('storage-text');

    if (!barFill || !textEl) return;

    const usage = Storage.getStorageUsage();
    barFill.style.width = `${Math.min(usage.percent, 100)}%`;
    textEl.textContent = `${usage.usedFormatted} / ${usage.totalFormatted}`;

    // 색상 변경 (warning: 70%, danger: 90%)
    barFill.classList.remove('warning', 'danger');
    if (usage.percent >= 90) {
        barFill.classList.add('danger');
    } else if (usage.percent >= 70) {
        barFill.classList.add('warning');
    }
}

// Load compression settings
function loadCompressionSettings() {
    const toggle = document.getElementById('compression-toggle');
    if (toggle) {
        toggle.checked = Storage.settings.compression?.enabled || false;
    }
    updateCompressionStats();
    updateStorageUsage();
}

// Display mode functions
function changeDisplayMode(mode) {
    Storage.settings.displayMode = mode;
    Storage.saveSettings();

    // Show/hide items per page setting
    const itemsPerPageSetting = document.getElementById('items-per-page-setting');
    if (itemsPerPageSetting) {
        itemsPerPageSetting.style.display = mode === 'paging' ? 'flex' : 'none';
    }

    // Re-render word list if currently viewing
    if (currentView === 'list-view') {
        currentPage = 1;
        renderWordList();
    }

    showToast(mode === 'all' ? '전체 표시 모드로 변경됨' : '페이징 모드로 변경됨');
}

function changeItemsPerPage(value) {
    itemsPerPage = parseInt(value);
    Storage.settings.itemsPerPage = itemsPerPage;
    Storage.saveSettings();

    // Re-render word list if currently viewing
    if (currentView === 'list-view') {
        currentPage = 1;
        renderWordList();
    }

    showToast(`페이지당 ${value}개 단어로 변경됨`);
}

function loadDisplaySettings() {
    // Load display mode
    const displayMode = Storage.settings.displayMode || 'paging';
    const displayModeSelect = document.getElementById('display-mode-select');
    if (displayModeSelect) {
        displayModeSelect.value = displayMode;
    }

    // Show/hide items per page setting based on display mode
    const itemsPerPageSetting = document.getElementById('items-per-page-setting');
    if (itemsPerPageSetting) {
        itemsPerPageSetting.style.display = displayMode === 'paging' ? 'flex' : 'none';
    }

    // Load items per page
    itemsPerPage = Storage.settings.itemsPerPage || 20;
    const itemsPerPageSelect = document.getElementById('items-per-page-select');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (currentView === 'flashcard-view') {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipCard();
        } else if (e.key === 'ArrowLeft') {
            prevCard();
        } else if (e.key === 'ArrowRight') {
            nextCard();
        } else if (e.key === '1') {
            markKnown();
        } else if (e.key === '2') {
            markUnknown();
        }
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('search-results');

    if (!searchContainer.contains(e.target)) {
        searchResults.classList.add('hidden');
    }
});

// TTS (Text-to-Speech) functions
function speakCurrentWord() {
    if (flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    VocabData.speak(word.word, word.lang || 'en-US');
}

function speakCurrentExample() {
    if (flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    const lang = word.lang || 'en-US';

    // Check meanings for examples first (new structure)
    if (word.meanings && word.meanings.length > 0) {
        for (const m of word.meanings) {
            if (m.examples && m.examples.length > 0 && m.examples[0].sentence) {
                VocabData.speak(m.examples[0].sentence, lang);
                return;
            }
        }
    }
    // Fallback to old structure
    if (word.examples && word.examples[0]) {
        VocabData.speak(word.examples[0].sentence, lang);
    }
}

function speakWord(text, lang = 'en-US') {
    VocabData.speak(text, lang);
}

// Override initApp to include new settings
const originalInitApp = initApp;
initApp = function() {
    loadDisplaySettings();
    loadBackupReminderSettings();
    loadCompressionSettings();
    originalInitApp();

    // Check backup reminder after a short delay (when not studying)
    setTimeout(checkBackupReminder, 2000);
};

// ============================================
// Backup Reminder Functions
// ============================================

function loadBackupReminderSettings() {
    const settings = Storage.settings.backupReminder || { enabled: true, frequency: 7 };

    const toggle = document.getElementById('backup-reminder-toggle');
    if (toggle) {
        toggle.checked = settings.enabled;
    }

    const select = document.getElementById('backup-frequency-select');
    if (select) {
        select.value = settings.frequency;
    }

    // Show/hide frequency setting based on enabled state
    const frequencySetting = document.getElementById('backup-frequency-setting');
    if (frequencySetting) {
        frequencySetting.style.display = settings.enabled ? 'flex' : 'none';
    }
}

function toggleBackupReminder() {
    const enabled = document.getElementById('backup-reminder-toggle').checked;

    if (!Storage.settings.backupReminder) {
        Storage.settings.backupReminder = { enabled: true, frequency: 7 };
    }
    Storage.settings.backupReminder.enabled = enabled;
    Storage.saveSettings();

    // Show/hide frequency setting
    const frequencySetting = document.getElementById('backup-frequency-setting');
    if (frequencySetting) {
        frequencySetting.style.display = enabled ? 'flex' : 'none';
    }

    showToast(enabled ? '백업 알림이 활성화되었습니다' : '백업 알림이 비활성화되었습니다');
}

function changeBackupFrequency(value) {
    if (!Storage.settings.backupReminder) {
        Storage.settings.backupReminder = { enabled: true, frequency: 7 };
    }
    Storage.settings.backupReminder.frequency = parseInt(value);
    Storage.saveSettings();

    const labels = { 1: '매일', 3: '3일마다', 7: '7일마다', 14: '14일마다', 30: '30일마다' };
    showToast(`백업 알림 주기가 ${labels[value]}로 변경되었습니다`);
}

function checkBackupReminder() {
    // Only show when not in study mode (not in flashcard, blink, or quiz)
    if (currentView === 'flashcard-view' || currentView === 'blink-view' || currentView === 'quiz-view') {
        return;
    }

    if (Storage.shouldShowBackupReminder()) {
        showBackupReminderModal();
    }
}

function showBackupReminderModal() {
    document.getElementById('backup-reminder-modal').classList.remove('hidden');
}

function dismissBackupReminder() {
    document.getElementById('backup-reminder-modal').classList.add('hidden');
}

function performBackupFromReminder() {
    dismissBackupReminder();
    showWordLoading('데이터 백업 중...');
    setTimeout(() => {
        Storage.exportData();
        hideWordLoading();
        showToast('데이터를 백업했습니다');
    }, 100);
}

function updateLastBackupDateDisplay() {
    const dateEl = document.getElementById('last-backup-date');
    if (!dateEl) return;

    const lastBackup = Storage.backupInfo.lastBackupDate;
    if (!lastBackup) {
        dateEl.textContent = '없음';
        return;
    }

    const date = new Date(lastBackup);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    // Format date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    let dateStr = `${year}-${month}-${day} ${hours}:${minutes}`;

    // Add relative time (skip "today" as it becomes inaccurate next day)
    if (diffDays === 1) {
        dateStr += ' (어제)';
    } else if (diffDays < 7) {
        dateStr += ` (${diffDays}일 전)`;
    } else if (diffDays < 30) {
        dateStr += ` (${Math.floor(diffDays / 7)}주 전)`;
    } else {
        dateStr += ` (${Math.floor(diffDays / 30)}개월 전)`;
    }

    dateEl.textContent = dateStr;
}

// ============================================
// Debug Mode Functions (개발자 디버그 모드)
// ============================================

function loadDebugModeSettings() {
    const debugSettings = Storage.settings.debugMode || { enabled: false, showTestPage: false, showArchitecturePage: false };

    // 디버그 모드 토글 체크박스
    const debugToggle = document.getElementById('debug-mode-toggle');
    if (debugToggle) {
        debugToggle.checked = debugSettings.enabled;
    }

    // 디버그 서브 옵션들 (디버그 모드가 켜져있을 때만 표시)
    const debugSubOptions = document.querySelectorAll('.debug-sub-option');
    debugSubOptions.forEach(el => {
        el.classList.toggle('hidden', !debugSettings.enabled);
    });

    // 디버그 링크 섹션
    const debugLinksSection = document.getElementById('debug-links-section');
    if (debugLinksSection) {
        debugLinksSection.classList.toggle('hidden', !debugSettings.enabled);
    }

    // 테스트 페이지 토글
    const testPageToggle = document.getElementById('show-test-page-toggle');
    if (testPageToggle) {
        testPageToggle.checked = debugSettings.showTestPage;
    }

    // 아키텍처 페이지 토글
    const archPageToggle = document.getElementById('show-architecture-toggle');
    if (archPageToggle) {
        archPageToggle.checked = debugSettings.showArchitecturePage;
    }

    // 페이지 링크 표시/숨김
    updateDebugPageLinks();
}

function toggleDebugSection() {
    const section = document.getElementById('debug-mode-section');
    const button = document.getElementById('toggle-debug-section');

    if (section && button) {
        const isHidden = section.classList.toggle('hidden');
        button.textContent = isHidden ? '🔧 개발자 옵션 보기' : '🔧 개발자 옵션 숨기기';
    }
}

function toggleDebugMode() {
    const debugToggle = document.getElementById('debug-mode-toggle');
    if (!debugToggle) return;

    const enabled = debugToggle.checked;

    // Storage에 설정 저장
    if (!Storage.settings.debugMode) {
        Storage.settings.debugMode = { enabled: false, showTestPage: false, showArchitecturePage: false };
    }
    Storage.settings.debugMode.enabled = enabled;
    Storage.saveSettings();

    // 서브 옵션들 표시/숨김
    const debugSubOptions = document.querySelectorAll('.debug-sub-option');
    debugSubOptions.forEach(el => {
        el.classList.toggle('hidden', !enabled);
    });

    // 디버그 링크 섹션 표시/숨김
    const debugLinksSection = document.getElementById('debug-links-section');
    if (debugLinksSection) {
        debugLinksSection.classList.toggle('hidden', !enabled);
    }

    showToast(enabled ? '디버그 모드가 활성화되었습니다' : '디버그 모드가 비활성화되었습니다');
}

function toggleShowTestPage() {
    const toggle = document.getElementById('show-test-page-toggle');
    if (!toggle) return;

    const enabled = toggle.checked;

    if (!Storage.settings.debugMode) {
        Storage.settings.debugMode = { enabled: true, showTestPage: false, showArchitecturePage: false };
    }
    Storage.settings.debugMode.showTestPage = enabled;
    Storage.saveSettings();

    updateDebugPageLinks();
    showToast(enabled ? '테스트 페이지 링크가 표시됩니다' : '테스트 페이지 링크가 숨겨집니다');
}

function toggleShowArchitecturePage() {
    const toggle = document.getElementById('show-architecture-toggle');
    if (!toggle) return;

    const enabled = toggle.checked;

    if (!Storage.settings.debugMode) {
        Storage.settings.debugMode = { enabled: true, showTestPage: false, showArchitecturePage: false };
    }
    Storage.settings.debugMode.showArchitecturePage = enabled;
    Storage.saveSettings();

    updateDebugPageLinks();
    showToast(enabled ? '아키텍처 페이지 링크가 표시됩니다' : '아키텍처 페이지 링크가 숨겨집니다');
}

function updateDebugPageLinks() {
    const debugSettings = Storage.settings.debugMode || { enabled: false, showTestPage: false, showArchitecturePage: false };

    const testPageLinkItem = document.getElementById('test-page-link-item');
    const archPageLinkItem = document.getElementById('architecture-page-link-item');

    if (testPageLinkItem) {
        testPageLinkItem.style.display = debugSettings.showTestPage ? 'block' : 'none';
    }
    if (archPageLinkItem) {
        archPageLinkItem.style.display = debugSettings.showArchitecturePage ? 'block' : 'none';
    }
}

// Category Badge Functions
function getCategoryInfo(categoryId) {
    if (categoryId === 'all') {
        return { name: '전체', icon: '📚', color: '#4285f4' };
    }
    const cat = VocabData.categories.find(c => c.id === categoryId);
    if (cat) {
        return { name: cat.name, icon: cat.icon, color: cat.color };
    }
    return { name: '전체', icon: '📚', color: '#4285f4' };
}

function updateCategoryBadge(badgeId) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;

    const info = getCategoryInfo(currentCategory);
    const iconEl = badge.querySelector('.badge-icon');
    const textEl = badge.querySelector('.badge-text');

    if (iconEl) iconEl.textContent = info.icon;
    if (textEl) textEl.textContent = info.name;
}

function updateAllCategoryBadges() {
    updateCategoryBadge('list-category-badge');
    updateCategoryBadge('flashcard-category-badge');
    updateCategoryBadge('blink-category-badge');
    updateCategoryBadge('quiz-category-badge');
}

// Category Selector Modal Functions
function openCategorySelector(mode) {
    const modal = document.getElementById('category-selector-modal');
    const grid = document.getElementById('category-selector-grid');

    // Get only active categories
    const activeCategories = VocabData.categories.filter(cat => !Storage.isCategoryDisabled(cat.id));
    const activeWords = activeCategories.reduce((acc, cat) => acc.concat(cat.words), []);
    const totalActiveWords = activeWords.length;

    // Build category list with "All" option
    let html = `
        <div class="category-select-item all-category ${currentCategory === 'all' ? 'selected' : ''}" onclick="selectCategoryFromModal('all', '${mode}')">
            <div class="category-select-icon" style="background: linear-gradient(135deg, #4285f4, #34a853); color: white;">📚</div>
            <div class="category-select-info">
                <div class="category-select-name">전체 보기</div>
                <div class="category-select-count">${totalActiveWords}개 단어</div>
            </div>
        </div>
    `;

    // Only show active categories in selector
    html += activeCategories.map(cat => `
        <div class="category-select-item ${currentCategory === cat.id ? 'selected' : ''}" onclick="selectCategoryFromModal('${cat.id}', '${mode}')">
            <div class="category-select-icon" style="background: ${cat.color}20; color: ${cat.color};">${cat.icon}</div>
            <div class="category-select-info">
                <div class="category-select-name">${cat.name}</div>
                <div class="category-select-count">${cat.words.length}개 단어</div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeCategorySelector() {
    document.getElementById('category-selector-modal').classList.add('hidden');
}

function selectCategoryFromModal(categoryId, mode) {
    saveCategory(categoryId);
    updateAllCategoryBadges();
    closeCategorySelector();

    // Refresh the current mode with new category
    switch(mode) {
        case 'flashcard':
            initFlashcards();
            break;
        case 'blink':
            // Reset blink if running
            if (blinkInterval) {
                stopBlink();
            }
            break;
        case 'quiz':
            // Just update badge, quiz will use new category when started
            break;
        case 'list':
            filterWords();
            break;
    }

    // 카테고리 변경 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`'${getCategoryInfo(categoryId).name}' 카테고리로 변경됨`);
}

// ============================================
// Custom Category Management
// ============================================

let editingCategoryId = null;
let managingCategoryId = null;

// Custom word list lazy loading state
let customWordListLoaded = 0;
const customWordListPerLoad = 50;
let customWordListScrollHandler = null;

// Word operation loading spinner
function showWordLoading(message = '처리 중...') {
    const overlay = document.getElementById('word-loading-overlay');
    if (overlay) {
        const textEl = overlay.querySelector('.loading-text');
        if (textEl) textEl.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideWordLoading() {
    const overlay = document.getElementById('word-loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Open custom category modal for creating new category
function openCustomCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    const modal = document.getElementById('custom-category-modal');
    const title = document.getElementById('custom-category-modal-title');
    const nameInput = document.getElementById('custom-category-name');
    const colorInput = document.getElementById('custom-category-color');
    const langSelect = document.getElementById('custom-category-lang');

    if (categoryId) {
        // Edit mode
        const category = Storage.getCustomCategory(categoryId);
        if (category) {
            title.textContent = '카테고리 수정';
            nameInput.value = category.name;
            colorInput.value = category.color;
            langSelect.value = category.lang || 'en-US';
            // Select the icon
            document.querySelectorAll('#icon-picker .icon-option').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.icon === category.icon);
            });
        }
    } else {
        // Create mode
        title.textContent = '새 카테고리 만들기';
        nameInput.value = '';
        colorInput.value = '#6c757d';
        langSelect.value = 'en-US';
        // Reset icon selection
        document.querySelectorAll('#icon-picker .icon-option').forEach((btn, i) => {
            btn.classList.toggle('selected', i === 0);
        });
    }

    modal.classList.remove('hidden');
}

function closeCustomCategoryModal() {
    document.getElementById('custom-category-modal').classList.add('hidden');
    editingCategoryId = null;
}

function saveCustomCategory() {
    const name = document.getElementById('custom-category-name').value.trim();
    const color = document.getElementById('custom-category-color').value;
    const lang = document.getElementById('custom-category-lang').value;
    const selectedIcon = document.querySelector('#icon-picker .icon-option.selected');
    const icon = selectedIcon ? selectedIcon.dataset.icon : '📁';

    if (!name) {
        showToast('카테고리 이름을 입력해주세요');
        return;
    }

    if (editingCategoryId) {
        // Update existing category - check for duplicate name (excluding current)
        if (Storage.customCategoryNameExists(name, editingCategoryId)) {
            showToast('이미 같은 이름의 카테고리가 있습니다');
            return;
        }
        showWordLoading('카테고리 수정 중...');
        setTimeout(() => {
            Storage.updateCustomCategory(editingCategoryId, { name, icon, color, lang });
            closeCustomCategoryModal();
            VocabData.reloadCustomCategories();
            renderCategories();
            populateCategorySelect();
            updateStorageUsage();
            updateCompressionStats();
            hideWordLoading();
            showToast('카테고리가 수정되었습니다');
        }, 100);
    } else {
        // Create new category - check for duplicate name first
        if (Storage.customCategoryNameExists(name)) {
            showToast('이미 같은 이름의 카테고리가 있습니다');
            return;
        }
        showGlobalLoading('카테고리 생성 중...');
        setTimeout(() => {
            const result = Storage.createCustomCategory(name, icon, color, lang);
            if (!result) {
                hideGlobalLoading();
                showToast('카테고리 생성 실패');
                return;
            }
            closeCustomCategoryModal();
            VocabData.reloadCustomCategories();
            renderCategories();
            populateCategorySelect();
            updateStorageUsage();
            updateCompressionStats();
            hideGlobalLoading();
            showToast('새 카테고리가 생성되었습니다');
        }, 100);
    }
}

// Icon picker event handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-option')) {
        document.querySelectorAll('#icon-picker .icon-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
    }
});

// Check if category language supports word addition (English only)
function isCategoryEnglish(category) {
    if (!category) return false;
    const lang = category.lang || 'en-US';
    return lang === 'en-US' || lang === 'en-GB' || lang.startsWith('en');
}

// Word Management Modal
async function openWordManagementModal(categoryId) {
    managingCategoryId = categoryId;
    const category = Storage.getCustomCategory(categoryId);
    if (!category) return;

    document.getElementById('word-management-title').textContent = `${category.name} - 단어 관리`;
    document.getElementById('word-management-modal').classList.remove('hidden');

    // Show/hide add word button based on language
    const actionsContainer = document.querySelector('.word-management-actions');
    const isEnglish = isCategoryEnglish(category);

    if (isEnglish) {
        actionsContainer.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="showAddWordForm()">+ 단어 추가</button>
            <button class="btn btn-outline btn-sm" onclick="showImportWordsForm()">파일 가져오기</button>
        `;
    } else {
        const langKorean = getLangKorean(category.lang);
        actionsContainer.innerHTML = `
            <div class="word-add-unsupported">
                <span class="unsupported-icon">ℹ️</span>
                <span class="unsupported-text">개별단어추가 미지원 언어</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="showImportWordsForm()">파일 가져오기</button>
        `;
    }

    hideAddWordForm();
    hideImportWordsForm();

    // Show loading while rendering word list
    showWordLoading('단어 목록 로딩 중...');
    await new Promise(resolve => setTimeout(resolve, 10));

    try {
        renderCustomWordList();
    } finally {
        hideWordLoading();
    }
}

function closeWordManagementModal() {
    document.getElementById('word-management-modal').classList.add('hidden');
    cancelCategoryNameEdit();
    managingCategoryId = null;

    // Refresh display - reload custom categories and update all UI
    VocabData.reloadCustomCategories();
    renderCategories();
    populateCategorySelect();
    renderProgress();
    if (currentView === 'list-view') {
        filterWords();
    }
}

// Category name editing functions
function editCategoryName() {
    const category = Storage.getCustomCategory(managingCategoryId);
    if (!category) return;

    document.querySelector('.title-with-edit').classList.add('hidden');
    document.getElementById('category-name-edit-form').classList.remove('hidden');
    document.getElementById('category-name-input').value = category.name;
    document.getElementById('category-name-input').focus();
}

function saveCategoryName() {
    const newName = document.getElementById('category-name-input').value.trim();
    if (!newName) {
        showToast('카테고리명을 입력하세요');
        return;
    }

    // Check for duplicate name (case-insensitive, excluding current category)
    const existingNames = Storage.customCategories
        .filter(c => c.id !== managingCategoryId)
        .map(c => c.name.toLowerCase());

    if (existingNames.includes(newName.toLowerCase())) {
        showToast('동일한 이름의 카테고리가 이미 있습니다');
        return;
    }

    showWordLoading('카테고리명 변경 중...');
    setTimeout(() => {
        Storage.updateCustomCategory(managingCategoryId, { name: newName });
        document.getElementById('word-management-title').textContent = `${newName} - 단어 관리`;
        cancelCategoryNameEdit();
        hideWordLoading();
        showToast('카테고리명이 수정되었습니다');
    }, 100);
}

function cancelCategoryNameEdit() {
    document.querySelector('.title-with-edit').classList.remove('hidden');
    document.getElementById('category-name-edit-form').classList.add('hidden');
}

let meaningFieldCount = 0;
let editingWordId = null;

function showAddWordForm(wordId = null) {
    // Check if category supports word addition (English only)
    const category = Storage.getCustomCategory(managingCategoryId);
    if (!isCategoryEnglish(category)) {
        const langKorean = getLangKorean(category?.lang);
        showToast(`${langKorean} 단어장은 개별 단어 추가를 지원하지 않습니다`);
        return;
    }

    document.getElementById('add-word-form').classList.remove('hidden');
    document.getElementById('import-words-form').classList.add('hidden');
    document.getElementById('custom-word-list').classList.add('hidden');

    editingWordId = wordId;

    // Update form title and button text based on mode
    const formTitle = document.getElementById('add-word-form-title');
    const submitBtn = document.getElementById('add-word-submit-btn');

    if (wordId) {
        // Edit mode - populate form with existing word data
        formTitle.textContent = '단어 수정';
        submitBtn.textContent = '수정';

        const category = Storage.getCustomCategory(managingCategoryId);
        const word = category?.words?.find(w => w.id === wordId);

        if (word) {
            document.getElementById('new-word-word').value = word.word || '';
            document.getElementById('new-word-pronunciation').value = word.pronunciation || '';

            // Clear meanings container and populate with existing meanings
            meaningFieldCount = 0;
            document.getElementById('meanings-container').innerHTML = '';

            if (word.meanings && word.meanings.length > 0) {
                word.meanings.forEach((m, idx) => {
                    addMeaningField();
                    const fields = document.querySelectorAll('#meanings-container .meaning-field');
                    const field = fields[idx];
                    if (field) {
                        const posInput = field.querySelector('.pos-input');
                        const meaningInput = field.querySelector('.meaning-input');
                        const exampleInput = field.querySelector('.example-input');
                        const translationInput = field.querySelector('.translation-input');

                        if (posInput) posInput.value = m.partOfSpeech || '';
                        if (meaningInput) meaningInput.value = m.meaning || '';
                        if (m.examples && m.examples[0]) {
                            if (exampleInput) exampleInput.value = m.examples[0].sentence || '';
                            if (translationInput) translationInput.value = m.examples[0].translation || '';
                        }
                    }
                });
            } else {
                // Fallback for old format
                addMeaningField();
                const field = document.querySelector('#meanings-container .meaning-field');
                if (field) {
                    const posInput = field.querySelector('.pos-input');
                    const meaningInput = field.querySelector('.meaning-input');
                    const exampleInput = field.querySelector('.example-input');
                    const translationInput = field.querySelector('.translation-input');

                    if (posInput) posInput.value = word.partOfSpeech || '';
                    if (meaningInput) meaningInput.value = word.meaning || '';
                    if (word.examples && word.examples[0]) {
                        if (exampleInput) exampleInput.value = word.examples[0].sentence || '';
                        if (translationInput) translationInput.value = word.examples[0].translation || '';
                    }
                }
            }
        }
    } else {
        // Add mode - clear form
        formTitle.textContent = '단어 추가';
        submitBtn.textContent = '추가';

        document.getElementById('new-word-word').value = '';
        document.getElementById('new-word-pronunciation').value = '';
        // Clear meanings container and add first field
        meaningFieldCount = 0;
        document.getElementById('meanings-container').innerHTML = '';
        addMeaningField();
    }
}

function hideAddWordForm() {
    document.getElementById('add-word-form').classList.add('hidden');
    document.getElementById('custom-word-list').classList.remove('hidden');
    editingWordId = null;
}

function addMeaningField() {
    meaningFieldCount++;
    const container = document.getElementById('meanings-container');
    const fieldCount = container.querySelectorAll('.meaning-field').length + 1;

    const fieldHtml = `
        <div class="meaning-field" data-field-id="${meaningFieldCount}">
            <div class="meaning-field-header">
                <span class="meaning-field-number">뜻 ${fieldCount}</span>
                ${fieldCount > 1 ? `<button type="button" class="remove-meaning-btn" onclick="removeMeaningField(${meaningFieldCount})">삭제</button>` : ''}
            </div>
            <div class="form-row">
                <div class="form-group form-group-small">
                    <label>품사</label>
                    <select class="select-input pos-input">
                        <option value="">선택 안함</option>
                        <option value="명사">명사</option>
                        <option value="동사">동사</option>
                        <option value="형용사">형용사</option>
                        <option value="부사">부사</option>
                        <option value="전치사">전치사</option>
                        <option value="접속사">접속사</option>
                        <option value="감탄사">감탄사</option>
                        <option value="숙어">숙어</option>
                        <option value="구동사">구동사</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>뜻 *</label>
                    <input type="text" class="input-field meaning-input" placeholder="사과">
                </div>
            </div>
            <div class="form-group">
                <label>예문</label>
                <input type="text" class="input-field example-input" placeholder="I ate an apple.">
            </div>
            <div class="form-group">
                <label>예문 해석</label>
                <input type="text" class="input-field translation-input" placeholder="나는 사과를 먹었다.">
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);
    updateMeaningFieldNumbers();
}

function removeMeaningField(fieldId) {
    const field = document.querySelector(`.meaning-field[data-field-id="${fieldId}"]`);
    if (field) {
        field.remove();
        updateMeaningFieldNumbers();
    }
}

function updateMeaningFieldNumbers() {
    const fields = document.querySelectorAll('#meanings-container .meaning-field');
    fields.forEach((field, index) => {
        const numberSpan = field.querySelector('.meaning-field-number');
        if (numberSpan) {
            numberSpan.textContent = `뜻 ${index + 1}`;
        }
        // Show/hide remove button based on count
        const removeBtn = field.querySelector('.remove-meaning-btn');
        if (fields.length === 1) {
            if (removeBtn) removeBtn.style.display = 'none';
        } else {
            if (removeBtn) removeBtn.style.display = '';
            // Add remove button if not exists and not first field
            if (!removeBtn && index > 0) {
                const header = field.querySelector('.meaning-field-header');
                const fieldId = field.dataset.fieldId;
                header.insertAdjacentHTML('beforeend',
                    `<button type="button" class="remove-meaning-btn" onclick="removeMeaningField(${fieldId})">삭제</button>`
                );
            }
        }
    });
}


// English to Korean part of speech mapping
const posMapping = {
    'noun': '명사',
    'verb': '동사',
    'adjective': '형용사',
    'adverb': '부사',
    'preposition': '전치사',
    'conjunction': '접속사',
    'interjection': '감탄사',
    'pronoun': '대명사',
    'determiner': '한정사',
    'exclamation': '감탄사',
    'abbreviation': '약어'
};

// Lookup dictionary using Free Dictionary API
async function lookupDictionary() {
    const wordInput = document.getElementById('new-word-word');
    const word = wordInput.value.trim().toLowerCase();

    if (!word) {
        showToast('조회할 단어를 입력하세요');
        return;
    }

    // Check if it's English (simple check)
    if (!/^[a-zA-Z\s-]+$/.test(word)) {
        showToast('영어 단어만 조회 가능합니다');
        return;
    }

    const btn = document.querySelector('.dict-lookup-btn');
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span>조회 중...</span>';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        if (!response.ok) {
            if (response.status === 404) {
                showToast('사전에서 단어를 찾을 수 없습니다');
            } else {
                showToast('사전 조회 중 오류가 발생했습니다');
            }
            return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            // Check if there are existing values in the form
            const hasExistingData = checkExistingFormData();

            if (hasExistingData) {
                if (confirm('기존에 입력된 내용이 있습니다. 덮어쓰시겠습니까?')) {
                    fillFormFromDictionary(data[0]);
                    showToast('사전 정보를 불러왔습니다');
                } else {
                    showToast('기존 내용을 유지합니다');
                }
            } else {
                fillFormFromDictionary(data[0]);
                showToast('사전 정보를 불러왔습니다');
            }
        }
    } catch (error) {
        console.error('Dictionary lookup error:', error);
        showToast('사전 조회 중 오류가 발생했습니다');
    } finally {
        btn.classList.remove('loading');
        btn.innerHTML = originalText;
    }
}

// Check if form has existing data
function checkExistingFormData() {
    const pronunciation = document.getElementById('new-word-pronunciation').value.trim();
    if (pronunciation) return true;

    const meaningFields = document.querySelectorAll('#meanings-container .meaning-field');
    for (const field of meaningFields) {
        const meaning = field.querySelector('.meaning-input')?.value.trim();
        const example = field.querySelector('.example-input')?.value.trim();
        if (meaning || example) return true;
    }

    return false;
}



// Lookup pronunciation only using Free Dictionary API
async function lookupPronunciation() {
    const wordInput = document.getElementById('new-word-word');
    const word = wordInput.value.trim().toLowerCase();

    if (!word) {
        showToast('조회할 단어를 입력하세요');
        return;
    }

    // Check if it's English (simple check)
    if (!/^[a-zA-Z\s-]+$/.test(word)) {
        showToast('영어 단어만 조회 가능합니다');
        return;
    }

    const btn = document.querySelector('.pron-lookup-btn');
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span>조회 중...</span>';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        if (!response.ok) {
            if (response.status === 404) {
                showToast('사전에서 단어를 찾을 수 없습니다');
            } else {
                showToast('발음 조회 중 오류가 발생했습니다');
            }
            return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            const dictData = data[0];
            const pronunciationInput = document.getElementById('new-word-pronunciation');

            if (dictData.phonetic) {
                pronunciationInput.value = dictData.phonetic.replace(/\//g, '');
                showToast('발음기호를 불러왔습니다');
            } else if (dictData.phonetics && dictData.phonetics.length > 0) {
                const phonetic = dictData.phonetics.find(p => p.text) || dictData.phonetics[0];
                if (phonetic && phonetic.text) {
                    pronunciationInput.value = phonetic.text.replace(/\//g, '');
                    showToast('발음기호를 불러왔습니다');
                } else {
                    showToast('발음기호를 찾을 수 없습니다');
                }
            } else {
                showToast('발음기호를 찾을 수 없습니다');
            }
        }
    } catch (error) {
        console.error('Pronunciation lookup error:', error);
        showToast('발음 조회 중 오류가 발생했습니다');
    } finally {
        btn.classList.remove('loading');
        btn.innerHTML = originalText;
    }
}

// Fill form with dictionary data
function fillFormFromDictionary(dictData) {
    // Set pronunciation (use first available phonetic)
    const pronunciationInput = document.getElementById('new-word-pronunciation');
    if (dictData.phonetic) {
        pronunciationInput.value = dictData.phonetic.replace(/\//g, '');
    } else if (dictData.phonetics && dictData.phonetics.length > 0) {
        const phonetic = dictData.phonetics.find(p => p.text) || dictData.phonetics[0];
        if (phonetic && phonetic.text) {
            pronunciationInput.value = phonetic.text.replace(/\//g, '');
        }
    }

    // Clear existing meaning fields
    const container = document.getElementById('meanings-container');
    container.innerHTML = '';
    meaningFieldCount = 0;

    // Collect all meanings from all parts of speech
    const allMeanings = [];

    if (dictData.meanings && dictData.meanings.length > 0) {
        dictData.meanings.forEach(meaning => {
            const pos = meaning.partOfSpeech || '';
            const koreanPos = posMapping[pos.toLowerCase()] || '';

            if (meaning.definitions && meaning.definitions.length > 0) {
                meaning.definitions.forEach(def => {
                    allMeanings.push({
                        partOfSpeech: koreanPos,
                        definition: def.definition || '',
                        example: def.example || ''
                    });
                });
            }
        });
    }

    // Add meaning fields (limit to reasonable number, e.g., 10)
    const maxMeanings = Math.min(allMeanings.length, 10);

    if (maxMeanings === 0) {
        addMeaningField();
        return;
    }

    for (let i = 0; i < maxMeanings; i++) {
        addMeaningField();

        const fields = container.querySelectorAll('.meaning-field');
        const field = fields[i];

        if (field) {
            const m = allMeanings[i];
            const posInput = field.querySelector('.pos-input');
            const meaningInput = field.querySelector('.meaning-input');
            const exampleInput = field.querySelector('.example-input');

            if (posInput && m.partOfSpeech) {
                // Set the select value if it matches one of the options
                const options = Array.from(posInput.options);
                const matchingOption = options.find(opt => opt.value === m.partOfSpeech);
                if (matchingOption) {
                    posInput.value = m.partOfSpeech;
                }
            }
            if (meaningInput) meaningInput.value = m.definition;
            if (exampleInput) exampleInput.value = m.example;
            // Translation is intentionally left empty as per user request
        }
    }

    // Show info if there are more meanings
    if (allMeanings.length > maxMeanings) {
        showToast(`${allMeanings.length}개 중 ${maxMeanings}개 뜻을 불러왔습니다`);
    }
}

async function saveWordToCategory() {
    const word = document.getElementById('new-word-word').value.trim();
    const pronunciation = document.getElementById('new-word-pronunciation').value.trim();

    // Collect meanings from dynamic fields (each with its own partOfSpeech)
    const meaningFields = document.querySelectorAll('#meanings-container .meaning-field');
    const meanings = [];

    meaningFields.forEach(field => {
        const partOfSpeech = field.querySelector('.pos-input')?.value || '';
        const meaning = field.querySelector('.meaning-input').value.trim();
        const example = field.querySelector('.example-input').value.trim();
        const translation = field.querySelector('.translation-input').value.trim();

        if (meaning) {
            const meaningObj = { meaning };
            if (partOfSpeech) {
                meaningObj.partOfSpeech = partOfSpeech;
            }
            if (example) {
                meaningObj.examples = [{ sentence: example, translation: translation || '' }];
            }
            meanings.push(meaningObj);
        }
    });

    if (!word || meanings.length === 0) {
        showToast('단어와 최소 하나의 뜻은 필수 입력입니다');
        return;
    }

    // Show loading spinner
    showWordLoading(editingWordId ? '수정 중...' : '추가 중...');

    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        if (editingWordId) {
            // Edit mode - update existing word
            const result = Storage.updateWordInCustomCategory(managingCategoryId, editingWordId, {
                word,
                pronunciation,
                meanings
            });

            if (result) {
                showToast('단어가 수정되었습니다');
            } else {
                showToast('단어 수정 실패');
            }
        } else {
            // Add mode - create new word
            const result = Storage.addWordToCustomCategory(managingCategoryId, {
                word,
                pronunciation,
                meanings
            });

            if (result) {
                if (result.action === 'capacity_exceeded') {
                    showToast(`저장소 용량 부족 (${result.currentPercent}% 사용 중)`);
                    hideWordLoading();
                    return; // 폼을 닫지 않고 종료
                } else if (result.action === 'created') {
                    showToast('단어가 추가되었습니다');
                } else if (result.action === 'updated') {
                    showToast('기존 단어가 업데이트되었습니다');
                } else if (result.action === 'polysemy_added') {
                    showToast('다의어로 뜻이 추가되었습니다');
                }
            }
        }

        hideAddWordForm();
        renderCustomWordList();
        updateStorageUsage();
        updateCompressionStats();
    } finally {
        hideWordLoading();
    }
}

// Keep old function name for backward compatibility
function addWordToCategory() {
    saveWordToCategory();
}

function showImportWordsForm() {
    document.getElementById('import-words-form').classList.remove('hidden');
    document.getElementById('add-word-form').classList.add('hidden');
    document.getElementById('custom-word-list').classList.add('hidden');
    // 초기 형식 도움말 표시 (JSON이 기본값)
    toggleImportFormatHelp();
}

function hideImportWordsForm() {
    // 진행 중인 가져오기 취소
    if (importAbortController) {
        importAbortController.abort();
        importAbortController = null;
    }
    // UI 복원
    const progressDiv = document.getElementById('import-progress');
    const formActions = document.getElementById('import-form-actions');
    if (progressDiv) progressDiv.classList.add('hidden');
    if (formActions) formActions.classList.remove('hidden');

    document.getElementById('import-words-form').classList.add('hidden');
    document.getElementById('custom-word-list').classList.remove('hidden');
}

// 파일 형식 선택에 따라 해당 도움말만 표시
function toggleImportFormatHelp() {
    const fileType = document.getElementById('import-file-type').value;
    const jsonHelp = document.getElementById('import-format-json');
    const csvHelp = document.getElementById('import-format-csv');
    const fileInput = document.getElementById('import-words-file');

    if (fileType === 'json') {
        jsonHelp.classList.remove('hidden');
        csvHelp.classList.add('hidden');
        fileInput.accept = '.json';
    } else {
        jsonHelp.classList.add('hidden');
        csvHelp.classList.remove('hidden');
        fileInput.accept = '.csv';
    }
}

async function importWordsFromFile() {
    const fileType = document.getElementById('import-file-type').value;
    const fileInput = document.getElementById('import-words-file');
    const file = fileInput.files[0];

    if (!file) {
        showToast('파일을 선택해주세요');
        return;
    }

    // 프로그레스 바 UI 요소
    const formActions = document.getElementById('import-form-actions');
    const progressDiv = document.getElementById('import-progress');
    const progressLabel = document.getElementById('import-progress-label');
    const progressCount = document.getElementById('import-progress-count');
    const progressFill = document.getElementById('import-progress-fill');

    // 취소용 AbortController 생성
    importAbortController = new AbortController();
    const signal = importAbortController.signal;

    // 프로그레스 콜백
    const onProgress = (current, total) => {
        const percent = Math.round((current / total) * 100);
        progressCount.textContent = `${current.toLocaleString()} / ${total.toLocaleString()}`;
        progressFill.style.width = `${percent}%`;
    };

    const reader = new FileReader();
    reader.onload = async (e) => {
        // 폼 버튼 숨기고 프로그레스 표시
        formActions.classList.add('hidden');
        progressDiv.classList.remove('hidden');
        progressLabel.textContent = '가져오는 중...';
        progressCount.textContent = '준비 중...';
        progressFill.style.width = '0%';

        // UI 업데이트를 위한 짧은 대기
        await new Promise(resolve => setTimeout(resolve, 50));

        // 저장 시작 시 프로그래스바 숨기고 모달형 스피너 표시
        const onSaving = () => {
            progressDiv.classList.add('hidden');
            showGlobalLoading('저장 중...');
        };

        let result;
        try {
            if (fileType === 'json') {
                result = await Storage.importWordsFromJSONAsync(managingCategoryId, e.target.result, onProgress, { signal, onSaving });
            } else {
                result = await Storage.importWordsFromCSVAsync(managingCategoryId, e.target.result, onProgress, { signal, onSaving });
            }
        } catch (err) {
            result = { success: false, error: err.message };
        }

        // 작업 완료 후 AbortController 해제
        importAbortController = null;

        // 모달형 스피너 숨기고 폼 버튼 복원
        hideGlobalLoading();
        progressDiv.classList.add('hidden');
        formActions.classList.remove('hidden');

        if (result.cancelled) {
            showToast('가져오기가 취소되었습니다');
        } else if (result.success) {
            let message = '';
            if (result.created > 0) message += `신규 ${result.created}개`;
            if (result.updated > 0) message += `${message ? ', ' : ''}업데이트 ${result.updated}개`;
            if (result.polysemy > 0) message += `${message ? ', ' : ''}다의어 ${result.polysemy}개`;
            showToast(message || '변경 없음');
            hideImportWordsForm();
            renderCustomWordList();
            // 압축률 통계 업데이트
            updateCompressionStats();
            // 저장소 사용량 업데이트
            updateStorageUsage();
        } else {
            showToast(`가져오기 실패: ${result.error}`);
        }
    };
    reader.readAsText(file);

    fileInput.value = '';
}

function renderCustomWordList(preserveLoadedCount = false) {
    const container = document.getElementById('custom-word-list');
    const category = Storage.getCustomCategory(managingCategoryId);

    // Remove previous scroll handler
    if (customWordListScrollHandler) {
        container.removeEventListener('scroll', customWordListScrollHandler);
        customWordListScrollHandler = null;
    }

    if (!category || category.words.length === 0) {
        container.innerHTML = '<p class="empty-message">등록된 단어가 없습니다.</p>';
        customWordListLoaded = 0;
        return;
    }

    // Reset or preserve loaded count
    if (!preserveLoadedCount) {
        customWordListLoaded = Math.min(customWordListPerLoad, category.words.length);
    }

    const wordsToShow = category.words.slice(0, customWordListLoaded);
    container.innerHTML = renderCustomWordItems(wordsToShow);

    // Add load more indicator if there are more words
    if (customWordListLoaded < category.words.length) {
        container.innerHTML += `
            <div id="custom-word-load-indicator" class="load-more-indicator">
                <span class="load-more-text">스크롤하여 더 보기 (${customWordListLoaded}/${category.words.length})</span>
            </div>
        `;
        setupCustomWordListScroll();
    }
}

function renderCustomWordItems(words) {
    return words.map(word => {
        // Get display meaning (from meanings array or fallback to meaning string)
        let displayMeaning = word.meaning || '';
        if (word.meanings && word.meanings.length > 0) {
            displayMeaning = word.meanings.map(m => m.meaning).join(', ');
        }

        return `
            <div class="custom-word-item" data-word-id="${word.id}">
                <div class="custom-word-content">
                    <span class="custom-word-text">${word.word}</span>
                    ${word.pronunciation ? `<span class="custom-word-pronunciation">/${word.pronunciation}/</span>` : ''}
                    <span class="custom-word-meaning">${displayMeaning}</span>
                </div>
                <div class="custom-word-actions">
                    <button class="btn btn-sm btn-edit" onclick="showAddWordForm('${word.id}')" title="수정">수정</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteWordFromCategory('${word.id}')" title="삭제">삭제</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupCustomWordListScroll() {
    const container = document.getElementById('custom-word-list');

    customWordListScrollHandler = () => {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // Load more when scrolled to bottom (with 100px threshold)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreCustomWords();
        }
    };

    container.addEventListener('scroll', customWordListScrollHandler);
}

function loadMoreCustomWords() {
    const category = Storage.getCustomCategory(managingCategoryId);
    if (!category) return;
    if (customWordListLoaded >= category.words.length) return;

    const container = document.getElementById('custom-word-list');
    const indicator = document.getElementById('custom-word-load-indicator');

    if (indicator) {
        indicator.innerHTML = '<span class="load-more-text">로딩 중...</span>';
    }

    setTimeout(() => {
        const startIndex = customWordListLoaded;
        const endIndex = Math.min(startIndex + customWordListPerLoad, category.words.length);
        const newWords = category.words.slice(startIndex, endIndex);

        // Remove indicator before adding new items
        if (indicator) {
            indicator.remove();
        }

        // Append new word items
        container.insertAdjacentHTML('beforeend', renderCustomWordItems(newWords));

        customWordListLoaded = endIndex;

        // Add new indicator if there are more words
        if (customWordListLoaded < category.words.length) {
            container.insertAdjacentHTML('beforeend', `
                <div id="custom-word-load-indicator" class="load-more-indicator">
                    <span class="load-more-text">스크롤하여 더 보기 (${customWordListLoaded}/${category.words.length})</span>
                </div>
            `);
        }
    }, 50);
}

async function deleteWordFromCategory(wordId) {
    if (confirm('이 단어를 삭제하시겠습니까?')) {
        showWordLoading('삭제 중...');

        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            Storage.deleteWordFromCustomCategory(managingCategoryId, wordId);
            showToast('단어가 삭제되었습니다');
            renderCustomWordList();
            updateStorageUsage();
            updateCompressionStats();
        } finally {
            hideWordLoading();
        }
    }
}

function deleteCurrentCategory() {
    if (confirm('이 카테고리와 포함된 모든 단어를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        showWordLoading('카테고리 삭제 중...');
        setTimeout(() => {
            const deletedCategoryId = managingCategoryId;
            Storage.deleteCustomCategory(deletedCategoryId);

            // If current category was deleted, reset to 'all'
            if (currentCategory === deletedCategoryId) {
                saveCategory('all');
                updateAllCategoryBadges();
            }

            VocabData.reloadCustomCategories();
            renderCategories();
            populateCategorySelect();
            updateStorageUsage();
            updateCompressionStats();
            closeWordManagementModal();
            hideWordLoading();
            showToast('카테고리가 삭제되었습니다');
        }, 100);
    }
}

// Download template files for word import
function downloadTemplate(type) {
    let content, filename, mimeType;

    if (type === 'json') {
        const jsonTemplate = [
            {
                "word": "example",
                "pronunciation": "ɪɡˈzæmpl",
                "meanings": [
                    {
                        "partOfSpeech": "명사",
                        "meaning": "예시, 본보기",
                        "examples": [{"sentence": "This is an example sentence.", "translation": "이것은 예시 문장입니다."}]
                    }
                ]
            },
            {
                "word": "run",
                "pronunciation": "rʌn",
                "meanings": [
                    {
                        "partOfSpeech": "동사",
                        "meaning": "달리다",
                        "examples": [{"sentence": "I run every morning.", "translation": "나는 매일 아침 달린다."}]
                    },
                    {
                        "partOfSpeech": "동사",
                        "meaning": "운영하다",
                        "examples": [{"sentence": "She runs a company.", "translation": "그녀는 회사를 운영한다."}]
                    },
                    {
                        "partOfSpeech": "명사",
                        "meaning": "달리기",
                        "examples": [{"sentence": "I went for a run.", "translation": "나는 달리기를 하러 갔다."}]
                    }
                ]
            },
            {
                "word": "simple",
                "pronunciation": "ˈsɪmpl",
                "meaning": "간단한",
                "example": "This is a simple example.",
                "translation": "이것은 간단한 예시입니다."
            }
        ];
        content = JSON.stringify(jsonTemplate, null, 2);
        filename = 'word_template.json';
        mimeType = 'application/json';
    } else {
        const csvTemplate = `word,pronunciation,partOfSpeech,meaning,example,translation
example,ɪɡˈzæmpl,명사,예시,This is an example sentence.,이것은 예시 문장입니다.
vocabulary,vəˈkæbjəleri,명사,어휘,Building vocabulary is important.,어휘력을 쌓는 것은 중요합니다.
practice,ˈpræktɪs,동사,연습하다,Practice makes perfect.,연습이 완벽을 만든다.`;
        content = csvTemplate;
        filename = 'word_template.csv';
        mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`${type.toUpperCase()} 템플릿이 다운로드되었습니다`);
}

// ============================================
// UI Preferences Save/Load Functions
// ============================================

// Word List Settings
function loadWordListSettings() {
    const ui = Storage.settings.ui?.wordList || {};
    const statusSelect = document.getElementById('status-select');
    const viewModeSelect = document.getElementById('view-mode-select');

    if (statusSelect && ui.statusFilter) {
        statusSelect.value = ui.statusFilter;
    }
    if (viewModeSelect && ui.viewMode) {
        viewModeSelect.value = ui.viewMode;
        currentViewMode = ui.viewMode;
    }
}

function saveWordListSettings(key, value) {
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.wordList) Storage.settings.ui.wordList = {};
    Storage.settings.ui.wordList[key] = value;
    Storage.saveSettings();
}

// Flashcard Settings
function loadFlashcardSettings() {
    const ui = Storage.settings.ui?.flashcard || {};
    const statusSelect = document.getElementById('flashcard-status-filter');
    const autoTTSToggle = document.getElementById('flashcard-auto-tts');
    const animToggle = document.getElementById('flashcard-animation-toggle');

    if (statusSelect && ui.statusFilter) {
        statusSelect.value = ui.statusFilter;
    }
    if (autoTTSToggle) {
        const autoTTSValue = ui.autoTTS === true;
        autoTTSToggle.checked = autoTTSValue;
        flashcardAutoTTS = autoTTSValue;
    }
    if (animToggle) {
        // Default is true if not set
        const animValue = ui.animation !== undefined ? ui.animation : true;
        animToggle.checked = animValue;
        flashcardAnimation = animValue;
    }
}

function saveFlashcardSettings(key, value) {
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.flashcard) Storage.settings.ui.flashcard = {};
    if (key && value !== undefined) {
        Storage.settings.ui.flashcard[key] = value;
    }
    Storage.saveSettings();
}

function toggleFlashcardAnimation() {
    const toggle = document.getElementById('flashcard-animation-toggle');
    flashcardAnimation = toggle.checked;
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.flashcard) Storage.settings.ui.flashcard = {};
    Storage.settings.ui.flashcard.animation = flashcardAnimation;
    Storage.saveSettings();
}

function toggleFlashcardAutoTTS() {
    const toggle = document.getElementById('flashcard-auto-tts');
    flashcardAutoTTS = toggle.checked;
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.flashcard) Storage.settings.ui.flashcard = {};
    Storage.settings.ui.flashcard.autoTTS = flashcardAutoTTS;
    Storage.saveSettings();
}

// TTS Speed Setting
function changeTTSSpeed(value) {
    const speed = parseFloat(value);
    VocabData.tts.rate = speed;
    
    // Update display
    const speedValue = document.getElementById('tts-speed-value');
    if (speedValue) {
        speedValue.textContent = speed.toFixed(1) + 'x';
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('ttsSpeed', speed.toString());
    } catch (e) {
        console.error('Error saving TTS speed:', e);
    }
}

function loadTTSSpeedSetting() {
    try {
        const savedSpeed = localStorage.getItem('ttsSpeed');
        if (savedSpeed) {
            const speed = parseFloat(savedSpeed);
            VocabData.tts.rate = speed;
            
            const rangeInput = document.getElementById('tts-speed-range');
            const speedValue = document.getElementById('tts-speed-value');
            
            if (rangeInput) rangeInput.value = speed;
            if (speedValue) speedValue.textContent = speed.toFixed(1) + 'x';
        }
    } catch (e) {
        console.error('Error loading TTS speed:', e);
    }
}

// Blink Settings
function loadBlinkSettings() {
    const ui = Storage.settings.ui?.blink || {};
    const statusSelect = document.getElementById('blink-status-filter');
    const speedSelect = document.getElementById('blink-speed');
    const displaySelect = document.getElementById('blink-display');
    const repeatSelect = document.getElementById('blink-repeat-count');
    const autoTTSToggle = document.getElementById('blink-auto-tts');

    if (statusSelect && ui.statusFilter) {
        statusSelect.value = ui.statusFilter;
    }
    if (speedSelect && ui.speed) {
        speedSelect.value = ui.speed;
    }
    if (displaySelect && ui.displayMode) {
        displaySelect.value = ui.displayMode;
        toggleBlinkAlternateOptions();
    }
    if (repeatSelect && ui.repeatCount) {
        repeatSelect.value = ui.repeatCount;
    }
    if (autoTTSToggle && ui.autoTTS !== undefined) {
        autoTTSToggle.checked = ui.autoTTS;
    }
}

function saveBlinkSettings(key, value) {
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.blink) Storage.settings.ui.blink = {};
    Storage.settings.ui.blink[key] = value;
    Storage.saveSettings();
}

// Quiz Settings
function loadQuizSettings() {
    const ui = Storage.settings.ui?.quiz || {};
    const statusSelect = document.getElementById('quiz-status-filter');
    const countSelect = document.getElementById('quiz-count');
    const typeSelect = document.getElementById('quiz-type');

    if (statusSelect && ui.statusFilter) {
        statusSelect.value = ui.statusFilter;
    }
    if (countSelect && ui.count) {
        countSelect.value = ui.count;
    }
    if (typeSelect && ui.type) {
        typeSelect.value = ui.type;
    }
}

function saveQuizSettings(key, value) {
    if (!Storage.settings.ui) Storage.settings.ui = {};
    if (!Storage.settings.ui.quiz) Storage.settings.ui.quiz = {};
    Storage.settings.ui.quiz[key] = value;
    Storage.saveSettings();
}

// ============================================
// Flashcard Touch Gestures
// ============================================

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let lastTapTime = 0;
const SWIPE_THRESHOLD = 50;
const DOUBLE_TAP_DELAY = 300;

function initFlashcardTouchGestures() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    // Remove existing click handler and add touch-aware handler
    flashcard.removeAttribute('onclick');

    // Touch start
    flashcard.addEventListener('touchstart', handleFlashcardTouchStart, { passive: true });

    // Touch end
    flashcard.addEventListener('touchend', handleFlashcardTouchEnd, { passive: false });

    // Mouse click for non-touch devices
    flashcard.addEventListener('click', handleFlashcardClick);
}

function handleFlashcardTouchStart(e) {
    // Ignore if touch started on TTS button
    if (e.target.closest('.tts-btn')) {
        return;
    }
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleFlashcardTouchEnd(e) {
    // Ignore if touch ended on TTS button
    if (e.target.closest('.tts-btn')) {
        return;
    }

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Check if it's a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
        // Horizontal swipe detected - flip card
        e.preventDefault();
        flipCard();
        return;
    }

    // Check for double tap
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;

    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
        // Double tap detected - go to next card
        e.preventDefault();
        nextCard();
        lastTapTime = 0;
        return;
    }

    lastTapTime = currentTime;

    // Single tap - flip card (with delay to check for double tap)
    setTimeout(() => {
        if (lastTapTime !== 0 && new Date().getTime() - lastTapTime >= DOUBLE_TAP_DELAY) {
            flipCard();
        }
    }, DOUBLE_TAP_DELAY);
}

function handleFlashcardClick(e) {
    // Ignore if click was on TTS button
    if (e.target.closest('.tts-btn')) {
        return;
    }
    // Only handle click on non-touch devices or when not handling touch
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) {
        return; // Ignore click events from touch
    }
    flipCard();
}

// Initialize touch gestures when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay to ensure flashcard element exists
    setTimeout(initFlashcardTouchGestures, 100);

    // Restore language filter select value from localStorage
    const langSelect = document.getElementById('language-filter');
    if (langSelect && currentLanguageFilter) {
        langSelect.value = currentLanguageFilter;
    }

    // Restore status filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === currentCategoryFilter);
    });
});

// PWA Back Button Exit Handler
let backPressedOnce = false;
let backPressTimeout = null;

// bfcache에서 복원될 때 감지 (서브페이지에서 돌아올 때)
window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
        // bfcache에서 복원됨 - 현재 뷰에 따라 히스토리 복원
        console.log('[PWA] Page restored from bfcache, currentView:', currentView);
        if (window.history && window.history.pushState && currentView !== 'home-view') {
            // 홈이 아닌 뷰에서 복원된 경우에만 히스토리 추가
            window.history.pushState({ page: 'app' }, '', '');
        }
    }
});

function initPWABackHandler() {
    // Detect browser type
    const ua = navigator.userAgent;
    const isSamsungInternet = /SamsungBrowser/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua) && !/CriOS/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    console.log('[PWA] Browser detected:', {
        samsung: isSamsungInternet,
        safari: isSafari,
        iOS: isIOS
    });

    if (isSamsungInternet || (isSafari && isIOS)) {
        // Samsung Internet & iOS Safari: Use hash-based navigation
        initHashBasedBackHandler();
    } else if (window.history && window.history.pushState) {
        // 이미 초기화된 상태면 (서브페이지에서 돌아온 경우)
        if (sessionStorage.getItem('pwa_history_initialized')) {
            console.log('[PWA] Already initialized from sub-page return');
            window.history.replaceState({ page: 'app' }, '', '');
            // 서브페이지에서 돌아올 때 모달이 열려있을 수 있으므로 히스토리 추가
            window.history.pushState({ page: 'app' }, '', '');
            window.addEventListener('popstate', handleBackButton);
            return;
        }
        // 첫 로드 시에만 히스토리 설정
        sessionStorage.setItem('pwa_history_initialized', 'true');
        window.history.replaceState({ page: 'app' }, '', '');
        // 초기 상태에서는 pushState 하지 않음 - 홈에서 바로 종료 가능
        window.addEventListener('popstate', handleBackButton);
    }
}

// Hash-based back handler for Samsung Internet & iOS Safari
function initHashBasedBackHandler() {
    // 이미 초기화되었으면 이벤트 리스너만 등록 (서브페이지에서 돌아온 경우)
    if (sessionStorage.getItem('pwa_hash_initialized')) {
        console.log('[PWA] Hash handler already initialized');
        window.addEventListener('hashchange', handleHashChange);
        return;
    }
    sessionStorage.setItem('pwa_hash_initialized', 'true');

    // Set initial hash if not present
    if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#app';
    }

    // Listen for hash changes (back button)
    window.addEventListener('hashchange', handleHashChange);
}

function handleHashChange(e) {
    console.log('[PWA] hashchange detected');
    // Handle back navigation (restoreHistoryEntry will restore hash)
    handleBackButton(e);
}

// Helper to check if using hash-based navigation
function isHashBasedNavigation() {
    const ua = navigator.userAgent;
    const isSamsungInternet = /SamsungBrowser/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua) && !/CriOS/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    return isSamsungInternet || (isSafari && isIOS);
}

// Restore history entry after handling back button
function restoreHistoryEntry() {
    if (isHashBasedNavigation()) {
        // Hash-based: ensure hash is set
        if (!window.location.hash || window.location.hash === '#') {
            window.location.hash = '#app';
        }
    } else if (window.history && window.history.pushState) {
        // History API: push state back
        window.history.pushState({ page: 'app' }, '', '');
    }
}

function handleBackButton(e) {
    console.log('[PWA] Back button pressed, currentView:', currentView);

    // Check if any modal is open
    const openModals = document.querySelectorAll('.modal:not(.hidden)');
    if (openModals.length > 0) {
        // Close the topmost modal
        const topModal = openModals[openModals.length - 1];
        const closeBtn = topModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.click();
        } else {
            topModal.classList.add('hidden');
        }
        // Restore history entry
        restoreHistoryEntry();
        return;
    }

    // Check if blink mode is running
    if (currentView === 'blink-view') {
        const blinkDisplayArea = document.getElementById('blink-display-area');
        if (!blinkDisplayArea.classList.contains('hidden')) {
            // 블링크 실행 중 - 중지하고 설정창으로
            // (startBlink에서 히스토리를 추가했으므로 여기서 복원 불필요)
            stopBlink();
            return;
        }
        // 블링크 설정창 - 홈으로 이동
        showHome();
        return;
    }

    // Check if quiz is in progress
    if (currentView === 'quiz-view') {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer.classList.contains('hidden')) {
            // 퀴즈 실행 중 - 설정창으로
            // (startQuiz에서 히스토리를 추가했으므로 여기서 복원 불필요)
            quizContainer.classList.add('hidden');
            document.getElementById('quiz-result').classList.add('hidden');
            document.getElementById('quiz-settings').classList.remove('hidden');
            return;
        }
        // 퀴즈 설정창 - 홈으로 이동
        showHome();
        return;
    }

    // If not on home view, go to home
    if (currentView !== 'home-view') {
        showHome();
        return;
    }

    // On home view - 앱 종료 허용 (히스토리 복원 안함)
    // 브라우저가 자연스럽게 뒤로가기 처리

    /*
    // [DISABLED] Double back to exit feature - 주석 처리됨
    // On home view - handle double back to exit
    if (backPressedOnce) {
        // User pressed back twice - close the app
        if (backPressTimeout) {
            clearTimeout(backPressTimeout);
        }
        console.log('[PWA] Double back press - exiting app');

        if (isHashBasedNavigation()) {
            // Samsung Internet & iOS Safari: remove hash and go back
            window.removeEventListener('hashchange', handleBackButton);
            window.location.hash = '';
            window.history.back();
        } else {
            // Chrome, Firefox, Edge, etc.
            window.removeEventListener('popstate', handleBackButton);
            window.history.back();
        }
        return;
    }

    // First back press on home - restore history and show toast
    backPressedOnce = true;
    restoreHistoryEntry();
    console.log('[PWA] First back press on home - showing exit toast');
    showToast('한번 더 누르면 앱이 종료됩니다');

    // Reset after 2 seconds
    backPressTimeout = setTimeout(() => {
        backPressedOnce = false;
    }, 2000);
    */
}

// Initialize PWA back handler when DOM is ready
(function() {
    function init() {
        // Initialize for all modes (PWA and browser)
        // This provides consistent back button behavior
        initPWABackHandler();
        console.log('[PWA] Back button handler initialized');
    }

    // Check if DOM is already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready, call immediately
        init();
    }
})();
