// navbar-component.js - VERSION AVEC ICÔNE PROFIL
console.log('🟢 Navbar Component chargé');

class NavbarComponent {
    constructor() {
        this.stylesAdded = false;
    }

    // Génère le HTML de la navbar (mode connecté/déconnecté)
    generateHTML() {
        const isLoggedIn = window.auth && window.auth.isLoggedIn();

        return `
        <a href="index.html" class="logo">
            <img src="images/loji.png" alt="Loji">
        </a>

        <nav class="nav-links">
            <a href="index.html">Accueil</a>

            <!-- MEGA MENU Service - IDENTIQUE À INDEX.HTML -->
            <div class="dropdown-desktop">
                <a href="#" class="nav-link">
                    Service <i class="fa-solid fa-chevron-down ml-1 text-xs"></i>
                </a>
                
                <div class="dropdown-content-desktop">
                    <div class="mega-menu-container-desktop">
                        <div class="menu-column-desktop">
                            <div class="column-title-desktop">Nos Services</div>
                            <a href="#">Location</a>
                            <a href="#">Achat</a>
                            <a href="#">Vente de terrain</a>
                            <a href="#">Neuf / Programme</a>
                        </div>

                        <div class="menu-column-desktop">
                            <div class="column-title-desktop">Services Additionnels</div>
                            <a href="#">Gérer votre bien</a>
                            <a href="#">Estimer mon bien</a>
                            <a href="#">Conseils financiers</a>
                            <a href="#">FAQ / Aide</a>
                        </div>
                    </div>
                </div>
            </div>

            <a href="#">Blog</a>
          
            <!-- Menu déroulant Contact - IDENTIQUE À INDEX.HTML -->
            <div class="dropdown">
                <a href="#" class="dropdown-trigger">Contact <i class="fas fa-chevron-down text-xs ml-1"></i></a>
                <div class="dropdown-content">
                    <a href="tel:0748345939">07 48 34 59 39</a>
                    <a href="tel:0152253835">01 52 25 38 35</a>
                </div>
            </div>
        </nav>

        <!-- BOUTONS AUTH -->
        <div class="auth-buttons">
            ${isLoggedIn ? `
                <div class="user-menu">
                    <a href="user-dashboard.html" class="profile-icon-btn" title="Mon Espace">
                        <i class="fas fa-user"></i>
                    </a>
                    <a href="#" id="logoutBtn" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span class="logout-text">Déconnexion</span>
                    </a>
                </div>
            ` : `
                <a href="inscription.html" class="signup-btn">S'inscrire</a>
                <a href="connexion.html" class="login-btn">Connexion</a>
            `}
        </div>

        <button class="hamburger-menu" id="hamburgerMenu">
            <span></span><span></span><span></span>
        </button>

        <!-- MENU MOBILE -->
        <div class="mobile-menu" id="mobileMenu">
            <nav class="mobile-nav-links">
                <a href="index.html">Accueil</a>

                <div class="mobile-dropdown-container">
                    <div class="mobile-dropdown-header">
                        <span>Services</span>
                        <i class="fas fa-chevron-down arrow-icon"></i>
                    </div>
                    <div class="mobile-dropdown-content">
                        <a href="#">Location</a>
                        <a href="#">Achat</a>
                        <a href="#">Vente</a>
                        <a href="#">Résidence meublée</a>
                        <a href="#">Déménagement</a>
                    </div>
                </div>

                <div class="mobile-dropdown-container">
                    <div class="mobile-dropdown-header">
                        <span>Contact</span>
                        <i class="fas fa-chevron-down arrow-icon"></i>
                    </div>
                    <div class="mobile-dropdown-content">
                        <a href="tel:0748345939">07 48 34 59 39</a>
                        <a href="tel:0152253835">01 52 25 38 35</a>
                    </div>
                </div>
            </nav>
            
            <!-- AUTH MOBILE -->
            <div class="mobile-auth-buttons">
                ${isLoggedIn ? `
                    <div class="mobile-user-menu">
                        <a href="user-dashboard.html" class="mobile-profile-icon">
                            <i class="fas fa-user-circle"></i>
                            <span>Mon Profil</span>
                        </a>
                        <a href="#" id="mobileLogoutBtn" class="mobile-logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Déconnexion</span>
                        </a>
                    </div>
                ` : `
                    <a href="inscription.html" class="signup-btn">S'inscrire</a>
                    <a href="connexion.html" class="login-btn">Connexion</a>
                `}
            </div>
        </div>
        `;
    }

