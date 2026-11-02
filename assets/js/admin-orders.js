
/*--- Admin Purchase Orders Management ---*/

document.addEventListener("DOMContentLoaded", function () {
    bpApoInit();
});

/*--- Sample Purchase Order Data ---*/
let bpApoOrders = [
    {id:1,orderId:"PO-2026-001",supplier:"TechNova Solutions",product:"Wireless Keyboard & Mouse",orderDate:"2026-10-05",deliveryDate:"2026-10-12",quantity:20,unitPrice:2499,payment:"Paid",status:"Completed",notes:"Delivered successfully."},
    {id:2,orderId:"PO-2026-002",supplier:"Urban Office Supplies",product:"Ergonomic Office Chair",orderDate:"2026-10-09",deliveryDate:"2026-11-08",quantity:10,unitPrice:8999,payment:"Partial",status:"Processing",notes:"Second installment pending."},
    {id:3,orderId:"PO-2026-003",supplier:"Prime Paper Traders",product:"A4 Copier Paper Box",orderDate:"2026-10-12",deliveryDate:"2026-11-05",quantity:50,unitPrice:1850,payment:"Unpaid",status:"Pending",notes:"Awaiting supplier confirmation."},
    {id:4,orderId:"PO-2026-004",supplier:"SafeGuard Industries",product:"Industrial Safety Helmet",orderDate:"2026-10-15",deliveryDate:"2026-11-10",quantity:30,unitPrice:650,payment:"Paid",status:"Shipped",notes:"Shipment in transit."},
    {id:5,orderId:"PO-2026-005",supplier:"TechNova Solutions",product:"LED Monitor 24 Inch",orderDate:"2026-10-18",deliveryDate:"2026-11-15",quantity:12,unitPrice:12499,payment:"Unpaid",status:"Approved",notes:"Ready for processing."},
    {id:6,orderId:"PO-2026-006",supplier:"MetalWorks India",product:"Heavy Duty Storage Rack",orderDate:"2026-10-20",deliveryDate:"2026-11-20",quantity:8,unitPrice:6500,payment:"Partial",status:"Pending",notes:"Awaiting approval."},
    {id:7,orderId:"PO-2026-007",supplier:"Urban Office Supplies",product:"Executive Office Desk",orderDate:"2026-10-22",deliveryDate:"2026-11-18",quantity:5,unitPrice:15999,payment:"Paid",status:"Completed",notes:"Order completed."},
    {id:8,orderId:"PO-2026-008",supplier:"TechNova Solutions",product:"USB-C Docking Station",orderDate:"2026-10-25",deliveryDate:"2026-11-15",quantity:15,unitPrice:4299,payment:"Unpaid",status:"Cancelled",notes:"Cancelled by administrator."},
    {id:9,orderId:"PO-2026-009",supplier:"SafeGuard Industries",product:"Protective Safety Gloves",orderDate:"2026-10-27",deliveryDate:"2026-11-12",quantity:40,unitPrice:350,payment:"Partial",status:"Shipped",notes:"Delivery scheduled."},
    {id:10,orderId:"PO-2026-010",supplier:"Prime Paper Traders",product:"Desktop File Organizer",orderDate:"2026-10-29",deliveryDate:"2026-11-16",quantity:25,unitPrice:499,payment:"Unpaid",status:"Pending",notes:"New order awaiting confirmation."}
];

let bpApoCurrentPage = 1;
const bpApoPageSize = 5;
let bpApoCurrentViewId = null;
let bpApoPendingDeleteId = null;
let bpApoToastTimer = null;

/*--- DOM Helper ---*/
const bpApoGet = id => document.getElementById(id);

/*--- Initialize ---*/
function bpApoInit() {
    const required = [
        "bp-apo-table-body",
        "bp-apo-form",
        "bp-apo-form-modal",
        "bp-apo-view-modal",
        "bp-apo-confirm-modal"
    ];

    if (required.some(id => !bpApoGet(id))) {
        console.error("Admin Purchase Orders: Required HTML elements are missing.");
        return;
    }

    bpApoBindEvents();
    bpApoRender();
}

