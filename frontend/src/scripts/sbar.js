var isPlaying = false; 

function togglePlay() {
    isPlaying = !isPlaying;
    var btn = document.getElementById('playBtn');
    
    // Toggle between two image sources
    btn.src = isPlaying ? '../components/svg/Stop.svg' : '../components/svg/Play.svg';
}