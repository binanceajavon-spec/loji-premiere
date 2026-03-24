// api.js - Version optimisée pour Strapi v4.25
const API = {
    // Configuration unique
    baseURL: 'https://my-strapi-project-production-d4d2.up.railway.app/api',
    serverURL: 'https://my-strapi-project-production-d4d2.up.railway.app',

    // ============================================================
    // ANNONCES
    // ============================================================

    async getUserAnnonces() {
        console.log('📦 Chargement des annonces...');
        
        const token = localStorage.getItem('jwt');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || !user.id) {
            console.error('❌ Utilisateur non connecté');
            return [];
        }

        const url = `${this.baseURL}/annonces?filters[user][id][$eq]=${user.id}&populate=*&sort[0]=createdAt:desc`;
        console.log('📡 URL:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('❌ Erreur Strapi:', error);
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            const rawData = result.data || [];
            
            console.log(`✅ ${rawData.length} annonces trouvées`);

            // Si aucune annonce, afficher un message clair
            if (rawData.length === 0) {
                console.log('ℹ️ Aucune annonce trouvée pour cet utilisateur');
                return [];
            }

            // Transformer les données
            const annonces = rawData.map(item => {
                const attrs = item.attributes;
                
                // Récupération de l'image
                let imageUrl = 'https://via.placeholder.com/400x300?text=Pas+d\'image';
                const photoPath = attrs.Galeriephotos?.data?.[0]?.attributes?.url || 
                                 attrs.Imageprincipale?.data?.attributes?.url;
                
                if (photoPath) {
                    imageUrl = photoPath.startsWith('http') ? photoPath : `${this.serverURL}${photoPath}`;
                }

                return {
                    id: item.id,
                    titre: attrs.Titre || "Sans titre",
                    description: attrs.Description || "",
                    prix: attrs.Prix ? `${Number(attrs.Prix).toLocaleString()} CFA` : "Prix non fixé",
                    prixValeur: Number(attrs.Prix) || 0,
                    ville: attrs.Ville || "Non précisée",
                    status: attrs.publishedAt ? "Publié" : "Brouillon",
                    image: imageUrl,
                    date: attrs.createdAt,
                    category: attrs.Categorie || "",
                    phone: attrs.Telephone || "",
                    email: attrs.Email || ""
                };
            });

            console.log('📊 Annonces transformées:', annonces);
            return annonces;

        } catch (error) {
            console.error('❌ Erreur getUserAnnonces:', error);
            return [];
        }
    },

    async deleteAnnonce(id) {
        const token = localStorage.getItem('jwt');
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/annonces/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('❌ Erreur suppression:', error);
                return false;
            }

            console.log(`✅ Annonce ${id} supprimée`);
            return true;
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            return false;
        }
    },

    getImageUrl(path) {
        if (!path) return 'https://via.placeholder.com/400x300?text=Image+manquante';
        if (path.startsWith('http')) return path;
        return `${this.serverURL}${path}`;
    },

    formatPrice(price) {
        if (!price && price !== 0) return 'Prix non fixé';
        return `${Number(price).toLocaleString()} CFA`;
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
};

// Éviter les conflits de déclaration
if (typeof window !== 'undefined' && !window.API) {
    window.API = API;
    console.log('✅ API.js chargé - Strapi v4.25');
}