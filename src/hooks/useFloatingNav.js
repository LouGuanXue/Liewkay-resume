import { useEffect, useState } from 'react';

/**
 * 滚过首屏指定比例后返回 true，用于触发导航栏的悬浮玻璃态。
 * ratio 默认 0.78，即首屏滑走约八成时切换。
 * 滚动回调走 rAF 节流，避免高频布局读取。
 */
export function useFloatingNav(targetId, ratio = 0.78) {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return undefined;

    let raf = 0;

    const measure = () => {
      raf = 0;
      setFloating(window.scrollY > el.offsetHeight * ratio);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId, ratio]);

  return floating;
}
