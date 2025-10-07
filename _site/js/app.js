document.addEventListener('DOMContentLoaded', () => {
    const pageLinksContainer = document.getElementById('page-links-container');
    const iframe = document.getElementById('software-iframe');
    const welcomeMessage = document.getElementById('welcome-message');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const searchInput = document.getElementById('search-input');
    
    let pageLinks = [];

    async function fetchPages() {
        try {
            const response = await fetch('/pages.json');
            const pages = await response.json();
            renderSidebar(pages);
        } catch (error) {
            console.error('Error fetching page data:', error);
            pageLinksContainer.innerHTML = '<p class="error">Could not load pages.</p>';
        }
    }

    function renderSidebar(pages) {
        if (!pages || pages.length === 0) {
            pageLinksContainer.innerHTML = '<p>No pages found.</p>';
            return;
        }
        
        const fragment = document.createDocumentFragment();
        pages.forEach(page => {
            const link = document.createElement('a');
            link.href = page.url;
            link.dataset.iframeSrc = page.data.iframe_url;
            link.innerHTML = `<i class="fa-solid fa-cube"></i> ${page.data.title}`;
            fragment.appendChild(link);
        });
        pageLinksContainer.appendChild(fragment);

        pageLinks = pageLinksContainer.querySelectorAll('a');
        setupEventListeners();
    }

    function handleLinkClick(event) {
        event.preventDefault();
        const link = event.currentTarget;
        welcomeMessage.classList.add('hidden');
        const newSrc = link.dataset.iframeSrc;
        if (iframe.src !== newSrc) { iframe.src = newSrc; }
        pageLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (window.innerWidth <= 768) { sidebar.classList.remove('visible'); }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('visible');
    }

    function filterLinks() {
        const searchTerm = searchInput.value.toLowerCase();
        pageLinks.forEach(link => {
            const title = link.textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        });
    }

    function setupEventListeners() {
        pageLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });
        mobileMenuBtn.addEventListener('click', toggleSidebar);
        mainContent.addEventListener('click', () => {
            if (sidebar.classList.contains('visible')) {
                sidebar.classList.remove('visible');
            }
        });
        searchInput.addEventListener('input', filterLinks);
    }

    fetchPages();
});
