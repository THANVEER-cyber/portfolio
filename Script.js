
document.addEventListener("DOMContentLoaded", () => {
    // 1. Mouse Tracking Glow Effect
    const cursorGlow = document.getElementById("cursorGlow");
    if (cursorGlow && window.innerWidth > 768) {
        window.addEventListener("pointermove", (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // 2. Dynamic Dark/Light Theme Switching
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle.querySelector(".theme-icon");
    const savedTheme = localStorage.getItem("portfolio_theme") || "dark";

    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        themeIcon.textContent = theme === "dark" ? "☀" : "☾";
        localStorage.setItem("portfolio_theme", theme);
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const activeTheme = document.body.getAttribute("data-theme");
        applyTheme(activeTheme === "dark" ? "light" : "dark");
    });

    // 3. Mobile Navigation Drawer
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => nav.classList.remove("open"));
    });

    // 4. Scroll-Spy Active Link Tracking
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach((sec) => observer.observe(sec));

    // 5. Interactive Skill Taxonomy Filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const skillTiles = document.querySelectorAll(".skill-tile");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            skillTiles.forEach((tile) => {
                const category = tile.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    tile.classList.remove("hidden");
                } else {
                    tile.classList.add("hidden");
                }
            });
        });
    });

    // 6. Direct Client-Side Contact Transmission (Web3Forms API)
    const contactForm = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Transmitting...</span>";
        feedback.className = "form-feedback";
        feedback.textContent = "";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.status === 200) {
                feedback.className = "form-feedback success";
                feedback.textContent = "Packet received. Your message was dispatched directly to my inbox.";
                contactForm.reset();
            } else {
                feedback.className = "form-feedback error";
                feedback.textContent = result.message || "Failed to dispatch. Please email me directly.";
            }
        } catch (error) {
            feedback.className = "form-feedback error";
            feedback.textContent = "Network error. Please email me directly at thannuthannu0141@gmail.com";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "<span>Transmit Message</span>";
        }
    });
});