/*--- Event Listeners ---*/
function bpApoBindEvents() {
    bpApoGet("bp-apo-add-btn").addEventListener("click", bpApoOpenAdd);
    bpApoGet("bp-apo-form").addEventListener("submit", bpApoSave);

    bpApoGet("bp-apo-search").addEventListener("input", function () {
        bpApoCurrentPage = 1;
        bpApoGet("bp-apo-clear-search").classList.toggle("bp-apo-clear-visible", this.value.length > 0);
        bpApoRender();
    });

    bpApoGet("bp-apo-status-filter").addEventListener("change", bpApoFilterChanged);
    bpApoGet("bp-apo-payment-filter").addEventListener("change", bpApoFilterChanged);
    bpApoGet("bp-apo-reset").addEventListener("click", bpApoResetFilters);
    bpApoGet("bp-apo-empty-reset").addEventListener("click", bpApoResetFilters);

    bpApoGet("bp-apo-clear-search").addEventListener("click", function () {
        bpApoGet("bp-apo-search").value = "";
        this.classList.remove("bp-apo-clear-visible");
        bpApoCurrentPage = 1;
        bpApoRender();
    });

    bpApoGet("bp-apo-export").addEventListener("click", bpApoExport);
    bpApoGet("bp-apo-confirm-action").addEventListener("click", bpApoDeleteConfirmed);

    bpApoGet("bp-apo-view-edit").addEventListener("click", function () {
        if (bpApoCurrentViewId === null) return;

        const id = bpApoCurrentViewId;
        bpApoCloseModal("bp-apo-view-modal");
        bpApoOpenEdit(id);
    });

    bpApoGet("bp-apo-table-body").addEventListener("click", function (event) {
        const button = event.target.closest("[data-apo-action]");
        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.apoAction;

        if (action === "view") bpApoOpenView(id);
        if (action === "edit") bpApoOpenEdit(id);
        if (action === "delete") bpApoAskDelete(id);
    });

    document.querySelectorAll("[data-apo-close]").forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".bp-apo-modal");
            if (modal) bpApoCloseModal(modal.id);
        });
    });

    bpApoGet("bp-apo-quantity").addEventListener("input", bpApoUpdateTotal);
    bpApoGet("bp-apo-unit-price").addEventListener("input", bpApoUpdateTotal);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".bp-apo-modal-open").forEach(modal => {
                bpApoCloseModal(modal.id);
            });
        }
    });
}

/*--- Filter Purchase Orders ---*/
function bpApoGetFiltered() {
    const search = bpApoGet("bp-apo-search").value.trim().toLowerCase();
    const status = bpApoGet("bp-apo-status-filter").value;
    const payment = bpApoGet("bp-apo-payment-filter").value;

    return bpApoOrders.filter(order => {
        const matchesSearch = [
            order.orderId,
            order.supplier,
            order.product
        ].some(value => String(value).toLowerCase().includes(search));

        return matchesSearch &&
            (!status || order.status === status) &&
            (!payment || order.payment === payment);
    });
}

function bpApoFilterChanged() {
    bpApoCurrentPage = 1;
    bpApoRender();
}

function bpApoResetFilters() {
    bpApoGet("bp-apo-search").value = "";
    bpApoGet("bp-apo-status-filter").value = "";
    bpApoGet("bp-apo-payment-filter").value = "";
    bpApoGet("bp-apo-clear-search").classList.remove("bp-apo-clear-visible");
    bpApoCurrentPage = 1;
    bpApoRender();
}

