# Mixtape Upload Setup

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

3. **Open the upload page:**
   Open `src/pages/upload.html` in your browser

## How it works

- MP3 files are saved to `uploads/music/`
- Artwork images are saved to `uploads/artwork/`
- Track metadata is saved to `data/tracks.json`
- Server runs on `http://localhost:3000`

## File Structure After Upload

```
uploads/
├── music/
│   └── [timestamp]-[filename].mp3
├── artwork/
│   └── [timestamp]-[filename].jpg/png
data/
└── tracks.json
```

## API Endpoints

- `POST /api/upload` - Upload track with metadata
- `GET /api/tracks` - Get all uploaded tracks
- `GET /uploads/*` - Serve uploaded files