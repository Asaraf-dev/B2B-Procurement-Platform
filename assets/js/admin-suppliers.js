/*--- Admin Suppliers Initialization ---*/
document.addEventListener("DOMContentLoaded", function () {
    bpAsupInit();
});

function bpAsupInit() {

    /*--- Supplier Demo Data ---*/
    let bpAsupSuppliers = [
        { id: 1, company: "Global Supplies", contact: "Arun Kumar", email: "arun@globalsupplies.com", phone: "9876543210", category: "industrial", location: "Chennai, Tamil Nadu", joined: "2026-10-28", status: "active" },
        { id: 2, company: "Prime Industries", contact: "Rahul Sharma", email: "rahul@primeindustries.com", phone: "9876543211", category: "electronics", location: "Bengaluru, Karnataka", joined: "2026-10-24", status: "active" },
        { id: 3, company: "Vertex Traders", contact: "Suresh Raj", email: "suresh@vertextraders.com", phone: "9876543212", category: "raw-materials", location: "Coimbatore, Tamil Nadu", joined: "2026-10-20", status: "pending" },
        { id: 4, company: "Metro Components", contact: "Vijay Kumar", email: "vijay@metrocomponents.com", phone: "9876543213", category: "electronics", location: "Hyderabad, Telangana", joined: "2026-10-18", status: "active" },
        { id: 5, company: "Alpha Solutions", contact: "Mohammed Irfan", email: "irfan@alphasolutions.com", phone: "9876543214", category: "office", location: "Salem, Tamil Nadu", joined: "2026-10-15", status: "suspended" },
        { id: 6, company: "Fresh Pack Industries", contact: "Karthik Raj", email: "karthik@freshpack.com", phone: "9876543215", category: "packaging", location: "Pune, Maharashtra", joined: "2026-10-12", status: "active" },
        { id: 7, company: "Nova Materials", contact: "Pradeep Kumar", email: "pradeep@novamaterials.com", phone: "9876543216", category: "raw-materials", location: "Madurai, Tamil Nadu", joined: "2026-10-09", status: "pending" },
        { id: 8, company: "Office Hub", contact: "Deepak Anand", email: "deepak@officehub.com", phone: "9876543217", category: "office", location: "Mumbai, Maharashtra", joined: "2026-10-05", status: "active" }
    ];

    /*--- DOM Elements ---*/
    const bpAsupTableBody = document.getElementById("bp-asup-table-body");
    const bpAsupSearch = document.getElementById("bp-asup-search");
    const bpAsupStatusFilter = document.getElementById("bp-asup-status-filter");
    const bpAsupCategoryFilter = document.getElementById("bp-asup-category-filter");
    const bpAsupPagination = document.getElementById("bp-asup-pagination");
    const bpAsupEmpty = document.getElementById("bp-asup-empty");

    const bpAsupViewModal = document.getElementById("bp-asup-view-modal");
    const bpAsupFormModal = document.getElementById("bp-asup-form-modal");
    const bpAsupConfirmModal = document.getElementById("bp-asup-confirm-modal");

    const bpAsupForm = document.getElementById("bp-asup-form");
    const bpAsupPageSize = 5;

    let bpAsupCurrentPage = 1;
    let bpAsupSelectedSupplier = null;
    let bpAsupPendingAction = null;
    let bpAsupToastTimer = null;

    /*--- Category Labels ---*/
    const bpAsupCategoryLabels = {
        electronics: "Electronics",
        industrial: "Industrial",
        office: "Office Supplies",
        "raw-materials": "Raw Materials",
        packaging: "Packaging"
    };

    const bpAsupStatusLabels = {
        active: "Active",
        pending: "Pending",
        suspended: "Suspended"
    };

    /*--- HTML Escape Helper ---*/
    function bpAsupEscape(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const bpAsupEntities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return bpAsupEntities[character];
        });
    }

    /*--- Initials Helper ---*/
    function bpAsupInitials(name) {
        return String(name)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(function (part) {
                return part.charAt(0).toUpperCase();
            })
            .join("");
    }

    /*--- Date Formatter ---*/
    function bpAsupFormatDate(date) {
        return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /*--- Toast Notification ---*/
    function bpAsupShowToast(message) {
        const bpAsupToast = document.getElementById("bp-asup-toast");
        const bpAsupToastMessage = document.getElementById("bp-asup-toast-message");

        if (!bpAsupToast || !bpAsupToastMessage) return;

        bpAsupToastMessage.textContent = message;
        bpAsupToast.classList.add("bp-asup-toast-visible");

        clearTimeout(bpAsupToastTimer);

        bpAsupToastTimer = setTimeout(function () {
            bpAsupToast.classList.remove("bp-asup-toast-visible");
        }, 2800);
    }

    /*--- Modal Controls ---*/
    function bpAsupOpenModal(modal) {
        if (!modal) return;

        modal.classList.add("bp-asup-modal-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function bpAsupCloseModal(modal) {
        if (!modal) return;

        modal.classList.remove("bp-asup-modal-open");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".bp-asup-modal.bp-asup-modal-open")) {
            document.body.style.overflow = "";
        }
    }

    document.querySelectorAll("[data-asup-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            const bpAsupModal = button.closest(".bp-asup-modal");
            bpAsupCloseModal(bpAsupModal);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".bp-asup-modal-open").forEach(function (modal) {
                bpAsupCloseModal(modal);
            });
        }
    });

    /*--- Supplier Statistics ---*/
    function bpAsupUpdateStats() {
        const bpAsupTotal = bpAsupSuppliers.length;
        const bpAsupActive = bpAsupSuppliers.filter(item => item.status === "active").length;
        const bpAsupPending = bpAsupSuppliers.filter(item => item.status === "pending").length;
        const bpAsupSuspended = bpAsupSuppliers.filter(item => item.status === "suspended").length;

        document.getElementById("bp-asup-total").textContent = bpAsupTotal;
        document.getElementById("bp-asup-active").textContent = bpAsupActive;
        document.getElementById("bp-asup-pending").textContent = bpAsupPending;
        document.getElementById("bp-asup-suspended").textContent = bpAsupSuspended;
    }

    /*--- Filter Supplier Data ---*/
    function bpAsupGetFilteredData() {
        const bpAsupSearchValue = bpAsupSearch.value.trim().toLowerCase();
        const bpAsupStatusValue = bpAsupStatusFilter.value;
        const bpAsupCategoryValue = bpAsupCategoryFilter.value;

        return bpAsupSuppliers.filter(function (supplier) {
            const bpAsupSearchMatch = [
                supplier.company,
                supplier.contact,
                supplier.email,
                supplier.phone,
                supplier.location
            ].some(function (value) {
                return value.toLowerCase().includes(bpAsupSearchValue);
            });

            const bpAsupStatusMatch =
                bpAsupStatusValue === "all" ||
                supplier.status === bpAsupStatusValue;

            const bpAsupCategoryMatch =
                bpAsupCategoryValue === "all" ||
                supplier.category === bpAsupCategoryValue;

            return bpAsupSearchMatch && bpAsupStatusMatch && bpAsupCategoryMatch;
        });
    }

    /*--- Supplier Table Rendering ---*/
    function bpAsupRenderTable() {
        if (!bpAsupTableBody) return;

        const bpAsupFilteredData = bpAsupGetFilteredData();
        const bpAsupTotal = bpAsupFilteredData.length;
        const bpAsupTotalPages = Math.ceil(bpAsupTotal / bpAsupPageSize);

        if (bpAsupCurrentPage > bpAsupTotalPages) {
            bpAsupCurrentPage = Math.max(1, bpAsupTotalPages);
        }

        const bpAsupStart = (bpAsupCurrentPage - 1) * bpAsupPageSize;
        const bpAsupPageData = bpAsupFilteredData.slice(
            bpAsupStart,
            bpAsupStart + bpAsupPageSize
        );

        bpAsupTableBody.innerHTML = "";

        bpAsupPageData.forEach(function (supplier, index) {
            const bpAsupRow = document.createElement("tr");

            bpAsupRow.innerHTML = `
                <td>
                    <div class="bp-asup-supplier-info">
                        <span class="bp-asup-company-avatar bp-asup-avatar-${index % 5}">${bpAsupEscape(bpAsupInitials(supplier.company))}</span>
                        <span>
                            <strong>${bpAsupEscape(supplier.company)}</strong>
                            <small>${bpAsupEscape(supplier.email)}</small>
                        </span>
                    </div>
                </td>
                <td>
                    <div class="bp-asup-contact-cell">
                        <strong>${bpAsupEscape(supplier.contact)}</strong>
                        <small>${bpAsupEscape(supplier.phone)}</small>
                    </div>
                </td>
                <td><span class="bp-asup-category-tag">${bpAsupEscape(bpAsupCategoryLabels[supplier.category] || supplier.category)}</span></td>
                <td>${bpAsupEscape(supplier.location)}</td>
                <td>${bpAsupFormatDate(supplier.joined)}</td>
                <td><span class="bp-asup-status bp-asup-status-${supplier.status}">${bpAsupEscape(bpAsupStatusLabels[supplier.status])}</span></td>
                <td>
                    <div class="bp-asup-row-actions">
                        <button type="button" class="bp-asup-row-action" data-asup-view="${supplier.id}" title="View supplier" aria-label="View supplier">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="bp-asup-row-action" data-asup-edit="${supplier.id}" title="Edit supplier" aria-label="Edit supplier">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="bp-asup-row-action bp-asup-action-danger" data-asup-status="${supplier.id}" title="${supplier.status === "suspended" ? "Activate supplier" : "Change supplier status"}" aria-label="Change supplier status">
                            <i class="bi ${supplier.status === "suspended" ? "bi-check-circle" : "bi-slash-circle"}"></i>
                        </button>
                    </div>
                </td>
            `;

            bpAsupTableBody.appendChild(bpAsupRow);
        });

        bpAsupEmpty.hidden = bpAsupTotal !== 0;

        document.getElementById("bp-asup-showing").textContent = bpAsupPageData.length;
        document.getElementById("bp-asup-result-total").textContent = bpAsupTotal;

        const bpAsupFirst = bpAsupTotal === 0 ? 0 : bpAsupStart + 1;
        const bpAsupLast = Math.min(bpAsupStart + bpAsupPageSize, bpAsupTotal);

        document.getElementById("bp-asup-page-info").textContent =
            `Showing ${bpAsupFirst}–${bpAsupLast} of ${bpAsupTotal} entries`;

        bpAsupRenderPagination(bpAsupTotalPages);
        bpAsupUpdateStats();
    }

    /*--- Pagination Rendering ---*/
    function bpAsupRenderPagination(totalPages) {
        if (!bpAsupPagination) return;

        bpAsupPagination.innerHTML = "";

        function bpAsupCreatePageButton(label, page, disabled, active, icon) {
            const bpAsupButton = document.createElement("button");

            bpAsupButton.type = "button";
            bpAsupButton.className = "bp-asup-page-btn";
            bpAsupButton.disabled = disabled;

            if (active) {
                bpAsupButton.classList.add("bp-asup-page-active");
                bpAsupButton.setAttribute("aria-current", "page");
            }

            if (icon) {
                bpAsupButton.innerHTML = `<i class="bi ${icon}"></i>`;
            } else {
                bpAsupButton.textContent = label;
            }

            bpAsupButton.addEventListener("click", function () {
                bpAsupCurrentPage = page;
                bpAsupRenderTable();
            });

            bpAsupPagination.appendChild(bpAsupButton);
        }

        bpAsupCreatePageButton("", bpAsupCurrentPage - 1, bpAsupCurrentPage === 1, false, "bi-chevron-left");

        for (let page = 1; page <= totalPages; page++) {
            bpAsupCreatePageButton(
                String(page),
                page,
                false,
                page === bpAsupCurrentPage,
                null
            );
        }

        bpAsupCreatePageButton("", bpAsupCurrentPage + 1, bpAsupCurrentPage === totalPages || totalPages === 0, false, "bi-chevron-right");
    }

    /*--- Search and Filter Events ---*/
    bpAsupSearch.addEventListener("input", function () {
        bpAsupCurrentPage = 1;

        document.getElementById("bp-asup-clear-search").classList.toggle(
            "bp-asup-clear-visible",
            this.value.length > 0
        );

        bpAsupRenderTable();
    });

    bpAsupStatusFilter.addEventListener("change", function () {
        bpAsupCurrentPage = 1;
        bpAsupRenderTable();
    });

    bpAsupCategoryFilter.addEventListener("change", function () {
        bpAsupCurrentPage = 1;
        bpAsupRenderTable();
    });

    /*--- Reset Filters ---*/
    function bpAsupResetFilters() {
        bpAsupSearch.value = "";
        bpAsupStatusFilter.value = "all";
        bpAsupCategoryFilter.value = "all";
        bpAsupCurrentPage = 1;

        document.getElementById("bp-asup-clear-search").classList.remove("bp-asup-clear-visible");

        bpAsupRenderTable();
    }

    document.getElementById("bp-asup-clear-search").addEventListener("click", function () {
        bpAsupSearch.value = "";
        this.classList.remove("bp-asup-clear-visible");
        bpAsupCurrentPage = 1;
        bpAsupRenderTable();
        bpAsupSearch.focus();
    });

    document.getElementById("bp-asup-reset-filters").addEventListener("click", bpAsupResetFilters);
    document.getElementById("bp-asup-empty-reset").addEventListener("click", bpAsupResetFilters);

    /*--- Clear Supplier Form ---*/
    function bpAsupClearForm() {
        bpAsupForm.reset();

        document.getElementById("bp-asup-edit-id").value = "";
        document.getElementById("bp-asup-form-title").textContent = "Add New Supplier";
        document.getElementById("bp-asup-save-btn").innerHTML = '<i class="bi bi-check2"></i> Save Supplier';
        document.getElementById("bp-asup-form-message").textContent = "";

        document.querySelectorAll(".bp-asup-field-error").forEach(function (error) {
            error.textContent = "";
        });
    }

    /*--- Open Add Supplier Form ---*/
    document.getElementById("bp-asup-add-btn").addEventListener("click", function () {
        bpAsupClearForm();
        bpAsupOpenModal(bpAsupFormModal);
    });

    /*--- Open Edit Supplier Form ---*/
    function bpAsupEditSupplier(id) {
        const supplier = bpAsupSuppliers.find(item => item.id === id);

        if (!supplier) return;

        bpAsupClearForm();

        document.getElementById("bp-asup-edit-id").value = supplier.id;
        document.getElementById("bp-asup-company").value = supplier.company;
        document.getElementById("bp-asup-contact").value = supplier.contact;
        document.getElementById("bp-asup-email").value = supplier.email;
        document.getElementById("bp-asup-phone").value = supplier.phone;
        document.getElementById("bp-asup-category").value = supplier.category;
        document.getElementById("bp-asup-location").value = supplier.location;
        document.getElementById("bp-asup-status").value = supplier.status;

        document.getElementById("bp-asup-form-title").textContent = "Edit Supplier";
        document.getElementById("bp-asup-save-btn").innerHTML = '<i class="bi bi-check2"></i> Update Supplier';

        bpAsupOpenModal(bpAsupFormModal);
    }

    /*--- Validate Supplier Form ---*/
    function bpAsupValidateForm() {
        const bpAsupFields = [
            { id: "bp-asup-company", error: "bp-asup-company-error", message: "Enter a company name." },
            { id: "bp-asup-contact", error: "bp-asup-contact-error", message: "Enter a contact person." },
            { id: "bp-asup-email", error: "bp-asup-email-error", message: "Enter a valid email address." },
            { id: "bp-asup-phone", error: "bp-asup-phone-error", message: "Enter a valid 10-digit phone number." },
            { id: "bp-asup-category", error: "bp-asup-category-error", message: "Select a supplier category." },
            { id: "bp-asup-location", error: "bp-asup-location-error", message: "Enter the supplier location." }
        ];

        let bpAsupIsValid = true;
        let bpAsupFirstInvalid = null;

        bpAsupFields.forEach(function (field) {
            const input = document.getElementById(field.id);
            const error = document.getElementById(field.error);
            const value = input.value.trim();

            let valid = value.length > 0;

            if (field.id === "bp-asup-email") {
                valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }
            
            if (field.id === "bp-asup-contact") {
                valid = /^[A-Za-z\s]+$/.test(value);
            }

            if (field.id === "bp-asup-phone") {
                valid = /^[0-9]{10}$/.test(value);
            }

            error.textContent = valid ? "" : field.message;
            input.setAttribute("aria-invalid", String(!valid));

            if (!valid) {
                bpAsupIsValid = false;
                bpAsupFirstInvalid = bpAsupFirstInvalid || input;
            }
        });

        if (bpAsupFirstInvalid) {
            bpAsupFirstInvalid.focus();
        }

        return bpAsupIsValid;
    }

    /*--- Contact Person Alphabet Restriction ---*/
    document.getElementById("bp-asup-contact").addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
        document.getElementById("bp-asup-contact-error").textContent = "";
    });

    /*--- Phone Input Restriction ---*/
    document.getElementById("bp-asup-phone").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
        document.getElementById("bp-asup-phone-error").textContent = "";
    });

    /*--- Save Supplier ---*/
    bpAsupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!bpAsupValidateForm()) return;

        const bpAsupEditId = document.getElementById("bp-asup-edit-id").value;

        const bpAsupSupplierData = {
            company: document.getElementById("bp-asup-company").value.trim(),
            contact: document.getElementById("bp-asup-contact").value.trim(),
            email: document.getElementById("bp-asup-email").value.trim(),
            phone: document.getElementById("bp-asup-phone").value.trim(),
            category: document.getElementById("bp-asup-category").value,
            location: document.getElementById("bp-asup-location").value.trim(),
            status: document.getElementById("bp-asup-status").value
        };

        const bpAsupDuplicate = bpAsupSuppliers.some(function (supplier) {
            return supplier.email.toLowerCase() === bpAsupSupplierData.email.toLowerCase() &&
                String(supplier.id) !== bpAsupEditId;
        });

        if (bpAsupDuplicate) {
            document.getElementById("bp-asup-form-message").textContent =
                "A supplier with this email address already exists.";
            document.getElementById("bp-asup-email").focus();
            return;
        }

        if (bpAsupEditId) {
            const supplier = bpAsupSuppliers.find(item => String(item.id) === bpAsupEditId);

            if (supplier) {
                Object.assign(supplier, bpAsupSupplierData);
                bpAsupShowToast("Supplier details updated successfully.");
            }
        } else {
            bpAsupSuppliers.unshift({
                id: Date.now(),
                ...bpAsupSupplierData,
                joined: new Date().toISOString().slice(0, 10)
            });

            bpAsupShowToast("New supplier added successfully.");
        }

        bpAsupCurrentPage = 1;
        bpAsupRenderTable();
        bpAsupCloseModal(bpAsupFormModal);
        bpAsupClearForm();
    });

    /*--- View Supplier Details ---*/
    function bpAsupViewSupplier(id) {
        const supplier = bpAsupSuppliers.find(item => item.id === id);

        if (!supplier) return;

        bpAsupSelectedSupplier = id;

        const bpAsupContent = document.getElementById("bp-asup-view-content");

        bpAsupContent.innerHTML = `
            <div class="bp-asup-detail-top">
                <div class="bp-asup-detail-avatar">${bpAsupEscape(bpAsupInitials(supplier.company))}</div>
                <div>
                    <h4>${bpAsupEscape(supplier.company)}</h4>
                    <p>${bpAsupEscape(bpAsupCategoryLabels[supplier.category] || supplier.category)}</p>
                </div>
            </div>
            <div class="bp-asup-detail-grid">
                <div class="bp-asup-detail-field"><span>Contact Person</span><strong>${bpAsupEscape(supplier.contact)}</strong></div>
                <div class="bp-asup-detail-field"><span>Email Address</span><strong>${bpAsupEscape(supplier.email)}</strong></div>
                <div class="bp-asup-detail-field"><span>Phone Number</span><strong>${bpAsupEscape(supplier.phone)}</strong></div>
                <div class="bp-asup-detail-field"><span>Location</span><strong>${bpAsupEscape(supplier.location)}</strong></div>
                <div class="bp-asup-detail-field"><span>Registration Date</span><strong>${bpAsupFormatDate(supplier.joined)}</strong></div>
                <div class="bp-asup-detail-field"><span>Supplier Status</span><strong><span class="bp-asup-status bp-asup-status-${supplier.status}">${bpAsupEscape(bpAsupStatusLabels[supplier.status])}</span></strong></div>
            </div>
        `;

        bpAsupOpenModal(bpAsupViewModal);
    }

    document.getElementById("bp-asup-view-edit").addEventListener("click", function () {
        const bpAsupId = bpAsupSelectedSupplier;

        bpAsupCloseModal(bpAsupViewModal);
        bpAsupEditSupplier(bpAsupId);
    });

    /*--- Confirm Supplier Status Change ---*/
    function bpAsupConfirmStatus(id) {
        const supplier = bpAsupSuppliers.find(item => item.id === id);

        if (!supplier) return;

        const bpAsupNextStatus = supplier.status === "suspended" ? "active" : "suspended";

        bpAsupPendingAction = {
            id: id,
            status: bpAsupNextStatus
        };

        document.getElementById("bp-asup-confirm-title").textContent =
            bpAsupNextStatus === "suspended" ? "Suspend Supplier?" : "Activate Supplier?";

        document.getElementById("bp-asup-confirm-message").textContent =
            bpAsupNextStatus === "suspended"
                ? `Are you sure you want to suspend ${supplier.company}?`
                : `Are you sure you want to activate ${supplier.company}?`;

        document.getElementById("bp-asup-confirm-action").textContent =
            bpAsupNextStatus === "suspended" ? "Suspend Supplier" : "Activate Supplier";

        bpAsupOpenModal(bpAsupConfirmModal);
    }

    document.getElementById("bp-asup-confirm-action").addEventListener("click", function () {
        if (!bpAsupPendingAction) return;

        const supplier = bpAsupSuppliers.find(item => item.id === bpAsupPendingAction.id);

        if (supplier) {
            supplier.status = bpAsupPendingAction.status;

            bpAsupShowToast(
                supplier.status === "suspended"
                    ? "Supplier suspended successfully."
                    : "Supplier activated successfully."
            );
        }

        bpAsupPendingAction = null;
        bpAsupCloseModal(bpAsupConfirmModal);
        bpAsupRenderTable();
    });

    /*--- Table Action Delegation ---*/
    bpAsupTableBody.addEventListener("click", function (event) {
        const viewButton = event.target.closest("[data-asup-view]");
        const editButton = event.target.closest("[data-asup-edit]");
        const statusButton = event.target.closest("[data-asup-status]");

        if (viewButton) {
            bpAsupViewSupplier(Number(viewButton.dataset.asupView));
        }

        if (editButton) {
            bpAsupEditSupplier(Number(editButton.dataset.asupEdit));
        }

        if (statusButton) {
            bpAsupConfirmStatus(Number(statusButton.dataset.asupStatus));
        }
    });

    /*--- Export Suppliers CSV ---*/
    document.getElementById("bp-asup-export-btn").addEventListener("click", function () {
        const bpAsupData = bpAsupGetFilteredData();

        if (bpAsupData.length === 0) {
            bpAsupShowToast("There are no suppliers to export.");
            return;
        }

        const bpAsupHeaders = [
            "Company",
            "Contact Person",
            "Email",
            "Phone",
            "Category",
            "Location",
            "Joined Date",
            "Status"
        ];

        function bpAsupCsvCell(value) {
            let safeValue = String(value ?? "");

            if (/^[=+\-@\t\r]/.test(safeValue)) {
                safeValue = "'" + safeValue;
            }

            return '"' + safeValue.replace(/"/g, '""') + '"';
        }

        const bpAsupRows = bpAsupData.map(function (supplier) {
            return [
                supplier.company,
                supplier.contact,
                supplier.email,
                supplier.phone,
                bpAsupCategoryLabels[supplier.category] || supplier.category,
                supplier.location,
                supplier.joined,
                bpAsupStatusLabels[supplier.status]
            ].map(bpAsupCsvCell).join(",");
        });

        const bpAsupCsv = [
            bpAsupHeaders.map(bpAsupCsvCell).join(","),
            ...bpAsupRows
        ].join("\r\n");

        const bpAsupBlob = new Blob(["\uFEFF" + bpAsupCsv], {
            type: "text/csv;charset=utf-8;"
        });

        const bpAsupUrl = URL.createObjectURL(bpAsupBlob);
        const bpAsupLink = document.createElement("a");

        bpAsupLink.href = bpAsupUrl;
        bpAsupLink.download = "stackly-suppliers.csv";
        document.body.appendChild(bpAsupLink);
        bpAsupLink.click();
        bpAsupLink.remove();

        URL.revokeObjectURL(bpAsupUrl);

        bpAsupShowToast("Supplier CSV exported successfully.");
    });

    /*--- Initial Render ---*/
    bpAsupRenderTable();
}