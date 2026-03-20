// ========== CARROUSEL HERO ==========
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        // Retirer la classe active de toutes les slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Ajouter la classe active à la slide courante
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Démarrer le carrousel automatique
    setInterval(nextSlide, 5000); // Change toutes les 5 secondes
    
    // Afficher la première slide
    showSlide(currentSlide);
}

// Initialiser le carrousel hero quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    initHeroCarousel();
    
    // ... le reste de votre code existant pour les autres carrousels ...
});



// Script pour l'accordéon mobile
    document.querySelectorAll('.mobile-dropdown-header').forEach(header => {
        header.addEventListener('click', () => {
            const container = header.parentElement;
            const content = container.querySelector('.mobile-dropdown-content');
            
            // Toggle la classe active
            container.classList.toggle('active');
            
            // Ouvre ou ferme
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    