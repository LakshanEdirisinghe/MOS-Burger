document.addEventListener('DOMContentLoaded', function () {

    // =====================================================
    // 1. VARIABLES & ELEMENT REFERENCES
    // =====================================================
    let dbConnectionCustomer = false;

    if (localStorage.getItem("customers") != null) {
        console.log("Customer db is connected");
        dbConnectionCustomer = true;
    } else {
        console.log("Customer db Connection Error");
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
    const table = document.getElementById("customerTable");
    const tableBody = document.getElementById("customerTableBody");
    const searchBoxDes = document.getElementById("customerSearchBox");
    const searchBoxMob = document.getElementById("customerSearchBox-m");

    // Dataset
    let customerDataSet = JSON.parse(localStorage.getItem("customers")) || [];

    // Forms
    const form = document.getElementById("customerForm");
    const updateForm = document.getElementById("customerUpdateForm");


    // =====================================================
    // 2. CORE FUNCTIONS
    // =====================================================

    // --- Render Table Rows ---
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="fw-bold text-center text-muted">
                        No Matching Customers!
                    </td>
                </tr>`;
            return;
        }

        for (let i = data.length - 1; i >= 0; i--) {
            const cust = data[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${cust.customerCode}</td>
                <td>${cust.customerName}</td>
                <td>${cust.customerEmail}</td>
                <td>${cust.customerPhone}</td>
                <td>${cust.customerAddress}</td>
                <td class="text-center">
                    <div class="btn-group dropstart">
                        <button class="btn btn-sm border-0 dropdown-toggle" 
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-gear fa-lg"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="#" class="dropdown-item text-primary btn-update" 
                                   prKey="${cust.customerCode}" 
                                   data-bs-toggle="modal" 
                                   data-bs-target="#customerUpdateModal">
                                   <i class="bi bi-arrow-repeat"></i> Update
                                </a>
                            </li>
                            <li>
                                <a href="#" class="dropdown-item text-danger btn-delete" 
                                   prKey="${cust.customerCode}">
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

        for (let i = 0; i < customerDataSet.length; i++) {
            const cust = customerDataSet[i];
            if (
                cust.customerName.toLowerCase().includes(query) ||
                cust.customerCode.toLowerCase().includes(query) ||
                cust.customerEmail.toLowerCase().includes(query)
            ) {
                filtered.push(cust);
            }
        }
        renderTable(filtered);
    }

    // --- Add new customer ---
    function addData(e) {
        e.preventDefault();

        let DataSet = JSON.parse(localStorage.getItem("customers")) || [];

        // Collect form values
        const newCode = document.getElementById("customerCode").value.trim();
        const newName = document.getElementById("customerName").value.trim();
        const newEmail = document.getElementById("customerEmail").value.trim();
        const newPhone = document.getElementById("customerPhone").value.trim();
        const newAddress = document.getElementById("customerAddress").value.trim();

        let newCustomer = {
            customerCode: newCode,
            customerName: newName,
            customerEmail: newEmail,
            customerPhone: newPhone,
            customerAddress: newAddress
        };

        if (confirm("Are you Sure?")) {
            DataSet.push(newCustomer);
            localStorage.setItem("customers", JSON.stringify(DataSet));
            location.reload();
        }
    }

    // --- Update customer ---
    function radyToUpdateItem(customerCode) {
        let isOk = confirm("Do you want to update this data row ?");
        if (isOk) {
            let data = JSON.parse(localStorage.getItem("customers")) || [];
            const cust = data.find(c => c.customerCode === customerCode);
            const index = data.findIndex(c => c.customerCode === customerCode);

            if (cust) {
                // Fill form fields
                document.getElementById("customerCode").value = cust.customerCode;
                document.getElementById("customerName").value = cust.customerName;
                document.getElementById("customerEmail").value = cust.customerEmail;
                document.getElementById("customerPhone").value = cust.customerPhone;
                document.getElementById("customerAddress").value = cust.customerAddress;

                updateForm.onsubmit = function (e) {
                    e.preventDefault();
                    const confermText = prompt("Type 'Update' word inside this box !");
                    if (confermText?.toLowerCase() === "update") {
                        data[index].customerName = document.getElementById("customerName").value.trim();
                        data[index].customerEmail = document.getElementById("customerEmail").value.trim();
                        data[index].customerPhone = document.getElementById("customerPhone").value.trim();
                        data[index].customerAddress = document.getElementById("customerAddress").value.trim();

                        localStorage.setItem("customers", JSON.stringify(data));
                        location.reload();
                    } else {
                        alert("Updating process is canceled");
                    }
                };
            }
        }
    }

    // --- Delete customer ---
    function deleteItem(customerCode) {
        if (!confirm("Do you want to delete this data row ?")) return;

        const confermText = prompt("Type 'Delete' word in this box !");
        if (confermText?.toLowerCase() === "delete") {
            let data = JSON.parse(localStorage.getItem("customers")) || [];
            data = data.filter(c => c.customerCode !== customerCode);
            localStorage.setItem("customers", JSON.stringify(data));
            location.reload();
        } else {
            alert("Data deleting process is canceled");
        }
    }


    // =====================================================
    // 3. EVENT BINDINGS
    // =====================================================

    // Initial render
    if (dbConnectionCustomer) renderTable(customerDataSet);

    // Form submit
    form.addEventListener("submit", addData);

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
    let lastPage = "customers"; // default
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
