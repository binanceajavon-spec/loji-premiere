// api.js - Version Supabase pour Loji

(function() {
    'use strict';
    
    const SUPABASE_URL = 'https://dcatxwropmhqhkwnnwlo.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_RhLMVwykdXcp7qEcCc-3mQ_UEn2wpEQ';

    // Créer le client Supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // EXPOSER LE CLIENT GLOBALEMENT POUR auth.js ET AUTRES
    window.supabaseClient = supabase;
    
    // API principale
    const api = {
        // ========== ANNONCES ==========
        getAllAnnonces: async function() {
            try {
                // Récupérer les annonces AVEC leurs photos
                const { data: annonces, error } = await supabase
                    .from('annonces')
                    .select(`
                        *,
                        photos:photos(url)
                    `)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                return { data: annonces || [] };
            } catch (error) {
                console.error('Erreur getAllAnnonces:', error);
                return { data: [] };
            }
        },

        getAnnonceById: async function(id) {
            try {
                // Récupérer l'annonce AVEC ses photos
                const { data: annonce, error } = await supabase
                    .from('annonces')
                    .select(`
                        *,
                        photos:photos(url)
                    `)
                    .eq('id', id)
                    .single();
                if (error) throw error;
                return annonce;
            } catch (error) {
                console.error('Erreur getAnnonceById:', error);
                return null;
            }
        },

        getUserAnnonces: async function() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                
                if (!user) return [];
                
                // Récupérer les annonces de l'utilisateur AVEC leurs photos
                const { data: annonces, error } = await supabase
                    .from('annonces')
                    .select(`
                        *,
                        photos:photos(url)
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                
                // Formater pour le dashboard
                return (annonces || []).map(ad => ({
                    id: ad.id,
                    titre: ad.titre,
                    prix: ad.prix,
                    ville: ad.ville,
                    image: ad.photos?.[0]?.url || '/images/default-house.jpg',
                    vues: ad.views || 0,
                    messages: ad.messages || 0,
                    visites: ad.visits || 0
                }));
            } catch (error) {
                console.error('Erreur getUserAnnonces:', error);
                return [];
            }
        },

        createAnnonce: async function(annonceData) {
            try {
                console.log('🔍 Vérification session...');
                
                // Récupérer la session
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                
                if (!user) {
                    throw new Error('Non authentifié');
                }
                
                console.log('👤 Création annonce pour user:', user.id);
                
                // Insertion SANS le champ images
                const { data, error } = await supabase
                    .from('annonces')
                    .insert({
                        titre: annonceData.Titre,
                        prix: annonceData.Prix,
                        description: annonceData.Description || '',
                        typedebien: annonceData.Typedebien,
                        ville: annonceData.Ville,
                        quartier: annonceData.Quartier,
                        surface: annonceData.Surface,
                        nombredepieces: annonceData.Nombredepieces,
                        meuble: annonceData.Meuble === true || annonceData.Meuble === 'on',
                        climatisation: annonceData.Climatisation === true || annonceData.Climatisation === 'on',
                        parking: annonceData.Parking === true || annonceData.Parking === 'on',
                        balcon: annonceData.Balcon === true || annonceData.Balcon === 'on',
                        securite: annonceData.Securite === true || annonceData.Securite === 'on',
                        internet: annonceData.Internet === true || annonceData.Internet === 'on',
                        nombredechambres: annonceData.Nombredechambres,
                        nombresalledebain: annonceData.Nombresalledebain,
                        user_id: user.id
                    })
                    .select()
                    .single();
                
                if (error) {
                    console.error('❌ Erreur insertion:', error);
                    throw error;
                }
                
                console.log('✅ Annonce créée ID:', data.id);
                
                return { data: { id: data.id } };
                
            } catch (error) {
                console.error('❌ Erreur createAnnonce:', error);
                throw error;
            }
        },

        uploadImage: async function(file, annonceId) {
            try {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `${annonceId}/${fileName}`;
                const { error: uploadError } = await supabase.storage
                    .from('annonces-images')
                    .upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage
                    .from('annonces-images')
                    .getPublicUrl(filePath);
                
                // Enregistrer dans la table photos
                const { error: photoError } = await supabase
                    .from('photos')
                    .insert({
                        url: publicUrl,
                        annonce_id: annonceId
                    });
                if (photoError) console.error('Erreur sauvegarde photo:', photoError);
                
                return [{ id: Date.now(), url: publicUrl }];
            } catch (error) {
                console.error('Erreur uploadImage:', error);
                throw error;
            }
        },

        deleteAnnonce: async function(id) {
            try {
                // Supprimer d'abord les photos de la table
                await supabase
                    .from('photos')
                    .delete()
                    .eq('annonce_id', id);
                
                // Puis supprimer l'annonce
                const { error } = await supabase
                    .from('annonces')
                    .delete()
                    .eq('id', id);
                return !error;
            } catch (error) {
                console.error('Erreur deleteAnnonce:', error);
                return false;
            }
        },

        // ========== AUTHENTIFICATION ==========
        login: async function(email, password) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ 
                    email: email, 
                    password: password 
                });
                if (error) throw error;

                localStorage.setItem('jwt', data.session.access_token);
                localStorage.setItem('refresh_token', data.session.refresh_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                console.log('✅ Connexion réussie pour:', email);
                return { success: true, data };
            } catch (error) {
                console.error('❌ Erreur login:', error);
                return { success: false, error: error.message };
            }
        },

        logout: function() {
            supabase.auth.signOut();
            localStorage.removeItem('jwt');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            console.log('✅ Déconnexion réussie');
            window.location.href = 'connexion.html';
        },

        isLoggedIn: function() {
            const token = localStorage.getItem('jwt');
            return token !== null;
        },

        getUser: function() {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        },

        // ========== UTILITAIRES ==========
        getSupabaseClient: function() {
            return supabase;
        },

        getPhone: function() {
            return localStorage.getItem('userPhone');
        }
    };

    // Exposer l'API globalement
    window.api = api;
    window.API = api;
    
    console.log('✅ API Supabase chargée');
    console.log('✅ Supabase Client exposé globalement');
})();