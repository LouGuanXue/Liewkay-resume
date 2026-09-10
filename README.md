# 刘凯 · 动态个人简历（React + Vite）

由 HTML 简历（v19_finesse）迁移而来的单页动态简历站点。内容全部收拢在一个数据文件里，动效由 GSAP ScrollTrigger 编排，支持深色（红，默认）/ 浅色（蓝）双主题切换。

## 快速开始

```bash
npm install
npm run dev
```

启动后访问 http://localhost:5173 即可预览。

打包与本地预览生产产物：

```bash
npm run build
npm run preview
```

## 技术栈

- React 18 + Vite 7
- `gsap` + ScrollTrigger：首屏开场时间线、滚动揭示、视差 scrub
- `ogl`：Grainient WebGL 渐变背景（React Bits）
- `tailwindcss` v4（仅引入 theme + utilities 层，跳过 preflight，不干扰既有排版）

## 目录结构

```
resume-site/
├─ index.html                 含主题恢复内联脚本（防闪帧 + 同步地址栏配色）与 favicon
├─ vite.config.js             base 读 VITE_BASE，支持子路径部署
├─ .github/workflows/
│  └─ deploy.yml              构建并发布到 GitHub Pages
├─ public/
│  ├─ hero-bg.mp4             首屏背景视频（H.264 / 8 位 yuv420p，勿直接替换为 HEVC）
│  ├─ portrait.png            个人照片（首屏头像）
│  ├─ robots.txt              禁止搜索引擎收录
│  └─ .nojekyll               跳过 Jekyll 处理
├─ tools/
│  ├─ make_qr.py              生成分享二维码（PNG + SVG，自带解码自检）
│  └─ transcode_hero.py       首屏视频转 H.264，自检 fourcc / 帧数 / PSNR
└─ src/
   ├─ main.jsx                入口
   ├─ App.jsx                 页面装配（Nav + Hero + content 区块）
   ├─ motion/
   │  └─ motion.js            GSAP 注册 / enableMotion 总开关 / splitChars
   ├─ data/
   │  ├─ resumeData.js        ★ 全站内容唯一来源，改简历只改这个文件
   │  └─ chromaAccents.js     8 套卡片渐变配色板（按 index 循环取）
   ├─ hooks/
   │  ├─ useInView.js         滚动进入视口检测 + 数字滚动
   │  ├─ useReducedMotion.js  系统减弱动效偏好
   │  └─ useActiveSection.js  导航当前章节高亮
   ├─ components/
   │  ├─ Nav.jsx              固定顶栏（玻璃胶囊 + 主题切换 + 手机端汉堡菜单）
   │  ├─ Hero.jsx             首屏（编辑式版式 + GSAP 开场时间线）
   │  ├─ HeroCanvas.jsx       首屏视频的无缝循环渐变画布替身
   │  ├─ ThemeToggle.jsx      深/浅主题切换按钮
   │  ├─ ThemedCard.jsx       按主题切卡片实现（浅色 BorderGlow / 深色 ChromaCard）
   │  ├─ BorderGlow.jsx/.css  React Bits 边框光晕卡（浅色主题用）
   │  ├─ ChromaCard.jsx/.css  React Bits 卡片视觉（深色主题用）
   │  ├─ ChromaGrid.jsx/.css  React Bits 网格灰度聚光遮罩（GSAP）
   │  ├─ Grainient.jsx/.css   React Bits WebGL 渐变背景（依赖 ogl）
   │  ├─ ContentBackdrop.jsx  内容区背景装配（sticky 一屏画布 + scrim）
   │  ├─ Profile.jsx          个人概述
   │  ├─ Stats.jsx            关键数据（数字滚动）
   │  ├─ Experience.jsx       工作经历时间线
   │  ├─ Projects.jsx         重点项目（可筛选）
   │  ├─ Capabilities.jsx     专业能力
   │  ├─ Education.jsx        教育与其他
   │  ├─ Testimonials.jsx     合作反馈（数据为空时不渲染）
   │  ├─ Contact.jsx          联系与页脚（拨打电话 CTA）
   │  ├─ Reveal.jsx           滚动逐段揭示容器（GSAP，非动效环境回退 IO）
   │  ├─ SplitText.jsx        标题逐字渐显
   │  └─ SectionHeading.jsx   章节标题（巨型描边 ghost 英文）
   └─ styles/
      ├─ app.css              设计令牌 + 全部样式（含浅色主题覆盖块）
      └─ tailwind.css         Tailwind 入口（theme + utilities）
```

## 改内容

打开 `src/data/resumeData.js`，按模块改对应字段即可，组件层无需改动。

