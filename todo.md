# Quick Portfolio - Refactoring & Improvement Plan

This document outlines the actionable steps to improve the maintainability, performance, accessibility, SEO, and overall code quality of the Quick Portfolio website.

## 1. Project Restructuring & Maintainability
- [ ] Choose a component-based approach (e.g., minimal static site generator like 11ty, Astro, or a build script for HTML partials).
- [ ] Extract `<nav>` into a reusable component/partial.
- [ ] Extract `<footer>` into a reusable component/partial.
- [ ] Update all HTML pages to use the new partials, preventing future duplicate edits.

## 2. Developer Experience (DX) & CSS Production Setup
- [ ] Initialize `package.json` for npm (`npm init -y`).
- [ ] Install `tailwindcss` via npm (`npm install -D tailwindcss`).
- [ ] Initialize and configure `tailwind.config.js` to scan all HTML and JS files in the project.
- [ ] Create an input CSS file with Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`).
- [ ] Setup a build script (`npm run build`) in `package.json` to handle CSS generation.
- [ ] Replace the Tailwind CDN `<script>` tag with a `<link>` to the compiled `style.css` in all HTML headers.
- [ ] Configure Prettier to automatically format HTML, CSS, and JS code.

## 3. Performance & Image Optimization
- [ ] Add `loading="lazy"` to all images located below the fold (e.g., project screenshots, footer images).
- [ ] Add `decoding="async"` to all images to prevent them from blocking the main thread.
- [x] Convert `.png` and `.jpg` images in the `assets/` folder to WebP format to reduce file size.
- [ ] Update all `<img src="...">` references to point to the new `.webp` files.
- [ ] Add `<link rel="preload">` to explicitly fetch critical typography like Google Fonts early.
- [ ] Move external scripts (`main.js`) to the `<head>` and append the `defer` attribute.

## 4. Accessibility (A11y) & Semantic HTML
- [ ] Wrap primary page content (everything between navigation and footer) in `<main>` tags across all files.
- [ ] Add `aria-expanded="false"` and `aria-label` attributes to mobile menu toggle buttons.
- [ ] Update mobile menu JS to dynamically toggle the `aria-expanded` state on menu open/close for screen readers.
- [ ] Add `focus-visible:ring-2` to buttons and links to clearly delineate keyboard focus states.

## 5. SEO & Meta Tags
- [ ] Audit the `<head>` section of all pages.
- [ ] Ensure consistent Open Graph (`og:*`) and Twitter Card (`twitter:*`) meta tags across all HTML files.
- [ ] Ensure every page has a unique and descriptive `<title>` and `<meta name="description">`.
- [ ] Generate and link Favicon assets (`.ico`, `.png`, `apple-touch-icon`).

## 6. JavaScript Consolidation
- [ ] Create a new file `js/theme-check.js`.
- [ ] Extract the inline dark-mode flash prevention script from the `<head>` of all HTML files.
- [ ] Move that script into `js/theme-check.js`.
- [ ] Link `<script src="/js/theme-check.js"></script>` in the `<head>` of all pages, ensuring it runs early to prevent the flash.

## 7. User Experience (UX)
- [ ] Create a custom, branded `404.html` error page to handle broken links gracefully.
