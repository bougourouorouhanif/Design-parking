// Script de vérification d'authentification
(function() {
    'use strict';
    
    // Pages qui ne nécessitent pas d'authentification
    const publicPages = ['/auth', '/auth.html', '/', '/index.html'];
    
    // Obtenir la page actuelle
    const currentPath = window.location.pathname;
    
    // Vérifier si c'est une page publique
    const isPublicPage = publicPages.some(page => 
        currentPath === page || currentPath.endsWith(page)
    );
    
    // Si ce n'est pas une page publique, vérifier l'authentification
    if (!isPublicPage) {
        const user = localStorage.getItem('user');
        
        if (!user) {
            // Rediriger vers l'authentification si pas connecté
            showAuthRedirectMessage();
            setTimeout(() => {
                window.location.href = '/auth';
            }, 2000);
            return;
        }
        
        try {
            const userData = JSON.parse(user);
            
            // Vérifier les permissions de page selon le type d'utilisateur
            if (currentPath.includes('/owner') && userData.type !== 'owner') {
                showAccessDeniedMessage();
                setTimeout(() => {
                    window.location.href = userData.type === 'owner' ? '/owner' : '/home';
                }, 2000);
                return;
            }
            
            // Adapter l'interface selon le type d'utilisateur
            adaptInterfaceForUser(userData);
            
        } catch (error) {
            console.error('Erreur de parsing des données utilisateur:', error);
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
    }
    
    function showAuthRedirectMessage() {
        const message = document.createElement('div');
        message.className = 'auth-redirect-message';
        message.innerHTML = `
            <div class="auth-message-content">
                <div class="auth-message-icon">🔐</div>
                <div class="auth-message-text">
                    <h3>Authentification requise</h3>
                    <p>Redirection vers la page de connexion...</p>
                </div>
            </div>
        `;
        
        // Styles inline pour l'affichage
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: 'Poppins', sans-serif;
        `;
        
        message.querySelector('.auth-message-content').style.cssText = `
            background: linear-gradient(135deg, #4A90E2 0%, #7ED6A7 100%);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            max-width: 400px;
            margin: 0 1rem;
        `;
        
        message.querySelector('.auth-message-icon').style.cssText = `
            font-size: 3rem;
            margin-bottom: 1rem;
        `;
        
        message.querySelector('.auth-message-text h3').style.cssText = `
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        `;
        
        message.querySelector('.auth-message-text p').style.cssText = `
            margin: 0;
            opacity: 0.9;
        `;
        
        document.body.appendChild(message);
    }
    
    function showAccessDeniedMessage() {
        const message = document.createElement('div');
        message.className = 'access-denied-message';
        message.innerHTML = `
            <div class="access-message-content">
                <div class="access-message-icon">⛔</div>
                <div class="access-message-text">
                    <h3>Accès non autorisé</h3>
                    <p>Redirection vers votre espace...</p>
                </div>
            </div>
        `;
        
        // Styles similaires avec couleur différente
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: 'Poppins', sans-serif;
        `;
        
        message.querySelector('.access-message-content').style.cssText = `
            background: linear-gradient(135deg, #FF4757 0%, #FF3742 100%);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            max-width: 400px;
            margin: 0 1rem;
        `;
        
        message.querySelector('.access-message-icon').style.cssText = `
            font-size: 3rem;
            margin-bottom: 1rem;
        `;
        
        message.querySelector('.access-message-text h3').style.cssText = `
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        `;
        
        message.querySelector('.access-message-text p').style.cssText = `
            margin: 0;
            opacity: 0.9;
        `;
        
        document.body.appendChild(message);
    }
    
    function adaptInterfaceForUser(userData) {
        // Adapter l'interface selon le type d'utilisateur
        if (userData.type === 'owner') {
            document.body.classList.add('owner-interface');
        } else {
            document.body.classList.add('driver-interface');
        }
        
        // Mettre à jour les informations utilisateur dans l'interface
        const userElements = document.querySelectorAll('[data-user-name]');
        userElements.forEach(element => {
            element.textContent = userData.name || 'Utilisateur';
        });
        
        const userTypeElements = document.querySelectorAll('[data-user-type]');
        userTypeElements.forEach(element => {
            element.textContent = userData.type === 'owner' ? 'Propriétaire' : 'Conducteur';
        });
    }
    
    // Fonction pour déconnecter l'utilisateur
    window.logout = function() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('user');
            showToast('Déconnexion réussie', 'success');
            setTimeout(() => {
                window.location.href = '/auth';
            }, 1000);
        }
    };
    
    // Fonction toast réutilisable
    window.showToast = function(message, type = 'info') {
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
            font-family: 'Poppins', sans-serif;
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
    };
    
})();
