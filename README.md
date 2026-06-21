# RailQuick Vendor Mobile OS (RailQuick OS) 📱🚂

A premium, touch-optimized **Mobile Platform Vendor POS & Dispatch App** designed for railway station stalls (e.g., Platform 3). It features real-time train timetable boards, automated vendor sales ledgers, background AI-driven platform relocation tracking, and cloud Notion integration with an interactive CLI log console.

---

## 🌟 Core Enhancements & Features

### 🚂 Platform 3 Timetable & Queue Scoping
- **Scoped Views**: Displays oncoming train departures and orders scheduled *exclusively* for the vendor's platform (Platform 3).
- **AI Relocation Shifts**: When trains get dynamically rescheduled to other platforms by the AI dispatch engine, the system automatically relocates those orders, logs the shift, and updates the local boards.
- **Dynamic Assignments**: When trains on other tracks (e.g., Platform 1) get rescheduled to Platform 3, the AI auto-router transfers the order to our queue and notifies the stall immediately.

### 🤖 Autonomous AI Relocations
- A background simulation engine runs autonomously.
- Triggers realistic track shifts (e.g., Jan Shatabdi shifted from Platform 3 to Platform 5).
- Automatically reallocates orders to partner stalls, adds **AI Relocations Commission (15% / ₹18.00)** to our ledger, and triggers browser Speech Synthesis for voice-over dispatch announcements.

### 🛒 Tap-to-Checkout Stall POS
- **Touch Product Tiles**: Tap on Chai, Cutlets, Rolls, or Samosas to load them into the basket.
- **Runners & Seats**: Enter the target seat (e.g., Coach B2-46) and select from online runners (Raj Kumar, Amit Singh, Vikram Patel) to dispatch immediately.
- Dispatched orders feed back into the active queue with countdown delivery timers.

### 📝 Notion AI Assistant & Sync Center
- **Notion Sync Desk (Tab 4)**: Lets you toggle between **Mock Sync** and **Real API Sync**. Connects to Notion pages and databases (`POST /v1/pages`) to upload live order items and stock records.
- **API CLI Console**: Shows raw JSON request payloads and auth headers required for Notion integrations.
- **Notion AI Drawer**: A slide-up companion sheet that scans sales figures and inventory count to draft handovers using markdown blocks (headings, callouts, lists) with typewriter audio chimes.

---

## 🤝 Project Credits & Stack

This application was engineered with code design and implementation help from:
1. **Notion API & AI**: Provides the structured schema design for inventory/order properties and inspires the AI assistant text-streaming blocks.
2. **Google DeepMind's Antigravity AI**: Assisted in pair-programming the real-time layout structures, autonomous state timers, and vector dark-mode interface.
3. **Web Audio API**: Powering the speech synthesis alert announcements and typewriter audio oscillators.
4. **Vanilla Tech Stack**: Pure HTML5, CSS3 variables, and vanilla JavaScript (no complex bundler setup required).

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
