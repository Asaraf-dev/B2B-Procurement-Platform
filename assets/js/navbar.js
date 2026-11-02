
/*--- Navbar Initialization ---*/
function bpComInitNavbar() {
    const bpComNavbar = document.querySelector("[data-bp-navbar]");
    if (!bpComNavbar || bpComNavbar.dataset.initialized === "true") {
        return;
    }
    bpComNavbar.dataset.initialized = "true";
    const bpComToggle = bpComNavbar.querySelector(".bp-com-navbar-toggle");
    const bpComMenu = bpComNavbar.querySelector(".bp-com-navbar-menu");
    const bpComLinks = bpComNavbar.querySelectorAll(".bp-com-navbar-link");
    if (!bpComToggle || !bpComMenu) {
        return;
    }
    /*--- Active Navigation Link ---*/
    function bpComSetActiveLink() {
        const bpComCurrentPage = window.location.pathname.split("/").pop() || "index.html";
        bpComLinks.forEach(function (bpComLink) {
            const bpComLinkPage = bpComLink.getAttribute("href").split("/").pop();
            const bpComIsActive = bpComLinkPage === bpComCurrentPage;
            if (bpComIsActive) {
                bpComLink.setAttribute("aria-current", "page");
            } else {
                bpComLink.removeAttribute("aria-current");
            }
        });
    }
    /*--- Open Navbar Menu ---*/
    function bpComOpenMenu() {
        bpComMenu.classList.add("bp-com-navbar-menu-open");
        bpComToggle.setAttribute("aria-expanded", "true");
        bpComToggle.setAttribute("aria-label", "Close navigation menu");
    }
    /*--- Close Navbar Menu ---*/
    function bpComCloseMenu() {
        bpComMenu.classList.remove("bp-com-navbar-menu-open");
        bpComToggle.setAttribute("aria-expanded", "false");
        bpComToggle.setAttribute("aria-label", "Open navigation menu");
    }
    /*--- Navbar Toggle Click ---*/
    bpComToggle.addEventListener("click", function () {
        const bpComIsExpanded = bpComToggle.getAttribute("aria-expanded") === "true";
        if (bpComIsExpanded) {
            bpComCloseMenu();
        } else {
            bpComOpenMenu();
        }
    });
    /*--- Close Menu On Navigation ---*/
    bpComLinks.forEach(function (bpComLink) {
        bpComLink.addEventListener("click", function () {
            bpComCloseMenu();
        });
    });
    /*--- Close Menu On Outside Click ---*/
    document.addEventListener("click", function (bpComEvent) {
        if (!bpComNavbar.contains(bpComEvent.target)) {
            bpComCloseMenu();
        }
    });
    /*--- Close Menu With Escape Key ---*/
    document.addEventListener("keydown", function (bpComEvent) {
        if (bpComEvent.key === "Escape") {
            bpComCloseMenu();
            bpComToggle.focus();
        }
    });
    /*--- Close Menu When Returning To Desktop ---*/
    window.addEventListener("resize", function () {
        if (window.innerWidth > 991) {
            bpComCloseMenu();
        }
    });
    /*--- Navbar Scroll Effect ---*/
    function bpComHandleScroll() {
        bpComNavbar.classList.toggle("bp-com-navbar-scrolled", window.scrollY > 15);
    }
    window.addEventListener("scroll", bpComHandleScroll, { passive: true });
    /*--- Initialize Navbar ---*/
    bpComSetActiveLink();
    bpComHandleScroll();
}
/*--- Navbar Component Detection ---*/
function bpComWatchNavbar() {
    bpComInitNavbar();
    const bpComObserver = new MutationObserver(function () {
        bpComInitNavbar();
    });
    bpComObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}
/*--- Navbar DOM Ready ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpComWatchNavbar);
} else {
    bpComWatchNavbar();
}
