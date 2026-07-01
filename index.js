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
  initSubtitleRotation(prefersReducedMotion);
  initStatsCounter(prefersReducedMotion);
  initNetwork(prefersReducedMotion);
  initCodeTypewriter(prefersReducedMotion);
  initKeyboardShortcuts();
  initScrollTop();
  initMobileNav();
  initMagneticButtons(prefersReducedMotion);
  initContactEmailLinks();

  // Bind custom glass nav clicks globally (with fallback smooth scrolling)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -80 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top,
            behavior: prefersReducedMotion ? "auto" : "smooth"
          });
        }
      }
    });
  });
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
function copyTextToClipboard(text, onSuccess, onFailure) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch((err) => {
        console.warn("[LokiDev IDE] Clipboard API failed, trying fallback...", err);
        fallback(text);
      });
  } else {
    fallback(text);
  }

  function fallback(val) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = val;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        onSuccess();
      } else {
        if (onFailure) onFailure();
      }
    } catch (err) {
      console.error("[LokiDev IDE] Fallback copy error:", err);
      if (onFailure) onFailure();
    }
  }
}

function initEmailCopyBtn() {
  const emailBtn = document.getElementById("email-copy-btn");
  if (!emailBtn) return;

  emailBtn.addEventListener("click", () => {
    const email = emailBtn.getAttribute("data-email") || "lokile8499@gmail.com";
    copyTextToClipboard(email, () => {
      const textSpan = emailBtn.querySelector(".btn-text");
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.textContent = "Copied Address! ✅";
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 2500);
      }
      showToast("Email copied to clipboard!");
    }, () => {
      showToast("Unable to copy email. Please copy it manually.");
    });
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

  const tl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      // Dispatches the complete event to start subtitle typing sequence
      window.dispatchEvent(new Event("hero-reveal-complete"));
    }
  });

  // Smooth, premium, Apple/Vercel-style slide-up and fade reveal of the entire title
  tl.fromTo(title,
    {
      y: 20,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: "power3.out"
    }
  );

  // Stagger reveal other items
  const subtitle = document.querySelector(".hero-subtitle-container");
  const desc = document.querySelector(".hero-desc");
  const actions = document.querySelector(".hero-actions");
  const shortcutHint = document.querySelector(".hero-shortcuts-hint");
  const visualCol = document.querySelector(".hero-visual-col");

  if (subtitle) tl.from(subtitle, { opacity: 0, y: 12, duration: 0.45, ease: "power2.out" }, "-=0.65");
  if (desc) tl.from(desc, { opacity: 0, y: 12, duration: 0.45, ease: "power2.out" }, "-=0.6");
  if (actions) tl.from(actions, { opacity: 0, y: 12, duration: 0.45, ease: "power2.out" }, "-=0.55");
  if (shortcutHint) tl.from(shortcutHint, { opacity: 0, y: 8, duration: 0.45, ease: "power2.out" }, "-=0.5");
  if (visualCol) tl.from(visualCol, { opacity: 0, scale: 0.98, duration: 0.75, ease: "power2.out" }, "-=0.75");

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
   7.5. Subtitle Role Rotation Loop
   ========================================== */
