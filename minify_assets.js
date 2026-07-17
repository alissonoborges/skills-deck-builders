import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function minifyCSS() {
  const cssPath = join(__dirname, "css", "styles.css");
  const cssMinPath = join(__dirname, "css", "styles.min.css");
  if (!existsSync(cssPath)) {
    console.error("styles.css not found.");
    return;
  }

  const cssContent = readFileSync(cssPath, "utf8");

  // Safe CSS Minification
  const minified = cssContent
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse spaces
    .replace(/\s*([\{\}:;,])\s*/g, "$1") // Remove spaces around delimiters
    .replace(/;}/g, "}") // Remove trailing semicolons
    .trim();

  writeFileSync(cssMinPath, minified, { encoding: "utf8" });
  console.log("CSS Minification complete. Written to styles.min.css");
}

function minifyJS() {
  const jsPath = join(__dirname, "js", "main.js");
  const jsMinPath = join(__dirname, "js", "main.min.js");
  if (!existsSync(jsPath)) {
    console.error("main.js not found.");
    return;
  }

  const jsContent = readFileSync(jsPath, "utf8");

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

  writeFileSync(jsMinPath, cleaned, { encoding: "utf8" });
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
