const fs = require("fs");
const path = require("path");

let errors = 0;

fs.readdirSync(__dirname).forEach((file) => {
  if (file.endsWith(".html")) {
    const content = fs.readFileSync(path.join(__dirname, file), "utf8");

    // Check internal links containing .html
    const htmlLinks = content.match(/href="[^"]+\.html(#?[^"]*)?"/g);
    if (htmlLinks) {
      console.log(`[Error] File ${file} has .html links:`, htmlLinks);
      errors++;
    }

    // Check vercel subdomains
    if (content.includes("skills-deck-builders.vercel.app")) {
      console.log(`[Error] File ${file} references Vercel subdomain.`);
      errors++;
    }

    // Check canonical links ending in .html
    const canonicalHtml = content.match(/rel="canonical" href="[^"]+\.html"/g);
    if (canonicalHtml) {
      console.log(
        `[Error] File ${file} has canonical link with .html:`,
        canonicalHtml,
      );
      errors++;
    }

    // Check ratings
    if (
      content.includes("AggregateRating") ||
      (content.includes("ratingValue") && file !== "reviews.html")
    ) {
      // Allow ratingValue in reviews.html only for individual review ratings, but check if aggregateRating exists
      if (content.includes("aggregateRating")) {
        console.log(`[Error] File ${file} has aggregateRating schema.`);
        errors++;
      }
    }
  }
});

if (errors === 0) {
  console.log(
    "Verification successful! 0 errors found. All links, domains, and schemas are clean.",
  );
} else {
  console.log(`Verification failed. Found ${errors} issues.`);
  process.exit(1);
}
