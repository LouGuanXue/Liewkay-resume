import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { profile, hero } from '../data/resumeData';
import HeroCanvas from './HeroCanvas';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap, motionEnabled } from '../motion/motion';

const LETTERS = ['L', 'I', 'E', 'W', 'K', 'A', 'Y'];
/* 背景视频自托管于 public/，BASE_URL 前缀保证 GitHub Pages 子路径部署下同样可用 */
const VIDEO_SRC = `${import.meta.env.BASE_URL}hero-bg.mp4`;
/* 桌面与手机共用同一套首屏参数，保证两端看到的是同一段画面、同一种节奏 */
const MOBILE_QUERY = '(max-width: 860px)';

export default function Hero() {
  const { heroVideo, heroPoster } = profile;
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);

  const handleRipple = (event) => {
    if (reduced) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--rx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--ry', `${event.clientY - rect.top}px`);
    node.classList.remove('is-rippling');
    void node.offsetWidth;
    node.classList.add('is-rippling');
  };

  /* 背景视频：桌面与手机统一为静音自动循环，两端看到的是同一段画面。
     保留 8 秒元数据兜底，拿不到就判定不可用，回落到渐变画布 */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoOk) return undefined;

    const failTimer = setTimeout(() => {
      if (!video.duration) setVideoOk(false);
    }, 8000);

    // 部分浏览器存在自动播放策略拦截，兜底再试一次并忽略失败
    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    video.addEventListener('loadeddata', tryPlay);

    return () => {
      clearTimeout(failTimer);
      video.removeEventListener('loadeddata', tryPlay);
    };
  }, [videoOk]);

  /* 首屏 Opening：幕布定格 → 上掀 → 字母压缩归位 → 头像圆形揭开 → 逐行简介 → 底部进场
     时间线同步构建（paused），字体就绪后再 play，规避 StrictMode 挂载竞态 */
  useLayoutEffect(() => {
    if (!motionEnabled()) return undefined;
    const root = rootRef.current;
    const nav = document.querySelector('.nav');
    let tl;
    let disposed = false;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });

      tl.fromTo(
        q('.openingVeil__mark'),
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 },
        0.05,
      )
        .fromTo(
          q('.openingVeil__rule'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.65, ease: 'expo.inOut' },
          0.18,
        )
        .to(
          q('.openingVeil__inner'),
          { y: -18, autoAlpha: 0, duration: 0.4, ease: 'power2.in' },
          0.78,
        )
        .to(
          q('.openingVeil'),
          { yPercent: -100, duration: 1.05, ease: 'expo.inOut' },
          0.82,
        )
        .set(q('.openingVeil'), { display: 'none' })
        .fromTo(q('.hero__media'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5 }, 0.9)
        .fromTo(
          nav,
          { y: -26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.95,
        )
        .fromTo(
          q('.hero__letter'),
          { autoAlpha: 0, yPercent: 130, scaleY: 1.45, transformOrigin: '50% 0%' },
          { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: 1.2, stagger: 0.07 },
          1.2,
        )
        .fromTo(
          q('.hero__portraitCircle'),
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(50% at 50% 50%)', duration: 0.95, ease: 'expo.inOut' },
          1.5,
        )
        .fromTo(
          q('.hero__portraitCircle img'),
          { scale: 1.38 },
          { scale: 1, duration: 1.25 },
          1.5,
        )
        .fromTo(
          q('.hero__introHead > *'),
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.1 },
          1.6,
        )
        .fromTo(
          q('.lineInner'),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.05, stagger: 0.14 },
          1.95,
        )
        .fromTo(
          q('.hero__bottomLeft'),
          { y: 46, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.1 },
          2.2,
        )
        .fromTo(
          q('.hero__bottomRight'),
          { y: 46, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.1 },
          2.35,
        )
        .fromTo(q('.hero__cue'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 2.65);
    }, root);

    /* 等字体就绪再开场，避免动画中途字宽跳变；最多等 1.2s 兜底。
       disposed 守护：StrictMode 卸载的时间线不再播放 */
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 1200))]).then(() => {
      if (!disposed && tl) tl.play();
    });

    return () => {
      disposed = true;
      ctx.revert();
    };
  }, []);

  /* 滚动视差：头像块下沉、wordmark 上漂、简介轻移，scrub 跟手。
     桌面与手机同源同向：字标与简介用同一组百分比，头像在手机端处在文档流里，
     幅度从 30% 收到 20%。手机端头像底到字标顶只有 36px 余量，
     20% 下沉约 18px 配合字标上移 10px 仍留有安全间距 */
  useLayoutEffect(() => {
    if (!motionEnabled()) return undefined;
    const root = rootRef.current;
    const narrow = window.matchMedia(MOBILE_QUERY).matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const common = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        ease: 'none',
      };
      gsap.to(q('.hero__portraitBlock'), {
        yPercent: narrow ? 20 : 30,
        scrollTrigger: common,
      });
      gsap.to(q('.hero__wordmarkWrap'), { yPercent: -16, scrollTrigger: common });
      gsap.to(q('.hero__intro'), { yPercent: 10, scrollTrigger: common });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="openingVeil" aria-hidden="true">
        <div className="openingVeil__inner">
          <span className="openingVeil__mark">{hero.veilMark}</span>
          <span className="openingVeil__rule" />
        </div>
      </div>

      <div className="hero__media" aria-hidden="true">
        <HeroCanvas />
        {videoOk && (
          <video
            ref={videoRef}
            className="hero__video"
            src={VIDEO_SRC}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            onError={() => setVideoOk(false)}
            onLoadedData={(event) => event.currentTarget.classList.add('is-ready')}
          />
        )}
        {heroVideo && (
          <video
            className="hero__video"
            src={heroVideo}
            poster={heroPoster || undefined}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={(event) => event.currentTarget.classList.add('is-ready')}
          />
        )}
        <span className="hero__scrim" />
        <span className="hero__vignette" />
      </div>

      <div className="hero__portraitBlock" aria-hidden="true">
        <span className="hero__portraitCircle">
          <img src={`${import.meta.env.BASE_URL}portrait.png`} alt="" loading="lazy" />
        </span>
      </div>

      <div className="hero__wordmarkWrap">
        <h1 className="hero__wordmark" aria-label="Liewkay">
          {LETTERS.map((char, index) => (
            <span key={char} className="hero__letterMask">
              <span className="hero__letter" style={{ '--i': index }}>
                {char}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div className="shell hero__intro">
        <div className="hero__introHead">
          <p className="hero__eyebrow">{hero.eyebrow}</p>
          <h2 className="hero__name">
            <span className="hero__nameAccent">{profile.name.slice(0, 1)}</span>
            {profile.name.slice(1)}
          </h2>
          <p className="hero__roleLine">
            {profile.role} <span className="hero__roleAccent">{profile.tagline}</span>
          </p>
        </div>
        <p className="hero__introText">
          {hero.introLines.map((line) => (
            <span key={line} className="lineMask">
              <span className="lineInner">{line}</span>
            </span>
          ))}
        </p>
      </div>

      <div className="shell hero__bottom">
        <div className="hero__bottomLeft">
          <div className="hero__stat">
            <span className="hero__statPrefix">{hero.stat.prefix}</span>
            <span className="hero__statNum">{hero.stat.value}</span>
            <span className="hero__statSuffix">{hero.stat.suffix}</span>
          </div>
          <p className="hero__statLabel">{hero.stat.label}</p>

          <a
            className="hero__cta"
            href="#projects"
            onClick={(event) => {
              event.preventDefault();
              const node = document.getElementById('projects');
              if (!node) return;
              const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            }}
            onPointerDown={handleRipple}
            onAnimationEnd={(event) => {
              if (event.animationName === 'ripple') {
                event.currentTarget.classList.remove('is-rippling');
              }
            }}
          >
            <span>{hero.cta}</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
            <span className="hero__cta__ripple" aria-hidden="true" />
          </a>
        </div>

        <div className="hero__bottomRight">
          <p className="hero__quote">{hero.quote}</p>
          <p className="hero__quoteSub">{hero.quoteSub}</p>
          <span className="hero__arrowBig" aria-hidden="true">
            &rarr;
          </span>
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span>SCROLL</span>
        <i />
      </div>
    </section>
  );
}
