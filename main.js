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


                    <li><a href="#" class="dropdown-item  btn-update" prKey="${item.itemCode}" data-bs-toggle="modal" data-bs-target="#inventoryUpdateModal"><i class="bi bi-arrow-repeat"></i> Update</a></li>
                <li><a href="#" class="dropdown-item  btn-delete" prKey="${item.itemCode}" ><i class="bi bi-ban"></i> Delete</a></li>


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

    function addData(e) {

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

    }



    const form = document.getElementById("inventoryForm");

    form.addEventListener("submit", addData);


    // only for testing
    let lastPage = "inventory";  // set inventory as the default
    pages.forEach(page => {
        page.style.display = (page.id === lastPage) ? "block" : "none";
    });
    menuItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-page") === lastPage);
    });


    // update and deleting data

    let updateBtns = document.getElementsByClassName("btn-update");
    let deleteBtns = document.getElementsByClassName("btn-delete");

    for (let i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener("click", function () {
            let code = this.getAttribute("prKey");
            radyToUpdateItem(code);

        });
    }

    function radyToUpdateItem(itemCode) {
        const conferm = confirm("Do you want to update this data row ?");

        if (conferm === true) {
            let data = JSON.parse(localStorage.getItem("inventory")) || [];
            const item = data.find(item => item.itemCode === itemCode);
            const index = data.findIndex(item => item.itemCode === itemCode);

            console.log("Editing Item:", item);

            if (item) {
                // Fill form fields with existing values
                document.getElementById("itemCode").value = item.itemCode;
                document.getElementById("itemName").value = item.itemName;
                document.getElementById("category").value = item.category;
                document.getElementById("supplier").value = item.supplier;
                document.getElementById("qty").value = item.qty;
                document.getElementById("reorderPoint").value = item.reorderPoint;
                document.getElementById("price").value = item.price;
                document.getElementById("discount").value = item.discount * 100;
                document.getElementById("totalAmount").value = (item.qty * item.price) + " LKR"

                const updateForm = document.getElementById("inventoryUpdateForm");

                // Clear any old event listeners
                updateForm.onsubmit = function (e) {
                    e.preventDefault();

                    // Read updated values
                    data[index].itemName = document.getElementById("itemName").value.trim();
                    data[index].category = document.getElementById("category").value.trim();
                    data[index].supplier = document.getElementById("supplier").value.trim();
                    data[index].qty = parseInt(document.getElementById("qty").value) || 0;
                    data[index].reorderPoint = parseInt(document.getElementById("reorderPoint").value) || 0;
                    data[index].price = parseFloat(document.getElementById("price").value) || 0;
                    data[index].discount = (parseFloat(document.getElementById("discount").value) || 0) / 100;

                    // Save back to localStorage
                    localStorage.setItem("inventory", JSON.stringify(data));

                    alert("Item updated successfully ✅");

                    // Reload the table (or page)
                    location.reload();
                };
            }
        }
    }







    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", function () {
            let code = this.getAttribute("prKey");
            deleteItem(code);
        });
    }

    function deleteItem(itemCode) {

        const conferm = confirm("Do you want to delete this data row ?");

        if (conferm === true) {
            const confermText = prompt("Type 'Delete' word in this box !");

            if (confermText === "delete") {
                let data = JSON.parse(localStorage.getItem("inventory")) || [];
                data = data.filter(item => item.itemCode !== itemCode); // remove matching row
                localStorage.setItem("inventory", JSON.stringify(data));
                // renderTable(data); // refresh without reload
                location.reload();

            } else {
                alert("Data deleting processing is canceled")
            }

        } else {
            alert("Data deleting processing is canceled")
        }

    }

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