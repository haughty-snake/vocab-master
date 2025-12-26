/**
 * Auto-scan and bundle all JSON data files from data directory
 *
 * Simply add a JSON file to data/ folder with unified format:
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
 *       ]
 *     }
 *   ]
 * }
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Default metadata for categories without full metadata
const defaultMeta = {
    icon: '📁',
    color: '#6c757d'
};

/**
 * Validate if JSON has unified format
 * Required: id, name, words (array)
 * Optional: icon, color
 */
function isUnifiedFormat(data) {
    return data &&
        typeof data.id === 'string' &&
        typeof data.name === 'string' &&
        Array.isArray(data.words);
}

/**
 * Validate word format
 * Required: id, word, meanings (array)
 */
function isValidWord(word) {
    return word &&
        typeof word.id === 'string' &&
        typeof word.word === 'string' &&
        Array.isArray(word.meanings);
}

/**
 * Ensure category has all required fields with defaults
 */
function normalizeCategory(data, filename) {
    const categoryId = data.id || path.basename(filename, '.json');

    return {
        id: categoryId,
        name: data.name || categoryId,
        icon: data.icon || defaultMeta.icon,
        color: data.color || defaultMeta.color,
        words: data.words.map((word, index) => normalizeWord(word, categoryId, index))
    };
}

/**
 * Ensure word has all required fields with defaults
 */
function normalizeWord(word, categoryId, index) {
    // Generate ID if missing
    const wordId = word.id || generateWordId(categoryId, word.word, index);

    return {
        id: wordId,
        word: word.word || '',
        pronunciation: word.pronunciation || '',
        subcategory: word.subcategory || '',
        meanings: word.meanings || [],
        // Optional fields (preserve if exist)
        ...(word.pastTense && { pastTense: word.pastTense }),
        ...(word.pastParticiple && { pastParticiple: word.pastParticiple }),
        ...(word.antonym && { antonym: word.antonym })
    };
}

/**
 * Generate unique word ID
 */
function generateWordId(categoryId, word, index) {
    const cleanWord = (word || 'unknown').replace(/[^a-zA-Z0-9가-힣]/g, '_').toLowerCase();
    return `${categoryId}_${cleanWord}_${index}`;
}

/**
 * Scan data directory and bundle all valid JSON files
 */
function bundleAll() {
    console.log('Scanning data directory:', dataDir);
    console.log('');

    const allResults = {};
    let totalWords = 0;
    let skippedFiles = [];

    // Get all JSON files in data directory
    const files = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.json'))
        .sort();

    console.log(`Found ${files.length} JSON files\n`);

    files.forEach(filename => {
        const filePath = path.join(dataDir, filename);

        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);

            // Check if unified format
            if (!isUnifiedFormat(data)) {
                console.log(`⚠️  Skipped ${filename}: Not unified format (missing id, name, or words)`);
                skippedFiles.push({ file: filename, reason: 'Invalid format' });
                return;
            }

            // Normalize and validate
            const category = normalizeCategory(data, filename);

            // Validate words
            const invalidWords = category.words.filter(w => !w.word);
            if (invalidWords.length > 0) {
                console.log(`⚠️  Warning ${filename}: ${invalidWords.length} words without 'word' field`);
            }

            allResults[category.id] = category;
            totalWords += category.words.length;
            console.log(`✓ Loaded ${filename}: ${category.name} (${category.words.length} words)`);

        } catch (error) {
            console.log(`✗ Error ${filename}: ${error.message}`);
            skippedFiles.push({ file: filename, reason: error.message });
        }
    });

    // Generate bundle
    const bundlePath = path.join(__dirname, '..', 'js', 'data.bundle.js');
    const bundleContent = `// Auto-generated data bundle - DO NOT EDIT
// Generated: ${new Date().toISOString()}
// Categories: ${Object.keys(allResults).length}
// Total words: ${totalWords}

const DATA_BUNDLE = ${JSON.stringify(allResults, null, 2)};
`;
    fs.writeFileSync(bundlePath, bundleContent, 'utf8');

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50));
    console.log(`✓ Generated: js/data.bundle.js`);
    console.log(`✓ Categories: ${Object.keys(allResults).length}`);
    console.log(`✓ Total words: ${totalWords}`);

    if (skippedFiles.length > 0) {
        console.log(`\n⚠️  Skipped files: ${skippedFiles.length}`);
        skippedFiles.forEach(s => console.log(`   - ${s.file}: ${s.reason}`));
    }

    console.log('\n' + '='.repeat(50));
    console.log('To add a new category:');
    console.log('1. Create a JSON file in data/ folder');
    console.log('2. Use unified format with id, name, icon, color, words');
    console.log('3. Run: node scripts/convertToUnifiedFormat.js');
    console.log('='.repeat(50));
}

// Run bundler
bundleAll();
