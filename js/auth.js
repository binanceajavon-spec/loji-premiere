// auth.js - VERSION CORRIGÉE POUR STRAPI

const STRAPI_URL = 'http://localhost:1337';

window.auth = {
    // Vérifier si connecté
    isLoggedIn: function () {
        return !!(localStorage.getItem('jwt') && localStorage.getItem('user'));
    },

    // Récupérer l'utilisateur
    getUser: function () {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Récupérer le token
    getToken: function () {
        return localStorage.getItem('jwt');
    },

    // INSCRIPTION - Version corrigée pour Strapi
    register: async function (email, password, name, phone) {
        console.log('Tentative d\'inscription pour:', email);

        try {
            // ÉTAPE 1: Créer l'utilisateur avec les champs de base
            const userData = {
                username: name || email.split('@')[0], // Utiliser le nom comme username
                email: email,
                password: password
            };

            console.log('Étape 1 - Données de base envoyées:', userData);

            const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const registerResult = await registerResponse.json();
            console.log('Étape 1 - Réponse Strapi:', registerResult);

            if (!registerResponse.ok) {
                const errorMsg = registerResult.error?.message || registerResult.message || 'Erreur lors de l\'inscription';
                return { success: false, error: errorMsg };
            }

            // ÉTAPE 2: Si l'inscription de base réussit, mettre à jour avec les infos supplémentaires
            console.log('Étape 2 - Mise à jour du profil avec phone et name...');

            const updateResponse = await fetch(`${STRAPI_URL}/api/users/${registerResult.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${registerResult.jwt}`
                },
                body: JSON.stringify({
                    name: name || email.split('@')[0],
                    phone: phone || ''
                })
            });

            const updateResult = await updateResponse.json();
            console.log('Étape 2 - Résultat mise à jour:', updateResult);

            // Même si la mise à jour échoue, l'utilisateur est créé
            // On sauvegarde quand même les données
            const finalUser = {
                ...registerResult.user,
                name: name || email.split('@')[0],
                phone: phone || ''
            };

            localStorage.setItem('jwt', registerResult.jwt);
            localStorage.setItem('user', JSON.stringify(finalUser));

            return {
                success: true,
                user: finalUser,
                message: updateResponse.ok ? 'Compte créé avec succès' : 'Compte créé (profil partiellement mis à jour)'
            };

        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, error: 'Erreur réseau: ' + error.message };
        }
    },

    // CONNEXION - Version simplifiée
    login: async function (email, password) {
        console.log('Tentative de connexion pour:', email);

        try {
            const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: email,
                    password: password
                })
            });

            const result = await response.json();
            console.log('Réponse connexion:', result);

            if (response.ok) {
                localStorage.setItem('jwt', result.jwt);
                localStorage.setItem('user', JSON.stringify(result.user));

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

                return { success: true, user: result.user };
            } else {
                return { success: false, error: 'Email ou mot de passe incorrect' };
            }

        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, error: 'Erreur réseau' };
        }
    },

    // DÉCONNEXION
    logout: function () {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = 'connexion.html';
    },

    // MISE À JOUR DU PROFIL (pour plus tard)
    updateProfile: async function (userData) {
        const token = this.getToken();
        const user = this.getUser();

        if (!token || !user) {
            return { success: false, error: 'Non connecté' };
        }

        try {
            const response = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true, user: data };
            } else {
                return { success: false, error: data.error?.message };
            }
        } catch (error) {
            return { success: false, error: 'Erreur réseau' };
        }
    },

    // MISE À JOUR DU NUMÉRO (pour plus tard)
    updatePhone: function (phone) {
        const user = this.getUser();
        if (user) {
            user.phone = phone;
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    // RÉCUPÉRER LE NUMÉRO
    getPhone: function () {
        const user = this.getUser();
        return user ? user.phone : '';
    }
};

console.log('Auth chargé - Version corrigée pour Strapi');