| 想改的内容 | 对应字段 |
| --- | --- |
| 姓名、职位、电话、邮箱、微信 | `profile` |
| 首屏文案（眉题、简介逐行、数据、口号、CTA） | `hero` |
| 章节标题（编号 / 中文 / 英文 ghost） | `headings` |
| 概述金句 | `statement` |
| 三大能力支柱 | `pillars` |
| 关键数字 | `stats` |
| 工作经历 | `experience` |
| 项目（含分类与强调色） | `projects` / `projectCategories` |
| 专业能力 | `capabilities` |
| 教育、证书、兴趣 | `education` |
| 结尾 CTA（拨打电话） | `contactCta` |
| 导航章节 | `sections` |

`stats` 里 `value` 是纯数字，`prefix` / `suffix` 是前后缀，`decimals` 控制小数位，数字滚动会自动适配。

改完保存，Vite HMR 秒级生效，不用重启。

## 主题系统

- 深色为默认：石墨底 + 信号红 `#e11d2a` 主色
- 浅色：冷白蓝体系，主色 `#1668e3`，内容区 scrim 不透明化压住 WebGL 底色
- 切换按钮在导航右侧，写 `html[data-theme]` + `localStorage('liukai-theme')`；`index.html` 内联脚本在首帧前恢复，避免闪帧
- 卡片按主题自动切换实现（`ThemedCard.jsx`，MutationObserver 监听）：浅色走 BorderGlow，深色走 ChromaCard

## 首屏视频

首屏是全幅视频构图，视频层固定在文字与界面之下。桌面端与手机端行为完全一致：静音自动循环播放，不再区分擦洗与点击触发的差异。

**编码要求（重要）**：视频必须是 H.264（fourcc `avc1`，8 位 `yuv420p`）。用 10 位 HEVC（`hvc1` / `yuv420p10le`）会导致安卓 Chrome、微信安卓内核、未安装 HEVC 扩展的桌面 Chromium 全部抛 `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`，视频被判定不可用并回退到渐变画布，首屏只剩红底。仓库内的 `tools/transcode_hero.py` 负责转换并自带自检：

```bash
python tools/transcode_hero.py public/hero-bg.mp4 public/hero-bg.h264.mp4 24
# 自检项：fourcc 是否为 avc1、帧数与时长是否守恒、逐帧 PSNR 是否不低于 35 dB
```

**移动端取景**：源画面是 1920×1080 横构图，人物位于 x 1083-1656、头部中心在 72.6% 处。竖屏 `object-fit: cover` 按高度铺满，可见宽度只有约 499 源像素（占整幅 26%），默认居中取景几乎只拍到人物左缘。`@media (max-width: 860px)` 中把 `object-position` 设为 `64% 50%`，人物在右侧完整入画，构图与桌面端「主体在右、左侧留白」一致。取值不宜超过 68%，否则人物面部移到正文下方会压低可读性。

视频加载失败或 8 秒拿不到元数据时自动回退到渐变画布（`HeroCanvas`：四个色团利萨如轨迹，26 秒精确循环，内部低分辨率拉伸加模糊，开销与视口无关）。

想换成真视频：先按上面的编码要求转码，再丢进 `public/`，然后在 `resumeData.js` 里填

```js
heroVideo: '/your-video.mp4',
heroPoster: '/your-poster.jpg',
```

## 移动端适配

以 375px 与 390px 为基准设计，覆盖 iOS Safari、Android Chrome 与微信内置浏览器。

**断点**

| 断点 | 职责 |
| --- | --- |
| 1180px | 首屏底部双栏转单栏 |
| 860px | 启用汉堡菜单、首屏重排、触控目标放大、性能降级 |
| 560px | 关键数据与教育区改两栏、收紧内边距、令牌同步为 18px |
| 480px | 小屏精修（令牌 16px、数据字号、引用字号） |
| 900px + 横屏且高 ≤520px | 手机横屏改为自然高度，避免内容挤压 |

另有两条能力查询独立于宽度断点：`@media (hover: hover) and (pointer: fine)` 承载全部悬停效果，`@media (hover: none)` 承载触屏专属表现。

**关键处理**

