import Grainient from './Grainient';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * 首屏之下的内容区背景。
 * 用 sticky + 负外边距让 WebGL 画布始终只有一屏高，
 * 而不是跟着几千像素的内容一起拉伸成巨型画布。
 */
export default function ContentBackdrop() {
  const reduced = useReducedMotion();

  return (
    <div className="content__bg" aria-hidden="true">
      <Grainient
        color1="#5d0a03"
        color2="#000000"
        color3="#343434"
        timeSpeed={0.25}
        colorBalance={0.0}
        warpStrength={1.0}
        warpFrequency={5.0}
        warpSpeed={2.0}
        warpAmplitude={50.0}
        blendAngle={0.0}
        blendSoftness={0.05}
        rotationAmount={500.0}
        noiseScale={2.0}
        grainAmount={0.1}
        grainScale={2.0}
        grainAnimated={false}
        contrast={1.5}
        gamma={1.0}
        saturation={1.0}
        centerX={0.0}
        centerY={0.0}
        zoom={0.9}
        paused={reduced}
      />
      <span className="content__bgScrim" />
    </div>
  );
}
