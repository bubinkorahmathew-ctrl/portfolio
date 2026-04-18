// Admin Portal Logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
});

// -- Authentication Logic --

const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Login success
            checkAuthState();
        } catch (err) {
            authError.textContent = err.message;
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        checkAuthState();
    });
}

async function checkAuthState() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (session) {
        loginContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        document.getElementById('user-email').textContent = session.user.email;
        loadAdminProjects();
    } else {
        loginContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
}

// -- Project Management Logic --

async function loadAdminProjects() {
    const grid = document.getElementById('admin-projects-grid');
    grid.innerHTML = '<p>Loading projects...</p>';

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        grid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'admin-card glass-card';
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
                <div class="admin-card-actions">
                    <button class="btn btn-icon btn-edit" onclick="editProject(${JSON.stringify(project).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-icon btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = `<p class="error-msg">${err.message}</p>`;
    }
}

// Modal handling
const modal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');

function openModal(project = null) {
    modal.classList.remove('hidden');
    if (project) {
        document.getElementById('modal-title').textContent = 'Edit Project';
        document.getElementById('project-id').value = project.id;
        document.getElementById('p-title').value = project.title;
        document.getElementById('p-desc').value = project.description;
        document.getElementById('p-status').value = project.status;
        document.getElementById('p-url').value = project.url || '';
        document.getElementById('p-icon').value = project.icon_class || '';
        document.getElementById('p-tags').value = project.tags.join(', ');
    } else {
        document.getElementById('modal-title').textContent = 'Add New Project';
        projectForm.reset();
        document.getElementById('project-id').value = '';
    }
}

function closeModal() {
    modal.classList.add('hidden');
}

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const tags = document.getElementById('p-tags').value.split(',').map(t => t.trim()).filter(t => t !== '');
    
    const projectData = {
        title: document.getElementById('p-title').value,
        description: document.getElementById('p-desc').value,
        status: document.getElementById('p-status').value,
        url: document.getElementById('p-url').value,
        icon_class: document.getElementById('p-icon').value,
        tags: tags
    };

    try {
        let error;
        if (id) {
            // Update
            const { error: err } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', id);
            error = err;
        } else {
            // Insert
            const { error: err } = await supabase
                .from('projects')
                .insert([projectData]);
            error = err;
        }

        if (error) throw error;
        
        closeModal();
        loadAdminProjects();
    } catch (err) {
        alert('Error saving project: ' + err.message);
    }
});

window.editProject = (project) => {
    openModal(project);
};

window.deleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            loadAdminProjects();
        } catch (err) {
            alert('Error deleting project: ' + err.message);
        }
    }
};
