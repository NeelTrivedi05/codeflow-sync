// CodeFlow Sync - Cross-browser compatible content script
console.log('CodeFlow Sync: Loaded');

let video = null;
let wasPlayingBeforeHide = false;

// ─── Video Discovery ───────────────────────────────────────────────
function findVideo() {
  // Direct query first
  video = document.querySelector('video');
  if (video) {
    console.log('CodeFlow Sync: Video found immediately');
    return;
  }

  // Poll for up to 15 seconds (handles slow page loads)
  let elapsed = 0;
  const poll = setInterval(() => {
    video = document.querySelector('video');
    elapsed += 500;
    if (video || elapsed >= 15000) {
      clearInterval(poll);
      if (video) console.log('CodeFlow Sync: Video found after', elapsed, 'ms');
    }
  }, 500);
}

// ─── Pause / Resume Helpers ───────────────────────────────────────
function pauseVideo() {
  // Re-query in case YouTube replaced the element (SPA navigation)
  if (!video || !video.isConnected) video = document.querySelector('video');
  if (video && !video.paused) {
    wasPlayingBeforeHide = true;
    video.pause();
    console.log('CodeFlow Sync: Paused');
  }
}

function resumeVideo() {
  if (!video || !video.isConnected) video = document.querySelector('video');
  if (video && wasPlayingBeforeHide && video.paused) {
    video.play().catch(err => console.log('CodeFlow Sync: Play blocked -', err));
    console.log('CodeFlow Sync: Resumed');
  }
  wasPlayingBeforeHide = false;
}

// ─── Strategy 1: Page Visibility API (most reliable) ─────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseVideo();
  else resumeVideo();
});

// ─── Strategy 2: window blur/focus (fallback for Comet / Brave) ──
// Some Chromium forks fire window events instead of visibilitychange
window.addEventListener('blur', () => {
  // Only pause if the document is actually leaving focus (not just a popup)
  setTimeout(() => {
    if (document.hidden || !document.hasFocus()) pauseVideo();
  }, 150);
});

window.addEventListener('focus', () => {
  resumeVideo();
});

// ─── Strategy 3: Polling guard (last resort) ──────────────────────
// Catches any edge-case where events are swallowed
let lastHidden = document.hidden;
setInterval(() => {
  const nowHidden = document.hidden;
  if (nowHidden !== lastHidden) {
    lastHidden = nowHidden;
    if (nowHidden) pauseVideo();
    else resumeVideo();
  }
}, 800);

// ─── YouTube SPA Navigation Handling ─────────────────────────────
// YouTube never fully reloads the page; video element changes on navigation.
function onYouTubeNavigate() {
  console.log('CodeFlow Sync: YouTube navigation detected, re-scanning for video');
  video = null;
  wasPlayingBeforeHide = false;
  setTimeout(findVideo, 1000); // Give YouTube time to mount the new player
}

// YouTube fires this custom event on client-side navigation
window.addEventListener('yt-navigate-finish', onYouTubeNavigate);

// MutationObserver as a backup for navigation detection
const navObserver = new MutationObserver(() => {
  if (!video || !video.isConnected) {
    const newVideo = document.querySelector('video');
    if (newVideo && newVideo !== video) {
      console.log('CodeFlow Sync: New video element detected');
      video = newVideo;
    }
  }
});
navObserver.observe(document.documentElement, { childList: true, subtree: true });

// ─── Init ──────────────────────────────────────────────────────────
findVideo();