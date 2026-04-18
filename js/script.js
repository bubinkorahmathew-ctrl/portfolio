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

// -- Default Project Data (Fallback) --
const DEFAULT_PROJECTS = [
    {
        id: 'd1',
        title: 'Nishad CV - Senior Accounts Manager',
        description: 'A professional digital CV showcasing 17+ years of financial expertise, VAT management, and ZATCA e-invoicing. Features a modern, interactive design for a deep professional journey.',
        status: 'live',
        url: 'https://nishadcv-354l.vercel.app/',
        icon_class: 'fas fa-file-invoice-dollar',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']
    },
    {
        id: 'd2',
        title: 'Linu John - Supply Chain Portfolio',
        description: 'A sophisticated portfolio specializing in warehouse management and procurement efficiency. Highlights expertise in SAP Business One and inventory control with a clean, data-driven aesthetic.',
        status: 'live',
        url: 'https://poetic-starburst-dcf1cc.netlify.app/',
        icon_class: 'fas fa-warehouse',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'SAP']
    },
    {
        id: 'd3',
        title: 'POS Expert - IT & ERP Solutions',
        description: 'Leading IT solutions provider specializing in custom ERP implementations and point-of-sale systems for businesses in Saudi Arabia.',
        status: 'live',
        url: 'https://posexpertech.com/',
        icon_class: 'fas fa-laptop-code',
        tags: ['ERP', 'POS', 'IT Infrastructure']
    },
    {
        id: 'd4',
        title: 'Sparkwings Enterprises - IT & Security',
        description: 'Comprehensive IT services and security solutions provider. Empowering businesses through tailored ERP systems, web development, and robust security infrastructure.',
        status: 'live',
        url: 'https://sparkwings.co.in/',
        icon_class: 'fas fa-shield-alt',
        tags: ['IT Solutions', 'CCTV', 'ERP', 'Security']
    },
    {
        id: 'd5',
        title: 'Multi-branch Restaurant POS Implementation',
        description: 'End-to-end deployment of centralized POS ecosystems across multiple locations, optimizing order flow and real-time inventory tracking.',
        status: 'live',
        url: '',
        icon_class: 'fas fa-utensils',
        tags: ['POS Systems', 'Networking', 'Inventory']
    },
    {
        id: 'd6',
        title: 'Odoo ERP Community Implementation',
        description: 'Customized Odoo ERP deployment for retail sectors, focusing on Accounting, HR, and Supply Chain automation.',
        status: 'live',
        url: '',
        icon_class: 'fas fa-cogs',
        tags: ['Odoo', 'Python', 'ERP Solution']
    }
];

// Dynamic Project Loading
async function fetchProjects() {
    const container = document.getElementById('projects-container');
    
    // Check if Supabase is configured
    const isSupabaseConfigured = supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL';
    
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Loading default projects as fallback.');
        renderProjects(DEFAULT_PROJECTS, true);
        return;
    }

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        if (projects.length === 0) {
            console.info('Successfully connected to Supabase but no projects found. Showing defaults.');
            renderProjects(DEFAULT_PROJECTS, true);
        } else {
            renderProjects(projects, false);
        }

    } catch (err) {
        console.error('Error fetching from Supabase:', err);
        renderProjects(DEFAULT_PROJECTS, true);
    }
}

function renderProjects(projects, isFallback) {
    const container = document.getElementById('projects-container');
    
    // If we have dynamic projects, clear the static ones
    if (!isFallback) {
        container.innerHTML = '';
        projects.forEach(project => {
            const card = createProjectCard(project);
            container.appendChild(card);
            observer.observe(card);
        });
    } else {
        // If it's a fallback, we already have the static HTML
        // Just ensure animations are observed
        document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
        
        // Add indicator if not already there
        if (!document.querySelector('.fallback-indicator')) {
            const infoMsg = document.createElement('p');
            infoMsg.className = 'fallback-indicator';
            infoMsg.innerHTML = '<i class="fas fa-info-circle"></i> Showing built-in projects. Connect Supabase to manage dynamically.';
            container.after(infoMsg);
        }
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card glass-card hover-lift slide-up';
    
    const badgeClass = project.status === 'live' ? 'live' : 'done';
    const badgeText = project.status === 'live' ? '<span class="live-dot"></span> Live' : 'Delivered';
    const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="project-card-header">
            <div class="project-icon"><i class="${project.icon_class || 'fas fa-project-diagram'}"></i></div>
            <div class="project-badge ${badgeClass}">${badgeText}</div>
        </div>
        <h3>${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        ${project.url ? `
        <a href="${project.url}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i> View Project
        </a>` : ''}
    `;
    
    return card;
}

// Initial fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    
    // Observe existing static elements
    document.querySelectorAll('.slide-up').forEach((element) => {
        observer.observe(element);
    });
});
