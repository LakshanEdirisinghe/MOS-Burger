const sidebarBilling = document.getElementById('sidebarBilling');
const op = document.getElementById('open');
const cls = document.getElementById('cls');

function billSlideBar() {
    sidebarBilling.classList.toggle("show");
}

op.addEventListener("click", billSlideBar);
cls.addEventListener("click", billSlideBar);
document.getElementById("open-lg").addEventListener("click", billSlideBar);