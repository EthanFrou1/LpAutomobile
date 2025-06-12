// =================================
// vehicule DETAILS PAGE JAVASCRIPT - CORRIGÉ
// =================================

document.addEventListener('DOMContentLoaded', function () {
    initvehiculeDetails();
});

// Variables globales
let currentPhotoIndex = 0;
let totalPhotos = 0;
let vehiculePhotos = [];

// =================================
// INITIALISATION
// =================================

function initvehiculeDetails() {
    setupPhotoGallery();
    setupThumbnails();
    console.log('🚗 Page détails véhicule initialisée');
}

// =================================
// GALERIE PHOTOS - CORRIGÉE
// =================================

function setupPhotoGallery() {
    // Récupérer SEULEMENT les photos du véhicule (pas les avis Google)
    const vehiculeCarousel = document.getElementById('vehiculePhotosCarousel');
    if (!vehiculeCarousel) return;

    const photoElements = vehiculeCarousel.querySelectorAll('.carousel-item img.main-photo');
    vehiculePhotos = Array.from(photoElements).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    totalPhotos = vehiculePhotos.length;

    console.log('📸 Photos véhicule trouvées:', totalPhotos);

    // Initialiser Bootstrap carousel avec événements
    const bsCarousel = new bootstrap.Carousel(vehiculeCarousel, {
        interval: false, // Pas d'auto-play
        wrap: true,
        keyboard: true
    });

    // Écouter les changements de slide Bootstrap
    vehiculeCarousel.addEventListener('slid.bs.carousel', function (e) {
        currentPhotoIndex = e.to;
        updateThumbnails();
        console.log('Slide changé vers:', currentPhotoIndex);
    });

    // Écouter les clics sur les contrôles
    const prevBtn = vehiculeCarousel.querySelector('.carousel-control-prev');
    const nextBtn = vehiculeCarousel.querySelector('.carousel-control-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            bsCarousel.prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            bsCarousel.next();
        });
    }
}

function setupThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function (e) {
            e.preventDefault();
            currentPhotoIndex = index;

            // Utiliser Bootstrap carousel pour aller au slide
            const carousel = bootstrap.Carousel.getInstance(document.getElementById('vehiculePhotosCarousel'));
            if (carousel) {
                carousel.to(index);
            }

            updateThumbnails();
        });
    });
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentPhotoIndex);
    });
}

// =================================
// MODAL PHOTOS - CORRIGÉE
// =================================

function openPhotoModal(index) {
    if (!vehiculePhotos[index]) {
        console.error('Photo non trouvée à l\'index:', index);
        return;
    }

    currentPhotoIndex = index;
    const modal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const counter = document.getElementById('modalPhotoCounter');

    modalPhoto.src = vehiculePhotos[index].src;
    modalPhoto.alt = vehiculePhotos[index].alt;
    counter.textContent = `${index + 1} / ${totalPhotos}`;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    console.log('Modal ouverte pour photo:', index);
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function nextModalPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
    updateModalPhoto();
}

function prevModalPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
    updateModalPhoto();
}

function updateModalPhoto() {
    const modalPhoto = document.getElementById('modalPhoto');
    const counter = document.getElementById('modalPhotoCounter');

    if (vehiculePhotos[currentPhotoIndex]) {
        modalPhoto.style.opacity = '0';

        setTimeout(() => {
            modalPhoto.src = vehiculePhotos[currentPhotoIndex].src;
            modalPhoto.alt = vehiculePhotos[currentPhotoIndex].alt;
            counter.textContent = `${currentPhotoIndex + 1} / ${totalPhotos}`;
            modalPhoto.style.opacity = '1';
        }, 150);
    }
}

// Gestion des touches clavier pour la modal photo
document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('photoModal');
    if (modal && modal.style.display === 'flex') {
        switch (e.key) {
            case 'Escape':
                closePhotoModal();
                break;
            case 'ArrowLeft':
                prevModalPhoto();
                break;
            case 'ArrowRight':
                nextModalPhoto();
                break;
        }
    }
});

// =================================
// MODAL DE CONTACT (optionnel)
// =================================

function openContactModal(type) {
    console.log('Ouverture modal contact:', type);
    // Tu peux ajouter ici la logique de contact si tu veux

    // Pour l'instant, on simule juste un alert
    const messages = {
        interest: 'Merci pour votre intérêt ! Contactez-nous au 06 33 16 94 77',
        offer: 'Contactez-nous pour faire une offre au 06 33 16 94 77',
        reservation: 'Contactez-nous pour réserver un essai au 06 33 16 94 77'
    };

    alert(messages[type] || 'Contactez-nous au 06 33 16 94 77');
}

function closeContactModal() {
    // Fonction vide pour éviter les erreurs
}

// =================================
// FONCTIONS UTILITAIRES
// =================================

function showAllEquipment() {
    console.log('Afficher tous les équipements');
    // Tu peux ajouter ici la logique pour afficher tous les équipements
}

// =================================
// GESTION RESPONSIVE
// =================================

function handleResize() {
    const width = window.innerWidth;

    if (width < 768) {
        // Mobile: ajuster la hauteur du carousel
        const carousel = document.querySelector('.photo-carousel');
        if (carousel) {
            carousel.style.height = '250px';
        }
    } else if (width < 1024) {
        // Tablet
        const carousel = document.querySelector('.photo-carousel');
        if (carousel) {
            carousel.style.height = '350px';
        }
    } else {
        // Desktop
        const carousel = document.querySelector('.photo-carousel');
        if (carousel) {
            carousel.style.height = '400px';
        }
    }
}

window.addEventListener('resize', handleResize);

// =================================
// FONCTIONS GLOBALES (exposées)
// =================================

window.openPhotoModal = openPhotoModal;
window.closePhotoModal = closePhotoModal;
window.nextModalPhoto = nextModalPhoto;
window.prevModalPhoto = prevModalPhoto;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.showAllEquipment = showAllEquipment;

// =================================
// GESTION DES CLASSES D-NONE POUR LES MODALS
// =================================

function openContactModal(type) {
    let modalId;
    switch (type) {
        case 'interest':
            modalId = 'interestModal';
            break;
        case 'offer':
            modalId = 'offerModal';
            break;
        case 'reservation':
            modalId = 'testDriveModal';
            break;
        default:
            console.error('Type de modal inconnu:', type);
            return false;
    }

    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal non trouvée:', modalId);
        return false;
    }

    // ✅ ENLEVER LA CLASSE D-NONE POUR AFFICHER
    modal.classList.remove('d-none');

    // Petite animation d'apparition
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';

    return true;
}

function closeContactModal() {
    // Fermer toutes les modals ouvertes
    const modals = ['interestModal', 'offerModal', 'testDriveModal'];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && !modal.classList.contains('d-none')) {
            // Animation de fermeture
            modal.classList.remove('show');

            // ✅ REMETTRE LA CLASSE D-NONE APRÈS L'ANIMATION
            setTimeout(() => {
                modal.classList.add('d-none');
            }, 300); // 300ms pour laisser le temps à l'animation
        }
    });

    // Remettre le scroll du body
    document.body.style.overflow = '';
}

// ✅ FERMETURE EN CLIQUANT SUR LES BOUTONS DE FERMETURE
document.addEventListener('DOMContentLoaded', function () {
    // Boutons avec data-bs-dismiss="modal"
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', closeContactModal);
    });

    // Fermeture en cliquant sur le fond (overlay)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            // Si on clique sur le fond (pas sur le contenu)
            if (e.target === modal) {
                closeContactModal();
            }
        });
    });

    // Fermeture avec la touche Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeContactModal();
        }
    });
});