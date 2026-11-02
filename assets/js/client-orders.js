/*--- Client Purchase Orders ---*/
document.addEventListener("DOMContentLoaded", function () {

    /*--- Elements ---*/
    const searchInput = document.getElementById("bp-orders-search");
    const statusFilter = document.getElementById("bp-orders-status");
    const dateFilter = document.getElementById("bp-orders-date");
    const sortFilter = document.getElementById("bp-orders-sort");
    const resetButton = document.getElementById("bp-orders-reset");
    const emptyResetButton = document.getElementById("bp-orders-empty-reset");
    const tableBody = document.getElementById("bp-orders-table-body");
    const emptyState = document.getElementById("bp-orders-empty");
    const resultsText = document.getElementById("bp-orders-results");
    const footerCount = document.getElementById("bp-orders-footer-count");

    if (!tableBody) return;

    /*--- Original Order Data ---*/
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    /*--- Summary Statistics ---*/
    function updateOrderStats() {
        const total = rows.length;
        const pending = rows.filter(row => row.dataset.status === "pending").length;
        const progress = rows.filter(row =>
            ["confirmed", "processing", "shipped"].includes(row.dataset.status)
        ).length;
        const completed = rows.filter(row => row.dataset.status === "delivered").length;

        document.getElementById("bp-orders-total").textContent = String(total).padStart(2, "0");
        document.getElementById("bp-orders-pending").textContent = String(pending).padStart(2, "0");
        document.getElementById("bp-orders-progress").textContent = String(progress).padStart(2, "0");
        document.getElementById("bp-orders-completed").textContent = String(completed).padStart(2, "0");
    }

    /*--- Filter and Sort Orders ---*/
    function filterOrders() {
        const searchValue = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedDate = dateFilter.value;
        const selectedSort = sortFilter.value;

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        let filteredRows = rows.filter(row => {
            const orderId = row.dataset.id.toLowerCase();
            const product = row.dataset.name.toLowerCase();
            const supplier = row.dataset.supplier.toLowerCase();
            const status = row.dataset.status;
            const orderDate = new Date(row.dataset.date + "T00:00:00");

            const matchesSearch =
                orderId.includes(searchValue) ||
                product.includes(searchValue) ||
                supplier.includes(searchValue);

            const matchesStatus =
                selectedStatus === "all" || status === selectedStatus;

            let matchesDate = true;

            if (selectedDate !== "all") {
                const days = Number(selectedDate);
                const startDate = new Date(today);
                startDate.setDate(startDate.getDate() - days);
                matchesDate = orderDate >= startDate && orderDate <= today;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });

        /*--- Sorting ---*/
        filteredRows.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            const amountA = Number(a.dataset.amount);
            const amountB = Number(b.dataset.amount);

            switch (selectedSort) {
                case "oldest":
                    return dateA - dateB;
                case "highest":
                    return amountB - amountA;
                case "lowest":
                    return amountA - amountB;
                default:
                    return dateB - dateA;
            }
        });

        /*--- Render Filtered Orders ---*/
        rows.forEach(row => {
            row.remove();
        });

        filteredRows.forEach(row => {
            tableBody.appendChild(row);
        });

        /*--- Empty State ---*/
        const hasResults = filteredRows.length > 0;
        emptyState.hidden = hasResults;

        /*--- Results Counter ---*/
        const count = filteredRows.length;
        const resultLabel = count === 1 ? "order" : "orders";

        resultsText.textContent = `Showing ${count} ${resultLabel}`;
        footerCount.textContent = `Showing ${count} of ${rows.length} orders`;
    }

    /*--- Reset Filters ---*/
    function resetFilters() {
        searchInput.value = "";
        statusFilter.value = "all";
        dateFilter.value = "all";
        sortFilter.value = "newest";
        filterOrders();
    }

    /*--- Event Listeners ---*/
    searchInput.addEventListener("input", filterOrders);
    statusFilter.addEventListener("change", filterOrders);
    dateFilter.addEventListener("change", filterOrders);
    sortFilter.addEventListener("change", filterOrders);

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    /*--- Initial Setup ---*/
    updateOrderStats();
    filterOrders();

});