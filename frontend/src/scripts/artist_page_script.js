// artist.js - Script for dynamic artist page content

// Placeholder database - Replace with actual API calls in production
const artistDatabase = {
    artists: {
        'artist-1': {
            id: 'artist-1',
            name: 'The Midnight Collective',
            profilePicture: '', // URL to profile picture
            isVerified: true,
            monthlyListeners: 2500000,
            about: 'The Midnight Collective is an innovative music group that has been captivating audiences worldwide since 2018. Known for their unique blend of electronic and indie rock, they have released multiple chart-topping albums and have performed at major festivals around the globe. Their sound is characterized by atmospheric synths, powerful vocals, and introspective lyrics that resonate with millions of fans.',
            
            popularTracks: [
                {
                    id: 'track-1',
                    title: 'Neon Dreams',
                    coverImage: '',
                    plays: 150000000,
                    duration: '3:45',
                    albumId: 'album-1'
                },
                {
                    id: 'track-2',
                    title: 'Lost in the Echo',
                    coverImage: '',
                    plays: 120000000,
                    duration: '4:12',
                    albumId: 'album-1'
                },
                {
                    id: 'track-3',
                    title: 'Midnight Run',
                    coverImage: '',
                    plays: 98000000,
                    duration: '3:28',
                    albumId: 'album-2'
                },
                {
                    id: 'track-4',
                    title: 'Electric Souls',
                    coverImage: '',
                    plays: 87000000,
                    duration: '3:56',
                    albumId: 'album-2'
                },
                {
                    id: 'track-5',
                    title: 'Starlight',
                    coverImage: '',
                    plays: 76000000,
                    duration: '4:03',
                    albumId: 'album-3'
                }
            ],
            
            discography: [
                {
                    id: 'album-1',
                    title: 'Nocturnal Waves',
                    coverImage: '',
                    year: 2024,
                    type: 'Album',
                    trackCount: 12
                },
                {
                    id: 'album-2',
                    title: 'Electric Dreams',
                    coverImage: '',
                    year: 2023,
                    type: 'Album',
                    trackCount: 14
                },
                {
                    id: 'ep-1',
                    title: 'After Hours',
                    coverImage: '',
                    year: 2023,
                    type: 'EP',
                    trackCount: 6
                },
                {
                    id: 'single-1',
                    title: 'Neon Dreams',
                    coverImage: '',
                    year: 2024,
                    type: 'Single',
                    trackCount: 1
                },
                {
                    id: 'album-3',
                    title: 'Echoes of Tomorrow',
                    coverImage: '',
                    year: 2022,
                    type: 'Album',
                    trackCount: 11
                }
            ]
        },
        'artist-2': {
            id: 'artist-2',
            name: 'Luna Storm',
            profilePicture: '',
            isVerified: true,
            monthlyListeners: 1800000,
            about: 'Luna Storm burst onto the music scene in 2020 with her powerful voice and emotional songwriting. Her music blends pop, R&B, and electronic elements to create a sound that is uniquely her own.',
            
            popularTracks: [
                {
                    id: 'track-6',
                    title: 'Thunder Heart',
                    coverImage: '',
                    plays: 95000000,
                    duration: '3:32',
                    albumId: 'album-4'
                },
                {
                    id: 'track-7',
                    title: 'Moonlight',
                    coverImage: '',
                    plays: 82000000,
                    duration: '3:18',
                    albumId: 'album-4'
                }
            ],
            
            discography: [
                {
                    id: 'album-4',
                    title: 'Storm Season',
                    coverImage: '',
                    year: 2024,
                    type: 'Album',
                    trackCount: 10
                }
            ]
        }
    }
};

// Helper function to format numbers (e.g., 2500000 -> 2.5M)
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Function to load artist data
function loadArtistData(artistId) {
    // In production, this would be an API call:
    // return fetch(`/api/artists/${artistId}`).then(res => res.json());
    
    // For now, return data from placeholder database
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const artist = artistDatabase.artists[artistId];
            if (artist) {
                resolve(artist);
            } else {
                reject(new Error('Artist not found'));
            }
        }, 500); // Simulate network delay
    });
}

// Function to render artist header
function renderArtistHeader(artist) {
    const artistImage = document.querySelector('.artist-image');
    const artistName = document.querySelector('.artist-name');
    const verifiedBadge = document.querySelector('.verified-badge');
    const artistStats = document.querySelector('.artist-stats');
    
    // Set profile picture or placeholder text
    if (artist.profilePicture) {
        artistImage.style.backgroundImage = `url(${artist.profilePicture})`;
        artistImage.style.backgroundSize = 'cover';
        artistImage.textContent = '';
    } else {
        artistImage.textContent = artist.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    }
    
    artistName.textContent = artist.name;
    
    if (artist.isVerified) {
        verifiedBadge.style.display = 'flex';
    } else {
        verifiedBadge.style.display = 'none';
    }
    
    artistStats.textContent = `${formatNumber(artist.monthlyListeners)} monthly listeners`;
}

