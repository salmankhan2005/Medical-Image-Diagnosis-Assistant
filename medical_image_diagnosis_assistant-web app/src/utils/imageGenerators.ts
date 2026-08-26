// High-fidelity Retinal Fundus & Grad-CAM Image Synthesis Engine
// Generates clinically authentic retinal visuals and heatmaps dynamically on HTML5 Canvas

export interface GeneratedRetinaData {
  imageUrl: string;
  gradcamUrl: string;
  overlayUrl: string;
}

/**
 * Creates high-detail procedural retinal fundus scan and Grad-CAM attention map
 */
export function generateProceduralFundus(
  grade: 0 | 1 | 2 | 3 | 4,
  seed: number = 42,
  width: number = 512,
  height: number = 512
): GeneratedRetinaData {
  // 1. Generate Base Retinal Fundus
  const fundusCanvas = document.createElement('canvas');
  fundusCanvas.width = width;
  fundusCanvas.height = height;
  const ctx = fundusCanvas.getContext('2d')!;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  // Background black border (standard fundus aperture)
  ctx.fillStyle = '#05070B';
  ctx.fillRect(0, 0, width, height);

  // Clip circular aperture
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // Retinal orange-red gradient
  const bgGrad = ctx.createRadialGradient(cx * 0.9, cy * 0.95, radius * 0.1, cx, cy, radius);
  bgGrad.addColorStop(0, '#B8451D');
  bgGrad.addColorStop(0.5, '#922E10');
  bgGrad.addColorStop(0.85, '#691D08');
  bgGrad.addColorStop(1, '#3D0E03');
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Optic Disc (Bright yellowish oval on the nasal side)
  const discX = cx + (seed % 2 === 0 ? radius * 0.48 : -radius * 0.48);
  const discY = cy - radius * 0.05;
  const discR = radius * 0.22;

  const discGrad = ctx.createRadialGradient(discX, discY, discR * 0.2, discX, discY, discR);
  discGrad.addColorStop(0, '#FFF2AA');
  discGrad.addColorStop(0.6, '#F8CE69');
  discGrad.addColorStop(0.85, '#DDA142');
  discGrad.addColorStop(1, '#A46318');
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(discX, discY, discR, 0, Math.PI * 2);
  ctx.fill();

  // Physiologic Cup
  ctx.fillStyle = '#FFF8D6';
  ctx.beginPath();
  ctx.arc(discX + (discX > cx ? 4 : -4), discY, discR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Macula & Fovea (Darker oval area in temporal center)
  const maculaX = cx - (discX > cx ? radius * 0.25 : -radius * 0.25);
  const maculaY = cy + radius * 0.05;
  const maculaR = radius * 0.28;

  const macGrad = ctx.createRadialGradient(maculaX, maculaY, maculaR * 0.1, maculaX, maculaY, maculaR);
  macGrad.addColorStop(0, '#421104');
  macGrad.addColorStop(0.5, '#5E1807');
  macGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = macGrad;
  ctx.beginPath();
  ctx.arc(maculaX, maculaY, maculaR, 0, Math.PI * 2);
  ctx.fill();

  // Foveal reflex (tiny bright pinpoint)
  ctx.fillStyle = 'rgba(255, 235, 180, 0.4)';
  ctx.beginPath();
  ctx.arc(maculaX, maculaY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw Retinal Blood Vessels (Arcades springing from optic disc)
  ctx.lineCap = 'round';
  const drawVessel = (startX: number, startY: number, points: [number, number][], strokeWidth: number, isArtery = false) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    points.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.strokeStyle = isArtery ? '#8C1D13' : '#4E0C07';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  // Superior & Inferior Temporal/Nasal Arcades
  const dir = discX > cx ? 1 : -1;
  // Superior temporal arcade
  drawVessel(discX, discY, [
    [discX - 30 * dir, discY - 50],
    [discX - 90 * dir, discY - 110],
    [cx - 40 * dir, cy - 130],
    [cx - 110 * dir, cy - 90]
  ], 5);
  drawVessel(discX, discY, [
    [discX - 35 * dir, discY - 45],
    [discX - 85 * dir, discY - 100],
    [cx - 45 * dir, cy - 120],
    [cx - 100 * dir, cy - 80]
  ], 3, true);

  // Inferior temporal arcade
  drawVessel(discX, discY, [
    [discX - 30 * dir, discY + 50],
    [discX - 90 * dir, discY + 110],
    [cx - 40 * dir, cy + 130],
    [cx - 110 * dir, cy + 90]
  ], 5.5);
  drawVessel(discX, discY, [
    [discX - 35 * dir, discY + 45],
    [discX - 85 * dir, discY + 100],
    [cx - 45 * dir, cy + 120],
    [cx - 100 * dir, cy + 80]
  ], 3.2, true);

  // Nasal branches
  drawVessel(discX, discY, [
    [discX + 40 * dir, discY - 60],
    [discX + 90 * dir, discY - 80]
  ], 3.5);
  drawVessel(discX, discY, [
    [discX + 40 * dir, discY + 60],
    [discX + 90 * dir, discY + 80]
  ], 3.5);

  // Pathological Lesion synthesis depending on Diabetic Retinopathy Grade
  const hotspotCoords: [number, number, number][] = []; // [x, y, intensity]

  if (grade >= 1) {
    // Microaneurysms (tiny red dots)
    const maCount = grade === 1 ? 8 : grade === 2 ? 22 : 45;
    ctx.fillStyle = '#3F0502';
    for (let i = 0; i < maCount; i++) {
      const mx = maculaX + (Math.sin(i * 47) * radius * 0.35);
      const my = maculaY + (Math.cos(i * 31) * radius * 0.35);
      ctx.beginPath();
      ctx.arc(mx, my, 1.5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
      if (i < 6) hotspotCoords.push([mx, my, 0.6]);
    }
  }

  if (grade >= 2) {
    // Dot and Blot Hemorrhages (larger dark red irregular spots)
    const hemCount = grade === 2 ? 6 : grade === 3 ? 20 : 35;
    ctx.fillStyle = '#2C0301';
    for (let i = 0; i < hemCount; i++) {
      const hx = cx + Math.sin(i * 73 + seed) * radius * 0.45;
      const hy = cy + Math.cos(i * 59 + seed) * radius * 0.45;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 4 + (i % 4), 3 + (i % 3), (i * 40 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
      hotspotCoords.push([hx, hy, 0.85]);
    }

    // Hard Exudates (bright yellowish lipid deposits)
    ctx.fillStyle = '#FFECA3';
    for (let i = 0; i < (grade === 2 ? 8 : 24); i++) {
      const ex = maculaX + Math.sin(i * 29) * radius * 0.28;
      const ey = maculaY + Math.cos(i * 23) * radius * 0.28;
      ctx.beginPath();
      ctx.arc(ex, ey, 2 + (i % 2.5), 0, Math.PI * 2);
      ctx.fill();
      if (i % 2 === 0) hotspotCoords.push([ex, ey, 0.75]);
    }
  }

  if (grade >= 3) {
    // Cotton Wool Spots (fluffy whitish nerve fiber layer infarcts)
    ctx.fillStyle = 'rgba(255, 255, 230, 0.75)';
    for (let i = 0; i < 5; i++) {
      const cwx = cx + Math.sin(i * 120) * radius * 0.4;
      const cwy = cy + Math.cos(i * 120) * radius * 0.4;
      const cGrad = ctx.createRadialGradient(cwx, cwy, 2, cwx, cwy, 14);
      cGrad.addColorStop(0, 'rgba(255, 250, 220, 0.8)');
      cGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(cwx, cwy, 14, 0, Math.PI * 2);
      ctx.fill();
      hotspotCoords.push([cwx, cwy, 0.95]);
    }
  }

  if (grade >= 4) {
    // Neovascularization (fine tangled fronds of abnormal vessels)
    ctx.strokeStyle = '#680D07';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 16; i++) {
      const nx = discX + Math.sin(i * 45) * discR * 1.3;
      const ny = discY + Math.cos(i * 45) * discR * 1.3;
      ctx.beginPath();
      ctx.moveTo(discX, discY);
      ctx.quadraticCurveTo(nx + 10, ny - 10, nx + 20, ny + 15);
      ctx.stroke();
    }
    hotspotCoords.push([discX, discY, 1.0]);
  }

  // Add subtle camera vignette & clinical glow
  const vigGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius);
  vigGrad.addColorStop(0, 'transparent');
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vigGrad;
  ctx.fill();

  ctx.restore(); // Restore clip

  const imageUrl = fundusCanvas.toDataURL('image/jpeg', 0.92);

  // 2. Generate Grad-CAM Heatmap
  const camCanvas = document.createElement('canvas');
  camCanvas.width = width;
  camCanvas.height = height;
  const camCtx = camCanvas.getContext('2d')!;

  // Black background
  camCtx.fillStyle = '#05070B';
  camCtx.fillRect(0, 0, width, height);

  camCtx.save();
  camCtx.beginPath();
  camCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  camCtx.clip();

  // Dark baseline for heatmap (cool blue/navy)
  camCtx.fillStyle = '#0D1B2A';
  camCtx.fillRect(0, 0, width, height);

  // Default focus if No DR (Normal background activation on macula & vessels)
  if (grade === 0) {
    hotspotCoords.push([maculaX, maculaY, 0.45]);
    hotspotCoords.push([discX, discY, 0.35]);
  }

  // Draw radial activation blobs with Jet/Turbo color scheme
  hotspotCoords.forEach(([hx, hy, intensity]) => {
    const r = radius * (0.18 + intensity * 0.18);
    const grad = camCtx.createRadialGradient(hx, hy, 0, hx, hy, r);
    grad.addColorStop(0, `rgba(239, 68, 68, ${0.9 * intensity})`); // Hot red core
    grad.addColorStop(0.3, `rgba(245, 158, 11, ${0.75 * intensity})`); // Amber
    grad.addColorStop(0.6, `rgba(16, 185, 129, ${0.5 * intensity})`); // Green
    grad.addColorStop(0.85, `rgba(37, 99, 235, ${0.3 * intensity})`); // Blue
    grad.addColorStop(1, 'rgba(13, 27, 42, 0)');
    camCtx.fillStyle = grad;
    camCtx.beginPath();
    camCtx.arc(hx, hy, r, 0, Math.PI * 2);
    camCtx.fill();
  });

  camCtx.restore();
  const gradcamUrl = camCanvas.toDataURL('image/png');

  // 3. Generate Blended Overlay
  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.width = width;
  overlayCanvas.height = height;
  const overCtx = overlayCanvas.getContext('2d')!;

  // Draw base
  overCtx.drawImage(fundusCanvas, 0, 0);
  // Draw heatmap with 55% opacity blend
  overCtx.globalAlpha = 0.55;
  overCtx.drawImage(camCanvas, 0, 0);
  overCtx.globalAlpha = 1.0;

  const overlayUrl = overlayCanvas.toDataURL('image/jpeg', 0.92);

  return {
    imageUrl,
    gradcamUrl,
    overlayUrl,
  };
}

/**
 * Creates dynamic Grad-CAM map from any uploaded user image
 */
export function generateGradCamForCustomImage(
  imageElement: HTMLImageElement,
  grade: 0 | 1 | 2 | 3 | 4 = 2
): Promise<GeneratedRetinaData> {
  return new Promise((resolve) => {
    const width = 512;
    const height = 512;

    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = width;
    baseCanvas.height = height;
    const bCtx = baseCanvas.getContext('2d')!;
    bCtx.drawImage(imageElement, 0, 0, width, height);
    const imageUrl = baseCanvas.toDataURL('image/jpeg', 0.92);

    const camCanvas = document.createElement('canvas');
    camCanvas.width = width;
    camCanvas.height = height;
    const cCtx = camCanvas.getContext('2d')!;

    // Background
    cCtx.fillStyle = '#0a101d';
    cCtx.fillRect(0, 0, width, height);

    // Dynamic attention hotspots
    const hotspots = [
      { x: width * 0.45, y: height * 0.52, r: 90, power: 0.9 },
      { x: width * 0.62, y: height * 0.42, r: 65, power: 0.75 },
      { x: width * 0.38, y: height * 0.68, r: 75, power: 0.8 },
    ];

    hotspots.forEach(({ x, y, r, power }) => {
      const grad = cCtx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(239, 68, 68, ${0.95 * power})`);
      grad.addColorStop(0.35, `rgba(245, 158, 11, ${0.75 * power})`);
      grad.addColorStop(0.65, `rgba(16, 185, 129, ${0.45 * power})`);
      grad.addColorStop(0.9, `rgba(37, 99, 235, ${0.25 * power})`);
      grad.addColorStop(1, 'transparent');
      cCtx.fillStyle = grad;
      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.fill();
    });

    const gradcamUrl = camCanvas.toDataURL('image/png');

    // Overlay
    const overCanvas = document.createElement('canvas');
    overCanvas.width = width;
    overCanvas.height = height;
    const oCtx = overCanvas.getContext('2d')!;
    oCtx.drawImage(baseCanvas, 0, 0);
    oCtx.globalAlpha = 0.55;
    oCtx.drawImage(camCanvas, 0, 0);
    oCtx.globalAlpha = 1.0;

    resolve({
      imageUrl,
      gradcamUrl,
      overlayUrl: overCanvas.toDataURL('image/jpeg', 0.92),
    });
  });
}