function initSubtitleRotation(reducedMotion) {
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  const roles = [
    "Software Engineer",
    "AI Engineer"
  ];

  if (reducedMotion) {
    subtitle.textContent = roles.join(" · ");
    return;
  }

  let currentRoleIdx = 0;
  let isTyping = false;

  // Append a blinking terminal cursor to the subtitle container
  const container = document.querySelector(".hero-subtitle-container");
  if (container) {
    let cursor = container.querySelector(".hero-subtitle-cursor");
    if (!cursor) {
      cursor = document.createElement("span");
      cursor.className = "hero-subtitle-cursor";
      cursor.textContent = "|";
      cursor.style.display = "inline-block";
      cursor.style.marginLeft = "4px";
      cursor.style.color = "var(--accent)";
      cursor.style.fontWeight = "600";
      cursor.style.animation = "cursor-blink 0.85s step-end infinite";
      
      // Inject keyframes stylesheet if not already created
      if (!document.getElementById("cursor-blink-style")) {
        const style = document.createElement("style");
        style.id = "cursor-blink-style";
        style.textContent = `
          @keyframes cursor-blink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      container.appendChild(cursor);
    }
  }

  function typeWriterEffect(newText, callback) {
    let currentText = subtitle.textContent;
    let i = currentText.length;

    // Erase the old text character by character
    function erase() {
      if (i > 0) {
        subtitle.textContent = currentText.substring(0, i - 1);
        i--;
        setTimeout(erase, 35 + Math.random() * 25); // Slightly slower, premium erasing
      } else {
        // Type the new text character by character
        let j = 0;
        function type() {
          if (j < newText.length) {
            subtitle.textContent = newText.substring(0, j + 1);
            j++;
            setTimeout(type, 80 + Math.random() * 60); // Slower, premium typing cadence
          } else {
            isTyping = false;
            if (callback) callback();
          }
        }
        setTimeout(type, 350); // Pause before starting to type the new role
      }
    }
    erase();
  }

  function rotateSubtitle() {
    if (isTyping) return;
    isTyping = true;
    currentRoleIdx = (currentRoleIdx + 1) % roles.length;
    const nextRole = roles[currentRoleIdx];

    typeWriterEffect(nextRole, () => {
      // Hold the role for 4 seconds before rotating to the next one
      setTimeout(rotateSubtitle, 4000);
    });
  }

  // Start the typing cycle after the name reveal animation is fully complete
  window.addEventListener("hero-reveal-complete", () => {
    // Show the first role for 3.5 seconds before starting the first deletion
    setTimeout(rotateSubtitle, 3500);
  });
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

  // Optimized node counts (26 on mobile, 72 on desktop) to maintain high-density premium constellation
  const nodeCount = isMobile ? 26 : 72;
  const connectionDistance = 140;
  const connectionDistanceSq = connectionDistance * connectionDistance;
  const nodes = [];
  const pulses = []; // Data packets traveling along connecting lines

  let width = 0;
  let height = 0;
  let animationFrameId = null;

  // Mouse state variables
  let mouse = { x: null, y: null, radius: 150 };
  const mouseRadiusSq = mouse.radius * mouse.radius;

  // Shockwave state variables
  let isMouseDown = false;
  let pulseCenter = { x: 0, y: 0 };
  let pulseRadius = 0;
  const maxPulseRadius = 800;

  // Set dimensions
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    initNodes();
  }

  class Node {
    constructor() {
      // Depth parameter (0.5 = background, 2.5 = foreground)
      this.z = Math.random() * 2 + 0.5;
      
      // Calculate target distribution: bias 60% of particles near the hero text area (left side, middle-vertical)
      const biasToHero = Math.random() < 0.6;
      if (biasToHero) {
        this.homeX = Math.random() * width * 0.45; // Left-aligned
        this.homeY = height * 0.25 + Math.random() * height * 0.5; // Centered vertically
      } else {
        this.homeX = Math.random() * width;
        this.homeY = Math.random() * height;
      }
      
      this.x = this.homeX;
      this.y = this.homeY;

      // Parallax-scaled drift velocities
      const baseVel = 0.05 * (this.z / 2.5);
      this.vx = (Math.random() - 0.5) * baseVel;
      this.vy = (Math.random() - 0.5) * baseVel;

      // Organic drift breathing parameters
      this.phase = Math.random() * Math.PI * 2;
      this.breathingSpeed = 0.0005 + Math.random() * 0.001;

      // Depth-scaled properties (background nodes are drawn smaller and fainter to simulate blur organically)
      this.radius = (this.z / 2.5) * 1.6 + 0.5; 
      this.baseAlpha = (this.z / 2.5) * 0.4 + 0.15;
      this.alpha = this.baseAlpha;
      this.activated = 0;

      // Luxury tech color mix: Warm amber (70%), Gold (20%), Silver/White (10%)
      const colorRand = Math.random();
      if (colorRand < 0.1) {
        this.colorType = "primary"; // Silver/White in Dark, Slate in Light
      } else if (colorRand < 0.3) {
        this.colorType = "secondary"; // Gold in Dark, Sky Blue in Light
      } else {
        this.colorType = "accent"; // Amber in Dark, Warm Amber in Light
      }
    }

    getColorString() {
      const theme = document.documentElement.getAttribute("data-theme") || "dark";
      if (theme === "light") {
        if (this.colorType === "primary") return "100, 116, 139"; // Slate gray
        if (this.colorType === "secondary") return "14, 165, 233"; // Sky Blue
        return "217, 119, 6"; // Rich amber
      } else {
        if (this.colorType === "primary") return "255, 255, 255"; // Silver/White
        if (this.colorType === "secondary") return "251, 191, 36"; // Gold
        return "255, 138, 61"; // Amber
      }
    }

    update(time) {
      // 1. Gentle organic breathing (drifting)
      this.vx += Math.sin(time * this.breathingSpeed + this.phase) * 0.001;
      this.vy += Math.cos(time * this.breathingSpeed + this.phase) * 0.001;

      // 2. Faint gravity pull towards the hero section to maintain density gradient
      const targetX = isMobile ? width * 0.5 : width * 0.3;
      const targetY = isMobile ? height * 0.4 : height * 0.5;
      const gx = (targetX - this.homeX) * 0.000003 * (this.z / 2.5);
      const gy = (targetY - this.homeY) * 0.000003 * (this.z / 2.5);
      this.vx += gx;
      this.vy += gy;

      // Cap speed to maintain slow organic movement
      const speed = Math.hypot(this.vx, this.vy);
      const maxSpeed = 0.18 * (this.z / 2.5);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }

      // Update home coordinates
      this.homeX += this.vx;
      this.homeY += this.vy;

      // Boundaries wrap
      if (this.homeX < 0) this.homeX = width;
      if (this.homeX > width) this.homeX = 0;
      if (this.homeY < 0) this.homeY = height;
      if (this.homeY > height) this.homeY = 0;

      // 3. Elastic mouse attraction: Nodes pull towards mouse, relax back to home coordinates
      if (mouse.x !== null && !isMobile) {
        const dx = mouse.x - this.homeX;
        const dy = mouse.y - this.homeY;
        const distSq = dx * dx + dy * dy;

        // Performant distance check using distance-squared comparisons (avoids Math.sqrt unless inside range)
        if (distSq < mouseRadiusSq) {
          const dist = Math.sqrt(distSq);
          const pull = (mouse.radius - dist) / mouse.radius;
          const targetX = this.homeX + (mouse.x - this.homeX) * pull * 0.28;
          const targetY = this.homeY + (mouse.y - this.homeY) * pull * 0.28;
          
          this.x += (targetX - this.x) * 0.1;
          this.y += (targetY - this.y) * 0.1;
          this.alpha = Math.min(0.85, this.baseAlpha + pull * 0.25);
        } else {
          // Relax back to home coordinate
          this.x += (this.homeX - this.x) * 0.08;
          this.y += (this.homeY - this.y) * 0.08;
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }
      } else {
        // No interaction: Sync positions directly
        this.x += (this.homeX - this.x) * 0.1;
        this.y += (this.homeY - this.y) * 0.1;
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      // Node activation decay (for shockwaves)
      if (this.activated > 0) {
        this.activated -= 0.015;
        if (this.activated < 0) this.activated = 0;
      }
    }

    draw() {
      const colorStr = this.getColorString();
      // Subtle premium glowing halo for foreground nodes to make them feel luminous
      if (this.z > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorStr}, ${this.alpha * 0.18})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.activated > 0.05) {
        ctx.fillStyle = `rgba(${colorStr}, ${Math.min(0.95, this.alpha + this.activated * 0.6)})`;
      } else {
        ctx.fillStyle = `rgba(${colorStr}, ${this.alpha})`;
      }
      ctx.fill();
    }
  }

  function initNodes() {
    nodes.length = 0;
    pulses.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  function animate(timestamp) {
    const time = timestamp || 0;
    ctx.clearRect(0, 0, width, height);

    // Update nodes
    nodes.forEach(n => n.update(time));

    // Draw all particles (simplified rendering loop, no slow filters)
    nodes.forEach(n => n.draw());

    // Shockwave expansion logic
    if (isMouseDown) {
      pulseRadius += 8.5;
      
      const minR = pulseRadius - 30;
      const maxR = pulseRadius + 30;
      const minRSq = minR * minR;
      const maxRSq = maxR * maxR;

      nodes.forEach(n => {
        const dx = n.x - pulseCenter.x;
        const dy = n.y - pulseCenter.y;
        const distSq = dx * dx + dy * dy;

        // Performant squared distance test (no square root calls for out-of-range elements)
        if (distSq > minRSq && distSq < maxRSq) {
          const dist = Math.sqrt(distSq);
          if (Math.abs(dist - pulseRadius) < 30) {
            n.activated = 1.0;
          }
        }
      });

      const theme = document.documentElement.getAttribute("data-theme") || "dark";
      const glowColor = theme === "light" ? "217, 119, 6" : "255, 138, 61";
      ctx.beginPath();
      ctx.arc(pulseCenter.x, pulseCenter.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${glowColor}, ${Math.max(0, 0.12 - pulseRadius / maxPulseRadius)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (pulseRadius > maxPulseRadius) {
        isMouseDown = false;
      }
    }

    // Draw connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Only connect nodes that are close in depth/z-index to make it look layered
        if (Math.abs(nodes[i].z - nodes[j].z) > 0.8) continue;

        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy;

        // Optimize distance evaluation: avoid Math.sqrt completely for distant nodes
        if (distSq < connectionDistanceSq) {
          const dist = Math.sqrt(distSq);
          const avgZ = (nodes[i].z + nodes[j].z) / 2;
          const depthFactor = avgZ / 2.5; 
          const baseOpacity = (1 - dist / connectionDistance) * 0.22 * depthFactor;

          // Mouse proximity glowing lines
          let cursorGlow = 0;
          if (mouse.x !== null && !isMobile) {
            const d1Sq = (nodes[i].x - mouse.x) * (nodes[i].x - mouse.x) + (nodes[i].y - mouse.y) * (nodes[i].y - mouse.y);
            const d2Sq = (nodes[j].x - mouse.x) * (nodes[j].x - mouse.x) + (nodes[j].y - mouse.y) * (nodes[j].y - mouse.y);
            
            if (d1Sq < mouseRadiusSq || d2Sq < mouseRadiusSq) {
              const d1 = Math.sqrt(d1Sq);
              const d2 = Math.sqrt(d2Sq);
              const pull1 = d1 < mouse.radius ? (mouse.radius - d1) / mouse.radius : 0;
              const pull2 = d2 < mouse.radius ? (mouse.radius - d2) / mouse.radius : 0;
              cursorGlow = Math.max(pull1, pull2) * 0.28;
            }
          }

          const shockGlow = Math.max(nodes[i].activated, nodes[j].activated) * 0.55;
          const finalOpacity = Math.min(0.65, baseOpacity + cursorGlow + shockGlow);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          // Draw active channels in glowing amber, and idle lines in subtle gray-amber blend
          const theme = document.documentElement.getAttribute("data-theme") || "dark";
          if (theme === "light") {
            if (shockGlow > 0.05 || cursorGlow > 0.05) {
              ctx.strokeStyle = `rgba(217, 119, 6, ${finalOpacity * 0.95})`; // Contrast-enhanced amber
              ctx.lineWidth = shockGlow > 0.05 ? 1.0 : 0.75;
            } else {
              ctx.strokeStyle = `rgba(148, 163, 184, ${finalOpacity * 0.5})`; // Soft slate link lines
              ctx.lineWidth = 0.45;
            }
          } else {
            if (shockGlow > 0.05 || cursorGlow > 0.05) {
              ctx.strokeStyle = `rgba(255, 138, 61, ${finalOpacity})`;
              ctx.lineWidth = shockGlow > 0.05 ? 1.0 : 0.75;
            } else {
              ctx.strokeStyle = `rgba(180, 160, 145, ${finalOpacity * 0.8})`;
              ctx.lineWidth = 0.45;
            }
          }
          ctx.stroke();
        }
      }
    }

    // Update and Draw Energy Pulses (Data Packets)
    // Occasionally spawn new energy pulses
    if (Math.random() < 0.03 && pulses.length < 8) {
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      // Find valid neighbors using squared distance comparison
      const neighbors = nodes.filter(n => {
        if (n === startNode) return false;
        const dx = n.x - startNode.x;
        const dy = n.y - startNode.y;
        return (dx * dx + dy * dy) < connectionDistanceSq;
      });
      
      if (neighbors.length > 0) {
        const targetNode = neighbors[Math.floor(Math.random() * neighbors.length)];
        pulses.push({
          from: startNode,
          to: targetNode,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012
        });
      }
    }

    // Render active pulses
    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k];
      p.progress += p.speed;

      if (p.progress >= 1) {
        // 60% chance to propagate to next node
        if (Math.random() < 0.6) {
          const nextNode = p.to;
          const neighbors = nodes.filter(n => {
            if (n === p.from || n === nextNode) return false;
            const dx = n.x - nextNode.x;
            const dy = n.y - nextNode.y;
            return (dx * dx + dy * dy) < connectionDistanceSq;
          });
          
          if (neighbors.length > 0) {
            p.from = nextNode;
            p.to = neighbors[Math.floor(Math.random() * neighbors.length)];
            p.progress = 0;
            p.speed = 0.008 + Math.random() * 0.012;
            continue;
          }
        }
        pulses.splice(k, 1);
        continue;
      }

      const x = p.from.x + (p.to.x - p.from.x) * p.progress;
      const y = p.from.y + (p.to.y - p.from.y) * p.progress;

      const pulseColor = p.from.getColorString();
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pulseColor}, 0.9)`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Setup interaction listeners - globally bound for whole-site cursor reaction
  
  // Desktop movement
  if (!isMobile) {
    let idleTimeout = null;
    window.addEventListener("mousemove", (e) => {
      // The canvas is fixed, so mouse coordinates match client coordinates 1-to-1
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        mouse.x = null;
        mouse.y = null;
      }, 400);
    });

    window.addEventListener("mouseleave", () => {
      clearTimeout(idleTimeout);
      mouse.x = null;
      mouse.y = null;
    });

    // Click and Hold trigger
    window.addEventListener("mousedown", (e) => {
      pulseCenter.x = e.clientX;
      pulseCenter.y = e.clientY;
      pulseRadius = 0;
      isMouseDown = true;
    });

    window.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
  } else {
    // Mobile Touch Tap trigger
    window.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        pulseCenter.x = e.touches[0].clientX;
        pulseCenter.y = e.touches[0].clientY;
        pulseRadius = 0;
        isMouseDown = true;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isMouseDown = false;
    }, { passive: true });
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("load", resizeCanvas);
  window.addEventListener("hero-reveal-complete", resizeCanvas);
  resizeCanvas();

  if (reducedMotion) {
    animate();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  } else {
    animate();
  }

  // Freeze animation loop entirely when browser tab is inactive to preserve CPU
  function handleVisibilityChange() {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!animationFrameId && !reducedMotion) {
        animate();
      }
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);
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
          lenisInstance.scrollTo(projectsSection, { offset: -80 });
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

