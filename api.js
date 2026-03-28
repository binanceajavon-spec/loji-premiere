/**
 * API.js - Communication avec Strapi
 */

const API_URL = 'https://my-strapi-project-production-d4d2.up.railway.app';

const api = {
  getAllAnnonces: async function() {
    try {
      console.log('📦 Chargement des annonces...');
      const response = await fetch(`${API_URL}/api/annonces?sort[0]=createdAt:desc`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      console.log(`✅ ${data.data.length} annonces trouvées`);
      return data.data;
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      return [];
    }
  },

  login: async function(email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password: password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message };
      }
      
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data };
      
    } catch (error) {
      return { success: false, error: 'Erreur réseau' };
    }
  },

  logout: function() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  },

  isLoggedIn: function() {
    return localStorage.getItem('jwt') !== null;
  }
};

console.log('✅ API.js chargé');

// 🔥 IMPORTANT : Expose l'objet globalement
window.api = api;