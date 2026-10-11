// -- Project Data --
// Single source of truth for the "Key Projects" section.
// To add/edit a project, change this array only — cards and filters render from it.
//
// category: products | erp-pos | websites | infra
// status:   Live | In Development | Beta | Delivered | Completed
// link:     { label, url } or null (null → no button, role is shown instead)
// image:    path under images/projects/ or null (null → gradient placeholder)
// Highlights containing "[PLACEHOLDER" are skipped when rendering.

const PROJECT_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'products', label: 'Products' },
    { id: 'erp-pos', label: 'ERP & POS' },
    { id: 'websites', label: 'Websites' },
    { id: 'infra', label: 'IT Infrastructure' }
];

const PROJECTS = [
    // ---------- PRODUCTS ----------
    {
        id: 'routewings',
        title: 'Routewings',
        subtitle: 'Van Sales & Route POS Platform (SaaS)',
        category: 'products',
        status: 'In Development',
        role: 'Product Owner & Architect',
        client: null,
        description: 'Multi-tenant SaaS platform for van sales and route-based distribution. Salesmen sell, invoice and collect in the field — even offline — while managers track routes, stock and cash in real time.',
        highlights: [
            'ZATCA Phase 1 & 2 e-invoicing with thermal and A4 PDF invoices',
            'Offline-first mobile web app with GPS customer mapping and geofenced check-in',
            'Virtual van stock, daily loading/closing and cash reconciliation',
            'Optional two-way Odoo ERP connector'
        ],
        tags: ['NestJS', 'PostgreSQL', 'Next.js', 'ZATCA', 'Odoo Integration', 'SaaS'],
        link: null, // TODO: add demo link when available
        image: null, // TODO: add images/projects/routewings.png and set image: 'images/projects/routewings.png'
        icon: 'fas fa-truck'
    },
    {
        id: 'zatca-billing',
        title: 'ZATCA Billing Software',
        subtitle: 'Desktop Billing for Small Shops',
        category: 'products',
        status: 'In Development',
        role: 'Developer',
        client: null,
        description: 'Standalone desktop billing application for small retail shops in Saudi Arabia, built from the ground up for ZATCA e-invoicing compliance.',
        highlights: [
            'ZATCA Phase 1 & Phase 2 compliant invoices',
            'Simple, fast checkout designed for non-technical shop owners'
        ],
        tags: ['ZATCA', 'E-Invoicing', 'Desktop App', 'Retail'],
        link: null,
        image: null,
        icon: 'fas fa-receipt'
    },
    {
        id: 'ossae-exam',
        title: 'OSSAE Online Exam Portal',
        subtitle: 'Bilingual Sunday School Exam Platform',
        category: 'products',
        status: 'Live',
        role: 'Developer',
        client: null,
        description: 'Online exam platform for OSSAE Desert Land Central Region (Thrissur Diocese) with English/Malayalam question banks for Classes 5–12.',
        highlights: [
            '25 randomized questions per attempt, auto-scored instantly',
            'Fully bilingual (English / Malayalam), one link per class'
        ],
        tags: ['Web App', 'Bilingual', 'Vercel', 'Education'],
        link: { label: 'View Project', url: 'https://ossaedesertland-central.vercel.app/' },
        image: null,
        icon: 'fas fa-graduation-cap'
    },
    {
        id: 'knockout-os',
        title: 'Knockout OS',
        subtitle: 'Boxing Academy Management Software',
        category: 'products',
        status: 'Live',
        role: 'Developer',
        client: null,
        description: 'Developed a comprehensive system for training centers to manage students, coaches, attendance, fees, salaries, and daily operations.',
        target: 'Boxing Academies & Small Sports Businesses',
        highlights: [],
        tags: ['AI-Assisted Development', 'Academy Ops', 'Finance Tracking'],
        // TODO: URL contains typo "acadamy" — update if the Vercel project is renamed
        link: { label: 'View Project', url: 'https://punchacadamy.vercel.app/' },
        image: null,
        icon: 'fas fa-users-cog'
    },
    {
        id: 'gymflow-pro',
        title: 'GymFlow Pro',
        subtitle: 'Gym & Fitness Management Software',
        category: 'products',
        status: 'Beta',
        role: 'Developer',
        client: null,
        description: 'Developed a practical management solution for fitness centers. Efficiently handles member registration, attendance, coach schedules, and expense tracking.',
        target: 'Gyms & Personal Training Centers',
        highlights: [],
        tags: ['AI-Assisted Development', 'Gym Ops', 'Member Management'],
        link: null, // TODO: add demo link or screenshots
        image: null,
        icon: 'fas fa-dumbbell'
    },

    // ---------- ERP & POS ----------
    {
        id: 'odoo-whatsapp-crm',
        title: 'Odoo 19 WhatsApp CRM Integration',
        subtitle: 'Odoo 19 Enterprise (On-Premise)',
        category: 'erp-pos',
        status: 'In Development',
        role: 'Odoo Consultant',
        client: 'Trading company, KSA',
        description: 'Odoo 19 Enterprise (on-premise) implementation connecting WhatsApp conversations directly to the CRM and sales pipeline.',
        highlights: [
            'WhatsApp-to-Odoo lead capture and follow-up workflow',
            'End-to-end CRM → Quotation → Sales process',
            'Optimised quotation templates and product/pricing structure'
        ],
        tags: ['Odoo 19', 'CRM', 'WhatsApp', 'Sales Automation'],
        link: null,
        image: null,
        icon: 'fab fa-whatsapp'
    },
    {
        id: 'restaurant-pos',
        title: 'Multi-branch Restaurant POS Implementation',
        subtitle: null,
        category: 'erp-pos',
        status: 'Delivered',
        role: 'Implementation Lead',
        client: null,
        description: 'End-to-end deployment of centralized POS ecosystems across multiple locations, optimizing order flow and real-time inventory tracking for high-volume operations.',
        // TODO: fill in the placeholders below — unfilled ones are hidden on the page
        highlights: [
            '[PLACEHOLDER: number of branches]',
            '[PLACEHOLDER: number of terminals]',
            '[PLACEHOLDER: key result]'
        ],
        tags: ['POS Systems', 'Networking', 'Inventory Control'],
        link: null,
        image: null,
        icon: 'fas fa-utensils'
    },
    {
        id: 'odoo-community',
        title: 'Odoo ERP Community Implementation',
        subtitle: null,
        category: 'erp-pos',
        status: 'Delivered',
        role: 'Solutions Architect',
        client: null,
        description: 'Customized Odoo ERP deployment for retail and FMCG sectors, focusing on Accounting, HR, and Supply Chain automation to streamline business processes.',
        highlights: [],
        tags: ['Odoo', 'Python', 'ERP'],
        link: null,
        image: null,
        icon: 'fas fa-cogs'
    },

    // ---------- WEBSITES ----------
    {
        id: 'samku',
        title: 'Samku International',
        subtitle: 'Bilingual Corporate Website',
        category: 'websites',
        status: 'Live',
        role: 'Lead IT & Web Developer',
        client: null,
        description: 'Developed a comprehensive corporate website (bilingual). Managed complete IT infrastructure setup including domain registration and Google Workspace email hosting. Integrated interactive elements including WhatsApp business connectivity and an automated chatbot for customer service. Also handled hosting setup and social media integration.',
        highlights: [],
        tags: ['Web Development', 'IT Infrastructure', 'Google Workspace'],
        link: { label: 'Visit Website', url: 'https://samkume.com/' },
        image: null,
        icon: 'fas fa-globe'
    },
    {
        id: 'pos-expert',
        title: 'POS Expert – IT & ERP Solutions',
        subtitle: null,
        category: 'websites',
        status: 'Live',
        role: null,
        client: null,
        description: 'Leading IT solutions provider specializing in custom ERP implementations and point-of-sale systems in Saudi Arabia.',
        highlights: [],
        tags: ['ERP', 'POS', 'IT Support'],
        link: { label: 'View Project', url: 'https://posexpertech.com/' },
        image: null,
        icon: 'fas fa-laptop-code'
    },
    {
        id: 'sparkwings',
        title: 'Sparkwings Innovations',
        subtitle: 'Official Odoo Partner',
        category: 'websites',
        status: 'Live',
        role: 'Founder',
        client: null,
        description: 'My IT company — an official Odoo partner delivering ERP implementations, custom software products, web development and IT infrastructure.',
        highlights: [],
        tags: ['Odoo Partner', 'Custom Software', 'ERP', 'IT Solutions'],
        link: { label: 'View Project', url: 'https://sparkwings.co.in/' },
        image: null,
        icon: 'fas fa-bolt'
    },
    {
        id: 'nishad-cv',
        title: 'Nishad CV – Senior Accounts Manager',
        subtitle: null,
        category: 'websites',
        status: 'Live',
        role: null,
        client: null,
        description: 'A professional digital CV showcasing 17+ years of financial expertise, VAT management, and ZATCA e-invoicing.',
        highlights: [],
        tags: ['HTML5', 'CSS3', 'JavaScript'],
        link: { label: 'View Project', url: 'https://nishadcv-354l.vercel.app/' },
        image: null,
        icon: 'fas fa-file-invoice-dollar'
    },
    {
        id: 'linu-john',
        title: 'Linu John – Supply Chain Portfolio',
        subtitle: null,
        category: 'websites',
        status: 'Live',
        role: null,
        client: null,
        description: 'Sophisticated portfolio specializing in warehouse management, SAP Business One, and inventory control efficiency.',
        highlights: [],
        tags: ['HTML5', 'CSS3', 'SAP'],
        link: { label: 'View Project', url: 'https://poetic-starburst-dcf1cc.netlify.app/' },
        image: null,
        icon: 'fas fa-warehouse'
    },

    // ---------- IT INFRASTRUCTURE ----------
    {
        id: 'domain-workspace',
        title: 'Domain & Google Workspace Setup',
        subtitle: null,
        category: 'infra',
        status: 'Completed',
        role: 'IT Infrastructure Specialist',
        client: 'Eastern International · Sama Musqat Real Estate',
        description: 'Business domain registration and secure professional email hosting via Google Workspace for multiple clients.',
        highlights: [],
        tags: ['Domain Registration', 'Google Workspace', 'Email Hosting'],
        link: null,
        image: null,
        icon: 'fas fa-server'
    }
];
