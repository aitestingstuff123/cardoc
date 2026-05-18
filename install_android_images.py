import os
import shutil
from PIL import Image

source_icon = r"C:\Users\ok\.gemini\antigravity\brain\c091b2e6-737c-4cd1-ae1b-9c91b41134b4\autodiagnostic_app_icon_1779062821306.png"
source_splash = r"C:\Users\ok\.gemini\antigravity\brain\c091b2e6-737c-4cd1-ae1b-9c91b41134b4\autodiagnostic_splash_1779062833102.png"

android_res_dir = r"d:\apps\car app\car-analyzer\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

def create_icons():
    img = Image.open(source_icon)
    for folder, size in sizes.items():
        target_dir = os.path.join(android_res_dir, folder)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
        
        icon_path = os.path.join(target_dir, "ic_launcher.png")
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        resized_img.save(icon_path)
        
        round_icon_path = os.path.join(target_dir, "ic_launcher_round.png")
        resized_img.save(round_icon_path)
        
        print(f"Created icon in {folder}")

def create_splash():
    target_dir = os.path.join(android_res_dir, "drawable")
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    splash_path = os.path.join(target_dir, "splash.png")
    shutil.copyfile(source_splash, splash_path)
    print("Created splash screen")

if __name__ == "__main__":
    create_icons()
    create_splash()
