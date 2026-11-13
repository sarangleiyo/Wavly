// Reliable CORS-friendly royalty-free MP3 tracks para guaranteed ang tugtog at slider seeking
const playlist = [
    {
        id: 1,
        title: "Midnight Echoes",
        artist: "Wavly Sessions",
        mood: "Night Drive",
        durationText: "2:14",
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        title: "Lofi Rain & Coffee",
        artist: "Kyoto Beats",
        mood: "Chill",
        durationText: "2:42",
        src: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d1718ab41b.mp3",
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        title: "Neon Horizon",
        artist: "Synthwave Collective",
        mood: "Energy",
        durationText: "2:28",
        src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        title: "Deep Focus Flow",
        artist: "Ambient Lab",
        mood: "Focus",
        durationText: "3:05",
        src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
        cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        title: "Velvet Sunset",
        artist: "R&B Soul",
        mood: "Chill",
        durationText: "2:19",
        src: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc6eb4c.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80"
    }
];

let currentIndex = 0;
let activeMood = "All";
let isShuffle = false;
let isRepeat = false;
let isSeeking = false;
const likedIds = new Set();

const audioElement = document.getElementById('audioElement');

// DOM Elements
const songListEl = document.getElementById('songList');
const carouselListEl = document.getElementById('carouselList');
const miniImg = document.getElementById('miniImg');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const miniNextBtn = document.getElementById('miniNextBtn');
const miniProgressFill = document.getElementById('miniProgressFill');

const nowPlayingSheet = document.getElementById('nowPlayingSheet');
const openPlayerBtn = document.getElementById('openPlayerBtn');
const closePlayerBtn = document.getElementById('closePlayerBtn');

