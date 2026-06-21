# RailQuick Vendor Web App (RailQuick OS)

A premium, touch-optimized Web Portal and Dispatch App designed for railway station stalls (specifically Platform 3). It features a sleek, professional Slate-900 operations dashboard, real-time train arrivals timetables, automated sales ledgers, background AI-driven platform relocation tracking, a live transit radar timeline, checkable order lists, secure dispatch verification, and cloud Notion integration with an interactive CLI log console.

---

## Core Features and Redesigns

### Centered Web App Layout
- Removed simulated smartphone bezel chassis, notch, simulated status bar, and home indicators to present a clean, native web application layout.
- Optimized and centered viewport (480px max-width) on desktop screens, while automatically scaling to fill 100% of mobile screens.
- Sleek neutral Slate-900 theme (`#0f172a` base, `#1e293b` panels, `#334155` cards) with sky-blue accents (`#38bdf8`) for high readability and premium aesthetics.
- Replaced sidebars with a native bottom tab navigation bar containing views for Orders, Inventory, Notion Sync, and AI Agent.

### Secure Dispatch Verification (Runner OTP Flow)
- Every incoming order has a unique, randomly generated 4-digit verification code.
- Tapping the READY button intercepts the dispatch event and prompts the vendor with a secure OTP modal popup.
- The dispatch is authorized and credited to the sales ledger only when the vendor inputs the correct OTP (provided by the runner). Correct OTP auto-submits when 4 digits are entered.

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

## Notion Integration & Database Schemas

RailQuick OS features deep Notion integration design, mimicking a true team workspace. This allows vendors to synchronize operational data with cloud databases in real-time.

### 1. Synchronization Architecture (Dual Modes)
- **Mock Sync (Interactive Terminal)**: Designed for offline staging. It aggregates database payloads and streams the raw JSON structures directly to the in-app **Notion Database Logs** terminal for easy debugging.
- **Real Notion API Mode**: Uses live web requests (`POST https://api.notion.com/v1/pages`) using standard HTTP headers (e.g. `Authorization`, `Notion-Version: 2022-06-28`) to sync databases directly from the client.

### 2. Orders Sync Database Schema
Active orders are tracked and serialized to a Notion database with the following properties:
- `Order ID` (Title property): Unique identifier (e.g., `RQ-1082`).
- `Train No` (Rich Text property): Code representing the targeted train (e.g., `12423`).
- `Status` (Select property): Active state of fulfillment (`Pending`, `Relocated`, `Delivered`).

### 3. Inventory Sync Database Schema
Stall stock records are maintained in a structured inventory grid matching Notion's database fields:
- `Name` (Title property): Name of item (e.g., `Water Bottle 1L`).
- `Category` (Select property): Product categorization (`Food`, `Beverage`, `Snack`, `Other`).
- `Stock` (Number property): Current units remaining in safety stock.
- `Price` (Number property): Price index in Indian Rupees (₹).
- `Status` (Select property): Stock health alert state (`In Stock`, `Low Stock`, `Out of Stock`).

### 4. Dynamic Column Creator (Schema Extension)
Vendors can create custom database properties on the fly using the **+ Add Column** button in the Inventory tab:
- **Text** (`Aa` property type)
- **Number** (`#` property type)
- **Select** (Tag property type)
- Added properties are dynamically appended to both the HTML table structure and the outgoing Notion sync payload schema.

### 5. Notion AI Daily Report (Block Children API)
The shift summary generator compiles performance indicators and pushes them to a parent page ID as block children:
- `heading_2`: Structured header showing report title and audit date.
- `bulleted_list_item`: Nested lists containing operational aggregates (Orders Dispatched, Sales Revenue, Average Prep Times, Safety Stock levels).
- Callout banner block: Houses demand forecast insights and AI suggestions (e.g., predicted stock shortages based on train delay models).

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
