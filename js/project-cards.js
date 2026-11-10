// -- Project card markup --
// Shared by the browser (js/script.js) and the static build (scripts/build-projects.js),
// so pre-rendered and client-rendered cards are identical.

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

function projectCardHTML(rawProject) {
    const project = normalizeProject(rawProject);
    const statusClass = STATUS_CLASSES[(project.status || '').toLowerCase()] || 'status-done';
    const liveDot = statusClass === 'status-live' ? '<span class="live-dot"></span> ' : '';
    const highlights = (project.highlights || []).filter(h => h && !h.includes('[PLACEHOLDER'));

    const media = project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} screenshot" loading="lazy">`
        : `<div class="project-placeholder cat-${escapeHtml(project.category)}" aria-hidden="true"><i class="${escapeHtml(project.icon || 'fas fa-project-diagram')}"></i><span>${escapeHtml(getInitials(project.title))}</span></div>`;

    const footer = project.link
        ? `<a href="${escapeHtml(project.link.url)}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt"></i> ${escapeHtml(project.link.label || 'View Project')}<span class="sr-only"> (opens in a new tab)</span></a>`
        : (project.role ? `<div class="project-role"><i class="fas fa-user-tie"></i> ${escapeHtml(project.role)}</div>` : '');

    const parts = [
        `<div class="project-media">${media}`,
        project.version ? `<div class="project-version"><i class="fas fa-cube"></i> ${escapeHtml(project.version)}</div>` : '',
        `<div class="project-badge ${statusClass}">${liveDot}${escapeHtml(project.status)}</div></div>`,
        `<h3>${escapeHtml(project.title)}</h3>`,
        project.subtitle ? `<p class="project-subtitle">${escapeHtml(project.subtitle)}</p>` : '',
        project.client ? `<p class="project-meta"><strong>${project.client.includes('·') ? 'Clients' : 'Client'}:</strong> ${escapeHtml(project.client)}</p>` : '',
        `<p class="project-desc">${escapeHtml(project.description)}</p>`,
        project.target ? `<p class="project-meta"><strong>Target:</strong> ${escapeHtml(project.target)}</p>` : '',
        highlights.length ? `<ul class="project-highlights">${highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : '',
        `<div class="project-tags">${(project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`,
        footer
    ].filter(Boolean);

    return `<article class="project-card light-card hover-lift slide-up" data-category="${escapeHtml(project.category)}">\n    ${parts.join('\n    ')}\n</article>`;
}

function projectTabsHTML(categories) {
    return categories.map((cat, i) =>
        `<button type="button" role="tab" class="project-tab${i === 0 ? ' active' : ''}" id="tab-${escapeHtml(cat.id)}" data-filter="${escapeHtml(cat.id)}" aria-controls="projects-container" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${escapeHtml(cat.label)}</button>`
    ).join('\n');
}
