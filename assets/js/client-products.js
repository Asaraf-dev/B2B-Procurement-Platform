/*--- Client Products ---*/
document.addEventListener("DOMContentLoaded", function () {

    /*--- Elements ---*/
    const searchInput = document.getElementById("bp-products-search");
    const categoryFilter = document.getElementById("bp-products-category");
    const availabilityFilter = document.getElementById("bp-products-availability");
    const sortFilter = document.getElementById("bp-products-sort");
    const clearButton = document.getElementById("bp-products-clear");
    const resetButton = document.getElementById("bp-products-reset");
    const emptyResetButton = document.getElementById("bp-products-empty-reset");
    const productsGrid = document.getElementById("bp-products-grid");
    const emptyState = document.getElementById("bp-products-empty");
    const resultsCount = document.getElementById("bp-products-count");
    const showingCount = document.getElementById("bp-products-showing");
    const totalCount = document.getElementById("bp-products-total");

    if (!searchInput || !categoryFilter || !availabilityFilter || !sortFilter || !productsGrid) return;

    const productCards = Array.from(productsGrid.querySelectorAll(".bp-product-card"));

    /*--- Set Initial Product Count ---*/
    if (totalCount) totalCount.textContent = productCards.length;

    /*--- Filter and Sort Products ---*/
    function updateProducts() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const categoryValue = categoryFilter.value;
        const availabilityValue = availabilityFilter.value;
        const sortValue = sortFilter.value;

        let visibleProducts = [];

        productCards.forEach(function (card) {

            const name = (card.dataset.name || "").toLowerCase();
            const category = card.dataset.category || "";
            const supplier = (card.dataset.supplier || "").toLowerCase();
            const availability = card.dataset.availability || "";

            const matchesSearch = name.includes(searchValue) ||
                category.toLowerCase().includes(searchValue) ||
                supplier.includes(searchValue);

            const matchesCategory = !categoryValue || category === categoryValue;
            const matchesAvailability = !availabilityValue || availability === availabilityValue;

            const isVisible = matchesSearch && matchesCategory && matchesAvailability;

            if (isVisible) {
                visibleProducts.push(card);
            }

        });

        /*--- Sort Products ---*/
        visibleProducts.sort(function (a, b) {

            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;
            const ratingA = Number(a.dataset.rating) || 0;
            const ratingB = Number(b.dataset.rating) || 0;
            const nameA = (a.dataset.name || "").toLowerCase();
            const nameB = (b.dataset.name || "").toLowerCase();

            switch (sortValue) {
                case "price-low":
                    return priceA - priceB;

                case "price-high":
                    return priceB - priceA;

                case "rating":
                    return ratingB - ratingA;

                case "name":
                    return nameA.localeCompare(nameB);

                default:
                    return productCards.indexOf(a) - productCards.indexOf(b);
            }

        });

        /*--- Render Sorted Products ---*/
        productCards.forEach(function (card) {
            card.hidden = true;
        });

        visibleProducts.forEach(function (card) {
            card.hidden = false;
            productsGrid.appendChild(card);
        });

        /*--- Update Results ---*/
        const count = visibleProducts.length;

        resultsCount.textContent = count + (count === 1 ? " product found" : " products found");

        if (showingCount) showingCount.textContent = count;

        emptyState.hidden = count !== 0;
        productsGrid.hidden = count === 0;

        clearButton.classList.toggle("bp-product-clear-visible", searchInput.value.length > 0);
    }

    /*--- Reset Filters ---*/
    function resetFilters() {
        searchInput.value = "";
        categoryFilter.value = "";
        availabilityFilter.value = "";
        sortFilter.value = "default";
        updateProducts();
    }

    /*--- Event Listeners ---*/
    searchInput.addEventListener("input", updateProducts);
    categoryFilter.addEventListener("change", updateProducts);
    availabilityFilter.addEventListener("change", updateProducts);
    sortFilter.addEventListener("change", updateProducts);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        updateProducts();
        searchInput.focus();
    });

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    /*--- Initial Setup ---*/
    updateProducts();

});