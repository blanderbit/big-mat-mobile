#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def adjust_scale(path: Path, scale: float) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size

    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))

    resized = img.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.paste(resized, ((w - new_w) // 2, (h - new_h) // 2), resized)

    canvas.save(path)


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Scale down Android adaptive icon foreground PNGs in-place."
    )
    ap.add_argument(
        "--root",
        default="android/app/src/main/res",
        help="Resource root containing mipmap-* folders.",
    )
    ap.add_argument(
        "--scale",
        type=float,
        default=0.82,
        help="Scale factor for the artwork inside the image (0..1].",
    )
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Print files that would be modified, but don't write.",
    )
    args = ap.parse_args()

    if not (0.0 < args.scale <= 1.0):
        raise SystemExit("--scale must be in (0, 1].")

    root = Path(args.root)
    patterns = [
        "mipmap-*/ic_launcher_foreground.png",
        "mipmap-*/ic_launcher_round_foreground.png",
    ]
    files: list[Path] = []
    for pat in patterns:
        files.extend(sorted(root.glob(pat)))

    if not files:
        raise SystemExit(f"No launcher foreground PNGs found under {root}")

    for p in files:
        print(f"{'DRY ' if args.dry_run else ''}adjust {p} (scale={args.scale})")
        if not args.dry_run:
            adjust_scale(p, args.scale)


if __name__ == "__main__":
    main()

