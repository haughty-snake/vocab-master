const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Parse table-based markdown (명사, 동사, 형용사, 부사, 전치사접속사)
function parseTableMarkdown(content, hasVerbForms = false) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Category header (## 숫자. 카테고리명)
        const categoryMatch = line.match(/^##\s*\d+\.\s*(.+?)\s*(?:\((.+?)\))?\s*-?\s*\d*개?$/);
        if (categoryMatch) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                nameKo: categoryMatch[1].trim(),
                nameEn: categoryMatch[2] ? categoryMatch[2].trim() : '',
                words: []
            };
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            // Skip header and separator rows
            if (cells[0] === '영어' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 5) {
                if (hasVerbForms && cells.length >= 7) {
                    // Verb format: 영어, 발음기호, 뜻, 과거형, 과거분사, 예문, 해석
                    currentCategory.words.push({
                        word: cells[0],
                        pronunciation: cells[1],
                        meaning: cells[2],
                        pastTense: cells[3],
                        pastParticiple: cells[4],
                        example: cells[5],
                        translation: cells[6] || ''
                    });
                } else {
                    // Standard format: 영어, 발음기호, 뜻, 예문, 해석
                    currentCategory.words.push({
                        word: cells[0],
                        pronunciation: cells[1],
                        meaning: cells[2],
                        example: cells[3],
                        translation: cells[4] || ''
                    });
                }
            }
        }
    }

    if (currentCategory) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 구동사.md (phrasal verbs)
function parsePhrasalVerbs(content) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let currentPhrasalVerb = null;
    let currentMeaning = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Main category (## 일상생활 구동사)
        const mainCategoryMatch = line.match(/^##\s+(.+구동사)$/);
        if (mainCategoryMatch) {
            if (currentCategory && currentCategory.phrasalVerbs.length > 0) {
                categories.push(currentCategory);
            }
            currentCategory = {
                name: mainCategoryMatch[1],
                phrasalVerbs: []
            };
            continue;
        }

        // Phrasal verb header (### wake up /weɪk ʌp/)
        const pvMatch = line.match(/^###\s+(.+?)\s+\/(.+?)\/$/);
        if (pvMatch && currentCategory) {
            if (currentPhrasalVerb) {
                currentCategory.phrasalVerbs.push(currentPhrasalVerb);
            }
            currentPhrasalVerb = {
                phrase: pvMatch[1],
                pronunciation: pvMatch[2],
                meanings: []
            };
            currentMeaning = null;
            continue;
        }

        // Meaning (**뜻**: or **뜻 1**:)
        const meaningMatch = line.match(/^\*\*뜻\s*\d*\*\*:\s*(.+)$/);
        if (meaningMatch && currentPhrasalVerb) {
            currentMeaning = {
                meaning: meaningMatch[1],
                examples: []
            };
            currentPhrasalVerb.meanings.push(currentMeaning);
            continue;
        }

        // Example row in table
        if (line.startsWith('|') && currentMeaning) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);
            if (cells.length >= 2 && !cells[0].match(/^-+$/) && cells[0] !== '예문') {
                currentMeaning.examples.push({
                    example: cells[0].replace(/\*\*/g, ''),
                    translation: cells[1]
                });
            }
        }
    }

    if (currentPhrasalVerb && currentCategory) {
        currentCategory.phrasalVerbs.push(currentPhrasalVerb);
    }
    if (currentCategory && currentCategory.phrasalVerbs.length > 0) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 숙어관용표현.md
function parseIdiomsMarkdown(content) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Category header
        const categoryMatch = line.match(/^##\s*\d+\.\s*(.+?)\s*(?:\((.+?)\))?\s*-?\s*\d*개?$/);
        if (categoryMatch) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                nameKo: categoryMatch[1].trim(),
                nameEn: categoryMatch[2] ? categoryMatch[2].trim() : '',
                expressions: []
            };
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '표현' || cells[0] === '영어' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 4) {
                currentCategory.expressions.push({
                    expression: cells[0],
                    pronunciation: cells[1] || '',
                    meaning: cells[2],
                    example: cells[3],
                    translation: cells[4] || ''
                });
            }
        }
    }

    if (currentCategory) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 영어단어.md
