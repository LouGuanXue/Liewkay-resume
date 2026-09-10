import { useRef } from 'react';
import './ChromaCard.css';

/**
 * ChromaCard — 来自 React Bits（reactbits.dev）的开源组件基础。
 * 单卡片视觉：深色渐变背景、悬停切换主题色边框、指针聚光。
 * 不负责灰度遮罩，遮罩由父级 ChromaGrid 叠加。
 */
export default function ChromaCard({
  as: Tag = 'div',
  className = '',
  gradient,
  borderColor,
  image,
  imageAlt = '',
  onClick,
  href,
  children,
  style,
  ...rest
}) {
  const ref = useRef(null);

  const onMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    node.style.setProperty('--mouse-x', `${x}px`);
    node.style.setProperty('--mouse-y', `${y}px`);
  };

  const mergedStyle = {
    ...style,
    '--card-border': borderColor || 'transparent',
    '--card-gradient': gradient || 'linear-gradient(145deg, #161616, #050505)',
    '--card-cursor': onClick || href ? 'pointer' : 'default',
  };

  const handleClick = (event) => {
    if (onClick) onClick(event);
    else if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Tag
      ref={ref}
      className={`chroma-card ${className}`.trim()}
      style={mergedStyle}
      onMouseMove={onMove}
      onClick={onClick || href ? handleClick : undefined}
      {...rest}
    >
      {image ? (
        <div className="chroma-img-wrapper">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      ) : null}
      <div className="chroma-card__body">{children}</div>
    </Tag>
  );
}
