// =============================================
// APP.JS - VERSION PROPRE ET OPTIMISÉE
// =============================================

// Configuration
const STRAPI_URL = 'https://my-strapi-project-production-d4d2.up.railway.app';
const API_URL = `${STRAPI_URL}/api/annonces?populate=*`;

// =============================================
// INITIALISATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    fetchAnnonces();
});

// =============================================
// RÉCUPÉRATION DES ANNONCES DEPUIS STRAPI
// =============================================
async function fetchAnnonces() {
    const container = document.getElementById('annoncesContainer');
    if (!container) return;

    try {
        console.log('🔄 Chargement des annonces...');
        showLoader(container);

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            showNoAnnonces(container);
            return;
        }

        displayAnnonces(container, data.data);
        console.log('✅ Annonces chargées avec succès');

    } catch (error) {
        console.error('❌ Erreur:', error);
        showError(container, error.message);
    }
}

// =============================================
// AFFICHAGE DES ANNONCES
// =============================================
function displayAnnonces(container, annonces) {
    container.innerHTML = '';

    annonces.forEach(annonce => {
        try {
            const card = createAnnonceCard(annonce);
            container.appendChild(card);
        } catch (error) {
            console.error('❌ Erreur création carte:', error);
        }
    });
}

// =============================================
// CRÉATION D'UNE CARTE D'ANNONCE
// =============================================
function createAnnonceCard(annonce) {
    const attrs = annonce.attributes || annonce;
    const id = annonce.id;
    
    // Données de base
    const titre = attrs.Titre || 'Titre non disponible';
    const description = attrs.Description || 'Aucune description';
    const prix = attrs.Prix || 0;
    const ville = attrs.Ville || 'Non spécifiée';
    const quartier = attrs.Quartier || 'Non spécifié';
    const surface = attrs.Surface || 'N/A';
    const pieces = attrs.Nombredepieces || 'N/A';
    const typeBien = attrs.Typedebien || 'Non spécifié';
    
    // Équipements
    const equipements = {
        meuble: attrs.Meuble || false,
        climatisation: attrs.Climatisation || false,
        parking: attrs.Parking || false,
        balcon: attrs.Balcon || false,
        securite: attrs.Securite || false,
        internet: attrs.Internet || false
    };
    
    const imageUrl = getImageUrl(annonce);
    const prixFormate = new Intl.NumberFormat('fr-FR').format(prix);
    const caracteristiques = buildCaracteristiques(equipements);
    
    // Création du conteneur
    const wrapper = document.createElement('div');
    wrapper.className = 'annonce-wrapper mb-6';
    
    // Version Desktop
    const desktopCard = createDesktopCard(titre, description, prixFormate, ville, quartier, surface, pieces, typeBien, caracteristiques, imageUrl, id);
    
    // Version Mobile
    const mobileCard = createMobileCard(titre, description, prixFormate, ville, quartier, surface, pieces, typeBien, caracteristiques, imageUrl, id);
    
    wrapper.appendChild(desktopCard);
    wrapper.appendChild(mobileCard);
    
    return wrapper;
}

// =============================================
// CRÉATION DE LA CARTE DESKTOP
// =============================================
function createDesktopCard(titre, description, prix, ville, quartier, surface, pieces, typeBien, caracteristiques, imageUrl, id) {
    const card = document.createElement('div');
    card.className = 'annonce-desktop';
    card.innerHTML = `
        <div class="image-container">
            <img class="image-desktop" src="${imageUrl}" alt="${titre}" loading="lazy">
            <div class="annonce-badge">${escapeHtml(typeBien)}</div>
            <button class="favorite-btn" onclick="toggleFavorite(${id})">
                <span class="material-icons">favorite_border</span>
            </button>
        </div>
        <div class="content">
            <div class="annonce-header">
                <div style="flex: 1;">
                    <h2 class="annonce-titre">${escapeHtml(titre)}</h2>
                    <div class="annonce-localisation">
                        <span class="material-icons location-icon">location_on</span>
                        ${escapeHtml(ville)}, ${escapeHtml(quartier)} • ${surface}m² • ${pieces} pièce${pieces > 1 ? 's' : ''}
                    </div>
                </div>
                <div class="annonce-prix">${prix} FCFA</div>
            </div>
            <p class="annonce-description">${escapeHtml(description)}</p>
            <div class="caracteristiques">
                <strong>Caractéristiques:</strong> ${caracteristiques}
            </div>
            <button class="bouton-desktop" onclick="openAnnonceDetail(${id})">
                Voir les détails complets
            </button>
        </div>
    `;
    return card;
}

