// VocabMaster Main Application
let currentView = 'home';
let currentCategory = localStorage.getItem('selectedCategory') || 'all';

// Markdown bold to HTML bold converter
function formatBold(text) {
    if (!text) return '';
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
let currentPage = 1;
let itemsPerPage = 20;
let filteredWords = [];
let categorySelectorCallback = null;

// Save category to localStorage
function saveCategory(categoryId) {
    currentCategory = categoryId;
    localStorage.setItem('selectedCategory', categoryId);
}

// Flashcard state
let flashcardWords = [];
let flashcardIndex = 0;

// Blink state
let blinkInterval = null;
let blinkIndex = 0;
let blinkWords = [];

// Quiz state
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

// Initialize application
function initApp() {
    // Validate stored category
    validateStoredCategory();
    renderCategories();
    renderProgress();
    updateNavigation();
    updateAllCategoryBadges();
}

// Validate that stored category still exists
function validateStoredCategory() {
    if (currentCategory === 'all') return;

    // Check if VocabData is available and category exists
    if (typeof VocabData !== 'undefined' && VocabData.categories) {
        const categoryExists = VocabData.categories.some(cat => cat.id === currentCategory);
        if (!categoryExists) {
            saveCategory('all');
        }
    }
}

// Navigation
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === viewId.replace('-view', ''));
    });

    currentView = viewId;
}

function showHome() {
    showView('home-view');
    renderCategories();
    renderProgress();
}

function showWordList() {
    showView('list-view');
    populateCategorySelect();
    updateAllCategoryBadges();
    filterWords();
}

function showFlashcard() {
    showView('flashcard-view');
    updateAllCategoryBadges();
    initFlashcards();
}

function showBlink() {
    showView('blink-view');
    updateAllCategoryBadges();
    document.querySelector('.blink-settings').classList.remove('hidden');
    document.getElementById('blink-display-area').classList.add('hidden');
}

