console.log('CodeFlow Sync: Service worker started');

// Find all YouTube tabs that have a video playing/loaded
async function getYouTubeTabs() {
    try {
        const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/*" });
        return tabs.filter(tab => tab.url && tab.url.includes("youtube.com/watch"));
    } catch (e) {
        console.error('CodeFlow Sync: Error querying tabs:', e);
        return [];
    }
}

// Directly pause the video on a tab using scripting API
async function pauseVideoOnTab(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                const video = document.querySelector('video');
                if (video && !video.paused) {
                    video.pause();
                    console.log('CodeFlow Sync: Video paused');
                    return true;
                }
                return false;
            }
        });
        console.log('CodeFlow Sync: Pause script executed on tab', tabId);
    } catch (e) {
        console.error('CodeFlow Sync: Failed to pause tab', tabId, e.message);
    }
}

// Directly play the video on a tab using scripting API
async function playVideoOnTab(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                const video = document.querySelector('video');
                if (video && video.paused) {
                    video.play().catch(() => { });
                    console.log('CodeFlow Sync: Video resumed');
                    return true;
                }
                return false;
            }
        });
        console.log('CodeFlow Sync: Play script executed on tab', tabId);
    } catch (e) {
        console.error('CodeFlow Sync: Failed to play tab', tabId, e.message);
    }
}

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    console.log('CodeFlow Sync: Focus changed to window', windowId);

    const ytTabs = await getYouTubeTabs();
    if (ytTabs.length === 0) {
        console.log('CodeFlow Sync: No YouTube video tabs open');
        return;
    }

    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // Chrome lost focus entirely (user switched to VS Code, etc.)
        console.log('CodeFlow Sync: Chrome lost focus - pausing', ytTabs.length, 'tab(s)');
        for (const tab of ytTabs) {
            await pauseVideoOnTab(tab.id);
        }
    } else {
        // Chrome regained focus
        console.log('CodeFlow Sync: Chrome gained focus - resuming', ytTabs.length, 'tab(s)');
        for (const tab of ytTabs) {
            await playVideoOnTab(tab.id);
        }
    }
});