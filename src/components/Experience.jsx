import { experience, headings } from '../data/resumeData';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="shell">
        <SectionHeading {...headings.experience} />

        <ol className="timeline">
          {experience.map((job, index) => (
            <Reveal as="li" key={job.id} className="job" delay={index * 90}>
              <div className="job__rail" aria-hidden="true">
                <span className="job__dot" />
                <span className="job__year">{job.timelineYear}</span>
              </div>

              <div className="job__body">
                <div className="job__head">
                  <h3 className="job__company">
                    {job.company}
                    {job.current && <span className="job__badge">在职</span>}
                  </h3>
                  <p className="job__meta">
                    <span className="job__title">{job.title}</span>
                    <span className="job__period">{job.period}</span>
                  </p>
                </div>

                {job.groups.map((group, groupIndex) => (
                  <div className="job__group" key={group.name || groupIndex}>
                    {group.name && <h4 className="job__groupName">{group.name}</h4>}
                    <ul className="job__bullets">
                      {group.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
