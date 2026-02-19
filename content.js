// CodeFlow Sync - Self-contained content script
console.log('CodeFlow Sync: Loaded');

let video = null;
let checkInterval = null;

// Wait for video to load
function findVideo() {
  checkInterval = setInterval(() => {
    video = document.querySelector('video');
    if (video) {
      console.log('Video found!');
      clearInterval(checkInterval);
      setupVisibilityListener();
    }
  }, 500);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

// Use Page Visibility API - more reliable than window focus
function setupVisibilityListener() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Tab is hidden (user switched to another tab or app)
      console.log('Tab hidden - pausing video');
      if (video && !video.paused) {
        video.pause();
        console.log('Video paused');
      }
    } else {
      // Tab is visible again
      console.log('Tab visible - resuming video');
      if (video && video.paused) {
        video.play().catch(err => console.log('Play error:', err));
        console.log('Video resumed');
      }
    }
  });

  console.log('Visibility listener ready');
}

// Start looking for video
findVideo();