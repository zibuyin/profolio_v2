# Used to convert all images in the gallery folder from heic (iPhone) -> png
from PIL import Image
from pathlib import Path
import os
import subprocess as sp

gallery_path = Path("public/gallery")

for heic_file in gallery_path.glob("*.heic"):
    png_file = heic_file.with_suffix(".png")
    sp.run(["magick", str(heic_file), str(png_file)], check=True)
    print(f"✓ {png_file.name}")
    
    # Remove the old HEIC file
    os.remove(heic_file)
    print(f"✗ Removed {heic_file.name}")