    // Injecte la navbar dans la page
    render() {
        console.log('🟢 Injection de la navbar...');

        // Trouver ou créer le container navbar
        let navbarContainer = document.getElementById('navbar');

        if (!navbarContainer) {
            navbarContainer = document.createElement('header');
            navbarContainer.className = 'navbar';
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }

        // Injecter le HTML
        navbarContainer.innerHTML = this.generateHTML();

        // Ajouter les styles si nécessaire
        this.addStyles();

        // Initialiser les événements
        this.initEvents();

        console.log('✅ Navbar injectée avec succès!');
    }

    // Ajoute les styles CSS spécifiques
    addStyles() {
        if (this.stylesAdded) return;

        const styleId = 'navbar-component-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ========== NAVBAR STYLES ========== */
            .navbar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: white;
                border-bottom: 0.5px solid #acacac;
                padding: 10px 5%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10000;
                height: 75px;
                transition: transform 0.3s ease;
            }
            
            .logo {
                display: flex;
                align-items: center;
                text-decoration: none;
                height: 100%;
                flex-shrink: 0;
            }
            
            .logo img {
                height: 60px;
                width: auto;
                object-fit: contain;
            }
            
            .nav-links {
                display: flex;
                gap: 30px;
                align-items: center;
                margin: 0 auto;
            }
            
            .nav-links a {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                transition: color 0.3s ease;
                white-space: nowrap;
                font-size: 0.95rem;
            }
            
            .nav-links a:hover {
                color: #10b981;
            }
            
            /* ========== BOUTONS AUTH ========== */
            .auth-buttons {
                display: flex;
                gap: 12px;
                align-items: center;
                flex-shrink: 0;
            }
            
