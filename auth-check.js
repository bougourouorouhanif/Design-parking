// Script de vérification d'authentification - MODE DEMO (vérifications désactivées)
(function() {
    'use strict';

    // MODE DEMO: Créer automatiquement un utilisateur fictif si aucun n'existe
    let user = localStorage.getItem('user');

    if (!user) {
        // Créer un utilisateur fictif par défaut
        const demoUser = {
            email: 'demo@parky.com',
            name: 'Utilisateur Demo',
            phone: '+33 6 12 34 56 78',
            type: 'driver' // Par défaut conducteur, peut être changé
        };

        localStorage.setItem('user', JSON.stringify(demoUser));
        user = JSON.stringify(demoUser);
        console.log('🎭 Mode Demo activé - Utilisateur fictif créé automatiquement');
    }

    // Toujours adapter l'interface selon l'utilisateur (même fictif)
    try {
        const userData = JSON.parse(user);
        adaptInterfaceForUser(userData);

        // MODE DEMO: Permettre l'accès à toutes les pages même avec un type d'utilisateur différent
        // (Pas de vérification de permissions strictes)

    } catch (error) {
        console.error('Erreur de parsing des données utilisateur:', error);
        // En cas d'erreur, recréer un utilisateur demo
        const demoUser = {
            email: 'demo@parky.com',
            name: 'Utilisateur Demo',
            type: 'driver'
        };
        localStorage.setItem('user', JSON.stringify(demoUser));
        adaptInterfaceForUser(demoUser);
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
            document.body.classList.remove('driver-interface');
        } else {
            document.body.classList.add('driver-interface');
            document.body.classList.remove('owner-interface');
        }

        // Mettre à jour les informations utilisateur dans l'interface
        const userElements = document.querySelectorAll('[data-user-name]');
        userElements.forEach(element => {
            element.textContent = userData.name || 'Utilisateur Demo';
        });

        const userTypeElements = document.querySelectorAll('[data-user-type]');
        userTypeElements.forEach(element => {
            element.textContent = userData.type === 'owner' ? 'Propriétaire' : 'Conducteur';
        });

        // MODE DEMO: Ajouter un indicateur visuel du mode demo
        addDemoModeIndicator(userData);
    }

    // MODE DEMO: Ajouter un indicateur et des boutons de bascule
    function addDemoModeIndicator(userData) {
        // Supprimer l'indicateur existant s'il y en a un
        const existingIndicator = document.getElementById('demo-mode-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Créer l'indicateur de mode demo
        const demoIndicator = document.createElement('div');
        demoIndicator.id = 'demo-mode-indicator';
        demoIndicator.innerHTML = `
            <div class="demo-indicator-content">
                <span class="demo-label">🎭 MODE DEMO</span>
                <div class="demo-controls">
                    <button class="demo-btn ${userData.type === 'driver' ? 'active' : ''}" onclick="switchUserType('driver')">
                        <div class="icon icon-profile"></div>
                        Conducteur
                    </button>
                    <button class="demo-btn ${userData.type === 'owner' ? 'active' : ''}" onclick="switchUserType('owner')">
                        <div class="icon icon-dashboard"></div>
                        Propriétaire
                    </button>
                </div>
            </div>
        `;

        // Styles pour l'indicateur de demo
        demoIndicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 1rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid #4A90E2;
            border-radius: 12px;
            padding: 0.75rem;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: 'Poppins', sans-serif;
            font-size: 0.8rem;
            min-width: 200px;
        `;

        document.body.appendChild(demoIndicator);

        // Ajouter les styles pour les boutons demo
        if (!document.getElementById('demo-styles')) {
            const demoStyles = document.createElement('style');
            demoStyles.id = 'demo-styles';
            demoStyles.textContent = `
                .demo-indicator-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                }

                .demo-label {
                    font-weight: 600;
                    color: #4A90E2;
                    font-size: 0.7rem;
                    letter-spacing: 0.5px;
                }

                .demo-controls {
                    display: flex;
                    gap: 0.5rem;
                }

                .demo-btn {
                    background: transparent;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 0.4rem 0.6rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.7rem;
                    color: #666;
                }

                .demo-btn:hover {
                    background: rgba(74, 144, 226, 0.1);
                    border-color: #4A90E2;
                }

                .demo-btn.active {
                    background: #4A90E2;
                    color: white;
                    border-color: #4A90E2;
                }

                .demo-btn .icon {
                    width: 14px;
                    height: 14px;
                }

                @media (max-width: 768px) {
                    #demo-mode-indicator {
                        top: 70px;
                        right: 0.5rem;
                        min-width: 180px;
                    }

                    .demo-btn {
                        padding: 0.3rem 0.4rem;
                        font-size: 0.65rem;
                    }
                }
            `;
            document.head.appendChild(demoStyles);
        }
    }

    // MODE DEMO: Fonction pour basculer entre les types d'utilisateurs
    window.switchUserType = function(newType) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        currentUser.type = newType;

        // Mettre à jour le nom selon le type
        if (newType === 'owner') {
            currentUser.name = 'Propriétaire Demo';
        } else {
            currentUser.name = 'Conducteur Demo';
        }

        localStorage.setItem('user', JSON.stringify(currentUser));

        // Recharger la page pour appliquer les changements
        window.location.reload();
    };

    // MODE DEMO: Créer des données fictives pour les tests
    window.generateDemoData = function() {
        const demoData = {
            reservations: [
                {
                    id: 1,
                    address: '123 Rue de la Paix, Paris',
                    date: '2024-01-15',
                    time: '14:00-16:00',
                    price: '5.50€',
                    status: 'confirmed'
                },
                {
                    id: 2,
                    address: '45 Avenue des Champs, Lyon',
                    date: '2024-01-20',
                    time: '09:00-12:00',
                    price: '8.00€',
                    status: 'pending'
                }
            ],
            earnings: {
                today: 12.50,
                week: 89.75,
                month: 256.30
            },
            spots: [
                {
                    id: 1,
                    address: '10 Rue Victor Hugo, Paris',
                    price: 3.50,
                    type: 'covered',
                    available: true
                }
            ]
        };

        localStorage.setItem('demoData', JSON.stringify(demoData));
        console.log('📊 Données de démonstration générées');
        return demoData;
    };

    // Générer automatiquement des données demo au chargement
    if (!localStorage.getItem('demoData')) {
        window.generateDemoData();
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
