let inventoryItem = JSON.parse(localStorage.getItem("inventory")) || [];
const table = document.getElementById("inventoryTable");

renderInventory();

function renderInventory() {
    // Clear previous rows
    table.innerHTML = "";

    // Add table header row
    table.innerHTML += `
    <thead>
        <tr class="position-sticky top-0 bg-light">
          <th scope="col">Item Code</th>
          <th scope="col">Item Name</th>
          <th scope="col">Price</th>
          <th scope="col">Discount</th>
          <th scope="col">Added Time</th>
        </tr>
    </thead>
    <tbody id="tableBody"></tbody>
    `;

    const tbody = document.getElementById("tableBody");

    for (let index = inventoryItem.length - 1; index >= 0; index--) {
        let row = `
            <tr>
                <td>${inventoryItem[index].itemCode}</td>
                <td>${inventoryItem[index].itemName}</td>
                <td>${"LKR " + inventoryItem[index].price}</td>
                <td>${inventoryItem[index].discount}</td>
                <td>${inventoryItem[index].time || ""}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
}

document.getElementById("btn").addEventListener("click", function () {
    let inventoryData = JSON.parse(localStorage.getItem("inventory")) || [];

    let newitemCode = document.getElementById("itemCode").value;
    let newitemName = document.getElementById("itemName").value;
    let newPrice = document.getElementById("Price").value;
    let newDiscount = document.getElementById("Discount").value;

    let now = new Date();
    let formattedTime = now.toLocaleString();

    let newItem = {
        itemCode: newitemCode,
        itemName: newitemName,
        price: newPrice,
        discount: newDiscount,
        time: formattedTime
    };

    inventoryData.push(newItem);

    localStorage.setItem("inventory", JSON.stringify(inventoryData));

    location.reload();
});