            .login-btn {
                background: #12c73fcb;
                color: white;
                padding: 8px 16px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .login-btn:hover {
                background: #059669;
            }
            
            .signup-btn {
                background: transparent;
                color: #12c73fcb;
                border: 2px solid #12c73fcb;
                padding: 6px 14px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .signup-btn:hover {
                background: #10b981;
                color: white;
            }
            
            /* ========== USER MENU (CONNECTÉ) ========== */
            .user-menu {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .profile-icon-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #10b981;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                border: 2px solid transparent;
            }
            
            .profile-icon-btn:hover {
                background: #059669;
                transform: scale(1.05);
                border-color: #047857;
            }
            
            .logout-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                background: transparent;
                color: #ef4444;
                border: 2px solid #ef4444;
                padding: 8px 16px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .logout-btn:hover {
                background: #ef4444;
                color: white;
            }
            
            .logout-text {
                display: inline;
            }
            
            /* ========== MEGA MENU SERVICE ========== */
            .dropdown-desktop {
                position: relative;
                display: flex;
                align-items: center;
                height: 100%;
                cursor: pointer;
            }
            
            .dropdown-content-desktop {
                position: fixed;
                top: 75px;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border-top: 1px solid #e2e8f0;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                padding: 40px 5%;
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-15px);
                transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            
            .dropdown-desktop:hover .dropdown-content-desktop {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .mega-menu-container-desktop {
                display: flex;
                justify-content: space-between;
                gap: 60px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .menu-column-desktop {
                flex: 1;
                padding: 0 15px;
            }
            
            .column-title-desktop {
                font-size: 1.2rem;
                font-weight: 700;
                color: #1ebe33;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #5fca4a;
                position: relative;
            }
            
            .column-title-desktop::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 40px;
                height: 2px;
                background: #10b981;
            }
            
            .dropdown-content-desktop a {
                color: #374151;
                padding: 12px 0;
                text-decoration: none;
                font-size: 1rem;
                font-weight: 500;
                display: block;
                transition: all 0.3s ease;
                border-radius: 6px;
                padding-left: 15px;
                position: relative;
            }
            
            .dropdown-content-desktop a:hover {
                color: #31c269;
                background-color: #f1f5f9;
                transform: translateX(5px);
                padding-left: 20px;
            }
            
            .dropdown-content-desktop a::before {
                content: '›';
                position: absolute;
                left: 0;
                color: #3b82f6;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .dropdown-content-desktop a:hover::before {
                opacity: 1;
            }
            
            .dropdown-desktop > a .fa-chevron-down {
                transition: transform 0.3s ease;
            }
            
            .dropdown-desktop:hover > a .fa-chevron-down {
                transform: rotate(180deg);
            }
            
            /* ========== MENU DÉROULANT CONTACT ========== */
            .dropdown {
                position: relative;
            }
            
            .dropdown-content {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(10px);
                background-color: #ffffff;
                min-width: 180px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                padding: 10px 0;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease-in-out;
            }
            
            .dropdown:hover .dropdown-content {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(0);
            }
            
            .dropdown-content a {
                color: #333;
                padding: 10px 20px;
                text-decoration: none;
                font-size: 0.9rem;
                display: block;
                transition: all 0.3s ease;
            }
            
            .dropdown-content a:hover {
                background-color: #f8fafc;
                color: #10b981;
            }
            
            /* ========== MENU HAMBURGER ========== */
            .hamburger-menu {
                display: none;
                flex-direction: column;
                justify-content: space-between;
                width: 24px;
                height: 18px;
                background: transparent;
                border: none;
                cursor: pointer;
                z-index: 10001;
                position: relative;
            }
            
            .hamburger-menu span {
                display: block;
                height: 2px;
                width: 100%;
                background: #333;
                transition: all 0.3s ease;
            }
            
            .hamburger-menu.active span:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .hamburger-menu.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger-menu.active span:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            /* ========== MENU MOBILE - ANIMATION GAUCHE VERS DROITE ========== */
            .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: white;
                padding-top: 95px;
                padding-left: 5%;
                padding-right: 5%;
                padding-bottom: 30px;
                z-index: 9999;
                overflow-y: auto;
                transform: translateX(-100%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .mobile-menu.active {
                transform: translateX(0);
            }
            
            .mobile-nav-links {
                display: flex;
                flex-direction: column;
                gap: 0;
            }
            
            .mobile-nav-links > a {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                padding: 15px 0;
                font-size: 1.1rem;
                transition: color 0.3s ease;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .mobile-nav-links > a:hover {
                color: #10b981;
            }
            
            /* Dropdown mobile en accordéon */
            .mobile-dropdown-container {
                border-bottom: 1px solid #f0f0f0;
            }
            
            .mobile-dropdown-header {
                padding: 15px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                font-weight: 500;
                color: #333;
                font-size: 1.1rem;
                user-select: none;
            }
            
            .mobile-dropdown-header:hover {
                color: #10b981;
            }
            
            .mobile-dropdown-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                padding-left: 20px;
            }
            
            .mobile-dropdown-container.active .mobile-dropdown-content {
                max-height: 500px;
                padding-bottom: 10px;
            }
            
            .mobile-dropdown-content a {
                display: block;
                padding: 12px 0;
                color: #e4e4e4ff;
                text-decoration: none;
                font-size: 1rem;
                transition: color 0.3s ease;
            }
            
            .mobile-dropdown-content a:hover {
                color: #10b981;
            }
            
            .arrow-icon {
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }
            
            .mobile-dropdown-container.active .arrow-icon {
                transform: rotate(180deg);
            }
            
            /* ========== AUTH MOBILE ========== */
            .mobile-auth-buttons {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
            }
            
            .mobile-auth-buttons .signup-btn {
                display: block;
                text-align: center;
                padding: 12px 20px;
                margin-bottom: 10px;
            }
            
            .mobile-auth-buttons .login-btn {
                display: block;
                text-align: center;
                padding: 12px 20px;
            }
            
            /* ========== USER MENU MOBILE ========== */
            .mobile-user-menu {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
            }
            
            .mobile-profile-icon {
                display: flex;
                align-items: center;
                gap: 12px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.3s ease;
            }
            
            .mobile-profile-icon:hover {
                background: #059669;
            }
            
            .mobile-profile-icon i {
                font-size: 1.3rem;
            }
            
            .mobile-logout-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                background: #ef4444;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.3s ease;
                text-align: center;
                justify-content: center;
            }
            
            .mobile-logout-btn:hover {
                background: #dc2626;
            }
            
            /* ========== RESPONSIVE ========== */
            @media (max-width: 1024px) {
                .nav-links {
                    gap: 20px;
                }
                
                .nav-links a {
                    font-size: 0.9rem;
                }
            }
            
            @media (max-width: 768px) {
                .navbar {
                    padding: 8px 5%;
                    height: 70px;
                }
                
                .nav-links, .auth-buttons {
                    display: none;
                }
                
                .hamburger-menu {
                    display: flex;
                }
                
                .logo img {
                    height: 50px;
                }
                
                .mobile-menu.active {
                    display: block;
                }
                
                .user-menu {
                    display: none;
                }
            }
            
            @media (max-width: 480px) {
                .logo img {
                    height: 40px;
                }
                
                .hamburger-menu {
                    width: 22px;
                    height: 18px;
                }
                
                .logout-btn {
                    padding: 6px 12px;
                }
                
                .logout-text {
                    font-size: 0.85rem;
                }
            }
        `;

        document.head.appendChild(style);
        this.stylesAdded = true;
    }

    // Initialise tous les événements
    initEvents() {
        // Menu hamburger mobile
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (hamburgerMenu && mobileMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburgerMenu.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Menus déroulants mobile (accordéon) - EXACTEMENT COMME INDEX.HTML
        document.querySelectorAll('.mobile-dropdown-header').forEach(header => {
            header.addEventListener('click', () => {
                const container = header.parentElement;
                const wasActive = container.classList.contains('active');

                // Fermer tous les autres dropdowns
                document.querySelectorAll('.mobile-dropdown-container').forEach(otherContainer => {
                    if (otherContainer !== container) {
                        otherContainer.classList.remove('active');
                    }
                });

                // Toggle le dropdown actuel
                container.classList.toggle('active');
            });
        });

        // Fermer le menu mobile en cliquant sur un lien
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburgerMenu) hamburgerMenu.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (mobileMenu && mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !hamburgerMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Fermer avec la touche Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Initialiser les menus déroulants desktop
        this.initDesktopDropdowns();

        // Header scroll (cacher/montrer la navbar)
        this.initHeaderScroll();

        // Gérer la déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) window.auth.logout();
            });
        }

        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) window.auth.logout();
            });
        }
    }

    initDesktopDropdowns() {
        // MEGA MENU Service
        const serviceDropdown = document.querySelector('.dropdown-desktop');
        if (serviceDropdown) {
            const serviceContent = serviceDropdown.querySelector('.dropdown-content-desktop');

            serviceDropdown.addEventListener('mouseenter', () => {
                if (serviceContent) {
                    serviceContent.style.opacity = '1';
                    serviceContent.style.visibility = 'visible';
                    serviceContent.style.transform = 'translateY(0)';
                }
            });

            serviceDropdown.addEventListener('mouseleave', () => {
                if (serviceContent) {
                    serviceContent.style.opacity = '0';
                    serviceContent.style.visibility = 'hidden';
                    serviceContent.style.transform = 'translateY(-15px)';
                }
            });
        }

        // Menu déroulant Contact
        const contactDropdown = document.querySelector('.dropdown');
        if (contactDropdown) {
            const contactContent = contactDropdown.querySelector('.dropdown-content');

            contactDropdown.addEventListener('mouseenter', () => {
                if (contactContent) {
                    contactContent.style.opacity = '1';
                    contactContent.style.visibility = 'visible';
                    contactContent.style.transform = 'translateX(-50%) translateY(0)';
                }
            });

            contactDropdown.addEventListener('mouseleave', () => {
                if (contactContent) {
                    contactContent.style.opacity = '0';
                    contactContent.style.visibility = 'hidden';
                    contactContent.style.transform = 'translateX(-50%) translateY(10px)';
                }
            });
        }
    }

    initHeaderScroll() {
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');

        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 75) {
                navbar.style.transform = 'translateY(-100%)';
            } else if (currentScrollY < lastScrollY) {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        navbar.addEventListener('mouseenter', () => {
            navbar.style.transform = 'translateY(0)';
        });
    }
}

// Fonction globale pour initialiser la navbar
function renderNavbar() {
    const navbar = new NavbarComponent();
    navbar.render();
}

// Exporter les fonctions globales
window.NavbarComponent = NavbarComponent;
window.renderNavbar = renderNavbar;

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM chargé - Initialisation de la navbar...');
    renderNavbar();
});

console.log('✅ Navbar Component prêt à l\'emploi');

// À la fin du fichier navbar-component.js, ajoutez :

// Écouter les changements d'état d'authentification
window.addEventListener('authStateChanged', function () {
    console.log('État auth changé - Mise à jour navbar...');
    renderNavbar(); // Re-rendre la navbar
});

// Vérifier l'état au chargement
document.addEventListener('DOMContentLoaded', function () {
    // Si déjà connecté sur la page connexion, rediriger
    if (window.location.pathname.includes('connexion.html') ||
        window.location.pathname.includes('inscription.html')) {
        if (window.auth && window.auth.isLoggedIn()) {
            window.location.href = 'index.html';
        }
    }
});