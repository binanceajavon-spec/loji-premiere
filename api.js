// api.js - Version finale corrigée pour Strapi v5 (LOGi)
const API = {
    baseURL: 'https://my-strapi-project-production-d4d2.up.railway.app/api',
    serverURL: 'https://my-strapi-project-production-d4d2.up.railway.app',

    // 1. Récupérer les annonces de l'utilisateur connecté
    async getUserAnnonces() {
        console.log('📦 Chargement des annonces utilisateur...');
        
        const token = localStorage.getItem('jwt');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || !user.id) {
            console.error('❌ Erreur: Utilisateur non connecté');
            return [];
        }

        const url = `${this.baseURL}/annonces?filters[user][id][$eq]=${user.id}&populate=*`;
        console.log('📡 Appel API:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorLog = await response.json();
                console.error('❌ Erreur Strapi:', errorLog);
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            const rawData = result.data || [];
            
            console.log('✅ Données reçues:', rawData);

            // Transformer chaque annonce
            const annoncesTransformees = rawData.map(item => {
                const attrs = item.attributes;
                let imageUrl = 'https://via.placeholder.com/400x300?text=Pas+d\'image';
                
                // Récupération de l'image (Galerie ou Principale)
                const photoPath = attrs.Galeriephotos?.data?.[0]?.attributes?.url || 
                                 attrs.Imageprincipale?.data?.attributes?.url;
                
                if (photoPath) {
                    // Si Cloudinary, on garde l'URL. Si local, on ajoute le serveur Railway.
                    imageUrl = photoPath.startsWith('http') ? photoPath : `${this.serverURL}${photoPath}`;
                }

                return {
                    id: item.id,
                    titre: attrs.Titre || "Sans titre",
                    prix: attrs.Prix ? `${attrs.Prix} CFA` : "Prix non fixé",
                    ville: attrs.Ville || "Non précisée",
                    status: attrs.publishedAt ? "Publié" : "Brouillon",
                    image: imageUrl,
                    date: attrs.createdAt
                };
            });

            return annoncesTransformees;

        } catch (error) {
            console.error('❌ Erreur dans getUserAnnonces:', error);
            return [];
        }
    },

    // 2. Supprimer une annonce
    async deleteAnnonce(id) {
        const token = localStorage.getItem('jwt');
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/annonces/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            return response.ok;
        } catch (error) {
            console.error('❌ Erreur suppression:', error);
            return false;
        }
    },

    // 3. Utilitaire pour formater les URLs d'images (pour usage externe)
    getImageUrl(path) {
        if (!path) return 'https://via.placeholder.com/400x300?text=Image+manquante';
        return path.startsWith('http') ? path : `${this.serverURL}${path}`;
    }
};

// Rendre disponible globalement
window.API = API;
console.log('✅ API.js REECRIT - Prêt pour le Dashboard LOGi');