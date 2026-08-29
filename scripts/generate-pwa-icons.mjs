import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, "public");
const SUPER_SAMPLE = 4;

const palette = {
  navy: [11, 17, 32, 255],
  navyLight: [26, 35, 54, 255],
  gold: [197, 160, 103, 255],
  goldLight: [226, 199, 151, 255],
};

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0;
    rgba.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(scanlines, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createCanvas(size, color) {
  const pixels = Buffer.alloc(size * size * 4);
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = color[3];
  }
  return pixels;
}

function setPixel(pixels, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const offset = (Math.floor(y) * size + Math.floor(x)) * 4;
  pixels[offset] = color[0];
  pixels[offset + 1] = color[1];
  pixels[offset + 2] = color[2];
  pixels[offset + 3] = color[3];
}

function fillCircle(pixels, size, centerX, centerY, radius, color) {
  const minX = Math.floor(centerX - radius);
  const maxX = Math.ceil(centerX + radius);
  const minY = Math.floor(centerY - radius);
  const maxY = Math.ceil(centerY + radius);
  const radiusSquared = radius * radius;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x + 0.5 - centerX;
      const dy = y + 0.5 - centerY;
      if (dx * dx + dy * dy <= radiusSquared) {
        setPixel(pixels, size, x, y, color);
      }
    }
  }
}

function drawLine(pixels, size, x1, y1, x2, y2, width, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const radius = width / 2;
  const minX = Math.floor(Math.min(x1, x2) - radius);
  const maxX = Math.ceil(Math.max(x1, x2) + radius);
  const minY = Math.floor(Math.min(y1, y2) - radius);
  const maxY = Math.ceil(Math.max(y1, y2) + radius);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const px = x + 0.5;
      const py = y + 0.5;
      const projection =
        lengthSquared === 0
          ? 0
          : Math.max(
              0,
              Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared),
            );
      const nearestX = x1 + projection * dx;
      const nearestY = y1 + projection * dy;
      const distanceX = px - nearestX;
      const distanceY = py - nearestY;

      if (distanceX * distanceX + distanceY * distanceY <= radius * radius) {
        setPixel(pixels, size, x, y, color);
      }
    }
  }
}

function fillPolygon(pixels, size, points, color) {
  const minY = Math.max(0, Math.floor(Math.min(...points.map((point) => point[1]))));
  const maxY = Math.min(size - 1, Math.ceil(Math.max(...points.map((point) => point[1]))));

  for (let y = minY; y <= maxY; y += 1) {
    const intersections = [];
    for (let index = 0; index < points.length; index += 1) {
      const [x1, y1] = points[index];
      const [x2, y2] = points[(index + 1) % points.length];
      if ((y1 <= y + 0.5 && y2 > y + 0.5) || (y2 <= y + 0.5 && y1 > y + 0.5)) {
        intersections.push(x1 + ((y + 0.5 - y1) * (x2 - x1)) / (y2 - y1));
      }
    }

    intersections.sort((a, b) => a - b);
    for (let index = 0; index < intersections.length; index += 2) {
      const start = Math.ceil(intersections[index]);
      const end = Math.floor(intersections[index + 1] ?? intersections[index]);
      for (let x = start; x <= end; x += 1) {
        setPixel(pixels, size, x, y, color);
      }
    }
  }
}

function downsample(source, sourceSize, targetSize) {
  const output = Buffer.alloc(targetSize * targetSize * 4);
  const factor = sourceSize / targetSize;

  for (let y = 0; y < targetSize; y += 1) {
    for (let x = 0; x < targetSize; x += 1) {
      const totals = [0, 0, 0, 0];
      const startX = Math.floor(x * factor);
      const endX = Math.floor((x + 1) * factor);
      const startY = Math.floor(y * factor);
      const endY = Math.floor((y + 1) * factor);
      let samples = 0;

      for (let sourceY = startY; sourceY < endY; sourceY += 1) {
        for (let sourceX = startX; sourceX < endX; sourceX += 1) {
          const sourceOffset = (sourceY * sourceSize + sourceX) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            totals[channel] += source[sourceOffset + channel];
          }
          samples += 1;
        }
      }

      const outputOffset = (y * targetSize + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        output[outputOffset + channel] = Math.round(totals[channel] / samples);
      }
    }
  }

  return output;
}

function createIcon(size, maskable = false) {
  const canvasSize = size * SUPER_SAMPLE;
  const pixels = createCanvas(canvasSize, palette.navy);
  const unit = canvasSize;
  const ringRadius = unit * (maskable ? 0.31 : 0.39);
  const ringWidth = unit * 0.018;

  fillCircle(pixels, canvasSize, unit * 0.5, unit * 0.5, ringRadius, palette.gold);
  fillCircle(
    pixels,
    canvasSize,
    unit * 0.5,
    unit * 0.5,
    ringRadius - ringWidth,
    palette.navyLight,
  );

  const scale = maskable ? 0.84 : 1;
  const centerX = unit * 0.5;
  const centerY = unit * 0.5;
  const point = (x, y) => [
    centerX + (x - 0.5) * unit * scale,
    centerY + (y - 0.5) * unit * scale,
  ];
  const stroke = unit * 0.025 * scale;
  const fineStroke = unit * 0.012 * scale;

  const [poleTopX, poleTopY] = point(0.5, 0.27);
  const [poleBottomX, poleBottomY] = point(0.5, 0.69);
  drawLine(pixels, canvasSize, poleTopX, poleTopY, poleBottomX, poleBottomY, stroke, palette.goldLight);
  fillCircle(pixels, canvasSize, poleTopX, poleTopY, unit * 0.027 * scale, palette.goldLight);

  const [beamLeftX, beamY] = point(0.29, 0.37);
  const [beamRightX] = point(0.71, 0.37);
  drawLine(pixels, canvasSize, beamLeftX, beamY, beamRightX, beamY, stroke, palette.goldLight);

  const panDefinitions = [
    { anchor: 0.34, left: 0.27, right: 0.41 },
    { anchor: 0.66, left: 0.59, right: 0.73 },
  ];

  for (const pan of panDefinitions) {
    const [anchorX, anchorY] = point(pan.anchor, 0.37);
    const [leftX, panTopY] = point(pan.left, 0.55);
    const [rightX] = point(pan.right, 0.55);
    drawLine(pixels, canvasSize, anchorX, anchorY, leftX, panTopY, fineStroke, palette.gold);
    drawLine(pixels, canvasSize, anchorX, anchorY, rightX, panTopY, fineStroke, palette.gold);
    fillPolygon(
      pixels,
      canvasSize,
      [point(pan.left, 0.54), point(pan.right, 0.54), point(pan.anchor + 0.04, 0.60), point(pan.anchor - 0.04, 0.60)],
      palette.goldLight,
    );
  }

  const [baseLeftX, baseY] = point(0.37, 0.72);
  const [baseRightX] = point(0.63, 0.72);
  drawLine(pixels, canvasSize, baseLeftX, baseY, baseRightX, baseY, stroke, palette.goldLight);

  const finalPixels = downsample(pixels, canvasSize, size);
  return encodePng(size, size, finalPixels);
}

mkdirSync(outputDirectory, { recursive: true });

const icons = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, false],
];

for (const [fileName, size, maskable] of icons) {
  writeFileSync(join(outputDirectory, fileName), createIcon(size, maskable));
}

console.log(`Generated ${icons.length} PWA icons in ${outputDirectory}`);
