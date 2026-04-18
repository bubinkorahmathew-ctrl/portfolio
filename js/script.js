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

// Dynamic Project Loading
async function fetchProjects() {
    const container = document.getElementById('projects-container');
    
    // Check if Supabase is configured
    if (!supabase || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        container.innerHTML = `<p class="error-msg">Supabase not configured. Please check config.js.</p>`;
        return;
    }

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        // Clear loading spinner
        container.innerHTML = '';

        if (projects.length === 0) {
            container.innerHTML = '<p>No projects found. Add some in the Admin Portal!</p>';
            return;
        }

        projects.forEach(project => {
            const card = createProjectCard(project);
            container.appendChild(card);
            // Observe the new card for animations
            observer.observe(card);
        });

    } catch (err) {
        console.error('Error fetching projects:', err);
        container.innerHTML = `<p class="error-msg">Failed to load projects. Ensure the 'projects' table exists in Supabase.</p>`;
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
