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

// só um eventlistner rabolas
songInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const placeholder = document.querySelector('.song-upload .upload-placeholder p');
        placeholder.textContent = `Adicionado: ${file.name}`;
        songUpload.classList.add('has-music');
    }
});

async function handleUpload() {
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;

    const trackTitle = document.getElementById('trackTitle').value;
    const artists = document.getElementById('artists').value;
    const genre = document.getElementById('genre').value;
    const tags = document.getElementById('tags').value;
    const description = document.getElementById('description').value;
    const privacy = document.querySelector('input[name="privacy"]:checked').value;
    const trackLink = document.getElementById('trackLink').value;

    if (!trackTitle || !artists) {
        alert('Por favor, preencha os campos obrigatórios (Título e Artista).');
        return;
    }

    const songFile = songInput.files[0];
    if (!songFile) {
        alert('Por favor, selecione um arquivo de música.');
        return;
    }

    const formData = new FormData();
    formData.append('title', trackTitle);
    formData.append('artists', artists);
    formData.append('genre', genre);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('privacy', privacy);
    formData.append('trackLink', trackLink);
    formData.append('song', songFile);
    
    if (artworkInput.files[0]) {
        formData.append('artwork', artworkInput.files[0]);
    }

    try {
        // Desabilita o botão e mostra feedback de carregamento
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Faixa enviada com sucesso!'); // Idealmente, trocar por uma mensagem na tela
            document.getElementById('trackTitle').value = '';
            document.getElementById('artists').value = '';
            document.getElementById('genre').value = '';
            document.getElementById('tags').value = '';
            document.getElementById('description').value = '';
            document.getElementById('trackLink').value = '';
            document.querySelector('input[name="privacy"][value="public"]').checked = true;
            artworkPreview.src = '';
            artworkUpload.classList.remove('has-image');
            songUpload.classList.remove('has-music');
            document.querySelector('.song-upload .upload-placeholder p').innerHTML = '<strong>Adicionar nova musica</strong>';
            songInput.value = '';
            artworkInput.value = '';
        } else {
            alert('Erro ao enviar faixa: ' + result.message);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Erro ao enviar faixa. Verifique se o servidor está rodando em localhost:3000');
    } finally {
        // Reabilita o botão e volta o texto original, independentemente do resultado
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}