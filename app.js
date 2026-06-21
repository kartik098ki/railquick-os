/* ==========================================================================
   RAILQUICK VENDOR OS v4 — FULL ENGINE (ULTRA EDITION)
   Features: Smart ETA countdown, AI voice desk, live radar, handoff timer,
   5-tab navigation, advanced inventory, analytics charts, staff roster,
   order filtering, pack tracking, toast system, AI report generation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // STATE
    // ==========================================================================
    let state = {
        orderFilter: 'all',
        inventoryFilter: 'All',
        inventorySearch: '',
        currentTab: 'orders',
        rushMode: false,
        isListening: false,
        totalRevenue: 2840,
        ordersFilled: 18,
        aiAssists: 4,
    };

    // ==========================================================================
    // DATA
    // ==========================================================================
    function genOTP() { return Math.floor(1000 + Math.random() * 9000).toString(); }

    let orders = [
        {
            id: "RQ-1082",
            trainNo: "12423",
            trainName: "Rajdhani Express",
            fromTo: "NDLS → HWH",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 120,
            prepTimeMinutes: 2,
            items: [
                { name: "Chai (Flask)", qty: 2, packed: false },
                { name: "Veg Cutlet", qty: 2, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express",
            reallocated: false,
            otp: genOTP(),
            amount: 140,
            coach: "A1-A3"
        },
        {
            id: "RQ-1085",
            trainNo: "12056",
            trainName: "Jan Shatabdi Express",
            fromTo: "DDN → NDLS",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 340,
            prepTimeMinutes: 4,
            items: [
                { name: "Paneer Tikka Roll", qty: 1, packed: false },
                { name: "Water Bottle 1L", qty: 1, packed: false }
            ],
            status: "Preparing",
            source: "Platform 3 Express",
            reallocated: false,
            otp: genOTP(),
            amount: 140,
            coach: "B2"
        },
        {
            id: "RQ-1089",
            trainNo: "12952",
            trainName: "Mumbai Rajdhani",
            fromTo: "NDLS → MMCT",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 820,
            prepTimeMinutes: 3,
            items: [
                { name: "Samosa Plate", qty: 3, packed: false },
                { name: "Chai (Flask)", qty: 1, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express",
            reallocated: false,
            otp: genOTP(),
            amount: 135,
            coach: "C1"
        }
    ];

    const svgIcons = {
        Food: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/><path d="M6 20h12"/></svg>`,
        Beverage: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22v-3"/><path d="M16 22v-3"/><path d="M12 22v-4"/><path d="M12 18H8"/><path d="M12 18h4"/><path d="M5 4h14l-1.5 14h-11Z"/><path d="M12 4v4"/></svg>`,
        Snack: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, // simplified placeholder
        Other: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
    };

    let inventory = [
        { id: 1, name: "Water Bottle 1L", category: "Beverage", stock: 18, minStock: 15, price: 20, icon: svgIcons.Beverage },
        { id: 2, name: "Veg Cutlet", category: "Food", stock: 42, minStock: 10, price: 40, icon: svgIcons.Food },
        { id: 3, name: "Chai (Flask)", category: "Beverage", stock: 3, minStock: 5, price: 30, icon: svgIcons.Beverage },
        { id: 4, name: "Paneer Tikka Roll", category: "Food", stock: 25, minStock: 8, price: 120, icon: svgIcons.Food },
        { id: 5, name: "Samosa Plate", category: "Snack", stock: 0, minStock: 12, price: 35, icon: svgIcons.Snack },
        { id: 6, name: "Biscuit Pack", category: "Snack", stock: 60, minStock: 20, price: 15, icon: svgIcons.Snack },
        { id: 7, name: "Cold Drink 500ml", category: "Beverage", stock: 8, minStock: 20, price: 35, icon: svgIcons.Beverage },
        { id: 8, name: "Veg Thali", category: "Food", stock: 12, minStock: 5, price: 150, icon: svgIcons.Food },
    ];

    let activeTrains = [
        { no: "12423", name: "Rajdhani Express", etaSeconds: 120, platform: 3, color: "urgent" },
        { no: "12056", name: "Jan Shatabdi", etaSeconds: 340, platform: 3, color: "warning" },
        { no: "12952", name: "Mumbai Rajdhani", etaSeconds: 820, platform: 3, color: "normal" },
    ];

    const hourlyData = [
        { hour: "09", orders: 4, revenue: 320 },
        { hour: "10", orders: 7, revenue: 580 },
        { hour: "11", orders: 12, revenue: 940 },
        { hour: "12", orders: 6, revenue: 480 },
        { hour: "13", orders: 9, revenue: 720 },
        { hour: "14", orders: 5, revenue: 400 },
    ];

    // AI Response Matrix (Hindi + English)
    const aiResponses = {
        "prioritize orders": [
            "Priority Analysis:\n1st: RQ-1082 (Rajdhani - 2min!)\n2nd: RQ-1085 (Shatabdi - 5min)\n3rd: RQ-1089 (Mumbai Raj - 13min)\n\nSabse pehle Chai aur Cutlet pack karo!",
            "Queue sorted! Rajdhani arrives FIRST. RQ-1082 pack karo abhi — sirf 2 minute hain!"
        ],
        "check trains": [
            "Train Schedule:\n• Rajdhani #12423 → Platform 3, ETA 2min (URGENT!)\n• Jan Shatabdi #12056 → Platform 3, ETA ~5min\n• Mumbai Raj #12952 → Platform 3, ETA ~13min\n\nTeen train ek saath aa rahi hain!",
            "Live Radar:\n1. Train 1 (P3) — 2 min away [CRITICAL]\n2. Train 2 (P3) — 5 min away [WARNING]\n3. Train 3 (P3) — 13 min away [NORMAL]"
        ],
        "stock status": [
            "Stock Report:\n[CRITICAL] Samosa Plate: 0 units (OUT!)\n[WARNING] Chai Flask: 3 units (LOW)\n[WARNING] Water Bottle: 18 units (LOW)\n[OK] Veg Cutlet: 42 units\n\nSamosa aur Chai refill karo jaldi!",
            "Critical items: Samosa 0 units, Chai 3 units. Refill urgent hai!"
        ],
        "daily revenue": [
            "Aaj ki report:\nTotal: ₹2,840\nOrders: 18 filled\nAI Assists: 4\nBest Hour: 11:00 (₹940)\n\nKal se bhi zyada ho sakta hai!",
            "Revenue ₹2,840 today! 18 orders filled. Target was ₹2,500 — 13.6% above target!"
        ],
        "rush mode": [
            "Rush Mode ACTIVATED!\nSab staff alert kar do!\nOrder queue prioritized.\nPackaging speed: MAX",
            "Rush Mode ON! Teen trains ek saath. Haath badhao, sabko ek-ek order de do!"
        ],
        "hello": [
            "Namaste! Main RailQuick AI hoon.\nAaj Platform 3 pe:\n• 3 active orders\n• 3 trains incoming\n• Revenue ₹2,840\n\nKya help chahiye?",
            "Namaste! Sab theek hai. 3 orders ready hain, pehle Rajdhani Express ka order pack karo!"
        ],
        "default": [
            "Samajh gaya! Order queue check karo aur sabse urgent item pehle pack karo.",
            "AI suggest karta hai: Train arrival ke basis pe orders sort kiye gaye hain. Pehle wala order sabse urgent hai!"
        ]
    };

    // ==========================================================================
    // CLOCK
    // ==========================================================================
    function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('headerClock').textContent = `${hh}:${mm}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // ==========================================================================
    // TOAST SYSTEM
    // ==========================================================================
    function showToast(message, type = 'info', duration = 3500) {
        const container = document.getElementById('toastContainer');
        const icons = {
            success: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ==========================================================================
    // TAB NAVIGATION
    // ==========================================================================
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabViews = document.querySelectorAll('.tab-view');

    function switchTab(tabId) {
        state.currentTab = tabId;
        navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        tabViews.forEach(view => view.classList.toggle('active', view.id === `tab-${tabId}`));
        if (tabId === 'analytics') renderAnalyticsCharts();
    }

    navItems.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // ==========================================================================
    // ETA COUNTDOWN ENGINE
    // ==========================================================================
    function formatETA(seconds) {
        if (seconds <= 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function getUrgencyClass(seconds) {
        if (seconds <= 90) return 'critical';
        if (seconds <= 300) return 'warning';
        return 'normal';
    }

    function getUrgencyPriority(seconds) {
        if (seconds <= 90) return 'priority-critical';
        if (seconds <= 300) return 'priority-warning';
        return 'priority-normal';
    }

    // Tick ETAs every second
    setInterval(() => {
        orders.forEach(order => {
            if (order.etaSeconds > 0 && order.status !== 'Delivered') {
                order.etaSeconds--;
            }
        });
        activeTrains.forEach(train => {
            if (train.etaSeconds > 0) train.etaSeconds--;
        });

        // Update all visible ETA elements
        orders.forEach(order => {
            const el = document.getElementById(`eta-${order.id}`);
            if (el) {
                el.textContent = formatETA(order.etaSeconds);
                el.className = `eta-countdown ${getUrgencyClass(order.etaSeconds)}`;
            }
        });

        // Update train ticker
        activeTrains.forEach(train => {
            const el = document.getElementById(`badge-${train.no}`);
            if (el) {
                const cls = train.etaSeconds <= 90 ? 'urgent' : train.etaSeconds <= 300 ? 'warning' : 'normal';
                train.color = cls;
                el.className = `train-arrival-badge ${cls}`;
                el.querySelector('.badge-eta').textContent = formatETA(train.etaSeconds);
            }
        });

        updateHandoffTimer();
        updateNextTrainStrip();
        updateRushMode();
        updateRadar();
    }, 1000);

    // ==========================================================================
    // TRAIN TICKER
    // ==========================================================================
    function renderTrainTicker() {
        const container = document.getElementById('upcomingTrainsList');
        container.innerHTML = '';
        activeTrains.slice().sort((a, b) => a.etaSeconds - b.etaSeconds).forEach(train => {
            const badge = document.createElement('div');
            badge.className = `train-arrival-badge ${train.color}`;
            badge.id = `badge-${train.no}`;
            badge.innerHTML = `
                <span class="badge-dot"></span>
                <span>${train.name.split(' ')[0]}</span>
                <span class="badge-eta" style="font-family:var(--font-mono);font-size:10px;">${formatETA(train.etaSeconds)}</span>
            `;
            container.appendChild(badge);
        });
    }
    renderTrainTicker();

    // ==========================================================================
    // NEXT TRAIN STRIP + HANDOFF TIMER
    // ==========================================================================
    function updateNextTrainStrip() {
        const next = activeTrains.slice().sort((a, b) => a.etaSeconds - b.etaSeconds)[0];
        if (!next) return;
        const nameEl = document.getElementById('stripTrainName');
        const etaEl = document.getElementById('stripEtaDisplay');
        if (nameEl) nameEl.textContent = next.name;
        if (etaEl) {
            etaEl.textContent = formatETA(next.etaSeconds);
            etaEl.className = `strip-eta ${getUrgencyClass(next.etaSeconds)}`;
        }
    }

    let handoffInitialEta = orders[0]?.etaSeconds || 120;
    function updateHandoffTimer() {
        const urgentOrder = orders.filter(o => o.status !== 'Delivered').sort((a, b) => a.etaSeconds - b.etaSeconds)[0];
        if (!urgentOrder) return;
        const timerEl = document.getElementById('handoffTimer');
        const nameEl = document.getElementById('handoffTrainName');
        const fillEl = document.getElementById('handoffFill');
        if (timerEl) {
            timerEl.textContent = formatETA(urgentOrder.etaSeconds);
            timerEl.className = `handoff-countdown ${urgentOrder.etaSeconds <= 60 ? 'urgent' : ''}`;
        }
        if (nameEl) nameEl.textContent = `${urgentOrder.trainName} · #${urgentOrder.trainNo}`;
        if (fillEl) {
            const pct = Math.max(5, Math.min(100, (urgentOrder.etaSeconds / handoffInitialEta) * 100));
            fillEl.style.width = `${pct}%`;
        }
    }

    // ==========================================================================
    // RUSH MODE
    // ==========================================================================
    function updateRushMode() {
        const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');
        const hasUrgent = pending.some(o => o.etaSeconds <= 180);
        const banner = document.getElementById('rushHourBanner');
        if (hasUrgent && !state.rushMode) {
            state.rushMode = true;
            banner.classList.add('visible');
            showToast('Rush Mode activated! Urgent deliveries approaching.', 'warning');
        } else if (!hasUrgent && state.rushMode) {
            state.rushMode = false;
            banner.classList.remove('visible');
        }
        const el = document.getElementById('rushModeOrders');
        if (el) el.textContent = `${pending.length} Pending`;
    }

    // ==========================================================================
    // ORDER RENDERING
    // ==========================================================================
    function getPackedCount(order) {
        return order.items.filter(i => i.packed).length;
    }

    function renderOrders() {
        const container = document.getElementById('active-orders-container');
        if (!container) return;
        container.innerHTML = '';

        let filtered = orders;
        if (state.orderFilter !== 'all') {
            filtered = orders.filter(o => o.status === state.orderFilter);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M9 21V9"/></svg></div>
                    <div class="empty-title">No orders here</div>
                    <div class="empty-desc">Switch filter or wait for new orders</div>
                </div>`;
            return;
        }

        // Sort by ETA ascending (most urgent first)
        filtered = [...filtered].sort((a, b) => a.etaSeconds - b.etaSeconds);

        filtered.forEach((order, idx) => {
            const urgency = getUrgencyClass(order.etaSeconds);
            const priorityClass = order.status === 'Preparing' ? 'status-preparing'
                : order.status === 'Ready' ? 'status-ready'
                : getUrgencyPriority(order.etaSeconds);

            const packedCount = getPackedCount(order);
            const totalItems = order.items.length;
            const packPct = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

            const card = document.createElement('div');
            card.className = `order-card ${priorityClass} ${order.status === 'Delivered' ? 'status-delivered' : ''}`;
            card.dataset.orderId = order.id;

            const itemChips = order.items.map(item =>
                `<span class="item-chip ${item.packed ? 'packed' : ''}" data-item="${item.name}" data-order="${order.id}">
                    <span class="chip-check"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    ${item.name} ×${item.qty}
                </span>`
            ).join('');

            const statusPillClass = {
                'Pending': 'pill-pending',
                'Preparing': 'pill-preparing',
                'Ready': 'pill-ready',
                'Delivered': 'pill-delivered',
                'Cancelled': 'pill-cancelled'
            }[order.status] || 'pill-pending';

            const platClass = order.reallocated ? 'reallocated' : '';
            const platText = order.reallocated ? `P${order.actualPlatform} ⟳` : `P${order.actualPlatform}`;

            card.innerHTML = `
                <div class="order-card-top">
                    <div class="order-id-train">
                        <span class="order-id">${order.id} · Coach ${order.coach}</span>
                        <span class="train-name">${order.trainName}</span>
                        <span class="train-route">${order.fromTo}</span>
                    </div>
                    <div class="order-right-meta">
                        <span class="order-status-pill ${statusPillClass}">${order.status}</span>
                        <div class="eta-countdown ${urgency}" id="eta-${order.id}">${formatETA(order.etaSeconds)}</div>
                        <span class="eta-label">ETA left</span>
                    </div>
                </div>
                <div class="order-items-strip" id="items-${order.id}">
                    ${itemChips}
                </div>
                <div class="order-progress-bar">
                    <div class="order-progress-fill" id="prog-${order.id}" style="width:${packPct}%"></div>
                </div>
                <div class="order-card-actions">
                    <span class="otp-label">OTP:</span>
                    <span class="otp-display">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        ${order.otp}
                    </span>
                    <span class="plat-badge ${platClass}">${platText}</span>
                    <span style="flex:1;"></span>
                    ${order.status === 'Pending' ? `<button class="btn btn-amber btn-xs" onclick="startPrep('${order.id}')">Start Prep</button>` : ''}
                    ${order.status === 'Preparing' ? `<button class="btn btn-cyan btn-xs" onclick="markReady('${order.id}')">Mark Ready</button>` : ''}
                    ${order.status === 'Ready' ? `<button class="btn btn-solid-green btn-xs" onclick="markDelivered('${order.id}')"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><polyline points="20 6 9 17 4 12"/></svg> Deliver</button>` : ''}
                    ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? `<button class="btn btn-ghost btn-xs" onclick="openOrderModal('${order.id}')">Details</button>` : ''}
                </div>
            `;
            container.appendChild(card);
        });

        // Bind item chip toggles
        container.querySelectorAll('.item-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = chip.dataset.order;
                const itemName = chip.dataset.item;
                const order = orders.find(o => o.id === orderId);
                if (!order) return;
                const item = order.items.find(i => i.name === itemName);
                if (item) {
                    item.packed = !item.packed;
                    chip.classList.toggle('packed', item.packed);
                    chip.querySelector('.chip-check').style.display = item.packed ? 'inline' : 'none';
                    const packed = getPackedCount(order);
                    const total = order.items.length;
                    const fill = document.getElementById(`prog-${order.id}`);
                    if (fill) fill.style.width = `${(packed / total) * 100}%`;
                    if (packed === total && order.status === 'Preparing') {
                        showToast(`All items packed for ${order.trainName}!`, 'success');
                    }
                }
            });
        });

        // Update badge
        const active = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
        const badge = document.getElementById('activeOrdersBadge');
        if (badge) badge.textContent = active;
    }

    // Expose functions to window for onclick attrs
    window.startPrep = (id) => {
        const order = orders.find(o => o.id === id);
        if (order) { order.status = 'Preparing'; renderOrders(); showToast(`Preparing ${order.trainName} order...`, 'info'); }
    };

    window.markReady = (id) => {
        const order = orders.find(o => o.id === id);
        if (order) { order.status = 'Ready'; renderOrders(); showToast(`${order.trainName} order READY for handoff!`, 'success'); }
    };

    window.markDelivered = (id) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = 'Delivered';
            state.ordersFilled++;
            state.totalRevenue += order.amount;
            document.getElementById('salesOrdersFilled').textContent = state.ordersFilled;
            document.getElementById('salesTotalRevenue').textContent = `₹${state.totalRevenue.toLocaleString('en-IN')}`;
            renderOrders();
            showToast(`Delivered to ${order.trainName}! ₹${order.amount} earned.`, 'success');
        }
    };

    window.openOrderModal = (id) => openOrderModal(id);

    // ==========================================================================
    // ORDER DETAIL MODAL
    // ==========================================================================
    function openOrderModal(id) {
        const order = orders.find(o => o.id === id);
        if (!order) return;
        const modal = document.getElementById('orderDetailModal');
        document.getElementById('modalOrderTitle').textContent = `${order.trainName} — ${order.id}`;

        const urgency = getUrgencyClass(order.etaSeconds);
        const body = document.getElementById('orderModalBody');
        body.innerHTML = `
            <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
                <span class="plat-badge">${order.fromTo}</span>
                <span class="plat-badge ${order.reallocated ? 'reallocated' : ''}">Platform ${order.actualPlatform}</span>
                <span class="plat-badge" style="background:var(--neon-violet-dim);border-color:rgba(168,85,247,0.3);color:var(--neon-violet);">Coach ${order.coach}</span>
            </div>
            <div style="margin-bottom:14px;">
                <div style="font-size:9px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;">OTP CODE</div>
                <div class="otp-display" style="font-size:18px;padding:10px 16px;justify-content:center;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    ${order.otp}
                </div>
            </div>
            <div style="margin-bottom:14px;">
                <div style="font-size:9px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:8px;">ORDER ITEMS</div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    ${order.items.map(item => `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--r-sm);">
                            <span style="font-size:13px;font-weight:600;color:var(--text-primary);">${item.name}</span>
                            <span style="font-size:11px;font-weight:800;color:var(--neon-cyan);">×${item.qty}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--r-sm);margin-bottom:14px;">
                <span style="font-size:11px;font-weight:700;color:var(--text-muted);">ORDER TOTAL</span>
                <span style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--neon-green);">₹${order.amount}</span>
            </div>
            <div style="display:flex;gap:8px;">
                ${order.status === 'Pending' ? `<button class="btn btn-amber btn-full" onclick="startPrep('${order.id}');closeOrderModal()">Start Preparation</button>` : ''}
                ${order.status === 'Preparing' ? `<button class="btn btn-solid-cyan btn-full" onclick="markReady('${order.id}');closeOrderModal()">Mark Ready</button>` : ''}
                ${order.status === 'Ready' ? `<button class="btn btn-solid-green btn-full" onclick="markDelivered('${order.id}');closeOrderModal()">Confirm Delivery</button>` : ''}
            </div>
        `;

        modal.classList.add('open');
    }

    window.closeOrderModal = () => document.getElementById('orderDetailModal').classList.remove('open');
    document.getElementById('closeOrderModal').addEventListener('click', closeOrderModal);
    document.getElementById('orderDetailModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeOrderModal();
    });

    // ==========================================================================
    // ORDER FILTER TABS
    // ==========================================================================
    document.querySelectorAll('.filter-tab[data-filter]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab[data-filter]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.orderFilter = tab.dataset.filter;
            renderOrders();
        });
    });

    // ==========================================================================
    // AUTO-PRIORITIZE
    // ==========================================================================
    document.getElementById('btnAutoPrioritize').addEventListener('click', () => {
        orders.sort((a, b) => {
            if (a.status === 'Delivered') return 1;
            if (b.status === 'Delivered') return -1;
            return a.etaSeconds - b.etaSeconds;
        });
        renderOrders();
        showToast('Queue auto-prioritized by train ETA!', 'success');

        // Brief agent activation
        setAgentStatus('prioritizer', 'COMPUTING', 'processing');
        setTimeout(() => setAgentStatus('prioritizer', 'ACTIVE', 'active'), 2000);
        logToConsole('> Prioritizer Agent: Sorting 3 orders by ETA urgency...', 'system');
        setTimeout(() => logToConsole('✓ Queue reordered. Top priority: RQ-1082 (2min ETA)', 'success'), 800);
    });

    // ==========================================================================
    // INVENTORY RENDERING
    // ==========================================================================
    function getStockLevel(item) {
        if (item.stock === 0) return 'low';
        if (item.stock < item.minStock) return 'medium';
        return 'high';
    }

    function renderInventory() {
        const grid = document.getElementById('inventoryGrid');
        if (!grid) return;

        let items = inventory;
        if (state.inventoryFilter !== 'All') {
            items = items.filter(i => i.category === state.inventoryFilter);
        }
        if (state.inventorySearch) {
            const q = state.inventorySearch.toLowerCase();
            items = items.filter(i => i.name.toLowerCase().includes(q));
        }

        grid.innerHTML = '';

        if (items.length === 0) {
            grid.innerHTML = `<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M9 21V9"/></svg></div><div class="empty-title">No items found</div></div>`;
            return;
        }

        items.forEach(item => {
            const level = getStockLevel(item);
            const pct = item.stock > 0 ? Math.min(100, (item.stock / (item.minStock * 4)) * 100) : 0;
            const cardClass = item.stock === 0 ? 'stock-critical' : item.stock < item.minStock ? 'stock-low' : '';

            const card = document.createElement('div');
            card.className = `inv-item-card ${cardClass}`;
            card.innerHTML = `
                <div class="inv-category-icon">${item.icon}</div>
                <div class="inv-info">
                    <div class="inv-name">${item.name}</div>
                    <div class="inv-meta">${item.category} · Min: ${item.minStock} units · ₹${item.price}</div>
                </div>
                <div class="inv-stock-display">
                    <div class="stock-qty ${level}">${item.stock}</div>
                    <div class="stock-bar-wrap">
                        <div class="stock-bar-track">
                            <div class="stock-bar-fill ${level}" style="width:${pct}%"></div>
                        </div>
                    </div>
                    <div class="stock-price">₹${item.price}</div>
                </div>
                <div class="inv-actions">
                    <button class="btn btn-cyan btn-xs" title="Add stock" onclick="adjustStock(${item.id}, 10)">+10</button>
                    <button class="btn btn-red btn-xs" title="Remove stock" onclick="adjustStock(${item.id}, -1)">−</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.adjustStock = (id, delta) => {
        const item = inventory.find(i => i.id === id);
        if (!item) return;
        item.stock = Math.max(0, item.stock + delta);
        renderInventory();
        const level = getStockLevel(item);
        if (level === 'low') showToast(`${item.name} is critically low (${item.stock} units)!`, 'warning');
        const aiEl = document.getElementById('aiCurrentBottlesStock');
        if (aiEl && item.id === 1) aiEl.textContent = item.stock;
    };

    // Inventory filter tabs
    document.querySelectorAll('.filter-tab[data-cat]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab[data-cat]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.inventoryFilter = tab.dataset.cat;
            renderInventory();
        });
    });

    // Inventory search
    const inventorySearchInput = document.getElementById('inventorySearch');
    if (inventorySearchInput) {
        inventorySearchInput.addEventListener('input', (e) => {
            state.inventorySearch = e.target.value;
            renderInventory();
        });
    }

    // Add Item modal
    document.getElementById('btnAddNewItem').addEventListener('click', () => {
        document.getElementById('addItemModal').classList.add('open');
    });
    document.getElementById('closeItemModal').addEventListener('click', () => {
        document.getElementById('addItemModal').classList.remove('open');
    });
    document.getElementById('cancelAddItem').addEventListener('click', () => {
        document.getElementById('addItemModal').classList.remove('open');
    });
    document.getElementById('addItemModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) document.getElementById('addItemModal').classList.remove('open');
    });

    document.getElementById('addItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('itemCategory').value;
        const newItem = {
            id: inventory.length + 1,
            name: document.getElementById('itemName').value,
            category: cat,
            stock: parseInt(document.getElementById('itemStock').value),
            minStock: parseInt(document.getElementById('itemMinStock').value),
            price: parseFloat(document.getElementById('itemPrice').value),
            icon: svgIcons[cat] || svgIcons.Other
        };
        inventory.push(newItem);
        renderInventory();
        document.getElementById('addItemModal').classList.remove('open');
        document.getElementById('addItemForm').reset();
        showToast(`${newItem.name} added to inventory!`, 'success');
    });

    // AI Refill
    document.getElementById('btnAiRefill').addEventListener('click', () => {
        const bottle = inventory.find(i => i.id === 1);
        if (bottle) {
            bottle.stock += 50;
            renderInventory();
            document.getElementById('aiCurrentBottlesStock').textContent = bottle.stock;
            showToast('Restocked 50 Water Bottles via AI suggestion!', 'success');
            logToConsole('> Stock Agent: +50 Water Bottles restocked automatically', 'success');
        }
    });

    // ==========================================================================
    // ANALYTICS CHARTS
    // ==========================================================================
    function renderAnalyticsCharts() {
        const chart = document.getElementById('revenueBarChart');
        if (!chart) return;
        if (chart.children.length > 0) return; // Already rendered

        const maxRevenue = Math.max(...hourlyData.map(d => d.revenue));
        hourlyData.forEach(d => {
            const heightPct = (d.revenue / maxRevenue) * 100;
            const col = document.createElement('div');
            col.className = 'bar-col';
            const color = d.hour === '11' ? 'violet' : d.hour === '13' ? 'green' : 'cyan';
            col.innerHTML = `
                <div class="bar-fill ${color}" style="height:0%;" data-height="${heightPct}%"></div>
                <span class="bar-label">${d.hour}:00</span>
            `;
            chart.appendChild(col);
        });

        // Animate bars after insertion
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                chart.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.height = bar.dataset.height;
                });
            });
        });
    }

    // ==========================================================================
    // NOTION SYNC & REPORTS
    // ==========================================================================
    document.getElementById('notionIntegrationMode').addEventListener('change', (e) => {
        document.getElementById('realNotionFields').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        showToast('Settings saved successfully!', 'success');
        logToConsole('> Config saved. Integration mode: ' + (document.getElementById('notionIntegrationMode').checked ? 'Live API' : 'Mock'), 'info');
    });

    function doNotionSync() {
        showToast('Syncing to Notion...', 'info');
        logToConsole('> Initiating Notion DB sync...', 'system');
        setTimeout(() => {
            const payload = {
                orders: orders.length,
                revenue: state.totalRevenue,
                inventory: inventory.map(i => ({ name: i.name, stock: i.stock })),
                timestamp: new Date().toISOString()
            };
            logToConsole('> POST /notion/orders — 200 OK', 'success');
            logToConsole('> POST /notion/inventory — 200 OK', 'success');
            logToConsole(`> Payload: ${JSON.stringify(payload).slice(0, 80)}...`, 'info');
            showToast('Notion synced! Orders + Inventory pushed.', 'success');
        }, 1800);
    }

    document.getElementById('notionSyncBtn').addEventListener('click', doNotionSync);
    document.getElementById('btnOneTapReport').addEventListener('click', generateDailyReport);

    function generateDailyReport() {
        showToast('Generating AI report...', 'info');
        const report = `# Daily Operations Summary — Platform 3
> Generated: ${new Date().toLocaleString('en-IN')}

## Sales & Earnings
- **Aaj Ki Kamai (Total Revenue)**: ₹${state.totalRevenue.toLocaleString('en-IN')}
- **Orders Filled**: ${state.ordersFilled}
- **Stock Sold Today**: ${145 + Math.floor(Math.random() * 50)} items
- **AI Assists**: ${state.aiAssists}

## Trains Served
${activeTrains.map(t => `- ${t.name} (#${t.no}) — Platform 3`).join('\n')}

## Stock Alerts
${inventory.filter(i => getStockLevel(i) !== 'high').map(i => `- [ALERT] ${i.name}: ${i.stock} units (Low)`).join('\n') || '- All stocks nominal'}

## AI Strategy Insight
> **Recommendation to earn more**: Bundle "Water Bottle + Snacks" for the incoming Jan Shatabdi. High probability of ₹20+ upselling per order!

## Performance Score: 98.4%
`;
        const el = document.getElementById('editorContent');
        const el2 = document.getElementById('editorContent2');
        if (el) el.textContent = report;
        if (el2) el2.textContent = report;
        
        // Update AI Insight Card
        const insightCard = document.getElementById('aiInsightText');
        if (insightCard) insightCard.textContent = 'Increase Kamai (Earnings): Bundle "Water Bottle + Snacks" for incoming trains. High probability of ₹20+ upselling per order based on AI analysis!';
        
        showToast('AI daily report generated!', 'success');
        logToConsole('> Daily report compiled. 340 words generated.', 'success');
    }

    function handlePushReport() {
        showToast('Pushing report to Notion...', 'info');
        setTimeout(() => showToast('Report pushed to Notion successfully!', 'success'), 1500);
    }

    document.getElementById('btnTriggerDailyReport').addEventListener('click', generateDailyReport);
    if (document.getElementById('btnTriggerDailyReport2')) {
        document.getElementById('btnTriggerDailyReport2').addEventListener('click', generateDailyReport);
    }
    document.getElementById('btnPushReportToNotion').addEventListener('click', handlePushReport);
    if (document.getElementById('btnPushReportToNotion2')) {
        document.getElementById('btnPushReportToNotion2').addEventListener('click', handlePushReport);
    }

    // CSV Download Logic
    document.getElementById('btnDownloadCSV').addEventListener('click', () => {
        showToast('Compiling CSV Data...', 'info');
        setTimeout(() => {
            const csvContent = "data:text/csv;charset=utf-8,Date,Orders,Kamai(Revenue),StockSold\\n" + 
                `${new Date().toLocaleDateString('en-IN')},${state.ordersFilled},₹${state.totalRevenue},145`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `RailQuick_Sales_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Sales CSV Downloaded!', 'success');
            logToConsole('> CSV Sales Report successfully exported.', 'success');
        }, 800);
    });

    document.getElementById('btnClearTerminal').addEventListener('click', () => {
        document.getElementById('apiTerminalBody').innerHTML = '<span class="terminal-line system">Terminal cleared.</span>';
    });

    document.getElementById('btnCopyNote').addEventListener('click', () => {
        const content = document.getElementById('editorContent').textContent;
        navigator.clipboard?.writeText(content).then(() => showToast('Report copied to clipboard!', 'success'));
    });

    // ==========================================================================
    // CONSOLE LOGGER
    // ==========================================================================
    function logToConsole(message, type = 'system') {
        const body = document.getElementById('apiTerminalBody');
        if (!body) return;
        const line = document.createElement('span');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString('en-IN')}] ${message}`;
        body.appendChild(document.createElement('br'));
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }

    // ==========================================================================
    // AI VOICE DESK (SMART & WORKABLE)
    // ==========================================================================
    const orbBtn = document.getElementById('btnVoiceMic');
    const orbContainer = document.getElementById('aiAssistantOrbContainer');
    const voiceStatus = document.getElementById('voiceStatus');
    const chatThread = document.getElementById('voiceChatThread');
    const waveBars = document.querySelectorAll('.wave-bar');

    function startListening() {
        state.isListening = true;
        orbContainer.classList.add('listening');
        voiceStatus.textContent = 'Listening...';
        document.querySelector('.audio-wave').style.opacity = '1';
        waveBars.forEach(b => b.classList.add('active'));
    }

    function stopListening() {
        state.isListening = false;
        orbContainer.classList.remove('listening');
        voiceStatus.textContent = 'Tap to Speak';
        document.querySelector('.audio-wave').style.opacity = '0';
        waveBars.forEach(b => b.classList.remove('active'));
    }

    function addBubble(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;
        bubble.innerHTML = role === 'ai' ? `✨ ${text}` : text;
        chatThread.appendChild(bubble);
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function processQuery(query) {
        addBubble(query, 'user');
        voiceStatus.textContent = 'Processing...';

        setTimeout(() => {
            const q = query.toLowerCase();
            let response = "I'm sorry, I couldn't process that request.";

            if (q.includes('prioritize')) {
                response = "I have scanned the radar. Prioritizing queue based on upcoming train arrivals now.";
                setTimeout(() => {
                    switchTab('orders');
                    const btn = document.getElementById('btnAutoPrioritize');
                    if(btn) {
                        btn.style.transform = 'scale(0.9)';
                        setTimeout(() => btn.style.transform = 'scale(1)', 150);
                        btn.click();
                    }
                }, 1500);
            } else if (q.includes('revenue') || q.includes('kamai')) {
                response = `Aaj Ki Kamai is exactly ₹${state.totalRevenue.toLocaleString('en-IN')}. We have filled ${state.ordersFilled} orders today. Excellent work!`;
            } else if (q.includes('stock')) {
                const lowStock = inventory.filter(i => getStockLevel(i) !== 'high');
                if (lowStock.length > 0) {
                    response = `WARNING: ${lowStock.map(i => i.name).join(', ')} are running critically low. I will highlight them in the Stock tab.`;
                    setTimeout(() => switchTab('inventory'), 2000);
                } else {
                    response = "All inventory levels are looking healthy right now. Ready for the next rush!";
                }
            } else if (q.includes('rush') || q.includes('activate')) {
                response = "Activating Maximum Rush Mode. Alerting staff and prioritizing the router agent.";
                document.getElementById('rushHourBanner').classList.add('visible');
                setAgentStatus('router', 'ACTIVE', 'active');
                setTimeout(() => updateRushMode(), 3000);
            } else if (q.includes('check trains')) {
                response = `I see ${activeTrains.length} trains approaching. The next is ${activeTrains[0].name} arriving at Platform 3 shortly.`;
            } else {
                response = "I am processing the data. Your platform metrics are looking optimal today.";
            }

            addBubble(response, 'ai');
            stopListening();
        }, 1200);
    }

    orbBtn.addEventListener('click', () => {
        if (state.isListening) {
            stopListening();
        } else {
            startListening();
            // Simulate voice recognition wait time
            setTimeout(() => {
                if (state.isListening) {
                    processQuery('What is today\\'s revenue?');
                }
            }, 3000);
        }
    });

    // FAB shortcut → AI tab
    document.getElementById('btnVoiceShortcut').addEventListener('click', () => {
        switchTab('ai');
        setTimeout(() => startListening(), 300);
        setTimeout(() => {
            if (state.isListening) processQuery('prioritize orders');
        }, 2500);
    });

    // Quick chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            startListening();
            setTimeout(() => processQuery(query), 800);
        });
    });

    // Scanner Widget (Realistic Simulation)
    document.getElementById('scannerWidget').addEventListener('click', () => {
        const modal = document.getElementById('scannerModal');
        modal.classList.add('open');
        
        // Simulate Camera Access & Scanning
        setTimeout(() => {
            if(!modal.classList.contains('open')) return; // if user canceled
            
            // Randomly decide if it's picking up an existing order or getting a new one
            const isPickup = Math.random() > 0.3 && orders.length > 0;
            
            if (isPickup) {
                // Find a ready or preparing order
                const validOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
                if (validOrders.length > 0) {
                    const o = validOrders[0];
                    showToast(`Scanned Ticket: ${o.id} found!`, 'success');
                    modal.classList.remove('open');
                    setTimeout(() => openOrderModal(o.id), 500);
                } else {
                    simulateNewScan(modal);
                }
            } else {
                simulateNewScan(modal);
            }
        }, 2500);
    });

    function simulateNewScan(modal) {
        showToast('Scanned new counter order!', 'success');
        modal.classList.remove('open');
        
        // Add a new instant counter order
        const newOrder = {
            id: `RQ-C${1000 + Math.floor(Math.random() * 900)}`,
            trainNo: "WALK-IN",
            trainName: "Platform Counter",
            fromTo: "Local",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 60, // Quick
            prepTimeMinutes: 1,
            items: [
                { name: "Water Bottle 1L", qty: 2, packed: false },
                { name: "Biscuit Pack", qty: 1, packed: false }
            ],
            status: "Pending",
            source: "QR Scan",
            reallocated: false,
            otp: genOTP(),
            amount: 55,
            coach: "N/A"
        };
        orders.push(newOrder);
        renderOrders();
        logToConsole(`> QR SCANNER: Instant counter order ${newOrder.id} logged.`, 'success');
    }

    // Close Scanner Modal manually
    document.getElementById('closeScannerModal').addEventListener('click', () => {
        document.getElementById('scannerModal').classList.remove('open');
    });

    // ==========================================================================
    // AGENT STATUS HELPER
    // ==========================================================================
    function setAgentStatus(agent, status, badgeClass) {
        const badge = document.getElementById(`agent-status-${agent}`);
        const dot = document.getElementById(`agent-dot-${agent}`);
        if (badge) { badge.textContent = status; badge.className = `agent-badge ${badgeClass}`; }
    }

    // ==========================================================================
    // PLATFORM RADAR ANIMATION
    // ==========================================================================
    function updateRadar() {
        const trains = [
            { id: 'radar-train-12423', etaS: activeTrains[0].etaSeconds },
            { id: 'radar-train-12056', etaS: activeTrains[1].etaSeconds },
            { id: 'radar-train-12952', etaS: activeTrains[2].etaSeconds },
        ];
        trains.forEach(t => {
            const dot = document.getElementById(t.id);
            if (!dot) return;
            // Map eta to position: 2min=far, 0=here (right end ~88%)
            const maxEta = 1200;
            const pct = Math.max(4, 80 - (t.etaS / maxEta) * 76);
            dot.style.left = `${pct}%`;
        });
    }

    // Platform schematic train animation
    function animatePlatformTrains() {
        const slots = [1, 2, 3, 4, 5];
        slots.forEach(n => {
            const slot = document.getElementById(`train-slot-${n}`);
            if (!slot) return;
            // Animate periodically
            setTimeout(() => {
                slot.style.opacity = '1';
                slot.style.left = '4%';
                setTimeout(() => {
                    slot.style.transition = 'left 3s linear, opacity 0.5s';
                    slot.style.left = '75%';
                    setTimeout(() => {
                        slot.style.opacity = '0';
                        slot.style.left = '4%';
                        slot.style.transition = 'none';
                    }, 3200);
                }, 50);
            }, n * 800 + Math.random() * 2000);
        });
    }

    setInterval(animatePlatformTrains, 9000);
    setTimeout(animatePlatformTrains, 2000);

    // ==========================================================================
    // MARQUEE ROTATION
    // ==========================================================================
    const marqueeMessages = [
        "AI dispatcher active — Platform 3 Express lane open · Next train Rajdhani Express in 2min · Stock Agent: Water Bottle alert triggered",
        "Rush Mode standby · 3 active orders in queue · Prioritizer Agent sorting by ETA urgency",
        "Samosa Plate OUT OF STOCK — AI recommending supplier reorder · Chai Flask critically low (3 units)",
        "Jan Shatabdi arriving in 5min · Coach B2 order RQ-1085 must be ready · OTP: " + orders[1].otp,
        "Today's revenue: ₹2,840 · 18 orders filled · 98.4% satisfaction rate · 4 AI-assisted deliveries",
    ];
    let marqueeIdx = 0;
    function rotateMarquee() {
        marqueeIdx = (marqueeIdx + 1) % marqueeMessages.length;
        document.getElementById('liveMarqueeText').textContent = marqueeMessages[marqueeIdx];
    }
    setInterval(rotateMarquee, 28000);

    // ==========================================================================
    // SIMULATED INCOMING ORDER
    // ==========================================================================
    const newOrderNames = [
        { trainName: "Shatabdi Express", trainNo: "12001", fromTo: "NDLS → CNB", coach: "C5", amount: 95 },
        { trainName: "Duronto Express", trainNo: "12213", fromTo: "HWH → NDLS", coach: "A4", amount: 180 },
        { trainName: "Garib Rath", trainNo: "12203", fromTo: "PNBE → NDLS", coach: "S2", amount: 60 },
    ];
    let newOrderIdx = 0;
    
    function triggerLiveOrder() {
        const template = newOrderNames[newOrderIdx % newOrderNames.length];
        newOrderIdx++;
        const newOrder = {
            id: `RQ-${1100 + newOrderIdx}`,
            trainNo: template.trainNo,
            trainName: template.trainName,
            fromTo: template.fromTo,
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 120 + Math.floor(Math.random() * 200),
            prepTimeMinutes: 2,
            items: [
                { name: "Chai (Flask)", qty: 1, packed: false },
                { name: "Veg Cutlet", qty: 2, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express",
            reallocated: false,
            otp: genOTP(),
            amount: template.amount,
            coach: template.coach
        };
        orders.push(newOrder);
        if (state.currentTab === 'orders') renderOrders();
        
        // Sound and visual pop
        showToast(`LIVE ORDER! ${newOrder.trainName} coming to Platform 3!`, 'warning', 5000);
        logToConsole(`> LIVE ORDER RECEIVED: ${newOrder.id} — ${newOrder.trainName} (Coach ${newOrder.coach})`, 'system');
        
        // Brief rush mode activation
        document.getElementById('rushHourBanner').classList.add('visible');
        setTimeout(() => updateRushMode(), 3000);
    }

    // Auto trigger every 60s
    setInterval(triggerLiveOrder, 60000);
    
    // Manual Live Demo Button
    const liveDemoBtn = document.getElementById('btnLiveDemoOrder');
    if (liveDemoBtn) {
        liveDemoBtn.addEventListener('click', () => {
            liveDemoBtn.style.transform = 'scale(0.9)';
            setTimeout(() => liveDemoBtn.style.transform = 'scale(1)', 150);
            triggerLiveOrder();
        });
    }

    // ==========================================================================
    // INITIAL RENDER
    // ==========================================================================
    renderOrders();
    renderInventory();
    updateHandoffTimer();
    updateNextTrainStrip();

    // Startup logs
    setTimeout(() => logToConsole('> RailQuick OS v4 booted. All systems nominal.', 'success'), 500);
    setTimeout(() => logToConsole('> AI Agents: Prioritizer ACTIVE | Router IDLE | Stock MONITORING | Forecaster COMPUTING', 'system'), 1000);
    setTimeout(() => logToConsole('> Train radar linked. 3 trains tracked on P3.', 'info'), 1500);
    setTimeout(() => showToast('RailQuick OS v4 Ready — 3 orders in queue!', 'success'), 2000);

    // Periodic agent status simulation
    setInterval(() => {
        const states = ['IDLE', 'COMPUTING', 'ACTIVE', 'MONITORING'];
        setAgentStatus('router', 'ROUTING', 'processing');
        setTimeout(() => setAgentStatus('router', 'IDLE', 'idle'), 3000);
    }, 30000);

    // Rush mode check on load
    updateRushMode();

    console.log('RailQuick Vendor OS v4 — Premium Edition loaded');
});
