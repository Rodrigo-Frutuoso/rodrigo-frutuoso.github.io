function loadHeader() {
    return fetch('components/header.html') // Caminho atualizado
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading header: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                headerPlaceholder.style.display = 'block';
                setActiveNavLink();
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

function loadFooter() {
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading footer: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;

                const yearSpan = document.getElementById('currentYear');
                if (yearSpan) {
                    yearSpan.textContent = new Date().getFullYear();
                }
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

function loadFeaturedProject(username) {
    const container = document.getElementById('featured-project');
    if (!container) return;

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`)
        .then(response => response.json())
        .then(repos => {
            if (repos.length > 0) {
                const repo = repos[0];
                container.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title">${repo.name}</h3>
                        <p class="card-text">${repo.description || 'No description available.'}</p>
                        <a href="${repo.html_url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                    </div>
                `;
            } else {
                container.innerHTML = '<p class="text-muted">No repositories found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading featured project:', error);
            container.innerHTML = '<p class="text-danger">Error loading featured project.</p>';
        });
}

function loadAllRepos(username) {
    const container = document.getElementById('repos-container');
    if (!container) return;

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            if (Array.isArray(repos) && repos.length > 0) {
                repos
                    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                    .forEach(repo => {
                        const card = document.createElement('div');
                        card.className = 'col-md-4 mb-4';
                        card.innerHTML = `
                            <div class="card h-100 shadow-sm">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${repo.name}</h5>
                                    <p class="card-text">${repo.description || 'No description available.'}</p>
                                    <a href="${repo.html_url}" class="btn btn-primary mt-auto" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                                </div>
                            </div>
                        `;
                        container.appendChild(card);
                    });
            } else {
                container.innerHTML = '<p class="text-muted">No repositories found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading repositories:', error);
            container.innerHTML = '<p class="text-danger">Error loading repositories.</p>';
        });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', function () {
        const icons = document.querySelectorAll('.contact-icon');
        icons.forEach(icon => {
            icon.classList.toggle('dark');
        });
    });
}

function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname;

        if (linkPath === currentPath) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const githubUsername = 'Rodrigo-Frutuoso';

    loadHeader();
    loadFooter();
    loadFeaturedProject(githubUsername);
    loadAllRepos(githubUsername);
    initThemeToggle();
});
