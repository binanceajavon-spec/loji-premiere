// =================================================================
// NAV-MULTIFUNCTION.JS - DESIGN UNIFIÉ (EXACTEMENT COMME INDEX.HTML)
// =================================================================

console.log('🚀 Chargement de Nav Multifunction (Design Unifié)...');

class NavMultifunction {
    static rendered = false;

    constructor() {
        this.stylesAdded = false;
        // On récupère l'état initial
        this.updateAuthStatus();

        // Écouteur pour mettre à jour si l'état change
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
                // Formatage du numéro comme sur index.html (XX XX XX XX XX)
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
        // --- BOUTON CONNECTÉ (DESIGN UNIFIÉ AVEC INDEX.HTML) ---
        const profileButtonHTML = `
            <div class="user-menu-container">
                <a href="user-dashboard.html" class="profile-btn-unified">
                    <span class="user-phone">${this.userLabel}</span>
                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </a>
            </div>
        `;

        // --- BOUTONS DÉCONNECTÉ ---
        const loginButtonsHTML = `
            <a href="inscription.html" class="signup-btn-simple">S'inscrire</a>
            <a href="connexion.html" class="login-btn-simple">Connexion</a>
        `;

        // --- MENU MOBILE AUTH (Bas de page) ---
        const mobileAuthHTML = this.isLoggedIn ? `
            <div class="mobile-user-info">
                <span class="mobile-user-phone">
                    <i class="fas fa-phone-alt mr-2"></i> ${this.userLabel}
                </span>
                <div class="mobile-user-links">
                    <a href="user-dashboard.html" class="mobile-user-link">
                        <i class="fas fa-tachometer-alt mr-2"></i> Tableau de bord
                    </a>
                    <a href="#" id="mobileLogoutBtn" class="mobile-logout-btn-unified">
                        <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
                    </a>
                </div>
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
                        <a href="annonces.html">Annonces</a>
                        
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
            body.menu-open { overflow: hidden; height: 100vh; touch-action: none; }
            
            /* === STYLES BOUTON PROFIL UNIFIÉS (Copie de navbar-component.js) === */
            .profile-btn-unified {
                background: #f0fdf4;
                color: #059669;
                padding: 8px 16px;
                border-radius: 25px;
                border: 1px solid #bbf7d0;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                text-decoration: none;
            }
            .profile-btn-unified:hover { background: #dcfce7; }
            
            /* MOBILE AUTH STYLES (Copie de navbar.js) */
            .mobile-user-info { margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 12px; }
            .mobile-user-phone { display: flex; align-items: center; color: #059669; font-weight: 600; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
            .mobile-user-links { display: flex; flex-direction: column; gap: 10px; }
            .mobile-user-link { display: flex; align-items: center; padding: 10px; background: white; border-radius: 8px; text-decoration: none; color: #333; }
            .mobile-logout-btn-unified { display: flex; align-items: center; padding: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; cursor: pointer; font-weight: 500; width: 100%; justify-content: center; text-decoration: none; }

            /* ... (LE RESTE DES STYLES EXISTANTS) ... */
            .mobile-header { position: fixed; top: 0; left: 0; width: 100%; background: white; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.3s ease; }
            .mobile-header.scroll-mode { transform: translateY(-70px); }
            .nav-top { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; height: 70px; background: white; border-bottom: 1px solid #f0f0f0; transition: all 0.4s; }
            .mobile-header.scroll-mode .nav-top { opacity: 0; pointer-events: none; }
            .logo img { height: 45px; width: auto; object-fit: contain; }
            
            .hamburger-menu { display: flex; flex-direction: column; justify-content: space-between; width: 28px; height: 20px; background: transparent; border: none; cursor: pointer; z-index: 1001; }
            .hamburger-menu span { display: block; height: 3px; width: 100%; background: #333; transition: all 0.3s ease; transform-origin: center; }
            .hamburger-menu.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
            .hamburger-menu.open span:nth-child(2) { opacity: 0; }
            .hamburger-menu.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
            
            .mobile-menu { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: white; padding: 80px 20px 20px; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 999; overflow-y: auto; display: flex; flex-direction: column; }
            .mobile-menu.active { transform: translateX(0); }
            
            .mobile-nav-links > a { display: block; padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #333; text-decoration: none; font-weight: 500; font-size: 16px; }
            .mobile-dropdown-header { padding: 16px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 500; font-size: 16px; color: #333; border-bottom: 1px solid #f0f0f0; }
            .mobile-dropdown-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: #f9fafb; }
            .mobile-dropdown-content a { display: block; padding: 12px 20px; font-size: 14px; color: #666; text-decoration: none; border-left: 3px solid transparent; }
            .mobile-dropdown-content a:hover { color: #10b981; border-left-color: #10b981; background: #f0fdf4; }
            .arrow-icon { transition: transform 0.3s ease; color: #999; }
            .mobile-dropdown-container.active .arrow-icon { transform: rotate(180deg); color: #10b981; }
            
            .search-integrated { padding: 10px 5% 15px; background: white; transition: all 0.3s; }
            .mobile-header.scroll-mode .search-integrated { transform: none; margin-top: 0; }
            .search-box-container { display: flex; gap: 10px; align-items: center; }
            .search-box { flex: 1; display: flex; align-items: center; background: #f3f4f6; border-radius: 12px; padding: 0 12px; height: 46px; }
            .search-input { flex: 1; border: none; background: transparent; outline: none; }
            .quick-action-btn { width: 46px; height: 46px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #555; }
            .quick-action-btn .material-icons, .search-btn .material-icons { font-size: 24px; line-height: 1; }
            
            .mobile-auth-buttons { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 12px; }
            .signup-btn, .login-btn { text-align: center; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 600; }
            .signup-btn { border: 1px solid #10b981; color: #10b981; }
            .login-btn { background: #10b981; color: white; }
            
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
                .logo-simple img { height: 40px; }
                .desktop-search-center { display: flex; align-items: center; background: #f3f4f6; padding: 0 10px 0 25px; border-radius: 100px; width: 550px; height: 58px; border: 1px solid transparent; transition: all 0.2s; }
                .desktop-search-center input { border: none; background: transparent; outline: none; flex: 1; font-size: 16px; }
                .desktop-divider { height: 25px; width: 1px; background: #ddd; margin: 0 10px; }
                .desktop-action-btn { background: white; border: none; cursor: pointer; color: #555; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px; }
                .auth-buttons-simple { display: flex; gap: 15px; }
                .signup-btn-simple { color: #10b981; font-weight: bold; text-decoration: none; border: 1px solid #10b981; padding: 8px 16px; border-radius: 20px; }
                .login-btn-simple { background: #10b981; color: white; font-weight: bold; text-decoration: none; padding: 9px 20px; border-radius: 20px; }
                body { padding-top: 80px; }
            }
            @media (max-width: 768px) { body { padding-top: 140px; } }
        `;
        document.head.appendChild(style);
        this.stylesAdded = true;
    }

