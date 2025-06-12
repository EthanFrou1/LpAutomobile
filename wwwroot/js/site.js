// Slider photo dans catalogue
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".slider");

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll(".slide");
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle("opacity-100", i === index);
                slide.classList.toggle("opacity-0", i !== index);
                slide.classList.toggle("d-b", i === index);
                slide.classList.toggle("d-none", i !== index);
            });
        };

        const prevButton = slider.querySelector(".prev");
        const nextButton = slider.querySelector(".next");

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });

            nextButton.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
        }

        showSlide(currentIndex);
    });

    // 📌 Fixer le filtre au scroll
    const filtreForm = document.querySelector('.section-filtre');
    const offsetTop = filtreForm.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.scrollY > offsetTop) {
            filtreForm.classList.add('filtre-fixed');
        } else {
            filtreForm.classList.remove('filtre-fixed');
        }
    });

    document.querySelectorAll('.description-text').forEach(desc => {
        const maxLength = 150;
        const fullText = desc.textContent.trim();

        if (fullText.length > maxLength) {
            const shortText = fullText.slice(0, maxLength) + '...';
            desc.textContent = shortText;

            const button = desc.nextElementSibling;
            button.classList.remove('hidden');

            let isExpanded = false;
            button.addEventListener('click', () => {
                if (!isExpanded) {
                    desc.textContent = fullText;
                    button.textContent = "Voir moins";
                } else {
                    desc.textContent = shortText;
                    button.textContent = "Voir plus";
                }
                isExpanded = !isExpanded;
            });
        }
    });
});


// =================================
// ANIMATIONS PAGE D'ACCUEIL
// =================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // ANIMATION DES COMPTEURS
    // =================================

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60 FPS
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Formatage des nombres
            if (target >= 100) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Observer pour déclencher l'animation quand les stats sont visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    // Éviter de relancer l'animation
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    // Observer la section stats
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // =================================
    // SMOOTH SCROLL POUR LES ANCRES
    // =================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =================================
    // PARALLAX EFFECT POUR LE HERO
    // =================================

    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');

    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            // Appliquer l'effet parallax
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // =================================
    // ANIMATION DES BADGES AU HOVER
    // =================================

    const badges = document.querySelectorAll('.badge-item');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        badge.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =================================
    // ANIMATION DES BOUTONS
    // =================================

    const buttons = document.querySelectorAll('.btn-hero, .btn-hero-outline');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =================================
    // GESTION DU SCROLL INDICATOR
    // =================================

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        // Cacher l'indicateur après scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        });

        // Clic sur l'indicateur pour scroller
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.stats-section');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // =================================
    // ANIMATION DES FEATURE CARDS
    // =================================

    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Délai progressif
            }
        });
    }, { threshold: 0.3 });

    featureCards.forEach(card => {
        // État initial
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';

        cardObserver.observe(card);
    });

    // =================================
    // ANIMATION DES PROCESS STEPS
    // =================================

    const processSteps = document.querySelectorAll('.process-step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

                    // Animation du numéro
                    const stepNumber = entry.target.querySelector('.step-number');
                    if (stepNumber) {
                        stepNumber.style.animation = 'pulse 0.6s ease';
                    }
                }, index * 200);
            }
        });
    }, { threshold: 0.4 });

    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(40px)';
        step.style.transition = 'all 0.8s ease';

        stepObserver.observe(step);
    });

    // =================================
    // VALIDATION FORMULAIRE EN TEMPS RÉEL
    // =================================

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Animation de soumission
        contactForm.addEventListener('submit', function (e) {
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Envoi en cours...';
                submitBtn.disabled = true;
            }
        });
    }

    // =================================
    // LAZY LOADING DES IMAGES
    // =================================

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // =================================
    // GESTION DU REDIMENSIONNEMENT
    // =================================

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculer les hauteurs si nécessaire
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && window.innerWidth < 768) {
                heroSection.style.minHeight = '60vh';
            }
        }, 250);
    });

    // =================================
    // AMÉLIORATION DES PERFORMANCES
    // =================================

    // Préchargement des images importantes
    const preloadImages = [
        './img/hero-lp-automobile.jpg',
        './img/img1.webp'
    ];

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Optimisation du scroll
    let ticking = false;

    function updateScrollEffects() {
        // Tous les effets de scroll ici
        const scrolled = window.pageYOffset;

        // Parallax hero
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Scroll indicator
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // =================================
    // ANIMATIONS CSS CUSTOM
    // =================================

    // Ajout des animations CSS dynamiques
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .is-invalid {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // =================================
    // DEBUGGING (À RETIRER EN PROD)
    // =================================

    if (window.location.hostname === 'localhost') {
        console.log('🚀 Animations de la page d\'accueil chargées');
        console.log('📊 Compteurs:', document.querySelectorAll('[data-counter]').length);
        console.log('🎯 Feature cards:', featureCards.length);
        console.log('⚙️ Process steps:', processSteps.length);
    }
});

// =================================
// FONCTIONS UTILITAIRES
// =================================

