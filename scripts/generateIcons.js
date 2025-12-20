/**
 * Icon Generator Script
 *
 * This script generates PWA icons from the base SVG icon.
 *
 * Prerequisites:
 * 1. Install sharp: npm install sharp
 * 2. Run: node scripts/generateIcons.js
 *
 * If you don't have Node.js or sharp, you can use online tools:
 * - https://realfavicongenerator.net/
 * - https://www.pwabuilder.com/imageGenerator
 *
 * Upload icons/icon.svg and download the generated icons.
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('Sharp module not found. Please install it with: npm install sharp');
    console.log('\nAlternatively, you can use online tools to generate icons:');
    console.log('1. https://realfavicongenerator.net/');
    console.log('2. https://www.pwabuilder.com/imageGenerator');
    console.log('\nUpload the icons/icon.svg file and download the generated icons.');
    process.exit(1);
}

const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const SPLASH_SIZES = [
    { width: 640, height: 1136, name: 'splash-640x1136' },
    { width: 750, height: 1334, name: 'splash-750x1334' },
    { width: 1242, height: 2208, name: 'splash-1242x2208' }
];

const iconsDir = path.join(__dirname, '..', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

async function generateIcons() {
    console.log('Generating PWA icons...\n');

    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
        console.error('Error: icon.svg not found in icons directory');
        process.exit(1);
    }

    const svgBuffer = fs.readFileSync(svgPath);

    // Generate icon sizes
    for (const size of ICON_SIZES) {
        const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);

        console.log(`Created: icon-${size}x${size}.png`);
    }

    // Generate splash screens
    console.log('\nGenerating splash screens...\n');

    for (const splash of SPLASH_SIZES) {
        const outputPath = path.join(iconsDir, `${splash.name}.png`);

        // Create splash screen with icon centered
        const iconSize = Math.min(splash.width, splash.height) * 0.3;
        const iconBuffer = await sharp(svgBuffer)
            .resize(Math.round(iconSize), Math.round(iconSize))
            .toBuffer();

        await sharp({
            create: {
                width: splash.width,
                height: splash.height,
                channels: 4,
                background: { r: 66, g: 133, b: 244, alpha: 1 }
            }
        })
        .composite([{
            input: iconBuffer,
            gravity: 'center'
        }])
        .png()
        .toFile(outputPath);

        console.log(`Created: ${splash.name}.png`);
    }

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
