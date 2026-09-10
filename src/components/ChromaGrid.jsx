import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

/**
 * ChromaGrid — 来自 React Bits（reactbits.dev）的开源组件。
 * 容器层只负责把网格内容叠上灰度+暗化遮罩，用 GSAP quickSetter 跟随指针位置。
 * 卡片视觉由子级 ChromaCard 提供。
 */
export default function ChromaGrid({
  as: Tag = 'div',
  className = '',
  radius = 360,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  children,
  style,
  ...rest
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (event) => {
    const node = rootRef.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    moveTo(event.clientX - r.left, event.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const mergedStyle = {
    ...style,
    '--r': `${radius}px`,
  };

  return (
    <Tag
      ref={rootRef}
      className={`chroma-grid ${className}`.trim()}
      style={mergedStyle}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
      <div className="chroma-overlay" aria-hidden="true" />
      <div ref={fadeRef} className="chroma-fade" aria-hidden="true" />
    </Tag>
  );
}
