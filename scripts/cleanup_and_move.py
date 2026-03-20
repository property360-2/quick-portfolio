import os
import shutil

WORKSPACE = r"c:\Users\Administrator\Desktop\quick-portfolio"
ASTRO_APP = os.path.join(WORKSPACE, "astro-app")

old_folders = ["about", "portfolio", "rate", "writings", "inquiries", "assets", "css", "js", "writing-raw"]
old_files = ["404.html", "index.html", "sitemap.html", "google7f52a8234b6a0bce.html"]

print("Deleting legacy structure...")
for folder in old_folders:
    path = os.path.join(WORKSPACE, folder)
    if os.path.exists(path):
        shutil.rmtree(path)

for file in old_files:
    path = os.path.join(WORKSPACE, file)
    if os.path.exists(path):
        os.remove(path)

print("Moving Astro files to root...")
if os.path.exists(ASTRO_APP):
    for item in os.listdir(ASTRO_APP):
        s = os.path.join(ASTRO_APP, item)
        d = os.path.join(WORKSPACE, item)
        if os.path.exists(d):
            if os.path.isdir(d):
                shutil.rmtree(d)
            else:
                os.remove(d)
        shutil.move(s, d)

    print("Removing astro-app stub...")
    os.rmdir(ASTRO_APP)

print("Cleanup and elevation successful.")
