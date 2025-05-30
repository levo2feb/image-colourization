from PIL import Image
import numpy as np

def colorize_image(input_path, output_path):
    # Dummy colorization: just convert grayscale to RGB by duplicating channels
    img = Image.open(input_path).convert('L')  # Grayscale
    rgb_img = Image.merge("RGB", (img, img, img))
    rgb_img.save(output_path)
