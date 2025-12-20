/**
 * Icon Generator using node-canvas
 * Run: node scripts/generateIconsCanvas.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const SPLASH_SIZES = [
    { width: 640, height: 1136, name: 'splash-640x1136' },
    { width: 750, height: 1334, name: 'splash-750x1334' },
    { width: 1242, height: 2208, name: 'splash-1242x2208' }
];

const iconsDir = path.join(__dirname, '..', 'icons');

function drawIcon(ctx, size) {
    const scale = size / 512;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4285f4');
    gradient.addColorStop(0.5, '#34a853');
    gradient.addColorStop(0.75, '#fbbc05');
    gradient.addColorStop(1, '#ea4335');

    // Rounded rectangle background
    const radius = 96 * scale;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Letter V
    ctx.fillStyle = 'white';
    ctx.font = `bold ${280 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', size / 2, size / 2 - 20 * scale);

    // Underline
    const underlineY = 380 * scale;
    const underlineHeight = 24 * scale;
    const underlineWidth = 272 * scale;
    const underlineX = (size - underlineWidth) / 2;
    const underlineRadius = 12 * scale;

    ctx.beginPath();
    ctx.moveTo(underlineX + underlineRadius, underlineY);
    ctx.lineTo(underlineX + underlineWidth - underlineRadius, underlineY);
    ctx.quadraticCurveTo(underlineX + underlineWidth, underlineY, underlineX + underlineWidth, underlineY + underlineRadius);
    ctx.lineTo(underlineX + underlineWidth, underlineY + underlineHeight - underlineRadius);
    ctx.quadraticCurveTo(underlineX + underlineWidth, underlineY + underlineHeight, underlineX + underlineWidth - underlineRadius, underlineY + underlineHeight);
    ctx.lineTo(underlineX + underlineRadius, underlineY + underlineHeight);
    ctx.quadraticCurveTo(underlineX, underlineY + underlineHeight, underlineX, underlineY + underlineHeight - underlineRadius);
    ctx.lineTo(underlineX, underlineY + underlineRadius);
    ctx.quadraticCurveTo(underlineX, underlineY, underlineX + underlineRadius, underlineY);
    ctx.closePath();
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    drawIcon(ctx, size);
    return canvas;
}

function generateIcons() {
    console.log('Generating PWA icons...\n');

    // Ensure icons directory exists
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Generate icon sizes
    for (const size of ICON_SIZES) {
        const canvas = createIcon(size);
        const buffer = canvas.toBuffer('image/png');
        const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Created: icon-${size}x${size}.png`);
    }

    // Generate splash screens
    console.log('\nGenerating splash screens...\n');

    for (const splash of SPLASH_SIZES) {
        const canvas = createCanvas(splash.width, splash.height);
        const ctx = canvas.getContext('2d');

        // Blue background
        ctx.fillStyle = '#4285f4';
        ctx.fillRect(0, 0, splash.width, splash.height);

        // Draw centered icon
        const iconSize = Math.min(splash.width, splash.height) * 0.3;
        const iconCanvas = createIcon(Math.round(iconSize));
        ctx.drawImage(iconCanvas, (splash.width - iconSize) / 2, (splash.height - iconSize) / 2, iconSize, iconSize);

        const buffer = canvas.toBuffer('image/png');
        const outputPath = path.join(iconsDir, `${splash.name}.png`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Created: ${splash.name}.png`);
    }

    console.log('\nAll icons generated successfully!');
}

generateIcons();
