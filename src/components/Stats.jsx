import { stats, headings } from '../data/resumeData';
import { useCountUp } from '../hooks/useInView';
import SectionHeading from './SectionHeading';

function StatItem({ item }) {
  const [ref, value] = useCountUp(item.value, { decimals: item.decimals });

  return (
    <div className="stat" ref={ref}>
      <div className="stat__value">
        {item.prefix && <span className="stat__prefix">{item.prefix}</span>}
        <span className="stat__num">
          {item.decimals > 0 ? value.toFixed(item.decimals) : value}
        </span>
        <span className="stat__suffix">{item.suffix}</span>
      </div>
      <p className="stat__label">{item.label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="section section--tight" id="numbers">
      <div className="shell">
        <SectionHeading {...headings.stats} />
        <div className="stats">
          {stats.map((item) => (
            <StatItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
