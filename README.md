# CodeFlow Sync

**Auto-pause YouTube tutorials when you switch to your code editor.**

CodeFlow Sync is a lightweight Chrome extension built for developers who learn by watching YouTube tutorials while coding. It automatically **pauses** the video when you switch away from the YouTube tab (e.g., to VS Code) and **resumes** playback when you return — so you never miss a beat.

---

## ✨ Features

- ▶️ **Auto-Pause** — YouTube video pauses instantly when you switch tabs or apps.
- ⏯️ **Auto-Resume** — Video resumes seamlessly when you return to the YouTube tab.
- ⚡ **Zero Configuration** — Install and forget. No setup, no buttons, no UI needed.
- 🪶 **Lightweight** — Minimal footprint with no external dependencies.
- 🔒 **Privacy-Focused** — No data collection. Runs entirely in your browser.

---

## 🛠️ How It Works

CodeFlow Sync uses the browser's **Page Visibility API** to detect when the YouTube tab becomes hidden or visible:

1. A **content script** (`content.js`) is injected into YouTube pages.
2. It waits for the `<video>` element to load, then listens for `visibilitychange` events.
3. When the tab is **hidden** → the video is paused.
4. When the tab is **visible** again → the video resumes playback.

A minimal **background service worker** (`background.js`) keeps the extension lifecycle active.

---

## 📦 Installation

Since this extension is not published on the Chrome Web Store, you can install it locally in **Developer Mode**:

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/NeelTrivedi05/codeflow-sync.git
   ```
2. Open **Google Chrome** and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **"Load unpacked"** and select the `codeflow-sync` folder.
5. Navigate to any YouTube video — the extension is now active!

---

## 📁 Project Structure

```
codeflow-sync/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker (lifecycle management)
├── content.js         # Content script (pause/resume logic)
└── README.md          # You are here
```

---

## 🧰 Tech Stack

| Component        | Technology             |
|------------------|------------------------|
| Manifest         | Chrome Manifest V3     |
| Content Script   | Vanilla JavaScript     |
| Detection Method | Page Visibility API    |
| Video Control    | HTML5 Video API        |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CodeFlow Sync:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m "Add my feature"`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a **Pull Request**.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Built for developers who code along with YouTube tutorials. 🎓💻
