import os
import re
import base64

WORKSPACE = r"c:\Users\junal\OneDrive\Desktop\personal-projects\quick-portfolio"

# 1. Create SVG
png_path = os.path.join(WORKSPACE, "assets", "my-website-logo.png")
svg_path = os.path.join(WORKSPACE, "assets", "my-website-logo.svg")

with open(png_path, "rb") as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_data}" x="0" y="0" width="512" height="512" />
</svg>'''

with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SVG created successfully.")

def process_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    rel_path = os.path.relpath(file_path, WORKSPACE).replace('\\', '/')
    if rel_path == "index.html":
        clean_rel_url = ""
        depth = 0
    else:
        clean_rel_url = rel_path.replace("index.html", "")
        # Calculate depth purely based on slashed directories
        depth = clean_rel_url.count('/')
        # if clean_rel_url is "portfolio/", count is 1
        
    page_url = f"https://property360-2.github.io/quick-portfolio/{clean_rel_url}"

    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "Jun Alvior | Full Stack Software Developer"

    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE | re.DOTALL)
    description = desc_match.group(1).strip() if desc_match else "Portfolio of Jun Alvior, a Full Stack Software Developer specializing in Python, Django, React, and Supabase."

    # Remove existing favicon mapping
    content = re.sub(r'<link\s+[^>]*rel=["\']icon["\'][^>]*>', '', content, flags=re.IGNORECASE)
    # Remove existing og/twitter meta
    content = re.sub(r'<meta\s+property=["\']og:.*?["\']\s+content=["\'].*?["\']\s*/?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+property=["\']twitter:.*?["\']\s+content=["\'].*?["\']\s*/?>', '', content, flags=re.IGNORECASE)

    prefix = '../' * depth if depth > 0 else ''
    
    new_tags = f'''
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{page_url}" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="https://property360-2.github.io/quick-portfolio/assets/my-website-logo.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="{page_url}" />
    <meta property="twitter:title" content="{title}" />
    <meta property="twitter:description" content="{description}" />
    <meta property="twitter:image" content="https://property360-2.github.io/quick-portfolio/assets/my-website-logo.png" />

    <link rel="icon" href="{prefix}assets/my-website-logo.svg" type="image/svg+xml" />
    '''

    if '</head>' in content:
        content = content.replace('</head>', new_tags + '</head>')

    # Basic QA fixes for accessibility
    # (e.g., ensuring basic tags compliance might be done here, but sticking strictly to head replacement is safer)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path} (Depth: {depth})")

for root, dirs, files in os.walk(WORKSPACE):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            process_html(os.path.join(root, file))
