// LocalStorage Management for VocabMaster
const Storage = {
    KEYS: {
        PROGRESS: 'vocabmaster_progress',
        SETTINGS: 'vocabmaster_settings',
        STATS: 'vocabmaster_stats'
    },

    // Progress tracking for each word
    progress: {},

    // User settings
    settings: {
        darkMode: false,
        showPronunciation: true
    },

    // Learning statistics
    stats: {
        totalStudied: 0,
        totalMemorized: 0,
        streakDays: 0,
        lastStudyDate: null,
        studyHistory: []
    },

    // Initialize storage
    init() {
        this.loadProgress();
        this.loadSettings();
        this.loadStats();
        this.applySettings();
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
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    // Load settings from localStorage
    loadSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            if (data) {
                this.settings = { ...this.settings, ...JSON.parse(data) };
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
        } catch (e) {
            console.error('Error saving stats:', e);
        }
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
            progress: this.progress,
            settings: this.settings,
            stats: this.stats,
            exportDate: new Date().toISOString(),
            version: '1.0'
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

        return true;
    },

    // Import data
    // Import and merge data (higher status wins)
    importData(jsonData, mergeMode = true) {
        try {
            const data = JSON.parse(jsonData);
            const statusPriority = { 'new': 0, 'learning': 1, 'memorized': 2 };

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

// Initialize storage on load
document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
});
