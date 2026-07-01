/* ==========================================
   AMOLED PREMIUM PORTFOLIO CONTROLLER
   inspired by Vercel, Linear, and OpenAI
   ========================================== */

let lenisInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize modular controllers
  initThemeToggle();
  initActiveNavHighlight();
  initEmailCopyBtn();
  initProjectFilter();
  initLenis(prefersReducedMotion);
  initHeadlineReveal(prefersReducedMotion);
  initStatsCounter(prefersReducedMotion);
  initNetwork(prefersReducedMotion);
  initKeyboardShortcuts();
  initScrollTop();
  initMobileNav();
  initMagneticButtons(prefersReducedMotion);
});

/* ==========================================
   1. Theme Management (Light/Dark toggles)
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const sunIcon = toggleBtn.querySelector(".sun-icon");
  const moonIcon = toggleBtn.querySelector(".moon-icon");

  // Default to dark mode
  let theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  updateIcons(theme);

  toggleBtn.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateIcons(theme);
  });

  function updateIcons(currentTheme) {
    if (currentTheme === "dark") {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
  }
}

/* ==========================================
   2. Active Navigation Highlight
   ========================================== */
function initActiveNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section, header");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}


/* ==========================================
   4. Email Click-to-Copy Clipboard
   ========================================== */
function initEmailCopyBtn() {
  const emailBtn = document.getElementById("email-copy-btn");
  if (!emailBtn) return;

  emailBtn.addEventListener("click", () => {
    const email = emailBtn.getAttribute("data-email") || "lokile8499@gmail.com";
    
    // Attempt Clipboard API copy
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          const textSpan = emailBtn.querySelector(".btn-text");
          if (textSpan) {
            const originalText = textSpan.textContent;
            textSpan.textContent = "Copied Address! ✅";
            setTimeout(() => {
              textSpan.textContent = originalText;
            }, 2500);
          }
          showToast("Email copied to clipboard!");
        })
        .catch((err) => {
          console.error("Clipboard copy error:", err);
          showToast("Unable to copy email. Please copy it manually.");
        });
    } else {
      // Fallback copy method
      try {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        
        if (successful) {
          showToast("Email copied to clipboard!");
        } else {
          showToast("Unable to copy email. Please copy it manually.");
        }
      } catch (err) {
        console.error("Fallback copy error:", err);
        showToast("Unable to copy email. Please copy it manually.");
      }
    }
  });
}

function showToast(message) {
  const existingToast = document.querySelector(".custom-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

/* ==========================================
   5. Projects Filtering
   ========================================== */
function initProjectFilter() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".project-row");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      cards.forEach(card => {
        const categoriesAttr = card.getAttribute("data-categories") || "";
        const categories = categoriesAttr.split(",").map(c => c.trim().toLowerCase());
        
        const isMatch = filter === "all" || categories.includes(filter);

        if (isMatch) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.97)";
          setTimeout(() => {
            if (card.style.opacity === "0") {
              card.style.display = "none";
            }
          }, 250);
        }
      });
    });
  });
}

/* ==========================================
   6. Lenis Smooth Scroll Setup
   ========================================== */
function initLenis(reducedMotion) {
  if (reducedMotion || typeof Lenis === "undefined") return;

  lenisInstance = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureOrientation: "vertical",
    smoothWheel: true
  });

  lenisInstance.on("scroll", () => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.update();
    }
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.ticker.lagSmoothing(0);
  }

  // Bind custom glass nav clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        lenisInstance.scrollTo(target, { offset: -30 });
      }
    });
  });
}

/* ==========================================
   7. GSAP Headline Stagger Reveal
   ========================================== */
