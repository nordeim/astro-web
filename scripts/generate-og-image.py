#!/usr/bin/env python3
"""
generate-og-image.py — Render the default Open Graph image for the Kelp clone.

Produces a 1200×630 PNG (the OG-standard size) with:
  - Solid ink (#0d1726) background, matching the site's dark sections.
  - "Kelp" wordmark in Newsreader-style serif (Georgia fallback) at large size,
    centered vertically.
  - Tagline "Central Florida's Award Winning Creative Agency." below the wordmark.
  - A thin kelp-green (#42c634) accent bar above the wordmark.

Output: public/og-default.png

This is a functional placeholder. The maintainer can replace it with a
designed asset (photo, illustration, branded graphic) at the same dimensions.

Usage:  python3 scripts/generate-og-image.py
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import sys

# === Design tokens (match src/styles/global.css) ===
COLOR_INK = (13, 23, 38)       # #0d1726
COLOR_PAPER = (255, 255, 255)  # #ffffff
COLOR_KELP = (66, 198, 52)     # #42c634
COLOR_SLATE = (117, 117, 117)  # #757575

# === Output ===
WIDTH = 1200
HEIGHT = 630
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "og-default.png"


def find_font(family_candidates, size):
    """Try a list of font paths; return the first that loads, else default."""
    for name in family_candidates:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_INK)
    draw = ImageDraw.Draw(img)

    # Newsreader-like serif: try Newsreader first, fall back to Georgia, then DejaVu Serif
    serif_font_large = find_font(
        [
            "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.otf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        ],
        140,
    )
    serif_font_small = find_font(
        [
            "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.otf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        ],
        36,
    )

    # Poppins-like sans for tagline: try Poppins, fall back to DejaVu Sans
    sans_font = find_font(
        [
            "/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        ],
        32,
    )

    # === Accent bar (kelp green, top of card) ===
    bar_y = 140
    bar_height = 4
    bar_width = 80
    bar_x = (WIDTH - bar_width) // 2
    draw.rectangle(
        [bar_x, bar_y, bar_x + bar_width, bar_y + bar_height],
        fill=COLOR_KELP,
    )

    # === "Kelp" wordmark (large serif, centered) ===
    wordmark = "Kelp"
    # Measure text using textbbox (Pillow >= 8.0)
    bbox = draw.textbbox((0, 0), wordmark, font=serif_font_large)
    wm_width = bbox[2] - bbox[0]
    wm_height = bbox[3] - bbox[1]
    wm_x = (WIDTH - wm_width) // 2
    wm_y = bar_y + bar_height + 40
    draw.text((wm_x, wm_y), wordmark, fill=COLOR_PAPER, font=serif_font_large)

    # === Tagline (sans, centered, below wordmark) ===
    tagline = "Central Florida's Award Winning Creative Agency."
    bbox2 = draw.textbbox((0, 0), tagline, font=sans_font)
    tl_width = bbox2[2] - bbox2[0]
    tl_x = (WIDTH - tl_width) // 2
    tl_y = wm_y + wm_height + 60
    draw.text((tl_x, tl_y), tagline, fill=COLOR_KELP, font=sans_font)

    # === Footer label (small serif, bottom) ===
    footer = "kelp.agency clone"
    bbox3 = draw.textbbox((0, 0), footer, font=serif_font_small)
    ft_width = bbox3[2] - bbox3[0]
    ft_x = (WIDTH - ft_width) // 2
    ft_y = HEIGHT - 80
    draw.text((ft_x, ft_y), footer, fill=COLOR_SLATE, font=serif_font_small)

    # Save
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUTPUT, "PNG", optimize=True)
    print(f"OG image written to {OUTPUT}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT}")
    print(f"  Format:     PNG")
    print(f"  Size:       {OUTPUT.stat().st_size} bytes")


if __name__ == "__main__":
    sys.exit(main() or 0)
