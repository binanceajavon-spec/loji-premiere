// navbar.js - MODIFIE UNIQUEMENT LES BOUTONS AUTH
console.log('🟢 navbar.js chargé - mode modification');

function updateAuthButtons() {
    console.log('🟢 Mise à jour des boutons auth...');
    
    // Vérifier si auth est disponible
    if (typeof auth === 'undefined') {
        console.error('❌ auth non défini');
        return;
    }
    
    // Récupérer l'état de connexion
    const isLoggedIn = auth.isLoggedIn ? auth.isLoggedIn() : false;
    const userPhone = auth.getPhone ? auth.getPhone() : '';
    
    console.log('🟢 État connexion:', isLoggedIn);
    console.log('🟢 Téléphone:', userPhone);
    
    // Formater le téléphone
    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }
        return phone;
    };
    
    // 1. MODIFIER LES BOUTONS AUTH DESKTOP
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        console.log('🟢 Modification auth-buttons desktop');
        
        if (isLoggedIn) {
            // Utilisateur connecté
            authButtons.innerHTML = `
                <!-- Menu utilisateur connecté -->
                <div class="user-dropdown-container">// Remplace la ligne du style du bouton par celle-ci :
<button class="user-menu-btn" style="
    background-color: #f0fdf4 !important; /* Le fond vert clair */
    color: #053896 !important;            /* Le texte bleu */
    padding: 8px 16px;
    border-radius: 25px;
    border: 2px solid #053896 !important; /* Bordure bleue pour que ça ressorte */
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
">

              <span class="user-phone">${formatPhone(userPhone) || 'Mon compte'}</span>
                        <i class="fas fa-chevron-down ml-1 text-xs"></i>
                    </button>
                    <div class="user-dropdown" style="
                        position: absolute;
                        top: 100%;
                        right: 0;
                        margin-top: 8px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                        min-width: 220px;
                        z-index: 1000;
                        opacity: 0;
                        visibility: hidden;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                        border: 1px solid #e5e7eb;
                    ">
                        <a href="dashboard.html" class="dropdown-item" style="
                            display: flex;
                            align-items: center;
                            padding: 12px 16px;
                            color: #374151;
                            text-decoration: none;
                            transition: all 0.2s ease;
                            border-bottom: 1px solid #f3f4f6;
                            font-size: 0.9rem;
                        ">
                            <i class="fas fa-tachometer-alt mr-2"></i>
                            Tableau de bord
                        </a>
                        <a href="profile.html" class="dropdown-item" style="
                            display: flex;
                            align-items: center;
                            padding: 12px 16px;
                            color: #374151;
                            text-decoration: none;
                            transition: all 0.2s ease;
                            border-bottom: 1px solid #f3f4f6;
                        ">
                            <i class="fas fa-user-circle mr-2"></i>
                            Mon profil
                        </a>
                        <a href="mes-annonces.html" class="dropdown-item" style="
                            display: flex;
                            align-items: center;
                            padding: 12px 16px;
                            color: #374151;
                            text-decoration: none;
                            transition: all 0.2s ease;
                            border-bottom: 1px solid #f3f4f6;
                        ">
                            <i class="fas fa-home mr-2"></i>
                            Mes annonces
                        </a>
                        <a href="favoris.html" class="dropdown-item" style="
                            display: flex;
                            align-items: center;
                            padding: 12px 16px;
                            color: #374151;
                            text-decoration: none;
                            transition: all 0.2s ease;
                            border-bottom: 1px solid #f3f4f6;
                        ">
                            <i class="fas fa-heart mr-2"></i>
                            Favoris
                        </a>
                        <div style="height: 1px; background: #e5e7eb; margin: 4px 0;"></div>
                        <button onclick="auth.logout()" class="logout-btn" style="
                            display: flex;
                            align-items: center;
                            padding: 12px 16px;
                            color: #ef4444;
                            width: 100%;
                            text-align: left;
                            background: none;
                            border: none;
                            cursor: pointer;
                            font-size: 0.9rem;
                        ">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Déconnexion
                        </button>
                    </div>
                </div>
                <a href="deposer-annonce.html" class="deposer-btn" style="
                    background: #2b4ce2;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    margin-left: 10px;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                ">
                    <i class="fas fa-plus mr-2"></i>
                    Déposer une annonce
                </a>
            `;
            
            // Ajouter les événements pour le dropdown
            const userDropdownContainer = authButtons.querySelector('.user-dropdown-container');
            const userDropdown = authButtons.querySelector('.user-dropdown');
            
            if (userDropdownContainer && userDropdown) {
                userDropdownContainer.addEventListener('mouseenter', () => {
                    userDropdown.style.opacity = '1';
                    userDropdown.style.visibility = 'visible';
                    userDropdown.style.transform = 'translateY(0)';
                });
                
                userDropdownContainer.addEventListener('mouseleave', () => {
                    userDropdown.style.opacity = '0';
                    userDropdown.style.visibility = 'hidden';
                    userDropdown.style.transform = 'translateY(-10px)';
                });
            }
            
        } else {
            // Utilisateur non connecté
            authButtons.innerHTML = `
                <a href="register.html" class="signup-btn">S'inscrire</a>
                <a href="login.html" class="login-btn">Connexion</a>
            `;
        }
    }
    
    // 2. MODIFIER LES BOUTONS AUTH MOBILE
    const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');
    if (mobileAuthButtons) {
        console.log('🟢 Modification auth-buttons mobile');
        
        if (isLoggedIn) {
            mobileAuthButtons.innerHTML = `
                <div class="mobile-user-info" style="
                    margin-top: 20px;
                    padding: 15px;
                    background: #f9fafb;
                    border-radius: 12px;
                ">
                    <span class="mobile-user-phone" style="
                        display: flex;
                        align-items: center;
                        color: #059669;
                        font-weight: 600;
                        margin-bottom: 15px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #e5e7eb;
                    ">
                        <i class="fas fa-phone-alt mr-2"></i>
                        ${formatPhone(userPhone) || 'Connecté'}
                    </span>
                    <div class="mobile-user-links" style="
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    ">
                        <a href="dashboard.html" class="mobile-user-link" style="
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            background: white;
                            border-radius: 8px;
                            text-decoration: none;
                            color: #333;
                        ">
                            <i class="fas fa-tachometer-alt mr-2"></i>
                            Tableau de bord
                        </a>
                        <a href="profile.html" class="mobile-user-link" style="
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            background: white;
                            border-radius: 8px;
                            text-decoration: none;
                            color: #333;
                        ">
                            <i class="fas fa-user-circle mr-2"></i>
                            Mon profil
                        </a>
                        <a href="mes-annonces.html" class="mobile-user-link" style="
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            background: white;
                            border-radius: 8px;
                            text-decoration: none;
                            color: #333;
                        ">
                            <i class="fas fa-home mr-2"></i>
                            Mes annonces
                        </a>
                        <a href="deposer-annonce.html" class="mobile-user-link" style="
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            background: white;
                            border-radius: 8px;
                            text-decoration: none;
                            color: #333;
                        ">
                            <i class="fas fa-plus mr-2"></i>
                            Déposer une annonce
                        </a>
                        <button onclick="auth.logout()" class="mobile-logout-btn" style="
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            background: #fef2f2;
                            border: 1px solid #fecaca;
                            border-radius: 8px;
                            color: #dc2626;
                            cursor: pointer;
                            font-weight: 500;
                            width: 100%;
                        ">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Déconnexion
                        </button>
                    </div>
                </div>
            `;
        } else {
            mobileAuthButtons.innerHTML = `
                <a href="register.html" class="signup-btn">S'inscrire</a>
                <a href="login.html" class="login-btn">Connexion</a>
            `;
        }
    }
    
    console.log('✅ Boutons auth mis à jour');
}

// Fonction principale
function renderMainNavbar() {
    console.log('🟢 renderMainNavbar appelé');
    
    // D'abord vérifier l'authentification
    if (typeof auth !== 'undefined' && typeof auth.fetchUser === 'function') {
        auth.fetchUser().then(() => {
            console.log('✅ Authentification vérifiée');
            updateAuthButtons();
        }).catch(error => {
            console.warn('⚠️ Erreur auth:', error);
            updateAuthButtons(); // Mettre à jour quand même
        });
    } else {
        console.warn('⚠️ auth non disponible, mise à jour directe');
        updateAuthButtons();
    }
}

// Exporter
window.renderMainNavbar = renderMainNavbar;
window.updateAuthButtons = updateAuthButtons;

console.log('✅ navbar.js prêt');