const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(__dirname, '..', 'js', 'data.bundle.js');

// Read all JSON files in data directory
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} JSON files in data directory`);

const categories = [];
let totalWords = 0;

for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        if (data && data.id && data.words) {
            categories.push(data);
            totalWords += data.words.length;
            console.log(`  - ${file}: ${data.name} (${data.words.length} words)`);
        } else {
            console.log(`  - ${file}: Invalid format (skipped)`);
        }
    } catch (e) {
        console.log(`  - ${file}: Error reading file - ${e.message}`);
    }
}

// Sort categories by lang then by name
categories.sort((a, b) => {
    const langA = a.lang || 'en-US';
    const langB = b.lang || 'en-US';
    if (langA !== langB) return langA.localeCompare(langB);
    return a.name.localeCompare(b.name);
});

// Generate bundle as object with id as key (for DATA_BUNDLE format)
const dataBundle = {};
categories.forEach(cat => {
    dataBundle[cat.id] = cat;
});

const bundleContent = `const DATA_BUNDLE = ${JSON.stringify(dataBundle, null, 2)};`;

fs.writeFileSync(outputFile, bundleContent, 'utf8');

console.log(`\nGenerated data.bundle.js with ${categories.length} categories, ${totalWords} total words`);
