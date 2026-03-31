// app-details-clean.js - Version Supabase
(function() {
    'use strict';
    
    console.log('📦 App-details clean - Version Supabase');
    
    let currentAnnonceImages = [];
    let currentLightboxIndex = 0;
    
    // =============================================
    // FONCTIONS UTILITAIRES
    // =============================================
    function renderStatMobile(icon, value, label) {
        return `
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    <span class="material-icons text-gray-600 text-base">${icon}</span>
                </div>
                <span class="text-xs font-bold text-gray-800">${value}</span>
                <span class="text-[10px] text-gray-500">${label}</span>
            </div>
        `;
    }
    
    function renderStatDesktop(icon, value, label) {
        return `
            <div class="text-center px-3">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-black shadow-sm">
                    <span class="material-icons text-2xl">${icon}</span>
                </div>
                <span class="font-bold block text-2xl text-gray-900 mb-1">${value}</span>
                <span class="text-xs text-gray-500 uppercase font-semibold tracking-wide">${label}</span>
            </div>
        `;
    }
    
    function generateFeaturesList(attrs) {
        const features = [
            { k: 'meuble', l: 'Meublé', i: 'chair' },
            { k: 'climatisation', l: 'Climatisation', i: 'ac_unit' },
            { k: 'internet', l: 'Internet / Wifi', i: 'wifi' },
            { k: 'parking', l: 'Parking', i: 'local_parking' },
            { k: 'securite', l: 'Sécurité 24/7', i: 'security' },
            { k: 'balcon', l: 'Balcon / Terrasse', i: 'balcony' }
        ];
    
        return features.map(f => {
            const isActive = attrs[f.k] === true;
            return `
                <div class="flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}">
                    <span class="material-icons ${isActive ? 'text-blue-600' : 'text-gray-300'}">
                        ${isActive ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span class="${isActive ? 'text-gray-800 font-medium' : 'text-gray-400'}">${f.l}</span>
                </div>
            `;
        }).join('');
    }
    
    function getAllImages(annonce) {
        const images = [];
        const photos = annonce.photos || [];
        
        photos.forEach(photo => {
            if (photo.url) images.push(photo.url);
        });
    
        if (images.length === 0) {
            return [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
            ];
        }
        return images;
    }
    
    function initMobileSwipeLogic() {
        const gallery = document.getElementById('mobileGallery');
        if (!gallery) return;
    
        gallery.addEventListener('scroll', () => {
            const index = Math.round(gallery.scrollLeft / gallery.offsetWidth);
            
            document.querySelectorAll('[id^="ind-"]').forEach((dot, i) => {
                if (i === index) {
                    dot.classList.remove('bg-white/60', 'w-1.5');
                    dot.classList.add('bg-white', 'w-6');
                } else {
                    dot.classList.add('bg-white/60', 'w-1.5');
                    dot.classList.remove('bg-white', 'w-6');
                }
            });
        });
    }
    
    // =============================================
    // FONCTIONS LIGHTBOX
    // =============================================
    function openLightbox(index) {
        if(!currentAnnonceImages || currentAnnonceImages.length === 0) return;
        
        currentLightboxIndex = index;
        const modal = document.getElementById('lightboxModal');
        const img = document.getElementById('lightboxImage');
        const counter = document.getElementById('lightboxCounter');
        
        if (!modal || !img || !counter) {
            console.error('❌ Éléments lightbox introuvables');
            return;
        }
        
        img.src = currentAnnonceImages[currentLightboxIndex];
        counter.innerText = currentLightboxIndex + 1;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        console.log('📸 Lightbox ouverte - image:', currentLightboxIndex);
    }
    
    function closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            console.log('📸 Lightbox fermée');
        }
    }
    
    function changeSlide(direction) {
        currentLightboxIndex += direction;
        
        if (currentLightboxIndex < 0) currentLightboxIndex = currentAnnonceImages.length - 1;
        if (currentLightboxIndex >= currentAnnonceImages.length) currentLightboxIndex = 0;
        
        const img = document.getElementById('lightboxImage');
        const counter = document.getElementById('lightboxCounter');
        
        if (img && counter) {
            img.style.opacity = '0.4';
            setTimeout(() => {
                img.src = currentAnnonceImages[currentLightboxIndex];
                counter.innerText = currentLightboxIndex + 1;
                img.style.opacity = '1';
            }, 150);
        }
    }
    
    // =============================================
    // INITIALISATION DES ÉVÉNEMENTS
    // =============================================
    function initEventListeners() {
        console.log('🎯 Initialisation des événements...');
        
        // Boutons lightbox
        document.getElementById('closeLightboxBtn')?.addEventListener('click', closeLightbox);
        document.getElementById('prevSlideBtn')?.addEventListener('click', () => changeSlide(-1));
        document.getElementById('nextSlideBtn')?.addEventListener('click', () => changeSlide(1));
        
        // Triggers lightbox (délégué d'événement)
        document.addEventListener('click', function(e) {
            const trigger = e.target.closest('.lightbox-open-btn, .lightbox-trigger, [data-index]');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(trigger.getAttribute('data-index') || '0');
                openLightbox(index);
            }
        });
        
        // Clavier
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('lightboxModal');
            if (!modal || modal.classList.contains('hidden')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'ArrowRight') changeSlide(1);
        });
    }
    
    // =============================================
    // FONCTION PRINCIPALE D'AFFICHAGE
    // =============================================
    function displayAnnonceDetail(annonce) {
        console.log('🎨 Affichage des détails...');
        const container = document.getElementById('annonceDetailContainer');
        if (!container) {
            console.error('❌ Container introuvable');
            return;
        }
        
        // Données (format Supabase direct)
        const titre = annonce.titre || 'Titre non disponible';
        const description = annonce.description || 'Aucune description disponible.';
        const prix = annonce.prix ? new Intl.NumberFormat('fr-FR').format(annonce.prix) : '0';
        const ville = annonce.ville || '';
        const quartier = annonce.quartier || '';
        
        currentAnnonceImages = getAllImages(annonce);
        console.log('🖼️ Images trouvées:', currentAnnonceImages.length);
    
        const chambres = annonce.nombredechambres || 0;
        const bains = annonce.nombresalledebain || 0;
        const surface = annonce.surface || 0;
        const meuble = annonce.meuble ? 'Oui' : 'Non';
    
        container.innerHTML = `
        <!-- Lightbox -->
        <div id="lightboxModal" class="fixed inset-0 z-[99999] bg-black/95 hidden flex items-center justify-center transition-opacity duration-300">
            <button id="closeLightboxBtn" class="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full backdrop-blur-md z-50 hover:bg-white/30 transition-all">
                <span class="material-icons text-2xl">close</span>
            </button>
            <button id="prevSlideBtn" class="absolute left-4 text-white p-4 hover:bg-white/10 rounded-full z-50 transition-all">
                <span class="material-icons text-4xl">chevron_left</span>
            </button>
            <img id="lightboxImage" src="" class="max-h-[85vh] max-w-[95vw] object-contain transition-all duration-300 select-none">
            <button id="nextSlideBtn" class="absolute right-4 text-white p-4 hover:bg-white/10 rounded-full z-50 transition-all">
                <span class="material-icons text-4xl">chevron_right</span>
            </button>
            <div class="absolute bottom-8 text-white font-medium bg-white/20 backdrop-blur px-6 py-2 rounded-full">
                <span id="lightboxCounter">1</span> / ${currentAnnonceImages.length}
            </div>
        </div>
    
        <!-- VERSION MOBILE -->
        <div class="block md:hidden bg-white min-h-screen pb-24">
            
            <!-- Galerie mobile -->
            <div class="relative w-full h-[60vh] bg-black overflow-hidden">
                <div class="flex overflow-x-auto w-full h-full snap-x snap-mandatory hide-scrollbar" id="mobileGallery">
                    ${currentAnnonceImages.map((img, idx) => `
                        <div class="flex-shrink-0 w-full h-full snap-center relative">
                            <img src="${img}" class="absolute inset-0 w-full h-full object-cover" data-index="${idx}">
                            <button class="lightbox-open-btn absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm flex items-center gap-1.5 z-20" data-index="${idx}">
                                <span class="material-icons text-base">fullscreen</span>
                                <span class="text-xs font-semibold">Agrandir</span>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
                    ${currentAnnonceImages.map((_, idx) => `
                        <div class="h-1.5 rounded-full transition-all duration-300 ${idx===0 ? 'bg-white w-6' : 'bg-white/60 w-1.5'}" id="ind-${idx}"></div>
                    `).join('')}
                </div>
                <button onclick="window.history.back()" class="absolute top-4 left-4 p-2.5 bg-white rounded-full text-gray-900 shadow-lg z-30">
                    <span class="material-icons text-xl">arrow_back</span>
                </button>
            </div>
    
            <!-- CONTENU UNIFIÉ -->
            <div class="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-6 py-8 -mt-6 z-20">
                
                <div class="mb-4">
                    <h1 class="text-2xl font-bold text-gray-900 leading-tight mb-2">${escapeHtml(titre)}</h1>
                    <div class="flex items-center text-gray-500 text-sm">
                        <span class="material-icons text-blue-600 text-base mr-1.5">location_on</span>
                        ${escapeHtml(ville)}${quartier ? ', ' + escapeHtml(quartier) : ''}
                    </div>
                </div>
    
                <div class="mb-6 pb-6 border-b border-gray-100">
                    <div class="flex items-end justify-between mb-4">
                         <div>
                            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Loyer mensuel</span>
                            <div class="text-3xl font-extrabold text-blue-600">${prix} <span class="text-sm font-normal text-gray-600">Fcfa</span></div>
                        </div>
                    </div>
    
                    <!-- 4 ICÔNES BIEN CENTRÉES -->
                    <div class="grid grid-cols-4 gap-2 pt-4">
                        ${renderStatMobile('bed', chambres, 'Chambres')}
                        ${renderStatMobile('bathtub', bains, 'Douches')}
                        ${renderStatMobile('straighten', surface, 'm²')}
                        ${renderStatMobile('weekend', meuble, 'Meublé')}
                    </div>
                </div>
    
                <div class="mb-8">
                    <h3 class="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-icons text-blue-600 text-xl">description</span>
                        Description
                    </h3>
                    <p class="text-gray-600 leading-relaxed text-sm text-justify">
                        ${escapeHtml(description)}
                    </p>
                </div>
    
                <div class="mb-4">
                    <h3 class="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <span class="material-icons text-blue-600 text-xl">apartment</span>
                        Commodités
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${generateFeaturesList(annonce)}
                    </div>
                </div>
                
                <!-- Référence -->
                <div class="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p class="text-gray-500 text-sm">
                        Référence: <span class="font-bold text-gray-700">#${annonce.id || 'N/A'}</span>
                    </p>
                </div>
            </div>
    
            <!-- Barre d'actions -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 pb-5 z-50 flex gap-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                
                <a href="tel:+2250700000000" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-xs active:scale-95 transition-transform">
                    <span class="material-icons text-lg">call</span> Appel
                </a>
                
                <a href="sms:+2250700000000" class="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-xs active:scale-95 transition-transform">
                    <span class="material-icons text-lg">sms</span> SMS
                </a>
    
                <a href="https://wa.me/2250700000000" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-xs shadow-lg shadow-blue-100 active:scale-95 transition-transform">
                     <svg class="w-5 h-5 fill-current mb-0.5" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                </a>
            </div>
        </div>
    
        <!-- VERSION DESKTOP -->
        <div class="hidden md:block container mx-auto px-6 py-10">
            
            <div class="grid grid-cols-12 gap-10">
                <div class="col-span-8">
                    <!-- Grande image principale -->
                    <div class="bg-gray-100 rounded-3xl overflow-hidden h-[500px] mb-4 relative group cursor-pointer shadow-sm lightbox-trigger" data-index="0">
                        <img src="${currentAnnonceImages[0]}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <span class="material-icons text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">zoom_in</span>
                        </div>
                    </div>
                    
                    <!-- 4 images horizontales -->
                    <div class="grid grid-cols-4 gap-4 mb-8">
                        ${currentAnnonceImages.slice(1, 5).map((img, idx) => `
                            <div class="h-32 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 lightbox-trigger" data-index="${idx+1}">
                                <img src="${img}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
                            </div>
                        `).join('')}
                    </div>
    
                    <!-- Contenu principal -->
                    <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                        <div class="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold text-gray-900 mb-3">${escapeHtml(titre)}</h1>
                                <p class="text-base text-gray-500 flex items-center">
                                    <span class="material-icons mr-2 text-blue-600">location_on</span> 
                                    ${escapeHtml(ville)}${quartier ? ', ' + escapeHtml(quartier) : ''}
                                </p>
                            </div>
                            <div class="text-right ml-8">
                                <div class="text-4xl font-bold text-blue-600">${prix} Fcfa</div>
                                <div class="text-gray-400 font-medium text-sm">par mois</div>
                            </div>
                        </div>
    
                        <div class="flex justify-around py-4 border-b border-gray-100">
                            ${renderStatDesktop('bed', chambres, 'Chambres')}
                            ${renderStatDesktop('bathtub', bains, 'Douches')}
                            ${renderStatDesktop('straighten', surface, 'Surface')}
                            ${renderStatDesktop('weekend', meuble, 'Meublé')}
                        </div>
                        
                        <div class="mt-8">
                            <h2 class="text-2xl font-bold mb-5 text-gray-900 flex items-center gap-3">
                                <span class="material-icons text-blue-600 text-2xl">description</span>
                                À propos de ce logement
                            </h2>
                            <p class="text-gray-600 text-base leading-relaxed text-justify">
                                ${escapeHtml(description)}
                            </p>
                        </div>
                        
                        <div class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span class="material-icons text-blue-600 text-2xl">apartment</span>
                                Ce que propose ce logement
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                ${generateFeaturesList(annonce)}
                            </div>
                        </div>
                        
                        <div class="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p class="text-gray-500">Référence: <span class="font-bold text-gray-700">#${annonce.id || 'N/A'}</span></p>
                        </div>
                    </div>
                </div>
    
                <!-- Sidebar contact -->
                <div class="col-span-4">
                    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-24">
                        
                        <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">Intéressé par ce bien ?</h3>
    
                        <div class="space-y-3 mb-6">
                            <a href="https://wa.me/2250700000000" target="_blank" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:-translate-y-1">
                                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                Discuter sur WhatsApp
                            </a>
                            
                            <a href="tel:+2250700000000" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
                                <span class="material-icons">call</span>
                                Appeler maintenant
                            </a>
                        </div>
    
                        <div class="pt-6 border-t border-gray-100 text-center">
                            <p class="text-gray-400 text-sm">Référence: <span class="font-bold">#${annonce.id || 'N/A'}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    
        // Initialiser les événements et le swipe mobile
        setTimeout(() => {
            initEventListeners();
            initMobileSwipeLogic();
            console.log('✅ Interface complètement initialisée');
        }, 100);
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // =============================================
    // FONCTION DE CHARGEMENT DES DONNÉES AVEC SUPABASE
    // =============================================
    async function loadAnnonce(requestedId) {
        try {
            console.log('📡 Chargement annonce ID:', requestedId);
            
            if (!window.api || !window.api.getAnnonceById) {
                console.error('❌ API non disponible');
                document.getElementById('annonceDetailContainer').innerHTML = 
                    '<div class="p-10 text-center text-red-500 font-bold">Erreur technique. API non disponible.</div>';
                return;
            }
            
            const annonce = await window.api.getAnnonceById(requestedId);
            
            if (annonce) {
                displayAnnonceDetail(annonce);
            } else {
                document.getElementById('annonceDetailContainer').innerHTML = 
                    '<div class="p-10 text-center text-red-500 font-bold">Annonce introuvable.</div>';
            }
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            document.getElementById('annonceDetailContainer').innerHTML = 
                '<div class="p-10 text-center text-red-500 font-bold">Erreur de chargement: ' + error.message + '</div>';
        }
    }
    
    // =============================================
    // FONCTION D'INITIALISATION PRINCIPALE
    // =============================================
    function initAnnonceDetails() {
        console.log('🚀 Initialisation détails annonce - Version Supabase');
        
        // 🔒 Garantir que le lightbox est CACHÉ au démarrage
        setTimeout(() => {
            const modal = document.getElementById('lightboxModal');
            if (modal) {
                modal.classList.add('hidden');
                console.log('✅ Lightbox garanti caché');
            }
        }, 50);
        
        const urlParams = new URLSearchParams(window.location.search);
        const annonceId = urlParams.get('id');
        
        if (!annonceId) {
            console.warn('⚠️ Aucun ID d\'annonce trouvé dans l\'URL');
            document.getElementById('annonceDetailContainer').innerHTML = 
                '<div class="p-10 text-center text-orange-500 font-bold">Aucune annonce spécifiée.</div>';
            return;
        }
        
        loadAnnonce(annonceId);
    }
    
    // =============================================
    // EXPOSITION GLOBALE
    // ============================================
    window.initAnnonceDetails = initAnnonceDetails;
    window.annonceDetails = {
        loadAnnonce,
        openLightbox,
        closeLightbox,
        changeSlide,
        displayAnnonceDetail
    };
    
    console.log('✅ App-details clean - Version Supabase prête');
})();