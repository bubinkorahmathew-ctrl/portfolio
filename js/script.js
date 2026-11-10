// Years of experience — single source used across the page
const YEARS_EXPERIENCE = '20+';

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
    const open = !navMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    mobileMenu.setAttribute('aria-expanded', open);
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links').forEach(n => n.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-expanded', false);
}));

// Highlight the nav link of the section currently in view
function initScrollSpy() {
    const links = [...document.querySelectorAll('.nav-links[href^="#"]')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const update = () => {
        const marker = window.innerHeight * 0.35;
        let current = sections[0];
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= marker) current = section;
        });
        // At the very bottom, the last section is active even if it's short
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            current = sections[sections.length - 1];
        }
        links.forEach(link => {
            const active = link.getAttribute('href') === `#${current.id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

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
}

// -- Projects --
// Cards and tabs are pre-rendered into index.html by scripts/build-projects.js.
// JS only adds filtering, and re-renders when Supabase supplies its own rows.
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(projectCardHTML).join('');
    container.querySelectorAll('.project-card').forEach(card => {
        card.hidden = activeFilter !== 'all' && card.dataset.category !== activeFilter;
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

    // Fallback if the static build hasn't been run
    if (!tablist.querySelector('.project-tab')) tablist.innerHTML = projectTabsHTML(PROJECT_CATEGORIES);

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

// Uses Supabase rows when configured, otherwise the pre-rendered cards from js/projects.js
async function fetchProjects() {
    const container = document.getElementById('projects-container');
    if (!container.querySelector('.project-card')) renderProjects(PROJECTS);

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
    initScrollSpy();

    // Observe existing static elements
    document.querySelectorAll('.slide-up').forEach((element) => {
        observer.observe(element);
    });
});
