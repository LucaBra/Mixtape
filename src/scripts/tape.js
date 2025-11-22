class TapePage {
    constructor() {
        this.tracks = [];
        this.init();
    }

    async init() {
        await this.loadTracks();
        this.populateHighlights();
        this.populateRecommendations();
        this.populateMixes();
        this.setupEventListeners();
    }

    async loadTracks() {
        this.tracks = await DataService.fetchTracks();
    }

    populateHighlights() {
        const highlights = document.querySelectorAll('.dimga');
        const recentTracks = DataService.getRecentTracks(this.tracks, 2);
        
        highlights.forEach((highlight, index) => {
            if (recentTracks[index]) {
                const track = recentTracks[index];
                const img = document.createElement('img');
                img.src = DataService.getArtworkUrl(track.artworkFile);
                img.alt = track.title;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                highlight.innerHTML = '';
                highlight.appendChild(img);
            }
        });
    }

    populateRecommendations() {
        const cards = document.querySelectorAll('.card');
        const recommendedTracks = DataService.getPopularTracks(this.tracks, 7);
        
        cards.forEach((card, index) => {
            if (recommendedTracks[index]) {
                const track = recommendedTracks[index];
                const titleElement = card.querySelector('.card-title');
                const artistElement = card.querySelector('.card-artist');
                const imageElement = card.querySelector('.dimgb');
                
                titleElement.textContent = track.title;
                artistElement.textContent = track.artists.join(', ');
                
                if (track.artworkFile) {
                    imageElement.style.backgroundImage = `url(${DataService.getArtworkUrl(track.artworkFile)})`;
                    imageElement.style.backgroundSize = 'cover';
                    imageElement.style.backgroundPosition = 'center';
                }
            }
        });
    }

    populateMixes() {
        const mixCards = document.querySelectorAll('.cardc');
        const mixTracks = DataService.getPopularTracks(this.tracks, 12);
        
        mixCards.forEach((card, index) => {
            if (mixTracks[index]) {
                const track = mixTracks[index];
                const titleElement = card.querySelector('h3');
                const artistElement = card.querySelector('small');
                const imageElement = card.querySelector('.dimgc');
                
                titleElement.textContent = track.title;
                artistElement.textContent = track.artists.join(', ');
                
                if (track.artworkFile) {
                    imageElement.style.backgroundImage = `url(${DataService.getArtworkUrl(track.artworkFile)})`;
                    imageElement.style.backgroundSize = 'cover';
                    imageElement.style.backgroundPosition = 'center';
                }
            }
        });
    }

    setupEventListeners() {
        document.querySelectorAll(".card").forEach((card, index) => {
            card.addEventListener("click", () => {
                const recommendedTracks = DataService.getPopularTracks(this.tracks, 7);
                if (recommendedTracks[index]) {
                    const albumName = encodeURIComponent(recommendedTracks[index].title);
                    window.location.href = `album.html?album=${albumName}`;
                }
            });
        });
        
        document.querySelectorAll(".dimga").forEach((card, index) => {
            card.addEventListener("click", () => {
                const recentTracks = DataService.getRecentTracks(this.tracks, 2);
                if (recentTracks[index]) {
                    const albumName = encodeURIComponent(recentTracks[index].title);
                    window.location.href = `album.html?album=${albumName}`;
                }
            });
        });
        
        document.querySelectorAll(".cardc").forEach((card, index) => {
            card.addEventListener("click", () => {
                const mixTracks = DataService.getPopularTracks(this.tracks, 12);
                if (mixTracks[index]) {
                    const albumName = encodeURIComponent(mixTracks[index].title);
                    window.location.href = `album.html?album=${albumName}`;
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TapePage();
});