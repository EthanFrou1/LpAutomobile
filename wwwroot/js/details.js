// =================================
// vehicule DETAILS PAGE JAVASCRIPT - CORRIGÉ
// =================================

document.addEventListener('DOMContentLoaded', function () {
    initvehiculeDetails();
    initFormValidation();
    setupModalCloseListeners();
    addSuccessModalStyles();
    setupDateConstraints();

    // ✅ NOUVEAU : Gérer les messages TempData du serveur
    handleServerMessages();
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

// =================================
// VALIDATION DES BOUTONS SUBMIT
// =================================

function initFormValidation() {
    // Configuration des champs requis pour chaque modal
    const formConfigs = {
        interestModal: {
            requiredFields: ['nom', 'email', 'telephone', 'motivation'],
            submitSelector: '.contact-btn-primary'
        },
        offerModal: {
            requiredFields: ['nom', 'email', 'telephone', 'montant_offre', 'mode_paiement', 'date_achat_souhaitee'],
            submitSelector: '.contact-btn-warning'
        },
        testDriveModal: {
            requiredFields: ['nom', 'email', 'telephone', 'date_souhaitee', 'creneau', 'numero_permis', 'anciennete_permis'],
            submitSelector: '.contact-btn-success'
        }
    };

    // Setup chaque formulaire
    Object.keys(formConfigs).forEach(modalId => {
        const config = formConfigs[modalId];
        const modal = document.getElementById(modalId);

        if (modal) {
            const form = modal.querySelector('form');
            const submitBtn = modal.querySelector(config.submitSelector);

            if (form && submitBtn) {
                // Désactiver le bouton par défaut
                disableSubmitButton(submitBtn);

                // Ajouter les listeners de validation
                setupFormListeners(form, config.requiredFields, submitBtn);

                // ✅ MODIFICATION : Listener de soumission modifié
                form.addEventListener('submit', (e) => handleFormSubmit(e, form, submitBtn));
            }
        }
    });

    console.log('✅ Validation des formulaires initialisée');
}

function setupFormListeners(form, requiredFields, submitBtn) {
    // Récupérer tous les champs requis
    const fieldElements = requiredFields.map(fieldName =>
        form.querySelector(`[name="${fieldName}"]`)
    ).filter(field => field !== null);

    // Ajouter les listeners sur chaque champ
    fieldElements.forEach(field => {
        field.addEventListener('input', () => validateForm(fieldElements, submitBtn));
        field.addEventListener('change', () => validateForm(fieldElements, submitBtn));
        field.addEventListener('blur', () => validateSingleField(field));
    });

    // Validation initiale
    validateForm(fieldElements, submitBtn);
}

function validateForm(fieldElements, submitBtn) {
    let allValid = true;

    fieldElements.forEach(field => {
        const isValid = validateSingleField(field);
        if (!isValid) {
            allValid = false;
        }
    });

    // Activer/désactiver le bouton
    if (allValid) {
        enableSubmitButton(submitBtn);
    } else {
        disableSubmitButton(submitBtn);
    }

    return allValid;
}

function validateSingleField(field) {
    if (!field) return true;

    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = false;

    // Validation selon le type de champ
    switch (fieldName) {
        case 'nom':
            isValid = value.length >= 2;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'telephone':
            isValid = /^[0-9\s+()-]{8,}$/.test(value);
            break;
        case 'montant_offre':
            const montant = parseInt(value);
            isValid = montant > 0 && montant >= 1000;
            break;
        case 'date_souhaitee':
        case 'delai_achat_max':
            if (!value) {
                isValid = false;
                break;
            }
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            isValid = selectedDate >= today;
            break;
        case 'numero_permis':
            isValid = value.length >= 8;
            break;
        default:
            // Pour les select et autres champs
            isValid = value.length > 0;
    }

    // Appliquer les styles visuels
    applyFieldValidation(field, isValid, value.length > 0);

    return isValid;
}

function applyFieldValidation(field, isValid, hasValue) {
    // Retirer les anciennes classes
    field.classList.remove('is-valid', 'is-invalid');

    // Ajouter la classe appropriée seulement si le champ a une valeur
    if (hasValue) {
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
        }
    }
}

function enableSubmitButton(submitBtn) {
    if (!submitBtn) return;

    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
}

function disableSubmitButton(submitBtn) {
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
}

// =================================
// AJOUT DU CSS POUR LA VALIDATION
// =================================

// Ajouter les styles CSS nécessaires
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .is-valid {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
`;
document.head.appendChild(validationStyles);


// =================================
// FONCTION CLOSECONTACTMODAL CORRIGÉE (remplace ton ancienne version)
// =================================

function closeContactModal(type) {
    if (type === 'success') {
        // Fermer spécifiquement la modal de succès
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('show');
            setTimeout(() => {
                successModal.classList.add('d-none');
                document.body.style.overflow = '';
            }, 300);
        }
        return;
    }

    // ✅ FERMER TOUTES LES MODALES DE CONTACT
    const modals = ['interestModal', 'offerModal', 'testDriveModal'];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && !modal.classList.contains('d-none')) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('d-none');
            }, 300);
        }
    });

    document.body.style.overflow = '';
}

// =================================
// CSS POUR TA MODAL DE SUCCÈS (si pas déjà dans ton CSS)
// =================================

function addSuccessModalStyles() {
    if (document.getElementById('successModalStyles')) return;

    const style = document.createElement('style');
    style.id = 'successModalStyles';
    style.textContent = `
        .contact-modal.show {
            opacity: 1;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .success-modal, .error-modal {
            max-width: 400px;
        }
        
        .success-icon {
            width: 60px;
            height: 60px;
            background: #28a745;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
            font-size: 2rem;
        }
        
        .success-modal h3, .error-modal h3 {
            color: #333;
            margin-bottom: 1rem;
        }

         .error-icon {
            width: 60px;
            height: 60px;
            background: #dc3545;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
            font-size: 2rem;
        }
        
        .modal-message {
            color: #666;
            margin-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
            .success-modal, .error-modal {
                margin: 1rem;
                width: calc(100% - 2rem);
            }
        }
    `;
    document.head.appendChild(style);
}

// Ajouter les styles au chargement
document.addEventListener('DOMContentLoaded', () => {
    addSuccessModalStyles();
});

// =================================
// FONCTION HANDLEFORMSUBMIT MISE À JOUR
// =================================

function handleFormSubmit(e, form, submitBtn) {
    // ✅ NE PAS EMPÊCHER LA SOUMISSION !
    // e.preventDefault(); // ← SUPPRIMER CETTE LIGNE

    // Validation finale avant soumission
    const formType = getFormType(form);
    if (!validateContactForm(formType)) {
        e.preventDefault(); // Empêcher seulement si invalide
        console.log('Formulaire invalide pour:', formType);
        return;
    }

    // État de chargement (mais laisser le formulaire se soumettre)
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        Envoi en cours...
    `;

    console.log('📤 Soumission du formulaire:', formType);

    // ✅ LAISSER LE FORMULAIRE SE SOUMETTRE NATURELLEMENT
    // Le serveur C# va traiter la requête et rediriger
}

// =================================
// FONCTION HELPER POUR IDENTIFIER LE TYPE DE FORMULAIRE
// =================================

function getFormType(form) {
    const formId = form.id;
    switch (formId) {
        case 'interestForm':
            return 'interest';
        case 'offerForm':
            return 'offer';
        case 'testDriveForm':
            return 'testDrive';
        default:
            return 'unknown';
    }
}

function setupModalCloseListeners() {
    // ✅ BOUTONS DE FERMETURE (croix)
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            closeContactModal();
        });
    });

    // ✅ CLIC SUR LE FOND (OVERLAY) - plus précis
    const contactModals = ['interestModal', 'offerModal', 'testDriveModal'];
    contactModals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function (e) {
                // Si on clique directement sur la modal (pas sur son contenu)
                if (e.target === modal) {
                    closeContactModal();
                }
            });
        }
    });

    // ✅ FERMETURE AVEC ESCAPE - plus précis
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Vérifier s'il y a une modal ouverte
            const openContactModal = document.querySelector('#interestModal:not(.d-none), #offerModal:not(.d-none), #testDriveModal:not(.d-none)');
            const openSuccessModal = document.querySelector('#successModal:not(.d-none)');

            if (openSuccessModal) {
                closeContactModal('success');
            } else if (openContactModal) {
                closeContactModal();
            }
            // Sinon laisser les autres modales (photos) gérer Escape
        }
    });

    // ✅ BOUTON "PARFAIT" DE LA MODAL DE SUCCÈS
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const perfectBtn = successModal.querySelector('.btn-primary');
        if (perfectBtn) {
            perfectBtn.addEventListener('click', function (e) {
                e.preventDefault();
                closeContactModal('success');
            });
        }

        // ✅ CLIC SUR OVERLAY DE LA MODAL DE SUCCÈS
        const overlay = successModal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function () {
                closeContactModal('success');
            });
        }
    }
}

