document.addEventListener('DOMContentLoaded', function () {
    let dbConnectonInventory;

    if (localStorage.getItem("inventory") != null) {
        console.log("Inventory db is connected");

        dbConnectonInventory = true;


    } else {
        console.log("Inventory db Connection Error");
    }
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const topbar = document.getElementById('topbar');
    // const toggleBtn = document.getElementById('toggleSidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page');



    //table manupilation
    const inventoryDataSet = JSON.parse(localStorage.getItem("inventory")) || [];
    const table = document.getElementById("inventoryTable");
    let tbody = document.getElementById("tableBody");

    // Search Box with Suggestions
    const tableBody = document.getElementById("tableBody");
    const searchBoxDes = document.getElementById("searchBox");
    const searchBoxMob = document.getElementById("searchBox-m");

    // --- Function to render table rows ---
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr>
          <td colspan="11" class="fw-bold text-center text-muted">No Matching Items!</td>
        </tr>`;
            return;
        }

        for (let i = data.length - 1; i >= 0; i--) {
            const item = data[i];
            const row = document.createElement("tr");
            row.innerHTML = `
          <tr>
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
                <div class="btn-group">
                    <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-gear fa-lg"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Update</a></li>
                        <li><a class="dropdown-item" href="#">Delete</a></li>
                    </ul>
                </div>
            </td>
          </tr>`;
            tableBody.appendChild(row);
        }
    }


    // --- Initial render ---
    // renderTable(inventoryDataSet);
    if (dbConnectonInventory) {
        renderTable(inventoryDataSet);
    }

    // --- Search filter uses the same renderTable ---
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

    searchBoxMob.addEventListener("input", e => Searchfilter(e.target));
    searchBoxDes.addEventListener("input", e => Searchfilter(e.target));

    function autoTotal() {
        let newqty = parseInt(document.getElementById("qty")?.value) || 0;
        const newprice = parseFloat(document.getElementById("price")?.value) || 0;

        document.getElementById("totalAmount").value = (newprice * newqty) + " LKR" || 0.00;

    }

    document.getElementById("price").addEventListener('keyup', autoTotal);
    document.getElementById("qty").addEventListener('keyup', autoTotal);


    
    const form = document.getElementById("inventoryForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault(); // stop form default reload

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

        // Push new row into dataset
        let isOk = confirm("Are you Sure? ");


        if (isOk) {
            DataSet.push(newItem);
            localStorage.setItem("inventory", JSON.stringify(DataSet));

            location.reload();

        }

    });


    // only for testing
    let lastPage = "inventory";  // set inventory as the default
    pages.forEach(page => {
        page.style.display = (page.id === lastPage) ? "block" : "none";
    });
    menuItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-page") === lastPage);
    });
    //////////////////////////////////////////////////////tab switch managing


    mobileMenuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth < 992) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMobileMenuBtn = mobileMenuBtn.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnMobileMenuBtn) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Switch content
    menuItems.forEach(item => {
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

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show'); // reset state
        }
    });
});


/////extra

// function renderInventory() {
    //     // Clear only tbody rows, not the whole table
    //     tbody.innerHTML = "";

    //     for (let index = inventoryDataSet.length - 1; index >= 0; index--) {
    //         let row = `
    //                 <tr>
    //                 <td><span class="text-center">${inventoryDataSet[index].itemCode}</span></td>
    //                 <td>${inventoryDataSet[index].itemName}</td>
    //                 <td>${inventoryDataSet[index].category}</td>
    //                 <td>${inventoryDataSet[index].supplier}</td>
    //                 <td class="text-end">${inventoryDataSet[index].qty}</td>
    //                 <td class="text-end">${inventoryDataSet[index].reorderPoint}</td>
    //                 <td class="text-end">${(inventoryDataSet[index].discount * 100).toFixed(0)}%</td>
    //                 <td class="text-end">${inventoryDataSet[index].price}</td>
    //                 <td class="text-end">${(inventoryDataSet[index].price * inventoryDataSet[index].qty).toLocaleString()}</td>
    //                 <td class="text-center">
    //                     <span class="badge ${inventoryDataSet[index].qty > inventoryDataSet[index].reorderPoint
    //                 ? "text-bg-success"
    //                 : "text-bg-danger"}">
    //                     ${inventoryDataSet[index].qty > inventoryDataSet[index].reorderPoint
    //                 ? "In Stock"
    //                 : "Low Stock"}
    //                     </span>
    //                 </td>
    //                 <td class="text-center">
    //                     <div class="btn-group">
    //                     <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                         <i class="fa-solid fa-gear fa-lg"></i>
    //                     </button>
    //                     <ul class="dropdown-menu">
    //                         <li><a class="dropdown-item" href="#">Update</a></li>
    //                         <li><a class="dropdown-item" href="#">Delete</a></li>
    //                     </ul>
    //                     </div>
    //                 </td>
    //                 </tr>`;
    //         tbody.innerHTML += row;
    //     }
    // }
    // inside DOMContentLoaded