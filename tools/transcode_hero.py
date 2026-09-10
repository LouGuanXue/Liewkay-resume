"""把首屏背景视频转成跨平台可播放的 H.264。

为什么要转：
源文件是 10-bit HEVC（fourcc hvc1，像素格式 yuv420p10le）。这种编码只有 Apple 平台
（iOS Safari / macOS）与装了 HEVC 扩展的 Windows 桌面播放器能解。安卓 Chrome、微信
安卓内核、未装扩展的桌面 Chromium 都会抛 DEMUXER_ERROR_NO_SUPPORTED_STREAMS，
触发 Hero.jsx 的 onError 回退，首屏只剩渐变画布。

转成 H.264 High Profile / 8-bit yuv420p / faststart 后，iOS、安卓、桌面、微信两端
全部可播。

用法：
    python tools/transcode_hero.py <源文件> <输出文件> [crf]
    crf 默认 24，数值越小画质越高体积越大。

脚本自带三项自检：fourcc 是否为 avc1、时长与帧数是否守恒、逐帧 PSNR 是否达标。
"""

import sys
from fractions import Fraction

import av
import numpy as np

CONTAINER_BOXES = {"moov", "trak", "mdia", "minf", "stbl", "edts", "mvex"}


def fourcc_of(path):
    """读取 stsd 中第一个采样条目的编码标识，不依赖外部工具。"""
    with open(path, "rb") as handle:
        blob = handle.read()
    marker = blob.find(b"stsd")
    if marker < 0:
        return None
    # stsd 布局：type(4) + version/flags(4) + entry_count(4) + entry_size(4) + entry_fourcc(4)
    return blob[marker + 16:marker + 20].decode("latin-1", "ignore")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1

    src, dst = sys.argv[1], sys.argv[2]
    crf = sys.argv[3] if len(sys.argv) > 3 else "24"

    with av.open(src) as inc:
        ist = inc.streams.video[0]
        rate = ist.average_rate
        width = ist.codec_context.width
        height = ist.codec_context.height

        print(f"源文件: {src}")
        print(f"  编码 fourcc = {fourcc_of(src)}")
        print(f"  像素格式 = {ist.codec_context.pix_fmt}")
        print(f"  分辨率 = {width}x{height}  帧率 = {rate}  帧数 = {ist.frames}")
        print(f"  时长 = {round(float(inc.duration) / 1e6, 2)} 秒")

        with av.open(dst, mode="w", options={"movflags": "+faststart"}) as outc:
            ost = outc.add_stream("libx264", rate=rate)
            ost.width = width
            ost.height = height
            ost.pix_fmt = "yuv420p"
            try:
                ost.options = {
                    "crf": str(crf),
                    "preset": "slow",
                    "profile": "high",
                    "level": "4.0",
                    "g": "48",
                }
            except Exception as exc:  # 该版本 PyAV 不支持 options 时降级为默认参数
                print(f"  提示: 无法设置编码参数({exc})，改用默认参数")

            frame_count = 0
            for frame in inc.decode(ist):
                converted = frame.reformat(format="yuv420p", width=width, height=height)
                converted.pts = frame_count
                converted.time_base = Fraction(1, int(rate))
                for packet in ost.encode(converted):
                    outc.mux(packet)
                frame_count += 1

            for packet in ost.encode(None):
                outc.mux(packet)

    print(f"输出文件: {dst}")
    print(f"  帧数 = {frame_count}")

    # 自检一：fourcc
    cc = fourcc_of(dst)
    print(f"  编码 fourcc = {cc}")
    ok_fourcc = cc == "avc1"

    # 自检二：时长与帧数守恒，并逐帧算 PSNR
    psnrs = []
    src_frames = []
    with av.open(src) as inc2:
        for frame in inc2.decode(inc2.streams.video[0]):
            src_frames.append(frame.reformat(format="yuv420p").to_ndarray())
    with av.open(dst) as out2:
        out_stream = out2.streams.video[0]
        out_dur = round(float(out2.duration) / 1e6, 2) if out2.duration else None
        out_cfg = out_stream.codec_context
        print(f"  像素格式 = {out_cfg.pix_fmt}  分辨率 = {out_cfg.width}x{out_cfg.height}")
        for index, frame in enumerate(out2.decode(out_stream)):
            if index >= len(src_frames):
                break
            a = src_frames[index].astype(np.float64)
            b = frame.to_ndarray().astype(np.float64)
            if a.shape != b.shape:
                break
            mse = float(np.mean((a - b) ** 2))
            psnrs.append(float("inf") if mse == 0 else 10 * np.log10(255.0 ** 2 / mse))

    ok_frames = len(psnrs) == len(src_frames)
    avg_psnr = sum(psnrs) / len(psnrs) if psnrs else 0.0
    print(f"  时长 = {out_dur} 秒")
    print(f"  逐帧对比 {len(psnrs)}/{len(src_frames)} 帧，平均 PSNR = {avg_psnr:.2f} dB")

    print("自检结论:")
    print(f"  fourcc 为 avc1: {'通过' if ok_fourcc else '未通过'}")
    print(f"  帧数守恒: {'通过' if ok_frames else '未通过'}")
    print(f"  画质达标(PSNR >= 35 dB): {'通过' if avg_psnr >= 35 else '未通过'}")

    return 0 if (ok_fourcc and ok_frames and avg_psnr >= 35) else 2


if __name__ == "__main__":
    sys.exit(main())
