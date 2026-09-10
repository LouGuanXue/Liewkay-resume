import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 动效核心：注册 ScrollTrigger、统一缓动、动效总开关与字符切分工具。
 * 页面所有 GSAP 动效都从这里取 gsap / ScrollTrigger，保证插件只注册一次。
 */
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power4.out' });
gsap.config({ nullTargetWarn: false });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/* 开发环境暴露 gsap 供运行时诊断 */
if (import.meta.env?.DEV) {
  window.__G = gsap;
  window.__ST = ScrollTrigger;
}

export const MOTION_CLASS = 'motion-ready';

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** 模块加载时调用：非减弱动效环境下给 html 挂 motion-ready，CSS 初始态与 GSAP 编排随之生效。 */
export function enableMotion() {
  if (!prefersReducedMotion() && typeof document !== 'undefined') {
    document.documentElement.classList.add(MOTION_CLASS);
  }
}

export function motionEnabled() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains(MOTION_CLASS);
}

/**
 * 把元素文本切成带 overflow-hidden 遮罩的字符 span，返回内层字符 span 数组供 GSAP 编排。
 * 幂等：重复调用会复用已有切分结果（StrictMode 下 effect 会跑两轮）。
 */
export function splitChars(el) {
  if (!el) return [];
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll('.mchar'));
  }
  const text = el.textContent ?? '';
  el.textContent = '';
  el.dataset.split = 'true';
  const chars = [];
  for (const ch of text) {
    if (ch === ' ') {
      const space = document.createElement('span');
      space.className = 'mspace';
      space.innerHTML = '&nbsp;';
      el.appendChild(space);
      continue;
    }
    const mask = document.createElement('span');
    mask.className = 'mchar-mask';
    const inner = document.createElement('span');
    inner.className = 'mchar';
    inner.textContent = ch;
    mask.appendChild(inner);
    el.appendChild(mask);
    chars.push(inner);
  }
  return chars;
}
