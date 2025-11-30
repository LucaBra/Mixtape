document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('playBtn');
    const borderpb = document.getElementById('borderpb');
    const pulley = document.getElementById('pulley');
    const playbar = document.querySelector('.playbar');
    const timeElements = document.querySelectorAll('.timenbar small');
    const volumeSlider = document.querySelector('.volume');

    if (!audioPlayer) {
        console.error("Audio player element not found!");
        return;
    }

    let isPlaying = false;

    function setPlayingState(playing) {
        isPlaying = playing;
        if (playBtn) {
            playBtn.src = isPlaying ? '../components/svg/Stop.svg' : '../components/svg/Play.svg';
        }
    }

    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            // Só toca se houver uma fonte de áudio válida
            if (audioPlayer.src && audioPlayer.src !== window.location.href) {
                audioPlayer.play().catch(e => console.error("Error playing audio:", e));
            }
        }
        // O estado será atualizado pelos eventos 'play' e 'pause' do player
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    window.formatTime = formatTime; // Torna a função acessível globalmente

    // Eventos do Player de Áudio
    audioPlayer.addEventListener('play', () => setPlayingState(true));
    audioPlayer.addEventListener('pause', () => setPlayingState(false));

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (timeElements[1]) {
            timeElements[1].textContent = formatTime(audioPlayer.duration);
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration || isNaN(audioPlayer.duration)) return;

        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;

        if (borderpb) borderpb.style.width = progress + '%';

        if (pulley && playbar) {
            const barWidth = playbar.offsetWidth;
            const pos = (progress / 100) * barWidth;
            pulley.style.transform = `translate(${pos}px, -50%)`;
        }

        if (timeElements[0]) {
            timeElements[0].textContent = formatTime(audioPlayer.currentTime);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        if (!window.playQueue) return;

        if (window.playQueue.repeatMode === 'one') {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            return;
        }

        const nextTrack = window.playQueue.next();
        if (nextTrack) {
            window.dispatchEvent(new CustomEvent('playNextTrack', { detail: nextTrack }));
        } else {
            setPlayingState(false); // Garante que o botão volte para "Play"
        }
    });

    audioPlayer.addEventListener('error', () => {
        setPlayingState(false);
        console.error('Erro ao carregar ou reproduzir o áudio.');
    });

    // Controles da UI
    if (playBtn) playBtn.addEventListener('click', togglePlay);

    if (playbar) {
        playbar.addEventListener('click', (e) => {
            if (!audioPlayer.duration) return;

            const rect = playbar.getBoundingClientRect();
            const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);

            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value / 100;
        });

        audioPlayer.volume = 0.5;
        volumeSlider.value = 50;
    }

    const menuBtn = document.getElementById('menuBtn');
    const menuPopup = document.getElementById('menuPopup');
    
    if (menuBtn && menuPopup) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuPopup.style.display = 'block';
            setTimeout(() => menuPopup.classList.add('show'), 10);
        });

        document.addEventListener('click', (e) => {
            if (!menuPopup.contains(e.target) && e.target !== menuBtn) {
                menuPopup.classList.remove('show');
                setTimeout(() => menuPopup.style.display = 'none', 300);
            }
        });

        // Menu options functionality
        document.querySelectorAll('.menu-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = option.dataset.action;
                
                menuPopup.classList.remove('show');
                setTimeout(() => menuPopup.style.display = 'none', 300);
            });
        });
    }

    // Torna a função togglePlay global para ser acessível via onclick no HTML (solução de compatibilidade)
    window.togglePlay = togglePlay;
});