// Navbar inférieure persistante et personnalisable
class BottomNavbar {
    constructor(options = {}) {
        this.options = {
            theme: options.theme || 'light', // light, dark
            style: options.style || 'default', // default, floating, compact
            alwaysVisible: options.alwaysVisible || true, // Toujours visible pour les conducteurs
            showLabels: options.showLabels !== false,
            customItems: options.customItems || null,
            onItemClick: options.onItemClick || null,
            autoHide: false, // Désactiver le masquage automatique
            ...options
        };

        this.isVisible = true;
        this.lastScrollY = 0;
        this.navbarElement = null;
        
        this.defaultItems = [
            {
                id: 'home',
                icon: '<div class="icon icon-home icon-interactive"></div>',
                label: 'Accueil',
                href: '/',
                badge: null
            },
            {
                id: 'search',
                icon: '<div class="icon icon-search icon-interactive"></div>',
                label: 'Recherche',
                href: '/map',
                badge: null
            },
            {
                id: 'reservations',
                icon: '<div class="icon icon-reservations icon-interactive"></div>',
                label: 'Réservations',
                href: '/dashboard',
                badge: null
            },
            {
                id: 'notifications',
                icon: '<div class="icon icon-bell icon-interactive icon-with-badge"></div>',
                label: 'Notifications',
                href: '#',
                badge: this.getNotificationCount(),
                dataIcon: 'notification',
                onClick: () => this.toggleNotifications()
            },
            {
                id: 'profile',
                icon: '<div class="icon icon-profile icon-interactive"></div>',
                label: 'Profil',
                href: '/profile',
                badge: null
            }
        ];

        this.items = this.options.customItems || this.defaultItems;
        this.activeItem = this.getCurrentActiveItem();
        
        this.init();
    }

    init() {
        this.createNavbar();
        this.bindEvents();
        this.updateActiveItem();
        
        // Auto-hide functionality
        if (this.options.autoHide) {
            this.setupAutoHide();
        }
        
        // Démarrer les animations d'icônes
        this.startIconAnimations();
    }

    createNavbar() {
        // Supprimer la navbar existante si elle existe
        const existing = document.querySelector('.bottom-navbar');
        if (existing) {
            existing.remove();
        }

        const navbar = document.createElement('div');
        navbar.className = `bottom-navbar ${this.options.theme === 'dark' ? 'theme-dark' : ''} ${this.options.style !== 'default' ? this.options.style : ''}`;
        
        if (this.options.alwaysVisible) {
            navbar.classList.add('always-visible');
        }

        const content = document.createElement('div');
        content.className = 'bottom-nav-content';

        this.items.forEach((item, index) => {
            const navItem = this.createNavItem(item, index);
            content.appendChild(navItem);
        });

        navbar.appendChild(content);
        document.body.appendChild(navbar);
        
        this.navbarElement = navbar;
        
        // Ajuster le padding du body
        if (window.innerWidth <= 768 || this.options.alwaysVisible) {
            document.body.style.paddingBottom = this.options.style === 'compact' ? '75px' : '85px';
        }
    }

