// =============================================
// APP.JS - DESIGN ORIGINAL RESTAURÉ & BUG CORRIGÉ
// =============================================

// 1. CORRECTION DU CONFLIT DE VARIABLE
// On utilise une variable locale pour ne pas bloquer auth.js
const LOCAL_STRAPI_URL = (typeof STRAPI_URL !== 'undefined') ? STRAPI_URL : 'http://localhost:1337';
const API_URL = `${LOCAL_STRAPI_URL}/api/annonces?populate=*`;

// =============================================
// FONCTION PRINCIPALE - CHARGEMENT STRAPI
// =============================================

async function fetchAnnonces() {
    const container = document.getElementById('annoncesContainer');

    // Sécurité : Si le conteneur n'existe pas, on arrête tout
    if (!container) return;

    try {
        console.log('🔄 Chargement depuis Strapi...');

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Nettoyage du loader
        container.innerHTML = '';

        if (!data.data || data.data.length === 0) {
            showNoAnnonces();
            return;
        }

        displayAnnonces(data.data);

    } catch (error) {
        console.error('❌ Erreur Strapi:', error);
        showError(error.message);
    }
}

// =============================================
// AFFICHAGE DES ANNONCES
// =============================================
function displayAnnonces(annonces) {
    const container = document.getElementById('annoncesContainer');
    if (!container) return;

    // On vide le conteneur
    container.innerHTML = '';

    annonces.forEach(annonce => {
        try {
            const card = createAnnonceCard(annonce);
            container.appendChild(card);
        } catch (error) {
            console.error('❌ Erreur création carte:', error, annonce);
        }
    });

    console.log('✅ Annonces affichées avec succès (Design Original)');
}

// =============================================
// CRÉATION DE LA CARTE (CODE ORIGINAL RESTAURÉ)
// =============================================
function createAnnonceCard(annonce) {
    // Récupération des attributs
    const attrs = annonce.attributes || annonce;
    const id = annonce.id;

    const titre = attrs.Titre || 'Titre non disponible';
    const description = attrs.Description || 'Aucune description';
    const prix = attrs.Prix || 0;
    const ville = attrs.Ville || 'Ville non spécifiée';
    const quartier = attrs.Quartier || 'Quartier non spécifié';
    const surface = attrs.Surface || 'N/A';
    const pieces = attrs.Nombredepieces || 'N/A';
    const typeBien = attrs.Typedebien || 'Type non spécifié';

    // Récupération des booléens
    const isMeuble = attrs.Meuble || false;
    const hasClimatisation = attrs.Climatisation || false;
    const hasParking = attrs.Parking || false;
    const hasBalcon = attrs.Balcon || false;
    const hasSecurite = attrs.Securite || false;
    const hasInternet = attrs.Internet || false;

    const imageUrl = getImageUrl(annonce);
    const prixFormate = new Intl.NumberFormat('fr-FR').format(prix);

    // Construction des caractéristiques
    const caracteristiques = buildCaracteristiques({
        meuble: isMeuble,
        climatisation: hasClimatisation,
        parking: hasParking,
        balcon: hasBalcon,
        securite: hasSecurite,
        internet: hasInternet
    });

    // Création du conteneur principal
    const container = document.createElement('div');
    container.className = 'annonce-wrapper mb-6'; // Classe conteneur pour espacement

    // --- VERSION DESKTOP (Votre Design Original) ---
    const desktopVersion = document.createElement('div');
    desktopVersion.className = 'annonce-desktop';
    desktopVersion.innerHTML = `
        <div class="image-container">
            <img class="image-desktop" src="${imageUrl}" alt="${titre}">
            <div class="annonce-badge">${typeBien}</div>
            <button class="favorite-btn">
                <span class="material-icons">favorite_border</span>
            </button>
        </div>
        <div class="content">
            <div class="annonce-header">
                <div style="flex: 1;">
                    <div class="annonce-titre">${titre}</div>
                    <div class="annonce-localisation">
                        <span class="material-icons location-icon">location_on</span>
                        ${ville}, ${quartier} • ${surface}m² • ${pieces} pièce${pieces > 1 ? 's' : ''}
                    </div>
                </div>
                <div class="annonce-prix">${prixFormate} Fcfa</div>
            </div>
            <div class="annonce-description">${description}</div>
            <div class="caracteristiques">
                <strong>Caractéristiques:</strong> ${caracteristiques}
            </div> 
            <button class="bouton-desktop" onclick="openAnnonceDetail(${id})">
                Voir les détails complets
            </button>
        </div>
    `;

    // --- VERSION MOBILE (Votre Design Original) ---
    const mobileVersion = document.createElement('div');
    mobileVersion.className = 'annonce-mobile';
    mobileVersion.innerHTML = `
        <div class="image-mobile-container">
            <img class="image-mobile" src="${imageUrl}" alt="${titre}">
            <div class="annonce-badge">${typeBien}</div>
            <button class="favorite-btn">
                <span class="material-icons">favorite_border</span>
            </button>
        </div>
        <div class="content">
            <div class="annonce-titre">${titre}</div>
            <div class="annonce-localisation">
                <span class="material-icons location-icon">location_on</span>
                ${ville}, ${quartier} • ${surface}m² • ${pieces} pièce${pieces > 1 ? 's' : ''}
            </div>
            <div class="annonce-prix" style="text-align: left; margin-bottom: 12px;">${prixFormate} Fcfa</div>
            <div class="annonce-description">${description}</div>
            <div class="caracteristiques">
                <strong>Caractéristiques:</strong> ${caracteristiques}
            </div>
            <button class="bouton-mobile" onclick="openAnnonceDetail(${id})">
                Voir détails
            </button>
        </div>
    `;

    container.appendChild(desktopVersion);
    container.appendChild(mobileVersion);

    return container;
}