/*--- Render Purchase Orders ---*/
function bpApoRender() {
    bpApoRenderStats();

    const filtered = bpApoGetFiltered();
    const total = filtered.length;
    const totalPages = Math.ceil(total / bpApoPageSize);

    if (totalPages > 0 && bpApoCurrentPage > totalPages) {
        bpApoCurrentPage = totalPages;
    }

    const start = (bpApoCurrentPage - 1) * bpApoPageSize;
    const current = filtered.slice(start, start + bpApoPageSize);

    bpApoGet("bp-apo-result-total").textContent = total;
    bpApoGet("bp-apo-showing").textContent = current.length;
    bpApoGet("bp-apo-empty").hidden = total !== 0;
    bpApoGet("bp-apo-table-body").innerHTML = current.map(bpApoRow).join("");

    bpApoGet("bp-apo-page-info").textContent =
        `Page ${total ? bpApoCurrentPage : 0} of ${totalPages}`;

    bpApoRenderPagination(totalPages);
}

/*--- Statistics ---*/
function bpApoRenderStats() {
    bpApoGet("bp-apo-total").textContent = bpApoOrders.length;
    bpApoGet("bp-apo-pending").textContent =
        bpApoOrders.filter(order => order.status === "Pending").length;
    bpApoGet("bp-apo-completed").textContent =
        bpApoOrders.filter(order => order.status === "Completed").length;

    const totalValue = bpApoOrders.reduce(
        (sum, order) => sum + order.quantity * order.unitPrice, 0
    );

    bpApoGet("bp-apo-value").textContent = bpApoCompactCurrency(totalValue);
}

/*--- Render Table Row ---*/
function bpApoRow(order) {
    const statusClasses = {
        Pending: "bp-apo-status-pending",
        Approved: "bp-apo-status-approved",
        Processing: "bp-apo-status-processing",
        Shipped: "bp-apo-status-shipped",
        Completed: "bp-apo-status-completed",
        Cancelled: "bp-apo-status-cancelled"
    };

    const paymentClasses = {
        Unpaid: "bp-apo-payment-unpaid",
        Partial: "bp-apo-payment-partial",
        Paid: "bp-apo-payment-paid"
    };

    return `
        <tr>
            <td><span class="bp-apo-order-id">${bpApoEscape(order.orderId)}</span></td>
            <td>
                <div class="bp-apo-supplier-name">${bpApoEscape(order.supplier)}</div>
                <div class="bp-apo-supplier-sub">${bpApoEscape(order.product)}</div>
            </td>
            <td>${bpApoFormatDate(order.orderDate)}</td>
            <td>${bpApoFormatDate(order.deliveryDate)}</td>
            <td><span class="bp-apo-amount">${bpApoCurrency(order.quantity * order.unitPrice)}</span></td>
            <td><span class="bp-apo-payment ${paymentClasses[order.payment]}">${bpApoEscape(order.payment)}</span></td>
            <td><span class="bp-apo-status ${statusClasses[order.status]}">${bpApoEscape(order.status)}</span></td>
            <td>
                <div class="bp-apo-actions">
                    <button type="button" class="bp-apo-action-btn" data-apo-action="view" data-id="${order.id}" title="View"><i class="bi bi-eye"></i></button>
                    <button type="button" class="bp-apo-action-btn" data-apo-action="edit" data-id="${order.id}" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button type="button" class="bp-apo-action-btn bp-apo-action-delete" data-apo-action="delete" data-id="${order.id}" title="Delete"><i class="bi bi-trash3"></i></button>
                </div>
            </td>
        </tr>
    `;
}

