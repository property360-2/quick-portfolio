const fs = require("fs");
const path = require("path");

const articlesDir = "writings/articles";
const articles = fs
  .readdirSync(articlesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const svgSun = `<svg class="w-5 h-5 sun-icon hidden" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm1.06-12.37c-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06c-.39-.39-1.03-.39-1.41 0zm-12.37 12.37c-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06c-.39-.39-1.03-.39-1.41 0z"/></svg>`;
const svgMoon = `<svg class="w-5 h-5 moon-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;
const svgArrowBack = `<svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`;
const svgCalendar = `<svg class="w-4 h-4 mr-2 text-wood-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>`;
const svgPerson = `<svg class="w-4 h-4 mr-2 text-wood-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
const svgArticle = `<svg class="w-4 h-4 mr-2 text-wood-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`;

articles.forEach((article) => {
  const filePath = path.join(articlesDir, article, "index.html");
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Sun Icon
  content = content.replace(
    /<span[^>]*class="[^"]*sun-icon[^"]*"[^>]*>\s*light_mode\s*<\/span>/g,
    svgSun,
  );

  // Moon Icon
  content = content.replace(
    /<span[^>]*class="[^"]*moon-icon[^"]*"[^>]*>\s*dark_mode\s*<\/span>/g,
    svgMoon,
  );

  // Arrow Back
  content = content.replace(
    /<span[^>]*class="[^"]*material-icons-outlined text-sm mr-1"[^>]*>\s*arrow_back\s*<\/span>/g,
    svgArrowBack,
  );

  // Metadata Icons
  content = content.replace(
    /<span[^>]*class="[^"]*material-icons-outlined text-base mr-2 text-wood-accent"[^>]*>\s*calendar_today\s*<\/span>/g,
    svgCalendar,
  );
  content = content.replace(
    /<span[^>]*class="[^"]*material-icons-outlined text-base mr-2 text-wood-accent"[^>]*>\s*person\s*<\/span>/g,
    svgPerson,
  );
  content = content.replace(
    /<span[^>]*class="[^"]*material-icons-outlined text-base mr-2 text-wood-accent"[^>]*>\s*article\s*<\/span>/g,
    svgArticle,
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
});