- **首屏重排**：头像是在桌面端绝对定位、与字标同高的圆形。手机上改为回到文档流（`.hero` 本身是 flex column，头像块在 DOM 中位于字标之前，改静态后自然落在字标上方），尺寸固定 88px 与字体度量解耦；字标同步放大为 `clamp(56px, 19.5vw, 96px)`（390px 下约 76px、字宽约 300px，接近桌面的体量）。简介的左内边距从 `shell-pad + portrait-inset`（约 68px）收回常规内边距，375px 下正文可用宽度由约 291px 恢复到约 339px
- **导航**：7 个链接在手机上改为汉堡菜单。按钮 44×44，面板从导航下方下拉，打开时锁页面滚动、焦点移入面板首个链接、Esc 或点遮罩关闭。桌面端导航完全不变
- **触屏反馈**：所有 `:hover` 效果移入能力查询，触屏改用 `:active`。数据卡的左侧强调条与能力卡的装饰线在触屏下默认常显（原本只有悬停才出现，手机永远看不到）
- **卡片去灰暗**：ChromaGrid 的灰度遮罩靠指针位置驱动聚光，触屏静止时整片卡片呈灰暗态。`@media (hover: none)` 下直接关闭该遮罩层，ChromaCard 改为常亮柔和描边加按下加深反馈；浅色主题的 BorderGlow 同样改为常亮描边
- **触控目标**：导航按钮与主题按钮 44px，筛选标签 44px，胶囊标签 40px，主要按钮 48px，联系区链接 44px
- **安全区**：`env(safe-area-inset-bottom)` 用于首屏底部、联系区与页脚，避让 iPhone Home 指示条；横屏下补左右安全区
- **兼容**：`100svh` 前先用 `100vh` 兜底（旧 iOS 不认 svh）；全局 `touch-action: manipulation` 消除双击缩放延迟；`-webkit-tap-highlight-color: transparent` 去掉点击灰块
- **性能**：手机端 Grainient 的 dpr 上限由 1.5 降到 1；固定导航胶囊的 `backdrop-filter` 在 ≤860px 关闭改半透明实色；内容区背景垫一层同色系 CSS 渐变，WebGL 不可用时仍有完整观感
- **地址栏配色**：`theme-color` 跟随主题切换，深色 `#0B0F10`、浅色 `#f4f7fb`

**字体说明**：标题字体从 `db.onlinewebfonts.com` 外链加载，中国大陆手机可能较慢。回退栈已包含 PingFang SC 与微软雅黑，不影响可读性，字标度量会略有变化。Helvetica Now 属商业字体，未做自托管。

## 部署到 GitHub Pages

站点用 GitHub Actions 构建并发布，`dist` 不进仓库。

**前置**：私有仓库开启 Pages 需要 GitHub Pro / Team / Enterprise Cloud（GitHub 官方规则，Free 账号下仓库必须公开）。另外 Pages 站点即使仓库私有，依然在互联网上公开可访问，仓库不公开与页面不被收录是两件事。站点已加 `robots.txt` 与 `<meta name="robots" content="noindex">` 阻止搜索引擎收录。

**步骤**

```bash
gh auth login                                    # 交互式，需本人执行
gh api user --jq '.plan.name'                    # 确认套餐含私有仓库 Pages
git init && git add -A && git commit -m "初始化"
gh repo create liukai-resume --private --source=. --remote=origin --push
gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow
```

**子路径处理**：项目型 Pages 部署在 `https://<用户名>.github.io/<仓库名>/`，所以

- `vite.config.js` 的 `base` 读环境变量 `VITE_BASE`，本地开发留空走 `/`
- 工作流里构建时注入 `VITE_BASE=/<仓库名>/`
- 组件内引用静态资源必须走 `import.meta.env.BASE_URL`。Vite 不会改写 JSX 里写死的字符串路径，`src="/portrait.png"` 这类写法在子路径下会 404

## 动效体系（GSAP + ScrollTrigger）

| 位置 | 效果 |
| --- | --- |
| 首屏开场 | 幕布字标 → 上掀 → 字母遮罩内位移归位（stagger）→ 头像 clipPath 揭开 → 简介逐行 → 底部依次进场，总长约 3.3s，`document.fonts.ready` 竞速后播放 |
| 章节标题 | 英文巨型描边 ghost + 字符遮罩进场 |
| 全站 | 滚动逐段揭示（y/scale/rotateX，power4.out），同组阶梯延迟 |
| 视差 | 两端同源：字标上漂 -16%、简介下移 +10%、头像下沉（手机 20%、桌面 30%）。手机端头像处于文档流，20% 是按「头像底部到字标顶 36.3px 余量」实测取的，再大就会压到字标 |
| 数据 | 进入视口后数字滚动 |
| 卡片 | ChromaGrid 网格灰度聚光 + 单卡边框光晕 |
| 导航 | 越过首屏后浮出玻璃胶囊，当前章节高亮 |

`prefers-reduced-motion` 开启时全部动效关闭，内容直接呈现（GSAP 时间线不构建，Grainient 只渲染静态一帧）。

## 可访问性与性能

- 语义化标签，导航带 `aria-label` 与 `aria-current`，筛选器用 `role="tablist"`
- 汉堡按钮带 `aria-expanded` 与 `aria-controls`，面板打开时锁滚动、焦点移入首个链接、Esc 关闭并把焦点还给按钮
- 跳转主内容的 skip link，键盘焦点统一高亮描边
- 动画只作用于 `opacity` 与 `transform`，配合 `will-change` 避免布局抖动
- Grainient：sticky 恒定一屏（不随内容膨胀）、dpr 上限桌面 1.5 / 手机 1、离屏与切后台自动停 rAF

## 响应式

版心最大 1700px。桌面端首屏双栏、项目与能力三栏自适应；1180px 以下首屏转单栏；860px 以下时间线标签上移、启用汉堡菜单并做性能降级；560px 与 480px 以下逐步收紧。完整断点表与移动端处理见上文「移动端适配」。
