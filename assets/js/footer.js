
/*--- Footer Initialization ---*/
function bpComInitFooter() {
    const bpComFooter = document.querySelector("[data-bp-footer]");

    if (!bpComFooter || bpComFooter.dataset.initialized === "true") {
        return;
    }

    bpComFooter.dataset.initialized = "true";

    /*--- Automatic Copyright Year ---*/
    const bpComFooterYear = bpComFooter.querySelector("[data-bp-footer-year]");

    if (bpComFooterYear) {
        bpComFooterYear.textContent = new Date().getFullYear();
    }

    /*--- Back To Top Button ---*/
    const bpComBackTop = bpComFooter.querySelector("[data-bp-back-top]");

    if (bpComBackTop) {
        bpComBackTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth"
            });
        });
    }
}

/*--- Footer Component Detection ---*/
function bpComWatchFooter() {
    bpComInitFooter();

    const bpComFooterObserver = new MutationObserver(function () {
        bpComInitFooter();
    });

    bpComFooterObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/*--- Footer DOM Ready ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpComWatchFooter);
} else {
    bpComWatchFooter();
}
