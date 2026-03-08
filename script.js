// =========================================
// GEEKY ROMANCE - March 8th Web App
// Local MP3 Audio Player
// =========================================

const PASSCODE = '0803';

const LETTER_CONTENT = `Xin chào,

Nhân ngày 8/3, 
chúc tất cả các bạn nữ luôn xinh đẹp, 
vui vẻ và tràn đầy năng lượng tích cực. 
Mong rằng mỗi ngày của các bạn đều ngập tràn tiếng cười, 
luôn được yêu thương, trân trọng và gặp thật nhiều may mắn trong cuộc sống. 
Hãy luôn tự tin là chính mình và tỏa sáng theo cách riêng của mình nhé 💕

— Mãi yêu 🌸`;

const FLOATING_MESSAGES = [
  'Happy Women\'s Day 💕',
  '🌸', 'Ems - number one!',
  '💐', 'Yêu ems!',
  '🦋', 'Hạnh phúc mãi nhé!',
  '✨', '8/3 vui vẻ!',
  '🌷', '💕', '🌺',
  'Luôn xinh đẹp!', '🎀',
];

const PLAYLIST = [
  { title: 'Dành Cho Em', artist: 'Hoàng Tôn', src: 'asset/Dành Cho Em.mp3', label: '💕' },
  { title: 'Yêu Em Rất Nhiều', artist: 'Hoàng Tôn', src: 'asset/HOÀNG TÔN - YÊU EM RẤT NHIỀU (Lyrics Video).mp3', label: '🎵' },
  { title: 'Đừng Làm Trái Tim Anh Đau', artist: 'Sơn Tùng M-TP', src: 'asset/SƠN TÙNG M-TP  ĐỪNG LÀM TRÁI TIM ANH ĐAU  OFFICIAL MUSIC VIDEO.mp3', label: '💔' },
  { title: 'Hôn Vào Đây Đi', artist: 'VSTRA ft. hairan, antransax', src: 'asset/VSTRA - Hôn Vào Đây Đi (feat. hairan, antransax) (Official Audio) (Explicit).mp3', label: '💋' },
];

const GALLERY_EMOJIS = ['🌸', '🌺', '🌷', '💐', '🦋', '🌹', '💕', '✨', '🎀'];

// ==================
// PASSCODE LOGIC
// ==================
let inputCode = '';
const hearts = document.querySelectorAll('.heart');
const numpad = document.getElementById('numpad');

numpad.addEventListener('click', (e) => {
  const btn = e.target.closest('.num-btn');
  if (!btn || btn.classList.contains('empty')) return;

  if (btn.id === 'delete-btn') {
    if (inputCode.length > 0) {
      inputCode = inputCode.slice(0, -1);
      hearts[inputCode.length].classList.remove('filled');
      hearts[inputCode.length].textContent = '♡';
    }
    return;
  }

  const num = btn.dataset.num;
  if (inputCode.length >= 4) return;

  inputCode += num;
  const idx = inputCode.length - 1;
  hearts[idx].classList.add('filled');
  hearts[idx].textContent = '♥';

  if (inputCode.length === 4) {
    setTimeout(() => {
      if (inputCode === PASSCODE) {
        const screen = document.getElementById('passcode-screen');
        const dashboard = document.getElementById('dashboard');
        screen.classList.remove('active');
        setTimeout(() => dashboard.classList.add('active'), 350);
      } else {
        numpad.classList.add('shake');
        setTimeout(() => {
          numpad.classList.remove('shake');
          inputCode = '';
          hearts.forEach((h) => {
            h.classList.remove('filled');
            h.textContent = '♡';
          });
        }, 500);
      }
    }, 300);
  }
});

// ==================
// MODAL MANAGEMENT
// ==================
document.querySelectorAll('.menu-card').forEach((card) => {
  card.addEventListener('click', () => openModal(card.dataset.modal));
});

document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

function openModal(id) {
  document.getElementById(id).classList.add('active');
  if (id === 'letter-modal') startTypewriter();
  if (id === 'gift-modal') startGiftAnimation();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  if (id === 'gift-modal') stopGiftAnimation();
}

// ==================
// MUSIC PLAYER (HTML5 Audio)
// ==================
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const vinylDisc = document.getElementById('vinyl-disc');
const playlistItemsEl = document.getElementById('playlist-items');

let currentTrack = 0;
let isPlaying = false;

// Build playlist UI
PLAYLIST.forEach((song, i) => {
  const item = document.createElement('div');
  item.className = 'playlist-item' + (i === 0 ? ' active' : '');
  item.innerHTML = `
    <span class="pl-num">${i + 1}</span>
    <div class="pl-info">
      <div class="pl-title">${song.title}</div>
      <div class="pl-artist">${song.artist}</div>
    </div>`;
  item.addEventListener('click', () => {
    loadTrack(i);
    audio.play();
    isPlaying = true;
    togglePlayIcon(true);
    vinylDisc.classList.add('spinning');
  });
  playlistItemsEl.appendChild(item);
});

