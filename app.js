const OFFLINE_CACHE = 'wavly-offline-v2';
const STORAGE_KEY = 'wavly_downloaded_songs';

const defaultPlaylist = [
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

function getDownloadedSongs() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveDownloadedSongs(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let downloadedSongs = getDownloadedSongs();
let playlist = [...downloadedSongs];
defaultPlaylist.forEach(def => {
    if (!playlist.some(s => s.id === def.id)) {
        playlist.push(def);
    }
});

let currentIndex = 0;
let activeMood = "All";
let isShuffle = false;
let isRepeat = false;
let isSeeking = false;
const likedIds = new Set();

const audioElement = document.getElementById('audioElement');

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
const sheetDownloadBtn = document.getElementById('sheetDownloadBtn');
const offlineBadge = document.getElementById('offlineBadge');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

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
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function isSongDownloaded(songId) {
    return downloadedSongs.some(s => s.id === songId);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.mediaSession?.setActionHandler?.('play', playSong);
        navigator.mediaSession?.setActionHandler?.('pause', pauseSong);
        navigator.mediaSession?.setActionHandler?.('previoustrack', playPrev);
        navigator.mediaSession?.setActionHandler?.('nexttrack', playNext);
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

async function getLocalBlobUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch {
        return url;
    }
}

async function updateMediaSession(song) {
    if (!('mediaSession' in navigator)) return;
    try {
        const blobUrl = await getLocalBlobUrl(song.cover);
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: 'Wavly',
            artwork: [
                { src: blobUrl, sizes: '512x512', type: 'image/jpeg' },
                { src: blobUrl, sizes: '256x256', type: 'image/jpeg' }
            ]
        });
    } catch (e) {
        console.error(e);
    }
}

function updatePositionState() {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
        if (audioElement.duration && !isNaN(audioElement.duration)) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: audioElement.duration,
                    playbackRate: audioElement.playbackRate,
                    position: audioElement.currentTime
                });
            } catch {}
        }
    }
}

