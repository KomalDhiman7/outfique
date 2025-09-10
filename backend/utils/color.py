# backend/utils/color.py
from typing import Tuple, List
import math

ColorRGB = Tuple[int, int, int]

def rgb_to_hsl(r: int, g: int, b: int):
    r_, g_, b_ = [x / 255.0 for x in (r, g, b)]
    maxc = max(r_, g_, b_)
    minc = min(r_, g_, b_)
    l = (minc + maxc) / 2.0
    if minc == maxc:
        return 0.0, 0.0, l
    if l <= 0.5:
        s = (maxc - minc) / (maxc + minc)
    else:
        s = (maxc - minc) / (2.0 - maxc - minc)
    rc = (maxc - r_) / (maxc - minc)
    gc = (maxc - g_) / (maxc - minc)
    bc = (maxc - b_) / (maxc - minc)
    if r_ == maxc:
        h = bc - gc
    elif g_ == maxc:
        h = 2.0 + rc - bc
    else:
        h = 4.0 + gc - rc
    h = (h / 6.0) % 1.0
    return h * 360, s, l

def hue_distance(h1: float, h2: float) -> float:
    d = abs(h1 - h2) % 360
    return min(d, 360 - d)

def colors_harmonize(c1: ColorRGB, c2: ColorRGB) -> float:
    h1, s1, l1 = rgb_to_hsl(*c1)
    h2, s2, l2 = rgb_to_hsl(*c2)
    dh = hue_distance(h1, h2)
    dl = abs(l1 - l2)
    ds = abs(s1 - s2)
    score = 100 - (dh / 1.8) - (dl * 30) - (ds * 30)
    return max(0, min(100, score))