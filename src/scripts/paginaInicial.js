// Dados de exemplo
const musicas = [
  {
    id: 1,
    titulo: "Summer Vibes",
    artista: "DJ Sunshine",
    duracao: "3:45",
    emoji: "☀️",
  },
  {
    id: 2,
    titulo: "Night Dreams",
    artista: "Luna Bass",
    duracao: "4:12",
    emoji: "🌙",
  },
  {
    id: 3,
    titulo: "Electric Soul",
    artista: "Neon Beats",
    duracao: "3:28",
    emoji: "⚡",
  },
  {
    id: 4,
    titulo: "Ocean Waves",
    artista: "Aqua Sound",
    duracao: "5:03",
    emoji: "🌊",
  },
  {
    id: 5,
    titulo: "Fire Dance",
    artista: "Blaze DJ",
    duracao: "3:56",
    emoji: "🔥",
  },
  {
    id: 6,
    titulo: "Mountain Echo",
    artista: "Peak Sounds",
    duracao: "4:35",
    emoji: "⛰️",
  },
  {
    id: 7,
    titulo: "Cosmic Journey",
    artista: "Star Dust",
    duracao: "6:18",
    emoji: "🌟",
  },
  {
    id: 8,
    titulo: "Urban Rhythm",
    artista: "City Beats",
    duracao: "3:22",
    emoji: "🏙️",
  },
  {
    id: 9,
    titulo: "Forest Whisper",
    artista: "Nature Mix",
    duracao: "4:47",
    emoji: "🌲",
  },
  {
    id: 10,
    titulo: "Desert Storm",
    artista: "Sand Waves",
    duracao: "3:39",
    emoji: "🏜️",
  },
  {
    id: 11,
    titulo: "Rainbow Melody",
    artista: "Color Sound",
    duracao: "4:01",
    emoji: "🌈",
  },
  {
    id: 12,
    titulo: "Winter Chill",
    artista: "Ice Beats",
    duracao: "3:54",
    emoji: "❄️",
  },
  {
    id: 13,
    titulo: "Tropical Heat",
    artista: "Palm Groove",
    duracao: "4:28",
    emoji: "🌴",
  },
  {
    id: 14,
    titulo: "Midnight Jazz",
    artista: "Smooth Notes",
    duracao: "5:42",
    emoji: "🎷",
  },
  {
    id: 15,
    titulo: "Spring Bloom",
    artista: "Flower Power",
    duracao: "3:33",
    emoji: "🌸",
  },
];

let musicasFiltradas = [...musicas];

function renderMusicList() {
  const musicList = document.getElementById("musicList");
  const musicGrid = document.getElementById("musicGrid");
  const noResults = document.getElementById("noResults");
  const musicCount = document.getElementById("musicCount");

  if (musicasFiltradas.length === 0) {
    musicList.innerHTML = "";
    musicGrid.innerHTML = "";
    noResults.style.display = "block";
    musicCount.textContent = "0 músicas";
    return;
  }

  noResults.style.display = "none";
  musicCount.textContent = `${musicasFiltradas.length} música${
    musicasFiltradas.length !== 1 ? "s" : ""
  }`;

  // Renderizar lista mobile
  musicList.innerHTML = musicasFiltradas
    .map(
      (musica) => `
                <div class="music-item" onclick="abrirEditor(${musica.id})">
                    <div class="music-cover">${musica.emoji}</div>
                    <div class="music-info">
                        <div class="music-title">${musica.titulo}</div>
                        <div class="music-artist">${musica.artista}</div>
                    </div>
                    <div class="music-duration">${musica.duracao}</div>
                </div>
            `
    )
    .join("");

  // Renderizar grid desktop
  musicGrid.innerHTML = musicasFiltradas
    .map(
      (musica) => `
                <div class="music-card" onclick="abrirEditor(${musica.id})">
                    <div class="card-cover">${musica.emoji}</div>
                    <div class="card-info">
                        <div class="card-title">${musica.titulo}</div>
                        <div class="card-artist">${musica.artista}</div>
                        <div class="card-duration">${musica.duracao}</div>
                    </div>
                </div>
            `
    )
    .join("");
}

function abrirEditor(id) {
  const musica = musicas.find((m) => m.id === id);
  console.log("Abrindo editor para:", musica);
  // Aqui você redirecionaria para a página do editor
  alert(`Abrindo editor para: ${musica.titulo} - ${musica.artista}`);
}

// Busca
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();

  musicasFiltradas = musicas.filter(
    (musica) =>
      musica.titulo.toLowerCase().includes(termo) ||
      musica.artista.toLowerCase().includes(termo)
  );

  renderMusicList();
});

// Renderizar inicial
renderMusicList();
