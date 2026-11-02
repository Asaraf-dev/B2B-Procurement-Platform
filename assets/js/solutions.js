/*--- Solutions Overview Section Start ---*/
function bpSolOverviewInit() {
    const bpSolOverviewElements = document.querySelectorAll(
        ".bp-sol-overview-featured, .bp-sol-overview-card, .bp-sol-overview-bottom"
    );

    if (!bpSolOverviewElements.length) {
        return;
    }

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        bpSolOverviewElements.forEach(function (bpSolElement) {
            bpSolElement.classList.add("bp-sol-overview-visible");
        });
        return;
    }

    const bpSolOverviewObserver = new IntersectionObserver(function (bpSolEntries, bpSolObserver) {
        bpSolEntries.forEach(function (bpSolEntry) {
            if (bpSolEntry.isIntersecting) {
                bpSolEntry.target.classList.add("bp-sol-overview-visible");
                bpSolObserver.unobserve(bpSolEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    bpSolOverviewElements.forEach(function (bpSolElement) {
        bpSolElement.classList.add("bp-sol-overview-reveal");
        bpSolOverviewObserver.observe(bpSolElement);
    });
}

/*--- Solutions Overview Animation Styles ---*/
const bpSolOverviewAnimationStyle = document.createElement("style");
bpSolOverviewAnimationStyle.textContent = `
    .bp-sol-overview-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity .7s ease, transform .7s ease;
    }
    .bp-sol-overview-reveal.bp-sol-overview-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .bp-sol-overview-card:nth-child(2) {
        transition-delay: .08s;
    }
    .bp-sol-overview-card:nth-child(3) {
        transition-delay: .16s;
    }
    .bp-sol-overview-card:nth-child(4) {
        transition-delay: .24s;
    }
    @media(prefers-reduced-motion: reduce) {
        .bp-sol-overview-reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;
document.head.appendChild(bpSolOverviewAnimationStyle);

/*--- Initialize Solutions Overview ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSolOverviewInit);
} else {
    bpSolOverviewInit();
}

const ssIndBlogReadButtons = document.querySelectorAll(".bp-sol-overview-card-link");
    if (ssIndBlogReadButtons.length) {
        ssIndBlogReadButtons.forEach(function (ssButton) {
            ssButton.addEventListener("click", function (ssEvent) {
                ssEvent.preventDefault();
                ssEvent.stopPropagation();
                window.location.href = "404.html";
            });
        });
    }
/*--- Solutions Overview Section End ---*/

/*--- Detailed Solution Showcase Section Start ---*/
function bpSolDetailsInit() {
    const bpSolDetailItems = document.querySelectorAll(".bp-sol-detail");

    if (!bpSolDetailItems.length) {
        return;
    }

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        bpSolDetailItems.forEach(function (bpSolItem) {
            bpSolItem.classList.add("bp-sol-detail-visible");
        });
        return;
    }

    const bpSolDetailObserver = new IntersectionObserver(function (bpSolEntries, bpSolObserver) {
        bpSolEntries.forEach(function (bpSolEntry) {
            if (bpSolEntry.isIntersecting) {
                bpSolEntry.target.classList.add("bp-sol-detail-visible");
                bpSolObserver.unobserve(bpSolEntry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    bpSolDetailItems.forEach(function (bpSolItem) {
        bpSolItem.classList.add("bp-sol-detail-reveal");
        bpSolDetailObserver.observe(bpSolItem);
    });
}

/*--- Initialize Detailed Solution Showcase ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpSolDetailsInit);
} else {
    bpSolDetailsInit();
}
/*--- Detailed Solution Showcase Section End ---*/