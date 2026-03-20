import os
import re

html_path = r"c:\Users\Administrator\Desktop\quick-portfolio\index.html"
components_dir = r"c:\Users\Administrator\Desktop\quick-portfolio\astro-app\src\components"
os.makedirs(components_dir, exist_ok=True)

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract Nav
nav_match = re.search(r'(<nav\b[^>]*>.*?</nav>)', content, re.DOTALL | re.IGNORECASE)
if nav_match:
    nav_html = nav_match.group(1)
    nav_html = re.sub(r'href=["\']index\.html["\']', 'href="/"', nav_html)
    with open(os.path.join(components_dir, "Navbar.astro"), "w", encoding="utf-8") as f:
        f.write("---\n---\n" + nav_html)

# Extract Footer
footer_match = re.search(r'(<footer\b[^>]*>.*?</footer>)', content, re.DOTALL | re.IGNORECASE)
if footer_match:
    footer_html = footer_match.group(1)
    footer_html = re.sub(r'href=["\']index\.html["\']', 'href="/"', footer_html)
    with open(os.path.join(components_dir, "Footer.astro"), "w", encoding="utf-8") as f:
        f.write("---\n---\n" + footer_html)

# Create Layout.astro
layout_str = """---
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content="Jun Alvior" />
    
    <link rel="icon" href="/quick-portfolio/assets/my-website-logo.svg" type="image/svg+xml" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

    <script is:inline>
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    </script>
    <style>
      :root {
        --wood-accent: #d4a373;
        --grey-light: #f5f5f5;
        --grey-dark: #1a1a1a;
      }
      html {
        background-color: var(--grey-light);
        -webkit-text-size-adjust: 100%;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      }
      html.dark {
        background-color: var(--grey-dark);
        color: #d1d5db;
      }
      body {
        margin: 0;
        line-height: inherit;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
    </style>
    
    <slot name="head" />
    
    <script is:inline src="/quick-portfolio/js/theme-check.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
  </head>
  <body class="bg-grey-light text-grey-dark dark:bg-[#1a1a1a] dark:text-gray-200 transition-colors duration-300 antialiased font-sans flex flex-col min-h-screen">
    <Navbar />
    <main id="main-content" class="flex-grow flex flex-col">
      <slot />
    </main>
    <Footer />
    
    <script is:inline src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script is:inline src="/quick-portfolio/js/main.js"></script>
  </body>
</html>
"""

os.makedirs(r"c:\Users\Administrator\Desktop\quick-portfolio\astro-app\src\layouts", exist_ok=True)
with open(r"c:\Users\Administrator\Desktop\quick-portfolio\astro-app\src\layouts\Layout.astro", "w", encoding="utf-8") as f:
    f.write(layout_str)

os.makedirs(r"c:\Users\Administrator\Desktop\quick-portfolio\astro-app\src\styles", exist_ok=True)
with open(r"c:\Users\Administrator\Desktop\quick-portfolio\astro-app\src\styles\global.css", "w", encoding="utf-8") as f:
    f.write('''@tailwind base;
@tailwind components;
@tailwind utilities;

.gs-reveal { visibility: hidden; }
.gs-reveal-img { visibility: hidden; }
''')
print("Extracted components and layout successfully.")
