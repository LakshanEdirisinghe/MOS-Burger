// Layout elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const topbar = document.getElementById('topbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Sidebar/page navigation
const menuItems = document.querySelectorAll('.sidebar-item');
const pages = document.querySelectorAll('.page');

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
let lastPage = "home"; // default
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