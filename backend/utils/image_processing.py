import cv2
import numpy as np
from PIL import Image
import os

def analyze_clothing_item(image_path):
    """Analyze clothing item to extract color, category, and style"""
    try:
        # Load image
        img = cv2.imread(image_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Extract dominant color
        dominant_color = get_dominant_color(img_rgb)
        
        # Basic category detection (you can enhance with ML models)
        category = detect_category(image_path)
        
        return {
            'color': dominant_color,
            'category': category,
            'style': 'casual'  # Default, can be enhanced with ML
        }
    except Exception as e:
        return {'color': 'unknown', 'category': 'other', 'style': 'casual'}

def get_dominant_color(image):
    """Extract dominant color from image"""
    data = np.reshape(image, (-1, 3))
    data = np.float32(data)
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, _, centers = cv2.kmeans(data, 1, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    dominant_color = centers[0].astype(int)
    return f"rgb({dominant_color}, {dominant_color[1]}, {dominant_color[2]})"

def detect_category(image_path):
    """Basic category detection - enhance with ML model"""
    # This is a simplified version - you'd typically use a trained model
    categories = ['top', 'bottom', 'shoes', 'accessories']
    # For now, return random category - replace with actual ML inference
    import random
    return random.choice(categories)
