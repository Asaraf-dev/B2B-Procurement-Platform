/*--- Admin Overview Initialization ---*/
document.addEventListener("DOMContentLoaded", function () {
    bpAdminOverviewInit();
});

function bpAdminOverviewInit() {

    /*--- Admin Profile Name ---*/
    const bpAdminProfile = JSON.parse(localStorage.getItem("bpAuthProfile") || "{}");
    const bpAdminName = bpAdminProfile.name || "Admin";
    const bpAdminWelcomeName = document.getElementById("bp-admin-welcome-name");

    if (bpAdminWelcomeName) {
        bpAdminWelcomeName.textContent = bpAdminName.split(" ")[0];
    }

    /*--- Current Date ---*/
    const bpAdminDate = document.getElementById("bp-admin-current-date");

    if (bpAdminDate) {
        bpAdminDate.textContent = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /*--- Chart Period Data ---*/
    const bpAdminChartData = {
        monthly: {
            total: "3,456",
            labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            values: [42, 55, 48, 67, 61, 78, 88]
        },
        quarterly: {
            total: "3,456",
            labels: ["Q1", "Q2", "Q3", "Q4"],
            values: [48, 65, 72, 88]
        }
    };

    const bpAdminChartFilter = document.getElementById("bp-admin-chart-filter");
    const bpAdminChartBars = document.getElementById("bp-admin-chart-bars");
    const bpAdminChartTotal = document.getElementById("bp-admin-chart-total");

    /*--- Update Purchase Order Chart ---*/
    function bpAdminUpdateChart(period) {
        const bpAdminSelectedData = bpAdminChartData[period];

        if (!bpAdminSelectedData || !bpAdminChartBars) return;

        bpAdminChartBars.innerHTML = "";

        bpAdminSelectedData.values.forEach(function (value, index) {
            const bpAdminColumn = document.createElement("div");
            bpAdminColumn.className = "bp-admin-chart-column";

            const bpAdminBar = document.createElement("span");
            bpAdminBar.className = "bp-admin-chart-bar";

            if (index === bpAdminSelectedData.values.length - 1) {
                bpAdminBar.classList.add("bp-admin-chart-bar-current");
            }

            bpAdminBar.style.setProperty("--bar-height", value + "%");

            const bpAdminLabel = document.createElement("span");
            bpAdminLabel.className = "bp-admin-chart-month";
            bpAdminLabel.textContent = bpAdminSelectedData.labels[index];

            bpAdminColumn.appendChild(bpAdminBar);
            bpAdminColumn.appendChild(bpAdminLabel);
            bpAdminChartBars.appendChild(bpAdminColumn);
        });

        if (bpAdminChartTotal) {
            bpAdminChartTotal.textContent = bpAdminSelectedData.total;
        }
    }

    if (bpAdminChartFilter) {
        bpAdminChartFilter.addEventListener("change", function () {
            bpAdminUpdateChart(this.value);
        });
    }
}