/*--- Admin Products Management ---*/

document.addEventListener("DOMContentLoaded", function () {
    bpAprdInit();
});

/*--- Product Data ---*/
let bpAprdProducts = [
    {id:1,name:"Wireless Keyboard & Mouse",sku:"STK-1001",supplier:"TechNova Solutions",category:"Electronics",price:2499,stock:45,status:"Active",description:"Wireless keyboard and mouse combo for professional office environments."},
    {id:2,name:"Ergonomic Office Chair",sku:"STK-1002",supplier:"Urban Office Supplies",category:"Furniture",price:8999,stock:18,status:"Active",description:"Ergonomic adjustable office chair with lumbar support."},
    {id:3,name:"A4 Copier Paper Box",sku:"STK-1003",supplier:"Prime Paper Traders",category:"Office Supplies",price:1850,stock:120,status:"Active",description:"Premium quality A4 copier paper for everyday office use."},
    {id:4,name:"Industrial Safety Helmet",sku:"STK-1004",supplier:"SafeGuard Industries",category:"Safety Equipment",price:650,stock:0,status:"Out of Stock",description:"Industrial protective helmet for workplace safety."},
    {id:5,name:"LED Monitor 24 Inch",sku:"STK-1005",supplier:"TechNova Solutions",category:"Electronics",price:12499,stock:32,status:"Active",description:"24-inch full HD LED monitor for business workstations."},
    {id:6,name:"Heavy Duty Storage Rack",sku:"STK-1006",supplier:"MetalWorks India",category:"Industrial",price:6500,stock:12,status:"Active",description:"Heavy-duty metal storage rack for warehouses."},
    {id:7,name:"Executive Office Desk",sku:"STK-1007",supplier:"Urban Office Supplies",category:"Furniture",price:15999,stock:0,status:"Draft",description:"Modern executive desk designed for professional offices."},
    {id:8,name:"USB-C Docking Station",sku:"STK-1008",supplier:"TechNova Solutions",category:"Electronics",price:4299,stock:5,status:"Active",description:"Multi-port USB-C docking station for laptops."},
    {id:9,name:"Protective Safety Gloves",sku:"STK-1009",supplier:"SafeGuard Industries",category:"Safety Equipment",price:350,stock:65,status:"Active",description:"Durable protective gloves for industrial applications."},
    {id:10,name:"Desktop File Organizer",sku:"STK-1010",supplier:"Prime Paper Traders",category:"Office Supplies",price:499,stock:0,status:"Out of Stock",description:"Compact desktop organizer for documents and stationery."}
];

let bpAprdCurrentPage = 1;
const bpAprdPageSize = 5;
let bpAprdCurrentViewId = null;
let bpAprdPendingDeleteId = null;
let bpAprdToastTimer = null;

/*--- DOM References ---*/
const bpAprdGet = id => document.getElementById(id);

/*--- Initialize ---*/
function bpAprdInit() {
    const requiredIds = [
        "bp-aprd-table-body",
        "bp-aprd-form",
        "bp-aprd-form-modal",
        "bp-aprd-view-modal",
        "bp-aprd-confirm-modal"
    ];

    if (requiredIds.some(id => !bpAprdGet(id))) {
        console.error("Admin Products: Required HTML elements are missing.");
        return;
    }

    bpAprdBindEvents();
    bpAprdRender();
    bpAprdSetFooter();
}

