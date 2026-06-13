const fs = require("fs");
const path = require("path");

function minifyCSS() {
  const cssPath = path.join(__dirname, "css", "styles.css");
  const cssMinPath = path.join(__dirname, "css", "styles.min.css");
  if (!fs.existsSync(cssPath)) {
    console.error("styles.css not found.");
    return;
  }

  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Safe CSS Minification
  const minified = cssContent
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse spaces
    .replace(/\s*([\{\}:;,])\s*/g, "$1") // Remove spaces around delimiters
    .replace(/;}/g, "}") // Remove trailing semicolons
    .trim();

  fs.writeFileSync(cssMinPath, minified, { encoding: "utf8" });
  console.log("CSS Minification complete. Written to styles.min.css");
}

function minifyJS() {
  const jsPath = path.join(__dirname, "js", "main.js");
  const jsMinPath = path.join(__dirname, "js", "main.min.js");
  if (!fs.existsSync(jsPath)) {
    console.error("main.js not found.");
    return;
  }

  const jsContent = fs.readFileSync(jsPath, "utf8");

  // Basic comments cleanup for JS
  const lines = jsContent.split("\n");
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) {
      return "";
    }
    // Remove inline comments if safe
    const commentIndex = line.indexOf(" // ");
    if (
      commentIndex !== -1 &&
      !line.substring(0, commentIndex).includes("http") &&
      !line.substring(0, commentIndex).includes("://")
    ) {
      return line.substring(0, commentIndex);
    }
    return line;
  });

  const cleaned = processedLines
    .join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/\n\s*\n/g, "\n") // Remove multiple blank lines
    .trim();

  fs.writeFileSync(jsMinPath, cleaned, { encoding: "utf8" });
  console.log("JS Cleanup complete. Written to main.min.js");
}

try {
  minifyCSS();
  minifyJS();
  console.log("Asset compilation and minification completed successfully.");
} catch (err) {
  console.error("Error during minification:", err);
  process.exit(1);
}
