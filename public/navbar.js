// Fonctions communes pour la navbar moderne
function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Fermer les autres menus ouverts
        closeNotifications();
    }
}

function closeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    const isActive = dropdown.classList.contains('active');
    
    // Fermer tous les autres menus
    closeMobileMenu();
    
    if (isActive) {
        dropdown.classList.remove('active');
    } else {
        dropdown.classList.add('active');
        // Charger les notifications si nécessaire
        loadNotifications();
    }
}

function closeNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

function toggleUserMenu() {
    // Redirection intelligente basée sur l'état de connexion
    const user = localStorage.getItem('user');
    if (user) {
        // Utilisateur connecté - aller au dashboard
        window.location.href = '/dashboard';
    } else {
        // Utilisateur non connecté - aller à la page de connexion
        window.location.href = '/auth';
    }
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Mettre à jour le badge
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
    
    showToast('Toutes les notifications ont été marquées comme lues', 'success');
}

function handleNotificationClick(notificationId) {
    // Marquer comme lu
    if (event && event.currentTarget) {
        event.currentTarget.classList.remove('unread');
    }
    
    // Diminuer le compteur
    const badge = document.getElementById('notificationCount');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        if (currentCount > 0) {
            const newCount = currentCount - 1;
            badge.textContent = newCount;
            if (newCount === 0) {
                badge.style.display = 'none';
            }
        }
    }
    
    // Redirection intelligente basée sur le type de notification
    switch(notificationId) {
        case 1: // Réservation confirmée
            setTimeout(() => window.location.href = '/dashboard', 300);
            break;
        case 2: // Nouvelles places
            setTimeout(() => window.location.href = '/map', 300);
            break;
        case 3: // Rappel de réservation
            setTimeout(() => window.location.href = '/dashboard', 300);
            break;
        case 4: // Paiement effectué
            setTimeout(() => window.location.href = '/dashboard', 300);
            break;
        default:
            closeNotifications();
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#7ED6A7' : type === 'error' ? '#FF4757' : '#4A90E2'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
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

function updateUserProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (userProfile && userAvatar) {
        if (user.name) {
            // Utilisateur connecté
            userAvatar.textContent = user.name.charAt(0).toUpperCase();
            if (userName) userName.textContent = user.name.split(' ')[0];
            if (userRole) userRole.textContent = user.type === 'owner' ? 'Propriétaire' : 'Conducteur';
            userProfile.style.display = 'flex';
        } else {
            // Utilisateur non connecté
            userAvatar.textContent = '?';
            if (userName) userName.textContent = 'Connexion';
            if (userRole) userRole.textContent = 'Cliquez ici';
        }
    }

    // Adapter le menu selon le rôle de l'utilisateur
    adaptMenuForUserRole(user);
}

function adaptMenuForUserRole(user) {
    const mobileMenuLinks = document.querySelector('.mobile-menu-links');
    if (!mobileMenuLinks) return;

    // Définir les liens selon le rôle
    let menuItems = [];

    if (user.type === 'owner') {
        // Menu pour propriétaires
        menuItems = [
            { href: '/owner', icon: '<div class="icon icon-dashboard icon-interactive"></div>', text: 'Tableau de bord' },
            { href: '/add-spot', icon: '<div class="icon icon-add icon-interactive"></div>', text: 'Ajouter place' },
            { href: '/owner-reservations', icon: '<div class="icon icon-reservations icon-interactive"></div>', text: 'Réservations' },
            { href: '/owner-earnings', icon: '<div class="icon icon-earnings icon-interactive"></div>', text: 'Revenus' },
            { href: '/owner-profile', icon: '<div class="icon icon-profile icon-interactive"></div>', text: 'Profil' },
            { href: '#', icon: '<div class="icon icon-logout icon-interactive"></div>', text: 'Déconnexion', onclick: 'logout()' }
        ];
    } else {
        // Menu pour conducteurs (par défaut)
        menuItems = [
            { href: '/home', icon: '<div class="icon icon-home icon-interactive"></div>', text: 'Accueil' },
            { href: '/map', icon: '<div class="icon icon-map icon-interactive"></div>', text: 'Rechercher une place' },
            { href: '/profile', icon: '<div class="icon icon-profile icon-interactive"></div>', text: 'Mon Profil' },
            { href: '/payment', icon: '<div class="icon icon-payment icon-interactive"></div>', text: 'Paiement' },
            { href: '/navigation', icon: '<div class="icon icon-navigation icon-interactive"></div>', text: 'Navigation' },
            { href: user.name ? '#' : '/auth', icon: '<div class="icon icon-logout icon-interactive"></div>', text: user.name ? 'Déconnexion' : 'Connexion', onclick: user.name ? 'logout()' : null }
        ];
    }

    // Reconstruire le menu
    mobileMenuLinks.innerHTML = '';
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.innerHTML = `${item.icon} <span class="menu-text">${item.text}</span>`;
        a.onclick = function() {
            closeMobileMenu();
            if (item.onclick) {
                eval(item.onclick);
            }
        };
        li.appendChild(a);
        mobileMenuLinks.appendChild(li);
    });
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('user');
        window.location.href = '/auth';
    }
}

