var colors = ['#0a0e1a', '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
var icons = ['⭐', '❤️', '🌙', '☀️', '⚡', '☁️', '☕', '🎧', '🎤', '📻', '🔊', '💿', '🎵', '🎶', '🎸'];
var scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var currentScale = 'C#';
var workspaces = [{id: 0, tracks: [{id: 1, name: 'Track 1', color: '#3b82f6', icon: '⭐', volume: 70, enabled: true, reverb: false}]}];
var currentWorkspace = 0;
var isPlaying = false;
var effects = {vinylRecord: false, lofi: false, echo: false, distortion: false, chorus: false, phaser: false};
var selectedTracks = new Set();
var selectedTrackId = null;
var availableTracks = [];

function loadData() {
    try {
        var w = localStorage.getItem('music-studio:workspaces');
        if (w) workspaces = JSON.parse(w);
        var cw = localStorage.getItem('music-studio:current-workspace');
        if (cw) currentWorkspace = JSON.parse(cw);
        var e = localStorage.getItem('music-studio:effects');
        if (e) effects = JSON.parse(e);
        var s = localStorage.getItem('music-studio:scale');
        if (s) currentScale = JSON.parse(s);
    } catch (e) { console.log('Loading defaults'); }
}

function saveData() {
    try {
        localStorage.setItem('music-studio:workspaces', JSON.stringify(workspaces));
        localStorage.setItem('music-studio:current-workspace', JSON.stringify(currentWorkspace));
        localStorage.setItem('music-studio:effects', JSON.stringify(effects));
        localStorage.setItem('music-studio:scale', JSON.stringify(currentScale));
    } catch (e) { console.error('Save error:', e); }
}

function init() {
    loadData();
    renderWorkspaces();
    renderTracks();
    setupColorPicker();
    setupScalePicker();
    setupEffects();
    renderMixer();
}

function getCurrentTracks() {
    var ws = workspaces.find(function(w) { return w.id === currentWorkspace; });
    return ws ? ws.tracks : [];
}

function updateWorkspaceTracks(t) {
    workspaces = workspaces.map(function(w) { return w.id === currentWorkspace ? {id: w.id, tracks: t} : w; });
    saveData();
}

function renderWorkspaces() {
    var l = document.getElementById('workspaceList');
    l.innerHTML = '';
    workspaces.forEach(function(ws) {
        var item = document.createElement('div');
        item.className = 'workspace-item';
        var btn = document.createElement('button');
        btn.className = 'workspace-btn' + (ws.id === currentWorkspace ? ' active' : '');
        btn.textContent = ws.id + 1;
        btn.onclick = function() { switchWorkspace(ws.id); };
        if (workspaces.length > 1) {
            var del = document.createElement('button');
            del.className = 'workspace-delete';
            del.textContent = '×';
            del.onclick = function(e) { e.stopPropagation(); deleteWorkspace(ws.id); };
            item.appendChild(del);
        }
        item.appendChild(btn);
        l.appendChild(item);
    });
}

function renderTracks() {
    var g = document.getElementById('trackGrid');
    g.innerHTML = '';
    getCurrentTracks().forEach(function(t) { g.appendChild(createTrackSquare(t)); });
    var add = document.createElement('button');
    add.className = 'add-track';
    add.textContent = '+';
    add.onclick = addTrack;
    g.appendChild(add);
    renderSoundsPopup();
    renderMixer();
}

function createTrackSquare(t) {
    var s = document.createElement('div');
    s.className = 'track-square' + (!t.enabled ? ' disabled' : '');
    s.style.backgroundColor = t.color + '30';
    s.style.border = '2px solid ' + t.color;
    s.onclick = function(e) { if (e.target === s || e.target.classList.contains('track-icon')) toggleTrack(t.id); };
    s.oncontextmenu = function(e) { e.preventDefault(); showTrackMenu(t, s); };
    var icon = document.createElement('div');
    icon.className = 'track-icon';
    icon.textContent = t.icon;
    var vb = document.createElement('div');
    vb.className = 'volume-bar';
    vb.innerHTML = '<div class="volume-bar-bg"></div><div class="volume-bar-fill" style="width:' + t.volume + '%"></div><input type="range" min="0" max="100" value="' + t.volume + '">';
    var sl = vb.querySelector('input');
    sl.oninput = function(e) { e.stopPropagation(); updateTrackVolume(t.id, e.target.value); };
    var set = document.createElement('button');
    set.className = 'track-settings';
    set.textContent = '⚙';
    set.onclick = function(e) { e.stopPropagation(); toggleTrackMenu(t, set); };
    s.appendChild(icon);
    s.appendChild(vb);
    s.appendChild(set);
    return s;
}

function toggleTrackMenu(t, b) {
    var ex = document.querySelector('.menu-popup');
    if (ex) { ex.remove(); return; }
    showTrackMenu(t, b);
}

function showTrackMenu(t, b) {
    var ex = document.querySelector('.menu-popup');
    if (ex) ex.remove();
    var subs = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu');
    subs.forEach(function(s) { s.remove(); });
    var m = document.createElement('div');
    m.className = 'menu-popup context-menu';
    
    // Sempre usar posicionamento fixo
    var rect = b.getBoundingClientRect ? b.getBoundingClientRect() : {top: event.clientY, left: event.clientX};
    
    var rename = document.createElement('button');
    rename.className = 'menu-item';
    rename.textContent = 'Rename';
    rename.onclick = function() { var n = prompt('Track name:', t.name); if (n) { t.name = n; saveData(); renderTracks(); } m.remove(); };
    var chIcon = document.createElement('button');
    chIcon.className = 'menu-item';
    chIcon.textContent = 'Change Icon';
    chIcon.onclick = function(e) { e.stopPropagation(); var s = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu'); s.forEach(function(x) { x.remove(); }); showIconPicker(t, m); };
    var chColor = document.createElement('button');
    chColor.className = 'menu-item';
    chColor.textContent = 'Change Color';
    chColor.onclick = function(e) { e.stopPropagation(); var s = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu'); s.forEach(function(x) { x.remove(); }); showColorPickerMenu(t, m); };
    var addM = document.createElement('button');
    addM.className = 'menu-item';
    addM.textContent = 'Add Music';
    addM.onclick = function() { 
        selectedTrackId = t.id;
        renderTracks();
        toggleMusicSearch(); 
        m.remove(); 
    };
    var del = document.createElement('button');
    del.className = 'menu-item danger';
    del.textContent = 'Delete';
    del.onclick = function() { removeTrack(t.id); m.remove(); };
    m.appendChild(rename);
    m.appendChild(chIcon);
    m.appendChild(chColor);
    m.appendChild(addM);
    m.appendChild(del);
    
    // Sempre adicionar ao body e posicionar como fixed
    document.body.appendChild(m);
    
    // Posicionar o menu
    var isGearButton = b.classList && b.classList.contains('track-settings');
    if (isGearButton) {
        // Se for engrenagem, usar posição do botão
        m.style.top = (rect.top + rect.height + 4) + 'px';
        m.style.left = rect.left + 'px';
    } else {
        // Se for contexto, usar posição do mouse
        m.style.top = event.clientY + 'px';
        m.style.left = event.clientX + 'px';
    }
    
    setTimeout(function() {
        document.addEventListener('click', function closeMenu(e) {
            if (!m.contains(e.target) && e.target !== b) {
                m.remove();
                var s = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu');
                s.forEach(function(x) { x.remove(); });
                document.removeEventListener('click', closeMenu);
            }
        });
        document.addEventListener('contextmenu', function closeMenuCtx(e) {
            if (!m.contains(e.target)) {
                m.remove();
                var s = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu');
                s.forEach(function(x) { x.remove(); });
                document.removeEventListener('contextmenu', closeMenuCtx);
            }
        });
    }, 0);
}

function showColorPickerMenu(t, m) {
    var all = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu');
    all.forEach(function(el) { el.remove(); });
    var p = document.createElement('div');
    p.className = 'icon-picker color-picker-submenu';
    p.style.gridTemplateColumns = 'repeat(4, 1fr)';
    colors.forEach(function(c) {
        var btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = c;
        btn.style.width = '28px';
        btn.style.height = '28px';
        btn.onclick = function() { t.color = c; saveData(); renderTracks(); };
        p.appendChild(btn);
    });
    
    // Sempre usar posicionamento fixo
    p.style.position = 'fixed';
    var r = m.getBoundingClientRect();
    p.style.top = r.top + 'px';
    var w = 150;
    var sp = window.innerWidth - r.right;
    if (sp >= w + 8) { 
        p.style.left = (r.right + 8) + 'px'; 
    } else { 
        p.style.left = (r.left - w - 8) + 'px'; 
    }
    p.style.right = 'auto';
    document.body.appendChild(p);
    
    setTimeout(function() {
        document.addEventListener('click', function closePicker(e) {
            if (!p.contains(e.target) && !m.contains(e.target)) { p.remove(); document.removeEventListener('click', closePicker); }
        });
    }, 0);
}

function showIconPicker(t, m) {
    var all = document.querySelectorAll('.color-picker-submenu, .icon-picker-submenu');
    all.forEach(function(el) { el.remove(); });
    var p = document.createElement('div');
    p.className = 'icon-picker icon-picker-submenu';
    icons.forEach(function(ic) {
        var btn = document.createElement('button');
        btn.className = 'icon-option';
        btn.textContent = ic;
        btn.onclick = function() { t.icon = ic; saveData(); renderTracks(); };
        p.appendChild(btn);
    });
    
    // Sempre usar posicionamento fixo
    p.style.position = 'fixed';
    var r = m.getBoundingClientRect();
    p.style.top = r.top + 'px';
    var w = 200;
    var sp = window.innerWidth - r.right;
    if (sp >= w + 8) { 
        p.style.left = (r.right + 8) + 'px'; 
    } else { 
        p.style.left = (r.left - w - 8) + 'px'; 
    }
    p.style.right = 'auto';
    document.body.appendChild(p);
    
    setTimeout(function() {
        document.addEventListener('click', function closePicker(e) {
            if (!p.contains(e.target) && !m.contains(e.target)) { p.remove(); document.removeEventListener('click', closePicker); }
        });
    }, 0);
}

function toggleTrack(id) {
    var tr = getCurrentTracks();
    var t = tr.find(function(x) { return x.id === id; });
    if (t) { t.enabled = !t.enabled; saveData(); renderTracks(); }
}

function updateTrackVolume(id, v) {
    var tr = getCurrentTracks();
    var t = tr.find(function(x) { return x.id === id; });
    if (t) {
        t.volume = parseInt(v);
        var sq = document.querySelectorAll('.track-square');
        sq.forEach(function(s) {
            var f = s.querySelector('.volume-bar-fill');
            var sl = s.querySelector('.volume-bar input');
            if (f && sl) { f.style.width = v + '%'; sl.value = v; }
        });
        var ms = document.querySelectorAll('.channel-slider');
        ms.forEach(function(sl) { if (parseInt(sl.getAttribute('data-track-id')) === id) sl.value = v; });
    }
}

function closeMixerOnOverlay(e) { if (e.target.id === 'mixerOverlay') toggleMixer(); }

function addTrack() {
    var tr = getCurrentTracks();
    var nt = {id: Date.now(), name: 'Track ' + (tr.length + 1), color: colors[Math.floor(Math.random() * colors.length)], icon: icons[Math.floor(Math.random() * icons.length)], volume: 70, enabled: true, reverb: false};
    updateWorkspaceTracks(tr.concat([nt]));
    renderTracks();
}

function removeTrack(id) {
    var tr = getCurrentTracks();
    updateWorkspaceTracks(tr.filter(function(t) { return t.id !== id; }));
    renderTracks();
}

function addWorkspace() {
    var nw = {id: workspaces.length, tracks: [{id: Date.now(), name: 'Track 1', color: colors[Math.floor(Math.random() * colors.length)], icon: icons[Math.floor(Math.random() * icons.length)], volume: 70, enabled: true, reverb: false}]};
    workspaces.push(nw);
    currentWorkspace = nw.id;
    saveData();
    renderWorkspaces();
    renderTracks();
}

function deleteWorkspace(id) {
    if (workspaces.length === 1) return;
    workspaces = workspaces.filter(function(w) { return w.id !== id; });
    if (currentWorkspace === id) currentWorkspace = workspaces[0].id;
    saveData();
    renderWorkspaces();
    renderTracks();
}

function switchWorkspace(id) { currentWorkspace = id; saveData(); renderWorkspaces(); renderTracks(); }

function setupColorPicker() {
    var p = document.getElementById('colorPicker');
    colors.forEach(function(c, i) {
        var btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = c;
        btn.title = i === 0 ? 'Default' : '';
        btn.onclick = function() { document.getElementById('mainView').style.backgroundColor = c; toggleColorPicker(); };
        p.appendChild(btn);
    });
}

function setupScalePicker() {
    var p = document.getElementById('scalePicker');
    scales.forEach(function(sc) {
        var btn = document.createElement('button');
        btn.className = 'effect-btn';
        btn.textContent = sc;
        btn.style.padding = '8px 4px';
        btn.onclick = function() { currentScale = sc; document.getElementById('currentScaleDisplay').textContent = sc; saveData(); toggleScalePicker(); };
        p.appendChild(btn);
    });
}

function toggleScalePicker() { document.getElementById('scalePicker').classList.toggle('hidden'); }
function toggleColorPicker() { document.getElementById('colorPicker').classList.toggle('hidden'); }

function setupEffects() {
    var p = document.getElementById('effectsPopup');
    p.innerHTML = '<div class="popup-title">Effects</div><div class="effects-grid" id="effectsGrid"></div><button class="vinyl-save-btn">Vinyl Record Save/Load</button>';
    var g = document.getElementById('effectsGrid');
    Object.keys(effects).forEach(function(ef) {
        var btn = document.createElement('button');
        btn.className = 'effect-btn';
        btn.textContent = ef === 'vinylRecord' ? 'Vinyl' : ef.charAt(0).toUpperCase() + ef.slice(1);
        btn.onclick = function() { effects[ef] = !effects[ef]; btn.classList.toggle('active', effects[ef]); saveData(); };
        g.appendChild(btn);
    });
}

function renderSoundsPopup() {
    var p = document.getElementById('soundsPopup');
    var tr = getCurrentTracks().slice(0, 4);
    p.innerHTML = '<div class="popup-title">Sounds</div>';
    tr.forEach(function(t) {
        var it = document.createElement('div');
        it.className = 'sound-item';
        it.innerHTML = '<span class="sound-name">' + t.name + '</span><div class="toggle-switch ' + (t.enabled ? 'active' : '') + '" onclick="toggleTrackFromPopup(' + t.id + ')"><div class="toggle-knob"></div></div>';
        p.appendChild(it);
    });
}

function toggleTrackFromPopup(id) { toggleTrack(id); }

function renderMixer() {
    var ch = document.getElementById('mixerChannels');
    var tr = getCurrentTracks();
    ch.innerHTML = '';
    tr.forEach(function(t) {
        var c = document.createElement('div');
        c.className = 'mixer-channel';
        c.innerHTML = '<button class="channel-eq-btn">Equalizer</button><div class="channel-volume"><input type="range" class="channel-slider" min="0" max="100" value="' + t.volume + '" data-track-id="' + t.id + '"><span class="channel-label">Volume</span></div><div class="knob"><div class="knob-control"><div class="knob-indicator"></div></div><span class="channel-label">Pitch</span></div><div class="knob"><div class="knob-control"><div class="knob-indicator"></div></div><span class="channel-label">Panning</span></div><div class="knob"><div class="knob-control' + (t.reverb ? '' : ' disabled') + '" onclick="toggleReverb(' + t.id + ')"><div class="knob-indicator"></div></div><span class="channel-label">Reverb</span></div><div class="channel-buttons"><button class="channel-btn">M</button><button class="channel-btn">F</button></div><div class="channel-name">' + t.name + '</div>';
        var sl = c.querySelector('.channel-slider');
        sl.oninput = function(e) { var tid = parseInt(e.target.getAttribute('data-track-id')); updateTrackVolume(tid, e.target.value); };
        ch.appendChild(c);
    });
}

function toggleReverb(id) {
    var tr = getCurrentTracks();
    var t = tr.find(function(x) { return x.id === id; });
    if (t) { t.reverb = !t.reverb; saveData(); renderMixer(); }
}

function toggleMixer() {
    var o = document.getElementById('mixerOverlay');
    o.classList.toggle('hidden');
    if (!o.classList.contains('hidden')) renderMixer();
}

function toggleEffects() { document.getElementById('effectsPopup').classList.toggle('hidden'); }
function toggleSounds() { document.getElementById('soundsPopup').classList.toggle('hidden'); }
function toggleVolume() { document.getElementById('volumePopup').classList.toggle('hidden'); }

function togglePlay() {
    isPlaying = !isPlaying;
    var btn = document.getElementById('playBtn');
    btn.textContent = isPlaying ? '⏸' : '▶';
}

function switchView(v) {
    document.getElementById('mainView').classList.toggle('hidden', v !== 'main');
    document.getElementById('minimalView').classList.toggle('hidden', v !== 'minimal');
    if (v === 'minimal') renderSoundsPopup();
}

async function fetchTracks() {
    try {
        const response = await fetch('http://localhost:3000/api/tracks');
        if (response.ok) {
            availableTracks = await response.json();
            // Ordena por data de upload mais recente primeiro
            availableTracks.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            renderTracksList();
        } else {
            console.error('Failed to fetch tracks');
            const tracksList = document.getElementById('tracksList');
            tracksList.innerHTML = '<div class="loading-message">Error loading tracks. Please try again.</div>';
        }
    } catch (error) {
        console.error('Error fetching tracks:', error);
        const tracksList = document.getElementById('tracksList');
        tracksList.innerHTML = '<div class="loading-message">Connection error. Check if server is running.</div>';
    }
}

function renderTracksList(searchTerm = '') {
    const tracksList = document.getElementById('tracksList');
    
    if (!availableTracks || availableTracks.length === 0) {
        tracksList.innerHTML = '<div class="loading-message">No tracks uploaded yet. Go to Upload page to add music!</div>';
        return;
    }
    
    const filteredTracks = availableTracks.filter(track => 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artists.some(artist => artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (track.genre && track.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filteredTracks.length === 0) {
        tracksList.innerHTML = '<div class="loading-message">No tracks found matching your search</div>';
        return;
    }

    tracksList.innerHTML = '';
    filteredTracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        if (selectedTracks.has(track.id)) {
            trackItem.classList.add('selected');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'track-checkbox';
        checkbox.checked = selectedTracks.has(track.id);
        checkbox.onchange = () => toggleTrackSelection(track.id);

        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';
        
        const title = document.createElement('div');
        title.className = 'track-title';
        title.textContent = track.title;
        
        const artist = document.createElement('div');
        artist.className = 'track-artist';
        artist.textContent = track.artists.join(', ');

        trackInfo.appendChild(title);
        trackInfo.appendChild(artist);

        const trackMeta = document.createElement('div');
        trackMeta.className = 'track-meta';
        trackMeta.innerHTML = `
            ${track.genre ? `<div><strong>Genre:</strong> ${track.genre}</div>` : ''}
            ${track.uploadDate ? `<div><strong>Uploaded:</strong> ${new Date(track.uploadDate).toLocaleDateString()}</div>` : ''}
            ${track.description ? `<div><strong>Description:</strong> ${track.description.substring(0, 50)}${track.description.length > 50 ? '...' : ''}</div>` : ''}
        `;

        trackItem.appendChild(checkbox);
        trackItem.appendChild(trackInfo);
        trackItem.appendChild(trackMeta);
        
        trackItem.onclick = (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                toggleTrackSelection(track.id);
            }
        };

        tracksList.appendChild(trackItem);
    });
}

function toggleTrackSelection(trackId) {
    selectedTracks.clear();
    if (selectedTracks.has(trackId)) {
        selectedTracks.delete(trackId);
    } else {
        selectedTracks.add(trackId);
    }
    renderTracksList(document.getElementById('musicSearchInput').value);
    updateAssignButton();
}

function updateAssignButton() {
    const assignBtn = document.querySelector('.assign-track-btn');
    assignBtn.disabled = selectedTracks.size === 0 || !selectedTrackId;
    assignBtn.textContent = selectedTracks.size > 0 ? 'Assign Music' : 'Select a track first';
}

async function toggleMusicSearch() {
    const overlay = document.getElementById('musicSearchOverlay');
    const isHidden = overlay.classList.contains('hidden');
    
    if (isHidden) {
        overlay.classList.remove('hidden');
        selectedTracks.clear();
        // Mostra loading enquanto busca
        const tracksList = document.getElementById('tracksList');
        tracksList.innerHTML = '<div class="loading-message">Loading tracks from server...</div>';
        await fetchTracks();
        updateSelectedTrackInfo();
        updateAssignButton();
    } else {
        overlay.classList.add('hidden');
    }
}

function closeMusicSearchOnOverlay(e) {
    if (e.target.id === 'musicSearchOverlay') {
        toggleMusicSearch();
    }
}

function updateSelectedTrackInfo() {
    const infoDiv = document.getElementById('selectedTrackInfo');
    if (selectedTrackId) {
        const tr = getCurrentTracks();
        const track = tr.find(t => t.id === selectedTrackId);
        if (track) {
            infoDiv.innerHTML = `
                <div class="selected-track-details">
                    <div class="selected-track-name">Selected: ${track.name}</div>
                    <div>Click a music below to assign it to this track</div>
                </div>
            `;
        }
    } else {
        infoDiv.innerHTML = `
            <div class="selected-track-details">
                <div class="selected-track-name">Browse available tracks</div>
                <div>Click on any track square and select "Add Music" to assign tracks</div>
            </div>
        `;
    }
}

function assignSelectedTrack() {
    if (selectedTracks.size === 0 || !selectedTrackId) return;

    const trackId = Array.from(selectedTracks)[0];
    const trackData = availableTracks.find(t => t.id === trackId);
    
    if (!trackData) return;

    const tr = getCurrentTracks();
    const track = tr.find(t => t.id === selectedTrackId);
    
    if (track) {
        track.name = trackData.title;
        track.trackData = trackData;
        updateWorkspaceTracks(tr);
        renderTracks();
        saveData();
    }

    toggleMusicSearch();
}

function searchTracks() {
    const searchTerm = document.getElementById('musicSearchInput').value;
    renderTracksList(searchTerm);
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.control-btn') && !e.target.closest('.popup')) document.getElementById('colorPicker').classList.add('hidden');
    if (!e.target.closest('.minimal-icon-btn') && !e.target.closest('.popup')) {
        document.getElementById('effectsPopup').classList.add('hidden');
        document.getElementById('soundsPopup').classList.add('hidden');
        document.getElementById('volumePopup').classList.add('hidden');
    }
    if (!e.target.closest('.mixer-btn') && !e.target.closest('#scalePicker')) document.getElementById('scalePicker').classList.add('hidden');
});

init();