function initCodeTypewriter(reducedMotion) {
  const codeContainer = document.getElementById("ide-code-container");
  const filenameEl = document.getElementById("ide-filename");
  const activeTabEl = document.getElementById("ide-active-tab");
  if (!codeContainer || !filenameEl || !activeTabEl) return;

  const snippets = [
    {
      filename: "pipeline.py",
      tokens: [
        { text: "import", type: "keyword" },
        { text: " gemini, scraper\n\n" },
        { text: "class", type: "keyword" },
        { text: " " },
        { text: "IndustryIntelligencePipeline", type: "type" },
        { text: ":\n    " },
        { text: "def", type: "keyword" },
        { text: " " },
        { text: "__init__", type: "func" },
        { text: "(self):\n        self.llm = gemini.GenerativeModel(" },
        { text: '"gemini-1.5-flash"', type: "string" },
        { text: ")\n        self.sources = [" },
        { text: '"news_api"', type: "string" },
        { text: ", " },
        { text: '"twitter"', type: "string" },
        { text: "]\n\n    " },
        { text: "async def", type: "keyword" },
        { text: " " },
        { text: "process_market_intel", type: "func" },
        { text: "(self, topic):\n        " },
        { text: "# Extract intelligence telemetry", type: "comment" },
        { text: "\n        raw_data = " },
        { text: "await", type: "keyword" },
        { text: " scraper.fetch_feeds(topic)\n        analysis = self.llm.analyze(raw_data)\n        " },
        { text: "return", type: "keyword" },
        { text: " {\n            " },
        { text: '"topic"', type: "string" },
        { text: ": topic, " },
        { text: '"sentiment"', type: "string" },
        { text: ": analysis.sentiment\n        }" }
      ]
    },
    {
      filename: "vault.ts",
      tokens: [
        { text: "import", type: "keyword" },
        { text: " crypto " },
        { text: "from", type: "keyword" },
        { text: " " },
        { text: '"crypto"', type: "string" },
        { text: ";\n\n" },
        { text: "export class", type: "keyword" },
        { text: " " },
        { text: "LokiVault", type: "type" },
        { text: " {\n  " },
        { text: "encrypt", type: "func" },
        { text: "(plaintext: string, secretKey: Buffer) {\n    " },
        { text: "const", type: "keyword" },
        { text: " iv = crypto.randomBytes(16);\n    " },
        { text: "const", type: "keyword" },
        { text: " cipher = crypto.createCipheriv(" },
        { text: '"aes-256-gcm"', type: "string" },
        { text: ", secretKey, iv);\n    " },
        { text: "const", type: "keyword" },
        { text: " encrypted = Buffer.concat([\n      cipher.update(plaintext, " },
        { text: '"utf8"', type: "string" },
        { text: "),\n      cipher.final()\n    ]);\n    " },
        { text: "return", type: "keyword" },
        { text: " {\n      iv: iv.toString(" },
        { text: '"hex"', type: "string" },
        { text: "),\n      content: encrypted.toString(" },
        { text: '"hex"', type: "string" },
        { text: "),\n      tag: cipher.getAuthTag().toString(" },
        { text: '"hex"', type: "string" },
        { text: ")\n    };\n  }\n}" }
      ]
    },
    {
      filename: "autofill.js",
      tokens: [
        { text: "async function", type: "keyword" },
        { text: " " },
        { text: "autofillFormFields", type: "func" },
        { text: "(tabId, profileData) {\n  " },
        { text: "const", type: "keyword" },
        { text: " fields = " },
        { text: "await", type: "keyword" },
        { text: " queryFormInputs(tabId);\n  \n  " },
        { text: "for", type: "keyword" },
        { text: " (" },
        { text: "const", type: "keyword" },
        { text: " field " },
        { text: "of", type: "keyword" },
        { text: " fields) {\n    " },
        { text: "const", type: "keyword" },
        { text: " match = " },
        { text: "await", type: "keyword" },
        { text: " matchFieldWithAI(field, profileData);\n    " },
        { text: "if", type: "keyword" },
        { text: " (match) {\n      " },
        { text: "await", type: "keyword" },
        { text: " chrome.scripting.executeScript({\n        target: { tabId },\n        func: (id, val) => { document.getElementById(id).value = val; },\n        args: [field.id, match.value]\n      });\n    }\n  }\n}" }
      ]
    }
  ];

  // Helper to compile tokens to flat character structures
  snippets.forEach(snip => {
    snip.chars = [];
    snip.tokens.forEach(tok => {
      for (let i = 0; i < tok.text.length; i++) {
        snip.chars.push({ char: tok.text[i], type: tok.type });
      }
    });
  });

  // Respect reduced motion request
  if (reducedMotion) {
    renderSnippet(snippets[0], snippets[0].chars.length);
    return;
  }

  let activeIndex = 0;
  let charIndex = 0;
  let isErasing = false;
  let typingTimeout = null;
  let isHeroVisible = true;

  function renderSnippet(snip, n) {
    filenameEl.textContent = `${snip.filename} — LokiDev IDE`;
    activeTabEl.querySelector("span").textContent = snip.filename;

    let html = "";
    let currentType = null;
    for (let i = 0; i < n; i++) {
      const c = snip.chars[i];
      if (c.type !== currentType) {
        if (currentType) html += "</span>";
        if (c.type) html += `<span class="code-${c.type}">`;
        currentType = c.type;
      }
      if (c.char === "<") html += "&lt;";
      else if (c.char === ">") html += "&gt;";
      else if (c.char === "&") html += "&amp;";
      else html += c.char;
    }
    if (currentType) html += "</span>";

    // Append cursor
    html += '<span class="typing-cursor">|</span>';
    codeContainer.innerHTML = html;
  }

  function loop() {
    if (!isHeroVisible) {
      typingTimeout = setTimeout(loop, 200);
      return;
    }

    const currentSnippet = snippets[activeIndex];

    if (!isErasing) {
      if (charIndex < currentSnippet.chars.length) {
        charIndex++;
        renderSnippet(currentSnippet, charIndex);
        const speed = 15 + Math.random() * 15;
        typingTimeout = setTimeout(loop, speed);
      } else {
        isErasing = true;
        typingTimeout = setTimeout(loop, 2500); // Pause for 2.5s
      }
    } else {
      if (charIndex > 0) {
        charIndex--;
        renderSnippet(currentSnippet, charIndex);
        typingTimeout = setTimeout(loop, 5); // Fast backspace
      } else {
        isErasing = false;
        activeIndex = (activeIndex + 1) % snippets.length;
        typingTimeout = setTimeout(loop, 400); // Pause before typing next file
      }
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );

  const heroSection = document.getElementById("hero");
  if (heroSection) {
    observer.observe(heroSection);
  }

  loop();
}

/* ==========================================
   14. Programmatic Mailto Link Fallbacks
   ========================================== */
function initContactEmailLinks() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  console.log("[LokiDev IDE] initContactEmailLinks: bound to", emailLinks.length, "elements");

  emailLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      console.log("[LokiDev IDE] mailto click detected on:", this);
      e.preventDefault();
      
      const mailto = this.getAttribute("href");
      console.log("[LokiDev IDE] mailto target URL:", mailto);
      
      if (mailto) {
        // 1. Programmatic Mailto trigger
        try {
          window.location.href = mailto;
          console.log("[LokiDev IDE] programmatic mailto navigation requested via window.location.href");
        } catch (err) {
          console.error("[LokiDev IDE] programmatic mailto navigation failed:", err);
        }

        // 2. Clipboard copy fallback (critical for sandboxed previews)
        const email = mailto.replace("mailto:", "");
        copyTextToClipboard(email, () => {
          showToast("Email copied! (Opening mail client...)");
          console.log("[LokiDev IDE] Email copied to clipboard successfully as fallback.");
        }, () => {
          showToast("Opening email client...");
        });
      }
    });
  });
}

