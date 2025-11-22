function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove depois de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Expõe globalmente
window.showNotification = showNotification;