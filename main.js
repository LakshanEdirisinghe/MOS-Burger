document.addEventListener('DOMContentLoaded', function () {

    let dbConnectonInventory; 

    if (localStorage.getItem("inventory")!=null) {
        console.log("Inventory db is connected");

        dbConnectonInventory=true;
        
        
    }else{
        console.log("Inventory db Connection Error");
    }
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const topbar = document.getElementById('topbar');
    // const toggleBtn = document.getElementById('toggleSidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page');

    const inventoryDataSet = JSON.parse(localStorage.getItem("inventory"));
    const table = document.getElementById("inventoryTable");
    let tbody = document.getElementById("tableBody");

    //table manupilation
    // renderInventory();
    if (dbConnectonInventory) {
        renderInventory();
    }


    


    function renderInventory() {
        // Clear only tbody rows, not the whole table
        tbody.innerHTML = "";

        for (let index = inventoryDataSet.length - 1; index >= 0; index--) {
            let row = `
                    <tr>
                    <td><span class="text-center">${inventoryDataSet[index].itemCode}</span></td>
                    <td>${inventoryDataSet[index].itemName}</td>
                    <td>${inventoryDataSet[index].category}</td>
                    <td>${inventoryDataSet[index].supplier}</td>
                    <td class="text-end">${inventoryDataSet[index].qty}</td>
                    <td class="text-end">${inventoryDataSet[index].reorderPoint}</td>
                    <td class="text-end">${(inventoryDataSet[index].discount * 100).toFixed(0)}%</td>
                    <td class="text-end">${inventoryDataSet[index].price}</td>
                    <td class="text-end">${(inventoryDataSet[index].price * inventoryDataSet[index].qty).toLocaleString()}</td>
                    <td class="text-center">
                        <span class="badge ${inventoryDataSet[index].qty > inventoryDataSet[index].reorderPoint
                                        ? "text-bg-success"
                                        : "text-bg-danger"}">
                        ${inventoryDataSet[index].qty > inventoryDataSet[index].reorderPoint
                                        ? "In Stock"
                                        : "Low Stock"}
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
            tbody.innerHTML += row;
        }
    }
    // inside DOMContentLoaded
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
        DataSet.push(newItem);
        localStorage.setItem("inventory", JSON.stringify(DataSet));

        // Re-render table
        renderInventory();

        // Reset form
        // form.reset();
        location.reload();
    });








    // only for testing
    let lastPage = "inventory";  // set inventory as the default
    pages.forEach(page => {
        page.style.display = (page.id === lastPage) ? "block" : "none";
    });
    menuItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-page") === lastPage);
    });
    //////////////////////////////////////////////////////


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