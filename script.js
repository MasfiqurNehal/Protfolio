// script.js - smooth scroll, mobile toggle, reveal, active nav, parallax, year

// mobile menu toggle
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');
const openIcon = document.getElementById('openIcon');
const closeIcon = document.getElementById('closeIcon');

mobileBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    openIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// smooth scroll with header offset for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href.startsWith('#') || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerOffset = document.querySelector('header').offsetHeight + 12;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        // close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
});

// IntersectionObserver reveal
const reveals = document.querySelectorAll('.reveal');
const obsOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.06 };
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, obsOptions);
reveals.forEach(r => revealObserver.observe(r));

// active nav link based on scroll
const navLinks = Array.from(document.querySelectorAll('#nav a'));
const sectionIds = navLinks.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('#')).map(h => h.slice(1));
function updateActiveNav() {
    const fromTop = window.scrollY + (document.querySelector('header').offsetHeight || 80) + 20;
    let current = null;
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= fromTop) current = id;
    });
    navLinks.forEach(a => a.classList.remove('active'));
    if (current) {
        const link = navLinks.find(a => a.getAttribute('href') === `#${current}`);
        if (link) link.classList.add('active');
    }
}
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// parallax mouse effect (desktop)
const parallax = document.getElementById('parallax');
if (parallax) {
    parallax.addEventListener('mousemove', (e) => {
        const rect = parallax.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-py) * 6;
        const ry = (px) * 12;
        parallax.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    parallax.addEventListener('mouseleave', () => { parallax.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
}

// set year in footer
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
