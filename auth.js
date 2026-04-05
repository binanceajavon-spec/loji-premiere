// auth.js - Version Supabase corrigée

// CRÉER LE CLIENT SUPABASE IMMÉDIATEMENT
(function() {
    'use strict';
    
    // Configuration Supabase
    const SUPABASE_URL = 'https://dcatxwropmhqhkwnnwlo.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_RhLMVwykdXcp7qEcCc-3mQ_UEn2wpEQ';
    
    // Attendre que le SDK Supabase soit chargé
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Client Supabase créé par auth.js');
        console.log('✅ auth disponible:', !!window.supabaseClient.auth);
    } else {
        console.error('❌ Supabase SDK non disponible');
        // Réessayer dans 100ms
        setTimeout(function() {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Client Supabase créé (retardé)');
            }
        }, 100);
    }
})();

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
        
        // VÉRIFICATION CRITIQUE : s'assurer que le client existe
        if (!window.supabaseClient) {
            console.error('❌ supabaseClient non disponible, tentative de recréation...');
            
            // Tentative de recréation
            const SUPABASE_URL = 'https://dcatxwropmhqhkwnnwlo.supabase.co';
            const SUPABASE_ANON_KEY = 'sb_publishable_RhLMVwykdXcp7qEcCc-3mQ_UEn2wpEQ';
            
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Client Supabase recréé avec succès');
            } else {
                return { success: false, error: 'Service d\'authentification indisponible. Veuillez rafraîchir la page.' };
            }
        }
        
        if (!window.supabaseClient.auth) {
            console.error('❌ window.supabaseClient.auth est undefined');
            return { success: false, error: 'Service d\'authentification indisponible.' };
        }

        try {
            // Utiliser le client supabase
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
                // Créer le profil dans la table users (optionnel)
                if (window.supabaseClient) {
                    try {
                        await window.supabaseClient
                            .from('users')
                            .upsert({
                                id: data.user.id,
                                username: name || email.split('@')[0],
                                email: email,
                                phone: phone || ''
                            });
                    } catch (profileError) {
                        console.warn('⚠️ Erreur création profil (non bloquante):', profileError);
                    }
                }

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
        if (!window.api) return { success: false, error: 'API non disponible' };
        
        try {
            const user = window.api.getUser();
            if (!user) return { success: false, error: 'Non connecté' };

            if (!window.supabaseClient) {
                return { success: false, error: 'Service indisponible' };
            }

            const { error } = await window.supabaseClient
                .from('users')
                .update(userData)
                .eq('id', user.id);

            if (error) throw error;

            const updatedUser = { ...user, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    updatePhone: function (phone) {
        const user = this.getUser();
        if (user) {
            user.phone = phone;
            localStorage.setItem('user', JSON.stringify(user));
            if (window.api && user.id && window.supabaseClient) {
                window.supabaseClient.from('users').update({ phone }).eq('id', user.id);
            }
        }
    },

    getPhone: function () {
        const user = this.getUser();
        return user?.phone || localStorage.getItem('userPhone') || '';
    }
};

console.log('✅ Auth.js - Version Supabase chargée');
console.log('✅ supabaseClient disponible:', !!window.supabaseClient);
console.log('✅ supabaseClient.auth:', !!window.supabaseClient?.auth);