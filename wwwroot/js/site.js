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
    // FORMULAIRE - VALIDATION SIMPLE
    // =================================

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        const nomInput = document.getElementById('nom');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // =================================
        // GESTION DE L'ÉTAT DU BOUTON
        // =================================

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

        // =================================
        // ÉVÉNEMENTS INPUT (POUR LE BOUTON SEULEMENT)
        // =================================

        nomInput.addEventListener('input', checkFormCompletion);
        emailInput.addEventListener('input', checkFormCompletion);
        messageInput.addEventListener('input', checkFormCompletion);

        // État initial du bouton
        checkFormCompletion();

        // =================================
        // SOUMISSION DU FORMULAIRE
        // =================================

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Nettoyer toutes les classes de validation existantes
            nomInput.classList.remove('is-valid', 'is-invalid');
            emailInput.classList.remove('is-valid', 'is-invalid');
            messageInput.classList.remove('is-valid', 'is-invalid');

            // 2. Vérifier chaque champ et ajouter les classes appropriées
            let isFormValid = true;

            // Validation nom
            const nomValue = nomInput.value.trim();
            if (nomValue.length < 2) {
                nomInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                nomInput.classList.add('is-valid');
            }

            // Validation email
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                emailInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                emailInput.classList.add('is-valid');
            }

            // Validation message
            const messageValue = messageInput.value.trim();
            if (messageValue.length < 10) {
                messageInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                messageInput.classList.add('is-valid');
            }

            // 3. Si le formulaire n'est pas valide, scroller vers le premier champ en erreur
            if (!isFormValid) {
                const firstInvalidField = contactForm.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    // Petit délai pour que le scroll se termine avant le focus
                    setTimeout(() => {
                        firstInvalidField.focus();
                    }, 500);
                }
                return; // Arrêter l'exécution ici
            }

            // 4. Si tout est valide, procéder à l'envoi
            sendForm();
        });

        // =================================
        // FONCTION D'ENVOI
        // =================================

        function sendForm() {
            // Animation de chargement
            submitBtn.classList.add('loading');
            submitBtn.querySelector('.btn-text').textContent = 'Envoi en cours...';
            submitBtn.querySelector('.spinner-border').classList.remove('d-none');

            // Désactiver tout le formulaire
            const formElements = contactForm.querySelectorAll('input, textarea, button');
            formElements.forEach(element => {
                element.disabled = true;
            });

            // Simulation d'envoi (remplace par ton code d'envoi réel)
            setTimeout(() => {
                // Succès !
                showSuccessMessage();

                // Reset complet du formulaire
                contactForm.reset();

                // Supprimer toutes les classes de validation
                nomInput.classList.remove('is-valid', 'is-invalid');
                emailInput.classList.remove('is-valid', 'is-invalid');
                messageInput.classList.remove('is-valid', 'is-invalid');

                // Réactiver le formulaire
                formElements.forEach(element => {
                    element.disabled = false;
                });

                // Reset du bouton
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('.btn-text').textContent = 'Envoyer le message';
                submitBtn.querySelector('.spinner-border').classList.add('d-none');

                // Remettre le bouton en état initial (désactivé)
                checkFormCompletion();

                // Tracking
                trackInteraction('Contact', 'form_submitted', 'contact_form');

            }, 2000);
        }
    }

    // =================================
    // MESSAGE DE SUCCÈS
    // =================================

    function showSuccessMessage() {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3>Message envoyé avec succès !</h3>
                <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Parfait !
                </button>
            </div>
        `;

        // Styles pour la modale
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const content = modal.querySelector('.success-modal-content');
        content.style.cssText = `
            background: white;
            padding: 2.5rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 90%;
            animation: slideInUp 0.4s ease;
        `;

        const icon = modal.querySelector('.success-icon i');
        icon.style.cssText = `
            font-size: 5rem;
            color: #28a745;
            margin-bottom: 1.5rem;
            animation: bounceIn 0.6s ease;
        `;

        // Ajouter les animations CSS si elles n'existent pas
        if (!document.querySelector('#success-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'success-modal-styles';
            styles.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // Fermer automatiquement après 6 secondes
        setTimeout(() => {
            if (modal.parentElement) {
                modal.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => modal.remove(), 300);
            }
        }, 6000);

        // Ajouter animation de fermeture
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(fadeOutStyle);

        // Confettis pour célébrer !
        createConfetti();
    }

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
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('div');
            const colors = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${randomColor};
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 4 + 3}s linear forwards;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
            `;

            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentElement) {
                    confetti.remove();
                }
            }, 7000);
        }

        // Animation CSS pour les confettis
        if (!document.querySelector('#confetti-styles')) {
            const confettiStyles = document.createElement('style');
            confettiStyles.id = 'confetti-styles';
            confettiStyles.textContent = `
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
            `;
            document.head.appendChild(confettiStyles);
        }
    }

    // =================================
    // DEBUGGING
    // =================================

    if (window.location.hostname === 'localhost') {
        console.log('✅ Formulaire configuré : validation uniquement au submit');

        // Fonction utile pour tester
        window.testFormValidation = function () {
            console.log('Test de validation...');
            nomInput.value = 'T'; // Trop court
            emailInput.value = 'email-invalide'; // Email invalide
            messageInput.value = 'Court'; // Trop court

            // Simuler le clic sur submit
            contactForm.dispatchEvent(new Event('submit', { bubbles: true }));
        };

        window.testFormSuccess = function () {
            console.log('Test de succès...');
            nomInput.value = 'John Doe';
            emailInput.value = 'john@example.com';
            messageInput.value = 'Ceci est un message de test suffisamment long pour être valide.';

            // Simuler le clic sur submit
            contactForm.dispatchEvent(new Event('submit', { bubbles: true }));
        };

        console.log('🧪 Fonctions de test disponibles:');
        console.log('- window.testFormValidation() : Test avec erreurs');
        console.log('- window.testFormSuccess() : Test avec succès');
    }
});


// =================================
// HEADER SCROLL EFFECTS
// =================================

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.modern-header');

    if (header) {
        let lastScrollTop = 0;
        let isScrolling = false;

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Ajouter classe "scrolled" après 50px de scroll
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
            isScrolling = false;
        }

        // Throttle scroll event pour la performance
        window.addEventListener('scroll', function () {
            if (!isScrolling) {
                requestAnimationFrame(handleScroll);
                isScrolling = true;
            }
        }, { passive: true });
    }

    // Animation du logo au clic
    const logoCircle = document.querySelector('.logo-circle');
    if (logoCircle) {
        logoCircle.addEventListener('click', function () {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'shine 0.6s ease';
            }, 10);
        });
    }

    // Fermer le menu mobile en cliquant sur un lien
    const navLinks = document.querySelectorAll('.modern-nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});