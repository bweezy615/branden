#!/usr/bin/env python3
"""Find a streamer's facecam box in a 16:9 clip, so no one has to measure it by hand.

A facecam is a face that stays in the same place in every frame; faces in the game or
in videos the streamer reacts to move around. We sample frames, detect faces with
OpenCV's bundled Haar cascade, keep the face position that recurs in most frames, and
grow it to a typical webcam-overlay box.

Usage: python3 clips/facecam.py <clip.mp4>   -> prints x,y,w,h as fractions, or "none"
"""
import sys
from pathlib import Path

import cv2

SAMPLES = 12
MIN_HITS = 0.6      # face must be found at the same spot in >= 60% of sampled frames
SAME_SPOT = 0.04    # centres within 4% of frame width count as the same spot
GROW_W, GROW_H = 2.6, 2.4   # face box -> webcam overlay box


def faces_per_frame(clip: Path) -> tuple[list[list[tuple[float, float, float, float]]], int, int]:
    cap = cv2.VideoCapture(str(clip))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if total < SAMPLES or not w:
        raise RuntimeError(f"can't read enough frames from {clip}")
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    frames = []
    for i in range(SAMPLES):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(total * (i + 0.5) / SAMPLES))
        ok, img = cap.read()
        if not ok:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        found = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=6, minSize=(w // 40, w // 40))
        frames.append([(x / w, y / h, fw / w, fh / h) for x, y, fw, fh in found])
    cap.release()
    return frames, w, h


def detect(clip: Path) -> tuple[float, float, float, float] | None:
    frames, w, h = faces_per_frame(clip)
    candidates = [f for faces in frames for f in faces]
    best, best_hits = None, 0
    for cx, cy, cw, ch in candidates:
        centre = (cx + cw / 2, cy + ch / 2)
        hits = sum(any(abs(fx + fw / 2 - centre[0]) < SAME_SPOT and abs(fy + fh / 2 - centre[1]) < SAME_SPOT * w / h
                       for fx, fy, fw, fh in faces) for faces in frames)
        if hits > best_hits:
            best, best_hits = (cx, cy, cw, ch), hits
    if best is None or best_hits < MIN_HITS * len(frames):
        return None
    fx, fy, fw, fh = best
    bw, bh = min(fw * GROW_W, 1.0), min(fh * GROW_H, 1.0)
    bx = min(max(fx + fw / 2 - bw / 2, 0.0), 1.0 - bw)
    by = min(max(fy + fh / 2 - bh / 2, 0.0), 1.0 - bh)
    return round(bx, 4), round(by, 4), round(bw, 4), round(bh, 4)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    box = detect(Path(sys.argv[1]))
    print("none" if box is None else ",".join(map(str, box)))


if __name__ == "__main__":
    main()
