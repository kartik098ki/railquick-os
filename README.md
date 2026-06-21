# RailQuick Vendor Mobile OS (RailQuick OS) 📱🚂

A premium, touch-optimized **Mobile Platform Vendor POS & Dispatch App** designed for railway station stalls (e.g., Platform 3). It features real-time train timetable boards, automated vendor sales ledgers, background AI-driven platform relocation tracking, and cloud Notion integration with an interactive CLI log console.

---

## 🌟 Core Enhancements & Features

### 🚂 Platform 3 Timetable & Queue Scoping
- **Scoped Views**: Displays oncoming train departures and orders scheduled *exclusively* for the vendor's platform (Platform 3).
- **AI Relocation Shifts**: When trains get dynamically rescheduled to other platforms by the AI dispatch engine, the system automatically relocates those orders, logs the shift, and updates the local boards.
- **Dynamic Assignments**: When trains on other tracks (e.g., Platform 1) get rescheduled to Platform 3, the AI auto-router transfers the order to our queue and notifies the stall immediately.

### 🎤 AI Voice Desk (Talk Agent)
- **Hinglish/English Multilingual Support**: Tap the microphone icon to talk to the AI agent. Ask questions in English or local Hinglish dialects (e.g., *"Which order to prioritize?"* or *"Pehle konsa order banaye?"*).
- **Web Speech API**: Uses browser Speech Recognition to transcribe commands and Speech Synthesis to talk back with an Indian-accented voice assistant.
- Supports voice queries for order prioritization, train arrival status updates, and low-stock alerts. Includes a fallback text interface for unsupported environments.

### 🧠 Live Queue Prioritization
- **Order Prioritize Indicator**: Tapping the **🧠 Prioritize** button or asking the voice assistant triggers a real-time priority sweep. 
- **Glowing Highlights**: The app automatically identifies the pending order with the lowest train arrival ETA, scrolls it into view, and applies a pulsating glowing indicator (`.prioritized-highlight`).

### 🤖 Autonomous AI Relocations
- A background simulation engine runs autonomously.
- Triggers realistic track shifts (e.g., Jan Shatabdi shifted from Platform 3 to Platform 5).
- Automatically reallocates orders to partner stalls, updates the **AI Rerouted** ledger counters, and triggers speech announcements for platform change operations.

### 🛒 Tap-to-Checkout Stall POS
- **Touch Product Tiles**: Tap on Chai, Cutlets, Rolls, or Samosas to load them into the basket.
- **Runners & Seats**: Enter the target seat (e.g., Coach B2-46) and select from online runners (Raj Kumar, Amit Singh, Vikram Patel) to dispatch immediately.
- Dispatched orders feed back into the active queue with countdown delivery timers.

### 📝 Notion AI Assistant & Sync Center
- **Notion Sync Desk (Tab 4)**: Connects to Notion pages and databases (`POST /v1/pages`) to upload live order items and stock records.
- **API CLI Console**: Shows raw JSON request payloads and auth headers required for Notion integrations.
- **Notion AI Drawer**: A slide-up companion sheet that drafts handovers using markdown blocks (headings, callouts, lists) with typewriter audio chimes.

---

## 🤝 Project Credits & Stack

This application was engineered with code design and implementation help from:
1. **Notion API & AI**: Inspires the database schema design and the AI companion note editor.
2. **Google DeepMind's Antigravity AI**: Assisted in pair-programming the real-time layout structures, autonomous state timers, speech engines, and dark-mode interface.
3. **Web Speech & Audio APIs**: Powering voice commands, multilingual speech synthesis, and synthesized audio soundscapes.
4. **Vanilla Tech Stack**: Pure HTML5, CSS3 variables, and vanilla JavaScript (no complex frameworks or bundlers).

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
