const fs = require("fs");
let content = fs.readFileSync("rate/index.html", "utf8");
content = content.replace(/USD/g, "USDT");
fs.writeFileSync("rate/index.html", content);
console.log("USD to USDT replaced.");
