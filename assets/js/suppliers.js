/*--- Why Become a Stackly Supplier? Section Start ---*/
function bpSupBenefitsInit() {
    const bpSupBenefitsItems = document.querySelectorAll(
        ".bp-sup-benefit-item, .bp-sup-benefits-visual"
    );

    if (!bpSupBenefitsItems.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
        bpSupBenefitsItems.forEach(function (bpSupBenefitsItem) {
            bpSupBenefitsItem.classList.add("bp-sup-benefits-visible");
        });
        return;
    }

    bpSupBenefitsItems.forEach(function (bpSupBenefitsItem, bpSupBenefitsIndex) {
        bpSupBenefitsItem.classList.add("bp-sup-benefits-reveal");
        bpSupBenefitsItem.style.setProperty(
            "--bp-sup-benefits-delay",
            (bpSupBenefitsIndex * 100) + "ms"
        );
    });

    const bpSupBenefitsObserver = new IntersectionObserver(function (bpSupBenefitsEntries) {
        bpSupBenefitsEntries.forEach(function (bpSupBenefitsEntry) {
            if (bpSupBenefitsEntry.isIntersecting) {
                bpSupBenefitsEntry.target.classList.add("bp-sup-benefits-visible");
                bpSupBenefitsObserver.unobserve(bpSupBenefitsEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    bpSupBenefitsItems.forEach(function (bpSupBenefitsItem) {
        bpSupBenefitsObserver.observe(bpSupBenefitsItem);
    });
}

/*--- Initialize Supplier Benefits ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSupBenefitsInit);
} else {
    bpSupBenefitsInit();
}
/*--- Why Become a Stackly Supplier? Section End ---*/

/*--- Supplier Platform Features Section Start ---*/
function bpSupPlatformInit() {
    const bpSupPlatformCards = document.querySelectorAll(".bp-sup-platform-card");

    if (!bpSupPlatformCards.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
        bpSupPlatformCards.forEach(function (bpSupPlatformCard) {
            bpSupPlatformCard.classList.add("bp-sup-platform-visible");
        });
        return;
    }

    bpSupPlatformCards.forEach(function (bpSupPlatformCard, bpSupPlatformIndex) {
        bpSupPlatformCard.classList.add("bp-sup-platform-reveal");
        bpSupPlatformCard.style.setProperty(
            "--bp-sup-platform-delay",
            (bpSupPlatformIndex * 120) + "ms"
        );
    });

    const bpSupPlatformObserver = new IntersectionObserver(function (bpSupPlatformEntries) {
        bpSupPlatformEntries.forEach(function (bpSupPlatformEntry) {
            if (bpSupPlatformEntry.isIntersecting) {
                bpSupPlatformEntry.target.classList.add("bp-sup-platform-visible");
                bpSupPlatformObserver.unobserve(bpSupPlatformEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    bpSupPlatformCards.forEach(function (bpSupPlatformCard) {
        bpSupPlatformObserver.observe(bpSupPlatformCard);
    });
}

/*--- Initialize Supplier Platform Features ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSupPlatformInit);
} else {
    bpSupPlatformInit();
}
/*--- Supplier Platform Features Section End ---*/

/*--- How It Works for Suppliers Section Start ---*/
function bpSupProcessInit() {
    const bpSupProcessItems = document.querySelectorAll(
        ".bp-sup-process-step, .bp-sup-process-bottom"
    );

    if (!bpSupProcessItems.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
        bpSupProcessItems.forEach(function (bpSupProcessItem) {
            bpSupProcessItem.classList.add("bp-sup-process-visible");
        });
        return;
    }

    bpSupProcessItems.forEach(function (bpSupProcessItem, bpSupProcessIndex) {
        bpSupProcessItem.classList.add("bp-sup-process-reveal");
        bpSupProcessItem.style.setProperty(
            "--bp-sup-process-delay",
            (bpSupProcessIndex * 100) + "ms"
        );
    });

    const bpSupProcessObserver = new IntersectionObserver(function (bpSupProcessEntries) {
        bpSupProcessEntries.forEach(function (bpSupProcessEntry) {
            if (bpSupProcessEntry.isIntersecting) {
                bpSupProcessEntry.target.classList.add("bp-sup-process-visible");
                bpSupProcessObserver.unobserve(bpSupProcessEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    bpSupProcessItems.forEach(function (bpSupProcessItem) {
        bpSupProcessObserver.observe(bpSupProcessItem);
    });
}

/*--- Initialize Supplier Process ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSupProcessInit);
} else {
    bpSupProcessInit();
}
/*--- How It Works for Suppliers Section End ---*/

/*--- Connect with Business Buyers Section Start ---*/
function bpSupConnectInit() {
    const bpSupConnectElements = document.querySelectorAll(
        ".bp-sup-connect-content, .bp-sup-connect-visual, .bp-sup-connect-bottom"
    );

    if (!bpSupConnectElements.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
        bpSupConnectElements.forEach(function (bpSupConnectElement) {
            bpSupConnectElement.classList.add("bp-sup-connect-visible");
        });
        return;
    }

    bpSupConnectElements.forEach(function (bpSupConnectElement, bpSupConnectIndex) {
        bpSupConnectElement.classList.add("bp-sup-connect-reveal");
        bpSupConnectElement.style.setProperty(
            "--bp-sup-connect-delay",
            (bpSupConnectIndex * 140) + "ms"
        );
    });

    const bpSupConnectObserver = new IntersectionObserver(function (bpSupConnectEntries) {
        bpSupConnectEntries.forEach(function (bpSupConnectEntry) {
            if (bpSupConnectEntry.isIntersecting) {
                bpSupConnectEntry.target.classList.add("bp-sup-connect-visible");
                bpSupConnectObserver.unobserve(bpSupConnectEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    bpSupConnectElements.forEach(function (bpSupConnectElement) {
        bpSupConnectObserver.observe(bpSupConnectElement);
    });
}

/*--- Initialize Connect Buyers Section ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSupConnectInit);
} else {
    bpSupConnectInit();
}
/*--- Connect with Business Buyers Section End ---*/