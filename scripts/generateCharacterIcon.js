const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

function drawStudyCatCharacter(ctx, size) {
    const scale = size / 512;
    ctx.save();
    ctx.scale(scale, scale);

    // Background - sky blue gradient
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 300);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#5BA3D9');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2);
    ctx.fill();

    // Soft cloud-like highlights
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(180, 120, 60, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(340, 150, 50, 25, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // === CAT BODY ===
    // Body (oval)
    ctx.fillStyle = '#FFB366';  // Orange cat
    ctx.beginPath();
    ctx.ellipse(256, 340, 130, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly (lighter cream)
    ctx.fillStyle = '#FFF5E6';
    ctx.beginPath();
    ctx.ellipse(256, 360, 90, 85, 0, 0, Math.PI * 2);
    ctx.fill();

    // === TAIL ===
    ctx.fillStyle = '#FFB366';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FFB366';
    ctx.beginPath();
    ctx.moveTo(370, 380);
    ctx.quadraticCurveTo(450, 350, 430, 280);
    ctx.stroke();

    // Tail tip (darker)
    ctx.strokeStyle = '#E6944D';
    ctx.lineWidth = 35;
    ctx.beginPath();
    ctx.moveTo(435, 300);
    ctx.quadraticCurveTo(445, 270, 430, 250);
    ctx.stroke();

    // === HEAD ===
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(256, 200, 120, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // === EARS ===
    // Left ear (outer)
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.moveTo(150, 160);
    ctx.lineTo(120, 60);
    ctx.lineTo(200, 120);
    ctx.closePath();
    ctx.fill();

    // Left ear (inner pink)
    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.moveTo(155, 145);
    ctx.lineTo(135, 80);
    ctx.lineTo(190, 125);
    ctx.closePath();
    ctx.fill();

    // Right ear (outer)
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.moveTo(362, 160);
    ctx.lineTo(392, 60);
    ctx.lineTo(312, 120);
    ctx.closePath();
    ctx.fill();

    // Right ear (inner pink)
    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.moveTo(357, 145);
    ctx.lineTo(377, 80);
    ctx.lineTo(322, 125);
    ctx.closePath();
    ctx.fill();

    // === FACE MARKINGS ===
    // White muzzle area
    ctx.fillStyle = '#FFF5E6';
    ctx.beginPath();
    ctx.ellipse(256, 240, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Forehead marking (darker orange stripe)
    ctx.fillStyle = '#E6944D';
    ctx.beginPath();
    ctx.moveTo(256, 100);
    ctx.lineTo(246, 160);
    ctx.lineTo(256, 155);
    ctx.lineTo(266, 160);
    ctx.closePath();
    ctx.fill();

    // === GLASSES ===
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 8;
    ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';

    // Left lens (round)
    ctx.beginPath();
    ctx.arc(195, 190, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right lens (round)
    ctx.beginPath();
    ctx.arc(317, 190, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bridge
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(245, 190);
    ctx.lineTo(267, 190);
    ctx.stroke();

    // Temple arms
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(145, 185);
    ctx.lineTo(110, 170);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(367, 185);
    ctx.lineTo(402, 170);
    ctx.stroke();

    // === EYES (behind glasses) ===
    // Eye whites
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(195, 190, 28, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(317, 190, 28, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (cat-like vertical)
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.ellipse(195, 190, 12, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(317, 190, 12, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(202, 182, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(324, 182, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Small secondary shine
    ctx.beginPath();
    ctx.ellipse(190, 198, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(312, 198, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // === NOSE ===
    ctx.fillStyle = '#FF8080';
    ctx.beginPath();
    ctx.moveTo(256, 235);
    ctx.lineTo(245, 250);
    ctx.lineTo(267, 250);
    ctx.closePath();
    ctx.fill();

    // Nose highlight
    ctx.fillStyle = '#FFB0B0';
    ctx.beginPath();
    ctx.ellipse(256, 242, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // === MOUTH ===
    ctx.strokeStyle = '#E6944D';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Mouth line down
    ctx.beginPath();
    ctx.moveTo(256, 250);
    ctx.lineTo(256, 270);
    ctx.stroke();

    // Smile curves
    ctx.beginPath();
    ctx.arc(238, 270, 18, 0, Math.PI * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(274, 270, 18, Math.PI * 0.3, Math.PI);
    ctx.stroke();

    // === WHISKERS ===
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(180, 250);
    ctx.lineTo(100, 240);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(180, 260);
    ctx.lineTo(100, 265);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(180, 270);
    ctx.lineTo(100, 290);
    ctx.stroke();

    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(332, 250);
    ctx.lineTo(412, 240);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(332, 260);
    ctx.lineTo(412, 265);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(332, 270);
    ctx.lineTo(412, 290);
    ctx.stroke();

    // === PAWS ===
    // Left paw
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(170, 420, 45, 35, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Left paw pads
    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.ellipse(170, 425, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toe beans
    ctx.beginPath();
    ctx.ellipse(155, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(170, 405, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(185, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right paw
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(342, 420, 45, 35, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Right paw pads
    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.ellipse(342, 425, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toe beans
    ctx.beginPath();
    ctx.ellipse(327, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(342, 405, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(357, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // === BOOK ===
    // Book base (green)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(160, 380);
    ctx.lineTo(256, 410);
    ctx.lineTo(352, 380);
    ctx.lineTo(352, 440);
    ctx.lineTo(256, 470);
    ctx.lineTo(160, 440);
    ctx.closePath();
    ctx.fill();

    // Book pages (white/cream)
    ctx.fillStyle = '#FFFEF5';
    ctx.beginPath();
    ctx.moveTo(168, 385);
    ctx.lineTo(256, 410);
    ctx.lineTo(256, 462);
    ctx.lineTo(168, 435);
    ctx.closePath();
    ctx.fill();

    // Page lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(180, 398 + i * 11);
        ctx.lineTo(245, 418 + i * 9);
        ctx.stroke();
    }

    // Book spine
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.moveTo(256, 410);
    ctx.lineTo(256, 470);
    ctx.lineTo(262, 468);
    ctx.lineTo(262, 408);
    ctx.closePath();
    ctx.fill();

    // Book cover pattern (simple "ABC")
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ABC', 304, 420);

    ctx.restore();
}

// Generate icons for each size
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw character
    drawStudyCatCharacter(ctx, size);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated: ${filename}`);
});

console.log('\nAll icons generated successfully!');
console.log('Character: Study Cat with glasses - Orange cat on sky blue background');
