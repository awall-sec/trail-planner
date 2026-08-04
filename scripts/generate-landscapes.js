const fs = require("fs");
const path = require("path");

const COLS = 64;
const ROWS = 36;
const PX = 20; // pixel size in SVG units -> 1280x720 viewBox

function makeGrid() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
}

function fillBand(grid, rowStart, rowEnd, color) {
  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = 0; c < COLS; c++) grid[r][c] = color;
  }
}

// Linear interpolation across explicit (col, row) control points -> per-column peak row.
function silhouette(points) {
  const heights = new Array(COLS).fill(points[points.length - 1][1]);
  for (let i = 0; i < points.length - 1; i++) {
    const [c0, r0] = points[i];
    const [c1, r1] = points[i + 1];
    for (let c = c0; c <= c1; c++) {
      const t = c1 === c0 ? 0 : (c - c0) / (c1 - c0);
      heights[c] = Math.round(r0 + (r1 - r0) * t);
    }
  }
  return heights;
}

function drawRange(grid, points, bottomRow, color, opts = {}) {
  const heights = silhouette(points);
  const { snowRow, snowColor, snowDepth = 2 } = opts;
  for (let c = 0; c < COLS; c++) {
    const top = Math.max(0, heights[c]);
    for (let r = top; r <= bottomRow; r++) {
      if (r < 0 || r >= ROWS) continue;
      const isSnow = snowRow != null && top <= snowRow && r < top + snowDepth;
      grid[r][c] = isSnow ? snowColor : color;
    }
  }
  return heights;
}

function drawTrees(grid, baselineHeights, color, spacing, seed, heightRange) {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s % 1000) / 1000;
  };
  for (let c = 1; c < COLS - 1; c += spacing) {
    const jitter = Math.floor(rand() * 2) - 1;
    const col = Math.min(COLS - 2, Math.max(1, c + jitter));
    const base = baselineHeights[col];
    const h = heightRange[0] + Math.floor(rand() * (heightRange[1] - heightRange[0]));
    for (let layer = 0; layer < h; layer++) {
      const r = base - 1 - layer;
      if (r < 0 || r >= ROWS) continue;
      const width = layer === h - 1 ? 1 : layer >= h - 2 ? 2 : 3;
      for (let dc = -Math.floor(width / 2); dc <= Math.floor(width / 2); dc++) {
        const cc = col + dc;
        if (cc >= 0 && cc < COLS) grid[r][cc] = color;
      }
    }
  }
}

function scatter(grid, rowRange, colRange, color, count, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) & 0x7fffffff;
    return (s % 233280) / 233280;
  };
  for (let i = 0; i < count; i++) {
    const r = rowRange[0] + Math.floor(rand() * (rowRange[1] - rowRange[0]));
    const c = colRange[0] + Math.floor(rand() * (colRange[1] - colRange[0]));
    grid[r][c] = color;
  }
}

function drawDisc(grid, centerRow, centerCol, radiusColors) {
  // radiusColors: array from outer to inner, e.g. [[3,'#color'],[1,'#color2']]
  for (const [radius, color] of radiusColors) {
    for (let r = centerRow - radius; r <= centerRow + radius; r++) {
      for (let c = centerCol - radius; c <= centerCol + radius; c++) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
        const dr = r - centerRow;
        const dc = c - centerCol;
        if (Math.round(Math.sqrt(dr * dr + dc * dc)) <= radius) {
          grid[r][c] = color;
        }
      }
    }
  }
}

function drawWaterfall(grid, col, rowStart, rowEnd, color, mistColor) {
  for (let r = rowStart; r <= rowEnd; r++) {
    grid[r][col] = color;
    if (r > rowStart + 2) grid[r][col + 1] = color;
  }
  for (let dc = -2; dc <= 2; dc++) {
    const cc = col + dc;
    if (cc >= 0 && cc < COLS) grid[rowEnd][cc] = mistColor;
    if (cc >= 0 && cc < COLS && rowEnd - 1 >= 0) grid[rowEnd - 1][cc] = mistColor;
  }
}

function gridToSvg(grid) {
  const rects = [];
  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS) {
      const color = grid[r][c];
      let end = c + 1;
      while (end < COLS && grid[r][end] === color) end++;
      if (color) {
        rects.push(
          `<rect x="${c * PX}" y="${r * PX}" width="${(end - c) * PX}" height="${PX}" fill="${color}"/>`,
        );
      }
      c = end;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS * PX} ${ROWS * PX}" shape-rendering="crispEdges">\n${rects.join("\n")}\n</svg>\n`;
}