// Function to render popular tracks
function renderPopularTracks(tracks) {
    const tracksContainer = document.querySelector('.popular-tracks');
    tracksContainer.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.dataset.trackId = track.id;
        
        trackElement.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-cover" style="${track.coverImage ? `background-image: url(${track.coverImage}); background-size: cover;` : ''}">
                ${track.coverImage ? '' : 'COVER'}
            </div>
            <div class="track-info">
                <div class="track-name">${track.title}</div>
                <div class="track-plays">${formatNumber(track.plays)} plays</div>
            </div>
            <div class="track-duration">${track.duration}</div>
            <div class="track-actions">
                <button class="icon-btn" onclick="toggleLike('${track.id}')">♥</button>
                <button class="icon-btn" onclick="showTrackMenu('${track.id}')">⋯</button>
            </div>
        `;
        
        trackElement.addEventListener('click', (e) => {
            if (!e.target.closest('.track-actions')) {
                playTrack(track.id);
            }
        });
        
        tracksContainer.appendChild(trackElement);
    });
}

// Function to render discography
function renderDiscography(albums) {
    const albumsContainer = document.querySelector('.albums-grid');
    albumsContainer.innerHTML = '';
    
    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.className = 'album-card';
        albumElement.dataset.albumId = album.id;
        
        albumElement.innerHTML = `
            <div class="album-cover" style="${album.coverImage ? `background-image: url(${album.coverImage}); background-size: cover;` : ''}">
                ${album.coverImage ? '' : album.type.toUpperCase()}
            </div>
            <div class="album-info">
                <div class="album-title">${album.title}</div>
                <div class="album-year">${album.year} • ${album.type}</div>
            </div>
        `;
        
        albumElement.addEventListener('click', () => {
            openAlbum(album.id);
        });
        
        albumsContainer.appendChild(albumElement);
    });
}

// Function to render about section
function renderAbout(aboutText) {
    const aboutContent = document.querySelector('.about-content');
    aboutContent.textContent = aboutText;
}

// Main initialization function
async function initializeArtistPage() {
    try {
        // Get artist ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const artistId = urlParams.get('id') || 'artist-1'; // Default to artist-1
        
        // Show loading state
        showLoadingState();
        
        // Load artist data
        const artist = await loadArtistData(artistId);
        
        // Render all sections
        renderArtistHeader(artist);
        renderPopularTracks(artist.popularTracks);
        renderDiscography(artist.discography);
        renderAbout(artist.about);
        
        // Hide loading state
        hideLoadingState();
        
        console.log('Artist page loaded successfully:', artist.name);
    } catch (error) {
        console.error('Error loading artist page:', error);
        showErrorState(error.message);
    }
}

// Placeholder functions for interactivity
function playTrack(trackId) {
    console.log('Playing track:', trackId);
    // In production, this would trigger the audio player
    alert(`Playing track: ${trackId}`);
}

function toggleLike(trackId) {
    console.log('Toggle like for track:', trackId);
    // In production, this would update the user's liked songs
}

function showTrackMenu(trackId) {
    console.log('Show menu for track:', trackId);
    // In production, this would show a context menu
}

function openAlbum(albumId) {
    console.log('Opening album:', albumId);
    // In production, this would navigate to album page
    alert(`Opening album: ${albumId}`);
}

function showLoadingState() {
    // Add loading indicators
    document.querySelector('.artist-name').textContent = 'Loading...';
}

function hideLoadingState() {
    // Remove loading indicators
}

function showErrorState(message) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div style="text-align: center; padding: 50px; color: var(--cor-branca);">
            <h2>Error Loading Artist</h2>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--cor-primaria); color: white; border: none; border-radius: 5px; cursor: pointer;">
                Retry
            </button>
        </div>
    `;
}

// Play button functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeArtistPage();
    
    // Add event listener for play button in header
    const playButton = document.querySelector('.btn-play');
    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log('Play all tracks');
            // In production, this would start playing the artist's top tracks
            alert('Playing all popular tracks...');
        });
    }
    
    // Add event listener for follow button
    const followButton = document.querySelector('.btn-follow');
    if (followButton) {
        followButton.addEventListener('click', () => {
            const isFollowing = followButton.textContent === 'Following';
            followButton.textContent = isFollowing ? 'Follow' : 'Following';
            console.log(isFollowing ? 'Unfollowed artist' : 'Followed artist');
        });
    }
});

// Export functions for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadArtistData,
        formatNumber,
        initializeArtistPage
    };
}