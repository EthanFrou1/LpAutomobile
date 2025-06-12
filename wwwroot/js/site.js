// =================================
// SLIDERS PHOTO DANS CATALOGUE
// =================================

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

    // Fixer le filtre au scroll
    const filtreForm = document.querySelector('.section-filtre');
    if (filtreForm) {
        const offsetTop = filtreForm.offsetTop;
        window.addEventListener('scroll', () => {
            if (window.scrollY > offsetTop) {
                filtreForm.classList.add('filtre-fixed');
            } else {
                filtreForm.classList.remove('filtre-fixed');
            }
        });
    }

    // Gestion des descriptions longues
    document.querySelectorAll('.description-text').forEach(desc => {
        const maxLength = 150;
        const fullText = desc.textContent.trim();

        if (fullText.length > maxLength) {
            const shortText = fullText.slice(0, maxLength) + '...';
            desc.textContent = shortText;

            const button = desc.nextElementSibling;
            if (button) {
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
        }
    });
});

// =================================
// ANIMATIONS PAGE D'ACCUEIL
// =================================

document.addEventListener("DOMContentLoaded", function () {

    // Animation des compteurs
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (target >= 100) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Observer pour les stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Smooth scroll pour les ancres
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

    // Parallax effect pour le hero
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Animation des badges au hover
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        badge.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animation des boutons
    const buttons = document.querySelectorAll('.btn-hero, .btn-hero-outline');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Gestion du scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        });

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

    // Animation des feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.3 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });

    // Animation des process steps
    const processSteps = document.querySelectorAll('.process-step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

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

    // Lazy loading des images
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

    // Gestion du redimensionnement
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && window.innerWidth < 768) {
                heroSection.style.minHeight = '60vh';
            }
        }, 250);
    });

    // Préchargement des images importantes
    const preloadImages = [
        './img/hero-lp-automobile.jpg',
        './img/img1.webp'
    ];

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Optimisation du scroll avec throttling
    let ticking = false;
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

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
});

// =================================
// BOUTON ITINÉRAIRE
// =================================

document.addEventListener("DOMContentLoaded", function () {
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

            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
            isScrolling = false;
        }

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
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});

// =================================
// GESTION DU FORMULAIRE DE CONTACT - VERSION UNIFIÉE
// =================================

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        // Setup de la validation en temps réel
        setupFormValidation();

        // Setup des événements des modales
        setupModalEvents();

        // Gestion de la soumission
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// =================================
// VALIDATION EN TEMPS RÉEL
// =================================

function setupFormValidation() {
    const nomInput = document.querySelector('input[name="Contact.Nom"]');
    const emailInput = document.querySelector('input[name="Contact.Email"]');
    const messageInput = document.querySelector('textarea[name="Contact.Message"]');
    const telephoneInput = document.querySelector('input[name="Contact.Telephone"]');
    const submitBtn = document.getElementById('submitBtn');

    if (!nomInput || !emailInput || !messageInput) {
        console.warn('❌ Éléments du formulaire non trouvés');
        return;
    }

    function checkFormCompletion() {
        const nomValid = nomInput.value.trim().length >= 2;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        const messageValid = messageInput.value.trim().length >= 10;

        const isFormComplete = nomValid && emailValid && messageValid;

        if (submitBtn) {
            submitBtn.disabled = !isFormComplete;
            submitBtn.classList.toggle('btn-primary', isFormComplete);
            submitBtn.classList.toggle('btn-secondary', !isFormComplete);
        }
    }

    // Event listeners pour la validation en temps réel
    [nomInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', checkFormCompletion);
        input.addEventListener('blur', checkFormCompletion);
    });

    // Validation téléphone (optionnel)
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

    // État initial
    checkFormCompletion();
}

// =================================
// SOUMISSION DU FORMULAIRE
// =================================

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validation côté client
    if (!validateForm()) {
        return;
    }

    // État de chargement
    setSubmitLoading(true);

    try {
        // Envoi AJAX avec header pour déclencher la réponse JSON
        const response = await fetch(form.action || window.location.pathname, {
            method: 'POST',
            body: formData,
            headers: {
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || '',
                'X-Requested-With': 'XMLHttpRequest'  // ✅ Ce header déclenche la réponse JSON
            }
        });

        if (response.ok) {
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // ✅ Réponse JSON - C'est ce qu'on veut !
                const result = await response.json();

                console.log('Résultat:', result);

                if (result.success) {
                    // Succès
                    clearForm();
                    showSuccessModal(result.message);
                } else {
                    // Erreur
                    showErrorModal(result.message);
                }
            } else {
                // Fallback si pas de JSON (ne devrait pas arriver)
                console.warn('Réponse HTML inattendue');
                clearForm();
                const nom = formData.get('Contact.Nom') || 'Cher client';
                showSuccessModal(`Merci ${nom} ! Votre message a été envoyé.`);
            }
        } else {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showErrorModal('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer ou nous contacter directement.');
    } finally {
        setSubmitLoading(false);
    }
}

