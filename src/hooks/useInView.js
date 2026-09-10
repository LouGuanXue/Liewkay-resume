import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * 元素进入视口时返回 true，只触发一次。
 * 减弱动效偏好开启时直接返回 true，跳过所有位移与延迟。
 */
export function useInView({ threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  return [ref, inView, reduced];
}

/** 数字滚动，进入视口后启动。 */
export function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [ref, inView, reduced] = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    let raf = 0;
    let start = 0;
    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = target * eased;
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, decimals, reduced]);

  return [ref, value];
}
