/**
 * Lokesh Alasandi Portfolio - JS Engine
 * Handles boot sequence, scroll animations, typewriter, theme toggle, mobile menu, and form submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize all modules
  initTheme();
  initMobileMenu();
  initBootSequence(prefersReducedMotion);
  initScrollProgressBar();
  initScrollReveal(prefersReducedMotion);
  initActiveNavHighlight();
  initTypewriter(prefersReducedMotion);
  initContactForm();
  initEmailCopyBtn();
  initProjectFilter();
  initGithubHeatmap();
});

/* ==========================================
   1. Theme Switching Logic
   ========================================== */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");
  const html = document.documentElement;

  // Retrieve theme preference from storage or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    if (theme === "dark") {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
  }
}

/* ==========================================
   2. Mobile Navigation Toggle
   ========================================== */
function initMobileMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const iconHamburger = navToggle.querySelector(".icon-hamburger");
  const iconClose = navToggle.querySelector(".icon-close");
  const linkItems = navLinks.querySelectorAll(".nav-link");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-open");
    
    if (isOpen) {
      iconHamburger.style.display = "none";
      iconClose.style.display = "block";
    } else {
      iconHamburger.style.display = "block";
      iconClose.style.display = "none";
    }
  });

  // Close menu when clicking nav link
  linkItems.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      iconHamburger.style.display = "block";
      iconClose.style.display = "none";
    });
  });
}

/* ==========================================
   3. Cinematic Hero Boot Sequence
   ========================================== */
function initBootSequence(reducedMotion) {
  const bootOverlay = document.getElementById("boot-terminal-overlay");
  const heroContent = document.getElementById("hero-content");

  const bootLines = [
    { id: "line-1", text: "LOKI_OS v1.0.8 INIT..." },
    { id: "line-2", text: "SYSTEM: STAGE_1_HARDWARE_CHECK... OK (ECE B.E.)" },
    { id: "line-3", text: "SYSTEM: STAGE_2_AI_CORES_MOUNT... OK (INFOSYS SPRINGBOARD)" },
    { id: "line-4", text: "SYSTEM: STAGE_3_ESTABLISHING_LINK... OK (HYDERABAD_IN)" },
    { id: "line-5", text: "[BOOT_COMPLETE]: RESOLVING PROFILE_ID..." }
  ];

  if (reducedMotion) {
    // If reduced motion, skip visual print delays
    bootOverlay.style.display = "none";
    heroContent.classList.remove("hidden");
    return;
  }

  // Type line character by character
  function typeTerminalLine(lineIndex) {
    if (lineIndex >= bootLines.length) {
      // Completed boot sequence, trigger resolve
      setTimeout(() => {
        bootOverlay.classList.add("fade-out");
        setTimeout(() => {
          bootOverlay.style.display = "none";
          heroContent.classList.remove("hidden");
        }, 400);
      }, 300);
      return;
    }

    const item = bootLines[lineIndex];
    const el = document.getElementById(item.id);
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (charIndex < item.text.length) {
        el.textContent += item.text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(interval);
        // Stagger next line launch
        setTimeout(() => {
          typeTerminalLine(lineIndex + 1);
        }, 150);
      }
    }, 15); // Fast typing speed
  }

  // Start sequence
  typeTerminalLine(0);
}

/* ==========================================
   4. Scroll Progress Bar
   ========================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    const windowScroll = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (documentHeight > 0) {
      const scrollPercent = (windowScroll / documentHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  });
}

/* ==========================================
   5. IntersectionObserver Scroll Reveal
   ========================================== */
