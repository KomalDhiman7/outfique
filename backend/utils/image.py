# backend/utils/image.py
import cv2
import numpy as np
from typing import List, Tuple

def extract_dominant_colors(image_path: str, k: int = 3) -> List[Tuple[int, int, int]]:
    image_bgr = cv2.imdecode(np.fromfile(image_path, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image_bgr is None:
        raise ValueError("Failed to read image")
    image = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pixels = image.reshape((-1, 3)).astype(np.float32)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    attempts = 5
    flags = cv2.KMEANS_PP_CENTERS
    compactness, labels, centers = cv2.kmeans(pixels, k, None, criteria, attempts, flags)
    centers = centers.astype(int)
    counts = np.bincount(labels.flatten(), minlength=k)
    sorted_idx = np.argsort(counts)[::-1]
    return [tuple(map(int, centers[i])) for i in sorted_idx]