function parseVocabulary(content) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        const categoryMatch = line.match(/^##\s*(.+)$/);
        if (categoryMatch && !categoryMatch[1].includes('목차')) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                name: categoryMatch[1].trim(),
                words: []
            };
            inTable = false;
            continue;
        }

        if (line.startsWith('|') && currentCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '단어' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 4) {
                currentCategory.words.push({
                    word: cells[0],
                    pronunciation: cells[1],
                    meaning: cells[2],
                    example: cells[3],
                    translation: cells[4] || ''
                });
            }
        }
    }

    if (currentCategory) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 핵심문장패턴.md
function parsePatterns(content) {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentPattern = null;
    let inTable = false;
    let skipSection = false;

    // Patterns to skip (not actual sentence patterns)
    const skipPatterns = ['레벨별 핵심 전략', '패턴 학습법', '학습 TIP'];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip 학습 TIP section
        if (line.match(/^##\s*학습\s*TIP/i)) {
            skipSection = true;
            continue;
        }

        if (skipSection) continue;

        // Main section header (# 기초 패턴 or ## 1. 현재 습관)
        const mainSectionMatch = line.match(/^#\s+(.+패턴.*)$/);
        if (mainSectionMatch && !line.startsWith('##')) {
            if (currentSection && currentSection.patterns.length > 0) {
                sections.push(currentSection);
            }
            currentSection = {
                name: mainSectionMatch[1].trim(),
                patterns: []
            };
            continue;
        }

        // Sub section (## 1. 현재 습관/일상 표현)
        const subSectionMatch = line.match(/^##\s*\d+\.\s*(.+)$/);
        if (subSectionMatch && currentSection) {
            // This is a category within the section, we'll use it as context
            continue;
        }

        // Pattern header (### I usually + 동사원형)
        const patternMatch = line.match(/^###\s*(.+)$/);
        if (patternMatch) {
            const patternName = patternMatch[1].trim();

            // Skip non-pattern entries
            if (skipPatterns.some(skip => patternName.includes(skip))) {
                currentPattern = null;
                continue;
            }

            if (!currentSection) {
                currentSection = {
                    name: '기본 패턴',
                    patterns: []
                };
            }
            currentPattern = {
                name: patternName,
                meaning: '',
                items: []
            };
            currentSection.patterns.push(currentPattern);
            inTable = false;
            continue;
        }

        // Meaning line (**뜻**: 나는 보통 ~해)
        const meaningMatch = line.match(/^\*\*뜻\*\*:\s*(.+)$/);
        if (meaningMatch && currentPattern) {
            currentPattern.meaning = meaningMatch[1].trim();
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentPattern) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '패턴' || cells[0] === '예문' || cells[0] === '레벨' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 2) {
                // Skip non-example rows (like strategy tables)
                if (cells[0].startsWith('**') || cells[0].includes('→')) {
                    continue;
                }

                if (cells.length >= 3) {
                    currentPattern.items.push({
                        pattern: cells[0],
                        example: cells[1],
                        translation: cells[2]
                    });
                } else {
                    currentPattern.items.push({
                        example: cells[0],
                        translation: cells[1]
                    });
                }
            }
        }
    }

    if (currentSection && currentSection.patterns.length > 0) {
        sections.push(currentSection);
    }

    // Filter out patterns without items (not actual sentence patterns)
    sections.forEach(section => {
        section.patterns = section.patterns.filter(p => p.items.length > 0 && p.meaning);
    });

    return sections.filter(s => s.patterns.length > 0);
}

// Parse 추가단어 (중급/고급) markdown
function parseAdditionalVocab(content, difficulty) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let currentSubCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Main category (## 명사, ## 동사, etc.)
        const mainCategoryMatch = line.match(/^##\s+(.+?)\s*\((.+?)\)$/);
        if (mainCategoryMatch) {
            if (currentCategory && currentCategory.subCategories.length > 0) {
                categories.push(currentCategory);
            }
            currentCategory = {
                nameKo: mainCategoryMatch[1].trim(),
                nameEn: mainCategoryMatch[2].trim(),
                difficulty: difficulty,
                subCategories: []
            };
            currentSubCategory = null;
            inTable = false;
            continue;
        }

        // Sub category (### 일상생활, ### 직장/업무, etc.)
        const subCategoryMatch = line.match(/^###\s+(.+)$/);
        if (subCategoryMatch && currentCategory) {
            currentSubCategory = {
                name: subCategoryMatch[1].trim(),
                words: []
            };
            currentCategory.subCategories.push(currentSubCategory);
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentSubCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '단어' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 4) {
                currentSubCategory.words.push({
                    word: cells[0],
                    meaning: cells[1],
                    example: cells[2],
                    translation: cells[3] || '',
                    difficulty: difficulty
                });
            }
        }
    }

    if (currentCategory && currentCategory.subCategories.length > 0) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 추가숙어.md
function parseAdditionalIdioms(content) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let currentSubCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Main category (## 일상 대화 숙어)
        const mainCategoryMatch = line.match(/^##\s+(.+)$/);
        if (mainCategoryMatch && !line.includes('|')) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                name: mainCategoryMatch[1].trim(),
                subCategories: []
            };
            currentSubCategory = null;
            inTable = false;
            continue;
        }

        // Sub category (### 감정/상태 표현)
        const subCategoryMatch = line.match(/^###\s+(.+)$/);
        if (subCategoryMatch && currentCategory) {
            currentSubCategory = {
                name: subCategoryMatch[1].trim(),
                expressions: []
            };
            currentCategory.subCategories.push(currentSubCategory);
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentSubCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '숙어' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 4) {
                currentSubCategory.expressions.push({
                    expression: cells[0],
                    meaning: cells[1],
                    example: cells[2],
                    translation: cells[3] || ''
                });
            }
        }
    }

    if (currentCategory) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 추가구동사.md
function parseAdditionalPhrasalVerbs(content) {
    const lines = content.split('\n');
    const categories = [];
    let currentCategory = null;
    let currentSubCategory = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Main category (## 일상생활 구동사)
        const mainCategoryMatch = line.match(/^##\s+(.+구동사)$/);
        if (mainCategoryMatch) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = {
                name: mainCategoryMatch[1].trim(),
                subCategories: []
            };
            currentSubCategory = null;
            inTable = false;
            continue;
        }

        // Sub category (### 일상 활동)
        const subCategoryMatch = line.match(/^###\s+(.+)$/);
        if (subCategoryMatch && currentCategory) {
            currentSubCategory = {
                name: subCategoryMatch[1].trim(),
                phrasalVerbs: []
            };
            currentCategory.subCategories.push(currentSubCategory);
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentSubCategory) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '구동사' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 4) {
                currentSubCategory.phrasalVerbs.push({
                    phrase: cells[0],
                    meaning: cells[1],
                    example: cells[2],
                    translation: cells[3] || ''
                });
            }
        }
    }

    if (currentCategory) {
        categories.push(currentCategory);
    }

    return categories;
}