// Render Song List na may fixed ID matching para hindi magloko ang tap
function renderSongs() {
    let sourceList = playlist;
    if (activeMood === "Offline") {
        sourceList = downloadedSongs;
        document.getElementById('feedEyebrow').textContent = "SAVED ON DEVICE";
        document.getElementById('feedTitle').textContent = `Downloaded (${downloadedSongs.length})`;
    } else if (activeMood !== "All") {
        sourceList = playlist.filter(s => s.mood === activeMood);
        document.getElementById('feedEyebrow').textContent = "MOOD MIX";
        document.getElementById('feedTitle').textContent = activeMood;
    } else {
        document.getElementById('feedEyebrow').textContent = "CURATED HITS";
        document.getElementById('feedTitle').textContent = "Quick picks";
    }

    songListEl.innerHTML = '';

    if (sourceList.length === 0) {
        songListEl.innerHTML = `<p class="search-hint" style="margin: 20px 0;">Wala pang naka-download na kanta.</p>`;
    } else {
        sourceList.forEach((song) => {
            const realIndex = playlist.findIndex(item => item.id === song.id);
            const isCurrent = realIndex === currentIndex;
            const downloaded = isSongDownloaded(song.id);

            const item = document.createElement('div');
            item.className = `song-item ${isCurrent ? 'playing' : ''}`;
            item.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
                <div class="song-info">
                    <h4>${song.title} ${downloaded ? '✓' : ''}</h4>
                    <p>${song.artist} • ${downloaded ? 'Offline Ready' : (song.mood || 'Stream')}</p>
                </div>
                <span class="song-duration-tag">${song.durationText || '0:30'}</span>
            `;
            item.addEventListener('click', () => {
                loadSong(realIndex);
                playSong();
                openSheet();
            });
            songListEl.appendChild(item);
        });
    }

    carouselListEl.innerHTML = '';
    playlist.slice(0, 8).forEach((song, idx) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
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

function updateDownloadButtonUI(song) {
    const downloaded = isSongDownloaded(song.id);
    const iconSpan = sheetDownloadBtn.querySelector('span');
    if (downloaded) {
        iconSpan.textContent = 'download_done';
        sheetDownloadBtn.style.color = '#fa2d48';
        offlineBadge.textContent = 'OFFLINE SAVED';
        offlineBadge.style.color = '#ff7eb3';
    } else {
        iconSpan.textContent = 'download';
        sheetDownloadBtn.style.color = '#ffffff';
        offlineBadge.textContent = 'PREVIEW 30S';
        offlineBadge.style.color = 'rgba(255,255,255,0.85)';
    }
}

function loadSong(index) {
    currentIndex = index;
    const song = playlist[index];
    if (!song) return;

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
    playingMoodLabel.textContent = isSongDownloaded(song.id) ? 'Downloaded Offline' : (song.mood || 'Live Stream');

    progressBar.value = 0;
    miniProgressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = song.durationText || '0:30';

    updateLikeUI();
    updateDownloadButtonUI(song);
    updateMediaSession(song);
    renderSongs();
}

async function playSong() {
    try {
        await audioElement.play();
        miniPlayBtn.querySelector('span').textContent = 'pause';
        playPauseBtn.querySelector('span').textContent = 'pause';
        artworkContainer.classList.add('is-playing');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
            updateMediaSession(playlist[currentIndex]);
        }
    } catch (err) {
        console.error(err);
        showToast("Pindutin ulit ang Play");
    }
}

function pauseSong() {
    audioElement.pause();
    miniPlayBtn.querySelector('span').textContent = 'play_arrow';
    playPauseBtn.querySelector('span').textContent = 'play_arrow';
    artworkContainer.classList.remove('is-playing');
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
    }
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
        showToast("Added to Liked");
    }
    updateLikeUI();
});

sheetDownloadBtn.addEventListener('click', async () => {
    const song = playlist[currentIndex];
    if (!song || !song.src) return;

    if (isSongDownloaded(song.id)) {
        showToast("Naka-save na offline!");
        return;
    }

    showToast(`Nagda-download: "${song.title}"...`);

    try {
        const cache = await caches.open(OFFLINE_CACHE);
        const audioRes = await fetch(song.src, { mode: 'no-cors' });
        await cache.put(song.src, audioRes);
        downloadedSongs.unshift(song);
        saveDownloadedSongs(downloadedSongs);
        updateDownloadButtonUI(song);
        renderSongs();
        showToast(`Na-save offline: "${song.title}" ✓`);
    } catch {
        showToast("Hindi ma-download.");
    }
});

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
        updatePositionState();
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
        updatePositionState();
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

openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 150);
});
closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artista...</p>';
    searchInput.focus();
});

let searchTimer;
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';

    clearTimeout(searchTimer);
    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artista...</p>';
        return;
    }

    searchResults.innerHTML = '<p class="search-hint">Naghahanap...</p>';

    searchTimer = setTimeout(async () => {
        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                searchResults.innerHTML = `<p class="search-hint">Walang nakitang kanta.</p>`;
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
                    <img src="${songObj.cover}" alt="${songObj.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
                    <div class="song-info">
                        <h4>${songObj.title}</h4>
                        <p>${songObj.artist} • ${songObj.mood}</p>
                    </div>
                `;

                row.addEventListener('click', () => {
                    const existingIdx = playlist.findIndex(s => s.id === songObj.id);
                    if (existingIdx !== -1) {
                        loadSong(existingIdx);
                    } else {
                        playlist.unshift(songObj);
                        loadSong(0);
                    }
                    playSong();
                    searchOverlay.classList.remove('active');
                    openSheet();
                });

                searchResults.appendChild(row);
            });
        } catch {
            searchResults.innerHTML = '<p class="search-hint">May error sa paghahanap.</p>';
        }
    }, 400);
});

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.tab === 'library') {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            document.querySelector('.chip[data-mood="Offline"]').classList.add('active');
            activeMood = "Offline";
            renderSongs();
        } else if (btn.dataset.tab === 'home') {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            document.querySelector('.chip[data-mood="All"]').classList.add('active');
            activeMood = "All";
            renderSongs();
        }
    });
});

loadSong(0);
