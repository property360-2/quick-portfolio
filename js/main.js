document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Initialization (AOS & GSAP)
    // ==========================================
    AOS.init({
        duration: 1000,
        easing: 'ease-out-quart',
        once: true,
        offset: 30,
        mirror: false,
        anchorPlacement: 'top-bottom'
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
            clearProps: "all" // Cleans up inline styles after animation
        });
    }

    if (document.querySelector(".gs-reveal-img")) {
        gsap.from(".gs-reveal-img", {
            x: 50,
            opacity: 0,
            duration: 1.5,
            delay: 0.3,
            ease: "expo.out",
            filter: "blur(5px)"
        });
    }

    // ==========================================
    // 2. Theme Toggle Logic
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');

    // Check LocalStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        updateIcons(true);
    } else {
        html.classList.remove('dark');
        updateIcons(false);
    }

    function toggleTheme() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcons(isDark);
    }

    function updateIcons(isDark) {
        sunIcons.forEach(icon => icon.classList.toggle('hidden', !isDark));
        moonIcons.forEach(icon => icon.classList.toggle('hidden', isDark));
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // ==========================================
    // 3. Mobile Menu Logic
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // 4. Tab Switching (Writings)
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(b => {
                    b.classList.remove('border-wood-accent', 'text-wood-700', 'dark:text-wood-300');
                    b.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                });

                // Add active class to clicked button
                btn.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                btn.classList.add('border-wood-accent', 'text-wood-700', 'dark:text-wood-300');

                // Hide all contents
                tabContents.forEach(content => content.classList.add('hidden'));

                // Show target content
                const target = btn.dataset.target;
                const targetEl = document.getElementById(target);
                if (targetEl) targetEl.classList.remove('hidden');
            });
        });
    }

    // ==========================================
    // 5. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
            } else {
                backToTopBtn.classList.add('translate-y-20', 'opacity-0');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 6. Navigation Active State
    // ==========================================
    // Helper to highlight current page in navigation
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-link');

    // Only strictly needed if we want to dynamically set helper classes, 
    // but the HTML files have them hardcoded for simplicity.
    // Leaving this placeholder for potential dynamic enhancement.

});

// ==========================================
// 7. Portfolio Modal Logic (Global functions)
// ==========================================
const projectData = {
    'project1': {
        title: 'E-commerce Dashboard',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        description: 'A React-based dashboard for managing orders, analytics, and inventory. Features include real-time data visualization with Chart.js, dark mode support, and full responsiveness using Tailwind CSS.',
        tags: ['React', 'Tailwind', 'Chart.js', 'Node.js']
    },
    'project2': {
        title: 'FinTrack Mobile App',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        description: 'A Vue.js progressive web application for tracking personal finances. Users can link bank accounts, categorize transactions, and set budget goals. Visualizations powered by D3.js.',
        tags: ['Vue.js', 'D3.js', 'Firebase', 'PWA']
    }
};

function openModal(projectId) {
    const modal = document.getElementById('project-modal');
    if (!modal) return; // Guard clause

    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-image').src = data.image;
    document.getElementById('modal-description').textContent = data.description;

    // Clear and add tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'px-2 py-1 bg-wood-100 dark:bg-wood-900 text-wood-700 dark:text-wood-300 text-xs rounded';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return; // Guard clause

    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    if (modal && e.target === backdrop) {
        closeModal();
    }
});