/*--- Event Listeners ---*/
function bpAprdBindEvents() {
    bpAprdGet("bp-aprd-add-btn").addEventListener("click", bpAprdOpenAdd);
    bpAprdGet("bp-aprd-form").addEventListener("submit", bpAprdSave);

    bpAprdGet("bp-aprd-search").addEventListener("input", function () {
        bpAprdCurrentPage = 1;
        bpAprdGet("bp-aprd-clear-search").classList.toggle("bp-aprd-clear-visible", this.value.length > 0);
        bpAprdRender();
    });

    bpAprdGet("bp-aprd-category-filter").addEventListener("change", bpAprdFilterChanged);
    bpAprdGet("bp-aprd-status-filter").addEventListener("change", bpAprdFilterChanged);
    bpAprdGet("bp-aprd-reset").addEventListener("click", bpAprdResetFilters);
    bpAprdGet("bp-aprd-empty-reset").addEventListener("click", bpAprdResetFilters);
    bpAprdGet("bp-aprd-clear-search").addEventListener("click", function () {
        bpAprdGet("bp-aprd-search").value = "";
        this.classList.remove("bp-aprd-clear-visible");
        bpAprdCurrentPage = 1;
        bpAprdRender();
    });

    bpAprdGet("bp-aprd-export").addEventListener("click", bpAprdExport);
    bpAprdGet("bp-aprd-view-edit").addEventListener("click", function () {
        if (bpAprdCurrentViewId !== null) {
            const product = bpAprdProducts.find(item => item.id === bpAprdCurrentViewId);
            if (product) {
                bpAprdCloseModal("bp-aprd-view-modal");
                bpAprdOpenEdit(product.id);
            }
        }
    });

    bpAprdGet("bp-aprd-confirm-action").addEventListener("click", bpAprdDeleteConfirmed);

    document.querySelectorAll("[data-aprd-close]").forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".bp-aprd-modal");
            if (modal) bpAprdCloseModal(modal.id);
        });
    });

    bpAprdGet("bp-aprd-table-body").addEventListener("click", function (event) {
        const button = event.target.closest("[data-aprd-action]");
        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.aprdAction;

        if (action === "view") bpAprdOpenView(id);
        if (action === "edit") bpAprdOpenEdit(id);
        if (action === "delete") bpAprdAskDelete(id);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".bp-aprd-modal-open").forEach(modal => {
                bpAprdCloseModal(modal.id);
            });
        }
    });
}

/*--- Footer Year ---*/
function bpAprdSetFooter() {
    const year = bpAprdGet("bp-dash-footer-year");
    if (year) year.textContent = new Date().getFullYear();
}

/*--- Filter Products ---*/
function bpAprdGetFiltered() {
    const search = bpAprdGet("bp-aprd-search").value.trim().toLowerCase();
    const category = bpAprdGet("bp-aprd-category-filter").value;
    const status = bpAprdGet("bp-aprd-status-filter").value;

    return bpAprdProducts.filter(product => {
        const matchesSearch = [
            product.name,
            product.sku,
            product.supplier,
            product.category
        ].some(value => String(value).toLowerCase().includes(search));

        return matchesSearch &&
            (!category || product.category === category) &&
            (!status || product.status === status);
    });
}

function bpAprdFilterChanged() {
    bpAprdCurrentPage = 1;
    bpAprdRender();
}

function bpAprdResetFilters() {
    bpAprdGet("bp-aprd-search").value = "";
    bpAprdGet("bp-aprd-category-filter").value = "";
    bpAprdGet("bp-aprd-status-filter").value = "";
    bpAprdGet("bp-aprd-clear-search").classList.remove("bp-aprd-clear-visible");
    bpAprdCurrentPage = 1;
    bpAprdRender();
}

/*--- Render Products ---*/
function bpAprdRender() {
    bpAprdRenderStats();

    const filtered = bpAprdGetFiltered();
    const total = filtered.length;
    const totalPages = Math.ceil(total / bpAprdPageSize);

    if (totalPages > 0 && bpAprdCurrentPage > totalPages) {
        bpAprdCurrentPage = totalPages;
    }

    const start = (bpAprdCurrentPage - 1) * bpAprdPageSize;
    const currentProducts = filtered.slice(start, start + bpAprdPageSize);

    bpAprdGet("bp-aprd-result-total").textContent = total;
    bpAprdGet("bp-aprd-showing").textContent = currentProducts.length;
    bpAprdGet("bp-aprd-empty").hidden = total !== 0;
    bpAprdGet("bp-aprd-table-body").innerHTML = currentProducts.map(bpAprdRow).join("");

    bpAprdGet("bp-aprd-page-info").textContent = `Page ${totalPages ? bpAprdCurrentPage : 0} of ${totalPages}`;
    bpAprdRenderPagination(totalPages);
}

/*--- Render Statistics ---*/
function bpAprdRenderStats() {
    bpAprdGet("bp-aprd-total").textContent = bpAprdProducts.length;
    bpAprdGet("bp-aprd-active").textContent = bpAprdProducts.filter(p => p.status === "Active").length;
    bpAprdGet("bp-aprd-draft").textContent = bpAprdProducts.filter(p => p.status === "Draft").length;
    bpAprdGet("bp-aprd-out").textContent = bpAprdProducts.filter(p => p.status === "Out of Stock" || p.stock === 0).length;
}

