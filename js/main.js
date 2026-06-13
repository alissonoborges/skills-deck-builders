/* ==========================================================================
   Skills Deck Builders — Main JavaScript
   Built to Enhance. Designed to Last.
   Version: 1.0.0
   Zero dependencies. Vanilla ES6+.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -----------------------------------------------------------------------
     UTILITIES
     ----------------------------------------------------------------------- */

  /**
   * Debounce — delays execution until `wait` ms after last call.
   * @param {Function} fn   Callback
   * @param {number}   wait Milliseconds
   * @returns {Function}
   */
  const debounce = (fn, wait = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  /**
   * Throttle via requestAnimationFrame — ensures at most one call per frame.
   * @param {Function} fn Callback
   * @returns {Function}
   */
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  };

  /**
   * Format bytes to a human-readable string.
   */
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  /* -----------------------------------------------------------------------
     1 · NAVIGATION — SCROLL CLASS
     Add 'scrolled' class to .nav when the page is scrolled past 100 px.
     This drives the CSS transition for header shrink / background change.
     ----------------------------------------------------------------------- */

  const nav = document.querySelector(".nav");

  const handleNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 100) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  // Fire immediately so the state is correct on load (e.g. if the page is
  // refreshed while scrolled down).
  handleNavScroll();
  window.addEventListener("scroll", rafThrottle(handleNavScroll), {
    passive: true,
  });

  /* -----------------------------------------------------------------------
     2 · NAVIGATION — HAMBURGER TOGGLE
     Toggle the mobile nav and animate the hamburger icon to an ×.
     ----------------------------------------------------------------------- */

  const hamburger = document.querySelector(".nav-hamburger");
  const navMobile = document.querySelector(".mobile-menu");

  // Relocate mobile menu to root of body to escape transformed ancestors (backdrop-filter containing block bug on iOS)
  if (navMobile && navMobile.parentElement !== document.body) {
    document.body.appendChild(navMobile);
  }

  const openMobileNav = () => {
    if (!navMobile) return;
    navMobile.classList.add("active");
    hamburger?.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent background scroll
  };

  const closeMobileNav = () => {
    if (!navMobile) return;
    navMobile.classList.remove("active");
    hamburger?.classList.remove("active");
    document.body.style.overflow = "";
  };

  hamburger?.addEventListener("click", () => {
    navMobile?.classList.contains("active")
      ? closeMobileNav()
      : openMobileNav();
  });

  // Close when clicking any link inside mobile nav
  navMobile?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileNav();
      closeLightbox(); // also close lightbox if open (defined later)
    }
  });

  /* -----------------------------------------------------------------------
     3 · SCROLL REVEAL ANIMATIONS
     Fade/slide elements in when they enter the viewport.
     ----------------------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  if (revealElements.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // trigger only once
          }
        });
      },
      { threshold: 0.15 },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: make everything visible immediately
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* -----------------------------------------------------------------------
     4 · SMOOTH SCROLL
     Anchor links scroll smoothly with an offset for the fixed nav.
     ----------------------------------------------------------------------- */

  const NAV_OFFSET = 80; // px — height of fixed nav

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#" || href === "#0") return; // skip dead links

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMobileNav();

      const top =
        target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* -----------------------------------------------------------------------
     5 · STICKY MOBILE CTA
     A fixed call-to-action bar that appears after the hero and hides
     near the footer. Mobile only (< 768 px).
     ----------------------------------------------------------------------- */

  const stickyCta = document.querySelector(".sticky-cta");

  const handleStickyCta = () => {
    if (!stickyCta || window.innerWidth >= 768) {
      stickyCta?.classList.remove("visible");
      return;
    }

    const heroHeight = window.innerHeight; // hero is 100vh
    const footer = document.querySelector("footer, .footer");
    const footerTop = footer
      ? footer.getBoundingClientRect().top + window.scrollY
      : Infinity;

    const scrollY = window.scrollY;
    const viewportBottom = scrollY + window.innerHeight;

    if (scrollY > heroHeight && viewportBottom < footerTop - 100) {
      stickyCta.classList.add("visible");
    } else {
      stickyCta.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", rafThrottle(handleStickyCta), {
    passive: true,
  });
  window.addEventListener("resize", debounce(handleStickyCta, 200), {
    passive: true,
  });

  /* -----------------------------------------------------------------------
     6 · BEFORE / AFTER SLIDER
     Drag-controlled comparison slider for transformation images.
     ----------------------------------------------------------------------- */

  const initBeforeAfterSliders = () => {
    document.querySelectorAll(".ba-slider").forEach((slider) => {
      const handle = slider.querySelector(".ba-handle");
      const afterImg = slider.querySelector(".ba-after");
      if (!handle || !afterImg) return;

      let isDragging = false;

      // Set initial position to 50 %
      // BEFORE is the bottom layer (fully visible)
      // AFTER is the top layer (clipped from left to handle position)
      const setPosition = (pct) => {
        const clamped = Math.max(0, Math.min(100, pct));
        afterImg.style.clipPath = `inset(0 0 0 ${clamped}%)`;
        handle.style.left = `${clamped}%`;
      };

      setPosition(50);

      const getPercentage = (clientX) => {
        const rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      };

      // Mouse events
      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
        slider.classList.add("dragging");
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        requestAnimationFrame(() => setPosition(getPercentage(e.clientX)));
      });

      window.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          slider.classList.remove("dragging");
        }
      });

      // Touch events
      handle.addEventListener(
        "touchstart",
        () => {
          isDragging = true;
          slider.classList.add("dragging");
        },
        { passive: true },
      );

      window.addEventListener(
        "touchmove",
        (e) => {
          if (!isDragging) return;
          const touch = e.touches[0];
          requestAnimationFrame(() =>
            setPosition(getPercentage(touch.clientX)),
          );
        },
        { passive: true },
      );

      window.addEventListener("touchend", () => {
        if (isDragging) {
          isDragging = false;
          slider.classList.remove("dragging");
        }
      });

      // Allow clicking anywhere on the slider to jump position
      slider.addEventListener("click", (e) => {
        setPosition(getPercentage(e.clientX));
      });
    });
  };

  initBeforeAfterSliders();

  /* -----------------------------------------------------------------------
     7 · LAZY LOADING IMAGES
     Swap data-src → src when images approach the viewport.
     ----------------------------------------------------------------------- */

  const lazyImages = document.querySelectorAll("img[data-src]");

  if (lazyImages.length && "IntersectionObserver" in window) {
    const lazyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.addEventListener("load", () => img.classList.add("loaded"), {
              once: true,
            });
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "200px" },
    );

    lazyImages.forEach((img) => lazyObserver.observe(img));
  } else {
    // Fallback: load everything immediately
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.add("loaded");
    });
  }

  /* -----------------------------------------------------------------------
     8 · PORTFOLIO LIGHTBOX
     Full-screen image viewer with keyboard navigation.
     ----------------------------------------------------------------------- */

  const galleryItems = document.querySelectorAll(
    ".portfolio-item, .gallery-item",
  );
  let lightboxOverlay = document.querySelector(".modal-overlay");
  let lightboxContent = null;
  let lightboxClose = null;
  let lightboxImages = [];
  let lightboxIndex = 0;

  // Build lightbox DOM if it doesn't already exist in the markup
  const ensureLightboxDOM = () => {
    if (lightboxOverlay) {
      lightboxContent =
        lightboxOverlay.querySelector(".modal-content img") ||
        lightboxOverlay.querySelector(".modal-content");
      lightboxClose = lightboxOverlay.querySelector(".modal-close");
      return;
    }

    lightboxOverlay = document.createElement("div");
    lightboxOverlay.className = "modal-overlay";
    lightboxOverlay.innerHTML = `
      <button class="modal-close" aria-label="Close lightbox">&times;</button>
      <div class="modal-content">
        <img src="" alt="Enlarged project photo" />
      </div>
      <button class="modal-prev" aria-label="Previous image">&#10094;</button>
      <button class="modal-next" aria-label="Next image">&#10095;</button>
    `;
    document.body.appendChild(lightboxOverlay);

    lightboxContent = lightboxOverlay.querySelector(".modal-content img");
    lightboxClose = lightboxOverlay.querySelector(".modal-close");

    // Prev / Next buttons
    lightboxOverlay
      .querySelector(".modal-prev")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
    lightboxOverlay
      .querySelector(".modal-next")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });
  };

  const openLightbox = (index) => {
    ensureLightboxDOM();
    lightboxIndex = index;
    const src = lightboxImages[index];
    if (!src || !lightboxContent) return;

    lightboxContent.src = src;
    lightboxContent.alt = `Project image ${index + 1} of ${lightboxImages.length}`;
    lightboxOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  const navigateLightbox = (direction) => {
    if (!lightboxImages.length) return;
    lightboxIndex =
      (lightboxIndex + direction + lightboxImages.length) %
      lightboxImages.length;
    if (lightboxContent) {
      lightboxContent.src = lightboxImages[lightboxIndex];
      lightboxContent.alt = `Project image ${lightboxIndex + 1} of ${lightboxImages.length}`;
    }
  };

  if (galleryItems.length) {
    // Collect full-size image URLs
    lightboxImages = Array.from(galleryItems).map((item) => {
      const img = item.querySelector("img");
      return item.dataset.full || img?.dataset.src || img?.src || "";
    });

    galleryItems.forEach((item, i) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", () => openLightbox(i));
    });

    ensureLightboxDOM();

    // Close on overlay click (not on image)
    lightboxOverlay.addEventListener("click", (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    lightboxClose?.addEventListener("click", closeLightbox);

    // Keyboard: Escape, ← , →
    document.addEventListener("keydown", (e) => {
      if (!lightboxOverlay?.classList.contains("active")) return;
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
      // Escape is already handled globally above
    });
  }

  /* -----------------------------------------------------------------------
     9 · FORM HANDLING
     Validation, phone formatting, file upload, anti-double-submit.
     ----------------------------------------------------------------------- */

  const contactForm = document.getElementById("consultation-form");

  if (contactForm) {
    let isSubmitting = false;

    /* — Inline validation helpers — */

    const showError = (field, message) => {
      field.classList.add("error");
      field.classList.remove("success");
      let msg = field.parentElement.querySelector(".field-error");
      if (!msg) {
        msg = document.createElement("span");
        msg.className = "field-error";
        field.parentElement.appendChild(msg);
      }
      msg.textContent = message;
    };

    const showSuccess = (field) => {
      field.classList.remove("error");
      field.classList.add("success");
      const msg = field.parentElement.querySelector(".field-error");
      if (msg) msg.textContent = "";
    };

    const validateField = (field) => {
      const value = field.value.trim();
      const type = field.type;
      const name = field.name || field.id;

      // Required check
      if (field.hasAttribute("required") && !value) {
        showError(field, "This field is required.");
        return false;
      }

      // Email
      if (type === "email" && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          showError(field, "Please enter a valid email address.");
          return false;
        }
      }

      // Phone — expect at least 10 digits
      if ((type === "tel" || name === "phone") && value) {
        const digits = value.replace(/\D/g, "");
        if (digits.length < 10) {
          showError(field, "Please enter a valid 10-digit phone number.");
          return false;
        }
      }

      showSuccess(field);
      return true;
    };

    /* — Phone auto-format as (XXX) XXX-XXXX — */

    const phoneFields = contactForm.querySelectorAll(
      'input[type="tel"], input[name="phone"]',
    );

    phoneFields.forEach((phone) => {
      phone.addEventListener("input", () => {
        let digits = phone.value.replace(/\D/g, "").substring(0, 10);
        if (digits.length === 0) {
          phone.value = "";
        } else if (digits.length <= 3) {
          phone.value = `(${digits}`;
        } else if (digits.length <= 6) {
          phone.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
          phone.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
      });
    });

    /* — Real-time validation on blur — */

    contactForm.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    /* — Submit — */

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      // Honeypot check
      const botCheck = contactForm.querySelector('input[name="botcheck"]');
      if (botCheck && botCheck.checked) {
        window.location.href = "/thank-you";
        return;
      }

      // Validate all fields
      const fields = contactForm.querySelectorAll("input, textarea, select");
      let allValid = true;
      fields.forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        // Scroll to first error
        const firstError = contactForm.querySelector(".error");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      isSubmitting = true;
      const submitBtn = contactForm.querySelector(
        'button[type="submit"], input[type="submit"]',
      );
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }

      // Collect form data
      const formData = new FormData(contactForm);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const json = await response.json().catch(() => ({}));
          if (response.ok) {
            window.location.href = "/thank-you";
          } else {
            alert(
              "Form submission failed: " +
                (json.message || "Unknown error occurred."),
            );
            isSubmitting = false;
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent =
                submitBtn.dataset.originalText ||
                "Request Private Consultation";
            }
          }
        })
        .catch(() => {
          alert(
            "An error occurred while sending your request. Please try again or call us directly.",
          );
          isSubmitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent =
              submitBtn.dataset.originalText || "Request Private Consultation";
          }
        });
    });
  }

  /* -----------------------------------------------------------------------
     9b · FILE UPLOAD UI
     Custom drag-and-drop area with preview thumbnails, file validation,
     and removal.
     ----------------------------------------------------------------------- */

  const fileUploadArea = document.querySelector(".file-upload-area");
  const fileInput = document.querySelector(
    '.file-upload-area input[type="file"]',
  );
  const filePreview = document.querySelector(".file-preview");

  const ALLOWED_EXTS = ["jpg", "jpeg", "png", "mp4", "mov"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  let uploadedFiles = []; // tracks the current set of user-selected files

  const validateFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return `"${file.name}" — unsupported file type. Please upload JPG, PNG, MP4, or MOV.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 10 MB limit.`;
    }
    return null;
  };

  const renderFilePreviews = () => {
    if (!filePreview) return;
    filePreview.innerHTML = "";

    uploadedFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "file-preview-item";

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.alt = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        item.appendChild(img);
      } else {
        // Video — show icon + metadata
        const info = document.createElement("div");
        info.className = "file-info";
        info.innerHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';

        const nameSpan = document.createElement("span");
        nameSpan.className = "file-name";
        nameSpan.textContent = file.name;
        info.appendChild(nameSpan);

        const sizeSpan = document.createElement("span");
        sizeSpan.className = "file-size";
        sizeSpan.textContent = formatBytes(file.size);
        info.appendChild(sizeSpan);

        item.appendChild(info);
      }

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "file-remove";
      removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", () => {
        uploadedFiles.splice(index, 1);
        renderFilePreviews();
      });
      item.appendChild(removeBtn);

      filePreview.appendChild(item);
    });
  };

  const handleFiles = (files) => {
    const errors = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        uploadedFiles.push(file);
      }
    });

    if (errors.length) {
      alert(errors.join("\n"));
    }

    renderFilePreviews();
  };

  if (fileUploadArea && fileInput) {
    // Click to open file picker
    fileUploadArea.addEventListener("click", (e) => {
      if (e.target === fileInput) return; // avoid infinite loop
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      handleFiles(fileInput.files);
      fileInput.value = ""; // reset so re-selecting the same file works
    });

    // Drag & Drop
    ["dragenter", "dragover"].forEach((evt) => {
      fileUploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      fileUploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove("drag-over");
      });
    });

    fileUploadArea.addEventListener("drop", (e) => {
      handleFiles(e.dataTransfer.files);
    });
  }

  /* -----------------------------------------------------------------------
     10 · COUNTER ANIMATION
     Animate numbers from 0 → data-target when scrolled into view.
     ----------------------------------------------------------------------- */

  const counters = document.querySelectorAll(".counter");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 2000; // ms
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Ease-out quad for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((c) => counterObserver.observe(c));
  }

  /* -----------------------------------------------------------------------
     11 · HEADER SHRINK (handled together with section 1 above)
     The 'scrolled' class is added/removed in `handleNavScroll`.
     CSS drives the padding transition:
       .nav            { padding: 24px 0; transition: padding .3s ease; }
       .nav.scrolled   { padding: 12px 0; }
     ----------------------------------------------------------------------- */

  // (Covered by handleNavScroll — intentionally consolidated.)

  /* -----------------------------------------------------------------------
     12 · PARALLAX EFFECT (subtle, desktop only)
     Translate .hero-bg at 30 % of scroll rate for a gentle depth effect.
     ----------------------------------------------------------------------- */

  const heroBg = document.querySelector(".hero-bg");

  const handleParallax = () => {
    if (!heroBg || window.innerWidth < 768) return;
    const offset = window.scrollY * 0.3;
    heroBg.style.transform = `translateY(${offset}px)`;
  };

  window.addEventListener("scroll", rafThrottle(handleParallax), {
    passive: true,
  });

  /* -----------------------------------------------------------------------
     13 · ACTIVE NAV HIGHLIGHTING
     Highlight the nav link corresponding to the section currently in view.
     Only active on the home page (detects sections with IDs that match
     nav hrefs).
     ----------------------------------------------------------------------- */

  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .nav-mobile a[href^="#"]',
  );
  const sections = [];

  // Build a list of observable sections
  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (id && id !== "#") {
      const section = document.querySelector(id);
      if (section) sections.push(section);
    }
  });

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  if (sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${NAV_OFFSET}px 0px -40% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* -----------------------------------------------------------------------
     14 · YEAR IN FOOTER
     Keep the copyright year current automatically.
     ----------------------------------------------------------------------- */

  const yearEl = document.querySelector(".current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------------------
     15 · ACCESSIBILITY — REDUCED MOTION
     Respect the user's prefers-reduced-motion setting by disabling
     parallax and transition-heavy reveals.
     ----------------------------------------------------------------------- */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const applyReducedMotion = () => {
    if (prefersReducedMotion.matches) {
      // Immediately reveal all elements
      document
        .querySelectorAll(".reveal, .reveal-left, .reveal-right")
        .forEach((el) => {
          el.classList.add("visible");
        });
      // Disable parallax
      if (heroBg) heroBg.style.transform = "none";
    }
  };

  applyReducedMotion();
  prefersReducedMotion.addEventListener("change", applyReducedMotion);

  /* -----------------------------------------------------------------------
     16 · PORTFOLIO FILTER
     Filter portfolio items by category using the pill buttons.
     ----------------------------------------------------------------------- */

  const filterPills = document.querySelectorAll(".filter-pill");
  const portfolioItems = document.querySelectorAll(
    ".portfolio-item[data-category]",
  );

  if (filterPills.length && portfolioItems.length) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        // Update active pill
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const filter = pill.dataset.filter;

        portfolioItems.forEach((item) => {
          if (filter === "all") {
            item.classList.remove("filtered-out");
          } else {
            const categories = item.dataset.category || "";
            if (categories.includes(filter)) {
              item.classList.remove("filtered-out");
            } else {
              item.classList.add("filtered-out");
            }
          }
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     17 · FAQ ACCORDION
     Toggle FAQ answers open/closed. Only one can be open at a time.
     ----------------------------------------------------------------------- */

  const faqQuestions = document.querySelectorAll(".faq-question");

  if (faqQuestions.length) {
    faqQuestions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        // Close all other FAQ items
        faqQuestions.forEach((otherBtn) => {
          otherBtn.setAttribute("aria-expanded", "false");
          otherBtn.nextElementSibling?.classList.remove("open");
        });

        // Toggle current item
        if (!isOpen) {
          btn.setAttribute("aria-expanded", "true");
          answer?.classList.add("open");
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     18 · INTERACTIVE MAP CITY SWITCHER
     When clicking on community/area tags, change the Google Maps iframe source.
     ----------------------------------------------------------------------- */

  const communityTags = document.querySelectorAll(".community-tag, .area-tag");
  const mapIframe = document.querySelector(".map-placeholder iframe");

  if (communityTags.length && mapIframe) {
    // Set first tag active by default if none are active
    let activeTag = Array.from(communityTags).find((tag) =>
      tag.classList.contains("active"),
    );
    if (!activeTag && communityTags.length > 0) {
      communityTags[0].classList.add("active");
    }

    communityTags.forEach((tag) => {
      // In contact.html, the tags are links. Prevent default action.
      tag.addEventListener("click", (e) => {
        if (tag.tagName.toLowerCase() === "a") {
          e.preventDefault();
        }

        // Update active class
        communityTags.forEach((t) => t.classList.remove("active"));
        tag.classList.add("active");

        // Extract neighborhood/city name and build the Google Maps embed URL
        const city = tag.textContent.trim();

        // Find parent city if on a city landing page (by looking at page headers)
        const pageHeader = document.querySelector("h1")?.textContent || "";
        let parentCity = "";
        const citiesList = [
          "Wellesley",
          "Weston",
          "Chestnut Hill",
          "Brookline",
          "Newton",
          "Sudbury",
          "Dover",
          "Lincoln",
          "Concord",
          "Lexington",
          "Needham",
          "Wayland",
          "Winchester",
        ];
        for (const c of citiesList) {
          if (pageHeader.includes(c)) {
            parentCity = c + ", ";
            break;
          }
        }

        const query = encodeURIComponent(`${city}, ${parentCity}MA`);

        // Use standard maps search URL which works without API Key and centers on the location
        const newSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

        // Set new src
        mapIframe.src = newSrc;
      });
    });
  }

  /* -----------------------------------------------------------------------
     END
     ----------------------------------------------------------------------- */
});
