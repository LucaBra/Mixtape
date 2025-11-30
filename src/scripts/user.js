class UserPage {
    constructor() {
        this.tracks = [];
        this.currentArtist = null;
        this.init();
    }

    async init() {
        await this.loadTracks();
        this.extractArtistFromURL();
        this.populateArtistInfo();
        this.populatePopularTracks();
        this.populateAlbums();
        this.setupEventListeners();
    }

    async loadTracks() {
        this.tracks = await DataService.fetchTracks();
    }

    extractArtistFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentArtist = urlParams.get('artist') || 'Artist Name';
    }

    populateArtistInfo() {
        const artistName = document.querySelector('.artist-name');
        const artistImage = document.querySelector('.artist-image');
        const monthlyListeners = document.querySelector('.artist-stats');
        
        artistName.textContent = this.currentArtist;
        
        const artistTracks = this.tracks.filter(track => 
            track.artists.includes(this.currentArtist)
        );
        
        monthlyListeners.textContent = `${artistTracks.length * 1234} monthly listeners`;
        
        if (artistTracks.length > 0 && artistTracks[0].artworkFile) {
            artistImage.style.backgroundImage = `url(${DataService.getArtworkUrl(artistTracks[0].artworkFile)})`;
            artistImage.style.backgroundSize = 'cover';
            artistImage.style.backgroundPosition = 'center';
        }
    }

    populatePopularTracks() {
        const trackItems = document.querySelectorAll('.track-item');
        const artistTracks = this.tracks.filter(track => 
            track.artists.includes(this.currentArtist)
        ).slice(0, 5);
        
        trackItems.forEach((item, index) => {
            if (artistTracks[index]) {
                const track = artistTracks[index];
                const trackNumber = item.querySelector('.track-number');
                const trackCover = item.querySelector('.track-cover');
                const trackName = item.querySelector('.track-name');
                const trackPlays = item.querySelector('.track-plays');
                const trackDuration = item.querySelector('.track-duration');
                
                trackNumber.textContent = index + 1;
                trackName.textContent = track.title;
                trackPlays.textContent = `${Math.floor(Math.random() * 100000) + 1000} plays`;
                trackDuration.textContent = `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                
                if (track.artworkFile) {
                    trackCover.style.backgroundImage = `url(${DataService.getArtworkUrl(track.artworkFile)})`;
                    trackCover.style.backgroundSize = 'cover';
                    trackCover.style.backgroundPosition = 'center';
                }
                
                item.dataset.trackId = track.id;
            } else {
                item.style.display = 'none';
            }
        });
    }

    populateAlbums() {
        const albumCards = document.querySelectorAll('.album-card');
        const artistTracks = this.tracks.filter(track => 
            track.artists.includes(this.currentArtist)
        );
        
        const uniqueAlbums = [...new Set(artistTracks.map(track => track.title))];
        const albumData = uniqueAlbums.slice(0, 5).map((title, index) => ({
            title: title,
            year: 2020 + Math.floor(Math.random() * 5),
            type: ['Album', 'Single', 'EP'][Math.floor(Math.random() * 3)],
            track: artistTracks.find(t => t.title === title)
        }));
        
        albumCards.forEach((card, index) => {
            if (albumData[index]) {
                const album = albumData[index];
                const albumCover = card.querySelector('.album-cover');
                const albumTitle = card.querySelector('.album-title');
                const albumYear = card.querySelector('.album-year');
                
                albumTitle.textContent = album.title;
                albumYear.textContent = `${album.year} • ${album.type}`;
                
                if (album.track && album.track.artworkFile) {
                    albumCover.style.backgroundImage = `url(${DataService.getArtworkUrl(album.track.artworkFile)})`;
                    albumCover.style.backgroundSize = 'cover';
                    albumCover.style.backgroundPosition = 'center';
                }
                
                // Add click event to navigate to specific album page
                card.addEventListener('click', () => {
                    const albumName = encodeURIComponent(album.title);
                    window.location.href = `album.html?album=${albumName}`;
                });
                
                card.style.cursor = 'pointer';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // Play button
        const playButton = document.querySelector('.btn-play');
        if (playButton) {
            playButton.addEventListener('click', () => {
                console.log(`Playing ${this.currentArtist}`);
            });
        }

        // Follow button
        const followButton = document.querySelector('.btn-follow');
        if (followButton) {
            followButton.addEventListener('click', function() {
                if (this.textContent === 'Follow') {
                    this.textContent = 'Following';
                    this.style.backgroundColor = '#1ed760';
                    this.style.color = 'white';
                } else {
                    this.textContent = 'Follow';
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }
            });
        }

        // Track items
        document.querySelectorAll('.track-item').forEach(item => {
            item.addEventListener('click', function() {
                const trackName = this.querySelector('.track-name').textContent;
                console.log(`Playing track: ${trackName}`);
                
                // Update footer player if it exists
                const titleLink = document.querySelector('.player-title');
                const artistLink = document.querySelector('.player-artist');
                if (titleLink) titleLink.textContent = trackName;
                if (artistLink) artistLink.textContent = this.currentArtist;
            });
        });

        // Favorite buttons
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.textContent === '♥') {
                    this.textContent = '♡';
                    this.style.color = '';
                } else {
                    this.textContent = '♥';
                    this.style.color = '#1ed760';
                }
            });
        });

        // Footer player buttons
        document.querySelectorAll('.buttonsb').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Player button clicked');
            });
        });

        // Volume control
        const volumeControl = document.querySelector('.volume');
        if (volumeControl) {
            volumeControl.addEventListener('input', function() {
                console.log('Volume:', this.value);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserPage();
});