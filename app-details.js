<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loji - Détails</title>
    
    <!-- Tailwind via CDN (une seule fois) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <!-- CSS perso -->
    <link rel="stylesheet" href="style-annonces.css">
</head>

<body class="bg-gray-50">
    <!-- Container navbar -->
    <div id="nav-multifunction-container"></div>
    
    <!-- Contenu -->
    <div id="annonceDetailContainer" class="pt-24 md:pt-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p class="mt-4 text-gray-600">Chargement...</p>
        </div>
    </div>

    <!-- SCRIPT SIMPLE -->
    <script>
        (function() {
            console.log('=== CHARGEMENT SIMPLIFIÉ ===');
            
            // Étape 1: Navbar
            const navScript = document.createElement('script');
            navScript.src = 'nav-multifunction.js';
            navScript.onload = function() {
                console.log('✅ Navbar chargée');
                
                // Initialiser navbar
                if (window.renderNavMultifunction) {
                    window.renderNavMultifunction();
                    console.log('✅ Navbar initialisée');
                    
                    // Étape 2: Détails annonce
                    setTimeout(() => {
                        const detailsScript = document.createElement('script');
                        detailsScript.src = 'app-details-clean.js';
                        detailsScript.onload = function() {
                            console.log('✅ App-details chargé');
                            
                            // Initialiser les détails
                            if (window.initAnnonceDetails) {
                                window.initAnnonceDetails();
                            }
                        };
                        document.body.appendChild(detailsScript);
                    }, 300);
                }
            };
            
            document.body.appendChild(navScript);
        })();
    </script>
</body>
</html>