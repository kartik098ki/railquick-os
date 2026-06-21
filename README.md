# RailQuick Vendor Mobile OS (RailQuick OS) 📱🚂

A premium, touch-optimized **Mobile Platform Vendor POS & Dispatch App** designed for railway station stalls (e.g., Platform 3). It features a sleek **Light Mint Greenish & White Operations Dashboard** (inspired by fast fulfillment centers like Zepto/Blinkit), real-time train timetable boards, automated vendor sales ledgers, background AI-driven platform relocation tracking, and cloud Notion integration with an interactive CLI log console.

---

## 🌟 Core Enhancements & Features

### 🚂 Scoped Platform 3 Timetable & Queue
- **Scoped Views**: Displays oncoming train departures and orders scheduled *exclusively* for the vendor's platform (Platform 3).
- **AI Relocation Shifts**: When trains get dynamically rescheduled to other platforms by the AI dispatch engine, the system automatically relocates those orders, logs the shift, and updates the local boards.
- **Dynamic Assignments**: When trains on other tracks (e.g., Platform 1) get rescheduled to Platform 3, the AI auto-router transfers the order to our queue and notifies the stall immediately.

### 🚨 AI Stock Manager (One-Click Refill)
- **Automatic Stock Warnings**: Displays current low stock levels against expected demand during upcoming train arrivals (e.g., Stock: 18 vs Expected Demand: 64).
- **One-Click Refill**: A single button tap refills the stock by 50 units instantly, updating the database logs and refreshing the inventory tables.

### 📦 Smart Packing Assistant
- **Automatic Guidance**: Each order card automatically displays packing specs (Pack Type: Small/Medium/Large, Est. Packing Time, Fragile Item Flags) so that dispatch staff can pack and route products instantly without thinking.

### ⚡ Rush Hour Mode
- **High-Intensity Dashboard Banner**: When any train arrival timer falls below 6 minutes, the dashboard dynamically activates **RUSH HOUR MODE** with warning pulse animations, showing pending orders, average pack times, and required staff.

### 🔴 Smart Order Priority Engine
- **Classified Badges**: The system automatically scans train countdown timings and flags orders as either 🔴 **Critical** (Train arriving in < 8 mins) or 🟡 **Normal** (Train arriving in >= 8 mins).

### 📈 One-Tap Daily Report (Notion Sync)
- **Instant Summary**: Clicking the report button aggregates dispatched orders, revenue, missed counts, lost revenue estimation, and tomorrow's demand forecast.
- **Notion Integration**: Pushes the compiled markdown summary blocks directly to the parent Notion workspace page, printing the raw REST JSON payloads to the console terminal.

### 🎤 AI Voice Desk (Talk Agent)
- **Hinglish/English Support**: Tap the microphone icon to ask questions in English or local Hinglish dialects (e.g., *"Which order to prioritize?"* or *"Pehle konsa order banaye?"*).
- **Web Speech API**: Uses browser Speech Recognition to transcribe commands and Speech Synthesis to talk back with an Indian-accented voice assistant.

---

## 🤝 Project Credits & Stack

This application was engineered with code design and implementation help from:
1. **Notion API & AI**: Inspires the database schema sync, CLI request logger, and the Notion AI Daily Report sheet.
2. **Google DeepMind's Antigravity AI**: Assisted in pair-programming the real-time layout structures, autonomous state timers, voice engines, and the light greenish-white operations dashboard.
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
