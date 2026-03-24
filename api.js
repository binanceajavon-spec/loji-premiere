// api.js - Version complète pour Strapi v4.25 (Dashboard LOGi)
const API = {
    // Configuration
    baseURL: 'https://my-strapi-project-production-d4d2.up.railway.app/api',
    serverURL: 'https://my-strapi-project-production-d4d2.up.railway.app',

    // ============================================================
    // AUTHENTIFICATION
    // ============================================================

    // Connexion utilisateur
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: email,
                    password: password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur de connexion');
            }

            const data = await response.json();
            
            // Stocker les données
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Erreur login:', error);
            return { success: false, error: error.message };
        }
    },

    // Inscription utilisateur
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur d\'inscription');
            }

            const data = await response.json();
            
            // Stocker les données
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Erreur register:', error);
            return { success: false, error: error.message };
        }
    },

    // Déconnexion
    logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        const token = localStorage.getItem('jwt');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // Obtenir l'utilisateur connecté
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // ============================================================
    // ANNONCES
    // ============================================================

    // Récupérer toutes les annonces de l'utilisateur connecté
    async getUserAnnonces() {
        console.log('📦 Chargement des annonces utilisateur...');
        
        const token = localStorage.getItem('jwt');
        const user = this.getCurrentUser();
        
        if (!token || !user?.id) {
            console.error('❌ Utilisateur non connecté');
            return [];
        }

        // ✅ Syntaxe CORRECTE pour Strapi v4.25
        // Utilisation de la syntaxe avec filters[user][id][$eq]
        const url = `${this.baseURL}/annonces?filters[user][id][$eq]=${user.id}&populate=*&sort[0]=createdAt:desc`;
        
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
                throw new Error(`Erreur HTTP: ${response.status} - ${errorLog.error?.message || 'Erreur inconnue'}`);
            }

            const result = await response.json();
            const rawData = result.data || [];
            
            console.log(`✅ ${rawData.length} annonces reçues`);

            // Transformer les annonces pour l'affichage
            const annoncesTransformees = rawData.map(item => {
                const attrs = item.attributes;
                let imageUrl = 'https://via.placeholder.com/400x300?text=Pas+d\'image';
                
                // Récupération de l'image (Galerie ou Principale) - Structure Strapi v4
                const photoPath = attrs.Galeriephotos?.data?.[0]?.attributes?.url || 
                                 attrs.Imageprincipale?.data?.attributes?.url;
                
                if (photoPath) {
                    imageUrl = photoPath.startsWith('http') ? photoPath : `${this.serverURL}${photoPath}`;
                }

                return {
                    id: item.id,
                    titre: attrs.Titre || "Sans titre",
                    description: attrs.Description || "",
                    prix: attrs.Prix ? `${attrs.Prix.toLocaleString()} CFA` : "Prix non fixé",
                    prixValeur: attrs.Prix || 0,
                    ville: attrs.Ville || "Non précisée",
                    status: attrs.publishedAt ? "Publié" : "Brouillon",
                    image: imageUrl,
                    date: attrs.createdAt,
                    category: attrs.Categorie || "",
                    phone: attrs.Telephone || "",
                    email: attrs.Email || ""
                };
            });

            return annoncesTransformees;

        } catch (error) {
            console.error('❌ Erreur dans getUserAnnonces:', error);
            return [];
        }
    },

    // Récupérer une annonce par son ID
    async getAnnonceById(id) {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
            console.error('❌ Non authentifié');
            return null;
        }

        const url = `${this.baseURL}/annonces/${id}?populate=*`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            const item = result.data;
            
            if (!item) return null;

            const attrs = item.attributes;
            
            // Récupération des images
            let images = [];
            let mainImageUrl = null;
            
            // Image principale
            if (attrs.Imageprincipale?.data) {
                const imgUrl = attrs.Imageprincipale.data.attributes.url;
                mainImageUrl = imgUrl.startsWith('http') ? imgUrl : `${this.serverURL}${imgUrl}`;
                images.push({
                    id: attrs.Imageprincipale.data.id,
                    url: mainImageUrl,
                    isMain: true
                });
            }
            
            // Galerie
            if (attrs.Galeriephotos?.data) {
                attrs.Galeriephotos.data.forEach(photo => {
                    const imgUrl = photo.attributes.url;
                    images.push({
                        id: photo.id,
                        url: imgUrl.startsWith('http') ? imgUrl : `${this.serverURL}${imgUrl}`,
                        isMain: false
                    });
                });
            }

            return {
                id: item.id,
                titre: attrs.Titre || "",
                description: attrs.Description || "",
                prix: attrs.Prix || 0,
                ville: attrs.Ville || "",
                category: attrs.Categorie || "",
                phone: attrs.Telephone || "",
                email: attrs.Email || "",
                images: images,
                mainImage: mainImageUrl,
                status: attrs.publishedAt ? "published" : "draft",
                createdAt: attrs.createdAt,
                updatedAt: attrs.updatedAt
            };
            
        } catch (error) {
            console.error('❌ Erreur getAnnonceById:', error);
            return null;
        }
    },

    // Créer une nouvelle annonce
    async createAnnonce(formData) {
        const token = localStorage.getItem('jwt');
        const user = this.getCurrentUser();
        
        if (!token || !user?.id) {
            return { success: false, error: 'Non authentifié' };
        }

        try {
            const response = await fetch(`${this.baseURL}/annonces`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        Titre: formData.titre,
                        Description: formData.description,
                        Prix: formData.prix,
                        Ville: formData.ville,
                        Categorie: formData.category,
                        Telephone: formData.phone,
                        Email: formData.email,
                        user: user.id
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur lors de la création');
            }

            const result = await response.json();
            return { success: true, data: result.data };
            
        } catch (error) {
            console.error('❌ Erreur createAnnonce:', error);
            return { success: false, error: error.message };
        }
    },

    // Mettre à jour une annonce
    async updateAnnonce(id, formData) {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
            return { success: false, error: 'Non authentifié' };
        }

        try {
            const response = await fetch(`${this.baseURL}/annonces/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        Titre: formData.titre,
                        Description: formData.description,
                        Prix: formData.prix,
                        Ville: formData.ville,
                        Categorie: formData.category,
                        Telephone: formData.phone,
                        Email: formData.email
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur lors de la mise à jour');
            }

            const result = await response.json();
            return { success: true, data: result.data };
            
        } catch (error) {
            console.error('❌ Erreur updateAnnonce:', error);
            return { success: false, error: error.message };
        }
    },

    // Supprimer une annonce
    async deleteAnnonce(id) {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
            console.error('❌ Non authentifié');
            return false;
        }

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

            console.log(`✅ Annonce ${id} supprimée avec succès`);
            return true;
            
        } catch (error) {
            console.error('❌ Erreur suppression:', error);
            return false;
        }
    },

    // Publier une annonce
    async publishAnnonce(id) {
        const token = localStorage.getItem('jwt');
        
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/annonces/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        publishedAt: new Date().toISOString()
                    }
                })
            });

            return response.ok;
        } catch (error) {
            console.error('❌ Erreur publication:', error);
            return false;
        }
    },

    // Dépublier une annonce
    async unpublishAnnonce(id) {
        const token = localStorage.getItem('jwt');
        
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/annonces/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        publishedAt: null
                    }
                })
            });

            return response.ok;
        } catch (error) {
            console.error('❌ Erreur dépublication:', error);
            return false;
        }
    },

    // ============================================================
    // IMAGES
    // ============================================================

    // Upload d'image
    async uploadImage(file, annonceId = null, field = 'Galeriephotos') {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
            return { success: false, error: 'Non authentifié' };
        }

        const formData = new FormData();
        formData.append('files', file);
        
        if (annonceId) {
            formData.append('refId', annonceId);
            formData.append('ref', 'api::annonce.annonce');
            formData.append('field', field);
        }

        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur upload');
            }

            const result = await response.json();
            return { success: true, data: result };
            
        } catch (error) {
            console.error('❌ Erreur uploadImage:', error);
            return { success: false, error: error.message };
        }
    },

    // Supprimer une image
    async deleteImage(imageId) {
        const token = localStorage.getItem('jwt');
        
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/upload/files/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.ok;
        } catch (error) {
            console.error('❌ Erreur suppression image:', error);
            return false;
        }
    },

    // Définir l'image principale d'une annonce
    async setMainImage(annonceId, imageId) {
        const token = localStorage.getItem('jwt');
        
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseURL}/annonces/${annonceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        Imageprincipale: imageId
                    }
                })
            });

            return response.ok;
        } catch (error) {
            console.error('❌ Erreur setMainImage:', error);
            return false;
        }
    },

    // ============================================================
    // UTILITAIRES
    // ============================================================

    // Formater une URL d'image
    getImageUrl(path) {
        if (!path) return 'https://via.placeholder.com/400x300?text=Image+manquante';
        if (path.startsWith('http')) return path;
        return `${this.serverURL}${path}`;
    },

    // Formater un prix
    formatPrice(price) {
        if (!price && price !== 0) return 'Prix non fixé';
        return `${price.toLocaleString()} CFA`;
    },

    // Formater une date
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Récupérer les statistiques de l'utilisateur
    async getUserStats() {
        const annonces = await this.getUserAnnonces();
        
        return {
            total: annonces.length,
            published: annonces.filter(a => a.status === 'Publié').length,
            drafts: annonces.filter(a => a.status === 'Brouillon').length,
            totalValue: annonces.reduce((sum, a) => sum + (a.prixValeur || 0), 0)
        };
    }
};

// Rendre disponible globalement
window.API = API;
console.log('✅ API.js v2.0 - Prêt pour Strapi v4.25 (Dashboard LOGi)');