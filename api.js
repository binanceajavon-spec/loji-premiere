/**
 * API.js - Communication avec Strapi
 * Version simplifiée sans erreur Galeriephotos
 */

const API_URL = 'https://my-strapi-project-production-d4d2.up.railway.app';

const api = {
  /**
   * Récupérer toutes les annonces
   */
  getAllAnnonces: async function() {
    try {
      console.log('📦 Chargement de toutes les annonces...');
      const url = `${API_URL}/api/annonces?sort[0]=createdAt:desc`;
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${data.data.length} annonces trouvées`);
      
      // Retourner les données brutes sans transformation
      return data.data;
      
    } catch (error) {
      console.error('❌ Erreur getAllAnnonces:', error);
      return [];
    }
  },

  /**
   * Récupérer une annonce par son ID
   */
  getAnnonceById: async function(id) {
    try {
      console.log(`📦 Chargement de l'annonce ${id}...`);
      const url = `${API_URL}/api/annonces/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error('❌ Erreur getAnnonceById:', error);
      return null;
    }
  },

  /**
   * Connexion utilisateur
   */
  login: async function(email, password) {
    try {
      console.log(`🔐 Tentative de connexion pour: ${email}`);
      const url = `${API_URL}/api/auth/local`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Erreur de connexion' };
      }
      
      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return { success: true, data: data };
      
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      return { success: false, error: 'Erreur réseau' };
    }
  },

  /**
   * Déconnexion
   */
  logout: function() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    console.log('🔓 Déconnecté');
  },

  /**
   * Vérifier si connecté
   */
  isLoggedIn: function() {
    return localStorage.getItem('jwt') !== null;
  },

  /**
   * Récupérer l'utilisateur
   */
  getCurrentUser: function() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Récupérer le token
   */
  getToken: function() {
    return localStorage.getItem('jwt');
  }
};

console.log('✅ API.js chargé - Version corrigée sans erreur Galeriephotos');