/*--- Pagination ---*/
function bpApoRenderPagination(totalPages) {
    const container = bpApoGet("bp-apo-pagination");
    container.innerHTML = "";

    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "bp-apo-page-btn";
    previous.innerHTML = '<i class="bi bi-chevron-left"></i>';
    previous.disabled = bpApoCurrentPage <= 1 || totalPages === 0;
    previous.addEventListener("click", function () {
        bpApoCurrentPage--;
        bpApoRender();
    });
    container.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {
        if (totalPages > 5 && page > 2 && page < totalPages - 1 &&
            Math.abs(page - bpApoCurrentPage) > 1) {
            if (!container.querySelector(".bp-apo-page-dots")) {
                const dots = document.createElement("span");
                dots.className = "bp-apo-page-dots";
                dots.textContent = "...";
                container.appendChild(dots);
            }
            continue;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = `bp-apo-page-btn ${page === bpApoCurrentPage ? "active" : ""}`;
        button.textContent = page;
        button.addEventListener("click", function () {
            bpApoCurrentPage = page;
            bpApoRender();
        });
        container.appendChild(button);
    }

    const next = document.createElement("button");
    next.type = "button";
    next.className = "bp-apo-page-btn";
    next.innerHTML = '<i class="bi bi-chevron-right"></i>';
    next.disabled = bpApoCurrentPage >= totalPages || totalPages === 0;
    next.addEventListener("click", function () {
        bpApoCurrentPage++;
        bpApoRender();
    });
    container.appendChild(next);
}

/*--- Generate Order ID ---*/
function bpApoGenerateOrderId() {
    const year = new Date().getFullYear();
    const highest = bpApoOrders.reduce((max, order) => {
        const match = order.orderId.match(/PO-\d{4}-(\d+)/);
        return match ? Math.max(max, Number(match[1])) : max;
    }, 0);

    return `PO-${year}-${String(highest + 1).padStart(3, "0")}`;
}

/*--- Open Add Order ---*/
function bpApoOpenAdd() {
    bpApoResetForm();

    bpApoGet("bp-apo-order-id").value = bpApoGenerateOrderId();
    bpApoGet("bp-apo-order-date").value = bpApoToday();

    bpApoGet("bp-apo-form-title").textContent = "Create Purchase Order";
    bpApoGet("bp-apo-save-btn").innerHTML = '<i class="bi bi-check-lg"></i> Create Order';

    bpApoOpenModal("bp-apo-form-modal");
}

/*--- Open Edit Order ---*/
function bpApoOpenEdit(id) {
    const order = bpApoOrders.find(item => item.id === id);
    if (!order) return;

    bpApoResetForm();

    bpApoGet("bp-apo-edit-id").value = order.id;
    bpApoGet("bp-apo-order-id").value = order.orderId;
    bpApoGet("bp-apo-order-date").value = order.orderDate;
    bpApoGet("bp-apo-supplier").value = order.supplier;
    bpApoGet("bp-apo-delivery-date").value = order.deliveryDate;
    bpApoGet("bp-apo-product").value = order.product;
    bpApoGet("bp-apo-quantity").value = order.quantity;
    bpApoGet("bp-apo-unit-price").value = order.unitPrice;
    bpApoGet("bp-apo-payment").value = order.payment;
    bpApoGet("bp-apo-status").value = order.status;
    bpApoGet("bp-apo-notes").value = order.notes;

    bpApoGet("bp-apo-form-title").textContent = "Edit Purchase Order";
    bpApoGet("bp-apo-save-btn").innerHTML = '<i class="bi bi-check-lg"></i> Update Order';

    bpApoUpdateTotal();
    bpApoOpenModal("bp-apo-form-modal");
}

/*--- Reset Form ---*/
function bpApoResetForm() {
    bpApoGet("bp-apo-form").reset();
    bpApoGet("bp-apo-edit-id").value = "";
    bpApoGet("bp-apo-form-message").textContent = "";
    bpApoGet("bp-apo-total-preview").textContent = "₹0.00";

    document.querySelectorAll(".bp-apo-error").forEach(error => error.textContent = "");
    document.querySelectorAll(".bp-apo-invalid").forEach(input => input.classList.remove("bp-apo-invalid"));
}

/*--- Calculate Order Total ---*/
function bpApoUpdateTotal() {
    const quantity = Number(bpApoGet("bp-apo-quantity").value) || 0;
    const price = Number(bpApoGet("bp-apo-unit-price").value) || 0;

    bpApoGet("bp-apo-total-preview").textContent = bpApoCurrency(quantity * price);
}

/*--- Validate Order Form ---*/
function bpApoValidate() {
    let valid = true;

    const requiredFields = [
        ["supplier", "bp-apo-supplier", "Supplier name is required."],
        ["product", "bp-apo-product", "Product name is required."],
        ["order-date", "bp-apo-order-date", "Please select an order date."],
        ["delivery-date", "bp-apo-delivery-date", "Please select a delivery date."]
    ];

    requiredFields.forEach(([name, id, message]) => {
        const input = bpApoGet(id);
        const error = bpApoGet(`bp-apo-${name}-error`);

        if (!input.value.trim()) {
            input.classList.add("bp-apo-invalid");
            error.textContent = message;
            valid = false;
        } else {
            input.classList.remove("bp-apo-invalid");
            error.textContent = "";
        }
    });

    const orderDate = bpApoGet("bp-apo-order-date").value;
    const deliveryDate = bpApoGet("bp-apo-delivery-date").value;

    if (orderDate && deliveryDate && deliveryDate < orderDate) {
        bpApoGet("bp-apo-delivery-date").classList.add("bp-apo-invalid");
        bpApoGet("bp-apo-delivery-date-error").textContent =
            "Delivery date cannot be earlier than the order date.";
        valid = false;
    }

    const quantity = bpApoGet("bp-apo-quantity");
    if (!Number.isInteger(Number(quantity.value)) || Number(quantity.value) < 1 || quantity.value === "") {
        quantity.classList.add("bp-apo-invalid");
        bpApoGet("bp-apo-quantity-error").textContent = "Enter a valid quantity of at least 1.";
        valid = false;
    } else {
        quantity.classList.remove("bp-apo-invalid");
        bpApoGet("bp-apo-quantity-error").textContent = "";
    }

    const price = bpApoGet("bp-apo-unit-price");
    if (!Number.isFinite(Number(price.value)) || Number(price.value) <= 0 || price.value === "") {
        price.classList.add("bp-apo-invalid");
        bpApoGet("bp-apo-unit-price-error").textContent = "Enter a valid unit price greater than zero.";
        valid = false;
    } else {
        price.classList.remove("bp-apo-invalid");
        bpApoGet("bp-apo-unit-price-error").textContent = "";
    }

    return valid;
}

/*--- Save Purchase Order ---*/
function bpApoSave(event) {
    event.preventDefault();

    if (!bpApoValidate()) return;

    const editId = Number(bpApoGet("bp-apo-edit-id").value);
    const orderData = {
        id: editId || Date.now(),
        orderId: bpApoGet("bp-apo-order-id").value,
        supplier: bpApoGet("bp-apo-supplier").value.trim(),
        product: bpApoGet("bp-apo-product").value.trim(),
        orderDate: bpApoGet("bp-apo-order-date").value,
        deliveryDate: bpApoGet("bp-apo-delivery-date").value,
        quantity: Number(bpApoGet("bp-apo-quantity").value),
        unitPrice: Number(bpApoGet("bp-apo-unit-price").value),
        payment: bpApoGet("bp-apo-payment").value,
        status: bpApoGet("bp-apo-status").value,
        notes: bpApoGet("bp-apo-notes").value.trim()
    };

    if (editId) {
        bpApoOrders = bpApoOrders.map(order =>
            order.id === editId ? orderData : order
        );
        bpApoShowToast("Purchase order updated successfully.");
    } else {
        bpApoOrders.unshift(orderData);
        bpApoShowToast("Purchase order created successfully.");
    }

    bpApoCurrentPage = 1;
    bpApoCloseModal("bp-apo-form-modal");
    bpApoRender();
}

/*--- View Order ---*/
function bpApoOpenView(id) {
    const order = bpApoOrders.find(item => item.id === id);
    if (!order) return;

    bpApoCurrentViewId = id;

    const details = [
        ["Order ID", order.orderId],
        ["Supplier", order.supplier],
        ["Product", order.product],
        ["Order Date", bpApoFormatDate(order.orderDate)],
        ["Expected Delivery", bpApoFormatDate(order.deliveryDate)],
        ["Quantity", order.quantity],
        ["Unit Price", bpApoCurrency(order.unitPrice)],
        ["Order Total", bpApoCurrency(order.quantity * order.unitPrice)],
        ["Payment Status", order.payment],
        ["Order Status", order.status]
    ];

    bpApoGet("bp-apo-view-content").innerHTML = `
        <div class="bp-apo-view-grid">
            ${details.map(([label, value]) => `
                <div class="bp-apo-view-item">
                    <small>${bpApoEscape(label)}</small>
                    <strong>${bpApoEscape(value)}</strong>
                </div>
            `).join("")}
            <div class="bp-apo-view-item bp-apo-view-notes">
                <small>Order Notes</small>
                <strong>${bpApoEscape(order.notes || "No additional notes.")}</strong>
            </div>
        </div>
    `;

    bpApoOpenModal("bp-apo-view-modal");
}

/*--- Delete Confirmation ---*/
function bpApoAskDelete(id) {
    const order = bpApoOrders.find(item => item.id === id);
    if (!order) return;

    bpApoPendingDeleteId = id;
    bpApoGet("bp-apo-confirm-message").textContent =
        `Are you sure you want to delete ${order.orderId}? This action cannot be undone.`;

    bpApoOpenModal("bp-apo-confirm-modal");
}

function bpApoDeleteConfirmed() {
    if (bpApoPendingDeleteId === null) return;

    bpApoOrders = bpApoOrders.filter(order => order.id !== bpApoPendingDeleteId);
    bpApoPendingDeleteId = null;

    bpApoCloseModal("bp-apo-confirm-modal");
    bpApoRender();
    bpApoShowToast("Purchase order deleted successfully.");
}

/*--- Modal Controls ---*/
function bpApoOpenModal(id) {
    const modal = bpApoGet(id);
    if (!modal) return;

    modal.classList.add("bp-apo-modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function bpApoCloseModal(id) {
    const modal = bpApoGet(id);
    if (!modal) return;

    modal.classList.remove("bp-apo-modal-open");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".bp-apo-modal-open")) {
        document.body.style.overflow = "";
    }
}

