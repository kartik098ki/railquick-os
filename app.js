/* ==========================================================================
   RAILQUICK VENDOR MOBILE OS - STALL ENGINE LOGIC (AUTONOMOUS AI EDITION)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // INITIAL SYSTEM STATES
    // ==========================================================================

    let orders = [
        {
            id: "RQ-1082",
            trainNo: "12423",
            trainName: "Rajdhani Express",
            fromTo: "NDLS ➔ HWH",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 120,
            prepTimeMinutes: 2,
            items: [
                { name: "Chai (Flask)", qty: 2, packed: false },
                { name: "Veg Cutlet", qty: 2, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express (Us)",
            reallocated: false
        },
        {
            id: "RQ-1085",
            trainNo: "12056",
            trainName: "Jan Shatabdi Express",
            fromTo: "DDN ➔ NDLS",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 340,
            prepTimeMinutes: 4,
            items: [
                { name: "Paneer Tikka Roll", qty: 1, packed: false },
                { name: "Water Bottle 1L", qty: 1, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express (Us)",
            reallocated: false
        },
        {
            id: "RQ-1089",
            trainNo: "12952",
            trainName: "Mumbai Rajdhani",
            fromTo: "NDLS ➔ MMCT",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 820,
            prepTimeMinutes: 3,
            items: [
                { name: "Samosa Plate", qty: 3, packed: false },
                { name: "Chai (Flask)", qty: 1, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express (Us)",
            reallocated: false
        }
    ];

    let inventory = [
        { id: 1, name: "Water Bottle 1L", category: "Beverage", stock: 8, minStock: 15, price: 20 },
        { id: 2, name: "Veg Cutlet", category: "Food", stock: 42, minStock: 10, price: 40 },
        { id: 3, name: "Chai (Flask)", category: "Beverage", stock: 3, minStock: 5, price: 30 },
        { id: 4, name: "Paneer Tikka Roll", category: "Food", stock: 25, minStock: 8, price: 120 },
        { id: 5, name: "Samosa Plate", category: "Snack", stock: 0, minStock: 12, price: 35 }
    ];

    let activeTrains = [
        { no: "12423", name: "Rajdhani Exp", platform: 3, eta: 120, status: "On Time" },
        { no: "12260", name: "Duronto Express", platform: 1, eta: 240, status: "On Time" },
        { no: "12056", name: "Jan Shatabdi", platform: 3, eta: 340, status: "On Time" },
        { no: "22416", name: "Vande Bharat", platform: 4, eta: 600, status: "On Time" },
        { no: "12952", name: "Mumbai Rajdhani", platform: 3, eta: 820, status: "On Time" }
    ];

    // Stall Earnings Ledger Model
    let dailyRevenue = 2840.00;
    let ordersFilledCount = 18;
    let aiCommissions = 360.00;

    let statsReallocatedCountVal = 4;
    let customColumns = [];
    let cart = [];
    let prioritizedOrderId = null;

    // ==========================================================================
    // AUDIO SYNTHESIS ENGINE
    // ==========================================================================
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSynthSound(type) {
        initAudio();
        if (!audioCtx) return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'typewriter') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
            osc.start(now);
            osc.stop(now + 0.015);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === 'warning') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(261.63, now); // C4
            osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.35); // C3
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'critical') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.setValueAtTime(0, now + 0.08);
            gain.gain.setValueAtTime(0.05, now + 0.16);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        }
    }

    function speakAlert(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
        }
    }

    // ==========================================================================
    // TOAST NOTIFICATIONS
    // ==========================================================================
    const toastContainer = document.getElementById("toastContainer");
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let emoji = "⚡";
        if (type === "success") emoji = "✓";
        if (type === "warning") emoji = "⚠️";
        if (type === "danger") emoji = "🚨";
        
        toast.innerHTML = `<span>${emoji}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = "toastSlideUp 0.3s ease-in reverse forwards";
            setTimeout(() => { toast.remove(); }, 300);
        }, 4000);
    }

    // ==========================================================================
    // STALL LEDGER RENDERER
    // ==========================================================================
    const salesTotalRevenue = document.getElementById("salesTotalRevenue");
    const salesOrdersFilled = document.getElementById("salesOrdersFilled");
    const salesAiCommissions = document.getElementById("salesAiCommissions");

    function renderLedger() {
        if (salesTotalRevenue) salesTotalRevenue.textContent = `₹${dailyRevenue.toFixed(2)}`;
        if (salesOrdersFilled) salesOrdersFilled.textContent = ordersFilledCount;
        if (salesAiCommissions) salesAiCommissions.textContent = statsReallocatedCountVal;
    }

    // ==========================================================================
    // BOTTOM NAVIGATION SYSTEM
    // ==========================================================================
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
    const tabViews = document.querySelectorAll(".tab-view");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            playSynthSound('click');
            const targetTab = item.getAttribute("data-tab");
            
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            tabViews.forEach(view => {
                view.classList.remove("active");
                if (view.id === `tab-${targetTab}`) {
                    view.classList.add("active");
                }
            });
        });
    });

    // ==========================================================================
    // TIMETABLE TIMELINES RENDERER
    // ==========================================================================
    const upcomingTrainsList = document.getElementById("upcomingTrainsList");

    function renderTimetable() {
        if (!upcomingTrainsList) return;
        upcomingTrainsList.innerHTML = "";

        activeTrains.forEach(train => {
            // ONLY SHOW OUR STALL'S PLATFORM (PLATFORM 3)
            if (train.platform !== 3) return;

            const isRescheduled = train.status === "Rescheduled";
            const rowClass = isRescheduled ? "train-timetable-row rescheduled-row" : "train-timetable-row";
            
            let etaString = "Arrived";
            if (train.eta > 0) {
                const min = Math.floor(train.eta / 60);
                const sec = train.eta % 60;
                etaString = `${min}m ${sec}s`;
            }

            const row = document.createElement("div");
            row.className = rowClass;
            row.innerHTML = `
                <span class="tt-train">${train.no} - ${train.name}</span>
                <span class="tt-plat">P${train.platform}</span>
                <span class="tt-eta">${etaString}</span>
                <span class="tt-status ${train.status.replace(" ", "").toLowerCase()}">${train.status}</span>
            `;
            upcomingTrainsList.appendChild(row);
        });
    }

    // ==========================================================================
    // ORDERS QUEUE LOGIC
    // ==========================================================================
    const statsPendingCount = document.getElementById("statsPendingCount");
    const statsUrgentCount = document.getElementById("statsUrgentCount");
    const statsReallocatedCount = document.getElementById("statsReallocatedCount");
    const activeOrdersBadge = document.getElementById("activeOrdersBadge");
    const activeOrdersContainer = document.getElementById("active-orders-container");

    function renderOrders() {
        if (!activeOrdersContainer) return;
        activeOrdersContainer.innerHTML = "";
        
        let pendingCount = 0;
        let urgentCount = 0;

        orders.forEach(order => {
            if (order.status === "Delivered" || order.status === "Relocated") return;
            // ONLY SHOW ORDERS SCHEDULED FOR OUR PLATFORM (PLATFORM 3)
            if (order.actualPlatform !== 3) return;
            
            pendingCount++;
            const isUrgent = order.etaSeconds <= 300; 
            if (isUrgent) urgentCount++;

            const etaMin = Math.floor(order.etaSeconds / 60);
            const etaSec = order.etaSeconds % 60;
            const etaString = `${etaMin}m ${etaSec}s`;

            const itemSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(", ");
            let cardClass = isUrgent ? "critical" : "upcoming";
            if (prioritizedOrderId === order.id) {
                cardClass += " prioritized-highlight";
            }

            const card = document.createElement("div");
            card.className = `order-touch-card ${cardClass}`;
            card.innerHTML = `
                <div class="card-header-row">
                    <span class="order-id-lbl">${order.id}</span>
                    <span class="train-badge-lbl">${order.trainNo} - ${order.trainName}</span>
                </div>
                <div class="card-details-block">
                    <div class="card-items-summary">${itemSummary}</div>
                    <div class="runner-meta-row">
                        <span>Platform ${order.actualPlatform}</span>
                        <span>ETA: ${etaString}</span>
                    </div>
                </div>
                <div class="card-actions-row">
                    <button class="card-btn pack" data-id="${order.id}">PACK</button>
                    <button class="card-btn ready" data-id="${order.id}">READY</button>
                    <button class="card-btn reallocate" data-id="${order.id}">REALLOCATE</button>
                </div>
            `;
            activeOrdersContainer.appendChild(card);
        });

        // Update stats
        if (statsPendingCount) statsPendingCount.textContent = pendingCount;
        if (statsUrgentCount) statsUrgentCount.textContent = urgentCount;
        if (statsReallocatedCount) statsReallocatedCount.textContent = statsReallocatedCountVal;
        if (activeOrdersBadge) activeOrdersBadge.textContent = pendingCount;

        // Card button actions
        document.querySelectorAll(".card-btn.pack").forEach(btn => {
            btn.addEventListener("click", () => {
                playSynthSound('click');
                const id = btn.getAttribute("data-id");
                showToast(`Order ${id} packaging started`, "info");
            });
        });

        document.querySelectorAll(".card-btn.ready").forEach(btn => {
            btn.addEventListener("click", () => {
                playSynthSound('success');
                const id = btn.getAttribute("data-id");
                const order = orders.find(o => o.id === id);
                orders = orders.filter(o => o.id !== id);
                
                // Add order values to Daily Sales Ledger
                if (order) {
                    let orderSum = 0;
                    order.items.forEach(item => {
                        const invItem = inventory.find(i => i.name === item.name);
                        if (invItem) orderSum += invItem.price * item.qty;
                    });
                    if (orderSum === 0) orderSum = 120; // default minimum
                    dailyRevenue += orderSum;
                    ordersFilledCount++;
                    renderLedger();
                }

                showToast(`Order ${id} is ready for dispatch!`, "success");
                renderOrders();
            });
        });

        document.querySelectorAll(".card-btn.reallocate").forEach(btn => {
            btn.addEventListener("click", () => {
                playSynthSound('warning');
                const id = btn.getAttribute("data-id");
                orders = orders.filter(o => o.id !== id);
                statsReallocatedCountVal++;
                
                // Earn reallocated commission refund
                dailyRevenue += 120.00;
                aiCommissions += 18.00;
                renderLedger();

                showToast(`AI REALLOCATION: Order ${id} shifted to partner stall.`, "warning");
                renderOrders();
            });
        });
    }

    // Active counts loops
    setInterval(() => {
        let rerender = false;
        
        // Countdown train arrivals
        activeTrains.forEach(train => {
            if (train.eta > 0) {
                train.eta--;
                rerender = true;
            }
        });

        // Countdown orders ETA
        orders.forEach(order => {
            if (order.status !== "Delivered" && order.status !== "Relocated" && order.etaSeconds > 0) {
                order.etaSeconds--;
                rerender = true;

                if (order.etaSeconds === 300) {
                    playSynthSound('critical');
                    speakAlert(`Train ${order.trainNo} arriving in 5 minutes.`);
                    showToast(`🚨 Urgent: Train ${order.trainNo} arriving in 5 mins!`, "danger");
                }
                
                if (order.etaSeconds === 0) {
                    order.status = "Relocated";
                    playSynthSound('warning');
                    showToast(`Order ${order.id} expired.`, "danger");
                }
            }
        });

        if (rerender) {
            renderOrders();
            renderTimetable();
        }
    }, 1000);

    // ==========================================================================
    // AUTONOMOUS AI RELOCATION SIMULATOR
    // ==========================================================================
    // AI autonomously reschedules platforms and reallocates orders every 32 seconds!
    let simulationState = 0;
    
    setInterval(() => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        if (simulationState === 0) {
            // Shift train Jan Shatabdi (12056) from Platform 3 to Platform 5
            const janShatabdi = activeTrains.find(t => t.no === "12056");
            if (janShatabdi) {
                janShatabdi.platform = 5;
                janShatabdi.status = "Rescheduled";
                
                playSynthSound('warning');
                speakAlert("AI Alert. Platform rescheduled. Jan Shatabdi shifted to platform 5.");
                addLogEntry(time, "Rescheduled: Jan Shatabdi platform shifted 3 ➔ 5.", "warning");
                
                // Auto-relocate Jan Shatabdi order
                const orderIdx = orders.findIndex(o => o.trainNo === "12056");
                if (orderIdx !== -1) {
                    const order = orders[orderIdx];
                    order.status = "Relocated";
                    
                    setTimeout(() => {
                        addLogEntry(time, `AI AUTO-ROUTER: Order ${order.id} reallocated to Platform 5 partner vendor due to proximity delay risk.`, "danger");
                        showToast(`AI ROUTING: Order ${order.id} transferred to P5 partner.`, "warning");
                        
                        statsReallocatedCountVal++;
                        // Credit commission to ledger
                        dailyRevenue += 120.00;
                        aiCommissions += 18.00;
                        renderLedger();

                        orders.splice(orderIdx, 1);
                        renderOrders();
                        renderPlatformMap();
                        renderTimetable();
                    }, 1500);
                }
            }
            simulationState = 1;
        } else if (simulationState === 1) {
            // Shift train Duronto Express (12260) from Platform 1 to Platform 3 (Us!)
            const duronto = activeTrains.find(t => t.no === "12260");
            if (duronto) {
                duronto.platform = 3;
                duronto.status = "Rescheduled";
                
                playSynthSound('success');
                speakAlert("Attention. New order assigned to you from Platform 1 partner.");
                addLogEntry(time, "Rescheduled: Duronto Express platform shifted 1 ➔ 3.", "warning");
                
                setTimeout(() => {
                    const newOrder = {
                        id: "RQ-1095",
                        trainNo: "12260",
                        trainName: "Duronto Express",
                        fromTo: "NDLS ➔ Seat A2-10",
                        scheduledPlatform: 1,
                        actualPlatform: 3,
                        etaSeconds: 240, // 4 mins
                        prepTimeMinutes: 2,
                        items: [{ name: "Veg Cutlet", qty: 1, packed: false }, { name: "Water Bottle 1L", qty: 2, packed: false }],
                        status: "Pending",
                        source: "Platform 1 Partner",
                        reallocated: true
                    };
                    orders.push(newOrder);
                    
                    addLogEntry(time, `AI AUTO-ROUTER: Order ${newOrder.id} reallocated TO Platform 3 Express (Us) from Platform 1 partner.`, "success");
                    showToast(`✨ AI ASSIGNMENT: Order ${newOrder.id} transferred to you!`, "success");
                    
                    renderOrders();
                    renderPlatformMap();
                    renderTimetable();
                }, 1500);
            }
            simulationState = 2;
        } else {
            // Reset simulation states back to default schedules
            const janShatabdi = activeTrains.find(t => t.no === "12056");
            if (janShatabdi) {
                janShatabdi.platform = 3;
                janShatabdi.status = "On Time";
                janShatabdi.eta = 340;
            }
            const duronto = activeTrains.find(t => t.no === "12260");
            if (duronto) {
                duronto.platform = 1;
                duronto.status = "On Time";
                duronto.eta = 240;
            }
            
            orders = orders.filter(o => o.id !== "RQ-1095");
            if (!orders.some(o => o.trainNo === "12056")) {
                orders.push({
                    id: "RQ-1085",
                    trainNo: "12056",
                    trainName: "Jan Shatabdi Express",
                    fromTo: "DDN ➔ NDLS",
                    scheduledPlatform: 3,
                    actualPlatform: 3,
                    etaSeconds: 340,
                    prepTimeMinutes: 4,
                    items: [{ name: "Paneer Tikka Roll", qty: 1, packed: false }, { name: "Water Bottle 1L", qty: 1, packed: false }],
                    status: "Pending",
                    source: "Platform 3 Express (Us)",
                    reallocated: false
                });
            }

            playSynthSound('click');
            addLogEntry(time, "Simulator loop restarted. Tracks reset to initial schedule.", "system");
            
            renderOrders();
            renderPlatformMap();
            renderTimetable();
            simulationState = 0;
        }
    }, 32000);

    // Helper trigger simulator button link mapping (leaves click triggers mapping)
    if (btnSimulatePlatChange) {
        btnSimulatePlatChange.addEventListener("click", () => {
            playSynthSound('click');
            showToast("Force triggering next AI relocation event...", "info");
        });
    }

    // ==========================================================================
    // POS CHECKOUT CART MOTOR
    // ==========================================================================
    const productTiles = document.querySelectorAll(".product-tile");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartTotalVal = document.getElementById("cartTotalVal");
    const btnClearCart = document.getElementById("btnClearCart");
    const btnPlaceOrder = document.getElementById("btnPlaceOrder");
    const cartTrainSelect = document.getElementById("cartTrainSelect");
    const cartRunnerSelect = document.getElementById("cartRunnerSelect");
    const cartSeatInput = document.getElementById("cartSeatInput");

    productTiles.forEach(tile => {
        tile.addEventListener("click", () => {
            playSynthSound('click');
            const name = tile.getAttribute("data-name");
            const price = parseFloat(tile.getAttribute("data-price"));
            const emoji = tile.getAttribute("data-emoji");
            
            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1, emoji });
            }
            renderCart();
        });
    });

    function renderCart() {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = "";
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<div class="cart-empty-text">Basket is empty. Tap products to add.</div>';
            cartTotalVal.textContent = "₹0";
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            
            const row = document.createElement("div");
            row.className = "cart-item-row";
            row.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.emoji}</span>
                    <span>${item.name}</span>
                </div>
                <div class="cart-item-qty-actions">
                    <span class="qty-btn dec-qty" data-name="${item.name}">-</span>
                    <span>${item.qty}</span>
                    <span class="qty-btn inc-qty" data-name="${item.name}">+</span>
                    <span class="cart-item-total">₹${itemTotal}</span>
                </div>
            `;
            cartItemsList.appendChild(row);
        });

        cartTotalVal.textContent = `₹${total}`;

        // Bind incremental actions
        document.querySelectorAll(".dec-qty").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                playSynthSound('click');
                const name = btn.getAttribute("data-name");
                const item = cart.find(i => i.name === name);
                if (item) {
                    item.qty--;
                    if (item.qty === 0) {
                        cart = cart.filter(i => i.name !== name);
                    }
                    renderCart();
                }
            });
        });

        document.querySelectorAll(".inc-qty").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                playSynthSound('click');
                const name = btn.getAttribute("data-name");
                const item = cart.find(i => i.name === name);
                if (item) {
                    item.qty++;
                    renderCart();
                }
            });
        });
    }

    if (btnClearCart) {
        btnClearCart.addEventListener("click", () => {
            playSynthSound('click');
            cart = [];
            renderCart();
        });
    }

    if (btnPlaceOrder) {
        btnPlaceOrder.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Your cart is empty!", "warning");
                return;
            }

            const train = cartTrainSelect.value;
            const runner = cartRunnerSelect.value;
            const seat = cartSeatInput.value.trim() || "Gen coach";

            let orderPrice = 0;
            cart.forEach(i => { orderPrice += i.price * i.qty; });

            const newOrder = {
                id: "RQ-" + Math.floor(1000 + Math.random() * 9000),
                trainNo: train,
                trainName: activeTrains.find(t => t.no === train)?.name || "Express",
                fromTo: `NDLS ➔ Seat ${seat}`,
                scheduledPlatform: 3,
                actualPlatform: 3,
                etaSeconds: 300, // 5 mins
                prepTimeMinutes: 2,
                items: cart.map(i => ({ name: i.name, qty: i.qty, packed: false })),
                status: "Pending",
                source: "Stall POS Checkout",
                reallocated: false
            };

            orders.push(newOrder);
            cart = [];
            cartSeatInput.value = "";
            renderCart();
            
            playSynthSound('success');
            speakAlert(`Order ${newOrder.id} dispatched to runner ${runner}`);
            showToast(`Order ${newOrder.id} generated! Runner ${runner} alerted.`, "success");

            // Redirect nav
            const ordersTabBtn = document.querySelector('[data-tab="orders"]');
            if (ordersTabBtn) ordersTabBtn.click();
            renderOrders();
        });
    }

    // ==========================================================================
    // PLATFORM MAP SCHEMATIC
    // ==========================================================================
    function renderPlatformMap() {
        for (let i = 1; i <= 5; i++) {
            const slot = document.getElementById(`train-slot-${i}`);
            if (slot) {
                slot.innerHTML = "";
                slot.className = "mini-train-slot";
            }
        }

        activeTrains.forEach(train => {
            const slot = document.getElementById(`train-slot-${train.platform}`);
            if (slot) {
                slot.className = "mini-train-slot active";
                slot.innerHTML = `<span style="color:#ffffff; font-size:8px; display:block; padding:1px 4px;">🚆 ${train.no}</span>`;
            }
        });
    }

    function addLogEntry(time, text, type) {
        const logsBox = document.getElementById("relocationLogs");
        if (!logsBox) return;
        const entry = document.createElement("div");
        entry.className = `mini-log ${type}`;
        entry.innerHTML = `<strong>[${time}]</strong> ${text}`;
        logsBox.prepend(entry);
    }

    // ==========================================================================
    // STALL INVENTORY LOGIC
    // ==========================================================================
    const inventoryTableBody = document.getElementById("inventoryTableBody");
    const inventorySearchInput = document.getElementById("inventorySearch");
    const btnRestockAll = document.getElementById("btnRestockAll");
    const restockRecommendation = document.getElementById("restockRecommendation");
    
    const btnAddNewItem = document.getElementById("btnAddNewItem");
    const addItemModal = document.getElementById("addItemModal");
    const closeItemModal = document.getElementById("closeItemModal");
    const cancelAddItem = document.getElementById("cancelAddItem");
    const addItemForm = document.getElementById("addItemForm");

    function renderInventoryHeader() {
        const headerRow = document.getElementById("inventoryTableHeaderRow");
        if (!headerRow) return;
        
        let html = `
            <th data-prop="name">Name</th>
            <th data-prop="category">Category</th>
            <th data-prop="stock">Stock Level</th>
            <th data-prop="price">Price</th>
            <th data-prop="status">Status</th>
        `;
        
        customColumns.forEach((col, idx) => {
            html += `
                <th data-prop="${col.name}" class="custom-column-th" style="position: relative;">
                    ${col.type === 'number' ? '🔢' : col.type === 'select' ? '🏷️' : '🔤'} ${col.name}
                    <span class="delete-col-btn" style="margin-left: 6px; cursor: pointer; opacity: 0.6;" data-index="${idx}">×</span>
                </th>
            `;
        });
        
        html += `
            <th id="thAddColumn" class="add-column-header">＋ Add Column</th>
            <th>Actions</th>
        `;
        headerRow.innerHTML = html;
        
        const thAddCol = document.getElementById("thAddColumn");
        if (thAddCol) {
            thAddCol.addEventListener("click", (e) => {
                e.stopPropagation();
                playSynthSound('click');
                const rect = thAddCol.getBoundingClientRect();
                const popover = document.getElementById("addColumnPopover");
                popover.style.display = "block";
                popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
                popover.style.left = `${rect.left + window.scrollX - 100}px`;
            });
        }
        
        headerRow.querySelectorAll(".delete-col-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute("data-index"));
                const name = customColumns[idx].name;
                customColumns.splice(idx, 1);
                inventory.forEach(item => delete item[name]);
                
                playSynthSound('click');
                showToast(`Removed database property "${name}"`, "warning");
                renderInventoryHeader();
                renderInventory();
            });
        });
    }

    function renderInventory() {
        if (!inventoryTableBody) return;
        inventoryTableBody.innerHTML = "";
        const query = inventorySearchInput.value.toLowerCase();
        let lowStockCount = 0;

        inventory.forEach(item => {
            if (query && !item.name.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query)) return;

            let statusClass = "in-stock";
            let statusText = "In Stock";
            let fillClass = "";
            const fillPct = Math.min(100, Math.round((item.stock / item.minStock) * 100));

            if (item.stock === 0) {
                statusClass = "out-of-stock";
                statusText = "Out of Stock";
                fillClass = "out";
                lowStockCount++;
            } else if (item.stock <= item.minStock) {
                statusClass = "low-stock";
                statusText = "Low Stock";
                fillClass = "low";
                lowStockCount++;
            }

            let customColsHtml = "";
            customColumns.forEach(col => {
                const val = item[col.name] !== undefined ? item[col.name] : "";
                customColsHtml += `
                    <td class="editable-cell" data-item-id="${item.id}" data-prop="${col.name}" data-type="${col.type}">
                        ${col.type === 'select' && val ? `<span class="notion-tag pink">${val}</span>` : val}
                    </td>
                `;
            });

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="editable-cell" data-item-id="${item.id}" data-prop="name" data-type="text" style="font-weight: 600;">📦 ${item.name}</td>
                <td class="editable-cell" data-item-id="${item.id}" data-prop="category" data-type="text" style="color: var(--text-muted);">${item.category}</td>
                <td>
                    <div class="stock-indicator-wrapper">
                        <span class="editable-cell" data-item-id="${item.id}" data-prop="stock" data-type="number" style="font-weight:700; width:24px; text-align:right; border-bottom: 1px dashed var(--border-strong); padding: 0 4px;">${item.stock}</span>
                        <div class="stock-bar-bg">
                            <div class="stock-bar-fill ${fillClass}" style="width: ${fillPct}%"></div>
                        </div>
                        <span style="font-size:10px; color:var(--text-muted)">Min: ${item.minStock}</span>
                    </div>
                </td>
                <td class="editable-cell" data-item-id="${item.id}" data-prop="price" data-type="number" style="font-weight: 500;">₹${item.price}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                ${customColsHtml}
                <td>
                    <button class="table-action-btn btn-stock-up" data-item-id="${item.id}" title="Restock +10">➕</button>
                </td>
            `;
            inventoryTableBody.appendChild(tr);
        });

        if (lowStockCount > 0) {
            restockRecommendation.style.display = "flex";
            const lowItems = inventory.filter(i => i.stock <= i.minStock).map(i => i.name).join(", ");
            document.getElementById("restockText").innerHTML = `AI predicts high passenger demand for <strong>${lowItems}</strong> due to delayed trains. Tap below to restock.`;
        } else {
            restockRecommendation.style.display = "none";
        }

        document.querySelectorAll(".btn-stock-up").forEach(btn => {
            btn.addEventListener("click", () => {
                playSynthSound('click');
                const id = parseInt(btn.getAttribute("data-item-id"));
                const item = inventory.find(i => i.id === id);
                if (item) {
                    item.stock += 10;
                    showToast(`Restocked 10 units of ${item.name}`, "success");
                    renderInventory();
                }
            });
        });
    }

    // Double click inline cell edit
    if (inventoryTableBody) {
        inventoryTableBody.addEventListener("dblclick", (e) => {
            const cell = e.target.closest(".editable-cell");
            if (!cell) return;
            if (cell.querySelector(".cell-edit-input")) return;
            
            const itemId = parseInt(cell.getAttribute("data-item-id"));
            const prop = cell.getAttribute("data-prop");
            const type = cell.getAttribute("data-type") || "text";
            const item = inventory.find(i => i.id === itemId);
            if (!item) return;
            
            playSynthSound('click');
            const originalVal = item[prop] !== undefined ? item[prop] : "";
            
            const input = document.createElement("input");
            input.className = "cell-edit-input";
            input.value = originalVal;
            if (type === "number") input.type = "number";
            
            cell.innerHTML = "";
            cell.appendChild(input);
            input.focus();
            input.select();
            
            let hasSaved = false;
            function saveCellVal() {
                if (hasSaved) return;
                hasSaved = true;
                
                let newVal = input.value.trim();
                if (type === "number") {
                    newVal = parseFloat(newVal) || 0;
                }
                
                item[prop] = newVal;
                playSynthSound('success');
                showToast(`Saved database property "${prop}" as "${newVal}"`, "success");
                renderInventory();
            }

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    saveCellVal();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    hasSaved = true;
                    renderInventory();
                }
            });
            input.addEventListener("blur", saveCellVal);
        });
    }

    if (btnRestockAll) {
        btnRestockAll.addEventListener("click", () => {
            playSynthSound('success');
            inventory.forEach(item => {
                if (item.stock <= item.minStock) item.stock += 25;
            });
            showToast("AI Auto-Restock: Replenished safety stock levels!", "success");
            renderInventory();
        });
    }

    if (inventorySearchInput) inventorySearchInput.addEventListener("input", renderInventory);

    if (btnAddNewItem) btnAddNewItem.addEventListener("click", () => addItemModal.classList.add("active"));
    if (closeItemModal) closeItemModal.addEventListener("click", () => addItemModal.classList.remove("active"));
    if (cancelAddItem) cancelAddItem.addEventListener("click", () => addItemModal.classList.remove("active"));

    if (addItemForm) {
        addItemForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newItem = {
                id: inventory.length + 1,
                name: document.getElementById("itemName").value,
                category: document.getElementById("itemCategory").value,
                stock: parseInt(document.getElementById("itemStock").value),
                minStock: parseInt(document.getElementById("itemMinStock").value),
                price: parseFloat(document.getElementById("itemPrice").value)
            };
            inventory.push(newItem);
            addItemModal.classList.remove("active");
            addItemForm.reset();
            
            playSynthSound('success');
            showToast(`Added ${newItem.name} to stocks database.`, "success");
            renderInventory();
        });
    }

    // Dynamic Columns Creator popover
    const addColumnPopover = document.getElementById("addColumnPopover");
    const btnCreateColumn = document.getElementById("btnCreateColumn");
    const newColName = document.getElementById("newColName");
    const newColType = document.getElementById("newColType");

    if (btnCreateColumn) {
        btnCreateColumn.addEventListener("click", () => {
            const name = newColName.value.trim();
            const type = newColType.value;
            
            if (!name) {
                showToast("Please enter a column property name", "warning");
                return;
            }

            customColumns.push({ name, type });
            inventory.forEach(item => {
                item[name] = type === 'number' ? 0 : type === 'select' ? '' : '—';
            });

            newColName.value = "";
            addColumnPopover.style.display = "none";

            playSynthSound('success');
            showToast(`Added Database property "${name}"`, "success");
            renderInventoryHeader();
            renderInventory();
        });
    }

    // ==========================================================================
    // NOTION SYNC DESK CONFIG & INTERACTIVE TERMINAL
    // ==========================================================================
    let notionConfig = {
        mode: localStorage.getItem("notion_sync_mode") === "real",
        apiKey: localStorage.getItem("notion_api_key") || "",
        ordersDbId: localStorage.getItem("notion_orders_db_id") || "",
        inventoryDbId: localStorage.getItem("notion_inventory_db_id") || "",
        parentPageId: localStorage.getItem("notion_parent_page_id") || ""
    };

    const notionSyncBtn = document.getElementById("notionSyncBtn");
    const notionSyncModal = document.getElementById("notionSyncModal");
    const syncProgressFill = document.getElementById("syncProgressFill");
    const syncModalText = document.getElementById("syncModalText");

    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const notionIntegrationMode = document.getElementById("notionIntegrationMode");
    const integrationModeLabel = document.getElementById("integrationModeLabel");
    const realNotionFields = document.getElementById("realNotionFields");

    const notionApiKeyInput = document.getElementById("notionApiKey");
    const notionOrdersDbInput = document.getElementById("notionOrdersDbId");
    const notionInventoryDbInput = document.getElementById("notionInventoryDbId");
    const notionParentPageInput = document.getElementById("notionParentPageId");

    const apiTerminalBody = document.getElementById("apiTerminalBody");
    const btnClearTerminal = document.getElementById("btnClearTerminal");

    function logApi(message, type = "system") {
        if (!apiTerminalBody) return;
        const line = document.createElement("div");
        line.className = `terminal-line ${type}`;
        
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
        
        line.innerHTML = `<span style="color: #52525b;">[${timeStr}]</span> ${message}`;
        apiTerminalBody.appendChild(line);
        apiTerminalBody.scrollTop = apiTerminalBody.scrollHeight;
    }

    function loadConfigInputs() {
        if (notionIntegrationMode) {
            notionIntegrationMode.checked = notionConfig.mode;
            integrationModeLabel.textContent = notionConfig.mode ? "Real Notion API Mode (Live Web Requests)" : "Mock Sync (Interactive Console)";
            realNotionFields.style.display = notionConfig.mode ? "block" : "none";
            
            notionApiKeyInput.value = notionConfig.apiKey;
            notionOrdersDbInput.value = notionConfig.ordersDbId;
            notionInventoryDbInput.value = notionConfig.inventoryDbId;
            notionParentPageInput.value = notionConfig.parentPageId;
        }
    }

    loadConfigInputs();

    if (notionIntegrationMode) {
        notionIntegrationMode.addEventListener("change", () => {
            playSynthSound('click');
            const checked = notionIntegrationMode.checked;
            integrationModeLabel.textContent = checked ? "Real Notion API Mode (Live Web Requests)" : "Mock Sync (Interactive Console)";
            realNotionFields.style.display = checked ? "block" : "none";
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            playSynthSound('success');
            notionConfig.mode = notionIntegrationMode.checked;
            notionConfig.apiKey = notionApiKeyInput.value.trim();
            notionConfig.ordersDbId = notionOrdersDbInput.value.trim();
            notionConfig.inventoryDbId = notionInventoryDbInput.value.trim();
            notionConfig.parentPageId = notionParentPageInput.value.trim();
            
            localStorage.setItem("notion_sync_mode", notionConfig.mode ? "real" : "mock");
            localStorage.setItem("notion_api_key", notionConfig.apiKey);
            localStorage.setItem("notion_orders_db_id", notionConfig.ordersDbId);
            localStorage.setItem("notion_inventory_db_id", notionConfig.inventoryDbId);
            localStorage.setItem("notion_parent_page_id", notionConfig.parentPageId);
            
            showToast("Settings saved to local storage", "success");
            logApi(`Configuration updated. Integration Mode: ${notionConfig.mode ? "REAL API" : "MOCK SYNC"}`, "system");
        });
    }

    if (btnClearTerminal) {
        btnClearTerminal.addEventListener("click", () => {
            playSynthSound('click');
            apiTerminalBody.innerHTML = '<div class="terminal-line system">Logs cleared.</div>';
        });
    }

    if (notionSyncBtn) {
        notionSyncBtn.addEventListener("click", () => {
            playSynthSound('click');
            notionSyncModal.classList.add("active");
            syncProgressFill.style.width = "0%";
            syncModalText.textContent = "Connecting to Notion databases...";
            
            logApi("Starting Notion Cloud Synchronization loop...", "system");
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                syncProgressFill.style.width = `${progress}%`;
                
                if (progress === 20) {
                    syncModalText.textContent = "Uploading Inventory database...";
                    logApi("Uploading Inventory state database...", "system");
                    const item = inventory[0];
                    const payload = {
                        parent: { database_id: notionConfig.inventoryDbId || "mock_inventory_db_id" },
                        properties: {
                            "Name": { title: [{ text: { content: item.name } }] },
                            "Stock": { number: item.stock },
                            "Price": { number: item.price }
                        }
                    };
                    logApi("POST https://api.notion.com/v1/pages", "request");
                    logApi(`Payload:\n${JSON.stringify(payload, null, 2)}`, "payload");
                    
                } else if (progress === 60) {
                    syncModalText.textContent = "Pushing Live Order timeline logs...";
                    logApi("Pushing active orders logs...", "system");
                    const order = orders[0] || { id: "RQ-1082", trainNo: "12423", status: "Pending" };
                    const payload = {
                        parent: { database_id: notionConfig.ordersDbId || "mock_orders_db_id" },
                        properties: {
                            "Order ID": { title: [{ text: { content: order.id } }] },
                            "Train No": { rich_text: [{ text: { content: order.trainNo } }] },
                            "Status": { select: { name: order.status } }
                        }
                    };
                    logApi("POST https://api.notion.com/v1/pages", "request");
                    logApi(`Payload:\n${JSON.stringify(payload, null, 2)}`, "payload");
                    
                } else if (progress >= 100) {
                    clearInterval(interval);
                    
                    if (notionConfig.mode && notionConfig.apiKey && notionConfig.inventoryDbId) {
                        logApi("Querying live endpoint at Notion...", "system");
                        fetch(`https://api.notion.com/v1/databases/${notionConfig.inventoryDbId}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${notionConfig.apiKey}`,
                                "Notion-Version": "2022-06-28"
                            }
                        })
                        .then(res => {
                            logApi(`[Response] ${res.status} ${res.statusText}`, "response");
                            finishSync();
                        })
                        .catch(() => {
                            logApi(`[CORS Blocked] browser CORS restricted access direct. Payloads logged successfully.`, "error");
                            finishSync();
                        });
                    } else {
                        setTimeout(() => {
                            logApi("[Response] 200 OK. Notion DB synced successfully.", "response");
                            finishSync();
                        }, 400);
                    }
                }
            }, 250);

            function finishSync() {
                setTimeout(() => {
                    notionSyncModal.classList.remove("active");
                    playSynthSound('success');
                    showToast("Workspace tables successfully synchronized with Notion!", "success");
                }, 300);
            }
        });
    }

    // ==========================================================================
    // NOTION AI ASSISTANT DRAWER SHEET
    // ==========================================================================
    const btnNotionAI = document.getElementById("btnNotionAI");
    const aiDrawerOverlay = document.getElementById("aiDrawerOverlay");
    const btnCloseAiDrawer = document.getElementById("btnCloseAiDrawer");
    const aiCustomPrompt = document.getElementById("aiCustomPrompt");
    const btnSubmitAiPrompt = document.getElementById("btnSubmitAiPrompt");
    const editorContent = document.getElementById("editorContent");
    const btnCopyNote = document.getElementById("btnCopyNote");

    if (btnNotionAI) {
        btnNotionAI.addEventListener("click", () => {
            playSynthSound('click');
            aiDrawerOverlay.classList.add("active");
        });
    }

    if (btnCloseAiDrawer) {
        btnCloseAiDrawer.addEventListener("click", () => {
            playSynthSound('click');
            aiDrawerOverlay.classList.remove("active");
        });
    }

    if (aiDrawerOverlay) {
        aiDrawerOverlay.addEventListener("click", (e) => {
            if (e.target === aiDrawerOverlay) {
                playSynthSound('click');
                aiDrawerOverlay.classList.remove("active");
            }
        });
    }

    document.querySelectorAll(".ai-preset-option").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            runNotionAI(action);
        });
    });

    if (aiCustomPrompt) {
        aiCustomPrompt.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const prompt = aiCustomPrompt.value.trim();
                if (prompt) runNotionAI("custom", prompt);
            }
        });
    }

    if (btnSubmitAiPrompt) {
        btnSubmitAiPrompt.addEventListener("click", () => {
            const prompt = aiCustomPrompt.value.trim();
            if (prompt) runNotionAI("custom", prompt);
        });
    }

    function runNotionAI(action, customPrompt) {
        playSynthSound('click');
        showToast("Notion AI generating text...", "info");
        let htmlBlock = "";

        if (action === "summary") {
            const itemsSummary = orders.map(o => `<li><strong>Order ${o.id}</strong> (Train: ${o.trainNo}) is ${o.status}.</li>`).join("");
            htmlBlock = `
                <h2>Operational Shift Handover summary</h2>
                <hr>
                <p><strong>Notion AI Summary:</strong> Daily Sales Total: ₹${dailyRevenue.toFixed(2)} across ${ordersFilledCount} deliveries. AI Commissions: ₹${aiCommissions.toFixed(2)}.</p>
                <ul>
                    ${itemsSummary || "<li>No active orders currently.</li>"}
                </ul>
            `;
        } else if (action === "shortage") {
            const lowStocks = inventory.filter(i => i.stock <= i.minStock);
            const itemsSummary = lowStocks.map(i => `<li><strong>${i.name}</strong>: Current stock ${i.stock} (Min: ${i.minStock}).</li>`).join("");
            htmlBlock = `
                <h2>Stall Procurement Restock List</h2>
                <hr>
                <p>Safety limit warning. Please order:</p>
                <ul>
                    ${itemsSummary || "<li>All stocks are above threshold levels.</li>"}
                </ul>
            `;
        } else if (action === "incident") {
            htmlBlock = `
                <h2>Incident Log: Platform Shift Rerouting</h2>
                <hr>
                <p><strong>AI routing memo:</strong> Platform rescheduled. Train Jan Shatabdi shifted Platform 3 ➔ 5. Auto-shifted orders to partner stall. Refunding credited.</p>
            `;
        } else if (action === "custom") {
            htmlBlock = `
                <p><strong>AI Draft output for prompt: "${customPrompt}"</strong></p>
                <p>Platform stall 3 is running at peak capacity. Daily Sales: ₹${dailyRevenue.toFixed(2)}. Inventory checks matched successfully. All runners online.</p>
            `;
        }

        aiCustomPrompt.value = "";
        streamHtml(htmlBlock);
    }

    function streamHtml(html) {
        if (!editorContent) return;
        editorContent.innerHTML = "";
        
        const tempSpan = document.createElement("span");
        tempSpan.className = "ai-streaming-text";
        editorContent.appendChild(tempSpan);

        const words = html.trim().split(/\s+/);
        let idx = 0;
        
        const timer = setInterval(() => {
            if (idx < words.length) {
                tempSpan.innerHTML += words[idx] + " ";
                idx++;
                playSynthSound('typewriter');
            } else {
                clearInterval(timer);
                tempSpan.remove();
                editorContent.innerHTML = html;
                
                playSynthSound('success');
                showToast("Notion AI draft completed!", "success");
            }
        }, 50);
    }

    if (btnCopyNote) {
        btnCopyNote.addEventListener("click", () => {
            playSynthSound('click');
            const range = document.createRange();
            range.selectNode(editorContent);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            showToast("Note content copied to clipboard!", "success");
        });
    }

    // Close Add Column popover if clicked elsewhere
    document.addEventListener("click", (e) => {
        const popover = document.getElementById("addColumnPopover");
        if (popover && !popover.contains(e.target) && e.target.id !== "thAddColumn") {
            popover.style.display = "none";
        }
    });

    // ==========================================================================
    // AI VOICE ASSISTANT & PRIORITIZATION DESK
    // ==========================================================================
    const btnAutoPrioritize = document.getElementById("btnAutoPrioritize");
    const btnVoiceMic = document.getElementById("btnVoiceMic");
    const voiceStatus = document.getElementById("voiceStatus");
    const voiceTranscript = document.getElementById("voiceTranscript");
    const voiceResponseBubble = document.getElementById("voiceResponseBubble");
    const voiceResponseText = document.getElementById("voiceResponseText");

    // Helper to calculate top priority order based on countdown times
    function getTopPriorityOrder() {
        const activeP3Orders = orders.filter(o => o.actualPlatform === 3 && o.status !== "Delivered" && o.status !== "Relocated");
        if (activeP3Orders.length === 0) return null;
        
        activeP3Orders.sort((a, b) => a.etaSeconds - b.etaSeconds);
        return activeP3Orders[0];
    }

    // Function to speak AI voice response
    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN'; // Indian English accent fits Hinglish well
            utterance.pitch = 1.05;
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }

    // Trigger prioritization highlight & feedback
    function triggerPrioritization() {
        const topOrder = getTopPriorityOrder();
        if (!topOrder) {
            prioritizedOrderId = null;
            renderOrders();
            const reply = "You have no pending orders on Platform 3. All clear!";
            voiceResponseText.textContent = reply;
            voiceResponseBubble.style.display = "block";
            speakText(reply);
            showToast("No pending orders on Platform 3.", "info");
            return;
        }

        prioritizedOrderId = topOrder.id;
        renderOrders();

        const etaMin = Math.floor(topOrder.etaSeconds / 60);
        const englishReply = `Order ${topOrder.id} for ${topOrder.trainName} is your top priority. The train arrives in ${etaMin} minutes. Kripya isey pehle tayyar karein!`;
        
        voiceResponseText.textContent = englishReply;
        voiceResponseBubble.style.display = "block";
        
        // Auto scroll to target card if needed
        setTimeout(() => {
            const cardElem = document.querySelector(`.order-touch-card.prioritized-highlight`);
            if (cardElem) {
                cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);

        speakText(englishReply);
        showToast(`Prioritizing ${topOrder.id} (${etaMin}m ETA)`, "success");
    }

    if (btnAutoPrioritize) {
        btnAutoPrioritize.addEventListener("click", () => {
            playSynthSound('click');
            triggerPrioritization();
        });
    }

    // Speech recognition setup
    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            btnVoiceMic.classList.add("listening");
            voiceStatus.textContent = "Listening to voice command...";
            voiceTranscript.textContent = "Asking AI...";
            playSynthSound('click');
        };

        recognition.onerror = (e) => {
            console.error("Speech Recognition Error:", e);
            btnVoiceMic.classList.remove("listening");
            voiceStatus.textContent = "Voice error or permission denied.";
        };

        recognition.onend = () => {
            btnVoiceMic.classList.remove("listening");
        };

        recognition.onresult = (event) => {
            const resultText = event.results[0][0].transcript;
            voiceTranscript.textContent = `"${resultText}"`;
            processVoiceQuery(resultText);
        };
    }

    function processVoiceQuery(query) {
        const text = query.toLowerCase().trim();
        
        if (text.includes("priorit") || text.includes("pehle") || text.includes("urgent") || text.includes("first") || text.includes("taiyar") || text.includes("kon sa") || text.includes("priority")) {
            triggerPrioritization();
        } else if (text.includes("train") || text.includes("timetable") || text.includes("gaadi") || text.includes("arriving")) {
            const p3Trains = activeTrains.filter(t => t.platform === 3);
            if (p3Trains.length === 0) {
                const reply = "No upcoming trains scheduled on Platform 3 right now.";
                voiceResponseText.textContent = reply;
                voiceResponseBubble.style.display = "block";
                speakText(reply);
            } else {
                const trainNames = p3Trains.map(t => `${t.name} in ${Math.floor(t.eta / 60)} minutes`).join(", and ");
                const reply = `Platform 3 upcoming schedules are: ${trainNames}.`;
                voiceResponseText.textContent = reply;
                voiceResponseBubble.style.display = "block";
                speakText(reply);
            }
        } else if (text.includes("stock") || text.includes("inventory") || text.includes("maal") || text.includes("shortage") || text.includes("kam")) {
            const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
            if (lowStockItems.length === 0) {
                const reply = "All stock levels are optimal. Koee shortage nahi hai.";
                voiceResponseText.textContent = reply;
                voiceResponseBubble.style.display = "block";
                speakText(reply);
            } else {
                const itemNames = lowStockItems.map(i => i.name).join(", ");
                const reply = `Stock alert. Items ${itemNames} are below safety limits. Please restock soon.`;
                voiceResponseText.textContent = reply;
                voiceResponseBubble.style.display = "block";
                speakText(reply);
            }
        } else if (text.includes("hello") || text.includes("namaste") || text.includes("hi ") || text.includes("help") || text.includes("sunona")) {
            const reply = "Hello! Main aapka RailQuick assistant hu. Ask me: 'prioritize orders' or 'stock update'. Main madad ke liye tayyar hu!";
            voiceResponseText.textContent = reply;
            voiceResponseBubble.style.display = "block";
            speakText(reply);
        } else {
            const reply = `Heard: "${query}". Try asking "prioritize orders" or "pehle konsa order banaye?" to check train timings.`;
            voiceResponseText.textContent = reply;
            voiceResponseBubble.style.display = "block";
            speakText(reply);
        }
    }

    if (btnVoiceMic) {
        btnVoiceMic.addEventListener("click", () => {
            if (recognition) {
                try {
                    recognition.start();
                } catch(e) {
                    console.log("Recognition already running", e);
                }
            } else {
                const query = prompt("Speak to AI Agent (Enter voice command text):\n- 'prioritize orders' (Pehle konsa banaye?)\n- 'check trains' (Timetable update)\n- 'stock status' (Inventory levels)");
                if (query) {
                    voiceTranscript.textContent = `"${query}"`;
                    processVoiceQuery(query);
                }
            }
        });
    }

    // ==========================================================================
    // INITIALIZATION RUNS
    // ==========================================================================
    renderOrders();
    renderPlatformMap();
    renderInventoryHeader();
    renderInventory();
    renderTimetable();
    renderLedger();
});
