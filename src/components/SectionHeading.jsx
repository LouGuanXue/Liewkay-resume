import { useLayoutEffect, useRef } from 'react';
import { gsap, motionEnabled, splitChars } from '../motion/motion';

/**
 * 章节标题：巨型描边英文 ghost 字先大幅遮罩进场，编号/中文标题/分割线随后归位。
 * 无动效环境（reduced-motion / JS 不可用）下静态展示，ghost 仍然可见。
 */
export default function SectionHeading({ index, title, en }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!motionEnabled()) return undefined;
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const ghostChars = splitChars(root.querySelector('.heading__en'));
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: root, start: 'top 82%', once: true },
      });

      tl.fromTo(
        ghostChars,
        { yPercent: 118, rotate: 5, transformOrigin: '50% 100%' },
        { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.045 },
      )
        .fromTo(
          root.querySelector('.heading__index'),
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power4.out' },
          0.35,
        )
        .fromTo(
          root.querySelector('.heading__title'),
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power4.out' },
          0.4,
        )
        .fromTo(
          root.querySelector('.heading__rule'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'expo.inOut' },
          0.45,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="heading" ref={rootRef}>
      <span className="heading__en" aria-hidden="true">
        {en}
      </span>
      <span className="heading__index">{index}</span>
      <h2 className="heading__title">{title}</h2>
      <span className="heading__rule" aria-hidden="true" />
    </div>
  );
}
