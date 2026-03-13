const fs = require('fs');
const path = require('path');

const importMap = `
    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }
    </script>`;

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (f === 'node_modules' || f === '.git' || f === '.agent') return;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
};

walk(process.cwd(), (filePath) => {
    if (path.extname(filePath) !== '.html') return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if importmap already exists
    if (content.includes('type="importmap"')) {
        console.log(`Skipping (already has importmap): ${filePath}`);
        return;
    }

    // Insert before first script or before </body>
    if (content.includes('<!-- Scripts -->')) {
        content = content.replace('<!-- Scripts -->', `${importMap}\n    <!-- Scripts -->`);
    } else {
        content = content.replace('</body>', `${importMap}\n  </body>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added importmap to: ${filePath}`);
});
