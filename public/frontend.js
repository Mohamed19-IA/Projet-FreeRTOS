async function sendCommand(command) {
    try {
        const response = await fetch(`/send-command/${command}`);
        if (!response.ok) {
            throw new Error(`Erreur du serveur : ${response.status}`);
        }

        const result = await response.text();
        console.log(`Commande envoyée : ${command}\nRéponse du serveur : ${result}`);
        // Si tout va bien, ne rien afficher ou afficher un message de succès si nécessaire
    } catch (error) {
        console.error("Erreur lors de l'envoi de la commande :", error);
        // Appeler une fonction pour afficher le panneau d'erreur
        showError(`Erreur lors de l'envoi de la commande : ${error.message}`);
    }
}

// Fonction pour afficher le message d'erreur
function showError(message) {
    const errorPanel = document.getElementById('error-panel');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = message;
    errorPanel.style.display = 'block';

    // Masquer automatiquement le panneau après 5 secondes
    setTimeout(() => {
        errorPanel.style.display = 'none';
    }, 5000);
}
