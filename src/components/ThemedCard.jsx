import { useEffect, useState } from 'react';
import ChromaCard from './ChromaCard';
import BorderGlow from './BorderGlow';

/**
 * 主题感知卡片：浅色走 BorderGlow（冷白底 + 蓝色 mesh 描边），深色走 ChromaCard（保留原色温渐变）。
 * 对外只暴露和 ChromaCard 一致的 props（gradient / borderColor / as / className / image / imageAlt / children / onClick / href），
 * 内部按 data-theme 自动切换具体实现。
 */

const LIGHT_BG = '#fbfcff';
const LIGHT_MESH = ['#bfd6ff', '#7aa9ff', '#2f6dde']; // tailwind blue-200 / blue-400 / blue-700
const LIGHT_GLOW = '218 95 60'; // 蓝相高饱和

function readTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export default function ThemedCard(props) {
  const {
    as,
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
  } = props;

  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => setTheme(readTheme());
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (theme === 'light') {
    return (
      <BorderGlow
        backgroundColor={LIGHT_BG}
        colors={LIGHT_MESH}
        glowColor={LIGHT_GLOW}
        borderRadius={20}
        glowRadius={36}
        glowIntensity={0.85}
        edgeSensitivity={35}
        coneSpread={22}
        fillOpacity={0.35}
        className={`themed-card themed-card--light ${className}`.trim()}
      >
        {image ? (
          <div className="themed-card__media">
            <img src={image} alt={imageAlt} loading="lazy" />
          </div>
        ) : null}
        <div className="themed-card__body">{children}</div>
      </BorderGlow>
    );
  }

  return (
    <ChromaCard
      as={as}
      className={`themed-card themed-card--dark ${className}`.trim()}
      gradient={gradient}
      borderColor={borderColor}
      image={image}
      imageAlt={imageAlt}
      onClick={onClick}
      href={href}
      style={style}
      {...rest}
    >
      {children}
    </ChromaCard>
  );
}