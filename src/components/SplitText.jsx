import { useInView } from '../hooks/useInView';

/** 标题逐词渐显。按字符切分，中文不依赖空格分词，兼容性更好。 */
export default function SplitText({ text, className = '', delay = 0, step = 26 }) {
  const [ref, inView, reduced] = useInView({ threshold: 0.3 });
  const chars = Array.from(text);

  return (
    <span ref={ref} className={`split ${className}`.trim()} aria-label={text}>
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          aria-hidden="true"
          className={`split__char ${inView ? 'is-in' : ''}`}
          style={{
            transitionDelay: reduced ? '0ms' : `${delay + index * step}ms`,
            display: char === ' ' ? 'inline' : 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