// Parse 추가표현집.md
function parseExpressions(content) {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentSubSection = null;
    let inTable = false;
    let isFirstHeader = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip main title (# OPIC 추가 표현집)
        if (line.match(/^#\s+OPIC/) || line.match(/^##\s*목차/)) {
            continue;
        }

        // Main section (# 연결어 (Connectors))
        const sectionMatch = line.match(/^#\s+(.+?)\s*(?:\((.+?)\))?$/);
        if (sectionMatch && !line.startsWith('##')) {
            if (currentSection && currentSection.subSections && currentSection.subSections.length > 0) {
                sections.push(currentSection);
            }
            currentSection = {
                nameKo: sectionMatch[1].trim(),
                nameEn: sectionMatch[2] ? sectionMatch[2].trim() : '',
                subSections: []
            };
            currentSubSection = null;
            continue;
        }

        // Sub section (## 추가할 때)
        const subSectionMatch = line.match(/^##\s+(.+)$/);
        if (subSectionMatch && currentSection) {
            currentSubSection = {
                name: subSectionMatch[1].trim(),
                expressions: []
            };
            currentSection.subSections.push(currentSubSection);
            inTable = false;
            continue;
        }

        // Table row
        if (line.startsWith('|') && currentSubSection) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);

            if (cells[0] === '표현' || cells[0].match(/^-+$/)) {
                inTable = true;
                continue;
            }

            if (inTable && cells.length >= 3) {
                currentSubSection.expressions.push({
                    expression: cells[0].replace(/\*\*/g, ''),
                    meaning: cells[1],
                    example: cells[2].replace(/\*\*/g, ''),
                    translation: cells[3] || ''
                });
            }
        }
    }

    if (currentSection && currentSection.subSections && currentSection.subSections.length > 0) {
        sections.push(currentSection);
    }

    return sections;
}

// Main processing
async function main() {
    console.log('Starting markdown parsing...');

    // Process 일상영어_명사.md
    try {
        const nounsContent = fs.readFileSync(path.join(rootDir, '일상영어_명사.md'), 'utf-8');
        const nouns = parseTableMarkdown(nounsContent);
        fs.writeFileSync(path.join(dataDir, 'nouns.json'), JSON.stringify(nouns, null, 2), 'utf-8');
        console.log(`✓ nouns.json created with ${nouns.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing nouns:', e.message);
    }

    // Process 일상영어_동사.md
    try {
        const verbsContent = fs.readFileSync(path.join(rootDir, '일상영어_동사.md'), 'utf-8');
        const verbs = parseTableMarkdown(verbsContent, true);
        fs.writeFileSync(path.join(dataDir, 'verbs.json'), JSON.stringify(verbs, null, 2), 'utf-8');
        console.log(`✓ verbs.json created with ${verbs.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing verbs:', e.message);
    }

    // Process 일상영어_형용사.md
    try {
        const adjContent = fs.readFileSync(path.join(rootDir, '일상영어_형용사.md'), 'utf-8');
        const adjectives = parseTableMarkdown(adjContent);
        fs.writeFileSync(path.join(dataDir, 'adjectives.json'), JSON.stringify(adjectives, null, 2), 'utf-8');
        console.log(`✓ adjectives.json created with ${adjectives.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing adjectives:', e.message);
    }

    // Process 일상영어_부사.md
    try {
        const advContent = fs.readFileSync(path.join(rootDir, '일상영어_부사.md'), 'utf-8');
        const adverbs = parseTableMarkdown(advContent);
        fs.writeFileSync(path.join(dataDir, 'adverbs.json'), JSON.stringify(adverbs, null, 2), 'utf-8');
        console.log(`✓ adverbs.json created with ${adverbs.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing adverbs:', e.message);
    }

    // Process 일상영어_전치사접속사.md
    try {
        const prepContent = fs.readFileSync(path.join(rootDir, '일상영어_전치사접속사.md'), 'utf-8');
        const prepositions = parseTableMarkdown(prepContent);
        fs.writeFileSync(path.join(dataDir, 'prepositions.json'), JSON.stringify(prepositions, null, 2), 'utf-8');
        console.log(`✓ prepositions.json created with ${prepositions.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing prepositions:', e.message);
    }

    // Process 일상영어_숙어관용표현.md
    try {
        const idiomsContent = fs.readFileSync(path.join(rootDir, '일상영어_숙어관용표현.md'), 'utf-8');
        const idioms = parseIdiomsMarkdown(idiomsContent);
        fs.writeFileSync(path.join(dataDir, 'idioms.json'), JSON.stringify(idioms, null, 2), 'utf-8');
        console.log(`✓ idioms.json created with ${idioms.reduce((acc, c) => acc + c.expressions.length, 0)} expressions`);
    } catch (e) {
        console.log('✗ Error processing idioms:', e.message);
    }

    // Process 구동사.md
    try {
        const pvContent = fs.readFileSync(path.join(rootDir, '구동사.md'), 'utf-8');
        const phrasalVerbs = parsePhrasalVerbs(pvContent);
        fs.writeFileSync(path.join(dataDir, 'phrasalVerbs.json'), JSON.stringify(phrasalVerbs, null, 2), 'utf-8');
        const count = phrasalVerbs.reduce((acc, c) => acc + c.phrasalVerbs.length, 0);
        console.log(`✓ phrasalVerbs.json created with ${count} phrasal verbs`);
    } catch (e) {
        console.log('✗ Error processing phrasal verbs:', e.message);
    }

    // Process 영어단어.md
    try {
        const vocabContent = fs.readFileSync(path.join(rootDir, '영어단어.md'), 'utf-8');
        const vocabulary = parseVocabulary(vocabContent);
        fs.writeFileSync(path.join(dataDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2), 'utf-8');
        console.log(`✓ vocabulary.json created with ${vocabulary.reduce((acc, c) => acc + c.words.length, 0)} words`);
    } catch (e) {
        console.log('✗ Error processing vocabulary:', e.message);
    }

    // Process 핵심문장패턴.md
    try {
        const patternsContent = fs.readFileSync(path.join(rootDir, '핵심문장패턴.md'), 'utf-8');
        const patterns = parsePatterns(patternsContent);
        fs.writeFileSync(path.join(dataDir, 'patterns.json'), JSON.stringify(patterns, null, 2), 'utf-8');
        const count = patterns.reduce((acc, s) => acc + s.patterns.reduce((a, p) => a + p.items.length, 0), 0);
        console.log(`✓ patterns.json created with ${count} pattern examples`);
    } catch (e) {
        console.log('✗ Error processing patterns:', e.message);
    }

    // Process 추가표현집.md
    try {
        const expContent = fs.readFileSync(path.join(rootDir, '추가표현집.md'), 'utf-8');
        const expressions = parseExpressions(expContent);
        fs.writeFileSync(path.join(dataDir, 'expressions.json'), JSON.stringify(expressions, null, 2), 'utf-8');
        const count = expressions.reduce((acc, section) => {
            return acc + section.subSections.reduce((a, sub) => a + sub.expressions.length, 0);
        }, 0);
        console.log(`✓ expressions.json created with ${count} expressions`);
    } catch (e) {
        console.log('✗ Error processing expressions:', e.message);
    }

    // Process 추가단어_중급.md
    try {
        const intContent = fs.readFileSync(path.join(rootDir, '추가단어_중급.md'), 'utf-8');
        const intermediate = parseAdditionalVocab(intContent, 'intermediate');
        fs.writeFileSync(path.join(dataDir, 'vocabIntermediate.json'), JSON.stringify(intermediate, null, 2), 'utf-8');
        const count = intermediate.reduce((acc, c) => acc + c.subCategories.reduce((a, s) => a + s.words.length, 0), 0);
        console.log(`✓ vocabIntermediate.json created with ${count} words`);
    } catch (e) {
        console.log('✗ Error processing intermediate vocab:', e.message);
    }

    // Process 추가단어_고급.md
    try {
        const advContent = fs.readFileSync(path.join(rootDir, '추가단어_고급.md'), 'utf-8');
        const advanced = parseAdditionalVocab(advContent, 'advanced');
        fs.writeFileSync(path.join(dataDir, 'vocabAdvanced.json'), JSON.stringify(advanced, null, 2), 'utf-8');
        const count = advanced.reduce((acc, c) => acc + c.subCategories.reduce((a, s) => a + s.words.length, 0), 0);
        console.log(`✓ vocabAdvanced.json created with ${count} words`);
    } catch (e) {
        console.log('✗ Error processing advanced vocab:', e.message);
    }

    // Process 추가숙어.md
    try {
        const addIdiomsContent = fs.readFileSync(path.join(rootDir, '추가숙어.md'), 'utf-8');
        const addIdioms = parseAdditionalIdioms(addIdiomsContent);
        fs.writeFileSync(path.join(dataDir, 'additionalIdioms.json'), JSON.stringify(addIdioms, null, 2), 'utf-8');
        const count = addIdioms.reduce((acc, c) => acc + c.subCategories.reduce((a, s) => a + s.expressions.length, 0), 0);
        console.log(`✓ additionalIdioms.json created with ${count} idioms`);
    } catch (e) {
        console.log('✗ Error processing additional idioms:', e.message);
    }

    // Process 추가구동사.md
    try {
        const addPVContent = fs.readFileSync(path.join(rootDir, '추가구동사.md'), 'utf-8');
        const addPV = parseAdditionalPhrasalVerbs(addPVContent);
        fs.writeFileSync(path.join(dataDir, 'additionalPhrasalVerbs.json'), JSON.stringify(addPV, null, 2), 'utf-8');
        const count = addPV.reduce((acc, c) => acc + c.subCategories.reduce((a, s) => a + s.phrasalVerbs.length, 0), 0);
        console.log(`✓ additionalPhrasalVerbs.json created with ${count} phrasal verbs`);
    } catch (e) {
        console.log('✗ Error processing additional phrasal verbs:', e.message);
    }

    console.log('\nDone! JSON files have been created in the data directory.');
}

main();
