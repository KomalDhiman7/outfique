import cv2
import numpy as np
from PIL import Image
import io

def analyze_clothing(image_bytes):
    """
    Analyze clothing image using OpenCV to detect color and type
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to RGB (OpenCV uses BGR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Get dominant color
    pixels = img_rgb.reshape(-1, 3)
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters=5)
    kmeans.fit(pixels)
    dominant_color = kmeans.cluster_centers_[0]
    
    # Convert RGB to hex
    hex_color = '#{:02x}{:02x}{:02x}'.format(
        int(dominant_color[0]), 
        int(dominant_color[1]), 
        int(dominant_color[2])
    )
    
    # Map colors to categories
    color_map = {
        'white': ['#ffffff', '#f5f5f5', '#fafafa'],
        'black': ['#000000', '#111111', '#222222'],
        'blue': ['#0000ff', '#0066cc', '#000080'],
        # Add more color mappings
    }
    
    # Get suggested pairings based on color
    color_pairings = {
        'white': ['blue', 'black', 'navy'],
        'black': ['white', 'gray', 'red'],
        'blue': ['white', 'khaki', 'gray'],
        # Add more color combinations
    }
    
    # Find closest matching color category
    def color_distance(c1, c2):
        r1, g1, b1 = int(c1[1:3], 16), int(c1[3:5], 16), int(c1[5:7], 16)
        r2, g2, b2 = int(c2[1:3], 16), int(c2[3:5], 16), int(c2[5:7], 16)
        return sum((x-y)**2 for x, y in [(r1,r2), (g1,g2), (b1,b2)])
    
    min_dist = float('inf')
    detected_color = 'unknown'
    
    for color_name, hex_values in color_map.items():
        for hex_value in hex_values:
            dist = color_distance(hex_color, hex_value)
            if dist < min_dist:
                min_dist = dist
                detected_color = color_name
    
    suggested_colors = color_pairings.get(detected_color, [])
    
    return {
        'dominant_color': hex_color,
        'color_category': detected_color,
        'suggested_colors': suggested_colors
    }