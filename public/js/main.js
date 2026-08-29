document.addEventListener("DOMContentLoaded", () => {
  // Portfolio v1.1 - Added Cinematic Animations

  // ==========================================
  // 1. Initialization (AOS & GSAP)
  // ==========================================
  AOS.init({
    duration: 1000,
    easing: "ease-out-quart",
    once: true,
    offset: 30,
    mirror: false,
    anchorPlacement: "top-bottom",
  });

  // GSAP Hero Animation (Logic only runs if checks pass)
  if (document.querySelector(".gs-reveal")) {
    gsap.from(".gs-reveal", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power2.out",
      filter: "blur(10px)",
      clearProps: "all", // Cleans up inline styles after animation
    });
  }

  if (document.querySelector(".gs-reveal-img")) {
    gsap.from(".gs-reveal-img", {
      x: 50,
      opacity: 0,
      duration: 1.5,
      delay: 0.3,
      ease: "expo.out",
      filter: "blur(5px)",
    });
  }

  // ==========================================
  // 2. Page Reveal & Cleanup
  // ==========================================
  const body = document.body;

  // Reveal content smoothly
  requestAnimationFrame(() => {
    body.classList.add("loaded");
  });

  // Remove preload class to enable transitions after a delay
  // This prevents the initial color flash during theme switch on load
  setTimeout(() => {
    body.classList.remove("preload");
  }, 500);

  // ==========================================
  // 3. Theme Toggle Logic
  // ==========================================
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeToggleMobileBtn = document.getElementById("theme-toggle-mobile");
  const html = document.documentElement;
  const sunIcons = document.querySelectorAll(".sun-icon");
  const moonIcons = document.querySelectorAll(".moon-icon");

  // Sync icons on load
  const isDark = html.classList.contains("dark");
  updateIcons(isDark);

  function toggleTheme() {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcons(isDark);
  }

  function updateIcons(isDark) {
    sunIcons.forEach((icon) => icon.classList.toggle("hidden", !isDark));
    moonIcons.forEach((icon) => icon.classList.toggle("hidden", isDark));
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (themeToggleMobileBtn)
    themeToggleMobileBtn.addEventListener("click", toggleTheme);

  // ==========================================
  // 3. Mobile Menu Logic
  // ==========================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==========================================
  // 4. Tab Switching (Writings)
  // ==========================================
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabBtns.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active state from all buttons
        tabBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });

        // Add active state to clicked button
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        // Hide all contents
        tabContents.forEach((content) => content.classList.add("hidden"));

        // Show target content
        const target = btn.dataset.target;
        const targetEl = document.getElementById(target);
        if (targetEl) targetEl.classList.remove("hidden");
      });
    });
  }

  // ==========================================
  // 5. Back to Top Button
  // ==========================================
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove("translate-y-20", "opacity-0");
      } else {
        backToTopBtn.classList.add("translate-y-20", "opacity-0");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ==========================================
  // 6. Navigation Active State
  // ==========================================
  // Helper to highlight current page in navigation
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  // Only strictly needed if we want to dynamically set helper classes,
  // but the HTML files have them hardcoded for simplicity.
  // Leaving this placeholder for potential dynamic enhancement.

  // 3D Scene removed per request.
});

// 7. Portfolio Modal Logic - (Removed unused code)

// ==========================================
// 8. Portfolio Category Filtering
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("active", "bg-wood-accent", "text-white");
          b.classList.add(
            "bg-gray-200",
            "dark:bg-gray-800",
            "text-gray-700",
            "dark:text-gray-300",
          );
          b.setAttribute("aria-pressed", "false");
        });

        btn.classList.remove(
          "bg-gray-200",
          "dark:bg-gray-800",
          "text-gray-700",
          "dark:text-gray-300",
        );
        btn.classList.add("active", "bg-wood-accent", "text-white");
        btn.setAttribute("aria-pressed", "true");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const categories = card.getAttribute("data-category");
          const matches =
            filterValue === "all" ||
            (categories && categories.includes(filterValue));

          if (matches) {
            card.style.display = "";
            card.style.opacity = "1";
            card.classList.add("aos-animate");
          } else {
            card.style.display = "none";
          }
        });

        if (typeof AOS !== "undefined") AOS.refresh();
      });
    });
  }
});
