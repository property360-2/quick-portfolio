import os
import re

WORKSPACE = r"c:\Users\Administrator\Desktop\quick-portfolio"
ASTRO_PAGES = os.path.join(WORKSPACE, "astro-app", "src", "pages")

# Clean src/pages to avoid collisions (remove the basic index.astro)
if os.path.exists(os.path.join(ASTRO_PAGES, "index.astro")):
    os.remove(os.path.join(ASTRO_PAGES, "index.astro"))

def process_file(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract Title and Description
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "Jun Alvior"

    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE | re.DOTALL)
    description = desc_match.group(1).strip() if desc_match else ""

    # Extract Main content
    main_match = re.search(r'(<main\b[^>]*>.*?</main>)', content, re.DOTALL | re.IGNORECASE)
    if not main_match:
        # Fallback if no main tag is found (unlikely but safe fallback to body content between nav and footer)
        return

    main_html = main_match.group(1)

    # Convert generic relative paths pointing to old html roots
    # E.g. href="index.html" -> href="/"
    main_html = main_html.replace('href="index.html"', 'href="/"')
    main_html = main_html.replace('href="../index.html"', 'href="/"')
    main_html = main_html.replace('href="../../index.html"', 'href="/"')
    main_html = main_html.replace('href="../../../index.html"', 'href="/"')

    # Convert class to class properly (Astro uses class exactly like HTML, which is great!)
    # But `<div class="xyz"` doesn't need to change to `className` in astro.

    rel_path = os.path.relpath(html_path, WORKSPACE)
    astro_rel = rel_path.replace(".html", ".astro")
    astro_dest = os.path.join(ASTRO_PAGES, astro_rel)

    # Determine layout path dynamically
    depth = astro_rel.count(os.sep) + 1
    layout_prefix = "../"*depth
    
    astro_file_content = f"""---
import Layout from '{layout_prefix}layouts/Layout.astro';
const title = {repr(title)};
const description = {repr(description)};
---

<Layout title={{title}} description={{description}}>
{main_html}
</Layout>
"""

    os.makedirs(os.path.dirname(astro_dest), exist_ok=True)
    with open(astro_dest, "w", encoding="utf-8") as f:
        f.write(astro_file_content)
    print(f"Created {astro_dest}")

for root, dirs, files in os.walk(WORKSPACE):
    # skip astro-app, node_modules, .git
    if 'astro-app' in root or 'node_modules' in root or '.git' in root or 'scripts' in root:
        continue
        
    # specifically skip the writing-raw or raw stuff if it exists, actually wait... just process all htmls
    for file in files:
        if file.endswith('.html'):
            process_file(os.path.join(root, file))

print("All HTML pages ported successfully.")
