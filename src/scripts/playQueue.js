class PlayQueue {
    constructor() {
        this.queue = [];
        this.currentIndex = -1;
        this.shuffleMode = false;
        this.repeatMode = 'none'; // 'none', 'one', 'all'
        this.originalQueue = [];
    }
    
    setQueue(tracks, startIndex = 0) {
        this.queue = tracks;
        this.currentIndex = startIndex;
        this.originalQueue = [...tracks];
        return this.getCurrentTrack();
    }
    
    getCurrentTrack() {
        if (this.currentIndex >= 0 && this.currentIndex < this.queue.length) {
            return this.queue[this.currentIndex];
        }
        return null;
    }
    
    next() {
        if (this.repeatMode === 'one') {
            return this.getCurrentTrack();
        }
        
        this.currentIndex++;
        
        if (this.currentIndex >= this.queue.length) {
            if (this.repeatMode === 'all') {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.queue.length - 1;
                return null; // Acabou
            }
        }
        
        return this.getCurrentTrack();
    }
    
    previous() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        return this.getCurrentTrack();
    }
    
    toggleShuffle() {
        this.shuffleMode = !this.shuffleMode;
        
        if (this.shuffleMode) {
            const current = this.getCurrentTrack();
            this.queue = this.shuffleArray([...this.originalQueue]);
            this.currentIndex = this.queue.indexOf(current);
        } else {
            const current = this.getCurrentTrack();
            this.queue = [...this.originalQueue];
            this.currentIndex = this.queue.indexOf(current);
        }
        
        return this.shuffleMode;
    }
    
    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIdx = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIdx + 1) % modes.length];
        return this.repeatMode;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Instância global
window.playQueue = new PlayQueue();