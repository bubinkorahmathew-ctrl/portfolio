// Admin Portal Logic
document.addEventListener('DOMContentLoaded', () => {
    // Safety check for Supabase initialization
    if (!supabase || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        const authError = document.getElementById('auth-error');
        if (authError) {
            authError.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 8px; border: 1px solid var(--danger); margin-top: 20px;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    <strong>Configuration Missing:</strong> <br>
                    Please update <code>js/config.js</code> with your Supabase URL and Anon Key.
                </div>
            `;
        }
        console.error('Supabase not configured. Check js/config.js');
        return;
    }
    
    checkAuthState();
});

// -- Authentication Logic --

const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const loginSubmit = document.getElementById('login-submit');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const fillDemoBtn = document.getElementById('fill-demo');

// Handle Demo Login Filling
if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
        document.getElementById('email').value = 'admin@example.com';
        passwordInput.value = 'password';
        
        // Visual feedback
        fillDemoBtn.innerHTML = '<i class="fas fa-check"></i> Credentials Filled!';
        setTimeout(() => {
            fillDemoBtn.innerHTML = '<i class="fas fa-magic"></i> Use Default Login';
        }, 2000);
    });
}

// Toggle Password Visibility
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const authCard = document.querySelector('.auth-card');

        // Set Loading State
        setLoading(true);
        authError.textContent = '';
        authCard.classList.remove('shake');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Login success
            checkAuthState();
        } catch (err) {
            // Error handling
            authError.textContent = err.message || 'Invalid login credentials';
            authCard.classList.add('shake');
            
            // Clear password on error
            passwordInput.value = '';
            
            // Log for debugging
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    });
}

function setLoading(isLoading) {
    if (!loginSubmit) return;
    
    const btnText = loginSubmit.querySelector('.btn-text');
    const btnLoader = loginSubmit.querySelector('.btn-loader');
    
    if (isLoading) {
        loginSubmit.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        loginSubmit.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
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
        console.error('Error loading admin projects:', err);
        let errorMsg = err.message;
        
        if (errorMsg.includes('relation "projects" does not exist')) {
            errorMsg = "Database table 'projects' missing. Please run setup SQL.";
        } else if (err.code === 'PGRST301') {
            errorMsg = "Permission denied. Check RLS policies.";
        }

        grid.innerHTML = `<p class="error-msg">${errorMsg}</p>`;
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