// Fonction pour détecter si un élément est visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour les animations de type "typewriter"
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Fonction pour créer des confettis (pour célébrer les soumissions)
function createConfetti() {
    // Implémentation simple de confettis
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'][Math.floor(Math.random() * 4)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Animation de chute pour les confettis
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(confettiStyle);


// =================================
// VALIDATION FORMULAIRE - SUBMIT UNIQUEMENT
// =================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // BOUTON ITINÉRAIRE (inchangé)
    // =================================

    const btnItineraire = document.getElementById('btnItineraire');

    if (btnItineraire) {
        btnItineraire.addEventListener('click', function () {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);

            const destination = "14 Rue Louis Piquemal, 66240 Saint-Estève, France";

            function openGoogleMapsDirections() {
                const encodedDestination = encodeURIComponent(destination);
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                let mapsUrl;
                if (isMobile) {
                    mapsUrl = `https://maps.google.com/maps?daddr=${encodedDestination}&dirflg=d`;
                } else {
                    mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
                }

                window.open(mapsUrl, '_blank');
                trackInteraction('Maps', 'open_directions', destination);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const origin = `${lat},${lng}`;
                        const encodedDestination = encodeURIComponent(destination);
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodedDestination}&travelmode=driving`;
                        window.open(mapsUrl, '_blank');
                        trackInteraction('Maps', 'open_directions_with_geolocation', destination);
                    },
                    function (error) {
                        console.log('Géolocalisation non disponible:', error.message);
                        openGoogleMapsDirections();
                    },
                    { timeout: 5000, enableHighAccuracy: true }
                );
            } else {
                openGoogleMapsDirections();
            }
        });
    }
    
    // =================================
    // FORMULAIRE - VERSION CORRIGÉE QUI ENVOIE VRAIMENT
    // =================================

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        const nomInput = document.querySelector('input[name="Contact.Nom"]');
        const emailInput = document.querySelector('input[name="Contact.Email"]');
        const messageInput = document.querySelector('textarea[name="Contact.Message"]');
        const telephoneInput = document.querySelector('input[name="Contact.Telephone"]');

        // Vérification de sécurité
        if (!nomInput || !emailInput || !messageInput) {
            console.warn('❌ Éléments du formulaire non trouvés');
            return;
        }

        function checkFormCompletion() {
            const nomValid = nomInput.value.trim().length >= 2;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
            const messageValid = messageInput.value.trim().length >= 10;

            const isFormComplete = nomValid && emailValid && messageValid;

            if (isFormComplete) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-secondary');
            }
        }

        // Événements de validation en temps réel
        nomInput.addEventListener('input', () => {
            checkFormCompletion();
        });

        emailInput.addEventListener('input', () => {
            checkFormCompletion();
        });

        messageInput.addEventListener('input', () => {
            checkFormCompletion();
        });

        // Le téléphone n'est pas obligatoire
        if (telephoneInput) {
            telephoneInput.addEventListener('input', () => {
                const phone = telephoneInput.value.trim();
                if (phone && !/^[\d\s\+\-\(\)\.]{10,}$/.test(phone)) {
                    telephoneInput.setCustomValidity('Format de téléphone invalide');
                } else {
                    telephoneInput.setCustomValidity('');
                }
            });
        }

        // État initial - IMPORTANT : vérifier dès le chargement
        checkFormCompletion();

        // =================================
        // SOUMISSION - SANS e.preventDefault() !
        // =================================

        contactForm.addEventListener('submit', function (e) {
            // 1. Validation côté client
            let isFormValid = true;

            // Nettoyer les classes
            [nomInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });

            // Validation nom
            if (nomInput.value.trim().length < 2) {
                nomInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                nomInput.classList.add('is-valid');
            }

            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                emailInput.classList.add('is-valid');
            }

            // Validation message
            if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                messageInput.classList.add('is-valid');
            }

            // Validation téléphone (optionnel)
            if (telephoneInput && telephoneInput.value.trim()) {
                const phone = telephoneInput.value.trim();
                if (!/^[\d\s\+\-\(\)\.]{10,}$/.test(phone)) {
                    telephoneInput.classList.add('is-invalid');
                    isFormValid = false;
                } else {
                    telephoneInput.classList.add('is-valid');
                }
            }

            // 2. Si invalide, empêcher l'envoi
            if (!isFormValid) {
                e.preventDefault(); // ⚠️ Seulement ici en cas d'erreur
                const firstInvalidField = contactForm.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    setTimeout(() => {
                        firstInvalidField.focus();
                    }, 500);
                }
                return;
            }

            // 3. Si tout est valide, montrer l'animation et LAISSER LE FORMULAIRE S'ENVOYER
            showLoadingState();

        });

        // =================================
        // ANIMATION DE CHARGEMENT UNIQUEMENT
        // =================================

        function showLoadingState() {
            try {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');

                const btnText = submitBtn.querySelector('.btn-text');
                const spinner = submitBtn.querySelector('.spinner-border');

                if (btnText) {
                    btnText.textContent = 'Envoi en cours...';
                }

                if (spinner) {
                    spinner.classList.remove('d-none');
                }

                // Désactiver les champs
                const formElements = contactForm.querySelectorAll('input, textarea, button');
                formElements.forEach(element => {
                    element.disabled = true;
                });

            } catch (error) {
                console.warn('Erreur animation:', error);
                submitBtn.disabled = true;
            }
        }
    }

    // =================================
    // MODAL DE SUCCÈS MODERNE
    // =================================

    function showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon">
                    <svg class="checkmark" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                    </svg>
                </div>
                <h3>Message envoyé avec succès !</h3>
                <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeSuccessModal()">
                        <i class="bi bi-check me-1"></i>
                        Parfait !
                    </button>
                </div>
            </div>
        `;

        // Styles CSS pour la modal
        addModalStyles();

        document.body.appendChild(modal);

        // Animation d'apparition
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Fermeture automatique après 3 secondes
        setTimeout(() => {
            closeSuccessModal();
        }, 3000);

        // Confettis de célébration
        createConfetti();

        console.log('🎉 Modal de succès affichée');
    }

    // =================================
    // MODAL D'ERREUR
    // =================================

    function showErrorModal() {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="error-modal-content">
                <div class="error-icon">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <h3>Erreur d'envoi</h3>
                <p>Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement.</p>
                <div class="modal-actions">
                    <button class="btn btn-outline-primary" onclick="closeErrorModal()">
                        <i class="bi bi-arrow-repeat me-1"></i>
                        Réessayer
                    </button>
                    <a href="tel:+33633169477" class="btn btn-primary">
                        <i class="bi bi-telephone me-1"></i>
                        Nous appeler
                    </a>
                </div>
            </div>
        `;

        addModalStyles();
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
    }

    // =================================
    // FONCTIONS DE FERMETURE DES MODALS
    // =================================

    window.closeSuccessModal = function () {
        const modal = document.querySelector('.success-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    window.closeErrorModal = function () {
        const modal = document.querySelector('.error-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // =================================
    // FONCTIONS UTILITAIRES
    // =================================

    function trackInteraction(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        if (window.location.hostname === 'localhost') {
            console.log('📊 Track:', { category, action, label });
        }
    }


    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            const colors = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${randomColor};
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
            `;

            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentElement) {
                    confetti.remove();
                }
            }, 4000);
        }
    }

     //=================================
     //STYLES CSS POUR LES MODALS
     //=================================

    function addModalStyles() {
        if (document.querySelector('#modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .success-modal, .error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .success-modal.show, .error-modal.show {
                opacity: 1;
            }

            .success-modal-content, .error-modal-content {
                background: white;
                padding: 2.5rem;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                max-width: 450px;
                width: 90%;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }

            .success-modal.show .success-modal-content,
            .error-modal.show .error-modal-content {
                transform: translateY(0);
            }

            .success-icon {
                margin-bottom: 1.5rem;
            }

            .checkmark {
                width: 80px;
                height: 80px;
                margin: 0 auto;
                stroke-width: 2;
                stroke: #28a745;
                stroke-miterlimit: 10;
                margin-bottom: 1rem;
            }

            .checkmark-circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }

            .checkmark-check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }

            @keyframes stroke {
                100% {
                    stroke-dashoffset: 0;
                }
            }

            .error-icon i {
                font-size: 4rem;
                color: #dc3545;
                margin-bottom: 1rem;
            }

            .modal-actions {
                margin-top: 1.5rem;
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            @keyframes confettiFall {
                0% {
                    transform: translateY(-20px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .success-modal-content, .error-modal-content {
                    padding: 1.5rem;
                    margin: 1rem;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .modal-actions .btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(styles);
    }
});


// =================================
// HEADER SCROLL EFFECTS
// =================================

document.addeventlistener('domcontentloaded', function () {
    const header = document.queryselector('.modern-header');

    if (header) {
        let lastscrolltop = 0;
        let isscrolling = false;

        function handlescroll() {
            const scrolltop = window.pageyoffset || document.documentelement.scrolltop;

            // ajouter classe "scrolled" après 50px de scroll
            if (scrolltop > 50) {
                header.classlist.add('scrolled');
            } else {
                header.classlist.remove('scrolled');
            }

            lastscrolltop = scrolltop;
            isscrolling = false;
        }

        // throttle scroll event pour la performance
        window.addeventlistener('scroll', function () {
            if (!isscrolling) {
                requestanimationframe(handlescroll);
                isscrolling = true;
            }
        }, { passive: true });
    }

    // animation du logo au clic
    const logocircle = document.queryselector('.logo-circle');
    if (logocircle) {
        logocircle.addeventlistener('click', function () {
            this.style.animation = 'none';
            settimeout(() => {
                this.style.animation = 'shine 0.6s ease';
            }, 10);
        });
    }

    // fermer le menu mobile en cliquant sur un lien
    const navlinks = document.queryselectorall('.modern-nav-link');
    const navbarcollapse = document.queryselector('.navbar-collapse');
    const navbartoggler = document.queryselector('.navbar-toggler');

    navlinks.foreach(link => {
        link.addeventlistener('click', () => {
            if (navbarcollapse.classlist.contains('show')) {
                navbartoggler.click();
            }
        });
    });
});