import { statement, pillars, headings } from '../data/resumeData';
import { accentByIndex } from '../data/chromaAccents';
import Reveal from './Reveal';
import ChromaGrid from './ChromaGrid';
import ThemedCard from './ThemedCard';
import SectionHeading from './SectionHeading';

export default function Profile() {
  return (
    <section className="section" id="profile">
      <div className="shell">
        <SectionHeading {...headings.profile} />

        <Reveal as="p" className="statement">
          {statement.before}
          <em>{statement.highlight}</em>
          {statement.after}
        </Reveal>

        <ChromaGrid className="pillars chroma-grid--wide" radius={420}>
          {pillars.map((item, index) => {
            const accent = accentByIndex(index);
            return (
              <Reveal key={item.id} delay={index * 110}>
                <ThemedCard
                  as="article"
                  className="pillar"
                  gradient={accent.gradient}
                  borderColor={accent.borderColor}
                >
                  <span className="pillar__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3 className="pillar__title">{item.title}</h3>
                  <p className="pillar__desc">{item.desc}</p>
                </ThemedCard>
              </Reveal>
            );
          })}
        </ChromaGrid>
      </div>
    </section>
  );
}
