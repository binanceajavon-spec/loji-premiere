// =================================================================
// NAV-MULTIFUNCTION.JS - VERSION FINALE (LOGO DESKTOP AGRANDI)
// =================================================================

console.log('🚀 Chargement de Nav Multifunction (Version finale)...');

class NavMultifunction {
    static rendered = false;

    constructor() {
        this.stylesAdded = false;
        this.updateAuthStatus();

        window.addEventListener('authStateChanged', (e) => {
            console.log('🔄 NavMultifunction: Update auth', e.detail);
            this.updateAuthStatus();
            this.rerender();
        });
    }

    updateAuthStatus() {
        this.isLoggedIn = typeof window.auth !== 'undefined' && window.auth.isLoggedIn && window.auth.isLoggedIn();
        this.userLabel = 'Mon Compte';

        if (this.isLoggedIn && window.auth.getPhone) {
            const phone = window.auth.getPhone();
            if (phone) {
                const cleaned = phone.replace(/\D/g, '');
                if (cleaned.length === 10) {
                    this.userLabel = cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
                } else {
                    this.userLabel = phone;
                }
            }
        } else if (this.isLoggedIn && window.auth.getUser) {
            const user = window.auth.getUser();
            this.userLabel = user.name || 'Mon Compte';
        }
    }

    rerender() {
        const container = document.getElementById('nav-container');
        if (container) {
            container.innerHTML = this.generateHTML();
            this.initEvents();
        }
    }

