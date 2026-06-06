const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

const pageMeta = {
  'index.html': {
    title: 'Skills Deck Builders | Custom Decks & Covered Porches in MA',
    description: 'Licensed design-build contractor in Massachusetts. We construct custom composite decks, covered porches, and outdoor kitchens in Wellesley, Weston, and Greater Boston.'
  },
  'about.html': {
    title: 'About Us | Skills Deck Builders MA',
    description: 'Learn about Skills Deck Builders, a custom outdoor construction company serving Wellesley, Weston, and Greater Boston. Licensed, insured, and focused on quality.'
  },
  'services.html': {
    title: 'Custom Decking & Outdoor Living Services | Skills Deck Builders',
    description: 'We design and build composite decks, covered porches, outdoor kitchens, and custom railings across Massachusetts. Browse our custom construction services.'
  },
  'portfolio.html': {
    title: 'Our Portfolio | Custom Deck & Porch Projects | Skills Deck Builders',
    description: 'View photos of our completed custom decks, covered porches, and outdoor transformations in Wellesley, Weston, Newton, and surrounding MA towns.'
  },
  'process.html': {
    title: 'Our Design-Build Process | Skills Deck Builders',
    description: 'How we work: from initial property consultation and building permits through to construction and final inspection. Our transparent design-build process.'
  },
  'reviews.html': {
    title: 'Client Reviews | Skills Deck Builders',
    description: 'Read real testimonials from homeowners who hired Skills Deck Builders for custom decks and porches in Massachusetts.'
  },
  'contact.html': {
    title: 'Contact Us | Schedule a Consultation | Skills Deck Builders',
    description: 'Get in touch with Skills Deck Builders to discuss your custom deck, porch, or outdoor kitchen project in Massachusetts. Schedule a site consultation.'
  },
  'thank-you.html': {
    title: 'Thank You | Skills Deck Builders',
    description: 'Thank you for contacting Skills Deck Builders. We will review your project details and contact you shortly.'
  },
  'custom-decks.html': {
    title: 'Custom Deck Design & Construction | Skills Deck Builders',
    description: 'Custom designed composite and wood decks for Massachusetts homes. Premium materials, hidden fasteners, and structural code compliance.'
  },
  'covered-porches.html': {
    title: 'Covered Porches & Screened Rooms | Skills Deck Builders',
    description: 'Build a covered porch, screened room, or outdoor pavilion in Massachusetts. Enjoy your backyard in comfort through every season.'
  },
  'outdoor-kitchens.html': {
    title: 'Outdoor Kitchens & Entertainment Areas | Skills Deck Builders',
    description: 'Custom outdoor kitchens with built-in grills, stone countertops, and weatherproof cabinets designed for Massachusetts homes.'
  },
  'poolside-decks.html': {
    title: 'Poolside Decks & Surrounds | Skills Deck Builders',
    description: 'Design and build custom slip-resistant composite decking around your pool. High-end poolside surrounds in Greater Boston.'
  },
  'railings-lighting.html': {
    title: 'Deck Railings & Low-Voltage LED Lighting | Skills Deck Builders',
    description: 'Premium black aluminum, cable, and glass deck railing systems with integrated low-voltage LED stair and post cap lights.'
  },
  'deck-replacement.html': {
    title: 'Deck Replacement & Structural Rebuilding | Skills Deck Builders',
    description: 'Replace your weathered, rotting wood deck with a durable, low-maintenance composite deck. Complete structural rebuilds in Massachusetts.'
  },
  'composite-decking.html': {
    title: 'Composite vs. PVC Decking Guide | Skills Deck Builders',
    description: 'Compare premium low-maintenance deck materials including Trex, TimberTech, and Azek. Choose the right decking for your home.'
  },
  'luxury-outdoor-living.html': {
    title: 'Luxury Outdoor Living Spaces | Skills Deck Builders',
    description: 'Complete backyard design-build transformations including multi-level decks, covered pavilions, and masonry fireplaces in Massachusetts.'
  },
  'deck-builder-wellesley-ma.html': {
    title: 'Wellesley Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Wellesley, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Wellesley permit guidance.'
  },
  'deck-builder-weston-ma.html': {
    title: 'Weston Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Weston, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Weston permit guidance.'
  },
  'deck-builder-chestnut-hill-ma.html': {
    title: 'Chestnut Hill Deck Builder | Custom Decks & Porches | Skills',
    description: 'Licensed deck builder in Chestnut Hill, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Permit guidance.'
  },
  'deck-builder-brookline-ma.html': {
    title: 'Brookline Deck Builder | Custom Decks & Porches | Skills',
    description: 'Licensed deck builder in Brookline, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Brookline permit guidance.'
  },
  'deck-builder-newton-ma.html': {
    title: 'Newton Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Newton, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Newton permit guidance.'
  },
  'deck-builder-sudbury-ma.html': {
    title: 'Sudbury Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Sudbury, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Sudbury permit guidance.'
  },
  'deck-builder-dover-ma.html': {
    title: 'Dover Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Dover, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Dover permit guidance.'
  },
  'deck-builder-lincoln-ma.html': {
    title: 'Lincoln Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Lincoln, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Lincoln permit guidance.'
  },
  'deck-builder-concord-ma.html': {
    title: 'Concord Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Concord, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Concord permit guidance.'
  },
  'deck-builder-lexington-ma.html': {
    title: 'Lexington Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Lexington, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Lexington permit guidance.'
  },
  'deck-builder-needham-ma.html': {
    title: 'Needham Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Needham, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Needham permit guidance.'
  },
  'deck-builder-wayland-ma.html': {
    title: 'Wayland Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Wayland, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Wayland permit guidance.'
  },
  'deck-builder-winchester-ma.html': {
    title: 'Winchester Deck Builder | Custom Composite Decks | Skills',
    description: 'Licensed deck builder in Winchester, MA. We design and build custom composite decks, covered porches, and outdoor kitchens. Winchester permit guidance.'
  },
  'areas-we-serve.html': {
    title: 'Areas Served | Custom Deck Construction in MA | Skills',
    description: 'We serve homeowners across Wellesley, Weston, Brookline, Newton, Sudbury, and Greater Boston. See our full construction service area map.'
  }
};

