document.addEventListener('DOMContentLoaded', function () {

    // =====================================================
    // 1. VARIABLES & ELEMENT REFERENCES
    // =====================================================
    let dbConnectonInventory = false;

    if (localStorage.getItem("inventory") != null) {
        console.log("Inventory db is connected");
        dbConnectonInventory = true;
    } else {
        console.log("Inventory db Connection Error");
    }

    // Layout elements
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const topbar = document.getElementById('topbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Sidebar/page navigation
    const menuItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page');

    // Table + search elements
    const table = document.getElementById("inventoryTable");
    const tableBody = document.getElementById("tableBody");
    const searchBoxDes = document.getElementById("searchBox");
    const searchBoxMob = document.getElementById("searchBox-m");

    // Dataset
    let inventoryDataSet = JSON.parse(localStorage.getItem("inventory")) || [];

    // Forms
    const form = document.getElementById("inventoryForm");
    const updateForm = document.getElementById("inventoryUpdateForm");


    // =====================================================
    // 2. CORE FUNCTIONS
    // =====================================================

    // --- Render Table Rows ---
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="11" class="fw-bold text-center text-muted">
                        No Matching Items!
                    </td>
                </tr>`;
            return;
        }

        for (let i = data.length - 1; i >= 0; i--) {
            const item = data[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><span class="text-center">${item.itemCode}</span></td>
                <td>${item.itemName}</td>
                <td>${item.category}</td>
                <td>${item.supplier}</td>
                <td class="text-end">${item.qty}</td>
                <td class="text-end">${item.reorderPoint}</td>
                <td class="text-end">${(item.discount * 100).toFixed(0)}%</td>
                <td class="text-end">${item.price}</td>
                <td class="text-end">${(item.price * item.qty).toLocaleString()}</td>
                <td class="text-center">
                    <span class="badge ${item.qty > item.reorderPoint
                    ? "text-bg-success"
                    : "text-bg-danger"}">
                        ${item.qty > item.reorderPoint ? "In Stock" : "Low Stock"}
                    </span>
                </td>
                <td class="text-center">
                    <div class="btn-group dropstart">
                        <button class="btn btn-sm focus-ring focus-ring-warning py-1 px-2  border-0 dropdown-toggle" 
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-gear fa-lg"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="#" class="dropdown-item text-primary btn-update" 
                                   prKey="${item.itemCode}" 
                                   data-bs-toggle="modal" 
                                   data-bs-target="#inventoryUpdateModal">
                                   <i class="bi bi-arrow-repeat"></i> Update
                                </a>
                            </li>
                            <li>
                                <a href="#" class="dropdown-item text-danger btn-delete" 
                                   prKey="${item.itemCode}">
                                   <i class="bi bi-ban"></i> Delete
                                </a>
                            </li>
                        </ul>
                    </div>
                </td>`;
            tableBody.appendChild(row);
        }
    }

    // --- Search filter ---
    function Searchfilter(tag) {
        const query = tag.value.toLowerCase();
        const filtered = [];

        for (let i = 0; i < inventoryDataSet.length; i++) {
            const item = inventoryDataSet[i];
            if (
                item.itemName.toLowerCase().includes(query) ||
                item.itemCode.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            ) {
                filtered.push(item);
            }
        }
        renderTable(filtered);
    }

    // --- Auto Total calculation ---
    function autoTotal() {
        let newqty = parseInt(document.getElementById("qty")?.value) || 0;
        const newprice = parseFloat(document.getElementById("price")?.value) || 0;
        document.getElementById("totalAmount").value =
            (newprice * newqty) + " LKR" || "0.00";
    }

    // --- Add new item ---
    function addData(e) {
        e.preventDefault();

        let DataSet = JSON.parse(localStorage.getItem("inventory")) || [];

        // Collect form values
        const newitemCode = document.getElementById("itemCode").value.trim();
        const newitemName = document.getElementById("itemName")?.value.trim() || "";
        const newcategory = document.getElementById("category")?.value.trim() || "";
        const newsupplier = document.getElementById("supplier")?.value.trim() || "";
        const newqty = parseInt(document.getElementById("qty")?.value) || 0;
        const newreorderPoint = parseInt(document.getElementById("reorderPoint")?.value) || 0;
        const newprice = parseFloat(document.getElementById("price")?.value) || 0;
        const newdiscount = (parseFloat(document.getElementById("discount")?.value) || 0) / 100;

        let newItem = {
            itemCode: newitemCode,
            itemName: newitemName,
            price: newprice,
            discount: newdiscount,
            category: newcategory,
            supplier: newsupplier,
            qty: newqty,
            reorderPoint: newreorderPoint
        };

        if (confirm("Are you Sure?")) {
            DataSet.push(newItem);
            localStorage.setItem("inventory", JSON.stringify(DataSet));
            location.reload();
        }
    }

    // --- Update item ---
    function radyToUpdateItem(itemCode) {
        let isOk = confirm("Do you want to update this data row ?");
        if (isOk) {
            let data = JSON.parse(localStorage.getItem("inventory")) || [];
            const item = data.find(item => item.itemCode === itemCode);
            const index = data.findIndex(item => item.itemCode === itemCode);

            if (item) {
                // Fill form fields
                document.getElementById("itemCode").value = item.itemCode;
                document.getElementById("itemName").value = item.itemName;
                document.getElementById("category").value = item.category;
                document.getElementById("supplier").value = item.supplier;
                document.getElementById("qty").value = item.qty;
                document.getElementById("reorderPoint").value = item.reorderPoint;
                document.getElementById("price").value = item.price;
                document.getElementById("discount").value = item.discount * 100;
                document.getElementById("totalAmount").value = (item.qty * item.price) + " LKR";

                updateForm.onsubmit = function (e) {
                    e.preventDefault();
                    const confermText = prompt("Type 'Update' word inside this box !");
                    if (confermText?.toLowerCase() === "update") {
                        data[index].itemName = document.getElementById("itemName").value.trim();
                        data[index].category = document.getElementById("category").value.trim();
                        data[index].supplier = document.getElementById("supplier").value.trim();
                        data[index].qty = parseInt(document.getElementById("qty").value) || 0;
                        data[index].reorderPoint = parseInt(document.getElementById("reorderPoint").value) || 0;
                        data[index].price = parseFloat(document.getElementById("price").value) || 0;
                        data[index].discount = (parseFloat(document.getElementById("discount").value) || 0) / 100;

                        localStorage.setItem("inventory", JSON.stringify(data));
                        // alert("Item updated successfully ✅");
                        location.reload();
                    } else {
                        alert("Updating process is canceled");
                    }

                };



            }

        }

    }

    // --- Delete item ---
    function deleteItem(itemCode) {
        if (!confirm("Do you want to delete this data row ?")) return;

        const confermText = prompt("Type 'Delete' word in this box !");
        if (confermText?.toLowerCase() === "delete") {
            let data = JSON.parse(localStorage.getItem("inventory")) || [];
            data = data.filter(item => item.itemCode !== itemCode);
            localStorage.setItem("inventory", JSON.stringify(data));
            location.reload();
        } else {
            alert("Data deleting process is canceled");
        }
    }


    // =====================================================
    // 3. EVENT BINDINGS
    // =====================================================

    // Initial render
    if (dbConnectonInventory) renderTable(inventoryDataSet);

    // Form submit
    form.addEventListener("submit", addData);

    // Auto total
    document.getElementById("price").addEventListener('keyup', autoTotal);
    document.getElementById("qty").addEventListener('keyup', autoTotal);

    // Search
    searchBoxMob.addEventListener("input", e => Searchfilter(e.target));
    searchBoxDes.addEventListener("input", e => Searchfilter(e.target));

    // Update & delete buttons
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-update")) {
            e.preventDefault();
            radyToUpdateItem(e.target.getAttribute("prKey"));
        }
        if (e.target.classList.contains("btn-delete")) {
            e.preventDefault();
            deleteItem(e.target.getAttribute("prKey"));
        }
    });

    // Sidebar toggle (mobile)
    mobileMenuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

    // Close sidebar on outside click
    document.addEventListener('click', function (event) {
        if (window.innerWidth < 992) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMobileMenuBtn = mobileMenuBtn.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnMobileMenuBtn) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Menu navigation
    let lastPage = "inventory"; // default
    pages.forEach(page => {
        page.style.display = (page.id === lastPage) ? "block" : "none";
    });
    menuItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-page") === lastPage);
        item.addEventListener('click', function (e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const pageId = this.getAttribute('data-page');
            pages.forEach(page => {
                page.style.display = page.id === pageId ? 'block' : 'none';
            });
            if (window.innerWidth < 992) sidebar.classList.remove('show');
        });
    });

    // Resize reset
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
        }
    });
});
