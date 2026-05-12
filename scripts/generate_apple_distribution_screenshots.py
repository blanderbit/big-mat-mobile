#!/usr/bin/env python3
import argparse
import math
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Size:
    w: int
    h: int

    @property
    def key(self) -> str:
        return f"{self.w}x{self.h}"


DEFAULT_SIZES = [
    Size(1260, 2736),
    Size(1242, 2688),
    Size(1206, 2622),
    Size(1125, 2436),
    Size(1242, 2208),
    Size(750, 1334),
    Size(640, 1096),
    Size(640, 920),
]


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)


def sips_get_px(path: Path) -> tuple[int, int]:
    out = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)], text=True)
    w = h = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            w = int(line.split(":", 1)[1].strip())
        elif line.startswith("pixelHeight:"):
            h = int(line.split(":", 1)[1].strip())
    if w is None or h is None:
        raise RuntimeError(f"Failed to read dimensions via sips for: {path}")
    return w, h


def resize_cover_center_crop(src: Path, dst: Path, target: Size) -> None:
    src_w, src_h = sips_get_px(src)
    scale = max(target.w / src_w, target.h / src_h)
    resized_w = int(math.ceil(src_w * scale))
    resized_h = int(math.ceil(src_h * scale))

    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_suffix(dst.suffix + ".__tmp.png")

    run(["sips", "-z", str(resized_h), str(resized_w), str(src), "--out", str(tmp)])
    run(["sips", "--cropToHeightWidth", str(target.h), str(target.w), str(tmp), "--out", str(dst)])
    tmp.unlink(missing_ok=True)


def parse_sizes(s: str) -> list[Size]:
    # Accept formats like: "1260x2736, 1242×2688px 750 x 1334"
    tokens = re.split(r"[,\n]+", s.strip())
    out: list[Size] = []
    for tok in tokens:
        tok = tok.strip()
        if not tok:
            continue
        tok = tok.lower().replace("px", "").replace("×", "x").replace(" ", "")
        m = re.fullmatch(r"(\d+)x(\d+)", tok)
        if not m:
            raise ValueError(f"Can't parse size token: {tok!r}")
        out.append(Size(int(m.group(1)), int(m.group(2))))
    # de-dupe while keeping order
    seen: set[str] = set()
    deduped: list[Size] = []
    for sz in out:
        if sz.key in seen:
            continue
        seen.add(sz.key)
        deduped.append(sz)
    return deduped


def safe_stem(p: Path) -> str:
    stem = p.stem
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "_", stem).strip("_")
    return stem or "input"


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Generate Apple distribution screenshots for specific pixel sizes (resize-to-cover + center-crop)."
    )
    ap.add_argument("--input", action="append", required=True, help="Path to source screenshot image (repeatable).")
    ap.add_argument("--out", required=True, help="Output directory.")
    ap.add_argument(
        "--sizes",
        default=",".join(sz.key for sz in DEFAULT_SIZES),
        help="Comma/newline-separated sizes like '1260x2736,1242x2688,...'.",
    )
    args = ap.parse_args()

    sizes = parse_sizes(args.sizes)
    out_dir = Path(args.out).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    for src_str in args.input:
        src = Path(src_str).expanduser().resolve()
        if not src.exists():
            raise SystemExit(f"Input not found: {src}")

        src_dir = out_dir / safe_stem(src)
        src_dir.mkdir(parents=True, exist_ok=True)

        for sz in sizes:
            dst = src_dir / f"{sz.key}.png"
            resize_cover_center_crop(src, dst, sz)

        # Print generated paths for convenience
        for sz in sizes:
            print(str((src_dir / f'{sz.key}.png')))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

