// Sample playlist para masubukan agad ang UI at tugtog
const playlist = [
    {
        title: "Lofi Study Beats",
        artist: "Chillhop Music",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60"
    },
    {
        title: "Midnight City Vibe",
        artist: "Synthwave Radio",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60"
    },
    {
        title: "Sunset Drive",
        artist: "Retro Wave",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60"
    }
];

let currentIndex = 0;
const audioElement = document.getElementById('audioElement');

// DOM Elements
const songListEl = document.getElementById('songList');
const miniPlayer = document.getElementById('miniPlayer');
const miniImg = document.getElementById('miniImg');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const miniNextBtn = document.getElementById('miniNextBtn');

const nowPlayingSheet = document.getElementById('nowPlayingSheet');
const openPlayerBtn = document.getElementById('openPlayerBtn');
const closePlayerBtn = document.getElementById('closePlayerBtn');

const fullImg = document.getElementById('fullImg');
const blurBg = document.getElementById('blurBg');
const fullTitle = document.getElementById('fullTitle');
const fullArtist = document.getElementById('fullArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Render Song List
function renderSongList() {
    songListEl.innerHTML = '';
    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('song-item');
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;
        item.addEventListener('click', () => {
            loadSong(index);
            playSong();
            openSheet();
        });
        songListEl.appendChild(item);
    });
}

// Load Song
function loadSong(index) {
    currentIndex = index;
    const song = playlist[index];
    audioElement.src = song.src;
    miniImg.src = song.cover;
    fullImg.src = song.cover;
    blurBg.style.backgroundImage = `url(${song.cover})`;
    miniTitle.textContent = song.title;
    fullTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    fullArtist.textContent = song.artist;
}

function playSong() {
    audioElement.play();
    miniPlayBtn.querySelector('span').textContent = 'pause';
    playPauseBtn.querySelector('span').textContent = 'pause';
}

function pauseSong() {
    audioElement.pause();
    miniPlayBtn.querySelector('span').textContent = 'play_arrow';
    playPauseBtn.querySelector('span').textContent = 'play_arrow';
}

// Toggle Play/Pause
miniPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audioElement.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Next / Prev
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playSong();
});

miniNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playSong();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    playSong();
});

// Sheet Animation (Apple Music style up/down slide)
function openSheet() {
    nowPlayingSheet.classList.add('active');
}

function closeSheet() {
    nowPlayingSheet.classList.remove('active');
}

openPlayerBtn.addEventListener('click', openSheet);
closePlayerBtn.addEventListener('click', closeSheet);

// Progress Bar update
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioElement.currentTime);
        durationEl.textContent = formatTime(audioElement.duration);
    }
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initial Load
loadSong(0);
renderSongList();
