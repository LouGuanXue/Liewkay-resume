import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * 无缝循环渐变画布，充当首屏视频的零素材替身。
 *
 * 每个色团的圆心走利萨如轨迹，频率取整数倍，
 * 因此在 PERIOD 处首尾完全重合，循环没有跳帧。
 * 画布内部分辨率固定为 400×240，由 CSS 拉伸并加模糊，
 * 每帧成本极低，不随视口尺寸增长。
 */

const PERIOD = 26000;

const BLOBS = [
  { rgb: [225, 29, 42], r: 0.7, kx: 1, ky: 2, px: 0.0, py: 1.1, a: 0.58 },
  { rgb: [120, 12, 18], r: 0.6, kx: 2, ky: 1, px: 2.1, py: 0.4, a: 0.62 },
  { rgb: [38, 6, 9], r: 0.5, kx: 1, ky: 3, px: 4.0, py: 2.6, a: 0.78 },
  { rgb: [180, 22, 32], r: 0.42, kx: 3, ky: 2, px: 1.2, py: 3.4, a: 0.32 },
];

const W = 400;
const H = 240;

function paint(ctx, t) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0B0F10';
  ctx.fillRect(0, 0, W, H);

  ctx.globalCompositeOperation = 'lighter';
  const base = (t / PERIOD) * Math.PI * 2;

  for (let i = 0; i < BLOBS.length; i += 1) {
    const b = BLOBS[i];
    const x = W * (0.5 + 0.34 * Math.sin(base * b.kx + b.px));
    const y = H * (0.5 + 0.32 * Math.cos(base * b.ky + b.py));
    const rad = Math.max(W, H) * b.r * 0.5;
    const [r, g, bl] = b.rgb;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, `rgba(${r},${g},${bl},${b.a})`);
    grad.addColorStop(0.55, `rgba(${r},${g},${bl},${b.a * 0.28})`);
    grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
}

export default function HeroCanvas() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    if (reduced) {
      paint(ctx, 0);
      return undefined;
    }

    let raf = 0;
    let visible = true;

    const loop = (now) => {
      if (visible && !document.hidden) paint(ctx, now % PERIOD);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
          })
        : null;
    if (io) io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={ref} className="hero__canvas" width={W} height={H} aria-hidden="true" />;
}