const fullImg = document.getElementById('fullImg');
const blurBg = document.getElementById('blurBg');
const blurBgSecondary = document.getElementById('blurBgSecondary');
const artworkContainer = document.getElementById('artworkContainer');
const fullTitle = document.getElementById('fullTitle');
const fullArtist = document.getElementById('fullArtist');
const playingMoodLabel = document.getElementById('playingMoodLabel');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const favBtn = document.getElementById('favBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Search Elements
const openSearchBtn = document.getElementById('openSearchBtn');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchResults = document.getElementById('searchResults');

// Toast Helper
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Render Song List & Carousel
function renderSongs() {
    const filtered = activeMood === "All" 
        ? playlist 
        : playlist.filter(s => s.mood === activeMood);

    songListEl.innerHTML = '';
    filtered.forEach((song) => {
        const realIndex = playlist.findIndex(item => item.id === song.id);
        const isCurrent = realIndex === currentIndex;

        const item = document.createElement('div');
        item.className = `song-item ${isCurrent ? 'playing' : ''}`;
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.mood}</p>
            </div>
            <span class="song-duration-tag">${song.durationText}</span>
        `;
        item.addEventListener('click', () => {
            loadSong(realIndex);
            playSong();
            openSheet();
        });
        songListEl.appendChild(item);
    });

    // Horizontal Carousel
    carouselListEl.innerHTML = '';
    playlist.forEach((song, idx) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;
        card.addEventListener('click', () => {
            loadSong(idx);
            playSong();
        });
        carouselListEl.appendChild(card);
    });
}

// Load Track
function loadSong(index) {
    currentIndex = index;
    const song = playlist[index];
    audioElement.src = song.src;
    audioElement.load();

    miniImg.src = song.cover;
    fullImg.src = song.cover;
    blurBg.style.backgroundImage = `url(${song.cover})`;
    blurBgSecondary.style.backgroundImage = `url(${song.cover})`;

    miniTitle.textContent = song.title;
    fullTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    fullArtist.textContent = song.artist;
    playingMoodLabel.textContent = song.mood;

    progressBar.value = 0;
    miniProgressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = song.durationText;

    updateLikeUI();
    renderSongs();
}

// Play / Pause with Error Handling
async function playSong() {
    try {
        await audioElement.play();
        miniPlayBtn.querySelector('span').textContent = 'pause';
        playPauseBtn.querySelector('span').textContent = 'pause';
        artworkContainer.classList.add('is-playing');
    } catch (err) {
        console.error("Playback error:", err);
        showToast("Tap play again to start audio");
    }
}

function pauseSong() {
    audioElement.pause();
    miniPlayBtn.querySelector('span').textContent = 'play_arrow';
    playPauseBtn.querySelector('span').textContent = 'play_arrow';
    artworkContainer.classList.remove('is-playing');
}

function togglePlayPause() {
    if (audioElement.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

miniPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
});

playPauseBtn.addEventListener('click', togglePlayPause);

document.getElementById('heroPlayBtn').addEventListener('click', () => {
    loadSong(0);
    playSong();
    openSheet();
});

// Next & Previous
function playNext() {
    if (isShuffle) {
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * playlist.length);
        } while (nextIdx === currentIndex && playlist.length > 1);
        currentIndex = nextIdx;
    } else {
        currentIndex = (currentIndex + 1) % playlist.length;
    }
    loadSong(currentIndex);
    playSong();
}

function playPrev() {
    if (audioElement.currentTime > 3) {
        audioElement.currentTime = 0;
        return;
    }
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    playSong();
}

nextBtn.addEventListener('click', playNext);
miniNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playNext();
});
prevBtn.addEventListener('click', playPrev);

// Auto-next when song ends
audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        audioElement.currentTime = 0;
        playSong();
    } else {
        playNext();
    }
});

// Shuffle & Repeat Toggles
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-toggle', isShuffle);
    showToast(isShuffle ? "Shuffle ON" : "Shuffle OFF");
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active-toggle', isRepeat);
    showToast(isRepeat ? "Repeat Song ON" : "Repeat OFF");
});

// Like Button
function updateLikeUI() {
    const songId = playlist[currentIndex].id;
    const isLiked = likedIds.has(songId);
    favBtn.classList.toggle('liked', isLiked);
    favBtn.querySelector('span').textContent = isLiked ? 'favorite' : 'favorite_border';
}

favBtn.addEventListener('click', () => {
    const song = playlist[currentIndex];
    if (likedIds.has(song.id)) {
        likedIds.delete(song.id);
        showToast("Removed from Liked Songs");
    } else {
        likedIds.add(song.id);
        showToast(`Added "${song.title}" to Liked`);
    }
    updateLikeUI();
});

// Working Slider / Scrubber (Desktop + Mobile Touch Support)
progressBar.addEventListener('mousedown', () => isSeeking = true);
progressBar.addEventListener('touchstart', () => isSeeking = true, { passive: true });

progressBar.addEventListener('input', () => {
    if (audioElement.duration) {
        const seekTime = (progressBar.value / 100) * audioElement.duration;
        currentTimeEl.textContent = formatTime(seekTime);
    }
});

progressBar.addEventListener('change', () => {
    if (audioElement.duration) {
        audioElement.currentTime = (progressBar.value / 100) * audioElement.duration;
    }
    isSeeking = false;
});

audioElement.addEventListener('timeupdate', () => {
    if (!isSeeking && audioElement.duration) {
        const pct = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = pct;
        miniProgressFill.style.width = `${pct}%`;
        currentTimeEl.textContent = formatTime(audioElement.currentTime);
        durationEl.textContent = formatTime(audioElement.duration);
    }
});

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Sheet Controls
function openSheet() {
    nowPlayingSheet.classList.add('active');
}
function closeSheet() {
    nowPlayingSheet.classList.remove('active');
}
openPlayerBtn.addEventListener('click', openSheet);
closePlayerBtn.addEventListener('click', closeSheet);

// Mood Chips Filter
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeMood = chip.dataset.mood;
        renderSongs();
    });
});

// Working Search Overlay
openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 150);
});

closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResults.innerHTML = '<p class="search-hint">Type a song title or artist name...</p>';
    searchInput.focus();
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = query ? 'flex' : 'none';

    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Type a song title or artist name...</p>';
        return;
    }

    const matches = playlist.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query) ||
        s.mood.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        searchResults.innerHTML = `<p class="search-hint">No tracks found for "${e.target.value}"</p>`;
        return;
    }

    searchResults.innerHTML = '';
    matches.forEach(song => {
        const realIndex = playlist.findIndex(item => item.id === song.id);
        const row = document.createElement('div');
        row.className = 'song-item';
        row.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.mood}</p>
            </div>
        `;
        row.addEventListener('click', () => {
            loadSong(realIndex);
            playSong();
            searchOverlay.classList.remove('active');
            openSheet();
        });
        searchResults.appendChild(row);
    });
});

// Bottom Navigation Feedback
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab !== 'home') {
            showToast(`${btn.dataset.tab.toUpperCase()} view ready for Phase 2`);
        }
    });
});

// Placeholder feedback for Phase 2 buttons
document.getElementById('sheetDownloadBtn').addEventListener('click', () => {
    showToast("Offline download coming in Phase 2!");
});

document.getElementById('lyricsToggleBtn').addEventListener('click', () => {
    showToast("Synced lyrics coming soon!");
});

// Init
loadSong(0);