// ---------- Scene 1: dusk (login page) ----------
function buildSunset() {
  const grid = makeGrid();

  fillBand(grid, 0, 2, "#170f2e");
  fillBand(grid, 3, 5, "#2a1650");
  fillBand(grid, 6, 8, "#4a1d68");
  fillBand(grid, 9, 11, "#7a2569");
  fillBand(grid, 12, 14, "#ac3a5c");
  fillBand(grid, 15, 17, "#e0573f");
  fillBand(grid, 18, 20, "#f89238");
  fillBand(grid, 21, 23, "#ffcf66");

  scatter(grid, [0, 9], [0, COLS], "#f6ecff", 22, 7);

  drawDisc(grid, 18, 46, [
    [3, "#ffb347"],
    [2, "#ffd27a"],
  ]);

  // far range
  drawRange(
    grid,
    [
      [0, 25],
      [10, 22],
      [20, 26],
      [32, 21],
      [44, 25],
      [54, 22],
      [63, 25],
    ],
    26,
    "#4b3b66",
  );

  // mid range with a Half-Dome-like sheared peak around col 30
  drawRange(
    grid,
    [
      [0, 30],
      [8, 26],
      [16, 29],
      [24, 30],
      [30, 15],
      [31, 15],
      [33, 31],
      [40, 27],
      [48, 30],
      [56, 25],
      [63, 29],
    ],
    31,
    "#372a4d",
  );

  // near range / treeline
  const nearHeights = drawRange(
    grid,
    [
      [0, 33],
      [12, 30],
      [24, 33],
      [36, 29],
      [48, 33],
      [63, 31],
    ],
    35,
    "#1c1526",
  );

  drawTrees(grid, nearHeights, "#100b18", 3, 11, [3, 6]);

  return gridToSvg(grid);
}

// ---------- Scene 2: daytime Yosemite valley (parks page) ----------
function buildDay() {
  const grid = makeGrid();

  fillBand(grid, 0, 2, "#1c6bab");
  fillBand(grid, 3, 5, "#2c86c2");
  fillBand(grid, 6, 8, "#4a9fd4");
  fillBand(grid, 9, 11, "#6cb6e0");
  fillBand(grid, 12, 14, "#93cbea");
  fillBand(grid, 15, 17, "#bfe1f2");
  fillBand(grid, 18, 19, "#e9f6fb");

  drawDisc(grid, 4, 55, [
    [3, "#ffe27a"],
    [2, "#fff6cf"],
  ]);

  const clouds = [
    [3, 12],
    [5, 22],
    [4, 40],
  ];
  for (const [r, c] of clouds) {
    for (let dc = 0; dc < 5; dc++) grid[r][c + dc] = "#ffffff";
    for (let dc = 1; dc < 4; dc++) grid[r - 1][c + dc] = "#ffffff";
  }

  // far hills
  drawRange(
    grid,
    [
      [0, 21],
      [14, 18],
      [28, 21],
      [42, 17],
      [55, 20],
      [63, 18],
    ],
    22,
    "#7fa9c9",
  );

  // El Capitan-like monolith (flat top, sheer sides) + granite mid range with Half Dome
  drawRange(
    grid,
    [
      [0, 24],
      [9, 24],
      [10, 13],
      [16, 13],
      [17, 24],
      [22, 24],
      [27, 25],
      [30, 12],
      [31, 12],
      [33, 26],
      [40, 22],
      [48, 25],
      [56, 21],
      [63, 24],
    ],
    28,
    "#8b8f96",
    { snowRow: 16, snowColor: "#f4f7fa", snowDepth: 2 },
  );

  drawWaterfall(grid, 13, 15, 27, "#dff2fb", "#eef8fc");

  // forest / valley floor
  const nearHeights = drawRange(
    grid,
    [
      [0, 30],
      [12, 27],
      [24, 30],
      [36, 26],
      [48, 30],
      [63, 28],
    ],
    33,
    "#1f3b23",
  );

  drawTrees(grid, nearHeights, "#16301a", 3, 5, [3, 6]);

  fillBand(grid, 34, 35, "#2f5c34");
  for (let c = 0; c < COLS; c += 4) grid[35][c] = "#3a6d3f";

  return gridToSvg(grid);
}

const outDir = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "mountains-login-dusk.svg"), buildSunset());
fs.writeFileSync(path.join(outDir, "mountains-parks-day.svg"), buildDay());
console.log("Generated pixel art landscapes in", outDir);