    loadDependencies() {
        if (!document.querySelector('link[href*="Material+Icons"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="all.min.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    generateHTML() {
        // --- BOUTON CONNECTÉ (DESIGN IDENTIQUE À INDEX.HTML) ---
        const profileButtonHTML = `
            <div class="user-menu">
                <a href="user-dashboard.html" class="profile-icon-btn" title="Mon Espace">
                    <i class="fas fa-user"></i>
                </a>
                <a href="#" id="desktopLogoutBtn" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="logout-text">Déconnexion</span>
                </a>
            </div>
        `;

        // --- BOUTONS DÉCONNECTÉ (DESIGN IDENTIQUE À INDEX.HTML) ---
        const loginButtonsHTML = `
            <a href="inscription.html" class="signup-btn">S'inscrire</a>
            <a href="connexion.html" class="login-btn">Connexion</a>
        `;

        // --- MENU MOBILE AUTH (IDENTIQUE À NAVBAR-COMPONENT.JS) ---
        const mobileAuthHTML = this.isLoggedIn ? `
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
        `;

        return `
            <div class="mobile-header mobile-only" id="mobileHeader">
                <div class="nav-top" id="navTop">
                    <a href="index.html" class="logo">
                        <img src="images/loji.png" alt="Loji">
                    </a>
                    <button class="hamburger-menu" id="hamburgerMenu">
                        <span></span><span></span><span></span>
                    </button>
                </div>

                <div class="mobile-menu mobile-only" id="mobileMenu">
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

                        <a href="#">Blog</a>
                    </nav>

                    <div class="mobile-auth-buttons">
                        ${mobileAuthHTML}
                    </div>
                </div>

                <div class="search-integrated">
                    <div class="search-box-container">
                        <div class="search-box">
                            <input type="text" placeholder="Rechercher un bien..." class="search-input" id="mobileSearchInput">
                            <button class="search-btn" id="mobileSearchBtn"><span class="material-icons">search</span></button>
                        </div>
                        <button class="quick-action-btn" id="mobileFilterBtn"><span class="material-icons">tune</span></button>
                        <button class="quick-action-btn" id="mobileSortBtn"><span class="material-icons">sort</span></button>
                    </div>
                </div>
            </div>

            <header class="navbar-simple desktop-only">
                <a href="index.html" class="logo-simple"><img src="images/loji.png" alt="Loji"></a>
                
                <div class="desktop-search-center">
                    <input type="text" id="desktopSearchInput" placeholder="Ville, quartier, type de bien...">
                    <button class="desktop-action-btn search-icon" id="desktopSearchButton"><i class="fas fa-search"></i></button>
                    <div class="desktop-divider"></div>
                    <button class="desktop-action-btn" id="desktopFilterBtn" title="Filtres"><i class="fas fa-sliders-h"></i></button>
                    <button class="desktop-action-btn" id="desktopSortBtn" title="Trier"><i class="fas fa-sort-amount-down"></i></button>
                </div>

                <div class="auth-buttons-simple">
                    ${this.isLoggedIn ? profileButtonHTML : loginButtonsHTML}
                </div>
            </header>

            <div class="filters-overlay" id="globalFiltersOverlay"></div>
            <div class="filters-panel" id="globalFiltersPanel">
                <button class="close-filters-mobile" id="closeFiltersBtn"><span class="material-icons">close</span></button>
                <div class="filters-grid">
                    <h3 style="margin-bottom:15px; font-weight:bold; color:#333;">Filtres</h3>
                    <div class="filter-group">
                        <label>Type de bien</label>
                        <select id="propType"><option value="">Tous les types</option><option>Appartement</option><option>Studio</option><option>Maison</option><option>Villa</option></select>
                    </div>
                    <div class="filter-group">
                        <label>Ville</label>
                        <select id="propCity"><option value="">Toutes les villes</option><option>Abidjan</option><option>San-Pedro</option><option>Yamoussoukro</option></select>
                    </div>
                    <div class="filter-group">
                        <label>Quartier</label>
                        <select id="propNeighborhood"><option value="">Tous les quartiers</option><option>Cocody</option><option>Plateau</option><option>Marcory</option></select>
                    </div>
                    <div class="filter-group">
                        <label>Budget</label>
                        <select id="propBudget"><option value="">Tous les budgets</option><option>0 - 100.000</option><option>100.000 - 300.000</option><option>300.000+</option></select>
                    </div>
                    <button class="apply-filters-btn" id="applyFiltersBtn">Appliquer</button>
                </div>
            </div>
            
            <div class="filters-panel" id="globalSortPanel" style="max-width: 300px;">
                <button class="close-filters-mobile" id="closeSortBtn"><span class="material-icons">close</span></button>
                <div class="filters-grid">
                    <h3 style="margin-bottom:15px; font-weight:bold; color:#333;">Trier par</h3>
                    <label class="sort-option" style="display:flex; gap:10px; padding:10px 0;"><input type="radio" name="sort" value="recent" checked> <span>Plus récents</span></label>
                    <label class="sort-option" style="display:flex; gap:10px; padding:10px 0;"><input type="radio" name="sort" value="price_asc"> <span>Prix croissant</span></label>
                </div>
            </div>
        `;
    }

    addStyles() {
        if (this.stylesAdded) return;
        const styleId = 'nav-multifunction-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            /* === STYLES DES BOUTONS AUTH (IDENTIQUES À INDEX.HTML) === */
            .user-menu { display: flex; align-items: center; gap: 12px; }
            
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
            .logout-text { display: inline; }
            
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
            .login-btn:hover { background: #0041CC; }
            
            /* === STYLES BOUTONS MOBILE AUTH (IDENTIQUES À NAVBAR-COMPONENT.JS) === */
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
                padding: 14px 20px;
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
                padding: 14px 20px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 500;
                width: 100%;
                cursor: pointer;
                border: none;
            }
            
            .mobile-auth-buttons .signup-btn,
            .mobile-auth-buttons .login-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 14px 20px;
                margin-bottom: 10px;
                border-radius: 10px;
                font-weight: 500;
                text-decoration: none;
                width: 100%;
                box-sizing: border-box;
            }

            /* === STYLES HAMBURGER (IDENTIQUES À NAVBAR-COMPONENT.JS) === */
            .hamburger-menu {
                display: flex;
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
            
            /* === STYLES MENU MOBILE (IDENTIQUES À NAVBAR-COMPONENT.JS) === */
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
                padding-bottom: 40px;
                z-index: 9999;
                transform: translateX(-100%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
            }
            
            .mobile-menu.active {
                transform: translateX(0);
            }
            
            .mobile-nav-links {
                flex-grow: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            
            .mobile-nav-links > a {
                display: block;
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
                color: #333;
                text-decoration: none;
                font-weight: 500;
                font-size: 1.1rem;
            }
            
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
                color: #333;
                text-decoration: none;
                font-size: 1rem;
                transition: color 0.3s ease;
            }
            
            .mobile-dropdown-content a:hover {
                color: #0057FF;
            }
            
            .arrow-icon {
                transition: transform 0.3s ease;
                color: #999;
            }
            
            .mobile-dropdown-container.active .arrow-icon {
                transform: rotate(180deg);
                color: #0057FF;
            }
            
            /* === RESTE DES STYLES (INCHANGÉ) === */
            .mobile-header { position: fixed; top: 0; left: 0; width: 100%; background: white; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.3s ease; }
            .mobile-header.scroll-mode { transform: translateY(-70px); }
            .nav-top { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; height: 70px; background: white; border-bottom: 1px solid #f0f0f0; transition: all 0.4s; }
            .mobile-header.scroll-mode .nav-top { opacity: 0; pointer-events: none; }
            .logo img { height: 105px; width: auto; object-fit: contain; }
            
            .search-integrated { padding: 10px 5% 15px; background: white; transition: all 0.3s; }
            .mobile-header.scroll-mode .search-integrated { transform: none; margin-top: 0; }
            .search-box-container { display: flex; gap: 10px; align-items: center; }
            .search-box { flex: 1; display: flex; align-items: center; background: #f3f4f6; border-radius: 12px; padding: 0 12px; height: 46px; }
            .search-input { flex: 1; border: none; background: transparent; outline: none; }
            .quick-action-btn { width: 46px; height: 46px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #555; }
            .quick-action-btn .material-icons, .search-btn .material-icons { font-size: 24px; line-height: 1; }
.search-integrated { padding: 10px 5% 15px; background: white; transition: all 0.3s; }
.mobile-header.scroll-mode .search-integrated { transform: none; margin-top: 0; }
.search-box-container { display: flex; gap: 10px; align-items: center; }
.search-box { flex: 1; display: flex; align-items: center; background: #f3f4f6; border-radius: 12px; padding: 0 12px; height: 46px; }
.search-input { flex: 1; border: none; background: transparent; outline: none; }
.quick-action-btn { width: 46px; height: 46px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #555; }
.quick-action-btn .material-icons, .search-btn .material-icons { font-size: 24px; line-height: 1; }

/* AJOUTEZ CETTE RÈGLE POUR ENLEVER LE CARRÉ AUTOUR DE LA LOUPE */
.search-btn {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    color: #0057FF !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-auth-buttons {
    margin-top: auto;
    padding-top: 20px;
    border-top: 2px solid #f0f0f0;
}
            .mobile-auth-buttons {
                margin-top: auto;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
            }

            
            /* MODALES */
            .filters-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2000; opacity: 0; visibility: hidden; transition: all 0.3s; }
            .filters-overlay.active { opacity: 1; visibility: visible; }
            .filters-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto; background: white; border-radius: 16px; padding: 25px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); opacity: 0; visibility: hidden; transition: all 0.3s; z-index: 2001; }
            .filters-panel.active { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
            .close-filters-mobile { position: absolute; top: 15px; right: 15px; background: #f3f4f6; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .filter-group { margin-bottom: 15px; } .filter-group label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 14px; } .filter-group select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; }
            .apply-filters-btn { width: 100%; background: #10b981; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: bold; margin-top: 10px; cursor: pointer; }
            
            /* DESKTOP */
            .desktop-only { display: none !important; }
            @media (min-width: 769px) {
                .mobile-only { display: none !important; }
                .desktop-only { display: flex !important; }
                .navbar-simple { position: fixed; top: 0; left: 0; width: 100%; height: 80px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; padding: 0 5%; z-index: 1000; }
                .logo-simple img { 
                    height: 110px; /* <--- MODIFICATION ICI : 40px → 60px */
                    width: auto; 
                    object-fit: contain; 
                }
                .desktop-search-center { display: flex; align-items: center; background: #f3f4f6; padding: 0 10px 0 25px; border-radius: 100px; width: 550px; height: 58px; border: 1px solid transparent; transition: all 0.2s; }
                .desktop-search-center input { border: none; background: transparent; outline: none; flex: 1; font-size: 16px; }
                .desktop-divider { height: 25px; width: 1px; background: #ddd; margin: 0 10px; }
                .desktop-action-btn { background: white; border: none; cursor: pointer; color: #555; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px; }
                .auth-buttons-simple { display: flex; gap: 15px; align-items: center; }
                body { padding-top: 80px; }
            }
            @media (max-width: 768px) { 
                body { padding-top: 140px; } 
                .logo img { height: 92px; }
            }

           .logo {
        margin-left: -40px;  /* Valeur négative pour décaler vers la gauche */
    }
 
        `;
        document.head.appendChild(style);
        this.stylesAdded = true;
    }

    initEvents() {
        console.log('🔧 Initialisation Interactions NavMultifunction');

        // HAMBURGER (COMPORTEMENT IDENTIQUE À NAVBAR-COMPONENT.JS)
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (hamburgerMenu && mobileMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburgerMenu.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Fermer le menu en cliquant à l'extérieur
            document.addEventListener('click', (e) => {
                if (mobileMenu.classList.contains('active') && 
                    !mobileMenu.contains(e.target) && 
                    !hamburgerMenu.contains(e.target)) {
                    hamburgerMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Fermer avec la touche Echap
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // ACCORDÉON (COMPORTEMENT IDENTIQUE À NAVBAR-COMPONENT.JS)
        document.querySelectorAll('.mobile-dropdown-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const container = header.closest('.mobile-dropdown-container');
                container.classList.toggle('active');
                
                // Fermer les autres dropdowns
                document.querySelectorAll('.mobile-dropdown-container').forEach(other => {
                    if (other !== container && other.classList.contains('active')) {
                        other.classList.remove('active');
                    }
                });
            });
        });

        // Fermer le menu mobile en cliquant sur un lien
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const hamburger = document.getElementById('hamburgerMenu');
                const mobileMenu = document.getElementById('mobileMenu');
                if (hamburger && mobileMenu) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // MODALES
        const setupModal = (btnId, panelId, closeId) => {
            const btn = document.getElementById(btnId);
            const panel = document.getElementById(panelId);
            const close = document.getElementById(closeId);
            const overlay = document.getElementById('globalFiltersOverlay');
            const closeModal = () => {
                if (panel) panel.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            };
            if (btn && panel) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.filters-panel.active').forEach(p => p.classList.remove('active'));
                    panel.classList.add('active');
                    if (overlay) overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                };
            }
            if (close) close.onclick = closeModal;
            if (overlay) overlay.onclick = closeModal;
        };

        setupModal('mobileFilterBtn', 'globalFiltersPanel', 'closeFiltersBtn');
        setupModal('mobileSortBtn', 'globalSortPanel', 'closeSortBtn');
        setupModal('desktopFilterBtn', 'globalFiltersPanel', 'closeFiltersBtn');
        setupModal('desktopSortBtn', 'globalSortPanel', 'closeSortBtn');

        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                document.getElementById('globalFiltersOverlay')?.click();
                window.dispatchEvent(new CustomEvent('filtersApplied'));
            };
        }

        // LOGOUT
        document.querySelectorAll('#mobileLogoutBtn, #desktopLogoutBtn').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.auth) window.auth.logout();
                });
            }
        });
    }

    initScrollBehavior() {
        let lastScroll = 0;
        const mobileHeader = document.getElementById('mobileHeader');
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768 || !mobileHeader) return;
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 30) {
                if (!mobileHeader.classList.contains('scroll-mode')) mobileHeader.classList.add('scroll-mode');
            } else if (currentScroll < lastScroll) {
                if (mobileHeader.classList.contains('scroll-mode')) mobileHeader.classList.remove('scroll-mode');
            }
            lastScroll = currentScroll;
        });
    }

    render() {
        if (NavMultifunction.rendered) return;

        this.updateAuthStatus();
        this.loadDependencies();

        let container = document.getElementById('nav-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'nav-container';
            document.body.insertBefore(container, document.body.firstChild);
        }
        container.innerHTML = this.generateHTML();
        this.addStyles();
        this.initEvents();
        this.initScrollBehavior();
        NavMultifunction.rendered = true;
        console.log('✅ NavMultifunction (Connectée) chargée.');
    }
}

window.NavMultifunction = NavMultifunction;
window.renderNavMultifunction = function () { new NavMultifunction().render(); };