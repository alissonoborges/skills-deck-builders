import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CITY_MAP = {
  "deck-builder-brookline-ma": "Brookline",
  "deck-builder-chestnut-hill-ma": "Chestnut Hill",
  "deck-builder-concord-ma": "Concord",
  "deck-builder-dover-ma": "Dover",
  "deck-builder-lexington-ma": "Lexington",
  "deck-builder-lincoln-ma": "Lincoln",
  "deck-builder-needham-ma": "Needham",
  "deck-builder-newton-ma": "Newton",
  "deck-builder-sudbury-ma": "Sudbury",
  "deck-builder-wayland-ma": "Wayland",
  "deck-builder-wellesley-ma": "Wellesley",
  "deck-builder-weston-ma": "Weston",
  "deck-builder-winchester-ma": "Winchester",
};

function processHtmlFile(filePath) {
  const fileName = basename(filePath);
  const baseName = fileName.replace(".html", "");
  console.log(`Processing file: ${fileName}`);

  let content = readFileSync(filePath, "utf8");

  // 1. Replace 5.0 Star Rated Contractor on homepage
  if (baseName === "index") {
    content = content.replace(
      /<span class="trust-nowrap">5\.0 Star Rated Contractor<\/span>/g,
      "",
    );
    // Clean up double spacing left after removal
    content = content.replace(
      /&amp; HIC\s+207906<\/span>\s+<span/g,
      "&amp; HIC 207906</span> <span",
    );
  }

  // 2. Open Graph domain replace
  content = content.replace(
    /https:\/\/skills-deck-builders\.vercel\.app/g,
    "https://skillsdeckbuilders.com",
  );

  // 3. Clean URLs for Canonical links
  // <link rel="canonical" href="https://skillsdeckbuilders.com/about.html"> -> https://skillsdeckbuilders.com/about
  content = content.replace(
    /(<link rel="canonical" href="https:\/\/skillsdeckbuilders\.com\/[^"]+)\.html(#?[^"]*)?(")/,
    "$1$2$3",
  );
  // Handle index.html canonical link to root
  content = content.replace(
    /https:\/\/skillsdeckbuilders\.com\/index/g,
    "https://skillsdeckbuilders.com",
  );

  // 4. Clean URLs for Internal Links
  // Match href="page.html" or href="page.html#hash" and replace with href="page" or href="page#hash"
  content = content.replace(
    /href="([a-zA-Z0-9\-]+)\.html(#[\w\-]+)?"/g,
    (match, page, hash) => {
      if (page === "index") {
        return `href="/${hash || ""}"`;
      }
      return `href="${page}${hash || ""}"`;
    },
  );

  // 5. Stylesheet and JavaScript query cache bust to v7
  content = content.replace(
    /css\/styles\.min\.css\?v=\d+/g,
    "css/styles.min.css?v=7",
  );
  content = content.replace(/js\/main\.min\.js\?v=\d+/g, "js/main.min.js?v=7");
  content = content.replace(/js\/main\.min\.js(?!\?)/g, "js/main.min.js?v=7");

  // 6. Schema.org JSON-LD Cleanup (remove aggregateRating recursively)
  content = content.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (match, jsonText) => {
      try {
        let json = JSON.parse(jsonText.trim());

        const removeAggregateRating = (obj) => {
          if (Array.isArray(obj)) {
            obj.forEach(removeAggregateRating);
          } else if (obj !== null && typeof obj === "object") {
            if ("aggregateRating" in obj) {
              delete obj.aggregateRating;
            }
            if ("ratingValue" in obj) {
              delete obj.ratingValue;
            }
            if ("ratingCount" in obj) {
              delete obj.ratingCount;
            }
            if ("reviewCount" in obj) {
              delete obj.reviewCount;
            }
            for (let key in obj) {
              removeAggregateRating(obj[key]);
            }
          }
        };

        removeAggregateRating(json);

        // Also ensure no vercel subdomains in the schema
        let stringified = JSON.stringify(json, null, 2);
        stringified = stringified.replace(
          /https:\/\/skills-deck-builders\.vercel\.app/g,
          "https://skillsdeckbuilders.com",
        );

        return `<script type="application/ld+json">\n  ${stringified}\n  </script>`;
      } catch (e) {
        console.warn(`Could not parse JSON-LD in ${fileName}:`, e.message);
        return match;
      }
    },
  );

  // 7. Copywriting replacements
  // A. Replace "Massachusetts' finest homes" with "Massachusetts homes"
  content = content.replace(
    /Massachusetts'\s+finest\s+homes/gi,
    "Massachusetts homes",
  );

  // B. Replace "premier luxury deck builder" with "custom deck builder serving [City]" (or "custom deck builder serving Massachusetts" globally)
  const city = CITY_MAP[baseName];
  if (city) {
    // E.g., Wellesley's premier luxury deck builder -> Wellesley's custom deck builder serving Wellesley
    const regex1 = new RegExp(
      `${city}'s\\s+premier\\s+luxury\\s+deck\\s+builder`,
      "gi",
    );
    content = content.replace(
      regex1,
      `${city}'s custom deck builder serving ${city}`,
    );

    // Fallback general occurrences
    content = content.replace(
      /premier\s+luxury\s+deck\s+builder/gi,
      `custom deck builder serving ${city}`,
    );
  } else {
    content = content.replace(
      /premier\s+luxury\s+deck\s+builder/gi,
      "custom deck builder serving Massachusetts",
    );
  }

  // C. Replace "guaranteeing" with "designed to support compliance with"
  content = content.replace(
    /guaranteeing\s+that\s+footings/g,
    "designed to support compliance with structural standards for footings",
  );

  // Write file back as UTF-8 without BOM
  writeFileSync(filePath, content, { encoding: "utf8" });
}

function processSitemap() {
  const sitemapPath = join(__dirname, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    console.log("Processing sitemap.xml...");
    let content = readFileSync(sitemapPath, "utf8");
    // Replace Vercel subdomains if any
    content = content.replace(
      /https:\/\/skills-deck-builders\.vercel\.app/g,
      "https://skillsdeckbuilders.com",
    );
    // Strip .html extension from urls inside <loc> tags
    content = content.replace(
      /(<loc>https:\/\/skillsdeckbuilders\.com\/[^<]+)\.html(<\/loc>)/g,
      "$1$2",
    );
    // Remove index from sitemap
    content = content.replace(
      /https:\/\/skillsdeckbuilders\.com\/index/g,
      "https://skillsdeckbuilders.com/",
    );
    writeFileSync(sitemapPath, content, { encoding: "utf8" });
    console.log("sitemap.xml optimized.");
  }
}

function processRobotsTxt() {
  const robotsPath = join(__dirname, "robots.txt");
  if (existsSync(robotsPath)) {
    console.log("Processing robots.txt...");
    let content = readFileSync(robotsPath, "utf8");
    // Ensure correct sitemap link
    content = content.replace(
      /Sitemap:\s*\S+/gi,
      "Sitemap: https://skillsdeckbuilders.com/sitemap.xml",
    );
    writeFileSync(robotsPath, content, { encoding: "utf8" });
    console.log("robots.txt optimized.");
  }
}

// Main execution
const files = readdirSync(__dirname);
files.forEach((file) => {
  if (file.endsWith(".html")) {
    processHtmlFile(join(__dirname, file));
  }
});

processSitemap();
processRobotsTxt();

console.log("SEO, Schema, Copy, and Clean URL updates completed successfully.");
