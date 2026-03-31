// navbar-component.js - Version finale (barre défilement horizontale supprimée)
console.log('🟢 Navbar Component chargé - Version finale avec services 2 et 3');

class NavbarComponent {
    constructor() {
        this.stylesAdded = false;
    }

    generateHTML() {
        const isLoggedIn = window.auth && window.auth.isLoggedIn();

        return `
        <a href="index.html" class="logo">
            <img src="images/loji.png" alt="Loji">
        </a>

        <nav class="nav-links">
            <a href="index.html">Accueil</a>

            <div class="dropdown-desktop">
                <a href="#" class="nav-link">
                    Service <i class="fa-solid fa-chevron-down ml-1 text-xs arrow-icon"></i>
                </a>
                
                <div class="dropdown-content-desktop">
                    <div class="mega-menu-container-desktop">
                        <div class="menu-column-desktop">
                            <div class="column-title-desktop">Nos Services</div>
                            <a href="annonces.html">Location</a>
                            <a href="annonces.html">Achat</a>
                            <a href="annonces.html">Vente de terrain</a>
                            <a href="#">Neuf / Programme</a>
                        </div>

                        <div class="menu-column-desktop">
                            <div class="column-title-desktop">Services Additionnels</div>
                            <a href="page-service1.html">Gérer votre bien</a>
                            <a href="page-service2.html">Déménagement</a>
                            <a href="#">Estimer mon bien</a>
                            <a href="page-service3.html">Solution pour agence</a>
                        </div>
                    </div>
                </div>
            </div>

            <a href="#">Blog</a>
          
            <div class="dropdown">
                <a href="#" class="dropdown-trigger">Contact <i class="fas fa-chevron-down text-xs ml-1 arrow-icon"></i></a>
                <div class="dropdown-content">
                    <a href="tel:0748345939">07 48 34 59 39</a>
                    <a href="tel:0152253835">01 52 25 38 35</a>
                </div>
            </div>
        </nav>

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

        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-inner">
                <nav class="mobile-nav-links">
                    <a href="index.html">Accueil</a>

                    <div class="mobile-dropdown-container">
                        <div class="mobile-dropdown-header">
                            <span>Services</span>
                            <i class="fas fa-chevron-down arrow-icon"></i>
                        </div>
                        <div class="mobile-dropdown-content">
                            <a href="annonces.html">Location</a>
                            <a href="annonces.html">Achat</a>
                            <a href="annonces.html">Vente de terrain</a>
                            <a href="#">Neuf / Programme</a>
                            <a href="page-service1.html">Gérer votre bien</a>
                            <a href="page-service2.html">Déménagement</a>
                            <a href="#">Estimer mon bien</a>
                            <a href="page-service3.html">Solution pour agence</a>
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
        </div>
        `;
    }

    render() {
        let navbarContainer = document.getElementById('navbar');
        if (!navbarContainer) {
            navbarContainer = document.createElement('header');
            navbarContainer.className = 'navbar';
            navbarContainer.id = 'navbar';
            document.body.insertBefore(navbarContainer, document.body.firstChild);
        }
        navbarContainer.innerHTML = this.generateHTML();
        this.addStyles();
        this.initEvents();
    }

