const STORAGE_KEY = 'wavly_playlists_v1';

// Mga Curated Playlist Cards ala-Spotify na may sari-sariling mga kanta
const curatedPlaylists = [
    {
        id: 'playlist_chill_80s',
        name: '80s/90s, Chill & OPM',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        description: 'Relaxing classic vibes & OPM hits',
        songs: [
            { id: "c1", title: "Yellow", artist: "Coldplay", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a4/6a/d0/a46ad07a-289b-8710-53e3-85f2658f8b8a/mza_15510619932174246995.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80" },
            { id: "c2", title: "Bawat Piyesa", artist: "Munimuni", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/12/57/4a12574e-0a56-89d0-1c09-2b047f3df617/mza_11674997092928929783.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80" }
        ]
    },
    {
        id: 'playlist_tagalog_rap',
        name: 'New Tagalog Rap 2026',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        description: 'Hev Abi, Flow G, Al James & more',
        songs: [
            { id: "r1", title: "Alam Mo Ba Girl", artist: "Hev Abi", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/36/41/27/3641276a-360d-88b1-5992-05461c3905cf/mza_10842795642436814041.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" },
            { id: "r2", title: "Gusto", artist: "Zack Tabudlo & Al James", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/12/57/4a12574e-0a56-89d0-1c09-2b047f3df617/mza_11674997092928929783.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80" },
            { id: "r3", title: "Ilang Taon Na Ba", artist: "Flow G", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3b/bc/7b/3bbc7be7-b35e-c15c-37e1-80a56b40283e/mza_11438960132219717140.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80" }
        ]
    },
    {
        id: 'playlist_global_hits',
        name: 'Global Release Radar',
        cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
        description: 'The Weeknd, Dua Lipa, Justin Bieber',
        songs: [
            { id: "gh1", title: "Blinding Lights", artist: "The Weeknd", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/36/41/27/3641276a-360d-88b1-5992-05461c3905cf/mza_10842795642436814041.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80" },
            { id: "gh2", title: "Levitating", artist: "Dua Lipa", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/12/57/4a12574e-0a56-89d0-1c09-2b047f3df617/mza_11674997092928929783.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80" },
            { id: "gh3", title: "Stay", artist: "The Kid LAROI & Justin Bieber", durationText: "0:30", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3b/bc/7b/3bbc7be7-b35e-c15c-37e1-80a56b40283e/mza_11438960132219717140.plus.aac.p.m4a", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" }
        ]
    }
];

function getStoredPlaylists() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && saved.length > 0) return saved;
    } catch {}

    return [
        {
            id: "offline-downloads",
            name: "Offline Downloads 📥",
            songs: []
        }
    ];
}

function savePlaylists(lists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

let playlists = getStoredPlaylists();
let activeView = "home"; // 'home', 'curated_detail', o 'library'
let currentActivePlaylist = null;

let playlist = [...curatedPlaylists[0].songs];
let currentIndex = 0;
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
    const offlineList = playlists.find(p => p.id === "offline-downloads");
    return offlineList ? offlineList.songs.some(s => s.id === songId) : false;
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

async function updateMediaSession(song) {
    if (!('mediaSession' in navigator)) return;
    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: 'Wavly Spotify Style',
            artwork: [
                { src: song.cover, sizes: '512x512', type: 'image/jpeg' },
                { src: song.cover, sizes: '256x256', type: 'image/jpeg' }
            ]
        });
    } catch {}
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

// Render Spotify-Style Home View (Grid/Cards sa taas)
function renderSongs() {
    songListEl.innerHTML = '';

    if (activeView === "home") {
        document.getElementById('feedEyebrow').textContent = "GOOD EVENING";
        document.getElementById('feedTitle').textContent = "Featured Playlists";

        // Spotify-style 2-column grid cards para sa mga playlists
        let gridHtml = `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">`;
        curatedPlaylists.forEach(cp => {
            gridHtml += `
                <div class="spotify-card" data-id="${cp.id}" style="background: rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background 0.2s;">
                    <img src="${cp.cover}" alt="${cp.name}" style="width: 56px; height: 56px; object-fit: cover;" referrerpolicy="no-referrer" crossorigin="anonymous">
                    <span style="font-size: 13px; font-weight: 700; color: #fff; padding-right: 8px; line-height: 1.2;">${cp.name}</span>
                </div>
            `;
        });
        gridHtml += `</div>`;

        // Section header para sa pinakabagong kanta
        gridHtml += `<h3 style="font-size: 18px; font-weight: 800; margin-bottom: 12px;">It's New Music Friday!</h3>`;

        songListEl.innerHTML = gridHtml;

        // Ipakita ang lahat ng default songs sa carousel / list
        carouselListEl.innerHTML = '';
        curatedPlaylists.forEach(cp => {
            cp.songs.forEach((song, idx) => {
                const card = document.createElement('div');
                card.className = 'carousel-card';
                card.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                `;
                card.addEventListener('click', () => {
                    playlist = cp.songs;
                    loadSong(idx);
                    playSong();
                    openSheet();
                });
                carouselListEl.appendChild(card);
            });
        });

        // Pag pinindot ang Spotify card sa taas, bubukas ang playlist na yun
        document.querySelectorAll('.spotify-card').forEach(card => {
            card.addEventListener('click', () => {
                const cpId = card.dataset.id;
                openCuratedPlaylistView(cpId);
            });
        });

    } else if (activeView === "curated_detail") {
        // Kapag pinasok ang loob ng isang curated playlist card (parang Spotify album view)
        document.getElementById('feedEyebrow').textContent = currentActivePlaylist.description.toUpperCase();
        document.getElementById('feedTitle').textContent = currentActivePlaylist.name;

        let htmlMarkup = `
            <button id="backHomeBtn" style="margin-bottom: 14px; padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; font-size: 12px; font-weight: 600;">← Back to Home</button>
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${currentActivePlaylist.cover}" alt="Cover" style="width: 140px; height: 140px; border-radius: 16px; object-fit: cover; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <h3 style="font-size: 20px; font-weight: 800; margin-top: 10px;">${currentActivePlaylist.name}</h3>
                <p style="font-size: 13px; color: rgba(255,255,255,0.6);">${currentActivePlaylist.songs.length} songs available</p>
            </div>
        `;

        currentActivePlaylist.songs.forEach((song, idx) => {
            const isCurrent = (playlist[currentIndex]?.id === song.id);
            const downloaded = isSongDownloaded(song.id);

            htmlMarkup += `
                <div class="song-item ${isCurrent ? 'playing' : ''}" data-index="${idx}">
                    <img src="${song.cover}" alt="${song.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
                    <div class="song-info">
                        <h4>${song.title} ${downloaded ? '✓' : ''}</h4>
                        <p>${song.artist}</p>
                    </div>
                    <span class="song-duration-tag">${song.durationText}</span>
                </div>
            `;
        });

        songListEl.innerHTML = htmlMarkup;
        carouselListEl.innerHTML = '';

        document.getElementById('backHomeBtn').addEventListener('click', () => {
            activeView = "home";
            renderSongs();
        });

        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                playlist = currentActivePlaylist.songs;
                loadSong(idx);
                playSong();
                openSheet();
            });
        });

    } else {
        // Library / User Playlists View
        document.getElementById('feedEyebrow').textContent = "MY LIBRARY";
        document.getElementById('feedTitle').textContent = "Your Playlists";

        let htmlContent = `
            <div style="margin-bottom: 16px;">
                <button id="createPlaylistBtn" style="width: 100%; padding: 12px; border-radius: 14px; background: rgba(250,45,72,0.15); border: 1px solid rgba(250,45,72,0.4); color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span class="material-icons-round">add</span> Create New Playlist
                </button>
            </div>
        `;

        playlists.forEach(list => {
            htmlContent += `
                <div class="playlist-folder-card" data-id="${list.id}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 16px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 3px;">${list.name}</h4>
                        <p style="font-size: 12px; color: rgba(255,255,255,0.6);">${list.songs.length} saved songs</p>
                    </div>
                    <span class="material-icons-round" style="color: rgba(255,255,255,0.5);">chevron_right</span>
                </div>
            `;
        });

        songListEl.innerHTML = htmlContent;
        carouselListEl.innerHTML = '';

        document.getElementById('createPlaylistBtn').addEventListener('click', () => {
            const playlistName = prompt("Ilagay ang pangalan ng bagong playlist:");
            if (playlistName && playlistName.trim() !== "") {
                const newList = {
                    id: 'playlist_' + Date.now(),
                    name: playlistName.trim(),
                    songs: []
                };
                playlists.push(newList);
                savePlaylists(playlists);
                renderSongs();
                showToast(`Nagawa na ang playlist na "${newList.name}"!`);
            }
        });

        document.querySelectorAll('.playlist-folder-card').forEach(card => {
            card.addEventListener('click', () => {
                const listId = card.dataset.id;
                openUserPlaylistModal(listId);
            });
        });
    }
}

function openCuratedPlaylistView(cpId) {
    const found = curatedPlaylists.find(p => p.id === cpId);
    if (!found) return;
    currentActivePlaylist = found;
    activeView = "curated_detail";
    renderSongs();
}

function openUserPlaylistModal(listId) {
    const targetList = playlists.find(p => p.id === listId);
    if (!targetList) return;

    playlist = targetList.songs;
    currentIndex = 0;

    document.getElementById('feedEyebrow').textContent = targetList.name.toUpperCase();
    document.getElementById('feedTitle').textContent = targetList.name;

    if (playlist.length === 0) {
        songListEl.innerHTML = `
            <p class="search-hint" style="margin: 20px 0;">Wala pang kanta dito. Mag-search at i-save ang kanta papunta sa playlist na ito!</p>
            <button id="backToLibBtn" style="padding: 8px 16px; border-radius: 10px; background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer;">← Bumalik sa Library</button>
        `;
        document.getElementById('backToLibBtn').addEventListener('click', () => {
            activeView = "library";
            renderSongs();
        });
        return;
    }

    songListEl.innerHTML = `<button id="backToLibBtn" style="margin-bottom: 12px; padding: 6px 12px; border-radius: 8px; background: rgba(255,255,255,0.08); border: none; color: #fff; cursor: pointer; font-size: 12px;">← Balik sa Playlists</button>`;
    document.getElementById('backToLibBtn').addEventListener('click', () => {
        activeView = "library";
        renderSongs();
    });

    playlist.forEach((song, idx) => {
        const item = document.createElement('div');
        item.className = `song-item`;
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" referrerpolicy="no-referrer" crossorigin="anonymous">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <button class="remove-song-btn" data-id="${song.id}" style="background:none; border:none; color: #fa2d48; cursor:pointer; padding: 6px;">
                <span class="material-icons-round">delete</span>
            </button>
        `;
        item.addEventListener('click', () => {
            loadSong(idx);
            playSong();
            openSheet();
        });
        item.querySelector('.remove-song-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            targetList.songs = targetList.songs.filter(s => s.id !== song.id);
            savePlaylists(playlists);
            openUserPlaylistModal(listId);
            showToast("Tinanggal ang kanta sa playlist.");
        });
        songListEl.appendChild(item);
    });
}

function updateDownloadButtonUI(song) {
    const downloaded = isSongDownloaded(song.id);
    const iconSpan = sheetDownloadBtn.querySelector('span');
    if (downloaded) {
        iconSpan.textContent = 'playlist_add_check';
        sheetDownloadBtn.style.color = '#fa2d48';
        offlineBadge.textContent = 'SAVED OFFLINE';
        offlineBadge.style.color = '#ff7eb3';
    } else {
        iconSpan.textContent = 'playlist_add';
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
    playingMoodLabel.textContent = isSongDownloaded(song.id) ? 'Offline Ready' : 'Spotify Playlist Stream';

    progressBar.value = 0;
    miniProgressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = song.durationText || '0:30';

    updateLikeUI();
    updateDownloadButtonUI(song);
    updateMediaSession(song);
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
    playlist = curatedPlaylists[0].songs;
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

sheetDownloadBtn.addEventListener('click', () => {
    const song = playlist[currentIndex];
    if (!song) return;

    let playlistNames = playlists.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n');
    let choice = prompt(`Piliin ang playlist kung saan mo gustong i-save:\n\n${playlistNames}\n\n(Mag-type ng numero o pangalan ng bagong playlist)`);

    if (!choice) return;

    let targetList;
    const choiceNum = parseInt(choice);
    if (!isNaN(choiceNum) && choiceNum > 0 && choiceNum <= playlists.length) {
        targetList = playlists[choiceNum - 1];
    } else {
        targetList = {
            id: 'playlist_' + Date.now(),
            name: choice.trim(),
            songs: []
        };
        playlists.push(targetList);
    }

    if (!targetList.songs.some(s => s.id === song.id)) {
        targetList.songs.push(song);
        savePlaylists(playlists);
        updateDownloadButtonUI(song);
        showToast(`Na-save sa "${targetList.name}" ✓`);
    } else {
        showToast(`Nasa "${targetList.name}" na ang kantang ito.`);
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

openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 150);
});
closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artist...</p>';
    searchInput.focus();
});

let searchTimer;
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';

    clearTimeout(searchTimer);
    if (!query) {
        searchResults.innerHTML = '<p class="search-hint">Mag-type ng kanta o artist...</p>';
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
                        <p>${songObj.artist}</p>
                    </div>
                `;

                row.addEventListener('click', () => {
                    playlist = [songObj, ...playlist];
                    loadSong(0);
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
            activeView = "library";
            renderSongs();
        } else if (btn.dataset.tab === 'home') {
            activeView = "home";
            renderSongs();
        } else {
            showToast("Explore mixes coming soon!");
        }
    });
});

document.getElementById('lyricsToggleBtn').addEventListener('click', () => showToast("Synced lyrics coming soon!"));

// Init
playlist = [...curatedPlaylists[0].songs];
loadSong(0);
renderSongs();
