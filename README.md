# RailQuick Vendor Mobile OS (RailQuick OS)

A premium, touch-optimized Mobile Platform Vendor POS and Dispatch App designed for railway station stalls (specifically Platform 3). It features a sleek, light-mint and white operations dashboard (inspired by fast fulfillment centers like Zepto and Blinkit), real-time train arrivals timetables, automated sales ledgers, background AI-driven platform relocation tracking, a live transit radar timeline, checkable order lists, and cloud Notion integration with an interactive CLI log console.

---

## Core Features and Redesigns

### Centered Mobile App Layout
- Restricted width to 480px on desktop screens to provide a simulated mobile viewport experience, while automatically scaling to fill 100% of real smartphone screens.
- Replaced the sidebar with a native-style bottom tab navigation bar containing views for Orders, Inventory, Notion Sync, and AI Agent.

### Interactive Packing Checklist
- Active orders render checkable list items. Vendors can tap items individually to pack them.
- Once all items are checked, the PACK button transitions into a glowing READY state, prompting for dispatch. Tapping PACK acts as a quick-pack shortcut.

### Dedicated AI Agent Tab
- Consolidated all AI features into a single tab view:
  - **AI Voice Desk**: Indian English and Hinglish vocal recognition and speech responses.
  - **Live Platform Transit Radar**: Tracks train ETAs in real-time, advancing train dots towards the platform.
  - **Platform Schematic Map**: Visualizes train slots across Platforms 1 through 5.
  - **Notion Daily Report Generator**: Compiles markdown reports of shift activities and logs.

### Hinglish Command Quick-Chips
- Clickable chips below the microphone button allow one-tap testing and quick assistant interactions (e.g., "Pehle kya banaye?", "Train kab aayegi?", "Stock details").

### Fulfillment Performance Dashboard
- Visualizes hourly order volumes using dynamic CSS bar charts and monitors average preparation times and customer satisfaction rates.

### Clean Iconography and Typography
- Free of all emojis in the UI headers, list elements, map representations, and terminal logs. Styled with monospaced markers, capsule badges, and custom SVG icons.

---

## Project Credits and Stack

This application was engineered with code design and implementation help from:
1. **Notion API and AI**: Inspires the database schema sync, CLI request logger, and the Notion AI Daily Report sheet.
2. **Google DeepMind Antigravity AI**: Assisted in pair-programming the real-time layout structures, autonomous state timers, voice engines, and the light greenish-white operations dashboard.
3. **Web Speech and Audio APIs**: Powering voice commands, multilingual speech synthesis, and synthesized audio soundscapes.
4. **Vanilla Tech Stack**: Pure HTML5, CSS3 variables, and vanilla JavaScript (no complex frameworks or bundlers).

---

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/kartik098ki/railquick-os.git
   ```
2. Open `index.html` directly in any web browser, or run a local static server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```
3. Access the app at `http://localhost:8000` or `http://localhost:3000`.