    createNavItem(item, index) {
        const navItem = document.createElement('a');
        navItem.className = 'bottom-nav-item';
        navItem.href = item.href || '#';
        navItem.dataset.id = item.id;
        
        if (item.dataIcon) {
            navItem.dataset.icon = item.dataIcon;
        }

        // Icône
        const icon = document.createElement('div');
        icon.className = 'bottom-nav-icon';
        icon.innerHTML = item.icon;
        
        // Badge de notification
        if (item.badge && item.badge > 0) {
            const badge = document.createElement('span');
            badge.className = 'bottom-nav-badge';
            badge.textContent = item.badge > 99 ? '99+' : item.badge;
            icon.appendChild(badge);
        }

        navItem.appendChild(icon);

        // Label
        if (this.options.showLabels) {
            const label = document.createElement('span');
            label.className = 'bottom-nav-label';
            label.textContent = item.label;
            navItem.appendChild(label);
        }

        // Event listeners
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleItemClick(item, navItem);
        });

        return navItem;
    }

    handleItemClick(item, element) {
        // Effet de clic
        this.createRippleEffect(element);
        
        // Mettre à jour l'item actif
        this.setActiveItem(item.id);
        
        // Callback personnalisé
        if (this.options.onItemClick) {
            this.options.onItemClick(item);
        }
        
        // Fonction onClick spécifique
        if (item.onClick) {
            item.onClick();
        } else if (item.href && item.href !== '#') {
            // Navigation
            setTimeout(() => {
                window.location.href = item.href;
            }, 150);
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(74, 144, 226, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setActiveItem(itemId) {
        // Retirer l'état actif de tous les items
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Ajouter l'état actif au nouvel item
        const activeElement = document.querySelector(`[data-id="${itemId}"]`);
        if (activeElement) {
            activeElement.classList.add('active');
            this.activeItem = itemId;
            
            // Animation spéciale pour l'activation
            const icon = activeElement.querySelector('.bottom-nav-icon');
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'iconPulse 0.6s ease';
            }, 10);
        }
    }

    getCurrentActiveItem() {
        const path = window.location.pathname;
        const item = this.items.find(item => item.href === path);
        return item ? item.id : 'home';
    }

    updateActiveItem() {
        const currentActive = this.getCurrentActiveItem();
        this.setActiveItem(currentActive);
    }

    // Gestion des badges
    updateBadge(itemId, count) {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        if (item) {
            const icon = item.querySelector('.bottom-nav-icon');
            let badge = icon.querySelector('.bottom-nav-badge');
            
            if (count && count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'bottom-nav-badge';
                    icon.appendChild(badge);
                }
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.animation = 'bounceIn 0.5s ease';
            } else if (badge) {
                badge.remove();
            }
        }
    }

    // Fonctions utilitaires

    getNotificationCount() {
        const count = localStorage.getItem('notificationCount') || '0';
        return parseInt(count);
    }

    toggleNotifications() {
        const event = new CustomEvent('toggleNotifications');
        document.dispatchEvent(event);
    }

    // Auto-hide sur scroll
    setupAutoHide() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                // Scroll vers le bas - cacher
                this.hide();
            } else {
                // Scroll vers le haut - montrer
                this.show();
            }
            
            this.lastScrollY = currentScrollY;
        });
    }

    hide() {
        // Désactivé pour les conducteurs - la navbar reste toujours visible
        console.log('🚗 Navbar conducteur : masquage désactivé pour une meilleure expérience');
        return;
    }

    show() {
        // S'assurer que la navbar est toujours visible
        if (this.navbarElement) {
            this.navbarElement.classList.remove('hidden');
            this.navbarElement.style.display = 'block';
            this.navbarElement.style.visibility = 'visible';
            this.navbarElement.style.opacity = '1';
            this.isVisible = true;
        }
    }

    // Animations d'icônes périodiques
    startIconAnimations() {
        setInterval(() => {
            const items = document.querySelectorAll('.bottom-nav-item:not(.active)');
            const randomItem = items[Math.floor(Math.random() * items.length)];
            
            if (randomItem && Math.random() < 0.1) { // 10% chance
                const icon = randomItem.querySelector('.bottom-nav-icon');
                const dataIcon = randomItem.dataset.icon;
                
                if (dataIcon === 'heart') {
                    icon.style.animation = 'heartbeat 0.8s ease';
                } else if (dataIcon === 'notification') {
                    icon.style.animation = 'shake 0.5s ease';
                } else {
                    icon.style.animation = 'iconPulse 0.6s ease';
                }
                
                setTimeout(() => {
                    icon.style.animation = '';
                }, 1000);
            }
        }, 3000);
    }

    // Personnalisation en temps réel
    changeTheme(theme) {
        this.options.theme = theme;
        if (this.navbarElement) {
            this.navbarElement.classList.toggle('theme-dark', theme === 'dark');
        }
    }

    changeStyle(style) {
        this.options.style = style;
        if (this.navbarElement) {
            this.navbarElement.className = `bottom-navbar ${this.options.theme === 'dark' ? 'theme-dark' : ''} ${style !== 'default' ? style : ''}`;
            if (this.options.alwaysVisible) {
                this.navbarElement.classList.add('always-visible');
            }
        }
    }

    // Binding des événements
    bindEvents() {
        // Écouter les changements de route
        window.addEventListener('popstate', () => {
            this.updateActiveItem();
        });

        // Écouter les événements personnalisés
        document.addEventListener('updateNotificationCount', (e) => {
            this.updateBadge('notifications', e.detail.count);
        });



        // Responsive
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && !this.options.alwaysVisible) {
                this.navbarElement.style.display = 'none';
                document.body.style.paddingBottom = '0';
            } else {
                this.navbarElement.style.display = 'block';
                document.body.style.paddingBottom = this.options.style === 'compact' ? '75px' : '85px';
            }
        });
    }

    // Méthodes publiques pour la personnalisation
    addItem(item) {
        this.items.push(item);
        this.createNavbar(); // Recréer la navbar
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.createNavbar(); // Recréer la navbar
    }

    updateItem(itemId, updates) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.items[itemIndex] = { ...this.items[itemIndex], ...updates };
            this.createNavbar(); // Recréer la navbar
        }
    }
}

// Fonction d'initialisation globale
function initBottomNavbar(options = {}) {
    // Options par défaut pour les conducteurs
    const defaultOptions = {
        alwaysVisible: true,
        autoHide: false,
        showLabels: true,
        theme: 'light'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.bottomNavbar = new BottomNavbar(mergedOptions);
        });
    } else {
        window.bottomNavbar = new BottomNavbar(mergedOptions);
    }
}

// Auto-initialisation pour les conducteurs
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Initialiser automatiquement pour les conducteurs
    if (!user.type || user.type === 'driver') {
        if (!window.bottomNavbar) {
            console.log('🚗 Initialisation automatique de la navbar conducteur');
            initBottomNavbar();
        }
    }
});

// Styles CSS pour l'animation ripple
const rippleStyles = `
@keyframes ripple {
    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
    }
}
`;

// Ajouter les styles au document
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = rippleStyles;
    document.head.appendChild(style);
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BottomNavbar, initBottomNavbar };
}
