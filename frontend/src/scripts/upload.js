const artworkUpload = document.getElementById('artworkUpload');
const artworkInput = document.getElementById('artworkInput');
const artworkPreview = document.getElementById('artworkPreview');
const songUpload = document.getElementById('songUpload');
const songInput = document.getElementById('songInput');

artworkUpload.addEventListener('click', () => {
    artworkInput.click();
});

artworkInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            artworkPreview.src = event.target.result;
            artworkUpload.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
});

songUpload.addEventListener('click', () => {
    songInput.click();
});

songInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            songUpload.classList.add('has-music');
        };
        reader.readAsDataURL(file);
    }
});

songInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const placeholder = document.querySelector('.song-upload .upload-placeholder p');
        placeholder.textContent = `Adicionado: ${file.name}`;
        songUpload.classList.add('has-music');
    }
});
function handleUpload() {
    const trackTitle = document.getElementById('trackTitle').value;
    const artists = document.getElementById('artists').value;

    if (!trackTitle || !artists) {
        alert('Por favor, preencha os campos obrigatórios (Título e Artista).');
        return;
    }

    alert('Faixa enviada com sucesso! (Esta é uma demonstração)');
}