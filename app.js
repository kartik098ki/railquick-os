/* ==========================================================================
   RAILQUICK VENDOR WORKSPACE - INTERACTIVE LOGIC ENGINE (AI POWERED)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // INITIAL DATA STATES
    // ==========================================================================

    // Mock Active Orders
    let orders = [
        {
            id: "RQ-1082",
            trainNo: "12423",
            trainName: "Rajdhani Express",
            fromTo: "NDLS ➔ HWH",
            scheduledPlatform: 3,
            actualPlatform: 3,
            etaSeconds: 154, // ~2.5 mins
            prepTimeMinutes: 2,
            items: [
                { name: "Chai (Flask)", qty: 2, packed: false },
                { name: "Veg Cutlet", qty: 2, packed: false }
            ],
            status: "Pending", // Pending, Packing, Ready, Delivered, Relocated
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
            etaSeconds: 460, // ~7.6 mins
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
            etaSeconds: 980, // ~16.3 mins
            prepTimeMinutes: 3,
            items: [
                { name: "Samosa Plate", qty: 3, packed: false },
                { name: "Chai (Flask)", qty: 1, packed: false },
                { name: "Water Bottle 1L", qty: 2, packed: false }
            ],
            status: "Pending",
            source: "Platform 3 Express (Us)",
            reallocated: false
        }
    ];

    // Mock Inventory Database
    let inventory = [
        { id: 1, name: "Water Bottle 1L", category: "Beverage", stock: 8, minStock: 15, price: 20 },
        { id: 2, name: "Veg Cutlet", category: "Food", stock: 42, minStock: 10, price: 40 },
        { id: 3, name: "Chai (Flask)", category: "Beverage", stock: 3, minStock: 5, price: 30 },
        { id: 4, name: "Paneer Tikka Roll", category: "Food", stock: 25, minStock: 8, price: 120 },
        { id: 5, name: "Samosa Plate", category: "Snack", stock: 0, minStock: 12, price: 35 }
    ];

    // Mock Active Trains running on platforms
    let activeTrains = [
        { no: "12423", name: "Rajdhani Exp", platform: 3, status: "Arriving" },
        { no: "12056", name: "Jan Shatabdi", platform: 3, status: "Approaching" },
        { no: "12952", name: "Mumbai Rajdhani", platform: 3, status: "Scheduled" },
        { no: "12260", name: "Duronto Express", platform: 1, status: "Scheduled" },
        { no: "22416", name: "Vande Bharat", platform: 4, status: "Scheduled" }
    ];

    // Notion documents
    let documents = [
        {
            id: "doc-1",
            title: "Shift Handover Log",
            icon: "📋",
            content: `<h1>Shift Handover Log - Platform 3 Express</h1><p><strong>Date:</strong> June 21, 2026</p><p><strong>Shift:</strong> Morning (06:00 - 14:00)</p><hr><h2>General Updates</h2><ul><li>Water bottle supplies were low at 09:00, ordered partial restock. Ensure to verify supplier drop at 14:30.</li><li>The POS machine near platform entry is lagging. Please use backup terminal if response time is slow.</li></ul><h2>AI Rerouting Operations</h2><ul><li>Faced 3 rerouting events today. Train 12424 rescheduled to Platform 5. Orders successfully reallocated to Partner Vendor. Total preparation savings: 8 mins.</li><li>Ensure that runners wear active GPS trackers so AI can predict exact running times to different platforms.</li></ul>`
        },
        {
            id: "doc-2",
            title: "Emergency Platform Rerouting Protocol",
            icon: "⚡",
            content: `<h1>Emergency Platform Rerouting Protocol</h1><p>This protocol governs the vendor actions when RailQuick AI announces automated order relocations.</p><hr><h2>1. Inbound Order Relocation (Assigned to Us)</h2><p>When an order is relocated TO us from another platform:</p><ul><li>A high-priority audio-visual alarm will trigger.</li><li>The order is instantly placed at the top of the Critical Prep queue.</li><li>Drop all low-priority (Scheduled) items and focus on packing this item.</li><li>Runner must be alerted to wait near the platform center for immediate delivery.</li></ul><h2>2. Outbound Order Relocation (Moved away from Us)</h2><p>When an order is relocated FROM us to a partner vendor:</p><ul><li>Stop packing immediately to save inventory.</li><li>If already packed, return items to shelves or hot-cabinet.</li><li>RailQuick system will auto-credit 15% cancellation cost to cover prep packaging.</li></ul>`
        },
        {
            id: "doc-3",
            title: "Standard Operating Procedures",
            icon: "📖",
            content: `<h1>Standard Operating Procedures</h1><p>Standard practices for packaging and customer handling.</p><hr><h2>Packing Standards</h2><ul><li>All hot food containers must be taped twice.</li><li>Attach train carriage tags clearly on the outer bag.</li><li>Include disposable tissues and spoons for all food orders.</li></ul><h2>Delivery Handover</h2><ul><li>Runner must verify the carriage number and seat number on the digital receipt.</li><li>Ask customer: <em>"Sir/Ma'am, order for seat XX?"</em> before handoff.</li><li>Mark as "Delivered" on the runner mobile app immediately.</li></ul>`
        }
    ];

    let currentDocId = "doc-1";
    let statsReallocatedCountVal = 4;

    // ==========================================================================
    // SELECTION OF ELEMENT SELECTORS
    // ==========================================================================
    
    // Sidebar
    const sidebarItems = document.querySelectorAll(".menu-item");
    const activeOrdersBadge = document.getElementById("activeOrdersBadge");
    const reroutingAlertBadge = document.getElementById("reroutingAlertBadge");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    
    // Page Content Header
    const currentPageIcon = document.getElementById("currentPageIcon");
    const currentPageTitle = document.getElementById("currentPageTitle");
    const currentPageDescription = document.getElementById("currentPageDescription");
    const pageViews = document.querySelectorAll(".page-view");
    
    // Active Orders Dom
    const criticalOrdersContainer = document.getElementById("critical-orders-container");
    const upcomingOrdersContainer = document.getElementById("upcoming-orders-container");
    const scheduledOrdersContainer = document.getElementById("scheduled-orders-container");
    const kanbanPendingContainer = document.getElementById("kanban-pending-container");
    const kanbanPackingContainer = document.getElementById("kanban-packing-container");
    const kanbanReadyContainer = document.getElementById("kanban-ready-container");
    const orderTabBtns = document.querySelectorAll(".notion-tabs .tab-btn");
    
    // Stats elements
    const statsPendingCount = document.getElementById("statsPendingCount");
    const statsUrgentCount = document.getElementById("statsUrgentCount");
    const statsNextTrain = document.getElementById("statsNextTrain");
    const statsReallocatedCount = document.getElementById("statsReallocatedCount");
    
    // AI Rerouting Dom
    const btnSimulatePlatChange = document.getElementById("btnSimulatePlatChange");
    const relocationLogs = document.getElementById("relocationLogs");
    
    // Inventory Dom
    const inventoryTableBody = document.getElementById("inventoryTableBody");
    const inventorySearchInput = document.getElementById("inventorySearch");
    const btnAddNewItem = document.getElementById("btnAddNewItem");
    const addItemModal = document.getElementById("addItemModal");
    const closeItemModal = document.getElementById("closeItemModal");
    const cancelAddItem = document.getElementById("cancelAddItem");
    const addItemForm = document.getElementById("addItemForm");
    const restockRecommendation = document.getElementById("restockRecommendation");
    const btnRestockAll = document.getElementById("btnRestockAll");

    // Notion Docs Dom
    const docsSidebarList = document.getElementById("docsSidebarList");
    const docsListMenu = document.getElementById("docsList");
    const editorDocIcon = document.getElementById("editorDocIcon");
    const editorDocTitle = document.getElementById("editorDocTitle");
    const editorContent = document.getElementById("editorContent");
    const btnCreateNewDoc = document.getElementById("btnCreateNewDoc");
    const btnBold = document.getElementById("btnBold");
    const btnItalic = document.getElementById("btnItalic");
    const btnH1 = document.getElementById("btnH1");
    const btnH2 = document.getElementById("btnH2");
    const btnBullet = document.getElementById("btnBullet");
    
    // Toasts
    const toastContainer = document.getElementById("toastContainer");

    // ==========================================================================
    // TOAST NOTIFICATIONS HELPER
    // ==========================================================================
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let emoji = "ℹ️";
        if (type === "success") emoji = "✨";
        if (type === "warning") emoji = "🚨";
        if (type === "danger") emoji = "🔥";
        
        toast.innerHTML = `
            <span>${emoji}</span>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = "toastSlideIn 0.3s ease-in reverse forwards";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    // ==========================================================================
    // THEME HANDLING
    // ==========================================================================
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        themeToggleBtn.querySelector(".toggle-icon").textContent = newTheme === "dark" ? "☀️" : "🌙";
        themeToggleBtn.querySelector(".toggle-text").textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
        
        showToast(`Switched to Notion ${newTheme === "dark" ? "Dark" : "Light"} theme`, "success");
    });

    // ==========================================================================
    // NAVIGATION
    // ==========================================================================
    sidebarItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute("data-page");
            
            // Update active menu link
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            // Switch page views
            pageViews.forEach(view => {
                view.classList.remove("active");
                if (view.id === `page-${targetPage}`) {
                    view.classList.add("active");
                }
            });

            // Update main cover height and display based on editor vs normal
            const coverEl = document.querySelector(".workspace-cover");
            if (targetPage === "docs") {
                coverEl.style.height = "100px";
            } else {
                coverEl.style.height = "190px";
            }
            
            // Set Page Headers Dynamically
            updatePageHeader(targetPage, item.querySelector(".item-label").textContent, item.querySelector(".item-icon").textContent);
        });
    });

    function updatePageHeader(pageId, title, icon) {
        currentPageIcon.textContent = icon;
        currentPageTitle.textContent = title;
        
        if (pageId === "orders") {
            currentPageDescription.textContent = "Real-time order queue sorted dynamically by RailQuick AI Priority Routing.";
        } else if (pageId === "rerouting") {
            currentPageDescription.textContent = "Monitor automated AI delivery handovers and simulated track reallocations.";
        } else if (pageId === "inventory") {
            currentPageDescription.textContent = "Interactive stock register synced with real-time station passenger demand.";
        } else if (pageId === "docs") {
            currentPageDescription.textContent = "Collaborative workspace for vendor daily reports, SOPs, and handovers.";
        }
    }

    // ==========================================================================
    // ACTIVE ORDERS LOGIC (AI TICKING & CHECKLISTS)
    // ==========================================================================
    
    // Sort and Render Orders
    function renderOrders() {
        // Clear containers
        criticalOrdersContainer.innerHTML = "";
        upcomingOrdersContainer.innerHTML = "";
        scheduledOrdersContainer.innerHTML = "";
        kanbanPendingContainer.innerHTML = "";
        kanbanPackingContainer.innerHTML = "";
        kanbanReadyContainer.innerHTML = "";
        
        let pendingCount = 0;
        let urgentCount = 0;
        let criticalCount = 0;
        let upcomingCount = 0;
        let scheduledCount = 0;

        // Sort orders by ETA seconds (ascending)
        orders.sort((a, b) => a.etaSeconds - b.etaSeconds);

        orders.forEach(order => {
            if (order.status === "Delivered" || order.status === "Relocated") return;
            
            pendingCount++;
            
            // Determine groups
            let group = "scheduled";
            let badgeClass = "scheduled";
            let badgeText = "Scheduled";
            let cardClass = "priority-low";
            
            if (order.etaSeconds <= 300) { // < 5 mins
                group = "critical";
                badgeClass = "urgent";
                badgeText = "Critical Prep";
                cardClass = "priority-critical";
                urgentCount++;
                criticalCount++;
            } else if (order.etaSeconds <= 900) { // 5-15 mins
                group = "upcoming";
                badgeClass = "upcoming";
                badgeText = "Upcoming Prep";
                cardClass = "priority-warning";
                upcomingCount++;
            } else {
                scheduledCount++;
            }

            // Create checklist HTML
            let checklistHtml = "";
            let packedCount = 0;
            
            order.items.forEach((item, index) => {
                if (item.packed) packedCount++;
                
                checklistHtml += `
                    <label class="checklist-item ${item.packed ? 'checked' : ''}">
                        <input type="checkbox" class="checklist-checkbox" data-order-id="${order.id}" data-item-idx="${index}" ${item.packed ? 'checked' : ''}>
                        <span class="checklist-text"><strong>${item.qty}x</strong> ${item.name}</span>
                    </label>
                `;
            });

            // Calculate progress percentage
            const progressPct = Math.round((packedCount / order.items.length) * 100);
            
            // Build standard card
            const etaMin = Math.floor(order.etaSeconds / 60);
            const etaSec = order.etaSeconds % 60;
            const etaString = `${etaMin}:${etaSec.toString().padStart(2, '0')} min`;

            const orderCardHtml = `
                <div class="order-card ${cardClass}" id="card-${order.id}">
                    <div class="drag-handle-wrapper"><span class="drag-handle-dots">⠿</span></div>
                    ${order.reallocated ? '<div style="position: absolute; top: 0; right: 0; background: #faa53d; color: black; font-size: 8px; font-weight: 800; padding: 2px 6px; border-bottom-left-radius: 4px; z-index: 5;">AI REALLOCATED</div>' : ''}
                    <div class="order-left">
                        <div class="order-id-row">
                            <span class="order-id">${order.id}</span>
                            <span class="order-badge ${badgeClass}">${badgeText}</span>
                        </div>
                        <div class="train-info">
                            <span class="train-name">🚆 ${order.trainNo} - ${order.trainName}</span>
                            <span class="train-route">${order.fromTo}</span>
                        </div>
                        <div class="arrival-countdown ${order.etaSeconds <= 300 ? 'timer-alert' : ''}">
                            ⏱️ Arrives in: <strong>${etaString}</strong>
                        </div>
                        <div style="font-size: 11px; margin-top: 4px; color: var(--text-muted);">
                            Platform: <strong style="color: var(--accent-blue)">P${order.actualPlatform}</strong>
                        </div>
                    </div>
                    
                    <div class="order-middle">
                        <span class="items-header">Items to Pack</span>
                        <div class="packing-checklist">
                            ${checklistHtml}
                        </div>
                    </div>
                    
                    <div class="order-right">
                        <div class="prep-progress-wrapper">
                            <div class="prep-text">${packedCount}/${order.items.length} Packed (${progressPct}%)</div>
                            <div class="prep-progress-bar">
                                <div class="prep-progress-fill ${progressPct === 100 ? 'complete' : ''}" style="width: ${progressPct}%"></div>
                            </div>
                        </div>
                        <button class="action-btn primary-btn compact-btn btn-deliver" data-order-id="${order.id}" ${progressPct < 100 ? 'disabled' : ''}>
                            🚀 Hand over to Runner
                        </button>
                    </div>
                </div>
            `;

            // Append to appropriate list group
            if (group === "critical") {
                criticalOrdersContainer.innerHTML += orderCardHtml;
            } else if (group === "upcoming") {
                upcomingOrdersContainer.innerHTML += orderCardHtml;
            } else {
                scheduledOrdersContainer.innerHTML += orderCardHtml;
            }

            // Render Kanban column representations
            const kanbanCardHtml = `
                <div class="kanban-card">
                    <div class="kanban-card-id" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${order.id}</span>
                        <span class="status-badge ${badgeClass}" style="font-size: 9px; padding: 1px 4px;">P${order.actualPlatform}</span>
                    </div>
                    <div class="kanban-card-train">🚆 ${order.trainNo} (${etaString})</div>
                    <div class="kanban-card-time">${packedCount}/${order.items.length} items packed</div>
                </div>
            `;
            
            if (order.status === "Pending" && packedCount === 0) {
                kanbanPendingContainer.innerHTML += kanbanCardHtml;
            } else if (order.status === "Pending" && packedCount > 0 && packedCount < order.items.length) {
                kanbanPackingContainer.innerHTML += kanbanCardHtml;
            } else {
                kanbanReadyContainer.innerHTML += kanbanCardHtml;
            }
        });

        // Set group counts
        document.getElementById("count-critical").textContent = `(${criticalCount})`;
        document.getElementById("count-upcoming").textContent = `(${upcomingCount})`;
        document.getElementById("count-scheduled").textContent = `(${scheduledCount})`;

        // Update stats
        statsPendingCount.textContent = pendingCount;
        statsUrgentCount.textContent = urgentCount;
        activeOrdersBadge.textContent = pendingCount;
        if (pendingCount === 0) {
            activeOrdersBadge.style.display = "none";
        } else {
            activeOrdersBadge.style.display = "block";
        }
        
        // Find next train arrival time
        const nextOrderWithTrain = orders.find(o => o.status === "Pending" || o.status === "Packing");
        if (nextOrderWithTrain) {
            const m = Math.floor(nextOrderWithTrain.etaSeconds / 60);
            const s = nextOrderWithTrain.etaSeconds % 60;
            statsNextTrain.textContent = `${m}.${Math.floor(s/10)} min`;
        } else {
            statsNextTrain.textContent = "--";
        }

        // Attach checkbox event listeners
        document.querySelectorAll(".checklist-checkbox").forEach(chk => {
            chk.addEventListener("change", handleChecklistChange);
        });

        // Attach handover event listeners
        document.querySelectorAll(".btn-deliver").forEach(btn => {
            btn.addEventListener("click", handleOrderHandover);
        });
    }

    // Handle checkbox interaction
    function handleChecklistChange(e) {
        const orderId = e.target.getAttribute("data-order-id");
        const itemIdx = parseInt(e.target.getAttribute("data-item-idx"));
        const isChecked = e.target.checked;
        
        playSynthSound('click');
        
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.items[itemIdx].packed = isChecked;
            order.status = "Packing";
            
            // Double check if all packed
            const allPacked = order.items.every(item => item.packed);
            if (allPacked) {
                order.status = "Ready";
                playSynthSound('success');
                showToast(`Order ${order.id} is fully packed! Ready for Runner.`, "success");
            }
            
            renderOrders();
            renderPlatformMap();
        }
    }

    // Handle handover button click
    function handleOrderHandover(e) {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            order.status = "Delivered";
            
            // Deduct stock levels in inventory based on items ordered
            order.items.forEach(orderItem => {
                // Find stock item
                const cleanItemName = orderItem.name;
                const dbItem = inventory.find(inv => inv.name.toLowerCase().includes(cleanItemName.toLowerCase()) || cleanItemName.toLowerCase().includes(inv.name.toLowerCase()));
                if (dbItem) {
                    dbItem.stock = Math.max(0, dbItem.stock - orderItem.qty);
                }
            });

            // Play deliver animation in platform map
            animateRunnerDelivery(order.actualPlatform);
            
            // Dispatch live runner status
            dispatchRunner(order.actualPlatform);
            
            playSynthSound('success');
            showToast(`Order ${orderId} handed over to runner for Train ${order.trainNo} at Platform ${order.actualPlatform}!`, "success");
            
            // Remove order from list after brief delay
            setTimeout(() => {
                orders.splice(orderIndex, 1);
                renderOrders();
                renderInventory();
            }, 600);
        }
    }

    // List and Board tabs switcher
    orderTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            orderTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            if (targetTab === "list") {
                document.getElementById("orders-list-view").style.display = "block";
                document.getElementById("orders-board-view").style.display = "none";
            } else {
                document.getElementById("orders-list-view").style.display = "none";
                document.getElementById("orders-board-view").style.display = "grid";
            }
        });
    });

    // Priority Engine Timer Loop
    setInterval(() => {
        let rerender = false;
        
        orders.forEach(order => {
            if (order.status !== "Delivered" && order.status !== "Relocated" && order.etaSeconds > 0) {
                order.etaSeconds--;
                rerender = true;
                
                // Alert once if countdown reaches critical 5-minute mark
                if (order.etaSeconds === 300) {
                    playSynthSound('critical');
                    speakAlert(`Attention vendor: Critical prep notice. Order ${order.id} is arriving in 5 minutes. Pack items immediately.`);
                    showToast(`🚨 URGENT PREP: Train ${order.trainNo} is arriving in 5 minutes! Prioritize Order ${order.id}.`, "danger");
                }
                
                // If runner misses train (eta reaches 0)
                if (order.etaSeconds === 0) {
                    order.status = "Relocated";
                    playSynthSound('warning');
                    speakAlert(`Order expired. Train ${order.trainNo} has departed. Recalling runner.`);
                    showToast(`⚠️ Train ${order.trainNo} departed. Order ${order.id} expired. Relocating runner back.`, "danger");
                }
            }
        });

        if (rerender) {
            renderOrders();
        }
    }, 1000);

    // ==========================================================================
    // AI REROUTING SCHEMATIC & MAP
    // ==========================================================================

    function renderPlatformMap() {
        // Clear slots
        for (let i = 1; i <= 5; i++) {
            const slot = document.getElementById(`train-slot-${i}`);
            if (slot) slot.innerHTML = "";
        }

        // Draw active trains
        activeTrains.forEach(train => {
            const slot = document.getElementById(`train-slot-${train.platform}`);
            if (slot) {
                // Find if there is an order associated with this train
                const associatedOrder = orders.find(o => o.trainNo === train.no && (o.status === "Pending" || o.status === "Packing" || o.status === "Ready"));
                let pulseColor = "";
                let detailsLabel = `${train.no}: ${train.name}`;
                
                if (associatedOrder) {
                    if (associatedOrder.etaSeconds <= 300) {
                        pulseColor = "rgba(235, 87, 87, 0.6)"; // Critical Red
                    } else {
                        pulseColor = "rgba(250, 165, 61, 0.6)"; // Upcoming Orange
                    }
                    detailsLabel += ` (Ord: ${associatedOrder.id})`;
                }

                slot.innerHTML = `
                    <div class="train-capsule" style="box-shadow: 0 0 10px ${pulseColor || 'rgba(56, 239, 125, 0.4)'}; background: ${pulseColor ? 'linear-gradient(90deg, #faa53d, #eb5757)' : 'linear-gradient(90deg, #38ef7d, #11998e)'}">
                        ${detailsLabel}
                    </div>
                `;
            }
        });
    }

    function animateRunnerDelivery(platformNo) {
        const activePlatRow = document.getElementById("plat-3"); // We are on P3
        const targetPlatRow = document.getElementById(`plat-${platformNo}`);
        
        if (!targetPlatRow) return;

        // Create a walking runner element
        const runner = document.createElement("div");
        runner.className = "runner-dot";
        runner.style.cssText = `
            position: absolute;
            left: 20px;
            font-size: 16px;
            z-index: 15;
            transition: all 0.5s ease-in-out;
            pointer-events: none;
        `;
        runner.textContent = "🏃";
        
        activePlatRow.appendChild(runner);
        
        // Trigger translation to train slot
        setTimeout(() => {
            runner.style.left = "60%";
            
            if (platformNo !== 3) {
                // If delivering to another platform (reallocated runner path)
                const dy = targetPlatRow.getBoundingClientRect().top - activePlatRow.getBoundingClientRect().top;
                runner.style.transform = `translateY(${dy}px)`;
            }
            
            setTimeout(() => {
                runner.textContent = "📦";
                setTimeout(() => {
                    runner.style.opacity = "0";
                    setTimeout(() => runner.remove(), 300);
                }, 200);
            }, 500);
        }, 100);
    }

    // Platform Shift Simulation
    btnSimulatePlatChange.addEventListener("click", () => {
        // Toggle simulator alert badge on sidebar
        reroutingAlertBadge.style.display = "block";
        
        // Choose train that is currently at platform 3 (our orders)
        // Let's take Train 12056 (Jan Shatabdi Express)
        const targetTrain = activeTrains.find(t => t.no === "12056");
        
        if (targetTrain && targetTrain.platform === 3) {
            // Shift train from Platform 3 to Platform 5
            targetTrain.platform = 5;
            
            playSynthSound('warning');
            speakAlert("AI Alert. Platform rescheduled. Train 12056 rescheduled to platform 5.");
            
            // AI Rerouting calculations
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // Add Log: train rescheduling
            addLogEntry(time, `Station Announcement: Train ${targetTrain.no} (${targetTrain.name}) platform rescheduled from Platform 3 to Platform 5.`, "warning");
            
            // Find order #1085 (which belongs to Train 12056)
            const orderIndex = orders.findIndex(o => o.trainNo === "12056");
            
            if (orderIndex !== -1) {
                const order = orders[orderIndex];
                
                // Relocate order logic:
                // Since platform changes to Platform 5, and it arrives in <8 minutes, 
                // AI detects that sending our runner from Platform 3 to 5 takes too long,
                // so it relocates the order to the Platform 5 Express vendor.
                order.status = "Relocated";
                
                // Add Log: AI action
                setTimeout(() => {
                    addLogEntry(time, `AI ROUTER: Detected risk of delay (Prep + Transfer to P5 exceeds train arrival). Order ${order.id} automatically reallocated to Platform 5 Partner Vendor.`, "danger");
                    
                    showToast(`AI ROUTING: Order ${order.id} transferred to Platform 5 Partner (15% prep refund credited).`, "warning");
                    
                    // Increment reallocated count
                    statsReallocatedCountVal++;
                    statsReallocatedCount.textContent = statsReallocatedCountVal;
                    
                    // Delete/Remove order from our workspace list
                    orders.splice(orderIndex, 1);
                    renderOrders();
                    renderPlatformMap();
                }, 1000);
            }
            
            // Now, simulate a reverse reallocation!
            // Another train (Train 12260, Duronto Express) scheduled for Platform 1 is rescheduled to Platform 3 (our platform!)
            setTimeout(() => {
                const durontoTrain = activeTrains.find(t => t.no === "12260");
                if (durontoTrain) {
                    durontoTrain.platform = 3;
                    
                    addLogEntry(time, `Station Announcement: Train 12260 (Duronto Express) platform rescheduled from Platform 1 to Platform 3.`, "warning");
                    
                    setTimeout(() => {
                        // AI assigns order from Platform 1 vendor to us!
                        playSynthSound('success');
                        speakAlert("Attention. New order assigned to you from Platform 1 partner.");
                        const newAssignedOrder = {
                            id: "RQ-1095",
                            trainNo: "12260",
                            trainName: "Duronto Express",
                            fromTo: "NDLS ➔ BCT",
                            scheduledPlatform: 1,
                            actualPlatform: 3,
                            etaSeconds: 240, // 4 mins (Very urgent!)
                            prepTimeMinutes: 2,
                            items: [
                                { name: "Veg Cutlet", qty: 1, packed: false },
                                { name: "Water Bottle 1L", qty: 2, packed: false }
                            ],
                            status: "Pending",
                            source: "Platform 1 Partner",
                            reallocated: true
                        };
                        
                        orders.push(newAssignedOrder);
                        
                        addLogEntry(time, `AI ROUTER: Order ${newAssignedOrder.id} reallocated TO Platform 3 Express (Us) from Platform 1. Train arrives in 4.0m!`, "success");
                        showToast(`✨ AI ASSIGNMENT: Order ${newAssignedOrder.id} transferred to you! (Train 12260 on P3)`, "success");
                        
                        // Clear alert badge in 3s
                        setTimeout(() => {
                            reroutingAlertBadge.style.display = "none";
                        }, 3000);
                        
                        renderOrders();
                        renderPlatformMap();
                    }, 1200);
                }
            }, 3000);
            
        } else {
            // Reset train state if already simulated
            targetTrain.platform = 3;
            const durontoTrain = activeTrains.find(t => t.no === "12260");
            if (durontoTrain) durontoTrain.platform = 1;
            
            // Clean orders and reset to initial
            orders = [
                {
                    id: "RQ-1082",
                    trainNo: "12423",
                    trainName: "Rajdhani Express",
                    fromTo: "NDLS ➔ HWH",
                    scheduledPlatform: 3,
                    actualPlatform: 3,
                    etaSeconds: 154,
                    prepTimeMinutes: 2,
                    items: [
                        { name: "Chai (Flask)", qty: 2, packed: false },
                        { name: "Veg Cutlet", qty: 2, packed: false }
                    ],
                    status: "Pending",
                    source: "Platform 3 Express",
                    reallocated: false
                },
                {
                    id: "RQ-1085",
                    trainNo: "12056",
                    trainName: "Jan Shatabdi Express",
                    fromTo: "DDN ➔ NDLS",
                    scheduledPlatform: 3,
                    actualPlatform: 3,
                    etaSeconds: 460,
                    prepTimeMinutes: 4,
                    items: [
                        { name: "Paneer Tikka Roll", qty: 1, packed: false },
                        { name: "Water Bottle 1L", qty: 1, packed: false }
                    ],
                    status: "Pending",
                    source: "Platform 3 Express",
                    reallocated: false
                },
                {
                    id: "RQ-1089",
                    trainNo: "12952",
                    trainName: "Mumbai Rajdhani",
                    fromTo: "NDLS ➔ MMCT",
                    scheduledPlatform: 3,
                    actualPlatform: 3,
                    etaSeconds: 980,
                    prepTimeMinutes: 3,
                    items: [
                        { name: "Samosa Plate", qty: 3, packed: false },
                        { name: "Chai (Flask)", qty: 1, packed: false },
                        { name: "Water Bottle 1L", qty: 2, packed: false }
                    ],
                    status: "Pending",
                    source: "Platform 3 Express",
                    reallocated: false
                }
            ];
            
            addLogEntry("SYSTEM", "AI Simulator state reset. All trains rescheduled to platform defaults.", "system");
            showToast("Simulator State Reset", "success");
            
            renderOrders();
            renderPlatformMap();
        }
    });

    function addLogEntry(time, text, type) {
        const log = document.createElement("div");
        log.className = `log-entry ${type}`;
        log.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-text">${text}</span>
        `;
        relocationLogs.prepend(log);
    }

    // ==========================================================================
    // INVENTORY DATABASE LOGIC
    // ==========================================================================

    function renderInventory() {
        inventoryTableBody.innerHTML = "";
        
        // Get filter text
        const query = inventorySearchInput.value.toLowerCase();
        
        let lowStockCount = 0;

        inventory.forEach(item => {
            if (query && !item.name.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query)) {
                return;
            }

            // Determine stock status and bars
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

            const trHtml = `
                <tr>
                    <td style="font-weight: 600;">📦 ${item.name}</td>
                    <td style="color: var(--text-muted);">${item.category}</td>
                    <td>
                        <div class="stock-indicator-wrapper">
                            <span style="font-weight:700; width:24px; text-align:right;">${item.stock}</span>
                            <div class="stock-bar-bg">
                                <div class="stock-bar-fill ${fillClass}" style="width: ${fillPct}%"></div>
                            </div>
                            <span style="font-size:10px; color:var(--text-muted)">Min: ${item.minStock}</span>
                        </div>
                    </td>
                    <td style="font-weight: 500;">₹${item.price}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="table-action-btn btn-stock-up" data-item-id="${item.id}" title="Restock +10">➕</button>
                        <button class="table-action-btn btn-stock-down" data-item-id="${item.id}" title="Reduce -1" ${item.stock === 0 ? 'disabled' : ''}>➖</button>
                    </td>
                </tr>
            `;
            inventoryTableBody.innerHTML += trHtml;
        });

        // Toggle AI restock alert panel based on low stocks
        if (lowStockCount > 0) {
            restockRecommendation.style.display = "flex";
            const lowItemsList = inventory
                .filter(item => item.stock <= item.minStock)
                .map(item => item.name)
                .join(", ");
            document.getElementById("restockText").innerHTML = `AI predicts high passenger demand for <strong>${lowItemsList}</strong> due to incoming delayed trains and noon traffic. Click below to auto-restock all items.`;
        } else {
            restockRecommendation.style.display = "none";
        }

        // Attach inventory listeners
        document.querySelectorAll(".btn-stock-up").forEach(btn => {
            btn.addEventListener("click", (e) => {
                playSynthSound('click');
                const id = parseInt(e.target.getAttribute("data-item-id"));
                const item = inventory.find(i => i.id === id);
                if (item) {
                    item.stock += 10;
                    showToast(`Restocked 10 units of ${item.name}`, "success");
                    renderInventory();
                }
            });
        });

        document.querySelectorAll(".btn-stock-down").forEach(btn => {
            btn.addEventListener("click", (e) => {
                playSynthSound('click');
                const id = parseInt(e.target.getAttribute("data-item-id"));
                const item = inventory.find(i => i.id === id);
                if (item && item.stock > 0) {
                    item.stock--;
                    renderInventory();
                }
            });
        });
    }

    // AI Auto restock recommended items
    btnRestockAll.addEventListener("click", () => {
        playSynthSound('success');
        inventory.forEach(item => {
            if (item.stock <= item.minStock) {
                item.stock += 25; // Replenish heavily
            }
        });
        showToast("AI Auto-Restock Triggered: All low stock items replenished!", "success");
        renderInventory();
    });

    // Search filter
    inventorySearchInput.addEventListener("input", renderInventory);

    // Modal Control
    btnAddNewItem.addEventListener("click", () => addItemModal.classList.add("active"));
    closeItemModal.addEventListener("click", () => addItemModal.classList.remove("active"));
    cancelAddItem.addEventListener("click", () => addItemModal.classList.remove("active"));

    // Form Submission
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
        showToast(`Added ${newItem.name} to inventory database.`, "success");
        renderInventory();
    });

    // ==========================================================================
    // NOTION WORKSPACE DOCS LOGIC
    // ==========================================================================

    function renderDocsList() {
        docsSidebarList.innerHTML = "";
        docsListMenu.innerHTML = "";

        documents.forEach(doc => {
            const isActive = doc.id === currentDocId;
            
            const docItemHtml = `
                <div class="doc-sidebar-item ${isActive ? 'active' : ''}" data-doc-id="${doc.id}">
                    <span class="item-icon">${doc.icon}</span>
                    <span class="doc-sidebar-title">${doc.title}</span>
                </div>
            `;
            
            docsSidebarList.innerHTML += docItemHtml;
            
            // Also append under the main Notion pages folder
            const subitemHtml = `
                <a href="#" class="menu-item doc-sidebar-item ${isActive ? 'active' : ''}" data-doc-id="${doc.id}" style="padding-left: 20px;">
                    <span class="item-icon">${doc.icon}</span>
                    <span class="item-label">${doc.title}</span>
                </a>
            `;
            docsListMenu.innerHTML += subitemHtml;
        });

        // Add event listeners to newly rendered doc list items
        document.querySelectorAll(".doc-sidebar-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const docId = item.getAttribute("data-doc-id");
                loadDocument(docId);
                
                // Automatically switch navigation to Docs workspace page view
                const docsMenuItem = document.querySelector('.menu-item[data-page="docs"]');
                if (docsMenuItem) {
                    sidebarItems.forEach(i => i.classList.remove("active"));
                    docsMenuItem.classList.add("active");
                    
                    pageViews.forEach(view => {
                        view.classList.remove("active");
                        if (view.id === "page-docs") view.classList.add("active");
                    });
                    
                    const coverEl = document.querySelector(".workspace-cover");
                    coverEl.style.height = "100px";
                    
                    updatePageHeader("docs", "Vendor Workspace", "📝");
                }
            });
        });
    }

    function loadDocument(docId) {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            currentDocId = docId;
            
            editorDocIcon.textContent = doc.icon;
            editorDocTitle.value = doc.title;
            editorContent.innerHTML = doc.content;
            
            renderDocsList();
        }
    }

    // Auto-save content on typing
    editorContent.addEventListener("input", () => {
        const doc = documents.find(d => d.id === currentDocId);
        if (doc) {
            doc.content = editorContent.innerHTML;
            triggerDocAutosaveFeedback();
        }
    });

    editorDocTitle.addEventListener("input", () => {
        const doc = documents.find(d => d.id === currentDocId);
        if (doc) {
            doc.title = editorDocTitle.value || "Untitled";
            
            // Also sync it on sidebar
            renderDocsList();
            triggerDocAutosaveFeedback();
        }
    });

    // Formatting button listeners
    btnBold.addEventListener("click", () => { playSynthSound('click'); formatDoc("bold"); });
    btnItalic.addEventListener("click", () => { playSynthSound('click'); formatDoc("italic"); });
    btnH1.addEventListener("click", () => { playSynthSound('click'); formatDoc("formatBlock", "h1"); });
    btnH2.addEventListener("click", () => { playSynthSound('click'); formatDoc("formatBlock", "h2"); });
    btnBullet.addEventListener("click", () => { playSynthSound('click'); formatDoc("insertUnorderedList"); });

    function formatDoc(command, value = null) {
        document.execCommand(command, false, value);
        editorContent.focus();
        
        // Trigger save
        const doc = documents.find(d => d.id === currentDocId);
        if (doc) {
            doc.content = editorContent.innerHTML;
        }
    }

    let saveTimeout;
    function triggerDocAutosaveFeedback() {
        const statusEl = document.getElementById("docSaveStatus");
        statusEl.textContent = "Saving changes...";
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            statusEl.textContent = "Autosaved to workspace";
        }, 800);
    }

    // Create New Doc
    btnCreateNewDoc.addEventListener("click", () => {
        const newDoc = {
            id: `doc-${Date.now()}`,
            title: "Untitled Note",
            icon: "📝",
            content: "<h1>Untitled Note</h1><p>Start writing here...</p>"
        };
        
        documents.push(newDoc);
        loadDocument(newDoc.id);
        playSynthSound('success');
        showToast("Created a new Notion document", "success");
    });

    // Cover Image Change Simulator
    document.getElementById("changeCoverBtn").addEventListener("click", () => {
        const covers = [
            "/Users/kartikguleria/.gemini/antigravity/brain/ef42efc5-86e3-46a2-9f8f-1516d9f0a341/train_cover_1782021049860.png",
            "https://images.unsplash.com/photo-1532103054090-334e6e60ab29?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80"
        ];
        
        const currentSrc = document.getElementById("coverImg").getAttribute("src");
        const nextSrcIndex = (covers.indexOf(currentSrc) + 1) % covers.length;
        
        document.getElementById("coverImg").setAttribute("src", covers[nextSrcIndex]);
        showToast("Changed workspace cover photo", "success");
    });

    // ==========================================================================
    // AUDIO SYNTHESIS & SPEECH UTILITIES (AI FEEDS)
    // ==========================================================================
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
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
            playStationChime().then(() => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.05;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            });
        }
    }

    function playStationChime() {
        initAudio();
        if (!audioCtx) return Promise.resolve();
        
        const now = audioCtx.currentTime;
        const playNote = (freq, start, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.04, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            
            osc.start(start);
            osc.stop(start + duration);
        };
        
        playNote(392.00, now, 0.45); // G4
        playNote(523.25, now + 0.25, 0.45); // C5
        playNote(659.25, now + 0.5, 0.45); // E5
        playNote(783.99, now + 0.75, 0.8); // G5
        
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    document.addEventListener('click', initAudio, { once: true });

    // ==========================================================================
    // LIVE RUNNER DISPATCH TRACKING
    // ==========================================================================
    function dispatchRunner(platform) {
        const runnerIcon = document.getElementById("runnerIcon");
        const runnerGlow = document.getElementById("runnerGlow");
        const runnerStatusText = document.getElementById("runnerStatusText");
        const runnerMetrics = document.querySelector(".runner-metrics");
        
        if (!runnerIcon) return;
        
        runnerIcon.textContent = "🏃";
        runnerStatusText.textContent = `Status: Delivering to P${platform}...`;
        runnerStatusText.style.color = "var(--accent-red)";
        runnerMetrics.innerHTML = `🔋 88% | ❤️ 128 bpm | 📍 Heading to P${platform}`;
        runnerGlow.style.animation = "ripple 0.8s ease-out infinite";
        
        setTimeout(() => {
            runnerIcon.textContent = "📦";
            runnerStatusText.textContent = `Status: Handoff at P${platform} Complete!`;
            runnerStatusText.style.color = "var(--accent-green)";
            runnerMetrics.innerHTML = `🔋 85% | ❤️ 132 bpm | 📍 Platform ${platform}`;
            playSynthSound('success');
            
            setTimeout(() => {
                runnerIcon.textContent = "🏃";
                runnerStatusText.textContent = `Status: Returning to P3 Express...`;
                runnerStatusText.style.color = "var(--accent-orange)";
                runnerMetrics.innerHTML = `🔋 82% | ❤️ 108 bpm | 📍 Stairwells`;
                runnerGlow.style.animation = "ripple 1.5s ease-out infinite";
                
                setTimeout(() => {
                    runnerIcon.textContent = "🏪";
                    runnerStatusText.textContent = `Status: Standing by at P3`;
                    runnerStatusText.style.color = "var(--accent-blue)";
                    runnerMetrics.innerHTML = `🔋 80% | ❤️ 76 bpm | 📍 Platform 3`;
                    runnerGlow.style.animation = "ripple 2.5s ease-out infinite";
                }, 3000);
            }, 1500);
        }, 2000);
    }

    // ==========================================================================
    // NOTION CLOUD SYNC
    // ==========================================================================
    const notionSyncBtn = document.getElementById("notionSyncBtn");
    const notionSyncModal = document.getElementById("notionSyncModal");
    const syncProgressFill = document.getElementById("syncProgressFill");
    const syncModalText = document.getElementById("syncModalText");
    
    if (notionSyncBtn) {
        notionSyncBtn.addEventListener("click", () => {
            playSynthSound('click');
            notionSyncModal.classList.add("active");
            syncProgressFill.style.width = "0%";
            syncModalText.textContent = "Establishing connection to Notion Cloud Database...";
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                syncProgressFill.style.width = `${progress}%`;
                
                if (progress % 20 === 0) {
                    playSynthSound('click');
                }
                
                if (progress === 30) {
                    syncModalText.textContent = "Uploading Inventory Stock database details...";
                } else if (progress === 60) {
                    syncModalText.textContent = "Pushing Live Order timeline logs to Station Master...";
                } else if (progress === 85) {
                    syncModalText.textContent = "Synchronizing shift notes and SOP workspace logs...";
                } else if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        notionSyncModal.classList.remove("active");
                        playSynthSound('success');
                        showToast("Workspace tables successfully synchronized with Notion!", "success");
                    }, 300);
                }
            }, 100);
        });
    }

    // ==========================================================================
    // NOTION SLASH COMMANDS FOR DOCUMENT EDITOR
    // ==========================================================================
    const slashMenu = document.getElementById("slashCommandsMenu");
    
    editorContent.addEventListener("keydown", (e) => {
        if (slashMenu && slashMenu.style.display === "flex") {
            const items = Array.from(slashMenu.querySelectorAll(".slash-item:not([style*='display: none'])"));
            const currentFocusedIdx = items.findIndex(item => item.classList.contains("selected"));
            
            if (e.key === "ArrowDown") {
                e.preventDefault();
                playSynthSound('click');
                if (currentFocusedIdx !== -1) items[currentFocusedIdx].classList.remove("selected");
                const nextIdx = (currentFocusedIdx + 1) % items.length;
                items[nextIdx].classList.add("selected");
                items[nextIdx].scrollIntoView({ block: 'nearest' });
                return;
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                playSynthSound('click');
                if (currentFocusedIdx !== -1) items[currentFocusedIdx].classList.remove("selected");
                const prevIdx = (currentFocusedIdx - 1 + items.length) % items.length;
                items[prevIdx].classList.add("selected");
                items[prevIdx].scrollIntoView({ block: 'nearest' });
                return;
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (currentFocusedIdx !== -1) {
                    items[currentFocusedIdx].click();
                }
                return;
            } else if (e.key === "Escape") {
                e.preventDefault();
                hideSlashMenu();
                return;
            }
        }

        if (e.key === "/") {
            setTimeout(() => {
                showSlashMenu();
            }, 10);
        } else if (e.key === "Escape") {
            hideSlashMenu();
        }
    });

    editorContent.addEventListener("input", () => {
        if (slashMenu && slashMenu.style.display === "flex") {
            const selection = window.getSelection();
            if (selection.rangeCount) {
                const range = selection.getRangeAt(0);
                const text = range.startContainer.textContent || "";
                const offset = range.startOffset;
                
                const lastSlashIdx = text.lastIndexOf("/", offset - 1);
                if (lastSlashIdx !== -1) {
                    const query = text.substring(lastSlashIdx + 1, offset).toLowerCase();
                    filterSlashMenu(query);
                } else {
                    hideSlashMenu();
                }
            }
        }
    });

    function filterSlashMenu(query) {
        const items = document.querySelectorAll(".slash-item");
        let visibleCount = 0;
        
        items.forEach(item => {
            const title = item.querySelector(".slash-title").textContent.toLowerCase();
            const desc = item.querySelector(".slash-desc").textContent.toLowerCase();
            const cmd = item.getAttribute("data-command").toLowerCase();
            
            if (title.includes(query) || desc.includes(query) || cmd.includes(query)) {
                item.style.display = "flex";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });
        
        // Reset highlights
        items.forEach(item => item.classList.remove("selected"));
        const firstVisible = slashMenu.querySelector(".slash-item:not([style*='display: none'])");
        if (firstVisible) firstVisible.classList.add("selected");

        if (visibleCount === 0) {
            slashMenu.style.display = "none";
        } else {
            slashMenu.style.display = "flex";
        }
    }
    
    function showSlashMenu() {
        document.querySelectorAll(".slash-item").forEach(item => {
            item.style.display = "flex";
            item.classList.remove("selected");
        });
        const firstVisible = slashMenu.querySelector(".slash-item");
        if (firstVisible) firstVisible.classList.add("selected");

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        
        const span = document.createElement("span");
        span.appendChild(document.createTextNode("\u200b"));
        range.insertNode(span);
        
        const rect = span.getBoundingClientRect();
        span.remove();
        
        slashMenu.style.left = `${rect.left + window.scrollX}px`;
        slashMenu.style.top = `${rect.bottom + window.scrollY + 6}px`;
        slashMenu.style.display = "flex";
    }
    
    function hideSlashMenu() {
        if (slashMenu) slashMenu.style.display = "none";
    }
    
    document.querySelectorAll(".slash-item").forEach(item => {
        item.addEventListener("click", () => {
            const command = item.getAttribute("data-command");
            insertBlock(command);
            hideSlashMenu();
            playSynthSound('click');
        });
    });
    
    function insertBlock(command) {
        editorContent.focus();
        
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const text = range.startContainer.textContent;
            const offset = range.startOffset;
            if (text && text.substring(offset - 1, offset) === "/") {
                range.setStart(range.startContainer, offset - 1);
                range.deleteContents();
            }
        }
        
        let html = "";
        if (command === "h1") {
            html = "<h1>Heading 1</h1>";
        } else if (command === "h2") {
            html = "<h2>Heading 2</h2>";
        } else if (command === "bullet") {
            html = "<ul><li>List Item</li></ul>";
        } else if (command === "divider") {
            html = '<hr class="notion-divider">';
        } else if (command === "callout") {
            html = '<div class="notion-callout"><span class="notion-callout-icon">💡</span><div class="notion-callout-text">Callout note text details here...</div></div>';
        }
        
        document.execCommand("insertHTML", false, html);
        
        const doc = documents.find(d => d.id === currentDocId);
        if (doc) {
            doc.content = editorContent.innerHTML;
            triggerDocAutosaveFeedback();
        }
    }

    // ==========================================================================
    // EMOJI & COVER PICKERS
    // ==========================================================================
    const pageIconWrapper = document.getElementById("pageIconWrapper");
    const emojiPicker = document.getElementById("emojiPicker");
    const changeCoverBtn = document.getElementById("changeCoverBtn");
    const coverPicker = document.getElementById("coverPicker");
    const coverImg = document.getElementById("coverImg");
    
    if (pageIconWrapper) {
        pageIconWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('click');
            emojiPicker.classList.toggle("active");
            if (coverPicker) coverPicker.classList.remove("active");
        });
    }
    
    document.querySelectorAll(".emoji-picker-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('success');
            
            const newEmoji = item.textContent;
            document.getElementById("currentPageIcon").textContent = newEmoji;
            
            const activeSidebarItem = document.querySelector(".menu-item.active .item-icon");
            if (activeSidebarItem) {
                activeSidebarItem.textContent = newEmoji;
            }
            
            const activeDocPage = document.querySelector('.menu-item.active').getAttribute("data-page");
            if (activeDocPage === "docs") {
                const doc = documents.find(d => d.id === currentDocId);
                if (doc) {
                    doc.icon = newEmoji;
                    document.getElementById("editorDocIcon").textContent = newEmoji;
                    renderDocsList();
                }
            }
            
            emojiPicker.classList.remove("active");
        });
    });

    if (changeCoverBtn) {
        changeCoverBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('click');
            coverPicker.classList.toggle("active");
            if (emojiPicker) emojiPicker.classList.remove("active");
        });
    }
    
    document.querySelectorAll(".cover-thumb").forEach(thumb => {
        thumb.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('success');
            
            const src = thumb.getAttribute("data-src");
            if (src.startsWith("linear-gradient")) {
                coverImg.style.display = "none";
                document.querySelector(".workspace-cover").style.background = src;
            } else {
                coverImg.style.display = "block";
                coverImg.setAttribute("src", src);
                document.querySelector(".workspace-cover").style.background = "transparent";
            }
            
            coverPicker.classList.remove("active");
        });
    });
    
    // ==========================================================================
    // COLLAPSIBLE SIDEBAR LOGIC
    // ==========================================================================
    const notionSidebar = document.getElementById("notionSidebar");
    const notionWorkspace = document.getElementById("notionWorkspace");
    const sidebarCollapseBtn = document.getElementById("sidebarCollapseBtn");
    const sidebarExpandBtn = document.getElementById("sidebarExpandBtn");
    const appContainer = document.querySelector(".app-container");

    if (sidebarCollapseBtn && sidebarExpandBtn) {
        sidebarCollapseBtn.addEventListener("click", () => {
            playSynthSound('click');
            notionSidebar.classList.add("collapsed");
            sidebarExpandBtn.style.display = "flex";
            appContainer.classList.add("sidebar-collapsed");
        });

        sidebarExpandBtn.addEventListener("click", () => {
            playSynthSound('click');
            notionSidebar.classList.remove("collapsed");
            sidebarExpandBtn.style.display = "none";
            appContainer.classList.remove("sidebar-collapsed");
        });
        
        // Ctrl+\ or Cmd+\ keyboard shortcut to toggle sidebar
        document.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
                e.preventDefault();
                if (notionSidebar.classList.contains("collapsed")) {
                    sidebarExpandBtn.click();
                } else {
                    sidebarCollapseBtn.click();
                }
            }
        });
    }

    // ==========================================================================
    // PAGE COMMENTS SECTION LOGIC
    // ==========================================================================
    let pageComments = [
        {
            id: "comment-1",
            author: "Shift Supervisor",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Supervisor",
            time: "10:30 AM",
            text: "Morning shift handoff completed. Platform 3 Express fully operational. Station Master reports delays on P1 and P5 which might route extra passengers to our platform."
        },
        {
            id: "comment-2",
            author: "Operations Head",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ops",
            time: "11:05 AM",
            text: "AI alert: Keep an eye on hot samosa stocks. Noon heat is picking up."
        }
    ];

    const commentsToggleHeader = document.getElementById("commentsToggleHeader");
    const commentsThreadContainer = document.getElementById("commentsThreadContainer");
    const commentsList = document.getElementById("commentsList");
    const newCommentInput = document.getElementById("newCommentInput");
    const btnAddComment = document.getElementById("btnAddComment");
    const commentsCount = document.getElementById("commentsCount");

    function renderComments() {
        if (!commentsList) return;
        commentsList.innerHTML = "";
        commentsCount.textContent = pageComments.length;

        pageComments.forEach(comment => {
            const commentItem = document.createElement("div");
            commentItem.className = "comment-item";
            commentItem.innerHTML = `
                <img class="comment-avatar" src="${comment.avatar}" alt="${comment.author}">
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
                <button class="comment-delete-btn" data-id="${comment.id}" title="Delete comment">🗑️</button>
            `;
            commentsList.appendChild(commentItem);
        });

        // Add delete listeners
        commentsList.querySelectorAll(".comment-delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = btn.getAttribute("data-id");
                pageComments = pageComments.filter(c => c.id !== id);
                playSynthSound('warning');
                renderComments();
                showToast("Comment deleted", "info");
            });
        });
    }

    if (commentsToggleHeader) {
        commentsToggleHeader.addEventListener("click", () => {
            playSynthSound('click');
            const isHidden = commentsThreadContainer.style.display === "none" || !commentsThreadContainer.style.display;
            commentsThreadContainer.style.display = isHidden ? "flex" : "none";
        });
    }

    if (btnAddComment) {
        btnAddComment.addEventListener("click", () => {
            const text = newCommentInput.value.trim();
            if (text) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const newComment = {
                    id: `comment-${Date.now()}`,
                    author: "You (Vendor)",
                    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=VendorYou",
                    time: time,
                    text: text
                };
                pageComments.push(newComment);
                newCommentInput.value = "";
                playSynthSound('success');
                renderComments();
                showToast("Comment posted successfully", "success");
            }
        });
        
        newCommentInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                btnAddComment.click();
            }
        });
    }

    // ==========================================================================
    // INTERACTIVE PROPERTIES POPOVERS
    // ==========================================================================
    const propAssignee = document.getElementById("propAssignee");
    const assigneePopover = document.getElementById("assigneePopover");
    const propTags = document.getElementById("propTags");
    const tagsPopover = document.getElementById("tagsPopover");
    const assigneePopoverSearch = document.getElementById("assigneePopoverSearch");

    if (propAssignee && assigneePopover) {
        propAssignee.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('click');
            closeAllPopovers();
            assigneePopover.classList.toggle("active");
            if (assigneePopoverSearch) {
                assigneePopoverSearch.value = "";
                filterRunners("");
                assigneePopoverSearch.focus();
            }
        });
    }

    if (assigneePopoverSearch) {
        assigneePopoverSearch.addEventListener("input", () => {
            filterRunners(assigneePopoverSearch.value);
        });
    }

    function filterRunners(query) {
        const options = document.querySelectorAll("#assigneePopoverOptions .popover-option");
        options.forEach(opt => {
            const text = opt.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                opt.style.display = "flex";
            } else {
                opt.style.display = "none";
            }
        });
    }

    // Bind assignee option clicks
    document.querySelectorAll("#assigneePopoverOptions .popover-option").forEach(opt => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const val = opt.getAttribute("data-value");
            propAssignee.textContent = val;
            assigneePopover.classList.remove("active");
            playSynthSound('success');
            
            // Show dynamic connection sync feedback
            const syncState = document.getElementById("propSyncState");
            if (syncState) {
                syncState.innerHTML = "🔄 Syncing...";
                syncState.style.color = "var(--accent-orange)";
                setTimeout(() => {
                    syncState.innerHTML = "🟢 Connected";
                    syncState.style.color = "var(--accent-green)";
                    showToast(`Runner updated to ${val} (Synced to Notion Cloud)`, "success");
                }, 1000);
            }
        });
    });

    if (propTags && tagsPopover) {
        propTags.addEventListener("click", (e) => {
            e.stopPropagation();
            playSynthSound('click');
            closeAllPopovers();
            tagsPopover.classList.toggle("active");
        });
    }

    // Toggle Tags Option Clicks
    document.querySelectorAll("#tagsPopover .tag-option").forEach(opt => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const tag = opt.getAttribute("data-tag");
            const color = opt.getAttribute("data-color");
            
            // Find existing tags in UI
            const tags = Array.from(propTags.querySelectorAll(".notion-tag"));
            const existingTagIdx = tags.findIndex(t => t.textContent.trim() === tag);
            
            playSynthSound('click');
            if (existingTagIdx !== -1) {
                // Remove tag
                tags[existingTagIdx].remove();
            } else {
                // Add tag
                const newSpan = document.createElement("span");
                newSpan.className = `notion-tag ${color}`;
                newSpan.textContent = tag;
                propTags.appendChild(newSpan);
            }
        });
    });

    function closeAllPopovers() {
        if (assigneePopover) assigneePopover.classList.remove("active");
        if (tagsPopover) tagsPopover.classList.remove("active");
    }

    // ==========================================================================
    // CMD+K QUICK FIND COMMAND PALETTE LOGIC
    // ==========================================================================
    const cmdPaletteOverlay = document.getElementById("cmdPaletteOverlay");
    const cmdPaletteSearch = document.getElementById("cmdPaletteSearch");
    const cmdPaletteResults = document.getElementById("cmdPaletteResults");
    const searchBtn = document.querySelector(".search-btn");

    const commands = [
        // Pages
        { title: "Active Orders", category: "Pages", icon: "📥", action: () => switchPage("orders") },
        { title: "AI Rerouting Hub", category: "Pages", icon: "🔄", action: () => switchPage("rerouting") },
        { title: "Inventory Database", category: "Pages", icon: "📦", action: () => switchPage("inventory") },
        { title: "Vendor Workspace", category: "Pages", icon: "📝", action: () => switchPage("docs") },
        // Actions
        { title: "Simulate Train Platform Shift", category: "System Actions", icon: "⚡", subtitle: "Triggers a platform reschedule and AI relocation", action: () => btnSimulatePlatChange.click() },
        { title: "Toggle Dark Mode", category: "System Actions", icon: "🌙", subtitle: "Switch workspace theme", action: () => themeToggleBtn.click() },
        { title: "Sync to Notion Cloud", category: "System Actions", icon: "🔄", subtitle: "Publish local tables database", action: () => notionSyncBtn.click() },
        { title: "Add New Inventory Item", category: "System Actions", icon: "➕", subtitle: "Opens inventory form modal", action: () => btnAddNewItem.click() },
        { title: "Auto-Restock Recommended Items", category: "System Actions", icon: "📦", subtitle: "Replenish low stock predictions", action: () => btnRestockAll.click() }
    ];

    function switchPage(pageId) {
        const item = document.querySelector(`.menu-item[data-page="${pageId}"]`);
        if (item) item.click();
    }

    function openCommandPalette() {
        playSynthSound('click');
        cmdPaletteOverlay.style.display = "flex";
        cmdPaletteSearch.value = "";
        renderPaletteResults("");
        setTimeout(() => cmdPaletteSearch.focus(), 50);
    }

    function closeCommandPalette() {
        cmdPaletteOverlay.style.display = "none";
    }

    function renderPaletteResults(query) {
        if (!cmdPaletteResults) return;
        cmdPaletteResults.innerHTML = "";
        
        // Compile search items: static commands + inventory items + orders + documents
        let searchPool = [...commands];
        
        // Add dynamic documents
        documents.forEach(doc => {
            searchPool.push({
                title: doc.title,
                category: "Notion Documents",
                icon: doc.icon,
                subtitle: "Select to load in editor workspace",
                action: () => {
                    loadDocument(doc.id);
                    switchPage("docs");
                }
            });
        });

        // Add inventory items
        inventory.forEach(inv => {
            searchPool.push({
                title: `Stock: ${inv.name}`,
                category: "Inventory Database",
                icon: "📦",
                subtitle: `Price: ₹${inv.price} | Level: ${inv.stock} (Min: ${inv.minStock})`,
                action: () => {
                    switchPage("inventory");
                    inventorySearchInput.value = inv.name;
                    renderInventory();
                }
            });
        });

        // Add active orders
        orders.forEach(order => {
            searchPool.push({
                title: `Order ${order.id} - ${order.trainName}`,
                category: "Live Orders",
                icon: "📥",
                subtitle: `Train: ${order.trainNo} | ETA: ${Math.floor(order.etaSeconds/60)}m | Status: ${order.status}`,
                action: () => {
                    switchPage("orders");
                    const card = document.getElementById(`card-${order.id}`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.style.animation = "outlineBlink 1.5s 2 alternate";
                    }
                }
            });
        });

        // Filter search items
        const q = query.toLowerCase().trim();
        const filtered = searchPool.filter(item => 
            item.title.toLowerCase().includes(q) || 
            item.category.toLowerCase().includes(q) || 
            (item.subtitle && item.subtitle.toLowerCase().includes(q))
        );

        if (filtered.length === 0) {
            cmdPaletteResults.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">No results found for "${query}"</div>`;
            return;
        }

        // Group by category
        const groups = {};
        filtered.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });

        // Render grouped markup
        Object.keys(groups).forEach(cat => {
            const titleDiv = document.createElement("div");
            titleDiv.className = "cmd-group-title";
            titleDiv.textContent = cat;
            cmdPaletteResults.appendChild(titleDiv);

            groups[cat].forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "cmd-result-item";
                itemDiv.innerHTML = `
                    <span class="cmd-result-icon">${item.icon}</span>
                    <div class="cmd-result-details">
                        <span class="cmd-result-title">${item.title}</span>
                        ${item.subtitle ? `<span class="cmd-result-subtitle">${item.subtitle}</span>` : ''}
                    </div>
                    <span class="cmd-result-action-hint">Jump to ↵</span>
                `;
                
                itemDiv.addEventListener("click", () => {
                    item.action();
                    closeCommandPalette();
                });
                
                cmdPaletteResults.appendChild(itemDiv);
            });
        });

        // Highlight first item
        const firstItem = cmdPaletteResults.querySelector(".cmd-result-item");
        if (firstItem) firstItem.classList.add("focused");
    }

    // Open/Close bindings
    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openCommandPalette();
        });
    }

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (cmdPaletteOverlay.style.display === "none" || !cmdPaletteOverlay.style.display) {
                openCommandPalette();
            } else {
                closeCommandPalette();
            }
        }
        if (e.key === "Escape" && cmdPaletteOverlay.style.display === "flex") {
            closeCommandPalette();
        }
    });

    if (cmdPaletteOverlay) {
        cmdPaletteOverlay.addEventListener("click", (e) => {
            if (e.target === cmdPaletteOverlay) {
                closeCommandPalette();
            }
        });
    }

    if (cmdPaletteSearch) {
        cmdPaletteSearch.addEventListener("input", () => {
            renderPaletteResults(cmdPaletteSearch.value);
        });

        cmdPaletteSearch.addEventListener("keydown", (e) => {
            const items = Array.from(cmdPaletteResults.querySelectorAll(".cmd-result-item"));
            if (items.length === 0) return;
            
            const currentFocusedIdx = items.findIndex(item => item.classList.contains("focused"));
            
            if (e.key === "ArrowDown") {
                e.preventDefault();
                playSynthSound('click');
                if (currentFocusedIdx !== -1) items[currentFocusedIdx].classList.remove("focused");
                const nextIdx = (currentFocusedIdx + 1) % items.length;
                items[nextIdx].classList.add("focused");
                items[nextIdx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                playSynthSound('click');
                if (currentFocusedIdx !== -1) items[currentFocusedIdx].classList.remove("focused");
                const prevIdx = (currentFocusedIdx - 1 + items.length) % items.length;
                items[prevIdx].classList.add("focused");
                items[prevIdx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (currentFocusedIdx !== -1) {
                    items[currentFocusedIdx].click();
                }
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (slashMenu && !slashMenu.contains(e.target) && e.target !== editorContent) {
            hideSlashMenu();
        }
        if (emojiPicker && !emojiPicker.contains(e.target) && e.target !== pageIconWrapper) {
            emojiPicker.classList.remove("active");
        }
        if (coverPicker && !coverPicker.contains(e.target) && e.target !== changeCoverBtn) {
            coverPicker.classList.remove("active");
        }
        if (assigneePopover && !assigneePopover.contains(e.target) && e.target !== propAssignee) {
            assigneePopover.classList.remove("active");
        }
        if (tagsPopover && !tagsPopover.contains(e.target) && e.target !== propTags) {
            tagsPopover.classList.remove("active");
        }
    });

    renderComments();

    // ==========================================================================
    // INITIALIZATION RENDER CALLS
    // ==========================================================================
    renderOrders();
    renderPlatformMap();
    renderInventory();
    renderDocsList();
    loadDocument("doc-1"); // Load first log by default
});
