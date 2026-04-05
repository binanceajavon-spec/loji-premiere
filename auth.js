// auth.js - Version SIMPLIFIÉE (sans création de profil)

window.auth = {
    isLoggedIn: function () {
        return window.api ? window.api.isLoggedIn() : false;
    },

    getUser: function () {
        return window.api ? window.api.getUser() : null;
    },

    getToken: function () {
        return localStorage.getItem('jwt');
    },

    register: async function (email, password, name, phone) {
        console.log('📝 Inscription Supabase pour:', email);
        
        // Attendre que le client soit disponible
        let retries = 0;
        while (!window.supabaseClient && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (!window.supabaseClient) {
            return { success: false, error: 'Service indisponible. Veuillez rafraîchir la page.' };
        }

        try {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        display_name: name || email.split('@')[0],
                        phone_number: phone || ''
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // ⚠️ PAS de création de profil dans la table users
                localStorage.setItem('jwt', data.session?.access_token || '');
                localStorage.setItem('user', JSON.stringify(data.user));

                return { 
                    success: true, 
                    user: data.user,
                    message: 'Compte créé avec succès'
                };
            }
            return { success: false, error: 'Erreur lors de l\'inscription' };
        } catch (error) {
            console.error('❌ Erreur inscription:', error);
            return { success: false, error: error.message };
        }
    },

    login: async function (email, password) {
        console.log('🔐 Tentative de connexion pour:', email);
        
        if (!window.api) {
            return { success: false, error: 'API non disponible' };
        }

        const result = await window.api.login(email, password);
        
        if (result.success) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
        
        return result;
    },

    logout: function () {
        if (window.api) {
            window.api.logout();
        } else {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            window.location.href = 'connexion.html';
        }
    },

    updateProfile: async function (userData) {
        // Fonctionnalité à venir
        return { success: false, error: 'Fonctionnalité à venir' };
    },

    updatePhone: function (phone) {
        localStorage.setItem('userPhone', phone);
    },

    getPhone: function () {
        return localStorage.getItem('userPhone') || '';
    }
};

console.log('✅ Auth.js - Version simplifiée chargée');