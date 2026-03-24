// app.js - Version simplifiée (sans conflit)
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Ne pas redéclarer STRAPI_URL ici, utiliser window.API
    if (window.API) {
        console.log('✅ API disponible');
        fetchAnnonces();
    } else {
        console.error('❌ API non chargée');
    }
});

async function fetchAnnonces() {
    const container = document.getElementById('annoncesContainer');
    if (!container) return;

    try {
        console.log('🔄 Chargement des annonces...');
        showLoader(container);

        // Utiliser l'API de window.API au lieu de variables globales
        const response = await fetch(`${window.API.baseURL}/annonces?populate=*`);
        
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

// Le reste des fonctions (displayAnnonces, createAnnonceCard, etc.) reste identique
// MAIS modifiez getImageUrl pour utiliser window.API au lieu de STRAPI_URL :

function getImageUrl(annonce) {
    try {
        const attrs = annonce.attributes || annonce;
        let path = "";

        if (attrs.Galeriephotos?.data?.[0]?.attributes?.url) {
            path = attrs.Galeriephotos.data[0].attributes.url;
        } else if (attrs.Imageprincipale?.data?.attributes?.url) {
            path = attrs.Imageprincipale.data.attributes.url;
        } else if (attrs.Galeriephotos?.[0]?.url) {
            path = attrs.Galeriephotos[0].url;
        } else if (attrs.Imageprincipale?.url) {
            path = attrs.Imageprincipale.url;
        }

        if (!path) return 'https://via.placeholder.com/600x400?text=Photo+non+disponible';

        // Utiliser window.API.serverURL au lieu de STRAPI_URL
        return path.startsWith('http') ? path : `${window.API.serverURL}${path}`;

    } catch (error) {
        console.error('Erreur chargement image:', error);
        return 'https://via.placeholder.com/600x400?text=Erreur+image';
    }
}