const textReplacements = [
  // Discerning homeowners replacements
  {
    search: /serving Massachusetts' most discerning homeowners/gi,
    replace: 'serving Massachusetts homeowners who value fine craftsmanship'
  },
  {
    search: /Massachusetts' most discerning homeowners/gi,
    replace: 'homeowners across Massachusetts who value quality builds'
  },
  {
    search: /discerning Massachusetts homeowners/gi,
    replace: 'homeowners in local Massachusetts towns'
  },
  {
    search: /discerning homeowners/gi,
    replace: 'homeowners who appreciate fine craftsmanship'
  },
  {
    search: /discerning clients/gi,
    replace: 'clients looking for high-quality outdoor spaces'
  },

  // Discover what is possible replacements
  {
    search: /discover what is possible for your property/gi,
    replace: 'plan your custom outdoor space'
  },
  {
    search: /discover what is possible/gi,
    replace: 'discuss your project ideas'
  },
  {
    search: /explore possibilities/gi,
    replace: 'explore custom design ideas'
  },

  // Elevate replacements
  {
    search: /designed to elevate the way you live at home/gi,
    replace: 'designed to expand your home’s usable living space'
  },
  {
    search: /built to elevate your outdoor lifestyle/gi,
    replace: 'built to enhance your outdoor living'
  },
  {
    search: /elevate your outdoor lifestyle/gi,
    replace: 'enhance your outdoor living space'
  },
  {
    search: /elevate a project from good to extraordinary/gi,
    replace: 'make a project look exceptional'
  },
  {
    search: /elevate these properties/gi,
    replace: 'enhance these homes'
  },
  {
    search: /visually elevated outdoor spaces/gi,
    replace: 'custom, durable outdoor spaces'
  },

  // Meticulous / Seamless / Testament replacements
  {
    search: /meticulous attention to detail/gi,
    replace: 'careful attention to detail'
  },
  {
    search: /meticulous execution/gi,
    replace: 'precise construction'
  },
  {
    search: /meticulous/gi,
    replace: 'precise'
  },
  {
    search: /seamless design-build experience/gi,
    replace: 'coordinated design-build process'
  },
  {
    search: /seamless experience/gi,
    replace: 'efficient, coordinated process'
  },
  {
    search: /testament to/gi,
    replace: 'reflection of'
  },

  // Slogan & general connector em-dashes
  {
    search: /Built to Enhance. Designed to Last./gi,
    replace: 'Built with Integrity. Designed to Endure.'
  },
  {
    search: / - built for New England homes/gi,
    replace: '. Built for New England weather'
  },
  {
    search: / - joist hangers, structural screws/gi,
    replace: ', including joist hangers, structural screws'
  },
  {
    search: / - composites, hardwoods, aluminum systems - /gi,
    replace: ' (composites, hardwoods, and aluminum systems) '
  },
  {
    search: / - about how you live, how you entertain, and what your home means to you/gi,
    replace: ' to understand how you live, how you entertain, and what you need from your space'
  },
  {
    search: / - not a generic template/gi,
    replace: ', never a pre-made template'
  },
  {
    search: / - from planning and permits to engineering and construction/gi,
    replace: ', covering planning, permits, engineering, and construction'
  },
  {
    search: / - from private consultation to final walkthrough - /gi,
    replace: ', from the initial consultation through to the final walkthrough, '
  },
  {
    search: / - communities where architectural standards are high and outdoor living is a way of life/gi,
    replace: ', where building standards are high and premium outdoor space is key'
  },
  {
    search: / — it deserves an experience/gi,
    replace: '. We build outdoor spaces with'
  },
  {
    search: / — refined, functional, and built/gi,
    replace: '. Our decks are refined, functional, and built'
  },
  {
    search: / — built for New England homes/gi,
    replace: '. Built for New England weather'
  },
  {
    search: / — from the first consultation/gi,
    replace: ', from the first consultation'
  },
  {
    search: / — about how you live/gi,
    replace: ' to understand how you live'
  },
  {
    search: / — communities where/gi,
    replace: ', where'
  },
  {
    search: / — not a generic/gi,
    replace: ', never a generic'
  },
  {
    search: / — not just a deck/gi,
    replace: ', never just a deck'
  },
  {
    search: / — a private outdoor experience/gi,
    replace: ', custom-built for your backyard'
  },
  {
    search: / — from design to/gi,
    replace: ', from design to'
  },
  {
    search: / — up to 25 years/gi,
    replace: ' of up to 25 years'
  },
  {
    search: / — no questions asked/gi,
    replace: ', no questions asked'
  },
  {
    search: / — now and in/gi,
    replace: ' now, and in'
  },
  {
    search: / — joist/gi,
    replace: ', joist'
  },
  {
    search: / — composites/gi,
    replace: ' (composites'
  },
  {
    search: / — and we protect/gi,
    replace: '. We protect'
  },
  {
    search: / — Trex, TimberTech, and/gi,
    replace: ' (Trex, TimberTech, and'
  },
  {
    search: / — and we/gi,
    replace: '. We'
  },
  {
    search: / — including/gi,
    replace: ', including'
  },
  {
    search: / — designed for/gi,
    replace: ', designed for'
  },
  {
    search: / — We/gi,
    replace: '. We'
  },
  {
    search: / — or attached/gi,
    replace: ' or attached'
  },
  {
    search: / — both standard/gi,
    replace: ' (both standard'
  },
  {
    search: / — our team/gi,
    replace: ', our team'
  },
  {
    search: / — from layout/gi,
    replace: ', from layout'
  },
  {
    search: / — so you/gi,
    replace: ', so you'
  },
  {
    search: / — it is/gi,
    replace: '. It is'
  },
  {
    search: / — We visit/gi,
    replace: '. We visit'
  },
  {
    search: / — or /gi,
    replace: ' or '
  }
];

