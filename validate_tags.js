const fs = require("fs");
const content = fs.readFileSync("rate/index.html", "utf8");

function validateTags(html) {
  const stack = [];
  const tokens = html.match(/<\/?([a-zA-Z0-9-]+)[^>]*>/g);

  tokens.forEach((token, index) => {
    const isClosing = token.startsWith("</");
    const tagName = token.match(/<\/?([a-zA-Z0-9-]+)/)[1];

    if (
      ["meta", "link", "input", "br", "hr", "img"].includes(
        tagName.toLowerCase(),
      )
    ) {
      return;
    }

    if (isClosing) {
      const last = stack.pop();
      if (!last || last.tagName !== tagName) {
        console.log(
          `Error at token ${index} (${token}): expected closing for ${last ? last.tagName : "nothing"}`,
        );
      }
    } else {
      stack.push({ tagName, token, index });
    }
  });

  if (stack.length > 0) {
    console.log("Unclosed tags:", stack.map((s) => s.tagName).join(", "));
  } else {
    console.log("All tags balanced!");
  }
}

validateTags(content);