function initScrollReveal(reducedMotion) {
  if (reducedMotion) {
    document.querySelectorAll(".reveal-on-scroll").forEach(el => {
      el.classList.add("active");
    });
    return;
  }

  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================
   6. Active Nav Highlight
   ========================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px", // Focus viewport middle area
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        navLinks.forEach(link => {
          const sectionRef = link.getAttribute("data-section");
          if (sectionRef === id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/* ==========================================
   7. Typewriter Subtitle
   ========================================== */
function initTypewriter(reducedMotion) {
  const textEl = document.getElementById("typewriter-text");
  const roles = [
    "AI / Software Engineering Intern",
    "ECE B.E. Student (9.2 CGPA)",
    "C++ & Python Developer"
  ];

  if (reducedMotion) {
    textEl.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = roles[0].length; // Starts with first item already printed in HTML
  let isDeleting = false;
  let typingSpeed = 100;

  function runTypewriterCycle() {
    const currentFullText = roles[roleIndex];

    if (isDeleting) {
      textEl.textContent = currentFullText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // Deletes faster
    } else {
      textEl.textContent = currentFullText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // Standard typing speed
    }

    // Checking boundaries
    if (!isDeleting && charIndex === currentFullText.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of line
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing new word
    }

    setTimeout(runTypewriterCycle, typingSpeed);
  }

  // Start typewriter loops with a delay after boot
  setTimeout(runTypewriterCycle, 2000);
}

/* ==========================================
   8. Contact Form Handling
   ========================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = form.querySelector(".btn-submit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Visual loading state
    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Transmitting...";
    statusEl.className = "form-status";
    statusEl.textContent = "[PENDING]: CONNECTING TO TRANSMISSION GATEWAY...";

    // Simulate sending message over network (1.2s delay)
    setTimeout(() => {
      // Clear inputs
      form.reset();
      
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Send Message";
      
      statusEl.className = "form-status success";
      statusEl.textContent = "[SUCCESS]: TRANSMISSION ESTABLISHED. LOKESH WILL RESPOND SHORTLY.";
      
      // Clear status after 5s
      setTimeout(() => {
        statusEl.textContent = "";
      }, 5000);
    }, 1500);
  });
}

/* ==========================================
   9. Email Copy Button
   ========================================== */
function initEmailCopyBtn() {
  const emailBtn = document.getElementById("email-copy-btn");
  if (!emailBtn) return;

  emailBtn.addEventListener("click", () => {
    const email = emailBtn.getAttribute("data-email") || "lokile8499@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const btnText = emailBtn.querySelector(".btn-text");
      const originalText = btnText.textContent;
      
      btnText.textContent = "✓ Copied!";
      emailBtn.classList.add("copied");
      
      setTimeout(() => {
        btnText.textContent = originalText;
        emailBtn.classList.remove("copied");
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy email: ", err);
    });
  });
}

/* ==========================================
   10. Project Filtering Logic
   ========================================== */
function initProjectFilter() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".project-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Toggle active state on tabs
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
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            if (card.style.opacity === "0") {
              card.style.display = "none";
            }
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   11. GitHub Activity Heatmap
   ========================================== */
function initGithubHeatmap() {
  const username = "Loki0865";
  const url = `https://api.github.com/users/${username}/events`;
  const heatmapSection = document.getElementById("github-activity-section");
  const cellsContainer = document.getElementById("heatmap-cells");
  const xLabelsContainer = document.getElementById("heatmap-x-labels");

  if (!heatmapSection) return;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("GitHub API fetch failed");
      return response.json();
    })
    .then(events => {
      if (!events || events.length === 0) {
        heatmapSection.style.display = "none";
        return;
      }

      // Map YYYY-MM-DD -> commit count
      const commitsMap = {};
      events.forEach(event => {
        if (event.type === "PushEvent" && event.created_at) {
          const dateStr = event.created_at.substring(0, 10);
          let count = 0;
          if (event.payload && event.payload.commits) {
            count = event.payload.commits.length;
          } else {
            count = 1;
          }
          commitsMap[dateStr] = (commitsMap[dateStr] || 0) + count;
        }
      });

      // Find Sunday of 11 weeks ago to start a grid of 12 weeks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDay = today.getDay();
      
      const sundayOfCurrentWeek = new Date(today);
      sundayOfCurrentWeek.setDate(today.getDate() - currentDay);
      
      const startDate = new Date(sundayOfCurrentWeek);
      startDate.setDate(startDate.getDate() - 11 * 7);

      // Render week labels (X-axis)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let lastMonthName = "";
      
      xLabelsContainer.style.display = "grid";
      xLabelsContainer.style.gridTemplateColumns = "repeat(12, 1fr)";
      xLabelsContainer.innerHTML = "";

      for (let col = 0; col < 12; col++) {
        const colDate = new Date(startDate);
        colDate.setDate(startDate.getDate() + col * 7);
        const monthName = monthNames[colDate.getMonth()];
        
        const labelDiv = document.createElement("div");
        labelDiv.className = "heatmap-x-label";
        if (monthName !== lastMonthName) {
          labelDiv.textContent = monthName;
          lastMonthName = monthName;
        }
        xLabelsContainer.appendChild(labelDiv);
      }

      // Populate cells (7 days x 12 weeks = 84 cells)
      cellsContainer.innerHTML = "";
      for (let dayOffset = 0; dayOffset < 84; dayOffset++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + dayOffset);
        
        const dateStr = cellDate.toISOString().substring(0, 10);
        const commits = commitsMap[dateStr] || 0;
        
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        
        // Color cells
        if (commits === 0) {
          cell.style.backgroundColor = "var(--border)";
        } else if (commits <= 2) {
          cell.style.backgroundColor = "#1e3a5f";
        } else if (commits <= 5) {
          cell.style.backgroundColor = "#1d4ed8";
        } else {
          cell.style.backgroundColor = "var(--accent)";
        }

        // Tooltip
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = cellDate.toLocaleDateString('en-US', options);
        const commitText = commits === 1 ? "1 commit" : `${commits === 0 ? "No" : commits} commits`;
        cell.setAttribute("data-tooltip", `${commitText} on ${formattedDate}`);
        
        cellsContainer.appendChild(cell);
      }

      // Display the heatmap section
      heatmapSection.style.display = "block";
    })
    .catch(err => {
      console.warn("Could not load GitHub activity:", err);
      heatmapSection.style.display = "none";
    });
}
