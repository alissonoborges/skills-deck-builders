import sharp from "sharp";
import { renameSync, existsSync, unlinkSync } from "fs";

async function optimizeLogos() {
  console.log("Starting optimization of logos...");

  // 1. Optimize logo-nobg.png
  // Resize to 800x800 and compress
  await sharp("images/logo-nobg.png")
    .resize(800, 800, { fit: "inside" })
    .png({ quality: 80, compressionLevel: 9, palette: true })
    .toFile("images/logo-nobg_optimized.png");
  renameSync("images/logo-nobg_optimized.png", "images/logo-nobg.png");
  console.log("logo-nobg.png optimized.");

  // 2. Optimize logo-share.png
  // Keep 1200x1200 but optimize compression
  await sharp("images/logo-share.png")
    .png({ quality: 80, compressionLevel: 9, palette: true })
    .toFile("images/logo-share_optimized.png");
  renameSync("images/logo-share_optimized.png", "images/logo-share.png");
  console.log("logo-share.png optimized.");

  // 3. Optimize logo-whatsapp.jpg
  // Resize to 640x640 and compress to JPEG quality 80
  await sharp("images/logo-whatsapp.jpg")
    .resize(640, 640)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile("images/logo-whatsapp_optimized.jpg");
  renameSync("images/logo-whatsapp_optimized.jpg", "images/logo-whatsapp.jpg");
  console.log("logo-whatsapp.jpg optimized.");

  // 4. Remove logo-8k.png
  if (existsSync("images/logo-8k.png")) {
    unlinkSync("images/logo-8k.png");
    console.log("logo-8k.png deleted.");
  }

  console.log("All image optimization tasks completed.");
}

optimizeLogos().catch((err) => console.error(err));
