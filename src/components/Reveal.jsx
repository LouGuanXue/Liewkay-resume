import { useLayoutEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { gsap, motionEnabled } from '../motion/motion';

/**
 * 滚动揭示容器。
 * 动效环境下由 GSAP + ScrollTrigger 驱动：位移 46px+、轻微 3D 归位，expo/power4 丝滑缓动。
 * delay 单位 ms，用于同组元素做阶梯延迟（stagger 节奏）。
 * 非动效环境回退到 CSS transition（.reveal / .is-in，由 IntersectionObserver 触发）。
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 22,
  className = '',
  children,
  ...rest
}) {
  const [observeRef, inView] = useInView();
  const gsapRef = useRef(null);

  const setRef = (node) => {
    observeRef.current = node;
    gsapRef.current = node;
  };

  useLayoutEffect(() => {
    if (!motionEnabled()) return undefined;
    const el = gsapRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          autoAlpha: 0,
          y: Math.max(y, 46),
          scale: 0.985,
          rotateX: 6,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.15,
          ease: 'power4.out',
          delay: delay / 1000,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <Tag
      ref={setRef}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-y': `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
