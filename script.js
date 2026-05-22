// --- Basic Selectors ---
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.navbar a');
const themeToggle = document.querySelector('#theme-toggle');
const body = document.body;

// --- Dark/Light Mode ---
// This function handles switching between themes
const setTheme = (isLight) => {
    if (isLight) {
        body.classList.add('light-mode');
        themeToggle?.classList.replace('far', 'fas');
    } else {
        body.classList.remove('light-mode');
        themeToggle?.classList.replace('fas', 'far');
    }
};

// Check if user has a preference saved
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') setTheme(true);

if (themeToggle) {
    themeToggle.onclick = () => {
        const isLight = body.classList.toggle('light-mode');
        setTheme(isLight);
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    };
}

// --- Mobile Menu ---
// Open and close the menu on mobile devices
if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('active');
    };
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.onclick = () => {
        navbar?.classList.remove('active');
        menuIcon?.classList.remove('active');
    };
});

// --- Typewriter Effect ---
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const roles = ["Frontend Developer", "UI/UX Designer", "BCA Student", "Web Specialist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function handleTyping() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            speed = 2000; // Wait at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(handleTyping, speed);
    }
    handleTyping();
}

// --- Scroll Animations ---
// Using IntersectionObserver to animate elements when they appear on screen
const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Stagger animation for items inside a container
            const items = entry.target.querySelectorAll('.service-box, .project-box, .skill-item, .info-box, .timeline-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = "1";
                    item.style.transform = "translateY(0)";
                }, index * 150);
            });
        } else {
            entry.target.classList.remove('revealed');
            const items = entry.target.querySelectorAll('.service-box, .project-box, .skill-item, .info-box, .timeline-item');
            items.forEach((item) => {
                item.style.opacity = "0";
                item.style.transform = "translateY(30px)";
                item.style.transition = "all 0.6s ease";
            });
        }
    });
}, observerOptions);

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// --- 3D Card Tilt ---
const cards = document.querySelectorAll('.project-box, .service-box, .skill-box');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});

// --- Particle Background ---
// Creates a simple floating dot background on the canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
    let particles = [];
    let w, h;

    function initParticles() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];
        // Create 80 particles with random positions and speeds
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = getComputedStyle(body).getPropertyValue('--main-color');
        ctx.globalAlpha = 0.2;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();
}

// --- Scroll Effects ---
window.addEventListener('scroll', () => {
    // Header background change on scroll
    if (header) {
        if (window.scrollY > 50) {
            // header.style.padding = "20px 10%";
            header.classList.add('glass-card');
        } else {
            
            header.classList.remove('glass-card');
        }
    }

    // Active link highlighting based on current section
    let currentSection = "";
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(currentSection)) {
            link.classList.add("active");
        }
    });

    // Back to top button visibility
    const backToTop = document.querySelector('#back-to-top');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// --- Live Time in Patna (IST) ---
function updateTime() {
    const timeText = document.getElementById('time-text');
    const timeIcon = document.getElementById('time-icon');
    
    if (timeText && timeIcon) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
        timeText.textContent = `${timeString} (Patna, India)`;

        // Update sun/moon icon based on time
        const hour = now.getHours();
        if (hour >= 6 && hour < 18) {
            timeIcon.innerHTML = '<i class="fas fa-sun" style="color: #fbbf24;"></i>';
        } else {
            timeIcon.innerHTML = '<i class="fas fa-moon" style="color: #818cf8;"></i>';
        }
    }
}
setInterval(updateTime, 1000);
updateTime();

// --- Contact Form ---
const contactForm = document.querySelector('.contact-form-card form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalBtnText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
                btn.classList.add('btn-success');
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            btn.innerHTML = 'Failed! <i class="fas fa-times"></i>';
            btn.classList.add('btn-error');
            setTimeout(() => {
                btn.innerHTML = originalBtnText;
                btn.classList.remove('btn-error');
                btn.disabled = false;
            }, 3000);
        }
    });
}

