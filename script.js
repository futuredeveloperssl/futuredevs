document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal observer - Define early to avoid ReferenceError
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.dataset.transform || 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Preloader logic
    const preloader = document.getElementById('preloader');
    const percentageText = document.getElementById('percentage');
    const ringProgress = document.getElementById('ring-progress');
    const ringCircumference = 2 * Math.PI * 100; // Radius index is 100

    const startPageAnimations = () => {
        // Stagger text animation on load
        const staggerElements = document.querySelectorAll('.stagger-text');
        staggerElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150 + (index * 150));
        });

        // Grid items reveal
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.dataset.transform = 'translateY(0)';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s`;
            observer.observe(item);
        });

        // Trending info reveal
        const trendingInfo = document.querySelector('.trending-info');
        if (trendingInfo) {
            trendingInfo.style.opacity = '0';
            trendingInfo.dataset.transform = 'translateX(0)';
            trendingInfo.style.transform = 'translateX(50px)';
            trendingInfo.style.transition = 'opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)';
            observer.observe(trendingInfo);
        }
        
        // Stats bar reveal
        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            statsBar.style.opacity = '0';
            statsBar.dataset.transform = 'translateY(0)';
            statsBar.style.transform = 'translateY(40px)';
            statsBar.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
            observer.observe(statsBar);
        }

        // Contact section reveal
        const contactSection = document.querySelector('.contact-container');
        if (contactSection) {
            contactSection.style.opacity = '0';
            contactSection.dataset.transform = 'translateY(0)';
            contactSection.style.transform = 'translateY(50px)';
            contactSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(contactSection);
        }
    };

    // Check if user has already seen the loader in this session
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');

    if (preloader && percentageText && ringProgress) {
        if (hasSeenLoader) {
            // User has already visited, skip preloader
            preloader.style.display = 'none';
            startPageAnimations();
        } else {
            // First visit in this session, show preloader
            let count = 0;
            const interval = setInterval(() => {
                // Random increment for a more "advanced/realistic" loading feel
                count += Math.floor(Math.random() * 4) + 1;
                if (count >= 100) {
                    count = 100;
                    clearInterval(interval);
                    sessionStorage.setItem('hasSeenLoader', 'true'); // Mark as seen
                    setTimeout(() => {
                        preloader.classList.add('fade-out');
                        setTimeout(startPageAnimations, 400); 
                    }, 400);
                }
                percentageText.innerText = count;
                
                // Update circular ring
                const offset = ringCircumference - (count / 100) * ringCircumference;
                ringProgress.style.strokeDashoffset = offset;
            }, 30);

            // Fallback: If preloader hangs, force start animations after 3-5 seconds
            setTimeout(() => {
                if (count < 100) {
                    clearInterval(interval);
                    sessionStorage.setItem('hasSeenLoader', 'true'); // Mark as seen
                    if (preloader) preloader.classList.add('fade-out');
                    startPageAnimations();
                }
            }, 3000);
        }
    } else {
        startPageAnimations();
    }

    // Image simple parallax effect optimized with requestAnimationFrame
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) {
        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 30;
                    const y = (e.clientY / window.innerHeight - 0.5) * 30;
                    heroImg.style.transform = `translate(${x}px, ${y}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Content Protection ---
    // Disable Right-Click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Disable Keyboard Inspector Shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Prevent Ctrl+Shift+I (Inspector)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
        }
        // Prevent Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
            e.preventDefault();
        }
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
        }
        // Prevent Ctrl+S (Save Page)
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
        }
    });

    // Disable dragging on images
    document.addEventListener('dragstart', (e) => {
        if(e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    });
});
