import { capabilities, headings } from '../data/resumeData';
import { accentByIndex } from '../data/chromaAccents';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import ChromaGrid from './ChromaGrid';
import ThemedCard from './ThemedCard';

export default function Capabilities() {
  return (
    <section className="section" id="capabilities">
      <div className="shell">
        <SectionHeading {...headings.capabilities} />

        <ChromaGrid className="caps chroma-grid--wide" radius={360}>
          {capabilities.map((item, index) => {
            const accent = accentByIndex(index);
            return (
              <Reveal key={item.id} delay={(index % 3) * 80}>
                <ThemedCard
                  className="cap"
                  gradient={accent.gradient}
                  borderColor={accent.borderColor}
                >
                  <div className="cap__head">
                    <h3 className="cap__title">{item.title}</h3>
                    <span className="cap__sub">{item.sub}</span>
                  </div>
                  <p className="cap__desc">{item.desc}</p>
                  <span className="cap__line" aria-hidden="true" />
                </ThemedCard>
              </Reveal>
            );
          })}
        </ChromaGrid>
      </div>
    </section>
  );
}
