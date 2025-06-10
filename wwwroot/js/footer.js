// =================================
// SCROLL TO TOP FUNCTIONALITY
// =================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // BOUTON SCROLL TO TOP
    // =================================

    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {

        // Fonction pour afficher/masquer le bouton
        function toggleScrollButton() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('show');

                // Ajouter effet pulse si on scroll beaucoup
                if (scrollTop > 1000) {
                    scrollToTopBtn.classList.add('pulse');
                } else {
                    scrollToTopBtn.classList.remove('pulse');
                }
            } else {
                scrollToTopBtn.classList.remove('show', 'pulse');
            }
        }

        // Fonction de scroll vers le haut
        function scrollToTop() {
            const scrollDuration = 800;
            const scrollStep = -window.scrollY / (scrollDuration / 15);

            function scrollAnimation() {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                    requestAnimationFrame(scrollAnimation);
                }
            }

            requestAnimationFrame(scrollAnimation);
        }

        // Alternative avec smooth scroll (plus moderne)
        function smoothScrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Event listeners
        window.addEventListener('scroll', toggleScrollButton);

        scrollToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Effet visuel au clic
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Choix entre les deux méthodes de scroll
            if ('scrollBehavior' in document.documentElement.style) {
                smoothScrollToTop();
            } else {
                scrollToTop();
            }
        });

        // Animation d'entrée au chargement
        setTimeout(() => {
            toggleScrollButton();
        }, 1000);
    }

    // =================================
    // ANIMATIONS FOOTER AU SCROLL
    // =================================

    const footerElements = document.querySelectorAll('.footer-animate');

    if (footerElements.length > 0) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Délai progressif
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        footerElements.forEach(element => {
            footerObserver.observe(element);
        });
    }

    // =================================
    // GESTION DES LIENS FOOTER
    // =================================

    // Smooth scroll pour les liens internes
    const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // Tracking des clics sur les liens externes (pour analytics)
    const externalLinks = document.querySelectorAll('.footer-link[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Ici tu peux ajouter ton code de tracking
            console.log('Clic externe:', this.href);

            // Exemple avec Google Analytics (si tu l'utilises)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Footer',
                    event_label: this.href
                });
            }
        });
    });

    // =================================
    // ANIMATION DES RÉSEAUX SOCIAUX
    // =================================

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =================================
    // EASTER EGG : KONAMI CODE
    // =================================

    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function (e) {
        konamiCode.push(e.code);

        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activé !
            triggerEasterEgg();
            konamiCode = [];
        }
    });

    function triggerEasterEgg() {
        // Animation spéciale du logo
        const logo = document.querySelector('.logo-circle');
        if (logo) {
            logo.style.animation = 'spin 2s ease-in-out';

            // Confettis
            createConfetti();

            // Message secret
            setTimeout(() => {
                alert('🎉 Félicitations ! Vous avez trouvé l\'easter egg de LP Automobile ! 🚗');
            }, 1000);
        }
    }

    // =================================
    // PERFORMANCE OPTIMIZATIONS
    // =================================

    // Throttle pour les événements de scroll
    let scrollThrottle = false;

    function throttledScrollHandler() {
        if (!scrollThrottle) {
            requestAnimationFrame(() => {
                toggleScrollButton();
                scrollThrottle = false;
            });
            scrollThrottle = true;
        }
    }

    // Remplacer l'event listener normal par la version throttlée
    window.removeEventListener('scroll', toggleScrollButton);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // =================================
    // GESTION DES ERREURS
    // =================================

    // Gestion des erreurs de scroll
    window.addEventListener('error', function (e) {
        if (e.message.includes('scroll')) {
            console.warn('Erreur de scroll détectée, fallback activé');

            // Fallback simple
            if (scrollToTopBtn) {
                scrollToTopBtn.addEventListener('click', function () {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                });
            }
        }
    });

    // =================================
    // UTILS FOOTER
    // =================================

    // Fonction pour mettre à jour l'année automatiquement
    function updateCopyrightYear() {
        const copyrightElement = document.querySelector('.footer-bottom p');
        if (copyrightElement) {
            const currentYear = new Date().getFullYear();
            copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\d{4}/, currentYear);
        }
    }

    updateCopyrightYear();

    // Fonction pour créer des confettis (déjà définie dans l'autre fichier JS)
    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${['#28a745', '#007bff', '#ffc107', '#dc3545'][Math.floor(Math.random() * 4)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                border-radius: 50%;
            `;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Animation CSS des confettis
    if (!document.querySelector('#confetti-style')) {
        const confettiStyle = document.createElement('style');
        confettiStyle.id = 'confetti-style';
        confettiStyle.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(confettiStyle);
    }

    // =================================
    // DEBUGGING
    // =================================

    if (window.location.hostname === 'localhost') {
        console.log('🦶 Footer et Scroll to Top chargés');
        console.log('📱 Réseaux sociaux:', socialLinks.length);
        console.log('🔗 Liens footer:', document.querySelectorAll('.footer-link').length);
    }
});

// =================================
// FONCTIONS GLOBALES FOOTER
// =================================

// Fonction pour scroller vers une section spécifique
function scrollToSection(sectionId, offset = 0) {
    const section = document.getElementById(sectionId);
    if (section) {
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Fonction pour copier du texte dans le presse-papiers
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);

        // Feedback visuel
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Copié !';
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            z-index: 10000;
            font-size: 0.9rem;
            animation: fadeInOut 2s forwards;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 2000);

        return true;
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        return false;
    }
}

// Animation fadeInOut pour les tooltips
if (!document.querySelector('#tooltip-style')) {
    const tooltipStyle = document.createElement('style');
    tooltipStyle.id = 'tooltip-style';
    tooltipStyle.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(tooltipStyle);
}

// Fonction pour vérifier si on est sur mobile
function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fonction pour formater les numéros de téléphone
function formatPhoneNumber(phone) {
    // Supprimer tous les caractères non numériques sauf le +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Formater pour l'affichage français
    if (cleaned.startsWith('+33')) {
        return cleaned.replace('+33', '0').replace(/(\d{2})(?=\d)/g, '$1 ');
    }

    return phone;
}

// Fonction pour créer des liens de partage social
function createShareLinks(url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`
    };
}

