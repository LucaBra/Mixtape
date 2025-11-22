var isPlaying = false;

function setPlayingState(playing) {
    isPlaying = playing;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.src = isPlaying ? '../components/svg/Stop.svg' : '../components/svg/Play.svg';
    }
}

function togglePlay() {
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;

    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (audioPlayer.src) {
            audioPlayer.play();
        }
    }
    setPlayingState(!isPlaying);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;

    const borderpb = document.getElementById('borderpb');
    const pulley = document.getElementById('pulley');
    const playbar = document.querySelector('.playbar');
    const timeElements = document.querySelectorAll('.timenbar small');

    // Atualiza progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
        
        if (borderpb) borderpb.style.width = progress + '%';
        if (pulley) pulley.style.left = progress + '%';
        
        // Atualiza tempos
        if (timeElements[0]) {
            timeElements[0].textContent = formatTime(audioPlayer.currentTime);
        }
        if (timeElements[1]) {
            timeElements[1].textContent = formatTime(audioPlayer.duration);
        }
    });

    // Click na barra para pular
    if (playbar) {
        playbar.addEventListener('click', (e) => {
            const rect = playbar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }

    // Quando termina
    audioPlayer.addEventListener('ended', () => {
        setPlayingState(false);
    });

    // Se houver erro
    audioPlayer.addEventListener('error', () => {
        setPlayingState(false);
        console.error('Erro ao carregar áudio');
    });

    // Volume control
    const volumeSlider = document.querySelector('.volume');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value / 100;
        });
        
        // Define volume inicial
        audioPlayer.volume = 0.5;
    }
});