function setupDateConstraints() {
    // ✅ CONTRAINTES POUR LA DATE D'ESSAI
    const dateEssaiInput = document.querySelector('input[name="date_souhaitee"]');
    if (dateEssaiInput) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2); // 2 mois maximum
        const maxDateStr = maxDate.toISOString().split('T')[0];

        dateEssaiInput.setAttribute('min', todayStr);
        dateEssaiInput.setAttribute('max', maxDateStr);
    }

    // ✅ CONTRAINTES POUR LA DATE D'ACHAT (OFFRE)
    const dateAchatInput = document.querySelector('input[name="date_achat_souhaitee"]');
    if (dateAchatInput) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6); // 6 mois maximum pour l'achat
        const maxDateStr = maxDate.toISOString().split('T')[0];

        dateAchatInput.setAttribute('min', todayStr);
        dateAchatInput.setAttribute('max', maxDateStr);
    }
}

function handleServerMessages() {
    // Vérifier s'il y a des messages de succès ou d'erreur du serveur
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success) {
        showSuccessMessage();
    }

    if (error) {
        showErrorMessage(error);
    }
}


// =================================
// FONCTIONS POUR GÉRER LES MESSAGES DU SERVEUR
// =================================

function showSuccessMessage() {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;

    successModal.classList.remove('d-none');
    requestAnimationFrame(() => {
        successModal.classList.add('show');
    });

    document.body.style.overflow = 'hidden';

    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        closeContactModal('success');
    }, 5000);
}

function showErrorMessage(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    if (!errorModal) return;

    if (errorMessage && message) {
        errorMessage.textContent = message;
    }

    errorModal.classList.remove('d-none');
    requestAnimationFrame(() => {
        errorModal.classList.add('show');
    });

    document.body.style.overflow = 'hidden';
}

function closeContactModal(type) {
    if (type === 'success') {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('show');
            setTimeout(() => {
                successModal.classList.add('d-none');
                document.body.style.overflow = '';
            }, 300);
        }
        return;
    }

    if (type === 'error') {
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            errorModal.classList.remove('show');
            setTimeout(() => {
                errorModal.classList.add('d-none');
                document.body.style.overflow = '';
            }, 300);
        }
        return;
    }

    // Fermer les modales de formulaire
    const modals = ['interestModal', 'offerModal', 'testDriveModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && !modal.classList.contains('d-none')) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('d-none');
            }, 300);
        }
    });

    document.body.style.overflow = '';
}c