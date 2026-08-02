const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const publicDir = path.join(__dirname, 'public');
  const inputLogo = path.join(publicDir, 'logo.png');

  if (!fs.existsSync(inputLogo)) {
    console.error('Source logo.png not found in public directory!');
    process.exit(1);
  }

  console.log('Generating icon variants from logo.png...');

  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const item of sizes) {
    await sharp(inputLogo)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, item.name + '.tmp'));
    
    // Replace old file cleanly
    fs.renameSync(path.join(publicDir, item.name + '.tmp'), path.join(publicDir, item.name));
    console.log(`✓ Generated ${item.name}`);
  }

  // Generate Maskable Icons with dark background and safe area padding
  const maskableSizes = [
    { name: 'icon-maskable-192.png', size: 192 },
    { name: 'icon-maskable-512.png', size: 512 },
  ];

  for (const item of maskableSizes) {
    const innerSize = Math.round(item.size * 0.8);
    const padding = Math.round((item.size - innerSize) / 2);

    const resizedBuffer = await sharp(inputLogo)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: item.size,
        height: item.size,
        channels: 4,
        background: { r: 9, g: 9, b: 11, alpha: 1 },
      },
    })
      .composite([{ input: resizedBuffer, top: padding, left: padding }])
      .png()
      .toFile(path.join(publicDir, item.name + '.tmp'));

    fs.renameSync(path.join(publicDir, item.name + '.tmp'), path.join(publicDir, item.name));
    console.log(`✓ Generated ${item.name}`);
  }

  console.log('🎉 All logo variants generated successfully from logo.png!');
}

generate().catch(console.error);
