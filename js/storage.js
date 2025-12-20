// LocalStorage Management for VocabMaster
const Storage = {
    KEYS: {
        PROGRESS: 'vocabmaster_progress',
        SETTINGS: 'vocabmaster_settings',
        STATS: 'vocabmaster_stats',
        CUSTOM_CATEGORIES: 'vocabmaster_custom_categories',
        BACKUP_INFO: 'vocabmaster_backup_info',
        DISABLED_CATEGORIES: 'vocabmaster_disabled_categories'
    },

    // Progress tracking for each word
    progress: {},

    // User settings
    settings: {
        darkMode: false,
        showPronunciation: true,
        displayMode: 'paging', // 'all' or 'paging'
        itemsPerPage: 20,
        backupReminder: {
            enabled: true,
            frequency: 7 // days (0: disabled, 1, 3, 7, 14, 30)
        },
        // UI preferences for each view
        ui: {
            wordList: {
                statusFilter: 'all',
                viewMode: 'full'
            },
            flashcard: {
                statusFilter: 'all',
                autoTTS: false
            },
            blink: {
                statusFilter: 'all',
                speed: '2000',
                displayMode: 'both',
                repeatCount: '2',
                autoTTS: true
            },
            quiz: {
                statusFilter: 'all',
                count: '20',
                type: 'meaning'
            }
        }
    },

    // Backup tracking
    backupInfo: {
        lastBackupDate: null,
        lastDataModifiedDate: null
    },

    // Learning statistics
    stats: {
        totalStudied: 0,
        totalMemorized: 0,
        streakDays: 0,
        lastStudyDate: null,
        studyHistory: []
    },

    // Custom categories created by user
    customCategories: [],

    // Disabled category IDs
    disabledCategories: [],

    // Track if already initialized
    initialized: false,

    // Initialize storage
    init() {
        if (this.initialized) return;
        this.loadProgress();
        this.loadSettings();
        this.loadStats();
        this.loadCustomCategories();
        this.loadBackupInfo();
        this.loadDisabledCategories();
        this.migrateWordsToNewFormat(); // Migrate old format words
        this.applySettings();
        this.initialized = true;
    },

    // Migrate old format words to new meanings array format
    migrateWordsToNewFormat() {
        let migrated = false;
        this.customCategories.forEach(category => {
            if (category.words) {
                category.words.forEach(word => {
                    // Check if word needs migration (has meaning but no meanings array)
                    if (word.meaning && (!word.meanings || word.meanings.length === 0)) {
                        // Convert old format to new format
                        const meanings = [];
                        const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);

                        meaningStrings.forEach((m, index) => {
                            const meaningObj = {
                                meaning: m,
                                partOfSpeech: word.partOfSpeech || ''
                            };
                            // Attach examples only to first meaning
                            if (index === 0 && word.examples && word.examples.length > 0) {
                                meaningObj.examples = word.examples;
                            }
                            meanings.push(meaningObj);
                        });

                        word.meanings = meanings;
                        migrated = true;
                    }
                });
            }
        });

        if (migrated) {
            this.saveCustomCategories();
            console.log('Migrated words to new meanings format');
        }
    },

    // Load progress from localStorage
    loadProgress() {
        try {
            const data = localStorage.getItem(this.KEYS.PROGRESS);
            if (data) {
                this.progress = JSON.parse(data);
            }
        } catch (e) {
            console.error('Error loading progress:', e);
            this.progress = {};
        }
    },

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(this.progress));
            this.markDataModified();
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    // Load settings from localStorage
    loadSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            if (data) {
                const saved = JSON.parse(data);
                // Deep merge for nested objects
                this.settings = {
                    ...this.settings,
                    ...saved,
                    backupReminder: {
                        ...this.settings.backupReminder,
                        ...(saved.backupReminder || {})
                    },
                    ui: {
                        wordList: {
                            ...this.settings.ui.wordList,
                            ...(saved.ui?.wordList || {})
                        },
                        flashcard: {
                            ...this.settings.ui.flashcard,
                            ...(saved.ui?.flashcard || {})
                        },
                        blink: {
                            ...this.settings.ui.blink,
                            ...(saved.ui?.blink || {})
                        },
                        quiz: {
                            ...this.settings.ui.quiz,
                            ...(saved.ui?.quiz || {})
                        }
                    }
                };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    },

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    },

    // Load stats from localStorage
    loadStats() {
        try {
            const data = localStorage.getItem(this.KEYS.STATS);
            if (data) {
                this.stats = { ...this.stats, ...JSON.parse(data) };
            }
        } catch (e) {
            console.error('Error loading stats:', e);
        }
    },

    // Save stats to localStorage
    saveStats() {
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(this.stats));
            this.markDataModified();
        } catch (e) {
            console.error('Error saving stats:', e);
        }
    },

    // Load custom categories from localStorage
    loadCustomCategories() {
        try {
            const data = localStorage.getItem(this.KEYS.CUSTOM_CATEGORIES);
            if (data) {
                this.customCategories = JSON.parse(data);
            }
        } catch (e) {
            console.error('Error loading custom categories:', e);
            this.customCategories = [];
        }
    },

    // Save custom categories to localStorage
    saveCustomCategories() {
        try {
            localStorage.setItem(this.KEYS.CUSTOM_CATEGORIES, JSON.stringify(this.customCategories));
            this.markDataModified();
        } catch (e) {
            console.error('Error saving custom categories:', e);
        }
    },

    // Load backup info from localStorage
    loadBackupInfo() {
        try {
            const data = localStorage.getItem(this.KEYS.BACKUP_INFO);
            if (data) {
                this.backupInfo = { ...this.backupInfo, ...JSON.parse(data) };
            }
        } catch (e) {
            console.error('Error loading backup info:', e);
        }
    },

    // Save backup info to localStorage
    saveBackupInfo() {
        try {
            localStorage.setItem(this.KEYS.BACKUP_INFO, JSON.stringify(this.backupInfo));
        } catch (e) {
            console.error('Error saving backup info:', e);
        }
    },

    // Mark data as modified (for backup reminder tracking)
    markDataModified() {
        this.backupInfo.lastDataModifiedDate = new Date().toISOString();
        this.saveBackupInfo();
    },

    // Record backup completed
    recordBackup() {
        this.backupInfo.lastBackupDate = new Date().toISOString();
        this.saveBackupInfo();
    },

    // Check if backup reminder should be shown
    shouldShowBackupReminder() {
        const settings = this.settings.backupReminder || { enabled: true, frequency: 7 };

        // Check if enabled
        if (!settings.enabled || settings.frequency === 0) {
            return false;
        }

        // Check if data has been modified since last backup
        if (!this.backupInfo.lastDataModifiedDate) {
            return false; // No data changes
        }

        // If never backed up, check if data exists
        if (!this.backupInfo.lastBackupDate) {
            return true; // Data modified but never backed up
        }

        // Check if data modified after last backup
        const lastBackup = new Date(this.backupInfo.lastBackupDate);
        const lastModified = new Date(this.backupInfo.lastDataModifiedDate);

        if (lastModified <= lastBackup) {
            return false; // No changes since last backup
        }

        // Check if frequency period has passed
        const now = new Date();
        const daysSinceBackup = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));

        return daysSinceBackup >= settings.frequency;
    },

    // Load disabled categories from localStorage
    loadDisabledCategories() {
        try {
            const data = localStorage.getItem(this.KEYS.DISABLED_CATEGORIES);
            if (data) {
                this.disabledCategories = JSON.parse(data);
            }
        } catch (e) {
            console.error('Error loading disabled categories:', e);
            this.disabledCategories = [];
        }
    },

    // Save disabled categories to localStorage
    saveDisabledCategories() {
        try {
            localStorage.setItem(this.KEYS.DISABLED_CATEGORIES, JSON.stringify(this.disabledCategories));
        } catch (e) {
            console.error('Error saving disabled categories:', e);
        }
    },

    // Check if category is disabled
    isCategoryDisabled(categoryId) {
        return this.disabledCategories.includes(categoryId);
    },

    // Toggle category enabled/disabled
    toggleCategoryEnabled(categoryId) {
        const index = this.disabledCategories.indexOf(categoryId);
        if (index === -1) {
            // Currently enabled, disable it
            this.disabledCategories.push(categoryId);
        } else {
            // Currently disabled, enable it
            this.disabledCategories.splice(index, 1);
        }
        this.saveDisabledCategories();
        return !this.isCategoryDisabled(categoryId);
    },

    // Check if a custom category name already exists
    customCategoryNameExists(name, excludeId = null) {
        return this.customCategories.some(c =>
            c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
        );
    },

    // Create a new custom category
    createCustomCategory(name, icon = '📁', color = '#6c757d') {
        // Check for duplicate name
        if (this.customCategoryNameExists(name)) {
            return null; // Return null if duplicate
        }

        const id = 'custom_' + Date.now();
        const category = {
            id,
            name,
            icon,
            color,
            isCustom: true,
            createdAt: new Date().toISOString(),
            words: []
        };
        this.customCategories.push(category);
        this.saveCustomCategories();
        return category;
    },

    // Update a custom category
    updateCustomCategory(categoryId, updates) {
        const index = this.customCategories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            this.customCategories[index] = { ...this.customCategories[index], ...updates };
            this.saveCustomCategories();
            return this.customCategories[index];
        }
        return null;
    },

    // Delete a custom category
    deleteCustomCategory(categoryId) {
        const index = this.customCategories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            this.customCategories.splice(index, 1);
            this.saveCustomCategories();
            return true;
        }
        return false;
    },

    // Get a custom category by ID
    getCustomCategory(categoryId) {
        return this.customCategories.find(c => c.id === categoryId);
    },

    // Add word to custom category (with duplicate handling)
    // Supports both old format (meaning string + examples) and new format (meanings array)
    addWordToCustomCategory(categoryId, word) {
        const category = this.getCustomCategory(categoryId);
        if (!category) return null;

        // Normalize input to meanings array format
        let inputMeanings = this.normalizeToMeaningsArray(word);

        // Check if word already exists (case-insensitive)
        const existingWord = category.words.find(w =>
            w.word.toLowerCase() === word.word.toLowerCase()
        );

        if (existingWord) {
            // Word exists - merge meanings
            const existingMeaningsArray = existingWord.meanings || this.convertOldFormatToMeanings(existingWord);
            const mergedMeanings = [...existingMeaningsArray];
            const addedMeanings = [];

            inputMeanings.forEach(newMeaning => {
                const exists = mergedMeanings.some(m =>
                    m.meaning.toLowerCase() === newMeaning.meaning.toLowerCase()
                );
                if (!exists) {
                    mergedMeanings.push(newMeaning);
                    addedMeanings.push(newMeaning);
                }
            });

            // Update word data
            existingWord.pronunciation = word.pronunciation || existingWord.pronunciation;
            existingWord.partOfSpeech = word.partOfSpeech || existingWord.partOfSpeech || '';
            existingWord.meanings = mergedMeanings;
            existingWord.meaning = mergedMeanings.map(m => m.meaning).join(', ');
            existingWord.updatedAt = new Date().toISOString();
            // Remove old examples field if exists (now in meanings)
            delete existingWord.examples;

            if (addedMeanings.length > 0) {
                this.setWordStatus(existingWord.id, 'new');
                this.saveCustomCategories();
                return { ...existingWord, action: 'polysemy_added', addedMeanings };
            } else {
                this.saveCustomCategories();
                return { ...existingWord, action: 'updated' };
            }
        } else {
            // New word
            const wordId = 'custom_word_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const newWord = {
                id: wordId,
                word: word.word,
                pronunciation: word.pronunciation || '',
                partOfSpeech: word.partOfSpeech || '',
                meanings: inputMeanings,
                meaning: inputMeanings.map(m => m.meaning).join(', '),
                createdAt: new Date().toISOString()
            };
            category.words.push(newWord);
            this.saveCustomCategories();
            return { ...newWord, action: 'created' };
        }
    },

    // Normalize input to meanings array format
    normalizeToMeaningsArray(word) {
        // If already has meanings array, use it
        if (word.meanings && Array.isArray(word.meanings) && word.meanings.length > 0) {
            return word.meanings;
        }
        // Convert old format (meaning string + examples) to meanings array
        const meanings = [];
        if (word.meaning) {
            // Split by comma for multiple meanings in single string
            const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);
            meaningStrings.forEach((m, index) => {
                const meaningObj = { meaning: m };
                // Attach examples only to first meaning in old format
                if (index === 0 && word.examples && word.examples.length > 0) {
                    meaningObj.examples = word.examples;
                }
                meanings.push(meaningObj);
            });
        }
        return meanings;
    },

    // Convert old format word to meanings array
    convertOldFormatToMeanings(word) {
        if (word.meanings && Array.isArray(word.meanings)) {
            return word.meanings;
        }
        const meanings = [];
        if (word.meaning) {
            const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);
            meaningStrings.forEach((m, index) => {
                const meaningObj = { meaning: m };
                if (index === 0 && word.examples && word.examples.length > 0) {
                    meaningObj.examples = word.examples;
                }
                meanings.push(meaningObj);
            });
        }
        return meanings;
    },

    // Update word in custom category
    updateWordInCustomCategory(categoryId, wordId, updates) {
        const category = this.getCustomCategory(categoryId);
        if (category) {
            const wordIndex = category.words.findIndex(w => w.id === wordId);
            if (wordIndex !== -1) {
                const existingWord = category.words[wordIndex];

                // Update word data
                existingWord.word = updates.word || existingWord.word;
                existingWord.pronunciation = updates.pronunciation !== undefined ? updates.pronunciation : existingWord.pronunciation;

                // Update meanings if provided
                if (updates.meanings) {
                    existingWord.meanings = updates.meanings;
                    existingWord.meaning = updates.meanings.map(m => m.meaning).join(', ');
                    // Clean up old examples field
                    delete existingWord.examples;
                }

                existingWord.updatedAt = new Date().toISOString();

                this.saveCustomCategories();
                return existingWord;
            }
        }
        return null;
    },

    // Delete word from custom category
    deleteWordFromCustomCategory(categoryId, wordId) {
        const category = this.getCustomCategory(categoryId);
        if (category) {
            const wordIndex = category.words.findIndex(w => w.id === wordId);
            if (wordIndex !== -1) {
                category.words.splice(wordIndex, 1);
                this.saveCustomCategories();
                return true;
            }
        }
        return false;
    },

    // Import words from JSON
    // Supports both old format (meaning string) and new format (meanings array)
    importWordsFromJSON(categoryId, jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            const words = Array.isArray(data) ? data : (data.words || []);
            const stats = { created: 0, updated: 0, polysemy: 0 };

            words.forEach(word => {
                // Accept word with either meanings array or meaning string
                if (word.word && (word.meanings || word.meaning)) {
                    const wordData = {
                        word: word.word,
                        pronunciation: word.pronunciation || '',
                        partOfSpeech: word.partOfSpeech || ''
                    };

                    // New format with meanings array
                    if (word.meanings && Array.isArray(word.meanings)) {
                        wordData.meanings = word.meanings;
                    } else {
                        // Old format - convert to meanings array
                        wordData.meaning = word.meaning;
                        wordData.examples = word.examples || (word.example ? [{
                            sentence: word.example,
                            translation: word.translation || ''
                        }] : []);
                    }

                    const result = this.addWordToCustomCategory(categoryId, wordData);
                    if (result) {
                        if (result.action === 'created') stats.created++;
                        else if (result.action === 'updated') stats.updated++;
                        else if (result.action === 'polysemy_added') stats.polysemy++;
                    }
                }
            });

            const total = stats.created + stats.updated + stats.polysemy;
            return { success: true, imported: total, ...stats };
        } catch (e) {
            console.error('Error importing JSON:', e);
            return { success: false, error: e.message };
        }
    },

    // Import words from CSV (format: word,pronunciation,partOfSpeech,meaning,example,translation)
    importWordsFromCSV(categoryId, csvData) {
        try {
            const lines = csvData.trim().split('\n');
            const stats = { created: 0, updated: 0, polysemy: 0 };
            // Skip header if present
            const startIndex = lines[0].toLowerCase().includes('word') ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const parts = this.parseCSVLine(lines[i]);
                if (parts.length >= 2) {
                    const result = this.addWordToCustomCategory(categoryId, {
                        word: parts[0].trim(),
                        pronunciation: parts[1]?.trim() || '',
                        partOfSpeech: parts[2]?.trim() || '',
                        meaning: parts[3]?.trim() || parts[2]?.trim() || parts[1]?.trim() || '',
                        examples: parts[4] ? [{
                            sentence: parts[4].trim(),
                            translation: parts[5]?.trim() || ''
                        }] : []
                    });
                    if (result) {
                        if (result.action === 'created') stats.created++;
                        else if (result.action === 'updated') stats.updated++;
                        else if (result.action === 'polysemy_added') stats.polysemy++;
                    }
                }
            }

            const total = stats.created + stats.updated + stats.polysemy;
            return { success: true, imported: total, ...stats };
        } catch (e) {
            console.error('Error importing CSV:', e);
            return { success: false, error: e.message };
        }
    },

    // Parse CSV line handling quoted values
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    },

    // Apply settings to UI
    applySettings() {
        // Dark mode
        if (this.settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = true;
        }

        // Pronunciation
        const pronToggle = document.getElementById('pronunciation-toggle');
        if (pronToggle) pronToggle.checked = this.settings.showPronunciation;
    },

    // Get word status
    getWordStatus(wordId) {
        return this.progress[wordId] || 'new';
    },

    // Set word status
    setWordStatus(wordId, status) {
        const oldStatus = this.progress[wordId];
        this.progress[wordId] = status;
        this.saveProgress();

        // Update stats
        if (status === 'memorized' && oldStatus !== 'memorized') {
            this.stats.totalMemorized++;
            this.saveStats();
        } else if (oldStatus === 'memorized' && status !== 'memorized') {
            this.stats.totalMemorized = Math.max(0, this.stats.totalMemorized - 1);
            this.saveStats();
        }
    },

    // Mark word as memorized
    markMemorized(wordId) {
        this.setWordStatus(wordId, 'memorized');
    },

    // Mark word as learning
    markLearning(wordId) {
        this.setWordStatus(wordId, 'learning');
    },

    // Mark word as new (reset)
    markNew(wordId) {
        this.setWordStatus(wordId, 'new');
    },

    // Toggle word status
    toggleStatus(wordId) {
        const current = this.getWordStatus(wordId);
        const statusCycle = ['new', 'learning', 'memorized'];
        const currentIndex = statusCycle.indexOf(current);
        const nextIndex = (currentIndex + 1) % statusCycle.length;
        this.setWordStatus(wordId, statusCycle[nextIndex]);
        return statusCycle[nextIndex];
    },

    // Get progress stats for a category
    getCategoryProgress(words) {
        const total = words.length;
        if (total === 0) return { total: 0, memorized: 0, learning: 0, new: 0, percentage: 0 };

        const counts = { memorized: 0, learning: 0, new: 0 };
        words.forEach(word => {
            const status = this.getWordStatus(word.id);
            counts[status] = (counts[status] || 0) + 1;
        });

        // Count 'new' as all remaining
        counts.new = total - counts.memorized - counts.learning;

        return {
            total,
            ...counts,
            percentage: Math.round((counts.memorized / total) * 100)
        };
    },

    // Get overall progress
    getOverallProgress() {
        return this.getCategoryProgress(VocabData.allWords);
    },

    // Record study session
    recordStudySession(wordsStudied) {
        const today = new Date().toISOString().split('T')[0];

        if (this.stats.lastStudyDate !== today) {
            // Check streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.stats.lastStudyDate === yesterdayStr) {
                this.stats.streakDays++;
            } else if (this.stats.lastStudyDate !== today) {
                this.stats.streakDays = 1;
            }

            this.stats.lastStudyDate = today;
        }

        this.stats.totalStudied += wordsStudied;

        // Add to history
        this.stats.studyHistory.push({
            date: today,
            words: wordsStudied,
            timestamp: Date.now()
        });

        // Keep only last 30 days of history
        if (this.stats.studyHistory.length > 30) {
            this.stats.studyHistory = this.stats.studyHistory.slice(-30);
        }

        this.saveStats();
    },

    // Export all data
    exportData() {
        const data = {
            type: 'vocabmaster_backup',
            version: Version.CURRENT,
            exportDate: new Date().toISOString(),
            progress: this.progress,
            settings: this.settings,
            stats: this.stats,
            customCategories: this.customCategories,
            disabledCategories: this.disabledCategories
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vocabmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Record backup date
        this.recordBackup();

        return true;
    },

    // Import data
    // Import and merge data (higher status wins)
    importData(jsonData, mergeMode = true) {
        try {
            let data = JSON.parse(jsonData);
            const statusPriority = { 'new': 0, 'learning': 1, 'memorized': 2 };

            // Version check and migration
            const importVersion = data.version || '0.0.0';
            if (!Version.isCompatible(importVersion)) {
                console.warn('Warning: Import version newer than current app version');
            }

            // Migrate data if from older version
            if (Version.compare(Version.normalize(importVersion), Version.CURRENT) < 0) {
                data = Version.migrate(data, importVersion);
                console.log('Data migrated from', importVersion, 'to', Version.CURRENT);
            }

            if (data.progress) {
                if (mergeMode) {
                    // Merge: keep the higher status between current and imported
                    Object.entries(data.progress).forEach(([wordId, importedStatus]) => {
                        const currentStatus = this.progress[wordId] || 'new';
                        const currentPriority = statusPriority[currentStatus] || 0;
                        const importedPriority = statusPriority[importedStatus] || 0;

                        // Keep the higher status
                        if (importedPriority > currentPriority) {
                            this.progress[wordId] = importedStatus;
                        }
                    });
                } else {
                    // Replace mode
                    this.progress = data.progress;
                }
                this.saveProgress();
            }

            if (data.settings) {
                this.settings = { ...this.settings, ...data.settings };
                this.saveSettings();
                this.applySettings();
            }

            if (data.stats) {
                // Merge stats: take the higher values
                this.stats.totalStudied = Math.max(this.stats.totalStudied || 0, data.stats.totalStudied || 0);
                this.stats.streakDays = Math.max(this.stats.streakDays || 0, data.stats.streakDays || 0);

                // Recalculate memorized count from merged progress
                this.stats.totalMemorized = Object.values(this.progress).filter(s => s === 'memorized').length;

                // Merge study history (combine and deduplicate by date)
                if (data.stats.studyHistory) {
                    const historyMap = new Map();
                    [...(this.stats.studyHistory || []), ...data.stats.studyHistory].forEach(entry => {
                        const key = entry.date;
                        if (!historyMap.has(key) || historyMap.get(key).words < entry.words) {
                            historyMap.set(key, entry);
                        }
                    });
                    this.stats.studyHistory = Array.from(historyMap.values())
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(-30);
                }

                this.saveStats();
            }

            // Import custom categories
            if (data.customCategories && Array.isArray(data.customCategories)) {
                if (mergeMode) {
                    // Merge: add new categories, merge words in existing ones
                    data.customCategories.forEach(importedCat => {
                        const existingCat = this.customCategories.find(c => c.id === importedCat.id);
                        if (existingCat) {
                            // Merge words
                            importedCat.words.forEach(word => {
                                if (!existingCat.words.find(w => w.id === word.id)) {
                                    existingCat.words.push(word);
                                }
                            });
                        } else {
                            // Add new category
                            this.customCategories.push(importedCat);
                        }
                    });
                } else {
                    // Replace mode
                    this.customCategories = data.customCategories;
                }
                this.saveCustomCategories();
            }

            // Import disabled categories
            if (data.disabledCategories && Array.isArray(data.disabledCategories)) {
                if (mergeMode) {
                    // Merge: add disabled categories that aren't already in the list
                    data.disabledCategories.forEach(catId => {
                        if (!this.disabledCategories.includes(catId)) {
                            this.disabledCategories.push(catId);
                        }
                    });
                } else {
                    // Replace mode
                    this.disabledCategories = data.disabledCategories;
                }
                this.saveDisabledCategories();
            }

            return { success: true, merged: mergeMode };
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    },

    // Reset all data
    resetAll() {
        this.progress = {};
        this.stats = {
            totalStudied: 0,
            totalMemorized: 0,
            streakDays: 0,
            lastStudyDate: null,
            studyHistory: []
        };

        localStorage.removeItem(this.KEYS.PROGRESS);
        localStorage.removeItem(this.KEYS.STATS);
    }
};

// Note: Storage.init() is called from data.js to ensure correct initialization order