    initEvents() {
        console.log('🔧 Initialisation Interactions NavMultifunction');

        // HAMBURGER
        const hamburgerBtn = document.getElementById('hamburgerMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        if (hamburgerBtn && mobileMenu) {
            const newHamburger = hamburgerBtn.cloneNode(true);
            hamburgerBtn.parentNode.replaceChild(newHamburger, hamburgerBtn);

            const toggleMenu = (e) => {
                e.stopPropagation();
                const isOpen = mobileMenu.classList.contains('active');
                if (isOpen) {
                    mobileMenu.classList.remove('active');
                    newHamburger.classList.remove('open');
                    document.body.classList.remove('menu-open');
                } else {
                    mobileMenu.classList.add('active');
                    newHamburger.classList.add('open');
                    document.body.classList.add('menu-open');
                }
            };
            newHamburger.addEventListener('click', toggleMenu);
            document.addEventListener('click', (e) => {
                if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !newHamburger.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    newHamburger.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
            });
        }

        // ACCORDÉON
        document.addEventListener('click', (e) => {
            const header = e.target.closest('.mobile-dropdown-header');
            if (header) {
                e.preventDefault(); e.stopPropagation();
                const container = header.closest('.mobile-dropdown-container');
                const content = container.querySelector('.mobile-dropdown-content');
                document.querySelectorAll('.mobile-dropdown-container.active').forEach(c => {
                    if (c !== container) {
                        c.classList.remove('active');
                        if (c.querySelector('.mobile-dropdown-content')) c.querySelector('.mobile-dropdown-content').style.maxHeight = 0;
                    }
                });
                container.classList.toggle('active');
                content.style.maxHeight = container.classList.contains('active') ? content.scrollHeight + "px" : 0;
            }
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
                document.body.classList.remove('menu-open');
            };
            if (btn && panel) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.filters-panel.active').forEach(p => p.classList.remove('active'));
                    panel.classList.add('active');
                    if (overlay) overlay.classList.add('active');
                    document.body.classList.add('menu-open');
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
                document.getElementById('globalFiltersOverlay').click();
                window.dispatchEvent(new CustomEvent('filtersApplied'));
            };
        }

        // LOGOUT
        document.querySelectorAll('#mobileLogoutBtn, #desktopLogoutBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) window.auth.logout();
            });
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

        // S'assurer que le statut auth est à jour avant de rendre
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