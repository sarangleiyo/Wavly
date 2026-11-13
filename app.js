// Default Playlist (Curated hits na may working audio previews)
let playlist = [
    {
        id: "1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        mood: "Energy",
        durationText: "0:30",
        src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/36/41/27/3641276a-360d-88b1-5992-05461c3905cf/mza_10842795642436814041.plus.aac.p.m4a",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/74/d3/18/74d318e8-d65e-2b1b-967b-1361c47144e5/19UMGIM05610.rgb.jpg/600x600bb.jpg"
    },
    {
        id: "2",
        title: "Levitating",
        artist: "Dua Lipa",
        mood: "Chill",
        durationText: "0:30",
        src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/12/57/4a12574e-0a56-89d0-1c09-2b047f3df617/mza_11674997092928929783.plus.aac.p.m4a",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/55/e2/e8/55e2e8e6-1215-28b9-497b-3b60cd5e04b7/20UMGIM81561.rgb.jpg/600x600bb.jpg"
    },
    {
        id: "3",
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        mood: "Energy",
        durationText: "0:30",
        src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3b/bc/7b/3bbc7be7-b35e-c15c-37e1-80a56b40283e/mza_11438960132219717140.plus.aac.p.m4a",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/95/fb/6a/95fb6a6d-cb53-06a1-94ef-65d1b72e1268/21UMGIM56449.rgb.jpg/600x600bb.jpg"
    },
    {
        id: "4",
        title: "Yellow",
        artist: "Coldplay",
        mood: "Focus",
        durationText: "0:30",
        src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a4/6a/d0/a46ad07a-289b-8710-53e3-85f2658f8b8a/mza_15510619932174246995.plus.aac.p.m4a",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/5c/24/a65c24e6-8c43-91ee-016c-e2f7bb7c2bc3/06UMGIM13996.rgb.jpg/600x600bb.jpg"
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

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Render Home Screen Feeds
function renderSongs() {
    const filtered = activeMood === "All" 
        ? playlist 
        : playlist.filter(s => s.mood === activeMood);

    songListEl.innerHTML = '';
    filtered.forEach((song, idx) => {
        const realIndex = playlist.findIndex(item => item.id === song.id);
        const isCurrent = realIndex === currentIndex;

        const item = document.createElement('div');
        item.className = `song-item ${isCurrent ? 'playing' : ''}`;
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.mood || 'Preview'}</p>
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
    playingMoodLabel.textContent = song.mood || 'Live Search Preview';

    progressBar.value = 0;
    miniProgressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = song.durationText || '0:30';

    updateLikeUI();
    renderSongs();
}

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

audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        audioElement.currentTime = 0;
        playSong();
    } else {
        playNext();
    }
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-toggle', isShuffle);
    showToast(isShuffle ? "Shuffle ON" : "Shuffle OFF");
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active-toggle', isRepeat);
    showToast(isRepeat ? "Repeat ON" : "Repeat OFF");
});

function updateLikeUI() {
    const song = playlist[currentIndex];
    if (!song) return;
    const isLiked = likedIds.has(song.id);
    favBtn.classList.toggle('liked', isLiked);
    favBtn.querySelector('span').textContent = isLiked ? 'favorite' : 'favorite_border';
}

favBtn.addEventListener('click', () => {
    const song = playlist[currentIndex];
    if (likedIds.has(song.id)) {
        likedIds.delete(song.id);
        showToast("Removed from Liked");
    } else {
        likedIds.add(song.id);
        showToast(`Added to Liked Songs`);
    }
    updateLikeUI();
});

// Slider & Scrubber Fixes
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

function openSheet() { nowPlayingSheet.classList.add('active'); }
function closeSheet() { nowPlayingSheet.classList.remove('active'); }
openPlayerBtn.addEventListener('click', openSheet);
closePlayerBtn.addEventListener('click', closeSheet);

document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeMood = chip.dataset.mood;
        renderSongs();
    });
});

// Real-Time Online Search Integration (iTunes Music API for instant previews)
openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 150);
});
closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artista para maghanap...</p>';
    searchInput.focus();
});

let searchTimer;
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';

    clearTimeout(searchTimer);
    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artista para maghanap...</p>';
        return;
    }

    searchResults.innerHTML = '<p class="search-hint">Naghahanap sa cloud...</p>';

    searchTimer = setTimeout(async () => {
        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                searchResults.innerHTML = `<p class="search-hint">Walang nakitang kanta para sa "${query}"</p>`;
                return;
            }

            searchResults.innerHTML = '';
            data.results.forEach((item) => {
                const highResArtwork = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80';
                
                const songObj = {
                    id: String(item.trackId),
                    title: item.trackName,
                    artist: item.artistName,
                    mood: item.primaryGenreName || 'Preview',
                    durationText: '0:30',
                    src: item.previewUrl,
                    cover: highResArtwork
                };

                const row = document.createElement('div');
                row.className = 'song-item';
                row.innerHTML = `
                    <img src="${songObj.cover}" alt="${songObj.title}">
                    <div class="song-info">
                        <h4>${songObj.title}</h4>
                        <p>${songObj.artist} • ${songObj.mood}</p>
                    </div>
                `;

                row.addEventListener('click', () => {
                    // Idagdag sa unahan ng playlist para ma-play agad
                    playlist.unshift(songObj);
                    loadSong(0);
                    playSong();
                    searchOverlay.classList.remove('active');
                    openSheet();
                });

                searchResults.appendChild(row);
            });
        } catch (err) {
            console.error(err);
            searchResults.innerHTML = '<p class="search-hint">Nagka-error sa paghahanap. Subukan ulit.</p>';
        }
    }, 400);
});

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab !== 'home') {
            showToast(`${btn.dataset.tab.toUpperCase()} coming in Phase 2`);
        }
    });
});

document.getElementById('sheetDownloadBtn').addEventListener('click', () => showToast("Offline download coming in Phase 2!"));
document.getElementById('lyricsToggleBtn').addEventListener('click', () => showToast("Synced lyrics coming soon!"));

// Init
loadSong(0);