function showQuiz() {
    showView('quiz-view');
    updateAllCategoryBadges();
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
            // Calculate which page the word is on
            const displayMode = Storage.settings.displayMode || 'paging';
            if (displayMode === 'paging') {
                currentPage = Math.floor(wordIndex / itemsPerPage) + 1;
                renderWordList();
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

// Category rendering
function renderCategories() {
    const grid = document.getElementById('category-grid');
    const totalWords = VocabData.allWords.length;
    const overallProgress = Storage.getOverallProgress();

    // "All" category card
    const allSelected = currentCategory === 'all' ? 'selected' : '';
    let html = `
        <div class="category-card all-category-card ${allSelected}" onclick="selectCategory('all')">
            <div class="category-icon" style="background: linear-gradient(135deg, #4285f4, #34a853); color: white;">📚</div>
            <div class="category-name">전체 보기</div>
            <div class="category-count">${totalWords}개 단어</div>
            <div class="category-progress">
                <div class="category-progress-bar" style="width: ${overallProgress.percentage}%"></div>
            </div>
        </div>
    `;

    html += VocabData.categories.map(cat => {
        const progress = Storage.getCategoryProgress(cat.words);
        const isSelected = currentCategory === cat.id ? 'selected' : '';
        return `
            <div class="category-card ${isSelected}" onclick="selectCategory('${cat.id}')" style="--cat-color: ${cat.color}">
                <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color}">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${cat.words.length}개 단어</div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

function selectCategory(categoryId) {
    saveCategory(categoryId);
    updateAllCategoryBadges();
    showWordList();
    // 카테고리 선택 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Progress rendering
function renderProgress() {
    const container = document.getElementById('progress-cards');
    const overall = Storage.getOverallProgress();

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
    const select = document.getElementById('category-select');
    select.innerHTML = '<option value="all">전체 카테고리</option>';

    VocabData.categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}" ${cat.id === currentCategory ? 'selected' : ''}>${cat.name} (${cat.words.length})</option>`;
    });
}

function filterByCategory(categoryId) {
    saveCategory(categoryId);
    currentPage = 1;
    updateAllCategoryBadges();
    filterWords();
}

function filterByStatus(status) {
    currentPage = 1;
    filterWords(status);
}

function filterWords(statusFilter = 'all') {
    let words = VocabData.getWordsByCategory(currentCategory);

    // Filter by status
    if (statusFilter !== 'all') {
        words = words.filter(word => Storage.getWordStatus(word.id) === statusFilter);
    }

    filteredWords = words;
    renderWordList();
}

function renderWordList() {
    const container = document.getElementById('word-list');
    const displayMode = Storage.settings.displayMode || 'paging';

    let wordsToShow;
    if (displayMode === 'all') {
        wordsToShow = filteredWords;
    } else {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        wordsToShow = filteredWords.slice(start, end);
    }

    if (wordsToShow.length === 0) {
        container.innerHTML = '<div class="word-item"><em>표시할 단어가 없습니다</em></div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const showPronunciation = Storage.settings.showPronunciation;

    container.innerHTML = wordsToShow.map(word => {
        const status = Storage.getWordStatus(word.id);

        // Render meanings (support polysemy)
        let meaningsHtml = '';
        if (word.meanings && word.meanings.length > 0) {
            if (word.meanings.length === 1) {
                // Single meaning
                const m = word.meanings[0];
                const ex = m.examples && m.examples[0];
                meaningsHtml = `
                    <div class="word-meaning">${m.meaning}</div>
                    ${ex && ex.sentence ? `<div class="word-example">${formatBold(ex.sentence)}${ex.translation ? `<span class="word-translation"> - ${ex.translation}</span>` : ''}</div>` : ''}
                `;
            } else {
                // Multiple meanings (polysemy)
                meaningsHtml = word.meanings.map((m, idx) => {
                    const ex = m.examples && m.examples[0];
                    return `
                        <div class="word-meaning-item">
                            <span class="meaning-number">${idx + 1}.</span>
                            <span class="meaning-text">${m.meaning}</span>
                            ${ex && ex.sentence ? `<div class="word-example">${formatBold(ex.sentence)}${ex.translation ? `<span class="word-translation"> - ${ex.translation}</span>` : ''}</div>` : ''}
                        </div>
                    `;
                }).join('');
            }
        } else {
            // Fallback for old structure
            const example = word.examples && word.examples[0] ? word.examples[0].sentence : '';
            const translation = word.examples && word.examples[0] ? word.examples[0].translation : '';
            meaningsHtml = `
                <div class="word-meaning">${word.meaning}</div>
                ${example ? `<div class="word-example">${formatBold(example)}${translation ? `<span class="word-translation"> - ${translation}</span>` : ''}</div>` : ''}
            `;
        }

        return `
            <div class="word-item" data-id="${word.id}">
                <div class="word-status ${status}" onclick="toggleWordStatus('${word.id}')" title="클릭하여 상태 변경"></div>
                <div class="word-content">
                    <div class="word-main">
                        <span class="word-text">${word.word}</span>
                        ${showPronunciation && word.pronunciation ? `<span class="word-pronunciation">/${word.pronunciation}/</span>` : ''}
                    </div>
                    ${meaningsHtml}
                </div>
                <div class="word-actions">
                    <button class="word-action-btn" onclick="markMemorized('${word.id}')" title="암기 완료">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <button class="word-action-btn" onclick="markLearning('${word.id}')" title="학습 중">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    renderPagination();
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

function toggleWordStatus(wordId) {
    const newStatus = Storage.toggleStatus(wordId);
    const statusElement = document.querySelector(`[data-id="${wordId}"] .word-status`);
    if (statusElement) {
        statusElement.className = `word-status ${newStatus}`;
    }
    renderProgress();
}

function markMemorized(wordId) {
    Storage.markMemorized(wordId);
    const statusElement = document.querySelector(`[data-id="${wordId}"] .word-status`);
    if (statusElement) {
        statusElement.className = 'word-status memorized';
    }
    renderProgress();
    showToast('암기 완료로 표시했습니다');
}

function markLearning(wordId) {
    Storage.markLearning(wordId);
    const statusElement = document.querySelector(`[data-id="${wordId}"] .word-status`);
    if (statusElement) {
        statusElement.className = 'word-status learning';
    }
    renderProgress();
    showToast('학습 중으로 표시했습니다');
}

// Flashcard functions
function initFlashcards() {
    flashcardWords = VocabData.getWordsByCategory(currentCategory);
    if (flashcardWords.length === 0) {
        flashcardWords = VocabData.allWords;
    }
    flashcardIndex = 0;
    updateFlashcard();
    updateFlashcardProgress();
}

function updateFlashcard() {
    const card = document.getElementById('flashcard');
    card.classList.remove('flipped');

    if (flashcardWords.length === 0) return;

    const word = flashcardWords[flashcardIndex];
    document.getElementById('fc-word').textContent = word.word;
    document.getElementById('fc-pronunciation').textContent = word.pronunciation ? `/${word.pronunciation}/` : '';

    // Handle polysemy (multiple meanings)
    const meaningEl = document.getElementById('fc-meaning');
    const exampleEl = document.getElementById('fc-example');
    const translationEl = document.getElementById('fc-translation');

    if (word.meanings && word.meanings.length > 1) {
        // Multiple meanings
        meaningEl.innerHTML = word.meanings.map((m, idx) =>
            `<span class="fc-meaning-item"><span class="fc-meaning-num">${idx + 1}.</span> ${m.meaning}</span>`
        ).join('');

        // Show first example
        const firstMeaning = word.meanings[0];
        const ex = firstMeaning.examples && firstMeaning.examples[0];
        exampleEl.innerHTML = ex ? formatBold(ex.sentence) : '';
        translationEl.textContent = ex ? ex.translation : '';
    } else {
        // Single meaning or old structure
        meaningEl.textContent = word.meaning;
        const example = word.examples && word.examples[0];
        exampleEl.innerHTML = example ? formatBold(example.sentence) : '';
        translationEl.textContent = example ? example.translation : '';
    }
}

function updateFlashcardProgress() {
    document.getElementById('flashcard-current').textContent = flashcardIndex + 1;
    document.getElementById('flashcard-total').textContent = flashcardWords.length;
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
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
function startBlink() {
    const speed = parseInt(document.getElementById('blink-speed').value);
    const displayMode = document.getElementById('blink-display').value;

    blinkWords = VocabData.getWordsByCategory(currentCategory);
    if (blinkWords.length === 0) {
        blinkWords = VocabData.allWords;
    }
    blinkWords = blinkWords.sort(() => Math.random() - 0.5);
    blinkIndex = 0;

    document.querySelector('.blink-settings').classList.add('hidden');
    document.getElementById('blink-display-area').classList.remove('hidden');

    showBlinkWord(displayMode);

    blinkInterval = setInterval(() => {
        blinkIndex++;
        if (blinkIndex >= blinkWords.length) {
            blinkIndex = 0;
        }
        showBlinkWord(displayMode);
    }, speed);

    // Progress bar animation
    const progressBar = document.getElementById('blink-progress');
    progressBar.style.transition = `width ${speed}ms linear`;

    setInterval(() => {
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

    wordEl.style.animation = 'none';
    meaningEl.style.animation = 'none';

    void wordEl.offsetWidth; // Trigger reflow

    wordEl.style.animation = 'fadeInUp 0.3s ease';
    meaningEl.style.animation = 'fadeInUp 0.3s ease 0.1s both';

    if (displayMode === 'word') {
        wordEl.textContent = word.word;
        meaningEl.textContent = '';
    } else if (displayMode === 'meaning') {
        wordEl.textContent = word.meaning;
        meaningEl.textContent = '';
    } else {
        wordEl.textContent = word.word;
        meaningEl.textContent = word.meaning;
    }
}

function stopBlink() {
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }
    document.querySelector('.blink-settings').classList.remove('hidden');
    document.getElementById('blink-display-area').classList.add('hidden');

    Storage.recordStudySession(blinkIndex + 1);
}

// Quiz functions
function startQuiz() {
    const count = parseInt(document.getElementById('quiz-count').value);
    const type = document.getElementById('quiz-type').value;

    let words = VocabData.getWordsByCategory(currentCategory);
    if (words.length === 0) {
        words = VocabData.allWords;
    }

    // Shuffle and take required count
    words = words.sort(() => Math.random() - 0.5).slice(0, count);

    quizQuestions = words.map(word => {
        const questionType = type === 'mixed' ? (Math.random() > 0.5 ? 'meaning' : 'word') : type;

        // Get wrong options
        const wrongWords = VocabData.allWords
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        let question, answer, options;

        if (questionType === 'meaning') {
            question = word.word;
            answer = word.meaning;
            options = [word.meaning, ...wrongWords.map(w => w.meaning)].sort(() => Math.random() - 0.5);
        } else {
            question = word.meaning;
            answer = word.word;
            options = [word.word, ...wrongWords.map(w => w.word)].sort(() => Math.random() - 0.5);
        }

        return { question, answer, options, word };
    });

    quizIndex = 0;
    quizScore = 0;

    document.getElementById('quiz-settings').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-total').textContent = quizQuestions.length;

    showQuizQuestion();
}

function showQuizQuestion() {
    const q = quizQuestions[quizIndex];

    document.getElementById('quiz-current').textContent = quizIndex + 1;
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-question').textContent = q.question;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" onclick="selectQuizOption('${opt.replace(/'/g, "\\'")}', this)">${opt}</button>
    `).join('');

    document.getElementById('quiz-feedback').classList.add('hidden');
}

function selectQuizOption(selected, button) {
    const q = quizQuestions[quizIndex];
    const isCorrect = selected === q.answer;

    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.disabled = true;
        if (opt.textContent === q.answer) {
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
function toggleSettings() {
    document.getElementById('settings-modal').classList.toggle('hidden');
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
    Storage.exportData();
    showToast('데이터를 내보냈습니다');
}

function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = Storage.importData(e.target.result, true); // merge mode
        if (result && result.success) {
            showToast('데이터를 병합하여 가져왔습니다 (높은 상태 유지)');
            renderCategories();
            renderProgress();
            if (currentView === 'list-view') {
                filterWords();
            }
        } else {
            showToast('데이터 가져오기 실패');
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

function resetAllData() {
    if (confirm('정말 모든 학습 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        Storage.resetAll();
        showToast('학습 기록이 초기화되었습니다');
        renderCategories();
        renderProgress();
        if (currentView === 'list-view') {
            filterWords();
        }
    }
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
let ttsEnabled = true;

function toggleTTS() {
    ttsEnabled = document.getElementById('tts-toggle').checked;
    localStorage.setItem('ttsEnabled', ttsEnabled);
}

function loadTTSSetting() {
    const saved = localStorage.getItem('ttsEnabled');
    if (saved !== null) {
        ttsEnabled = saved === 'true';
    }
    const toggle = document.getElementById('tts-toggle');
    if (toggle) {
        toggle.checked = ttsEnabled;
    }
}

function speakCurrentWord() {
    if (!ttsEnabled || flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    VocabData.speak(word.word);
}

function speakCurrentExample() {
    if (!ttsEnabled || flashcardWords.length === 0) return;
    const word = flashcardWords[flashcardIndex];
    if (word.examples && word.examples[0]) {
        VocabData.speak(word.examples[0].sentence);
    }
}

function speakWord(text) {
    if (!ttsEnabled) return;
    VocabData.speak(text);
}

// Override initApp to include new settings
const originalInitApp = initApp;
initApp = function() {
    loadTTSSetting();
    loadDisplaySettings();
    originalInitApp();
};

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

    // Build category list with "All" option
    const totalWords = VocabData.allWords.length;
    let html = `
        <div class="category-select-item all-category ${currentCategory === 'all' ? 'selected' : ''}" onclick="selectCategoryFromModal('all', '${mode}')">
            <div class="category-select-icon" style="background: linear-gradient(135deg, #4285f4, #34a853); color: white;">📚</div>
            <div class="category-select-info">
                <div class="category-select-name">전체 보기</div>
                <div class="category-select-count">${totalWords}개 단어</div>
            </div>
        </div>
    `;

    html += VocabData.categories.map(cat => `
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
            // Also update the select dropdown
            const select = document.getElementById('category-select');
            if (select) select.value = categoryId;
            break;
    }

    // 카테고리 변경 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`'${getCategoryInfo(categoryId).name}' 카테고리로 변경됨`);
}