// =============================================
// CRÉATION DE LA CARTE MOBILE
// =============================================
function createMobileCard(titre, description, prix, ville, quartier, surface, pieces, typeBien, caracteristiques, imageUrl, id) {
    const card = document.createElement('div');
    card.className = 'annonce-mobile';
    card.innerHTML = `
        <div class="image-mobile-container">
            <img class="image-mobile" src="${imageUrl}" alt="${titre}" loading="lazy">
            <div class="annonce-badge">${escapeHtml(typeBien)}</div>
            <button class="favorite-btn" onclick="toggleFavorite(${id})">
                <span class="material-icons">favorite_border</span>
            </button>
        </div>
        <div class="content">
            <h2 class="annonce-titre">${escapeHtml(titre)}</h2>
            <div class="annonce-localisation">
                <span class="material-icons location-icon">location_on</span>
                ${escapeHtml(ville)}, ${escapeHtml(quartier)} • ${surface}m² • ${pieces} pièce${pieces > 1 ? 's' : ''}
            </div>
            <div class="annonce-prix-mobile">${prix} FCFA</div>
            <p class="annonce-description">${escapeHtml(description)}</p>
            <div class="caracteristiques">
                <strong>Caractéristiques:</strong> ${caracteristiques}
            </div>
            <button class="bouton-mobile" onclick="openAnnonceDetail(${id})">
                Voir détails
            </button>
        </div>
    `;
    return card;
}

// =============================================
// RÉCUPÉRATION DE L'URL DE L'IMAGE
// =============================================
function getImageUrl(annonce) {
    try {
        const attrs = annonce.attributes || annonce;
        
        // Cas 1: Galeriephotos (tableau direct)
        if (attrs.Galeriephotos && Array.isArray(attrs.Galeriephotos) && attrs.Galeriephotos.length > 0) {
            const img = attrs.Galeriephotos[0];
            if (img && img.url) return `${STRAPI_URL}${img.url}`;
        }
        
        // Cas 2: Galeriephotos (structure Strapi v4)
        if (attrs.Galeriephotos && attrs.Galeriephotos.data && attrs.Galeriephotos.data.length > 0) {
            const img = attrs.Galeriephotos.data[0];
            if (img && img.attributes && img.attributes.url) {
                return `${STRAPI_URL}${img.attributes.url}`;
            }
        }
        
        // Cas 3: Imageprincipale (direct)
        if (attrs.Imageprincipale && attrs.Imageprincipale.url) {
            return `${STRAPI_URL}${attrs.Imageprincipale.url}`;
        }
        
        // Cas 4: Imageprincipale (structure Strapi v4)
        if (attrs.Imageprincipale && attrs.Imageprincipale.data && attrs.Imageprincipale.data.attributes) {
            return `${STRAPI_URL}${attrs.Imageprincipale.data.attributes.url}`;
        }
        
        // Image par défaut
        return 'https://via.placeholder.com/600x400?text=Photo+non+disponible';
        
    } catch (error) {
        console.error('Erreur chargement image:', error);
        return 'https://via.placeholder.com/600x400?text=Erreur+image';
    }
}

// =============================================
// CONSTRUCTION DES CARACTÉRISTIQUES
// =============================================
function buildCaracteristiques(equipements) {
    const liste = [];
    
    if (equipements.meuble) liste.push('Meublé');
    if (equipements.climatisation) liste.push('Climatisation');
    if (equipements.parking) liste.push('Parking');
    if (equipements.balcon) liste.push('Balcon');
    if (equipements.securite) liste.push('Sécurité');
    if (equipements.internet) liste.push('Internet');
    
    return liste.length > 0 ? liste.join(' • ') : 'Aucune caractéristique';
}

// =============================================
// FONCTIONS UTILITAIRES
// =============================================
function showLoader(container) {
    container.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <p>Chargement des annonces...</p>
        </div>
    `;
}

function showNoAnnonces(container) {
    container.innerHTML = `
        <div class="text-center p-10">
            <p>Aucune annonce disponible pour le moment.</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-container">
            <p>Erreur: ${escapeHtml(message)}</p>
            <button onclick="location.reload()">Réessayer</button>
        </div>
    `;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// =============================================
// FONCTIONS GLOBALES
// =============================================
window.openAnnonceDetail = function(annonceId) {
    window.location.href = `annonce-details-fixed.html?id=${annonceId}`;
};

window.toggleFavorite = function(annonceId) {
    console.log('Favori togglé pour:', annonceId);
    // Implémentez la logique des favoris ici
};