    addStyles() {
        if (this.stylesAdded) return;
        const styleId = 'navbar-component-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ========== STYLES NAVBAR ========== */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            html, body {
                overflow-x: hidden;
                width: 100%;
            }
            
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
                height: 112px;
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
                color: #0057FF;
            }
            
            .auth-buttons {
                display: flex;
                gap: 12px;
                align-items: center;
                flex-shrink: 0;
            }
            
            .login-btn {
                background: #0057FF;
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
                background: #0041CC;
            }
            
            .signup-btn {
                background: transparent;
                color: #0057FF;
                border: 2px solid #0057FF;
                padding: 6px 14px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .signup-btn:hover {
                background: #0057FF;
                color: white;
            }
            
            .user-menu {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .profile-icon-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #0057FF;
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
                background: #0041CC;
                transform: scale(1.05);
                border-color: #003399;
            }
            
            .logout-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                background: transparent;
                color: #000000;
                border: 2px solid #000000;
                padding: 8px 16px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .logout-btn:hover {
                background: #000000;
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
                color: #0057FF;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #0057FF;
                position: relative;
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
                color: #0057FF;
                background-color: #f1f5f9;
                transform: translateX(5px);
                padding-left: 20px;
            }
            
            .dropdown-desktop > a .fa-chevron-down {
                transition: transform 0.3s ease;
            }
            
            .dropdown-desktop:hover > a .fa-chevron-down {
                transform: rotate(180deg);
            }
            
            /* ========== CONTACT DROPDOWN ========== */
            .dropdown {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .dropdown-trigger {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            
            .arrow-icon {
                font-size: 0.7rem !important;
                color: #000000 !important;
                transition: transform 0.2s ease;
            }
            
            .dropdown:hover .arrow-icon {
                transform: rotate(180deg);
                color: #000000 !important;
            }
            
            .dropdown-content {
                position: absolute;
                top: 115%;
                right: 0;
                transform: translateY(8px);
                background-color: #ffffff;
                min-width: 210px;
                border-radius: 12px;
                box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
                padding: 8px 0;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                border: 1px solid #e5e7eb;
                transition: all 0.22s ease;
            }
            
            .dropdown:hover .dropdown-content {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .dropdown-content a {
                color: #111827;
                padding: 10px 18px;
                text-decoration: none;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: 0.2s;
            }
            
            .dropdown-content a:hover {
                background-color: #f3f4f6;
                padding-left: 22px;
            }
            
            /* ========== MENU MOBILE ========== */
            .hamburger-menu {
                display: none;
                flex-direction: column;
                justify-content: space-between;
                width: 24px;
                height: 18px;
                background: transparent;
                border: none;
                z-index: 10001;
                position: relative;
                cursor: pointer;
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
            
            /* Verrou scroll global quand menu ouvert */
            html.mobile-menu-open,
            html.mobile-menu-open body {
                overflow: hidden !important;
                height: 100% !important;
                position: relative;
            }
            
            .mobile-menu {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: calc(100vh - 70px);
                background: white;
                z-index: 9999;
                transform: translateX(-100%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            
            .mobile-menu.active {
                transform: translateX(0);
            }
            
            .mobile-menu-inner {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 12px 5% 16px;
                overflow-y: auto;
                overflow-x: hidden;
                -webkit-overflow-scrolling: touch;
                -ms-overflow-style: none;  /* Masque la scrollbar sur IE et Edge */
                scrollbar-width: none;  /* Masque la scrollbar sur Firefox */
            }
            
            /* Masque la scrollbar sur les navigateurs WebKit (Chrome, Safari, etc.) */
            .mobile-menu-inner::-webkit-scrollbar {
                display: none;
            }
            
            .mobile-nav-links {
                flex: 1 1 auto;
                overflow-y: visible;
                display: flex;
                flex-direction: column;
            }
            
            .mobile-nav-links > a {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                padding: 12px 0;
                font-size: 1.05rem;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .mobile-dropdown-container {
                border-bottom: 1px solid #f0f0f0;
                overflow-x: hidden;
            }
            
            .mobile-dropdown-header {
                padding: 12px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                font-weight: 500;
                color: #333;
                font-size: 1.05rem;
                user-select: none;
            }
            
            .mobile-dropdown-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                padding-left: 20px;
                overflow-x: hidden;
            }
            
            .mobile-dropdown-container.active .mobile-dropdown-content {
                max-height: 400px;
                padding-bottom: 12px;
            }
            
            .mobile-dropdown-content a {
                display: block;
                padding: 10px 0;
                color: #333;
                text-decoration: none;
                font-size: 0.95rem;
                transition: color 0.3s ease;
                white-space: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            
            .mobile-dropdown-content a:hover {
                color: #0057FF;
            }
            
            .mobile-dropdown-container.active .mobile-dropdown-header .arrow-icon {
                transform: rotate(180deg);
            }
            
            .mobile-auth-buttons {
                flex-shrink: 0;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 2px solid #f0f0f0;
            }
            
            .mobile-auth-buttons .signup-btn,
            .mobile-auth-buttons .login-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 10px;
                font-weight: 500;
                text-decoration: none;
                width: 100%;
                box-sizing: border-box;
            }
            
            .mobile-user-menu {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .mobile-profile-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background: #0057FF;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 500;
                width: 100%;
            }
            
            .mobile-logout-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background: #000000;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 500;
                width: 100%;
                cursor: pointer;
                border: none;
            }
            
            @media (max-width: 768px) {
                .nav-links, .auth-buttons {
                    display: none;
                }
                .hamburger-menu {
                    display: flex;
                }
                .navbar {
                    height: 70px;
                }
                .logo img {
                    height: 92px;
                }
                .logo {
                    margin-left: -40px;
                }
                body {
                    overflow-x: hidden;
                    padding-top: 70px;
                }
            }
            
            @media (max-width: 380px) {
                .mobile-menu-inner {
                    padding: 8px 5% 12px;
                }
                .mobile-nav-links > a,
                .mobile-dropdown-header {
                    padding: 10px 0;
                    font-size: 1rem;
                }
                .mobile-dropdown-content a {
                    padding: 8px 0;
                    font-size: 0.9rem;
                }
                .mobile-dropdown-container.active .mobile-dropdown-content {
                    max-height: 360px;
                }
                .mobile-auth-buttons .signup-btn,
                .mobile-auth-buttons .login-btn,
                .mobile-profile-icon,
                .mobile-logout-btn {
                    padding: 10px 16px;
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                }
            }
        `;

        document.head.appendChild(style);
        this.stylesAdded = true;
    }

    initEvents() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (hamburgerMenu && mobileMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburgerMenu.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                const isOpen = mobileMenu.classList.contains('active');
                document.documentElement.classList.toggle('mobile-menu-open', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        }

        // Menus déroulants mobile
        document.querySelectorAll('.mobile-dropdown-header').forEach(header => {
            header.addEventListener('click', () => {
                const container = header.parentElement;
                container.classList.toggle('active');
                
                // Fermer les autres dropdowns
                document.querySelectorAll('.mobile-dropdown-container').forEach(other => {
                    if (other !== container) {
                        other.classList.remove('active');
                    }
                });
            });
        });

        // Fermer le menu mobile en cliquant sur un lien
        document.querySelectorAll('.mobile-nav-links a, .mobile-dropdown-content a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu?.classList.remove('active');
                mobileMenu?.classList.remove('active');
                document.documentElement.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            });
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !hamburgerMenu?.contains(e.target)) {
                hamburgerMenu?.classList.remove('active');
                mobileMenu?.classList.remove('active');
                document.documentElement.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        });

        // Fermer avec la touche Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
                hamburgerMenu?.classList.remove('active');
                mobileMenu?.classList.remove('active');
                document.documentElement.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        });

        // Gérer la déconnexion
        const logoutHandler = (e) => {
            e.preventDefault();
            if (window.auth) window.auth.logout();
        };

        const logoutBtn = document.getElementById('logoutBtn');
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        
        if (logoutBtn) logoutBtn.addEventListener('click', logoutHandler);
        if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logoutHandler);

        // Initialiser les menus desktop
        this.initDesktopDropdowns();
    }

    initDesktopDropdowns() {
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

        const contactDropdown = document.querySelector('.dropdown');
        if (contactDropdown) {
            const contactContent = contactDropdown.querySelector('.dropdown-content');

            contactDropdown.addEventListener('mouseenter', () => {
                if (contactContent) {
                    contactContent.style.opacity = '1';
                    contactContent.style.visibility = 'visible';
                    contactContent.style.transform = 'translateY(0)';
                }
            });

            contactDropdown.addEventListener('mouseleave', () => {
                if (contactContent) {
                    contactContent.style.opacity = '0';
                    contactContent.style.visibility = 'hidden';
                    contactContent.style.transform = 'translateY(8px)';
                }
            });
        }
    }
}

function renderNavbar() {
    const navbar = new NavbarComponent();
    navbar.render();
}

document.addEventListener('DOMContentLoaded', renderNavbar);
window.addEventListener('authStateChanged', renderNavbar);