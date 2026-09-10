import { education, headings } from '../data/resumeData';
import { accentByIndex } from '../data/chromaAccents';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import ChromaGrid from './ChromaGrid';
import ThemedCard from './ThemedCard';

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="shell">
        <SectionHeading {...headings.education} />

        <ChromaGrid className="edu chroma-grid--wide" radius={340}>
          <Reveal>
            <ThemedCard
              as="article"
              className="edu__card"
              gradient={accentByIndex(0).gradient}
              borderColor={accentByIndex(0).borderColor}
            >
              <span className="edu__label">教育背景</span>
              <h3 className="edu__school">{education.school}</h3>
              <p className="edu__major">{education.major}</p>
              <p className="edu__period">{education.period}</p>
            </ThemedCard>
          </Reveal>

          <Reveal delay={90}>
            <ThemedCard
              as="article"
              className="edu__card"
              gradient={accentByIndex(1).gradient}
              borderColor={accentByIndex(1).borderColor}
            >
              <span className="edu__label">荣誉与证书</span>
              <ul className="chips">
                {education.honors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ThemedCard>
          </Reveal>

          <Reveal delay={180}>
            <ThemedCard
              as="article"
              className="edu__card"
              gradient={accentByIndex(2).gradient}
              borderColor={accentByIndex(2).borderColor}
            >
              <span className="edu__label">关键词</span>
              <ul className="chips chips--accent">
                {education.keywords.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ThemedCard>
          </Reveal>

          <Reveal delay={270}>
            <ThemedCard
              as="article"
              className="edu__card"
              gradient={accentByIndex(3).gradient}
              borderColor={accentByIndex(3).borderColor}
            >
              <span className="edu__label">其他</span>
              <ul className="chips">
                {education.hobby.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ThemedCard>
          </Reveal>
        </ChromaGrid>
      </div>
    </section>
  );
}
