// auth.js - Version Supabase

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
        
        if (!window.api) {
            return { success: false, error: 'API non disponible' };
        }

        try {
            // Utiliser le client supabase partagé
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
                // Créer le profil dans la table users
                await window.supabaseClient
                    .from('users')
                    .upsert({
                        id: data.user.id,
                        username: name || email.split('@')[0],
                        email: email,
                        phone: phone || ''
                    });

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
            if (window.api && user.id) {
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