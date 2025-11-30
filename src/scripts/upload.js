const artworkUpload = document.getElementById('artworkUpload');
const artworkInput = document.getElementById('artworkInput');
const artworkPreview = document.getElementById('artworkPreview');
const songUpload = document.getElementById('songUpload');
const songInput = document.getElementById('songInput');

const popupOverlay = document.getElementById('popupOverlay');
const popupIcon = document.getElementById('popupIcon');
const popupTitle = document.getElementById('popupTitle');
const popupMessage = document.getElementById('popupMessage');
const popupButton = document.getElementById('popupButton');

function showPopup(title, message, type = 'info') {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    
    popupIcon.className = 'popup-icon ' + type;
    if (type == 'success') {
        popupIcon.textContent = '✓';
    } else if (type == 'error') {
        popupIcon.textContent = '✕';
    } else {
        popupIcon.textContent = 'ℹ';
    }
    
    popupOverlay.classList.add('show');
}

function hidePopup() {
    popupOverlay.classList.remove('show');
}

popupButton.addEventListener('click', hidePopup);

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        hidePopup();
    }
});

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
        showPopup('Campos Obrigatórios', 'Por favor, preencha os campos obrigatórios (Título e Artista).', 'error');
        return;
    }

    const songFile = songInput.files[0];
    if (!songFile) {
        showPopup('Arquivo Obrigatório', 'Por favor, selecione um arquivo de música.', 'error');
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
            showPopup('Sucesso!', 'Faixa enviada com sucesso!', 'success');
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
            showPopup('Erro no Upload', 'Erro ao enviar faixa: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showPopup('Erro de Conexão', 'Erro ao enviar faixa. Verifique se o servidor está rodando em localhost:3000', 'error');
    } finally {
        // Reabilita o botão e volta o texto original, independentemente do resultado
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Drag & Drop para música
function setupDragDrop() {
    const uploadAreas = [
        { element: songUpload, input: songInput, type: 'song' },
        { element: artworkUpload, input: artworkInput, type: 'artwork' }
    ];
    
    uploadAreas.forEach(({ element, input, type }) => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            element.addEventListener(eventName, () => {
                element.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, () => {
                element.classList.remove('drag-over');
            }, false);
        });
        
        element.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                input.files = dataTransfer.files;
                
                // Dispara evento change
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Inicializa
setupDragDrop();