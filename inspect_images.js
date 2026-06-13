const sharp = require("sharp");

async function inspect() {
  const nobg = await sharp("images/logo-nobg.png").metadata();
  console.log("logo-nobg.png:", nobg.width, "x", nobg.height, nobg.format);

  const share = await sharp("images/logo-share.png").metadata();
  console.log("logo-share.png:", share.width, "x", share.height, share.format);

  const wa = await sharp("images/logo-whatsapp.jpg").metadata();
  console.log("logo-whatsapp.jpg:", wa.width, "x", wa.height, wa.format);
}

inspect().catch((err) => console.error(err));
