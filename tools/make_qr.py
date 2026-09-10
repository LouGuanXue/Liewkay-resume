#!/usr/bin/env python3
"""生成简历站的二维码，输出 PNG 与 SVG 两个文件。

用法：
    python tools/make_qr.py <网址> [输出目录]

默认输出到项目根目录：
    qr-liukai.png   位图，供聊天、PPT、简历内嵌
    qr-liukai.svg   矢量，供印刷与名片

参数：纠错等级 M（约 15% 容错），四周留白 4 个模块（低于此值部分扫码器会识别困难），
黑白纯色不透明，保证在老旧手机与微信扫码下成功率最高。
"""

from __future__ import annotations

import sys
from pathlib import Path

import qrcode
import qrcode.image.svg


def build(url: str, out_dir: Path, target_px: int = 1024) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=16,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # 按目标边长反算模块像素，保证输出尺寸接近 target_px 且为整数倍（不插值、不模糊）
    units = qr.modules_count + qr.border * 2
    qr.box_size = max(4, round(target_px / units))

    png_path = out_dir / "qr-liukai.png"
    qr.make_image(fill_color="black", back_color="white").save(png_path)

    svg_path = out_dir / "qr-liukai.svg"
    qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(svg_path)

    size = qr.box_size * units
    print(f"网址     : {url}")
    print(f"版本     : {qr.version}（{qr.modules_count} × {qr.modules_count} 模块）")
    print(f"纠错等级 : M")
    print(f"PNG      : {png_path}  {size} × {size}px  {png_path.stat().st_size:,} bytes")
    print(f"SVG      : {svg_path}  {svg_path.stat().st_size:,} bytes")
    verify(png_path, url)


def verify(png_path: Path, expected: str) -> None:
    """把生成的 PNG 解码回来，确认二维码真的可扫（缺 opencv 时跳过）。"""
    try:
        import cv2
    except ImportError:
        print("自检     : 跳过（未安装 opencv-python-headless）")
        return

    img = cv2.imread(str(png_path))
    data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    if data == expected:
        print("自检     : 通过，解码还原一致")
    else:
        raise SystemExit(f"自检失败：解码得到 {data!r}，与预期 {expected!r} 不一致")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    url = sys.argv[1]
    if not url.startswith(("http://", "https://")):
        print(f"网址必须以 http:// 或 https:// 开头，收到：{url}")
        return 2

    out_dir = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    build(url, out_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
