# RailQuick Vendor Notion Workspace (RailQuick OS)

A premium, interactive React-inspired Notion workspace designed for railway platform vendors. This application integrates real-time train schedules with automated priority order routing and AI dispatch management.

## 🌟 Key Features

### 📁 Collapsible Sidebar
- **UX Details**: A toggle button (`◀`) slides out on the sidebar edge on hover. Clicking it collapses the sidebar with a smooth animation to maximize focus. A burger-expand icon (`▶`) appears floating on the top-left of the workspace when collapsed.
- **Keyboard Shortcut**: Press `Cmd + \` (Mac) or `Ctrl + \` (Windows/Linux) to toggle the sidebar.

### 🔍 Cmd+K Quick Find Command Palette
- **UX Details**: Press `Cmd+K` / `Ctrl+K` or click "Search / Jump to..." in the sidebar to open a fuzzy search panel with a translucent glass background.
- **Scope**: Search across page views (Orders, Map, Inventory, Notes), active trains, specific orders (e.g. searching for `#1082` will highlight it), inventory stock levels, or trigger system actions (like toggling theme, restocking items, or simulating platform shift).
- **Controls**: Use `ArrowUp`/`ArrowDown` to navigate, `Enter` to select, and `Escape` to close.

### 💬 Shift logs & Page Comments
- **UX Details**: Standard comments thread located under the main properties panel. It supports collapsing/expanding comment threads, displaying supervisor avatars, relative timestamps, and deletion triggers.
- **Action**: Type comments and hit `Enter` or click "Comment" to log notes.

### 🏷️ Interactive Properties Picker
- **UX Details**: Clicking "Runner Assigned" or "Tags" in the page properties panel opens an absolute-positioned dropdown select.
- **Action**: Search and assign runners (Raj Kumar, Amit Singh, Vikram Patel) or toggle tags (Operations, Live Queue, Restock, Delayed) with real-time sync state feedback animations.

### ✏️ Keyboard Slash Commands & Drag Handles
- **UX Details**: Inside the Notes editor workspace, typing `/` displays a block-insertion menu that can be navigated using `ArrowUp`/`ArrowDown` and selected using `Enter`.
- **Drag Handles**: Order cards and layout lists now display Notion's iconic `⠿` drag handles on hover.

---

## 🛠️ Tech Stack & Styling
- **Core**: Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Design Tokens**: Standard Notion gray-scale light/dark theme variables, Outfitters & Inter typography, glassmorphism filters, and smooth CSS transitions.
- **Audio Feed**: Web Audio API synthesized chimes and speech alerts for priority announcements.

---

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/kartik098ki/railquick-os.git
   ```
2. Open `index.html` directly in any web browser, or run a local static server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve .
   ```
3. Access the app at `http://localhost:8000` or `http://localhost:3000`.
