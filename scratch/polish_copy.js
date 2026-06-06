const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');

// Helper to replace content in a file
function replaceInFile(fileName, replacements) {
  const filePath = path.join(siteDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${fileName}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const r of replacements) {
    if (typeof r.search === 'string') {
      content = content.split(r.search).join(r.replace);
    } else if (r.search instanceof RegExp) {
      content = content.replace(r.search, r.replace);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Polished ${fileName}`);
  } else {
    console.log(`No changes needed for ${fileName}`);
  }
}

// 1. Polishing about.html
replaceInFile('about.html', [
  {
    search: '<!-- Schema.org JSON-LD — Organization -->',
    replace: '<!-- Schema.org JSON-LD - Organization -->'
  },
  {
    search: '<!-- Schema.org JSON-LD — BreadcrumbList -->',
    replace: '<!-- Schema.org JSON-LD - BreadcrumbList -->'
  },
  {
    search: 'materials (composites, hardwoods, aluminum systems — and apply them with',
    replace: 'materials (including composites, hardwoods, and aluminum systems) and apply them with'
  },
  {
    search: 'are how we earn — and keep — your trust.',
    replace: 'are how we earn and keep your trust.'
  }
]);

// 2. Polishing areas-we-serve.html
replaceInFile('areas-we-serve.html', [
  {
    search: '<!-- Schema.org JSON-LD — LocalBusiness -->',
    replace: '<!-- Schema.org JSON-LD - LocalBusiness -->'
  }
]);

// 3. Polishing contact.html
replaceInFile('contact.html', [
  {
    search: 'Monday – Friday',
    replace: 'Monday - Friday'
  },
  {
    search: '8:00 AM – 6:00 PM',
    replace: '8:00 AM - 6:00 PM'
  },
  {
    search: '9:00 AM – 3:00 PM',
    replace: '9:00 AM - 3:00 PM'
  },
  {
    search: 'Within 1–3 months',
    replace: 'Within 1-3 months'
  },
  {
    search: 'Within 3–6 months',
    replace: 'Within 3-6 months'
  },
  {
    search: 'Within 6–12 months',
    replace: 'Within 6-12 months'
  },
  {
    search: 'Estimated Investment Range — Optional',
    replace: 'Estimated Investment Range (Optional)'
  },
  {
    search: '$15,000 – $25,000',
    replace: '$15,000 - $25,000'
  },
  {
    search: '$25,000 – $50,000',
    replace: '$25,000 - $50,000'
  },
  {
    search: '$50,000 – $100,000',
    replace: '$50,000 - $100,000'
  },
  {
    search: '$100,000 – $250,000',
    replace: '$100,000 - $250,000'
  }
]);

// 4. Polishing covered-porches.html
replaceInFile('covered-porches.html', [
  {
    search: 'feel like a seamless extension of your home\'s interior',
    replace: 'feel like a natural extension of your home\'s interior'
  }
]);

// 5. Polishing custom-decks.html
replaceInFile('custom-decks.html', [
  {
    search: 'integrate seamlessly with your estate',
    replace: 'integrate with your home'
  }
]);

// 6. Polishing deck-builder-chestnut-hill-ma.html
replaceInFile('deck-builder-chestnut-hill-ma.html', [
  {
    search: 'handled the permits seamlessly and delivered',
    replace: 'handled the permits efficiently and delivered'
  }
]);

// 7. Polishing deck-builder-lexington-ma.html
replaceInFile('deck-builder-lexington-ma.html', [
  {
    search: 'Elevating these properties requires a versatile',
    replace: 'Designing for these properties requires a versatile'
  }
]);

// 8. Polishing deck-builder-wellesley-ma.html
replaceInFile('deck-builder-wellesley-ma.html', [
  {
    search: 'Elevating these properties requires an eye for architectural details',
    replace: 'Designing for Wellesley estates requires an eye for architectural details'
  }
]);

// 9. Polishing index.html
replaceInFile('index.html', [
  {
    search: 'LOCAL AUTHORITY — COMMUNITIES',
    replace: 'LOCAL AUTHORITY | COMMUNITIES'
  },
  {
    search: 'POSITIONING — THE SKILLS DIFFERENCE',
    replace: 'POSITIONING | THE SKILLS DIFFERENCE'
  },
  {
    search: 'Seamless outdoor environments around pools',
    replace: 'Integrated outdoor spaces around pools'
  },
  {
    search: 'DIFFERENTIATION — WHY CHOOSE US',
    replace: 'DIFFERENTIATION | WHY CHOOSE US'
  }
]);

// 10. Polishing luxury-outdoor-living.html
replaceInFile('luxury-outdoor-living.html', [
  {
    search: 'seamlessly blend architectural beauty',
    replace: 'blend architectural beauty'
  },
  {
    search: '<strong>Seamless Transitions:</strong>',
    replace: '<strong>Smooth Transitions:</strong>'
  },
  {
    search: 'integrate seamlessly into the master plan',
    replace: 'integrate directly into the master plan'
  }
]);

// 11. Polishing outdoor-kitchens.html
replaceInFile('outdoor-kitchens.html', [
  {
    search: '<span class="subtitle">ELEVATED ENTERTAINING</span>',
    replace: '<span class="subtitle">OUTDOOR ENTERTAINING</span>'
  },
  {
    search: 'seamless integration with your deck or patio',
    replace: 'integrated layout with your deck or patio'
  }
]);

// 12. Polishing poolside-decks.html
replaceInFile('poolside-decks.html', [
  {
    search: 'Elevating the areas surrounding your pool',
    replace: 'Designing the areas surrounding your pool'
  },
  {
    search: '<h2>Seamless Pool-to-Deck Transitions</h2>',
    replace: '<h2>Smooth Pool-to-Deck Transitions</h2>'
  },
  {
    search: 'for a seamless, professional finish',
    replace: 'for a clean, professional finish'
  }
]);

// 13. Polishing portfolio.html
replaceInFile('portfolio.html', [
  {
    search: '"name": "Portfolio — Skills Deck Builders",',
    replace: '"name": "Portfolio | Skills Deck Builders",'
  },
  {
    search: '"description": "An elevated retreat featuring',
    replace: '"description": "A custom retreat featuring'
  },
  {
    search: '"description": "A seamless poolside deck',
    replace: '"description": "A custom poolside deck'
  },
  {
    search: '<p>An elevated retreat featuring a covered porch',
    replace: '<p>A custom retreat featuring a covered porch'
  },
  {
    search: '<p>A seamless poolside deck with frameless glass',
    replace: '<p>A custom poolside deck with frameless glass'
  },
  {
    search: 'Real deck builds from our team — composite, PVC, and pressure-treated installations across MetroWest and Greater Boston.',
    replace: 'Real deck builds from our team, including composite, PVC, and pressure-treated installations across MetroWest and Greater Boston.'
  }
]);

// 14. Polishing process.html
replaceInFile('process.html', [
  {
    search: '"description": "Our six-step design-build process for creating premium outdoor living spaces in Massachusetts — from private consultation to final walkthrough."',
    replace: '"description": "Our six-step design-build process for creating premium outdoor living spaces in Massachusetts, from the initial consultation through to the final walkthrough."'
  },
  {
    search: 'transparent investment range — all aligned with your architectural vision',
    replace: 'transparent investment range aligned with your architectural vision'
  },
  {
    search: 'finishing details — chosen for durability, aesthetics, and long-term performance',
    replace: 'finishing details, chosen for durability, aesthetics, and long-term performance'
  },
  {
    search: 'design-build timeline — from initial consultation through permitting and construction — typically spans 6 to 10 weeks.',
    replace: 'design-build timeline, from initial consultation through permitting and construction, typically spans 6 to 10 weeks.'
  },
  {
    search: 'unforeseen conditions arise — such as structural concerns beneath an existing deck or site drainage issues.',
    replace: 'unforeseen conditions arise, such as structural concerns beneath an existing deck or site drainage issues,'
  },
  {
    search: 'deliver a premium experience at every stage. Each step is structured to keep you informed, involved, and confident — from the moment we meet to the day we hand you the keys to your new outdoor living space.',
    replace: 'deliver a premium experience at every stage. Each step is structured to keep you informed, involved, and confident, from the first meeting to the final walkthrough.'
  },
  {
    search: 'PROCESS STEP 01 — PRIVATE DESIGN CONSULTATION',
    replace: 'PROCESS STEP 01: PRIVATE DESIGN CONSULTATION'
  },
  {
    search: 'alt="Private design consultation at a Wellesley residence — Skills Deck Builders assessing outdoor space"',
    replace: 'alt="Private design consultation at a Wellesley residence, with Skills Deck Builders assessing the outdoor space"'
  },
  {
    search: '<li>A private visit to your property — scheduled at your convenience</li>',
    replace: '<li>A private visit to your property, scheduled at your convenience</li>'
  },
  {
    search: 'PROCESS STEP 02 — CONCEPT & SCOPE',
    replace: 'PROCESS STEP 02: CONCEPT & SCOPE'
  },
  {
    search: 'alt="Covered outdoor living concept — refined porch design with architectural details"',
    replace: 'alt="Covered outdoor living concept: custom porch design with architectural details"'
  },
  {
    search: 'layout, spatial flow, feature set, material palette, and a transparent investment range — all tailored to complement the architecture and value of your home.',
    replace: 'layout, spatial flow, feature set, material palette, and a transparent investment range, all tailored to complement the architecture and value of your home.'
  },
  {
    search: '<li>Transparent investment range — no hidden costs or surprises</li>',
    replace: '<li>Transparent investment range with no hidden costs or surprises</li>'
  },
  {
    search: 'PROCESS STEP 03 — PLANNING & PERMITS',
    replace: 'PROCESS STEP 03: PLANNING & PERMITS'
  },
  {
    search: 'alt="Custom deck construction planning — detailed architectural drawings and permit coordination"',
    replace: 'alt="Custom deck construction planning, including detailed architectural drawings and permit coordination"'
  },
  {
    search: 'Massachusetts building codes — ensuring structural integrity, safety, and long-term compliance.',
    replace: 'Massachusetts building codes to ensure structural integrity, safety, and long-term compliance.'
  },
  {
    search: 'PROCESS STEP 04 — MATERIAL SELECTION',
    replace: 'PROCESS STEP 04: MATERIAL SELECTION'
  },
  {
    search: 'alt="Premium railing and lighting details — curated material selection for luxury outdoor living"',
    replace: 'alt="Premium railing and lighting details showing curated material selection for outdoor living"'
  },
  {
    search: 'details — each chosen for its durability, aesthetics, and performance in New England\'s demanding climate. Every recommendation reflects decades of experience with what lasts and what looks exceptional over time.',
    replace: 'details, each chosen for durability, aesthetics, and performance in New England\'s climate. Every recommendation reflects decades of experience with what lasts and what looks clean over time.'
  },
  {
    search: '<li>Integrated lighting design — low-voltage LED for ambiance and safety</li>',
    replace: '<li>Integrated lighting design, featuring low-voltage LED for ambiance and safety</li>'
  },
  {
    search: 'PROCESS STEP 05 — CONSTRUCTION',
    replace: 'PROCESS STEP 05: CONSTRUCTION'
  },
  {
    search: 'alt="Precision construction underway — skilled craftsmanship and clean job site management"',
    replace: 'alt="Precision construction underway with skilled carpentry and clean site management"'
  },
  {
    search: 'precision. Our team executes the build with careful attention to detail, daily site management, and the clear communication you deserve. We treat your property with the respect and care it demands — maintaining a clean, organized work environment throughout the entire project duration.',
    replace: 'precision. Our team executes the build with careful attention to detail, daily site management, and clear communication. We treat your property with respect, maintaining a clean and organized work environment throughout construction.'
  },
  {
    search: '<li>Daily site cleanup — your property stays organized and respected</li>',
    replace: '<li>Daily site cleanup to keep your property organized and clean</li>'
  },
  {
    search: 'PROCESS STEP 06 — FINAL WALKTHROUGH',
    replace: 'PROCESS STEP 06: FINAL WALKTHROUGH'
  },
  {
    search: 'alt="Completed luxury outdoor living space in Weston — final walkthrough and client handoff"',
    replace: 'alt="Completed custom outdoor living space in Weston after the final walkthrough"'
  },
  {
    search: '<li>Final site cleanup — your property is left pristine</li>',
    replace: '<li>Final site cleanup to leave your property clean and tidy</li>'
  },
  {
    search: 'care guidelines, and permit documentation — everything organized for your records.',
    replace: 'care guidelines, and permit documentation, all organized for your records.'
  },
  {
    search: 'construction — typically spans 6 to 10 weeks. More complex outdoor living spaces with covered structures, kitchens, or multi-level designs may extend beyond this range. We provide a detailed project schedule during the Concept &amp; Scope phase so you always know exactly what to expect and when.',
    replace: 'construction, which typically spans 6 to 10 weeks. More complex outdoor living spaces with covered structures, kitchens, or multi-level designs may take longer. We provide a detailed project schedule during the Concept and Scope phase so you always know what to expect.'
  },
  {
    search: 'However, if unforeseen conditions arise — such as structural concerns beneath an existing deck, unexpected drainage issues, or soil conditions that require additional foundation work. We communicate with you immediately and present solutions with transparent pricing before proceeding. There are never hidden charges or unauthorized changes to your project. Your trust is the foundation of our business.',
    replace: 'If unforeseen conditions arise, such as structural concerns beneath an existing deck or unexpected drainage issues, we communicate with you immediately to present solutions and transparent pricing before proceeding. We do not make changes without your approval.'
  },
  {
    search: 'Our team is fully self-sufficient and treats every property with the highest level of respect and care. We provide regular photo updates and progress reports throughout the build, so you are always informed regardless of your schedule. That said, we do recommend being available for the initial consultation and the final walkthrough — these two touchpoints ensure every detail reflects your vision and meets your expectations.',
    replace: 'Our team is fully self-sufficient and treats every property with care. We provide regular photo updates and progress reports throughout the build so you are always informed. We recommend being available for the initial consultation and the final walkthrough to ensure every detail meets your expectations.'
  }
]);

// 15. Polishing railings-lighting.html
replaceInFile('railings-lighting.html', [
  {
    search: 'A deck\'s railing does more than provide code-required safety — it frames your view and defines the architectural style of your entire outdoor living area.',
    replace: 'A deck\'s railing does more than provide safety; it frames your view and defines the architectural style of your outdoor living area.'
  },
  {
    search: 'ensure a seamless visual flow',
    replace: 'ensure a clean visual flow'
  }
]);

// 16. Polishing services.html
replaceInFile('services.html', [
  {
    search: 'Your deck should be more than a platform. It should be an architectural extension of your home — designed with intention, built with precision, and crafted to enhance the beauty and value of your property.',
    replace: 'Your deck should be more than a platform. It should be an architectural extension of your home, designed with intention, built with precision, and crafted to enhance the beauty and value of your property.'
  },
  {
    search: '<span class="section-subtitle">ELEVATED GATHERING</span>',
    replace: '<span class="section-subtitle">OUTDOOR GATHERING</span>'
  },
  {
    search: '<span class="section-subtitle">SEAMLESS ENVIRONMENTS</span>',
    replace: '<span class="section-subtitle">INTEGRATED SPACES</span>'
  },
  {
    search: '<li>Seamless pool-to-deck transitions</li>',
    replace: '<li>Smooth pool-to-deck transitions</li>'
  },
  {
    search: 'We replace aging structures with modern, durable and custom, durable outdoor spaces that transform how you experience your home.',
    replace: 'We replace aging structures with modern, custom, and durable decks that expand how you use your home.'
  },
  {
    search: '2–4 weeks',
    replace: '2-4 weeks'
  },
  {
    search: '6–10 weeks',
    replace: '6-10 weeks'
  }
]);

// 17. Polishing thank-you.html
replaceInFile('thank-you.html', [
  {
    search: 'Within 1–2 business days',
    replace: 'Within 1-2 business days'
  },
  {
    search: 'within 1–2 business days',
    replace: 'within 1-2 business days'
  }
]);

console.log('Polishing complete.');
