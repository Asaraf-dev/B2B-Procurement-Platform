/*--- Client Suppliers ---*/
document.addEventListener("DOMContentLoaded", function () {

    /*--- Elements ---*/
    const searchInput = document.getElementById("bp-supplier-search");
    const categoryFilter = document.getElementById("bp-supplier-category");
    const statusFilter = document.getElementById("bp-supplier-status");
    const clearButton = document.getElementById("bp-supplier-clear");
    const resetButton = document.getElementById("bp-supplier-reset");
    const emptyResetButton = document.getElementById("bp-supplier-empty-reset");
    const supplierCards = Array.from(document.querySelectorAll(".bp-supplier-card"));
    const resultsCount = document.getElementById("bp-supplier-results-count");
    const showingCount = document.getElementById("bp-supplier-showing");
    const emptyState = document.getElementById("bp-suppliers-empty");
    const supplierGrid = document.getElementById("bp-suppliers-grid");

    if (!searchInput || !categoryFilter || !statusFilter || !supplierGrid) return;

    /*--- Filter Suppliers ---*/
    function filterSuppliers() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;

        let visibleCount = 0;

        supplierCards.forEach(function (card) {

            const name = card.dataset.name.toLowerCase();
            const category = card.dataset.category;
            const status = card.dataset.status;

            const matchesSearch = name.includes(searchValue) ||
                category.toLowerCase().includes(searchValue);

            const matchesCategory = !categoryValue || category === categoryValue;
            const matchesStatus = !statusValue || status === statusValue;

            const isVisible = matchesSearch && matchesCategory && matchesStatus;

            card.hidden = !isVisible;

            if (isVisible) visibleCount++;

        });

        /*--- Update Results ---*/
        resultsCount.textContent = visibleCount + (visibleCount === 1 ? " supplier found" : " suppliers found");
        showingCount.textContent = visibleCount;

        emptyState.hidden = visibleCount !== 0;
        supplierGrid.hidden = visibleCount === 0;

        clearButton.classList.toggle("bp-search-clear-visible", searchInput.value.length > 0);
    }

    /*--- Clear All Filters ---*/
    function resetFilters() {
        searchInput.value = "";
        categoryFilter.value = "";
        statusFilter.value = "";
        filterSuppliers();
    }

    /*--- Event Listeners ---*/
    searchInput.addEventListener("input", filterSuppliers);
    categoryFilter.addEventListener("change", filterSuppliers);
    statusFilter.addEventListener("change", filterSuppliers);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        filterSuppliers();
        searchInput.focus();
    });

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    /*--- Initial Filter ---*/
    filterSuppliers();

});