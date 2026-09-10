import { useMemo, useState } from 'react';
import { projects, projectCategories, headings } from '../data/resumeData';
import { accentByIndex } from '../data/chromaAccents';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import ChromaGrid from './ChromaGrid';
import ThemedCard from './ThemedCard';

export default function Projects() {
  const [active, setActive] = useState('all');

  const list = useMemo(
    () => (active === 'all' ? projects : projects.filter((item) => item.category === active)),
    [active],
  );

  return (
    <section className="section" id="projects">
      <div className="shell">
        <SectionHeading {...headings.projects} />

        <div className="filters" role="tablist" aria-label="项目分类">
          {projectCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active === cat.id}
              className={`filter ${active === cat.id ? 'on' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <ChromaGrid className="projects chroma-grid--wide" radius={360}>
          {list.map((item, index) => {
            const accent = accentByIndex(item.accent - 1);
            return (
              <Reveal key={item.id} delay={(index % 3) * 90}>
                <ThemedCard
                  as="article"
                  className="project"
                  gradient={accent.gradient}
                  borderColor={accent.borderColor}
                >
                  <div className="project__top">
                    <span className="project__tag">{item.tag}</span>
                    <span className="project__metric">{item.metric}</span>
                  </div>
                  <h3 className="project__title">{item.title}</h3>
                  <p className="project__desc">{item.desc}</p>
                </ThemedCard>
              </Reveal>
            );
          })}
        </ChromaGrid>
      </div>
    </section>
  );
}