// =============================================
// REDIRECTION (VERSION FIXED)
// =============================================
function openAnnonceDetail(annonceId) {
    window.location.href = `annonce-details-fixed.html?id=${annonceId}`;
}

// =============================================
// FONCTIONS UTILITAIRES (COPIE EXACTE)
// =============================================
function getImageUrl(annonce) {
    try {
        // CAS 1: Galeriephotos est un tableau
        if (annonce.Galeriephotos && Array.isArray(annonce.Galeriephotos) && annonce.Galeriephotos.length > 0) {
            const firstImage = annonce.Galeriephotos[0];
            if (firstImage && firstImage.url) {
                return `${LOCAL_STRAPI_URL}${firstImage.url}`;
            }
        }

        // CAS 2: Galeriephotos a une propriété data (Strapi v4)
        if (annonce.Galeriephotos && annonce.Galeriephotos.data && Array.isArray(annonce.Galeriephotos.data)) {
            const firstImage = annonce.Galeriephotos.data[0];
            if (firstImage && firstImage.attributes && firstImage.attributes.url) {
                return `${LOCAL_STRAPI_URL}${firstImage.attributes.url}`;
            }
        }

        // CAS 3: Galeriephotos a une URL directe
        if (annonce.Galeriephotos && annonce.Galeriephotos.url) {
            return `${LOCAL_STRAPI_URL}${annonce.Galeriephotos.url}`;
        }

        // CAS 4: Imageprincipale
        if (annonce.Imageprincipale && annonce.Imageprincipale.url) {
            return `${LOCAL_STRAPI_URL}${annonce.Imageprincipale.url}`;
        }

        // Cas data/attributes pour Imageprincipale
        if (annonce.Imageprincipale && annonce.Imageprincipale.data && annonce.Imageprincipale.data.attributes) {
            return `${LOCAL_STRAPI_URL}${annonce.Imageprincipale.data.attributes.url}`;
        }

        return 'https://via.placeholder.com/600x400?text=Pas+d+image';

    } catch (error) {
        console.error('Erreur image:', error);
        return 'https://via.placeholder.com/600x400?text=Erreur';
    }
}

function buildCaracteristiques(features) {
    const activeFeatures = [];
    if (features.meuble) activeFeatures.push('Meublé');
    if (features.climatisation) activeFeatures.push('Climatisation');
    if (features.parking) activeFeatures.push('Parking');
    if (features.balcon) activeFeatures.push('Balcon');
    if (features.securite) activeFeatures.push('Sécurité');
    if (features.internet) activeFeatures.push('Internet');
    return activeFeatures.length > 0 ? activeFeatures.join(' • ') : 'Aucune caractéristique spécifiée';
}

function showNoAnnonces() {
    const container = document.getElementById('annoncesContainer');
    if (container) container.innerHTML = '<div class="text-center p-10">Aucune annonce disponible.</div>';
}

function showError(msg) {
    const container = document.getElementById('annoncesContainer');
    if (container) container.innerHTML = `<div class="text-center text-red-500 p-10">Erreur: ${msg}</div>`;
}

// NOTE : J'ai supprimé ici toute la logique de navigation (initMobileHeader, etc.)
// car elle est maintenant gérée proprement par nav-multifunction.js
// Cela empêche le conflit qui faisait disparaître la barre.