/**
 * Chroma 卡片配色板。
 * 按位置循环取：borderColor 用于悬停描边，gradient 用于背景渐变。
 */
export const CHROMA_ACCENTS = [
  {
    borderColor: '#e11d2a',
    gradient: 'linear-gradient(145deg, #5a121a 0%, #1a0508 65%, #0b0204 100%)',
  },
  {
    borderColor: '#ff5a66',
    gradient: 'linear-gradient(165deg, #6b1f26 0%, #2a0a0e 65%, #0d0305 100%)',
  },
  {
    borderColor: '#a3121f',
    gradient: 'linear-gradient(195deg, #4a0e16 0%, #160305 65%, #0a0203 100%)',
  },
  {
    borderColor: '#ffb13d',
    gradient: 'linear-gradient(140deg, #5a3a10 0%, #1c1106 65%, #0a0602 100%)',
  },
  {
    borderColor: '#3aa46c',
    gradient: 'linear-gradient(155deg, #11402a 0%, #06150d 65%, #020a05 100%)',
  },
  {
    borderColor: '#4f7cff',
    gradient: 'linear-gradient(150deg, #14306a 0%, #060d22 65%, #02050f 100%)',
  },
  {
    borderColor: '#b85eff',
    gradient: 'linear-gradient(170deg, #4a1d7a 0%, #160622 65%, #080311 100%)',
  },
  {
    borderColor: '#19c2d6',
    gradient: 'linear-gradient(135deg, #0c4855 0%, #041518 65%, #020a0d 100%)',
  },
];

/** 按 index 循环取一个 accent。 */
export const accentByIndex = (i) => CHROMA_ACCENTS[i % CHROMA_ACCENTS.length];
