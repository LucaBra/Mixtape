class AlbumPage {
    constructor() {
        this.tracks = [];
        this.currentAlbum = null;
        this.currentAlbumName = null;
        this.init();
    }

    async init() {
        await this.loadTracks();
        this.extractAlbumFromURL();
        this.loadAlbumData();
        this.populateAlbumInfo();
        this.populateTracklist();
        this.setupEventListeners();
    }

    async loadTracks() {
        this.tracks = await DataService.fetchTracks();
    }

    extractAlbumFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentAlbumName = urlParams.get('album') || 'Default Album';
    }

    loadAlbumData() {
        this.currentAlbum = DataService.getAlbumByName(this.tracks, this.currentAlbumName);
        
        // If album not found, create a default album with all tracks
        if (!this.currentAlbum) {
            this.currentAlbum = {
                name: this.currentAlbumName,
                artist: 'Various Artists',
                tracks: this.tracks,
                artworkFile: this.tracks.length > 0 ? this.tracks[0].artworkFile : null,
                genre: 'Various',
                uploadDate: new Date().toISOString()
            };
        }
    }

    populateAlbumInfo() {
        const albumTitle = document.querySelector('.album-title');
        const artistName = document.querySelector('.album-artist span');
        const albumCover = document.querySelector('.album-cover');
        const songCount = document.querySelector('.album-meta span:first-child');
        const albumType = document.querySelector('.album-type');
        
        albumTitle.textContent = this.currentAlbum.name;
        artistName.textContent = this.currentAlbum.artist;
        songCount.textContent = `${this.currentAlbum.tracks.length} songs`;
        
        // Set album type based on track count
        if (albumType) {
            if (this.currentAlbum.tracks.length === 1) {
                albumType.textContent = 'Single';
            } else if (this.currentAlbum.tracks.length <= 6) {
                albumType.textContent = 'EP';
            } else {
                albumType.textContent = 'Album';
            }
        }
        
        // Calculate total duration (placeholder)
        const totalMinutes = this.currentAlbum.tracks.length * 3 + Math.floor(Math.random() * 20);
        const durationElement = document.querySelector('.album-meta span:last-child');
        if (durationElement) {
            durationElement.textContent = `about ${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min`;
        }
        
        if (this.currentAlbum.artworkFile) {
            albumCover.style.backgroundImage = `url(${DataService.getArtworkUrl(this.currentAlbum.artworkFile)})`;
            albumCover.style.backgroundSize = 'cover';
            albumCover.style.backgroundPosition = 'center';
        }
    }

    populateTracklist() {
        const trackRows = document.querySelectorAll('.track-row');
        
        trackRows.forEach((row, index) => {
            if (this.currentAlbum.tracks[index]) {
                const track = this.currentAlbum.tracks[index];
                const trackNumber = row.querySelector('.track-number');
                const trackTitle = row.querySelector('.track-title');
                const trackArtist = row.querySelector('.track-artist');
                const trackCover = row.querySelector('.track-cover');
                const trackDuration = row.querySelector('.track-duration');
                const trackPlays = row.querySelector('.track-plays');
                const trackDate = row.querySelector('.track-date');
                const trackBitrate = row.querySelector('.track-bitrate');
                const qualityBadge = row.querySelector('.quality-badge');
                
                trackNumber.textContent = index + 1;
                trackTitle.textContent = track.title;
                trackArtist.textContent = track.artists.join(', ');
                
                // Placeholder data for fields that should come from a backend
                const plays = Math.floor(Math.random() * 100000) + 1000;
                const bitrate = [128, 192, 256, 320][Math.floor(Math.random() * 4)];
                const quality = bitrate >= 256 ? 'HQ' : 'SQ';
                
                if (trackDuration) trackDuration.textContent = '--:--'; // Placeholder para duração
                if (trackPlays) trackPlays.textContent = plays;
                if (trackDate) trackDate.textContent = new Date(track.uploadDate).toLocaleDateString();
                if (trackBitrate) trackBitrate.textContent = `${bitrate} kbps`;
                if (qualityBadge) qualityBadge.textContent = quality;
                
                if (track.artworkFile) {
                    trackCover.style.backgroundImage = `url(${DataService.getArtworkUrl(track.artworkFile)})`;
                    trackCover.style.backgroundSize = 'cover';
                    trackCover.style.backgroundPosition = 'center';
                }
                
                row.dataset.trackId = track.id;
            } else {
                row.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // Track play functionality
        document.querySelectorAll('.track-row').forEach((row, index) => {
            row.addEventListener('click', () => {
                // Define a fila com todas as tracks do álbum
                window.playQueue.setQueue(this.currentAlbum.tracks, index);
                
                const track = window.playQueue.getCurrentTrack();
                if (!track || !track.songFile) {
                    showNotification('Música não disponível', 'error');
                    return;
                }
                
                this.playTrack(track);
            });
        });

        // Play button functionality
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                // Toca a primeira música do álbum
                const firstTrackRow = document.querySelector('.track-row');
                if (firstTrackRow) {
                    firstTrackRow.click();
                }
                console.log('Playing album');
            });
        }

        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Control button clicked');
            });
        });

        // Favorite functionality
        document.querySelectorAll('.track-favorite').forEach(fav => {
            fav.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.textContent === '♡') {
                    this.textContent = '♥';
                    this.style.color = '#1ed760';
                } else {
                    this.textContent = '♡';
                    this.style.color = '';
                }
            });
        });

        // Volume control
        const volumeControl = document.querySelector('.volume');
        if (volumeControl) {
            const audioPlayer = document.getElementById('audio-player');
            volumeControl.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value / 100;
            });
        }

        window.addEventListener('playNextTrack', (e) => {
            this.playTrack(e.detail);
        });

        // Botões Next e Previous
        const forwardBtn = document.querySelector('button[onclick*="Forward"]')?.closest('.buttonsb');
        const backBtn = document.querySelector('button[onclick*="Back"]')?.closest('.buttonsb');

        if (forwardBtn) {
            forwardBtn.onclick = () => {
                const nextTrack = window.playQueue.next();
                if (nextTrack) {
                    this.playTrack(nextTrack);
                } else {
                    showNotification('Fim da fila', 'info');
                }
            };
        }

        if (backBtn) {
            backBtn.onclick = () => {
                const prevTrack = window.playQueue.previous();
                if (prevTrack) {
                    this.playTrack(prevTrack);
                }
            };
        }

        // Botão Shuffle
        const shuffleBtn = document.querySelector('img[src*="Shuffle"]')?.closest('.buttonsb');
        if (shuffleBtn) {
            shuffleBtn.onclick = () => {
                const isShuffled = window.playQueue.toggleShuffle();
                shuffleBtn.style.opacity = isShuffled ? '1' : '0.6';
                shuffleBtn.style.color = isShuffled ? '#1ed760' : '';
                showNotification(isShuffled ? 'Aleatório ativado' : 'Aleatório desativado', 'info');
            };
        }

        // Botão Loop
        const loopBtn = document.querySelector('img[src*="Loop"]')?.closest('.buttonsb');
        if (loopBtn) {
            loopBtn.onclick = () => {
                const mode = window.playQueue.toggleRepeat();
                const modeText = {
                    'none': 'Repetição desativada',
                    'all': 'Repetir todas',
                    'one': 'Repetir uma'
                };
                loopBtn.style.opacity = mode === 'none' ? '0.6' : '1';
                showNotification(modeText[mode], 'info');
            };
        }

    }

    playTrack(track) {
        console.log(`Playing: ${track.title}`);
        
        // Atualiza UI
        this.updateNowPlayingUI(track);
        
        // Remove classe 'playing' de todas as tracks
        document.querySelectorAll('.track-row').forEach(r => r.classList.remove('playing'));
        
        // Adiciona classe 'playing' na track atual
        const currentRow = document.querySelector(`.track-row[data-track-id="${track.id}"]`);
        if (currentRow) currentRow.classList.add('playing');
        
        // Carrega e toca
        const audioPlayer = document.getElementById('audio-player');
        if (!audioPlayer) {
            showNotification('Player não encontrado', 'error');
            return;
        }
        
        const newSrc = DataService.getMusicUrl(track.songFile);

        // Se a música já é a mesma, não recarregue
        if (audioPlayer.src.endsWith(track.songFile)) {
            // Apenas dá play se estiver pausado
            audioPlayer.play()
                .catch(err => console.error('Erro ao tocar:', err));
            return;
        }

        // Música mudou → agora sim recarregar
        audioPlayer.src = newSrc;

        audioPlayer.play()
            .catch(err => console.error('Erro ao tocar:', err));

        // Ouve o evento 'loadedmetadata' para atualizar a duração na UI
        const updateDurationOnUI = () => {
            const currentRow = document.querySelector(`.track-row[data-track-id="${track.id}"]`);
            if (currentRow) {
                const durationElement = currentRow.querySelector('.track-duration');
                if (durationElement && window.formatTime) {
                    durationElement.textContent = window.formatTime(audioPlayer.duration);
                }
            }
            // Remove o listener para não ser chamado múltiplas vezes
            audioPlayer.removeEventListener('loadedmetadata', updateDurationOnUI);
        };
        audioPlayer.addEventListener('loadedmetadata', updateDurationOnUI);
    }

    updateNowPlayingUI(track) {
        const titleLink = document.querySelector('.nameby div a');
        const artistLink = document.querySelector('.nameby a:last-child');
        const coverImg = document.querySelector('.coverimg');
        
        if (titleLink) titleLink.textContent = track.title;
        if (artistLink) artistLink.textContent = track.artists.join(', ');
        if (coverImg && track.artworkFile) {
            coverImg.src = DataService.getArtworkUrl(track.artworkFile);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlbumPage();
});