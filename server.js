const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, 'uploads/music/');
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/artwork/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/music')) {
    fs.mkdirSync('uploads/music');
}
if (!fs.existsSync('uploads/artwork')) {
    fs.mkdirSync('uploads/artwork');
}
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

app.post('/api/upload', upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'artwork', maxCount: 1 }
]), (req, res) => {
    try {
        const trackData = {
            id: Date.now(),
            title: req.body.title,
            artists: req.body.artists.split(',').map(a => a.trim()),
            genre: req.body.genre,
            tags: req.body.tags.split(',').map(t => t.trim()).filter(t => t),
            description: req.body.description,
            privacy: req.body.privacy,
            trackLink: req.body.trackLink,
            songFile: req.files.song ? req.files.song[0].filename : null,
            artworkFile: req.files.artwork ? req.files.artwork[0].filename : null,
            uploadDate: new Date().toISOString()
        };

        let tracks = [];
        if (fs.existsSync('data/tracks.json')) {
            const data = fs.readFileSync('data/tracks.json', 'utf8');
            tracks = JSON.parse(data);
        }

        tracks.push(trackData);
        fs.writeFileSync('data/tracks.json', JSON.stringify(tracks, null, 2));

        res.json({ 
            success: true, 
            message: 'Track uploaded successfully',
            track: trackData
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Upload failed: ' + error.message 
        });
    }
});

app.get('/api/tracks', (req, res) => {
    try {
        if (fs.existsSync('data/tracks.json')) {
            const data = fs.readFileSync('data/tracks.json', 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error reading tracks' });
    }
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});