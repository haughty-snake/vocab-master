const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'icons');

// Splash screen sizes for iOS
const splashSizes = [
    { width: 640, height: 1136 },   // iPhone 5
    { width: 750, height: 1334 },   // iPhone 6/7/8
    { width: 1242, height: 2208 }   // iPhone 6/7/8 Plus
];

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
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(256, 340, 130, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = '#FFF5E6';
    ctx.beginPath();
    ctx.ellipse(256, 360, 90, 85, 0, 0, Math.PI * 2);
    ctx.fill();

    // === TAIL ===
    ctx.strokeStyle = '#FFB366';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(370, 380);
    ctx.quadraticCurveTo(450, 350, 430, 280);
    ctx.stroke();

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
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.moveTo(150, 160);
    ctx.lineTo(120, 60);
    ctx.lineTo(200, 120);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.moveTo(155, 145);
    ctx.lineTo(135, 80);
    ctx.lineTo(190, 125);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.moveTo(362, 160);
    ctx.lineTo(392, 60);
    ctx.lineTo(312, 120);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.moveTo(357, 145);
    ctx.lineTo(377, 80);
    ctx.lineTo(322, 125);
    ctx.closePath();
    ctx.fill();

    // === FACE ===
    ctx.fillStyle = '#FFF5E6';
    ctx.beginPath();
    ctx.ellipse(256, 240, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.beginPath();
    ctx.arc(195, 190, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(317, 190, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(245, 190);
    ctx.lineTo(267, 190);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(145, 185);
    ctx.lineTo(110, 170);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(367, 185);
    ctx.lineTo(402, 170);
    ctx.stroke();

    // === EYES ===
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(195, 190, 28, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(317, 190, 28, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.ellipse(195, 190, 12, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(317, 190, 12, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(202, 182, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(324, 182, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.fillStyle = '#FFB0B0';
    ctx.beginPath();
    ctx.ellipse(256, 242, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // === MOUTH ===
    ctx.strokeStyle = '#E6944D';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(256, 250);
    ctx.lineTo(256, 270);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(238, 270, 18, 0, Math.PI * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(274, 270, 18, Math.PI * 0.3, Math.PI);
    ctx.stroke();

    // === WHISKERS ===
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

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
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(170, 420, 45, 35, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.ellipse(170, 425, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(155, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(170, 405, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(185, 410, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.ellipse(342, 420, 45, 35, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB8C6';
    ctx.beginPath();
    ctx.ellipse(342, 425, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
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

    ctx.fillStyle = '#FFFEF5';
    ctx.beginPath();
    ctx.moveTo(168, 385);
    ctx.lineTo(256, 410);
    ctx.lineTo(256, 462);
    ctx.lineTo(168, 435);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(180, 398 + i * 11);
        ctx.lineTo(245, 418 + i * 9);
        ctx.stroke();
    }

    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.moveTo(256, 410);
    ctx.lineTo(256, 470);
    ctx.lineTo(262, 468);
    ctx.lineTo(262, 408);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ABC', 304, 420);

    ctx.restore();
}

// Generate SVG icon
function generateSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="skyGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" style="stop-color:#87CEEB"/>
      <stop offset="100%" style="stop-color:#5BA3D9"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <circle cx="256" cy="256" r="256" fill="url(#skyGrad)"/>

  <!-- Cloud highlights -->
  <ellipse cx="180" cy="120" rx="60" ry="30" fill="rgba(255,255,255,0.2)" transform="rotate(-17 180 120)"/>
  <ellipse cx="340" cy="150" rx="50" ry="25" fill="rgba(255,255,255,0.2)" transform="rotate(11 340 150)"/>

  <!-- Cat Body -->
  <ellipse cx="256" cy="340" rx="130" ry="120" fill="#FFB366"/>
  <ellipse cx="256" cy="360" rx="90" ry="85" fill="#FFF5E6"/>

  <!-- Tail -->
  <path d="M370,380 Q450,350 430,280" stroke="#FFB366" stroke-width="40" stroke-linecap="round" fill="none"/>
  <path d="M435,300 Q445,270 430,250" stroke="#E6944D" stroke-width="35" stroke-linecap="round" fill="none"/>

  <!-- Head -->
  <ellipse cx="256" cy="200" rx="120" ry="110" fill="#FFB366"/>

  <!-- Left Ear -->
  <polygon points="150,160 120,60 200,120" fill="#FFB366"/>
  <polygon points="155,145 135,80 190,125" fill="#FFB8C6"/>

  <!-- Right Ear -->
  <polygon points="362,160 392,60 312,120" fill="#FFB366"/>
  <polygon points="357,145 377,80 322,125" fill="#FFB8C6"/>

  <!-- Face -->
  <ellipse cx="256" cy="240" rx="70" ry="55" fill="#FFF5E6"/>
  <polygon points="256,100 246,160 256,155 266,160" fill="#E6944D"/>

  <!-- Glasses -->
  <circle cx="195" cy="190" r="50" fill="rgba(200,230,255,0.4)" stroke="#2C3E50" stroke-width="8"/>
  <circle cx="317" cy="190" r="50" fill="rgba(200,230,255,0.4)" stroke="#2C3E50" stroke-width="8"/>
  <line x1="245" y1="190" x2="267" y2="190" stroke="#2C3E50" stroke-width="6"/>
  <line x1="145" y1="185" x2="110" y2="170" stroke="#2C3E50" stroke-width="6"/>
  <line x1="367" y1="185" x2="402" y2="170" stroke="#2C3E50" stroke-width="6"/>

  <!-- Eyes -->
  <ellipse cx="195" cy="190" rx="28" ry="30" fill="white"/>
  <ellipse cx="317" cy="190" rx="28" ry="30" fill="white"/>
  <ellipse cx="195" cy="190" rx="12" ry="22" fill="#2C3E50"/>
  <ellipse cx="317" cy="190" rx="12" ry="22" fill="#2C3E50"/>
  <circle cx="202" cy="182" r="8" fill="white"/>
  <circle cx="324" cy="182" r="8" fill="white"/>
  <circle cx="190" cy="198" r="4" fill="white"/>
  <circle cx="312" cy="198" r="4" fill="white"/>

  <!-- Nose -->
  <polygon points="256,235 245,250 267,250" fill="#FF8080"/>
  <ellipse cx="256" cy="242" rx="5" ry="4" fill="#FFB0B0"/>

  <!-- Mouth -->
  <line x1="256" y1="250" x2="256" y2="270" stroke="#E6944D" stroke-width="4" stroke-linecap="round"/>
  <path d="M238,270 A18,18 0 0,0 251,282" stroke="#E6944D" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M274,270 A18,18 0 0,1 261,282" stroke="#E6944D" stroke-width="4" stroke-linecap="round" fill="none"/>

  <!-- Whiskers -->
  <g stroke="#666" stroke-width="2">
    <line x1="180" y1="250" x2="100" y2="240"/>
    <line x1="180" y1="260" x2="100" y2="265"/>
    <line x1="180" y1="270" x2="100" y2="290"/>
    <line x1="332" y1="250" x2="412" y2="240"/>
    <line x1="332" y1="260" x2="412" y2="265"/>
    <line x1="332" y1="270" x2="412" y2="290"/>
  </g>

  <!-- Left Paw -->
  <ellipse cx="170" cy="420" rx="45" ry="35" fill="#FFB366" transform="rotate(-11 170 420)"/>
  <ellipse cx="170" cy="425" rx="20" ry="15" fill="#FFB8C6"/>
  <ellipse cx="155" cy="410" rx="8" ry="7" fill="#FFB8C6"/>
  <ellipse cx="170" cy="405" rx="8" ry="7" fill="#FFB8C6"/>
  <ellipse cx="185" cy="410" rx="8" ry="7" fill="#FFB8C6"/>

  <!-- Right Paw -->
  <ellipse cx="342" cy="420" rx="45" ry="35" fill="#FFB366" transform="rotate(11 342 420)"/>
  <ellipse cx="342" cy="425" rx="20" ry="15" fill="#FFB8C6"/>
  <ellipse cx="327" cy="410" rx="8" ry="7" fill="#FFB8C6"/>
  <ellipse cx="342" cy="405" rx="8" ry="7" fill="#FFB8C6"/>
  <ellipse cx="357" cy="410" rx="8" ry="7" fill="#FFB8C6"/>

  <!-- Book -->
  <polygon points="160,380 256,410 352,380 352,440 256,470 160,440" fill="#4CAF50"/>
  <polygon points="168,385 256,410 256,462 168,435" fill="#FFFEF5"/>
  <polygon points="256,410 256,470 262,468 262,408" fill="#388E3C"/>
  <g stroke="#ddd" stroke-width="1">
    <line x1="180" y1="398" x2="245" y2="418"/>
    <line x1="180" y1="409" x2="245" y2="427"/>
    <line x1="180" y1="420" x2="245" y2="436"/>
    <line x1="180" y1="431" x2="245" y2="445"/>
  </g>
  <text x="304" y="420" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">ABC</text>
</svg>`;

    fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svg);
    console.log('Generated: icon.svg');
}

// Generate splash screens
function generateSplash(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient matching the character
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#5BA3D9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw character in center
    const charSize = Math.min(width, height) * 0.6;
    ctx.save();
    ctx.translate((width - charSize) / 2, (height - charSize) / 2 - height * 0.05);
    drawStudyCatCharacter(ctx, charSize);
    ctx.restore();

    // App name
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(width * 0.08)}px Arial`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillText('단어 마스터', width / 2, height * 0.85);

    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(iconsDir, `splash-${width}x${height}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated: splash-${width}x${height}.png`);
}

// Generate all assets
console.log('Generating SVG icon...');
generateSVG();

console.log('\nGenerating splash screens...');
splashSizes.forEach(size => generateSplash(size.width, size.height));

console.log('\nAll assets generated!');
