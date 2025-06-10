// =================================
// CATALOGUE TEMPS RÉEL - JAVASCRIPT
// =================================

document.addEventListener("DOMContentLoaded", async () => {

    // Cache des données
    let allVehicules = [];
    let filteredVehicules = [];
    let modelesParMarque = {};
    let marquesData = [];

    // État des filtres
    const filterState = {
        marque: null,
        modele: [],
        energie: [],
        transmission: [],
        couleur: [],
        prixMin: 0,
        prixMax: 100000,
        kmMin: 0,
        kmMax: 300000,
        anneeMin: 2000,
        anneeMax: new Date().getFullYear(),
        usePrix: false,
        useKm: false,
        useAnnee: false
    };

    // =================================
    // INITIALISATION
    // =================================

    async function init() {
        showLoading();
        await loadAllData();
        setupFilters();
        setupUI();
        hideLoading();
        console.log('🚗 Catalogue temps réel initialisé');
    }

    // =================================
    // CHARGEMENT DES DONNÉES
    // =================================

    async function loadAllData() {
        try {
            // Charger les véhicules depuis le PageModel
            const vehiculesResponse = await fetch('/Vehicules/Catalogue?handler=VehiculesJson');
            if (!vehiculesResponse.ok) throw new Error('Erreur chargement véhicules');
            const data = await vehiculesResponse.json();

            if (data.error) {
                throw new Error(data.message || 'Erreur inconnue');
            }

            allVehicules = data;
            filteredVehicules = [...allVehicules];

            // Charger les données de filtres (marques, énergies, etc.)
            const filtersResponse = await fetch("/data/marques_modeles.json");
            if (!filtersResponse.ok) throw new Error('Erreur données filtres');
            const filtersData = await filtersResponse.json();

            marquesData = filtersData.filter(item => item.marque);
            modelesParMarque = Object.fromEntries(marquesData.map(m => [m.marque, m.modeles]));

            const energie = filtersData.find(x => x.energie)?.energie || [];
            const transmission = filtersData.find(x => x.transmission)?.transmission || [];
            const couleurs = filtersData.find(x => x.color)?.color || [];

            // Peupler les filtres
            populateFilters('marques-list', marquesData.map(m => m.marque), 'marque');
            populateFilters('energie-list', energie, 'energie');
            populateFilters('boite-list', transmission, 'transmission');
            populateFilters('couleurs-list', couleurs, 'couleur');

            // Afficher les véhicules
            renderVehicules();

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            showError('Erreur lors du chargement des données');
        }
    }

    // =================================
    // RENDU DES VÉHICULES
    // =================================

    function renderVehicules() {
        const container = document.getElementById('vehiclesGrid');
        const countElement = document.querySelector('.count-number');
        const countLabel = document.querySelector('.count-label');

        // Mettre à jour le compteur
        const count = filteredVehicules.length;
        if (countElement) countElement.textContent = count;
        if (countLabel) countLabel.textContent = `véhicule${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;

        // Vider le container
        container.innerHTML = '';

        if (filteredVehicules.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="no-results">
                        <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
                        <h4 class="mt-3 text-muted">Aucun véhicule trouvé</h4>
                        <p class="text-muted">Essayez de modifier vos critères de recherche</p>
                        <button class="btn btn-outline-primary" onclick="resetAllFilters()">
                            <i class="bi bi-arrow-clockwise me-1"></i>
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Créer les cartes de véhicules
        filteredVehicules.forEach((vehicule, index) => {
            const vehicleCard = createVehicleCard(vehicule, index);
            container.appendChild(vehicleCard);
        });

        // Réinitialiser les sliders d'images
        setupImageSliders();
        setupFavorites();

        // Animation d'apparition
        animateVehicleCards();
    }

    function createVehicleCard(vehicule, index) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        card.innerHTML = `
            <!-- Badge de statut -->
            <div class="vehicle-badges">
                ${vehicule.annee >= new Date().getFullYear() - 2 ? '<span class="badge badge-new">Récent</span>' : ''}
                ${vehicule.prix < 15000 ? '<span class="badge badge-price">Bon prix</span>' : ''}
                <span class="badge badge-guaranteed">Garanti</span>
            </div>

            <!-- Images du véhicule -->
            <div class="vehicle-images">
                <div class="image-slider">
                    ${vehicule.photos.map((photo, i) => `
                        <img src="${photo.url}" 
                             alt="${vehicule.marque} ${vehicule.modele}"
                             class="vehicle-image ${i === 0 ? 'active' : ''}"
                             data-index="${i}">
                    `).join('')}
                </div>

                ${vehicule.photos.length > 1 ? `
                    <div class="image-navigation">
                        <button class="nav-btn prev-btn">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button class="nav-btn next-btn">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div class="image-indicators">
                        ${vehicule.photos.map((_, i) => `
                            <span class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- Informations du véhicule -->
            <div class="vehicle-info">
                <div class="vehicle-header">
                    <h3 class="vehicle-title">${vehicule.marque} ${vehicule.modele}</h3>
                    <div class="vehicle-energy">
                        <span class="energy-badge energy-${vehicule.energie.toLowerCase()}">
                            ${vehicule.energie}
                        </span>
                    </div>
                </div>

                <div class="vehicle-specs">
                    <div class="spec-item">
                        <i class="bi bi-calendar3"></i>
                        <span>${vehicule.annee}</span>
                    </div>
                    <div class="spec-item">
                        <i class="bi bi-speedometer2"></i>
                        <span>${vehicule.kilometrage.toLocaleString()} km</span>
                    </div>
                    <div class="spec-item">
                        <i class="bi bi-gear"></i>
                        <span>${vehicule.transmission}</span>
                    </div>
                    <div class="spec-item">
                        <i class="bi bi-palette"></i>
                        <span>${vehicule.couleur}</span>
                    </div>
                </div>

                <div class="vehicle-description">
                    <p>${vehicule.description.length > 100 ? vehicule.description.substring(0, 100) + '...' : vehicule.description}</p>
                </div>

                <div class="vehicle-footer">
                    <div class="vehicle-price">
                        <div class="price-monthly">
                            <span class="price-label">À partir de</span>
                            <span class="price-value">${vehicule.prixMensuel.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}<small>/mois</small></span>
                        </div>
                        <div class="price-total">
                            <span class="price-main">${vehicule.prix.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                    </div>

                    <div class="vehicle-actions">
                        <button class="btn btn-outline-primary btn-sm favorite-btn" title="Ajouter aux favoris" data-vehicle-id="${vehicule.id}">
                            <i class="bi bi-heart"></i>
                        </button>
                        <a href="/Vehicules/Catalogue/Details/${vehicule.id}" class="btn btn-primary btn-sm">
                            <i class="bi bi-eye me-1"></i>
                            Voir détails
                        </a>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    // =================================
    // FILTRAGE TEMPS RÉEL
    // =================================

    function applyFilters() {
        filteredVehicules = allVehicules.filter(vehicule => {
            // Filtre marque
            if (filterState.marque && vehicule.marque !== filterState.marque) {
                return false;
            }

            // Filtre modèles
            if (filterState.modele.length > 0 && !filterState.modele.includes(vehicule.modele)) {
                return false;
            }

            // Filtre énergie
            if (filterState.energie.length > 0 && !filterState.energie.includes(vehicule.energie)) {
                return false;
            }

            // Filtre transmission
            if (filterState.transmission.length > 0 && !filterState.transmission.includes(vehicule.transmission)) {
                return false;
            }

            // Filtre couleur
            if (filterState.couleur.length > 0 && !filterState.couleur.includes(vehicule.couleur)) {
                return false;
            }

            // Filtre prix
            if (filterState.usePrix) {
                if (vehicule.prix < filterState.prixMin || vehicule.prix > filterState.prixMax) {
                    return false;
                }
            }

            // Filtre kilométrage
            if (filterState.useKm) {
                if (vehicule.kilometrage < filterState.kmMin || vehicule.kilometrage > filterState.kmMax) {
                    return false;
                }
            }

            // Filtre année
            if (filterState.useAnnee) {
                if (vehicule.annee < filterState.anneeMin || vehicule.annee > filterState.anneeMax) {
                    return false;
                }
            }

            return true;
        });

        // Appliquer le tri actuel
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortVehicules(sortSelect.value);
        }

        renderVehicules();
        updateActiveFilters();
    }

    // =================================
    // GESTION DES FILTRES
    // =================================

    function populateFilters(containerId, items, filterType) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {
            const filterItem = document.createElement('div');
            filterItem.className = 'filter-checkbox';
            filterItem.innerHTML = `
                <input type="checkbox" id="${filterType}-${item}" value="${item}" data-filter="${filterType}">
                <label for="${filterType}-${item}">${item}</label>
            `;
            container.appendChild(filterItem);
        });

        // Event listeners - TEMPS RÉEL
        container.addEventListener('change', (e) => {
            if (!e.target.matches('input[type="checkbox"]')) return;

            const filterType = e.target.dataset.filter;
            const value = e.target.value;
            const isChecked = e.target.checked;

            if (filterType === 'marque') {
                // Marque unique
                filterState.marque = isChecked ? value : null;
                // Décocher les autres marques
                container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb !== e.target) cb.checked = false;
                });
                updateModeles();
            } else {
                // Filtres multiples
                if (isChecked) {
                    if (!filterState[filterType].includes(value)) {
                        filterState[filterType].push(value);
                    }
                } else {
                    filterState[filterType] = filterState[filterType].filter(x => x !== value);
                }
            }

            // Appliquer les filtres immédiatement
            applyFilters();
        });
    }

    function updateModeles() {
        const modelesContainer = document.getElementById('modeles-list');
        const modelesSection = document.getElementById('modeles-section');

        if (filterState.marque) {
            const modeles = modelesParMarque[filterState.marque] || [];
            populateFilters('modeles-list', modeles, 'modele');
            modelesSection.style.display = 'block';

            // Ouvrir automatiquement la section modèles
            const toggle = modelesSection.querySelector('.filter-toggle');
            const content = document.getElementById('modeles-list');
            toggle.classList.add('active');
            content.classList.add('open');
        } else {
            modelesSection.style.display = 'none';
            filterState.modele = [];
        }
    }

    // =================================
    // SETUP DE L'INTERFACE
    // =================================

    function setupFilters() {
        // Sliders de prix
        setupRangeSliders();

        // Toggles des sections
        setupFilterToggles();

        // Reset des filtres
        setupResetFilters();
    }

    function setupRangeSliders() {
        const sliders = [
            { prefix: 'prix', min: 0, max: 100000, step: 1000, symbol: '€' },
            { prefix: 'km', min: 0, max: 300000, step: 10000, symbol: ' km' },
            { prefix: 'annee', min: 2000, max: new Date().getFullYear(), step: 1, symbol: '' }
        ];

        sliders.forEach(slider => {
            const checkbox = document.getElementById(`use${slider.prefix.charAt(0).toUpperCase() + slider.prefix.slice(1)}`);
            const minInput = document.getElementById(`${slider.prefix}Min`);
            const maxInput = document.getElementById(`${slider.prefix}Max`);
            const minDisplay = document.getElementById(`${slider.prefix}MinAffichage`);
            const maxDisplay = document.getElementById(`${slider.prefix}MaxAffichage`);
            const group = document.getElementById(`${slider.prefix}Group`);
            const trackActive = document.getElementById(`${slider.prefix}TrackActive`);

            if (!checkbox || !minInput || !maxInput) return;

            // Initialiser les valeurs par défaut
            minInput.value = slider.min;
            maxInput.value = slider.max;
            filterState[`${slider.prefix}Min`] = slider.min;
            filterState[`${slider.prefix}Max`] = slider.max;

            // Fonction pour mettre à jour la track active
            function updateActiveTrack() {
                if (!trackActive) return;

                const min = parseInt(minInput.value);
                const max = parseInt(maxInput.value);
                const range = slider.max - slider.min;

                const leftPercent = ((min - slider.min) / range) * 100;
                const rightPercent = ((max - slider.min) / range) * 100;

                trackActive.style.left = leftPercent + '%';
                trackActive.style.width = (rightPercent - leftPercent) + '%';
            }

            // Toggle slider - TEMPS RÉEL
            checkbox.addEventListener('change', () => {
                const enabled = checkbox.checked;
                filterState[`use${slider.prefix.charAt(0).toUpperCase() + slider.prefix.slice(1)}`] = enabled;

                minInput.disabled = !enabled;
                maxInput.disabled = !enabled;

                if (group) {
                    group.classList.toggle('disabled', !enabled);
                }

                if (enabled) {
                    // Réinitialiser aux valeurs min/max quand on active
                    minInput.value = slider.min;
                    maxInput.value = slider.max;
                    filterState[`${slider.prefix}Min`] = slider.min;
                    filterState[`${slider.prefix}Max`] = slider.max;

                    // Mettre à jour l'affichage
                    if (minDisplay) minDisplay.textContent = slider.min + slider.symbol;
                    if (maxDisplay) maxDisplay.textContent = slider.max + slider.symbol;

                    updateActiveTrack();
                } else {
                    filterState[`${slider.prefix}Min`] = slider.min;
                    filterState[`${slider.prefix}Max`] = slider.max;
                }

                applyFilters(); // Temps réel
            });

            // Update values - TEMPS RÉEL avec debounce
            let timeout;
            [minInput, maxInput].forEach(input => {
                input.addEventListener('input', () => {
                    clearTimeout(timeout);

                    const minVal = parseInt(minInput.value);
                    const maxVal = parseInt(maxInput.value);

                    // Ensure min <= max
                    if (minVal > maxVal) {
                        if (input === minInput) {
                            maxInput.value = minVal;
                        } else {
                            minInput.value = maxVal;
                        }
                    }

                    filterState[`${slider.prefix}Min`] = parseInt(minInput.value);
                    filterState[`${slider.prefix}Max`] = parseInt(maxInput.value);

                    if (minDisplay) minDisplay.textContent = minInput.value + slider.symbol;
                    if (maxDisplay) maxDisplay.textContent = maxInput.value + slider.symbol;

                    updateActiveTrack();

                    // Debounce pour éviter trop d'appels
                    timeout = setTimeout(() => {
                        if (checkbox.checked) {
                            applyFilters();
                        }
                    }, 300);
                });

                // Effet visuel au hover
                input.addEventListener('mouseenter', () => {
                    if (!input.disabled) {
                        input.style.transform = 'scale(1.05)';
                    }
                });

                input.addEventListener('mouseleave', () => {
                    input.style.transform = '';
                });
            });

            // Initialiser la track active
            updateActiveTrack();
        });
    }

    function setupFilterToggles() {
        document.querySelectorAll('.filter-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const content = document.getElementById(targetId);
                const icon = toggle.querySelector('i');

                if (content.classList.contains('open')) {
                    content.classList.remove('open');
                    toggle.classList.remove('active');
                } else {
                    content.classList.add('open');
                    toggle.classList.add('active');
                }
            });
        });

        // Ouvrir tous les filtres par défaut
        document.querySelectorAll('.filter-content').forEach(content => {
            content.classList.add('open');
        });
        document.querySelectorAll('.filter-toggle').forEach(toggle => {
            toggle.classList.add('active');
        });
    }

    function setupResetFilters() {
        const resetBtn = document.getElementById('resetAllFilters');
        const resetAllBtn = document.querySelector('.reset-all-btn');

        [resetBtn, resetAllBtn].forEach(btn => {
            btn?.addEventListener('click', resetAllFilters);
        });
    }

    function resetAllFilters() {
        // Reset state
        filterState.marque = null;
        filterState.modele = [];
        filterState.energie = [];
        filterState.transmission = [];
        filterState.couleur = [];
        filterState.usePrix = false;
        filterState.useKm = false;
        filterState.useAnnee = false;

        // Reset checkboxes
        document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset sliders
        ['Prix', 'Km', 'Annee'].forEach(type => {
            const checkbox = document.getElementById(`use${type}`);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        // Hide modèles section
        const modelesSection = document.getElementById('modeles-section');
        if (modelesSection) {
            modelesSection.style.display = 'none';
        }

        // Apply filters
        applyFilters();
    }

    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        const activeFiltersList = document.querySelector('.active-filters-list');

        if (!activeFiltersContainer || !activeFiltersList) return;

        const activeFilters = [];

        // Collecter les filtres actifs
        if (filterState.marque) activeFilters.push({
            type: 'marque',
            value: filterState.marque,
            displayValue: filterState.marque
        });

        filterState.modele.forEach(v => activeFilters.push({
            type: 'modele',
            value: v,
            displayValue: v
        }));

        filterState.energie.forEach(v => activeFilters.push({
            type: 'energie',
            value: v,
            displayValue: v
        }));

        filterState.transmission.forEach(v => activeFilters.push({
            type: 'transmission',
            value: v,
            displayValue: v
        }));

        filterState.couleur.forEach(v => activeFilters.push({
            type: 'couleur',
            value: v,
            displayValue: v
        }));

        if (filterState.usePrix) {
            activeFilters.push({
                type: 'prix',
                value: 'range',
                displayValue: `${filterState.prixMin}€ - ${filterState.prixMax}€`
            });
        }

        if (filterState.useKm) {
            activeFilters.push({
                type: 'km',
                value: 'range',
                displayValue: `${filterState.kmMin} - ${filterState.kmMax} km`
            });
        }

        if (filterState.useAnnee) {
            activeFilters.push({
                type: 'annee',
                value: 'range',
                displayValue: `${filterState.anneeMin} - ${filterState.anneeMax}`
            });
        }

        if (activeFilters.length > 0) {
            activeFiltersContainer.style.display = 'block';
            activeFiltersList.innerHTML = activeFilters.map((filter, index) => `
            <span class="filter-tag">
                ${filter.displayValue}
                <button class="remove-tag" data-type="${filter.type}" data-value="${filter.value}" data-index="${index}">×</button>
            </span>
        `).join('');

            // ✅ EVENT LISTENERS POUR LES CROIX - PARTIE MANQUANTE
            activeFiltersList.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const type = btn.dataset.type;
                    const value = btn.dataset.value;

                    console.log('Suppression filtre:', type, value); // Debug

                    if (type === 'prix') {
                        const checkbox = document.getElementById('usePrix');
                        if (checkbox) {
                            checkbox.checked = false;
                            filterState.usePrix = false;

                            // Désactiver les sliders
                            const minInput = document.getElementById('prixMin');
                            const maxInput = document.getElementById('prixMax');
                            const group = document.getElementById('prixGroup');

                            if (minInput) minInput.disabled = true;
                            if (maxInput) maxInput.disabled = true;
                            if (group) group.classList.add('disabled');
                        }
                    } else if (type === 'km') {
                        const checkbox = document.getElementById('useKm');
                        if (checkbox) {
                            checkbox.checked = false;
                            filterState.useKm = false;

                            // Désactiver les sliders
                            const minInput = document.getElementById('kmMin');
                            const maxInput = document.getElementById('kmMax');
                            const group = document.getElementById('kmGroup');

                            if (minInput) minInput.disabled = true;
                            if (maxInput) maxInput.disabled = true;
                            if (group) group.classList.add('disabled');
                        }
                    } else if (type === 'annee') {
                        const checkbox = document.getElementById('useAnnee');
                        if (checkbox) {
                            checkbox.checked = false;
                            filterState.useAnnee = false;

                            // Désactiver les sliders
                            const minInput = document.getElementById('anneeMin');
                            const maxInput = document.getElementById('anneeMax');
                            const group = document.getElementById('anneeGroup');

                            if (minInput) minInput.disabled = true;
                            if (maxInput) maxInput.disabled = true;
                            if (group) group.classList.add('disabled');
                        }
                    } else if (type === 'marque') {
                        // Reset marque
                        filterState.marque = null;
                        document.querySelectorAll('#marques-list input[type="checkbox"]').forEach(cb => {
                            cb.checked = false;
                        });
                        updateModeles(); // Cacher la section modèles
                    } else {
                        // Pour les autres filtres (modele, energie, transmission, couleur)
                        const checkbox = document.querySelector(`input[data-filter="${type}"][value="${value}"]`);
                        if (checkbox) {
                            checkbox.checked = false;

                            // Retirer de l'état
                            if (filterState[type] && Array.isArray(filterState[type])) {
                                filterState[type] = filterState[type].filter(x => x !== value);
                            }
                        }
                    }

                    // Appliquer les filtres après suppression
                    applyFilters();
                });
            });
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    // =================================
    // SLIDERS D'IMAGES ET AUTRES
    // =================================

    function setupImageSliders() {
        document.querySelectorAll('.vehicle-card').forEach(card => {
            const images = card.querySelectorAll('.vehicle-image');
            const indicators = card.querySelectorAll('.indicator');
            const prevBtn = card.querySelector('.prev-btn');
            const nextBtn = card.querySelector('.next-btn');

            if (images.length <= 1) return;

            let currentIndex = 0;

            function showImage(index) {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            }

            function nextImage() {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }

            function prevImage() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            }

            nextBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                nextImage();
            });

            prevBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                prevImage();
            });

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    showImage(currentIndex);
                });
            });
        });
    }

    function setupFavorites() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                btn.classList.toggle('active');

                // Animation
                btn.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    }

    function setupUI() {
        // Supprimer le bouton "Appliquer les filtres"
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.style.display = 'none';
        }

        // Setup autres éléments UI
        setupMobileFilters();
        setupViewModes();
        setupSorting();
    }

    function setupMobileFilters() {
        const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
        const filtersSidebar = document.querySelector('.filters-sidebar');

        let overlay = document.querySelector('.filters-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'filters-overlay';
            document.body.appendChild(overlay);
        }

        function openFilters() {
            if (filtersSidebar) {
                filtersSidebar.classList.add('open');
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeFilters() {
            if (filtersSidebar) {
                filtersSidebar.classList.remove('open');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }

        mobileFilterBtn?.addEventListener('click', openFilters);
        overlay.addEventListener('click', closeFilters);
    }

    function setupViewModes() {
        const gridBtn = document.querySelector('.view-mode-btn[data-view="grid"]');
        const listBtn = document.querySelector('.view-mode-btn[data-view="list"]');
        const vehiclesGrid = document.querySelector('.vehicles-grid');

        if (!vehiclesGrid) return;

        gridBtn?.addEventListener('click', () => {
            vehiclesGrid.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn?.classList.remove('active');
        });

        listBtn?.addEventListener('click', () => {
            vehiclesGrid.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn?.classList.remove('active');
        });
    }

    function setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (!sortSelect) return;

        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            sortVehicules(sortValue);
            renderVehicules();
        });
    }

    function sortVehicules(sortBy) {
        switch (sortBy) {
            case 'price-asc':
                filteredVehicules.sort((a, b) => a.prix - b.prix);
                break;
            case 'price-desc':
                filteredVehicules.sort((a, b) => b.prix - a.prix);
                break;
            case 'year-desc':
                filteredVehicules.sort((a, b) => b.annee - a.annee);
                break;
            case 'year-asc':
                filteredVehicules.sort((a, b) => a.annee - b.annee);
                break;
            case 'km-asc':
                filteredVehicules.sort((a, b) => a.kilometrage - b.kilometrage);
                break;
            case 'km-desc':
                filteredVehicules.sort((a, b) => b.kilometrage - a.kilometrage);
                break;
            case 'date-desc':
            default:
                filteredVehicules.sort((a, b) => b.id - a.id); // Plus récents en premier par ID
                break;
        }
    }

    // =================================
    // ANIMATIONS ET UTILS
    // =================================

    function animateVehicleCards() {
        const cards = document.querySelectorAll('.vehicle-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function showLoading() {
        const container = document.getElementById('vehiclesGrid');
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3 text-muted">Chargement des véhicules...</p>
            </div>
        `;
    }

    function hideLoading() {
        // Le loading disparaît quand renderVehicules() est appelé
    }

    function showError(message) {
        const container = document.getElementById('vehiclesGrid');
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                <h4 class="mt-3 text-danger">Erreur</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Recharger
                </button>
            </div>
        `;
    }

    // Exposer resetAllFilters globalement
    window.resetAllFilters = resetAllFilters;

    // =================================
    // DÉMARRAGE
    // =================================

    await init();
});