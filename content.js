 // This runs on YouTube pages and controls the video player

console.log('CodeFlow Sync: Content script loaded on YouTube');

let player = null;
let wasPlayingBeforePause = false;

// Get YouTube's player instance
function getPlayer() {
  // Try to get the player from the page
  const video = document.querySelector('video');
  if (video) {
    return video;
  }
  return null;
}

// Wait for video to load
function waitForVideo() {
  const checkVideo = setInterval(() => {
    const video = document.querySelector('video');
    if (video) {
      console.log('Video element found!');
      player = video;
      clearInterval(checkVideo);
      chrome.runtime.sendMessage({action: "content_ready"});
    }
  }, 500);
  
  setTimeout(() => clearInterval(checkVideo), 10000);
}

waitForVideo();

// More aggressive pause that YouTube can't override
function forcePause() {
  const video = document.querySelector('video');
  if (!video) return false;
  
  wasPlayingBeforePause = !video.paused;
  
  // Pause the video
  video.pause();
  
  // Prevent YouTube from auto-resuming
  video.addEventListener('play', preventPlay);
  
  console.log('Video forcefully paused');
  return true;
}

// More aggressive play
function forcePlay() {
  const video = document.querySelector('video');
  if (!video) return false;
  
  // Remove the play prevention
  video.removeEventListener('play', preventPlay);
  
  // Only resume if it was playing before
  if (wasPlayingBeforePause) {
    video.play().catch(err => console.log('Play error:', err));
    console.log('Video resumed');
  }
  
  return true;
}

// Function to prevent YouTube from auto-playing
function preventPlay(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  const video = document.querySelector('video');
  if (video) {
    video.pause();
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.action === "pause") {
    const success = forcePause();
    sendResponse({success: success, action: 'paused'});
  } else if (message.action === "play") {
    const success = forcePlay();
    sendResponse({success: success, action: 'played'});
  } else if (message.action === "ping") {
    sendResponse({success: true, action: 'pong'});
  }
  
  return true;
});