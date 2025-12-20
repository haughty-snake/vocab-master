const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(__dirname, '..', 'js', 'data.bundle.js');

const files = [
    'nouns.json',
    'verbs.json',
    'adjectives.json',
    'adverbs.json',
    'prepositions.json',
    'idioms.json',
    'phrasalVerbs.json',
    'vocabulary.json',
    'patterns.json',
    'expressions.json',
    'vocabIntermediate.json',
    'vocabAdvanced.json',
    'additionalIdioms.json',
    'additionalPhrasalVerbs.json'
];

let output = '// Auto-generated data bundle\nconst DATA_BUNDLE = {\n';

files.forEach((file, index) => {
    const key = file.replace('.json', '');
    const filePath = path.join(dataDir, file);

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        output += `  ${key}: ${JSON.stringify(data)}`;
        if (index < files.length - 1) {
            output += ',';
        }
        output += '\n';
        console.log(`✓ Bundled ${file}`);
    } catch (e) {
        console.log(`✗ Error with ${file}: ${e.message}`);
        output += `  ${key}: []`;
        if (index < files.length - 1) {
            output += ',';
        }
        output += '\n';
    }
});

output += '};\n';

fs.writeFileSync(outputFile, output, 'utf-8');
console.log(`\n✓ Bundle created: ${outputFile}`);
