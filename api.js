// api.js - Version finale corrigée pour Strapi v5 (LOGi)
const API = {
    baseURL: 'http://localhost:1337/api',
    serverURL: 'http://localhost:1337',

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
                let imageUrl = 'https://via.placeholder.com/400x300?text=Pas+d\'image';
                
                if (item.Galeriephotos && item.Galeriephotos.length > 0) {
                    imageUrl = `${this.serverURL}${item.Galeriephotos[0].url}`;
                }

                return {
                    id: item.id,
                    titre: item.Titre || "Sans titre",
                    prix: item.Prix ? `${item.Prix} CFA` : "Prix non fixé",
                    ville: item.Ville || "Non précisée",
                    status: item.publishedAt ? "Publié" : "Brouillon",
                    image: imageUrl,
                    date: item.createdAt || new Date().toISOString()
                };
            });

            console.log(`✅ ${annoncesTransformees.length} annonces transformées`);
            return annoncesTransformees;

        } catch (error) {
            console.error('❌ Erreur critique API:', error);
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