// --- Project & Certificate Modals ---
document.addEventListener('DOMContentLoaded', () => {
    // Project Modal
    const projectModal = document.querySelector('#project-modal');
    if (projectModal) {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.onclick = (e) => {
                const box = e.target.closest('.project-box');
                projectModal.querySelector('#modal-title').textContent = box.dataset.title;
                projectModal.querySelector('#modal-description').textContent = box.dataset.description;
                projectModal.querySelector('#modal-image').src = box.dataset.img;
                projectModal.querySelector('#modal-live').href = box.dataset.live || '#';
                projectModal.querySelector('#modal-github').href = box.dataset.github || '#';

                const tags = projectModal.querySelector('#modal-tags');
                tags.innerHTML = '';
                box.dataset.tech.split(',').forEach(t => {
                    tags.innerHTML += `<span>${t.trim()}</span>`;
                });

                projectModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        projectModal.querySelector('.close-modal').onclick = () => {
            projectModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // Certificate Lightbox
    const certModal = document.querySelector('#cert-modal');
    if (certModal) {
        document.querySelectorAll('.cert-card').forEach(card => {
            card.onclick = () => {
                certModal.querySelector('#modal-cert-img').src = card.querySelector('img').src;
                certModal.querySelector('#modal-cert-title').textContent = card.querySelector('h3').textContent;
                certModal.querySelector('#modal-cert-desc').textContent = card.querySelector('p').textContent;
                certModal.querySelector('#modal-cert-download').href = card.querySelector('img').src;
                certModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        certModal.querySelector('.close-modal').onclick = () => {
            certModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }
});

// --- Service Card Flip ---
document.querySelectorAll('.service-flip-card').forEach(card => {
    card.onclick = (e) => {
        if (e.target.classList.contains('btn')) return;
        card.querySelector('.service-card-inner').classList.toggle('flipped');
    };
});

// --- Internship Progress Tracker ---
function updateInternshipProgress() {
    const progressVal = document.getElementById('intern-progress-val');
    const progressBar = document.getElementById('intern-progress-bar');
    const daysLeft = document.getElementById('intern-days-left');

    if (!progressVal || !progressBar || !daysLeft) return;

    const startDate = new Date('2026-05-05');
    const endDate = new Date('2026-07-05');
    const today = new Date();

    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const daysElapsed = Math.min((today - startDate) / (1000 * 60 * 60 * 24), totalDays);
    const percentage = Math.max(0, Math.min(100, Math.round((daysElapsed / totalDays) * 100)));
    const remaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

    progressVal.textContent = percentage + '%';
    progressBar.style.width = percentage + '%';
    daysLeft.textContent = remaining > 0 ? remaining + ' days left' : 'Completed!';
}
updateInternshipProgress();

// --- About Section: Read More Toggle ---
function setupAboutReadMore() {
    const btn = document.getElementById('about-read-more-btn');
    const collapsedContent = document.querySelector('.about-collapsed-content');
    if (!btn || !collapsedContent) return;

    btn.addEventListener('click', () => {
        const isExpanded = collapsedContent.classList.toggle('expanded');
        btn.querySelector('span').textContent = isExpanded ? 'Read Less' : 'Read More';
        btn.querySelector('i').style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    });
}

// --- Hero 3D Parallax Tilt Effect ---
const setupHero3DTilt = () => {
    const heroImgWrapper = document.querySelector('.home-img-wrapper');
    if (!heroImgWrapper) return;

    heroImgWrapper.addEventListener('mousemove', (e) => {
        // Skip tilt on mobile viewports for best mobile performance & no layout issues
        if (window.innerWidth < 992) return;
        
        const rect = heroImgWrapper.getBoundingClientRect();
        // Calculate cursor offset relative to card center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Tilt calculations: max rotation of 15 degrees
        const maxTilt = 15;
        const rotateX = -(y / (rect.height / 2)) * maxTilt;
        const rotateY = (x / (rect.width / 2)) * maxTilt;
        
        // Dynamic real-time tracking transition
        heroImgWrapper.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        heroImgWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroImgWrapper.addEventListener('mouseleave', () => {
        // Elite slow smooth snapback reset transition
        heroImgWrapper.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        heroImgWrapper.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setupAboutReadMore();
    setupHero3DTilt();
});

