#!/usr/bin/env python3
"""Generate lightweight card thumbnails from the first image in each post."""

from __future__ import annotations

import re
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence


CARD_SIZE = (600, 248)
JPEG_QUALITY = 78
GIF_COLORS = 128
MAX_GIF_FRAMES = 50
GENERATOR_VERSION = "4"
IMAGES_PATTERN = re.compile(r"^images:\s*\[\s*([^,\]]+)", re.MULTILINE)


def first_images(posts_dir: Path) -> set[str]:
    names: set[str] = set()
    for post in posts_dir.rglob("*.md"):
        match = IMAGES_PATTERN.search(post.read_text(encoding="utf-8"))
        if match:
            names.add(match.group(1).strip().strip("'\""))
    return names


def output_name(source: Path) -> str:
    suffix = ".gif" if source.suffix.lower() == ".gif" else ".webp"
    return f"{source.stem}-card{suffix}"


def needs_generation(source: Path, destination: Path, version_file: Path) -> bool:
    if not destination.exists() or not version_file.exists():
        return True
    if version_file.read_text(encoding="utf-8").strip() != GENERATOR_VERSION:
        return True
    return destination.stat().st_mtime < source.stat().st_mtime


def fitted(frame: Image.Image) -> Image.Image:
    return ImageOps.fit(frame.convert("RGB"), CARD_SIZE, method=Image.Resampling.LANCZOS)


def generate_gif(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        source_frames = [frame.copy() for frame in ImageSequence.Iterator(image)]
        source_durations = [frame.info.get("duration", image.info.get("duration", 100)) for frame in source_frames]
        loop = image.info.get("loop", 0)

    source_frames = source_frames[:MAX_GIF_FRAMES]
    frames = [fitted(frame) for frame in source_frames]
    durations = source_durations[:MAX_GIF_FRAMES]

    with tempfile.NamedTemporaryFile(suffix=".gif", delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        frames[0].save(
            temporary_path,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=loop,
            optimize=True,
            colors=GIF_COLORS,
        )
        if temporary_path.stat().st_size < source.stat().st_size:
            shutil.move(temporary_path, destination)
        else:
            shutil.copy2(source, destination)
            print(f"  Optimized GIF was larger; kept original animation for {destination.name}")
    finally:
        temporary_path.unlink(missing_ok=True)


def generate_static(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        fitted(image).save(destination, "WEBP", quality=JPEG_QUALITY, method=6)


def main() -> int:
    portfolio_root = Path(__file__).resolve().parents[1]
    source_dir = portfolio_root / "assets" / "img" / "post"
    destination_dir = portfolio_root / "assets" / "img" / "thumbnails"
    version_file = destination_dir / ".generator-version"
    destination_dir.mkdir(parents=True, exist_ok=True)

    generated = 0
    for name in sorted(first_images(portfolio_root / "_posts")):
        source = source_dir / name
        if not source.is_file():
            print(f"Thumbnail source is missing: {source}", file=sys.stderr)
            return 1

        destination = destination_dir / output_name(source)
        if not needs_generation(source, destination, version_file):
            continue

        print(f"Generating {destination.name} from {source.name}")
        if source.suffix.lower() == ".gif":
            generate_gif(source, destination)
        else:
            generate_static(source, destination)
        generated += 1

    if not version_file.exists() or version_file.read_text(encoding="utf-8").strip() != GENERATOR_VERSION:
        version_file.write_text(GENERATOR_VERSION, encoding="utf-8")
    print(f"Card thumbnails ready ({generated} generated).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
