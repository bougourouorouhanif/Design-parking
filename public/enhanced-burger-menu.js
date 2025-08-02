/**
 * Menu Burger Ultra-Moderne - Parky
 * Gestion complète pour conducteurs et propriétaires
 */

class EnhancedBurgerMenu {
    constructor() {
        this.isOpen = false;
        this.currentUser = null;
        this.menuItems = {
            driver: [
                {
                    href: '/home',
                    icon: 'icon-home',
                    text: 'Accueil',
                    section: 'main',
                    class: 'menu-item-home'
                },
                {
                    href: '/map',
                    icon: 'icon-map',
                    text: 'Rechercher une place',
                    section: 'main',
                    class: 'menu-item-search'
                },
                {
                    href: '/profile',
                    icon: 'icon-profile',
                    text: 'Mon Profil',
                    section: 'account',
                    class: 'menu-item-profile'
                },
                {
                    href: '/payment',
                    icon: 'icon-payment',
                    text: 'Paiement',
                    section: 'account',
                    class: 'menu-item-payment'
                },
                {
                    href: '/navigation',
                    icon: 'icon-navigation',
                    text: 'Navigation',
                    section: 'tools',
                    class: 'menu-item-navigation'
                },
                {
                    href: '/notifications',
                    icon: 'icon-bell',
                    text: 'Notifications',
                    section: 'tools',
                    class: 'menu-item-notifications',
                    badge: this.getNotificationCount()
                }
            ],
            owner: [
                {
                    href: '/owner-dashboard',
                    icon: 'icon-dashboard',
                    text: 'Tableau de bord',
                    section: 'main',
                    class: 'menu-item-dashboard'
                },
                {
                    href: '/add-spot',
                    icon: 'icon-add',
                    text: 'Ajouter une place',
                    section: 'main',
                    class: 'menu-item-add'
                },
                {
                    href: '/owner-reservations',
                    icon: 'icon-reservations',
                    text: 'Gérer réservations',
                    section: 'management',
                    class: 'menu-item-reservations'
                },
                {
                    href: '/owner-earnings',
                    icon: 'icon-earnings',
                    text: 'Revenus',
                    section: 'management',
                    class: 'menu-item-earnings'
                },
                {
                    href: '/owner-profile',
                    icon: 'icon-profile',
                    text: 'Mon Profil',
                    section: 'account',
                    class: 'menu-item-profile'
                },
                {
                    href: '/notifications',
                    icon: 'icon-bell',
                    text: 'Notifications',
                    section: 'account',
                    class: 'menu-item-notifications',
                    badge: this.getNotificationCount()
                }
            ]
        };
        this.init();
    }

    init() {
        this.loadUser();
        this.createMenuStructure();
        this.attachEventListeners();
        this.updateUserProfile();
        this.setActiveMenuItem();

        // Créer la bottom navbar pour les conducteurs
        if (this.currentUser.type === 'driver') {
            this.createBottomNavbar();
        }

        // Simuler des notifications
        this.simulateNotifications();
    }

    loadUser() {
        const userData = localStorage.getItem('user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            // S'assurer que les conducteurs restent conducteurs
            if (this.currentUser.type !== 'owner') {
                this.currentUser.type = 'driver';
            }
        } else {
            // Utilisateur demo par défaut (toujours conducteur)
            this.currentUser = {
                name: 'Utilisateur Demo',
                email: 'demo@parky.com',
                type: 'driver',
                avatar: null
            };
            localStorage.setItem('user', JSON.stringify(this.currentUser));
        }

        // Ajouter la classe CSS correspondante au body
        document.body.classList.remove('driver-interface', 'owner-interface');
        document.body.classList.add(`${this.currentUser.type}-interface`);

        // Ajouter la classe pour bottom navbar si conducteur
        if (this.currentUser.type === 'driver') {
            document.body.classList.add('with-bottom-navbar');
        }
    }

    createMenuStructure() {
        // Créer le header s'il n'existe pas
        if (!document.querySelector('.enhanced-header')) {
            this.createHeader();
        }
        
        // Créer le menu mobile s'il n'existe pas
        if (!document.querySelector('.enhanced-mobile-menu')) {
            this.createMobileMenu();
        }
        
        this.generateMenuItems();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'enhanced-header';
        header.innerHTML = `
            <nav class="enhanced-nav">
                <div class="nav-left">
                    <button class="enhanced-burger" onclick="burgerMenu.toggle()">
                        <div class="burger-line"></div>
                        <div class="burger-line"></div>
                        <div class="burger-line"></div>
                    </button>
                </div>

                <div class="nav-center">
                    <a href="/" class="enhanced-logo">
                        Parky
                    </a>
                </div>

                <div class="nav-right">
                    <div class="enhanced-notification-icon" onclick="burgerMenu.goToNotifications()">
                        <div class="icon icon-bell"></div>
                        <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
                    </div>
                </div>
            </nav>
        `;

        document.body.insertBefore(header, document.body.firstChild);
    }