function validateForm() {
    const nomInput = document.querySelector('input[name="Contact.Nom"]');
    const emailInput = document.querySelector('input[name="Contact.Email"]');
    const messageInput = document.querySelector('textarea[name="Contact.Message"]');
    const telephoneInput = document.querySelector('input[name="Contact.Telephone"]');

    let isValid = true;

    // Reset des classes de validation
    [nomInput, emailInput, messageInput, telephoneInput].forEach(input => {
        if (input) {
            input.classList.remove('is-valid', 'is-invalid');
        }
    });

    // Validation nom
    if (nomInput.value.trim().length < 2) {
        nomInput.classList.add('is-invalid');
        isValid = false;
    } else {
        nomInput.classList.add('is-valid');
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        emailInput.classList.add('is-valid');
    }

    // Validation message
    if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('is-invalid');
        isValid = false;
    } else {
        messageInput.classList.add('is-valid');
    }

    // Validation téléphone (optionnel)
    if (telephoneInput && telephoneInput.value.trim()) {
        const phone = telephoneInput.value.trim();
        if (!/^[\d\s\+\-\(\)\.]{10,}$/.test(phone)) {
            telephoneInput.classList.add('is-invalid');
            isValid = false;
        } else {
            telephoneInput.classList.add('is-valid');
        }
    }

    // Scroller vers le premier champ en erreur
    if (!isValid) {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => firstInvalid.focus(), 500);
        }
    }

    return isValid;
}

// =================================
// GESTION DES ÉTATS DU FORMULAIRE
// =================================

function setSubmitLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner-border');

    if (isLoading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Envoi en cours...';
        spinner.classList.remove('d-none');
        submitBtn.classList.add('loading');
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-secondary');
    } else {
        btnText.textContent = 'Envoyer le message';
        spinner.classList.add('d-none');
        submitBtn.classList.remove('loading');
    }
}

function clearForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();

        // Supprimer les classes de validation
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });

        // ✅ REMETTRE LE BOUTON À L'ÉTAT INITIAL (désactivé et gris)
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;  // Désactivé car formulaire vide
            submitBtn.classList.remove('btn-primary', 'loading');
            submitBtn.classList.add('btn-secondary');

            // Remettre le texte et cacher le spinner
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner-border');
            if (btnText) btnText.textContent = 'Envoyer le message';
            if (spinner) spinner.classList.add('d-none');
        }
    }
}

// =================================
// GESTION DES MODALES
// =================================

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');

    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.remove('d-none');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        /* Auto-fermeture après 5 secondes */
        setTimeout(() => {
            closeContactModal('success');
        }, 5000);

        // Confettis pour célébrer !
        createContactConfetti();
    }
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const messageEl = document.getElementById('errorMessage');

    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.remove('d-none');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        console.log('❌ Modal d\'erreur affichée');
    }
}

function closeContactModal(type) {
    const modal = document.getElementById(type === 'success' ? 'successModal' : 'errorModal');

    if (!modal) return;

    modal.classList.add('closing');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.classList.add('d-none');
        modal.classList.remove('closing');
        document.body.style.overflow = '';
    }, 300);
}

function retryContactForm() {
    closeContactModal('error');

    setTimeout(() => {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                const firstInput = contactForm.querySelector('input, textarea');
                if (firstInput) firstInput.focus();
            }, 1000);
        }
    }, 300);
}

function setupModalEvents() {
    // Fermeture des modales en cliquant sur l'overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.contact-modal');
            if (modal.id === 'successModal') {
                closeContactModal('success');
            } else if (modal.id === 'errorModal') {
                closeContactModal('error');
            }
        });
    });

    // Fermeture avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const successModal = document.getElementById('successModal');
            const errorModal = document.getElementById('errorModal');

            if (successModal && successModal.classList.contains('show')) {
                closeContactModal('success');
            } else if (errorModal && errorModal.classList.contains('show')) {
                closeContactModal('error');
            }
        }
    });
}

// =================================
// CONFETTIS POUR LA RÉUSSITE
// =================================

function createContactConfetti() {
    const colors = ['#28a745', '#20c997', '#007bff', '#ffc107', '#fd7e14'];
    const confettiCount = 80;

    for (let i = 0; i < confettiCount; i++) {
        createSingleConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createSingleConfetti(color) {
    const confetti = document.createElement('div');

    confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${color};
        left: ${Math.random() * window.innerWidth}px;
        top: -20px;
        z-index: 10000;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        opacity: 0.9;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 4 + 3}s linear forwards;
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
if (!document.querySelector('#confetti-animation-styles')) {
    const confettiStyles = document.createElement('style');
    confettiStyles.id = 'confetti-animation-styles';
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
}