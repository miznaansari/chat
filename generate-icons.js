const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create vibrant Gemini Sparkle SVG
const createSvgIcon = (size, padding = 0) => {
  const viewBox = 512;
  const innerSize = viewBox - (padding * 2);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${viewBox}" height="${viewBox}" rx="${viewBox * 0.22}" fill="#09090b"/>
  <defs>
    <linearGradient id="geminiGrad" x1="0" y1="0" x2="${viewBox}" y2="${viewBox}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="35%" stop-color="#8B5CF6"/>
      <stop offset="70%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <g transform="translate(${padding}, ${padding})">
    <path d="M${innerSize / 2} 0 C${innerSize / 2} ${innerSize * 0.276} ${innerSize * 0.276} ${innerSize / 2} 0 ${innerSize / 2} C${innerSize * 0.276} ${innerSize / 2} ${innerSize / 2} ${innerSize * 0.724} ${innerSize / 2} ${innerSize} C${innerSize / 2} ${innerSize * 0.724} ${innerSize * 0.724} ${innerSize / 2} ${innerSize} ${innerSize / 2} C${innerSize * 0.724} ${innerSize / 2} ${innerSize / 2} ${innerSize * 0.276} ${innerSize / 2} 0 Z" fill="url(#geminiGrad)" />
  </g>
</svg>`;
};

async function generate() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate SVG icon
  const svgContent = createSvgIcon(512, 64);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

  // Generate PNG sizes
  const sizes = [
    { name: 'icon-192.png', size: 192, padding: 24 },
    { name: 'icon-512.png', size: 512, padding: 64 },
    { name: 'icon-maskable-192.png', size: 192, padding: 36 },
    { name: 'icon-maskable-512.png', size: 512, padding: 96 },
    { name: 'apple-icon.png', size: 180, padding: 20 },
    { name: 'favicon.png', size: 64, padding: 8 },
  ];

  for (const item of sizes) {
    const svgStr = createSvgIcon(item.size, item.padding);
    await sharp(Buffer.from(svgStr))
      .png()
      .toFile(path.join(publicDir, item.name));
    console.log(`Generated ${item.name}`);
  }

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
