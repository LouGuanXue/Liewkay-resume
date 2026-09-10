import { useEffect, useState } from 'react';

const KEY = 'liukai-theme';

/** 同步手机浏览器地址栏配色，与页面底色一致 */
const syncThemeColor = (theme) => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f7fb' : '#0B0F10');
};

const readTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark';

/** 主题切换：sun=当前深色（点击转浅色），moon=当前浅色（点击转深色） */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const onChange = () => setTheme(readTheme());
    window.addEventListener('themechange', onChange);
    return () => window.removeEventListener('themechange', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    syncThemeColor(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* 隐私模式下存储失败可忽略，本次会话仍生效 */
    }
    window.dispatchEvent(new Event('themechange'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={toggle}
      aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
      title={isDark ? '切换到浅色主题' : '切换到深色主题'}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.1" />
          <path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.4 14.3A8.4 8.4 0 0 1 9.7 3.6a8.4 8.4 0 1 0 10.7 10.7Z" />
        </svg>
      )}
    </button>
  );
}
