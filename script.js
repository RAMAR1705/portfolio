document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (currentTheme === 'light' || (!currentTheme && systemPrefersLight)) {
        document.body.classList.add('light-mode');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        // Update Icon
        themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        
        // Save choice
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    /* ==========================================================================
       MOBILE MENU DRAWER
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menu-toggle');
    const menuCloseBtn = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-item');

    function openMenu() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling when menu open
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================================================
       MOUSE-TRACKING CARD GLOW EFFECT
       ========================================================================== */
    const glowCards = document.querySelectorAll('.glow-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================================================
       SCROLL REVEAL OBSERVER
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Unobserve once revealed to keep layout performing smoothly
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHTS)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight section slightly before scroll reaches the boundary
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       BENTO LIVE CLOCK
       ========================================================================== */
    const clockElement = document.getElementById('local-clock');

    function updateClock() {
        const now = new Date();
        
        // Format time in Ramar's local timezone (IST / India standard time)
        // If the visitor is in a different zone, it shows India time to show "Where Ramar is active"
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        try {
            const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
            clockElement.textContent = timeString + ' (IST)';
        } catch (e) {
            // Fallback to local time if timezone format fails
            clockElement.textContent = now.toLocaleTimeString();
        }
    }

    // Run clock instantly and set intervals
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       CONTACT FORM HANDLING (SIMULATED SUBMIT)
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const successOverlay = document.getElementById('form-success-msg');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard submit redirection

            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;

            // Change button state to loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate server network latency of 1.5 seconds
            setTimeout(() => {
                // Show Success Popup overlay
                successOverlay.classList.add('show');

                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Clear input values
                contactForm.reset();
            }, 1500);
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            successOverlay.classList.remove('show');
        });
    }
    
    // Close overlay if background is clicked
    successOverlay.addEventListener('click', (e) => {
        if (e.target === successOverlay) {
            successOverlay.classList.remove('show');
        }
    });
});