function loadNotifications() {
    // Simuler le chargement de notifications depuis l'API
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Réservation confirmée!',
            message: 'Votre place au Parking Centre-ville est réservée pour aujourd\'hui 15h.',
            time: 'Il y a 5 minutes',
            unread: true,
            icon: '🎉'
        },
        {
            id: 2,
            type: 'info',
            title: 'Nouvelle place disponible',
            message: '3 nouvelles places de parking près de votre localisation habituelle.',
            time: 'Il y a 2 heures',
            unread: true,
            icon: '📍'
        },
        {
            id: 3,
            type: 'warning',
            title: 'Rappel de réservation',
            message: 'Votre réservation expire dans 30 minutes. Pensez à prolonger si nécessaire.',
            time: 'Il y a 4 heures',
            unread: false,
            icon: '⚠️'
        }
    ];

    const notificationList = document.getElementById('notificationList');
    if (notificationList && notificationList.children.length === 0) {
        // Créer les éléments de notification s'ils n'existent pas
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.className = `notification-item ${notification.unread ? 'unread' : ''}`;
            li.onclick = () => handleNotificationClick(notification.id);
            
            li.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon-bg ${notification.type}">${notification.icon}</div>
                    <div class="notification-text">
                        <p class="notification-title">${notification.title}</p>
                        <p class="notification-message">${notification.message}</p>
                        <p class="notification-time">${notification.time}</p>
                    </div>
                </div>
            `;
            
            notificationList.appendChild(li);
        });
        
        // Mettre à jour le badge
        const unreadCount = notifications.filter(n => n.unread).length;
        const badge = document.getElementById('notificationCount');
        if (badge && unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        }
    }
}

// Fermer les menus quand on clique à l'extérieur
document.addEventListener('click', function(event) {
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const mobileMenuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Fermer notifications si clic à l'extérieur
    if (notificationIcon && !notificationIcon.contains(event.target)) {
        closeNotifications();
    }
    
    // Fermer menu mobile si clic à l'extérieur
    if (mobileMenuToggle && !mobileMenuToggle.contains(event.target) && 
        mobileMenu && !mobileMenu.contains(event.target)) {
        closeMobileMenu();
    }
});

// Initialisation au chargement de la page
window.addEventListener('load', function() {
    updateUserProfile();
    
    // Créer le dropdown de notifications s'il n'existe pas
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon && !document.getElementById('notificationDropdown')) {
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.id = 'notificationDropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <a href="#" class="mark-all-read" onclick="markAllAsRead()">Tout marquer lu</a>
            </div>
            <ul class="notification-list" id="notificationList"></ul>
            <div class="notification-footer">
                <a href="/notifications" class="view-all-notifications">Voir toutes les notifications</a>
            </div>
        `;
        notificationIcon.appendChild(dropdown);
    }
    
    // Simuler de nouvelles notifications périodiquement (pour démo)
    setInterval(() => {
        const badge = document.getElementById('notificationCount');
        if (badge && Math.random() < 0.02) { // 2% de chance toutes les 10 secondes
            const currentCount = parseInt(badge.textContent) || 0;
            if (currentCount < 5) {
                badge.textContent = currentCount + 1;
                badge.style.display = 'flex';
                showToast('Nouvelle notification reçue!', 'info');
            }
        }
    }, 10000);
});

// Fonctions utilitaires pour la navigation active
function setActiveNavItem(currentPage) {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Détecter la page actuelle et marquer l'élément de navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    setActiveNavItem(currentPath);
});
