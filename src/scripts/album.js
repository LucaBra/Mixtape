// Track play functionality
document.querySelectorAll('.track-row').forEach(row => {
    row.addEventListener('click', function() {
        const trackNumber = this.getAttribute('data-track');
        const trackTitle = this.querySelector('.track-title').textContent;
        const trackArtist = this.querySelector('.track-artist').textContent;
        
        console.log(`Playing track ${trackNumber}: ${trackTitle} by ${trackArtist}`);
        
        // Update footer player
        document.querySelector('.nameby div a').textContent = trackTitle;
        document.querySelector('.nameby a:last-child').textContent = trackArtist;
    });
});

// Play button functionality
document.querySelector('.play-button').addEventListener('click', function() {
    console.log('Playing album');
});

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
document.getElementById('volume').addEventListener('input', function() {
    console.log('Volume:', this.value);
});

// Footer player buttons
document.querySelectorAll('.buttonsb').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Player button clicked');
    });
});