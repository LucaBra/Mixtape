document.addEventListener('keydown', (e) => {
    // Ignora se estiver digitando
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            // Pula 3 segundos
            audioPlayer.currentTime = Math.min(
                audioPlayer.currentTime + 3, 
                audioPlayer.duration
            );
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            // Volta 3 segundos
            audioPlayer.currentTime = Math.max(
                audioPlayer.currentTime - 3, 
                0
            );
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            // Aumenta volume
            changeVolume(0.1);
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            // Diminui volume
            changeVolume(-0.1);
            break;
            
        case 'KeyM':
            e.preventDefault();
            toggleMute();
            break;
            
        case 'KeyN':
            e.preventDefault();
            // Next track
            document.querySelector('img[src*="Forward"]')?.closest('.buttonsb')?.click();
            break;
            
        case 'KeyP':
            e.preventDefault();
            // Previous track
            document.querySelector('img[src*="Back"]')?.closest('.buttonsb')?.click();
            break;
    }
});

function changeVolume(delta) {
    const audio = document.getElementById('audio-player');
    const volumeSlider = document.querySelector('.volume');
    if (!audio || !volumeSlider) return;
    
    let newVolume = audio.volume + delta;
    newVolume = Math.max(0, Math.min(1, newVolume));
    
    audio.volume = newVolume;
    volumeSlider.value = newVolume * 100;
    
    showNotification(`Volume: ${Math.round(newVolume * 100)}%`, 'info');
}

function toggleMute() {
    const audio = document.getElementById('audio-player');
    if (!audio) return;
    
    audio.muted = !audio.muted;
    showNotification(audio.muted ? 'Mudo' : 'Som ativado', 'info');
}