/*--- Product Table Row ---*/
function bpAprdRow(product) {
    const icons = {
        "Electronics": "bi-cpu",
        "Office Supplies": "bi-journal-text",
        "Furniture": "bi-lamp",
        "Industrial": "bi-gear",
        "Safety Equipment": "bi-shield-check"
    };

    const statusClass = {
        "Active": "bp-aprd-status-active",
        "Draft": "bp-aprd-status-draft",
        "Out of Stock": "bp-aprd-status-out"
    };

    const stockClass = product.stock === 0 ? "bp-aprd-stock-zero" :
        product.stock <= 10 ? "bp-aprd-stock-low" : "";

    return `
        <tr>
            <td>
                <div class="bp-aprd-product-cell">
                    <div class="bp-aprd-product-image"><i class="bi ${icons[product.category] || "bi-box"}"></i></div>
                    <div>
                        <div class="bp-aprd-product-name">${bpAprdEscape(product.name)}</div>
                        <div class="bp-aprd-product-sub">${bpAprdEscape(product.category)}</div>
                    </div>
                </div>
            </td>
            <td><span class="bp-aprd-sku">${bpAprdEscape(product.sku)}</span></td>
            <td>${bpAprdEscape(product.supplier)}</td>
            <td>${bpAprdEscape(product.category)}</td>
            <td><span class="bp-aprd-price">${bpAprdCurrency(product.price)}</span></td>
            <td><span class="bp-aprd-stock ${stockClass}">${product.stock}</span></td>
            <td><span class="bp-aprd-status ${statusClass[product.status]}">${bpAprdEscape(product.status)}</span></td>
            <td>
                <div class="bp-aprd-actions">
                    <button type="button" class="bp-aprd-action-btn" data-aprd-action="view" data-id="${product.id}" title="View"><i class="bi bi-eye"></i></button>
                    <button type="button" class="bp-aprd-action-btn" data-aprd-action="edit" data-id="${product.id}" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button type="button" class="bp-aprd-action-btn bp-aprd-action-delete" data-aprd-action="delete" data-id="${product.id}" title="Delete"><i class="bi bi-trash3"></i></button>
                </div>
            </td>
        </tr>
    `;
}

