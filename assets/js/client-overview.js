/*--- Client Overview ---*/
document.addEventListener("DOMContentLoaded", function () {

    /*--- User Information ---*/
    const userEmail = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || "user@example.com";
    const userName = userEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, char => char.toUpperCase());

    const welcomeName = document.getElementById("bp-overview-user-name");
    if (welcomeName) welcomeName.textContent = userName;

    /*--- Sample Procurement Data ---*/
    const orders = [
        { id: "#PO-2026-024", supplier: "Global Trade Ltd.", date: "02 Nov 2026", amount: 24500, status: "Processing" },
        { id: "#PO-2026-023", supplier: "Prime Supplies", date: "30 Oct 2026", amount: 18200, status: "Delivered" },
        { id: "#PO-2026-022", supplier: "TechSource India", date: "28 Oct 2026", amount: 42000, status: "Pending" },
        { id: "#PO-2026-021", supplier: "Metro Wholesale", date: "25 Oct 2026", amount: 12800, status: "Delivered" }
    ];

    /*--- Update Statistics ---*/
    const totalOrders = 24;
    const pendingOrders = 5;
    const totalSuppliers = 12;
    const totalSpending = 240000;

    document.getElementById("bp-stat-total-orders").textContent = totalOrders;
    document.getElementById("bp-stat-pending-orders").textContent = String(pendingOrders).padStart(2, "0");
    document.getElementById("bp-stat-total-suppliers").textContent = totalSuppliers;
    document.getElementById("bp-stat-total-spending").textContent = "₹" + (totalSpending / 100000).toFixed(1) + "L";

    /*--- Render Recent Orders ---*/
    const ordersBody = document.getElementById("bp-overview-orders-body");

    if (ordersBody) {
        ordersBody.innerHTML = orders.map(order => {
            const statusClass = order.status.toLowerCase();
            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${order.supplier}</td>
                    <td>${order.date}</td>
                    <td>₹${order.amount.toLocaleString("en-IN")}</td>
                    <td><span class="bp-order-status bp-order-${statusClass}">${order.status}</span></td>
                </tr>
            `;
        }).join("");
    }

});