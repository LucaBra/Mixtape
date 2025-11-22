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
                
                // Generate placeholder data
                const duration = `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                const plays = Math.floor(Math.random() * 100000) + 1000;
                const bitrate = [128, 192, 256, 320][Math.floor(Math.random() * 4)];
                const quality = bitrate >= 256 ? 'HQ' : 'SQ';
                
                if (trackDuration) trackDuration.textContent = duration;
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
        document.querySelectorAll('.track-row').forEach(row => {
            row.addEventListener('click', () => {
                const trackId = row.getAttribute('data-track-id');
                const track = this.currentAlbum.tracks.find(t => t.id == trackId);

                if (!track || !track.songFile) {
                    console.error("Música não encontrada ou arquivo de áudio ausente.");
                    return;
                }
                
                console.log(`Playing track: ${track.title} by ${track.artists.join(', ')}`);
                
                // Update footer player
                const titleLink = document.querySelector('.nameby div a');
                const artistLink = document.querySelector('.nameby a:last-child');
                if (titleLink) titleLink.textContent = track.title;
                if (artistLink) artistLink.textContent = track.artists.join(', ');

                // Carrega e toca a música
                const audioPlayer = document.getElementById('audio-player');
                audioPlayer.src = DataService.getMusicUrl(track.songFile);
                audioPlayer.play();
                setPlayingState(true); // Atualiza o estado global e o botão de play/pause
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

    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlbumPage();
});