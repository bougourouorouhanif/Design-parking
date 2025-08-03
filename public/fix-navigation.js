// Script pour réparer et améliorer la navigation
document.addEventListener('DOMContentLoaded', function() {
    // Corriger tous les liens qui n'ont pas d'extension
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Ignorer les liens externes, anchors et qui ont déjà une extension
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.includes('.')) {
            // Ajouter .html sauf pour la racine
            if (href !== '/') {
                link.setAttribute('href', href + '.html');
            } else {
                link.setAttribute('href', '/index.html');
            }
        }
    });
    
    // Ajouter les gestionnaires pour les liens de spots
    window.goToSpot = function(id) {
        if (window.burgerMenu) {
            burgerMenu.showToast('Ouverture des détails de la place...', 'info');
        }
        setTimeout(() => {
            window.location.href = `/spot.html?id=${id}`;
        }, 500);
    };
    
    // Fonction pour les recherches
    window.searchParking = function(event) {
        if (event) event.preventDefault();
        
        const locationInput = document.getElementById('location');
        const datetimeInput = document.getElementById('datetime');
        
        if (locationInput && datetimeInput) {
            const location = locationInput.value;
            const datetime = datetimeInput.value;
            
            localStorage.setItem('searchLocation', location);
            localStorage.setItem('searchDateTime', datetime);
            
            if (window.burgerMenu) {
                burgerMenu.showToast(`Recherche pour "${location}" en cours...`, 'info');
            }
            
            setTimeout(() => {
                window.location.href = '/map.html';
            }, 1000);
        }
    };
    
    // Ajouter des gestionnaires pour les boutons de réservation
    const allButtons = document.querySelectorAll('.btn');
    const reserveButtons = Array.from(allButtons).filter(button =>
        button.textContent.includes('Réserver') ||
        button.innerHTML.includes('Réserver')
    );

    reserveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.burgerMenu) {
                burgerMenu.showToast('Redirection vers la réservation...', 'info');
            }
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 500);
        });
    });
    
    // Initialiser la date par défaut si présente
    const datetimeInput = document.getElementById('datetime');
    if (datetimeInput && !datetimeInput.value) {
        datetimeInput.value = new Date(Date.now() + 3600000).toISOString().slice(0, 16);
    }
    
    // S'assurer que le body a le bon padding
    document.body.style.paddingTop = '70px';
    
    // Ajouter une notification de démo si nécessaire
    setTimeout(() => {
        if (window.burgerMenu) {
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            if (notifications.length === 0) {
                burgerMenu.addRandomNotification();
            }
        }
    }, 2000);
});

// Fonctions utilitaires globales
window.showToast = function(message, type = 'info') {
    if (window.burgerMenu) {
        burgerMenu.showToast(message, type);
    } else {
        // Fallback simple
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// Fonction pour naviguer en toute sécurité
window.navigateTo = function(page) {
    if (window.burgerMenu) {
        burgerMenu.showToast('Navigation en cours...', 'info');
    }
    
    // S'assurer que la page a l'extension .html
    if (!page.includes('.') && page !== '/') {
        page = page + '.html';
    }
    
    setTimeout(() => {
        window.location.href = page;
    }, 300);
};
