import { useEffect, useRef, useState } from 'react';
import { sections } from '../data/resumeData';
import { useActiveSection } from '../hooks/useActiveSection';
import { useFloatingNav } from '../hooks/useFloatingNav';
import ThemeToggle from './ThemeToggle';

const IDS = sections.map((item) => item.id);
const MOBILE_QUERY = '(max-width: 860px)';
const PANEL_ID = 'nav-panel';

export default function Nav() {
  const active = useActiveSection(IDS);
  const floating = useFloatingNav('top');
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  /* 视口回到桌面宽度时收起面板，避免状态残留 */
  useEffect(() => {
    if (!open) return undefined;
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => {
      if (!event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  /* 打开时锁页面滚动、Esc 关闭、焦点移入面板首个链接 */
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector('a')?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const go = (event, id) => {
    event.preventDefault();
    setOpen(false);
    const node = document.getElementById(id);
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <header className={`nav ${floating ? 'is-floating' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <span className="nav__pill" aria-hidden="true" />

        <nav className="nav__menu" id={PANEL_ID} aria-label="章节导航" ref={panelRef}>
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

        <button
          type="button"
          className="nav__toggle"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav__toggleBars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <span className="nav__scrim" aria-hidden="true" onClick={() => setOpen(false)} />
    </header>
  );
}
