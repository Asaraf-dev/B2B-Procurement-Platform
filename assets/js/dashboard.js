/*--- Dashboard Layout Initialization ---*/
document.addEventListener("DOMContentLoaded", function () {
    bpDashInit();
});

function bpDashInit() {
    const bpDashSidebar = document.getElementById("bp-dash-sidebar");
    const bpDashOverlay = document.getElementById("bp-dash-overlay");
    const bpDashMenuToggle = document.getElementById("bp-dash-menu-toggle");
    const bpDashSidebarClose = document.getElementById("bp-dash-sidebar-close");
    const bpDashProfileButton = document.getElementById("bp-dash-profile-button");
    const bpDashProfileDropdown = document.getElementById("bp-dash-profile-dropdown");
    const bpDashLogoutButtons = [
        document.getElementById("bp-dashboard-logout"),
        document.getElementById("bp-dashboard-profile-logout")
    ];

    /*--- Login Session ---*/
    const bpDashEmail = sessionStorage.getItem("bpAuthUserEmail");
    const bpDashRole = sessionStorage.getItem("bpAuthUserRole");
    const bpDashLoginStatus = sessionStorage.getItem("bpAuthLoginStatus");

    if (!bpDashEmail || !bpDashRole || bpDashLoginStatus !== "true") {
        window.location.replace("login.html");
        return;
    }

    /*--- Profile Information ---*/
    let bpDashProfile = {};

    try {
        bpDashProfile = JSON.parse(localStorage.getItem("bpAuthProfile")) || {};
    } catch (error) {
        bpDashProfile = {};
    }

    const bpDashUserName = bpDashProfile.name || "User";
    const bpDashDisplayEmail = bpDashProfile.email || bpDashEmail;

    const bpDashEmailElements = [
        document.getElementById("bp-dashboard-user-email"),
        document.getElementById("bp-dashboard-sidebar-email"),
        document.getElementById("bp-dash-profile-dropdown-email")
    ];

    bpDashEmailElements.forEach(function (element) {
        if (element) {
            element.textContent = bpDashDisplayEmail;
            element.title = bpDashDisplayEmail;
        }
    });

    const bpDashNameElements = [
        document.getElementById("bp-dashboard-welcome-name"),
        document.getElementById("bp-dash-profile-name")
    ];

    bpDashNameElements.forEach(function (element) {
        if (element) {
            element.textContent = bpDashUserName;
        }
    });

    /*--- Dashboard Role Protection ---*/
    const bpDashCurrentPage = window.location.pathname.split("/").pop().toLowerCase();

    if (bpDashCurrentPage === "admin-dashboard.html" && bpDashRole !== "admin") {
        window.location.replace("client-dashboard.html");
        return;
    }

    if (bpDashCurrentPage === "client-dashboard.html" && bpDashRole !== "client") {
        window.location.replace("admin-dashboard.html");
        return;
    }

    /*--- Sidebar Toggle ---*/
    function bpDashOpenSidebar() {
        if (!bpDashSidebar || !bpDashOverlay) return;

        bpDashSidebar.classList.add("bp-dash-sidebar-open");
        bpDashOverlay.classList.add("bp-dash-overlay-visible");

        if (bpDashMenuToggle) {
            bpDashMenuToggle.setAttribute("aria-expanded", "true");
        }

        document.body.style.overflow = "hidden";
    }

    function bpDashCloseSidebar() {
        if (!bpDashSidebar || !bpDashOverlay) return;

        bpDashSidebar.classList.remove("bp-dash-sidebar-open");
        bpDashOverlay.classList.remove("bp-dash-overlay-visible");

        if (bpDashMenuToggle) {
            bpDashMenuToggle.setAttribute("aria-expanded", "false");
        }

        document.body.style.overflow = "";
    }

    if (bpDashMenuToggle) {
        bpDashMenuToggle.addEventListener("click", bpDashOpenSidebar);
    }

    if (bpDashSidebarClose) {
        bpDashSidebarClose.addEventListener("click", bpDashCloseSidebar);
    }

    if (bpDashOverlay) {
        bpDashOverlay.addEventListener("click", bpDashCloseSidebar);
    }

    /*--- Close Sidebar With Escape ---*/
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            bpDashCloseSidebar();

            if (bpDashProfileDropdown) {
                bpDashProfileDropdown.classList.remove("bp-dash-dropdown-open");
            }
        }
    });

    /*--- Close Sidebar After Navigation ---*/
    if (bpDashSidebar) {
        bpDashSidebar.querySelectorAll(".bp-dash-nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 991) {
                    bpDashCloseSidebar();
                }
            });
        });
    }

    /*--- Responsive Sidebar Reset ---*/
    window.addEventListener("resize", function () {
        if (window.innerWidth > 991) {
            bpDashCloseSidebar();
        }
    });

    /*--- Profile Dropdown ---*/
    if (bpDashProfileButton && bpDashProfileDropdown) {
        bpDashProfileButton.addEventListener("click", function (event) {
            event.stopPropagation();

            bpDashProfileDropdown.classList.toggle("bp-dash-dropdown-open");
        });

        bpDashProfileDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function () {
            bpDashProfileDropdown.classList.remove("bp-dash-dropdown-open");
        });
    }

    /*--- Logout ---*/
    function bpDashLogout() {
        sessionStorage.removeItem("bpAuthUserEmail");
        sessionStorage.removeItem("bpAuthUserRole");
        sessionStorage.removeItem("bpAuthLoginStatus");

        window.location.replace("login.html");
    }

    bpDashLogoutButtons.forEach(function (button) {
        if (button) {
            button.addEventListener("click", bpDashLogout);
        }
    });

    /*--- Current Date ---*/
    const bpDashDateElement = document.getElementById("bp-dash-current-date");

    if (bpDashDateElement) {
        bpDashDateElement.textContent = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /*--- Footer Year ---*/
    const bpDashYearElement = document.getElementById("bp-dash-footer-year");

    if (bpDashYearElement) {
        bpDashYearElement.textContent = new Date().getFullYear();
    }

    /*--- Active Navigation ---*/
    if (bpDashSidebar) {
        const bpDashNavLinks = bpDashSidebar.querySelectorAll("a.bp-dash-nav-link");

        bpDashNavLinks.forEach(function (link) {
            const bpDashLinkPage = link.getAttribute("href");

            if (bpDashLinkPage && bpDashLinkPage.toLowerCase() === bpDashCurrentPage) {
                bpDashNavLinks.forEach(function (item) {
                    item.classList.remove("bp-dash-nav-active");
                });

                link.classList.add("bp-dash-nav-active");
            }
        });
    }
}