// Fonction pour tracker les interactions (à adapter selon tes outils d'analytics)
function trackInteraction(category, action, label = '') {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }

    // Matomo/Piwik
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', category, action, label]);
    }

    // Log pour développement
    if (window.location.hostname === 'localhost') {
        console.log('📊 Track:', { category, action, label });
    }
}

// Gestion des événements de contact
document.addEventListener('DOMContentLoaded', function () {

    // Tracking des clics sur les éléments de contact
    const contactElements = {
        phone: document.querySelectorAll('a[href^="tel:"]'),
        email: document.querySelectorAll('a[href^="mailto:"]'),
        whatsapp: document.querySelectorAll('a[href*="wa.me"]'),
        maps: document.querySelectorAll('a[href*="maps"]')
    };

    Object.entries(contactElements).forEach(([type, elements]) => {
        elements.forEach(element => {
            element.addEventListener('click', function () {
                trackInteraction('Contact', `click_${type}`, this.href);
            });
        });
    });

    // Ajout de la fonctionnalité de copie pour les coordonnées
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            const phoneNumber = this.href.replace('tel:', '');
            copyToClipboard(phoneNumber);
        });

        // Tooltip sur hover
        link.title = 'Clic droit pour copier le numéro';
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '').split('?')[0];
            copyToClipboard(email);
        });

        link.title = 'Clic droit pour copier l\'email';
    });
});

// =================================
// UTILITAIRES POUR LE DÉVELOPPEMENT
// =================================

// Fonction pour tester tous les liens du footer
function testFooterLinks() {
    const links = document.querySelectorAll('.footer-link');
    const results = [];

    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        results.push({
            index: index + 1,
            text: text,
            href: href,
            isExternal: href && (href.startsWith('http') || href.startsWith('//'))
        });
    });

    console.table(results);
    return results;
}

// Fonction pour vérifier l'accessibilité du footer
function checkFooterAccessibility() {
    const issues = [];

    // Vérifier les liens sans texte
    const emptyLinks = document.querySelectorAll('.footer-section a:empty');
    if (emptyLinks.length > 0) {
        issues.push(`${emptyLinks.length} lien(s) sans texte trouvé(s)`);
    }

    // Vérifier les images sans alt
    const imagesWithoutAlt = document.querySelectorAll('.footer-section img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} image(s) sans attribut alt`);
    }

    // Vérifier le contraste des couleurs (basique)
    const lightTextElements = document.querySelectorAll('.footer-section .text-light');
    if (lightTextElements.length === 0) {
        issues.push('Aucun texte avec classe .text-light trouvé');
    }

    if (issues.length === 0) {
        console.log('✅ Aucun problème d\'accessibilité détecté dans le footer');
    } else {
        console.warn('⚠️ Problèmes d\'accessibilité détectés:');
        issues.forEach(issue => console.warn(`- ${issue}`));
    }

    return issues;
}

// Expose les fonctions utiles globalement pour le debugging
if (window.location.hostname === 'localhost') {
    window.lpFooterUtils = {
        testLinks: testFooterLinks,
        checkA11y: checkFooterAccessibility,
        copyText: copyToClipboard,
        scrollTo: scrollToSection,
        track: trackInteraction
    };

    console.log('🛠️ Outils de debugging footer disponibles:', Object.keys(window.lpFooterUtils));
}