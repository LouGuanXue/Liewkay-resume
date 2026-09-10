import { sections } from '../data/resumeData';
import { useActiveSection } from '../hooks/useActiveSection';
import { useFloatingNav } from '../hooks/useFloatingNav';
import ThemeToggle from './ThemeToggle';

const IDS = sections.map((item) => item.id);

/**
 * 章节导航。手机端与桌面端共用同一形态：横向链接条右对齐，主题按钮收尾，
 * 滚过首屏后浮出磨砂胶囊。窄屏靠 clamp 收紧字号与间距适配，不再折成汉堡菜单。
 */
export default function Nav() {
  const active = useActiveSection(IDS);
  const floating = useFloatingNav('top');

  const go = (event, id) => {
    event.preventDefault();
    const node = document.getElementById(id);
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <header className={`nav ${floating ? 'is-floating' : ''}`}>
      <div className="nav__inner">
        <span className="nav__pill" aria-hidden="true" />

        <nav className="nav__menu" aria-label="章节导航">
          <ul className="nav__list">
            {sections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'on' : ''}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={(event) => go(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