/*--- Date Helpers ---*/
function bpApoToday() {
    const date = new Date();
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
}

function bpApoFormatDate(value) {
    if (!value) return "—";

    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

/*--- Currency Helpers ---*/
function bpApoCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function bpApoCompactCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 0
    });
}

/*--- Escape HTML ---*/
function bpApoEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

/*--- CSV Export ---*/
function bpApoExport() {
    const orders = bpApoGetFiltered();

    if (!orders.length) {
        bpApoShowToast("No purchase orders available to export.");
        return;
    }

    const headers = [
        "Order ID", "Supplier", "Product", "Order Date",
        "Delivery Date", "Quantity", "Unit Price", "Total",
        "Payment Status", "Order Status", "Notes"
    ];

    const safeCSV = value => {
        let text = String(value ?? "");
        if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
        return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = orders.map(order => [
        order.orderId,
        order.supplier,
        order.product,
        order.orderDate,
        order.deliveryDate,
        order.quantity,
        order.unitPrice,
        order.quantity * order.unitPrice,
        order.payment,
        order.status,
        order.notes
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(safeCSV).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "stackly-purchase-orders.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    bpApoShowToast("Purchase orders exported successfully.");
}

/*--- Toast Notification ---*/
function bpApoShowToast(message) {
    const toast = bpApoGet("bp-apo-toast");
    bpApoGet("bp-apo-toast-message").textContent = message;

    toast.classList.add("bp-apo-toast-show");
    clearTimeout(bpApoToastTimer);

    bpApoToastTimer = setTimeout(() => {
        toast.classList.remove("bp-apo-toast-show");
    }, 3000);
}