function initHeadlineReveal(reducedMotion) {
  const title = document.querySelector(".hero-title");
  if (!title || typeof gsap === "undefined") return;

  if (reducedMotion) {
    title.style.filter = "none";
    title.style.opacity = "1";
    title.style.transform = "none";
    return;
  }

  // Split text into words wrapped in overflow-hidden spans
  const text = title.textContent.trim();
  title.innerHTML = text.split(" ").map(word => 
    `<span class="split-word-wrapper" style="display:inline-block; overflow:hidden;">
       <span class="split-word" style="display:inline-block; transform:translateY(25px); opacity:0; filter:blur(6px);">${word}</span>
      </span>`
  ).join(" ");

  const tl = gsap.timeline({ delay: 0.1 });
  
  tl.to(".split-word", {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    duration: 0.85,
    ease: "power3.out",
    stagger: 0.07
  });

  // Stagger reveal other items
  const subtitle = document.querySelector(".hero-subtitle-container");
  const desc = document.querySelector(".hero-desc");
  const actions = document.querySelector(".hero-actions");
  const shortcutHint = document.querySelector(".hero-shortcuts-hint");
  const visualCol = document.querySelector(".hero-visual-col");

  if (subtitle) tl.from(subtitle, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.5");
  if (desc) tl.from(desc, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.45");
  if (actions) tl.from(actions, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.4");
  if (shortcutHint) tl.from(shortcutHint, { opacity: 0, y: 8, duration: 0.4, ease: "power2.out" }, "-=0.35");
  if (visualCol) tl.from(visualCol, { opacity: 0, scale: 0.97, duration: 0.7, ease: "power2.out" }, "-=0.6");

  // Scroll Trigger Section Reveals
  if (typeof ScrollTrigger !== "undefined") {
    gsap.utils.toArray(".reveal-on-scroll").forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out"
      });
    });
  }
}

/* ==========================================
   8. Stats Counter Up
   ========================================== */
function initStatsCounter(reducedMotion) {
  const statsSection = document.querySelector(".stats-grid");
  if (!statsSection || reducedMotion || typeof gsap === "undefined") return;

  const statNums = document.querySelectorAll(".stat-num");

  statNums.forEach(numEl => {
    const finalVal = parseFloat(numEl.textContent);
    const isDecimal = numEl.textContent.includes(".");
    const decimals = isDecimal ? numEl.textContent.split(".")[1].length : 0;
    
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: finalVal,
      scrollTrigger: {
        trigger: statsSection,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        numEl.textContent = obj.value.toFixed(decimals);
      }
    });
  });
}

/* ==========================================
   9. Interactive Neural Network Backdrop
   ========================================== */
