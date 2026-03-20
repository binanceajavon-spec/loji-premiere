// =================================================================
// APP-STRAPI.JS (GÉNÉRATEUR DE CARTES)
// =================================================================

const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api/annonces?populate=*`;

document.addEventListener('DOMContentLoaded', function () {
    fetchAnnonces();
});

async function fetchAnnonces() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            document.getElementById('annoncesContainer').innerHTML = '<div class="loading">Aucune annonce disponible.</div>';
            return;
        }
        displayAnnonces(data.data);
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

function displayAnnonces(annonces) {
    const container = document.getElementById('annoncesContainer');
    container.innerHTML = ''; // Nettoyer le loader

    annonces.forEach(annonce => {
        try {
            const card = createAnnonceCard(annonce);
            container.appendChild(card);
        } catch (e) { console.error(e); }
    });
}

function createAnnonceCard(annonce) {
    const attrs = annonce.attributes || annonce;

    // Données
    const titre = attrs.Titre || 'Titre non disponible';
    const description = attrs.Description || '...';
    const prix = attrs.Prix ? new Intl.NumberFormat('fr-FR').format(attrs.Prix) : '0';
    const ville = attrs.Ville || '';
    const quartier = attrs.Quartier || '';
    const typeBien = attrs.Typedebien || 'Bien';

    // Image
    let imageUrl = 'https://via.placeholder.com/400x300';
    if (attrs.Galeriephotos?.data?.[0]?.attributes?.url) {
        imageUrl = STRAPI_URL + attrs.Galeriephotos.data[0].attributes.url;
    } else if (attrs.Imageprincipale?.data?.attributes?.url) {
        imageUrl = STRAPI_URL + attrs.Imageprincipale.data.attributes.url;
    }

    const container = document.createElement('div');

    // --- VERSION DESKTOP ---
    const desktopHTML = `
        <div class="annonce-desktop">
            <div class="image-container">
                <img class="image-desktop" src="${imageUrl}" alt="${titre}">
                <div class="annonce-badge">${typeBien}</div>
                <button class="favorite-btn"><span class="material-icons">favorite_border</span></button>
            </div>
            <div class="content">
                <div class="annonce-header">
                    <div style="flex:1">
                        <div class="annonce-titre">${titre}</div>
                        <div class="annonce-localisation"><span class="material-icons location-icon">location_on</span> ${ville} ${quartier}</div>
                    </div>
                    <div class="annonce-prix">${prix} Fcfa</div>
                </div>
                <div class="annonce-description">${description}</div>
                <button class="bouton-desktop" onclick="location.href='annonce-details-fixed.html?id=${annonce.id}'">Voir détails</button>
            </div>
        </div>`;

    // --- VERSION MOBILE (Celle qu'on répare) ---
    const mobileHTML = `
        <div class="annonce-mobile">
            <div class="image-mobile-container">
                <img class="image-mobile" src="${imageUrl}" alt="${titre}">
                <div class="annonce-badge">${typeBien}</div>
                <button class="favorite-btn"><span class="material-icons">favorite_border</span></button>
            </div>
            <div class="content">
                <div class="annonce-titre">${titre}</div>
                <div class="annonce-localisation">
                    <span class="material-icons location-icon">location_on</span> ${ville}, ${quartier}
                </div>
                <div class="annonce-prix">${prix} Fcfa</div>
                <div class="annonce-description">${description}</div>
                <button class="bouton-mobile" onclick="location.href='annonce-details-fixed.html?id=${annonce.id}'">Voir détails</button>
            </div>
        </div>`;

    container.innerHTML = desktopHTML + mobileHTML;
    return container;
}