    createMobileMenu() {
        const menu = document.createElement('div');
        menu.className = 'enhanced-mobile-menu';
        menu.id = 'enhancedMobileMenu';
        menu.innerHTML = `
            <div class="menu-user-profile">
                <div class="user-avatar" id="userAvatar">?</div>
                <div class="user-name" id="userName">Connexion</div>
                <div class="user-role" id="userRole">Cliquez pour vous connecter</div>
                <div class="user-role-badge" id="userTypeBadge">Visiteur</div>
            </div>
            
            <nav class="enhanced-menu-nav" id="menuNavigation">
                <!-- Menu items will be generated here -->
            </nav>
            
            <div class="menu-footer">
                <p class="menu-footer-text">
                    Parky <span class="app-version">v2.0</span><br>
                    © 2024 - Votre compagnon de stationnement
                </p>
            </div>
        `;
        
        document.body.appendChild(menu);
    }

    generateMenuItems() {
        const menuNav = document.getElementById('menuNavigation');
        if (!menuNav) return;

        const userType = this.currentUser.type;
        const items = this.menuItems[userType] || this.menuItems.driver;
        
        // Grouper les éléments par section
        const sections = this.groupItemsBySection(items);
        
        let menuHTML = '';
        
        Object.entries(sections).forEach(([sectionName, sectionItems]) => {
            const sectionTitle = this.getSectionTitle(sectionName);
            
            menuHTML += `
                <div class="menu-section">
                    <h3 class="menu-section-title">${sectionTitle}</h3>
                    <ul class="enhanced-menu-links">
            `;
            
            sectionItems.forEach(item => {
                const badgeHTML = item.badge && item.badge > 0 
                    ? `<span class="menu-badge">${item.badge}</span>` 
                    : '';
                
                menuHTML += `
                    <li class="enhanced-menu-item">
                        <a href="${item.href}" class="enhanced-menu-link ${item.class}" onclick="burgerMenu.handleItemClick('${item.href}')">
                            <div class="menu-icon">
                                <div class="icon ${item.icon}"></div>
                            </div>
                            <span class="menu-text">${item.text}</span>
                            ${badgeHTML}
                        </a>
                    </li>
                `;
            });
            
            menuHTML += `
                    </ul>
                </div>
            `;
        });
        
        // Ajouter section déconnexion
        menuHTML += `
            <div class="menu-section">
                <h3 class="menu-section-title">Compte</h3>
                <ul class="enhanced-menu-links">
                    <li class="enhanced-menu-item">
                        <a href="#" class="enhanced-menu-link menu-item-logout" onclick="burgerMenu.logout()">
                            <div class="menu-icon">
                                <div class="icon icon-logout"></div>
                            </div>
                            <span class="menu-text">${this.currentUser.name ? 'Déconnexion' : 'Connexion'}</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
        
        menuNav.innerHTML = menuHTML;
    }

    groupItemsBySection(items) {
        return items.reduce((sections, item) => {
            const section = item.section || 'main';
            if (!sections[section]) {
                sections[section] = [];
            }
            sections[section].push(item);
            return sections;
        }, {});
    }

    getSectionTitle(sectionName) {
        const titles = {
            main: 'Navigation principale',
            management: 'Gestion',
            account: 'Mon compte',
            tools: 'Outils'
        };
        return titles[sectionName] || 'Menu';
    }

    updateUserProfile() {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userTypeBadge = document.getElementById('userTypeBadge');

        if (this.currentUser && this.currentUser.name) {
            if (userAvatar) {
                userAvatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
            }
            if (userName) {
                userName.textContent = this.currentUser.name.split(' ')[0];
            }
            if (userRole) {
                userRole.textContent = this.currentUser.email || 'Utilisateur connecté';
            }
            if (userTypeBadge) {
                userTypeBadge.textContent = this.currentUser.type === 'owner' ? 'Propriétaire' : 'Conducteur';
            }
        } else {
            if (userAvatar) userAvatar.textContent = '?';
            if (userName) userName.textContent = 'Connexion';
            if (userRole) userRole.textContent = 'Cliquez pour vous connecter';
            if (userTypeBadge) userTypeBadge.textContent = 'Visiteur';
        }
        
        // Mettre à jour le badge de notifications
        this.updateNotificationBadge();
    }

    toggle() {
        const burger = document.querySelector('.enhanced-burger');
        const menu = document.querySelector('.enhanced-mobile-menu');
        
        if (burger && menu) {
            this.isOpen = !this.isOpen;
            
            burger.classList.toggle('active', this.isOpen);
            menu.classList.toggle('active', this.isOpen);
            
            // Empêcher le scroll du body quand le menu est ouvert
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
            
            // Fermer les autres éléments ouverts
            this.closeOtherElements();
        }
    }

    close() {
        const burger = document.querySelector('.enhanced-burger');
        const menu = document.querySelector('.enhanced-mobile-menu');
        
        if (burger && menu) {
            this.isOpen = false;
            burger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleItemClick(href) {
        this.close();
        
        // Ajouter un petit délai pour l'animation
        setTimeout(() => {
            if (href.startsWith('#')) {
                return; // Ne pas naviguer pour les liens anchor
            }
            
            // Vérifier si la page existe, sinon rediriger vers home
            this.navigateToPage(href);
        }, 200);
    }

    navigateToPage(href) {
        // Vérifier si nous sommes déjà sur la page
        if (window.location.pathname === href) {
            return;
        }
        
        // Naviguer vers la page
        window.location.href = href;
    }

    goToNotifications() {
        this.close();
        setTimeout(() => {
            window.location.href = '/notifications.html';
        }, 200);
    }

    logout() {
        if (this.currentUser.name) {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('user');
                this.showToast('Déconnexion réussie', 'success');
                setTimeout(() => {
                    window.location.href = '/auth-modern.html';
                }, 1000);
            }
        } else {
            this.close();
            setTimeout(() => {
                window.location.href = '/auth-modern.html';
            }, 200);
        }
    }

    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.enhanced-menu-link');
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    getNotificationCount() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return notifications.filter(n => n.unread).length;
    }

    updateNotificationBadge() {
        const count = this.getNotificationCount();
        const badge = document.getElementById('notificationBadge');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        
        // Mettre à jour aussi dans le menu
        const menuBadges = document.querySelectorAll('.menu-badge');
        menuBadges.forEach(badge => {
            if (badge.closest('.menu-item-notifications')) {
                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }

    simulateNotifications() {
        // Créer quelques notifications de démo si elles n'existent pas
        let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        if (notifications.length === 0) {
            notifications = [
                {
                    id: 1,
                    title: 'Réservation confirmée!',
                    message: 'Votre place au Parking Centre-ville est réservée pour aujourd\'hui 15h.',
                    type: 'success',
                    unread: true,
                    timestamp: Date.now() - 300000 // Il y a 5 minutes
                },
                {
                    id: 2,
                    title: 'Nouvelle place disponible',
                    message: '3 nouvelles places de parking près de votre localisation habituelle.',
                    type: 'info',
                    unread: true,
                    timestamp: Date.now() - 7200000 // Il y a 2 heures
                }
            ];
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
        
        this.updateNotificationBadge();
        
        // Simuler de nouvelles notifications périodiquement (pour démo)
        setInterval(() => {
            if (Math.random() < 0.01) { // 1% de chance toutes les 10 secondes
                this.addRandomNotification();
            }
        }, 10000);
    }

    addRandomNotification() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const randomNotifications = [
            {
                title: 'Place libérée!',
                message: 'Une place s\'est libérée près de votre position.',
                type: 'info'
            },
            {
                title: 'Rappel de paiement',
                message: 'Votre session de parking se termine dans 10 minutes.',
                type: 'warning'
            },
            {
                title: 'Nouvelle promotion',
                message: 'Profitez de 20% de réduction sur votre prochaine réservation!',
                type: 'success'
            }
        ];
        
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification = {
            id: Date.now(),
            ...randomNotif,
            unread: true,
            timestamp: Date.now()
        };
        
        notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        this.updateNotificationBadge();
        this.showToast('Nouvelle notification reçue!', 'info');
    }

    closeOtherElements() {
        // Fermer autres dropdowns ou modals s'il y en a
        const otherDropdowns = document.querySelectorAll('.dropdown.active, .modal.active');
        otherDropdowns.forEach(element => {
            element.classList.remove('active');
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 320px;
            font-family: 'Inter', sans-serif;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animation d'apparition
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    attachEventListeners() {
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (event) => {
            const menu = document.querySelector('.enhanced-mobile-menu');
            const burger = document.querySelector('.enhanced-burger');
            
            if (this.isOpen && menu && burger &&
                !menu.contains(event.target) && 
                !burger.contains(event.target)) {
                this.close();
            }
        });
        
        // Fermer le menu avec Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Mettre à jour le profil utilisateur si les données changent
        window.addEventListener('storage', (event) => {
            if (event.key === 'user') {
                this.loadUser();
                this.updateUserProfile();
                this.generateMenuItems();
            }
        });
        
        // Détecter les changements de page pour mettre à jour l'élément actif
        window.addEventListener('popstate', () => {
            this.setActiveMenuItem();
        });
    }

    // Méthodes publiques pour l'utilisation externe
    switchUserType(newType) {
        if (this.currentUser) {
            this.currentUser.type = newType;
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            this.loadUser();
            this.updateUserProfile();
            this.generateMenuItems();
            this.showToast(`Interface ${newType === 'owner' ? 'propriétaire' : 'conducteur'} activée`, 'success');
        }
    }

    updateUser(userData) {
        this.currentUser = { ...this.currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.updateUserProfile();
        this.generateMenuItems();
    }
}

// Initialiser le menu burger
let burgerMenu;

// Initialisation quand le DOM est charg��
document.addEventListener('DOMContentLoaded', () => {
    burgerMenu = new EnhancedBurgerMenu();
});

// Rendre les méthodes disponibles globalement pour les événements inline
window.burgerMenu = burgerMenu;

// Export pour utilisation comme module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedBurgerMenu;
}