function initNetwork(reducedMotion) {
  const canvas = document.getElementById("hero-network");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const isMobile = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // Node density settings
  const nodeCount = isMobile ? 22 : 48;
  const connectionDistance = 120;
  const nodes = [];

  let width = 0;
  let height = 0;
  let animationFrameId = null;

  // Mouse state variables
  let mouse = { x: null, y: null, radius: 140 };

  // Shockwave state variables
  let isMouseDown = false;
  let pulseCenter = { x: 0, y: 0 };
  let pulseRadius = 0;
  const maxPulseRadius = 800; // Cap to prevent infinite canvas sweep

  // Set dimensions
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (nodes.length === 0) {
      initNodes();
    }
  }

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Very slow random drift velocity
      this.vx = (Math.random() - 0.5) * 0.08;
      this.vy = (Math.random() - 0.5) * 0.08;
      this.radius = Math.random() * 1.5 + 0.8; // Small grid dots
      this.baseAlpha = Math.random() * 0.2 + 0.1;
      this.alpha = this.baseAlpha;
      this.activated = 0; // Shockwave propagation factor
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Boundaries wrap
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Node activation decay
      if (this.activated > 0) {
        this.activated -= 0.015;
        if (this.activated < 0) this.activated = 0;
      }

      // Cursor pull (desktop only)
      if (mouse.x !== null && !isMobile) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const pull = (mouse.radius - dist) / mouse.radius;
          // Draw node coordinates slightly towards cursor
          this.x += (dx / dist) * pull * 0.35;
          this.y += (dy / dist) * pull * 0.35;
          this.alpha = Math.min(0.7, this.baseAlpha + pull * 0.35);
        } else {
          // Return to base alpha
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // Blend activated amber color with base alpha
      const amberGlow = Math.min(0.85, this.alpha + this.activated * 0.5);
      ctx.fillStyle = this.activated > 0.05 
        ? `rgba(255, 138, 61, ${amberGlow})` 
        : `rgba(142, 154, 168, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initNodes() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    // Shockwave logic
    if (isMouseDown) {
      pulseRadius += 8.5; // Expand shockwave ring
      
      // Trigger activations as circle passes over nodes
      nodes.forEach(n => {
        const dx = n.x - pulseCenter.x;
        const dy = n.y - pulseCenter.y;
        const dist = Math.hypot(dx, dy);

        if (Math.abs(dist - pulseRadius) < 30) {
          n.activated = 1.0;
        }
      });

      // Render faint shockwave circle
      ctx.beginPath();
      ctx.arc(pulseCenter.x, pulseCenter.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 138, 61, ${Math.max(0, 0.12 - pulseRadius / maxPulseRadius)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (pulseRadius > maxPulseRadius) {
        isMouseDown = false;
      }
    }

    // Draw connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const baseOpacity = (1 - dist / connectionDistance) * 0.08;

          // Cursor hover glowing
          let cursorGlow = 0;
          if (mouse.x !== null && !isMobile) {
            const d1 = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
            const d2 = Math.hypot(nodes[j].x - mouse.x, nodes[j].y - mouse.y);
            if (d1 < mouse.radius || d2 < mouse.radius) {
              const pull1 = d1 < mouse.radius ? (mouse.radius - d1) / mouse.radius : 0;
              const pull2 = d2 < mouse.radius ? (mouse.radius - d2) / mouse.radius : 0;
              cursorGlow = Math.max(pull1, pull2) * 0.35;
            }
          }

          // Shockwave glowing
          const shockGlow = Math.max(nodes[i].activated, nodes[j].activated) * 0.55;

          const finalOpacity = Math.min(0.7, baseOpacity + cursorGlow + shockGlow);
          
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          // Draw active channels in amber, and idle lines in slate-gray
          if (shockGlow > 0.05 || cursorGlow > 0.05) {
            ctx.strokeStyle = `rgba(255, 138, 61, ${finalOpacity})`;
            ctx.lineWidth = shockGlow > 0.05 ? 1.0 : 0.7;
          } else {
            ctx.strokeStyle = `rgba(142, 154, 168, ${finalOpacity})`;
            ctx.lineWidth = 0.5;
          }
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Setup interaction listeners
  const hero = document.getElementById("hero");
  
  // Desktop movement
  if (!isMobile) {
    hero.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Click and Hold trigger
    hero.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      pulseCenter.x = e.clientX - rect.left;
      pulseCenter.y = e.clientY - rect.top;
      pulseRadius = 0;
      isMouseDown = true;
    });

    window.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
  } else {
    // Mobile Touch Tap trigger
    hero.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        pulseCenter.x = e.touches[0].clientX - rect.left;
        pulseCenter.y = e.touches[0].clientY - rect.top;
        pulseRadius = 0;
        isMouseDown = true;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isMouseDown = false;
    }, { passive: true });
  }

  // Viewport IntersectionObserver culling to freeze loop when scrolled
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationFrameId && !reducedMotion) {
          animate();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0 });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  if (reducedMotion) {
    animate();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  } else {
    observer.observe(hero);
  }
}

/* ==========================================
   10. Keyboard Shortcuts Catch (Cmd/Ctrl + K)
   ========================================== */
function initKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    // Detect Cmd + K (Mac) or Ctrl + K (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(projectsSection, { offset: -30 });
        } else {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  });
}

/* ==========================================
   11. Scroll Back to Top Button
   ========================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById("btn-scroll-top");
  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener("click", () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* ==========================================
   12. Mobile Nav Burger Toggles
   ========================================== */
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!toggle || !navLinks) return;

  const hamIcon = toggle.querySelector(".icon-hamburger");
  const closeIcon = toggle.querySelector(".icon-close");

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-active");
    if (isOpen) {
      hamIcon.style.display = "none";
      closeIcon.style.display = "block";
    } else {
      hamIcon.style.display = "block";
      closeIcon.style.display = "none";
    }
  });

  // Close when clicking links
  navLinks.querySelectorAll("a").forEach(l => {
    l.addEventListener("click", () => {
      navLinks.classList.remove("mobile-active");
      hamIcon.style.display = "block";
      closeIcon.style.display = "none";
    });
  });
}

/* ==========================================
   13. Magnetic Buttons CTA Pull
   ========================================== */
function initMagneticButtons(reducedMotion) {
  if (reducedMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const buttons = document.querySelectorAll(".btn-primary, .btn-secondary, .btn-nav-resume, .email-btn-large, .social-icon-link");
  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const dx = e.clientX - btnX;
      const dy = e.clientY - btnY;

      // Limit magnetic movement to max 6-8px pull
      const pullX = (dx / (rect.width / 2)) * 6;
      const pullY = (dy / (rect.height / 2)) * 6;

      btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
      btn.style.transition = "transform 80ms ease-out";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
      btn.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
    });
  });
}

