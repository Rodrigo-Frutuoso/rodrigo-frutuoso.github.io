/* Multi-Page JavaScript Functionality */

// Component Loader
async function loadComponent(id, path, callback) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        const placeholder = document.getElementById(id);
        if (placeholder) {
            placeholder.innerHTML = text;
            if (callback) callback();
        }
    } catch (error) {
        console.error(`Error loading component from ${path}:`, error);
    }
}

// Active Nav Link Highlight
function highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const path = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Normalize paths for comparison
        const normalizedPath = path.endsWith('/') ? path : path + '/';
        const normalizedHref = href.endsWith('/') ? href : href + '/';
        
        if (normalizedPath.endsWith(normalizedHref)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Reveal Animation on Scroll
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Horizontal Timeline Scroll
function scrollTimeline(amount) {
    const timeline = document.getElementById('timeline');
    if (timeline) {
        timeline.scrollBy({
            left: amount,
            behavior: 'smooth'
        });
    }
}

// Custom Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
        </div>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Initialize Lucide icon
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const data = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/xwpljvnv", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                showToast("Message sent successfully!");
                form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            showToast("Problem sending message.", "error");
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const isSubpage = window.location.pathname.includes('/about/') || 
                      window.location.pathname.includes('/projects/') || 
                      window.location.pathname.includes('/contact/');
    
    const prefix = isSubpage ? '../' : '';

    loadComponent('header-placeholder', prefix + 'components/header.html', () => {
        highlightActiveLink();
        
        // Fix links and image paths in header
        const headerLinks = document.querySelectorAll('.nav-links a, .logo a');
        headerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === 'home') {
                link.setAttribute('href', prefix || './');
            } else {
                link.setAttribute('href', prefix + href + '/');
            }
        });

        const logoImg = document.querySelector('.logo img');
        if (logoImg) {
            logoImg.src = prefix + 'images/logo.svg';
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    loadComponent('footer-placeholder', prefix + 'components/footer.html', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    initReveal();
    initContactForm();
});
