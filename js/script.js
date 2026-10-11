// Years of experience — single source used across the page
const YEARS_EXPERIENCE = '15+';

// Navbar Scroll Effect
const header = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links').forEach(n => n.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Keep every "years of experience" mention in sync
function applyYearsOfExperience() {
    document.querySelectorAll('[data-years]').forEach(el => { el.textContent = YEARS_EXPERIENCE; });
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = meta.content.replace(/\d+\+/, YEARS_EXPERIENCE);
}

// -- Projects --
const STATUS_CLASSES = {
    'live': 'status-live',
    'in development': 'status-dev',
    'beta': 'status-beta',
    'delivered': 'status-done',
    'completed': 'status-done'
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function getInitials(title) {
    return title.split(/[\s–-]+/).filter(w => /^[a-z]/i.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Maps legacy Supabase rows (url, status: 'live', icon_class) onto the current data model
function normalizeProject(p) {
    if (p.category) return p;
    return {
        ...p,
        category: 'websites',
        status: p.status === 'live' ? 'Live' : 'Delivered',
        link: p.url ? { label: 'View Project', url: p.url } : null,
        icon: p.icon_class,
        highlights: [],
        tags: p.tags || []
    };
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card light-card hover-lift slide-up';
    card.dataset.category = project.category;

    const statusClass = STATUS_CLASSES[(project.status || '').toLowerCase()] || 'status-done';
    const liveDot = statusClass === 'status-live' ? '<span class="live-dot"></span> ' : '';
    const highlights = (project.highlights || []).filter(h => h && !h.includes('[PLACEHOLDER'));

    const media = project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} screenshot" loading="lazy">`
        : `<div class="project-placeholder cat-${escapeHtml(project.category)}" aria-hidden="true">
               <i class="${escapeHtml(project.icon || 'fas fa-project-diagram')}"></i>
               <span>${escapeHtml(getInitials(project.title))}</span>
           </div>`;

    const footer = project.link
        ? `<a href="${escapeHtml(project.link.url)}" target="_blank" rel="noopener noreferrer" class="project-link">
               <i class="fas fa-external-link-alt"></i> ${escapeHtml(project.link.label || 'View Project')}
               <span class="sr-only">(opens in a new tab)</span>
           </a>`
        : (project.role
            ? `<div class="project-role"><i class="fas fa-user-tie"></i> ${escapeHtml(project.role)}</div>`
            : '');

    card.innerHTML = `
        <div class="project-media">
            ${media}
            <div class="project-badge ${statusClass}">${liveDot}${escapeHtml(project.status)}</div>
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        ${project.subtitle ? `<p class="project-subtitle">${escapeHtml(project.subtitle)}</p>` : ''}
        ${project.client ? `<p class="project-meta"><strong>${project.client.includes('·') ? 'Clients' : 'Client'}:</strong> ${escapeHtml(project.client)}</p>` : ''}
        <p class="project-desc">${escapeHtml(project.description)}</p>
        ${project.target ? `<p class="project-meta"><strong>Target:</strong> ${escapeHtml(project.target)}</p>` : ''}
        ${highlights.length ? `<ul class="project-highlights">${highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
        <div class="project-tags">${(project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
        ${footer}
    `;

    return card;
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    projects.map(normalizeProject).forEach(project => {
        const card = createProjectCard(project);
        card.hidden = activeFilter !== 'all' && project.category !== activeFilter;
        container.appendChild(card);
        observer.observe(card);
    });
}

// Category filter tabs
let filterRun = 0;
let activeFilter = 'all';

function filterProjects(category) {
    const run = ++filterRun;
    activeFilter = category;
    const cards = document.querySelectorAll('#projects-container .project-card');
    const matches = card => category === 'all' || card.dataset.category === category;

    cards.forEach(card => {
        if (!matches(card)) card.classList.add('is-filtered');
    });

    setTimeout(() => {
        if (run !== filterRun) return;
        cards.forEach(card => {
            if (matches(card)) {
                card.hidden = false;
                card.classList.add('visible');
                // Force reflow so the fade/scale-in transition plays
                void card.offsetWidth;
                card.classList.remove('is-filtered');
            } else {
                card.hidden = true;
            }
        });
    }, 250);
}

function initProjectTabs() {
    const tablist = document.getElementById('project-tabs');
    if (!tablist) return;

    tablist.innerHTML = PROJECT_CATEGORIES.map((cat, i) => `
        <button type="button" role="tab" class="project-tab${i === 0 ? ' active' : ''}"
            id="tab-${cat.id}" data-filter="${cat.id}" aria-controls="projects-container"
            aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${escapeHtml(cat.label)}</button>
    `).join('');

    const tabs = [...tablist.querySelectorAll('.project-tab')];

    const selectTab = tab => {
        tabs.forEach(t => {
            const selected = t === tab;
            t.classList.toggle('active', selected);
            t.setAttribute('aria-selected', selected);
            t.tabIndex = selected ? 0 : -1;
        });
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        document.getElementById('projects-container').setAttribute('aria-labelledby', tab.id);
        filterProjects(tab.dataset.filter);
    };

    tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab)));

    // Arrow-key navigation between tabs
    tablist.addEventListener('keydown', e => {
        const idx = tabs.indexOf(document.activeElement);
        if (idx === -1) return;
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
            e.preventDefault();
            next.focus();
            selectTab(next);
        }
    });
}

// Dynamic Project Loading — uses Supabase rows when configured, otherwise PROJECTS from projects.js
async function fetchProjects() {
    renderProjects(PROJECTS);

    if (!supabaseClient) return;

    try {
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        if (projects.length > 0) renderProjects(projects);
    } catch (err) {
        console.error('Error fetching from Supabase:', err);
    }
}

// Initial fetch
document.addEventListener('DOMContentLoaded', () => {
    applyYearsOfExperience();
    initProjectTabs();
    fetchProjects();

    // Observe existing static elements
    document.querySelectorAll('.slide-up').forEach((element) => {
        observer.observe(element);
    });
});
