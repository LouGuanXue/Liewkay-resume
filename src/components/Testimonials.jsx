import { testimonials, headings } from '../data/resumeData';
import { accentByIndex } from '../data/chromaAccents';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import ChromaGrid from './ChromaGrid';
import ThemedCard from './ThemedCard';

/** 他人评价。数据为空时整体不渲染，避免占位与臆造。 */
export default function Testimonials() {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="section section--tight" id="testimonials">
      <div className="shell">
        <SectionHeading {...headings.testimonials} />
        <ChromaGrid className="quotes chroma-grid--wide" radius={340}>
          {testimonials.map((item, index) => {
            const accent = accentByIndex(index);
            return (
              <Reveal key={item.name} delay={(index % 2) * 100}>
                <ThemedCard
                  as="figure"
                  className="quote"
                  gradient={accent.gradient}
                  borderColor={accent.borderColor}
                >
                  <blockquote className="quote__text">{item.quote}</blockquote>
                  <figcaption className="quote__by">
                    <span className="quote__name">{item.name}</span>
                    <span className="quote__role">{item.role}</span>
                  </figcaption>
                </ThemedCard>
              </Reveal>
            );
          })}
        </ChromaGrid>
      </div>
    </section>
  );
}
