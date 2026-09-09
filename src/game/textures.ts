import * as THREE from "three";

function makeCanvas(size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function finish(canvas: HTMLCanvasElement, repeat: number) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Dressed granite blocks: warm grey courses with chiselled speckle. */
export function graniteTexture(repeat = 4) {
  const canvas = makeCanvas(256);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#8d8579";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const g = 110 + Math.random() * 70;
    ctx.fillStyle = `rgba(${g},${g - 6},${g - 18},0.35)`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const rows = 6;
  const h = 256 / rows;
  for (let r = 0; r < rows; r++) {
    ctx.strokeStyle = "rgba(60,54,46,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, r * h);
    ctx.lineTo(256, r * h);
    ctx.stroke();
    const offset = r % 2 === 0 ? 0 : h;
    for (let c = 0; c < 4; c++) {
      const x = ((c * 256) / 4 + offset) % 256;
      ctx.beginPath();
      ctx.moveTo(x, r * h);
      ctx.lineTo(x, r * h + h);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,244,220,${0.03 + Math.random() * 0.05})`;
    ctx.fillRect(0, r * h + 2, 256, h - 4);
  }
  return finish(canvas, repeat);
}

/** Dry plain: dust, grass tufts, cart tracks. */
export function groundTexture(repeat = 24) {
  const canvas = makeCanvas(256);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#a8925f";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(${120 + Math.random() * 70},${100 + Math.random() * 60},${60 + Math.random() * 40},0.5)`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }
  for (let i = 0; i < 500; i++) {
    ctx.strokeStyle = `rgba(90,${110 + Math.random() * 50},60,0.45)`;
    ctx.lineWidth = 1;
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 4 - 2, y - 4 - Math.random() * 4);
    ctx.stroke();
  }
  return finish(canvas, repeat);
}

/** Still green moat water with silt swirls. */
export function waterTexture(repeat = 6) {
  const canvas = makeCanvas(256);
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, "#3f6b53");
  grad.addColorStop(0.5, "#4c7a5c");
  grad.addColorStop(1, "#35583f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 120; i++) {
    ctx.strokeStyle = `rgba(200,225,200,${0.03 + Math.random() * 0.08})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    const y = Math.random() * 256;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(80, y + 12, 170, y - 14, 256, y + 4);
    ctx.stroke();
  }
  return finish(canvas, repeat);
}

/** Lime plaster for temple and palace walls. */
export function plasterTexture(repeat = 3) {
  const canvas = makeCanvas(256);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#d9c8a4";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3500; i++) {
    ctx.fillStyle = `rgba(${170 + Math.random() * 60},${150 + Math.random() * 50},${110 + Math.random() * 40},0.4)`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = "rgba(140,115,80,0.18)";
    ctx.beginPath();
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 30 - 15, y + Math.random() * 40);
    ctx.stroke();
  }
  return finish(canvas, repeat);
}
