const fs = require("fs");
let content = fs.readFileSync("rate/index.html", "utf8");
content = content.replace(/USDTT/g, "USDT");
fs.writeFileSync("rate/index.html", content);
console.log("Fixed USDTT to USDT.");
