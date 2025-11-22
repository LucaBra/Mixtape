class DataService {
    static async fetchTracks() {
        try {
            const response = await fetch('http://localhost:3000/api/tracks');
            if (!response.ok) {
                throw new Error('Failed to fetch tracks');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tracks:', error);
            return [];
        }
    }

    static getArtworkUrl(filename) {
        return filename ? `http://localhost:3000/uploads/artwork/${filename}` : '';
    }

    static getMusicUrl(filename) {
        return filename ? `http://localhost:3000/uploads/music/${filename}` : '';
    }

    static groupTracksByArtist(tracks) {
        const grouped = {};
        tracks.forEach(track => {
            track.artists.forEach(artist => {
                if (!grouped[artist]) {
                    grouped[artist] = [];
                }
                grouped[artist].push(track);
            });
        });
        return grouped;
    }

    static getRecentTracks(tracks, count = 7) {
        return tracks
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
            .slice(0, count);
    }

    static getPopularTracks(tracks, count = 10) {
        return tracks
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }

    static getTracksByGenre(tracks, genre) {
        return tracks.filter(track => track.genre === genre);
    }

    static groupTracksByAlbum(tracks) {
        const albums = {};
        tracks.forEach(track => {
            const albumName = track.title; // Using track title as album name for now
            if (!albums[albumName]) {
                albums[albumName] = {
                    name: albumName,
                    artist: track.artists[0],
                    tracks: [],
                    artworkFile: track.artworkFile,
                    genre: track.genre,
                    uploadDate: track.uploadDate
                };
            }
            albums[albumName].tracks.push(track);
        });
        return Object.values(albums);
    }

    static getAlbumByName(tracks, albumName) {
        const albums = this.groupTracksByAlbum(tracks);
        return albums.find(album => album.name === albumName);
    }
}