/*--- Pagination ---*/
function bpAprdRenderPagination(totalPages) {
    const container = bpAprdGet("bp-aprd-pagination");
    container.innerHTML = "";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "bp-aprd-page-btn";
    prev.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prev.disabled = bpAprdCurrentPage <= 1 || totalPages === 0;
    prev.addEventListener("click", function () {
        bpAprdCurrentPage--;
        bpAprdRender();
    });
    container.appendChild(prev);

    for (let page = 1; page <= totalPages; page++) {
        if (totalPages > 5 && page > 2 && page < totalPages - 1 &&
            Math.abs(page - bpAprdCurrentPage) > 1) {
            if (!container.querySelector(".bp-aprd-page-dots")) {
                const dots = document.createElement("span");
                dots.className = "bp-aprd-page-dots";
                dots.textContent = "...";
                container.appendChild(dots);
            }
            continue;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = `bp-aprd-page-btn ${page === bpAprdCurrentPage ? "active" : ""}`;
        button.textContent = page;
        button.addEventListener("click", function () {
            bpAprdCurrentPage = page;
            bpAprdRender();
        });
        container.appendChild(button);
    }

    const next = document.createElement("button");
    next.type = "button";
    next.className = "bp-aprd-page-btn";
    next.innerHTML = '<i class="bi bi-chevron-right"></i>';
    next.disabled = bpAprdCurrentPage >= totalPages || totalPages === 0;
    next.addEventListener("click", function () {
        bpAprdCurrentPage++;
        bpAprdRender();
    });
    container.appendChild(next);
}

/*--- Open Add Product Modal ---*/
function bpAprdOpenAdd() {
    bpAprdResetForm();
    bpAprdGet("bp-aprd-form-title").textContent = "Add New Product";
    bpAprdGet("bp-aprd-save-btn").innerHTML = '<i class="bi bi-check-lg"></i> Save Product';
    bpAprdOpenModal("bp-aprd-form-modal");
}

/*--- Open Edit Product Modal ---*/
function bpAprdOpenEdit(id) {
    const product = bpAprdProducts.find(item => item.id === id);
    if (!product) return;

    bpAprdResetForm();

    bpAprdGet("bp-aprd-edit-id").value = product.id;
    bpAprdGet("bp-aprd-name").value = product.name;
    bpAprdGet("bp-aprd-sku").value = product.sku;
    bpAprdGet("bp-aprd-category").value = product.category;
    bpAprdGet("bp-aprd-description").value = product.description;
    bpAprdGet("bp-aprd-supplier").value = product.supplier;
    bpAprdGet("bp-aprd-price").value = product.price;
    bpAprdGet("bp-aprd-stock").value = product.stock;
    bpAprdGet("bp-aprd-status").value = product.status;

    bpAprdGet("bp-aprd-form-title").textContent = "Edit Product";
    bpAprdGet("bp-aprd-save-btn").innerHTML = '<i class="bi bi-check-lg"></i> Update Product';

    bpAprdOpenModal("bp-aprd-form-modal");
}

/*--- Reset Product Form ---*/
function bpAprdResetForm() {
    bpAprdGet("bp-aprd-form").reset();
    bpAprdGet("bp-aprd-edit-id").value = "";
    bpAprdGet("bp-aprd-form-message").textContent = "";

    document.querySelectorAll(".bp-aprd-error").forEach(error => error.textContent = "");
    document.querySelectorAll(".bp-aprd-invalid").forEach(input => input.classList.remove("bp-aprd-invalid"));
}

/*--- Validate Product Form ---*/
function bpAprdValidate() {
    const fields = [
        ["name", "bp-aprd-name", "Product name is required."],
        ["sku", "bp-aprd-sku", "SKU is required."],
        ["category", "bp-aprd-category", "Please select a category."],
        ["supplier", "bp-aprd-supplier", "Supplier name is required."]
    ];

    let valid = true;

    fields.forEach(([name, id, message]) => {
        const input = bpAprdGet(id);
        const error = bpAprdGet(`bp-aprd-${name}-error`);

        if (!input.value.trim()) {
            input.classList.add("bp-aprd-invalid");
            error.textContent = message;
            valid = false;
        } else {
            input.classList.remove("bp-aprd-invalid");
            error.textContent = "";
        }
    });

    const price = bpAprdGet("bp-aprd-price");
    const priceError = bpAprdGet("bp-aprd-price-error");
    if (!price.value || !Number.isFinite(Number(price.value)) || Number(price.value) <= 0) {
        price.classList.add("bp-aprd-invalid");
        priceError.textContent = "Enter a valid price greater than zero.";
        valid = false;
    } else {
        price.classList.remove("bp-aprd-invalid");
        priceError.textContent = "";
    }

    const stock = bpAprdGet("bp-aprd-stock");
    const stockError = bpAprdGet("bp-aprd-stock-error");
    if (stock.value === "" || !Number.isInteger(Number(stock.value)) || Number(stock.value) < 0) {
        stock.classList.add("bp-aprd-invalid");
        stockError.textContent = "Enter a valid whole-number stock quantity.";
        valid = false;
    } else {
        stock.classList.remove("bp-aprd-invalid");
        stockError.textContent = "";
    }

    return valid;
}

/*--- Save Product ---*/
function bpAprdSave(event) {
    event.preventDefault();

    if (!bpAprdValidate()) return;

    const editId = Number(bpAprdGet("bp-aprd-edit-id").value);
    const sku = bpAprdGet("bp-aprd-sku").value.trim().toUpperCase();

    const duplicate = bpAprdProducts.find(product =>
        product.sku.toLowerCase() === sku.toLowerCase() && product.id !== editId
    );

    if (duplicate) {
        bpAprdGet("bp-aprd-sku").classList.add("bp-aprd-invalid");
        bpAprdGet("bp-aprd-sku-error").textContent = "This SKU is already in use.";
        return;
    }

    const stock = Number(bpAprdGet("bp-aprd-stock").value);
    let status = bpAprdGet("bp-aprd-status").value;

    if (stock === 0 && status === "Active") {
        status = "Out of Stock";
    } else if (stock > 0 && status === "Out of Stock") {
        status = "Active";
    }

    const productData = {
        id: editId || Date.now(),
        name: bpAprdGet("bp-aprd-name").value.trim(),
        sku,
        category: bpAprdGet("bp-aprd-category").value,
        description: bpAprdGet("bp-aprd-description").value.trim(),
        supplier: bpAprdGet("bp-aprd-supplier").value.trim(),
        price: Number(bpAprdGet("bp-aprd-price").value),
        stock,
        status
    };

    if (editId) {
        bpAprdProducts = bpAprdProducts.map(product =>
            product.id === editId ? productData : product
        );
        bpAprdShowToast("Product updated successfully.");
    } else {
        bpAprdProducts.unshift(productData);
        bpAprdShowToast("Product added successfully.");
    }

    bpAprdCurrentPage = 1;
    bpAprdCloseModal("bp-aprd-form-modal");
    bpAprdRender();
}

/*--- View Product ---*/
function bpAprdOpenView(id) {
    const product = bpAprdProducts.find(item => item.id === id);
    if (!product) return;

    bpAprdCurrentViewId = id;

    const items = [
        ["Product Name", product.name],
        ["SKU", product.sku],
        ["Supplier", product.supplier],
        ["Category", product.category],
        ["Unit Price", bpAprdCurrency(product.price)],
        ["Available Stock", product.stock],
        ["Status", product.status]
    ];

    bpAprdGet("bp-aprd-view-content").innerHTML = `
        <div class="bp-aprd-view-grid">
            ${items.map(([label, value]) => `
                <div class="bp-aprd-view-item">
                    <small>${bpAprdEscape(label)}</small>
                    <strong>${bpAprdEscape(value)}</strong>
                </div>
            `).join("")}
            <div class="bp-aprd-view-item bp-aprd-view-description">
                <small>Description</small>
                <strong>${bpAprdEscape(product.description || "No description provided.")}</strong>
            </div>
        </div>
    `;

    bpAprdOpenModal("bp-aprd-view-modal");
}

/*--- Delete Product ---*/
function bpAprdAskDelete(id) {
    const product = bpAprdProducts.find(item => item.id === id);
    if (!product) return;

    bpAprdPendingDeleteId = id;
    bpAprdGet("bp-aprd-confirm-title").textContent = "Delete Product?";
    bpAprdGet("bp-aprd-confirm-message").textContent =
        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`;

    bpAprdOpenModal("bp-aprd-confirm-modal");
}

function bpAprdDeleteConfirmed() {
    if (bpAprdPendingDeleteId === null) return;

    bpAprdProducts = bpAprdProducts.filter(product => product.id !== bpAprdPendingDeleteId);
    bpAprdPendingDeleteId = null;

    bpAprdCloseModal("bp-aprd-confirm-modal");
    bpAprdRender();
    bpAprdShowToast("Product deleted successfully.");
}

/*--- Modal Controls ---*/
function bpAprdOpenModal(id) {
    const modal = bpAprdGet(id);
    if (!modal) return;

    modal.classList.add("bp-aprd-modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function bpAprdCloseModal(id) {
    const modal = bpAprdGet(id);
    if (!modal) return;

    modal.classList.remove("bp-aprd-modal-open");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".bp-aprd-modal-open")) {
        document.body.style.overflow = "";
    }
}

/*--- Currency Formatting ---*/
function bpAprdCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/*--- Safe HTML Output ---*/
function bpAprdEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

/*--- CSV Export ---*/
function bpAprdExport() {
    const products = bpAprdGetFiltered();

    if (!products.length) {
        bpAprdShowToast("No products available to export.");
        return;
    }

    const columns = ["Product Name", "SKU", "Supplier", "Category", "Price", "Stock", "Status", "Description"];

    const safeCSV = value => {
        let text = String(value ?? "");
        if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
        return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = products.map(product => [
        product.name,
        product.sku,
        product.supplier,
        product.category,
        product.price,
        product.stock,
        product.status,
        product.description
    ]);

    const csv = [columns, ...rows].map(row => row.map(safeCSV).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "stackly-products.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    bpAprdShowToast("Product CSV exported successfully.");
}

/*--- Toast Notification ---*/
function bpAprdShowToast(message) {
    const toast = bpAprdGet("bp-aprd-toast");
    bpAprdGet("bp-aprd-toast-message").textContent = message;

    toast.classList.add("bp-aprd-toast-show");
    clearTimeout(bpAprdToastTimer);

    bpAprdToastTimer = setTimeout(() => {
        toast.classList.remove("bp-aprd-toast-show");
    }, 3000);
}