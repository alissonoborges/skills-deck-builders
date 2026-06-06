const fs = require('fs');
const path = require('path');

const siteDir = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\Site';

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let replacedAny = false;
  
  replacements.forEach(([target, replacement]) => {
    if (content.includes(target)) {
      content = content.replace(new RegExp(escapeRegExp(target), 'g'), replacement);
      replacedAny = true;
    } else {
      // Try replacing with flexible whitespace matching if exact match fails
      const simplifiedTarget = target.replace(/\s+/g, ' ').trim();
      const contentNormalized = content.replace(/\s+/g, ' ');
      if (contentNormalized.includes(simplifiedTarget)) {
        const regexStr = target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
        content = content.replace(new RegExp(regexStr, 'g'), replacement);
        replacedAny = true;
      }
    }
  });
  
  if (replacedAny) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced text in ${path.basename(filePath)}`);
  } else {
    console.log(`No replacements matches in ${path.basename(filePath)}`);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function run() {
  // 1. custom-decks.html
  const customDecksReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Custom Luxury Decks</h1>\n      <p>Architectural extensions designed for your lifestyle and engineered to last a lifetime.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Custom Luxury Decks</h1>\n      <p>Custom-built decks designed to match your home's character and constructed to handle New England winters.</p>`
    ],
    [
      `<span class="subtitle">DESIGN PHILOSOPHY</span>\n            <h2>An Architectural Extension of Your Home</h2>\n            <p>We believe a custom deck should never look like an afterthought. Our design process starts by analyzing the architecture of your house, the natural contours of your landscape, and how sunlight moves across your yard throughout the day.</p>\n            <p>Whether you envision a sleek multi-level entertainment space, an intimate sunset viewing platform, or a transitional zone that links your indoor living room to your pool, our team designs and builds structures that integrate with your home.</p>`,
      `<span class="subtitle">OUR APPROACH</span>\n            <h2>Decks that blend with your home's original design</h2>\n            <p>A deck should look like it was built with the house, not just tacked onto the back. We look at your home's siding, trim, and roof lines, as well as your yard's natural slope and sunlight, to design a space that fits in naturally.</p>\n            <p>Whether you want a simple ground-level deck, a multi-tiered platform with dining zones, or stairs linking your back door to your pool, our carpentry crew will frame and finish it to match your home's style.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING STANDARDS</span>\n            <h2>Premium Materials &amp; Structural Integrity</h2>\n            <p>Our commitment to luxury means we build with materials that perform exceptionally in the challenging New England climate. We partner with leading premium brands to offer unmatched durability, resistance to rot, and ease of maintenance.</p>`,
      `<span class="subtitle">QUALITY & DURABILITY</span>\n            <h2>Low-maintenance composites and solid framing</h2>\n            <p>We build with materials that can handle hot summers and freezing, snowy winters without warping, rotting, or splitting. By using top-tier composite boards and framing them properly, we deliver a deck that stays beautiful for decades.</p>`
    ],
    [
      `<h2>Start Designing Your Custom Deck</h2>\n        <p>Schedule a private on-site consultation to discuss your vision and ideas.</p>`,
      `<h2>Ready to build your new deck?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'custom-decks.html'), customDecksReplacements);

  // 2. covered-porches.html
  const coveredPorchesReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Covered Porches &amp; Pavilions</h1>\n      <p>Cozy, architecturally integrated structures designed to extend your living space across all seasons.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Covered Porches &amp; Pavilions</h1>\n      <p>Custom-built screened porches, open-air pavilions, and three-season rooms designed to match your house.</p>`
    ],
    [
      `<span class="subtitle">YEAR-ROUND ENJOYMENT</span>\n            <h2>Cozy Comfort in Any Season</h2>\n            <p>New England weather can be unpredictable, but a covered porch or outdoor room gives you the freedom to enjoy your backyard regardless of rain, hot sun, or autumn chill. We design and build covered living spaces that feel like a natural extension of your home's interior.</p>\n            <p>From screened porches with clean, floor-to-ceiling vistas to open-air pavilions featuring custom cedar tongue-and-groove ceilings, stone fireplaces, and integrated heaters, we craft functional retreats where luxury meets comfort.</p>`,
      `<span class="subtitle">OUTDOOR LIVING</span>\n            <h2>Enjoy your backyard, rain or shine</h2>\n            <p>A covered porch or pavilion lets you host family cookouts or read outside without worrying about a sudden rain shower, hot midday sun, or mosquitoes. We build covered spaces that feel like they were always part of your house.</p>\n            <p>Whether you want a screened porch with a custom cedar tongue-and-groove ceiling, or an open-air pavilion complete with infrared heaters, lighting, and an outdoor fireplace, we frame and finish everything to the highest standard.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING LUXURY</span>\n            <h2>Integrated Architectural Elements</h2>\n            <p>We pay close attention to the details that make an outdoor room feel comfortable and premium. Every roof line is engineered to tie cleanly into your home's existing roof, matching shingles, trim, and gutters perfectly.</p>`,
      `<span class="subtitle">OUR CRAFT</span>\n            <h2>Built to match your home's roof lines</h2>\n            <p>We build our roof structures to tie in seamlessly with your home's existing roof line, matching the shingles, siding, and trim exactly. This ensures the porch looks natural and handles heavy snow loads safely.</p>`
    ],
    [
      `<h2>Start Designing Your Covered Retreat</h2>\n        <p>Schedule a private on-site consultation to discuss your ideas and requirements.</p>`,
      `<h2>Ready to build a covered porch or pavilion?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'covered-porches.html'), coveredPorchesReplacements);

  // 3. outdoor-kitchens.html
  const outdoorKitchensReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Outdoor Kitchens &amp; Dining</h1>\n      <p>Culinary spaces crafted for hosting, gathering and enjoying restaurant-quality cooking at home.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Outdoor Kitchens &amp; Dining</h1>\n      <p>Custom-built outdoor cooking spaces designed for hosting family and friends.</p>`
    ],
    [
      `<span class="subtitle">OUTDOOR ENTERTAINING</span>\n            <h2>The Art of Outdoor Culinary Spaces</h2>\n            <p>An outdoor kitchen is the ultimate luxury addition for homeowners who love to host. More than just a simple barbecue, our custom outdoor kitchens are fully integrated culinary environments, complete with professional-grade appliances, expansive stone counter prep areas, and integrated layout with your deck or patio.</p>\n            <p>We work with you to plan layout ergonomics (hot, dry, cold, and wet zones), custom stone masonry, and functional elements like under-counter refrigeration, wet bars, and task lighting to make cooking outdoors a pure pleasure.</p>`,
      `<span class="subtitle">OUTDOOR COOKING</span>\n            <h2>Bring the heart of your home outside</h2>\n            <p>A good outdoor kitchen is more than just a grill in the corner. We build functional, durable cooking areas that combine premium stainless steel grills, custom masonry, and granite countertops, creating the perfect setup for summer cookouts.</p>\n            <p>Whether you want a simple prep counter next to your grill or a full outdoor bar with integrated fridges, sinks, and custom stone masonry, we'll design and build a layout that fits your deck or patio perfectly.</p>`
    ],
    [
      `<span class="subtitle">DURABLE CRAFTSMANSHIP</span>\n            <h2>Weather-Resistant Luxury Materials</h2>\n            <p>Outdoor kitchens must withstand New England's freezing winters and hot summers. We select and build with heavy-duty, weather-tested materials that maintain their beauty and structural integrity year-round.</p>`,
      `<span class="subtitle">BUILT TO LAST</span>\n            <h2>Durable materials that handle New England weather</h2>\n            <p>We frame our kitchen islands using heavy-duty, weather-resistant materials and finish them with durable stone, brick, or composite wraps. We use premium granite countertops and stainless steel appliances that stand up to rain, snow, and ice year after year.</p>`
    ],
    [
      `<h2>Start Designing Your Outdoor Kitchen</h2>\n        <p>Schedule a private on-site consultation to discuss your culinary space ideas.</p>`,
      `<h2>Ready to build your outdoor kitchen?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'outdoor-kitchens.html'), outdoorKitchensReplacements);

  // 4. poolside-decks.html
  const poolsideDecksReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Poolside Decks</h1>\n      <p>Low-maintenance, slip-resistant poolside retreats designed for summer relaxation.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Poolside Decks</h1>\n      <p>Slip-resistant, low-maintenance composite decks built for poolside lounging.</p>`
    ],
    [
      `<span class="subtitle">POOLSIDE RETREATS</span>\n            <h2>The Perfect Pool Companion</h2>\n            <p>A poolside deck needs to balance safety, durability, and style. We design and build custom decks around pools that create a seamless flow between your home, your water features, and your landscaping.</p>\n            <p>We utilize premium capped polymer PVC materials that offer excellent slip resistance, heat dissipation, and moisture protection. Your deck will look beautiful, feel comfortable under bare feet, and stand up to splash-back and chlorine.</p>`,
      `<span class="subtitle">POOLSIDE DECKS</span>\n            <h2>Safe, comfortable decks around your pool</h2>\n            <p>A deck around a pool has to handle constant water, sun, and wet feet. We design and build poolside composite decks that integrate with your pool layout and landscaping.</p>\n            <p>We use premium capped polymer PVC decking because it does not absorb water, resists mold, and stays cooler under the sun. It also has a textured, slip-resistant surface that is safe and comfortable for bare feet.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING METRIC</span>\n            <h2>Engineered for Water &amp; Sun</h2>\n            <p>We select and engineer every component of your poolside deck to withstand constant moisture and heavy UV exposure. From corrosion-resistant framing hardware to specialized decking boards, we build poolside spaces that require minimal maintenance.</p>`,
      `<span class="subtitle">BUILT FOR WATER</span>\n            <h2>Low-maintenance and slip-resistant</h2>\n            <p>Every part of our poolside decks is built to handle moisture. We use stainless steel framing fasteners, marine-grade structural connectors, and capped PVC decking so your pool area stays beautiful and rot-free for years without staining or sealing.</p>`
    ],
    [
      `<h2>Start Designing Your Poolside Retreat</h2>\n        <p>Schedule a private on-site consultation to discuss your pool deck project.</p>`,
      `<h2>Ready to build your poolside deck?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'poolside-decks.html'), poolsideDecksReplacements);

  // 5. railings-lighting.html
  const railingsLightingReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Railings &amp; Lighting</h1>\n      <p>Premium handrails and custom low-voltage LED lighting systems for safety and style.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Railings &amp; Lighting</h1>\n      <p>Sleek metal and cable railings paired with custom low-voltage LED step and post lighting.</p>`
    ],
    [
      `<span class="subtitle">SAFETY &amp; STYLE</span>\n            <h2>The Perfect Finishing Touches</h2>\n            <p>The details define the quality of a deck. We install high-performance railing systems and custom low-voltage LED lighting that make your outdoor space safer, more functional, and visually striking day and night.</p>\n            <p>Whether you want minimal-profile cable railings that preserve your view, classic black aluminum rails that frame your yard, or soft riser and post-cap lights that glow in the evening, we integrate these details into your design.</p>`,
      `<span class="subtitle">RAILINGS & LIGHTING</span>\n            <h2>Clean lines and subtle evening light</h2>\n            <p>The right railings and lighting are what make a deck feel finished. We install clean, high-quality railings and low-voltage LED lights that keep your deck safe and make it a comfortable place to hang out after sunset.</p>\n            <p>Whether you prefer modern stainless steel cable railings to keep your view open, black powder-coated aluminum rails, or soft LED lights built into your stair risers and posts, we make sure they look clean and integrated.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING FINISH</span>\n            <h2>Architectural Railings &amp; Smart Lighting</h2>\n            <p>We partner with top manufacturers to offer railings and lighting that match our high standards for craftsmanship and longevity. Our systems are built to resist fading, scratching, and corrosion, and our LED systems are highly energy-efficient.</p>`,
      `<span class="subtitle">DETAILS MATTER</span>\n            <h2>Premium railings and low-voltage LED systems</h2>\n            <p>We install durable railings that won't rust, chip, or warp over time. Our low-voltage LED lights are energy-efficient and run on automatic timers or smart home systems, giving your deck a warm, premium feel every night.</p>`
    ],
    [
      `<h2>Start Designing Your Details</h2>\n        <p>Schedule a private on-site consultation to discuss your railing and lighting options.</p>`,
      `<h2>Ready to add custom railings or lighting?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'railings-lighting.html'), railingsLightingReplacements);

  // 6. deck-replacement.html
  const deckReplacementReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Deck Replacement</h1>\n      <p>Replace your worn wood deck with a premium, low-maintenance composite deck.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Deck Replacement</h1>\n      <p>Replace your old, splitting wood deck with a solid, low-maintenance composite build.</p>`
    ],
    [
      `<span class="subtitle">UPGRADE YOUR SPACE</span>\n            <h2>Worn Out Wood to Maintenance-Free</h2>\n            <p>If your existing wood deck is splitting, rotting, or requiring constant staining and sealing, it is time for an upgrade. We specialize in transforming worn outdoor decks into durable, low-maintenance composite spaces.</p>\n            <p>We evaluate your existing structural framing. If the joists and footings are solid and meet current safety codes, we can perform a re-skin—replacing only the deck boards and railings to save you time and money.</p>`,
      `<span class="subtitle">DECK REPLACEMENT</span>\n            <h2>Upgrade to a low-maintenance composite deck</h2>\n            <p>If your old wood deck is rotting, splitting, or requires constant sanding and staining, it's time to replace it. We specialize in tearing down old wood decks and replacing them with clean, modern composite spaces.</p>\n            <p>Our crew inspects your deck's existing frame. If the underlying joists and concrete footings are still solid and up to code, we can simply re-skin the deck—replacing just the floorboards and railings, saving you time and cost.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING QUALITY</span>\n            <h2>Precision Tear-Out &amp; Re-Building</h2>\n            <p>A successful deck replacement starts with a thorough structural assessment. We don't just cover up problems. We inspect every joist, connection, and ledger board, reinforcing the structure when needed to ensure your new deck is built on a solid foundation.</p>`,
      `<span class="subtitle">STRUCTURAL HONESTY</span>\n            <h2>Framing inspection and premium deck boards</h2>\n            <p>A safe deck replacement starts with a thorough structural framing inspection. We check every joist, connector, and the ledger board attached to your house. We reinforce the framing where needed so your new composite deck has a solid foundation.</p>`
    ],
    [
      `<h2>Schedule Your Deck Assessment</h2>\n        <p>Schedule a private on-site inspection to evaluate your existing deck structure.</p>`,
      `<h2>Ready to replace your old deck?</h2>\n        <p>Get in touch to evaluate your old deck and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'deck-replacement.html'), deckReplacementReplacements);

  // 7. luxury-outdoor-living.html
  const luxuryLivingReplacements = [
    [
      `<span class="hero-subtitle">INDIVIDUAL SERVICE</span>\n      <h1>Luxury Outdoor Living</h1>\n      <p>Expansive, multi-functional outdoor environments combining decks, porches and kitchens.</p>`,
      `<span class="hero-subtitle">DESIGN & CONSTRUCTION</span>\n      <h1>Luxury Outdoor Living</h1>\n      <p>Custom-built backyard environments combining decks, covered porches, and outdoor kitchens.</p>`
    ],
    [
      `<span class="subtitle">COMPLETE BACKYARDS</span>\n            <h2>Expand Your Home's Footprint</h2>\n            <p>True luxury is an outdoor living space that coordinates multiple functional zones. We design and build comprehensive backyard projects that integrate multi-tiered composite decks, covered porches, and stone outdoor kitchens into a single, cohesive layout.</p>\n            <p>We look at the entire scope of your yard, planning transitions between dining areas, cooking stations, and lounge spaces to maximize usability. By coordinating design, permits, and construction, we deliver a premium turnkey experience.</p>`,
      `<span class="subtitle">OUTDOOR LIVING</span>\n            <h2>Your entire backyard, custom built</h2>\n            <p>We design and build complete outdoor living projects that tie everything together—combining custom composite decks, covered porches, and stone outdoor kitchens into one cohesive backyard layout.</p>\n            <p>We plan the layout so you can easily move between the grill, the dining table, and a covered lounge area. Our crew handles the entire design, town permit process, utilities, and carpentry, delivering a finished space ready for your family.</p>`
    ],
    [
      `<span class="subtitle">UNCOMPROMISING LUXURY</span>\n            <h2>Coordinated Design-Build Services</h2>\n            <p>Building a complex outdoor living environment requires coordinates across multiple trades, including carpentry, masonry, gas-fitting, plumbing, and electrical. Our experienced project managers handle every detail, ensuring your project is completed on time and to our highest standards.</p>`,
      `<span class="subtitle">TURNKEY BUILD</span>\n            <h2>Complete project management and quality builds</h2>\n            <p>Building a multi-zone outdoor space requires coordinates across carpentry, stone masonry, gas-fitting, and electrical. Our team manages all trades, permits, and inspections, keeping the project moving smoothly and ensuring the finished build is flawless.</p>`
    ],
    [
      `<h2>Start Designing Your Outdoor Living Space</h2>\n        <p>Schedule a private on-site consultation to discuss your backyard vision.</p>`,
      `<h2>Ready to build your outdoor living space?</h2>\n        <p>Get in touch to talk about your project and schedule an on-site estimate.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'luxury-outdoor-living.html'), luxuryLivingReplacements);

  // 8. composite-decking.html
  const compositeDeckingReplacements = [
    [
      `<span class="hero-subtitle">MATERIALS GUIDE</span>\n      <h1>Composite &amp; PVC Decking</h1>\n      <p>Compare the industry's leading brands: Trex, TimberTech, and Azek for your next project.</p>`,
      `<span class="hero-subtitle">MATERIALS GUIDE</span>\n      <h1>Composite &amp; PVC Decking</h1>\n      <p>How to choose between Trex, TimberTech, and Azek for your new deck.</p>`
    ],
    [
      `<span class="subtitle">ENGINEERED PERFORMANCE</span>\n            <h2>Why We Build with Premium Composites</h2>\n            <p>Traditional wood decks look beautiful when first installed, but the harsh Massachusetts winter freezes and humid summers inevitably lead to splitting, warping, rot, and constant maintenance. Premium composite and capped PVC materials offer a better way forward.</p>`,
      `<span class="subtitle">DECKING MATERIALS</span>\n            <h2>Why we build with composite and PVC</h2>\n            <p>Traditional wood decks look great at first, but New England winters and humid summers quickly lead to splitting, warping, and rot. That is why we recommend premium composite and capped PVC materials.</p>`
    ],
    [
      `<h2>Choose Your Material Style</h2>\n        <p>Schedule a design meeting. We will bring actual physical samples of Trex, TimberTech, and Azek in multiple colors to your home.</p>`,
      `<h2>Choose Your Material Style</h2>\n        <p>Schedule a design meeting. We will bring physical samples of Trex, TimberTech, and Azek in different colors to your home.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'composite-decking.html'), compositeDeckingReplacements);

  // 9. reviews.html
  const reviewsReplacements = [
    [
      `<span class="hero-subtitle">CLIENT EXPERIENCES</span>\n      <h1>What Our Clients Say</h1>\n      <p>The best measure of our work is the experience of the homeowners who trust us.</p>`,
      `<span class="hero-subtitle">CLIENT REVIEWS</span>\n      <h1>What Our Clients Say</h1>\n      <p>Read real feedback from homeowners across Massachusetts who built with us.</p>`
    ],
    [
      `<p style="font-size: 1.1rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 1.5rem;">Skills Deck Builders operates as the specialty carpentry and outdoor living division of <strong>Skills Renovation</strong>. We share the same licensed building crews, rigorous engineering standards, and 5-star reputation of over 67+ verified local reviews.</p>`,
      `<p style="font-size: 1.1rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 1.5rem;">Skills Deck Builders is the specialized carpentry and outdoor living division of Skills Renovation. We use the same experienced local crews, structural engineering practices, and share a 5-star reputation with over 67+ verified local reviews.</p>`
    ]
  ];
  replaceInFile(path.join(siteDir, 'reviews.html'), reviewsReplacements);
}

run();
console.log('Finished humanizing remaining subpages.');