function loadTrack(index) {
  currentTrack = index;
  const song = PLAYLIST[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audio.src = song.src;
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent = '0:00';
  // Update vinyl label emoji
  document.querySelector('.vinyl-label').textContent = song.label || '🎵';
  // Update active playlist item
  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

// Init first track
loadTrack(0);

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    togglePlayIcon(false);
    vinylDisc.classList.remove('spinning');
  } else {
    audio.play();
    togglePlayIcon(true);
    vinylDisc.classList.add('spinning');
  }
  isPlaying = !isPlaying;
});

prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(currentTrack);
  if (isPlaying) {
    audio.play();
  }
});

nextBtn.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % PLAYLIST.length;
  loadTrack(currentTrack);
  audio.play();
  isPlaying = true;
  togglePlayIcon(true);
  vinylDisc.classList.add('spinning');
});

function togglePlayIcon(playing) {
  playBtn.querySelector('.icon-play').style.display = playing ? 'none' : 'block';
  playBtn.querySelector('.icon-pause').style.display = playing ? 'block' : 'none';
}

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener('ended', () => nextBtn.click());

progressBar.addEventListener('click', (e) => {
  if (audio.duration) {
    const rect = progressBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }
});

function formatTime(s) {
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

// ==================
// LETTER TYPEWRITER
// ==================
let typewriterInterval = null;
let letterIndex = 0;
let letterStarted = false;

function startTypewriter() {
  const body = document.getElementById('letter-body');
  if (letterStarted) return;
  letterStarted = true;
  body.innerHTML = '<span class="letter-cursor"></span>';
  letterIndex = 0;

  typewriterInterval = setInterval(() => {
    if (letterIndex < LETTER_CONTENT.length) {
      const cursor = body.querySelector('.letter-cursor');
      const char = LETTER_CONTENT[letterIndex];
      cursor.insertAdjacentHTML('beforebegin', char === '\n' ? '<br>' : char);
      letterIndex++;
      body.parentElement.scrollTop = body.parentElement.scrollHeight;
    } else {
      clearInterval(typewriterInterval);
      setTimeout(() => {
        const cursor = body.querySelector('.letter-cursor');
        if (cursor) cursor.remove();
      }, 2500);
    }
  }, 30);
}

// ==================
// GALLERY
// ==================
const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

GALLERY_EMOJIS.forEach((emoji) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.innerHTML = `<div class="gallery-placeholder">${emoji}</div>`;
  item.addEventListener('click', () => {
    lightboxImg.style.display = 'none';
    lightbox.querySelector('.lightbox-emoji')?.remove();
    const big = document.createElement('div');
    big.className = 'lightbox-emoji';
    big.style.cssText = 'font-size:120px;animation:lightbox-in 0.3s ease';
    big.textContent = emoji;
    lightbox.appendChild(big);
    lightbox.classList.add('active');
  });
  galleryGrid.appendChild(item);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.querySelector('.lightbox-emoji')?.remove();
}

// ==================
// GIFT - NIGHT SKY
// ==================
let giftInterval = null;
let giftStarted = false;

const GIFT_ITEMS = [
  '🌸', 'Happy Women\'s Day 💕', '💐', 'Luôn xinh đẹp!',
  '🦋', 'Yêu ems!', '✨', '8/3 vui vẻ!',
  '🌷', 'Hạnh phúc mãi!', '💕', 'Tỏa sáng nhé!',
  '🌺', 'Em number 1!', '🎀', 'Stay beautiful ✨',
  '💖', 'Luôn tự tin!', '🌹', 'Yêu thương! 💕',
  '🌻', 'Rạng rỡ nha!', '💝', 'Xinh xỉu! 🌸',
  '🌼', '🎉', '💗', '🌈', '💫', '🧸',
  '🍀', '🪻', '🩷', '🫶', '💮',
];

function startGiftAnimation() {
  if (giftStarted) return;
  giftStarted = true;

  const starsContainer = document.getElementById('stars-container');
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = (Math.random() * 3 + 1) + 'px';
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 70}%;
      width: ${size}; height: ${size};
      --twinkle-dur: ${1.5 + Math.random() * 3}s;
      --twinkle-delay: ${Math.random() * 4}s;
    `;
    starsContainer.appendChild(star);
  }

  let msgIndex = 0;
  const createMsg = () => {
    const container = document.getElementById('floating-messages');
    const content = GIFT_ITEMS[msgIndex % GIFT_ITEMS.length];
    const isEmoji = content.length <= 2;
    const msg = document.createElement('div');
    msg.className = isEmoji ? 'floating-msg floating-emoji' : 'floating-msg';
    msg.textContent = content;
    msg.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      --duration: ${5 + Math.random() * 5}s;
      --drift: ${Math.random() * 60 - 30}px;
      --rotate: ${Math.random() * 20 - 10}deg;
    `;
    container.appendChild(msg);
    msgIndex++;
    setTimeout(() => msg.remove(), 10000);
  };

  setTimeout(() => {
    createMsg();
    giftInterval = setInterval(createMsg, 500);
  }, 3500);
}

function stopGiftAnimation() {
  if (giftInterval) {
    clearInterval(giftInterval);
    giftInterval = null;
  }
}