for (const file of files) {
  const filePath = path.join(siteDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let originalHtml = html;

  // 1. Update Title Tag
  const meta = pageMeta[file];
  if (meta) {
    const titleRegex = /<title>([\s\S]*?)<\/title>/i;
    html = html.replace(titleRegex, `<title>${meta.title}</title>`);

    // Update Meta Description
    const descRegex = /<meta name="description" content="([\s\S]*?)"/i;
    html = html.replace(descRegex, `<meta name="description" content="${meta.description}"`);

    // Update Open Graph tags if present
    const ogTitleRegex = /<meta property="og:title" content="([\s\S]*?)"/i;
    html = html.replace(ogTitleRegex, `<meta property="og:title" content="${meta.title}"`);

    const ogDescRegex = /<meta property="og:description" content="([\s\S]*?)"/i;
    html = html.replace(ogDescRegex, `<meta property="og:description" content="${meta.description}"`);

    // JSON-LD schema description updates inside script tags
    const schemaDescRegex = /"description": "Custom decks, covered porches, outdoor kitchens & entertainment spaces designed for Massachusetts' most discerning homeowners[^"]*"/i;
    html = html.replace(schemaDescRegex, `"description": "${meta.description}"`);
  }

  // 2. Perform general text replacements
  for (const replacement of textReplacements) {
    html = html.replace(replacement.search, replacement.replace);
  }

  // Double check if any changes were made and save
  if (html !== originalHtml) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated copywriting & SEO in ${file}`);
  }
}

console.log('Site-wide copywriting and SEO updates completed.');
